import { resolve } from 'node:path'

// import devtools from 'solid-devtools/vite'
import UnpluginTypia from '@ryoppippi/unplugin-typia/vite'
import { telefunc } from 'telefunc/vite'
import { defineConfig, type UserConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig((_env) => ({
  plugins: [
    UnpluginTypia(),
    // @ts-expect-error: telefunc has no undefined type
    telefunc({
      disableNamingConvention: true,
      shield: { dev: true },
    }),
    // _env.isSsrBuild
    //   ? undefined
    //   : devtools({
    //       autoname: true,
    //     }),
    solidPlugin(),

    // https://github.com/brillout/vite-plugin-server-entry/issues/9
    {
      name: 'server:entry',
      config(_, env): Omit<UserConfig, 'plugins'> | undefined {
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
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}))
