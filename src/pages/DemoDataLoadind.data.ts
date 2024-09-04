import { cache } from '@solidjs/router'

import { readLockFile } from './getFakeData.telefunc'

export const cachedReadLockFile = cache(readLockFile, 'readLockFile')
