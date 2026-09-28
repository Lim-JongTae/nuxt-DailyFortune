<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/iching`

useSeoMeta({
  title: '주역 64괘 가이드 - 주역의 역사와 괘상 읽는 법',
  description: '동양 최고의 경전 주역(周易)의 64괘 체계와 상괘, 하괘, 동효(動爻) 변효 분석 및 오늘의 점대 드로우 괘상 읽는 법을 정리한 백과 가이드입니다.',
  ogTitle: '주역 64괘 가이드 | 일일운세 ✦ 天命',
  ogDescription: '동양 최고의 경전 주역(周易)의 64괘 체계와 상괘, 하괘, 동효(動爻) 변효 분석 및 오늘의 점대 드로우 괘상 읽는 법을 정리한 백과 가이드입니다.',
  ogUrl: pageUrl
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }]
})

const trigrams = [
  { symbol: '☰', name: '건(乾)', nature: '천 (하늘)', attr: '강건함, 추진력, 부지런함' },
  { symbol: '☱', name: '태(兌)', nature: '택 (못/호수)', attr: '기쁨, 유쾌함, 자애로움' },
  { symbol: '☲', name: '리(離)', nature: '화 (불/태양)', attr: '밝음, 열정, 명확한 미적 통찰' },
  { symbol: '☳', name: '진(震)', nature: '뢰 (우레/번개)', attr: '생동감, 시작, 솟아오름' },
  { symbol: '☴', name: '손(巽)', nature: '풍 (바람)', attr: '유연함, 침투, 겸손한 조화' },
  { symbol: '☵', name: '감(坎)', nature: '수 (물/샘)', attr: '지혜, 신중함, 험난함 극복' },
  { symbol: '☶', name: '간(艮)', nature: '산 (산)', attr: '고요함, 멈춤, 중용과 안식' },
  { symbol: '☷', name: '곤(坤)', nature: '곤 (땅/대지)', attr: '포용, 순응, 덕을 쌓음' }
]
</script>

<template>
  <div class="min-h-screen pt-8 pb-2 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 헤더 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-2">주역비결 백과</span>
        <h1 :class="['text-2xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          주역(周易) 64괘 원리와 괘상 해설 가이드
        </h1>
        <p :class="['mt-3 text-sm sm:text-base', 'text-slate-600', 'dark:text-slate-300']">
          하늘과 땅, 우주 만물의 64가지 변화상(象)이 건네는 깊은 인생 지혜를 탐구합니다.
        </p>
      </div>

      <div :class="['space-y-10 text-sm sm:text-base leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
        
        <!-- 1. 주역이란 무엇인가 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">1.</span> 주역(周易) 64괘의 철학적 유래
          </h2>
          <p>
            <strong>주역(周易)</strong>은 유교 3경 중 으뜸으로 꼽히는 동양 성학(聖學)의 보고이자, 우주 만물이 변화하는 법칙(易: 바꾸어질 역)을 64가지 정교한 부호와 문장으로 도출한 지혜서입니다.
          </p>
          <p>
            복희씨의 8괘 창제로부터 시작되어 문왕과 주공의 괘사·효사, 그리고 공자의 십익(十翼) 해설을 거쳐 집대성되었습니다. 주역은 조작된 미래 결정론이 아니라, <strong>"변화하는 상황 속에서 사람이 올바른 도리(道)를 선택할 수 있도록 돕는 기표"</strong>입니다.
          </p>
        </section>

        <!-- 2. 기본 8괘 (八卦) -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">2.</span> 8 소성괘(八小成卦)와 상징물
          </h2>
          <p :class="['text-xs sm:text-sm', 'text-slate-600', 'dark:text-slate-400']">
            음(⚋)과 양(⚊) 세 개가 쌓여 이루는 8가지 소성괘는 우주의 기본적인 여덟 자연 상태를 대변합니다.
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div v-for="t in trigrams" :key="t.name" :class="['p-3.5 rounded-xl border text-center', 'bg-amber-50/50 border-amber-200/60', 'dark:bg-[#1A203C] dark:border-slate-700']">
              <span :class="['text-2xl font-bold block mb-1', 'text-amber-800', 'dark:text-[#FFDE9E]']">{{ t.symbol }}</span>
              <h4 :class="['font-bold text-sm', 'text-slate-800', 'dark:text-slate-100']">{{ t.name }}</h4>
              <p :class="['text-[11px] mt-0.5 font-medium', 'text-amber-700', 'dark:text-amber-300']">{{ t.nature }}</p>
              <p :class="['text-[11px] mt-1 leading-tight', 'text-slate-500', 'dark:text-slate-400']">{{ t.attr }}</p>
            </div>
          </div>
        </section>

        <!-- 3. 3단계 드로우 구조 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">3.</span> 3단계 대나무 점대 드로우와 변효(動爻)의 이치
          </h2>
          <p>
            본 sajuapp.co.kr 일일 주역 비결은 전통 산죽(竹) 점대의 이치를 본따 <strong>3단계 드로우</strong> 방식으로 오늘 당신에게 다가오는 변효의 기운을 추출합니다.
          </p>

          <div :class="['p-5 rounded-xl border space-y-4', 'bg-white border-amber-200/60', 'dark:bg-[#0F1226]/80 dark:border-slate-700']">
            <div class="flex items-start gap-3">
              <span class="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-xs shrink-0 mt-0.5">1단계 (하괘)</span>
              <div>
                <h4 :class="['font-bold text-sm', 'text-slate-800', 'dark:text-slate-200']">내면의 인프라 / 내괘(內卦)</h4>
                <p :class="['text-xs mt-0.5', 'text-slate-600', 'dark:text-slate-400']">자신 내부의 마음가짐과 기초적 에너지를 형성하는 하부 3효를 도출합니다.</p>
              </div>
            </div>

            <div :class="['flex items-start gap-3 pt-3 border-t', 'border-slate-200', 'dark:border-slate-700']">
              <span class="px-2 py-0.5 rounded bg-amber-700 text-white font-bold text-xs shrink-0 mt-0.5">2단계 (상괘)</span>
              <div>
                <h4 :class="['font-bold text-sm', 'text-slate-800', 'dark:text-slate-200']">외부 환경과 조화 / 외괘(外卦)</h4>
                <p :class="['text-xs mt-0.5', 'text-slate-600', 'dark:text-slate-400']">나를 둘러싼 사회적 환경 및 타인과의 관계를 결정짓는 상부 3효를 완성하여 64 대성괘를 만듭니다.</p>
              </div>
            </div>

            <div :class="['flex items-start gap-3 pt-3 border-t', 'border-slate-200', 'dark:border-slate-700']">
              <span class="px-2 py-0.5 rounded bg-amber-800 text-white font-bold text-xs shrink-0 mt-0.5">3단계 (동효)</span>
              <div>
                <h4 :class="['font-bold text-sm', 'text-slate-800', 'dark:text-slate-200']">오늘의 포인트 변효(動爻) 선택</h4>
                <p :class="['text-xs mt-0.5', 'text-slate-600', 'dark:text-slate-400']">6개 효 중 오늘 가장 역동적으로 변화하고 주의해야 할 **핵심 변효(초효~상효)**를 포착하여 최적의 행운 조언을 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. 괘상 해석 팁 -->
        <section class="space-y-4">
          <h2 :class="['text-xl font-serif-kr font-bold flex items-center gap-2 border-b pb-2', 'text-amber-900 border-amber-300/40', 'dark:text-[#FFDE9E] dark:border-slate-700']">
            <span class="text-amber-600">4.</span> 주역 운세 100% 활용 조언
          </h2>
          <ul :class="['list-disc pl-5 space-y-2 text-xs sm:text-sm', 'text-slate-700', 'dark:text-slate-300']">
            <li><strong>길괘(吉卦)를 만났을 때:</strong> 자만하지 않고 겸손히 덕을 쌓아 실천할 때 비로소 괘상의 길함이 온전히 성취됩니다.</li>
            <li><strong>흉괘(凶卦)를 만났을 때:</strong> 나쁜 일이 생긴다는 뜻이 아니라, '미리 경계하고 조심(愼獨)'하라는 하늘의 경고이므로 언행을 정돈하면 화가 오히려 복(轉禍爲福)으로 바뀝니다.</li>
          </ul>
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
        <NuxtLink to="/iching" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm transition-colors shadow-md">
          주역 비결 뽑으러 가기 ➔
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
