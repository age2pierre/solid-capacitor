// conflict with fetch ReadableStream returned type and Readable.fromWeb input type without this directive
/// <reference no-default-lib="true"/>
import { R, type Result } from '@mobily/ts-belt'
import { type ExtractTablesWithRelations } from 'drizzle-orm'
import type { PostgresJsSession } from 'drizzle-orm/postgres-js'
import { type Sql, type TransactionSql } from 'postgres'
import { LargeObjectManager } from 'postgres-large-object'
import sharp from 'sharp'
import { Readable } from 'stream'

import { db, type DbTx } from './index'
import * as schema from './schema'

const IMAGE_MIME_TYPES = [
  'image/webp',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/bmp',
]

const BUFFER_SIZE = 16384
const FETCH_TIMEOUT = 3000

type PgDrizzleSession = PostgresJsSession<
  TransactionSql<never>,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

type MediaFileInput = {
  src: { uri: string } | { stream: Readable; originalfilename: string }
  title?: schema.TranslatableText | null
  credits?: string | null
  license?: string | null
  mimeType?: string | null
  convertToWebp?: boolean
}

type InsertedMediaFile = {
  id: string
  largeObjectId: number
  title: schema.TranslatableText | null
  credits: string | null
  license: string | null
  mimeType: string | null
  srcUri: string | null
  size_bytes: number
  createdAt: Date
  updatedAt: Date | null
}

export class MediaFileError extends Error {}

async function fetchImageStream(uri: string): Promise<Readable> {
  const response = await Promise.race([
    fetch(uri),
    new Promise<never>((_resolve, reject) =>
      setTimeout(() => {
        reject(
          new MediaFileError(
            `Timeout ${FETCH_TIMEOUT}ms, unable to fetch image from ${uri}`,
          ),
        )
      }, FETCH_TIMEOUT),
    ),
  ])

  if (!response.body) {
    throw new MediaFileError(`Unable to fetch image from ${uri}`)
  }

  return Readable.fromWeb(response.body)
}

async function storeMediaFileInDatabase(
  input: MediaFileInput,
  tx: DbTx,
): Promise<InsertedMediaFile> {
  const fileStream =
    'uri' in input.src
      ? await fetchImageStream(input.src.uri)
      : input.src.stream
  const convertToWebp = determineConvertToWebp(input)
  const mimeType = input.mimeType ?? undefined
  const srcUri = 'uri' in input.src ? input.src.uri : undefined

  const lom = new LargeObjectManager((tx._.session as PgDrizzleSession).client)
  let size_bytes = 0
  const [largeObjectId, stream] =
    await lom.createAndWritableStreamAsync(BUFFER_SIZE)

  if (convertToWebp) {
    const pipeline = sharp()
      .webp({ quality: 75 })
      .on('info', ({ size }) => {
        if (typeof size === 'number') {
          size_bytes = size
        }
      })
      .on('error', () => {
        throw new MediaFileError('Unable to convert image')
      })
    fileStream.pipe(pipeline).pipe(stream)
  } else {
    fileStream.on('data', (chunk: Buffer) => {
      size_bytes += chunk.length
    })
    fileStream.pipe(stream)
  }

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })

  const [result] = await tx
    .insert(schema.mediaFile)
    .values({
      srcUri,
      mimeType: convertToWebp ? 'image/webp' : mimeType,
      largeObjectId,
      size_bytes,
    })
    .onConflictDoUpdate({
      set: convertToWebp
        ? { mimeType: 'image/webp', largeObjectId, size_bytes }
        : { largeObjectId, size_bytes },
      target: [schema.mediaFile.srcUri],
    })
    .returning()

  return result
}

function determineConvertToWebp(input: MediaFileInput): boolean {
  if (input.convertToWebp != null) {
    return input.convertToWebp
  }

  if (
    typeof input.mimeType === 'string' &&
    IMAGE_MIME_TYPES.includes(input.mimeType)
  ) {
    return true
  }

  if (
    'uri' in input.src &&
    /\.(jpg|jpeg|png|webp|gif|bmp)$/i.exec(input.src.uri) != null
  ) {
    return true
  }

  if (
    'stream' in input.src &&
    /\.(jpg|jpeg|png|webp|gif|bmp)$/i.exec(input.src.originalfilename) != null
  ) {
    return true
  }

  return false
}

export async function storeMediaFile(
  input: MediaFileInput,
  dbTx?: DbTx,
): Promise<Result<InsertedMediaFile, Error>> {
  try {
    const result = dbTx
      ? await storeMediaFileInDatabase(input, dbTx)
      : await db.transaction(async (tx) => storeMediaFileInDatabase(input, tx))

    return R.Ok(result)
  } catch (err) {
    const error =
      err instanceof Error ? err : new MediaFileError(JSON.stringify(err))
    console.error(`>>> Unable store media file: ${error.message}`)
    dbTx?.rollback()
    return R.Error(error)
  }
}

export async function deleteLargeObject(
  oid: number,
): Promise<Result<true, Error>> {
  try {
    await (
      db._.session as PostgresJsSession<
        Sql<never>,
        typeof schema,
        ExtractTablesWithRelations<typeof schema>
      >
    ).client.begin(async (tx) => {
      const lom = new LargeObjectManager(tx)
      await lom.unlinkAsync(oid)
    })
    return R.Ok(true)
  } catch (err) {
    const error =
      err instanceof Error ? err : new MediaFileError(JSON.stringify(err))
    console.error(`>>> Unable delete media file: ${error.message}`)
    return R.Error(error)
  }
}

export async function restoreMediaFileByOid(
  oid: number,
  outStream: NodeJS.WritableStream,
): Promise<Result<{ size: number }, Error>> {
  try {
    const size = await (
      db._.session as PostgresJsSession<
        Sql<never>,
        typeof schema,
        ExtractTablesWithRelations<typeof schema>
      >
    ).client.begin(async (tx) => {
      const lom = new LargeObjectManager(tx)
      const [_size, stream] = await lom.openAndReadableStreamAsync(
        oid,
        BUFFER_SIZE,
      )

      stream.pipe(outStream)

      const _ret = await new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
      })
      return _size
    })
    return R.Ok({ size })
  } catch (err) {
    const error =
      err instanceof Error ? err : new MediaFileError(JSON.stringify(err))
    console.error(`>>> Unable to stream large object with oid ${oid}`)
    return R.Error(error)
  }
}
