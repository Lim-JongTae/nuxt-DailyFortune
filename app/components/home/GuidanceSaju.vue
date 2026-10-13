<script setup lang="ts">
import { ref } from 'vue'

// '무엇을 살펴보나요' 5개 핵심 지표 아코디언 토글 상태
const openExamIndex = ref<number | null>(null)
const toggleExamAccordion = (idx: number) => {
  openExamIndex.value = openExamIndex.value === idx ? null : idx
}

// '현대에서 사주명리가 주는 시사점' 5가지 아코디언 토글 상태
const openImplicationIndex = ref<number | null>(null)
const toggleImplicationAccordion = (idx: number) => {
  openImplicationIndex.value = openImplicationIndex.value === idx ? null : idx
}

interface SajuExamItem {
  id: string
  title: string
  badge: string
  desc: string
  subPoints?: Array<{ label: string; text: string }>
}

const sajuExamItems: SajuExamItem[] = [
  {
    id: 'ilgan',
    title: '✦ 일간과 60일주 — 타고난 나(我)의 본질과 기본 기질',
    badge: '기본 기질',
    desc: "태어난 날의 천간인 일간(日干)은 사주팔자에서 '나 자신'을 상징하는 중심축입니다. 10개의 천간과 12개의 지지가 짝을 이룬 60가지 일주(예: 갑자일주, 기축일주 등)를 통해 고유한 기질과 행동 양식을 분류합니다."
  },
  {
    id: 'elements',
    title: '✦ 오행의 균형 — 목·화·토·금·수 기운의 조화와 과부족',
    badge: '에너지 균형',
    desc: '자연과 우주를 이루는 5가지 기운(木·火·土·金·水)의 분포를 살핍니다. 특정 기운이 너무 넘치거나 부족한지 점검하고, 서로 돕는 상생(相生)과 제어하는 상극(相剋)의 역학을 통해 삶의 균형을 찾는 지혜를 배웁니다.'
  },
  {
    id: 'shipsin',
    title: '✦ 십신(十神) — 나와 세상을 잇는 열 가지 관계의 렌즈',
    badge: '사회적 역할',
    desc: '일간(나)을 기준으로 다른 글자들과 맺는 음양오행 관계를 10가지 사회적·심리적 역할로 세분화합니다.',
    subPoints: [
      { label: '비겁(비견·겁재)', text: '자아, 주체성, 동료, 독립심' },
      { label: '식상(식신·상관)', text: '표현력, 재능, 창의성, 활동력' },
      { label: '재성(편재·정재)', text: '현실 감각, 재물, 성과, 결과물' },
      { label: '관성(편관·정관)', text: '책임감, 직장, 사회적 규율, 명예' },
      { label: '인성(편인·정인)', text: '학문, 문서, 어머니, 수용성과 지혜' }
    ]
  },
  {
    id: 'woonseong',
    title: '✦ 12운성 — 기운의 싹틈부터 쇠퇴까지 열두 단계 주기',
    badge: '활력 주기',
    desc: '계절이 바뀌듯 천간의 기운이 지지를 만나면서 강해지고 약해지는 성쇠의 흐름을 12단계(장생·목욕·관대·건록·제왕·쇠·병·사·묘·절·태·양)로 비유하여, 현재 내가 발휘할 수 있는 에너지의 탄력성을 읽습니다.'
  },
  {
    id: 'daewun',
    title: '✦ 대운·세운·일진 — 10년·1년·하루 단위의 시간적 흐름',
    badge: '시간의 흐름',
    desc: "사주 원국이 타고난 '자동차'라면, 운(運)은 그 차가 달리는 '도로와 계절 환경'입니다.",
    subPoints: [
      { label: '대운(大運)', text: '10년 주기로 바뀌는 인생의 큰 무대와 환경 변화' },
      { label: '세운(歲運)', text: '해마다 찾아오는 연도별 기운과 당해의 주요 흐름' },
      { label: '일진(日辰)', text: '매일 찾아오는 하루의 간지로 그날의 컨디션과 선택의 리듬' }
    ]
  }
]

interface SajuImplicationItem {
  id: string
  title: string
  badge: string
  desc: string
}

const sajuImplicationItems: SajuImplicationItem[] = [
  {
    id: 'self',
    title: '1. 나를 이해하는 거울',
    badge: '자기 성찰',
    desc: '내가 무엇에 편안함을 느끼고 어디에서 부담을 받는지, 타고난 기질과 성향을 객관적으로 돌아보는 계기가 됩니다. 나의 고유한 성정과 장단점을 온전히 마주하고 인정할 때 삶의 단단한 자존감이 피어납니다.'
  },
  {
    id: 'timing',
    title: '2. 때(時)를 헤아리는 지혜',
    badge: '속도와 쉼표',
    desc: '서두를 때와 기다려야 할 때를 분별하여, 속도에 쫓기는 바쁜 일상 속에서 조급함을 내려놓는 마음의 쉼표가 됩니다. 자연에 사계절이 있듯 인생에도 씨를 뿌릴 때와 결실을 거둘 때가 있음을 배웁니다.'
  },
  {
    id: 'diversity',
    title: '3. 다름을 인정하는 포용',
    badge: '관계의 조화',
    desc: '오행의 조화처럼 사람마다 지닌 고유한 기질의 차이를 우열이 아닌 서로를 채워주는 상호 보완의 관점으로 바라보게 합니다. 나와 다른 상대방의 성향을 깊이 헤아리며 건강한 소통과 포용을 실천하게 돕습니다.'
  },
  {
    id: 'choice',
    title: '4. 선택 앞에서의 신중함',
    badge: '신중한 결단',
    desc: '불확실한 삶의 갈림길에서 충동적인 결정을 피하고, 잠시 멈추어 차분하게 미래를 점검할 시간을 줍니다. 한 치 앞을 알 수 없는 순간마다 최선과 차선을 분별하는 생각의 여유를 마련해 줍니다.'
  },
  {
    id: 'reference',
    title: '5. 정해진 숙명이 아닌 삶의 참고서',
    badge: '주체적 삶',
    desc: '사주는 미래를 단정 짓는 절대적 예언이 아닙니다. 정해진 운명에 얽매이기보다 내 삶을 주체적으로 이끌어 가기 위한 지혜로운 조언이자 참고 자료로 활용할 때 가장 유익합니다.'
  }
]
</script>

<template>
  <div class="space-y-6">
    <!-- 1. 사주명리학 원리 및 개념 (상시 펼침 카드) -->
    <div class="p-4 sm:p-5 rounded-2xl border pg-border pg-card space-y-5">
      <!-- 헤더 -->
      <div class="border-b pg-border pb-3.5 space-y-2">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border bg-amber-500/10 text-amber-800 border-amber-500/20',
              'dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
            ]"
          >
            📖 사주명리(四柱命理)
          </span>
          <h4 class="font-serif-kr text-base sm:text-lg font-bold pg-text">
            사주명리학의 기본 원리와 역사
          </h4>
        </div>
        <p class="font-serif-kr font-bold text-xs sm:text-sm leading-relaxed pg-text-gold">
          사주명리는 태어난 해·달·날·시의 여덟 글자(八字)로 타고난 기질과 삶의 흐름을 살펴보는 동양의 전통 학문입니다.
        </p>
        <p class="text-xs sm:text-sm leading-relaxed pg-text-muted">
          당나라 이허중과 송나라 서자평을 거치며 지금의 체계가 자리 잡았고, 우리나라에서도 오랫동안 삶의 선택을 돌아보는 지혜로 이어져 왔습니다. 정해진 운명이 아니라 나를 돌아보는 거울로 만나 보세요.
        </p>
      </div>

      <!-- 1) 사주명리(四柱命理)란? -->
      <div class="p-3.5 sm:p-4 rounded-xl border pg-border pg-card-inner space-y-1.5">
        <h5 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-amber-800', 'dark:text-amber-300']">
          <span>📜 사주명리(四柱命理)란?</span>
        </h5>
        <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
          사주명리학은 태어난 해·달·날·시의 네 기둥(四柱)을 천간과 지지 두 글자씩, 모두 여덟 글자(八字)로 세워 타고난 기질과 삶의 흐름을 살펴보는 동양의 전통 학문입니다. 그래서 <strong>사주팔자</strong>라고도 부릅니다. 음양오행(木火土金水)의 생극제화(生剋制化) 이론을 바탕으로, 태어난 날의 천간인 <strong>일간(日干)을 '나'</strong>로 두고 나머지 글자와의 관계를 읽습니다.
        </p>
      </div>

      <!-- 2) 무엇을 살펴보나요 (5개 하위 지표 아코디언) -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between pb-1">
          <h5 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-amber-800', 'dark:text-amber-300']">
            <span>🔍 무엇을 살펴보나요</span>
          </h5>
          <span class="text-[11px] pg-text-muted">항목을 누르면 상세 설명이 펼쳐집니다</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="(item, idx) in sajuExamItems"
            :key="item.id"
            class="border rounded-xl overflow-hidden transition-all duration-200"
            :class="[
              openExamIndex === idx
                ? ['bg-amber-50/70 border-amber-400/60 shadow-2xs', 'dark:bg-amber-950/20 dark:border-amber-500/50']
                : ['border-amber-200/50 hover:border-amber-300 pg-card-inner', 'dark:border-slate-700/70 dark:hover:border-slate-600']
            ]"
          >
            <!-- 아코디언 헤더 버튼 -->
            <button
              type="button"
              @click="toggleExamAccordion(idx)"
              class="w-full px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer select-none"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span :class="['font-bold text-xs sm:text-sm truncate text-slate-800', 'dark:text-slate-100']">
                  {{ item.title }}
                </span>
                <span
                  :class="[
                    'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 border bg-amber-500/10 text-amber-800 border-amber-500/20',
                    'dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                  ]"
                >
                  {{ item.badge }}
                </span>
              </div>
              <UIcon
                name="i-heroicons-chevron-down"
                :class="[
                  'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
                  openExamIndex === idx ? ['rotate-180 text-amber-600', 'dark:text-amber-400'] : ''
                ]"
              />
            </button>

            <!-- 아코디언 내용 -->
            <div
              v-if="openExamIndex === idx"
              :class="['px-3.5 pb-3.5 pt-1 text-xs sm:text-sm border-t border-amber-200/40 space-y-2', 'dark:border-slate-700/60']"
            >
              <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
                {{ item.desc }}
              </p>
              <div v-if="item.subPoints" class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                <div
                  v-for="(sub, sIdx) in item.subPoints"
                  :key="sIdx"
                  class="p-2 rounded-lg border pg-border pg-card-inner text-[11px]"
                >
                  <strong class="pg-text block mb-0.5">{{ sub.label }}</strong>
                  <span class="pg-text-muted">{{ sub.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3) 유래와 발전의 역사 -->
      <div class="p-3.5 sm:p-4 rounded-xl border pg-border pg-card-inner space-y-2.5">
        <h5 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-amber-800', 'dark:text-amber-300']">
          <span>🏛️ 유래와 발전의 역사</span>
        </h5>
        <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
          간지(干支)는 고대 중국에서 날짜와 해를 세던 부호로, 은나라 갑골문에도 기록이 남아 있습니다. 음양과 오행의 생각은 『주역』과 『서경』 「홍범」 등 고대 문헌에서 비롯해 한나라 무렵까지 우주와 자연을 설명하는 틀로 체계화되었고, 사람이 태어난 때와 만나면서 사주명리의 바탕이 마련되었습니다.
        </p>
        <div class="space-y-1.5 pt-1 text-[11px] sm:text-xs pg-text-muted leading-relaxed">
          <div class="flex items-start gap-1.5">
            <span class="font-bold shrink-0 pg-text-gold">• 당나라:</span>
            <span>이허중이 태어난 해·달·날의 간지로 사람의 운명을 헤아렸습니다.</span>
          </div>
          <div class="flex items-start gap-1.5">
            <span class="font-bold shrink-0 pg-text-gold">• 오대~송나라 초:</span>
            <span>서자평이 일간을 중심에 두고 시(時)까지 더한 사주팔자(자평명리) 체계를 세웠으며, 『연해자평(淵海子平)』으로 널리 전해졌습니다.</span>
          </div>
          <div class="flex items-start gap-1.5">
            <span class="font-bold shrink-0 pg-text-gold">• 명나라:</span>
            <span>『삼명통회(三命通會)』가 앞선 이론과 여러 해석을 폭넓게 집대성했습니다.</span>
          </div>
          <div class="flex items-start gap-1.5">
            <span class="font-bold shrink-0 pg-text-gold">• 청나라:</span>
            <span>『자평진전(子平眞詮)』이 월지 격국론을 정립하고, 『적천수(滴天髓)』 해설서들을 통해 오행 균형과 억부론이 널리 퍼졌습니다.</span>
          </div>
          <div class="flex items-start gap-1.5">
            <span class="font-bold shrink-0 pg-text-gold">• 우리나라:</span>
            <span>조선 시대 관상감에서 명과학(命課學)을 다루고 과거 시험 과목에도 포함되었으며, 혼례 때 사주단자를 주고받는 풍습으로 일상에 깊이 자리 잡았습니다.</span>
          </div>
        </div>
      </div>

      <!-- 4) 현대에서 사주명리가 주는 5가지 시사점 (아코디언) -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between pb-1">
          <h5 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-amber-800', 'dark:text-amber-300']">
            <span>🌱 현대에서 사주명리가 주는 5가지 시사점</span>
          </h5>
          <span class="text-[11px] pg-text-muted">항목을 누르면 상세 설명이 펼쳐집니다</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="(item, idx) in sajuImplicationItems"
            :key="item.id"
            class="border rounded-xl overflow-hidden transition-all duration-200"
            :class="[
              openImplicationIndex === idx
                ? ['bg-amber-50/70 border-amber-400/60 shadow-2xs', 'dark:bg-amber-950/20 dark:border-amber-500/50']
                : ['border-amber-200/50 hover:border-amber-300 pg-card-inner', 'dark:border-slate-700/70 dark:hover:border-slate-600']
            ]"
          >
            <!-- 아코디언 헤더 버튼 -->
            <button
              type="button"
              @click="toggleImplicationAccordion(idx)"
              class="w-full px-3.5 py-2.5 sm:py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer select-none"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span :class="['font-bold text-xs sm:text-sm truncate text-slate-800', 'dark:text-slate-100']">
                  {{ item.title }}
                </span>
                <span
                  :class="[
                    'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 border bg-amber-500/10 text-amber-800 border-amber-500/20',
                    'dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                  ]"
                >
                  {{ item.badge }}
                </span>
              </div>
              <UIcon
                name="i-heroicons-chevron-down"
                :class="[
                  'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
                  openImplicationIndex === idx ? ['rotate-180 text-amber-600', 'dark:text-amber-400'] : ''
                ]"
              />
            </button>

            <!-- 아코디언 내용 -->
            <div
              v-if="openImplicationIndex === idx"
              :class="['px-3.5 pb-3.5 pt-1 text-xs sm:text-sm border-t border-amber-200/40', 'dark:border-slate-700/60']"
            >
              <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 인연 사주궁합의 원리 컴포넌트 -->
    <div class="pt-4 border-t pg-border">
      <HomeGuidanceMatch />
    </div>

    <!-- 3. AI 운세 해석 -->
    <div class="pt-4 border-t pg-border">
      <h4 class="font-serif-kr font-bold text-base pg-text mb-2.5 flex items-center gap-1.5">
        <span>🤖 AI 사주 & 궁합 해석</span>
      </h4>
      <p class="text-xs sm:text-sm leading-relaxed pg-text-muted">
        명리학의 고전 자료와 정통 60일주 데이터베이스를 바탕으로 AI가 풀이를 만듭니다. 생년월일과 고민을 반영해 고전의 뜻을 오늘의 상황으로 옮겨 드리니, 정해진 결과가 아니라 선택을 돌아보는 거울로 활용해 보세요.<br>모두가 행복한 세상을 바라며...
      </p>
    </div>

    <!-- 4. 바로가기 버튼 링크 -->
    <div class="mt-6 pt-4 border-t pg-border flex flex-wrap justify-center gap-3 text-xs font-medium">
      <NuxtLink
        to="/guide/saju"
        :class="[
          'inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors',
          'text-amber-800',
          'dark:text-[#FFDE9E]'
        ]"
      >
        <UIcon name="i-heroicons-academic-cap" :class="['w-4 h-4', 'text-amber-600', 'dark:text-amber-400']" />
        <span>사주명리학 기초 가이드 문서 ➔</span>
      </NuxtLink>
    </div>
  </div>
</template>
