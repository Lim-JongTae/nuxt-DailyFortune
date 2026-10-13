<script setup lang="ts">
// 인연 사주 궁합 탭 프리뷰 카드
</script>

<template>
  <div class="space-y-6">
    <NuxtLink 
      to="/match"
      class="gold-filament-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
    >
      <!-- Background Watermark (z-0) -->
      <div class="absolute -right-2 -top-4 pg-watermark-text animate-watermark-pulse text-8xl font-serif-kr select-none pointer-events-none z-0">
        緣
      </div>

      <!-- Foreground Content (z-10) -->
      <div class="relative z-10">
        <!-- Header with Vermilion Mini-Seal -->
        <div class="flex items-center justify-between pb-4 sm:pb-5 border-b pg-border gap-2">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <span class="seal-stamp text-base sm:text-lg px-2 py-0.5 shrink-0">緣</span>
            <div class="min-w-0">
              <h2 class="font-serif-kr text-base sm:text-xl lg:text-2xl pg-text font-bold whitespace-nowrap">
                인연 사주궁합
              </h2>
              <p class="text-[11px] sm:text-xs pg-text-muted mt-0.5 truncate">두 사람의 천간합·지지합충과 오행 시너지</p>
            </div>
          </div>
          <span class="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full badge-rose-pill border border-rose-500/30 text-[11px] sm:text-xs font-medium relative z-10 shrink-0 whitespace-nowrap shadow-xs backdrop-blur-xs">
            2인 케미스트리
          </span>
        </div>

        <!-- Compatibility Preview Showcase -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pg-card-inner p-5 rounded-2xl border pg-border">
          <!-- 좌측: 비주얼 엠블럼 -->
          <div class="flex items-center justify-center p-3">
            <div class="relative w-28 h-28 flex items-center justify-center">
              <!-- 하트 & 인연 회전 링 -->
              <svg class="w-full h-full text-rose-500 animate-spin origin-center" style="animation-duration: 25s;" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6" />
              </svg>
              <!-- 중심 하트 음양 아이콘 -->
              <div class="absolute inset-0 flex flex-col items-center justify-center text-rose-500">
                <UIcon name="i-heroicons-heart" class="w-10 h-10 animate-pulse text-rose-500" />
                <span class="text-[12px] font-serif-kr font-bold text-amber-500 mt-1"> 천생염분</span>
              </div>
            </div>
          </div>

          <!-- 우측: 4대 핵심 지표 요약 -->
          <div class="flex flex-col justify-center space-y-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span class="font-bold pg-text">천간합 (天干合)</span>
              <span class="pg-text-muted">첫인상과 정신적 교감</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span class="font-bold pg-text">지지합·충 (地支合·沖)</span>
              <span class="pg-text-muted">생활 리듬과 현실 조화</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span class="font-bold pg-text">오행 상호 보완</span>
              <span class="pg-text-muted">결핍 에너지 보충 시너지</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              <span class="font-bold pg-text">60일주 기질 매칭</span>
              <span class="pg-text-muted">성향 조화와 처세 비결</span>
            </div>
          </div>
        </div>

        <!-- 감성 문구 박스 -->
        <div :class="['bg-rose-500/5', 'dark:bg-rose-500/10']" class="mt-4 p-3 rounded-xl border border-rose-500/20 flex items-center gap-2.5">
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-rose-500 shrink-0" />
          <p :class="['text-rose-700', 'dark:text-rose-300']" class="text-xs font-serif-kr font-medium leading-relaxed">
            연인, 부부, 인연, 친구·동업자까지 — 두 사람의 생년월일시로 입체적인 인연의 온도를 확인하세요.
          </p>
        </div>
      </div>

      <!-- CTA Button (z-10) -->
      <div class="mt-8 relative z-10">
        <div class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white cta-rose-btn hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-rose-500/30">
          <span>❤️ 사주 궁합 확인하기</span>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.badge-rose-pill {
  background-color: rgba(244, 63, 94, 0.1);
  color: #e11d48;
}
.dark .badge-rose-pill {
  background-color: rgba(244, 63, 94, 0.2);
  color: #fda4af;
}

.cta-rose-btn {
  background: linear-gradient(to right, #e11d48, #be123c, #9f1239);
}
</style>
