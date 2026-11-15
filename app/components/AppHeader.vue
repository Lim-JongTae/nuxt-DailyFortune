<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { stats } = useVisitorStats()
const displayTodayViews = computed(() => stats.value?.todayViews ?? 0)

const isMobileMenuOpen = ref(false)
const isGuideMenuOpen = ref(false)
const guideMenuRef = ref<HTMLElement | null>(null)
let hoverTimeout: ReturnType<typeof setTimeout> | null = null

const toggleGuideMenu = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  isGuideMenuOpen.value = !isGuideMenuOpen.value
}

const closeAllMenus = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  isGuideMenuOpen.value = false
  isMobileMenuOpen.value = false
}

const handleMouseEnter = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  isGuideMenuOpen.value = true
}

const handleMouseLeave = () => {
  hoverTimeout = setTimeout(() => {
    isGuideMenuOpen.value = false
  }, 180)
}

// 클릭 아웃사이드 닫기 처리
const handleClickOutside = (e: MouseEvent) => {
  if (guideMenuRef.value && !guideMenuRef.value.contains(e.target as Node)) {
    isGuideMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  document.removeEventListener('click', handleClickOutside)
})

const navLinks = [
  { to: '/saju', label: '오늘의 사주' },
  { to: '/iching', label: '오늘의 주역' },
  { to: '/match', label: '사주 궁합' },
  { to: '/guide/saju', label: '사주 60일주' },
  { to: '/guide/iching', label: '주역 64괘' },
  { to: '/articles', label: '역학 칼럼' },
  { to: '/about', label: '소개' }
]
</script>

<template>
  <header :class="['sticky top-0 z-50 backdrop-blur-md border-b shadow-xs transition-colors duration-300', 'bg-white/90 border-slate-200', 'dark:bg-[#0F1226]/90 dark:border-[#4d4638]/30']">
    <div class="flex justify-between items-center w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 max-w-7xl mx-auto gap-2">
      
      <!-- 좌측: 로고 및 브랜드 영역 -->
      <NuxtLink to="/" @click="closeAllMenus" class="flex items-center gap-2 group shrink-0">
        <div class="flex items-center gap-1.5 sm:gap-2">
          <span :class="['font-serif-kr text-base sm:text-xl font-bold tracking-wider transition-colors', 'text-amber-700 group-hover:text-amber-800', 'dark:text-[#FFDE9E] dark:group-hover:text-white']">
            일일운세 ✦
          </span>
          <span class="seal-stamp text-[9px] sm:text-[10px] px-1.5 py-0.5" title="천명인 (天命印)">天命</span>
        </div>
      </NuxtLink>

      <!-- 중앙: 데스크톱 GNB 정식 가로 메뉴 바 (검색엔진 봇 & 검수자 100% 인식) -->
      <nav aria-label="메인 네비게이션" class="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap',
            'text-slate-700 hover:text-amber-700 hover:bg-amber-50/80',
            'dark:text-slate-200 dark:hover:text-[#FFDE9E] dark:hover:bg-[#1A203C]'
          ]"
          active-class="font-bold text-amber-800 bg-amber-100/60 dark:text-[#FFDE9E] dark:bg-[#1F2648]"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- 우측: 오늘 방문자 수 & 모바일 메뉴 토글 & 더보기 드롭다운 & 컬러모드 버튼 -->
      <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        
        <!-- 오늘 방문자 수 배지 -->
        <div :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs text-[11px] sm:text-xs font-medium', 'bg-amber-500/10 border-amber-500/20 text-slate-700', 'dark:bg-[#FFDE9E]/10 dark:border-[#FFDE9E]/20 dark:text-[#FFDE9E]/90']">
          <span class="relative flex h-2 w-2 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="tracking-tight whitespace-nowrap">
            오늘 방문자: <span :class="['font-bold', 'text-amber-700', 'dark:text-[#FFDE9E]']">{{ displayTodayViews.toLocaleString() }}</span>명
          </span>
        </div>
        
        <!-- 상단 '더보기' 드롭다운 버튼 (약관, 방침 등) -->
        <div
          ref="guideMenuRef"
          class="relative hidden sm:block"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <button
            type="button"
            @click.stop="toggleGuideMenu"
            :class="['flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs', 'bg-amber-50 border-amber-300/80 text-amber-900 hover:bg-amber-100', 'dark:bg-[#1A203C] dark:border-[#FFDE9E]/30 dark:text-[#FFDE9E] dark:hover:bg-[#232B4F]']"
            aria-label="안내 및 정책 메뉴"
          >
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
                학술 가이드 & 약관
              </div>

              <NuxtLink
                to="/guide"
                @click="closeAllMenus"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors font-medium', 'text-slate-700 hover:bg-amber-50 hover:text-amber-900', 'dark:text-slate-200 dark:hover:bg-[#232B4F] dark:hover:text-[#FFDE9E]']"
              >
                <UIcon name="i-heroicons-book-open" class="w-4 h-4 text-amber-600" />
                <span>가이드 메인 허브</span>
              </NuxtLink>

              <NuxtLink
                to="/articles"
                @click="closeAllMenus"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors font-medium', 'text-slate-700 hover:bg-amber-50 hover:text-amber-900', 'dark:text-slate-200 dark:hover:bg-[#232B4F] dark:hover:text-[#FFDE9E]']"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-amber-600" />
                <span>정통 역학 칼럼</span>
              </NuxtLink>

              <div :class="['my-1 border-t', 'border-amber-100', 'dark:border-slate-700']"></div>

              <NuxtLink
                to="/privacy"
                @click="closeAllMenus"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors', 'text-slate-600 hover:bg-slate-100', 'dark:text-slate-300 dark:hover:bg-[#232B4F]']"
              >
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                <span>개인정보처리방침</span>
              </NuxtLink>

              <NuxtLink
                to="/terms"
                @click="closeAllMenus"
                :class="['flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors', 'text-slate-600 hover:bg-slate-100', 'dark:text-slate-300 dark:hover:bg-[#232B4F]']"
              >
                <UIcon name="i-heroicons-document-check" class="w-4 h-4" />
                <span>서비스 이용약관</span>
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <!-- 모바일 햄버거 토글 버튼 (lg 미만 화면) -->
        <button
          type="button"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          :class="['lg:hidden p-2 rounded-lg border text-slate-700 transition-colors', 'bg-slate-100 border-slate-200 hover:bg-slate-200', 'dark:bg-[#1A203C] dark:border-slate-700 dark:text-slate-200 dark:hover:bg-[#232B4F]']"
          :aria-label="isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'"
        >
          <UIcon :name="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-5 h-5" />
        </button>

        <!-- 다크/라이트 토글 -->
        <ColorModeButton />
      </div>
    </div>

    <!-- 모바일 드롭다운 메뉴 (펼침 상태) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        :class="['lg:hidden border-b px-4 py-3 space-y-1', 'bg-white/95 border-amber-200', 'dark:bg-[#12162A]/95 dark:border-slate-800']"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="closeAllMenus"
          :class="[
            'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            'text-slate-700 hover:bg-amber-50 hover:text-amber-800',
            'dark:text-slate-200 dark:hover:bg-[#1C2340] dark:hover:text-[#FFDE9E]'
          ]"
        >
          {{ link.label }}
        </NuxtLink>
        <div class="pt-2 mt-2 border-t pg-border flex items-center justify-around text-xs pg-text-muted">
          <NuxtLink to="/guide" @click="closeAllMenus" class="hover:underline">가이드 허브</NuxtLink>
          <span>·</span>
          <NuxtLink to="/privacy" @click="closeAllMenus" class="hover:underline">개인정보처리방침</NuxtLink>
          <span>·</span>
          <NuxtLink to="/terms" @click="closeAllMenus" class="hover:underline">이용약관</NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
