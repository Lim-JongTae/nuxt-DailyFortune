<template>
  <div class="space-y-4">
    <div>
      <h4 class="font-serif-kr font-bold text-base pg-text mb-3">☯️ 주역 64괘란?</h4>
      <p>
        주역은 3천 년 전부터 전해져 내려온 동양 최고의 지혜서로, 하늘(☰)과 땅(☷)의 조화를 8괘로 나타내고
        이를 조합하여 64가지 상황(64괘)을 설명합니다. 각 괘는 6개의 효(爻)로 구성되며,
        변화하는 효를 통해 현재 상황에서 미래로 나아가는 처세의 지혜를 제시합니다.
      </p>
      <!-- 역사 속 위인들의 주역 점괘 활용 사례 아코디언 컴포넌트 -->
      <IChingHistoryAccordion />
    </div>

    <div class="mt-4">
      <h4 class="font-serif-kr font-bold text-base pg-text mb-3">🤖 AI 운세 해석</h4>
      <p class="text-xs sm:text-md">
        주역의 고전 자료를 바탕으로 AI가 풀이를 만듭니다. 괘상과 효사를 반영해 고전의 뜻을 오늘의 상황으로 옮겨 드리니, 정해진 결과가 아니라 선택을 돌아보는 거울로 활용해 보세요.<br>모두가 행복한 세상을 바라며...
      </p>
    </div>

    <div class="mt-6 pt-4 border-t pg-border flex flex-wrap justify-center gap-4 text-xs font-medium">
      <NuxtLink
        to="/guide/iching"
        :class="[
          'inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors',
          'text-amber-800',
          'dark:text-[#FFDE9E]'
        ]"
      >
        <UIcon name="i-heroicons-sparkles" :class="['w-4 h-4', 'text-amber-600', 'dark:text-amber-400']" />
        <span>주역 64괘 원리 해설 문서 ➔</span>
      </NuxtLink>
    </div>
  </div>
</template>
