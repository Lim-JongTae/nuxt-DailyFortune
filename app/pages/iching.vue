<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

useSeoMeta({
  title: '오늘의 주역 괘 - 일일운세.kr',
  description: '마음에 품은 고민을 해결하기 위한 주역의 64괘 조언을 얻고, AI의 1:1 맞춤형 해석 보고서를 확인해 보세요.'
})

const trigrams = [
  { id: 1, name: '건', nameHanji: '乾', symbol: '☰', element: '하늘' },
  { id: 2, name: '태', nameHanji: '兌', symbol: '☱', element: '연못' },
  { id: 3, name: '이', nameHanji: '離', symbol: '☲', element: '불' },
  { id: 4, name: '진', nameHanji: '震', symbol: '☳', element: '번개' },
  { id: 5, name: '손', nameHanji: '巽', symbol: '☴', element: '바람' },
  { id: 6, name: '감', nameHanji: '坎', symbol: '☵', element: '물' },
  { id: 7, name: '간', nameHanji: '艮', symbol: '☶', element: '산' },
  { id: 8, name: '곤', nameHanji: '坤', symbol: '☷', element: '땅' }
]

const trigramToHexagramMap: Record<number, Record<number, number>> = {
  1: { 1: 1, 2: 10, 3: 13, 4: 25, 5: 44, 6: 6, 7: 33, 8: 12 },
  2: { 1: 43, 2: 58, 3: 49, 4: 17, 5: 28, 6: 47, 7: 31, 8: 45 },
  3: { 1: 14, 2: 38, 3: 30, 4: 21, 5: 50, 6: 64, 7: 56, 8: 35 },
  4: { 1: 34, 2: 54, 3: 55, 4: 51, 5: 32, 6: 40, 7: 62, 8: 16 },
  5: { 1: 9, 2: 61, 3: 37, 4: 42, 5: 57, 6: 59, 7: 53, 8: 20 },
  6: { 1: 5, 2: 60, 3: 63, 4: 3, 5: 48, 6: 29, 7: 39, 8: 8 },
  7: { 1: 26, 2: 41, 3: 22, 4: 27, 5: 18, 6: 4, 7: 52, 8: 23 },
  8: { 1: 11, 2: 19, 3: 36, 4: 24, 5: 46, 6: 7, 7: 15, 8: 2 }
}

const store = useFortuneStore()
const { ichingWorry: worry, ichingResult: result } = storeToRefs(store)

const currentStep = ref(0)
const loading = ref(false)
const animationActive = ref(false)

const lowerTrigram = ref<any>(null)
const upperTrigram = ref<any>(null)
const selectedLine = ref<number | null>(null)

const sticks = ref<any[]>([])

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

const initTrigramSticks = () => {
  const shuffled = shuffleArray(trigrams)
  sticks.value = shuffled.map((trigram, index) => ({
    stickId: index + 1,
    isFlipped: false,
    trigram
  }))
}

const initLineSticks = () => {
  const lines = [1, 2, 3, 4, 5, 6]
  const shuffled = shuffleArray(lines)
  sticks.value = shuffled.map((lineNum, index) => ({
    stickId: index + 1,
    isFlipped: false,
    lineNum,
    lineSymbol: lineNum % 2 === 1 ? '───' : '─ ─',
    lineName: ['초효 (1효)', '이효 (2효)', '삼효 (3효)', '사효 (4효)', '오효 (5효)', '상효 (6효)'][lineNum - 1]
  }))
}

onMounted(() => {
  store.loadFromLocalStorage()
  if (result.value) {
    currentStep.value = 5
  }
})

const startRitual = () => {
  currentStep.value = 1
  lowerTrigram.value = null
  upperTrigram.value = null
  selectedLine.value = null
  initTrigramSticks()
}

const handleStickClick = async (stick: any) => {
  if (stick.isFlipped) return

  stick.isFlipped = true

  if (currentStep.value === 1) {
    lowerTrigram.value = stick.trigram
    setTimeout(() => {
      currentStep.value = 2
      initTrigramSticks()
    }, 1200)
  } else if (currentStep.value === 2) {
    upperTrigram.value = stick.trigram
    setTimeout(() => {
      currentStep.value = 3
      initLineSticks()
    }, 1200)
  } else if (currentStep.value === 3) {
    selectedLine.value = stick.lineNum
    setTimeout(async () => {
      currentStep.value = 4
      loading.value = true
      animationActive.value = true
      
      const startTime = Date.now()
      
      const upper = upperTrigram.value
      const lower = lowerTrigram.value
      if (!upper || !lower) {
        alert('괘 정보가 올바르지 않습니다. 다시 시도해 주세요.')
        currentStep.value = 0
        loading.value = false
        animationActive.value = false
        return
      }

      const hexagramId = trigramToHexagramMap[upper.id]?.[lower.id] || 1

      try {
        const res: any = await $fetch('/api/fortune/iching', {
          method: 'POST',
          body: {
            worry: worry.value,
            hexagramId,
            lineNumber: selectedLine.value
          }
        })

        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(2500 - elapsedTime, 0)
        
        setTimeout(() => {
          if (res.success) {
            result.value = res
            store.saveToLocalStorage()
            currentStep.value = 5
          } else {
            alert(res.error || '오류가 발생했습니다.')
            currentStep.value = 0
          }
          loading.value = false
          animationActive.value = false
        }, remainingTime)

      } catch (error) {
        console.error(error)
        alert('서버 연결 중 오류가 발생했습니다.')
        loading.value = false
        animationActive.value = false
        currentStep.value = 0
      }
    }, 1200)
  }
}

const resetAll = () => {
  store.clearIching()
  lowerTrigram.value = null
  upperTrigram.value = null
  selectedLine.value = null
  currentStep.value = 0
}

const copyToClipboard = () => {
  if (!navigator.clipboard) {
    alert('이 브라우저는 복사 기능을 지원하지 않습니다.')
    return
  }
  if (!result.value) return

  const hex = result.value.hexagram

  const plainText = result.value.aiInterpretation
    .replace(/\*\*/g, '')
    .replace(/### /g, '■ ')
    .replace(/## /g, '◈ ')
    .replace(/# /g, '★ ')
    .replace(/\* /g, '• ')
    .replace(/- /g, '• ')

  const shareText = `☯️ [일일운세.kr] 오늘의 주역 괘 분석 결과 ☯️
--------------------------------------
● 선택한 괘: 제 ${hex.id}괘 ${hex.nameKorean} (${hex.nameHanji})
● 괘사 요약: "${hex.summary}"
● 오늘의 동효: ${hex.lineNumber}효

${plainText}

--------------------------------------
내 주역 괘 직접 뽑아보기: https://일일운세.kr/iching`

  navigator.clipboard.writeText(shareText)
    .then(() => alert('오늘의 주역 괘 결과 보고서가 텍스트로 복사되었습니다. 카카오톡이나 SNS에 붙여넣어 공유해 보세요!'))
    .catch(err => console.error(err))
}

const formattedInterpretation = computed(() => {
  if (!result.value?.aiInterpretation) return ''
  
  let text = result.value.aiInterpretation

  text = text.replace(/^### (.*$)/gim, '<h3 class="text-purple-900 dark:text-[#FFDE9E] text-lg font-serif-kr font-bold mt-6 mb-3 border-b border-slate-200 dark:border-[#4d4638]/40 pb-2 flex items-center gap-2"><span class="w-1.5 h-4 bg-purple-600 rounded-sm"></span>$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2 class="text-xl font-serif-kr font-extrabold text-purple-800 dark:text-[#FFDF9E] mt-8 mb-4 border-l-4 border-purple-600 pl-3">$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-serif-kr font-extrabold text-slate-900 dark:text-white mt-10 mb-6">$1</h1>')

  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-700 dark:text-purple-300">$1</strong>')

  text = text.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-[#dfe0fd] my-2 text-sm sm:text-base">$1</li>')
  text = text.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-[#dfe0fd] my-2 text-sm sm:text-base">$1</li>')

  const lines = text.split('\n')
  return lines.map((line: string) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed === '') {
      return line
    }
    return `<p class="text-slate-700 dark:text-[#dfe0fd] leading-relaxed my-3 text-sm sm:text-base font-light">${line}</p>`
  }).join('\n')
})
</script>

<template>
  <div class="bg-celestial-canvas min-h-screen text-slate-800 dark:text-[#dfe0fd] py-8 px-4 sm:px-8 font-sans-kr transition-colors duration-300">
    <div class="max-w-3xl mx-auto">
      <!-- 헤더 바 -->
      <div class="flex items-center gap-3 mb-8">
        <NuxtLink 
          to="/"
          class="p-2 rounded-full bg-slate-100 dark:bg-[#181C38] border border-slate-200 dark:border-[#FFDE9E]/30 text-purple-700 dark:text-[#FFDE9E] hover:bg-slate-200 dark:hover:bg-[#26293e] transition-colors"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="flex items-center gap-3">
          <span class="seal-stamp text-xs px-2 py-0.5">易</span>
          <h1 class="font-serif-kr text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            오늘의 주역 괘
            <span class="text-xs text-purple-700 dark:text-[#FFDE9E]/80 font-sans-kr font-normal">(Today's I Ching)</span>
          </h1>
        </div>
      </div>

      <!-- 단계 0: 질문 입력 및 준비 화면 -->
      <div v-if="currentStep === 0" class="gold-filament-card p-6 sm:p-8">
        <div class="mb-6">
          <label for="worry" class="block text-sm font-bold text-purple-900 dark:text-[#FFDE9E] mb-2 font-serif-kr">
            ❓ 현재 해결하고 싶은 고민이나 질문을 마음속에 가만히 떠올려 보세요.
          </label>
          <textarea
            id="worry"
            v-model="worry"
            placeholder="예: 오늘 중요한 협상이 있는데 잘 마무리될까요?, 새로운 도전을 시작해도 될까요? 등 구체적으로 적어주실수록 AI가 괘사에 빗대어 깊은 처세의 조언을 전합니다."
            rows="3"
            class="w-full py-2.5 px-4 border border-slate-300 dark:border-[#4d4638]/50 bg-slate-50 dark:bg-[#171a2e] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-600 dark:focus:border-[#FFDE9E] text-sm resize-none"
          ></textarea>
          <p class="mt-2 text-xs text-slate-500 dark:text-[#9a8f7f]">
            * 비워두시면 오늘 하루 종합적인 하늘과 땅의 괘상을 풀이해 드립니다.
          </p>
        </div>

        <div class="text-center py-6 border-t border-slate-200 dark:border-[#4d4638]/40 mt-6">
          <p class="text-xs sm:text-sm text-slate-600 dark:text-[#d1c5b3] mb-6 leading-relaxed font-light">
            마음을 정갈히 하고, 아래 <strong>[주역 점치기 시작]</strong> 버튼을 누르면<br>
            괘를 도출하기 위한 3번의 신비로운 점대 선택이 시작됩니다.
          </p>
          
          <button
            type="button"
            class="px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-purple-700 to-indigo-800 hover:brightness-110 transition-all shadow-md inline-flex items-center gap-2"
            @click="startRitual"
          >
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-[#FFDE9E]" />
            주역 점치기 시작
          </button>
        </div>
      </div>

      <!-- 단계 1 ~ 3: 점대 뽑기 화면 -->
      <div v-if="currentStep >= 1 && currentStep <= 3" class="gold-filament-card p-6 sm:p-8">
        <div class="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-[#4d4638]/40 pb-4">
          <div>
            <span class="text-[10px] font-bold text-purple-700 dark:text-[#FFDE9E] block mb-0.5 tracking-wider">TRADITIONAL RITUAL</span>
            <h2 class="font-serif-kr text-xl font-bold text-slate-900 dark:text-white">
              <span v-if="currentStep === 1">1단계: 하괘(下卦)를 결정합니다</span>
              <span v-if="currentStep === 2">2단계: 상괘(上卦)를 결정합니다</span>
              <span v-if="currentStep === 3">3단계: 오늘의 동효(動爻)를 결정합니다</span>
            </h2>
          </div>
          <div class="flex gap-1.5">
            <span class="w-3 h-3 rounded-full" :class="currentStep >= 1 ? 'bg-purple-600 dark:bg-[#FFDE9E]' : 'bg-slate-200 dark:bg-[#303349]'"></span>
            <span class="w-3 h-3 rounded-full" :class="currentStep >= 2 ? 'bg-purple-600 dark:bg-[#FFDE9E]' : 'bg-slate-200 dark:bg-[#303349]'"></span>
            <span class="w-3 h-3 rounded-full" :class="currentStep >= 3 ? 'bg-purple-600 dark:bg-[#FFDE9E]' : 'bg-slate-200 dark:bg-[#303349]'"></span>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 justify-center mb-8">
          <div class="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#171a2e] border border-slate-200 dark:border-[#4d4638]/40 flex items-center gap-2">
            <span class="text-xs text-slate-500 dark:text-[#9a8f7f]">하괘:</span>
            <strong class="text-sm font-serif-kr" :class="lowerTrigram ? 'text-purple-700 dark:text-[#FFDE9E]' : 'text-slate-400 dark:text-neutral-500'">
              {{ lowerTrigram ? `${lowerTrigram.name}(${lowerTrigram.nameHanji}) ${lowerTrigram.symbol}` : '대기 중' }}
            </strong>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#171a2e] border border-slate-200 dark:border-[#4d4638]/40 flex items-center gap-2">
            <span class="text-xs text-slate-500 dark:text-[#9a8f7f]">상괘:</span>
            <strong class="text-sm font-serif-kr" :class="upperTrigram ? 'text-purple-700 dark:text-[#FFDE9E]' : 'text-slate-400 dark:text-neutral-500'">
              {{ upperTrigram ? `${upperTrigram.name}(${upperTrigram.nameHanji}) ${upperTrigram.symbol}` : '대기 중' }}
            </strong>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#171a2e] border border-slate-200 dark:border-[#4d4638]/40 flex items-center gap-2">
            <span class="text-xs text-slate-500 dark:text-[#9a8f7f]">동효:</span>
            <strong class="text-sm font-serif-kr" :class="selectedLine ? 'text-purple-700 dark:text-[#FFDE9E]' : 'text-slate-400 dark:text-neutral-500'">
              {{ selectedLine ? `${selectedLine}효` : '대기 중' }}
            </strong>
          </div>
        </div>

        <p class="text-center text-xs sm:text-sm text-slate-600 dark:text-[#d1c5b3] mb-8 leading-relaxed font-light">
          <span v-if="currentStep === 1">아래 8개의 대나무 점대 중 하나를 선택하세요. 괘의 아래쪽을 구성합니다.</span>
          <span v-if="currentStep === 2">다시 한 번 8개의 점대 중 하나를 선택하세요. 괘의 위쪽을 구성합니다.</span>
          <span v-if="currentStep === 3">마지막으로 6개의 점대 중 하나를 선택하세요. 오늘의 변화를 뜻하는 동효가 정해집니다.</span>
        </p>

        <!-- 점대 보드 -->
        <div class="flex justify-center flex-wrap gap-3 py-4 max-w-xl mx-auto">
          <div
            v-for="stick in sticks"
            :key="stick.stickId"
            @click="handleStickClick(stick)"
            class="relative cursor-pointer h-40 w-11 rounded-xl transition-all duration-500 transform hover:-translate-y-3 preserve-3d"
            :class="{ 'rotate-y-180': stick.isFlipped }"
          >
            <div class="absolute inset-0 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 flex flex-col items-center justify-between py-4 border border-amber-600 rounded-xl shadow-md backface-hidden z-10">
              <span class="text-xs text-amber-300/40 select-none">☯</span>
              <div class="w-1 h-16 bg-amber-900/50 rounded-full"></div>
              <span class="text-[10px] text-amber-200/50 select-none font-serif-kr">{{ stick.stickId }}</span>
            </div>

            <div class="absolute inset-0 bg-slate-50 dark:bg-[#171a2e] flex flex-col items-center justify-center p-1 border-2 border-purple-600 dark:border-[#FFDE9E] rounded-xl shadow-lg rotate-y-180 backface-hidden z-20 text-slate-900 dark:text-white">
              <template v-if="currentStep === 1 || currentStep === 2">
                <span class="text-2xl text-purple-700 dark:text-[#FFDE9E] font-bold mb-1 select-none">{{ stick.trigram.symbol }}</span>
                <span class="text-xs font-bold font-serif-kr select-none">{{ stick.trigram.name }}</span>
                <span class="text-[9px] text-slate-500 dark:text-[#9a8f7f] mt-0.5 select-none">{{ stick.trigram.element }}</span>
              </template>
              <template v-else-if="currentStep === 3">
                <span class="text-lg text-purple-700 dark:text-[#FFDE9E] font-serif-kr font-black select-none tracking-widest mb-1">{{ stick.lineSymbol }}</span>
                <span class="text-[10px] font-bold select-none text-center leading-tight">{{ stick.lineName }}</span>
              </template>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-8 border-t border-slate-200 dark:border-[#4d4638]/40 pt-6">
          <button
            type="button"
            class="text-xs text-slate-500 dark:text-[#9a8f7f] hover:text-slate-900 dark:hover:text-white transition-colors"
            @click="resetAll"
          >
            그만두고 처음으로
          </button>
        </div>
      </div>

      <!-- 단계 4: 로딩 화면 -->
      <div v-if="currentStep === 4" class="gold-filament-card p-8 sm:p-12 text-center">
        <div class="relative w-32 h-32 mx-auto flex items-center justify-center mb-8">
          <div class="absolute inset-0 rounded-full border-4 border-dashed border-purple-500/40 animate-spin" style="animation-duration: 8s;"></div>
          <div class="w-16 h-16 rounded-full bg-slate-50 dark:bg-[#171a2e] border border-purple-500/30 flex items-center justify-center shadow-inner animate-pulse">
            <span class="seal-stamp text-sm px-2 py-0.5">易</span>
          </div>
        </div>
        
        <h3 class="font-serif-kr text-xl font-bold text-slate-900 dark:text-white mb-2 animate-pulse">
          하늘과 땅의 64괘를 맞추는 중입니다...
        </h3>
        <p class="text-xs text-slate-500 dark:text-[#9a8f7f] max-w-xs mx-auto leading-relaxed">
          선택된 괘의 해석과 효사를 불러와 고민에 답할 명리 지침을 생성하고 있습니다.
        </p>
      </div>

      <!-- 단계 5: 결과 화면 -->
      <div v-if="currentStep === 5 && result" class="space-y-6">
        <div class="gold-filament-card p-6 sm:p-8">
          <div class="text-center border-b border-slate-200 dark:border-[#4d4638]/40 pb-6 mb-6">
            <div class="flex items-center justify-center gap-2 mb-3">
              <span class="inline-block px-3 py-1 bg-amber-500/10 dark:bg-[#FFDE9E]/10 border border-amber-500/30 dark:border-[#FFDE9E]/30 text-amber-800 dark:text-[#FFDE9E] rounded-full text-xs font-bold font-serif-kr">
                제 {{ result.hexagram.id }}괘
              </span>
              <span class="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-500/40 text-purple-800 dark:text-purple-300 rounded-full text-xs font-bold font-serif-kr">
                동효: {{ result.hexagram.lineNumber }}효
              </span>
            </div>
            <h2 class="font-serif-kr text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              {{ result.hexagram.nameKorean }} ({{ result.hexagram.nameHanji }})
            </h2>
            <p class="text-sm text-slate-600 dark:text-[#d1c5b3] font-serif-kr font-light max-w-md mx-auto italic">
              "{{ result.hexagram.summary }}"
            </p>
          </div>

          <!-- AI 해석 본문 -->
          <div class="border-t border-slate-200 dark:border-[#4d4638]/40 pt-6">
            <div v-html="formattedInterpretation" class="markdown-body"></div>
          </div>

          <!-- 공유 및 버튼 -->
          <div class="mt-8 pt-6 border-t border-slate-200 dark:border-[#4d4638]/40 flex flex-wrap gap-4 justify-between items-center">
            <button
              type="button"
              class="px-4 py-2 rounded-full border border-slate-300 dark:border-[#4d4638]/60 text-xs text-slate-600 dark:text-[#d1c5b3] hover:text-slate-900 dark:hover:text-white hover:border-purple-600 dark:hover:border-[#FFDE9E] transition-colors"
              @click="resetAll"
            >
              다시 점치기
            </button>

            <div class="flex gap-2">
              <button
                type="button"
                class="px-5 py-2.5 rounded-full bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-500/50 text-xs font-bold text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/80 transition-colors flex items-center gap-1.5"
                @click="copyToClipboard"
              >
                <UIcon name="i-heroicons-share" class="w-4 h-4" />
                결과지 복사 및 공유
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-center my-6">
          <AdSense adSlot="1928374650" />
        </div>
      </div>
    </div>
  </div>
</template>
