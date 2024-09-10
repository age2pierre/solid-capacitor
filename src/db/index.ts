import 'drizzle-kit'

import { resolve } from 'node:path'

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import config from './config'
import * as schema from './schema'

export { schema }

let _db: PostgresJsDatabase<typeof schema> | null = null
let _nativePgClient: postgres.Sql<never> | null = null

export async function initDb(
  optsPg?: string | postgres.Options<never>,
): Promise<PostgresJsDatabase<typeof schema>> {
  const migrationClient =
    optsPg == null
      ? postgres({ ...config.dbCredentials, max: 1 })
      : typeof optsPg === 'string'
        ? postgres(optsPg, { max: 1 })
        : postgres({ ...optsPg, max: 1 })
  const migFolder = resolve(__dirname, '../migrations')

  await migrate(drizzle(migrationClient, { schema }), {
    migrationsFolder: migFolder,
  })

  const nativePgClient =
    optsPg == null
      ? postgres<never>(config.dbCredentials)
      : typeof optsPg === 'string'
        ? postgres<never>(optsPg)
        : postgres<never>(optsPg)

  const db = drizzle(nativePgClient, { schema })

  _db = db
  _nativePgClient = nativePgClient

  return db
}

export async function closeDb(): Promise<void> {
  if (_nativePgClient == null) {
    throw new Error('Database not initialized. Call initDb first.')
  }
  await _nativePgClient.end()
  _nativePgClient = null
}

export type Db = Awaited<ReturnType<typeof initDb>>
export type DbTx = Parameters<Parameters<Db['transaction']>[0]>[0]

// Create a proxy that throws if db is not initialized
export const db = new Proxy<Db>(null as unknown as Db, {
  get(_target, prop: keyof Db): unknown {
    if (_db == null) {
      throw new Error('Database not initialized. Call initDb first.')
    }
    return _db[prop]
  },
})
