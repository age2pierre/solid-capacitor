import { readFile } from 'node:fs/promises'

import { R, type Result } from '@mobily/ts-belt'
import { getContext } from 'telefunc'

export function hello({ name }: { name: string }): { message: string } {
  const { user } = getContext()
  const message = 'awesome ' + (user?.display_name ?? name)
  return { message }
}

export async function readLockFile(): Promise<Result<string, string>> {
  // return R.Error('Not implemented')
  return await R.fromPromise(
    readFile(`${import.meta.dirname}/../../pnpm-lock.yaml`, 'utf8'),
  ).then(R.mapError((err) => err.message))
}
