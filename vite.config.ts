import devtools from 'solid-devtools/vite'
import { telefunc } from 'telefunc/vite'
import { defineConfig, type UserConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig((_env) => ({
  plugins: [
    // @ts-expect-error: telefunc has no undefined type
    telefunc({
      disableNamingConvention: true,
      shield: { dev: true },
    }),
    devtools({
      autoname: true,
    }),
    solidPlugin(),
    {
      name: 'server:entry',
      config(_, env): UserConfig | undefined {
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
  appType: 'spa',
  server: { port: 3000, host: true },
  preview: { port: 3000 },
}))
