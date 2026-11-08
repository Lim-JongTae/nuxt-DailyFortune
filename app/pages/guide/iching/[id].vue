<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const route = useRoute()
const hexId = computed(() => Math.min(64, Math.max(1, parseInt(String(route.params.id || '1'), 10))))

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/iching/${hexId.value}`

// 고밀도 주역 괘 데이터 인터페이스
interface LineDetail {
  lineNumber?: number
  n?: number
  nameHanja: string
  nameKorean: string
  textHanja: string
  textKorean: string
  traditionalInterp?: string
  scene?: string
  modernAdvice?: string
}

interface HexDetailData {
  id: number
  slug: string
  nameKorean: string
  nameHanji: string
  desc: string
  meaning?: string
  upperTrigram?: string
  lowerTrigram?: string
  guaCi: string
  tuanZhuan: string
  tuanExplanation?: string
  xiangZhuan: string
  xiangLesson?: string
  xuGuaZhuan?: string
  prevNextCompare?: string
  businessFate?: string
  wealthFate?: string
  loveFate?: string
  healthFate?: string
  lines?: LineDetail[]
  faqList?: Array<{ q: string; a: string }>
  isEnhanced?: boolean
  content?: {
    summary: string
    structureNote: string
    idioms: Array<{ phrase: string; source: string; note: string }>
    fields: {
      career: string
      wealth: string
      love: string
      health: string
    }
    lineOverview: string
    lines: Array<{
      n: number
      nameHanja: string
      nameKorean: string
      textHanja: string
      textKorean: string
      traditionalInterp: string
      scene: string
      modernAdvice: string
    }>
    compareWith: Array<{ id: number; name: string; diff: string }>
    misconceptions: string
    faq: Array<{ q: string; a: string }>
    sources: string[]
    reviewedAt: string
  }
  prevHexagram?: { id: number; nameKorean: string; slug: string } | null
  nextHexagram?: { id: number; nameKorean: string; slug: string } | null
}

interface ApiResponse {
  success: boolean
  data?: HexDetailData
  message?: string
}

const { data: apiResponse, status } = await useAsyncData<ApiResponse>(
  `iching-guide-detail-${hexId.value}`,
  () => $fetch<ApiResponse>(`/api/iching/${hexId.value}`),
  { watch: [hexId] }
)

const hexData = computed(() => apiResponse.value?.data)

// SEO 메타 태그 및 Schema.org 구조화 데이터
const pageTitle = computed(() => {
  const name = hexData.value?.nameKorean || `제${hexId.value}괘`
  const hanja = hexData.value?.nameHanji || ''
  return `제${hexId.value}괘 ${name}(${hanja}) 실전 처세 가이드 | 주역 64괘 비결`
})

const pageDesc = computed(() => {
  if (!hexData.value) return '주역 64괘 해설 및 384효 실전 처세 가이드'
  if (hexData.value.content?.summary) {
    return `${hexData.value.nameKorean}(${hexData.value.nameHanji}) - ${hexData.value.content.summary.slice(0, 140)}...`
  }
  return `${hexData.value.nameKorean}(${hexData.value.nameHanji}) - ${hexData.value.desc}. 괘사, 단전, 상전, 4대 부문별 운세와 6개 효사 원문 및 현대적 실전 처세 조언.`
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

  const activeFaqs = hexData.value?.content?.faq || hexData.value?.faqList || []
  if (activeFaqs.length > 0) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: activeFaqs.map(faq => ({
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

// 8괘 기호 및 이름 맵
const trigramSymbols: Record<number, { symbol: string; name: string }> = {
  1: { symbol: '☰', name: '건(乾)' },
  2: { symbol: '☱', name: '태(兌)' },
  3: { symbol: '☲', name: '이(離)' },
  4: { symbol: '☳', name: '진(震)' },
  5: { symbol: '☴', name: '손(巽)' },
  6: { symbol: '☵', name: '감(坎)' },
  7: { symbol: '☶', name: '간(艮)' },
  8: { symbol: '☷', name: '곤(坤)' }
}

const trigramLinesMap: Record<number, [number, number, number]> = {
  1: [1, 1, 1], // 건
  2: [1, 1, 0], // 태
  3: [1, 0, 1], // 이
  4: [1, 0, 0], // 진
  5: [0, 1, 1], // 손
  6: [0, 1, 0], // 감
  7: [0, 0, 1], // 간
  8: [0, 0, 0]  // 곤
}

const hexagramTrigramIds: Record<number, [number, number]> = {
  1: [1, 1], 2: [8, 8], 3: [6, 4], 4: [7, 6], 5: [6, 1], 6: [1, 6], 7: [8, 6], 8: [6, 8],
  9: [5, 1], 10: [1, 2], 11: [8, 1], 12: [1, 8], 13: [1, 3], 14: [3, 1], 15: [8, 7], 16: [4, 8],
  17: [2, 4], 18: [7, 5], 19: [8, 2], 20: [5, 8], 21: [3, 4], 22: [7, 3], 23: [7, 8], 24: [8, 4],
  25: [1, 4], 26: [7, 1], 27: [7, 4], 28: [2, 5], 29: [6, 6], 30: [3, 3], 31: [2, 7], 32: [4, 5],
  33: [1, 7], 34: [4, 1], 35: [3, 8], 36: [8, 3], 37: [5, 3], 38: [3, 2], 39: [6, 7], 40: [4, 6],
  41: [7, 2], 42: [5, 4], 43: [2, 1], 44: [1, 5], 45: [2, 8], 46: [8, 5], 47: [2, 6], 48: [6, 5],
  49: [2, 3], 50: [3, 5], 51: [4, 4], 52: [7, 7], 53: [5, 7], 54: [4, 2], 55: [4, 3], 56: [3, 7],
  57: [5, 5], 58: [2, 2], 59: [5, 6], 60: [6, 2], 61: [5, 2], 62: [4, 7], 63: [6, 3], 64: [3, 6]
}

const currentTrigramInfo = computed(() => {
  const [uId, lId] = hexagramTrigramIds[hexId.value] || [1, 1]
  return {
    upper: trigramSymbols[uId] || { symbol: '☰', name: '건' },
    lower: trigramSymbols[lId] || { symbol: '☰', name: '건' }
  }
})

const currentHexagramSixLines = computed<number[]>(() => {
  const [uId, lId] = hexagramTrigramIds[hexId.value] || [1, 1]
  const lower = trigramLinesMap[lId] || [1, 1, 1]
  const upper = trigramLinesMap[uId] || [1, 1, 1]
  return [...lower, ...upper]
})

const prevHexId = computed(() => (hexId.value > 1 ? hexId.value - 1 : 64))
const nextHexId = computed(() => (hexId.value < 64 ? hexId.value + 1 : 1))

const selectedLineTab = ref<number>(0)
const isHexAnimated = ref(false)

// FAQ 아코디언 상태 (처음에는 모두 닫힘: null)
const openFaqIndex = ref<number | null>(null)
const toggleFaq = (idx: number) => {
  openFaqIndex.value = openFaqIndex.value === idx ? null : idx
}

const triggerHexAnimation = () => {
  isHexAnimated.value = false
  nextTick(() => {
    setTimeout(() => {
      isHexAnimated.value = true
    }, 60)
  })
}

onMounted(() => {
  triggerHexAnimation()
})

watch(hexId, () => {
  triggerHexAnimation()
  openFaqIndex.value = null
})
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-20 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

      <!-- 1. 상단 네비게이션 헤더 -->
      <header :class="['flex items-center justify-between pb-4 border-b mb-6', 'border-slate-200', 'dark:border-slate-800']">
        <NuxtLink
          to="/guide/iching"
          :class="[
            'p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm font-bold',
            'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800',
            'dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-950/40 dark:hover:text-amber-300'
          ]"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          <span>주역 64괘 목록</span>
        </NuxtLink>

        <!-- 이전/다음 괘 바로가기 -->
        <div class="flex items-center gap-2">
          <NuxtLink
            :to="`/guide/iching/${prevHexId}`"
            :class="[
              'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1',
              'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
              'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
            ]"
            :title="`제${prevHexId}괘로 이동`"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">이전 괘</span>
          </NuxtLink>
          <span class="text-xs font-serif-kr font-bold pg-text-gold px-1">
            제{{ hexId }}괘 / 64
          </span>
          <NuxtLink
            :to="`/guide/iching/${nextHexId}`"
            :class="[
              'px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1',
              'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
              'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
            ]"
            :title="`제${nextHexId}괘로 이동`"
          >
            <span class="hidden sm:inline">다음 괘</span>
            <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </header>

      <!-- 로딩 상태 -->
      <div v-if="status === 'pending'" class="py-20 text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto text-amber-500 mb-3" />
        <p class="text-sm pg-text-muted">주역 정통 비결 데이터를 불러오는 중입니다...</p>
      </div>

      <!-- 메인 괘 정보 콘텐츠 -->
      <main v-else-if="hexData" class="space-y-8">

        <!-- 2. 괘 타이틀 및 괘상 엠블럼 히어로 카드 -->
        <section
          :class="[
            'p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden transition-all',
            'bg-linear-to-b from-white via-amber-50/20 to-white border-amber-200/80',
            'dark:from-[#13182E] dark:via-[#151D38] dark:to-[#101426] dark:border-amber-900/40'
          ]"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-3">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold pg-card-inner border pg-border pg-text-gold">
                <span>주역 제{{ hexData.id }}괘</span>
                <span class="opacity-60">•</span>
                <span>상괘 {{ currentTrigramInfo.upper.symbol }} {{ currentTrigramInfo.upper.name }}</span>
                <span class="opacity-60">+</span>
                <span>하괘 {{ currentTrigramInfo.lower.symbol }} {{ currentTrigramInfo.lower.name }}</span>
              </div>
              <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-extrabold tracking-tight', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                {{ hexData.nameKorean }}
                <span class="text-lg sm:text-2xl font-serif-kr font-bold opacity-75 ml-1">({{ hexData.nameHanji }})</span>
              </h1>
              <p :class="['text-sm sm:text-base font-serif-kr font-medium leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
                {{ hexData.desc }}
              </p>
            </div>

            <!-- 6효 시각화 그래픽 (아래부터 초효~상효) -->
            <div
              :class="[
                'p-4 rounded-2xl border flex flex-col items-center justify-center shrink-0 w-44 mx-auto md:mx-0',
                'bg-slate-50/80 border-slate-200/80',
                'dark:bg-[#0E1326] dark:border-slate-800'
              ]"
            >
              <div class="text-[11px] font-bold pg-text-muted mb-2 font-serif-kr">6효(六爻) 괘상</div>
              <div class="flex flex-col-reverse gap-1.5 w-full px-2">
                <div
                  v-for="(lineType, lIdx) in currentHexagramSixLines"
                  :key="lIdx"
                  :class="[
                    'h-3 rounded-xs transition-all duration-500 flex items-center justify-between',
                    isHexAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  ]"
                  :style="{ transitionDelay: `${lIdx * 60}ms` }"
                >
                  <!-- 양효 (1): 일직선 바 -->
                  <div
                    v-if="lineType === 1"
                    :class="['w-full h-full rounded-xs shadow-2xs', 'bg-amber-500', 'dark:bg-amber-400']"
                    :title="`${lIdx + 1}효: 양효(陽)`"
                  />
                  <!-- 음효 (0): 중간이 끊어진 두 개의 바 -->
                  <div
                    v-else
                    class="w-full h-full flex justify-between gap-1.5"
                    :title="`${lIdx + 1}효: 음효(陰)`"
                  >
                    <div :class="['w-[45%] h-full rounded-xs shadow-2xs', 'bg-slate-600', 'dark:bg-slate-400']" />
                    <div :class="['w-[45%] h-full rounded-xs shadow-2xs', 'bg-slate-600', 'dark:bg-slate-400']" />
                  </div>
                </div>
              </div>
              <div class="text-[10px] pg-text-muted mt-2">초효(하) → 상효(상)</div>
            </div>
          </div>
        </section>

        <!-- ========================================== -->
        <!-- A. 고밀도 신규 학술 해설 섹션 (isEnhanced) -->
        <!-- ========================================== -->
        <template v-if="hexData.isEnhanced && hexData.content">

          <!-- 1. 한 줄 핵심 요약 (Quote Card) -->
          <section
            :class="[
              'p-5 sm:p-7 rounded-2xl border transition-all',
              'bg-amber-50/60 border-amber-200/90 text-amber-950',
              'dark:bg-[#181F3B] dark:border-amber-900/40 dark:text-amber-200'
            ]"
          >
            <div class="flex items-start gap-3">
              <span class="text-2xl sm:text-3xl font-serif-kr text-amber-500 leading-none">“</span>
              <div class="space-y-1.5">
                <span :class="['text-xs font-bold uppercase tracking-wider text-amber-700 font-serif-kr', 'dark:text-amber-400']">
                  핵심 처세 비결 요약
                </span>
                <p class="text-sm sm:text-base leading-relaxed font-serif-kr font-medium">
                  {{ hexData.content.summary }}
                </p>
              </div>
            </div>
          </section>

          <!-- 2. 정통 원문과 심층 풀이 -->
          <section
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-6',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-4 border-b flex items-center justify-between', 'border-slate-200', 'dark:border-slate-800']">
              <div class="flex items-center gap-2.5">
                <div :class="['p-2 rounded-xl bg-amber-500/10 text-amber-600', 'dark:text-amber-400']">
                  <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
                </div>
                <div>
                  <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                    정통 괘사(卦辭)와 전(傳) 원문
                  </h2>
                  <p class="text-xs pg-text-muted mt-0.5">주역 원전과 공자의 십익(十翼) 해석</p>
                </div>
              </div>
              <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 pg-text-muted', 'dark:bg-slate-800']">원전 정본</span>
            </div>

            <!-- 괘사 -->
            <div :class="['p-4 sm:p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']">
              <span :class="['text-xs font-bold text-amber-700 block mb-1.5 font-serif-kr', 'dark:text-amber-400']">📜 괘사 (卦辭)</span>
              <div :class="['font-serif-kr text-base sm:text-lg font-bold tracking-wide', 'text-slate-900', 'dark:text-amber-100']">
                {{ hexData.guaCi }}
              </div>
            </div>

            <!-- 단전 -->
            <div :class="['p-4 sm:p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']">
              <span :class="['text-xs font-bold text-amber-700 block mb-1.5 font-serif-kr', 'dark:text-amber-400']">📖 단전 (彖傳)</span>
              <div :class="['font-serif-kr text-sm sm:text-base leading-relaxed', 'text-slate-800', 'dark:text-slate-200']">
                {{ hexData.tuanZhuan }}
              </div>
            </div>

            <!-- 상전 -->
            <div :class="['p-4 sm:p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']">
              <span :class="['text-xs font-bold text-amber-700 block mb-1.5 font-serif-kr', 'dark:text-amber-400']">⚖️ 대자연의 형상과 군자의 처세 (象傳)</span>
              <div :class="['font-serif-kr text-sm sm:text-base font-bold leading-relaxed', 'text-amber-900', 'dark:text-amber-200']">
                {{ hexData.xiangZhuan }}
              </div>
            </div>
          </section>

          <!-- 3. 괘의 입체적 구조 해부 (호괘, 착괘, 종괘, 서괘전) -->
          <section
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-4',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-4 border-b flex items-center gap-2.5', 'border-slate-200', 'dark:border-slate-800']">
              <div :class="['p-2 rounded-xl bg-purple-500/10 text-purple-600', 'dark:text-purple-400']">
                <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5" />
              </div>
              <div>
                <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                  괘의 구조와 역학적 입체 해부
                </h2>
                <p class="text-xs pg-text-muted mt-0.5">상·하괘 결합, 호괘·착괘·종괘, 서괘전(序卦傳) 인과율</p>
              </div>
            </div>
            <div :class="['text-sm sm:text-base leading-relaxed font-serif-kr space-y-3', 'text-slate-700', 'dark:text-slate-300']">
              <p>{{ hexData.content.structureNote }}</p>
            </div>
          </section>

          <!-- 4. 고사성어와 역사적 배경 -->
          <section
            v-if="hexData.content.idioms && hexData.content.idioms.length"
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-5',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-4 border-b flex items-center gap-2.5', 'border-slate-200', 'dark:border-slate-800']">
              <div :class="['p-2 rounded-xl bg-emerald-500/10 text-emerald-600', 'dark:text-emerald-400']">
                <UIcon name="i-heroicons-bookmark" class="w-5 h-5" />
              </div>
              <div>
                <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                  괘에서 유래한 고사성어와 지혜
                </h2>
                <p class="text-xs pg-text-muted mt-0.5">수천 년을 관통해 일상에 살아 숨 쉬는 명언</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div
                v-for="(item, idx) in hexData.content.idioms"
                :key="idx"
                :class="[
                  'p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2',
                  'bg-slate-50/70 border-slate-200/80 hover:border-amber-400',
                  'dark:bg-[#0E1326] dark:border-slate-800/70 dark:hover:border-amber-600/50'
                ]"
              >
                <div>
                  <h3 :class="['text-base font-serif-kr font-bold text-amber-800 dark:text-amber-300']">
                    {{ item.phrase }}
                  </h3>
                  <div class="text-[11px] pg-text-muted mt-0.5">{{ item.source }}</div>
                </div>
                <p :class="['text-xs leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
                  {{ item.note }}
                </p>
              </div>
            </div>
          </section>

          <!-- 5. 4대 분야별 정밀 실전 처세 -->
          <section
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-5',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-4 border-b flex items-center gap-2.5', 'border-slate-200', 'dark:border-slate-800']">
              <div :class="['p-2 rounded-xl bg-amber-500/10 text-amber-600', 'dark:text-amber-400']">
                <UIcon name="i-heroicons-briefcase" class="w-5 h-5" />
              </div>
              <div>
                <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                  4대 분야별 실전 처세 지침
                </h2>
                <p class="text-xs pg-text-muted mt-0.5">직업, 재물, 애정, 건강에 대처하는 현명한 행동 양식</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 직업·사업 -->
              <div :class="['p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']">
                <div class="flex items-center gap-2 mb-2.5">
                  <span class="text-base">💼</span>
                  <h3 :class="['text-sm font-bold font-serif-kr text-amber-800', 'dark:text-amber-300']">직업 및 비즈니스</h3>
                </div>
                <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
                  {{ hexData.content.fields.career }}
                </p>
              </div>

              <!-- 재물·투자 -->
              <div :class="['p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']">
                <div class="flex items-center gap-2 mb-2.5">
                  <span class="text-base">💰</span>
                  <h3 :class="['text-sm font-bold font-serif-kr text-amber-800', 'dark:text-amber-300']">재물 및 투자 관리</h3>
                </div>
                <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
                  {{ hexData.content.fields.wealth }}
                </p>
              </div>

              <!-- 애정·관계 -->
              <div :class="['p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']">
                <div class="flex items-center gap-2 mb-2.5">
                  <span class="text-base">❤️</span>
                  <h3 :class="['text-sm font-bold font-serif-kr text-amber-800', 'dark:text-amber-300']">애정 및 대인관계</h3>
                </div>
                <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
                  {{ hexData.content.fields.love }}
                </p>
              </div>

              <!-- 건강·심리 -->
              <div :class="['p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']">
                <div class="flex items-center gap-2 mb-2.5">
                  <span class="text-base">🌿</span>
                  <h3 :class="['text-sm font-bold font-serif-kr text-amber-800', 'dark:text-amber-300']">건강 및 멘탈 조율</h3>
                </div>
                <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
                  {{ hexData.content.fields.health }}
                </p>
              </div>
            </div>
          </section>

          <!-- 6 & 7. 6효 시간 흐름 개관 및 효사 상세 분석 -->
          <section
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-6',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-4 border-b flex items-center justify-between', 'border-slate-200', 'dark:border-slate-800']">
              <div class="flex items-center gap-2.5">
                <div :class="['p-2 rounded-xl bg-blue-500/10 text-blue-600', 'dark:text-blue-400']">
                  <UIcon name="i-heroicons-arrows-up-down" class="w-5 h-5" />
                </div>
                <div>
                  <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                    주역 6개 효사(爻辭) 심층 분석
                  </h2>
                  <p class="text-xs pg-text-muted mt-0.5">시간의 전개와 지위의 변화에 따른 맞춤형 처세 조언</p>
                </div>
              </div>
            </div>

            <!-- 6효 시간 흐름 총괄 개관 배너 -->
            <div :class="['p-4 sm:p-5 rounded-2xl border', 'bg-blue-50/50 border-blue-200/80 text-blue-950', 'dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-200']">
              <span :class="['text-xs font-bold text-blue-800 block mb-1 font-serif-kr', 'dark:text-blue-300']">🌊 6효의 시간적 전개 구조</span>
              <p class="text-xs sm:text-sm leading-relaxed font-serif-kr">
                {{ hexData.content.lineOverview }}
              </p>
            </div>

            <!-- 6효 상세 카드 리스트 -->
            <div class="space-y-4">
              <div
                v-for="line in hexData.content.lines"
                :key="line.n"
                :class="[
                  'p-5 sm:p-6 rounded-2xl border transition-all space-y-3.5',
                  'bg-slate-50/50 border-slate-200/80 hover:border-amber-300',
                  'dark:bg-[#0E1326] dark:border-slate-800/70 dark:hover:border-amber-600/50'
                ]"
              >
                <!-- 효 헤더 -->
                <div class="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 pg-border">
                  <div class="flex items-center gap-2">
                    <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold font-serif-kr bg-amber-500/15 text-amber-700 border border-amber-500/30', 'dark:text-amber-300']">
                      {{ line.nameKorean }} ({{ line.nameHanja }})
                    </span>
                    <span :class="['text-xs font-serif-kr font-bold text-slate-800', 'dark:text-slate-200']">
                      제{{ line.n }}효
                    </span>
                  </div>
                  <!-- 구체 현실 장면 태그 -->
                  <div :class="['text-[11px] font-medium text-slate-600 italic', 'dark:text-slate-400']">
                    📍 {{ line.scene }}
                  </div>
                </div>

                <!-- 효사 한자 및 한글 원문 -->
                <div :class="['p-3 rounded-xl border font-serif-kr', 'bg-white border-slate-200', 'dark:bg-black/30 dark:border-slate-800']">
                  <div :class="['text-sm font-bold text-slate-900', 'dark:text-amber-200']">{{ line.textHanja }}</div>
                  <div :class="['text-xs sm:text-sm text-slate-600 mt-0.5', 'dark:text-slate-400']">{{ line.textKorean }}</div>
                </div>

                <!-- 전통 해석 -->
                <div class="space-y-1">
                  <span :class="['text-xs font-bold text-amber-800 font-serif-kr', 'dark:text-amber-400']">전통 원문 해석:</span>
                  <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
                    {{ line.traditionalInterp }}
                  </p>
                </div>

                <!-- 현대 실전 조언 -->
                <div :class="['p-3.5 rounded-xl border', 'bg-amber-50/50 border-amber-200/70', 'dark:bg-amber-950/20 dark:border-amber-900/40']">
                  <div :class="['flex items-center gap-1.5 text-xs font-bold text-amber-800 font-serif-kr mb-1', 'dark:text-amber-300']">
                    <UIcon name="i-heroicons-light-bulb" class="w-4 h-4" />
                    <span>현대적 실전 처세 조언</span>
                  </div>
                  <p :class="['text-xs sm:text-sm leading-relaxed text-slate-800 font-medium', 'dark:text-slate-200']">
                    {{ line.modernAdvice }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- 8. 비슷한 괘와의 비교 -->
          <section
            v-if="hexData.content.compareWith && hexData.content.compareWith.length"
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-4',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-4 border-b flex items-center gap-2.5', 'border-slate-200', 'dark:border-slate-800']">
              <div :class="['p-2 rounded-xl bg-indigo-500/10 text-indigo-600', 'dark:text-indigo-400']">
                <UIcon name="i-heroicons-scale" class="w-5 h-5" />
              </div>
              <div>
                <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                  비슷한 괘와의 결정적 차이 비교
                </h2>
                <p class="text-xs pg-text-muted mt-0.5">상황을 오판하지 않기 위한 괘 간의 경계선 분석</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="item in hexData.content.compareWith"
                :key="item.id"
                :class="['p-4 sm:p-5 rounded-2xl border', 'bg-slate-50/60 border-slate-200/70', 'dark:bg-[#0E1326] dark:border-slate-800/60']"
              >
                <div class="flex items-center justify-between mb-2">
                  <h3 :class="['text-sm font-bold font-serif-kr text-indigo-700', 'dark:text-indigo-300']">
                    제{{ item.id }}괘 {{ item.name }}
                  </h3>
                  <NuxtLink :to="`/guide/iching/${item.id}`" :class="['text-xs text-amber-600 hover:underline', 'dark:text-amber-400']">
                    보러가기 →
                  </NuxtLink>
                </div>
                <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
                  {{ item.diff }}
                </p>
              </div>
            </div>
          </section>

          <!-- 9. 흔한 오해와 진실 -->
          <section
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-3.5',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-3 border-b flex items-center gap-2.5', 'border-slate-200', 'dark:border-slate-800']">
              <div :class="['p-2 rounded-xl bg-rose-500/10 text-rose-600', 'dark:text-rose-400']">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
              </div>
              <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                점괘 해석 시 흔한 오해와 주의점
              </h2>
            </div>
            <p :class="['text-xs sm:text-sm leading-relaxed font-serif-kr', 'text-slate-700', 'dark:text-slate-300']">
              {{ hexData.content.misconceptions }}
            </p>
          </section>

          <!-- 10. 자주 묻는 질문 FAQ -->
          <section
            v-if="hexData.content.faq && hexData.content.faq.length"
            :class="[
              'p-6 sm:p-8 rounded-3xl border transition-all shadow-xs space-y-4',
              'bg-white border-slate-200/90',
              'dark:bg-[#13182E] dark:border-slate-800/80'
            ]"
          >
            <div :class="['pb-4 border-b flex items-center gap-2.5', 'border-slate-200', 'dark:border-slate-800']">
              <div :class="['p-2 rounded-xl bg-amber-500/10 text-amber-600', 'dark:text-amber-400']">
                <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5" />
              </div>
              <div>
                <h2 :class="['text-lg sm:text-xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
                  자주 묻는 질문 (FAQ)
                </h2>
                <p class="text-xs pg-text-muted mt-0.5">실전 괘 해석에서 가장 궁금해하는 질문들</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                v-for="(faq, fIdx) in hexData.content.faq"
                :key="fIdx"
                :class="[
                  'rounded-2xl border transition-all overflow-hidden',
                  'bg-slate-50/70 border-slate-200/80',
                  'dark:bg-[#0E1326] dark:border-slate-800/70'
                ]"
              >
                <!-- 아코디언 헤더 버튼 (처음은 모두 닫힘: openFaqIndex === null) -->
                <button
                  type="button"
                  @click="toggleFaq(fIdx)"
                  :class="[
                    'w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors',
                    'hover:bg-slate-100/70',
                    'dark:hover:bg-slate-800/40'
                  ]"
                  :aria-expanded="openFaqIndex === fIdx ? 'true' : 'false'"
                >
                  <div class="flex items-center gap-2.5">
                    <span :class="['text-xs font-bold text-amber-600 shrink-0', 'dark:text-amber-400']">Q.</span>
                    <h3 :class="['text-xs sm:text-sm font-bold text-slate-900', 'dark:text-amber-200']">{{ faq.q }}</h3>
                  </div>
                  <UIcon
                    name="i-heroicons-chevron-down"
                    :class="[
                      'w-4 h-4 shrink-0 transition-transform duration-200 text-slate-400',
                      openFaqIndex === fIdx ? 'rotate-180 text-amber-600' : '',
                      openFaqIndex === fIdx ? 'dark:text-amber-400' : ''
                    ]"
                  />
                </button>

                <!-- 아코디언 답변 본문 (클릭한 항목만 열림) -->
                <div
                  v-if="openFaqIndex === fIdx"
                  :class="[
                    'px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t',
                    'border-slate-200/50',
                    'dark:border-slate-800/50'
                  ]"
                >
                  <div class="flex items-start gap-2.5 pt-2">
                    <span class="text-xs font-bold text-slate-400 shrink-0">A.</span>
                    <p :class="['text-xs sm:text-sm leading-relaxed text-slate-600', 'dark:text-slate-300']">{{ faq.a }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 11. 참고 문헌 및 작성일 정보 -->
          <footer
            :class="[
              'p-5 sm:p-6 rounded-2xl border text-xs leading-relaxed space-y-1.5',
              'bg-slate-50/80 border-slate-200 text-slate-500',
              'dark:bg-[#0D1122] dark:border-slate-800 dark:text-slate-400'
            ]"
          >
            <div :class="['font-bold text-slate-700', 'dark:text-slate-300']">
              【참고 문헌】
            </div>
            <div class="space-y-0.5">
              <div v-for="(src, sIdx) in hexData.content.sources" :key="sIdx">• {{ src }}</div>
            </div>
            <div :class="['pt-2 border-t pg-border text-[11px] flex justify-end items-center text-slate-600', 'dark:text-slate-400']">
              <span>작성일: {{ hexData.content.reviewedAt }}</span>
            </div>
          </footer>

        </template>

        <!-- ========================================== -->
        <!-- B. 레거시 괘 렌더링 영역 (isEnhanced: false) -->
        <!-- ========================================== -->
        <template v-else>
          <!-- 레거시 괘사/단전 -->
          <section :class="['p-6 rounded-3xl border space-y-4', 'bg-white border-slate-200', 'dark:bg-[#13182E] dark:border-slate-800']">
            <h2 :class="['text-lg font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
              1. 정통 괘사(卦辭)와 단전(彖傳) 해설
            </h2>
            <div :class="['p-4 rounded-xl border', 'bg-slate-50 border-slate-200', 'dark:bg-black/30 dark:border-slate-800']">
              <div class="font-serif-kr text-base font-bold">{{ hexData.guaCi }}</div>
              <div class="text-xs pg-text-muted mt-1">{{ hexData.meaning }}</div>
            </div>
            <div :class="['text-xs sm:text-sm leading-relaxed text-slate-700', 'dark:text-slate-300']">
              {{ hexData.tuanZhuan }}
            </div>
          </section>

          <!-- 레거시 4대 운세 -->
          <section :class="['p-6 rounded-3xl border space-y-4', 'bg-white border-slate-200', 'dark:bg-[#13182E] dark:border-slate-800']">
            <h2 :class="['text-lg font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
              2. 4대 분야별 실전 운세
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div class="p-3.5 rounded-xl border pg-border pg-card-inner">
                <span :class="['font-bold text-amber-700 block mb-1', 'dark:text-amber-300']">사업·직업운</span>
                <p>{{ hexData.businessFate }}</p>
              </div>
              <div class="p-3.5 rounded-xl border pg-border pg-card-inner">
                <span :class="['font-bold text-amber-700 block mb-1', 'dark:text-amber-300']">재물·금전운</span>
                <p>{{ hexData.wealthFate }}</p>
              </div>
              <div class="p-3.5 rounded-xl border pg-border pg-card-inner">
                <span :class="['font-bold text-amber-700 block mb-1', 'dark:text-amber-300']">애정·인간관계</span>
                <p>{{ hexData.loveFate }}</p>
              </div>
              <div class="p-3.5 rounded-xl border pg-border pg-card-inner">
                <span :class="['font-bold text-amber-700 block mb-1', 'dark:text-amber-300']">건강·심리</span>
                <p>{{ hexData.healthFate }}</p>
              </div>
            </div>
          </section>
        </template>

        <!-- 이전/다음 괘 하단 네비게이션 카드 -->
        <section class="grid grid-cols-2 gap-3 pt-4">
          <NuxtLink
            :to="`/guide/iching/${prevHexId}`"
            :class="[
              'p-4 rounded-2xl border text-left transition-all hover:border-amber-400 group',
              'bg-white border-slate-200',
              'dark:bg-[#13182E] dark:border-slate-800'
            ]"
          >
            <div class="text-[11px] pg-text-muted flex items-center gap-1 mb-1">
              <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
              <span>이전 괘</span>
            </div>
            <div :class="['text-xs sm:text-sm font-serif-kr font-bold group-hover:text-amber-600 transition-colors', 'dark:group-hover:text-amber-400']">
              제{{ prevHexId }}괘 보러가기
            </div>
          </NuxtLink>

          <NuxtLink
            :to="`/guide/iching/${nextHexId}`"
            :class="[
              'p-4 rounded-2xl border text-right transition-all hover:border-amber-400 group',
              'bg-white border-slate-200',
              'dark:bg-[#13182E] dark:border-slate-800'
            ]"
          >
            <div class="text-[11px] pg-text-muted flex items-center justify-end gap-1 mb-1">
              <span>다음 괘</span>
              <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5" />
            </div>
            <div :class="['text-xs sm:text-sm font-serif-kr font-bold group-hover:text-amber-600 transition-colors', 'dark:group-hover:text-amber-400']">
              제{{ nextHexId }}괘 보러가기
            </div>
          </NuxtLink>
        </section>

        <!-- 무료 AI 주역 비결 체험 안내 배너 -->
        <section
          :class="[
            'p-6 sm:p-8 rounded-3xl border text-center space-y-4 shadow-sm',
            'bg-linear-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-amber-300/50',
            'dark:from-amber-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 dark:border-amber-600/40'
          ]"
        >
          <div :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-800 border border-amber-500/30', 'dark:text-amber-300']">
            <span>실전 괘 뽑기</span>
          </div>
          <h2 :class="['text-xl sm:text-2xl font-serif-kr font-bold', 'text-slate-900', 'dark:text-[#FFDE9E]']">
            지금 나의 고민에 대한 오늘의 괘는 무엇일까요?
          </h2>
          <p :class="['text-xs sm:text-sm max-w-xl mx-auto leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
            전통 3단계 대나무 점대 드로우와 64괘 알고리즘으로 오늘의 운세와 동효(動爻)를 실시간으로 점쳐보세요.
          </p>
          <div>
            <NuxtLink
              to="/iching"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-md hover:scale-105 transition-all"
            >
              <span>무료 오늘의 주역 점괘 보기</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>
