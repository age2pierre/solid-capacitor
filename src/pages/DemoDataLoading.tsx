import { pipe, R } from '@mobily/ts-belt'
import { createAsync } from '@solidjs/router'
import { type JSX, Show } from 'solid-js'

import { cachedReadLockFile } from './DemoDataLoadind.data'

export default function DemoDataLoading(): JSX.Element {
  const data = createAsync(async () => await cachedReadLockFile())

  return (
    <>
      <pre>
        <Show when={data()} fallback={<p>Loading...</p>}>
          {(result) =>
            pipe(
              result(),
              // @ts-expect-error: JSX.Element is always a union of nullable and non-nullable
              R.map((val): Node => <pre>{val}</pre>),
              R.handleError(
                // @ts-expect-error: JSX.Element is always a union of nullable and non-nullable
                (err): Node => <p>{err}</p>,
              ),
              R.toNullable,
            )
          }
        </Show>
      </pre>
    </>
  )
}
