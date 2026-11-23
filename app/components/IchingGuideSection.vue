<script setup lang="ts">
// 주역 64괘 정통 학술 가이드 섹션 (구글 애드센스 심사 봇 & 사용자 정보 제공용 2,000자 심층 텍스트)
const features = [
  {
    title: '음양(陰陽)과 8괘(八卦)의 근본 조화',
    desc: '세상의 만물은 양(陽, ⚊)의 굳건함과 음(陰, ⚋)의 유순함이 서로 호응하며 변화합니다. 하늘(건, ☰), 땅(곤, ☷), 우레(진, ☳), 바람(손, ☴), 물(감, ☵), 불(리, ☲), 산(간, ☶), 못(태, ☱)의 8대 자연 원형이 중첩되어 인간 세상의 64가지 국면을 형성합니다.'
  },
  {
    title: '하괘·상괘·동효의 3단계 역동적 발현',
    desc: '본 서비스의 3단계 점대 드로우는 주역 고유의 시초점(筮竹占) 원리를 충실히 계승합니다. 하괘(내면의 기틀)와 상괘(외적 환경)를 차례로 세운 뒤, 현재 가장 역동적으로 변화하는 하나의 변효(動爻)를 포착하여 실질적인 해답을 찾습니다.'
  },
  {
    title: '본괘(本卦)와 지괘(之卦)의 시간적 인과율',
    desc: '본괘는 질문자가 처한 현재의 실상과 내적 환경을 진단하며, 동효가 변화하여 형성되는 지괘(변괘)는 앞으로 나아갈 미래의 귀결과 조심해야 할 방향을 가리킵니다. 이를 통해 과거-현재-미래의 인과 관계를 통찰할 수 있습니다.'
  }
]

const faqs = [
  {
    q: '주역 괘를 뽑을 때 가장 중요한 마음가짐은 무엇인가요?',
    a: '주역 계사전(繫辭傳)에서는 "마음이 정성스러우면 신령함이 통한다(至誠感神)"고 하였습니다. 잡념을 비우고 자신이 진정으로 해결하고자 하는 한 가지 고민에 온전히 집중한 뒤 경건한 마음으로 점대를 선택하는 것이 가장 중요합니다.'
  },
  {
    q: '같은 날 여러 번 점을 쳐도 되나요?',
    a: '주역 몽괘(蒙卦) 괘사에는 "초서고 재삼독(初筮告 再三瀆) 독즉불고(瀆則不告)"라는 엄격한 원칙이 있습니다. 처음 친 점에는 하늘이 응답하지만, 마음에 드는 결과를 얻기 위해 거듭 점을 치는 것은 역(易)을 모독하는 행위이므로 하루에 한 번 진중하게 묻는 것을 권장합니다.'
  },
  {
    q: '어려운 괘(예: 수뢰준, 중수감)가 나오면 어떻게 처세해야 하나요?',
    a: '주역의 모든 괘는 영원한 흉도 영원한 길도 없습니다. 험난한 괘는 경솔한 행동을 멈추고 힘을 기르라는 경책이며, 이 시기를 인내와 지혜로 견뎌내면 반드시 만물이 꽃피는 회복의 괘로 전환됩니다. 위기 속에서 겸손을 배우는 것이 주역의 참된 가르침입니다.'
  }
]
</script>

<template>
  <section class="mt-12 pt-10 border-t pg-border text-left">
    <!-- 섹션 헤더 -->
    <div class="mb-8">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border pg-border" :class="['bg-purple-500/10 text-purple-700', 'dark:bg-purple-400/10 dark:text-purple-300']">
        <UIcon name="i-heroicons-academic-cap" class="w-4 h-4" />
        <span>정통 주역철학 학술 지침</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold font-serif-kr pg-text tracking-tight mb-2">
        주역(周易) 64괘의 변화철학과 오늘의 처세
      </h2>
      <p class="text-xs sm:text-sm pg-text-muted leading-relaxed max-w-3xl">
        주역은 단순한 점술서가 아닌 공자(孔子)가 위편삼절(韋編三絶)하며 주석을 달았던 동양 최고의 철학 고전입니다. 64괘와 384효를 통해 우주 자연의 순환 법칙 속에서 인간이 마땅히 취해야 할 올바른 도리와 지혜를 전합니다.
      </p>
    </div>

    <!-- 3대 핵심 체계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div
        v-for="(item, idx) in features"
        :key="idx"
        class="p-4 sm:p-5 rounded-2xl border pg-border pg-card transition-all duration-300"
      >
        <div class="flex items-center gap-2 mb-2.5">
          <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-serif-kr border pg-border" :class="['bg-purple-100 text-purple-800', 'dark:bg-purple-950 dark:text-purple-300']">
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
        <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-purple-600" />
        <span>동효(動爻)의 변역(變易)과 피흉추길(避凶趨吉)의 원리</span>
      </h3>
      <p>
        주역 철학의 핵심은 모든 상황이 고정되어 있지 않고 끊임없이 순환하고 변화한다는 <strong>변역(變易)</strong>의 이치에 있습니다. 음이 극에 달하면 양이 생겨나고, 양이 성대해지면 음이 자라납니다. 따라서 괘를 뽑아 현재의 형세를 마주했을 때, 가장 주목해야 할 지점은 바로 한 순간의 기운이 뒤집히는 <strong>동효(動爻)</strong>입니다.
      </p>
      <p>
        초효부터 상효까지 6단계의 효는 한 사안이 시작되어 성숙하고 종결되는 시간적·지위적 단계를 상징합니다. 초효에서는 잠룡(潛龍)처럼 역량을 비축해야 하며, 구오(九五)에서는 비룡(飛龍)처럼 중정(中正)의 리더십을 발휘해야 합니다. 본 주역 엔진은 고전 원문을 충실히 인용하여 현재 질문자가 마주한 상황에 가장 적확한 실전 행동 강령을 제시합니다.
      </p>
      <div class="pt-3 border-t pg-border flex flex-wrap items-center gap-3 text-xs">
        <span class="font-medium pg-text">연관 백과 둘러보기:</span>
        <NuxtLink to="/guide/iching" class="underline hover:text-purple-600 dark:hover:text-purple-300">주역 64괘 심층 백과</NuxtLink>
        <span>·</span>
        <NuxtLink to="/guide/iching/lessons" class="underline hover:text-purple-600 dark:hover:text-purple-300">주역 64괘 처세 명언집</NuxtLink>
        <span>·</span>
        <NuxtLink to="/guide/hexagrams" class="underline hover:text-purple-600 dark:hover:text-purple-300">괘상 구조와 8괘 해설</NuxtLink>
        <span>·</span>
        <NuxtLink to="/articles" class="underline hover:text-purple-600 dark:hover:text-purple-300">주역 심법과 처세 칼럼</NuxtLink>
      </div>
    </div>

    <!-- 자주 묻는 질문 FAQ (구글 SEO 리치 스니펫 대응) -->
    <div>
      <h3 class="text-sm sm:text-base font-bold pg-text font-serif-kr mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 text-purple-600" />
        <span>주역 비결 자주 묻는 질문 (FAQ)</span>
      </h3>
      <div class="space-y-3">
        <div
          v-for="(faq, fIdx) in faqs"
          :key="fIdx"
          class="p-4 rounded-xl border pg-border pg-card"
        >
          <div class="font-semibold text-xs sm:text-sm pg-text mb-1.5 flex items-start gap-2">
            <span class="text-purple-600 dark:text-purple-400 font-bold shrink-0">Q.</span>
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

