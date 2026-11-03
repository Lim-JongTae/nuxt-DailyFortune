<script setup lang="ts">
/**
 * [Google AdSense 승인 및 검색엔진 SEO 최적화 전용 정적 학술 백과 컴포넌트]
 * 
 * 목적:
 * 1. 동양철학(사주명리학, 주역 64괘)의 정통 학술 서술형 텍스트를 제공하여
 *    Google AdSense '가치가 별로 없는 콘텐츠' 문제를 해결합니다.
 * 2. 64괘, 60일주, 십신, 오행 등 내부 주요 가이드로의 풍부한 인덱싱 경로(Internal Links)를 형성합니다.
 * 
 * [승인 후 제거 방법 안내]:
 * 구글 애드센스 승인이 완료된 후 사이트를 더 간결하게 운영하고 싶으실 경우,
 * 각 페이지(index.vue, saju.vue, iching.vue)에서
 * `<AdsenseVerificationSection />` 한 줄만 주석 처리하거나 삭제하시면 완전히 제거됩니다.
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
      'mt-12 mb-8 p-6 sm:p-10 rounded-2xl border transition-colors shadow-xs',
      'bg-slate-50/70 border-slate-200/80',
      'dark:bg-[#11162A] dark:border-amber-900/30'
    ]"
  >
    <!-- 1. 섹션 헤더 -->
    <header :class="['pb-5 mb-6 border-b', 'border-slate-200', 'dark:border-slate-800']">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold pg-card-inner border pg-border pg-text-gold">
          <UIcon name="i-heroicons-academic-cap" class="w-4 h-4" />
          <span>동양 정통 역학(東洋易學) 실전 백과</span>
        </div>
        <span class="text-[11px] pg-text-muted">학술·철학 공식 안내서</span>
      </div>
      <h2 :class="['text-lg sm:text-2xl font-serif-kr font-bold tracking-tight', 'text-slate-900', 'dark:text-[#FFDE9E]']">
        사주명리학(四柱命理學)과 주역 64괘(周易)의 심층 원리
      </h2>
      <p :class="['mt-2 text-xs sm:text-sm leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
        수천 년간 축적된 동양의 천문학과 자연철학은 단순한 미신이 아닌, 시간의 흐름과 인간의 심리적·사회적 역동을 분석하는 체계적인 학문입니다. 본 서비스가 제공하는 분석 알고리즘의 학문적 근간과 핵심 원리를 상세히 안내합니다.
      </p>
    </header>

    <!-- 2. 본문 3개 컬럼/카드 섹션 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- 2-1. 사주명리학의 구조 -->
      <article :class="['p-5 rounded-xl border', 'bg-white border-slate-200', 'dark:bg-[#161D36] dark:border-slate-800']">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          <h3 :class="['font-serif-kr font-bold text-sm sm:text-base', 'text-slate-900', 'dark:text-amber-200']">
            사주팔자(四柱八字)와 십신(十神) 체계
          </h3>
        </div>
        <div :class="['space-y-3 text-xs sm:text-sm leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
          <p>
            사주(四柱)란 사람이 출생한 <strong>연(年)·월(月)·일(日)·시(時)</strong>의 네 기둥을 의미하며, 각 기둥은 하늘의 기운인 10천간(天干)과 땅의 계절적 변화를 담은 12지간(地支)으로 이루어져 총 여덟 글자(八字)가 됩니다.
          </p>
          <ul class="list-disc pl-4 space-y-1.5 text-xs">
            <li>
              <strong>일간(日干 - 나 자신):</strong> 사주 원국의 중심축으로, 타고난 성품과 정신적 지향점을 상징합니다.
            </li>
            <li>
              <strong>월지(月支 - 환경과 계절):</strong> 태어난 계절의 기운(조후)과 사회적 활동 무대 및 직업적 격국을 결정합니다.
            </li>
            <li>
              <strong>십신(十神 - 대인관계와 사회적 에너지):</strong> 일간을 기준으로 다른 글자들과의 오행 생극제화(生剋制化) 관계를 비겁·식상·재성·관성·인성의 5대 영역, 10가지 상호작용으로 분류합니다.
            </li>
            <li>
              <strong>대운(大運)과 일진(日辰):</strong> 10년 주기의 환경 변화(대운)와 하루의 기운(일진)이 결합하여 일상의 길흉화복과 심리적 기복을 형성합니다.
            </li>
          </ul>
        </div>
      </article>

      <!-- 2-2. 주역 64괘의 원리와 변화 철학 -->
      <article :class="['p-5 rounded-xl border', 'bg-white border-slate-200', 'dark:bg-[#161D36] dark:border-slate-800']">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
          <h3 :class="['font-serif-kr font-bold text-sm sm:text-base', 'text-slate-900', 'dark:text-purple-200']">
            주역(周易) 64괘와 음양(陰陽)의 변역
          </h3>
        </div>
        <div :class="['space-y-3 text-xs sm:text-sm leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
          <p>
            주역은 만물의 끊임없는 순환과 변화를 다루는 동양 최고의 경전입니다. 태극에서 시작된 음(-)과 양(+)의 기운이 사상(四象)을 거쳐 <strong>팔괘(건·태·이·진·손·감·간·곤)</strong>를 형성하고, 두 개의 팔괘가 중첩되어 64괘가 완성됩니다.
          </p>
          <ul class="list-disc pl-4 space-y-1.5 text-xs">
            <li>
              <strong>본괘(本卦 - 현재의 상태):</strong> 지금 처한 환경의 본질과 나를 둘러싼 구조적 상황을 상징합니다.
            </li>
            <li>
              <strong>동효(動爻 - 변화의 임계점):</strong> 6개의 효(爻) 중 에너지가 극에 달해 뒤바뀌려는 핵심 효로서, 현재 가장 주의하거나 실천해야 할 행동 지침을 제시합니다.
            </li>
            <li>
              <strong>지괘(之卦/변괘 - 미래의 귀결):</strong> 동효의 변화로 인해 새롭게 탄생하는 괘로, 앞으로 흘러갈 미래의 향방과 대처 방향을 안내합니다.
            </li>
            <li>
              <strong>처세의 지혜:</strong> 극에 달하면 반드시 반전한다는 물극필반(物極必反)과 궁하면 통한다는 궁즉통(窮則通)의 원리를 일깨워줍니다.
            </li>
          </ul>
        </div>
      </article>
    </div>

    <!-- 3. 현대적 재해석과 심리학적 접근 -->
    <div :class="['p-5 rounded-xl border mb-8', 'bg-white/80 border-slate-200', 'dark:bg-[#161D36]/80 dark:border-slate-800']">
      <h3 :class="['font-serif-kr font-bold text-sm sm:text-base mb-2', 'text-slate-900', 'dark:text-[#FFDE9E]']">
        ✦ 현대인을 위한 자기 성찰과 메타인지의 도구
      </h3>
      <p :class="['text-xs sm:text-sm leading-relaxed', 'text-slate-600', 'dark:text-slate-300']">
        스위스의 심리학자 칼 융(Carl G. Jung)은 주역의 점괘가 인간의 무의식과 외적 사건이 의미 있게 연결되는 **동시성(Synchronicity)** 원리를 보여준다고 설명했습니다.
        본 서비스가 제공하는 사주와 주역 분석은 정해진 운명을 맹신하기 위한 것이 아니라, 복잡한 현대 사회의 선택 앞에서 나 자신의 기질을 객관적으로 돌아보고(메타인지), 균형 잡힌 차선의 결정을 내리기 위한 <strong>삶의 쉼표이자 지혜의 나침반</strong>입니다.
      </p>
    </div>

    <!-- 4. 백과 및 상세 가이드 내부 링크 그리드 (검색엔진 인덱싱 극대화) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 :class="['text-xs sm:text-sm font-bold font-serif-kr uppercase tracking-wider', 'text-slate-900', 'dark:text-amber-300']">
          📚 심층 백과 가이드 전체 둘러보기
        </h3>
        <span class="text-[11px] pg-text-muted">총 140+ 편의 정통 해설 수록</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <NuxtLink
          v-for="item in guideLinks"
          :key="item.to"
          :to="item.to"
          :class="[
            'p-3 rounded-xl border transition-all text-left flex flex-col justify-between group',
            'bg-white border-slate-200 hover:border-amber-400 hover:shadow-xs',
            'dark:bg-[#161D36] dark:border-slate-800 dark:hover:border-amber-600/60'
          ]"
        >
          <div class="flex items-center gap-1.5 mb-1.5">
            <UIcon :name="item.icon" class="w-4 h-4 pg-text-gold group-hover:scale-110 transition-transform" />
            <span :class="['text-xs font-bold transition-colors', 'text-slate-800 group-hover:text-amber-700', 'dark:text-slate-200 dark:group-hover:text-amber-300']">
              {{ item.title }}
            </span>
          </div>
          <span class="text-[10px] pg-text-muted">{{ item.badge }} ➔</span>
        </NuxtLink>
      </div>

      <!-- 4-1. 대표 괘 및 일주 링크 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t pg-border">
        <!-- 대표 64괘 -->
        <div :class="['p-3.5 rounded-xl border', 'bg-slate-50/50 border-slate-200/70', 'dark:bg-[#141A30] dark:border-slate-800/80']">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold font-serif-kr pg-text-gold">✦ 주역 주요 64괘 정밀 해설</span>
            <NuxtLink to="/guide/iching" class="text-[11px] hover:underline pg-text-muted">전체 64괘 보기</NuxtLink>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <NuxtLink
              v-for="hex in featuredHexagrams"
              :key="hex.id"
              :to="`/guide/iching/${hex.id}`"
              :class="[
                'p-1.5 px-2 rounded-lg border text-left transition-colors',
                'bg-white border-slate-200/80 hover:bg-amber-50/50 hover:border-amber-300',
                'dark:bg-[#1A213D] dark:border-slate-700/60 dark:hover:bg-amber-950/30 dark:hover:border-amber-700/50'
              ]"
            >
              <div :class="['text-[11px] font-bold font-serif-kr truncate', 'text-slate-800', 'dark:text-amber-200']">
                {{ hex.name }}
              </div>
              <div class="text-[9px] pg-text-muted truncate">{{ hex.desc }}</div>
            </NuxtLink>
          </div>
        </div>

        <!-- 대표 60일주 -->
        <div :class="['p-3.5 rounded-xl border', 'bg-slate-50/50 border-slate-200/70', 'dark:bg-[#141A30] dark:border-slate-800/80']">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold font-serif-kr pg-text-gold">✦ 사주명리 60일주 정통 분석</span>
            <NuxtLink to="/guide/saju" class="text-[11px] hover:underline pg-text-muted">전체 60일주 보기</NuxtLink>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <NuxtLink
              v-for="ilju in featuredIljus"
              :key="ilju.code"
              :to="`/guide/saju/ilju/${ilju.code}`"
              :class="[
                'p-1.5 px-2 rounded-lg border text-left transition-colors',
                'bg-white border-slate-200/80 hover:bg-amber-50/50 hover:border-amber-300',
                'dark:bg-[#1A213D] dark:border-slate-700/60 dark:hover:bg-amber-950/30 dark:hover:border-amber-700/50'
              ]"
            >
              <div :class="['text-[11px] font-bold font-serif-kr truncate', 'text-slate-800', 'dark:text-amber-200']">
                {{ ilju.name }}
              </div>
              <div class="text-[9px] pg-text-muted truncate">{{ ilju.desc }}</div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

