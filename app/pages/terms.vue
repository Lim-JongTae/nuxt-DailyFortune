<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/terms`

useSeoMeta({
  title: '서비스 이용약관',
  description: 'sajuapp.co.kr 일일운세 서비스 이용약관 및 유의사항입니다.',
  ogTitle: '서비스 이용약관 | 일일운세 ✦ 天命',
  ogDescription: 'sajuapp.co.kr 일일운세 서비스 이용약관 및 유의사항입니다.',
  ogUrl: pageUrl
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }]
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-lg backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      <h1 :class="['text-2xl sm:text-3xl font-serif-kr font-bold mb-6 flex items-center gap-2', 'text-amber-900', 'dark:text-[#FFDE9E]']">
        <UIcon name="i-heroicons-document-text" :class="['w-8 h-8', 'text-amber-600', 'dark:text-[#FFDE9E]']" />
        <span>서비스 이용약관</span>
      </h1>
      
      <p :class="['text-sm mb-8 border-b pb-4', 'text-slate-500 border-amber-200/40', 'dark:text-slate-400 dark:border-slate-700/50']">
        시행일자: 2026년 9월 10일 | 최종 수정일자: 2026년 9월 28일
      </p>

      <div :class="['space-y-8 text-sm sm:text-base leading-relaxed', 'text-slate-700', 'dark:text-slate-300']">
        <section>
          <h2 :class="['text-lg font-bold mb-3', 'text-amber-800', 'dark:text-amber-200']">제 1 조 (목적)</h2>
          <p>
            본 약관은 'sajuapp.co.kr (일일운세 ✦ 天命)'(이하 '서비스')이 제공하는 사주명리 및 주역비결 AI 운세 분석 서비스의 이용 조건 및 절차, 이용자와 서비스 제공자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 :class="['text-lg font-bold mb-3', 'text-amber-800', 'dark:text-amber-200']">제 2 조 (운세 조언의 성격 및 면책 조항)</h2>
          <p class="mb-3">
            본 서비스에서 제공하는 동양 철학(사주명리학, 주역 64괘) 기반의 분석 및 AI 총평 보고서는 사용자의 하루를 돌아보고 마음의 안정과 삶의 지혜를 얻기 위한 <strong>참고용 조언 정보</strong>입니다.
          </p>
          <ul class="list-disc pl-5 space-y-2">
            <li>운세 분석 결과는 의학적, 법률적, 재정적, 전문 상담을 대체할 수 없습니다.</li>
            <li>서비스에서 제공하는 운세 조언에 기초하여 행한 사용자의 독자적인 판단과 행위에 대하여 본 서비스는 법적 책임을 지지 않습니다.</li>
          </ul>
        </section>

        <section>
          <h2 :class="['text-lg font-bold mb-3', 'text-amber-800', 'dark:text-amber-200']">제 3 조 (서비스의 제공 및 변경)</h2>
          <p>
            서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다. 다만, 서버 정기 점검, AI API 통신 상태, 기타 기술상 상당한 이유가 있는 경우 서비스 제공이 일시적으로 중단될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 :class="['text-lg font-bold mb-3', 'text-amber-800', 'dark:text-amber-200']">제 4 조 (이용자의 준수사항)</h2>
          <p>
            이용자는 본 서비스를 이용함에 있어 다음 행위를 해서는 안 됩니다:
          </p>
          <ul class="list-disc pl-5 space-y-1 mt-2">
            <li>자동화된 프로그램(매크로, 크롤러 등)을 활용한 악의적인 서버 연속 호출 행위</li>
            <li>서비스의 안정적인 운영을 방해하는 해킹 및 과도한 트래픽 유발 행위</li>
          </ul>
        </section>

        <section>
          <h2 :class="['text-lg font-bold mb-3', 'text-amber-800', 'dark:text-amber-200']">제 5 조 (저작권의 귀속)</h2>
          <p>
            본 서비스가 자체 제작한 웹 디자인, 로고, 알고리즘, 설명 가이드 문서의 저작권은 'sajuapp.co.kr'에 귀속됩니다.
          </p>
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
          <span>홈으로 돌아가기</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
