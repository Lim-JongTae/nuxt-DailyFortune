<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isAnimated = ref(false)

onMounted(() => {
  setTimeout(() => {
    isAnimated.value = true
  }, 100)
})
</script>

<template>
  <div class="space-y-6">
    <NuxtLink 
      to="/iching"
      class="gold-filament-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
    >
      <!-- Background Watermark (z-0) -->
      <div class="absolute -right-2 -top-4 pg-watermark-text animate-watermark-pulse text-8xl font-serif-kr select-none pointer-events-none z-0">
        易
      </div>

      <!-- Foreground Content (z-10) -->
      <div class="relative z-10">
        <!-- Header with Vermilion Mini-Seal -->
        <div class="flex items-center justify-between pb-4 sm:pb-5 border-b pg-border gap-2">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <span class="seal-stamp text-base sm:text-lg px-2 py-0.5 shrink-0">易</span>
            <div class="min-w-0">
              <h2 class="font-serif-kr text-base sm:text-xl lg:text-2xl pg-text font-bold whitespace-nowrap">
                오늘의 주역 괘
              </h2>
              <p class="text-[11px] sm:text-xs pg-text-muted mt-0.5 truncate">하늘과 땅의 64가지 변화</p>
            </div>
          </div>
          <span class="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full badge-purple-pill border border-purple-500/30 text-[11px] sm:text-xs font-medium relative z-10 shrink-0 whitespace-nowrap shadow-xs backdrop-blur-xs">
            64괘 대나무 드로우
          </span>
        </div>

        <!-- Hexagram Preview Graphic (모자이크 셔플 조합 연출 & 우측 텍스트 순차 등장) -->
        <ClientOnly>
          <div class="mt-6 flex flex-col sm:flex-row items-center gap-6 pg-card-inner p-5 rounded-2xl border pg-border">
            <!-- 64괘 6효 그래픽 -->
            <div class="w-32 flex flex-col gap-1.5 py-1 select-none hex-mosaic-container" :class="{ 'is-active': isAnimated }">
              <!-- 상괘 (6효: 음효) -->
              <div class="flex gap-2 w-full hex-line-item hex-line-6" :class="{ 'is-active': isAnimated }">
                <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
                <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
              </div>
              <!-- 상괘 (5효: 양효) -->
              <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-5" :class="{ 'is-active': isAnimated }"></div>
              <!-- 상괘 (4효: 양효) -->
              <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-4" :class="{ 'is-active': isAnimated }"></div>

              <!-- 하괘 (3효: 양효) -->
              <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-3" :class="{ 'is-active': isAnimated }"></div>
              <!-- 하괘 (2효: 음효) -->
              <div class="flex gap-2 w-full hex-line-item hex-line-2" :class="{ 'is-active': isAnimated }">
                <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
                <div class="h-1.5 rounded-xs w-1/2 trigram-bar-broken shadow-xs"></div>
              </div>
              <!-- 하괘 (1효: 양효) -->
              <div class="h-1.5 rounded-xs w-full trigram-bar-solid shadow-xs hex-line-item hex-line-1" :class="{ 'is-active': isAnimated }"></div>
            </div>

            <!-- 우측 텍스트 -->
            <div class="hex-text-fade-in" :class="{ 'is-active': isAnimated }">
              <div class="text-xs trigram-badge-text font-bold font-serif-kr mb-1">3단계 대나무 점대 드로우</div>
              <p class="text-xs pg-text-muted leading-relaxed">
                하괘, 상괘, 동효를 마음을 담아 직접 선택하여 오늘 나에게 필요한 처세의 지혜를 구합니다.
              </p>
            </div>
          </div>

          <!-- Quote Preview -->
          <div class="mt-6 p-4 rounded-xl trigram-quote-box border-l-2 hex-text-fade-in hex-text-delay-quote" :class="{ 'is-active': isAnimated }">
            <p class="font-serif-kr text-xs sm:text-sm trigram-quote-text italic">
              “상황에 맞추어 유연하게 순응하면 굳게 막혔던 난관이 스스로 풀려나갑니다.”
            </p>
          </div>
        </ClientOnly>
      </div>

      <!-- CTA Button (z-10) -->
      <div class="mt-8 relative z-10">
        <div class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white cta-purple-btn hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2">
          <span>☯️ 주역 괘 뽑으러 가기</span>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.badge-purple-pill {
  background-color: rgba(168, 85, 247, 0.1);
  color: #7e22ce;
}
.dark .badge-purple-pill {
  background-color: rgba(168, 85, 247, 0.2);
  color: #d8b4fe;
}

.trigram-bar-broken {
  background-color: #9333ea;
}
.dark .trigram-bar-broken {
  background-color: #c084fc;
}

.trigram-bar-solid {
  background: linear-gradient(to right, #9333ea, #4f46e5);
}
.dark .trigram-bar-solid {
  background: linear-gradient(to right, #c084fc, #818cf8);
}

.trigram-badge-text {
  color: #7e22ce;
}
.dark .trigram-badge-text {
  color: #fcd34d;
}

.trigram-quote-box {
  background-color: #faf5ff;
  border-color: #9333ea;
}
.dark .trigram-quote-box {
  background-color: rgba(58, 12, 99, 0.4);
  border-color: #fcd34d;
}

.trigram-quote-text {
  color: #581c87;
}
.dark .trigram-quote-text {
  color: #fde68a;
}

.cta-purple-btn {
  background: linear-gradient(to right, #7e22ce, #3730a3);
}

@keyframes hexLineAssembleOdd {
  0% { opacity: 0; filter: blur(12px) brightness(220%); transform: translateX(-28px) scaleX(0.3); }
  60% { opacity: 0.8; filter: blur(3px) brightness(140%); transform: translateX(4px) scaleX(1.06); }
  100% { opacity: 1; filter: blur(0px) brightness(100%); transform: translateX(0) scaleX(1); }
}

@keyframes hexLineAssembleEven {
  0% { opacity: 0; filter: blur(12px) brightness(220%); transform: translateX(28px) scaleX(0.3); }
  60% { opacity: 0.8; filter: blur(3px) brightness(140%); transform: translateX(-4px) scaleX(1.06); }
  100% { opacity: 1; filter: blur(0px) brightness(100%); transform: translateX(0) scaleX(1); }
}

.hex-line-item {
  opacity: 0;
  will-change: transform, opacity, filter;
}

.hex-line-1.is-active, .hex-line-3.is-active, .hex-line-5.is-active {
  animation: hexLineAssembleOdd 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hex-line-2.is-active, .hex-line-4.is-active, .hex-line-6.is-active {
  animation: hexLineAssembleEven 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hex-line-1.is-active { animation-delay: 0.15s; }
.hex-line-2.is-active { animation-delay: 0.35s; }
.hex-line-3.is-active { animation-delay: 0.55s; }
.hex-line-4.is-active { animation-delay: 0.75s; }
.hex-line-5.is-active { animation-delay: 0.95s; }
.hex-line-6.is-active { animation-delay: 1.15s; }

@keyframes hexTextFadeInUp {
  0% { opacity: 0; filter: blur(4px); transform: translateY(8px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
}

.hex-text-fade-in {
  opacity: 0;
  will-change: transform, opacity, filter;
}

.hex-text-fade-in.is-active {
  animation: hexTextFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 1.45s;
}

.hex-text-delay-quote.is-active {
  animation-delay: 1.75s;
}
</style>
