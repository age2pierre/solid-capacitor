import { R, type Result } from '@mobily/ts-belt'
import { type JSX } from 'solid-js'

export function NullableResult<A, B>(props: {
  result: Result<A, B> | undefined
  fallback?: JSX.Element
  ok: (a: A) => JSX.Element
  err: (b: B) => JSX.Element
}): JSX.Element {
  return (
    <>
      {!props.result
        ? props.fallback
        : R.isOk(props.result)
          ? props.ok(props.result._0)
          : props.err(props.result._0)}
    </>
  )
}
