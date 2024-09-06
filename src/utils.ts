import { R, type Result } from '@mobily/ts-belt'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classLists: ClassValue[]): string {
  return twMerge(clsx(classLists))
}

export const exhaustiveCheck = (param: never): Result<never, string> => {
  return R.Error(`exahustive check, cause: ${JSON.stringify(param)}`)
}

/**
 * Same as Object.keys() but with better typing
 * */
export function keys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[]
}

type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]]
/**
 * Same as Object.entries() but with better typing
 * */
export function entries<T extends object>(obj: T): ObjectEntry<T>[] {
  return Object.entries(obj) as ObjectEntry<T>[]
}

/**
 * Same as Object.fromEntries() but with better typing
 * */
export function fromEntries<K extends string, T>(
  entries: Iterable<readonly [K, T]>,
): { [k in K]: T } {
  return Object.fromEntries(entries) as unknown as { [k in K]: T }
}

/**
 * Map an object by its entries (tuples key/value)
 * */
export function mapByEntries<T extends object, MappedK extends string, MappedV>(
  obj: T,
  mapper: (entry: ObjectEntry<T>) => [MappedK, MappedV],
): { [k in MappedK]: MappedV } {
  return fromEntries(entries(obj).map(mapper))
}

/**
 * Determines whether a given color is dark or light.
 * @param color The color in hex format.
 */
export function isColorDark(
  _color: string,
): Result<'light' | 'dark', 'invalid-format'> {
  if (!/#?\d{6}/.test(_color)) {
    return R.Error('invalid-format')
  }
  const hex = _color.startsWith('#') ? _color.substring(1, 7) : _color
  const r = parseInt(hex.substring(0, 2), 16) // hexToR
  const g = parseInt(hex.substring(2, 4), 16) // hexToG
  const b = parseInt(hex.substring(4, 6), 16) // hexToB
  // luminance https://www.w3.org/TR/AERT/#color-contrast
  const l = r * 0.299 + g * 0.587 + b * 0.114
  return R.Ok(l > 186 ? 'light' : 'dark')
}

/**
 * Returns a promise that resolves after `waitMs` milliseconds
 */
export async function wait(waitMs: number): Promise<void> {
  await new Promise<never>((resolve) => setTimeout(resolve, waitMs))
}
