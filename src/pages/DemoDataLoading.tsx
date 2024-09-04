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
              R.map((val) => (<pre>{val}</pre>) as NonNullable<JSX.Element>),
              R.handleError(
                (err) => (<p>{err}</p>) as NonNullable<JSX.Element>,
              ),
              R.toNullable,
            )
          }
        </Show>
      </pre>
    </>
  )
}
