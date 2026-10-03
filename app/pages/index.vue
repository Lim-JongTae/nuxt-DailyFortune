<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/`
const fortuneTitle = '일일운세 ✦ 天命'
const fortuneDesc = '한 치 앞도 모를 때, 사주앱이 함께합니다. 사주명리와 주역 64괘로 보는 오늘의 운세.'

useSeoMeta({
  title: fortuneTitle,
  description: fortuneDesc,
  ogTitle: fortuneTitle,
  ogDescription: fortuneDesc,
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  twitterCard: 'summary_large_image',
  twitterImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`
})

useHead({
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: [
    {
      type: 'application/ld+json' as const,
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '일일운세 ✦ 天命',
        description: '한 치 앞도 모를 때, 사주앱이 함께합니다. 사주명리와 주역 64괘로 보는 오늘의 운세.',
        url: pageUrl,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1250',
          bestRating: '5',
          worstRating: '1'
        },
        author: {
          '@type': 'Organization',
          name: 'sajuapp.co.kr',
          url: 'https://sajuapp.co.kr'
        }
      })
    }
  ]
})

interface VisitStatsResponse {
  success: boolean
  todayViews?: number
  totalViews?: number
  error?: string
}

// KST 오늘 일진 간지 및 오행 기운 동적 계산 (useState 활용으로 SSR-Client 하이드레이션 일치)
const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"]
const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"]
const elemNames = ['木', '火', '土', '金', '水']

// 12지지별 오행 인덱스 매핑 (0:木, 1:火, 2:土, 3:金, 4:水)
// 인덱스: 0:子(수:4), 1:丑(토:2), 2:寅(목:0), 3:卯(목:0), 4:辰(토:2), 5:巳(화:1),
//        6:午(화:1), 7:未(토:2), 8:申(금:3), 9:酉(금:3), 10:戌(토:2), 11:亥(수:4)
const BRANCH_ELEMENT_MAP: readonly number[] = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4]

const todayGanzhi = useState('todayGanzhi', () => {
  // Intl.DateTimeFormat을 활용한 간결하고 정확한 KST YYYY-MM-DD 구하기
  const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())

  // 기준일: 2000-01-01 (양력) = 무진(戊辰)일
  // 천간 戊 = Index 4 (갑0, 을1, 병2, 정3, 무4)
  // 지지 辰 = Index 4 (자0, 축1, 인2, 묘3, 진4)
  const targetDate = new Date(`${todayStr}T00:00:00+09:00`)
  const refDate = new Date('2000-01-01T00:00:00+09:00')
  const diffDays = Math.round((targetDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24))

  const REF_STEM_IDX = 4
  const REF_BRANCH_IDX = 4

  const todayStemIdx = (REF_STEM_IDX + (diffDays % 10) + 10) % 10
  const todayBranchIdx = (REF_BRANCH_IDX + (diffDays % 12) + 12) % 12

  const stemElemIdx = Math.floor(todayStemIdx / 2) // 0:목, 1:화, 2:토, 3:금, 4:수
  const branchElemIdx = BRANCH_ELEMENT_MAP[todayBranchIdx] ?? 0

  return {
    ganzhi: `${stems[todayStemIdx]}${branches[todayBranchIdx]}`,
    stemIdx: todayStemIdx,
    branchIdx: todayBranchIdx,
    stemElemIdx,
    branchElemIdx
  }
})

const todayGanzhiText = computed(() => todayGanzhi.value.ganzhi)

// 오행별 명사, 특성, 동작 맵
const ELEMENT_MAP = [
  { name: '나무', trait: '유연함과 푸른 생명력', action: '새로운 기운을 뻗어내는 날' },
  { name: '불', trait: '뜨거운 열정과 밝은 빛', action: '환하게 세상을 밝히는 날' },
  { name: '대지', trait: '든든한 포용력과 안정감', action: '중심을 굳건히 잡아주는 날' },
  { name: '바위', trait: '단단한 결단력', action: '알찬 결실을 이뤄내는 날' },
  { name: '샘물', trait: '깊은 지혜와 유유함', action: '지혜롭게 흘러가는 날' }
]

const todayElementSentence = computed(() => {
  const s = todayGanzhi.value.stemElemIdx ?? 0
  const b = todayGanzhi.value.branchElemIdx ?? 1
  const ganzhi = todayGanzhi.value.ganzhi

  const defaultAttr = ELEMENT_MAP[0]!
  const stemAttr = ELEMENT_MAP[s % 5] ?? defaultAttr
  const branchAttr = ELEMENT_MAP[b % 5] ?? defaultAttr

  if (s === b) {
    return `${ganzhi}일 · ${stemAttr.name}의 ${stemAttr.trait}이(가) 배가되어 ${stemAttr.action}`
  }
  return `${stemAttr.name}의 ${stemAttr.trait}이(가) ${branchAttr.name}의 ${branchAttr.trait}과(와) 만나 ${branchAttr.action}`
})

const elementBadge = computed(() => {
  const s = todayGanzhi.value.stemElemIdx
  const b = todayGanzhi.value.branchElemIdx
  const ganzhi = todayGanzhi.value.ganzhi

  if (s === b) {
    return `${ganzhi} · ${elemNames[s]} 기운 왕성`
  }
  return `${ganzhi} · ${elemNames[s]}${elemNames[b]} 상생 조화`
})

// 오늘 일진(천간+지지) 60간지 명리학 오행 비율 동적 계산
const elementRatios = computed(() => {
  const s = todayGanzhi.value.stemElemIdx ?? 0
  const b = todayGanzhi.value.branchElemIdx ?? 0

  const ratios = [10, 10, 10, 10, 10]
  if (ratios[s] !== undefined) ratios[s]! += 25
  if (ratios[b] !== undefined) ratios[b]! += 25

  // 상생 관계 추가 조율
  if ((s + 1) % 5 === b) { // 천간이 지지를 생함 (예: 목생화)
    if (ratios[b] !== undefined) ratios[b]! += 10
  } else if ((b + 1) % 5 === s) { // 지지가 천간을 생함 (예: 수생목)
    if (ratios[s] !== undefined) ratios[s]! += 10
  } else {
    if (ratios[s] !== undefined) ratios[s]! += 5
    if (ratios[b] !== undefined) ratios[b]! += 5
  }

  // 총합 100% 정률 정산
  const sum = ratios.reduce((acc, cur) => acc + cur, 0)
  return ratios.map(r => Math.round((r / (sum || 1)) * 100))
})

// 오늘 사주 운세 점수 (0% / 0도 -> 88% / 88점 카운트업 & 게이지 그리기 애니메이션)
const animatedScore = ref(0)
const strokeDashoffset = ref(100) // 100 = 0% (0도)
const targetScore = 88

// 실시간 방문자 수 및 누적 방문 카운터 (0명 시작)
const todayViews = ref(0)
const totalViews = ref(0)

// 브라우저 마운트 완료 후 괘 애니메이션 시작 제어 (SSR 미리 동작 방지)
const isAnimated = ref(false)

onMounted(async () => {
  setTimeout(() => {
    isAnimated.value = true
  }, 100)

  // 방문자 통계 데이터 로드 (타입 안정성 및 실패 시 Fallback 기본값 대응)
  try {
    const res = await $fetch<VisitStatsResponse>('/api/stats/visit')
    if (res?.success) {
      const targetToday = res.todayViews || 0
      const targetTotal = res.totalViews || 0
      const duration = 1200
      const start = performance.now()

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        todayViews.value = Math.round(targetToday * easeOut)
        totalViews.value = Math.round(targetTotal * easeOut)
        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    } else {
      todayViews.value = 0
      totalViews.value = 0
    }
  } catch (e) {
    console.warn('Failed to fetch visitor stats:', e)
    todayViews.value = 0
    totalViews.value = 0
  }

  // 150ms 지연 후 0도(0%)에서 시작하여 88%까지 부드럽게 채워짐
  setTimeout(() => {
    let startTime: number | null = null
    const duration = 1400 // 1.4초 동안 0도에서 88%까지 차오름

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // easeOutCubic 이징
      const easeOutProgress = 1 - Math.pow(1 - progress, 3)

      // 0점 -> 88점
      animatedScore.value = Math.floor(easeOutProgress * targetScore)

      // 100(0%) -> 12(88%)
      strokeDashoffset.value = 100 - (easeOutProgress * targetScore)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        animatedScore.value = targetScore
        strokeDashoffset.value = 100 - targetScore // 12
      }
    }

    requestAnimationFrame(animate)
  }, 150)
})
</script>

<template>
  <div class="bg-celestial-canvas pg-text min-h-screen font-sans-kr py-10 px-4 md:px-8 transition-colors duration-300">
    <main class="max-w-6xl mx-auto space-y-12">
      <!-- 1. HERO SECTION: Celestial Harmony & Grand Title -->
      <section class="relative pt-6 pb-12 text-center flex flex-col items-center overflow-hidden">
        <!-- Ambient Starry Grid & Rings -->
        <div class="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
          <div class="w-150 h-150 rounded-full border pg-border"></div>
          <div class="absolute w-112.5 h-112.5 rounded-full border border-dashed pg-border animate-spin" style="animation-duration: 120s;"></div>
        </div>

        <div class="relative z-10 max-w-3xl mx-auto">
          <!-- Golden Pill Tagline -->
          <div class="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full pg-card-inner border pg-border mb-6 shadow-xs">
            <span class="pg-text-gold text-xs font-semibold">✦</span>
            <span class="text-xs sm:text-sm pg-text-gold tracking-wide font-medium">매일 아침, 나를 읽는 두 가지 지혜</span>
          </div>

          <!-- Grand Serif Headline -->
          <h1 class="font-serif-kr text-lg sm:text-2xl md:text-3xl lg:text-5xl pg-text font-extrabold mb-4 sm:mb-6 tracking-tight leading-snug">
            오늘의 흐름을 <span class="pg-text-gold font-serif-kr">사주</span>와 <span class="pg-text-gold font-serif-kr">주역</span>으로 읽어보세요
          </h1>

          <!-- Subtitle -->
          <p class="font-serif-kr text-base sm:text-lg pg-text-muted max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            생년월일로 짚어보는 하루의 에너지와 오행의 균형, 그리고 64괘의 괘상이 전하는 오늘 하루의 깊은 처세와 지혜를 마주합니다.
          </p>

          <!-- Yin-Yang Celestial Ring Graphic (신비로운 동적 천기 회전 애니메이션) -->
          <div class="relative w-36 h-36 mx-auto my-3 flex items-center justify-center animate-celestial-float">
            <svg class="w-full h-full pg-text-gold" fill="none" viewBox="0 0 160 160">
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
          <div class="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm pg-text-muted border-t pg-border pt-6">
            <span class="flex items-center gap-1.5">
              <span class="pg-text-gold">✦</span> 1일 1회 맞춤 성찰
            </span>
            <span class="pg-text-soft">•</span>
            <span class="flex items-center gap-1.5">
              <span class="pg-text-gold">✦</span> 명리학 & 주역 64괘 엔진
            </span>
            <span class="pg-text-soft">•</span>
            <span class="flex items-center gap-1.5">
              <span class="pg-text-gold">✦</span> AI 총평 & 부적 조언
            </span>
          </div>

        </div>
      </section>

      <!-- 2. DUAL CORE ENTRY CARDS -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
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

            <!-- Score Preview -->
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
          </div>

          <!-- CTA Button (z-10) -->
          <div class="mt-8 relative z-10">
            <div class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-[#402d00] bg-linear-to-r from-[#FFDF9E] via-[#E8C170] to-[#FFDF9E] hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-amber-500/30">
              <span>🔮 사주 명리 확인하기</span>
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
          <div class="absolute -right-2 -top-4 pg-watermark-text animate-watermark-pulse text-8xl font-serif-kr select-none pointer-events-none z-0">
            易
          </div>

          <!-- Foreground Content (z-10) -->
          <div class="relative z-10">
            <!-- Header with Vermilion Mini-Seal -->
            <div class="flex items-center justify-between pb-4 sm:pb-5 border-b pg-border gap-2">
              <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                <span class="seal-stamp text-base sm:text-lg px-2 py-0.5 shrink-0">易</span>
                <div class="min-w-0">
                  <h2 class="font-serif-kr text-base sm:text-xl lg:text-2xl pg-text font-bold whitespace-nowrap">
                    오늘의 주역 괘
                  </h2>
                  <p class="text-[11px] sm:text-xs pg-text-muted mt-0.5 truncate">하늘과 땅의 64가지 변화</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full badge-purple-pill border border-purple-500/30 text-[11px] sm:text-xs font-medium relative z-10 shrink-0 whitespace-nowrap shadow-xs backdrop-blur-xs">
                64괘 대나무 드로우
              </span>
            </div>

            <!-- Hexagram Preview Graphic (모자이크 셔플 조합 연출 & 우측 텍스트 순차 등장) -->
            <ClientOnly>
              <div class="mt-6 flex flex-col sm:flex-row items-center gap-6 pg-card-inner p-5 rounded-2xl border pg-border">
                <!-- 64괘 6효 그래픽 (모자이크 블러 ➔ 라인 조합) -->
                <div class="w-32 flex flex-col gap-1.5 py-1 select-none hex-mosaic-container" :class="{ 'is-active': isAnimated }">
                  <!-- 상괘 (6효: 음효) -->
                  <div class="flex gap-2 w-full hex-line-item hex-line-6" :class="{ 'is-active': isAnimated }">
                    <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
                    <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
                  </div>
                  <!-- 상괘 (5효: 양효) -->
                  <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-5" :class="{ 'is-active': isAnimated }"></div>
                  <!-- 상괘 (4효: 양효) -->
                  <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-4" :class="{ 'is-active': isAnimated }"></div>

                  <!-- 하괘 (3효: 양효) -->
                  <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-3" :class="{ 'is-active': isAnimated }"></div>
                  <!-- 하괘 (2효: 음효) -->
                  <div class="flex gap-2 w-full hex-line-item hex-line-2" :class="{ 'is-active': isAnimated }">
                    <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
                    <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
                  </div>
                  <!-- 하괘 (1효: 양효) -->
                  <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-1" :class="{ 'is-active': isAnimated }"></div>
                </div>

                <!-- 우측 텍스트 (괘가 도출된 후 서서히 등장) -->
                <div class="hex-text-fade-in" :class="{ 'is-active': isAnimated }">
                  <div class="text-xs trigram-badge-text font-bold font-serif-kr mb-1">3단계 대나무 점대 드로우</div>
                  <p class="text-xs pg-text-muted leading-relaxed">
                    하괘, 상괘, 동효를 마음을 담아 직접 선택하여 오늘 나에게 필요한 처세의 지혜를 구합니다.
                  </p>
                </div>
              </div>

              <!-- Quote Preview (괘가 도출된 후 함께 서서히 등장) -->
              <div class="mt-6 p-4 rounded-xl trigram-quote-box border-l-2 hex-text-fade-in hex-text-delay-quote" :class="{ 'is-active': isAnimated }">
                <p class="font-serif-kr text-xs sm:text-sm trigram-quote-text italic">
                  “상황에 맞추어 유연하게 순응하면 굳게 막혔던 난관이 스스로 풀려나갑니다.”
                </p>
              </div>
            </ClientOnly>
          </div>

          <!-- CTA Button (z-10) -->
          <div class="mt-8 relative z-10">
            <div class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white cta-purple-btn hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2">
              <span>☯️ 주역 괘 뽑으러 가기</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </NuxtLink>
      </section>

      <!-- 3. GUIDANCE SECTION -->
      <section class="gold-filament-card p-6 sm:p-8">
        <h3 class="font-serif-kr text-lg sm:text-xl lg:text-2xl font-bold pg-text-gold mb-4 text-center">💡 운세를 지혜롭게 대하는 마음가짐</h3>
        <div class="space-y-4 text-sm sm:text-base pg-text-muted leading-relaxed max-w-3xl mx-auto">
          <p class="font-bold">
            운세와 주역은 미래를 고정짓는 미신이 아니라 다가올 오늘 하루의 기운을 차분히 대비하는 마음의 거울입니다.
            길한 운은 감사히 활용하고, 삼가야 할 조언은 지혜롭게 대비하는 나침반으로 사용해 보세요.
          </p>

          <div class="mt-6 pt-6 border-t pg-border">
            <h4 class="font-serif-kr font-bold text-base pg-text mb-3">📖 사주명리란?</h4>
            <p>
              사주명리학은 생년월일시의 간지(干支)를 통해 타고난 성향과 운의 흐름을 파악하는 동양의 전통 학문입니다.
              60일주론과 오행(木火土金水)의 생극제화 이론을 바탕으로 일간(日干)의 특성을 분석하고,
              십신(十神)과 12운성을 통해 시간의 흐름에 따른 운세 변화를 해석합니다.
            </p>
          </div>

          <div class="mt-4">
            <h4 class="font-serif-kr font-bold text-base pg-text mb-3">☯️ 주역 64괘란?</h4>
            <p>
              주역은 3천 년 전부터 전해져 내려온 동양 최고의 지혜서로, 하늘(☰)과 땅(☷)의 조화를 8괘로 나타내고
              이를 조합하여 64가지 상황(64괘)을 설명합니다. 각 괘는 6개의 효(爻)로 구성되며,
              변화하는 효를 통해 현재 상황에서 미래로 나아가는 처세의 지혜를 제시합니다.
            </p>
          </div>

          <div class="mt-4">
            <h4 class="font-serif-kr font-bold text-base pg-text mb-3">🤖 AI 운세 해석</h4>
            <p>
              본 서비스는 전통 명리학과 주역의 원전 자료를 AI가 학습하여, 사용자의 생년월일과 고민에 맞춤화된
              해석을 제공합니다. 단순한 자동 생성이 아닌, 고전 원문의 의미를 현대적 상황에 적용한 실질적인
              조언으로 일상의 의사결정에 도움을 드립니다.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t pg-border flex flex-wrap justify-center gap-4 text-xs font-medium">
            <NuxtLink
              to="/guide/saju"
              :class="[
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors',
                'text-amber-800',
                'dark:text-[#FFDE9E]'
              ]"
            >
              <UIcon name="i-heroicons-academic-cap" :class="['w-4 h-4', 'text-amber-600', 'dark:text-amber-400']" />
              <span>사주명리학 기초 가이드 문서 ➔</span>
            </NuxtLink>
            <NuxtLink
              to="/guide/iching"
              :class="[
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors',
                'text-amber-800',
                'dark:text-[#FFDE9E]'
              ]"
            >
              <UIcon name="i-heroicons-sparkles" :class="['w-4 h-4', 'text-amber-600', 'dark:text-amber-400']" />
              <span>주역 64괘 원리 해설 문서 ➔</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 5. FOOTER STATS: 누적 방문 수 (화면 제일 아래 우측 배치) -->
      <footer class="flex justify-end items-center pt-4 pb-2 border-t pg-border text-xs">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full pg-card-inner border pg-border pg-text-muted shadow-2xs">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500/80"></span>
          <span>누적 방문 <span class="font-bold pg-text-gold">{{ totalViews.toLocaleString() }}</span>회</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
/* 오행 5대 기운 전용 텍스트 스타일 */
.elem-text-wood { color: #059669; }
.dark .elem-text-wood { color: #34d399; }

.elem-text-fire { color: #e11d48; }
.dark .elem-text-fire { color: #fb7185; }

.elem-text-earth { color: #d97706; }
.dark .elem-text-earth { color: #fbbf24; }

.elem-text-water { color: #0284c7; }
.dark .elem-text-water { color: #38bdf8; }

.badge-purple-pill {
  background-color: rgba(168, 85, 247, 0.1);
  color: #7e22ce;
}
.dark .badge-purple-pill {
  background-color: rgba(168, 85, 247, 0.2);
  color: #d8b4fe;
}

/* 주역 괘 그래픽 & 텍스트 전용 시맨틱 스타일 */
.trigram-bar-broken {
  background-color: #9333ea;
}
.dark .trigram-bar-broken {
  background-color: #c084fc;
}

.trigram-bar-solid {
  background: linear-gradient(to right, #9333ea, #4f46e5);
}
.dark .trigram-bar-solid {
  background: linear-gradient(to right, #c084fc, #818cf8);
}

.trigram-badge-text {
  color: #7e22ce;
}
.dark .trigram-badge-text {
  color: #fcd34d;
}

.trigram-quote-box {
  background-color: #faf5ff;
  border-color: #9333ea;
}
.dark .trigram-quote-box {
  background-color: rgba(58, 12, 99, 0.4);
  border-color: #fcd34d;
}

.trigram-quote-text {
  color: #581c87;
}
.dark .trigram-quote-text {
  color: #fde68a;
}

.cta-purple-btn {
  background: linear-gradient(to right, #7e22ce, #3730a3);
}

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

/* 주역 괘 모자이크 블러 & 순차 슬라이드 조립 애니메이션 */
@keyframes hexLineAssembleOdd {
  0% {
    opacity: 0;
    filter: blur(12px) brightness(220%);
    transform: translateX(-28px) scaleX(0.3);
  }
  60% {
    opacity: 0.8;
    filter: blur(3px) brightness(140%);
    transform: translateX(4px) scaleX(1.06);
  }
  100% {
    opacity: 1;
    filter: blur(0px) brightness(100%);
    transform: translateX(0) scaleX(1);
  }
}

@keyframes hexLineAssembleEven {
  0% {
    opacity: 0;
    filter: blur(12px) brightness(220%);
    transform: translateX(28px) scaleX(0.3);
  }
  60% {
    opacity: 0.8;
    filter: blur(3px) brightness(140%);
    transform: translateX(-4px) scaleX(1.06);
  }
  100% {
    opacity: 1;
    filter: blur(0px) brightness(100%);
    transform: translateX(0) scaleX(1);
  }
}

.hex-line-item {
  opacity: 0;
  will-change: transform, opacity, filter;
}

.hex-line-1.is-active, .hex-line-3.is-active, .hex-line-5.is-active {
  animation: hexLineAssembleOdd 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hex-line-2.is-active, .hex-line-4.is-active, .hex-line-6.is-active {
  animation: hexLineAssembleEven 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* 1효(맨 아래) -> 6효(맨 위) 순차 조립 딜레이 */
.hex-line-1.is-active { animation-delay: 0.15s; }
.hex-line-2.is-active { animation-delay: 0.35s; }
.hex-line-3.is-active { animation-delay: 0.55s; }
.hex-line-4.is-active { animation-delay: 0.75s; }
.hex-line-5.is-active { animation-delay: 0.95s; }
.hex-line-6.is-active { animation-delay: 1.15s; }

@keyframes hexTextFadeInUp {
  0% {
    opacity: 0;
    filter: blur(4px);
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

.hex-text-fade-in {
  opacity: 0;
  will-change: transform, opacity, filter;
}

.hex-text-fade-in.is-active {
  animation: hexTextFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 1.45s; /* 괘 6개가 모두 도출된 후 우측 텍스트 등장 */
}

.hex-text-delay-quote.is-active {
  animation-delay: 1.75s; /* 텍스트 도출 후 명언 상자 등장 */
}

/* 물음표 아이콘 좌우 흔들림 + 오행 4색(녹색->빨강->금색->파랑) 순환 애니메이션 */
@keyframes element-color-swing {
  0% {
    stroke: #16a34a;
    filter: drop-shadow(0 0 10px rgba(22, 163, 74, 0.8));
    transform: rotate(-10deg);
  }
  25% {
    stroke: #dc2626;
    filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.8));
    transform: rotate(10deg);
  }
  50% {
    stroke: #f59e0b;
    filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.8));
    transform: rotate(-10deg);
  }
  75% {
    stroke: #0284c7;
    filter: drop-shadow(0 0 10px rgba(2, 132, 199, 0.8));
    transform: rotate(10deg);
  }
  100% {
    stroke: #16a34a;
    filter: drop-shadow(0 0 10px rgba(22, 163, 74, 0.8));
    transform: rotate(-10deg);
  }
}

.animate-element-color-swing {
  animation: element-color-swing 7s ease-in-out infinite;
  transform-origin: center center;
}
</style>