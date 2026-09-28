<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const handleScroll = () => {
  if (import.meta.client) {
    isVisible.value = window.scrollY > 150
  }
}

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <ClientOnly>
    <Transition name="fade">
      <button
        v-if="isVisible"
        @click="scrollToTop"
        type="button"
        aria-label="최상단으로 이동"
        title="최상단으로 이동"
        :class="[
          'fixed bottom-24 right-4 sm:bottom-8 sm:right-6 z-60 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer select-none border active:scale-90 group',
          'bg-emerald-800 text-emerald-100 border-emerald-500/40 hover:bg-emerald-700',
          'dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-600/60 dark:hover:bg-emerald-800'
        ]"
      >
        <!-- 부드럽게 천천히 위아래로 떠오르는 수직 모션 애니메이션 화살표 -->
        <UIcon
          name="i-heroicons-arrow-up"
          class="w-6 h-6 shrink-0 transition-transform duration-300 animate-float-slow group-hover:-translate-y-1"
        />
      </button>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.85);
}

/* 화살표 아이콘이 천천히 위로 부드럽게 상승/하강하는 순환 플로팅 애니메이션 */
@keyframes floatUpSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float-slow {
  animation: floatUpSlow 2.2s ease-in-out infinite;
}
</style>
