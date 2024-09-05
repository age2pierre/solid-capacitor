import { default as express } from 'express'
import { default as serveHandler } from 'serve-handler'
import { telefunc } from 'telefunc'
import { createServer } from 'vite'

export const isProduction = process.env.NODE_ENV === 'production'
export const PORT = 3000

await startServer()

async function startServer(): Promise<void> {
  const app = express()

  app.use(express.text())

  // RPC middleware
  app.all('/_telefunc', async (req, res) => {
    const { body, statusCode, contentType } = await telefunc({
      url: req.originalUrl,
      method: req.method,
      body: req.body as string,
      context: {},
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
        root: `${import.meta.dirname}/..`,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.listen(PORT)
  console.log(`Server running at http://localhost:${PORT} 🚀`)
}
