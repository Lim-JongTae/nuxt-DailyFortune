<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/privacy`

useSeoMeta({
  title: '개인정보처리방침',
  description: 'sajuapp.co.kr 일일운세 서비스의 개인정보처리방침 및 쿠키 정책 안내입니다.',
  ogTitle: '개인정보처리방침 | 일일운세 ✦ 天命',
  ogDescription: 'sajuapp.co.kr 일일운세 서비스의 개인정보처리방침 및 쿠키 정책 안내입니다.',
  ogUrl: pageUrl
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }]
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-lg backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      <h1 class="text-2xl sm:text-3xl font-serif-kr font-bold text-amber-900 dark:text-[#FFDE9E] mb-6 flex items-center gap-2">
        <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-amber-600 dark:text-[#FFDE9E]" />
        개인정보처리방침
      </h1>
      
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 border-b border-amber-200/40 dark:border-slate-700/50 pb-4">
        시행일자: 2026년 1월 1일 | 최종 수정일자: 2026년 9월 28일
      </p>

      <div class="space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 class="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3">1. 개인정보의 수집 및 이용 목적</h2>
          <p>
            'sajuapp.co.kr (일일운세 ✦ 天命)'은 사용자의 회원가입 절차 없이 누구나 자유롭게 이용할 수 있는 무상 운세 서비스입니다. 본 서비스는 개인을 식별할 수 있는 이름, 연락처, 주민등록번호 등을 서버에 수집·저장하지 않습니다.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3">2. 운세 입력 정보의 처리</h2>
          <p>
            사용자가 입력하는 생년월일시, 성별, 고민 내용 등은 실시간 AI 사주명리 및 주역 괘상 분석을 위한 일회성 입력값으로 활용되며, 분석 완료 후 별도의 회원 데이터베이스에 저장되지 않습니다.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3">3. 쿠키(Cookie) 및 브라우저 저장소 활용</h2>
          <p class="mb-3">
            본 웹사이트는 사용자의 이용 편의성 향상과 서비스 정책 준수를 위해 웹 브라우저 쿠키 및 로컬 스토리지(LocalStorage)를 활용합니다.
          </p>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>일일 조회 제한 및 자정 리셋 쿠키:</strong> 과도한 서버 과부하 및 API 중복 호출을 방지하기 위해 한국 표준시(KST) 자정(00:00)을 기준으로 당일 운세 조회 상태를 기록하고 자동으로 초기화합니다.</li>
            <li><strong>구글 애드센스(Google AdSense) 맞춤형 광고:</strong> 구글을 포함한 제3자 광고 사업자는 쿠키를 활용하여 사용자의 과거 웹사이트 방문 기록에 기반한 맞춤형 광고를 게재합니다. 사용자는 구글 광고 설정(<a href="https://adssettings.google.com" target="_blank" class="text-amber-600 dark:text-amber-400 underline">adssettings.google.com</a>)에서 맞춤형 광고를 해제할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3">4. 제3자 서비스 및 분석 도구</h2>
          <p>
            서비스 품질 개선 및 방문 통계 분석을 위해 Google Analytics 및 Google AdSense 서비스가 연동되어 있습니다. 해당 서비스들은 비식별화된 트래픽 정보만을 수집합니다.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3">5. 개인정보보호 문의처</h2>
          <p>
            개인정보 보호 관련 문의 사항이나 기타 의문 사항이 있으신 경우 아래 연락처로 문의해 주시기 바랍니다.
          </p>
          <p class="mt-2 text-amber-700 dark:text-[#FFDE9E] font-medium">
            이메일: support@sajuapp.co.kr | 사이트: sajuapp.co.kr
          </p>
        </section>
      </div>

      <div class="mt-10 pt-6 border-t border-amber-200/40 dark:border-slate-700/50 flex justify-center">
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
