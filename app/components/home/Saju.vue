<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTodaySajuSummary } from '~/utils/saju'

const sajuSummary = computed(() => getTodaySajuSummary())

const todayGanzhiText = computed(() => sajuSummary.value.ganzhi)
const todayElementSentence = computed(() => sajuSummary.value.todayElementSentence)
const elementBadge = computed(() => sajuSummary.value.elementBadge)
const elementRatios = computed(() => sajuSummary.value.elementRatios)

// 점수 게이지 카운트업 (0% -> 88%)
const animatedScore = ref(0)
const strokeDashoffset = ref(100)
const targetScore = 88

onMounted(() => {
  setTimeout(() => {
    let startTime: number | null = null
    const duration = 1400

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)

      animatedScore.value = Math.floor(easeOutProgress * targetScore)
      strokeDashoffset.value = 100 - (easeOutProgress * targetScore)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        animatedScore.value = targetScore
        strokeDashoffset.value = 100 - targetScore
      }
    }
    requestAnimationFrame(animate)
  }, 150)
})
</script>

<template>
  <div class="space-y-6">
    <NuxtLink 
      to="/saju"
      class="gold-filament-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
    >
      <!-- Background Watermark (z-0) -->
      <div class="absolute -right-2 -top-4 pg-watermark-text animate-watermark-pulse text-8xl font-serif-kr select-none pointer-events-none z-0">
        命
      </div>

      <!-- Foreground Content (z-10) -->
      <div class="relative z-10">
        <!-- Header with Vermilion Mini-Seal -->
        <div class="flex items-center justify-between pb-4 sm:pb-5 border-b pg-border gap-2">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <span class="seal-stamp text-base sm:text-lg px-2 py-0.5 shrink-0">命</span>
            <div class="min-w-0">
              <h2 class="font-serif-kr text-base sm:text-xl lg:text-2xl pg-text font-bold whitespace-nowrap">
                일일 사주명리
              </h2>
              <p class="text-[11px] sm:text-xs pg-text-muted mt-0.5 truncate">나의 천간지지와 오행 흐름</p>
            </div>
          </div>
          <span class="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full pg-chip border pg-border pg-text-gold text-[11px] sm:text-xs font-medium relative z-10 shrink-0 whitespace-nowrap shadow-xs backdrop-blur-xs">
            {{ elementBadge }}
          </span>
        </div>

        <!-- Score Preview & Five Elements (ClientOnly) -->
        <ClientOnly>
          <div class="mt-6 flex items-center justify-between pg-card-inner p-4 rounded-2xl border pg-border">
            <div class="flex items-center gap-4">
              <div class="relative w-16 h-16 flex items-center justify-center rounded-full score-glow-ring shrink-0">
                <svg class="w-full h-full -rotate-90 origin-center" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" stroke-width="3" class="pg-text-soft opacity-25" />
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="100" :stroke-dashoffset="strokeDashoffset" stroke-linecap="round" class="pg-text-gold opacity-80 transition-all duration-75 ease-out" />
                </svg>
                <svg 
                  class="absolute w-9 h-9 animate-element-color-swing" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2.8" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="3.5" />
                </svg>
              </div>
              <div>
                <div class="text-sm pg-text-gold font-bold font-serif-kr">오늘({{ todayGanzhiText }}일) 일진 & 십신 분석</div>
                <div class="text-xs pg-text-muted mt-0.5">나의 일간(日干)과 오늘 날짜의 조화</div>
              </div>
            </div>
            <UIcon name="i-heroicons-sparkles" class="w-6 h-6 pg-text-gold animate-pulse" />
          </div>

          <!-- Five Elements Bar -->
          <div class="mt-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs pg-text-muted">오늘의 오행 5대 기운</span>
              <span class="text-xs pg-text-gold">木火土金水</span>
            </div>
            <div class="grid grid-cols-5 gap-2 text-center items-stretch">
              <!-- 木 (목) -->
              <div class="h-20 py-2.5 px-1 rounded-xl pg-card-inner border border-emerald-500/40 flex flex-col items-center justify-between select-none" style="height: 80px;">
                <div class="h-4 flex items-center justify-center">
                  <span class="text-xs font-serif-kr elem-text-wood font-bold leading-none">木</span>
                </div>
                <div class="h-5 flex items-center justify-center w-full">
                  <div class="elem-dot-pulse w-2 h-2 rounded-full bg-emerald-500 text-emerald-500" style="animation-delay: 0s;"></div>
                </div>
                <div class="h-4 flex items-center justify-center">
                  <span class="text-[11px] pg-text-muted font-medium leading-none">{{ elementRatios[0] }}%</span>
                </div>
              </div>
              <!-- 火 (화) -->
              <div class="h-20 py-2.5 px-1 rounded-xl pg-card-inner border border-rose-500/40 flex flex-col items-center justify-between select-none" style="height: 80px;">
                <div class="h-4 flex items-center justify-center">
                  <span class="text-xs font-serif-kr elem-text-fire font-bold leading-none">火</span>
                </div>
                <div class="h-5 flex items-center justify-center w-full">
                  <div class="elem-dot-pulse w-2 h-2 rounded-full bg-rose-500 text-rose-500" style="animation-delay: 0.5s;"></div>
                </div>
                <div class="h-4 flex items-center justify-center">
                  <span class="text-[11px] pg-text-muted font-medium leading-none">{{ elementRatios[1] }}%</span>
                </div>
              </div>
              <!-- 土 (토) -->
              <div class="h-20 py-2.5 px-1 rounded-xl pg-card-inner border border-amber-500/40 flex flex-col items-center justify-between select-none" style="height: 80px;">
                <div class="h-4 flex items-center justify-center">
                  <span class="text-xs font-serif-kr elem-text-earth font-bold leading-none">土</span>
                </div>
                <div class="h-5 flex items-center justify-center w-full">
                  <div class="elem-dot-pulse w-2 h-2 rounded-full bg-amber-500 text-amber-500" style="animation-delay: 1.0s;"></div>
                </div>
                <div class="h-4 flex items-center justify-center">
                  <span class="text-[11px] pg-text-muted font-medium leading-none">{{ elementRatios[2] }}%</span>
                </div>
              </div>
              <!-- 金 (금) -->
              <div class="h-20 py-2.5 px-1 rounded-xl pg-card-inner border pg-border flex flex-col items-center justify-between select-none" style="height: 80px;">
                <div class="h-4 flex items-center justify-center">
                  <span class="text-xs font-serif-kr pg-text font-bold leading-none">金</span>
                </div>
                <div class="h-5 flex items-center justify-center w-full">
                  <div class="elem-dot-pulse w-2 h-2 rounded-full bg-slate-500 text-slate-400" style="animation-delay: 1.5s;"></div>
                </div>
                <div class="h-4 flex items-center justify-center">
                  <span class="text-[11px] pg-text-muted font-medium leading-none">{{ elementRatios[3] }}%</span>
                </div>
              </div>
              <!-- 水 (수) -->
              <div class="h-20 py-2.5 px-1 rounded-xl pg-card-inner border border-sky-500/30 flex flex-col items-center justify-between select-none" style="height: 80px;">
                <div class="h-4 flex items-center justify-center">
                  <span class="text-xs font-serif-kr elem-text-water font-bold leading-none">水</span>
                </div>
                <div class="h-5 flex items-center justify-center w-full">
                  <div class="elem-dot-pulse w-2 h-2 rounded-full bg-sky-500 text-sky-500" style="animation-delay: 2.0s;"></div>
                </div>
                <div class="h-4 flex items-center justify-center">
                  <span class="text-[11px] pg-text-muted font-medium leading-none">{{ elementRatios[4] }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 오늘의 일진 오행 조화 동적 1줄 문구 -->
          <div class="mt-4 p-3 rounded-2xl pg-card-inner border pg-border flex items-center gap-2.5 shadow-2xs">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 pg-text-gold shrink-0 animate-pulse" />
            <p class="text-xs pg-text-gold font-serif-kr font-medium leading-relaxed">
              {{ todayElementSentence }}
            </p>
          </div>
        </ClientOnly>
      </div>

      <!-- CTA Button (z-10) -->
      <div class="mt-8 relative z-10">
        <div class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-[#402d00] bg-linear-to-r from-[#FFDF9E] via-[#E8C170] to-[#FFDF9E] hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-amber-500/30">
          <span>🔮 사주 명리 확인하기</span>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.elem-text-wood { color: #059669; }
.dark .elem-text-wood { color: #34d399; }
.elem-text-fire { color: #e11d48; }
.dark .elem-text-fire { color: #fb7185; }
.elem-text-earth { color: #d97706; }
.dark .elem-text-earth { color: #fbbf24; }
.elem-text-water { color: #0284c7; }
.dark .elem-text-water { color: #38bdf8; }

@keyframes elemDotPulse {
  0%, 100% {
    transform: scale(0.75);
    opacity: 0.4;
    filter: brightness(0.85);
    box-shadow: 0 0 1px currentColor;
  }
  50% {
    transform: scale(1.35);
    opacity: 1;
    filter: brightness(1.3);
    box-shadow: 0 0 6px currentColor, 0 0 12px currentColor;
  }
}

.elem-dot-pulse {
  animation: elemDotPulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  will-change: transform, opacity, filter, box-shadow;
}

@keyframes scoreGlowPulse {
  0%, 100% {
    filter: drop-shadow(0 0 3px rgba(217, 119, 6, 0.5)) drop-shadow(0 0 7px rgba(251, 191, 36, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(217, 119, 6, 0.95)) drop-shadow(0 0 16px rgba(251, 191, 36, 0.85));
  }
}

.score-glow-ring {
  animation: scoreGlowPulse 2.5s ease-in-out infinite;
  will-change: filter;
}

@keyframes element-color-swing {
  0% { stroke: #16a34a; filter: drop-shadow(0 0 10px rgba(22, 163, 74, 0.8)); transform: rotate(-10deg); }
  25% { stroke: #dc2626; filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.8)); transform: rotate(10deg); }
  50% { stroke: #f59e0b; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.8)); transform: rotate(-10deg); }
  75% { stroke: #0284c7; filter: drop-shadow(0 0 10px rgba(2, 132, 199, 0.8)); transform: rotate(10deg); }
  100% { stroke: #16a34a; filter: drop-shadow(0 0 10px rgba(22, 163, 74, 0.8)); transform: rotate(-10deg); }
}

.animate-element-color-swing {
  animation: element-color-swing 7s ease-in-out infinite;
  transform-origin: center center;
}
</style>
