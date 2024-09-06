import { cache } from '@solidjs/router'

import { generateRandomString } from './crypto.telefunc'

export const cachedGenerateRandomString = cache(
  generateRandomString,
  'generateRandomString',
)
