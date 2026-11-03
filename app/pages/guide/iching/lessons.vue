<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  ichingLessonsList,
  famousQuoteHighlights,
  lessonCategories,
  type IchingLessonItem,
  type FamousQuoteHighlight
} from '~/data/ichingLessonsData'

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/iching/lessons`

useSeoMeta({
  title: '주역 인생 처세 나침반 - 사업·부·사랑·직장·건강·위기 극복 64괘 실전 교훈',
  description: '주역(周易)을 단순 점술이 아닌 3,000년 동양 최고의 의사결정학 고전으로 읽는다. 이섭대천(과감한 결단), 이유유왕(기회의 선점), 십붕지구(전문가 자문), 신언절식(건강 양생) 등 삶의 결정적 순간을 돌파하는 64괘 실전 행동 지침을 만나보세요.',
  ogTitle: '주역 인생 처세 나침반 - 사업·부·사랑·직장·건강·위기 극복 64괘 실전 교훈',
  ogDescription: '주역(周易)을 단순 점술이 아닌 3,000년 동양 최고의 의사결정학 고전으로 읽는다. 이섭대천, 이유유왕, 십붕지구, 신언절식 등 삶의 결정적 순간을 돌파하는 실전 행동 지침.',
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image'
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: '주역 64괘 상황별 실전 인생 처세 교훈 가이드',
        description: '사업, 부와 재테크, 사랑과 인간관계, 직장 처세, 건강·자기관리, 위기 극복을 위한 64괘 의사결정학 가이드',
        url: pageUrl,
        inLanguage: 'ko-KR',
        publisher: {
          '@type': 'Organization',
          name: 'sajuapp.co.kr 주역 연구팀',
          url: 'https://sajuapp.co.kr'
        }
      })
    }
  ]
})

// 8괘 기호 매핑
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

function getHexagramSymbols(id: number) {
  const [uId, lId] = hexagramTrigramIds[id] || [1, 1]
  const upper = trigramSymbols[uId] || { symbol: '☰', name: '건' }
  const lower = trigramSymbols[lId] || { symbol: '☰', name: '건' }
  return {
    upperSymbol: upper.symbol,
    lowerSymbol: lower.symbol,
    upperName: upper.name,
    lowerName: lower.name
  }
}

// 필터 상태
const selectedCategory = ref<string>('all')
const searchKeyword = ref<string>('')

// 카테고리별 개수 계산
const categoryCounts = computed(() => {
  const counts: Record<string, number> = { all: ichingLessonsList.length }
  for (const item of ichingLessonsList) {
    counts[item.category] = (counts[item.category] || 0) + 1
  }
  return counts
})

// 필터링된 교훈 목록
const filteredLessons = computed(() => {
  return ichingLessonsList.filter((item: IchingLessonItem) => {
    // 1. 카테고리 필터
    if (selectedCategory.value !== 'all' && item.category !== selectedCategory.value) {
      return false
    }

    // 2. 검색 키워드 필터
    if (!searchKeyword.value.trim()) return true
    const q = searchKeyword.value.trim().toLowerCase()
    return (
      item.hexagramNameKorean.toLowerCase().includes(q) ||
      item.hexagramNameHanji.includes(q) ||
      item.idiomHanja.includes(q) ||
      item.idiomKorean.toLowerCase().includes(q) ||
      item.coreMeaning.toLowerCase().includes(q) ||
      item.situationSummary.toLowerCase().includes(q) ||
      item.modernLesson.toLowerCase().includes(q) ||
      item.searchKeywords.some(kw => kw.toLowerCase().includes(q))
    )
  })
})

const selectedQuoteId = ref<number | null>(null)

// 카테고리 탭 변경 (탭 클릭 시 기존 검색어 초기화하여 카테고리 전체 목록 보장)
function changeCategory(catId: string) {
  selectedCategory.value = catId
  searchKeyword.value = ''
  selectedQuoteId.value = null
}

// 명언 클릭 시 해당 카테고리로 필터링, 검색어 세팅 및 해당 괘 상세 위치로 화면 스크롤 이동
function selectQuote(quote: FamousQuoteHighlight) {
  selectedQuoteId.value = quote.hexagramId
  selectedCategory.value = quote.category
  searchKeyword.value = quote.idiomKorean.split(' ')[0] ?? ''

  nextTick(() => {
    const target = document.getElementById(`lesson-hex-${quote.hexagramId}`) || document.getElementById('lessons-search-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto px-4 py-4 sm:py-6">

      <!-- 상단 네비게이션 헤더 -->
      <div class="flex items-center justify-between pb-3 border-b pg-border mb-4">
        <NuxtLink to="/guide/iching" class="p-1.5 rounded-full pg-back-btn transition-colors" title="주역 64괘 가이드로 돌아가기">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="text-center">
          <span class="text-[9px] font-bold tracking-widest pg-text-gold block uppercase">3,000년 동양 의사결정학</span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            주역 상황별 인생 처세 나침반
          </h1>
        </div>
        <NuxtLink to="/iching" class="p-1.5 rounded-full pg-text-gold hover:opacity-80 transition-opacity" title="오늘의 주역 점대 드로우">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- 메인 히어로 소개 박스 -->
      <div v-reveal class="pg-card border rounded-3xl p-5 sm:p-6 shadow-xl mb-6 relative overflow-hidden">
        <div class="absolute -right-4 -top-6 pg-watermark-text text-8xl sm:text-9xl font-serif-kr select-none pointer-events-none opacity-15">
          道
        </div>
        <div class="relative z-10">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-block px-3 py-1 rounded-full pg-card-inner border pg-border pg-text-gold text-xs font-bold font-serif-kr">
              ☯️ 점술(占)을 넘어 삶의 지혜(智)로
            </span>
            <span class="text-[10px] pg-text-muted hidden sm:inline-block">공자(孔子) 십익(十翼) 현대적 재해석</span>
          </div>

          <h2 class="font-serif-kr text-lg sm:text-2xl font-bold pg-text mb-2 leading-snug">
            삶의 결정적 순간, 주역이 가르치는 실전 해법
          </h2>
          <p class="text-xs sm:text-sm pg-text-muted leading-relaxed">
            주역(周易)은 단순한 미래 예측이 아닌, 변화의 파도 속에서 인간이 어떻게 처신해야 길(吉)을 열고 흉(凶)을 피할 수 있는지 밝힌 <span class="font-semibold pg-text">동양 최고의 의사결정학이자 심신 양생학</span>입니다. 사업, 돈, 사랑, 조직 처세, 건강·자기관리, 위기 극복의 6대 상황별 솔루션을 확인해 보세요.
          </p>

          <!-- 3대 원칙 요약 칩 -->
          <div class="mt-4 pt-3 border-t pg-border grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
            <div class="p-2 rounded-xl pg-card-inner border pg-border">
              <span class="font-bold pg-text block font-serif-kr">변역(變易)</span>
              <span class="pg-text-muted text-[10px]">만물은 끊임없이 변화한다</span>
            </div>
            <div class="p-2 rounded-xl pg-card-inner border pg-border">
              <span class="font-bold pg-text block font-serif-kr">불역(不易)</span>
              <span class="pg-text-muted text-[10px]">변화 속 불변의 원칙이 있다</span>
            </div>
            <div class="p-2 rounded-xl pg-card-inner border pg-border">
              <span class="font-bold pg-text block font-serif-kr">간이(簡易)</span>
              <span class="pg-text-muted text-[10px]">이치를 알면 도리는 단순하다</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 상단 하이라이트 명언 캐러셀 카드 -->
      <div v-reveal class="mb-6">
        <div class="flex items-center justify-between mb-2.5 px-1">
          <h3 class="font-serif-kr text-xs sm:text-sm font-bold pg-text flex items-center gap-1.5">
            <UIcon name="i-heroicons-bookmark-square" class="w-4 h-4 text-amber-500" />
            <span>주역이 남긴 핵심 결정적 명언 & 양생법</span>
          </h3>
          <span class="text-[10px] pg-text-muted">클릭 시 해당 교훈으로 이동</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            v-for="quote in famousQuoteHighlights"
            :key="quote.idiomHanja"
            type="button"
            @click="selectQuote(quote)"
            class="relative overflow-hidden text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl active:scale-[0.99]"
            :class="selectedQuoteId === quote.hexagramId
              ? [
                  'border-amber-400 ring-2 ring-amber-400/40 shadow-lg',
                  'bg-linear-to-b from-amber-50/90 to-amber-100/40',
                  'dark:from-amber-950/40 dark:to-slate-900/60 dark:border-amber-400'
                ]
              : [
                  'pg-border pg-card-inner hover:border-amber-400/80',
                  'hover:bg-amber-50/30 dark:hover:bg-amber-950/20'
                ]"
          >
            <!-- 상단 은은한 골드 액센트 탑 라인 -->
            <div class="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-amber-400 via-yellow-400 to-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div>
              <!-- 상단 카테고리 뱃지 & 괘 정보 -->
              <div class="flex items-center justify-between text-[11px] mb-2">
                <span :class="['inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-800', 'dark:text-amber-300']">
                  <UIcon name="i-heroicons-sparkles" class="w-3 h-3 text-amber-500" />
                  <span>{{ quote.categoryName }}</span>
                </span>
                <span class="text-[10px] pg-text-muted font-serif-kr group-hover:pg-text transition-colors">
                  제{{ quote.hexagramId }}괘 {{ quote.hexagramName }}
                </span>
              </div>

              <!-- 핵심 사자성어 -->
              <div class="mb-1.5 flex items-baseline gap-1.5">
                <span :class="['font-serif-kr font-extrabold text-base sm:text-lg pg-text transition-colors tracking-wide group-hover:text-amber-600', 'dark:group-hover:text-amber-400']">
                  {{ quote.idiomHanja }}
                </span>
                <span :class="['text-[11px] font-semibold font-serif-kr text-amber-700', 'dark:text-amber-300']">
                  ({{ quote.idiomKorean }})
                </span>
              </div>

              <!-- 한 줄 해석 요약 -->
              <p class="text-xs pg-text-muted leading-relaxed line-clamp-2">
                {{ quote.meaning }}
              </p>
            </div>

            <!-- 고전 비하인드 위트 팁 (십붕 조개껍데기 화폐, 신언절식 양생법 등) -->
            <div
              v-if="quote.funFact"
              :class="[
                'mt-3 pt-2.5 border-t pg-border text-[11px] p-2.5 rounded-xl leading-relaxed',
                'text-amber-900 bg-amber-500/10',
                'dark:text-amber-200 dark:bg-amber-400/10'
              ]"
            >
              <div class="flex items-center gap-1 font-bold mb-0.5">
                <span :class="['text-amber-700', 'dark:text-amber-300']">💡 고전 비하인드:</span>
              </div>
              <p class="text-[10.5px] leading-snug opacity-90">
                {{ quote.funFact }}
              </p>
            </div>

            <!-- 하단 이동 유도 액션 인디케이터 -->
            <div class="mt-2.5 pt-2 border-t pg-border flex items-center justify-between text-[10px] pg-text-gold font-bold">
              <span class="group-hover:underline">상세 교훈 및 3단계 수칙 보기</span>
              <UIcon name="i-heroicons-arrow-down-right" class="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      <!-- 검색 인풋 및 카테고리 탭 -->
      <div id="lessons-search-section" v-reveal class="space-y-3 mb-6 scroll-mt-20">
        <!-- 검색창 -->
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="상황이나 키워드를 검색해 보세요 (예: 돈 버는 법, 사업 결단, 십붕지구, 신언절식, 연애, 다이어트, 수면, 번아웃)..."
            class="w-full py-3 pl-10 pr-10 rounded-2xl border pg-border pg-card-inner text-xs sm:text-sm pg-text focus:outline-hidden focus:border-(--fortune-gold) transition-colors"
          />
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 pg-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            v-if="searchKeyword"
            type="button"
            @click="searchKeyword = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-xs pg-text-muted hover:pg-text"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <!-- 6대 카테고리 탭 (모든 화면에서 100% 한눈에 노출되는 줄바꿈 래핑 구조) -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            v-for="cat in lessonCategories"
            :key="cat.id"
            type="button"
            @click="changeCategory(cat.id)"
            class="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 cursor-pointer select-none"
            :class="selectedCategory === cat.id
              ? [
                  'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
                  'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
                  'text-amber-950',
                  'border-amber-300',
                  'dark:border-amber-400',
                  'shadow-sm font-extrabold'
                ]
              : 'pg-card-inner pg-text-muted pg-border hover:pg-text'"
          >
            <UIcon :name="cat.icon" class="w-3.5 h-3.5 shrink-0" />
            <span>{{ cat.name }}</span>
            <span
              class="text-[10px] px-1.5 py-0.2 rounded-full"
              :class="selectedCategory === cat.id
                ? ['bg-amber-950/20 text-amber-950 font-bold']
                : ['bg-slate-200/60 text-slate-500', 'dark:bg-slate-800']"
            >
              {{ categoryCounts[cat.id] || 0 }}
            </span>
          </button>
        </div>
      </div>

      <!-- 상황별 교훈 카드 리스트 -->
      <div v-if="filteredLessons.length > 0" class="space-y-6">
        <article
          v-for="(item, idx) in filteredLessons"
          :key="item.id"
          :id="`lesson-hex-${item.hexagramId}`"
          v-reveal="{ delay: (idx % 6) * 50 }"
          class="relative overflow-hidden pg-card border rounded-3xl p-5 sm:p-7 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-amber-400/90 hover:-translate-y-1 group scroll-mt-20"
        >
          <!-- 카드 상단 은은한 골드 탑 라인 -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400/80 via-yellow-400/90 to-amber-500/80 opacity-70 group-hover:opacity-100 transition-opacity" />

          <!-- 우측 상단 괘명 한자 워터마크 -->
          <div :class="['absolute -right-2 top-2 font-serif-kr text-6xl sm:text-7xl font-black select-none pointer-events-none pg-text opacity-4', 'dark:opacity-6']">
            {{ item.hexagramNameHanji }}
          </div>

          <!-- 카드 상단: 카테고리 뱃지 & 64괘 기호/이름 -->
          <div class="flex items-start justify-between gap-2 pb-3.5 border-b pg-border mb-4 relative z-10">
            <div class="flex flex-wrap items-center gap-2">
              <span :class="['inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 shadow-xs text-amber-900', 'dark:text-amber-200']">
                <UIcon :name="item.categoryIcon" class="w-3.5 h-3.5 text-amber-500" />
                <span>{{ item.categoryName }}</span>
              </span>
              <span class="text-xs sm:text-sm font-serif-kr font-bold pg-text">
                제{{ item.hexagramId }}괘 <strong class="pg-text-gold font-extrabold">{{ item.hexagramNameKorean }}</strong>
                <span class="text-[11px] font-normal opacity-70 ml-1">({{ item.hexagramNameHanji }})</span>
              </span>
            </div>

            <!-- 상/하괘 기호 목판 인장 스타일 박스 -->
            <div class="flex items-center gap-2 px-3 py-1 rounded-xl pg-card-inner border pg-border shadow-xs group-hover:border-amber-400/60 transition-colors shrink-0">
              <div class="flex flex-col items-center leading-none text-center">
                <span
                  :class="['text-sm font-serif-kr font-bold text-amber-600', 'dark:text-amber-400']"
                  title="상괘"
                >
                  {{ getHexagramSymbols(item.hexagramId).upperSymbol }}
                </span>
                <span class="text-[9px] pg-text-muted font-serif-kr mt-0.5">
                  {{ getHexagramSymbols(item.hexagramId).upperName }}
                </span>
              </div>
              <div class="w-px h-5 bg-amber-500/25" />
              <div class="flex flex-col items-center leading-none text-center">
                <span
                  :class="['text-sm font-serif-kr font-bold text-amber-600', 'dark:text-amber-400']"
                  title="하괘"
                >
                  {{ getHexagramSymbols(item.hexagramId).lowerSymbol }}
                </span>
                <span class="text-[9px] pg-text-muted font-serif-kr mt-0.5">
                  {{ getHexagramSymbols(item.hexagramId).lowerName }}
                </span>
              </div>
            </div>
          </div>

          <!-- 핵심 사자성어 및 대표 한 줄 교훈 -->
          <div class="mb-4 relative z-10">
            <div class="flex flex-wrap items-baseline gap-2 mb-1.5">
              <h3 :class="['font-serif-kr text-xl sm:text-2xl font-black pg-text tracking-wide transition-colors group-hover:text-amber-600', 'dark:group-hover:text-amber-400']">
                {{ item.idiomHanja }}
              </h3>
              <span :class="['text-xs sm:text-sm font-bold font-serif-kr text-amber-700', 'dark:text-amber-300']">
                {{ item.idiomKorean }}
              </span>
            </div>
            <div :class="['p-3 sm:p-3.5 rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/70 border-y border-r border-amber-200/50', 'dark:bg-amber-950/25 dark:border-amber-900/30']">
              <p :class="['font-serif-kr text-xs sm:text-sm font-extrabold leading-relaxed text-amber-900', 'dark:text-amber-200']">
                “{{ item.coreMeaning }}”
              </p>
            </div>
          </div>

          <!-- 직면 상황 요약 박스 -->
          <div
            :class="[
              'p-3.5 sm:p-4 rounded-2xl border mb-3.5',
              'bg-slate-50/80 border-slate-200/80',
              'dark:bg-slate-900/40 dark:border-slate-800'
            ]"
          >
            <div :class="['flex items-center gap-1.5 text-xs font-bold mb-1.5 text-slate-700', 'dark:text-slate-300']">
              <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 text-amber-500 shrink-0" />
              <span>이 교훈이 필요한 결정적 순간</span>
            </div>
            <p :class="['text-xs sm:text-[13px] leading-relaxed text-slate-600', 'dark:text-slate-300']">
              {{ item.situationSummary }}
            </p>
          </div>

          <!-- 현대적 해법 본문 -->
          <div class="p-4 rounded-2xl pg-card-inner border pg-border mb-3.5">
            <div class="flex items-center gap-1.5 text-xs font-bold pg-text mb-1.5">
              <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 text-amber-500 shrink-0" />
              <span>3,000년 고전의 현대적 해법</span>
            </div>
            <p class="text-xs sm:text-[13px] pg-text-muted leading-relaxed mb-2.5">
              {{ item.modernLesson }}
            </p>
            <!-- 고전 원문 인용 블록 -->
            <div :class="['p-2.5 rounded-xl border pg-border flex flex-wrap items-center gap-2 text-xs font-serif-kr bg-amber-50/50', 'dark:bg-amber-950/20']">
              <span :class="['px-2 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-bold shrink-0 text-amber-800', 'dark:text-amber-300']">고전 원문</span>
              <span class="pg-text-muted italic text-[11px] sm:text-xs tracking-wide">{{ item.originQuote }}</span>
            </div>
          </div>

          <!-- 지금 즉시 실천할 3단계 액션 가이드 -->
          <div class="p-4 sm:p-5 rounded-2xl border pg-border pg-card-inner mb-4">
            <h4 class="text-xs sm:text-sm font-bold pg-text-gold mb-3 flex items-center gap-1.5">
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-amber-500" />
              <span>지금 즉시 실천할 3단계 행동 수칙</span>
            </h4>
            <div class="space-y-2">
              <div
                v-for="(step, sIdx) in item.actionSteps"
                :key="sIdx"
                :class="[
                  'p-2.5 rounded-xl border pg-border hover:border-amber-400/50 transition-colors flex items-start gap-2.5 bg-white/60',
                  'dark:bg-slate-900/40'
                ]"
              >
                <span class="w-5 h-5 rounded-full bg-linear-to-br from-amber-400 to-yellow-500 text-amber-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  {{ sIdx + 1 }}
                </span>
                <span class="text-xs sm:text-[13px] pg-text leading-relaxed">{{ step }}</span>
              </div>
            </div>
          </div>

          <!-- 카드 하단: 상세 6효사 가이드 연결 링크 -->
          <div class="pt-3 border-t pg-border flex flex-wrap justify-between items-center gap-2 text-xs">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="kw in item.searchKeywords.slice(0, 3)"
                :key="kw"
                :class="[
                  'text-[10px] px-2.5 py-1 rounded-full pg-card-inner border pg-border pg-text-soft hover:border-amber-400/60 transition-colors hover:text-amber-600',
                  'dark:hover:text-amber-400'
                ]"
              >
                #{{ kw }}
              </span>
            </div>

            <NuxtLink
              :to="`/guide/iching/${item.hexagramId}`"
              :class="[
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 font-bold text-xs transition-all hover:translate-x-0.5 hover:shadow-xs group/btn text-amber-800',
                'dark:text-amber-300'
              ]"
            >
              <span>제{{ item.hexagramId }}괘 전체 6효사 해설</span>
              <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- 검색 결과 없음 안내 -->
      <div v-else class="pg-card border rounded-3xl p-8 text-center shadow-xs">
        <UIcon name="i-heroicons-exclamation-circle" class="w-10 h-10 pg-text-soft mx-auto mb-2" />
        <h3 class="font-serif-kr text-base font-bold pg-text mb-1">
          일치하는 상황별 주역 교훈을 찾을 수 없습니다.
        </h3>
        <p class="text-xs pg-text-muted mb-4">
          검색어 철자를 확인하시거나, 상단의 카테고리 탭(전체/사업/부/사랑 등)을 클릭해 보세요.
        </p>
        <button
          type="button"
          @click="selectedCategory = 'all'; searchKeyword = ''; selectedQuoteId = null"
          class="btn-gold-action inline-flex items-center gap-1 text-xs"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
          <span>전체 교훈 목록으로 초기화</span>
        </button>
      </div>

      <!-- 하단 네비게이션 & 빠른 링크 -->
      <div v-reveal class="mt-10 pt-6 border-t pg-border space-y-4">
        <!-- 64괘 목록 및 점치기 바로가기 배너 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NuxtLink
            to="/guide/iching"
            class="p-4 rounded-2xl border pg-border pg-card hover:border-amber-400 transition-all flex items-center justify-between group"
          >
            <div>
              <span class="text-[10px] font-bold pg-text-gold block">정통 고전 백과</span>
              <span class="font-serif-kr text-sm font-bold pg-text">주역 64괘 전체 목록 보기</span>
            </div>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 pg-text-gold group-hover:translate-x-1 transition-transform" />
          </NuxtLink>

          <NuxtLink
            to="/iching"
            class="p-4 rounded-2xl border pg-border pg-card hover:border-amber-400 transition-all flex items-center justify-between group"
          >
            <div>
              <span class="text-[10px] font-bold pg-text-gold block">오늘의 3단계 점대 드로우</span>
              <span class="font-serif-kr text-sm font-bold pg-text">오늘 나의 주역 괘 점치기</span>
            </div>
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 pg-text-gold group-hover:scale-110 transition-transform" />
          </NuxtLink>
        </div>

        <div class="flex flex-wrap justify-center items-center gap-3 w-full text-center pt-2">
          <NuxtLink to="/guide" class="btn-gold-action">
            <UIcon name="i-heroicons-book-open" class="w-4 h-4" />
            <span>가이드 메인으로</span>
          </NuxtLink>
          <NuxtLink to="/" class="btn-gold-action">
            <UIcon name="i-heroicons-home" class="w-4 h-4" />
            <span>홈으로 이동</span>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>
