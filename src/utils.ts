export const exhaustiveCheck = (_param: never): never => {
  throw new Error('exhaustive check')
}

/**
 * Same as Object.keys() but with better typing
 * */
export function keys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[]
}

/**
 * Not nullish typeguard
 * */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value != null
}

type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]]
/**
 * Same as Object.entries() but with better typing
 * */
export function entries<T extends object>(obj: T): ObjectEntry<T>[] {
  return Object.entries(obj) as ObjectEntry<T>[]
}

/**
 * Same as Array.includes() but with better typing
 * */
export function includes<T extends U, U>(coll: readonly T[], el: U): el is T {
  return coll.includes(el as T)
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
 * Creates an array with [0 .. arraySize - 1]
 * */
export function range(arraySize: number): number[] {
  return [...Array(arraySize).keys()]
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
 * zip([a,a,..,a],[b,b,..,b]) === [[a,b],[a,b],..,[a,b]]
 */
export function zip<T extends (readonly unknown[])[]>(
  ...args: T
): { [K in keyof T]: T[K] extends (infer V)[] ? V : never }[] {
  const minLength = Math.min(...args.map((arr) => arr.length))
  return range(minLength).map((i) => args.map((arr) => arr[i])) as any
}

/**
 * Determines whether a given color is dark or light.
 * @param color The color in hex format.
 */
export function isColorDark(color: string): 'light' | 'dark' {
  const _color = color.startsWith('#') ? color.substring(1, 7) : color
  const r = parseInt(_color.substring(0, 2), 16) // hexToR
  const g = parseInt(_color.substring(2, 4), 16) // hexToG
  const b = parseInt(_color.substring(4, 6), 16) // hexToB
  // luminance https://www.w3.org/TR/AERT/#color-contrast
  const l = r * 0.299 + g * 0.587 + b * 0.114
  return l > 186 ? 'light' : 'dark'
}

/**
 * chunk([a,b,c,d,e], 2) === [[a,b],[c,d],[e]]
 * */
export function chunk<T>(arr: Array<T>, size: number): Array<T[]> {
  if (!arr.length) {
    return []
  }
  return [...[arr.slice(0, size)], ...chunk(arr.slice(size), size)]
}

/**
 * Returns a floor (min) or ceiling (max) value if not in between
 * */
export function clamp(num: number, min: number, max: number): number {
  return num <= min ? min : num >= max ? max : num
}

/**
 * Returns a new function that, when called, delays invoking `func` until after
 * `wait` milliseconds have elapsed since the last time it was invoked.
 * The returned function accepts the same arguments as `func.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  waitMs: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
    }, waitMs)
  }
}

/**
 * Returns a new function that, when called, only invokes `func` at most once
 * per every `wait` milliseconds.
 * The returned function accepts the same arguments as `func.
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  waitMs: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return function (...args: Parameters<T>) {
    if (!timeout) {
      timeout = setTimeout(() => {
        func(...args)
        timeout = undefined
      }, waitMs)
    }
  }
}

/**
 * Returns a promise that resolves after `waitMs` milliseconds
 */
export async function wait(waitMs: number): Promise<void> {
  await new Promise<never>((resolve) => setTimeout(resolve, waitMs))
}
