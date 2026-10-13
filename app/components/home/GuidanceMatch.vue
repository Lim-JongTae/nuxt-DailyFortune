<template>
  <div class="space-y-4 pt-2">
    <!-- 헤더 -->
    <div class="flex items-center gap-2 pb-2.5 border-b pg-border">
      <UIcon name="i-heroicons-heart" :class="['w-5 h-5 text-rose-600', 'dark:text-rose-400']" />
      <h4 class="font-serif-kr text-base sm:text-lg font-bold pg-text">
        궁합(宮合)이란 — 역사와 정통 사주명리 원리
      </h4>
    </div>

    <!-- 1. 개요 -->
    <p class="text-xs sm:text-sm leading-relaxed pg-text-muted">
      <strong>궁합(宮合)</strong>은 혼인을 앞둔 두 사람의 사주를 견주어, 서로의 기질과 삶의 흐름이 어떻게 어우러지는지 살펴보는 전통 풍속입니다. 오늘날에는 결혼뿐 아니라 연인, 동료, 가족 사이의 관계를 깊이 이해하고 서로의 다름을 존중하는 지혜로운 참고 자료로 널리 쓰이고 있습니다.
    </p>

    <!-- 2. 역사 2열 카드: 중국에서 시작된 이야기 & 우리나라의 궁합 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
      <div class="p-3.5 sm:p-4 rounded-xl border pg-border pg-card-inner space-y-1.5">
        <h5 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-amber-800', 'dark:text-amber-300']">
          <span>📜 중국에서 시작된 이야기</span>
        </h5>
        <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
          혼인에 앞서 상대의 이름을 묻고 점을 쳐 길흉을 살피는 절차는 고대 중국의 혼례에서 찾을 수 있습니다. 주나라 예법을 기록한 『의례(儀禮)』의 혼례 여섯 절차(六禮)에 신부 쪽의 이름을 묻는 <strong>문명(問名)</strong>, 길한 점괘를 알리는 <strong>납길(納吉)</strong>이 들어 있습니다.<br><br>
          이후 당나라의 이허중이 태어난 해·달·날의 간지로 운명을 헤아렸고, 오대에서 송나라 초기 인물로 전해지는 서자평이 태어난 날의 천간(일간)을 중심으로 태어난 시(時)까지 더한 사주팔자 체계(자평명리)를 세웠다고 전해집니다. 이 체계가 퍼지면서 두 사람의 사주를 맞춰 보는 <strong>합혼(合婚)</strong>의 풍속도 발달했습니다. 중국에서는 주로 합혼이라 불렀고, 궁합이라는 말은 우리나라에서 더 널리 쓰입니다.
        </p>
      </div>

      <div class="p-3.5 sm:p-4 rounded-xl border pg-border pg-card-inner space-y-1.5">
        <h5 :class="['font-bold text-xs sm:text-sm flex items-center gap-1.5 text-rose-800', 'dark:text-rose-300']">
          <span>🇰🇷 우리나라의 궁합 문화</span>
        </h5>
        <p class="text-[11px] sm:text-xs leading-relaxed pg-text-muted">
          조선 시대에는 혼담이 오가면 양가가 신랑의 생년월일시를 정갈하게 적은 <strong>사주단자(四柱單子)</strong>를 주고받고, 궁합을 본 뒤 길일을 택해 혼인 날짜를 정하는 풍습이 이어졌습니다.<br><br>
          궁합은 단순히 길흉을 단정 짓는 것이 아니라, 오랫동안 삶의 큰 결정을 앞두고 서로의 타고난 성정과 복을 깊이 헤아려 보는 지혜로운 문화로 자리해 왔습니다.
        </p>
      </div>
    </div>

    <!-- 3. 핵심 궁합 지표 아코디언 (4대 핵심 지표, 지지삼합, 지지칠충) -->
    <MatchGuideAccordion />

    <!-- 4. 함께 참고하는 고전 & 알아 두세요 박스 -->
    <div class="p-3.5 sm:p-4 rounded-xl border pg-border pg-card-inner space-y-2 my-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-book-open" :class="['w-4 h-4 text-amber-600', 'dark:text-amber-400']" />
        <span class="font-bold text-xs pg-text">함께 참고하는 고전</span>
      </div>
      <p class="text-[11px] sm:text-xs pg-text-muted leading-relaxed">
        『연해자평(淵海子平)』, 『삼명통회(三命通會)』, 『자평진전(子平眞詮)』 등 사주 이론의 바탕이 된 고전의 개념을 참고하여 AI가 풀이를 만듭니다.
      </p>
      <div class="pt-2 border-t pg-border text-[11px] pg-text-muted leading-relaxed">
        <strong>※ 알아 두세요:</strong> 궁합이 좋고 나쁨이 관계의 결과를 정하지는 않습니다. 서로의 다른 점을 이해하는 참고 자료로 활용하시고, 모두가 행복한 세상을 향한 작은 대화의 시작으로 삼아 보세요.<br>
        <span :class="['text-[10px] text-slate-400', 'dark:text-slate-500']">AI가 생성한 해석이며 참고용입니다.</span>
      </div>
    </div>
  </div>
</template>
