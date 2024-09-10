import { type Express } from 'express'
import { default as jwt } from 'jsonwebtoken'
import { createIs } from 'typia'

import { ENV_VARS } from './envvar'

export type JwtPayload = {
  user_id: string
  display_name: string
}
const isJwtPayload = createIs<JwtPayload>()

export async function decodeJwtToken(
  req: Express['request'],
): Promise<JwtPayload | null> {
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = await new Promise<string | jwt.JwtPayload | undefined>(
    (resolve) => {
      if (!token) {
        resolve(undefined)
        return
      }
      jwt.verify(token, ENV_VARS.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.warn('authenticateToken: token unauthenticated %j', err)
          resolve(undefined)
          return
        }
        resolve(decoded)
      })
    },
  )

  const user = decoded && isJwtPayload(decoded) ? decoded : null
  return user
}
