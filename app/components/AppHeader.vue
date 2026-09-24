<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 0명에서 시작
const todayViews = ref(0)

onMounted(async () => {
  try {
    const res: any = await $fetch('/api/stats/visit')
    if (res?.success) {
      // 0부터 실제 방문자 수까지 부드럽게 카운트업
      const target = res.todayViews || 0
      const duration = 1200
      const start = performance.now()

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        todayViews.value = Math.round(target * easeOut)
        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    }
  } catch (err) {
    console.warn('Failed to load header visitor stats:', err)
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-[#0F1226]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#4d4638]/30 shadow-sm transition-colors duration-300">
    <div class="flex justify-between items-center w-full px-3 sm:px-8 py-2.5 sm:py-3.5 max-w-6xl mx-auto gap-2">
      <!-- 좌측: 로고 및 브랜드 이름 영역 (천명) -->
      <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3 group shrink-0">
        <div class="flex items-center gap-1.5 sm:gap-2">
          <span class="font-serif-kr text-base sm:text-xl font-bold text-amber-700 dark:text-[#FFDE9E] tracking-wider group-hover:text-amber-800 dark:group-hover:text-white transition-colors">
            일일운세 ✦ 天命
          </span>
          <span class="seal-stamp text-[9px] sm:text-[10px] px-1.5 py-0.5" title="천명인 (天命印)">天命</span>
        </div>
      </NuxtLink>

      <!-- 중앙: 천명과 컬러모드 사이 깜빡이는 라이브 효과와 함께 배치되는 오늘 방문자 수 (0명 시작) -->
      <div class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-500/10 dark:bg-[#FFDE9E]/10 border border-amber-500/20 dark:border-[#FFDE9E]/20 text-xs text-slate-700 dark:text-[#FFDE9E]/90 shadow-xs">
        <!-- 깜빡이는 라이브 펄스 닷 (Live Pulse Dot) -->
        <span class="relative flex h-2 w-2 shrink-0">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="font-medium text-[11px] sm:text-xs tracking-tight">
          오늘 방문자 <span class="font-bold text-amber-600 dark:text-[#FFDE9E] animate-pulse">{{ todayViews.toLocaleString() }}</span>명
        </span>
      </div>

      <!-- 우측: 다크모드/라이트모드 토글 버튼 -->
      <div class="flex items-center gap-2 shrink-0">
        <ColorModeButton />
      </div>
    </div>
  </header>
</template>
