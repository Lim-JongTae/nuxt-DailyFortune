<script setup lang="ts">
import { ref, onMounted } from 'vue'

const deferredPrompt = ref<any>(null)
const showPrompt = ref(false)
const isInstalled = ref(false)

onMounted(() => {
  // Check if running in standalone mode (already installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
    isInstalled.value = true
    return
  }

  // Listen for beforeinstallprompt event (Android/Chrome)
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e
    
    // Show banner after a slight delay if user hasn't dismissed it today
    const dismissedTime = localStorage.getItem('pwa_prompt_dismissed')
    if (!dismissedTime || Date.now() - parseInt(dismissedTime, 10) > 24 * 60 * 60 * 1000) {
      showPrompt.value = true
    }
  })

  // Listen for appinstalled event
  window.addEventListener('appinstalled', () => {
    isInstalled.value = true
    showPrompt.value = false
    deferredPrompt.value = null
  })
})

const installPWA = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    showPrompt.value = false
  }
  deferredPrompt.value = null
}

const dismissPrompt = () => {
  showPrompt.value = false
  localStorage.setItem('pwa_prompt_dismissed', Date.now().toString())
}
</script>

<template>
  <ClientOnly>
    <Transition name="slide-up">
      <div 
        v-if="showPrompt && !isInstalled"
        class="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 p-4 rounded-2xl bg-[#16192e]/95 backdrop-blur-md border border-amber-500/40 shadow-2xl text-white flex flex-col gap-3 transition-all"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-700 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <img src="/icon-192x192.png" alt="일일운세 앱 아이콘" class="w-full h-full rounded-[10px] object-cover" />
            </div>
            <div>
              <h4 class="font-serif-kr text-sm font-bold text-[#FFDE9E] flex items-center gap-1.5">
                일일운세 ✦ 天命
              </h4>
              <p class="text-xs text-slate-300 font-sans-kr mt-0.5">
                모바일 앱으로 편리하게 운세를 확인하세요!
              </p>
            </div>
          </div>
          <button 
            @click="dismissPrompt"
            class="text-slate-400 hover:text-white p-1 transition-colors"
            aria-label="닫기"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <button 
            @click="dismissPrompt"
            class="flex-1 py-2 px-3 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors text-center"
          >
            나중에
          </button>
          <button 
            @click="installPWA"
            class="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-[#3d2c00] bg-linear-to-r from-[#FFDF9E] to-[#E8C170] hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
            앱 설치하기
          </button>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
