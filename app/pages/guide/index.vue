<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide`
const imageUrl = 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg'

definePageMeta({
  sitemap: {
    images: [
      {
        loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
        title: '동양철학 명리 주역 실전 처세 가이드 캘리그라피 서화 대표 이미지'
      }
    ]
  }
})

useSeoMeta({
  title: '동양철학 명리 & 주역 실전 처세 가이드 - 일일운세 ✦ 天命',
  description: '사주명리학의 10천간, 12지간, 오행, 십신 분석과 주역 64괘의 괘상 원리까지 동양철학의 깊은 지혜를 담은 운세 정보 실전 처세 가이드입니다.',
  ogTitle: '동양철학 명리 & 주역 실전 처세 가이드 | 일일운세 ✦ 天命',
  ogDescription: '사주명리학의 10천간, 12지간, 오행, 십신 분석과 주역 64괘의 괘상 원리까지 동양철학의 깊은 지혜를 담은 운세 정보 실전 처세 가이드입니다.',
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
        '@type': 'CollectionPage',
        name: '동양철학 명리 & 주역 실전 처세 가이드',
        description: '사주명리학과 주역 64괘의 기초 원리와 정통 해석을 다루는 종합 지혜 센터',
        url: pageUrl
      })
    }
  ]
})

const guides = [
  {
    title: '사주명리학 기초 가이드',
    path: '/guide/saju',
    category: '명리학 입문',
    icon: 'i-heroicons-book-open',
    desc: '태어난 연·월·일·시 4개의 기둥(四柱)과 8개의 글자(八字)에 담긴 선천적 기운과 운 흐름의 근본 원리를 해설합니다.'
  },
  {
    title: '주역 64괘와 변효 가이드',
    path: '/guide/iching',
    category: '주역 점학',
    icon: 'i-heroicons-sparkles',
    desc: '3단계 대나무 점대 드로우(하괘 ➔ 상괘 ➔ 동효)로 도출되는 주역 64괘의 이치와 지혜로운 처세술을 배웁니다.'
  },
  {
    title: '십신(十神) 10가지 역학 관계 해설',
    path: '/guide/ten-gods',
    category: '명리 심층',
    icon: 'i-heroicons-academic-cap',
    desc: '비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인 등 나와 세상이 맺는 10가지 인간관계와 운의 별을 다룹니다.'
  },
  {
    title: '오행(五行) 상생상극과 운세 영향',
    path: '/guide/five-elements',
    category: '오행 원리',
    icon: 'i-heroicons-sun',
    desc: '목(木)·화(火)·토(土)·금(金)·수(水) 5가지 자연 에너지가 만물을 순환시키고 나의 기운을 조율하는 상생상극의 진리입니다.'
  },
  {
    title: '10천간 & 12지간 60갑자 해설',
    path: '/guide/stems-branches',
    category: '갑자 순환',
    icon: 'i-heroicons-clock',
    desc: '하늘의 기운(십간)과 땅의 계절(십이지)이 빚어내는 60갑자의 순환 체계와 매일의 일진(日辰)에 담긴 의미를 설명합니다.'
  },
  {
    title: '주역 64괘 구성과 괘상 해설',
    path: '/guide/hexagrams',
    category: '주역 심층',
    icon: 'i-heroicons-[#FFDE9E]',
    iconCustom: '☯',
    desc: '음(陰)과 양(陽) 효가 6단계로 쌓여 빚어내는 64개 괘상의 이름과 그 안에 담긴 우주 자연의 대원칙을 상상합니다.'
  }
]
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 상단 타이틀 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-2">東洋哲學 處世</span>
        <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          운세 & 동양철학 실전 처세 가이드
        </h1>
        <p :class="['mt-3 text-sm sm:text-base max-w-2xl mx-auto', 'text-slate-600', 'dark:text-slate-300']">
          수천 년 전승되어 온 정통 사주명리학(四柱命理學)과 주역(周易)의 기운 분석 지식을 누구나 쉽게 이해하도록 체계적으로 정리한 처세 지혜 센터입니다.
        </p>

        <!-- 대표 서화 캘리그라피 이미지 -->
        <div :class="['mt-6 overflow-hidden rounded-xl border shadow-md max-w-3xl mx-auto', 'border-amber-200/60', 'dark:border-amber-900/40']">
          <img
            :src="imageUrl"
            alt="동양철학 명리 주역 실전 처세 가이드 캘리그라피 서화 대표 이미지"
            class="w-full h-auto rounded-xl object-contain block"
            loading="eager"
          />
        </div>
      </div>

      <!-- 처세 아티클 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="g in guides"
          :key="g.path"
          :to="g.path"
          :class="[
            'group p-6 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between',
            'bg-amber-50/40 border-amber-200/60 hover:bg-amber-100/50 hover:border-amber-300',
            'dark:bg-[#1A203C] dark:border-slate-700 dark:hover:bg-[#202747] dark:hover:border-amber-900/50'
          ]"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span :class="['text-xs font-semibold px-2.5 py-0.5 rounded-full', 'bg-amber-100 text-amber-800', 'dark:bg-amber-900/40 dark:text-amber-300']">
                {{ g.category }}
              </span>
              <span v-if="g.iconCustom" class="text-lg text-amber-600 font-serif-kr">{{ g.iconCustom }}</span>
              <UIcon v-else :name="g.icon" :class="['w-5 h-5 text-amber-600', 'dark:text-[#FFDE9E]']" />
            </div>

            <h2 :class="['text-lg font-serif-kr font-bold mb-2 transition-colors text-amber-900 group-hover:text-amber-700', 'dark:text-[#FFDE9E] dark:group-hover:text-amber-300']">
              {{ g.title }}
            </h2>

            <p :class="['text-xs sm:text-sm leading-relaxed mb-4', 'text-slate-600', 'dark:text-slate-300']">
              {{ g.desc }}
            </p>
          </div>

          <div :class="['text-xs font-medium flex items-center gap-1 mt-2 pt-3 border-t transition-transform border-amber-200/40 text-amber-700 group-hover:translate-x-1', 'dark:border-slate-700/60 dark:text-amber-300']">
            <span>상세 가이드 읽기</span>
            <span>➔</span>
          </div>
        </NuxtLink>
      </div>

      <!-- FAQ 및 추가 학술 안내 -->
      <section :class="['mt-12 p-6 rounded-xl border', 'bg-slate-50/80 border-slate-200', 'dark:bg-[#0F1226]/80 dark:border-slate-800']">
        <h3 :class="['text-base sm:text-lg font-serif-kr font-bold mb-3 flex items-center gap-2', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-600" />
          <span>동양철학 운세 백과사전 활용 팁</span>
        </h3>
        <p :class="['text-xs sm:text-sm leading-relaxed mb-3', 'text-slate-600', 'dark:text-slate-300']">
          sajuapp.co.kr 백과사전은 운세를 정해진 숙명으로 보는 시각에서 벗어나, 자신의 선천적 오행 기운을 성찰하고 오늘의 일진과 주역 64괘를 지혜롭게 다스리는 방법을 조명합니다.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <NuxtLink to="/saju" class="text-xs px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors">
            오늘의 사주명리 보러가기 ➔
          </NuxtLink>
          <NuxtLink to="/iching" :class="['text-xs px-4 py-2 rounded-lg text-white font-medium transition-colors bg-slate-700 hover:bg-slate-800', 'dark:bg-slate-800 dark:hover:bg-slate-700']">
            오늘의 주역 64괘 드로우 ➔
          </NuxtLink>
        </div>
      </section>

    </div>
  </div>
</template>
