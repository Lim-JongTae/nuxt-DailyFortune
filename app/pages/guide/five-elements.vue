<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/five-elements`
const imageUrl = 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg'

definePageMeta({
  sitemap: {
    images: [
      {
        loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
        title: '오행 상생상극 백과 캘리그라피 서화 대표 이미지'
      }
    ]
  }
})

useSeoMeta({
  title: '오행(五行) 백과 - 목·화·토·금·수 상생상극과 사주 운세 영향',
  description: '동양 우주론의 근간인 오행(木火土金水)의 의미, 상생(相生)과 상극(相剋) 순환 원리, 사주 불균형 보완법을 심층적으로 다루는 학술 가이드입니다.',
  ogTitle: '오행(五行) 백과 | 일일운세 ✦ 天命',
  ogDescription: '동양 우주론의 근간인 오행(木火土金水)의 의미, 상생(相生)과 상극(相剋) 순환 원리, 사주 불균형 보완법을 심층적으로 다루는 학술 가이드입니다.',
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
        headline: '오행(五行)의 상생상극 체계와 사주 운세 조율 학술 백과',
        description: '자연계 5가지 기본 기운(목화토금수)의 상호작용과 삶의 균형을 유지하는 오행 보완 처세법',
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

const elements = [
  {
    name: '목 (木 - Wood)',
    chinese: '木',
    season: '봄 (春)',
    direction: '동쪽 (東)',
    symbol: '시작 · 성장 · 추진력 · 솟구침',
    desc: '겨울의 굳은 땅을 뚫고 싹을 틔우는 봄의 생명력입니다. 인자함(仁)을 상징하며, 굽히지 않는 곧은 기상과 새로운 일의 시작, 계획과 뻗어나가는 성장을 주관합니다.'
  },
  {
    name: '화 (火 - Fire)',
    chinese: '火',
    season: '여름 (夏)',
    direction: '남쪽 (南)',
    symbol: '열정 · 확산 · 명확함 · 예의',
    desc: '세상을 밝게 비추고 만물을 단련시키는 뜨거운 에너지입니다. 예의(禮)를 상징하며, 솔직담백함, 자신감, 열정적인 자기 표현과 활발한 소통의 기운입니다.'
  },
  {
    name: '토 (土 - Earth)',
    chinese: '土',
    season: '환절기 (四季)',
    direction: '중앙 (中)',
    symbol: '중용 · 포용 · 신용 · 중재',
    desc: '계절과 계절 사이를 이어주고 모든 생명을 품어 키우는 대지입니다. 신의(信)를 상징하며, 치우치지 않는 묵직함, 신용, 중재 능력과 포용력을 내포합니다.'
  },
  {
    name: '금 (金 - Metal)',
    chinese: '金',
    season: '가을 (秋)',
    direction: '서쪽 (西)',
    symbol: '결단 · 결실 · 정의 · 억제',
    desc: '곡식을 여물게 하고 불필요한 가지를 쳐내는 서리 기운입니다. 의리(義)를 상징하며, 명확한 단호함, 절제력, 결실의 수확과 지조 있는 정의감을 나타냅니다.'
  },
  {
    name: '수 (水 - Water)',
    chinese: '水',
    season: '겨울 (冬)',
    direction: '북쪽 (北)',
    symbol: '지혜 · 침잠 · 저장 · 유연성',
    desc: '만물의 근원이자 아래로 흘러 세상을 적시는 유연함입니다. 지혜(智)를 상징하며, 묵묵한 사색, 유연한 소통, 깊은 학문적 직관과 에너지를 내실 있게 저장합니다.'
  }
]
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 헤더 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-2">명리학 백과 02</span>
        <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          오행(五行) 상생상극 학술 백과
        </h1>
        <p :class="['mt-3 text-sm sm:text-base', 'text-slate-600', 'dark:text-slate-300']">
          우주와 인체를 구성하는 5가지 순환 에너지 목·화·토·금·수의 법칙과 조화로운 균형을 살펴봅니다.
        </p>

        <!-- 대표 서화 캘리그라피 이미지 (Googlebot 크롤러 인덱싱 및 백과 표지용) -->
        <div :class="['mt-6 overflow-hidden rounded-xl border shadow-md', 'border-amber-200/60', 'dark:border-amber-900/40']">
          <img
            :src="imageUrl"
            alt="오행 상생상극 백과 캘리그라피 서화 대표 이미지"
            class="w-full h-auto rounded-xl object-contain block"
            loading="eager"
          />
        </div>
      </div>

      <div :class="['space-y-8 text-sm sm:text-base leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
        
        <!-- 오행 개요 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>🌿</span> 오행(五行)이란 무엇인가
          </h2>
          <p>
            <strong>오행(五行)</strong>의 '행(行)'은 단순히 멈추어 있는 5가지 물질을 뜻하는 것이 아니라, 우주의 모든 에너지 현상이 <strong>다섯 가지 형태로 끊임없이 순환하고 움직인다(運行)</strong>는 뜻을 지니고 있습니다.
          </p>
          <p>
            동양 철학에서는 자연계의 계절 변화, 인체의 장부, 마음의 작용, 그리고 사람이 태어난 사주 팔자의 구성에 이르기까지 이 오행의 조화와 균형이 생명력의 핵심이라고 봅니다.
          </p>
        </section>

        <!-- 5가지 오행 세부 해설 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>☯</span> 5가지 오행별 상징과 본질
          </h2>

          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="el in elements"
              :key="el.name"
              :class="[
                'p-5 rounded-xl border',
                'bg-amber-50/40 border-amber-200/60',
                'dark:bg-[#1A203C] dark:border-slate-700'
              ]"
            >
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 :class="['text-lg font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
                  {{ el.name }}
                </h3>
                <div class="flex items-center gap-2 text-xs">
                  <span :class="['px-2 py-0.5 rounded bg-emerald-500/10 font-medium text-emerald-700', 'dark:text-emerald-300']">
                    {{ el.season }}
                  </span>
                  <span :class="['px-2 py-0.5 rounded bg-amber-500/10 font-medium text-amber-700', 'dark:text-amber-300']">
                    {{ el.direction }}
                  </span>
                </div>
              </div>
              <p :class="['text-xs font-semibold mb-2', 'text-amber-800', 'dark:text-amber-200']">
                핵심 상징: {{ el.symbol }}
              </p>
              <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
                {{ el.desc }}
              </p>
            </div>
          </div>
        </section>

        <!-- 상생과 상극 -->
        <section :class="['p-6 rounded-xl border space-y-4', 'bg-white border-amber-200/60', 'dark:bg-[#0F1226]/80 dark:border-slate-700']">
          <h2 :class="['text-lg font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
            🔄 상생(相生)과 상극(相剋)의 조화
          </h2>
          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <h4 :class="['font-bold mb-1 text-emerald-700', 'dark:text-emerald-400']">1. 상생(相生) - 북돋우고 살리는 순환</h4>
              <p>
                목생화(나무는 불을 피우고) ➔ 화생토(불은 재가 되어 흙이 되며) ➔ 토생금(흙 속에서 금속이 자라고) ➔ 금생수(금속 표면에 물방울이 맺히며) ➔ 수생목(물은 나무를 자라게 함)
              </p>
            </div>
            <div :class="['pt-2 border-t border-slate-200', 'dark:border-slate-700']">
              <h4 :class="['font-bold mb-1 text-rose-700', 'dark:text-rose-400']">2. 상극(相剋) - 절제하고 단련하는 견제</h4>
              <p>
                목극토(나무는 흙의 뿌리를 다지고) ➔ 토극수(흙은 물을 막으며) ➔ 수극화(물은 불을 끄고) ➔ 화극금(불은 금속을 녹이며) ➔ 금극목(금속은 나무를 다듬음)
              </p>
            </div>
          </div>
        </section>

      </div>

      <!-- 하단 버튼 -->
      <div :class="['mt-10 pt-6 border-t flex flex-wrap justify-center gap-4', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <NuxtLink to="/guide" :class="['inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white font-medium text-xs sm:text-sm transition-colors shadow-sm bg-slate-700 hover:bg-slate-800', 'dark:bg-slate-800 dark:hover:bg-slate-700']">
          <span>목록으로</span>
        </NuxtLink>
        <NuxtLink to="/saju" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-md">
          <span>내 오행 기운 진단하기 ➔</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
