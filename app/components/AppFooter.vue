<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    :class="[
      'mt-0 border-t py-8 pb-20 sm:pb-10 px-4 sm:px-8 text-xs transition-colors duration-300',
      'bg-white/60 border-amber-200/60 text-slate-600',
      'dark:bg-[#090C1A]/80 dark:border-[#4d4638]/30 dark:text-slate-400'
    ]"
  >
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      
      <!-- 좌측 브랜드 및 저작권 -->
      <div class="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/"
            :class="[
              'font-serif-kr text-base font-bold hover:opacity-80 transition-opacity',
              'text-amber-800',
              'dark:text-[#FFDE9E]'
            ]"
          >
            일일운세 ✦ 天命
          </NuxtLink>
        </div>
        <p :class="['max-w-md leading-relaxed', 'text-slate-500', 'dark:text-slate-400']">
          생년월일 기반 사주명리학과 3단계 점대 드로우 주역 64괘 분석으로 하루의 에너지와 처세의 지혜를 건네는 무료 AI 일일 운세 서비스입니다.
        </p>
        <p :class="['text-[11px] mt-1', 'text-slate-400', 'dark:text-slate-500']">
          © {{ currentYear }} sajuapp.co.kr. All rights reserved.
        </p>
      </div>

      <!-- 우측 하단 네비게이션 정식 링크 (안내, 약관, 방침) -->
      <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium">
        <NuxtLink
          to="/about"
          :class="['transition-colors', 'hover:text-amber-600', 'dark:hover:text-[#FFDE9E]']"
        >
          사이트 소개
        </NuxtLink>
        <NuxtLink
          to="/guide/saju"
          :class="['transition-colors', 'hover:text-amber-600', 'dark:hover:text-[#FFDE9E]']"
        >
          사주명리 가이드
        </NuxtLink>
        <NuxtLink
          to="/guide/iching"
          :class="['transition-colors', 'hover:text-amber-600', 'dark:hover:text-[#FFDE9E]']"
        >
          주역비결 가이드
        </NuxtLink>
        <NuxtLink
          to="/privacy"
          :class="['transition-colors', 'hover:text-amber-600', 'dark:hover:text-[#FFDE9E]']"
        >
          개인정보처리방침
        </NuxtLink>
        <NuxtLink
          to="/terms"
          :class="['transition-colors', 'hover:text-amber-600', 'dark:hover:text-[#FFDE9E]']"
        >
          이용약관
        </NuxtLink>
      </div>

    </div>
  </footer>
</template>
