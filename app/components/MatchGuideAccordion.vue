<script setup lang="ts">
import { ref } from 'vue'

interface AccordionItem {
  id: string
  title: string
  badge: string
  summary?: string
  subItems?: Array<{ title: string; desc: string }>
}

// 기본적으로 닫힌 상태 (원하는 항목 클릭 시 토글)
const openIndex = ref<number | null>(null)

const toggleAccordion = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx
}

// 4대 핵심 궁합지표, 지지삼합, 지지칠충 3개 전용 아코디언 목록
const matchAccordions: AccordionItem[] = [
  {
    id: 'indicators',
    title: '✦ 사주앱은 이렇게 살펴봅니다 — 4대 핵심 궁합 지표',
    badge: '4대 지표',
    summary: '정통 명리학 이론을 바탕으로 4가지 차원에서 두 사람의 인연을 다각도로 분석합니다.',
    subItems: [
      {
        title: '천간합(天干合) — 정신적 교감',
        desc: '태어난 날의 천간끼리 합하는 5쌍(갑기, 을경, 병신, 정임, 무계)을 통해 가치관의 일치와 정신적 끌림의 깊이를 살핍니다.'
      },
      {
        title: '지지의 합과 충 — 일상 생활의 조화',
        desc: '서로 어우러지는 육합(자축, 인해, 묘술, 진유, 사신, 오미)과 부딪히는 육충(자오, 축미, 인신, 묘유, 진술, 사해)으로 현실 생활 리듬의 조화를 살핍니다.'
      },
      {
        title: '오행의 상호 보완 — 에너지 시너지',
        desc: '한 사람에게 부족하거나 결핍된 오행을 상대방이 넉넉히 채워 주는지 살펴, 서로가 서로에게 귀인이 되는 상호 보완 관계를 분석합니다.'
      },
      {
        title: '60일주 기질 매칭 — 대화와 처세',
        desc: '태어난 날의 일주(예: 갑자일주, 기축일주)로 본 두 사람의 고유 기질과 대화 방식이 어떻게 만나 시너지를 내는지 살핍니다.'
      }
    ]
  },
  {
    id: 'sanhe',
    title: '🌀 지지 삼합(三合) — 거대한 오행 시너지와 동반자적 결합',
    badge: '삼합 비결',
    summary: '세 지지가 하나로 뭉쳐 강력한 오행의 기운을 형성하는 삼합은 공동의 목표를 향해 나아가는 가장 끈끈한 인연입니다.',
    subItems: [
      {
        title: '신자진 수국(申子辰 水局) 삼합',
        desc: '지혜와 유연함이 극대화되는 결합으로, 서로에게 깊은 영감과 정서적 안정감을 나누는 인연입니다.'
      },
      {
        title: '사유축 금국(巳酉丑 金局) 삼합',
        desc: '결단력과 현실적 결실을 맺는 결합으로, 함께 과업이나 재정적 안정을 일구어내는 든든한 동반자 인연입니다.'
      },
      {
        title: '인오술 화국(寅午戌 火局) 삼합',
        desc: '뜨거운 열정과 밝은 이상을 공유하는 결합으로, 함께 세상을 넓혀 나가는 활력 넘치는 인연입니다.'
      },
      {
        title: '해묘미 목국(亥卯未 木局) 삼합',
        desc: '새로운 성장과 따뜻한 생명력을 키워가는 결합으로, 온화한 사랑과 지속적인 발전을 이루는 인연입니다.'
      }
    ]
  },
  {
    id: 'chong',
    title: '⚡ 지지 칠충(七沖 / 六沖) — 부딪힘을 상호 성장으로 바꾸는 처세',
    badge: '충과 조율',
    summary: '충(沖)은 정반대의 기운이 마주치는 것으로, 무조건적인 파국이 아니라 서로의 다름을 인정하고 조율할 때 가장 큰 성장을 가져옵니다.',
    subItems: [
      {
        title: '자오충(子午沖) & 사해충(巳亥沖)',
        desc: '물과 불, 그리고 생각과 활동성의 정면충돌입니다. 감정의 기복을 다스리고 차분한 대화와 템포 조절이 중요합니다.'
      },
      {
        title: '축미충(丑未沖) & 진술충(辰戌沖)',
        desc: '대지와 자존심의 부딪힘입니다. 고집과 영역 싸움을 내려놓고 유연한 양보와 배려를 실천하면 단단한 신뢰가 형성됩니다.'
      },
      {
        title: '인신충(寅申沖) & 묘유충(卯酉沖)',
        desc: '활동력과 언어로 인한 충돌입니다. 주도권 다툼을 피하고 말 한마디에 따뜻한 배려를 담는 노력이 핵심입니다.'
      }
    ]
  }
]
</script>

<template>
  <div class="space-y-2.5 my-3">
    <div
      v-for="(item, idx) in matchAccordions"
      :key="item.id"
      class="border rounded-xl overflow-hidden transition-all duration-200"
      :class="[
        openIndex === idx
          ? ['bg-amber-50/70 border-amber-400/60 shadow-xs', 'dark:bg-rose-950/20 dark:border-rose-500/50']
          : ['bg-white/80 border-amber-200/60 hover:border-amber-300', 'dark:bg-[#1A203C]/70 dark:border-slate-700/80 dark:hover:border-slate-600']
      ]"
    >
      <!-- 아코디언 헤더 버튼 -->
      <button
        type="button"
        @click="toggleAccordion(idx)"
        class="w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer select-none"
      >
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span :class="['font-bold text-xs sm:text-sm truncate text-slate-800', 'dark:text-slate-100']">
            {{ item.title }}
          </span>
          <span
            v-if="item.badge"
            :class="[
              'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 border bg-rose-500/10 text-rose-700 border-rose-500/20',
              'dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
            ]"
          >
            {{ item.badge }}
          </span>
        </div>
        <UIcon
          name="i-heroicons-chevron-down"
          :class="[
            'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
            openIndex === idx ? ['rotate-180 text-rose-500', 'dark:text-rose-400'] : ''
          ]"
        />
      </button>

      <!-- 아코디언 펼침 내용 -->
      <div
        v-if="openIndex === idx"
        :class="['px-4 pb-4 pt-1.5 text-xs sm:text-sm border-t border-amber-200/50 space-y-3', 'dark:border-slate-700/60']"
      >
        <p v-if="item.summary" :class="['text-xs font-medium leading-relaxed pt-1 text-slate-600', 'dark:text-slate-300']">
          {{ item.summary }}
        </p>

        <div v-if="item.subItems && item.subItems.length" class="space-y-2.5 pt-1">
          <div
            v-for="(sub, subIdx) in item.subItems"
            :key="subIdx"
            :class="['p-3 rounded-lg border bg-white/60 border-amber-100', 'dark:bg-slate-900/40 dark:border-slate-800']"
          >
            <h4 :class="['font-bold text-xs mb-1 flex items-center gap-1.5 text-amber-900', 'dark:text-rose-300']">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              <span>{{ sub.title }}</span>
            </h4>
            <p :class="['text-[11px] sm:text-xs leading-relaxed text-slate-600', 'dark:text-slate-400']">
              {{ sub.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
