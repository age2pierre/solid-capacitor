import { createEffect, type JSX } from 'solid-js'

export function LazyImg(props: {
  src: string
  alt: string
  class?: string
  rootMargin?: string
}): JSX.Element {
  let imgRef: HTMLImageElement | undefined

  // Run side effects whenever a reactive state changes or after rendering.
  createEffect(() => {
    // Create a new IntersectionObserver to observe when the image enters the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the image is intersecting (i.e., visible in the viewport)
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            // Set the `src` attribute to the actual image source from `data-src`
            img.src = img.getAttribute('data-src') ?? ''
            // Remove the `data-src` attribute after setting the `src`
            img.removeAttribute('data-src')
            // Stop observing this image since it has now loaded
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: props.rootMargin ?? '0px',
      },
    )

    if (imgRef) {
      observer.observe(imgRef)
    }

    // Cleanup function to unobserve the image when the component is destroyed.
    return (): void => {
      if (imgRef) {
        observer.unobserve(imgRef)
      }
    }
  })

  return (
    <img
      ref={imgRef}
      class={'aspect-auto block bg-slate-400 ' + (props.class ?? '')}
      data-src={props.src}
      alt={props.alt}
    />
  )
}
