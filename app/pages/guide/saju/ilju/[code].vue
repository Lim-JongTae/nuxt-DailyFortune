<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const codeParam = computed(() => String(route.params.code || 'gap-ja'))

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/saju/ilju/${codeParam.value}`

// Nuxt Content v3 마크다운 데이터 조회
const { data: contentData } = await useAsyncData(`saju-ilju-content-${codeParam.value}`, () => {
  return queryCollection('ilju')
    .where('code', '=', codeParam.value)
    .first()
})

const pageTitle = computed(() => `${contentData.value?.title || '사주 60일주'} 실전 처세 가이드`)
const pageDesc = computed(() => `${contentData.value?.description || '사주명리 60일주 정통 성향, 직업, 재물, 애정운 해설'}`)

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
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: pageTitle.value,
        description: pageDesc.value,
        url: pageUrl,
        inLanguage: 'ko-KR'
      }))
    }
  ]
})
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-xl mx-auto px-4 py-4 sm:py-6">

      <!-- 상단 헤더 -->
      <div class="flex items-center justify-between pb-3 border-b pg-border mb-4">
        <NuxtLink to="/guide/saju" class="p-1.5 rounded-full pg-back-btn transition-colors flex items-center gap-1 text-xs font-bold pg-text">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          <span>60일주 목록</span>
        </NuxtLink>
        <div class="text-center">
          <span class="text-[9px] font-bold tracking-widest pg-text-gold block uppercase">60일주 실전 처세 가이드</span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            {{ contentData?.title || '일주 해설' }}
          </h1>
        </div>
        <NuxtLink to="/saju" class="p-1.5 rounded-full pg-text-gold hover:opacity-80 transition-opacity">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- 메인 카체 카드 -->
      <div class="pg-card border rounded-3xl p-5 shadow-xl mb-6 relative overflow-hidden">
        <div class="absolute -right-3 -top-5 pg-watermark-text text-9xl font-serif-kr select-none pointer-events-none opacity-15">
          命
        </div>

        <div class="relative z-10">
          <span class="px-3 py-0.5 rounded-full pg-card-inner border pg-border text-xs font-bold pg-text-gold inline-block mb-2">
            60일주 정통 풀이
          </span>
          <h2 class="font-serif-kr text-xl sm:text-2xl font-extrabold pg-text mb-2">
            {{ contentData?.title }}
          </h2>
          <p class="text-xs pg-text-muted leading-relaxed font-normal">
            {{ contentData?.description }}
          </p>
        </div>
      </div>

      <!-- Nuxt Content 마크다운 정통 본문 -->
      <div v-if="contentData" class="pg-card border rounded-2xl p-5 shadow-md mb-6 prose prose-amber dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
        <ContentRenderer :value="contentData" />
      </div>

      <!-- 하단 안내 CTA -->
      <div class="mt-8 p-5 rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 text-center">
        <h4 class="font-serif-kr text-sm font-bold pg-text mb-1">
          오늘 당신의 사주팔자와 천간/지지 기운을 확인해 보세요
        </h4>
        <p class="text-xs pg-text-muted mb-3 font-normal">
          생년월일시와 고민을 입력하시면 Gemini AI가 사주 일주에 맞춘 개인 맞춤 총평과 부적을 도출해 드립니다.
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold border pg-border pg-card-inner pg-text hover:border-(--fortune-gold) transition-all shadow-sm"
          title="메인 홈으로 이동"
        >
          <UIcon name="i-heroicons-home" class="w-4 h-4 pg-text-gold" />
          <span>홈으로 가기</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
