<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const codeParam = computed(() => String(route.params.code || 'gap-ja').toLowerCase())

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/saju/ilju/${codeParam.value}`

interface IljuNavSummary {
  code: string
  ganzhi: string
  ganzhiHanja: string
  order: number
}

interface SajuIljuDetailResponse {
  order: number
  code: string
  ganzhi: string
  ganzhiHanja: string
  stem: string
  stemHanja: string
  stemElement: string
  stemColor: 'wood' | 'fire' | 'earth' | 'metal' | 'water'
  branch: string
  branchHanja: string
  branchElement: string
  branchColor: 'wood' | 'fire' | 'earth' | 'metal' | 'water'
  branchAnimal: string
  mulsang: string
  character: string
  shipsinSelf: string
  jijanggan: string
  twelveStar: string
  sinsal: string
  careerFortune: string
  wealthFortune: string
  romanceAdvice: string
  healthFortune: string
  lifeAdvice: string
  bestMatch: string[]
  cautionMatch: string[]
  faqList: Array<{ q: string; a: string }>
  prevIlju?: IljuNavSummary | null
  nextIlju?: IljuNavSummary | null
}

interface ApiResponse {
  success: boolean
  data?: SajuIljuDetailResponse
  message?: string
}

// 0.001초 초고속 로컬 인메모리 API 조회
const { data: apiResponse, status } = await useAsyncData<ApiResponse>(
  `saju-ilju-guide-detail-${codeParam.value}`,
  () => $fetch<ApiResponse>(`/api/saju/ilju/${codeParam.value}`),
  { watch: [codeParam] }
)

const iljuData = computed(() => apiResponse.value?.data)

// 오행 컬러 뱃지 스타일 맵
const elementColorClassMap: Record<string, { badge: string; text: string }> = {
  wood: {
    badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
    text: 'text-emerald-700 dark:text-emerald-300'
  },
  fire: {
    badge: 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300',
    text: 'text-rose-700 dark:text-rose-300'
  },
  earth: {
    badge: 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300',
    text: 'text-amber-700 dark:text-amber-300'
  },
  metal: {
    badge: 'bg-slate-500/15 border-slate-500/40 text-slate-700 dark:text-slate-300',
    text: 'text-slate-700 dark:text-slate-300'
  },
  water: {
    badge: 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300',
    text: 'text-blue-700 dark:text-blue-300'
  }
}

// SEO 메타 태그
const pageTitle = computed(() => {
  if (!iljuData.value) return '사주 60일주 실전 처세 가이드'
  return `${iljuData.value.ganzhi}일주(${iljuData.value.ganzhiHanja}) 정통 성향과 4대 운세 실전 처세 가이드 | 사주 60일주론`
})

const pageDesc = computed(() => {
  if (!iljuData.value) return '사주명리 60일주 정통 물상론, 지장간, 십신, 4대 운세 및 처세 조언 해설'
  return `${iljuData.value.ganzhi}일주(${iljuData.value.ganzhiHanja}) - ${iljuData.value.mulsang}. 천간 ${iljuData.value.stemElement}과 지지 ${iljuData.value.branchElement}의 결합. 직업, 재물, 애정, 건강 운세와 실전 개운법.`
})

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image'
})

useHead(() => {
  const schemaList: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: pageTitle.value,
      description: pageDesc.value,
      url: pageUrl,
      inLanguage: 'ko-KR'
    }
  ]

  if (iljuData.value?.faqList && iljuData.value.faqList.length > 0) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: iljuData.value.faqList.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    })
  }

  return {
    link: [
      { rel: 'canonical', href: pageUrl }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schemaList)
      }
    ]
  }
})
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-16 sm:pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-2xl mx-auto px-3.5 sm:px-4 py-3 sm:py-6">

      <!-- 1. 상단 네비게이션 헤더 -->
      <header class="flex items-center justify-between pb-2.5 sm:pb-3 border-b pg-border mb-3 sm:mb-4">
        <NuxtLink
          to="/guide/saju"
          class="p-1.5 rounded-full pg-back-btn transition-colors flex items-center gap-1 text-xs font-bold pg-text hover:text-(--fortune-gold)"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          <span>60일주 목록</span>
        </NuxtLink>
        <div class="text-center">
          <span class="text-[11px] font-bold tracking-widest pg-text-gold block uppercase">
            사주 60일주 실전 처세 가이드
          </span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            {{ iljuData?.ganzhi || '일주' }} ({{ iljuData?.ganzhiHanja || '柱' }})
          </h1>
        </div>
        <NuxtLink
          to="/"
          class="p-1.5 rounded-full pg-text-gold hover:opacity-80 transition-opacity"
          title="메인 홈으로 이동"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5" />
        </NuxtLink>
      </header>

      <!-- 2. 로딩 상태 스켈레톤 (Skeleton UI) -->
      <div v-if="status === 'pending'" class="space-y-3.5 sm:space-y-6 animate-pulse" aria-busy="true" aria-label="일주 자료를 불러오는 중입니다">
        <div class="pg-card border rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div class="h-5 w-28 skeleton-bar rounded-full"></div>
          <div class="h-8 w-44 skeleton-bar rounded-lg"></div>
          <div class="h-4 w-full skeleton-bar rounded-md"></div>
          <div class="h-4 w-3/4 skeleton-bar rounded-md"></div>
        </div>
        <div class="pg-card border rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
          <div class="h-5 w-36 skeleton-bar rounded-md"></div>
          <div class="h-16 w-full skeleton-bar rounded-xl"></div>
        </div>
      </div>

      <!-- 3. 메인 콘텐츠 (데이터 로드 완료 시) -->
      <main v-else-if="iljuData" class="space-y-3 sm:space-y-4.5">

        <!-- [카드 1] 메인 일주 정보 Hero 카드 (천간 + 지지 오행 비주얼 & 워터마크 줌) -->
        <section class="pg-card border rounded-3xl p-4 sm:p-5.5 shadow-xl relative overflow-hidden">
          <!-- 배경 워터마크 한자 (줌 호흡 애니메이션) -->
          <div
            class="absolute left-[54%] sm:left-1/2 top-[44%] sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pg-watermark-text animate-watermark-zoom text-4xl sm:text-5xl md:text-6xl font-serif-kr select-none pointer-events-none tracking-tight leading-none whitespace-nowrap opacity-15"
            aria-hidden="true"
          >
            {{ iljuData.ganzhiHanja }}
          </div>

          <div class="relative z-20">
            <!-- 상단 메타 라벨 -->
            <div class="flex items-center justify-between mb-2.5">
              <span class="px-2.5 sm:px-3 py-0.5 rounded-full pg-card-inner border pg-border text-xs font-bold pg-text-gold">
                육십갑자 제{{ iljuData.order }}일주
              </span>
              <span class="text-xs font-semibold pg-text-muted">
                {{ iljuData.branchAnimal }}의 해 · {{ iljuData.twelveStar }}
              </span>
            </div>

            <!-- 천간 & 지지 오행 조합 비주얼 박스 -->
            <div
              class="p-3.5 sm:p-4 rounded-2xl border pg-border mb-3 flex items-center justify-between gap-3 relative z-20 backdrop-blur-xs"
              :class="['bg-white/5', 'dark:bg-black/15']"
            >
              <div>
                <div class="flex items-baseline gap-2 mb-1">
                  <h2 class="font-serif-kr text-2xl sm:text-3xl font-extrabold pg-text tracking-tight drop-shadow-xs">
                    {{ iljuData.ganzhi }}
                  </h2>
                  <span class="font-serif-kr text-lg sm:text-xl font-bold pg-text-gold">
                    ({{ iljuData.ganzhiHanja }})
                  </span>
                </div>
                <p class="text-xs font-medium pg-text-soft">
                  {{ iljuData.mulsang }}
                </p>
              </div>

              <!-- 오행 시각화 태그 (천간 + 지지) -->
              <div class="flex flex-col gap-1.5 shrink-0 items-end">
                <div class="flex items-center gap-1.5 text-xs font-bold">
                  <span class="text-[10px] pg-text-muted">천간</span>
                  <span
                    class="px-2 py-0.5 rounded-lg border font-serif-kr"
                    :class="elementColorClassMap[iljuData.stemColor]?.badge"
                  >
                    {{ iljuData.stemHanja }} {{ iljuData.stemElement }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5 text-xs font-bold">
                  <span class="text-[10px] pg-text-muted">지지</span>
                  <span
                    class="px-2 py-0.5 rounded-lg border font-serif-kr"
                    :class="elementColorClassMap[iljuData.branchColor]?.badge"
                  >
                    {{ iljuData.branchHanja }} {{ iljuData.branchElement }} ({{ iljuData.branchAnimal }})
                  </span>
                </div>
              </div>
            </div>

            <!-- 십신 / 십이운성 / 신살 요약 뱃지 그리드 -->
            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="p-2 rounded-xl pg-card-inner border pg-border">
                <span class="text-[10px] pg-text-muted block mb-0.5">일지 십신</span>
                <strong class="pg-text-gold font-bold text-xs">{{ iljuData.shipsinSelf }}</strong>
              </div>
              <div class="p-2 rounded-xl pg-card-inner border pg-border">
                <span class="text-[10px] pg-text-muted block mb-0.5">십이운성</span>
                <strong class="pg-text font-bold text-xs">{{ iljuData.twelveStar }}</strong>
              </div>
              <div class="p-2 rounded-xl pg-card-inner border pg-border">
                <span class="text-[10px] pg-text-muted block mb-0.5">주요 신살</span>
                <strong class="pg-text font-bold text-xs truncate block" :title="iljuData.sinsal || '특이 신살 없음'">
                  {{ iljuData.sinsal || '특이 신살 없음' }}
                </strong>
              </div>
            </div>

            <!-- 핵심 기질 인용문 -->
            <div
              class="mt-3 p-3 rounded-2xl border pg-border backdrop-blur-xs"
              :class="['bg-white/10', 'dark:bg-black/10']"
            >
              <p class="text-xs sm:text-sm font-semibold pg-text-gold leading-relaxed">
                "{{ iljuData.character }}"
              </p>
            </div>
          </div>
        </section>

        <!-- [카드 2] 정통 물상론(物象論) & 기본 기질 해설 -->
        <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
          <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">1. 대자연의 형상과 정통 물상론(物象論)</h3>
          </div>

          <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 pg-text-gold">물상 형상 해석</span>
              <span class="text-[10px] pg-text-muted">적천수·궁통보감 명리 고전</span>
            </div>
            <p class="font-serif-kr text-xs sm:text-sm pg-text font-semibold leading-relaxed border-l-2 border-amber-500/40 pl-3">
              {{ iljuData.mulsang }}
            </p>
            <p class="text-xs sm:text-sm pg-text leading-relaxed font-normal pt-1">
              {{ iljuData.character }}
            </p>
          </div>
        </section>

        <!-- [광고 1] 본문 상단 AdSense 슬롯 -->
        <AdSense adSlot="saju-guide-top" />

        <!-- [카드 3] 지장간(支藏干) 구조 및 십신(十神) 심층 분석 -->
        <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
          <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
            <UIcon name="i-heroicons-eye" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">2. 지장간(支藏干) 구조와 숨겨진 내면 심리</h3>
          </div>

          <div class="space-y-2 text-xs">
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold pg-text-gold">지장간(支藏干)의 구성</span>
                <span class="text-[10px] pg-text-muted">지지 속 숨겨진 천간 기운</span>
              </div>
              <p class="font-serif-kr text-xs sm:text-sm font-semibold pg-text">
                {{ iljuData.jijanggan }}
              </p>
            </div>

            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold pg-text-gold">일지 십신({{ iljuData.shipsinSelf }})의 심리적 발현</span>
                <span class="text-[10px] pg-text-muted">자아와 무의식</span>
              </div>
              <p class="pg-text-muted leading-relaxed font-normal">
                일지(배우자 자리이자 내면의 안식처)에 자리 잡은 <strong class="pg-text font-medium">{{ iljuData.shipsinSelf }}</strong>의 성분은 평소 의식하지 못하는 깊은 무의식과 가치관을 지배합니다. 외부 환경이 위급하거나 편안한 상태에서 이 기운이 자연스럽게 표출됩니다.
              </p>
            </div>
          </div>
        </section>

        <!-- [카드 4] 십이운성(十二運星)과 인생 기세 -->
        <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
          <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">3. 십이운성({{ iljuData.twelveStar }})과 에너지 흐름</h3>
          </div>

          <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1.5 text-xs">
            <p class="font-serif-kr text-xs sm:text-sm font-semibold pg-text-gold">
              자좌 십이운성: {{ iljuData.twelveStar }}<span v-if="iljuData.sinsal"> · 주요 신살: {{ iljuData.sinsal }}</span>
            </p>
            <p class="pg-text-muted leading-relaxed font-normal">
              십이운성은 천간이 지지를 만나 발휘하는 생로병사의 에너지 사이클입니다. {{ iljuData.ganzhi }}일주는 <strong class="pg-text font-medium">{{ iljuData.twelveStar }}</strong>의 기운을 바탕으로 사회적 활동에서 자신만의 고유한 활력과 리듬을 만들어냅니다.
            </p>
          </div>
        </section>

        <!-- [카드 5] 4대 분야별 정밀 실전 운세 (직업, 재물, 애정, 건강) -->
        <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
          <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
            <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">4. 4대 분야별 정밀 실전 운세</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            <!-- 사업/직업운 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-heroicons-briefcase" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">사업 · 적성 분야</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ iljuData.careerFortune }}
              </p>
            </div>

            <!-- 재물/투자운 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-heroicons-banknotes" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">재물 · 자산 관리</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ iljuData.wealthFortune }}
              </p>
            </div>

            <!-- 인간관계/애정운 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-heroicons-heart" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">인간관계 · 애정 조언</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ iljuData.romanceAdvice }}
              </p>
            </div>

            <!-- 건강/심신 조언 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">건강 · 심신 관리</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ iljuData.healthFortune }}
              </p>
            </div>
          </div>
        </section>

        <!-- [광고 2] 본문 중간 AdSense 슬롯 -->
        <AdSense adSlot="saju-guide-mid" />

        <!-- [카드 6] 실전 처세 지침 및 개운법(開運法) -->
        <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
          <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
            <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">5. 일주 맞춤 실전 처세 및 개운법(開運法)</h3>
          </div>

          <div
            class="p-3 sm:p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs leading-relaxed"
            :class="['text-amber-950', 'dark:text-amber-200']"
          >
            <p class="font-normal">{{ iljuData.lifeAdvice }}</p>
          </div>
        </section>

        <!-- [카드 7] 상생과 조화의 궁합 일주 -->
        <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
          <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
            <UIcon name="i-heroicons-user-group" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">6. 상생과 조화의 궁합 일주 분석</h3>
          </div>

          <div class="space-y-2 text-xs">
            <!-- 최고의 천지합덕 궁합 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center gap-1.5 font-bold pg-text-gold">
                <UIcon name="i-heroicons-check-badge" class="w-4 h-4 text-emerald-500" />
                <span>천생연분 최고의 궁합 (天地合德)</span>
              </div>
              <ul class="space-y-1 pl-1">
                <li v-for="(bm, idx) in iljuData.bestMatch" :key="idx" class="pg-text leading-relaxed">
                  • {{ bm }}
                </li>
              </ul>
            </div>

            <!-- 주의해야 할 일주 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center gap-1.5 font-bold pg-text-soft">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-500" />
                <span>서로 배려가 필요한 관계 (沖/刑/破)</span>
              </div>
              <ul class="space-y-1 pl-1">
                <li v-for="(cm, idx) in iljuData.cautionMatch" :key="idx" class="pg-text-muted leading-relaxed">
                  • {{ cm }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- [카드 8] 자주 묻는 질문 FAQ (아코디언 및 Schema.org 연동) -->
        <section v-if="iljuData.faqList?.length" v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
          <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">7. 자주 묻는 질문 FAQ</h3>
          </div>

          <div class="space-y-2">
            <details
              v-for="(faq, idx) in iljuData.faqList"
              :key="idx"
              class="group p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border cursor-pointer transition-colors open:border-amber-500/40"
            >
              <summary class="font-bold text-xs pg-text flex items-center justify-between list-none cursor-pointer">
                <span class="flex items-center gap-2">
                  <span class="text-amber-500 font-extrabold text-sm">Q.</span>
                  <span>{{ faq.q }}</span>
                </span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 pg-text-gold transition-transform group-open:rotate-180" />
              </summary>
              <div class="mt-2 pt-1.5 border-t pg-border text-xs pg-text-muted leading-relaxed font-normal">
                <strong class="pg-text-gold">A.</strong> {{ faq.a }}
              </div>
            </details>
          </div>
        </section>

        <!-- [네비게이션] 60갑자 이전/다음 일주 바로가기 -->
        <nav class="flex items-center justify-between gap-2 pt-2" aria-label="이전 및 다음 일주">
          <NuxtLink
            v-if="iljuData.prevIlju"
            :to="`/guide/saju/ilju/${iljuData.prevIlju.code}`"
            class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border pg-border pg-card-inner text-xs font-bold pg-text hover:border-(--fortune-gold) transition-colors flex items-center justify-start gap-1.5 cursor-pointer"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-4 h-4 pg-text-gold shrink-0" />
            <div class="text-left overflow-hidden">
              <span class="text-[9px] pg-text-muted block">이전 일주</span>
              <strong class="pg-text truncate block font-serif-kr">
                제{{ iljuData.prevIlju.order }}일주 {{ iljuData.prevIlju.ganzhi }} ({{ iljuData.prevIlju.ganzhiHanja }})
              </strong>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/guide/saju"
            class="py-2.5 sm:py-3 px-3 rounded-xl border pg-border pg-card-inner text-xs font-bold pg-text-gold hover:border-(--fortune-gold) transition-colors flex items-center justify-center shrink-0"
            title="60일주 전체 목록"
          >
            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
          </NuxtLink>

          <NuxtLink
            v-if="iljuData.nextIlju"
            :to="`/guide/saju/ilju/${iljuData.nextIlju.code}`"
            class="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border pg-border pg-card-inner text-xs font-bold pg-text hover:border-(--fortune-gold) transition-colors flex items-center justify-end gap-1.5 cursor-pointer"
          >
            <div class="text-right overflow-hidden">
              <span class="text-[9px] pg-text-muted block">다음 일주</span>
              <strong class="pg-text truncate block font-serif-kr">
                제{{ iljuData.nextIlju.order }}일주 {{ iljuData.nextIlju.ganzhi }} ({{ iljuData.nextIlju.ganzhiHanja }})
              </strong>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 pg-text-gold shrink-0" />
          </NuxtLink>
        </nav>

        <!-- 60일주 목록 및 홈으로 이동 버튼 -->
        <div v-reveal class="pt-2 sm:pt-4 flex flex-wrap justify-center items-center gap-3 w-full text-center">
          <NuxtLink to="/guide/saju" class="btn-gold-action">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
            <span>60일주 목록으로 이동</span>
          </NuxtLink>
          <NuxtLink to="/" class="btn-gold-action">
            <UIcon name="i-heroicons-home" class="w-4 h-4" />
            <span>홈으로 이동</span>
          </NuxtLink>
        </div>

      </main>

    </div>
  </div>
</template>
