import type { Config } from 'drizzle-kit'

import { type EnvVars } from '../envvar'

// Typia doesn't work with drizzle-kit
// eslint-disable-next-line no-process-env
const ENV_VARS: EnvVars = process.env as unknown as EnvVars

export default {
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  out: './migrations',
  dbCredentials: {
    database: ENV_VARS.DATABASE_NAME,
    password: ENV_VARS.DATABASE_PASSWORD,
    user: ENV_VARS.DATABASE_USER,
    host: ENV_VARS.DATABASE_HOST,
    port: Number(ENV_VARS.DATABASE_PORT),
  },
} satisfies Config
