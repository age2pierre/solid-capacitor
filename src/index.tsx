/* @refresh reload */
import { render } from 'solid-js/web'

import { createSignal, type JSX } from 'solid-js'

import { R } from '@mobily/ts-belt'

import { generateRandomString } from './crypto.telefunc'

export default function App(): JSX.Element {
  const [str, setStr] = createSignal('empty')

  return (
    <>
      <h1>Hello world !</h1>
      <p>{str()}</p>
      <button
        onClick={async () =>
          setStr(
            await generateRandomString(12).then(
              (val) => R.toNullable(val) ?? 'error',
            ),
          )
        }
      >
        Generate
      </button>
    </>
  )
}

render(() => <App />, document.getElementById('root') ?? document.body)
