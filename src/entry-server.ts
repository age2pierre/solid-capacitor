import { default as express } from 'express'
import { default as jwt } from 'jsonwebtoken'
import { default as serveHandler } from 'serve-handler'
import { type Telefunc, telefunc } from 'telefunc'
import { createServer } from 'vite'

export const isProduction = process.env.NODE_ENV === 'production'
export const PORT = 3000
export const JWT_SECRET = process.env.JWT_SECRET ?? 'JWT_SECRET'

await startServer()

export type TokenPayload = {
  user_id: string
  display_name: string
}

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object' &&
    payload != null &&
    'user_id' in payload &&
    typeof payload.user_id === 'string' &&
    'display_name' in payload &&
    typeof payload.display_name === 'string'
  )
}

async function startServer(): Promise<void> {
  const app = express()

  app.use(express.text())

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
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
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
      JWT_SECRET,
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
        public: `${import.meta.dirname}/../dist/client/`,
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
        root: `${import.meta.dirname}/..`,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.listen(PORT)
  console.log(`Server running at http://localhost:${PORT} 🚀`)
}
