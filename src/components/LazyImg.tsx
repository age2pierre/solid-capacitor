import { createEffect } from 'solid-js'

export function LazyImg(props: {
  src: string
  alt: string
  class?: string
  rootMargin?: string
}) {
  let imgRef: HTMLImageElement | undefined

  createEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.getAttribute('data-src') ?? ''
            img.removeAttribute('data-src')
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

    return () => {
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
