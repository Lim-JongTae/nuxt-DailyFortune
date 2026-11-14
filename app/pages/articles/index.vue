<script setup lang="ts">
import { ARTICLES_DATA } from '~/data/articles'

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/articles`
const pageTitle = '정통 역학 칼럼 & 처세 매거진 | 일일운세 ✦ 天命'
const pageDesc = '2027 정미년 신년운세, 사주 용신 판별법, 삼재의 진실, 주역 64괘 심리학, 생활 속 오행 풍수 인테리어까지 천명 동양철학연구원의 깊이 있는 심층 칼럼을 만나보세요.'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  twitterCard: 'summary_large_image',
  twitterImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json' as const,
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: '천명(天命) 동양철학 역학 칼럼',
        description: pageDesc,
        url: pageUrl,
        publisher: {
          '@type': 'Organization',
          name: 'sajuapp.co.kr',
          url: 'https://sajuapp.co.kr'
        }
      })
    }
  ]
})

const selectedCategory = ref('전체')
const categories = ['전체', '신년운세 & 세운', '사주명리 심층', '정통 역학 상식', '주역 & 심리학', '생활 풍수 & 오행']

const filteredArticles = computed(() => {
  if (selectedCategory.value === '전체') {
    return ARTICLES_DATA
  }
  return ARTICLES_DATA.filter(a => a.category === selectedCategory.value)
})
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
    <!-- 헤더 섹션 -->
    <header class="text-center mb-10 pb-8 border-b pg-border">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full pg-card-inner border pg-border mb-3 shadow-xs">
        <span class="pg-text-gold text-xs">✦</span>
        <span class="text-xs font-semibold pg-text-gold tracking-wide">동양철학 심층 분석 매거진</span>
      </div>
      <h1 :class="['text-2xl sm:text-3xl md:text-4xl font-serif-kr font-bold tracking-tight mb-3', 'text-slate-900', 'dark:text-[#FFDE9E]']">
        정통 역학 칼럼 & 처세 지혜
      </h1>
      <p :class="['text-sm sm:text-base max-w-2xl mx-auto leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
        미신과 공포 마케팅을 걷어내고, 수천 년 고전 원전과 현대 심리학의 통찰로 풀어낸 천명(天命) 연구원의 공식 칼럼 시리즈입니다.
      </p>

      <!-- 카테고리 탭 버튼 -->
      <div class="mt-8 flex flex-wrap justify-center gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="selectedCategory = cat"
          :class="[
            'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border',
            selectedCategory === cat
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs scale-105'
              : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400 dark:bg-[#161B33] dark:text-slate-300 dark:border-slate-700'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </header>

    <!-- 칼럼 아티클 카드 그리드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      <article
        v-for="article in filteredArticles"
        :key="article.slug"
        :class="[
          'rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 group',
          'bg-white border-slate-200',
          'dark:bg-[#151C35] dark:border-slate-800'
        ]"
      >
        <div class="p-5 sm:p-6 flex-1 flex flex-col">
          <!-- 상단 메타 (카테고리 & 읽는 시간) -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span :class="['text-[11px] font-bold px-2.5 py-0.5 rounded-full border', 'bg-amber-50 text-amber-800 border-amber-200', 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50']">
              {{ article.category }}
            </span>
            <span class="text-xs pg-text-muted flex items-center gap-1">
              <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
              <span>{{ article.readTime }} 소요</span>
            </span>
          </div>

          <!-- 제목 -->
          <NuxtLink :to="`/articles/${article.slug}`" class="block mb-2">
            <h2 :class="['font-serif-kr text-lg sm:text-xl font-bold leading-snug transition-colors group-hover:text-amber-600', 'text-slate-900', 'dark:text-slate-100 dark:group-hover:text-[#FFDE9E]']">
              {{ article.title }}
            </h2>
          </NuxtLink>

          <!-- 부제목 및 요약 -->
          <p :class="['text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 flex-1', 'text-slate-600', 'dark:text-slate-300']">
            {{ article.summary }}
          </p>

          <!-- 태그 목록 -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="tag in article.tags.slice(0, 3)"
              :key="tag"
              class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- 하단 액션 바 -->
        <div class="px-5 sm:px-6 py-3.5 border-t pg-border flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-900/30">
          <span class="text-slate-400 dark:text-slate-500">{{ article.date }}</span>
          <NuxtLink
            :to="`/articles/${article.slug}`"
            class="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 group-hover:underline"
          >
            <span>칼럼 전문 읽기</span>
            <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>
      </article>
    </div>

    <!-- 하단 다른 허브 안내 -->
    <div class="mt-14 p-6 sm:p-8 rounded-2xl border pg-border bg-amber-50/40 dark:bg-[#12162A] text-center max-w-3xl mx-auto">
      <h3 class="font-serif-kr text-base sm:text-lg font-bold mb-2 pg-text-gold">
        ✦ 사주 60일주와 주역 64괘 해설도 함께 살펴보세요
      </h3>
      <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5">
        140편 이상의 정통 학술 백과가 준비되어 있습니다. 오늘의 운세와 함께 자신의 성향과 처세의 지혜를 확인하세요.
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <NuxtLink to="/guide/saju" class="btn-gold-action text-xs sm:text-sm">
          <span>사주 60일주 백과</span>
        </NuxtLink>
        <NuxtLink to="/guide/iching" class="btn-gold-action text-xs sm:text-sm">
          <span>주역 64괘 해설집</span>
        </NuxtLink>
        <NuxtLink to="/" class="btn-gold-action text-xs sm:text-sm">
          <span>홈으로 가기</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

