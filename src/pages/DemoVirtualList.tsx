import { type JSX } from 'solid-js'

import { VirtualList } from '../components/VirtualList'

export default function DemoVirtualList(): JSX.Element {
  return (
    <VirtualList
      dataStream={[...new Array<void>(1085)].map(
        (_, i) => `https://picsum.photos/id/${i}/300/200`,
      )}
      overscan={5}
      estimateSize={200}
    >
      {(item) => (
        <div class="w-full h-[200px]">
          <img
            src={item}
            alt="picsum dolor sit amet"
            class="mx-auto h-full max-w-[300px] text-center"
          />
        </div>
      )}
    </VirtualList>
  )
}
