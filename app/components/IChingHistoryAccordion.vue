<script setup lang="ts">
import { ref } from 'vue'

interface SubItem {
  subtitle: string
  content: string
}

interface AccordionItem {
  id: string
  title: string
  badge: string
  summary?: string
  quote?: string
  content?: string
  items?: SubItem[]
}

// 초기 상태에서는 모든 아코디언이 닫혀있도록 null 설정
const openAccordionIndex = ref<number | null>(null)

const toggleAccordion = (index: number) => {
  if (openAccordionIndex.value === index) {
    openAccordionIndex.value = null
  } else {
    openAccordionIndex.value = index
  }
}

const historyAccordions: AccordionItem[] = [
  {
    id: 'yisunshin',
    title: '⚔️ 이순신 장군 (조선) — 전략적 시뮬레이션과 마음의 평정',
    badge: '조선 수군 통제사',
    summary: '이순신 장군은 임진왜란 와중 대치 상태나 가족의 안위가 걱정될 때 『주역』 64괘를 기반으로 한 \'척자점(擲字占·윷점)\'을 자주 쳤습니다. 장군에게 점은 맹신이 아니라 "길흉 사이에서 인간이 어떻게 대처해야 하는가"를 고민하는 일종의 전략 시뮬레이션이었습니다.',
    items: [
      {
        subtitle: '• 아들의 병세를 걱정하며 친 점괘 (1594년 7월 13일)',
        content: '상황: 셋째 아들 면(葂)이 평소 피를 토한다는 소식을 듣고 비가 내리는 진중에서 점을 쳤습니다.\n점괘: 첫 번째는 \'여견군왕(如見君王·임금을 뵙는 것 같다)\'이 나왔고, 거듭 친 두 번째는 \'여야득등(如夜得燈·밤에 등불을 얻은 것 같다)\'이라는 괘를 얻었습니다. 두 괘 모두 매우 길한 괘였기에 이순신 장군은 비로소 마음을 놓을 수 있었습니다.'
      },
      {
        subtitle: '• 원균의 패배를 예견한 점괘 (1597년 7월 10일)',
        content: '상황: 원균이 삼도수군통제사가 되어 무모한 출격을 감행하려 하자, 전세를 걱정하며 점을 쳤습니다.\n점괘: \'풍랑을 만난 배가 돛을 잃고 흉한 일을 당하는 형국\'의 괘를 얻었습니다. 안타깝게도 이 점괘대로 며칠 뒤인 7월 15일, 조선 수군은 칠천량 해전에서 원균의 지휘 아래 대패하게 됩니다.'
      }
    ]
  },
  {
    id: 'confucius',
    title: '📖 공자 (고대 중국) — 유학의 성인이 주역에 빠진 이유',
    badge: '유교의 성인',
    summary: '유교의 성인인 공자는 늦은 나이에 『주역』에 깊이 심취하여, 책을 묶은 가죽 끈이 세 번이나 끊어질 정도(위편삼절·韋編三絶)로 열심히 읽었습니다. 제자인 자공이 "선생님처럼 덕이 높으신 분도 점을 치십니까?"라고 묻자 공자는 말했습니다.',
    quote: '"내가 주역을 좋아하는 것은 점괘의 길흉 때문이 아니라, 그 속에 담긴 덕(德)과 의리(義理) 때문이다. 점을 치는 사람들과 내가 도달하는 목적지는 같을지 몰라도, 그 길을 걸어가는 과정과 마음가짐은 완전히 다르다."',
    content: '공자에게 주역 점괘는 미래를 맞추는 요행이 아니라, 내가 지금 올바른 길(義)을 가고 있는지 하늘의 뜻에 비추어 스스로를 반성하는 도구였습니다.'
  },
  {
    id: 'dasan',
    title: '✍️ 다산 정약용 (조선) — 유배지에서 학문으로 승화시킨 주역',
    badge: '조선 실학의 거두',
    summary: '조선 최고의 실학자 다산 정약용은 강진 유배 시절, 가문이 폐족이 되고 자신마저 언제 죽을지 모르는 극심한 고독과 불안 속에서 『주역』을 붙잡았습니다.',
    items: [
      {
        subtitle: '• 상황과 절박함',
        content: '유배 초기, 미래에 대한 기약이 없고 신변이 지극히 위태롭던 시절에 다산은 자신의 운명을 하늘에 물으며 주역점을 쳤습니다.'
      },
      {
        subtitle: '• 해석과 학문적 승화',
        content: '정약용은 점괘를 뽑아 보며 처세의 방법을 구했고, 이를 바탕으로 인간이 위기 상황에서 취해야 할 태도를 철학적으로 탐구했습니다. 그는 단순히 점을 치는 데 그치지 않고, 방대한 주역 해석서인 『주역사전(周易四箋)』을 집필하여 조선 주역 학문의 최고봉에 올랐습니다.'
      }
    ]
  },
  {
    id: 'summary',
    title: '💡 요약: 성인들에게 \'주역 점괘\'란?',
    badge: '피흉추길의 지혜',
    summary: '역사 속 성인들이 본 주역점은 오늘날의 맹목적인 기복신앙이나 사주풀이와 결이 다릅니다.',
    content: '이들은 \'피흉추길(避凶推吉·재앙을 피하고 길함을 쫓음)\'을 하되, 재앙을 피하는 방법이 꼼수나 도망이 아니라 \'스스로의 마음을 바르게 다잡고 타이밍을 기다리는 것\'에 있음을 주역 점괘를 통해 배웠습니다.'
  }
]
</script>

<template>
  <div :class="['mt-6 pt-5 border-t border-amber-500/30', 'dark:border-emerald-500/30']">
    <!-- 헤더 안내 -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-base sm:text-lg">📜</span>
      <h4 :class="['font-serif-kr font-bold text-sm sm:text-base text-amber-900', 'dark:text-emerald-200']">
        역사 속 위인들의 주역 점괘 활용 사례
      </h4>
      <span :class="['text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/30 font-semibold ml-auto shrink-0', 'dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-500/40']">
        위인의 지혜
      </span>
    </div>
    <p :class="['text-xs text-amber-900/80 mb-4 leading-relaxed font-medium', 'dark:text-emerald-100/90']">
      성인들은 주역을 단순 미신이 아닌 위기 상황에서 마음을 정돈하고 미래 전략을 구상하는 지혜의 나침반으로 삼았습니다. 아래 제목을 클릭하시면 세부 이야기를 보실 수 있습니다.
    </p>

    <!-- 아코디언 항목 목록 -->
    <div class="space-y-2.5">
      <div
        v-for="(item, idx) in historyAccordions"
        :key="item.id"
        :class="[
          'rounded-xl border transition-all duration-300 overflow-hidden',
          openAccordionIndex === idx 
            ? ['border-amber-500/50 bg-amber-500/10 shadow-md', 'dark:bg-emerald-950/80 dark:border-emerald-400/60'] 
            : ['border-amber-500/20 bg-white/60 hover:border-amber-500/40 hover:bg-amber-500/5', 'dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40']
        ]"
      >
        <!-- 아코디언 버튼 -->
        <button
          type="button"
          class="w-full px-3.5 sm:px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer select-none"
          @click="toggleAccordion(idx)"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span :class="['font-serif-kr font-bold text-xs sm:text-sm text-gray-900 truncate', 'dark:text-emerald-50']">
              {{ item.title }}
            </span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span :class="['hidden sm:inline-block text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-900 font-semibold', 'dark:bg-emerald-900/80 dark:text-emerald-200 dark:border-emerald-500/40']">
              {{ item.badge }}
            </span>
            <UIcon
              name="i-heroicons-chevron-down"
              :class="[
                'w-4 h-4 sm:w-5 sm:h-5 text-amber-600 transition-transform duration-300',
                'dark:text-emerald-300',
                openAccordionIndex === idx ? 'rotate-180' : 'rotate-0'
              ]"
            />
          </div>
        </button>

        <!-- 펼쳐지는 영역 -->
        <div
          v-show="openAccordionIndex === idx"
          :class="['px-3.5 sm:px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed border-t border-amber-500/20 space-y-3', 'dark:border-emerald-500/30']"
        >
          <!-- 하이라이트 요약 박스 -->
          <p v-if="item.summary" :class="['font-medium text-amber-950 bg-amber-500/10 p-3 rounded-lg border border-amber-500/30 shadow-xs', 'dark:text-emerald-100 dark:bg-emerald-900/70 dark:border-emerald-500/40']">
            {{ item.summary }}
          </p>

          <!-- 세부 사건 리스트 (이순신 장군 / 다산 정약용 등) -->
          <div v-if="item.items" class="space-y-2.5 pt-1">
            <div
              v-for="(sub, sIdx) in item.items"
              :key="sIdx"
              :class="['p-3 rounded-lg bg-white/80 border border-amber-500/20 shadow-xs', 'dark:bg-emerald-950/80 dark:border-emerald-500/30']"
            >
              <h5 :class="['font-bold text-xs sm:text-sm text-amber-800 mb-1.5 flex items-center gap-1.5', 'dark:text-emerald-200']">
                {{ sub.subtitle }}
              </h5>
              <p :class="['whitespace-pre-line text-xs sm:text-sm text-gray-700 leading-relaxed font-medium', 'dark:text-emerald-100/95']">
                {{ sub.content }}
              </p>
            </div>
          </div>

          <!-- 명언 / 인용구 영역 -->
          <blockquote
            v-if="item.quote"
            :class="['p-3 my-2 border-l-4 border-amber-500 bg-amber-500/10 italic text-xs sm:text-sm font-serif-kr text-amber-950 rounded-r-lg font-medium shadow-xs', 'dark:bg-emerald-900/70 dark:text-emerald-100 dark:border-emerald-400']"
          >
            {{ item.quote }}
          </blockquote>

          <!-- 본문 상세 및 결론 -->
          <p v-if="item.content" :class="['text-xs sm:text-sm text-gray-700 leading-relaxed font-medium pt-1', 'dark:text-emerald-100/95']">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
