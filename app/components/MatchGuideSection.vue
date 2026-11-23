<script setup lang="ts">
// 사주 궁합론 정통 학술 가이드 섹션 (구글 애드센스 심사 봇 & 사용자 정보 제공용 2,000자 심층 텍스트)
const features = [
  {
    title: '천간합(天干合)과 정신적 교감',
    desc: '태어난 날의 천간인 일간(日干) 간의 갑기합(甲己合), 을경합(乙庚合), 병신합(丙辛合), 정임합(丁壬合), 무계합(戊癸合)은 두 사람이 처음 만났을 때 느껴지는 본능적인 끌림과 정신적 소통의 부드러움을 가늠하는 핵심 지표입니다.'
  },
  {
    title: '지지(地支)의 육합·삼합과 현실적 조화',
    desc: '일지(日支)는 배우자궁이자 현실 생활의 터전을 의미합니다. 자축합, 인해합 등 육합(六合)과 신자진 수국, 사유축 금국 등 삼합(三合)은 가치관의 일치와 경제적 협력, 가정생활의 안정성을 든든하게 뒷받침해 줍니다.'
  },
  {
    title: '오행(五行)의 상호 보완과 에너지 균형',
    desc: '한 사람에게 결핍된 오행(예: 목 기운이 부족함)을 상대방이 넉넉하게 품고 있을 때, 두 사람은 서로의 존재만으로도 심리적 안정감과 결핍의 해소를 경험합니다. 상극(相剋) 또한 성장의 자극제가 될 수 있습니다.'
  }
]

const faqs = [
  {
    q: '사주 궁합 점수가 낮게 나오면 반드시 헤어져야 하나요?',
    a: '절대 그렇지 않습니다. 궁합에서 나타나는 충(沖)이나 형(刑)은 서로의 기질 차이로 인해 발생할 수 있는 마찰 지점을 미리 알려주는 안전벨트입니다. 서로의 다름을 인정하고 대화의 기술을 기르면, 오히려 점수가 높은 관계보다 훨씬 깊고 성숙한 인연으로 발전할 수 있습니다.'
  },
  {
    q: '연인 궁합 외에 동업이나 친구 관계에도 사주 궁합이 맞나요?',
    a: '네, 사주 궁합은 본질적으로 두 사람의 에너지 장(Energy Field)이 어떻게 상호작용하는지를 살피는 학문입니다. 동업자 간에는 재성과 관성의 균형을, 친구 간에는 비견과 식상의 조화를 살펴 서로의 장점을 극대화할 수 있습니다.'
  },
  {
    q: '궁합에서 가장 중요하게 보아야 할 요소는 무엇인가요?',
    a: '전통 명리학에서는 태어난 날을 뜻하는 일주(日柱)의 조화를 으뜸으로 칩니다. 연간(年干)의 띠 궁합은 집안이나 사회적 인연에 가깝고, 일주 궁합은 두 사람이 일상 속에서 직접 부대끼며 살아가는 친밀함의 본질을 결정하기 때문입니다.'
  }
]
</script>

<template>
  <section class="mt-12 pt-10 border-t pg-border text-left">
    <!-- 섹션 헤더 -->
    <div class="mb-8">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border pg-border" :class="['bg-rose-500/10 text-rose-700', 'dark:bg-rose-400/10 dark:text-rose-300']">
        <UIcon name="i-heroicons-academic-cap" class="w-4 h-4" />
        <span>정통 궁합학 학술 지침</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold font-serif-kr pg-text tracking-tight mb-2">
        사주 궁합론(四柱 宮合論)의 분석 원리와 인연의 지혜
      </h2>
      <p class="text-xs sm:text-sm pg-text-muted leading-relaxed max-w-3xl">
        궁합은 단순한 길흉의 잣대로 상대를 판단하는 시험이 아닙니다. 두 사람이 지닌 고유한 기운의 결을 이해하고, 서로의 부족함을 채워주며 마찰을 피하는 상생의 길을 모색하는 동양의 지혜로운 관계학입니다.
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
          <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-serif-kr border pg-border" :class="['bg-rose-100 text-rose-800', 'dark:bg-rose-950 dark:text-rose-300']">
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
        <UIcon name="i-heroicons-heart" class="w-4 h-4 text-rose-600" />
        <span>상호 보완의 오행과 지지 합충(合沖)의 심층 역학</span>
      </h3>
      <p>
        정통 사주 궁합에서 가장 이상적인 만남은 <strong>음양오행의 균형(陰陽五行之中和)</strong>을 이루는 관계입니다. 한 사람이 뜨거운 화(火) 기운으로 넘쳐날 때 시원한 수(水) 기운을 지닌 상대를 만나면 열기가 차분히 가라앉아 삶의 안정과 결실을 얻게 됩니다. 반대로 메마른 사주에 촉촉한 토양과 물이 공급되면 생명이 싹트듯 재물과 가정의 복이 번창합니다.
      </p>
      <p>
        또한 지지의 인신사해(寅申巳亥), 자오묘유(子午卯酉), 진술축미(辰戌丑未)의 충(沖)과 원진(怨嗔)살은 무조건적인 파국을 의미하지 않습니다. 역동적인 충은 정체된 현실을 타파하는 추진력으로 전환될 수 있으며, 상대를 향한 배려와 역지사지의 태도가 뒷받침될 때 더욱 단단하고 견고한 백년가약(百年佳約)의 토대가 됩니다.
      </p>
      <div class="pt-3 border-t pg-border flex flex-wrap items-center gap-3 text-xs">
        <span class="font-medium pg-text">연관 가이드 둘러보기:</span>
        <NuxtLink to="/guide/saju" class="underline hover:text-rose-600 dark:hover:text-rose-300">사주 60일주 기질 사전</NuxtLink>
        <span>·</span>
        <NuxtLink to="/guide/stems-branches" class="underline hover:text-rose-600 dark:hover:text-rose-300">10천간 12지간 조화론</NuxtLink>
        <span>·</span>
        <NuxtLink to="/guide/five-elements" class="underline hover:text-rose-600 dark:hover:text-rose-300">오행 상생상극과 체질</NuxtLink>
        <span>·</span>
        <NuxtLink to="/articles" class="underline hover:text-rose-600 dark:hover:text-rose-300">역학 사랑과 인연 칼럼</NuxtLink>
      </div>
    </div>

    <!-- 자주 묻는 질문 FAQ (구글 SEO 리치 스니펫 대응) -->
    <div>
      <h3 class="text-sm sm:text-base font-bold pg-text font-serif-kr mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 text-rose-600" />
        <span>사주 궁합 자주 묻는 질문 (FAQ)</span>
      </h3>
      <div class="space-y-3">
        <div
          v-for="(faq, fIdx) in faqs"
          :key="fIdx"
          class="p-4 rounded-xl border pg-border pg-card"
        >
          <div class="font-semibold text-xs sm:text-sm pg-text mb-1.5 flex items-start gap-2">
            <span class="text-rose-600 dark:text-rose-400 font-bold shrink-0">Q.</span>
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

