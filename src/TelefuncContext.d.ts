import 'telefunc'

import { type TokenPayload } from './entry-server'

declare module 'telefunc' {
  namespace Telefunc {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Context {
      // if null user not authenticated
      user: null | TokenPayload
      JWT_SECRET: string
    }
  }
}
