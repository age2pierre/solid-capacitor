import { LazyImg } from '../components/LazyImg'

export default function DemoLazyImages() {
  return (
    <>
      {[...new Array<void>(1085)]
        .map((_, i) => `https://picsum.photos/id/${i}/300/200`)
        .map((item) => (
          <div class="w-full h-[200px]">
            <LazyImg
              src={item}
              alt="picsum dolor sit amet"
              class="mx-auto h-full max-w-[300px] text-center"
            />
          </div>
        ))}
    </>
  )
}
