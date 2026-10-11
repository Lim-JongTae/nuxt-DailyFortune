<script setup lang="ts">
import { ref, computed } from 'vue'

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/saju`

useSeoMeta({
  title: '사주명리 60일주 실전 처세 가이드 - 나를 찾는 육십갑자의 지혜',
  description: '1번 갑자일주부터 60번 계해일주까지. 60일주(60柱論)의 정통 물상론, 지장간, 십신, 십이운성, 4대 운세와 실전 처세 지침을 한눈에 살펴보세요.',
  ogTitle: '사주명리 60일주 실전 처세 가이드 - 나를 찾는 육십갑자의 지혜',
  ogDescription: '1번 갑자일주부터 60번 계해일주까지. 60일주(60柱論)의 정통 물상론, 지장간, 십신, 십이운성, 4대 운세와 실전 처세 지침을 한눈에 살펴보세요.',
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
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '사주명리 60일주 실전 처세 가이드',
        description: '육십갑자 60일주의 정통 물상론, 지장간, 십신 및 4대 운세 해설 가이드',
        url: pageUrl,
        inLanguage: 'ko-KR'
      })
    }
  ]
})

interface IljuSummaryItem {
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
  shipsinSelf: string
  twelveStar: string
  mulsang: string
}

interface ApiResponse {
  success: boolean
  data?: IljuSummaryItem[]
}

// 0.001초 인메모리 60일주 전체 목록 조회
const { data: apiResponse, status } = await useAsyncData<ApiResponse>(
  'saju-guide-all-ilju-list',
  () => $fetch<ApiResponse>('/api/saju/ilju')
)

const iljuList = computed<IljuSummaryItem[]>(() => apiResponse.value?.data || [])

// 탭 필터: 전체 또는 5대 오행 (일간 천간 오행 기준)
type FilterTab = 'all' | 'wood' | 'fire' | 'earth' | 'metal' | 'water'
const activeTab = ref<FilterTab>('all')
const searchKeyword = ref('')

const filterTabs: Array<{ id: FilterTab; label: string; count: number }> = [
  { id: 'all', label: '전체 (60일주)', count: 60 },
  { id: 'wood', label: '목(木) 갑·을', count: 12 },
  { id: 'fire', label: '화(火) 병·정', count: 12 },
  { id: 'earth', label: '토(土) 무·기', count: 12 },
  { id: 'metal', label: '금(金) 경·신', count: 12 },
  { id: 'water', label: '수(水) 임·계', count: 12 }
]

// 오행 뱃지 스타일 맵
const elementBadgeClassMap: Record<string, string> = {
  wood: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300',
  fire: 'bg-rose-500/15 border-rose-500/35 text-rose-700 dark:text-rose-300',
  earth: 'bg-amber-500/15 border-amber-500/35 text-amber-700 dark:text-amber-300',
  metal: 'bg-slate-500/15 border-slate-500/35 text-slate-700 dark:text-slate-300',
  water: 'bg-blue-500/15 border-blue-500/35 text-blue-700 dark:text-blue-300'
}

// 필터링 및 검색 적용
const filteredIljuList = computed(() => {
  return iljuList.value.filter((item) => {
    // 탭 필터 (천간 오행 기준)
    if (activeTab.value !== 'all' && item.stemColor !== activeTab.value) {
      return false
    }

    // 키워드 검색
    if (!searchKeyword.value.trim()) return true
    const q = searchKeyword.value.trim().toLowerCase()
    return (
      item.ganzhi.toLowerCase().includes(q) ||
      item.ganzhiHanja.includes(q) ||
      item.branchAnimal.includes(q) ||
      item.mulsang.toLowerCase().includes(q) ||
      item.shipsinSelf.includes(q) ||
      item.twelveStar.includes(q) ||
      String(item.order) === q
    )
  })
})
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-3xl mx-auto px-4 py-4 sm:py-6">

      <!-- 1. 헤더 -->
      <header class="flex items-center justify-between pb-3 border-b pg-border mb-4">
        <NuxtLink to="/guide" class="p-1.5 rounded-full pg-back-btn transition-colors">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="text-center">
          <span class="text-[9px] font-bold tracking-widest pg-text-gold block uppercase">정통 명리학 지식</span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            사주 60일주 실전 처세 가이드
          </h1>
        </div>
        <NuxtLink to="/saju" class="p-1.5 rounded-full pg-text-gold hover:opacity-80 transition-opacity" title="오늘의 사주 보기">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
        </NuxtLink>
      </header>

      <!-- 2. 정통 해설 안내 히어로 박스 -->
      <section v-reveal class="pg-card border rounded-3xl p-5 shadow-xl mb-6 relative overflow-hidden">
        <div class="absolute -right-3 -top-5 pg-watermark-text text-8xl font-serif-kr select-none pointer-events-none opacity-20">
          命
        </div>
        <div class="relative z-10">
          <span class="inline-block px-3 py-1 rounded-full pg-card-inner border pg-border pg-text-gold text-xs font-bold font-serif-kr mb-2">
            📜 나를 알아가는 육십갑자 60일주 이야기
          </span>
          <h2 class="font-serif-kr text-lg sm:text-xl font-bold pg-text mb-2">
            천간과 지지가 빚어내는 60가지 고유한 본질
          </h2>
          <p class="text-xs pg-text-muted leading-relaxed">
            사주팔자에서 태어난 날(일주, 日柱)은 나 자신(일간, 日干)과 배우자 자리(일지, 日支)를 뜻하는 가장 핵심적인 기운입니다. 1번 갑자부터 60번 계해까지 정통 물상론과 지장간, 십신, 4대 운세를 확인해 보세요.
          </p>

          <div class="mt-4 pt-3 border-t pg-border flex justify-between items-center text-xs">
            <span class="pg-text-soft">오늘 나의 사주팔자와 일주가 궁금하시다면?</span>
            <NuxtLink to="/saju" class="pg-text-gold font-bold hover:underline flex items-center gap-1">
              오늘의 사주 보기 ➔
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 3. 검색 및 5대 오행 필터 탭 -->
      <section v-reveal class="space-y-3 mb-6">
        <!-- 검색 인풋 -->
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="일주 이름, 한자, 동물 또는 키워드 검색 (예: 갑자, 乙丑, 쥐, 호랑이)..."
            class="w-full py-3 pl-10 pr-4 rounded-2xl border pg-border pg-card-inner text-xs sm:text-sm pg-text focus:outline-hidden focus:border-(--fortune-gold) transition-colors"
          />
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 pg-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <!-- 5대 오행 카테고리 탭 (스크롤 바 또는 그리드) -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            type="button"
            class="px-3 py-1.5 rounded-xl border font-bold transition-all text-[11px] whitespace-nowrap cursor-pointer select-none"
            :class="activeTab === tab.id
              ? [
                  'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
                  'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
                  'text-amber-950',
                  'border-amber-300',
                  'dark:border-amber-400',
                  'shadow-md font-extrabold'
                ]
              : 'pg-card-inner pg-border pg-text-muted hover:pg-text'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </section>

      <!-- 4. 결과 개수 표시 -->
      <div class="flex items-center justify-between mb-3 px-1 text-xs pg-text-muted">
        <span>총 <strong class="pg-text font-bold">{{ filteredIljuList.length }}</strong>개의 일주</span>
        <span class="text-[11px]">1번 갑자 ~ 60번 계해</span>
      </div>

      <!-- 5. 로딩 스켈레톤 -->
      <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
        <div v-for="i in 6" :key="i" class="pg-card border rounded-2xl p-4 space-y-2.5">
          <div class="h-4 w-24 skeleton-bar rounded-md"></div>
          <div class="h-6 w-32 skeleton-bar rounded-lg"></div>
          <div class="h-3.5 w-full skeleton-bar rounded-md"></div>
        </div>
      </div>

      <!-- 6. 60일주 카드 그리드 목록 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NuxtLink
          v-for="(item, idx) in filteredIljuList"
          :key="item.code"
          :to="`/guide/saju/ilju/${item.code}`"
          v-reveal="{ delay: (idx % 10) * 40 }"
          class="pg-card border rounded-2xl p-4 hover:border-(--fortune-gold) transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <!-- 상단 라벨 & 오행 뱃지 -->
            <div class="flex justify-between items-center mb-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full pg-chip border pg-border font-serif-kr">
                제{{ item.order }}일주 · {{ item.ganzhiHanja }}
              </span>
              <div class="flex items-center gap-1">
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-lg border font-serif-kr"
                  :class="elementBadgeClassMap[item.stemColor]"
                >
                  {{ item.stemHanja }}{{ item.stemElement.replace(/\(.*\)/, '') }}
                </span>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-lg border font-serif-kr"
                  :class="elementBadgeClassMap[item.branchColor]"
                >
                  {{ item.branchHanja }}{{ item.branchAnimal }}
                </span>
              </div>
            </div>

            <!-- 일주 제목 -->
            <h3 class="font-serif-kr text-base font-extrabold pg-text mb-1 group-hover:pg-text-gold transition-colors flex items-baseline gap-1.5">
              <span>{{ item.ganzhi }}일주</span>
              <span class="text-xs font-normal pg-text-muted">({{ item.ganzhiHanja }})</span>
            </h3>

            <!-- 물상론 요약 -->
            <p class="text-xs pg-text-muted font-normal leading-relaxed line-clamp-2 mb-2.5">
              {{ item.mulsang }}
            </p>
          </div>

          <!-- 하단 메타 & 바로가기 -->
          <div class="pt-2 border-t pg-border flex justify-between items-center text-[11px]">
            <div class="flex items-center gap-1.5 text-[10px] pg-text-soft">
              <span class="px-1.5 py-0.5 rounded-md pg-card-inner border pg-border">{{ item.shipsinSelf }}</span>
              <span class="px-1.5 py-0.5 rounded-md pg-card-inner border pg-border">{{ item.twelveStar }}</span>
            </div>
            <span class="pg-text-gold font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              정통 풀이
              <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5" />
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- 검색 결과 없을 때 -->
      <div v-if="filteredIljuList.length === 0 && status !== 'pending'" class="text-center py-12 pg-card border rounded-2xl p-6">
        <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 pg-text-muted mx-auto mb-2" />
        <p class="text-sm pg-text font-bold mb-1">검색 결과가 없습니다.</p>
        <p class="text-xs pg-text-muted">다른 검색어를 입력하시거나 오행 필터를 변경해 보세요.</p>
      </div>

      <!-- 하단 네비게이션 버튼 -->
      <div v-reveal class="mt-10 pt-6 border-t pg-border flex flex-wrap justify-center items-center gap-3 w-full text-center">
        <NuxtLink to="/guide" class="btn-gold-action">
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
          <span>가이드 메인으로</span>
        </NuxtLink>
        <NuxtLink to="/" class="btn-gold-action">
          <UIcon name="i-heroicons-home" class="w-4 h-4" />
          <span>홈으로 이동</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
