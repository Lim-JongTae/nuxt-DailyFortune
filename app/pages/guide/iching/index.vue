<script setup lang="ts">
import { ref, computed } from 'vue'

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/iching`

useSeoMeta({
  title: '주역 64괘 실전 처세 가이드 - 하늘과 땅의 64가지 변화의 지혜',
  description: '주역(周易) 64괘의 역사, 상경과 하경 괘상, 괘사와 384효사(爻辭) 원문의 현대적 의미와 처세 지침을 한눈에 살펴보세요.',
  ogTitle: '주역 64괘 실전 처세 가이드 - 하늘과 땅의 64가지 변화의 지혜',
  ogDescription: '주역(周易) 64괘의 역사, 상경과 하경 괘상, 괘사와 384효사(爻辭) 원문의 현대적 의미와 처세 지침을 한눈에 살펴보세요.',
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image'
})

useHead({
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '주역 64괘 실전 처세 가이드',
        description: '주역 64괘의 괘사, 상전, 384효사 원문 해설 가이드',
        url: pageUrl,
        inLanguage: 'ko-KR'
      })
    }
  ]
})

// 8괘 기호 및 이름 맵
const trigramSymbols: Record<number, { symbol: string; name: string }> = {
  1: { symbol: '☰', name: '건' },
  2: { symbol: '☱', name: '태' },
  3: { symbol: '☲', name: '이' },
  4: { symbol: '☳', name: '진' },
  5: { symbol: '☴', name: '손' },
  6: { symbol: '☵', name: '감' },
  7: { symbol: '☶', name: '간' },
  8: { symbol: '☷', name: '곤' }
}

// 64괘별 [상괘 ID, 하괘 ID] 매핑
const hexagramTrigramIds: Record<number, [number, number]> = {
  1: [1, 1], 2: [8, 8], 3: [6, 4], 4: [7, 6], 5: [6, 1], 6: [1, 6], 7: [8, 6], 8: [6, 8],
  9: [5, 1], 10: [1, 2], 11: [8, 1], 12: [1, 8], 13: [1, 3], 14: [3, 1], 15: [8, 7], 16: [4, 8],
  17: [2, 4], 18: [7, 5], 19: [8, 2], 20: [5, 8], 21: [3, 4], 22: [7, 3], 23: [7, 8], 24: [8, 4],
  25: [1, 4], 26: [7, 1], 27: [7, 4], 28: [2, 5], 29: [6, 6], 30: [3, 3], 31: [2, 7], 32: [4, 5],
  33: [1, 7], 34: [4, 1], 35: [3, 8], 36: [8, 3], 37: [5, 3], 38: [3, 2], 39: [6, 7], 40: [4, 6],
  41: [7, 2], 42: [5, 4], 43: [2, 1], 44: [1, 5], 45: [2, 8], 46: [8, 5], 47: [2, 6], 48: [6, 5],
  49: [2, 3], 50: [3, 5], 51: [4, 4], 52: [7, 7], 53: [5, 7], 54: [4, 2], 55: [4, 3], 56: [3, 7],
  57: [5, 5], 58: [2, 2], 59: [5, 6], 60: [6, 2], 61: [5, 2], 62: [4, 7], 63: [6, 3], 64: [3, 6]
}

// 64괘 정통 목록 데이터 (상경 1~30, 하경 31~64)
const rawHexagramList = [
  { id: 1, nameKorean: '중천건', nameHanji: '乾爲天', desc: '강건함 / 만물의 시작', category: 'upper' },
  { id: 2, nameKorean: '중지곤', nameHanji: '坤爲地', desc: '포용함 / 수용과 순응', category: 'upper' },
  { id: 3, nameKorean: '수뢰준', nameHanji: '水雷屯', desc: '시련의 시작 / 기초 다지기', category: 'upper' },
  { id: 4, nameKorean: '산수몽', nameHanji: '山水蒙', desc: '미숙함 / 배움과 자문', category: 'upper' },
  { id: 5, nameKorean: '수천수', nameHanji: '水天需', desc: '여유로운 기다림 / 때를 도모함', category: 'upper' },
  { id: 6, nameKorean: '천수송', nameHanji: '天水訟', desc: '시비와 다툼 / 타협과 양보', category: 'upper' },
  { id: 7, nameKorean: '지수사', nameHanji: '地水師', desc: '엄중한 결단 / 대중 지휘', category: 'upper' },
  { id: 8, nameKorean: '수지비', nameHanji: '水地比', desc: '조화와 친밀 / 상생과 협력', category: 'upper' },
  { id: 9, nameKorean: '풍천소축', nameHanji: '風天小畜', desc: '소소한 축적 / 조심스러운 준비', category: 'upper' },
  { id: 10, nameKorean: '천택리', nameHanji: '天澤履', desc: '예의범절 / 조심스러운 행보', category: 'upper' },
  { id: 11, nameKorean: '지천태', nameHanji: '地天泰', desc: '태평성대 / 만사 형통', category: 'upper' },
  { id: 12, nameKorean: '천지비', nameHanji: '天地否', desc: '소통 단절 / 자중과 쇄국', category: 'upper' },
  { id: 13, nameKorean: '천화동인', nameHanji: '天火同人', desc: '동료와의 협력 / 위대한 단결', category: 'upper' },
  { id: 14, nameKorean: '화천대유', nameHanji: '火天大有', desc: '크게 소유함 / 풍요의 전성기', category: 'upper' },
  { id: 15, nameKorean: '지산겸', nameHanji: '地山謙', desc: '겸손의 덕 / 자신을 낮춤', category: 'upper' },
  { id: 16, nameKorean: '뇌지예', nameHanji: '雷地豫', desc: '기쁨과 예비 / 즐거운 대비', category: 'upper' },
  { id: 17, nameKorean: '택뢰수', nameHanji: '澤雷隨', desc: '대세 순응 / 순리에 따름', category: 'upper' },
  { id: 18, nameKorean: '산풍고', nameHanji: '山風蠱', desc: '폐단 개혁 / 쇄신과 보수', category: 'upper' },
  { id: 19, nameKorean: '지택림', nameHanji: '地澤臨', desc: '기회의 도래 / 군림과 관용', category: 'upper' },
  { id: 20, nameKorean: '풍지관', nameHanji: '風地觀', desc: '정세 관망 / 성찰과 깊은 관찰', category: 'upper' },
  { id: 21, nameKorean: '화뢰서합', nameHanji: '火雷噬嗑', desc: '장애 단죄 / 결단력과 돌파', category: 'upper' },
  { id: 22, nameKorean: '산화비', nameHanji: '山火賁', desc: '화려한 장식 / 외양의 내실화', category: 'upper' },
  { id: 23, nameKorean: '산지박', nameHanji: '山地剝', desc: '쇠락과 침체 / 은신과 내실', category: 'upper' },
  { id: 24, nameKorean: '지뢰복', nameHanji: '地雷復', desc: '희망의 회복 / 새로운 출발', category: 'upper' },
  { id: 25, nameKorean: '천뢰무망', nameHanji: '天雷無妄', desc: '순리 순응 / 인위적 욕심 비움', category: 'upper' },
  { id: 26, nameKorean: '산천대축', nameHanji: '山天大畜', desc: '역량 비축 / 학문과 힘의 축적', category: 'upper' },
  { id: 27, nameKorean: '산뢰이', nameHanji: '山雷頤', desc: '몸과 마음의 수양 / 언행 자제', category: 'upper' },
  { id: 28, nameKorean: '택풍대과', nameHanji: '澤風大過', desc: '막중한 책임 / 고난 극복', category: 'upper' },
  { id: 29, nameKorean: '중수감', nameHanji: '重水坎', desc: '겹친 험난함 / 자중과 신중', category: 'upper' },
  { id: 30, nameKorean: '중화리', nameHanji: '重火離', desc: '타오르는 불길 / 명석함과 안착', category: 'upper' },
  { id: 31, nameKorean: '택산함', nameHanji: '澤山咸', desc: '호감과 만남 / 마음의 교감', category: 'lower' },
  { id: 32, nameKorean: '뇌풍항', nameHanji: '雷風恒', desc: '한결같은 지조 / 지속적인 노력', category: 'lower' },
  { id: 33, nameKorean: '천산둔', nameHanji: '天山遯', desc: '한 걸음 물러섬 / 양보와 피함', category: 'lower' },
  { id: 34, nameKorean: '뇌천대장', nameHanji: '雷天大壯', desc: '장대한 기세 / 경거망동 경계', category: 'lower' },
  { id: 35, nameKorean: '화지진', nameHanji: '火地晉', desc: '솟구치는 기운 / 적극적 전진', category: 'lower' },
  { id: 36, nameKorean: '지화명이', nameHanji: '地火明夷', desc: '빛의 은구 / 어둠 속 인내', category: 'lower' },
  { id: 37, nameKorean: '풍화가인', nameHanji: '風火家人', desc: '가화만사성 / 내부의 안정', category: 'lower' },
  { id: 38, nameKorean: '화택규', nameHanji: '火澤睽', desc: '뜻의 분열 / 대립과 구설 경계', category: 'lower' },
  { id: 39, nameKorean: '수산건', nameHanji: '水山蹇', desc: '얼어붙은 난관 / 멈춤과 지혜', category: 'lower' },
  { id: 40, nameKorean: '뇌수해', nameHanji: '雷水解', desc: '매듭의 풀림 / 해소와 봄날', category: 'lower' },
  { id: 41, nameKorean: '산택손', nameHanji: '山澤損', desc: '절제와 희생 / 덜어내어 채움', category: 'lower' },
  { id: 42, nameKorean: '풍뢰익', nameHanji: '風雷益', desc: '실질적 이득 / 번영과 도약', category: 'lower' },
  { id: 43, nameKorean: '택천쾌', nameHanji: '澤天夬', desc: '결연한 단판 / 단호한 결단', category: 'lower' },
  { id: 44, nameKorean: '천풍구', nameHanji: '天風姤', desc: '예기치 못한 인연 / 뜻밖의 만남', category: 'lower' },
  { id: 45, nameKorean: '택지췌', nameHanji: '澤地萃', desc: '인재와 재물 결집 / 번창함', category: 'lower' },
  { id: 46, nameKorean: '지풍승', nameHanji: '地風升', desc: '싹을 틔우는 상승 / 도약과 성장', category: 'lower' },
  { id: 47, nameKorean: '택수곤', nameHanji: '澤水困', desc: '곤경과 막힘 / 자금/상황 차단', category: 'lower' },
  { id: 48, nameKorean: '수풍정', nameHanji: '水風井', desc: '마르지 않는 샘물 / 지속적 공유', category: 'lower' },
  { id: 49, nameKorean: '택화혁', nameHanji: '澤火革', desc: '판도 개혁 / 체제와 혁신', category: 'lower' },
  { id: 50, nameKorean: '화풍정', nameHanji: '火風鼎', desc: '새로운 안착 / 솥을 거는 번창', category: 'lower' },
  { id: 51, nameKorean: '중뢰진', nameHanji: '重雷震', desc: '두 번의 천둥 / 스스로의 각성', category: 'lower' },
  { id: 52, nameKorean: '중산간', nameHanji: '重山艮', desc: '첩첩산중 / 멈추어 서는 고요', category: 'lower' },
  { id: 53, nameKorean: '풍산점', nameHanji: '風山漸', desc: '점진적 성숙 / 단계별 발전', category: 'lower' },
  { id: 54, nameKorean: '뇌택귀매', nameHanji: '雷澤歸妹', desc: '절차 무시 경계 / 급한 결정 자제', category: 'lower' },
  { id: 55, nameKorean: '뇌화풍', nameHanji: '雷火豊', desc: '최절정의 풍요 / 몰락 그늘 경계', category: 'lower' },
  { id: 56, nameKorean: '화산려', nameHanji: '火山旅', desc: '외로운 나그네 / 겸손한 처신', category: 'lower' },
  { id: 57, nameKorean: '중풍손', nameHanji: '重風巽', desc: '부드러운 유연성 / 침투와 적응', category: 'lower' },
  { id: 58, nameKorean: '중택태', nameHanji: '重澤兌', desc: '즐거운 화합 / 다정한 소통', category: 'lower' },
  { id: 59, nameKorean: '풍수환', nameHanji: '風水渙', desc: '걱정의 산화 / 해묵은 앙금 해소', category: 'lower' },
  { id: 60, nameKorean: '수택절', nameHanji: '水澤節', desc: '적절한 절제 / 규범과 도리', category: 'lower' },
  { id: 61, nameKorean: '풍택중부', nameHanji: '風澤中孚', desc: '맑은 신뢰 / 진심 어린 믿음', category: 'lower' },
  { id: 62, nameKorean: '뇌산소과', nameHanji: '雷山小過', desc: '낮게 내림 / 소소한 과오 넘김', category: 'lower' },
  { id: 63, nameKorean: '수화기제', nameHanji: '水火旣濟', desc: '만사 완성 / 쇠퇴 대비', category: 'lower' },
  { id: 64, nameKorean: '화수미제', nameHanji: '火水未濟', desc: '미완의 상태 / 새로운 도전 희망', category: 'lower' }
]

const hexagramList = rawHexagramList.map(hex => {
  const [uId, lId] = hexagramTrigramIds[hex.id] || [1, 1]
  const upper = trigramSymbols[uId] || { symbol: '☰', name: '건' }
  const lower = trigramSymbols[lId] || { symbol: '☰', name: '건' }
  return {
    ...hex,
    upperSymbol: upper.symbol,
    lowerSymbol: lower.symbol,
    upperName: upper.name,
    lowerName: lower.name
  }
})

const activeTab = ref<'all' | 'upper' | 'lower'>('all')
const searchKeyword = ref('')

const filteredList = computed(() => {
  return hexagramList.filter((hex) => {
    // 탭 필터링
    if (activeTab.value === 'upper' && hex.category !== 'upper') return false
    if (activeTab.value === 'lower' && hex.category !== 'lower') return false

    // 키워드 검색
    if (!searchKeyword.value.trim()) return true
    const q = searchKeyword.value.trim().toLowerCase()
    return (
      hex.nameKorean.toLowerCase().includes(q) ||
      hex.nameHanji.includes(q) ||
      hex.desc.toLowerCase().includes(q) ||
      String(hex.id) === q
    )
  })
})
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-xl mx-auto px-4 py-4 sm:py-6">

      <!-- 상단 헤더 -->
      <div class="flex items-center justify-between pb-3 border-b pg-border mb-4">
        <NuxtLink to="/" class="p-1.5 rounded-full pg-back-btn transition-colors">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="text-center">
          <span class="text-[9px] font-bold tracking-widest pg-text-gold block uppercase">정통 역학 지식</span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            주역 64괘 실전 처세 가이드
          </h1>
        </div>
        <NuxtLink to="/iching" class="p-1.5 rounded-full pg-text-gold hover:opacity-80 transition-opacity">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- 정통 해설 안내 히어로 박스 -->
      <div class="pg-card border rounded-3xl p-5 shadow-xl mb-6 relative overflow-hidden">
        <div class="absolute -right-3 -top-5 pg-watermark-text text-8xl font-serif-kr select-none pointer-events-none opacity-20">
          易
        </div>
        <div class="relative z-10">
          <span class="inline-block px-3 py-1 rounded-full pg-card-inner border pg-border pg-text-gold text-xs font-bold font-serif-kr mb-2">
            ☯️ 동양 최고의 변화 철학서
          </span>
          <h2 class="font-serif-kr text-lg sm:text-xl font-bold pg-text mb-2">
            하늘과 땅이 다스리는 64괘의 이치
          </h2>
          <p class="text-xs pg-text-muted leading-relaxed">
            3천 년 고전 원문 괘사(卦辭)와 384효사(爻辭)의 정통 의미를 탐색해 보세요. 원하시는 괘를 선택하시면 구체적인 괘상 및 처세 조언을 확인하실 수 있습니다.
          </p>

          <!-- 상단 quick 링크 -->
          <div class="mt-4 pt-3 border-t pg-border flex justify-between items-center text-xs">
            <span class="pg-text-soft">오늘 나의 주역 괘가 궁금하시다면?</span>
            <NuxtLink to="/iching" class="pg-text-gold font-bold hover:underline flex items-center gap-1">
              오늘의 주역 점치기 ➔
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 검색 및 카테고리 탭 -->
      <div class="space-y-3 mb-6">
        <!-- 검색 인풋 -->
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="괘 이름, 한자 또는 의미 검색 (예: 중천건, 乾, 산지박)..."
            class="w-full py-3 pl-10 pr-4 rounded-2xl border pg-border pg-card-inner text-xs sm:text-sm pg-text focus:outline-hidden focus:border-(--fortune-gold) transition-colors"
          />
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 pg-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <!-- 탭 카테고리 -->
        <div class="flex gap-2">
          <button
            type="button"
            @click="activeTab = 'all'"
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none"
            :class="activeTab === 'all'
              ? [
                  'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
                  'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
                  'text-amber-950',
                  'border-amber-300',
                  'dark:border-amber-400',
                  'shadow-md font-extrabold'
                ]
              : 'pg-card-inner pg-text-muted pg-border hover:pg-text'"
          >
            전체 64괘 (1~64)
          </button>
          <button
            type="button"
            @click="activeTab = 'upper'"
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none"
            :class="activeTab === 'upper'
              ? [
                  'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
                  'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
                  'text-amber-950',
                  'border-amber-300',
                  'dark:border-amber-400',
                  'shadow-md font-extrabold'
                ]
              : 'pg-card-inner pg-text-muted pg-border hover:pg-text'"
          >
            상경 (1~30괘)
          </button>
          <button
            type="button"
            @click="activeTab = 'lower'"
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none"
            :class="activeTab === 'lower'
              ? [
                  'bg-linear-to-r from-amber-200 via-amber-300 to-yellow-400',
                  'dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500',
                  'text-amber-950',
                  'border-amber-300',
                  'dark:border-amber-400',
                  'shadow-md font-extrabold'
                ]
              : 'pg-card-inner pg-text-muted pg-border hover:pg-text'"
          >
            하경 (31~64괘)
          </button>
        </div>
      </div>

      <!-- 64괘 그리드 목록 -->
      <div v-if="filteredList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NuxtLink
          v-for="hex in filteredList"
          :key="hex.id"
          :to="`/guide/iching/${hex.id}`"
          class="pg-card border rounded-2xl p-4 hover:border-(--fortune-gold) transition-all duration-200 shadow-sm flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full pg-chip pg-text-gold border pg-border">
                제{{ hex.id }}괘
              </span>
              <div
                class="inline-flex flex-col items-center justify-center leading-none select-none group-hover:scale-105 transition-transform -space-y-1 transform scale-x-170 origin-center px-1 bg-clip-text text-transparent font-bold"
                :class="[
                  'bg-linear-to-b from-blue-600 via-teal-600 to-emerald-600',
                  'dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500'
                ]"
              >
                <span class="text-3xl sm:text-4xl leading-none font-serif-kr tracking-tighter" title="상괘">{{ hex.upperSymbol }}</span>
                <span class="text-3xl sm:text-4xl leading-none font-serif-kr tracking-tighter" title="하괘">{{ hex.lowerSymbol }}</span>
              </div>
            </div>

            <h3 class="font-serif-kr text-base font-extrabold pg-text mb-1 group-hover:pg-text-gold transition-colors">
              {{ hex.nameKorean }} <span class="text-xs font-normal opacity-80">({{ hex.nameHanji }})</span>
            </h3>

            <p class="text-xs pg-text-muted font-normal leading-relaxed line-clamp-2">
              {{ hex.desc }}
            </p>
          </div>

          <div class="mt-3 pt-2.5 border-t pg-border flex justify-between items-center text-[11px] pg-text-gold font-medium">
            <span>정통 괘사 및 6효사 보기</span>
            <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

      <!-- 검색 결과 없음 -->
      <div v-else class="pg-card border rounded-2xl p-8 text-center shadow-xs">
        <UIcon name="i-heroicons-exclamation-circle" class="w-8 h-8 pg-text-soft mx-auto mb-2" />
        <p class="text-xs pg-text-muted font-medium">
          검색어와 일치하는 주역 괘를 찾을 수 없습니다.
        </p>
      </div>

    </div>
  </div>
</template>
