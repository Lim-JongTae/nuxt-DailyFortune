<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  adFormat: 'auto',
  fullWidthResponsive: true
})

const runtimeConfig = useRuntimeConfig()
const adClient = runtimeConfig.public?.adsenseClient as string
const insRef = ref<HTMLElement | null>(null)
const isLocal = ref(false)
const isLoaded = ref(false)
const isUnfilled = ref(false)
let observer: MutationObserver | null = null

onMounted(() => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    isLocal.value = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')

    // localhost 환경에서는 구글 서버 대기로 인한 탭 로딩 휠 방지를 위해 스크립트 수동 로딩 및 AdSense 스킵
    if (!isLocal.value && adClient) {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script')
        script.async = true
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }
    }

    nextTick(() => {
      if (!isLocal.value && adClient) {
        const el = insRef.value
        if (el && typeof MutationObserver !== 'undefined') {
          observer = new MutationObserver(() => {
            const status = el.getAttribute('data-ad-status')
            if (status === 'unfilled') {
              isUnfilled.value = true
              isLoaded.value = false
            } else if (status === 'filled' || el.querySelector('iframe')) {
              isLoaded.value = true
              isUnfilled.value = false
            }
          })

          observer.observe(el, {
            attributes: true,
            attributeFilter: ['data-ad-status', 'data-adsbygoogle-status'],
            childList: true,
            subtree: true
          })
        }

        let retries = 0
        const maxRetries = 10

        const checkAndPush = () => {
          const targetEl = insRef.value
          if (targetEl && !targetEl.getAttribute('data-adsbygoogle-status')) {
            const width = targetEl.offsetWidth || (targetEl.parentElement ? targetEl.parentElement.offsetWidth : 0)
            if (width > 0) {
              try {
                ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
                ;(window as any).adsbygoogle.push({})
              } catch (e: any) {
                // 중복 푸시 에러 정숙 처리
              }
            } else if (retries < maxRetries) {
              retries++
              requestAnimationFrame(checkAndPush)
            }
          }
        }
        checkAndPush()
      }
    })
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div
    v-if="adClient && !isLocal && !isUnfilled"
    class="ad-container overflow-hidden text-center transition-all duration-300"
    :class="[
      isLoaded ? 'my-2 sm:my-3' : 'm-0 h-0 min-h-0 max-h-0'
    ]"
  >
    <ins
      ref="insRef"
      class="adsbygoogle block mx-auto"
      :data-ad-client="adClient"
      :data-ad-slot="props.adSlot"
      :data-ad-format="props.adFormat"
      :data-full-width-responsive="props.fullWidthResponsive"
    />
  </div>
</template>

<style scoped>
/* 광고가 채워지지 않았거나 빈 상태일 때 공간 완전 숨김 */
.ad-container:has(ins[data-ad-status="unfilled"]),
ins[data-ad-status="unfilled"] {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
}
</style>
