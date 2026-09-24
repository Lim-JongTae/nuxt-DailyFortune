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
    try {
      if (insRef.value && !insRef.value.getAttribute('data-adsbygoogle-status')) {
        ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;(window as any).adsbygoogle.push({})
      }
    } catch (e: any) {
      // Google AdSense 중복 push 에러 콘솔 방지
      if (process.env.NODE_ENV !== 'production') {
        console.warn('AdSense duplicate push ignored:', e?.message || e)
      }
    }
  })
})
</script>

<template>
  <div v-if="adClient" class="ad-container my-6 min-h-[90px]">
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
