import { assert } from 'typia'

export type EnvVars = {
  NODE_ENV: 'production' | 'development'
  JWT_SECRET: string
}

// eslint-disable-next-line no-process-env
export const ENV_VARS = assert<EnvVars>(process.env)
