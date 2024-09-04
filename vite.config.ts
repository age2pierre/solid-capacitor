import devtools from 'solid-devtools/vite'
import { telefunc } from 'telefunc/vite'
import { defineConfig } from 'vite'
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
    // adding this produce indeed a ./dist/server/entry-server.js than can be run with node
    // but import of ts-belt fails in telefunc big of some ESM / CJS non sense
    // https://github.com/brillout/vite-plugin-server-entry/issues/9
    // {
    //   name: 'server:entry',
    //   config(_, env): UserConfig | undefined {
    //     if (!env.isSsrBuild) return
    //     return {
    //       build: {
    //         rollupOptions: {
    //           input: {
    //             'entry-server': './src/entry-server.ts',
    //           },
    //         },
    //       },
    //     }
    //   },
    // },
    //
    // file:///home/age2pierre/pocs/solid-capacitor/dist/server/assets/getFakeData.telefunc-BE5tLiDE.js:3
    // import { R } from "@mobily/ts-belt";
    //          ^
    // SyntaxError: Named export 'R' not found. The requested module '@mobily/ts-belt' is a CommonJS module, which may not support all module.exports as named exports.
    // CommonJS modules can always be imported via the default export, for example using:
    // import pkg from '@mobily/ts-belt';
    // const { R } = pkg;
    //     at ModuleJob._instantiate (node:internal/modules/esm/module_job:134:21)
    //     at async ModuleJob.run (node:internal/modules/esm/module_job:217:5)
    //     at async ModuleLoader.import (node:internal/modules/esm/loader:323:24)
    //     at async /home/age2pierre/pocs/solid-capacitor/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/vite/loadTelefuncFilesWithVite.js:66:82
    //     at async Promise.all (index 0)
    //     at async loadGlobFiles (/home/age2pierre/pocs/solid-capacitor/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/vite/loadTelefuncFilesWithVite.js:60:52)
    //     at async loadTelefuncFilesWithVite (/home/age2pierre/pocs/solid-capacitor/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/vite/loadTelefuncFilesWithVite.js:14:55)
    //     at async loadTelefuncFiles (/home/age2pierre/pocs/solid-capacitor/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/server/runTelefunc/loadTelefuncFiles.js:34:73)
    //     at async runTelefunc_ (/home/age2pierre/pocs/solid-capacitor/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/server/runTelefunc.js:83:59)
    //     at async runTelefunc (/home/age2pierre/pocs/solid-capacitor/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/server/runTelefunc.js:38:16)
    inspect(),
  ],
  build: {
    target: 'esnext',
  },
  appType: 'spa',
  server: { port: 3000, host: true },
  preview: { port: 3000 },
}))
