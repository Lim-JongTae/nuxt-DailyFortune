<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/`
const fortuneTitle = '일일운세 ✦ 天命'
const fortuneDesc = '피흉추길(避凶趨吉·재앙을 피하고 길함을 쫓음)의 지혜. 사주명리와 주역 64괘로 보는 오늘의 맞춤 운세.'

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
        description: fortuneDesc,
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

// KST 오늘 일진 간지 및 오행 기운 동적 계산 (단일 중앙 유틸리티 getTodaySajuSummary 연동)
import { getTodaySajuSummary } from '~/utils/saju'

const sajuSummary = computed(() => getTodaySajuSummary())

const todayGanzhiText = computed(() => sajuSummary.value.ganzhi)
const todayElementSentence = computed(() => sajuSummary.value.todayElementSentence)
const elementBadge = computed(() => sajuSummary.value.elementBadge)
const elementRatios = computed(() => sajuSummary.value.elementRatios)

// 오늘 사주 운세 점수 (0% / 0도 -> 88% / 88점 카운트업 & 게이지 그리기 애니메이션)
const animatedScore = ref(0)
const strokeDashoffset = ref(100) // 100 = 0% (0도)
const targetScore = 88

// 탭 선택 상태: 'saju' | 'iching' | 'match'
const activeTab = ref<'saju' | 'iching' | 'match'>('saju')

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const activeBtnStyle = (tab: 'saju' | 'iching' | 'match') => {
  if (tab === 'saju') {
    return isDark.value
      ? { backgroundImage: 'linear-gradient(to right, #b45309, #d97706, #f59e0b)', borderColor: '#f59e0b', color: '#fef3c7' }
      : { backgroundImage: 'linear-gradient(to right, #fde68a, #fcd34d, #facc15)', borderColor: '#fcd34d', color: '#451a03' }
  } else if (tab === 'iching') {
    return isDark.value
      ? { backgroundImage: 'linear-gradient(to right, #6b21a8, #7e22ce, #9333ea)', borderColor: '#9333ea', color: '#f3e8ff' }
      : { backgroundImage: 'linear-gradient(to right, #e9d5ff, #d8b4fe, #c084fc)', borderColor: '#c084fc', color: '#3b0764' }
  } else {
    return isDark.value
      ? { backgroundImage: 'linear-gradient(to right, #9f1239, #be123c, #e11d48)', borderColor: '#e11d48', color: '#ffe4e6' }
      : { backgroundImage: 'linear-gradient(to right, #fecdd3, #fda4af, #fb7185)', borderColor: '#fb7185', color: '#4c0519' }
  }
}

const inactiveBtnStyle = computed(() => isDark.value
  ? { borderColor: 'rgba(255, 255, 255, 0.15)', color: '#94a3b8' }
  : { borderColor: 'rgba(0, 0, 0, 0.12)', color: '#64748b' }
)

// 실시간 방문자 수 및 누적 방문 카운터 (0명 시작)
const todayViews = ref(0)
const totalViews = ref(0)

// 브라우저 마운트 완료 후 괘 애니메이션 시작 제어 (SSR 미리 동작 방지)
const isAnimated = ref(false)

onMounted(async () => {
  setTimeout(() => {
    isAnimated.value = true
  }, 100)

  // 방문자 통계 데이터 로드 (useVisitorStats 컴포저블 공유로 중복 API 호출 방지)
  try {
    const { fetchStats } = useVisitorStats()
    const res = await fetchStats()
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
      <section v-reveal class="relative pt-6 pb-12 text-center flex flex-col items-center overflow-hidden">
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
            생년월일로 살펴보는 하루의 흐름과 오행의 균형, 그리고 64괘의 괘상이 전하는 선택의 지혜를 만나 보세요.
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

      <!-- 2. THREE-WAY TAB BUTTONS (guide/index 방식) -->
      <section v-reveal class="space-y-6">
        <div class="flex gap-1.5 sm:gap-4 max-w-2xl mx-auto w-full">
          <button
            type="button"
            id="tab-saju"
            @click="activeTab = 'saju'"
            class="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-serif-kr transition-all duration-200 border cursor-pointer whitespace-nowrap"
            :class="activeTab === 'saju' ? 'shadow-md scale-[1.02]' : 'hover:opacity-80'"
            :style="activeTab === 'saju' ? activeBtnStyle('saju') : inactiveBtnStyle"
          >
            <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span class="truncate">오늘의 사주</span>
          </button>
          <button
            type="button"
            id="tab-iching"
            @click="activeTab = 'iching'"
            class="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-serif-kr transition-all duration-200 border cursor-pointer whitespace-nowrap"
            :class="activeTab === 'iching' ? 'shadow-md scale-[1.02]' : 'hover:opacity-80'"
            :style="activeTab === 'iching' ? activeBtnStyle('iching') : inactiveBtnStyle"
          >
            <UIcon name="i-heroicons-book-open" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span class="truncate">오늘의 주역</span>
          </button>
          <button
            type="button"
            id="tab-match"
            @click="activeTab = 'match'"
            class="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-serif-kr transition-all duration-200 border cursor-pointer whitespace-nowrap"
            :class="activeTab === 'match' ? 'shadow-md scale-[1.02]' : 'hover:opacity-80'"
            :style="activeTab === 'match' ? activeBtnStyle('match') : inactiveBtnStyle"
          >
            <UIcon name="i-heroicons-heart" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span class="truncate">인연 사주궁합</span>
          </button>
        </div>

        <!-- 탭 콘텐츠 전환 -->
        <Transition name="fade-tab" mode="out-in">
          <HomeSaju v-if="activeTab === 'saju'" key="saju" />
          <HomeIching v-else-if="activeTab === 'iching'" key="iching" />
          <HomeMatch v-else key="match" />
        </Transition>
      </section>

      <!-- 3. GUIDANCE SECTION -->
      <section v-reveal class="gold-filament-card p-6 sm:p-8">
        <h3 class="font-serif-kr text-md sm:text-xl lg:text-2xl font-bold pg-text-gold mb-4 text-center">💡 운세를 지혜롭게 대하는 마음가짐</h3>
        <div class="space-y-4 text-xs sm:text-md pg-text-muted leading-relaxed max-w-3xl mx-auto">
          <p class="font-bold">
            한 치 앞을 알 수 없는 인생은 선택의 연속입니다. 매번 최선을 고를 수는 없어도 괜찮습니다. 지금 할 수 있는 차선을 고르는 지혜면 충분합니다.
사주와 주역이 선택 앞에서 잠시 멈추어 생각해 보는 쉼표가 되기를 바랍니다. 그리고 모두의 하루가 조금 더 행복해지기를 소망합니다.
          </p>

          <div class="mt-6 pt-6 border-t pg-border">
            <Transition name="fade-tab" mode="out-in">
              <HomeGuidanceIching v-if="activeTab === 'iching'" key="guidance-iching" />
              <HomeGuidanceSaju v-else key="guidance-saju" />
            </Transition>
          </div>
        </div>
      </section>

      <!-- 5. FOOTER STATS: 누적 방문 수 (화면 제일 아래 우측 배치) -->
      <footer v-reveal class="flex justify-end items-center pt-4 pb-2 border-t pg-border text-xs">
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

/* Fade tab transition */
.fade-tab-enter-active,
.fade-tab-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.fade-tab-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-tab-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>