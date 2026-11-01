<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#imports'
import popupData from '~/data/new-year-popup.json'

const router = useRouter()
const isVisible = ref(false)

const getKstTodayDateString = (): string => {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())
}

const checkEligibility = (): boolean => {
  if (!popupData.enabled) return false

  const now = Date.now()
  const start = new Date(popupData.config.startDate).getTime()
  const end = new Date(popupData.config.endDate).getTime()

  if (now < start || now > end) return false

  if (import.meta.client) {
    const hiddenDate = localStorage.getItem(popupData.config.storageKey)
    const today = getKstTodayDateString()
    if (hiddenDate === today) {
      return false
    }
  }

  return true
}

onMounted(() => {
  if (checkEligibility()) {
    // 자연스러운 진입을 위해 페이지 로드 후 0.6초 뒤 노출
    setTimeout(() => {
      isVisible.value = true
    }, 600)
  }
})

const closeModal = () => {
  isVisible.value = false
}

const closeForToday = () => {
  if (import.meta.client) {
    const today = getKstTodayDateString()
    localStorage.setItem(popupData.config.storageKey, today)
  }
  isVisible.value = false
}

const handleCtaClick = () => {
  closeModal()
  router.push(popupData.ctaButton.link)
}
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isVisible"
          class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          @click.self="closeModal"
        >
          <div
            :class="['border rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-fade-in-up', 'bg-[#0F1226]/95 border-amber-500/40 text-slate-100']"
            style="box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(245, 158, 11, 0.2);"
          >
            <!-- 닫기 X 버튼 -->
            <button
              type="button"
              @click="closeModal"
              class="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-slate-300 hover:text-white transition-colors"
              aria-label="닫기"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>

            <!-- 스크롤 가능한 본문 영역 -->
            <div class="overflow-y-auto max-h-[calc(90vh-60px)]">
              <!-- 상단 히어로 배너 이미지 -->
              <div class="relative w-full h-44 sm:h-52 overflow-hidden bg-slate-900">
                <img
                  :src="popupData.heroImage"
                  :alt="popupData.title"
                  class="w-full h-full object-cover object-center filter brightness-95"
                />
                <div class="absolute inset-0 bg-linear-to-t from-[#0F1226] via-transparent to-black/30" />
                
                <div class="absolute bottom-3 left-4 right-4">
                  <span class="inline-block px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-xs mb-1.5">
                    {{ popupData.badge }}
                  </span>
                  <h2 class="font-serif-kr text-xl sm:text-2xl font-bold text-amber-200 tracking-tight drop-shadow-md">
                    {{ popupData.title }}
                  </h2>
                </div>
              </div>

              <!-- 콘텐츠 섹션 -->
              <div class="p-5 sm:p-6 space-y-4">
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {{ popupData.subtitle }}
                </p>

                <!-- 날삼재 & 길한 세운 띠 하이라이트 카드 그리드 -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- 하이라이트 카드 -->
                  <div
                    v-for="(item, idx) in popupData.zodiacHighlights"
                    :key="idx"
                    :class="[
                      'p-3.5 rounded-2xl border transition-all',
                      item.badgeColor === 'rose'
                        ? 'bg-rose-950/30 border-rose-800/40'
                        : 'bg-amber-950/30 border-amber-800/40'
                    ]"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-base">{{ item.icon }}</span>
                      <span
                        :class="[
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          item.badgeColor === 'rose'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        ]"
                      >
                        {{ item.category }}
                      </span>
                    </div>

                    <div class="flex flex-wrap gap-1.5 mb-2">
                      <span
                        v-for="zodiac in item.zodiacs"
                        :key="zodiac"
                        :class="[
                          'px-2 py-0.5 rounded-md text-xs font-bold',
                          item.badgeColor === 'rose'
                            ? 'bg-rose-500/20 text-rose-200'
                            : 'bg-amber-500/20 text-amber-200'
                        ]"
                      >
                        {{ zodiac }}
                      </span>
                    </div>

                    <h4 class="text-xs font-bold text-slate-200 mb-1 font-serif-kr">
                      {{ item.title }}
                    </h4>
                    <p class="text-[11px] text-slate-400 leading-snug">
                      {{ item.description }}
                    </p>
                  </div>
                </div>

                <!-- 함께 보세요 주의 포인트 -->
                <div
                  v-if="popupData.cautionPoint"
                  class="px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <span class="text-amber-300 font-bold flex items-center gap-1.5 shrink-0">
                    <span>📌</span> {{ popupData.cautionPoint.title }}
                  </span>
                  <span class="text-slate-300 font-medium truncate ml-2">
                    {{ popupData.cautionPoint.text }}
                  </span>
                </div>

                <!-- 무료 CTA 버튼 -->
                <div class="pt-2">
                  <button
                    type="button"
                    @click="handleCtaClick"
                    class="w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide text-[#0F1226] transition-all transform active:scale-98 shadow-lg flex items-center justify-center gap-2"
                    style="background: linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%); box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);"
                  >
                    <span>{{ popupData.ctaButton.text }}</span>
                    <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                  </button>
                  <p class="text-center text-[11px] text-slate-400 mt-2">
                    {{ popupData.footerNotice }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 하단 바 (오늘 하루 보지 않기 / 닫기) -->
            <div class="p-3 bg-black/40 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-sans">
              <button
                type="button"
                @click="closeForToday"
                class="hover:text-amber-300 transition-colors flex items-center gap-1.5"
              >
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-slate-400" />
                <span>오늘 하루 보지 않기</span>
              </button>
              <button
                type="button"
                @click="closeModal"
                class="hover:text-white transition-colors px-2 py-0.5 rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
