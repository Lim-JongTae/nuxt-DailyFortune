<script setup lang="ts">
import { computed, ref } from 'vue'

const route = useRoute()
const codeParam = computed(() => String(route.params.code || 'gap-ja').toLowerCase())

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/saju/ilju/${codeParam.value}`

// FAQ 아코디언 상태 관리 (검색엔진 크롤러 및 초기 로드 시 디폴트 전체 열림 보장)
const openFaqIndexes = ref<Set<number>>(new Set([0, 1, 2, 3, 4, 5]))
const toggleFaq = (idx: number | string) => {
  const n = typeof idx === 'number' ? idx : Number(idx)
  if (openFaqIndexes.value.has(n)) {
    openFaqIndexes.value.delete(n)
  } else {
    openFaqIndexes.value.add(n)
  }
}
const isFaqOpen = (idx: number | string) => {
  const n = typeof idx === 'number' ? idx : Number(idx)
  return openFaqIndexes.value.has(n)
}

interface IljuNavSummary {
  code: string
  ganzhi: string
  ganzhiHanja: string
  order: number
}

interface ApiResponse {
  success: boolean
  data?: any
  message?: string
}

// 0.001초 초고속 로컬 인메모리 API 조회
const { data: apiResponse, status } = await useAsyncData<ApiResponse>(
  `saju-ilju-guide-detail-${codeParam.value}`,
  () => $fetch<ApiResponse>(`/api/saju/ilju/${codeParam.value}`),
  { watch: [codeParam] }
)

const iljuData = computed(() => apiResponse.value?.data)
const isEnhanced = computed(() => !!iljuData.value?.isEnhanced)

// 오행 컬러 뱃지 스타일 맵 (Tailwind Linter 다크모드 배열 규칙 준수)
const elementColorClassMap: Record<string, { badge: string[]; text: string[] }> = {
  wood: {
    badge: ['bg-emerald-500/15 border-emerald-500/40 text-emerald-700', 'dark:text-emerald-300'],
    text: ['text-emerald-700', 'dark:text-emerald-300']
  },
  fire: {
    badge: ['bg-rose-500/15 border-rose-500/40 text-rose-700', 'dark:text-rose-300'],
    text: ['text-rose-700', 'dark:text-rose-300']
  },
  earth: {
    badge: ['bg-amber-500/15 border-amber-500/40 text-amber-700', 'dark:text-amber-300'],
    text: ['text-amber-700', 'dark:text-amber-300']
  },
  metal: {
    badge: ['bg-slate-500/15 border-slate-500/40 text-slate-700', 'dark:text-slate-300'],
    text: ['text-slate-700', 'dark:text-slate-300']
  },
  water: {
    badge: ['bg-blue-500/15 border-blue-500/40 text-blue-700', 'dark:text-blue-300'],
    text: ['text-blue-700', 'dark:text-blue-300']
  }
}

// SEO 메타 태그
const pageTitle = computed(() => {
  if (!iljuData.value) return '사주 60일주 실전 처세 가이드'
  return `${iljuData.value.ganzhi}일주(${iljuData.value.ganzhiHanja}) 정통 성향과 4대 운세 실전 처세 가이드 | 사주 60일주론`
})

const pageDesc = computed(() => {
  if (!iljuData.value) return '사주명리 60일주 정통 물상론, 지장간, 십신, 4대 운세 및 처세 조언 해설'
  const name = iljuData.value.ganzhi || ''
  const hanja = iljuData.value.ganzhiHanja ? `(${iljuData.value.ganzhiHanja})` : ''
  return `${name}일주${hanja} 정통 명리학 해설. 천간과 지지의 역학적 결합 원리, 3대 현실 행동 장면과 4대 분야 실전 처세 가이드를 제공합니다.`
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

  const faqs = isEnhanced.value ? iljuData.value?.content?.faq : iljuData.value?.faqList
  if (faqs && faqs.length > 0) {
    schemaList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq: any) => ({
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
            사주 60일주 정통 심층 가이드
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
      <main v-else-if="iljuData" class="space-y-3.5 sm:space-y-5">

        <!-- ========================================== -->
        <!-- [신규 규격] 고밀도 학술 데이터 11대 섹션 (isEnhanced: true) -->
        <!-- ========================================== -->
        <template v-if="isEnhanced && iljuData.content">

          <!-- 1. 메인 히어로 카드 (천간 + 지지 + 고유 총평) -->
          <section class="pg-card border rounded-3xl p-4 sm:p-5.5 shadow-xl relative overflow-hidden">
            <!-- 배경 워터마크 한자 -->
            <div
              class="absolute left-[54%] sm:left-1/2 top-[44%] sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pg-watermark-text animate-watermark-zoom text-5xl sm:text-6xl md:text-7xl font-serif-kr select-none pointer-events-none tracking-tight leading-none whitespace-nowrap opacity-15"
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
                  {{ iljuData.branchAnimal }}의 상징 · 정통 60주론
                </span>
              </div>

              <!-- 일주 명칭 & 오행 시각화 박스 -->
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
                    천간 {{ iljuData.stemElement }} · 지지 {{ iljuData.branchElement }} ({{ iljuData.branchAnimal }})
                  </p>
                </div>

                <!-- 오행 시각화 태그 -->
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
                      {{ iljuData.branchHanja }} {{ iljuData.branchElement }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 고유 총평 (Summary) -->
              <div
                class="p-3 sm:p-3.5 rounded-2xl border pg-border backdrop-blur-xs"
                :class="['bg-amber-500/10 border-amber-500/25', 'dark:bg-amber-400/5 dark:border-amber-400/20']"
              >
                <div class="flex items-center gap-1.5 mb-1.5">
                  <UIcon name="i-heroicons-sparkles" class="w-4 h-4 pg-text-gold" />
                  <span class="text-xs font-bold pg-text-gold">일주 총평</span>
                </div>
                <p class="text-xs sm:text-sm font-normal pg-text leading-relaxed">
                  {{ iljuData.content.summary }}
                </p>
              </div>
            </div>
          </section>

          <!-- 2. 구조 해부 (Structure Note: 납음·십이운성·일지 십신·지장간) -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">1. 구조 해부 (천간·지지·지장간·십이운성)</h3>
            </div>

            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-2">
              <p class="text-xs sm:text-sm pg-text leading-relaxed font-normal">
                {{ iljuData.content.structureNote }}
              </p>
            </div>
          </section>

          <!-- 3. 강점과 약점 & 3대 구체적 행동 장면 (Traits & Scenes) -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-user" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">2. 성향 분석 및 3대 현실 행동 장면</h3>
            </div>

            <!-- 강점 & 약점 그리드 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
                <div :class="['flex items-center gap-1.5 font-bold text-emerald-700', 'dark:text-emerald-300']">
                  <UIcon name="i-heroicons-plus-circle" class="w-4 h-4" />
                  <span>타고난 핵심 강점</span>
                </div>
                <ul class="space-y-1 text-[11px] sm:text-xs pg-text leading-relaxed pl-1">
                  <li v-for="(str, sIdx) in iljuData.content.traits.strengths" :key="sIdx">
                    • {{ str }}
                  </li>
                </ul>
              </div>

              <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
                <div :class="['flex items-center gap-1.5 font-bold text-rose-700', 'dark:text-rose-300']">
                  <UIcon name="i-heroicons-minus-circle" class="w-4 h-4" />
                  <span>경계해야 할 약점</span>
                </div>
                <ul class="space-y-1 text-[11px] sm:text-xs pg-text leading-relaxed pl-1">
                  <li v-for="(wk, wIdx) in iljuData.content.traits.weaknesses" :key="wIdx">
                    • {{ wk }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 3대 구체적 현실 행동 장면 -->
            <div class="space-y-2 pt-1 text-xs">
              <span class="text-[11px] font-bold pg-text-gold block">
                일상에서 나타나는 구체적 행동 패턴 (3 Scenes)
              </span>
              <div
                v-for="(scene, scIdx) in iljuData.content.traits.scenes"
                :key="scIdx"
                class="p-3 rounded-xl pg-card-inner border pg-border space-y-1"
              >
                <div class="flex items-center gap-1.5 font-bold pg-text-soft">
                  <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="w-3.5 h-3.5 pg-text-gold shrink-0" />
                  <span>장면 {{ (Number(scIdx) || 0) + 1 }}</span>
                </div>
                <p class="pg-text font-normal leading-relaxed text-[11px] sm:text-xs pl-5">
                  {{ scene }}
                </p>
              </div>
            </div>
          </section>

          <!-- 4. 4대 분야별 정밀 실전 운세 (Fields: 직업, 재물, 애정, 건강) -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">3. 4대 분야별 정밀 실전 운세</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <!-- 직업 및 적성 -->
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-briefcase" class="w-4 h-4 pg-text-gold" />
                  <strong class="pg-text-gold text-xs">직업 · 사업 및 적성</strong>
                </div>
                <p class="pg-text font-normal leading-relaxed text-[11px] sm:text-xs">
                  {{ iljuData.content.fields.career }}
                </p>
              </div>

              <!-- 재물 및 자산 관리 -->
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border flex flex-col justify-between space-y-1.5">
                <div>
                  <div class="flex items-center gap-1.5">
                    <UIcon name="i-heroicons-banknotes" class="w-4 h-4 pg-text-gold" />
                    <strong class="pg-text-gold text-xs">재물 · 투자 및 자산 관리</strong>
                  </div>
                  <p class="pg-text font-normal leading-relaxed text-[11px] sm:text-xs">
                    {{ iljuData.content.fields.wealth }}
                  </p>
                </div>
                <div :class="['mt-2 pt-1.5 border-t text-[10px] sm:text-[11px] leading-relaxed', 'border-slate-200/70 text-slate-500', 'dark:border-slate-800/70 dark:text-slate-400']">
                  ※ 본 재물 운세는 사주명리학의 상징적 풀이이며 특정 금융상품의 매매 권유가 아닙니다. 모든 재정 판단은 본인의 책임과 신중한 검토하에 결정하시기 바랍니다.
                </div>
              </div>

              <!-- 연애 및 대인관계 -->
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-heart" class="w-4 h-4 pg-text-gold" />
                  <strong class="pg-text-gold text-xs">연애 · 부부 및 대인관계</strong>
                </div>
                <p class="pg-text font-normal leading-relaxed text-[11px] sm:text-xs">
                  {{ iljuData.content.fields.love }}
                </p>
              </div>

              <!-- 전통 건강 관점 및 관리 -->
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4 pg-text-gold" />
                  <strong class="pg-text-gold text-xs">전통 건강 관점 및 심신 관리</strong>
                </div>
                <p class="pg-text font-normal leading-relaxed text-[11px] sm:text-xs">
                  {{ iljuData.content.fields.health }}
                </p>
              </div>
            </div>
          </section>

          <!-- 5. 계절 및 조후 흐름 (Season Flow) -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-sun" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">4. 계절·조후에 따른 기운의 흐름</h3>
            </div>

            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1.5 text-xs">
              <p class="pg-text font-normal leading-relaxed text-[11px] sm:text-xs">
                {{ iljuData.content.seasonFlow }}
              </p>
            </div>
          </section>

          <!-- 6. 상생과 조화의 궁합 (Compat: Good & Clash) -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-user-group" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">5. 상생과 상충의 궁합 분석</h3>
            </div>

            <div class="space-y-2 text-xs">
              <!-- 좋은 인연 -->
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-2">
                <div :class="['flex items-center gap-1.5 font-bold text-emerald-600', 'dark:text-emerald-400']">
                  <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                  <span>최고의 조화를 이루는 인연 (天地合德 · 六合)</span>
                </div>
                <div class="space-y-1.5 pl-1">
                  <div
                    v-for="(g, gIdx) in iljuData.content.compat.good"
                    :key="gIdx"
                    class="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                  >
                    <NuxtLink :to="`/guide/saju/ilju/${g.id}`" class="font-bold pg-text hover:text-(--fortune-gold) transition-colors flex items-center gap-1 mb-0.5">
                      <span>• {{ g.name }}</span>
                      <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 pg-text-muted" />
                    </NuxtLink>
                    <p class="text-[11px] pg-text-muted font-normal leading-relaxed pl-2">
                      {{ g.reason }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 주의해야 할 인연 -->
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-2">
                <div :class="['flex items-center gap-1.5 font-bold text-rose-600', 'dark:text-rose-400']">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                  <span>각별한 배려가 필요한 관계 (天沖·天剋 · 地沖)</span>
                </div>
                <div class="space-y-1.5 pl-1">
                  <div
                    v-for="(c, cIdx) in iljuData.content.compat.clash"
                    :key="cIdx"
                    class="p-2 rounded-lg bg-rose-500/5 border border-rose-500/20"
                  >
                    <NuxtLink :to="`/guide/saju/ilju/${c.id}`" class="font-bold pg-text hover:text-(--fortune-gold) transition-colors flex items-center gap-1 mb-0.5">
                      <span>• {{ c.name }}</span>
                      <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 pg-text-muted" />
                    </NuxtLink>
                    <p class="text-[11px] pg-text-muted font-normal leading-relaxed pl-2">
                      {{ c.reason }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 7. 편견과 오해 바로잡기 (Misconceptions) -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">6. 일주론의 오해와 진실 (전체 명식 해석의 중요성)</h3>
            </div>

            <div
              class="p-3 sm:p-3.5 rounded-xl border pg-border text-xs leading-relaxed"
              :class="['bg-amber-500/10 border-amber-500/25 text-amber-950', 'dark:bg-amber-400/5 dark:border-amber-400/20 dark:text-amber-200']"
            >
              <p class="font-normal">{{ iljuData.content.misconceptions }}</p>
            </div>
          </section>

          <!-- 8. 실전 FAQ (아코디언 - 디폴트 닫힘) -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">7. 일주 실전 상담 FAQ</h3>
            </div>

            <div class="space-y-2">
              <div
                v-for="(faq, fIdx) in iljuData.content.faq"
                :key="fIdx"
                class="rounded-xl pg-card-inner border pg-border overflow-hidden transition-colors"
                :class="isFaqOpen(fIdx) ? 'border-amber-500/40' : ''"
              >
                <button
                  type="button"
                  class="w-full p-3 sm:p-3.5 font-bold text-xs pg-text flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  :aria-expanded="isFaqOpen(fIdx) ? 'true' : 'false'"
                  @click="toggleFaq(fIdx)"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-amber-500 font-extrabold text-sm">Q.</span>
                    <span>{{ faq.q }}</span>
                  </span>
                  <UIcon
                    name="i-heroicons-chevron-down"
                    class="w-4 h-4 pg-text-gold transition-transform duration-200 shrink-0"
                    :class="isFaqOpen(fIdx) ? 'rotate-180' : ''"
                  />
                </button>
                <div
                  v-show="isFaqOpen(fIdx)"
                  class="p-3 sm:p-3.5 pt-0 border-t pg-border text-xs pg-text-muted leading-relaxed font-normal"
                >
                  <div class="pt-2">
                    <strong class="pg-text-gold">A.</strong> {{ faq.a }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 9. 고전 출처 문헌 & 메타 정보 -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-2 text-xs">
            <div class="flex items-center gap-1.5 font-bold pg-text-muted">
              <UIcon name="i-heroicons-book-open" class="w-4 h-4 pg-text-gold" />
              <span>참고 명리 고전 및 출처</span>
            </div>
            <ul class="flex flex-wrap gap-1.5 text-[11px] pg-text-muted">
              <li
                v-for="(src, sIdx) in iljuData.content.sources"
                :key="sIdx"
                class="px-2 py-0.5 rounded-md pg-card-inner border pg-border"
              >
                {{ src }}
              </li>
            </ul>
            <div class="pt-2 border-t pg-border flex justify-between items-center text-[11px] pg-text-muted">
              <NuxtLink to="/about" class="hover:underline flex items-center gap-1 hover:text-(--fortune-gold) transition-colors">
                <UIcon name="i-heroicons-information-circle" class="w-3.5 h-3.5" />
                <span>콘텐츠 편찬 및 편집 원칙</span>
              </NuxtLink>
              <span>작성일: {{ iljuData.content.reviewedAt }}</span>
            </div>
          </section>

        </template>

        <!-- ========================================== -->
        <!-- [레거시 호환 규격] 아직 개편 전인 일주 폴백 (isEnhanced: false) -->
        <!-- ========================================== -->
        <template v-else>

          <!-- 메인 레거시 카드 -->
          <section class="pg-card border rounded-3xl p-4 sm:p-5.5 shadow-xl relative overflow-hidden">
            <div class="relative z-20">
              <div class="flex items-center justify-between mb-2.5">
                <span class="px-2.5 sm:px-3 py-0.5 rounded-full pg-card-inner border pg-border text-xs font-bold pg-text-gold">
                  육십갑자 제{{ iljuData.order }}일주
                </span>
                <span class="text-xs font-semibold pg-text-muted">
                  {{ iljuData.branchAnimal }}의 해 · {{ iljuData.twelveStar }}
                </span>
              </div>

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
              </div>

              <div class="mt-3 p-3 rounded-2xl border pg-border backdrop-blur-xs" :class="['bg-white/10', 'dark:bg-black/10']">
                <p class="text-xs sm:text-sm font-semibold pg-text-gold leading-relaxed">
                  "{{ iljuData.character }}"
                </p>
              </div>
            </div>
          </section>

          <!-- 레거시 4대 운세 -->
          <section v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">4대 분야별 정밀 실전 운세</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
                <strong class="pg-text-gold text-xs block">사업 · 적성 분야</strong>
                <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                  {{ iljuData.careerFortune }}
                </p>
              </div>
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
                <strong class="pg-text-gold text-xs block">재물 · 자산 관리</strong>
                <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                  {{ iljuData.wealthFortune }}
                </p>
              </div>
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
                <strong class="pg-text-gold text-xs block">인간관계 · 애정 조언</strong>
                <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                  {{ iljuData.romanceAdvice }}
                </p>
              </div>
              <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
                <strong class="pg-text-gold text-xs block">건강 · 심신 관리</strong>
                <p class="pg-text-muted font-normal leading-relaxed text-[11px] sm:text-xs">
                  {{ iljuData.healthFortune }}
                </p>
              </div>
            </div>
          </section>

          <!-- 레거시 FAQ -->
          <section v-if="iljuData.faqList?.length" v-reveal class="pg-card border rounded-2xl p-3.5 sm:p-5 shadow-md space-y-2.5 sm:space-y-3">
            <div class="flex items-center gap-2 border-b pg-border pb-2 sm:pb-2.5">
              <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 pg-text-gold" />
              <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text">자주 묻는 질문 FAQ</h3>
            </div>

            <div class="space-y-2">
              <div
                v-for="(faq, idx) in iljuData.faqList"
                :key="idx"
                class="rounded-xl pg-card-inner border pg-border overflow-hidden transition-colors"
                :class="isFaqOpen(idx) ? 'border-amber-500/40' : ''"
              >
                <button
                  type="button"
                  class="w-full p-3 sm:p-3.5 font-bold text-xs pg-text flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  @click="toggleFaq(idx)"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-amber-500 font-extrabold text-sm">Q.</span>
                    <span>{{ faq.q }}</span>
                  </span>
                  <UIcon
                    name="i-heroicons-chevron-down"
                    class="w-4 h-4 pg-text-gold transition-transform duration-200 shrink-0"
                    :class="isFaqOpen(idx) ? 'rotate-180' : ''"
                  />
                </button>
                <div
                  v-show="isFaqOpen(idx)"
                  class="p-3 sm:p-3.5 pt-0 border-t pg-border text-xs pg-text-muted leading-relaxed font-normal"
                >
                  <div class="pt-2">
                    <strong class="pg-text-gold">A.</strong> {{ faq.a }}
                  </div>
                </div>
              </div>
            </div>
          </section>

        </template>

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
