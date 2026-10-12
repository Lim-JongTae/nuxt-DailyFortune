<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide`
const lightImageUrl = 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg'
const darkImageUrl = 'https://res.cloudinary.com/hoopoe/image/upload/v1791720835/Dark_20261011211100_clfi7e.jpg'

// 9:16 비디오 (라이트 / 다크)
const lightVideoUrl = 'https://res.cloudinary.com/hoopoe/video/upload/v1791810935/light_prhxns.mp4'
const darkVideoUrl = 'https://res.cloudinary.com/hoopoe/video/upload/v1791810935/black_vzhg7h.mp4'

const isMuted = ref(true)
const lightVideoRef = ref<HTMLVideoElement | null>(null)
const darkVideoRef = ref<HTMLVideoElement | null>(null)

// Tab state: 'saju' | 'iching'
const activeTab = ref<'saju' | 'iching'>('saju')

// Dark mode detection for tab button styles
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const activeBtnStyle = computed(() => isDark.value
  ? { backgroundImage: 'linear-gradient(to right, #166534, #15803d, #16a34a)', borderColor: '#16a34a', color: '#bbf7d0' }
  : { backgroundImage: 'linear-gradient(to right, #fde68a, #fcd34d, #facc15)', borderColor: '#fcd34d', color: '#451a03' }
)

const inactiveBtnStyle = computed(() => isDark.value
  ? { borderColor: '#16a34a50', color: '#86efac' }
  : { borderColor: '#fcd34d80', color: '#92400e' }
)

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (lightVideoRef.value) {
    lightVideoRef.value.muted = isMuted.value
    if (!isMuted.value) {
      lightVideoRef.value.play().catch(() => {})
    }
  }
  if (darkVideoRef.value) {
    darkVideoRef.value.muted = isMuted.value
    if (!isMuted.value) {
      darkVideoRef.value.play().catch(() => {})
    }
  }
}

definePageMeta({
  sitemap: {
    images: [
      {
        loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
        title: '동양철학 명리 주역 실전 처세 가이드 캘리그라피 서화 대표 이미지'
      },
      {
        loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1791720835/Dark_20261011211100_clfi7e.jpg',
        title: '동양철학 명리 주역 실전 처세 가이드 캘리그라피 서화 대표 이미지 (다크모드)'
      }
    ]
  }
})

useSeoMeta({
  title: '동양철학 명리 & 주역 실전 처세 가이드 - 일일운세 ✦ 天命',
  description: '사주명리학의 10천간, 12지간, 오행, 십신 분석과 주역 64괘의 괘상 원리까지 동양철학의 깊은 지혜를 담은 운세 정보 실전 처세 가이드입니다.',
  ogTitle: '동양철학 명리 & 주역 실전 처세 가이드 | 일일운세 ✦ 天命',
  ogDescription: '사주명리학의 10천간, 12지간, 오행, 십신 분석과 주역 64괘의 괘상 원리까지 동양철학의 깊은 지혜를 담은 운세 정보 실전 처세 가이드입니다.',
  ogUrl: pageUrl,
  ogImage: lightImageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: lightImageUrl
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '동양철학 명리 & 주역 실전 처세 가이드',
        description: '사주명리학과 주역 64괘의 기초 원리와 정통 해석을 다루는 종합 지혜 센터',
        url: pageUrl,
        image: [lightImageUrl, darkImageUrl]
      })
    }
  ]
})
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <div :class="['p-6 sm:p-10 rounded-2xl border shadow-xl backdrop-blur-md', 'bg-white/90 border-amber-200/60', 'dark:bg-[#161B33]/90 dark:border-[#FFDE9E]/20']">
      
      <!-- 상단 타이틀 -->
      <div :class="['text-center mb-10 pb-6 border-b', 'border-amber-200/40', 'dark:border-slate-700/50']">
        <span class="inline-block seal-stamp text-[12px] sm:text-lg px-2.5 py-1 mb-2">東洋哲學 · 處世之智</span>
        <h1 :class="['text-[17px] sm:text-2xl font-serif-kr font-bold', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          사주 60일주와 주역 64괘, 삶의 지혜 가이드
        </h1>
        <p :class="['mt-3 text-sm sm:text-base max-w-2xl mx-auto', 'text-slate-600', 'dark:text-slate-300']">
          사주명리학(四柱命理學)의 일주별 성격·직업·재물운·연애·건강 풀이와 주역(周易)의 괘별 해설을 쉽고 차분하게 풀어 드립니다.
        </p>

        <!-- 대표 서화 9:16 세로 비디오 프레임 (라이트 / 다크 모드 분기 & 사운드 토글) -->
        <div :class="['relative mt-6 max-w-70 sm:max-w-80 aspect-9/16 mx-auto overflow-hidden rounded-2xl border shadow-2xl', 'border-amber-300/60 bg-amber-50/30', 'dark:border-[#FFDE9E]/30 dark:bg-slate-900/60']">
          <!-- 라이트 모드 영상 -->
          <video
            ref="lightVideoRef"
            :src="lightVideoUrl"
            :poster="lightImageUrl"
            autoplay
            loop
            muted
            playsinline
            :class="['w-full h-full object-cover block', 'dark:hidden']"
          />

          <!-- 다크 모드 영상 -->
          <video
            ref="darkVideoRef"
            :src="darkVideoUrl"
            :poster="darkImageUrl"
            autoplay
            loop
            muted
            playsinline
            :class="['w-full h-full object-cover hidden', 'dark:block']"
          />

          <!-- 사운드 On/Off 토글 버튼 (우측 하단) -->
          <button
            type="button"
            @click="toggleMute"
            class="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-black/60 text-white/95 hover:bg-black/80 transition-all flex items-center gap-1.5 shadow-lg border border-white/20 active:scale-95"
            :aria-label="isMuted ? '소리 켜기' : '음소거'"
          >
            <span class="text-sm leading-none">{{ isMuted ? '🔈' : '🔊' }}</span>
            <span>{{ isMuted ? '소리 켜기' : '음소거' }}</span>
          </button>
        </div>
      </div>

      <!-- 탭 선택 버튼 -->
      <div class="flex gap-3 mb-8">
        <button
          type="button"
          id="tab-saju"
          @click="activeTab = 'saju'"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold font-serif-kr transition-all duration-200 border cursor-pointer"
          :class="activeTab === 'saju' ? 'shadow-md scale-[1.02]' : 'hover:opacity-80'"
          :style="activeTab === 'saju' ? activeBtnStyle : inactiveBtnStyle"
        >
          <UIcon name="i-heroicons-book-open" class="w-4 h-4" />
          <span>사주명리</span>
        </button>
        <button
          type="button"
          id="tab-iching"
          @click="activeTab = 'iching'"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold font-serif-kr transition-all duration-200 border cursor-pointer"
          :class="activeTab === 'iching' ? 'shadow-md scale-[1.02]' : 'hover:opacity-80'"
          :style="activeTab === 'iching' ? activeBtnStyle : inactiveBtnStyle"
        >
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
          <span>주역 周易</span>
        </button>
      </div>

      <!-- 탭 콘텐츠 -->
      <Transition name="fade-tab" mode="out-in">
        <GuideCardsSaju v-if="activeTab === 'saju'" key="saju" />
        <GuideCardsIching v-else key="iching" />
      </Transition>

      <!-- FAQ 및 추가 학술 안내 -->
      <section v-reveal :class="['mt-12 p-6 rounded-xl border', 'bg-slate-50/80 border-slate-200', 'dark:bg-[#0F1226]/80 dark:border-slate-800']">
        <h3 :class="['text-base sm:text-lg font-serif-kr font-bold mb-3 flex items-center gap-2', 'text-amber-900', 'dark:text-[#FFDE9E]']">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-600" />
          <span>동양철학 실전 운세 활용 팁 </span>
        </h3>
        <p :class="['text-xs sm:text-sm leading-relaxed mb-3', 'text-slate-600', 'dark:text-slate-300']">
          sajuapp.co.kr 은 운세를 정해진 숙명으로 보는 시각에서 벗어나, 자신의 선천적 오행 기운을 성찰하고 오늘의 일진과 주역 64괘를 지혜롭게 다스리는 방법을 조명합니다.
        </p>
        <div class="pt-4 flex justify-center items-center w-full">
          <NuxtLink to="/" class="btn-gold-action">
            <UIcon name="i-heroicons-home" class="w-4 h-4" />
            <span>홈으로 이동</span>
          </NuxtLink>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Fade transition */
.fade-tab-enter-active,
.fade-tab-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-tab-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-tab-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
