<script setup lang="ts">
/**
 * [Google AdSense 승인 및 검색엔진 SEO 최적화 전용 정통 학술 백과 컴포넌트]
 * 
 * Nuxt UI 스타일의 모던 카드 UI 및 반응형 가독성 최적화 적용:
 * - PC 대형 화면에서 넉넉한 폰트 크기 및 카드 너비 제공
 * - 64괘 및 60일주 텍스트 말줄임(...) 제거 및 100% 완전 노출
 * - 다크모드 Linter 충돌 방지 규격 준수
 */

// 주요 64괘 바로가기 샘플
const featuredHexagrams = [
  { id: 1, name: '중천건 (乾爲天)', desc: '순양(純陽)의 창조력과 강건한 진취성' },
  { id: 2, name: '중지곤 (坤爲地)', desc: '순음(純陰)의 포용과 대지의 수용성' },
  { id: 11, name: '지천태 (地天泰)', desc: '천지가 소통하는 만사형통의 번영' },
  { id: 14, name: '화천대유 (火天大有)', desc: '태양이 하늘 높이 떠올라 만물을 비춤' },
  { id: 63, name: '수화기제 (水火旣濟)', desc: '완성과 안정 속 철저한 수성의 지혜' },
  { id: 64, name: '화수미제 (火水未濟)', desc: '새로운 희망과 끊임없는 순환의 시작' }
]

// 주요 60일주 바로가기 샘플
const featuredIljus = [
  { code: 'gap-ja', name: '갑자(甲子)일주', desc: '한겨울 푸른 지혜를 품은 큰 나무의 기상' },
  { code: 'byeong-in', name: '병인(丙寅)일주', desc: '봄 숲을 비추는 찬란한 태양과 진취적 열정' },
  { code: 'mu-jin', name: '무진(戊辰)일주', desc: '용을 품은 광활한 대지의 묵직한 포용력' },
  { code: 'gyeong-o', name: '경오(庚午)일주', desc: '화려한 불꽃 속에서 제련되는 단단한 원석' },
  { code: 'im-ja', name: '임자(壬子)일주', desc: '깊고 도도하게 흐르는 거대한 물결의 통찰' }
]

// 핵심 명리 및 주역 가이드 링크
const guideLinks = [
  { to: '/guide/saju', title: '사주명리학 입문', badge: '원리와 일간', icon: 'i-heroicons-academic-cap' },
  { to: '/guide/iching', title: '주역 64괘 총론', badge: '괘상과 효사', icon: 'i-heroicons-book-open' },
  { to: '/guide/iching/lessons', title: '주역 64괘 처세 명언', badge: '실전 인생 지침', icon: 'i-heroicons-sparkles' },
  { to: '/guide/ten-gods', title: '십신(十神) 백과', badge: '10대 성향 분석', icon: 'i-heroicons-user-group' },
  { to: '/guide/five-elements', title: '오행 상생상극', badge: '목화토금수 균형', icon: 'i-heroicons-fire' },
  { to: '/guide/stems-branches', title: '간지 60갑자', badge: '10천간 12지간', icon: 'i-heroicons-calendar' },
  { to: '/guide/hexagrams', title: '주역 64괘 색인', badge: '전체 괘 조견표', icon: 'i-heroicons-squares-2x2' },
  { to: '/about', title: '서비스 철학 소개', badge: '天命의 가치관', icon: 'i-heroicons-heart' }
]
</script>

<template>
  <section
    aria-label="동양 역학과 사주명리 정통 백과"
    :class="[
      'mt-10 mb-8 p-5 sm:p-8 lg:p-10 rounded-3xl border transition-colors shadow-sm',
      'bg-slate-50/90 border-slate-200/90',
      'dark:bg-[#101528] dark:border-amber-900/40'
    ]"
  >
    <!-- 1. 섹션 헤더 -->
    <header :class="['pb-5 sm:pb-6 mb-6 sm:mb-8 border-b', 'border-slate-200', 'dark:border-slate-800']">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold pg-card-inner border pg-border pg-text-gold">
          <UIcon name="i-heroicons-academic-cap" class="w-4 h-4" />
          <span>동양 정통 역학(東洋易學) 실전 백과</span>
        </div>
        <span class="text-xs pg-text-muted">학술·철학 공식 해설집</span>
      </div>
      <h2 :class="['text-xl sm:text-2xl md:text-3xl font-serif-kr font-bold tracking-tight', 'text-slate-900', 'dark:text-[#FFDE9E]']">
        사주명리학(四柱命理學)과 주역 64괘(周易)의 심층 원리
      </h2>
      <p :class="['mt-3 text-sm sm:text-base leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
        수천 년간 축적된 동양의 천문학과 자연철학은 단순한 미신이 아닌, 시간의 흐름과 인간의 심리적·사회적 역동을 분석하는 체계적인 학문입니다. 본 서비스가 제공하는 분석 알고리즘의 학문적 근간과 핵심 원리를 상세히 안내합니다.
      </p>
    </header>

    <!-- 2. 본문 2개 컬럼/카드 섹션 (PC에서 넉넉한 폭과 큰 폰트로 가독성 대폭 향상) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 mb-8">
      <!-- 2-1. 사주명리학의 구조 카드 -->
      <article
        :class="[
          'p-5 sm:p-7 rounded-2xl border transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between',
          'bg-white border-slate-200/90 hover:border-amber-400/80',
          'dark:bg-[#151C35] dark:border-slate-800 dark:hover:border-amber-500/50'
        ]"
      >
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <span class="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-xs"></span>
            <h3 :class="['font-serif-kr font-bold text-base sm:text-lg md:text-xl', 'text-slate-900', 'dark:text-amber-200']">
              사주팔자(四柱八字)와 십신(十神) 체계
            </h3>
          </div>
          <div :class="['space-y-4 text-xs sm:text-sm md:text-[15px] leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
            <p>
              사주(四柱)란 사람이 출생한 <strong>연(年)·월(月)·일(日)·시(時)</strong>의 네 기둥을 의미하며, 각 기둥은 하늘의 기운인 10천간(天干)과 땅의 계절적 변화를 담은 12지간(地支)으로 이루어져 총 여덟 글자(八字)가 됩니다.
            </p>
            <ul class="space-y-2.5 pl-1">
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                <span><strong>일간(日干 - 나 자신):</strong> 사주 원국의 중심축으로, 타고난 성품과 정신적 지향점을 상징합니다.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                <span><strong>월지(月支 - 환경과 계절):</strong> 태어난 계절의 기운(조후)과 사회적 활동 무대 및 직업적 격국을 결정합니다.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                <span><strong>십신(十神 - 대인관계):</strong> 일간 기준 오행 생극제화(生剋制化) 관계를 비겁·식상·재성·관성·인성 5대 영역으로 분류합니다.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                <span><strong>대운(大運)과 일진(日辰):</strong> 10년 주기 환경 변화와 하루의 기운이 결합하여 삶의 길흉화복과 심리적 기복을 형성합니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </article>

      <!-- 2-2. 주역 64괘의 원리와 변화 철학 카드 -->
      <article
        :class="[
          'p-5 sm:p-7 rounded-2xl border transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between',
          'bg-white border-slate-200/90 hover:border-purple-400/80',
          'dark:bg-[#151C35] dark:border-slate-800 dark:hover:border-purple-500/50'
        ]"
      >
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <span class="w-3 h-3 rounded-full bg-purple-500 shrink-0 shadow-xs"></span>
            <h3 :class="['font-serif-kr font-bold text-base sm:text-lg md:text-xl', 'text-slate-900', 'dark:text-purple-200']">
              주역(周易) 64괘와 음양(陰陽)의 변역
            </h3>
          </div>
          <div :class="['space-y-4 text-xs sm:text-sm md:text-[15px] leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
            <p>
              주역은 만물의 끊임없는 순환과 변화를 다루는 동양 최고의 경전입니다. 태극에서 시작된 음(-)과 양(+)의 기운이 사상(四象)을 거쳐 <strong>팔괘(건·태·이·진·손·감·간·곤)</strong>를 형성하고, 두 개의 팔괘가 중첩되어 64괘가 완성됩니다.
            </p>
            <ul class="space-y-2.5 pl-1">
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></span>
                <span><strong>본괘(本卦 - 현재의 상태):</strong> 지금 처한 환경의 본질과 나를 둘러싼 구조적 상황을 상징합니다.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></span>
                <span><strong>동효(動爻 - 변화의 임계점):</strong> 6개의 효(爻) 중 에너지가 극에 달해 뒤바뀌려는 핵심 효이자 실천 지침입니다.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></span>
                <span><strong>지괘(之卦/변괘 - 미래의 귀결):</strong> 동효의 변화로 새롭게 탄생하는 괘로, 앞으로 흘러갈 미래 향방을 안내합니다.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0"></span>
                <span><strong>처세의 지혜:</strong> 극에 달하면 반전한다는 물극필반(物極必反)과 궁하면 통한다는 궁즉통(窮則通)의 이치입니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </div>

    <!-- 3. 현대적 재해석과 심리학적 접근 -->
    <div
      :class="[
        'p-5 sm:p-6 lg:p-7 rounded-2xl border mb-8 sm:mb-10 transition-colors',
        'bg-white/80 border-slate-200/90',
        'dark:bg-[#151C35]/90 dark:border-slate-800'
      ]"
    >
      <h3 :class="['font-serif-kr font-bold text-base sm:text-lg mb-2.5 flex items-center gap-2', 'text-slate-900', 'dark:text-[#FFDE9E]']">
        <span class="pg-text-gold">✦</span>
        <span>현대인을 위한 자기 성찰과 메타인지의 도구</span>
      </h3>
      <p :class="['text-xs sm:text-sm md:text-[15px] leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
        스위스의 심리학자 칼 융(Carl G. Jung)은 주역의 점괘가 인간의 무의식과 외적 사건이 의미 있게 연결되는 <strong>동시성(Synchronicity)</strong> 원리를 보여준다고 설명했습니다.
        본 서비스가 제공하는 사주와 주역 분석은 정해진 운명을 맹신하기 위한 것이 아니라, 복잡한 현대 사회의 선택 앞에서 나 자신의 기질을 객관적으로 돌아보고(메타인지), 균형 잡힌 차선의 결정을 내리기 위한 <strong>삶의 쉼표이자 지혜의 나침반</strong>입니다.
      </p>
    </div>

    <!-- 4. 백과 및 상세 가이드 내부 링크 그리드 (Nuxt UI 카드 스타일) -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 :class="['text-sm sm:text-base md:text-lg font-bold font-serif-kr uppercase tracking-wide flex items-center gap-2', 'text-slate-900', 'dark:text-amber-300']">
          <UIcon name="i-heroicons-rectangle-group" class="w-5 h-5 text-amber-500" />
          <span>심층 백과 가이드 전체 둘러보기</span>
        </h3>
        <span class="text-xs pg-text-muted">총 140+ 편의 정통 해설 수록</span>
      </div>

      <!-- 8대 핵심 가이드 카드 그리드 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <NuxtLink
          v-for="item in guideLinks"
          :key="item.to"
          :to="item.to"
          :class="[
            'p-4 rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5',
            'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/20',
            'dark:bg-[#151C35] dark:border-slate-800 dark:hover:border-amber-500/60 dark:hover:bg-[#1A2342]'
          ]"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <div
                :class="[
                  'w-9 h-9 rounded-xl flex items-center justify-center border transition-all group-hover:scale-105',
                  'bg-amber-500/10 text-amber-600 border-amber-500/20 group-hover:bg-amber-500/20',
                  'dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20'
                ]"
              >
                <UIcon :name="item.icon" class="w-5 h-5" />
              </div>
              <UIcon
                name="i-heroicons-arrow-up-right"
                class="w-4 h-4 pg-text-muted group-hover:pg-text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </div>
            <h4 :class="['text-sm sm:text-base font-bold font-serif-kr mb-1 transition-colors', 'text-slate-900 group-hover:text-amber-700', 'dark:text-slate-100 dark:group-hover:text-amber-300']">
              {{ item.title }}
            </h4>
          </div>
          <div class="mt-2.5 pt-2 border-t pg-border flex items-center justify-between">
            <span class="text-xs pg-text-muted font-medium">{{ item.badge }}</span>
            <span class="text-xs pg-text-gold font-bold">읽어보기 →</span>
          </div>
        </NuxtLink>
      </div>

      <!-- 4-1. 대표 괘 및 일주 링크 (글자 짤림 방지 및 넉넉한 2열/3열 그리드) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 pt-4 border-t pg-border">
        <!-- 대표 64괘 카드 컬렉션 -->
        <div :class="['p-4 sm:p-5 rounded-2xl border', 'bg-white/70 border-slate-200/90', 'dark:bg-[#13182E] dark:border-slate-800/80']">
          <div class="flex items-center justify-between mb-3.5 pb-2 border-b pg-border">
            <div class="flex items-center gap-2">
              <span class="text-sm">☯️</span>
              <span class="text-sm sm:text-base font-bold font-serif-kr pg-text-gold">주역 주요 64괘 정밀 해설</span>
            </div>
            <NuxtLink to="/guide/iching" class="text-xs hover:underline pg-text-muted font-medium">전체 64괘 보기 →</NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <NuxtLink
              v-for="hex in featuredHexagrams"
              :key="hex.id"
              :to="`/guide/iching/${hex.id}`"
              :class="[
                'p-3 rounded-xl border text-left transition-all duration-200 group hover:shadow-xs hover:-translate-y-0.5 cursor-pointer',
                'bg-white border-slate-200 hover:bg-amber-50/40 hover:border-amber-300',
                'dark:bg-[#18203D] dark:border-slate-700/60 dark:hover:bg-amber-950/20 dark:hover:border-amber-600/50'
              ]"
            >
              <div :class="['text-xs sm:text-sm font-bold font-serif-kr break-keep', 'text-slate-900 group-hover:text-amber-700', 'dark:text-amber-200 dark:group-hover:text-amber-300']">
                {{ hex.name }}
              </div>
              <div class="text-xs pg-text-muted mt-1 leading-snug break-keep line-clamp-2">
                {{ hex.desc }}
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- 대표 60일주 카드 컬렉션 -->
        <div :class="['p-4 sm:p-5 rounded-2xl border', 'bg-white/70 border-slate-200/90', 'dark:bg-[#13182E] dark:border-slate-800/80']">
          <div class="flex items-center justify-between mb-3.5 pb-2 border-b pg-border">
            <div class="flex items-center gap-2">
              <span class="text-sm">📜</span>
              <span class="text-sm sm:text-base font-bold font-serif-kr pg-text-gold">사주명리 60일주 정통 분석</span>
            </div>
            <NuxtLink to="/guide/saju" class="text-xs hover:underline pg-text-muted font-medium">전체 60일주 보기 →</NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <NuxtLink
              v-for="ilju in featuredIljus"
              :key="ilju.code"
              :to="`/guide/saju/ilju/${ilju.code}`"
              :class="[
                'p-3 rounded-xl border text-left transition-all duration-200 group hover:shadow-xs hover:-translate-y-0.5 cursor-pointer',
                'bg-white border-slate-200 hover:bg-amber-50/40 hover:border-amber-300',
                'dark:bg-[#18203D] dark:border-slate-700/60 dark:hover:bg-amber-950/20 dark:hover:border-amber-600/50'
              ]"
            >
              <div :class="['text-xs sm:text-sm font-bold font-serif-kr break-keep', 'text-slate-900 group-hover:text-amber-700', 'dark:text-amber-200 dark:group-hover:text-amber-300']">
                {{ ilju.name }}
              </div>
              <div class="text-xs pg-text-muted mt-1 leading-snug break-keep line-clamp-2">
                {{ ilju.desc }}
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
