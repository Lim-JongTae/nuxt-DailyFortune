<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/ten-gods`
const imageUrl = 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg'

definePageMeta({
  sitemap: {
    images: [
      {
        loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
        title: '사주명리학 십신 10가지 성향과 운세 백과 캘리그라피 서화 대표 이미지'
      }
    ]
  }
})

useSeoMeta({
  title: '십신(十神) 백과 - 사주 10가지 별과 인간관계·운세 심층 해설',
  description: '사주명리학의 핵심 체계인 십신(비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인)의 개념과 자아, 재물, 직업, 인간관계 해석 원리를 상세히 해설합니다.',
  ogTitle: '십신(十神) 백과 | 일일운세 ✦ 天命',
  ogDescription: '사주명리학의 핵심 체계인 십신(비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인)의 개념과 자아, 재물, 직업, 인간관계 해석 원리를 상세히 해설합니다.',
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
        headline: '사주명리학 십신(十神) 10가지 성향과 인간관계·운세 심층 해설',
        description: '일간(日干)과 타 간지의 음양오행 상생상극 작용으로 도출되는 십신의 학술적 원리와 실전 운 해석법',
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
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '십신(十神)이란 무엇인가요?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '십신은 나 자신을 상징하는 일간(日干)을 기준으로, 다른 글자들과의 오행 생극(生剋) 및 음양(陰陽) 조화를 분석하여 인간의 성품, 재물, 명예, 사회적 관계를 10가지 형태의 별로 기호화한 사주명리학의 핵심 도구입니다.'
            }
          },
          {
            '@type': 'Question',
            name: '오늘의 일진에서 십신은 어떻게 작용하나요?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '오늘 날짜의 천간과 지지가 나의 일간과 만났을 때 형성되는 십신에 따라 오늘 하루 내가 주로 경험하게 될 마음가짐이나 사건의 성격이 결정됩니다.'
            }
          }
        ]
      })
    }
  ]
})

const tenGodList = [
  {
    name: '비견 (比肩)',
    chinese: '比肩',
    tag: '자아 · 주관 · 주도성',
    relation: '오행 동일 · 음양 동일',
    desc: '나와 오행이 같고 음양도 같은 성분으로, 강한 주관, 독립심, 자립심을 뜻합니다. 타인에게 의존하지 않고 스스로 길을 개척하는 곧은 기상이며, 동료 및 라이벌과의 건강한 경쟁 관계를 형성합니다.'
  },
  {
    name: '겁재 (劫財)',
    chinese: '劫財',
    tag: '경쟁 · 투지 · 모험심',
    relation: '오행 동일 · 음양 다름',
    desc: '나와 오행은 같으나 음양이 다른 성분입니다. 탁월한 승부욕, 강인한 추진력, 모험심을 의미합니다. 카리스마가 넘치지만 충동적인 자산 지출이나 주도권 경쟁에 유의해야 합니다.'
  },
  {
    name: '식신 (食神)',
    chinese: '食神',
    tag: '재능 · 탐구 · 풍요',
    relation: '내가 생함 · 음양 동일',
    desc: '내가 낳아주는 기운으로 음양이 같은 별입니다. 순수한 창의력, 자연스러운 재능 발휘, 학문 탐구, 의식주의 풍요로움을 지칭합니다. 마음이 평화롭고 연구와 예술 활동에 뛰어납니다.'
  },
  {
    name: '상관 (傷官)',
    chinese: '傷官',
    tag: '혁신 · 표현 · 비판 지혜',
    relation: '내가 생함 · 음양 다름',
    desc: '내가 낳아주는 기운 중 음양이 다른 별입니다. 기존 틀에 매이지 않는 비판적 통찰력, 화려한 언변, 다재다능함을 자랑합니다. 벼락같은 영감과 혁신적 문제 해결력이 특징입니다.'
  },
  {
    name: '편재 (偏財)',
    chinese: '偏財',
    tag: '동적 재물 · 사업가적 안목',
    relation: '내가 극함 · 음양 동일',
    desc: '내가 제어하는 기운으로 음양이 같은 별입니다. 고정된 월급이 아닌 융통성 있는 사업적 재물운과 대범한 투자 안목을 내포합니다. 사교성이 뛰어나고 큰 판을 읽는 눈을 가집니다.'
  },
  {
    name: '정재 (正財)',
    chinese: '正財',
    tag: '성실 결실 · 정당한 자산',
    relation: '내가 극함 · 음양 다름',
    desc: '내가 제어하는 기운 중 음양이 다른 별입니다. 땀 흘려 얻은 정당한 노동의 대가, 성실한 자산 축적, 높은 신용과 체계적 계획성을 의미합니다. 가장 안정적이고 확실한 결실입니다.'
  },
  {
    name: '편관 (偏官)',
    chinese: '偏官',
    tag: '칠살 · 카리스마 · 원칙',
    relation: '나를 극함 · 음양 동일',
    desc: '나를 엄하게 제어하는 기운으로 음양이 같은 별입니다. 강력한 통제력, 칼 같은 원칙 준수, 카리스마 있는 책임감을 뜻합니다. 시련을 견뎌내고 큰 조직의 리더가 되는 기운입니다.'
  },
  {
    name: '정관 (正官)',
    chinese: '正官',
    tag: '명예 · 규율 · 공정함',
    relation: '나를 극함 · 음양 다름',
    desc: '나를 적절히 조율하는 기운으로 음양이 다른 별입니다. 올바른 도덕성, 사회적 신뢰, 안정된 관직 및 명예를 상징합니다. 룰을 지키며 공정하게 타인의 존경을 받는 인품입니다.'
  },
  {
    name: '편인 (偏印)',
    chinese: '偏印',
    tag: '직관 · 전문 학문 · 통찰',
    relation: '나를 생함 · 음양 동일',
    desc: '나를 낳아주는 어머니 같은 기운 중 음양이 같은 별입니다. 영적 직관력, 깊은 사색, 철학, 종교, 특수 전문 분야의 지식을 의미합니다. 남들이 보지 못하는 이면의 진실을 파헤칩니다.'
  },
  {
    name: '정인 (正印)',
    chinese: '正印',
    tag: '자애 · 학문 자양 · 인복',
    relation: '나를 생함 · 음양 다름',
    desc: '나를 생해주는 기운 중 음양이 다른 가장 온화한 별입니다. unconditional한 사랑, 자애로움, 덕망, 수용성, 스승과 귀인의 인복을 상징하며 높은 학문적 완성도를 뜻합니다.'
  }
]
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 헤더 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-2">명리학 백과 01</span>
        <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          십신(十神) 10가지 별과 삶의 이치
        </h1>
        <p :class="['mt-3 text-sm sm:text-base', 'text-slate-600', 'dark:text-slate-300']">
          나(일간)와 세상이 만날 때 생겨나는 10가지 심리적 특성과 인간관계 및 운의 흐름을 심층 분석합니다.
        </p>

        <!-- 대표 서화 캘리그라피 이미지 (Googlebot 크롤러 인덱싱 및 백과 표지용) -->
        <div :class="['mt-6 overflow-hidden rounded-xl border shadow-md', 'border-amber-200/60', 'dark:border-amber-900/40']">
          <img
            :src="imageUrl"
            alt="사주명리학 십신 10가지 성향과 운세 백과 캘리그라피 서화 대표 이미지"
            class="w-full h-auto rounded-xl object-contain block"
            loading="eager"
          />
        </div>
      </div>

      <!-- 서론 본문 -->
      <div :class="['space-y-8 text-sm sm:text-base leading-relaxed mb-10', 'text-slate-700', 'dark:text-slate-300']">
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>☯</span> 십신(十神)의 근본 학술 원리
          </h2>
          <p>
            사주명리학에서 <strong>십신(十神)</strong>은 육친(六親) 또는 십성(十星)이라고도 불리며, 사람이 태어난 날의 천간인 <strong>일간(日干: 나 자신)</strong>을 중심으로 사주 팔자의 다른 글자나 매일 다가오는 날짜(일진)의 글자가 어떠한 상생상극(生剋)과 음양(陰陽) 조화를 이루는지 규명하는 핵심 기호 체계입니다.
          </p>
          <p>
            단순히 길흉화복을 단정 짓는 도구가 아니라, 인간의 내면적 심리 기제, 재물을 다루는 태도, 사회적 조직에서의 역할, 그리고 타인과의 소통 방식을 종합적으로 설명해 주는 동양 철학의 백과사전입니다.
          </p>
        </section>

        <!-- 십신 10가지 카드 리스트 -->
        <section class="space-y-6">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>✦</span> 십신 10가지 상세 분석 백과
          </h2>

          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="god in tenGodList"
              :key="god.name"
              :class="[
                'p-5 rounded-xl border transition-colors',
                'bg-amber-50/40 border-amber-200/60 hover:bg-amber-50/80',
                'dark:bg-[#1A203C] dark:border-slate-700 dark:hover:bg-[#202747]'
              ]"
            >
              <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <h3 :class="['text-lg font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
                    {{ god.name }}
                  </h3>
                  <span :class="['text-xs px-2 py-0.5 rounded font-medium', 'bg-amber-200/60 text-amber-900', 'dark:bg-amber-900/50 dark:text-amber-200']">
                    {{ god.tag }}
                  </span>
                </div>
                <span :class="['text-xs font-mono', 'text-slate-500', 'dark:text-slate-400']">
                  {{ god.relation }}
                </span>
              </div>
              <p :class="['text-xs sm:text-sm leading-relaxed mt-2', 'text-slate-600', 'dark:text-slate-300']">
                {{ god.desc }}
              </p>
            </div>
          </div>
        </section>

        <!-- FAQ 섹션 -->
        <section :class="['p-6 rounded-xl border space-y-4', 'bg-slate-50 border-slate-200', 'dark:bg-[#0F1226]/90 dark:border-slate-800']">
          <h3 :class="['text-lg font-serif-kr font-bold flex items-center gap-2', 'text-amber-900', 'dark:text-[#FFDE9E]']">
            <span>❓</span> 십신 관련 자주 묻는 질문 (FAQ)
          </h3>
          <div class="space-y-3 text-xs sm:text-sm">
            <div class="border-l-3 border-amber-500 pl-3 py-1">
              <p :class="['font-bold', 'text-slate-900', 'dark:text-white']">Q. 사주에 편관이나 겁재 같은 별이 많으면 무조건 나쁜가요?</p>
              <p :class="['mt-1', 'text-slate-600', 'dark:text-slate-400']">
                절대 그렇지 않습니다. 편관은 강력한 리더십과 절제력을 주며, 겁재는 누구에게도 뒤지지 않는 도전정신을 선사합니다. 사주명리는 길(吉)과 웅(凶)의 이분법이 아닌 전체 오행 조화가 핵심입니다.
              </p>
            </div>
            <div class="border-l-3 border-amber-500 pl-3 py-1">
              <p :class="['font-bold', 'text-slate-900', 'dark:text-white']">Q. 오늘 내 일진에서 식신이 들어오는 날은 어떤 날인가요?</p>
              <p :class="['mt-1', 'text-slate-600', 'dark:text-slate-400']">
                식신(食神)이 활성화되는 날은 마음이 너그러워지고 표현력이 풍부해져 연구, 창작, 맛있는 음식을 나누며 대화하기에 아주 적합한 평화로운 하루가 됩니다.
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
          <span>내 십신 운세 보기 ➔</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
