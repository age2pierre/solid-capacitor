import { randomBytes } from 'node:crypto'

import { R, type Result } from '@mobily/ts-belt'

import { wait } from '#/utils'

const MAX_LEN = 2 ** 31 - 1

export async function generateRandomString(
  len: number,
): Promise<Result<string, 'invalid-length' | 'unexpected-error'>> {
  if (len < 1 || len > MAX_LEN) {
    return R.Error('invalid-length')
  }
  try {
    await wait(500)
    const key = randomBytes(len).toString('hex')
    return R.Ok(key)
  } catch (err) {
    console.error(err)
    return R.Error('unexpected-error')
  }
}
