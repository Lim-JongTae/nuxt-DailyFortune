<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const activeTab = ref<'disclaimer' | 'privacy'>('disclaimer')

const openModal = (tab: 'disclaimer' | 'privacy' = 'disclaimer') => {
  activeTab.value = tab
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

defineExpose({
  openModal,
  closeModal
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" @click.self="closeModal">
        <div class="pg-card border pg-border-strong rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-fade-in-up" style="background-color: var(--fortune-card-deep); border-color: var(--fortune-border-strong);">
          <!-- 상단 헤더 -->
          <div class="p-4 border-b pg-border flex justify-between items-center bg-black/20">
            <div class="flex items-center gap-2">
              <span class="seal-stamp text-xs px-2 py-0.5">✦</span>
              <h3 class="font-serif-kr text-base font-bold pg-text-gold">
                {{ activeTab === 'disclaimer' ? '서비스 이용안내 및 면책조항' : '개인정보 처리방침 & 쿠키 고지' }}
              </h3>
            </div>
            <button type="button" @click="closeModal" class="p-1 rounded-full pg-text-muted hover:pg-text transition-colors">
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <!-- 탭 선택 바 -->
          <div class="grid grid-cols-2 text-xs text-center border-b pg-border font-serif-kr bg-black/10">
            <button
              type="button"
              class="py-2.5 font-bold transition-all border-b-2"
              :class="activeTab === 'disclaimer' ? 'pg-text-gold border-[var(--fortune-gold)] bg-[var(--fortune-gold)]/10' : 'pg-text-muted border-transparent hover:pg-text'"
              @click="activeTab = 'disclaimer'"
            >
              📜 서비스 면책조항
            </button>
            <button
              type="button"
              class="py-2.5 font-bold transition-all border-b-2"
              :class="activeTab === 'privacy' ? 'pg-text-gold border-[var(--fortune-gold)] bg-[var(--fortune-gold)]/10' : 'pg-text-muted border-transparent hover:pg-text'"
              @click="activeTab = 'privacy'"
            >
              🔒 개인정보 & 쿠키 고지
            </button>
          </div>

          <!-- 내용 본문 (스크롤) -->
          <div class="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed font-sans-kr pg-text max-h-[60vh] no-scrollbar">
            <!-- 1. 면책조항 -->
            <template v-if="activeTab === 'disclaimer'">
              <div class="space-y-3">
                <div class="pg-card-inner p-3 rounded-xl border pg-border">
                  <h4 class="font-bold pg-text-gold mb-1 font-serif-kr">1. 서비스 목적 및 안내</h4>
                  <p class="pg-text-muted">
                    sajuapp.co.kr(사주앱)에서 제공하는 사주명리 및 주역 64괘 운세 서비스는 동양 명리학 데이터와 인공지능(AI) 알고리즘을 바탕으로 생성되는 성찰 및 일상 참고용 콘텐츠입니다.
                  </p>
                </div>

                <div class="pg-card-inner p-3 rounded-xl border pg-border">
                  <h4 class="font-bold pg-text-gold mb-1 font-serif-kr">2. 법적 및 전문 조언 비대상 명시</h4>
                  <p class="pg-text-muted">
                    본 웹사이트에서 제공하는 모든 해석, 점수, 조언 및 화두는 전문적인 법적 조언, 의학적 진단, 재정적·투자적 판단을 대신할 수 없습니다. 중요한 법률, 의료, 금융 결정은 반드시 해당 분야의 전문가와 상담하시기 바랍니다.
                  </p>
                </div>

                <div class="pg-card-inner p-3 rounded-xl border pg-border">
                  <h4 class="font-bold pg-text-gold mb-1 font-serif-kr">3. 사용자 귀책 및 보증의 한계</h4>
                  <p class="pg-text-muted">
                    본 서비스는 운세 결과의 완전성이나 절대적 정확성을 보증하지 않으며, 운세 내용을 바탕으로 진행된 사용자의 주관적인 판단 및 행동 결과에 대해 어떠한 법적 책임도 지지 않습니다.
                  </p>
                </div>
              </div>
            </template>

            <!-- 2. 개인정보 처리방침 -->
            <template v-else>
              <div class="space-y-3">
                <div class="pg-card-inner p-3 rounded-xl border pg-border">
                  <h4 class="font-bold pg-text-gold mb-1 font-serif-kr">1. 개인정보 수집 및 목적</h4>
                  <p class="pg-text-muted">
                    사용자가 입력한 생년월일시, 성별 및 고민 내용은 오직 당일 운세 결과 생성 목적으로만 사용되며, 개인을 식별할 수 있는 형태로 영구 저장되지 않습니다.
                  </p>
                </div>

                <div class="pg-card-inner p-3 rounded-xl border pg-border">
                  <h4 class="font-bold pg-text-gold mb-1 font-serif-kr">2. 쿠키(Cookie) 및 구글 애드센스 고지</h4>
                  <p class="pg-text-muted">
                    본 웹사이트는 사용자 서비스 편의성 제공(하루 1회 조회 제한 및 자정 리셋)과 구글 애드센스(Google AdSense) 맞춤형 광고 게재를 위해 웹 브라우저 쿠키를 활용합니다. 구글을 포함한 제3자 광고 사업자는 쿠키를 활용하여 웹사이트 방문 기록 기반의 맞춤형 광고를 제공합니다.
                  </p>
                </div>

                <div class="pg-card-inner p-3 rounded-xl border pg-border">
                  <h4 class="font-bold pg-text-gold mb-1 font-serif-kr">3. 쿠키 거부 및 설정</h4>
                  <p class="pg-text-muted">
                    사용자는 웹 브라우저 옵션을 변경하여 모든 쿠키의 허용/거부 설정을 직접 관리할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 일부 자동 저장 서비스 이용에 제한이 있을 수 있습니다.
                  </p>
                </div>
              </div>
            </template>
          </div>

          <!-- 하단 닫기 바 -->
          <div class="p-3 border-t pg-border text-center bg-black/20">
            <button
              type="button"
              class="w-full py-2.5 rounded-full font-bold text-xs pg-card border pg-border pg-text-gold hover:pg-text transition-colors"
              @click="closeModal"
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
</style>
