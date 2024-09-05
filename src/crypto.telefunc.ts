import { randomBytes } from 'node:crypto'

import { R, type Result } from '@mobily/ts-belt'

export async function generateRandomString(
  length: number,
): Promise<Result<string, string>> {
  if (length < 1 && !Number.isInteger(length)) {
    return R.Error('invalid length')
  }
  const str = randomBytes(length).toString('hex')
  return R.Ok(str)
}
