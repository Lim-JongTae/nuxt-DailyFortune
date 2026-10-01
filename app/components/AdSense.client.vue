<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

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

onMounted(() => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')

    // localhost 환경에서는 구글 서버 대기로 인한 탭 로딩 휠 방지를 위해 스크립트 수동 로딩 및 AdSense 스킵
    if (!isLocal && adClient) {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script')
        script.async = true
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }
    }

    nextTick(() => {
      if (!isLocal && adClient) {
        let retries = 0
        const maxRetries = 10

        const checkAndPush = () => {
          const el = insRef.value
          if (el && !el.getAttribute('data-adsbygoogle-status')) {
            const width = el.offsetWidth || (el.parentElement ? el.parentElement.offsetWidth : 0)
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
</script>

<template>
  <div v-if="adClient" class="ad-container my-6 min-h-22.5">
    <ins
      ref="insRef"
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="adClient"
      :data-ad-slot="props.adSlot"
      :data-ad-format="props.adFormat"
      :data-full-width-responsive="props.fullWidthResponsive"
    />
  </div>
</template>
