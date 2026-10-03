<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/stems-branches`
const imageUrl = 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg'

definePageMeta({
  sitemap: {
    images: [
      {
        loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
        title: '10천간 12지간 60갑자 백과 캘리그라피 서화 대표 이미지'
      }
    ]
  }
})

useSeoMeta({
  title: '10천간 & 12지간 백과 - 60갑자 순환과 일진(日辰) 계산 해설',
  description: '하늘의 기운 10천간(甲乙丙丁戊己庚辛壬癸)과 땅의 계절 12지간(子丑寅卯辰巳午未申酉戌亥)이 이루는 60갑자 체계와 일진 분석 원리 가이드입니다.',
  ogTitle: '10천간 & 12지간 백과 | 일일운세 ✦ 天命',
  ogDescription: '하늘의 기운 10천간(甲乙丙丁戊己庚辛壬癸)과 땅의 계절 12지간(子丑寅卯辰巳午未申酉戌亥)이 이루는 60갑자 체계와 일진 분석 원리 가이드입니다.',
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
        headline: '10천간과 12지간 60갑자 순환 체계 학술 백과',
        description: '동양 시간관의 근본 체계인 십간과 십이지의 음양오행 결합과 하루의 일진을 읽는 역학적 지혜',
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

const stemsList = [
  { char: '甲 (갑목)', name: '양목(陽木)', desc: '우뚝 선 큰 나무. 리더십, 단호함, 곧은 기상' },
  { char: '乙 (을목)', name: '음목(陰木)', desc: '유연한 부드러운 화초. 생명력, 적응력, 온화함' },
  { char: '丙 (병화)', name: '양화(陽火)', desc: '태양의 열정. 세상을 비추는 공정함, 화려함' },
  { char: '丁 (정화)', name: '음화(陰火)', desc: '등촛불의 온기. 섬세한 배려, 아늑한 빛' },
  { char: '戊 (무토)', name: '양토(陽土)', desc: '넓은 대지와 산. 묵직한 중용, 신용과 안정' },
  { char: '己 (기토)', name: '음토(陰土)', desc: '비옥한 논밭. 수용성, 정성스러운 자양' },
  { char: '庚 (경금)', name: '양금(陽金)', desc: '강인한 무쇠. 명확한 결단, 의리와 단호함' },
  { char: '辛 (신금)', name: '음금(陰金)', desc: '정교한 보석. 예리함, 섬세함, 고결한 품격' },
  { char: '壬 (임수)', name: '양수(陽水)', desc: '거대한 바다. 깊은 지혜, 거침없는 지평' },
  { char: '癸 (계수)', name: '음수(陰水)', desc: '촉촉한 단비. 순응력, 직관적 소통' }
]

const branchesList = [
  { char: '子 (자수)', animal: '쥐', season: '한겨울 (11월)', desc: '새로운 씨앗이 움트는 조용한 깊은 밤' },
  { char: '丑 (축토)', animal: '소', season: '늦겨울 (12월)', desc: '봄을 기다리며 묵묵히 참아내는 얼어붙은 땅' },
  { char: '寅 (인목)', animal: '호랑이', season: '초봄 (1월)', desc: '강력한 생명력이 땅을 깨우는 도약' },
  { char: '卯 (묘목)', animal: '토끼', season: '한봄 (2월)', desc: '푸른 싹이 연약하게 피어나는 완연한 봄' },
  { char: '辰 (진토)', animal: '용', season: '늦봄 (3월)', desc: '변화무쌍한 습기를 품은 비옥한 땅' },
  { char: '巳 (사화)', animal: '뱀', season: '초여름 (4월)', desc: '열기가 오르기 시작하는 확산의 계절' },
  { char: '午 (오화)', animal: '말', season: '한여름 (5월)', desc: '태양이 절정에 달하는 절정의 화기' },
  { char: '未 (미토)', animal: '양', season: '늦여름 (6월)', desc: '열기를 머금고 결실을 준비하는 대지' },
  { char: '申 (신금)', animal: '원숭이', season: '초가을 (7월)', desc: '결실의 단단함이 모여드는 서리 기운' },
  { char: '酉 (유금)', animal: '닭', season: '한가을 (8월)', desc: '완벽히 여물어 완성된 보석 같은 결실' },
  { char: '戌 (술토)', animal: '개', season: '늦가을 (9월)', desc: '낙엽이 지고 만물을 거두어들이는 단단함' },
  { char: '亥 (해수)', animal: '돼지', season: '초겨울 (10월)', desc: '모든 에너지를 휴식으로 저장하는 순수한 수기' }
]
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 헤더 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-2">명리학 백과 03</span>
        <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          10천간 & 12지간 60갑자 체계
        </h1>
        <p :class="['mt-3 text-sm sm:text-base', 'text-slate-600', 'dark:text-slate-300']">
          하늘의 기운 10가지와 땅의 계절 12가지가 짝을 이루어 60년, 60달, 60일 단위로 순환하는 동양의 시간 철학입니다.
        </p>

        <!-- 대표 서화 캘리그라피 이미지 (Googlebot 크롤러 인덱싱 및 백과 표지용) -->
        <div :class="['mt-6 overflow-hidden rounded-xl border shadow-md', 'border-amber-200/60', 'dark:border-amber-900/40']">
          <img
            :src="imageUrl"
            alt="10천간 12지간 60갑자 백과 캘리그라피 서화 대표 이미지"
            class="w-full h-auto rounded-xl object-contain block"
            loading="eager"
          />
        </div>
      </div>

      <div :class="['space-y-8 text-sm sm:text-base leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
        
        <!-- 10천간 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>☀️</span> 하늘의 10천간(十天干)
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div
              v-for="stem in stemsList"
              :key="stem.char"
              :class="[
                'p-3.5 rounded-lg border',
                'bg-amber-50/40 border-amber-200/60',
                'dark:bg-[#1A203C] dark:border-slate-700'
              ]"
            >
              <div class="flex items-center justify-between">
                <span :class="['font-serif-kr font-bold text-base', 'text-amber-900', 'dark:text-[#FFDE9E]']">{{ stem.char }}</span>
                <span :class="['text-xs font-medium', 'text-amber-700', 'dark:text-amber-300']">{{ stem.name }}</span>
              </div>
              <p :class="['text-xs mt-1', 'text-slate-600', 'dark:text-slate-300']">{{ stem.desc }}</p>
            </div>
          </div>
        </section>

        <!-- 12지간 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold border-b pb-2 flex items-center gap-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span>🌙</span> 땅의 12지간(十二支)
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div
              v-for="b in branchesList"
              :key="b.char"
              :class="[
                'p-3.5 rounded-lg border',
                'bg-slate-50 border-slate-200',
                'dark:bg-[#1A203C] dark:border-slate-700'
              ]"
            >
              <div class="flex items-center justify-between">
                <span :class="['font-serif-kr font-bold text-base', 'text-amber-900', 'dark:text-[#FFDE9E]']">{{ b.char }} ({{ b.animal }})</span>
                <span :class="['text-xs', 'text-slate-500', 'dark:text-slate-400']">{{ b.season }}</span>
              </div>
              <p :class="['text-xs mt-1', 'text-slate-600', 'dark:text-slate-300']">{{ b.desc }}</p>
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
          <span>오늘의 일진 확인하기 ➔</span>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
