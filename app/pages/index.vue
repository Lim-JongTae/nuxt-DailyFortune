<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/`
const fortuneTitle = '일일운세 ✦ 天命 | 오늘의 사주명리와 주역 64괘'
const fortuneDesc = '생년월일로 짚어보는 하루의 에너지와 오행의 균형, 그리고 64괘의 괘상이 전하는 오늘 하루의 깊은 처세와 지혜를 마주합니다.'

useSeoMeta({
  title: fortuneTitle,
  description: fortuneDesc,
  ogTitle: fortuneTitle,
  ogDescription: fortuneDesc,
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/og-image.png'
})

useHead({
  link: [
    { rel: 'canonical', href: pageUrl }
  ]
})

// KST 오늘 일진 간지 및 오행 기운 동적 계산
const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"]
const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"]

const nowUtc = new Date().getTime()
const kstOffset = 9 * 60 * 60 * 1000
const todayKst = new Date(nowUtc + kstOffset)
const todayStr = todayKst.toISOString().split('T')[0] || ''

const targetDate = new Date(`${todayStr}T00:00:00+09:00`)
const refDate = new Date('2000-01-01T00:00:00+09:00')
const diffDays = Math.round((targetDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24))

const todayStemIdx = (4 + (diffDays % 10) + 10) % 10
const todayBranchIdx = (6 + (diffDays % 12) + 12) % 12
const todayGanzhi = `${stems[todayStemIdx]}${branches[todayBranchIdx]}`

// 오늘 일진의 천간 기준 주오행 (0: 목, 1: 화, 2: 토, 3: 금, 4: 수)
const todayElementIdx = Math.floor(todayStemIdx / 2)

const elementBadge = computed(() => {
  const badgeMap = [
    '木 · 생기 상승',
    '火 · 열정 왕성',
    '土 · 안정 조화',
    '金 · 결실 결단',
    '水 · 지혜 흐름'
  ]
  return badgeMap[todayElementIdx] || '木 · 생기 상승'
})

// 오늘 일진 오행 비율 동적 계산
const elementRatios = computed(() => {
  const baseRatios = [
    [35, 20, 20, 15, 10], // 목 위주
    [15, 35, 20, 15, 15], // 화 위주
    [15, 20, 35, 15, 15], // 토 위주
    [15, 15, 20, 35, 15], // 금 위주
    [20, 15, 15, 15, 35], // 수 위주
  ]
  return baseRatios[todayElementIdx] || [35, 20, 20, 15, 10]
})
</script>

<template>
  <div class="bg-celestial-canvas text-slate-800 dark:text-[#dfe0fd] min-h-screen font-sans-kr py-10 px-4 md:px-8 transition-colors duration-300">
    <main class="max-w-6xl mx-auto space-y-12">
      <!-- 1. HERO SECTION: Celestial Harmony & Grand Title -->
      <section class="relative pt-6 pb-12 text-center flex flex-col items-center overflow-hidden">
        <!-- Ambient Starry Grid & Rings -->
        <div class="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
          <div class="w-150 h-150 rounded-full border border-amber-600/20 dark:border-[#FFDE9E]/10"></div>
          <div class="absolute w-112.5 h-112.5 rounded-full border border-dashed border-amber-600/25 dark:border-[#FFDE9E]/15 animate-spin" style="animation-duration: 120s;"></div>
        </div>

        <div class="relative z-10 max-w-3xl mx-auto">
          <!-- Golden Pill Tagline -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#26293e] border border-amber-500/30 dark:border-[#FFDE9E]/30 mb-6 shadow-sm">
            <span class="text-amber-600 dark:text-[#FFDE9E] text-xs font-semibold">✦</span>
            <span class="text-xs sm:text-sm text-amber-800 dark:text-[#FFDE9E] tracking-wide font-medium">매일 아침, 나를 읽는 두 가지 지혜</span>
          </div>

          <!-- Grand Serif Headline -->
          <h1 class="font-serif-kr text-3xl sm:text-5xl text-slate-900 dark:text-white font-extrabold mb-6 tracking-tight leading-tight">
            오늘의 흐름을 <span class="text-amber-700 dark:text-[#FFDE9E] font-serif-kr">사주</span>와 <span class="text-amber-700 dark:text-[#FFDE9E] font-serif-kr">주역</span>으로 읽어보세요
          </h1>

          <!-- Subtitle -->
          <p class="font-serif-kr text-base sm:text-lg text-slate-600 dark:text-[#d1c5b3] max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            생년월일로 짚어보는 하루의 에너지와 오행의 균형, 그리고 64괘의 괘상이 전하는 오늘 하루의 깊은 처세와 지혜를 마주합니다.
          </p>

          <!-- Yin-Yang Celestial Ring Graphic (신비로운 동적 천기 회전 애니메이션) -->
          <div class="relative w-36 h-36 mx-auto my-3 flex items-center justify-center animate-celestial-float">
            <svg class="w-full h-full text-amber-600 dark:text-[#FFDE9E]" fill="none" viewBox="0 0 160 160">
              <!-- 천천히 360도 회전하는 외곽 점선 링 (g 태그로 회전과 색상 변화 애니메이션 분리) -->
              <g class="animate-spin origin-center" style="animation-duration: 35s; transform-origin: 80px 80px;">
                <circle
                  cx="80"
                  cy="80"
                  r="74"
                  stroke="currentColor"
                  stroke-dasharray="4 6"
                  stroke-opacity="0.4"
                  stroke-width="1.5"
                  class="animate-celestial-color"
                ></circle>
              </g>
              
              <!-- 은은하게 숨쉬듯 움직이는 음양(陰陽) 태극 곡선 -->
              <path
                d="M80 10 A70 70 0 0 1 80 150 A35 35 0 0 1 80 80 A35 35 0 0 0 80 10 Z"
                fill="rgba(217, 119, 6, 0.1)"
                stroke="currentColor"
                stroke-opacity="0.4"
                stroke-width="1.5"
                class="animate-pulse origin-center"
                style="animation-duration: 5s;"
              ></path>
              
              <!-- 오행(五行)의 반짝이는 기운 도트 -->
              <circle cx="48" cy="48" fill="#16a34a" fill-opacity="0.9" r="4.5" class="animate-pulse" style="animation-duration: 3s;"></circle>
              <circle cx="34" cy="80" fill="#dc2626" fill-opacity="0.9" r="4.5" class="animate-pulse" style="animation-duration: 4s;"></circle>
              <circle cx="48" cy="112" fill="#d97706" fill-opacity="0.9" r="4.5" class="animate-pulse" style="animation-duration: 3.5s;"></circle>
              
              <!-- 주역(周易) 괘상 선 -->
              <line stroke="currentColor" stroke-linecap="round" stroke-width="2.5" x1="96" x2="124" y1="52" y2="52"></line>
              <line stroke="#94a3b8" stroke-linecap="round" stroke-width="2" x1="96" x2="108" y1="64" y2="64"></line>
              <line stroke="#94a3b8" stroke-linecap="round" stroke-width="2" x1="112" x2="124" y1="64" y2="64"></line>
              <line stroke="currentColor" stroke-linecap="round" stroke-width="2.5" x1="96" x2="124" y1="76" y2="76"></line>
              
              <!-- 중앙 천지(天地) 조화 파동 빛점 -->
              <circle cx="80" cy="80" fill="#b45309" r="5" class="animate-ping origin-center opacity-70" style="animation-duration: 3s;"></circle>
              <circle cx="80" cy="80" fill="#b45309" r="3.5"></circle>
            </svg>
          </div>

          <!-- Trust Badges -->
          <div class="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 dark:text-[#9a8f7f] border-t border-slate-200 dark:border-[#4d4638]/40 pt-6">
            <span class="flex items-center gap-1.5">
              <span class="text-amber-600 dark:text-[#FFDE9E]">✦</span> 1일 1회 맞춤 성찰
            </span>
            <span class="text-slate-300 dark:text-[#9a8f7f]/40">•</span>
            <span class="flex items-center gap-1.5">
              <span class="text-amber-600 dark:text-[#FFDE9E]">✦</span> 명리학 & 주역 64괘 엔진
            </span>
            <span class="text-slate-300 dark:text-[#9a8f7f]/40">•</span>
            <span class="flex items-center gap-1.5">
              <span class="text-amber-600 dark:text-[#FFDE9E]">✦</span> AI 총평 & 부적 조언
            </span>
          </div>
        </div>
      </section>

      <!-- 2. DUAL CORE ENTRY CARDS -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <!-- ================= CARD A: 일일 사주명리 ================= -->
        <NuxtLink 
          to="/saju"
          class="gold-filament-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        >
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-2 -top-4 text-slate-300/30 dark:text-[#303349]/15 text-8xl font-serif-kr select-none pointer-events-none z-0">
            命
          </div>

          <!-- Foreground Content (z-10) -->
          <div class="relative z-10">
            <!-- Header with Vermilion Mini-Seal -->
            <div class="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-[#4d4638]/30">
              <div class="flex items-center gap-3">
                <span class="seal-stamp text-lg px-2 py-0.5">命</span>
                <div>
                  <h2 class="font-serif-kr text-xl sm:text-2xl text-slate-900 dark:text-white font-bold flex items-center gap-2">
                    일일 사주명리
                    <span class="text-xs text-amber-700 dark:text-[#FFDE9E]/80 font-sans-kr font-normal">(Daily Saju)</span>
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-[#d1c5b3] mt-0.5">나의 천간지지와 오행 흐름</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-[#FFDE9E] text-xs font-medium relative z-20 shrink-0 whitespace-nowrap shadow-xs backdrop-blur-xs">
                {{ elementBadge }}
              </span>
            </div>

            <!-- Score Preview -->
            <div class="mt-6 flex items-center justify-between bg-slate-50 dark:bg-[#171a2e] p-4 rounded-2xl border border-slate-200 dark:border-[#4d4638]/30">
              <div class="flex items-center gap-4">
                <div class="relative w-14 h-14 flex items-center justify-center">
                  <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path class="text-slate-200 dark:text-[#303349]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
                    <path class="text-amber-600 dark:text-[#FFDE9E]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="87, 100" stroke-linecap="round" stroke-width="3.5"></path>
                  </svg>
                  <span class="absolute text-slate-900 dark:text-white font-bold text-base font-serif-kr">87</span>
                </div>
                <div>
                  <div class="text-sm text-amber-800 dark:text-[#FFDE9E] font-bold font-serif-kr">오늘({{ todayGanzhi }}일) 일진 & 십신 분석</div>
                  <div class="text-xs text-slate-500 dark:text-[#9a8f7f] mt-0.5">나의 일간(日干)과 오늘 날짜의 조화</div>
                </div>
              </div>
              <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-amber-600 dark:text-[#FFDE9E]" />
            </div>

            <!-- Five Elements Bar -->
            <div class="mt-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs text-slate-500 dark:text-[#9a8f7f]">오늘의 오행 5대 기운</span>
                <span class="text-xs text-amber-700 dark:text-[#FFDE9E]">木火土金水</span>
              </div>
              <div class="grid grid-cols-5 gap-2 text-center items-stretch">
                <!-- 木 (목) -->
                <div class="h-20 py-2.5 px-1 rounded-xl bg-slate-100 dark:bg-[#1b1e33] border border-emerald-500/40 flex flex-col items-center justify-between select-none" style="height: 80px;">
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-xs font-serif-kr text-emerald-600 dark:text-emerald-400 font-bold leading-none">木</span>
                  </div>
                  <div class="h-5 flex items-center justify-center w-full">
                    <div class="elem-dot-pulse w-2 h-2 rounded-full bg-emerald-500 text-emerald-500" style="animation-delay: 0s;"></div>
                  </div>
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-[11px] text-slate-500 dark:text-[#9a8f7f] font-medium leading-none">{{ elementRatios[0] }}%</span>
                  </div>
                </div>
                <!-- 火 (화) -->
                <div class="h-20 py-2.5 px-1 rounded-xl bg-slate-100 dark:bg-[#1b1e33] border border-rose-500/30 flex flex-col items-center justify-between select-none" style="height: 80px;">
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-xs font-serif-kr text-rose-600 dark:text-rose-400 font-bold leading-none">火</span>
                  </div>
                  <div class="h-5 flex items-center justify-center w-full">
                    <div class="elem-dot-pulse w-2 h-2 rounded-full bg-rose-500 text-rose-500" style="animation-delay: 0.5s;"></div>
                  </div>
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-[11px] text-slate-500 dark:text-[#9a8f7f] font-medium leading-none">{{ elementRatios[1] }}%</span>
                  </div>
                </div>
                <!-- 土 (토) -->
                <div class="h-20 py-2.5 px-1 rounded-xl bg-slate-100 dark:bg-[#1b1e33] border border-amber-500/30 flex flex-col items-center justify-between select-none" style="height: 80px;">
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-xs font-serif-kr text-amber-600 dark:text-amber-300 font-bold leading-none">土</span>
                  </div>
                  <div class="h-5 flex items-center justify-center w-full">
                    <div class="elem-dot-pulse w-2 h-2 rounded-full bg-amber-500 text-amber-500" style="animation-delay: 1.0s;"></div>
                  </div>
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-[11px] text-slate-500 dark:text-[#9a8f7f] font-medium leading-none">{{ elementRatios[2] }}%</span>
                  </div>
                </div>
                <!-- 金 (금) -->
                <div class="h-20 py-2.5 px-1 rounded-xl bg-slate-100 dark:bg-[#1b1e33] border border-slate-400/30 dark:border-[#4d4638]/30 flex flex-col items-center justify-between select-none" style="height: 80px;">
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-xs font-serif-kr text-slate-700 dark:text-slate-200 font-bold leading-none">金</span>
                  </div>
                  <div class="h-5 flex items-center justify-center w-full">
                    <div class="elem-dot-pulse w-2 h-2 rounded-full bg-slate-500 text-slate-400" style="animation-delay: 1.5s;"></div>
                  </div>
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-[11px] text-slate-500 dark:text-[#9a8f7f] font-medium leading-none">{{ elementRatios[3] }}%</span>
                  </div>
                </div>
                <!-- 水 (수) -->
                <div class="h-20 py-2.5 px-1 rounded-xl bg-slate-100 dark:bg-[#1b1e33] border border-sky-500/30 flex flex-col items-center justify-between select-none" style="height: 80px;">
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-xs font-serif-kr text-sky-600 dark:text-sky-400 font-bold leading-none">水</span>
                  </div>
                  <div class="h-5 flex items-center justify-center w-full">
                    <div class="elem-dot-pulse w-2 h-2 rounded-full bg-sky-500 text-sky-500" style="animation-delay: 2.0s;"></div>
                  </div>
                  <div class="h-4 flex items-center justify-center">
                    <span class="text-[11px] text-slate-500 dark:text-[#9a8f7f] font-medium leading-none">{{ elementRatios[4] }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Button (z-10) -->
          <div class="mt-8 relative z-10">
            <div class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-[#402d00] bg-linear-to-r from-[#FFDF9E] to-[#E8C170] hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-amber-500/20">
              오늘의 사주 보러가기
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </NuxtLink>

        <!-- ================= CARD B: 오늘의 주역 괘 ================= -->
        <NuxtLink 
          to="/iching"
          class="gold-filament-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        >
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-2 -top-4 text-slate-300/30 dark:text-[#303349]/15 text-8xl font-serif-kr select-none pointer-events-none z-0">
            易
          </div>

          <!-- Foreground Content (z-10) -->
          <div class="relative z-10">
            <!-- Header with Vermilion Mini-Seal -->
            <div class="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-[#4d4638]/30">
              <div class="flex items-center gap-3">
                <span class="seal-stamp text-xs px-2 py-0.5">易</span>
                <div>
                  <h2 class="font-serif-kr text-xl sm:text-2xl text-slate-900 dark:text-white font-bold flex items-center gap-2">
                    오늘의 주역 괘
                    <span class="text-xs text-amber-700 dark:text-[#FFDE9E]/80 font-sans-kr font-normal">(Today's I Ching)</span>
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-[#d1c5b3] mt-0.5">하늘과 땅의 64가지 변화</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-medium relative z-20 shrink-0 whitespace-nowrap shadow-xs backdrop-blur-xs">
                64괘 대나무 드로우
              </span>
            </div>

            <!-- Hexagram Preview Graphic (6효 완성: 보라/인디고 단일 톤) -->
            <div class="mt-6 flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-[#171a2e] p-5 rounded-2xl border border-slate-200 dark:border-[#4d4638]/30">
              <!-- 64괘 6효 그래픽 -->
              <div class="w-32 flex flex-col gap-1.5 py-1 select-none">
                <!-- 상괘 (6효: 음효) -->
                <div class="flex gap-2 w-full">
                  <div class="h-1.5 rounded-xs w-1/2 bg-purple-600 dark:bg-purple-400 shadow-xs"></div>
                  <div class="h-1.5 rounded-xs w-1/2 bg-purple-600 dark:bg-purple-400 shadow-xs"></div>
                </div>
                <!-- 상괘 (5효: 양효) -->
                <div class="h-1.5 rounded-xs w-full bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 shadow-xs"></div>
                <!-- 상괘 (4효: 양효) -->
                <div class="h-1.5 rounded-xs w-full bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 shadow-xs"></div>

                <!-- 하괘 (3효: 양효) -->
                <div class="h-1.5 rounded-xs w-full bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 shadow-xs"></div>
                <!-- 하괘 (2효: 음효) -->
                <div class="flex gap-2 w-full">
                  <div class="h-1.5 rounded-xs w-1/2 bg-purple-600 dark:bg-purple-400 shadow-xs"></div>
                  <div class="h-1.5 rounded-xs w-1/2 bg-purple-600 dark:bg-purple-400 shadow-xs"></div>
                </div>
                <!-- 하괘 (1효: 양효) -->
                <div class="h-1.5 rounded-xs w-full bg-linear-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 shadow-xs"></div>
              </div>
              <div>
                <div class="text-xs text-purple-700 dark:text-[#FFDE9E] font-bold font-serif-kr mb-1">3단계 대나무 점대 드로우</div>
                <p class="text-xs text-slate-500 dark:text-[#9a8f7f] leading-relaxed">
                  하괘, 상괘, 동효를 마음을 담아 직접 선택하여 오늘 나에게 필요한 처세의 지혜를 구합니다.
                </p>
              </div>
            </div>

            <!-- Quote Preview -->
            <div class="mt-6 p-4 rounded-xl bg-purple-50 dark:bg-[#1b1e33] border-l-2 border-purple-600 dark:border-[#FFDE9E]">
              <p class="font-serif-kr text-xs sm:text-sm text-purple-900 dark:text-[#FFDE9E] italic">
                “상황에 맞추어 유연하게 순응하면 굳게 막혔던 난관이 스스로 풀려나갑니다.”
              </p>
            </div>
          </div>

          <!-- CTA Button (z-10) -->
          <div class="mt-8 relative z-10">
            <div class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-linear-to-r from-purple-700 to-indigo-800 hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-purple-900/30">
              주역 괘 뽑으러가기
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </NuxtLink>
      </section>

      <!-- 3. GUIDANCE SECTION -->
      <section class="gold-filament-card p-6 sm:p-8 text-center">
        <h3 class="font-serif-kr text-lg font-bold text-amber-700 dark:text-[#FFDE9E] mb-2">💡 운세를 지혜롭게 대하는 마음가짐</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-[#d1c5b3] leading-relaxed max-w-2xl mx-auto font-light">
          운세와 주역은 미래를 고정짓는 미신이 아니라 다가올 오늘 하루의 기운을 차분히 대비하는 마음의 거울입니다.<br>
          길한 운은 감사히 활용하고, 삼가야 할 조언은 지혜롭게 대비하는 나침반으로 사용해 보세요.
        </p>
      </section>

      <!-- 4. ADSENSE SLOT -->
      <div class="flex justify-center my-6">
        <AdSense adSlot="8273619208" />
      </div>
    </main>
  </div>
</template>

<style scoped>
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
</style>