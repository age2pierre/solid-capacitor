import { getContext } from 'telefunc'
import { readFile } from 'node:fs/promises'

export async function hello({ name }: { name: string }) {
  const { user } = getContext()
  const message = 'awesome ' + (user?.display_name ?? name)
  return { message }
}

export async function readLockFile() {
  const fileStr = await readFile(`${import.meta.dirname}/../../pnpm-lock.yaml`, 'utf8')
  return { fileStr }
}
