<script setup lang="ts">
import MatchGuideAccordion from '../MatchGuideAccordion.vue'

const matchSummaryGuides = [
  {
    title: '정통 사주 궁합 4대 핵심 지표',
    category: '궁합 기본원리',
    icon: 'i-heroicons-heart',
    desc: '천간합(정신적 교감), 지지합충(현실 조화), 오행 상호 보완(시너지), 60일주론(기질 매칭)의 4대 관점으로 인연의 깊이를 헤아립니다.'
  },
  {
    title: '지지 삼합(三合)과 육합·충 인연학',
    category: '지지 합충비결',
    icon: 'i-heroicons-arrows-right-left',
    desc: '세 지지가 모여 거대한 에너지를 이루는 삼합(水·金·火·木局)과 육합, 그리고 부딪힘을 지혜롭게 조율하는 충(沖)의 처세술을 배웁니다.'
  }
]
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- 1. 핵심 궁합 요약 카드 (2열 그리드 - 사주/주역과 동일한 카드 스타일) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="(g, idx) in matchSummaryGuides"
        :key="g.title"
        v-reveal="{ delay: idx * 80 }"
        :class="[
          'p-6 rounded-xl border flex flex-col justify-between transition-all duration-200 shadow-2xs',
          'bg-amber-50/40 border-amber-200/60',
          'dark:bg-[#1A203C] dark:border-slate-700'
        ]"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <span :class="['text-xs font-semibold px-2.5 py-0.5 rounded-full', 'bg-rose-100 text-rose-800', 'dark:bg-rose-950/60 dark:text-rose-300']">
              {{ g.category }}
            </span>
            <UIcon :name="g.icon" :class="['w-5 h-5 text-rose-600', 'dark:text-rose-400']" />
          </div>

          <h2 :class="['text-lg font-serif-kr font-bold mb-2 text-amber-900', 'dark:text-[#FFDE9E]']">
            {{ g.title }}
          </h2>

          <p :class="['text-xs sm:text-sm leading-relaxed mb-4 text-slate-600', 'dark:text-slate-300']">
            {{ g.desc }}
          </p>
        </div>
      </div>
    </div>

    <!-- 2. 심층 궁합 역사 및 인연 처세 박스 (중국/한국 역사 + 고전) -->
    <div :class="['p-5 sm:p-7 rounded-2xl border shadow-sm space-y-5', 'bg-white/80 border-amber-200/50', 'dark:bg-[#12162E]/70 dark:border-slate-700/60']">
      <div class="flex items-center gap-2 pb-3 border-b pg-border">
        <UIcon name="i-heroicons-sparkles" :class="['w-5 h-5 text-amber-600', 'dark:text-amber-400']" />
        <h3 :class="['font-serif-kr text-base sm:text-lg font-bold text-amber-900', 'dark:text-[#FFDE9E]']">
          궁합(宮合)이란 — 역사와 정통 명리학의 지혜
        </h3>
      </div>

      <p :class="['text-xs sm:text-sm leading-relaxed text-slate-600', 'dark:text-slate-300']">
        <strong>궁합(宮合)</strong>은 두 사람의 사주를 견주어 서로의 기질과 삶의 호흡이 어떻게 어우러지는지 살펴보는 전통 지혜입니다. 오늘날에는 결혼뿐 아니라 연인, 친구, 동업자 간의 다름을 이해하고 존중하는 성숙한 소통의 나침반으로 활용됩니다.
      </p>

      <!-- 역사 2열 비교 박스 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-xl border pg-border pg-card-inner space-y-2">
          <h4 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-amber-800', 'dark:text-amber-300']">
            <span>📜 고대 중국의 혼례 예법과 합혼(合婚)</span>
          </h4>
          <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
            주나라 예법 『의례(儀禮)』의 여섯 절차(六禮) 중 신부의 이름을 묻는 문명(問名)과 길함을 점치는 납길(納吉)에서 유래하여, 서자평의 자평명리학 체계와 함께 두 사람의 사주를 맞추는 합혼(合婚) 풍속으로 발전했습니다.
          </p>
        </div>

        <div class="p-4 rounded-xl border pg-border pg-card-inner space-y-2">
          <h4 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-rose-800', 'dark:text-rose-300']">
            <span>🇰🇷 조선 왕실과 사주단자(四柱單子) 문화</span>
          </h4>
          <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
            조선 시대에는 혼담이 오갈 때 신랑의 사주팔자를 적은 사주단자를 정갈하게 보내고 길일을 택했습니다. 단순한 길흉 단정이 아니라 두 사람의 성정과 복을 헤아려 화합을 도모하는 귀한 문화였습니다.
          </p>
        </div>
      </div>

      <!-- 3. 핵심 궁합 아코디언 컴포넌트 연결 -->
      <div class="pt-2">
        <MatchGuideAccordion />
      </div>

      <!-- 4. 실전 궁합 테스트 바로가기 CTA 배너 -->
      <!-- <div class="pt-4 border-t pg-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="space-y-1 text-center sm:text-left">
          <h4 class="font-serif-kr text-sm sm:text-base font-bold pg-text flex items-center justify-center sm:justify-start gap-1.5">
            <span class="text-rose-500">♥</span>
            <span>지금 두 사람의 사주 궁합을 직접 확인해 보세요</span>
          </h4>
          <p class="text-xs pg-text-muted">
            천간합·지지합충·오행 시너지 지수와 최신 Gemini AI의 심층 처세 리포트를 무료로 제공합니다.
          </p>
        </div>
        <NuxtLink
          to="/match"
          class="shrink-0 px-5 py-2.5 rounded-xl font-serif-kr font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer hover:scale-102 bg-rose-500 text-white hover:bg-rose-600"
        >
          <UIcon name="i-heroicons-heart" class="w-4 h-4" />
          <span>사주 궁합 보러가기</span>
          <span>➔</span>
        </NuxtLink>
      </div> -->
    </div>
  </div>
</template>
