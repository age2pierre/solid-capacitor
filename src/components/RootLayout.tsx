import { A } from '@solidjs/router'
import { For, type JSX, type ParentProps } from 'solid-js'

import { ROUTES } from '../router'

export function RootLayout(props: ParentProps): JSX.Element {
  return (
    <>
      <nav class="bg-gray-800 p-4">
        <div class="container mx-auto flex justify-between items-center">
          <div class="text-white font-bold text-xl">My Website</div>
          <ul class="flex space-x-4">
            <For each={ROUTES}>
              {(item) => (
                <li>
                  <A
                    href={item.path}
                    class="text-gray-300 hover:text-white transition duration-150"
                    activeClass="text-white underline"
                  >
                    {item.info.title}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </div>
      </nav>
      {props.children}
    </>
  )
}
