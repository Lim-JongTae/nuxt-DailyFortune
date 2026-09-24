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
        class="fixed bottom-24 right-4 sm:bottom-8 sm:right-6 z-60 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer select-none border border-emerald-500/40 active:scale-90 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 dark:text-emerald-300 dark:border-emerald-600/60"
      >
        <UIcon name="i-heroicons-arrow-up" class="w-6 h-6 shrink-0 text-emerald-200 dark:text-emerald-300" />
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
</style>
