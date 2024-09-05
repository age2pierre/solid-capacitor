## Bug Report - Production Build Fails to Import Module - ESM/CJS conflict

### Steps to Reproduce:

1. Install dependencies:
   ```bash
   nvm use
   npm install -g pnpm
   pnpm install
   ```
2. Start the server in development mode:
   ```bash
   pnpm run dev
   ```
3. Visit [http://localhost:3000/](http://localhost:3000/) and click the "Generate" button. The request succeeds with a 200 status.

4. Now build and start the server in production mode:
   ```bash
   pnpm run clean
   pnpm run build
   pnpm run serve
   ```
5. Visit [http://localhost:3000/](http://localhost:3000/) again and click the "Generate" button. This time the request fails with a 500 error.

### Error:

The production server throws the following error:

```
file://<ROOT>/dist/server/assets/crypto.telefunc-CQMnarz-.js:3
import { R } from '@mobily/ts-belt';
         ^
SyntaxError: Named export 'R' not found. The requested module '@mobily/ts-belt' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@mobily/ts-belt';
const { R } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:134:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:217:5)
    at async ModuleLoader.import (node:internal/modules/esm/loader:323:24)
    at async <ROOT>/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/vite/loadTelefuncFilesWithVite.js:66:82
    at async Promise.all (index 0)
    at async loadGlobFiles (<ROOT>/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/vite/loadTelefuncFilesWithVite.js:60:52)
    at async loadTelefuncFilesWithVite (<ROOT>/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/vite/loadTelefuncFilesWithVite.js:14:55)
    at async loadTelefuncFiles (<ROOT>/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/server/runTelefunc/loadTelefuncFiles.js:34:73)
    at async runTelefunc_ (<ROOT>/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/server/runTelefunc.js:83:59)
    at async runTelefunc (<ROOT>/node_modules/.pnpm/telefunc@0.1.78_@babel+core@7.24.5_@babel+parser@7.24.5_@babel+types@7.24.5/node_modules/telefunc/dist/cjs/node/server/runTelefunc.js:38:16)
```

### Additional Notes:

The issue might stem from the `ts-belt` package.json (https://publint.dev/@mobily/ts-belt@3.13.1), but since this works fine in dev mode (using `tsx` which in turns uses esbuild), and with Vite also using esbuild, there might be a configuration adjustment possible in Vite/Telefunc to resolve this issue.

Could you assist in configuring Vite/Telefunc to handle this module issue and/or confirm/infirm it's a bug in telefunc ?
If it is out of scope for this project, I understand and don't want to abuse your time.
