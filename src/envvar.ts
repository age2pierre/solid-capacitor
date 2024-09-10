import { assert, type tags } from 'typia'

export type EnvVars = {
  NODE_ENV: 'production' | 'development'
  JWT_SECRET: string

  DATABASE_NAME: string
  DATABASE_USER: string
  DATABASE_PASSWORD: string
  DATABASE_HOST: string
  DATABASE_PORT: string & tags.Pattern<'^[0-9]{1,5}$'>
}

// eslint-disable-next-line no-process-env
export const ENV_VARS = assert<EnvVars>(process.env)
