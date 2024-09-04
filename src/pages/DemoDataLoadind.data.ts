import { cache } from '@solidjs/router'
import { readLockFile } from './getFakeData.telefunc'

export const cachedReadLockFile = cache(async () => {
  const { fileStr } = await readLockFile()
  return fileStr
}, 'readLockFile')
