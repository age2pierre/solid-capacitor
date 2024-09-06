import { createAsync } from '@solidjs/router'
import { createSignal, type JSX } from 'solid-js'

import { NullableResult } from '#/components/NullableResult'

import { cachedGenerateRandomString } from './DemoDataLoadind.data'

export default function DemoDataLoading(): JSX.Element {
  const [keyLen, setKeyLen] = createSignal(8)

  const data = createAsync(
    async () => await cachedGenerateRandomString(keyLen()),
  )

  return (
    <>
      <label>Key length: </label>
      <input
        type="number"
        value={keyLen()}
        onInput={(e) => setKeyLen(Number(e.currentTarget.value))}
      />
      <label>Key: </label>
      <pre>{JSON.stringify(data())}</pre>
      <NullableResult
        result={data()}
        fallback={<p>'Loading...'</p>}
        err={(rslt) => <p class="text-red-500">{rslt}</p>}
        ok={(rslt) => <p class="text-green-500">{rslt}</p>}
      />
    </>
  )
}
