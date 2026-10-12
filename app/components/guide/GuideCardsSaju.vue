<script setup lang="ts">
const sajuGuides = [
  {
    title: '사주명리학 60일주 실전 가이드',
    path: '/guide/saju',
    category: '명리학 입문',
    icon: 'i-heroicons-book-open',
    desc: '태어난 연·월·일·시 4개의 기둥(四柱)과 60일주(60柱論)에 담긴 선천적 기운과 운 흐름의 근본 원리를 해설합니다.'
  },
  {
    title: '10천간 & 12지간 60갑자 해설',
    path: '/guide/stems-branches',
    category: '갑자 순환',
    icon: 'i-heroicons-clock',
    desc: '하늘의 기운(십간)과 땅의 계절(십이지)이 빚어내는 60갑자의 순환 체계와 매일의 일진(日辰)에 담긴 의미를 설명합니다.'
  },
  {
    title: '오행(五行) 상생상극과 운세 영향',
    path: '/guide/five-elements',
    category: '오행 원리',
    icon: 'i-heroicons-sun',
    desc: '목(木)·화(火)·토(土)·금(金)·수(水) 5가지 자연 에너지가 만물을 순환시키고 나의 기운을 조율하는 상생상극의 진리입니다.'
  },
  {
    title: '십신(十神) 10가지 역학 관계 해설',
    path: '/guide/ten-gods',
    category: '명리 심층',
    icon: 'i-heroicons-academic-cap',
    desc: '비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인 등 나와 세상이 맺는 10가지 인간관계와 운의 별을 다룹니다.'
  }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <NuxtLink
      v-for="(g, idx) in sajuGuides"
      :key="g.path"
      :to="g.path"
      v-reveal="{ delay: idx * 80 }"
      :class="[
        'group p-6 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between',
        'bg-amber-50/40 border-amber-200/60 hover:bg-amber-100/50 hover:border-amber-300',
        'dark:bg-[#1A203C] dark:border-slate-700 dark:hover:bg-[#202747] dark:hover:border-amber-900/50'
      ]"
    >
      <div>
        <div class="flex items-center justify-between mb-3">
          <span :class="['text-xs font-semibold px-2.5 py-0.5 rounded-full', 'bg-amber-100 text-amber-800', 'dark:bg-amber-900/40 dark:text-amber-300']">
            {{ g.category }}
          </span>
          <UIcon :name="g.icon" :class="['w-5 h-5 text-amber-600', 'dark:text-[#FFDE9E]']" />
        </div>

        <h2 :class="['text-lg font-serif-kr font-bold mb-2 transition-colors text-amber-900 group-hover:text-amber-700', 'dark:text-[#FFDE9E] dark:group-hover:text-amber-300']">
          {{ g.title }}
        </h2>

        <p :class="['text-xs sm:text-sm leading-relaxed mb-4', 'text-slate-600', 'dark:text-slate-300']">
          {{ g.desc }}
        </p>
      </div>

      <div :class="['text-xs font-medium flex items-center gap-1 mt-2 pt-3 border-t transition-transform border-amber-200/40 text-amber-700 group-hover:translate-x-1', 'dark:border-slate-700/60 dark:text-amber-300']">
        <span>상세 가이드 읽기</span>
        <span>➔</span>
      </div>
    </NuxtLink>
  </div>
</template>
