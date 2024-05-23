import type { Component } from "solid-js";
import { DynVirtualList } from "./dyn-virtual-list";
import { LazyImg } from "./lazy-img";

const App: Component = () => {
  return (
    <>
      <p class="text-4xl text-green-700 text-center py-20">
        Hello tailwindcss!
      </p>
      <DynVirtualList
        class="mx-auto"
        dataStream={[...new Array(1085)].map(
          (_, i) => `https://picsum.photos/id/${i}/300/200`
        )}
        overscan={5}
        estimateSize={200}
      >
        {(item) => (
          <div class="w-full h-[200px]">
            <LazyImg src={item} alt="picsum dolor sit amet" class="mx-auto h-full max-w-[300px] text-center" />
          </div>
        )}
      </DynVirtualList>
    </>
  );
};

export default App;
