<script setup lang="ts">
const ichingGuides = [
  {
    title: '주역 64괘와 변효 가이드',
    path: '/guide/iching',
    category: '주역 점학',
    icon: 'i-heroicons-sparkles',
    iconCustom: null,
    desc: '3단계 대나무 점대 드로우(하괘 ➔ 상괘 ➔ 동효)로 도출되는 주역 64괘의 이치와 지혜로운 처세술을 배웁니다.'
  },
  {
    title: '주역 64괘 구성과 괘상 해설',
    path: '/guide/hexagrams',
    category: '주역 심층',
    icon: 'i-heroicons-sparkles',
    iconCustom: '☯',
    desc: '음(陰)과 양(陽) 효가 6단계로 쌓여 빚어내는 64개 괘상의 이름과 그 안에 담긴 우주 자연의 대원칙을 해설합니다.'
  }
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <NuxtLink
      v-for="(g, idx) in ichingGuides"
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
          <span v-if="g.iconCustom" class="text-lg text-amber-600 font-serif-kr">{{ g.iconCustom }}</span>
          <UIcon v-else :name="g.icon" :class="['w-5 h-5 text-amber-600', 'dark:text-[#FFDE9E]']" />
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
