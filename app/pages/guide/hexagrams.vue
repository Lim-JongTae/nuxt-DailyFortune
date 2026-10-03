<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/hexagrams`
const imageUrl = 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg'

definePageMeta({
  sitemap: {
    images: [
      {
        loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
        title: '주역 64괘 백과 캘리그라피 서화 대표 이미지'
      }
    ]
  }
})

useSeoMeta({
  title: '주역 64괘 백과 - 괘상 구조와 3변 점대 드로우 변효 원리',
  description: '동양 최고의 경전 주역(周易) 64괘의 상괘·하괘 조합 원리, 음효와 양효, 동효(動爻)가 지닌 변화의 철학을 다루는 학술 가이드입니다.',
  ogTitle: '주역 64괘 백과 | 일일운세 ✦ 天命',
  ogDescription: '동양 최고의 경전 주역(周易) 64괘의 상괘·하괘 조합 원리, 음효와 양효, 동효(動爻)가 지닌 변화의 철학을 다루는 학술 가이드입니다.',
  ogUrl: pageUrl,
  ogImage: imageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: imageUrl
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: '주역 64괘 괘상 구조와 3변 드로우 동효 학술 백과',
        description: '자연의 8가지 상징(팔괘)이 중첩되어 형성되는 주역 64괘와 지혜로운 처세의 점학적 진리',
        image: imageUrl,
        author: {
          '@type': 'Organization',
          name: 'sajuapp.co.kr 백과 연구팀'
        },
        publisher: {
          '@type': 'Organization',
          name: '일일운세 ✦ 天命',
          url: 'https://sajuapp.co.kr'
        },
        mainEntityOfPage: pageUrl
      })
    }
  ]
})

const trigrams = [
  { name: '건괘 (乾 ☰)', element: '하늘 (天)', symbol: '강건함 · 주도성 · 창조' },
  { name: '태괘 (兌 ☱)', element: '못 (澤)', symbol: '기쁨 · 소통 · 너그러움' },
  { name: '리괘 (離 ☲)', element: '불 (火)', symbol: '밝음 · 지혜 · 명확함' },
  { name: '진괘 (震 ☳)', element: '우레 (雷)', symbol: '도약 · 진동 · 신속함' },
  { name: '손괘 (巽 ☴)', element: '바람 (風)', symbol: '유연함 · 침투 · 겸손' },
  { name: '감괘 (坎 ☵)', element: '물 (水)', symbol: '험난함 · 지혜 · 묵직함' },
  { name: '간괘 (艮 ☶)', element: '산 (山)', symbol: '멈춤 · 고요함 · 중용' },
  { name: '곤괘 (坤 ☷)', element: '땅 (地)', symbol: '포용 · 순응 · 온화함' }
]
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 헤더 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-2">주역 백과 01</span>
        <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          주역 64괘(周易)와 변화의 철학
        </h1>
        <p :class="['mt-3 text-sm sm:text-base', 'text-slate-600', 'dark:text-slate-300']">
          우주의 8가지 기본 상징인 소성괘가 6효 체계로 결합하여 빚어내는 64가지 인간세상의 괘상과 동효를 이해합니다.
        </p>

        <!-- 대표 서화 캘리그라피 이미지 (Googlebot 크롤러 인덱싱 및 백과 표지용) -->
        <div :class="['mt-6 overflow-hidden rounded-xl border shadow-md', 'border-amber-200/60', 'dark:border-amber-900/40']">
          <img
            :src="imageUrl"
            alt="주역 64괘 백과 캘리그라피 서화 대표 이미지"
            class="w-full h-auto rounded-xl object-contain block"
            loading="eager"
          />
        </div>
      </div>

      <div :class="['space-y-8 text-sm sm:text-base leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
        
        <!-- 주역 개요 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>☯</span> 주역(周易)의 근본 학술 원리
          </h2>
          <p>
            <strong>주역(周易)</strong>은 수천 년 동안 동양 사상의 최고 경전(群經之首)으로 추앙받아 온 지혜의 서입니다. '역(易)'이라는 글자는 <strong>변화(Change)</strong>를 의미하며, 고정된 운명에 얽매이는 것이 아니라 끊임없이 바뀌는 상황 속에서 가장 바른 길을 찾는 처세의 학문입니다.
          </p>
          <p>
            하나의 괘는 아래에서부터 위로 6개의 효(爻)로 구성되며, 맑고 강건한 양효(陽爻: ⚊)와 포용적이고 유순한 음효(陰爻: ⚋)가 배치되어 세상의 모든 질서를 설명합니다.
          </p>
        </section>

        <!-- 8소성괘 상징 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>☰</span> 근본이 되는 8소성괘(八小成卦)
          </h2>
          <p :class="['text-xs sm:text-sm text-slate-600', 'dark:text-slate-400']">
            하늘, 땅, 우레, 바람, 물, 불, 산, 못을 상징하는 8가지 소성괘는 주역 64괘를 형성하는 뼈대입니다.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div
              v-for="t in trigrams"
              :key="t.name"
              :class="[
                'p-4 rounded-xl border',
                'bg-amber-50/40 border-amber-200/60',
                'dark:bg-[#1A203C] dark:border-slate-700'
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span :class="['font-serif-kr font-bold text-base', 'text-amber-900', 'dark:text-[#FFDE9E]']">{{ t.name }}</span>
                <span :class="['text-xs px-2 py-0.5 rounded bg-amber-500/10 font-medium text-amber-700', 'dark:text-amber-300']">{{ t.element }}</span>
              </div>
              <p :class="['text-xs mt-1', 'text-slate-600', 'dark:text-slate-300']">상징: {{ t.symbol }}</p>
            </div>
          </div>
        </section>

        <!-- 3단계 점대 드로우와 동효 원리 -->
        <section :class="['p-6 rounded-xl border space-y-4', 'bg-white border-amber-200/60', 'dark:bg-[#0F1226]/80 dark:border-slate-700']">
          <h3 :class="['text-lg font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
            🎋 3변 드로우와 동효(動爻)의 미학
          </h3>
          <p class="text-xs sm:text-sm">
            sajuapp.co.kr의 주역 비결은 정통 3변 시죽 점대 드로우 방식을 현대적으로 재현하였습니다.
          </p>
          <ol class="list-decimal list-inside space-y-2 text-xs sm:text-sm">
            <li><strong>1변 (하괘 도출):</strong> 오늘 나를 받쳐주는 기초적 내면 기운(내괘)을 세웁니다.</li>
            <li><strong>2변 (상괘 도출):</strong> 나를 둘러싼 외적 환경과 타인과의 관계(외괘)를 얹어 본괘(64괘 중 하나)를 도출합니다.</li>
            <li><strong>3변 (동효 지명):</strong> 6개의 효 중 가장 활발하게 변화를 일으키는 **동효(動爻)**를 찍어 지혜로운 행동 조언을 얻습니다.</li>
          </ol>
        </section>

      </div>

      <!-- 하단 버튼 -->
      <div :class="['mt-10 pt-6 border-t flex flex-wrap justify-center gap-4', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <NuxtLink to="/guide" :class="['inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white font-medium text-xs sm:text-sm transition-colors shadow-sm bg-slate-700 hover:bg-slate-800', 'dark:bg-slate-800 dark:hover:bg-slate-700']">
          <span>목록으로</span>
        </NuxtLink>
        <NuxtLink to="/iching" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-md">
          <span>오늘의 주역 64괘 뽑기 ➔</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
