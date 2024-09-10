import { default as cors } from 'cors'
import { default as express } from 'express'
import { default as jwt } from 'jsonwebtoken'
import { default as serveHandler } from 'serve-handler'
import { type Telefunc, telefunc } from 'telefunc'
import { createIs } from 'typia'
import { createServer } from 'vite'

import { ENV_VARS } from '#/envvar'

export const isProduction = ENV_VARS.NODE_ENV === 'production'
export const PORT = 3000

await startServer()

export type TokenPayload = {
  user_id: string
  display_name: string
}

const isTokenPayload = createIs<TokenPayload>()

async function startServer(): Promise<void> {
  const app = express()

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
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = await new Promise<string | jwt.JwtPayload | undefined>(
      (resolve) => {
        if (!token) {
          resolve(undefined)
          return
        }
        jwt.verify(token, ENV_VARS.JWT_SECRET, (err, decoded) => {
          if (err) {
            console.warn('authenticateToken: token unauthenticated %j', err)
            resolve(undefined)
            return
          }
          resolve(decoded)
        })
      },
    )

    const user = decoded && isTokenPayload(decoded) ? decoded : null

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

  app.listen(PORT)
  console.log(`Server running at http://localhost:${PORT} 🚀`)
}
