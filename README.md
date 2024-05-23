## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

```bash
pnpm install
```

## Available Scripts

In the project directory, you can run:

### Development

```bash
pnpm run dev
```

Runs the app in the development mode.<br>
Open [http://localhost:5174](http://localhost:5174) to view it in the browser.

The page will reload if you make edits.<br>

### Production build

```bash
pnpm run build
```

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

To open android studio :

```bash
CAPACITOR_ANDROID_STUDIO_PATH=$(which android-studio) pnpm run android
```
