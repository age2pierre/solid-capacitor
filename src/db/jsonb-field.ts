import type { ColumnBaseConfig } from 'drizzle-orm'
import { SQL, StringChunk } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'

type NestedKeyOf<ObjectType> = {
  [Key in keyof ObjectType &
    (number | string)]: ObjectType[Key] extends (infer ArrayType)[]
    ?
        | `${Key}.${number}`
        | `${Key}`
        | (ArrayType extends object
            ? `${Key}.${number}.${NestedKeyOf<ArrayType>}`
            : never)
    : ObjectType[Key] extends object
      ? `${Key}.${NestedKeyOf<ObjectType[Key]>}` | `${Key}`
      : `${Key}`
}[keyof ObjectType & (number | string)]

type AtPath<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends NestedKeyOf<T[Key]>
      ? AtPath<T[Key], Rest>
      : never
    : Key extends `${number}`
      ? T extends (infer ArrayType)[]
        ? ArrayType extends object
          ? AtPath<ArrayType, Rest>
          : never
        : never
      : never
  : Path extends keyof T
    ? T[Path]
    : never

// https://github.com/drizzle-team/drizzle-orm/issues/1511#issuecomment-1850017315
export function jsonbField<
  T extends PgColumn<ColumnBaseConfig<'json', 'PgJsonb'>>,
  P extends NestedKeyOf<T['_']['data']>,
>(column: T, path: P): SQL<AtPath<T['_']['data'], P>> {
  const pathParts = path.split('.')
  let concatenatedSql = ''

  pathParts.forEach((part, index) => {
    if (index === pathParts.length - 1) {
      concatenatedSql += ` -> '${part}'`
      return
    }
    concatenatedSql += `-> '${part}'`
  })

  return new SQL<AtPath<T['_']['data'], P>>([
    column,
    new StringChunk(concatenatedSql),
  ])
}
