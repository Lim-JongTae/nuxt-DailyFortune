<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/saju`

useSeoMeta({
  title: '사주명리학 기초 가이드 - 천간·지지·오행과 십신 해설',
  description: '사주명리학의 기본 원리인 10천간, 12지간, 오행(木火土金水)의 생극제화 및 십신(十神) 조화를 쉽게 풀어낸 기초 백과 가이드입니다.',
  ogTitle: '사주명리학 기초 가이드 | 일일운세 ✦ 天命',
  ogDescription: '사주명리학의 기본 원리인 10천간, 12지간, 오행(木火土金水)의 생극제화 및 십신(十神) 조화를 쉽게 풀어낸 기초 백과 가이드입니다.',
  ogUrl: pageUrl
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }]
})

const stems = [
  { char: '甲 (갑목)', name: '갑목', element: '木 (양)', desc: '큰 동량지목(棟梁之木). 결단력과 곧은 기상, 리더십을 상징합니다.' },
  { char: '乙 (을목)', name: '을목', element: '木 (음)', desc: '화초와 덩굴(草木). 유연함과 끈질긴 생명력, 적응력을 의미합니다.' },
  { char: '丙 (병화)', name: '병화', element: '火 (양)', desc: '태양의 열정. 밝고 열정적이며 세상을 밝게 비추는 에너지를 뜻합니다.' },
  { char: '丁 (정화)', name: '정화', element: '火 (음)', desc: '등촛불과 화로. 따뜻함, 아늑함, 세심한 배려와 온기를 내포합니다.' },
  { char: '戊 (무토)', name: '무토', element: '土 (양)', desc: '넓은 대지와 산. 포용력, 묵직한 중용, 신용과 안정감을 상징합니다.' },
  { char: '己 (기토)', name: '기토', element: '土 (음)', desc: '비옥한 옥토와 논밭. 순응성과 정성스러운 자양(滋養)의 기운입니다.' },
  { char: '庚 (경금)', name: '경금', element: '金 (양)', desc: '원석과 무쇠. 명확한 정의감, 의리, 단호한 결단력을 나타냅니다.' },
  { char: '辛 (신금)', name: '신금', element: '金 (음)', desc: '보석과 섬세한 칼. 예리함, 섬세함, 높은 품격과 미적 감각입니다.' },
  { char: '壬 (임수)', name: '임수', element: '水 (양)', desc: '거대한 바다와 강물. 깊은 지혜, 담대함, 거침없는 지평을 의미합니다.' },
  { char: '癸 (계수)', name: '계수', element: '水 (음)', desc: '단비와 샘물. 촉촉한 자애로움, 직관력, 유연한 소통의 기운입니다.' }
]

const shipsins = [
  { name: '비견(比肩)', category: '자아/동료', desc: '나와 어깨를 견주는 존재. 주관과 독립심, 동료와의 건강한 협력을 뜻합니다.' },
  { name: '겁재(劫財)', category: '경쟁/도전', desc: '승부욕과 승부 기상. 도전적인 에너지와 재물 관리의 신중함을 요구합니다.' },
  { name: '식신(食神)', category: '재능/풍요', desc: '자연스러운 표현력과 창의성. 의식주의 풍요와 평화로운 마음가짐입니다.' },
  { name: '상관(傷官)', category: '혁신/두각', desc: '기존의 틀을 깨는 비판적 지혜와 개성. 재치와 독창적 예술성을 상징합니다.' },
  { name: '편재(偏財)', category: '동적 재물', desc: '융통성 있는 사업가적 재물운. 큰 흐름을 읽는 안목과 모험심입니다.' },
  { name: '정재(正財)', category: '정당한 결실', desc: '성실한 노력의 결실. 성실함, 가치 있는 자산 축적과 안정을 내포합니다.' },
  { name: '편관(偏官)', category: '카리스마/원칙', desc: '나를 절제하는 규율과 결단력. 카리스마 있는 사회적 책임감을 의미합니다.' },
  { name: '정관(正官)', category: '명예/신용', desc: '올바른 원칙과 질서. 타인에게 신뢰받는 품격과 안정된 명예입니다.' },
  { name: '편인(偏印)', category: '직관/학문', desc: '깊은 통찰력과 직관성. 전문 지식과 독창적 정신 세계의 성숙입니다.' },
  { name: '정인(正印)', category: '수용/덕망', desc: '모성애와 같은 학문적 자양분. 덕망과 인복, 스승의 가르침을 상징합니다.' }
]
</script>

<template>
  <div class="min-h-screen pt-8 pb-2 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 헤더 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-2">명리학 백과</span>
        <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          사주명리학(四柱命理學) 기초 가이드
        </h1>
        <p :class="['mt-3 text-sm sm:text-base', 'text-slate-600', 'dark:text-slate-300']">
          태어난 연·월·일·시 4개의 기둥(四柱)과 8개의 글자(八字)에 담긴 자연의 이치를 해설합니다.
        </p>
      </div>

      <div :class="['space-y-10 text-sm sm:text-base leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
        
        <!-- 1. 사주명리란 무엇인가 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">1.</span> 사주명리학의 근본 원리
          </h2>
          <p>
            사주명리학(四柱命理學)은 사람이 태어난 연(年), 월(月), 일(日), 시(時)의 <strong>네 가지 기둥(四柱)</strong>을 십간(十干)과 십이지(十二支)로 환산하여, 당시 우주 공간을 흐르던 오행(木, 火, 土, 金, 水)의 기운 조화를 분석하는 동양 최고의 인문철학입니다.
          </p>
          <p>
            단순히 운명을 결정론적으로 단정 짓는 것이 아닌, 나를 이루는 기본 성품과 오행의 치우침을 파악하여 <strong>나아갈 때와 물러설 때를 아는 지혜(趨吉避凶, 추길피흉)</strong>를 체득하는 데 본질이 있습니다.
          </p>
        </section>

        <!-- 2. 10천간 (十天干) -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">2.</span> 10천간(十天干)과 성품
          </h2>
          <p :class="['text-xs sm:text-sm', 'text-slate-600', 'dark:text-slate-400']">
            하늘의 기운을 뜻하는 10가지 상징(갑·을·병·정·무·기·경·신·임·계)은 사용자의 <strong>일간(日干: 나 자신)</strong>의 핵심 에너지 성향을 규정합니다.
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
            <div v-for="s in stems" :key="s.name" :class="['p-4 rounded-xl border', 'bg-amber-50/40 border-amber-200/60', 'dark:bg-[#1A203C] dark:border-slate-700']">
              <div class="flex items-center justify-between mb-1">
                <span :class="['font-serif-kr font-bold text-base', 'text-amber-800', 'dark:text-[#FFDE9E]']">{{ s.char }}</span>
                <span :class="['text-xs px-2 py-0.5 rounded bg-amber-500/10 font-medium', 'text-amber-700', 'dark:text-amber-300']">{{ s.element }}</span>
              </div>
              <p :class="['text-xs mt-1', 'text-slate-600', 'dark:text-slate-300']">{{ s.desc }}</p>
            </div>
          </div>
        </section>

        <!-- 3. 오행의 생극제화 (生剋制化) -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">3.</span> 오행(五行)의 상생과 상극
          </h2>
          <p>
            세상의 모든 만물은 다섯 가지 기운인 <strong>목(木), 화(火), 토(土), 금(金), 수(水)</strong>로 순환합니다.
          </p>
          
          <div :class="['p-5 rounded-xl border space-y-3', 'bg-white border-amber-200/60', 'dark:bg-[#0F1226]/80 dark:border-slate-700']">
            <div class="flex items-start gap-3">
              <span :class="['font-bold shrink-0', 'text-emerald-600', 'dark:text-emerald-400']">상생(相生):</span>
              <p class="text-xs sm:text-sm">
                서로를 돕고 북돋아주는 순환적 에너지 관계입니다.<br />
                <span :class="['font-medium', 'text-amber-700', 'dark:text-amber-300']">목생화(木生火) ➔ 화생토(火生土) ➔ 토생금(土生金) ➔ 금생수(金生水) ➔ 수생목(水生木)</span>
              </p>
            </div>
            <div :class="['flex items-start gap-3 pt-2 border-t', 'border-slate-200', 'dark:border-slate-700']">
              <span :class="['font-bold shrink-0', 'text-rose-600', 'dark:text-rose-400']">상극(相剋):</span>
              <p class="text-xs sm:text-sm">
                치우친 기운을 적절히 견제하고 다듬어주는 절제 관계입니다.<br />
                <span :class="['font-medium', 'text-amber-700', 'dark:text-amber-300']">목극토(木剋土) ➔ 토극수(土剋水) ➔ 수극화(水剋火) ➔ 화극금(火剋金) ➔ 금극목(金剋木)</span>
              </p>
            </div>
          </div>
        </section>

        <!-- 4. 십신(十神)의 의미 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">4.</span> 십신(十神)이 전하는 삶의 10가지 역학 관계
          </h2>
          <p :class="['text-xs sm:text-sm', 'text-slate-600', 'dark:text-slate-400']">
            나(일간)와 오늘 만나는 날짜(일진)의 오행 및 음양 상호작용으로 도출되는 10가지 심리 및 인간관계 별입니다.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div v-for="ss in shipsins" :key="ss.name" :class="['p-3.5 rounded-lg border', 'bg-slate-50/70 border-slate-200', 'dark:bg-[#1A203C] dark:border-slate-700']">
              <div class="flex items-center justify-between">
                <span :class="['font-bold text-sm', 'text-amber-800', 'dark:text-[#FFDE9E]']">{{ ss.name }}</span>
                <span :class="['text-[11px]', 'text-slate-500', 'dark:text-slate-400']">{{ ss.category }}</span>
              </div>
              <p :class="['text-xs mt-1.5 leading-snug', 'text-slate-600', 'dark:text-slate-300']">{{ ss.desc }}</p>
            </div>
          </div>
        </section>

      </div>

      <!-- 하단 버튼 -->
      <div :class="['mt-10 pt-6 border-t flex flex-wrap justify-center gap-4', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <NuxtLink
          to="/"
          :class="[
            'inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-md',
            'bg-emerald-700 text-emerald-100 hover:bg-emerald-800',
            'dark:bg-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-900'
          ]"
        >
          <UIcon name="i-heroicons-home" class="w-4 h-4" />
          <span>홈으로 가기</span>
        </NuxtLink>
        <NuxtLink to="/saju" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors shadow-md">
          사주 보러가기 ➔
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
