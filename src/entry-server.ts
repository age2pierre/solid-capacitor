import { type Server } from 'node:http'

import { R } from '@mobily/ts-belt'
import { default as cors } from 'cors'
import { eq } from 'drizzle-orm'
import { default as express } from 'express'
import multer, { diskStorage } from 'multer'
import { default as serveHandler } from 'serve-handler'
import { type Telefunc, telefunc } from 'telefunc'
import { createServer } from 'vite'

import { closeDb, db, initDb, schema } from '#/db'
import { ENV_VARS } from '#/envvar'

import { restoreMediaFileByOid, storeMediaFile } from './db/large-object'
import { decodeJwtToken } from './jwt-token'

export const isProduction = ENV_VARS.NODE_ENV === 'production'
export const PORT = 3000

const _server = await startServer()

process.on('SIGINT', async () => {
  try {
    console.log('Received SIGINT, shutting down...')
    await new Promise((resolve) => _server.close(resolve))
    await closeDb()
    console.log('Server closed')
    process.exit(0)
  } catch {
    console.error('Failed to close server, exiting with code 1')
    process.exit(1)
  }
})

async function startServer(): Promise<Server> {
  const app = express()

  await initDb()

  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://localhost'],
      credentials: true,
    }),
  )
  app.use(express.text())

  // healthcheck handler
  app.get('/health', (_, res, next) => {
    try {
      const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      } as const
      res.send(healthcheck)
    } catch (error) {
      res.status(503).send({
        message: 'NOK',
        error: String(error),
      })
    } finally {
      next()
    }
  })

  // RPC middleware
  app.all('/_telefunc', async (req, res) => {
    // decode JWT token if present in authorization header
    const user = await decodeJwtToken(req)

    const context: Telefunc.Context = {
      JWT_SECRET: ENV_VARS.JWT_SECRET,
      user,
    }

    const { body, statusCode, contentType } = await telefunc({
      url: req.originalUrl,
      method: req.method,
      body: req.body as string,
      context,
    })
    res.status(statusCode).type(contentType).send(body)
  })

  // serve large object
  app.get('/mediafile/:oid', async (req, res) => {
    const { oid } = req.params
    const metadata = await db.query.mediaFile.findFirst({
      where: eq(schema.mediaFile.id, oid),
    })
    if (!metadata) {
      return res.status(404).send('Unable to find mediafile with oid ' + oid)
    }
    res.setHeader(
      'content-type',
      metadata.mimeType ? metadata.mimeType : 'application/octet-stream',
    )
    res.setHeader('content-length', metadata.size_bytes)

    const result = await restoreMediaFileByOid(metadata.largeObjectId, res)

    R.match(
      result,
      () => {
        res.status(200).send()
      },
      (error) => {
        res.status(500).send(error)
      },
    )
  })

  // diskStorage here does nothing, we manually stream the file
  const upload = multer({ storage: diskStorage({}) })
  // upload large object
  app.post('/mediafile', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded')
    }

    // Pipe the file stream directly to the file system
    const mediaFileResult = await storeMediaFile({
      src: { stream: req.file.stream, originalfilename: req.file.originalname },
    })

    R.match(
      mediaFileResult,
      (media) => {
        res.status(200).json(media)
      },
      (error) => {
        res.status(500).send(error)
      },
    )
    return
  })

  if (isProduction) {
    // serve static file in prod
    console.log('Serving static files in production mode...')
    app.use(async (req, res) =>
      serveHandler(req, res, {
        public: `${import.meta.dirname}/../client/`,
        rewrites: [
          {
            source: '/{!(assets)/**/*,*}',
            destination: `/index.html`,
          },
        ],
      }),
    )
  } else {
    // use vite for HRM
    console.log('Using vite for HMR in development mode...')
    console.log(
      'Inspect vite transforms at http://localhost:3000/__inspect/#/...',
    )
    const viteDevMiddleware = (
      await createServer({
        root: `${import.meta.dirname}/../../`,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  const server = app.listen(PORT)
  console.log(`Server running at http://localhost:${PORT} 🚀`)

  return server
}
