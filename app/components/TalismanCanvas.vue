<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTalisman } from '~/composables/useTalisman'

export type TalismanCategory = 'love' | 'wealth' | 'health' | 'business'

export interface TalismanData {
  category: TalismanCategory
  dayIlju?: string
  fourCharTitle?: string
  customWish?: string
}

const props = withDefaults(defineProps<{
  talismanData?: TalismanData
}>(), {
  talismanData: () => ({
    category: 'wealth',
    dayIlju: '甲戌',
    fourCharTitle: '財運大吉',
    customWish: ''
  })
})

const emit = defineEmits<{
  (e: 'download'): void
  (e: 'download-failed'): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const {
  isGeneratingGif,
  startLoop,
  stopLoop,
  downloadGif
} = useTalisman()

onMounted(() => {
  startLoop(
    () => canvasRef.value,
    () => props.talismanData
  )
})

onUnmounted(() => {
  stopLoop()
})

async function handleDownloadGif() {
  if (!canvasRef.value) return
  const saved = await downloadGif(canvasRef.value, props.talismanData)
  if (saved) {
    emit('download')
  } else {
    emit('download-failed')
  }
}
</script>

<template>
  <div class="talisman-canvas-wrapper flex flex-col items-center">
    <!-- 은은하게 스파크 반짝이는 캔버스 부적 프레임 -->
    <div class="relative shadow-2xl rounded-2xl overflow-hidden max-w-90 sm:max-w-100 w-full bg-[#E8D5A0]">
      <canvas ref="canvasRef" class="w-full h-auto block"></canvas>
    </div>

    <!-- 다운로드 및 컨트롤 버튼 -->
    <div class="mt-6 flex flex-col items-center gap-3 w-full max-w-90 sm:max-w-100">
      <!-- 1. GIF 움직이는 부적 저장 버튼 -->
      <button
        @click="handleDownloadGif"
        :disabled="isGeneratingGif"
        class="w-full py-3.5 px-6 bg-linear-to-r border border-amber-500/30 from-amber-700 via-red-800 to-amber-900 text-amber-100 font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm font-serif-kr cursor-pointer disabled:opacity-50"
      >
        <span v-if="!isGeneratingGif">✨ 부적 저장하기</span>
        <span v-else class="animate-pulse">🔮 스파크 GIF 부적 렌더링 중...</span>
      </button>

      <div class="text-center mt-2">
        <span :class="[
          'inline-block px-3.5 py-1 rounded-full text-xs font-bold font-serif-kr shadow-xs transition-colors',
          'bg-slate-900/10 text-slate-950 border border-slate-900/20',
          'dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/40'
        ]">
          ✨ 과학적 근거: 0% | 기분 전환 &amp; 마음 안정 효과: 200%
        </span>
      </div>
    </div>
  </div>
</template>
