<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const todayViews = ref(0)
const isGuideMenuOpen = ref(false)
const guideMenuRef = ref<HTMLElement | null>(null)

const toggleGuideMenu = () => {
  isGuideMenuOpen.value = !isGuideMenuOpen.value
}

const closeGuideMenu = () => {
  isGuideMenuOpen.value = false
}

// 클릭 아웃사이드 닫기 처리
const handleClickOutside = (e: MouseEvent) => {
  if (guideMenuRef.value && !guideMenuRef.value.contains(e.target as Node)) {
    closeGuideMenu()
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  try {
    const res: any = await $fetch('/api/stats/visit')
    if (res?.success) {
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

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header :class="['sticky top-0 z-50 backdrop-blur-md border-b shadow-xs transition-colors duration-300', 'bg-white/80 border-slate-200', 'dark:bg-[#0F1226]/80 dark:border-[#4d4638]/30']">
    <div class="flex justify-between items-center w-full px-3 sm:px-8 py-2.5 sm:py-3.5 max-w-6xl mx-auto gap-2">
      
      <!-- 좌측: 로고 및 브랜드 영역 -->
      <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3 group shrink-0">
        <div class="flex items-center gap-1.5 sm:gap-2">
          <span :class="['font-serif-kr text-base sm:text-xl font-bold tracking-wider transition-colors', 'text-amber-700 group-hover:text-amber-800', 'dark:text-[#FFDE9E] dark:group-hover:text-white']">
            일일운세 ✦
          </span>
          <span class="seal-stamp text-[9px] sm:text-[10px] px-1.5 py-0.5" title="천명인 (天命印)">天命</span>
        </div>
      </NuxtLink>

      <!-- 중앙: 오늘 방문자 수 (0명 시작 카운트업) -->
      <div :class="['flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border shadow-xs text-xs', 'bg-amber-500/10 border-amber-500/20 text-slate-700', 'dark:bg-[#FFDE9E]/10 dark:border-[#FFDE9E]/20 dark:text-[#FFDE9E]/90']">
        <span class="relative flex h-2 w-2 shrink-0">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="font-medium text-[11px] sm:text-xs tracking-tight">
          오늘 방문자 <span :class="['font-bold animate-pulse', 'text-amber-600', 'dark:text-[#FFDE9E]']">{{ todayViews.toLocaleString() }}</span> 명
        </span>
      </div>

      <!-- 우측: 안내 메뉴 드롭다운 & 컬러모드 버튼 -->
      <div class="flex items-center gap-2 shrink-0">
        
        <!-- 상단 '안내' 드롭다운 버튼 -->
        <div ref="guideMenuRef" class="relative">
          <button
            type="button"
            @click.stop="toggleGuideMenu"
            :class="['flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all shadow-xs', 'bg-amber-50 border-amber-300/80 text-amber-900 hover:bg-amber-100', 'dark:bg-[#1A203C] dark:border-[#FFDE9E]/30 dark:text-[#FFDE9E] dark:hover:bg-[#232B4F]']"
            aria-label="안내 가이드 메뉴"
          >
            <UIcon name="i-heroicons-book-open" class="w-4 h-4" />
            <span>안내</span>
            <UIcon name="i-heroicons-chevron-down" :class="['w-3.5 h-3.5 transition-transform duration-200', isGuideMenuOpen ? 'rotate-180' : '']" />
          </button>

          <!-- 드롭다운 하부 메뉴 -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-1"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-1"
          >
            <div
              v-if="isGuideMenuOpen"
              :class="['absolute right-0 mt-2 w-48 rounded-xl border shadow-xl p-1.5 z-50 backdrop-blur-md', 'bg-white/95 border-amber-200', 'dark:bg-[#161B33]/95 dark:border-[#FFDE9E]/30']"
            >
              <div :class="['px-3 py-1.5 text-[11px] font-bold border-b', 'text-amber-800 border-amber-100', 'dark:text-amber-300 dark:border-slate-700']">
                가이드 & 약관
              </div>

              <NuxtLink
                to="/guide/saju"
                @click="closeGuideMenu"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors font-medium', 'text-slate-700 hover:bg-amber-50 hover:text-amber-900', 'dark:text-slate-200 dark:hover:bg-[#232B4F] dark:hover:text-[#FFDE9E]']"
              >
                <UIcon name="i-heroicons-academic-cap" :class="['w-4 h-4', 'text-amber-600', 'dark:text-amber-400']" />
                <span>사주명리 가이드</span>
              </NuxtLink>

              <NuxtLink
                to="/guide/iching"
                @click="closeGuideMenu"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors font-medium', 'text-slate-700 hover:bg-amber-50 hover:text-amber-900', 'dark:text-slate-200 dark:hover:bg-[#232B4F] dark:hover:text-[#FFDE9E]']"
              >
                <UIcon name="i-heroicons-sparkles" :class="['w-4 h-4', 'text-amber-600', 'dark:text-amber-400']" />
                <span>주역비결 가이드</span>
              </NuxtLink>

              <div :class="['my-1 border-t', 'border-amber-100', 'dark:border-slate-700']"></div>

              <NuxtLink
                to="/about"
                @click="closeGuideMenu"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors', 'text-slate-600 hover:bg-slate-100', 'dark:text-slate-300 dark:hover:bg-[#232B4F]']"
              >
                <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
                <span>사이트 소개</span>
              </NuxtLink>

              <NuxtLink
                to="/privacy"
                @click="closeGuideMenu"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors', 'text-slate-600 hover:bg-slate-100', 'dark:text-slate-300 dark:hover:bg-[#232B4F]']"
              >
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                <span>개인정보처리방침</span>
              </NuxtLink>

              <NuxtLink
                to="/terms"
                @click="closeGuideMenu"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors', 'text-slate-600 hover:bg-slate-100', 'dark:text-slate-300 dark:hover:bg-[#232B4F]']"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                <span>서비스 이용약관</span>
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <!-- 다크/라이트 토글 -->
        <ColorModeButton />
      </div>
    </div>
  </header>
</template>
