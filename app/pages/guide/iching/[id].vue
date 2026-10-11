<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const route = useRoute()
const hexId = computed(() => Math.min(64, Math.max(1, parseInt(String(route.params.id || '1'), 10))))

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/iching/${hexId.value}`

// 1. 단일 초고속 로컬 API 조회 (0.001초 응답, 마크다운/AI 호출 없음)
interface LineDetail {
  lineNumber: number
  nameHanja: string
  nameKorean: string
  textHanja: string
  textKorean: string
  traditionalInterp?: string
  modernAdvice?: string
}

interface HexDetailData {
  id: number
  slug: string
  nameKorean: string
  nameHanji: string
  desc: string
  meaning: string
  guaCi: string
  tuanZhuan: string
  tuanExplanation: string
  xiangZhuan: string
  xiangLesson: string
  xuGuaZhuan: string
  prevNextCompare: string
  businessFate: string
  wealthFate: string
  loveFate: string
  healthFate: string
  lines: LineDetail[]
  faqList: Array<{ q: string; a: string }>
  relatedHexagrams?: Array<{ id: number; name: string; slug: string }>
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

useHead({
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
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

        if (hexData.value?.faqList && hexData.value.faqList.length > 0) {
          schemaList.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: hexData.value.faqList.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a
              }
            }))
          })
        }

        return JSON.stringify(schemaList)
      })
    }
  ]
})

// 8괘 기호 및 이름 맵
const trigramSymbols: Record<number, { symbol: string; name: string }> = {
  1: { symbol: '☰', name: '건' },
  2: { symbol: '☱', name: '태' },
  3: { symbol: '☲', name: '이' },
  4: { symbol: '☳', name: '진' },
  5: { symbol: '☴', name: '손' },
  6: { symbol: '☵', name: '감' },
  7: { symbol: '☶', name: '간' },
  8: { symbol: '☷', name: '곤' }
}

// 8괘별 3효 정의 (0: 음효, 1: 양효 - [초효, 이효, 삼효])
const trigramLinesMap: Record<number, [number, number, number]> = {
  1: [1, 1, 1], // 건(乾) ☰
  2: [1, 1, 0], // 태(兌) ☱
  3: [1, 0, 1], // 이(離) ☲
  4: [1, 0, 0], // 진(震) ☳
  5: [0, 1, 1], // 손(巽) ☴
  6: [0, 1, 0], // 감(坎) ☵
  7: [0, 0, 1], // 간(艮) ☶
  8: [0, 0, 0]  // 곤(坤) ☷
}

// 64괘별 [상괘 ID, 하괘 ID] 매핑
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

// 64괘의 6효 (초효(1)부터 상효(6)까지 순서)
const currentHexagramSixLines = computed<number[]>(() => {
  const [uId, lId] = hexagramTrigramIds[hexId.value] || [1, 1]
  const lower = trigramLinesMap[lId] || [1, 1, 1]
  const upper = trigramLinesMap[uId] || [1, 1, 1]
  return [...lower, ...upper]
})

// 이전 / 다음 괘 번호
const prevHexId = computed(() => (hexId.value > 1 ? hexId.value - 1 : 64))
const nextHexId = computed(() => (hexId.value < 64 ? hexId.value + 1 : 1))

// 효사 필터링 (선택적 탭 또는 전체 펼침)
const selectedLineTab = ref<number>(0) // 0: 전체 보기, 1~6: 특정 효만 보기

// 괘 조립 애니메이션 트리거 상태
const isHexAnimated = ref(false)

const triggerHexAnimation = () => {
  isHexAnimated.value = false
  nextTick(() => {
    setTimeout(() => {
      isHexAnimated.value = true
    }, 60)
  })
}

// 스크롤 시 아래에서 솟아오르는 효과 (IntersectionObserver)
const setupScrollObserver = () => {
  if (typeof window === 'undefined') return
  nextTick(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    })

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach(el => observer.observe(el))
  })
}

onMounted(() => {
  triggerHexAnimation()
  setupScrollObserver()
})

watch(hexId, () => {
  triggerHexAnimation()
  setupScrollObserver()
})

watch(selectedLineTab, () => {
  setupScrollObserver()
})
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-2xl mx-auto px-4 py-4 sm:py-6">

      <!-- 1. 상단 네비게이션 헤더 -->
      <header class="flex items-center justify-between pb-3 border-b pg-border mb-4">
        <NuxtLink
          to="/guide/iching"
          class="p-1.5 rounded-full pg-back-btn transition-colors flex items-center gap-1 text-xs font-bold pg-text hover:text-(--fortune-gold)"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          <span>64괘 목록</span>
        </NuxtLink>
        <div class="text-center">
          <span class="text-[11px] font-bold tracking-widest pg-text-gold block uppercase">
            제{{ hexId }}괘 실전 처세 가이드
          </span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            {{ hexData?.nameKorean || `제${hexId}괘` }} ({{ hexData?.nameHanji || '周易' }})
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

      <!-- 2. 로딩 상태 스켈레톤 효과 (Skeleton UI) -->
      <div v-if="status === 'pending'" class="space-y-6 animate-pulse" aria-busy="true" aria-label="운세 자료를 불러오는 중입니다">
        <!-- Hero 카드 스켈레톤 -->
        <div class="pg-card border rounded-3xl p-5 shadow-xl space-y-4">
          <div class="flex justify-between items-center">
            <div class="h-5 w-28 skeleton-bar rounded-full"></div>
            <div class="h-6 w-16 skeleton-bar rounded-lg"></div>
          </div>
          <div class="p-4 rounded-2xl pg-card-inner border pg-border flex justify-between items-center gap-4">
            <div class="space-y-2 flex-1">
              <div class="h-6 w-32 skeleton-bar rounded-lg"></div>
              <div class="h-3.5 w-44 skeleton-bar rounded-md"></div>
              <div class="h-3 w-28 skeleton-bar rounded-md"></div>
            </div>
            <div class="space-y-1 w-16 sm:w-20 shrink-0">
              <div v-for="i in 6" :key="i" class="h-1.5 w-full skeleton-bar rounded-xs" :class="i === 4 ? 'mt-1.5' : ''"></div>
            </div>
          </div>
          <div class="p-3.5 rounded-xl pg-card-inner border pg-border space-y-2">
            <div class="h-3.5 w-full skeleton-bar rounded-md"></div>
            <div class="h-3.5 w-4/5 skeleton-bar rounded-md"></div>
          </div>
        </div>

        <!-- 4대 운세 카드 스켈레톤 -->
        <div class="pg-card border rounded-2xl p-5 shadow-md space-y-3">
          <div class="h-5 w-36 skeleton-bar rounded-md"></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="i in 4" :key="i" class="p-3.5 rounded-xl pg-card-inner border pg-border space-y-2">
              <div class="h-4 w-20 skeleton-bar rounded-md"></div>
              <div class="h-3 w-full skeleton-bar rounded-md"></div>
              <div class="h-3 w-3/4 skeleton-bar rounded-md"></div>
            </div>
          </div>
        </div>

        <!-- 6효사 스켈레톤 -->
        <div class="pg-card border rounded-2xl p-5 shadow-md space-y-3">
          <div class="h-5 w-40 skeleton-bar rounded-md"></div>
          <div class="space-y-2.5">
            <div v-for="i in 2" :key="i" class="p-3.5 rounded-xl pg-card-inner border pg-border space-y-2">
              <div class="h-4 w-28 skeleton-bar rounded-md"></div>
              <div class="h-3.5 w-full skeleton-bar rounded-md"></div>
              <div class="h-3 w-2/3 skeleton-bar rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 메인 콘텐츠 (데이터 로드 완료 시) -->
      <main v-else-if="hexData" class="space-y-6">

        <!-- [카드 1] 메인 괘 정보 Hero 카드 (6효 조립 애니메이션 - 1/3 축소 및 워터마크 강화) -->
        <section class="pg-card border rounded-3xl p-5 shadow-xl relative overflow-hidden reveal-on-scroll is-visible">
          <!-- 배경 워터마크 한자 (모바일: 살짝 우상단 이동 / 데스크톱: 정중앙 / 줌 호흡 애니메이션) -->
          <div
            class="absolute left-[40%] sm:left-1/2 top-[44%] sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pg-watermark-text animate-watermark-zoom text-3xl sm:text-4xl md:text-5xl font-serif-kr select-none pointer-events-none tracking-tight leading-none whitespace-nowrap"
            aria-hidden="true"
          >
            {{ hexData.nameHanji }}
          </div>

          <div class="relative z-20">
            <!-- 괘 상단 메타 라벨 -->
            <div class="flex items-center justify-between mb-3 relative z-20">
              <span class="px-3 py-0.5 rounded-full pg-card-inner border pg-border text-xs font-bold pg-text-gold">
                제{{ hexId }}괘 · {{ hexData.desc }}
              </span>
              <span class="text-xs font-semibold pg-text-muted">
                {{ hexData.nameKorean }} ({{ hexData.nameHanji }})
              </span>
            </div>

            <!-- 6효 서서히 조합되는 실시간 조립 디스플레이 (뒤의 워터마크 한자가 전체 다 보이도록 투명 배경 적용) -->
            <div
              class="p-3.5 rounded-2xl border pg-border mb-3.5 flex items-center justify-between gap-3 relative z-20"
              :class="['bg-white/5', 'dark:bg-black/10']"
            >
              <div class="relative z-20">
                <h2 class="font-serif-kr text-xl sm:text-2xl font-extrabold pg-text mb-1 drop-shadow-xs">
                  {{ hexData.nameKorean }}
                </h2>
                <p class="mt-2 text-xs font-medium pg-text-gold">
                  상괘: {{ currentTrigramInfo.upper.name }}({{ currentTrigramInfo.upper.symbol }}) · 하괘: {{ currentTrigramInfo.lower.name }}({{ currentTrigramInfo.lower.symbol }})
                </p>
                <!-- <p class="text-[10px] pg-text-muted mt-0.5">
                  6개 효(爻) 순차 조립상
                </p> -->
              </div>

              <!-- 6효 조립 바 (z-30으로 괘가 한자 위에 선명하게 얹혀 한자가 괘의 아래에 위치) -->
              <div class="space-y-1 w-16 sm:w-20 shrink-0 select-none py-1 relative z-30">
                <div
                  v-for="(val, idx) in [...currentHexagramSixLines].reverse()"
                  :key="`${hexId}-${idx}`"
                  class="h-1.5 rounded-xs flex items-center justify-between overflow-hidden relative hex-line-item shadow-xs"
                  :class="[
                    `hex-line-${6 - idx}`,
                    { 'is-active': isHexAnimated },
                    idx === 3 ? 'mt-1.5' : ''
                  ]"
                >
                  <!-- 양효 (1): 통 줄 바 -->
                  <template v-if="val === 1">
                    <div class="w-full h-full rounded-xs trigram-bar-solid shadow-xs"></div>
                  </template>
                  <!-- 음효 (0): 중앙이 분할된 두 개의 바 -->
                  <template v-else>
                    <div class="w-[45%] h-full rounded-xs trigram-bar-broken shadow-xs"></div>
                    <div class="w-[45%] h-full rounded-xs trigram-bar-broken shadow-xs"></div>
                  </template>
                </div>
              </div>
            </div>

            <!-- 괘 핵심 의미 총평 -->
            <div
              class="p-3.5 rounded-2xl border pg-border relative z-20 backdrop-blur-[2px]"
              :class="['bg-white/10', 'dark:bg-black/10']"
            >
              <p class="text-xs sm:text-sm font-semibold pg-text-gold leading-relaxed">
                "{{ hexData.meaning }}"
              </p>
            </div>
          </div>
        </section>

        <!-- [광고 1] 상단 AdSense 슬롯 -->
        <AdSense adSlot="iching-guide-top" />

        <!-- [카드 2] 정통 괘사(卦辭) & 단전(彖傳) -->
        <section class="pg-card border rounded-2xl p-5 shadow-md space-y-4 reveal-on-scroll">
          <div class="flex items-center gap-2 border-b pg-border pb-2.5">
            <UIcon name="i-heroicons-book-open" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm font-bold pg-text">1. 정통 괘사(卦辭)와 단전(彖傳) 해설</h3>
          </div>

          <!-- 괘사 원문 -->
          <div class="p-4 rounded-xl pg-card-inner border pg-border space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 pg-text-gold">괘사 원문 (卦辭)</span>
              <span class="text-[10px] pg-text-muted">문왕(文王)의 괘사 원문</span>
            </div>
            <p class="font-serif-kr text-sm sm:text-base font-bold pg-text tracking-wide leading-relaxed">
              {{ hexData.guaCi }}
            </p>
          </div>

          <!-- 단전 해설 -->
          <div v-if="hexData.tuanZhuan" class="p-4 rounded-xl pg-card-inner border pg-border space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 pg-text-gold">단전(彖傳) 철학 풀이</span>
              <span class="text-[10px] pg-text-muted">공자(孔子) 십익</span>
            </div>
            <p class="font-serif-kr text-xs pg-text-muted leading-relaxed italic border-l-2 border-amber-500/40 pl-3 my-1">
              "{{ hexData.tuanZhuan }}"
            </p>
            <p class="text-xs sm:text-sm pg-text leading-relaxed font-normal pt-1">
              {{ hexData.tuanExplanation }}
            </p>
          </div>
        </section>

        <!-- [카드 3] 상전(象傳) 처세와 리더십 지침 -->
        <section v-if="hexData.xiangZhuan" class="pg-card border rounded-2xl p-5 shadow-md space-y-3 reveal-on-scroll">
          <div class="flex items-center gap-2 border-b pg-border pb-2.5">
            <UIcon name="i-heroicons-scale" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm font-bold pg-text">2. 대자연의 형상과 군자의 처세 (象傳)</h3>
          </div>

          <div class="p-4 rounded-xl pg-card-inner border pg-border space-y-2">
            <p class="font-serif-kr text-xs sm:text-sm font-semibold pg-text-gold leading-relaxed">
              象曰: {{ hexData.xiangZhuan }}
            </p>
            <p class="text-xs sm:text-sm pg-text leading-relaxed font-normal">
              {{ hexData.xiangLesson }}
            </p>
          </div>
        </section>

        <!-- [카드 4] 4대 부문별 실전 운세 분석 (사업, 재물, 애정, 건강) -->
        <section class="pg-card border rounded-2xl p-5 shadow-md space-y-3 reveal-on-scroll">
          <div class="flex items-center gap-2 border-b pg-border pb-2.5">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm font-bold pg-text">3. 4대 분야별 정밀 실전 운세</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-xl pg-card-inner border pg-border">
              <div class="flex items-center gap-1.5 mb-1.5">
                <UIcon name="i-heroicons-briefcase" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">사업 · 직업운</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ hexData.businessFate }}
              </p>
            </div>

            <div class="p-3.5 rounded-xl pg-card-inner border pg-border">
              <div class="flex items-center gap-1.5 mb-1.5">
                <UIcon name="i-heroicons-banknotes" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">재물 · 투자운</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ hexData.wealthFate }}
              </p>
            </div>

            <div class="p-3.5 rounded-xl pg-card-inner border pg-border">
              <div class="flex items-center gap-1.5 mb-1.5">
                <UIcon name="i-heroicons-heart" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">인간관계 · 애정운</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ hexData.loveFate }}
              </p>
            </div>

            <div class="p-3.5 rounded-xl pg-card-inner border pg-border">
              <div class="flex items-center gap-1.5 mb-1.5">
                <UIcon name="i-heroicons-shield-check" class="w-4 h-4 pg-text-gold" />
                <strong class="pg-text-gold text-xs">건강 · 심신 조언</strong>
              </div>
              <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ hexData.healthFate }}
              </p>
            </div>
          </div>
        </section>

        <!-- [광고 2] 중간 AdSense 슬롯 -->
        <AdSense adSlot="iching-guide-mid" />

        <!-- [카드 5] 6개 효사(爻辭) 원문 및 현대적 처세 조언 -->
        <section class="pg-card border rounded-2xl p-5 shadow-md space-y-4 reveal-on-scroll">
          <div class="flex items-center justify-between border-b pg-border pb-2.5">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-bars-3-bottom-left" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm font-bold pg-text">4. 주역 6개 효사(爻辭) 심층 분석</h3>
            </div>
            <span class="text-[10px] pg-text-muted">초효(아래)부터 상효(위) 순</span>
          </div>

          <!-- 효사 필터 탭 -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl border font-bold transition-all text-[11px] whitespace-nowrap cursor-pointer select-none"
              :class="selectedLineTab === 0
                ? [
                    'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
                    'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
                    'text-amber-950',
                    'border-amber-300',
                    'dark:border-amber-400',
                    'shadow-md font-extrabold'
                  ]
                : 'pg-card-inner pg-border pg-text-muted hover:pg-text'"
              @click="selectedLineTab = 0"
            >
              전체 6효
            </button>
            <button
              v-for="l in hexData.lines"
              :key="l.lineNumber"
              type="button"
              class="px-3 py-1.5 rounded-xl border font-bold transition-all text-[11px] whitespace-nowrap cursor-pointer select-none"
              :class="selectedLineTab === l.lineNumber
                ? [
                    'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
                    'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
                    'text-amber-950',
                    'border-amber-300',
                    'dark:border-amber-400',
                    'shadow-md font-extrabold'
                  ]
                : 'pg-card-inner pg-border pg-text-muted hover:pg-text'"
              @click="selectedLineTab = l.lineNumber"
            >
              {{ l.nameKorean }} ({{ l.nameHanja }})
            </button>
          </div>

          <!-- 효사 카드 목록 -->
          <div class="space-y-3">
            <div
              v-for="line in hexData.lines"
              v-show="selectedLineTab === 0 || selectedLineTab === line.lineNumber"
              :key="line.lineNumber"
              class="p-4 rounded-xl pg-card-inner border pg-border transition-all hover:border-amber-500/40 space-y-2.5"
            >
              <div class="flex items-center justify-between">
                <span class="font-serif-kr text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 pg-text-gold">
                  {{ line.nameKorean }} ({{ line.nameHanja }}) · 제{{ line.lineNumber }}효
                </span>
                <span class="text-[10px] pg-text-muted">
                  {{ line.lineNumber === 1 ? '시작과 태동' : line.lineNumber === 6 ? '완성과 전환' : '진행과 조율' }}
                </span>
              </div>

              <!-- 한자 원문 -->
              <p
                class="font-serif-kr text-xs sm:text-sm font-semibold pg-text tracking-wide p-2 rounded-lg"
                :class="['bg-black/5', 'dark:bg-white/5']"
              >
                {{ line.textHanja }}
              </p>

              <!-- 한글 풀이 -->
              <p class="text-xs pg-text-muted leading-relaxed font-normal">
                <strong class="pg-text font-medium">원문 풀이:</strong> {{ line.textKorean }}
              </p>

              <!-- 전통적 주석 해설 -->
              <p v-if="line.traditionalInterp" class="text-xs pg-text-muted leading-relaxed font-normal border-l-2 border-amber-500/30 pl-2.5">
                <strong class="pg-text-gold font-medium">전통 해석:</strong> {{ line.traditionalInterp }}
              </p>

              <!-- 현대적 처세 조언 -->
              <div
                v-if="line.modernAdvice"
                class="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs leading-relaxed"
                :class="['text-amber-900', 'dark:text-amber-200']"
              >
                <div class="flex items-center gap-1 font-bold mb-0.5">
                  <UIcon name="i-heroicons-light-bulb" class="w-3.5 h-3.5 text-amber-500" />
                  <span>현대적 실전 처세 조언</span>
                </div>
                <p class="font-normal">{{ line.modernAdvice }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- [카드 6] 서괘전(序卦傳) & 앞뒤 괘 순환 맥락 -->
        <section v-if="hexData.xuGuaZhuan || hexData.prevNextCompare" class="pg-card border rounded-2xl p-5 shadow-md space-y-3 reveal-on-scroll">
          <div class="flex items-center gap-2 border-b pg-border pb-2.5">
            <UIcon name="i-heroicons-arrows-right-left" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm font-bold pg-text">5. 주역 64괘 인생 순환 주기 (序卦傳)</h3>
          </div>

          <div class="p-4 rounded-xl pg-card-inner border pg-border space-y-2 text-xs">
            <p v-if="hexData.xuGuaZhuan" class="font-serif-kr text-xs font-semibold pg-text-gold">
              序卦曰: {{ hexData.xuGuaZhuan }}
            </p>
            <p class="pg-text-muted leading-relaxed font-normal">
              {{ hexData.prevNextCompare }}
            </p>
          </div>
        </section>

        <!-- [카드 7] 자주 묻는 질문 (FAQ 아코디언) -->
        <section v-if="hexData.faqList && hexData.faqList.length > 0" class="pg-card border rounded-2xl p-5 shadow-md space-y-3 reveal-on-scroll">
          <div class="flex items-center gap-2 border-b pg-border pb-2.5">
            <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 pg-text-gold" />
            <h3 class="font-serif-kr text-sm font-bold pg-text">6. 자주 묻는 질문 (FAQ)</h3>
          </div>

          <div class="space-y-2">
            <details
              v-for="(faq, fIdx) in hexData.faqList"
              :key="fIdx"
              class="group p-3.5 rounded-xl pg-card-inner border pg-border cursor-pointer transition-colors open:border-amber-500/40"
            >
              <summary class="font-bold text-xs pg-text flex items-center justify-between list-none cursor-pointer">
                <span class="flex items-center gap-2">
                  <span class="text-amber-500 font-extrabold text-sm">Q.</span>
                  <span>{{ faq.q }}</span>
                </span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 pg-text-gold transition-transform group-open:rotate-180" />
              </summary>
              <div class="mt-2.5 pt-2 border-t pg-border text-xs pg-text-muted leading-relaxed font-normal">
                <strong class="pg-text-gold">A.</strong> {{ faq.a }}
              </div>
            </details>
          </div>
        </section>

        <!-- [광고 3] 하단 AdSense 슬롯 -->
        <AdSense adSlot="iching-guide-bottom" />

        <!-- [카드 8] 이전 / 다음 괘 이동 네비게이션 -->
        <nav class="flex justify-between items-center gap-3 pt-2 reveal-on-scroll" aria-label="괘 이동 네비게이션">
          <NuxtLink
            :to="`/guide/iching/${prevHexId}`"
            class="flex-1 py-3 px-4 rounded-xl border pg-border pg-card-inner text-xs font-bold pg-text hover:border-(--fortune-gold) transition-colors flex items-center justify-start gap-1.5"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-4 h-4 pg-text-gold shrink-0" />
            <div class="text-left overflow-hidden">
              <span class="block text-[9px] pg-text-muted">이전 괘</span>
              <span class="truncate block">제{{ prevHexId }}괘</span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/guide/iching"
            class="py-3 px-3 rounded-xl border pg-border pg-card-inner text-xs font-bold pg-text-gold hover:border-(--fortune-gold) transition-colors flex items-center justify-center shrink-0"
            title="64괘 전체 목록"
          >
            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
          </NuxtLink>

          <NuxtLink
            :to="`/guide/iching/${nextHexId}`"
            class="flex-1 py-3 px-4 rounded-xl border pg-border pg-card-inner text-xs font-bold pg-text hover:border-(--fortune-gold) transition-colors flex items-center justify-end gap-1.5"
          >
            <div class="text-right overflow-hidden">
              <span class="block text-[9px] pg-text-muted">다음 괘</span>
              <span class="truncate block">제{{ nextHexId }}괘</span>
            </div>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 pg-text-gold shrink-0" />
          </NuxtLink>
        </nav>

        <!-- 64괘 홈으로 이동 버튼 -->
        <div class="pt-4 text-center reveal-on-scroll">
          <NuxtLink
            to="/guide/iching"
            class="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-extrabold border shadow-md hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
            :class="[
              'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
              'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
              'text-amber-950',
              'border-amber-300',
              'dark:border-amber-400'
            ]"
          >
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
            <span>64괘 목록으로 이동</span>
          </NuxtLink>
        </div>

      </main>

    </div>
  </div>
</template>

<style scoped>
.skeleton-bar {
  background-color: rgba(209, 213, 219, 0.4);
}
:root.dark .skeleton-bar,
.dark .skeleton-bar {
  background-color: rgba(255, 255, 255, 0.1);
}

@keyframes watermarkZoom {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.92);
    opacity: 0.16;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.08);
    opacity: 0.38;
  }
}

.animate-watermark-zoom {
  animation: watermarkZoom 15s ease-in-out infinite;
  transform-origin: center center;
  will-change: transform, opacity;
}
</style>

