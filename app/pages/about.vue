<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/about`

useSeoMeta({
  title: '사이트 소개 - 일일운세 ✦ 天命',
  description: '전통 동양 철학(사주명리 및 주역 64괘)과 AI 맞춤 조언이 융합된 sajuapp.co.kr 일일운세 서비스를 소개합니다.',
  ogTitle: '사이트 소개 | 일일운세 ✦ 天命',
  ogDescription: '전통 동양 철학(사주명리 및 주역 64괘)과 AI 맞춤 조언이 융합된 sajuapp.co.kr 일일운세 서비스를 소개합니다.',
  ogUrl: pageUrl
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }]
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-lg backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 상단 브랜드 헤더 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-xs px-2.5 py-1 mb-3">天命印</span>
        <h1 :class="['text-3xl sm:text-4xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          일일운세 ✦ 天命 (sajuapp.co.kr)
        </h1>
        <p :class="['mt-3 text-sm sm:text-base', 'text-slate-600', 'dark:text-slate-300']">
          수천 년 전통 동양 철학의 처세 지혜를 현대적인 AI 분석으로 다시 조명합니다.
        </p>
      </div>

      <div :class="['space-y-8 text-sm sm:text-base leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
        
        <!-- 서비스 개요 -->
        <section :class="['p-5 sm:p-6 rounded-xl border', 'bg-amber-50/50 border-amber-200/60', 'dark:bg-[#0F1226]/60 dark:border-amber-900/30']">
          <h2 :class="['text-xl font-serif-kr font-bold mb-3 flex items-center gap-2', 'text-amber-900', 'dark:text-[#FFDE9E]']">
            <UIcon name="i-heroicons-sparkles" :class="['w-5 h-5', 'text-amber-600', 'dark:text-[#FFDE9E]']" />
            <span>서비스 철학 및 특징</span>
          </h2>
          <p class="mb-3">
            <strong>sajuapp.co.kr</strong>은 동양의 정통 <strong>사주명리학(四柱命理學)</strong>과 <strong>주역 64괘(周易)</strong>의 원리를 현대적 감각으로 구현한 무료 일일 운세 서비스입니다.
          </p>
          <p>
            맹목적인 맹신이 아닌, 오늘 하루 나를 찾아오는 에너지 흐름(오행과 일진)을 이해하고 지혜롭게 마음을 다잡을 수 있도록 돕는 따뜻한 삶의 길잡이를 지향합니다.
          </p>
        </section>

        <!-- 주요 서비스 모듈 -->
        <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div :class="['p-5 rounded-xl border', 'bg-white border-amber-200/60', 'dark:bg-[#1A203C] dark:border-slate-700']">
            <h3 :class="['text-lg font-serif-kr font-bold mb-2 flex items-center gap-2', 'text-amber-800', 'dark:text-[#FFDE9E]']">
              <span class="text-amber-600">☯</span> 오늘의 사주명리
            </h3>
            <p :class="['text-xs sm:text-sm', 'text-slate-600', 'dark:text-slate-300']">
              사용자의 생년월일시로 계산된 **일간(日干)**과 오늘 날짜의 **일진(日辰)**이 만드는 십신(十神) 및 오행(木·火·土·金·水)의 생극제화 조화를 미세하게 분석합니다.
            </p>
          </div>

          <div :class="['p-5 rounded-xl border', 'bg-white border-amber-200/60', 'dark:bg-[#1A203C] dark:border-slate-700']">
            <h3 :class="['text-lg font-serif-kr font-bold mb-2 flex items-center gap-2', 'text-amber-800', 'dark:text-[#FFDE9E]']">
              <span class="text-amber-600">☰</span> 오늘의 주역 비결
            </h3>
            <p :class="['text-xs sm:text-sm', 'text-slate-600', 'dark:text-slate-300']">
              전통 3변 점대 드로우 방식으로 **하괘 ➔ 상괘 ➔ 동효(動爻)**를 도출하여 주역 64괘 중 오늘 나에게 건네는 변효의 지혜와 운세 총평을 생성합니다.
            </p>
          </div>
        </section>

        <!-- 이용 팁 및 안내 -->
        <section>
          <h2 :class="['text-lg font-bold mb-3', 'text-amber-800', 'dark:text-amber-200']">자주 묻는 질문 (FAQ)</h2>
          <div class="space-y-4 text-xs sm:text-sm">
            <div class="border-l-4 border-amber-500 pl-4 py-1">
              <h4 :class="['font-bold', 'text-slate-900', 'dark:text-white']">Q. 운세는 하루에 몇 번 볼 수 있나요?</h4>
              <p :class="['mt-1', 'text-slate-600', 'dark:text-slate-400']">
                하루의 에너지를 차분하게 마주하실 수 있도록 **매일 KST 자정(00:00)**을 기점으로 운세 조회가 자동 리셋되어, 하루 1회 정성스런 운세 분석을 제공합니다.
              </p>
            </div>
            <div class="border-l-4 border-amber-500 pl-4 py-1">
              <h4 :class="['font-bold', 'text-slate-900', 'dark:text-white']">Q. 개인정보는 저장되나요?</h4>
              <p :class="['mt-1', 'text-slate-600', 'dark:text-slate-400']">
                아닙니다. 생년월일과 고민 등 입력하신 정보는 AI 실시간 분석 후 바로 소멸되며, 서버에 저장되지 않아 안심하고 이용하실 수 있습니다.
              </p>
            </div>
          </div>
        </section>

      </div>

      <div :class="['mt-10 pt-6 border-t flex justify-center', 'border-amber-200/40', 'dark:border-slate-700/50']">
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
      </div>
    </div>
  </div>
</template>
