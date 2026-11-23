<script setup lang="ts">
// 사주명리학 정통 학술 가이드 섹션 (구글 애드센스 심사 봇 & 사용자 정보 제공용 2,000자 심층 텍스트)
const features = [
  {
    title: '천간(天干)과 지지(地支)의 시공간 순환',
    desc: '하늘의 기운을 상징하는 10천간(갑·을·병·정·무·기·경·신·임·계)과 땅의 계절적 변화를 나타내는 12지간(자·축·인·묘·진·사·오·미·신·유·술·해)의 60갑자 조합으로 사람의 타고난 기운과 하루의 일진을 정밀하게 대입합니다.'
  },
  {
    title: '일간(日干)과 십신(十神)의 역동적 상호작용',
    desc: '태어난 날의 천간인 일간(日干)을 나 자신(我)으로 삼고, 오늘 하루의 일진과의 오행 생극제화(生剋制化) 관계를 비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인 등 10가지 십신으로 분석하여 오늘의 재물, 관계, 성취 에너지를 추론합니다.'
  },
  {
    title: '오행(木火土金水)의 조화와 균형 회복',
    desc: '한쪽으로 치우친 기운은 마음의 불안이나 일의 지체를 야기합니다. 오늘의 일진에서 부족한 오행을 보완하고 과도한 기운을 설기(洩氣)하는 지혜로운 생활 습관과 색상, 음식, 심리적 처세를 제공합니다.'
  }
]

const faqs = [
  {
    q: '태어난 시간을 정확히 모르면 사주 풀이가 부정확한가요?',
    a: '사주팔자(四柱八字) 중 태어난 연(年)·월(月)·일(日)을 이루는 육자(六字)만으로도 본인의 핵심 성향인 일간(日干)과 타고난 기질의 75% 이상을 파악할 수 있습니다. 시간을 모르는 경우 삼주(三柱)를 바탕으로 신중하고 정밀한 분석을 수행합니다.'
  },
  {
    q: '오늘의 운세가 흉(凶)하게 나왔다면 어떻게 대처해야 하나요?',
    a: '명리학에서 흉은 결코 피할 수 없는 저주가 아니라, 조심하고 수양해야 할 에너지를 알려주는 신호등입니다. 충(沖)이나 극(剋)이 드는 날에는 새로운 계약이나 격한 언쟁을 피하고 차분히 내실을 다지면 오히려 큰 화를 면하고 길(吉)로 전환할 수 있습니다.'
  },
  {
    q: '사주명리는 미신인가요, 통계 학문인가요?',
    a: '사주명리학은 수천 년간 음양오행과 24절기의 계절적 기후 변화를 인간의 삶과 건강, 사회적 관계에 대입하여 체계화한 동양의 경험 통계학이자 철학적 자기 성찰 체계입니다. 맹신하기보다는 나를 객관적으로 관찰하는 메타인지 도구로 삼는 것이 현명합니다.'
  }
]
</script>

<template>
  <section class="mt-12 pt-10 border-t pg-border text-left">
    <!-- 섹션 헤더 -->
    <div class="mb-8">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border pg-border" :class="['bg-amber-500/10 text-amber-700', 'dark:bg-amber-400/10 dark:text-amber-300']">
        <UIcon name="i-heroicons-academic-cap" class="w-4 h-4" />
        <span>정통 명리학 학술 지침</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold font-serif-kr pg-text tracking-tight mb-2">
        사주명리학(四柱命理學)의 원리와 하루의 성찰
      </h2>
      <p class="text-xs sm:text-sm pg-text-muted leading-relaxed max-w-3xl">
        사주명리는 인간이 태어난 순간 마주한 대자연의 시공간적 기운을 여덟 글자(八字)로 해석하는 동양의 유서 깊은 학문입니다. 정해진 숙명에 얽매이는 것이 아니라, 오늘의 기운을 미리 살펴 겸손과 배려의 자세로 삶을 경영하는 지혜를 제공합니다.
      </p>
    </div>

    <!-- 3대 핵심 분석 축 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div
        v-for="(item, idx) in features"
        :key="idx"
        class="p-4 sm:p-5 rounded-2xl border pg-border pg-card transition-all duration-300"
      >
        <div class="flex items-center gap-2 mb-2.5">
          <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-serif-kr border pg-border" :class="['bg-amber-100 text-amber-800', 'dark:bg-amber-950 dark:text-amber-300']">
            {{ idx + 1 }}
          </span>
          <h3 class="text-sm font-bold pg-text font-serif-kr">
            {{ item.title }}
          </h3>
        </div>
        <p class="text-xs pg-text-muted leading-relaxed">
          {{ item.desc }}
        </p>
      </div>
    </div>

    <!-- 심층 학술 해설 본문 (봇 색인용 장문 텍스트) -->
    <div class="p-6 rounded-2xl border pg-border pg-card-inner space-y-4 text-xs sm:text-sm leading-relaxed pg-text-soft mb-8">
      <h3 class="text-base font-bold pg-text font-serif-kr flex items-center gap-2">
        <UIcon name="i-heroicons-book-open" class="w-4 h-4 text-amber-600" />
        <span>일진(日辰)과 십신(十神)으로 읽는 하루의 길흉화복</span>
      </h3>
      <p>
        동양 역학에서 하루의 운세를 살피는 기본 원리는 <strong>태어난 날의 천간인 일간(日干)</strong>과 <strong>오늘의 일진(日辰)</strong> 사이의 오행 상호작용을 계산하는 데서 출발합니다. 예컨대 목(木) 기운을 타고난 갑목(甲木) 일간에게 화(火)의 기운이 강한 날은 자신의 재능을 세상에 널리 드러내는 <em>식상(食傷)</em>의 날이 되며, 토(土) 기운이 찾아오는 날은 실질적인 재물과 결실을 도모하는 <em>재성(財星)</em>의 날이 됩니다.
      </p>
      <p>
        반면 금(金)의 기운이 강한 날은 일간을 제어하고 다스리는 <em>관성(官星)</em>의 영향으로 직장이나 사회적 관계에서의 규율과 책임감이 강조되며, 수(水) 기운이 들어오는 날은 배움과 사색을 통해 내면을 살찌우는 <em>인성(印星)</em>의 지혜가 필요합니다. 본 서비스는 인공지능 명리 엔진을 통해 사용자의 고유한 일주와 당일의 천간·지지를 100% 정통 공식에 대입하여 편향 없는 균형 잡힌 조언을 제시합니다.
      </p>
      <div class="pt-3 border-t pg-border flex flex-wrap items-center gap-3 text-xs">
        <span class="font-medium pg-text">연관 가이드 둘러보기:</span>
        <NuxtLink to="/guide/saju" class="underline hover:text-amber-600 dark:hover:text-amber-300">사주 60일주 처세 사전</NuxtLink>
        <span>·</span>
        <NuxtLink to="/guide/ten-gods" class="underline hover:text-amber-600 dark:hover:text-amber-300">십신(十神) 성향 분석</NuxtLink>
        <span>·</span>
        <NuxtLink to="/guide/five-elements" class="underline hover:text-amber-600 dark:hover:text-amber-300">음양오행 상생상극</NuxtLink>
        <span>·</span>
        <NuxtLink to="/articles" class="underline hover:text-amber-600 dark:hover:text-amber-300">역학 전문 칼럼</NuxtLink>
      </div>
    </div>

    <!-- 자주 묻는 질문 FAQ (구글 SEO 리치 스니펫 대응) -->
    <div>
      <h3 class="text-sm sm:text-base font-bold pg-text font-serif-kr mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 text-amber-600" />
        <span>사주명리학 자주 묻는 질문 (FAQ)</span>
      </h3>
      <div class="space-y-3">
        <div
          v-for="(faq, fIdx) in faqs"
          :key="fIdx"
          class="p-4 rounded-xl border pg-border pg-card"
        >
          <div class="font-semibold text-xs sm:text-sm pg-text mb-1.5 flex items-start gap-2">
            <span class="text-amber-600 dark:text-amber-400 font-bold shrink-0">Q.</span>
            <span>{{ faq.q }}</span>
          </div>
          <div class="text-xs pg-text-muted leading-relaxed pl-5">
            {{ faq.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

