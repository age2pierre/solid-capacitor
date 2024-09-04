import 'telefunc'

import { type TokenPayload } from './entry-server'

declare module 'telefunc' {
  namespace Telefunc {
    interface Context {
      // if null user not authenticated
      user: null | TokenPayload
      JWT_SECRET: string
    }
  }
}
