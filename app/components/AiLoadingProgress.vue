<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

interface Props {
  show: boolean
  title?: string
  subtitle?: string
  estimatedSeconds?: number
  maxPercent?: number
  icon?: string
  tips?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: 'AI 정밀 분석 진행 중',
  subtitle: '고전 원전 자료와 오행 생극제화를 깊이 있게 분석하느라 약 30~35초가 소요됩니다.',
  estimatedSeconds: 35,
  maxPercent: 98,
  icon: '🔮',
  tips: () => [
    '💡 사주명리학에서 일주(日柱)는 나 자신의 본연의 심성과 그릇을 상징합니다.',
    '✨ 오늘의 일진과 내 일주 간의 오행 조화는 하루의 에너지 흐름을 결정합니다.',
    '☯️ 주역의 64괘는 변화의 기운을 다스리는 동양 최고의 지혜서입니다.',
    '🌿 지장간(支藏干)은 지지 속에 숨겨진 천간의 기운으로 내면의 잠재력을 의미합니다.',
    '🌟 12운성은 일간의 생로병사 기운의 왕성함과 쇠퇴함을 나타냅니다.',
    '🎯 명리적 조언을 삶의 지혜로 활용하면 다가올 난관을 지혜롭게 피할 수 있습니다.'
  ]
})

const emit = defineEmits(['update:show'])

const currentSeconds = ref(0)
const currentTipIndex = ref(0)

let timerInterval: ReturnType<typeof setInterval> | null = null
let tipInterval: ReturnType<typeof setInterval> | null = null

const progressPercent = computed(() => {
  if (props.estimatedSeconds <= 0) return 0
  const pct = Math.min(Math.round((currentSeconds.value / props.estimatedSeconds) * 100), props.maxPercent)
  return pct
})

const currentTip = computed(() => {
  if (props.tips.length === 0) return ''
  return props.tips[currentTipIndex.value] || ''
})

const remainingSeconds = computed(() => {
  return Math.max(props.estimatedSeconds - currentSeconds.value, 1)
})

const startTimers = () => {
  stopTimers()
  currentSeconds.value = 0
  currentTipIndex.value = 0

  timerInterval = setInterval(() => {
    if (currentSeconds.value < props.estimatedSeconds) {
      currentSeconds.value++
    }
  }, 1000)

  tipInterval = setInterval(() => {
    if (props.tips.length > 0) {
      currentTipIndex.value = (currentTipIndex.value + 1) % props.tips.length
    }
  }, 5000)
}

const stopTimers = () => {
  if (timerInterval) clearInterval(timerInterval)
  if (tipInterval) clearInterval(tipInterval)
  timerInterval = null
  tipInterval = null
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      startTimers()
    } else {
      stopTimers()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  stopTimers()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <div
        v-if="show"
        class="fixed inset-x-4 bottom-6 z-9999 mx-auto max-w-lg rounded-2xl border border-green-500/30 dark:border-green-400/30 bg-green-50/95 dark:bg-green-950/90 p-5 backdrop-blur-xl shadow-2xl shadow-green-200/40 dark:shadow-green-950/40 text-green-900 dark:text-green-50"
      >
        <!-- 상단 타이틀 & 헤더 -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/30 dark:from-green-500/20 dark:to-emerald-600/30 border border-green-400/40 dark:border-green-400/40 text-2xl animate-pulse">
              {{ icon }}
            </div>
            <div>
              <h4 class="font-bold text-base text-green-700 dark:text-green-200 tracking-wide flex items-center gap-2">
                {{ title }}
                <span class="inline-flex items-center rounded-full bg-green-100 dark:bg-green-400/10 px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-300 border border-green-300 dark:border-green-400/20">
                  약 {{ remainingSeconds }}초 남음
                </span>
              </h4>
              <p class="mt-0.5 text-xs text-green-600 dark:text-green-300 leading-snug">
                {{ subtitle }}
              </p>
            </div>
          </div>
        </div>

        <!-- 실시간 프로그레스 바 -->
        <div class="mt-4">
          <div class="flex items-center justify-between text-xs font-medium text-green-700 dark:text-green-300/80 mb-1.5">
            <span>정밀 인공지능 명리 해석 중...</span>
            <span class="font-mono font-bold text-green-700 dark:text-green-300">{{ progressPercent }}%</span>
          </div>

          <!-- Progress track & fill -->
          <div class="h-2.5 w-full overflow-hidden rounded-full bg-green-200 dark:bg-green-900/80 p-0.5 border border-green-300 dark:border-green-700/50">
            <div
              class="h-full rounded-full bg-gradient-to-r from-green-500 via-green-400 to-emerald-300 dark:from-green-500 dark:via-green-400 dark:to-emerald-400 transition-all duration-700 ease-out shadow-sm shadow-green-400/50 relative"
              :style="{ width: `${progressPercent}%` }"
            >
              <!-- 빛나는 에지 효과 -->
              <div class="absolute right-0 top-0 bottom-0 w-3 bg-white/60 blur-[2px] rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- 팁 롤링 카러셀 -->
        <div v-if="currentTip" class="mt-3.5 pt-3 border-t border-green-200 dark:border-green-800/80 flex items-center gap-2 text-xs text-green-600 dark:text-green-300">
          <span class="shrink-0 text-green-600 dark:text-green-400/80">✨</span>
          <Transition name="tip-fade" mode="out-in">
            <p :key="currentTipIndex" class="truncate font-light text-green-600 dark:text-green-300">
              {{ currentTip }}
            </p>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
}

.tip-fade-enter-active,
.tip-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.tip-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.tip-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
