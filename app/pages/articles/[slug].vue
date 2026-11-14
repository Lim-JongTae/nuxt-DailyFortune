<script setup lang="ts">
import { ARTICLES_DATA, type ArticleItem } from '~/data/articles'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const article = computed<ArticleItem | undefined>(() => {
  return ARTICLES_DATA.find(a => a.slug === slug.value)
})

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '자료가 없음 (존재하지 않는 칼럼입니다)'
  })
}

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/articles/${article.value.slug}`
const pageTitle = `${article.value.title} | 일일운세 ✦ 天命`
const pageDesc = article.value.summary

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'article',
  ogUrl: pageUrl,
  ogImage: article.value.coverImage,
  twitterCard: 'summary_large_image',
  twitterImage: article.value.coverImage
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json' as const,
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.value.title,
        description: article.value.summary,
        image: article.value.coverImage,
        datePublished: article.value.date,
        dateModified: article.value.date,
        author: {
          '@type': 'Organization',
          name: article.value.author,
          url: 'https://sajuapp.co.kr'
        },
        publisher: {
          '@type': 'Organization',
          name: 'sajuapp.co.kr',
          url: 'https://sajuapp.co.kr'
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl
        }
      })
    }
  ]
})

// 연관 칼럼 가져오기
const relatedArticles = computed(() => {
  if (!article.value) return []
  return ARTICLES_DATA.filter(a => article.value?.relatedSlugs.includes(a.slug))
})
</script>

<template>
  <div v-if="article" class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <!-- 상단 빵부스러기 네비게이션 -->
    <nav aria-label="Breadcrumb" class="mb-6 text-xs pg-text-muted flex items-center gap-1.5 flex-wrap">
      <NuxtLink to="/" class="hover:underline hover:text-amber-600 dark:hover:text-amber-400">홈</NuxtLink>
      <span>›</span>
      <NuxtLink to="/articles" class="hover:underline hover:text-amber-600 dark:hover:text-amber-400">역학 칼럼</NuxtLink>
      <span>›</span>
      <span class="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{{ article.title }}</span>
    </nav>

    <!-- 아티클 카드 래퍼 -->
    <article :class="['p-6 sm:p-10 lg:p-12 rounded-3xl border shadow-xl backdrop-blur-md', 'bg-white/95 border-amber-200/60', 'dark:bg-[#151C35]/95 dark:border-[#FFDE9E]/20']">
      
      <!-- 아티클 헤더 -->
      <header class="pb-8 border-b pg-border mb-8">
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span :class="['text-xs font-bold px-3 py-1 rounded-full border', 'bg-amber-50 text-amber-800 border-amber-300', 'dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700']">
            {{ article.category }}
          </span>
          <span class="text-xs pg-text-muted flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
            <span>{{ article.readTime }} 소요</span>
          </span>
          <span class="text-xs pg-text-muted">·</span>
          <span class="text-xs pg-text-muted">{{ article.date }}</span>
          <span class="text-xs pg-text-muted">·</span>
          <span class="text-xs pg-text-muted font-medium">{{ article.author }}</span>
        </div>

        <h1 :class="['text-2xl sm:text-3xl md:text-4xl font-serif-kr font-bold tracking-tight leading-snug mb-3', 'text-slate-900', 'dark:text-[#FFDE9E]']">
          {{ article.title }}
        </h1>
        <p :class="['text-sm sm:text-base font-serif-kr leading-relaxed', 'text-amber-800/90', 'dark:text-amber-200/80']">
          {{ article.subtitle }}
        </p>

        <!-- 핵심 요약 리드 박스 -->
        <div :class="['mt-6 p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed font-medium', 'bg-amber-50/70 border-amber-200/80 text-amber-950', 'dark:bg-[#0F1226]/80 dark:border-amber-800/40 dark:text-amber-100']">
          <div class="flex items-center gap-2 mb-1.5 font-bold text-amber-800 dark:text-amber-300">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-amber-600" />
            <span>칼럼 핵심 요약</span>
          </div>
          <p>{{ article.summary }}</p>
        </div>
      </header>

      <!-- 아티클 본문 섹션 -->
      <div class="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <section
          v-for="(sec, idx) in article.sections"
          :key="idx"
          class="space-y-4"
        >
          <h2 :class="['text-lg sm:text-xl md:text-2xl font-serif-kr font-bold pt-4 flex items-center gap-2', 'text-slate-900', 'dark:text-white']">
            <span>{{ sec.heading }}</span>
          </h2>

          <p
            v-for="(p, pIdx) in sec.paragraphs"
            :key="pIdx"
            class="text-justify leading-relaxed"
          >
            {{ p }}
          </p>

          <!-- 인용구 박스 -->
          <blockquote
            v-if="sec.quote"
            :class="['p-4 sm:p-5 rounded-2xl border-l-4 my-4 font-serif-kr text-xs sm:text-sm leading-relaxed italic', 'bg-amber-50/50 border-amber-500 text-amber-900', 'dark:bg-[#0C0F1F]/60 dark:border-amber-400 dark:text-amber-200']"
          >
            "{{ sec.quote }}"
          </blockquote>

          <!-- 체크포인트 불릿 -->
          <div
            v-if="sec.bullets && sec.bullets.length > 0"
            :class="['p-4 sm:p-5 rounded-2xl border space-y-2 text-xs sm:text-sm', 'bg-slate-50 border-slate-200', 'dark:bg-slate-900/50 dark:border-slate-800']"
          >
            <div
              v-for="(bullet, bIdx) in sec.bullets"
              :key="bIdx"
              class="flex items-start gap-2.5"
            >
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{{ bullet }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- FAQ 섹션 -->
      <section v-if="article.faqs.length > 0" class="mt-12 pt-8 border-t pg-border">
        <h3 :class="['text-lg sm:text-xl font-serif-kr font-bold mb-4 flex items-center gap-2', 'text-slate-900', 'dark:text-[#FFDE9E]']">
          <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-amber-600" />
          <span>자주 묻는 질문 (FAQ)</span>
        </h3>
        <div class="space-y-3.5">
          <div
            v-for="(faq, fIdx) in article.faqs"
            :key="fIdx"
            :class="['p-4 sm:p-5 rounded-2xl border', 'bg-slate-50/80 border-slate-200', 'dark:bg-[#12162A] dark:border-slate-800']"
          >
            <h4 :class="['font-bold text-xs sm:text-sm mb-1.5 flex items-center gap-1.5', 'text-amber-900', 'dark:text-amber-300']">
              <span>Q.</span>
              <span>{{ faq.question }}</span>
            </h4>
            <p :class="['text-xs sm:text-sm leading-relaxed pl-4', 'text-slate-600', 'dark:text-slate-300']">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </section>

      <!-- 태그 섹션 -->
      <div class="mt-8 pt-6 border-t pg-border flex flex-wrap gap-2 items-center">
        <span class="text-xs pg-text-muted font-medium">관련 키워드:</span>
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 연관 칼럼 추천 섹션 -->
      <section v-if="relatedArticles.length > 0" class="mt-10 pt-8 border-t pg-border">
        <h3 :class="['text-base sm:text-lg font-serif-kr font-bold mb-4', 'text-slate-900', 'dark:text-[#FFDE9E]']">
          ✦ 함께 읽으면 좋은 역학 칼럼
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            v-for="rel in relatedArticles"
            :key="rel.slug"
            :to="`/articles/${rel.slug}`"
            :class="[
              'p-4 rounded-2xl border transition-all duration-200 group hover:shadow-xs hover:-translate-y-0.5',
              'bg-white border-slate-200 hover:border-amber-400',
              'dark:bg-[#18203D] dark:border-slate-800 dark:hover:border-amber-500'
            ]"
          >
            <div class="text-[11px] font-bold text-amber-600 mb-1">{{ rel.category }}</div>
            <h4 :class="['text-xs sm:text-sm font-bold font-serif-kr leading-snug group-hover:text-amber-600', 'text-slate-900', 'dark:text-slate-100']">
              {{ rel.title }}
            </h4>
            <div class="mt-2 text-[11px] pg-text-muted flex items-center justify-between">
              <span>{{ rel.date }}</span>
              <span class="text-amber-700 dark:text-amber-400 font-medium">읽어보기 →</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- 하단 네비게이션 버튼 -->
      <div class="mt-12 pt-6 border-t pg-border flex flex-wrap justify-between items-center gap-3">
        <NuxtLink
          to="/articles"
          :class="[
            'px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1.5',
            'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200',
            'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'
          ]"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          <span>칼럼 목록으로</span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <NuxtLink to="/saju" class="btn-gold-action text-xs sm:text-sm">
            <span>오늘의 사주 보기</span>
          </NuxtLink>
          <NuxtLink to="/iching" class="btn-gold-action text-xs sm:text-sm">
            <span>오늘의 주역 뽑기</span>
          </NuxtLink>
        </div>
      </div>

    </article>
  </div>
</template>

