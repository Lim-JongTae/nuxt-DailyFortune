export default defineNuxtPlugin((nuxtApp) => {
  // 1. SSR 환경 대응: 서버 렌더링 시 'Failed to resolve directive: reveal' 경고 원천 차단
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', {
      getSSRProps() {
        return {}
      }
    })
    return
  }

  // 2. 클라이언트 환경 (IntersectionObserver 스크롤 리빌)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement
        if (e.isIntersecting) {
          el.classList.add('is-visible') // 아래로 스크롤해서 들어오면 나타남
        } else if (e.boundingClientRect.top > 0) {
          el.classList.remove('is-visible') // 위로 스크롤해서 아래로 빠지면 사라짐
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  )

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, { value }) {
      el.classList.add('reveal')
      if (value?.delay) el.style.transitionDelay = `${value.delay}ms`
      if (reduceMotion) {
        el.classList.add('is-visible')
        return
      }
      io.observe(el)
    },
    unmounted(el: HTMLElement) {
      io.unobserve(el)
    }
  })
})
