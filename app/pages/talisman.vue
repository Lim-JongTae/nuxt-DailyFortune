<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHead, useRouter, useToast } from '#imports'
import { storeToRefs } from 'pinia'
import { useFortuneStore } from '~/stores/fortune'
import { getGanzhiOfDay } from '~/utils/saju'
import type { TalismanCategory } from '~/components/TalismanCanvas.vue'

useHead({
  title: '오늘의 사주 맞춤 부적 | sajuapp.co.kr',
  meta: [
    { name: 'description', content: '사주명리 일진과 오행 기운을 분석하여 오늘 당신에게 발급된 단 하나의 맞춤 행운 디지털 부적입니다.' }
  ]
})

const isFaqOpen = ref(false)
const store = useFortuneStore()
const { sajuResult } = storeToRefs(store)
const router = useRouter()
const toast = useToast()

const handleTalismanDownloaded = () => {
  store.recordTalismanDownloaded()
  toast.clear()
  toast.add({
    title: '✨ 맞춤 부적 저장 완료',
    description: '오늘의 사주 맞춤 부적이 잘 저장되었습니다. 사주 운세 페이지로 이동합니다.',
    icon: 'i-heroicons-check-circle',
    color: 'success',
    duration: 3500
  })
  setTimeout(() => {
    router.push('/saju')
  }, 1200)
}

onMounted(() => {
  store.loadFromLocalStorage()
})

const getKstTodayStr = (): string => {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())
}

const todayDateStr = getKstTodayStr()
const todayDefaultGanzhi = computed(() => getGanzhiOfDay(todayDateStr).fullName)

// 사주 결과 존재 여부
const hasSajuResult = computed(() => !!sajuResult.value && !!sajuResult.value.userSaju)

// 오늘 일진
const currentDayIlju = computed(() => {
  if (hasSajuResult.value && sajuResult.value?.todaySaju?.ganzhi) {
    return sajuResult.value.todaySaju.ganzhi
  }
  return todayDefaultGanzhi.value
})

// 내 일간
const userIlgan = computed(() => {
  if (hasSajuResult.value && sajuResult.value?.userSaju?.ilgan) {
    return sajuResult.value.userSaju.ilgan
  }
  return ''
})

// 오늘 십신
const todayShipsin = computed(() => {
  if (hasSajuResult.value && sajuResult.value?.todaySaju?.shipsin) {
    return sajuResult.value.todaySaju.shipsin
  }
  return ''
})

const categories: Array<{ id: TalismanCategory; label: string; icon: string; title: string }> = [
  { id: 'wealth', label: '재물부', icon: '🟡', title: '財運大吉' },
  { id: 'love', label: '애정부', icon: '🔴', title: '佳緣滿開' },
  { id: 'health', label: '건강/학업부', icon: '🟢', title: '身心安泰' },
  { id: 'business', label: '사업/성공부', icon: '🔵', title: '官運亨通' }
]

// 사주점 분석 결과에 따른 자동 발급 카테고리 결정 (Read-Only)
const generatedCategory = computed<TalismanCategory>(() => {
  if (hasSajuResult.value && sajuResult.value) {
    const cats = sajuResult.value.parsedData?.categories
    if (cats) {
      let bestCat: TalismanCategory = 'wealth'
      let maxScore = -1
      for (const k of ['wealth', 'love', 'health', 'business'] as TalismanCategory[]) {
        if (cats[k] && typeof cats[k].score === 'number' && cats[k].score > maxScore) {
          maxScore = cats[k].score
          bestCat = k
        }
      }
      return bestCat
    }

    // 십신 기운별 자동 보정
    const shipsin = todayShipsin.value
    if (shipsin.includes('재')) return 'wealth'
    if (shipsin.includes('관') || shipsin.includes('비')) return 'business'
    if (shipsin.includes('식') || shipsin.includes('상')) return 'love'
    if (shipsin.includes('인')) return 'health'
  }
  return 'wealth'
})

const activeCategoryInfo = computed(() => {
  return categories.find(c => c.id === generatedCategory.value) ?? categories[0] ?? { id: 'wealth', label: '재물부', icon: '🟡', title: '財運大吉' }
})

// 일진 및 사주 분석 요약 문구
const sajuSummaryText = computed(() => {
  if (hasSajuResult.value && sajuResult.value) {
    const user = sajuResult.value.userSaju
    const today = sajuResult.value.todaySaju
    const categoriesData = sajuResult.value.parsedData?.categories

    let base = `오늘 내 일간(${user?.ilgan})과 오늘 일진(${today?.ganzhi}, ${today?.shipsin}) 기운을 정밀 분석하여 [${activeCategoryInfo.value.label}] 부적이 자동 발급되었습니다.`

    const catKey = generatedCategory.value as keyof typeof categoriesData
    if (categoriesData && categoriesData[catKey]?.summary) {
      base += ` ${categoriesData[catKey]?.summary}`
    }
    return base
  }
  return `오늘 ${todayDefaultGanzhi.value}일의 일진 기운을 담아 액운을 차단하고 행운을 북돋아 주는 맞춤 부적입니다.`
})

// 축원 문구 자동 계산 (부적 중앙 캘리그라피 하단)
const customWish = computed(() => {
  const cat = generatedCategory.value
  if (hasSajuResult.value && userIlgan.value) {
    const ilgan = userIlgan.value
    const ilju = currentDayIlju.value
    switch (cat) {
      case 'wealth':
        return `${ilgan}일간 ${ilju}일, 황금 재운이 차고 넘쳐 대길함을 祈願`
      case 'love':
        return `${ilgan}일간 ${ilju}일, 아름다운 인연과 사랑의 조화를 祈願`
      case 'health':
        return `${ilgan}일간 ${ilju}일, 신체 무병안태와 지혜로운 기운을 祈願`
      case 'business':
        return `${ilgan}일간 ${ilju}일, 만사 형통과 입신양명의 대성을 祈願`
    }
  }
  const ilju = currentDayIlju.value
  switch (cat) {
    case 'wealth':
      return `${ilju}일, 황금 재운이 차고 넘쳐 대길함을 祈願`
    case 'love':
      return `${ilju}일, 아름다운 인연과 사랑의 조화를 祈願`
    case 'health':
      return `${ilju}일, 신체 무병안태와 지혜로운 기운을 祈願`
    case 'business':
      return `${ilju}일, 만사 형통과 입신양명의 대성을 祈願`
  }
  return `${ilju}일, 대길함을 祈願`
})

const generatedTalismanData = computed(() => ({
  category: generatedCategory.value,
  dayIlju: currentDayIlju.value,
  fourCharTitle: activeCategoryInfo.value.title,
  customWish: customWish.value
}))
</script>

<template>
  <div class="pg-bg min-h-screen py-10 px-4 font-serif-kr transition-colors duration-300 pb-24">
    <div class="max-w-2xl mx-auto text-center mb-8">
      <div :class="['inline-block px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold mb-3 text-amber-900', 'dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-500/30']">
        ✦ 사주명리 1일 1회 맞춤 디지털 부적 ✦
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold pg-text mb-2 tracking-tight">
        오늘의 사주 맞춤 부적
      </h1>
      <p class="text-xs pg-text-muted">
        당신의 오늘 사주 일진과 십신 기운 분석을 바탕으로 발급된 단 하나의 전용 부적입니다.
      </p>
    </div>

    <!-- 1. 사주 분석 및 자동 발급 안내 카드 -->
    <div class="max-w-md mx-auto pg-card border pg-border rounded-2xl p-5 mb-6 backdrop-blur-md shadow-xl">
      <div v-if="hasSajuResult" class="space-y-3">
        <div class="flex justify-between items-center pg-text font-bold text-xs pb-2 border-b pg-border">
          <span class="flex items-center gap-1.5">
            <span :class="['text-amber-600', 'dark:text-emerald-400']">🔮</span>
            <span>내 사주 일진 연동 발급 완료</span>
          </span>
          <span :class="['text-xs font-bold text-amber-900', 'dark:text-emerald-300']">
            {{ userIlgan }}日干 · {{ currentDayIlju }}日 ({{ todayShipsin }})
          </span>
        </div>
        <p class="pg-text-muted text-xs leading-relaxed">
          {{ sajuSummaryText }}
        </p>
      </div>

      <div v-else class="space-y-3">
        <div class="flex justify-between items-center pg-text font-bold text-xs pb-2 border-b pg-border">
          <span class="flex items-center gap-1.5">
            <span :class="['text-amber-600', 'dark:text-emerald-400']">🔮</span>
            <span>오늘 일진 기운 안내</span>
          </span>
          <span :class="['text-xs font-bold text-amber-700', 'dark:text-emerald-300']">
            {{ currentDayIlju }}日
          </span>
        </div>
        <p class="pg-text-muted text-xs leading-relaxed">
          {{ sajuSummaryText }}
        </p>
        <div class="pt-2 flex justify-center">
          <NuxtLink
            to="/saju"
            :class="['inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md', 'bg-linear-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] text-[#0F1226] hover:brightness-110 active:scale-95']"
          >
            <span>📜 오늘의 사주 정밀 분석받기</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 2. 4대 운세 상태 지표 (Read-Only: 자동 발급된 운세만 하이라이트) -->
    <div class="max-w-md mx-auto mb-6">
      <div class="text-center mb-2">
        <span :class="['text-[11px] font-bold text-amber-950', 'dark:text-emerald-300']">
          ✨ 오늘 당신에게 발급된 부적: <span :class="['underline underline-offset-4 font-extrabold decoration-amber-500', 'dark:decoration-emerald-400']">{{ activeCategoryInfo.label }}</span>
        </span>
      </div>
      <div class="grid grid-cols-4 gap-1.5 pg-card p-1.5 rounded-xl border pg-border select-none">
        <div
          v-for="cat in categories"
          :key="cat.id"
          :class="[
            'py-2.5 px-1 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all pointer-events-none',
            generatedCategory === cat.id
              ? ['bg-amber-500/25 border-2 border-amber-500 text-amber-950 font-black shadow-md ring-1 ring-amber-400/50', 'dark:bg-emerald-950/50 dark:border-emerald-400 dark:text-emerald-300 dark:ring-emerald-400/50']
              : ['pg-card-deep border pg-border text-slate-800 font-semibold opacity-85', 'dark:text-slate-200']
          ]"
        >
          <span>{{ cat.icon }}</span>
          <span class="text-[11px]">{{ cat.label }}</span>
        </div>
      </div>
    </div>

    <!-- 3. Q&A 아코디언 심리학 도움말 컴포넌트 -->
    <div class="max-w-md mx-auto mb-5">
      <div class="pg-card border pg-border rounded-xl overflow-hidden shadow-xs">
        <button
          type="button"
          @click="isFaqOpen = !isFaqOpen"
          :class="['w-full py-2.5 px-3.5 flex items-center justify-between text-xs font-bold transition-colors cursor-pointer select-none text-amber-950 hover:bg-amber-500/5', 'dark:text-emerald-300 dark:hover:bg-emerald-500/5']"
        >
          <span class="flex items-center gap-1.5 font-extrabold">
            <span :class="['text-amber-600', 'dark:text-emerald-400']">❓</span>
            <span>Q. 부적이 진짜 효과가 있나요?</span>
          </span>
          <UIcon
            name="i-heroicons-chevron-down"
            class="w-4 h-4 pg-text-muted transition-transform duration-300"
            :class="isFaqOpen ? 'rotate-180' : ''"
          />
        </button>

        <div
          v-show="isFaqOpen"
          :class="['px-4 py-3.5 border-t pg-border pg-card-deep text-xs leading-relaxed space-y-2 transition-all duration-300 text-slate-800', 'dark:text-slate-200']"
        >
          <p :class="['font-bold text-amber-950', 'dark:text-emerald-300']">
            A. 솔직히 말씀드리면, 저희도 확답은 못 드려요.
          </p>
          <p :class="['text-slate-700', 'dark:text-slate-300']">
            다만 &quot;오늘 좋은 기운이 나에게 온다&quot;고 믿고 하루를 시작하는 것만으로도 실제로 좋은 선택을 하게 된다는 심리학 연구는 꽤 많습니다.
          </p>
          <p :class="['font-bold pt-2 border-t pg-border text-amber-900', 'dark:text-emerald-300']">
            부적은 그 '믿음의 스위치'를 눌러주는 작은 도구일 뿐이에요.
          </p>
        </div>
      </div>
    </div>

    <!-- 4. 사주 연동 자동 생성 캔버스 부적 컴포넌트 -->
    <div class="max-w-md mx-auto transition-all duration-500 animate-fade-in">
      <!-- 4색 레이어 및 사주 문구 합성 캔버스 부적 컴포넌트 -->
      <TalismanCanvas :talisman-data="generatedTalismanData" @download="handleTalismanDownloaded" />
    </div>

    <!-- 5. 사주 운세 페이지 돌아가기 하단 버튼 -->
    <div class="max-w-md mx-auto mt-6 pb-8 text-center animate-fade-in">
      <NuxtLink
        to="/saju"
        :class="[
          'w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border',
          'bg-amber-500/10 border-amber-500/30 text-amber-950 hover:bg-amber-500/20 active:scale-95',
          'dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/20'
        ]"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        <span>🔮 돌아가기</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
