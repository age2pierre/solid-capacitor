import { For, type JSX } from 'solid-js'

import { LazyImg } from '../components/LazyImg'

export default function DemoLazyImages(): JSX.Element {
  return (
    <>
      <For
        each={[...new Array<void>(1085)].map(
          (_, i) => `https://picsum.photos/id/${i}/300/200`,
        )}
      >
        {(item) => (
          <div class="w-full h-[200px]">
            <LazyImg
              rootMargin="400px"
              src={item}
              alt="picsum dolor sit amet"
              class="mx-auto h-full max-w-[300px] text-center"
            />
          </div>
        )}
      </For>
    </>
  )
}
