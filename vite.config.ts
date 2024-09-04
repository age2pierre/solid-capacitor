import { defineConfig } from 'vite'
import { telefunc } from 'telefunc/vite'
import solidPlugin from 'vite-plugin-solid'
import inspect from 'vite-plugin-inspect'

export default defineConfig((env) => ({
  plugins: [
    // @ts-expect-error
    telefunc({
      disableNamingConvention: true,
      shield: { dev: true },
    }),
    solidPlugin(),
    {
      name: 'server:entry',
      config(_, env) {
        if (!env.isSsrBuild) return
        return {
          build: {
            rollupOptions: {
              input: {
                'entry-server': './src/entry-server.ts',
              },
            },
          },
        }
      },
    },
    inspect(),
  ],
  build: {
    target: 'esnext',
  },
  appType: 'mpa',
  server: { port: 3000, host: true },
  preview: { port: 3000 },
}))
