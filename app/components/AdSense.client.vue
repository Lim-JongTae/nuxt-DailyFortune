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
  nextTick(() => {
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
  })
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
