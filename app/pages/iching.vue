<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

useSeoMeta({
  title: '주역점 결과 - I CHING ORACLE | 일일운세.kr',
  description: '마음에 품은 고민을 주역 64괘와 변효로 풀이하여 깊은 가르침과 3가지 처세 조언을 드립니다.'
})

interface Trigram {
  id: number
  name: string
  nameHanji: string
  symbol: string
  element: string
  lines: [number, number, number] // 초, 이, 삼효 (0: 음, 1: 양)
}

const trigrams: Trigram[] = [
  { id: 1, name: '건', nameHanji: '乾', symbol: '☰', element: '하늘(天)', lines: [1, 1, 1] },
  { id: 2, name: '태', nameHanji: '兌', symbol: '☱', element: '연못(澤)', lines: [1, 1, 0] },
  { id: 3, name: '이', nameHanji: '離', symbol: '☲', element: '불(火)', lines: [1, 0, 1] },
  { id: 4, name: '진', nameHanji: '震', symbol: '☳', element: '번개(雷)', lines: [1, 0, 0] },
  { id: 5, name: '손', nameHanji: '巽', symbol: '☴', element: '바람(風)', lines: [0, 1, 1] },
  { id: 6, name: '감', nameHanji: '坎', symbol: '☵', element: '물(水)', lines: [0, 1, 0] },
  { id: 7, name: '간', nameHanji: '艮', symbol: '☶', element: '산(山)', lines: [0, 0, 1] },
  { id: 8, name: '곤', nameHanji: '坤', symbol: '☷', element: '땅(地)', lines: [0, 0, 0] }
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

const hexagramNames: Record<number, { nameKorean: string; nameHanji: string; desc: string }> = {
  1: { nameKorean: '중천건', nameHanji: '重天乾', desc: '강건함 / 만물의 시작' },
  2: { nameKorean: '중지곤', nameHanji: '重地坤', desc: '포용함 / 수용과 순응' },
  11: { nameKorean: '지천태', nameHanji: '地天泰', desc: '태평함 / 태평과 통달' },
  12: { nameKorean: '천지비', nameHanji: '天地否', desc: '막힘 / 쇄국과 자중' },
  46: { nameKorean: '지풍승', nameHanji: '地風升', desc: '상승함 / 등선과 발전' },
  63: { nameKorean: '수화기제', nameHanji: '水火旣濟', desc: '완성함 / 성공과 조화' }
}

const store = useFortuneStore()
const { ichingWorry: worry, ichingResult: result } = storeToRefs(store)

const currentStep = ref(0)
const loading = ref(false)
const activeTab = ref('iching')

// 아코디언 열림 상태
const accordionOpen = ref({
  total: true,
  line: true,
  symbol: false
})

const toggleAccordion = (key: 'total' | 'line' | 'symbol') => {
  accordionOpen.value[key] = !accordionOpen.value[key]
}

const lowerTrigram = ref<Trigram | null>(null)
const upperTrigram = ref<Trigram | null>(null)
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
    }, 1000)
  } else if (currentStep.value === 2) {
    upperTrigram.value = stick.trigram
    setTimeout(() => {
      currentStep.value = 3
      initLineSticks()
    }, 1000)
  } else if (currentStep.value === 3) {
    selectedLine.value = stick.lineNum
    setTimeout(async () => {
      currentStep.value = 4
      loading.value = true

      const startTime = Date.now()
      const upper = upperTrigram.value
      const lower = lowerTrigram.value

      if (!upper || !lower) {
        alert('괘 정보가 올바르지 않습니다.')
        currentStep.value = 0
        loading.value = false
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
        const remainingTime = Math.max(2000 - elapsedTime, 0)

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
        }, remainingTime)
      } catch (error) {
        console.error(error)
        alert('서버 연결 중 오류가 발생했습니다.')
        loading.value = false
        currentStep.value = 0
      }
    }, 1000)
  }
}

const resetAll = () => {
  store.clearIching()
  lowerTrigram.value = null
  upperTrigram.value = null
  selectedLine.value = null
  currentStep.value = 0
}

// 6효 라인 배열 계산 (본괘 & 변괘)
const hexagramLinesDetail = computed(() => {
  if (!result.value?.hexagram) {
    // 기본 디폴트 지천태(11) -> 지풍승(46)
    return {
      origin: {
        id: 11,
        nameKorean: '지천태',
        nameHanji: '地天泰',
        desc: '지천태 (태평과 통달)',
        upperName: '상곤(地)',
        lowerName: '하건(天)',
        lines: [1, 1, 1, 0, 0, 0] // 아래부터 1효~6효 (양양양 음음음)
      },
      changed: {
        id: 46,
        nameKorean: '지풍승',
        nameHanji: '地風升',
        desc: '지풍승 (등선과 발전)',
        upperName: '상곤(地)',
        lowerName: '하손(風)',
        lines: [0, 1, 1, 0, 0, 0] // 초효 변효 (1->0)
      },
      lineNum: 1,
      lineText: '초구(初九) 변효',
      harmonyText: '3양 3음 음양 조화',
      fortuneBadge: '대길(大吉) 쾌조'
    }
  }

  const hId = result.value.hexagram.id
  const lineNum = result.value.hexagram.lineNumber || 1

  let foundUpperId = 1
  let foundLowerId = 1
  for (let u = 1; u <= 8; u++) {
    const row = trigramToHexagramMap[u]
    if (!row) continue
    for (let l = 1; l <= 8; l++) {
      if (row[l] === hId) {
        foundUpperId = u
        foundLowerId = l
      }
    }
  }

  const upperTri = trigrams.find(t => t.id === foundUpperId) || trigrams[0]!
  const lowerTri = trigrams.find(t => t.id === foundLowerId) || trigrams[0]!

  // 6효 합성 [하괘 1,2,3효, 상괘 4,5,6효]
  const originLines = [...lowerTri.lines, ...upperTri.lines]

  // 변효 적용
  const changedLines = [...originLines]
  const idx = lineNum - 1
  changedLines[idx] = changedLines[idx] === 1 ? 0 : 1

  // 변하괘, 변상괘 역산
  const changedLowerLines = changedLines.slice(0, 3)
  const changedUpperLines = changedLines.slice(3, 6)

  const findTri = (linesArr: number[]) => {
    return trigrams.find(t => t.lines[0] === linesArr[0] && t.lines[1] === linesArr[1] && t.lines[2] === linesArr[2]) || trigrams[0]!
  }

  const changedLowerTri = findTri(changedLowerLines)
  const changedUpperTri = findTri(changedUpperLines)

  const changedHexId = trigramToHexagramMap[changedUpperTri.id]?.[changedLowerTri.id] || hId
  const changedInfo = hexagramNames[changedHexId] || {
    nameKorean: result.value.hexagram.nameKorean,
    nameHanji: result.value.hexagram.nameHanji,
    desc: result.value.hexagram.summary
  }

  const lineNames = ['초구(初九)', '구이(九二)', '구삼(九三)', '육사(六四)', '육오(六五)', '상육(上六)']
  const lineText = `${lineNames[idx] || `${lineNum}효`} 변효`

  const yangCount = originLines.filter(l => l === 1).length
  const yinCount = 6 - yangCount

  return {
    origin: {
      id: hId,
      nameKorean: result.value.hexagram.nameKorean,
      nameHanji: result.value.hexagram.nameHanji,
      desc: result.value.hexagram.summary,
      upperName: `상${upperTri.name}(${upperTri.element.charAt(0)})`,
      lowerName: `하${lowerTri.name}(${lowerTri.element.charAt(0)})`,
      lines: originLines
    },
    changed: {
      id: changedHexId,
      nameKorean: changedInfo.nameKorean,
      nameHanji: changedInfo.nameHanji,
      desc: changedInfo.desc,
      upperName: `상${changedUpperTri.name}(${changedUpperTri.element.charAt(0)})`,
      lowerName: `하${changedLowerTri.name}(${changedLowerTri.element.charAt(0)})`,
      lines: changedLines
    },
    lineNum,
    lineText,
    harmonyText: `${yangCount}양 ${yinCount}음 음양 조화`,
    fortuneBadge: yangCount >= 3 ? '대길(大吉) 쾌조' : '길(吉) 유망'
  }
})

const copyToClipboard = () => {
  if (!navigator.clipboard) {
    alert('이 브라우저는 복사 기능을 지원하지 않습니다.')
    return
  }
  if (!result.value) return

  const hex = result.value.hexagram
  const detail = hexagramLinesDetail.value

  const shareText = `☯️ [일일운세.kr] I CHING ORACLE 주역점 결과 ☯️
--------------------------------------
● 선택한 고민: "${worry.value || '오늘 하루의 운세와 지혜'}"
● 본괘: 제${hex.id}괘 ${hex.nameKorean} (${hex.nameHanji})
● 변괘: 제${detail.changed.id}괘 ${detail.changed.nameKorean} (${detail.changed.nameHanji})
● 변효: ${detail.lineText}
● 괘사 요약: "${hex.summary}"

[핵심 요약]
"순풍에 돛을 올리듯, 바른 뜻으로 나아가면 크게 형통합니다"

--------------------------------------
나의 주역 괘 직접 점쳐보기: https://일일운세.kr/iching`

  navigator.clipboard.writeText(shareText)
    .then(() => alert('주역점 결과 보고서가 복사되었습니다! 카카오톡이나 SNS에 공유해보세요.'))
    .catch(err => console.error(err))
}
</script>

<template>
  <div class="bg-[#0B0E1B] min-h-screen text-[#D1D5DB] font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-lg mx-auto px-4 py-4 sm:py-6">

      <!-- 헤더 (첫 번째 이미지 1:1) -->
      <div class="flex items-center justify-between pb-3 border-b border-[#1E2640]/60 mb-4">
        <NuxtLink to="/" class="p-1.5 rounded-full bg-[#151C33] text-[#9CA3AF] hover:text-white transition-colors">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="text-center">
          <span class="text-[9px] font-bold tracking-widest text-[#E8C170] block uppercase">I CHING ORACLE</span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold text-white tracking-wide">
            주역점 결과
          </h1>
        </div>
        <button type="button" class="p-1.5 rounded-full text-[#9CA3AF] hover:text-white transition-colors">
          <UIcon name="i-heroicons-[#1E2640]" class="w-5 h-5 i-heroicons-bookmark" />
        </button>
      </div>

      <!-- ========================================== -->
      <!-- 단계 0: 질문 입력 박스 -->
      <!-- ========================================== -->
      <div v-if="currentStep === 0" class="bg-[#13192E] border border-[#212B4A] rounded-3xl p-5 sm:p-6 shadow-xl mb-6">
        <div class="text-center py-2 mb-4">
          <span class="inline-block px-3 py-1 rounded-full bg-[#E8C170]/10 border border-[#E8C170]/30 text-[#E8C170] text-xs font-bold font-serif-kr mb-2">
            ☯️ I CHING ORACLE
          </span>
          <h2 class="font-serif-kr text-xl font-bold text-white mb-2">
            풀어내고자 하는 고민을 떠올려보세요
          </h2>
          <p class="text-xs text-[#9CA3AF] max-w-xs mx-auto leading-relaxed font-light">
            주역 64괘의 괘사와 변효(動爻)가 당신의 고민에 전하는 처세와 지혜를 명확히 제시합니다.
          </p>
        </div>

        <div class="mb-5">
          <label for="worry-iching" class="block text-xs font-bold text-[#E8C170] mb-2 font-serif-kr">
            ❓ 질문 내용 (예: 새로운 일을 시작해도 될까요?)
          </label>
          <textarea
            id="worry-iching"
            v-model="worry"
            placeholder="마음속에 간절히 바라거나 판단이 필요한 고민을 입력해 보세요."
            rows="3"
            class="iching-textarea w-full py-3 px-4 bg-[#0A0D18] rounded-2xl focus:outline-hidden text-xs sm:text-sm resize-none"
          ></textarea>
        </div>

        <button
          type="button"
          class="w-full py-3.5 rounded-full font-bold text-sm text-[#0B0E1B] bg-linear-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 transition-all shadow-lg shadow-[#E8C170]/20 flex items-center justify-center gap-2"
          @click="startRitual"
        >
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-[#0B0E1B]" />
          주역 괘 도출하기 (3단계 드로우)
        </button>
      </div>

      <!-- ========================================== -->
      <!-- 단계 1 ~ 3: 3단계 대나무 점대 드로우 -->
      <!-- ========================================== -->
      <div v-if="currentStep >= 1 && currentStep <= 3" class="bg-[#13192E] border border-[#212B4A] rounded-3xl p-5 sm:p-6 shadow-xl mb-6">
        <div class="flex justify-between items-center mb-6 border-b border-[#212B4A] pb-4">
          <div>
            <span class="text-[10px] font-bold text-[#E8C170] tracking-wider uppercase block mb-0.5">TRADITIONAL DRAW</span>
            <h2 class="font-serif-kr text-base font-bold text-white">
              <span v-if="currentStep === 1">1단계: 하괘(下卦) 선택</span>
              <span v-if="currentStep === 2">2단계: 상괘(上卦) 선택</span>
              <span v-if="currentStep === 3">3단계: 동효(動爻) 선택</span>
            </h2>
          </div>
          <div class="flex gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" :class="currentStep >= 1 ? 'bg-[#E8C170]' : 'bg-[#253150]'"></span>
            <span class="w-2.5 h-2.5 rounded-full" :class="currentStep >= 2 ? 'bg-[#E8C170]' : 'bg-[#253150]'"></span>
            <span class="w-2.5 h-2.5 rounded-full" :class="currentStep >= 3 ? 'bg-[#E8C170]' : 'bg-[#253150]'"></span>
          </div>
        </div>

        <!-- 대나무 점대 보드 -->
        <div class="flex justify-center flex-wrap gap-2.5 py-4 max-w-md mx-auto">
          <div
            v-for="stick in sticks"
            :key="stick.stickId"
            @click="handleStickClick(stick)"
            class="relative cursor-pointer h-36 w-10 rounded-xl transition-all duration-500 transform hover:-translate-y-2 preserve-3d"
            :class="{ 'rotate-y-180': stick.isFlipped }"
          >
            <div class="absolute inset-0 bg-linear-to-b from-[#78350F] via-[#713F12] to-[#451A03] flex flex-col items-center justify-between py-3 border border-[#B45309]/50 rounded-xl shadow-lg backface-hidden z-10">
              <span class="text-[10px] text-[#FDE047]/40 select-none">☯</span>
              <div class="w-1 h-14 bg-[#451A03]/60 rounded-full"></div>
              <span class="text-[9px] text-[#FEF08A]/60 font-serif-kr">{{ stick.stickId }}</span>
            </div>

            <div class="absolute inset-0 bg-[#0A0D18] flex flex-col items-center justify-center p-1 border-2 border-[#E8C170] rounded-xl shadow-xl rotate-y-180 backface-hidden z-20 text-white">
              <template v-if="currentStep === 1 || currentStep === 2">
                <span class="text-xl text-[#FFDE9E] font-bold mb-0.5 select-none">{{ stick.trigram.symbol }}</span>
                <span class="text-xs font-bold font-serif-kr select-none">{{ stick.trigram.name }}</span>
              </template>
              <template v-else-if="currentStep === 3">
                <span class="text-base text-[#FFDE9E] font-serif-kr font-black select-none tracking-widest mb-1">{{ stick.lineSymbol }}</span>
                <span class="text-[9px] font-bold select-none text-center leading-tight">{{ stick.lineName }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- 단계 4: 로딩 화면 -->
      <!-- ========================================== -->
      <div v-if="currentStep === 4" class="bg-[#13192E] border border-[#212B4A] rounded-3xl p-8 sm:p-10 text-center shadow-xl mb-6">
        <div class="relative w-24 h-24 mx-auto flex items-center justify-center mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-dashed border-[#E8C170]/40 animate-spin" style="animation-duration: 6s;"></div>
          <div class="w-12 h-12 rounded-full bg-[#0A0D18] border border-[#E8C170]/40 flex items-center justify-center shadow-inner animate-pulse">
            <span class="seal-stamp text-xs px-2 py-0.5">易</span>
          </div>
        </div>
        <h3 class="font-serif-kr text-base font-bold text-white mb-1 animate-pulse">
          본괘와 변괘를 맞추는 중입니다...
        </h3>
      </div>

      <!-- ========================================== -->
      <!-- 단계 5: 주역점 결과 화면 (이미지 1:1 완벽 반영) -->
      <!-- ========================================== -->
      <div v-if="currentStep === 5 && result" class="space-y-4">

        <!-- 1. 질문 카드 (상단 인풋 요약) -->
        <div class="bg-[#13192E] border border-[#212B4A] rounded-2xl p-4 relative">
          <div class="flex justify-between items-start mb-2">
            <h2 class="font-serif-kr text-sm sm:text-base font-bold text-white leading-snug">
              "{{ worry || '새로운 일을 시작해도 될까요?' }}"
            </h2>
          </div>
          <div class="flex items-center justify-between text-[11px] text-[#9CA3AF]">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5 text-[#E8C170]" />
              갑진년 정월 초하루 · 2026.09.22 21:40
            </span>
            <span class="px-2 py-0.5 rounded-md bg-[#1C2642] text-[#E8C170] border border-[#2B395E] text-[10px]">
              문사 (問事)
            </span>
          </div>
        </div>

        <!-- 2. 본괘 & 변괘 6효 카드 (이미지 메인 1:1) -->
        <div class="bg-[#13192E] border border-[#212B4A] rounded-3xl p-5 shadow-2xl relative">
          <!-- 상단 뱃지 -->
          <div class="text-center mb-4">
            <span class="inline-block px-3 py-0.5 rounded-full bg-[#1C2642] border border-[#2D3A5F] text-[11px] text-[#FFDE9E] font-medium">
              ● 동효: 초구(初九) 변효 ✦
            </span>
          </div>

          <!-- 본괘 ➔ 변괘 대칭 디스플레이 -->
          <div class="grid grid-cols-2 gap-4 items-center mb-5 relative">

            <!-- 본괘 (Origin) -->
            <div class="bg-[#0A0E1A] border border-[#1E2844] rounded-2xl p-3.5 text-center">
              <span class="text-[10px] text-[#E8C170] font-bold block mb-1">본괘 [本卦]</span>
              <h3 class="font-serif-kr text-base font-extrabold text-white mb-0.5">
                제{{ hexagramLinesDetail.origin.id }}괘 {{ hexagramLinesDetail.origin.nameKorean }}
              </h3>
              <p class="text-[10px] text-[#9CA3AF] mb-3">{{ hexagramLinesDetail.origin.desc }}</p>

              <!-- 6효 그리기 (상효 ~ 초효: 아래에서 위로) -->
              <div class="space-y-1.5 max-w-25 mx-auto mb-3">
                <div
                  v-for="(val, index) in [...hexagramLinesDetail.origin.lines].reverse()"
                  :key="index"
                  class="h-2 rounded flex items-center justify-between overflow-hidden relative"
                  :class="6 - index === hexagramLinesDetail.lineNum ? 'ring-1 ring-[#E8C170]' : ''"
                >
                  <!-- 양효 (1): 통 줄 -->
                  <template v-if="val === 1">
                    <div class="w-full h-full bg-[#93C5FD] rounded-sm shadow-sm" :class="6 - index === hexagramLinesDetail.lineNum ? 'bg-[#FDE047]' : ''"></div>
                  </template>
                  <!-- 음효 (0): 두 갈래 -->
                  <template v-else>
                    <div class="w-[45%] h-full bg-[#93C5FD] rounded-sm" :class="6 - index === hexagramLinesDetail.lineNum ? 'bg-[#FDE047]' : ''"></div>
                    <div class="w-[45%] h-full bg-[#93C5FD] rounded-sm" :class="6 - index === hexagramLinesDetail.lineNum ? 'bg-[#FDE047]' : ''"></div>
                  </template>
                </div>
              </div>

              <span class="text-[9px] text-[#6B7280] font-serif-kr block">
                {{ hexagramLinesDetail.origin.upperName }} · {{ hexagramLinesDetail.origin.lowerName }}
              </span>
            </div>

            <!-- 변효 화살표 (중앙) -->
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#13192E] p-1 rounded-full text-[#E8C170] border border-[#212B4A]">
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </div>

            <!-- 변괘 (Changed) -->
            <div class="bg-[#0A0E1A] border border-[#1E2844] rounded-2xl p-3.5 text-center">
              <span class="text-[10px] text-[#E8C170] font-bold block mb-1">변괘 [變卦]</span>
              <h3 class="font-serif-kr text-base font-extrabold text-white mb-0.5">
                제{{ hexagramLinesDetail.changed.id }}괘 {{ hexagramLinesDetail.changed.nameKorean }}
              </h3>
              <p class="text-[10px] text-[#9CA3AF] mb-3">{{ hexagramLinesDetail.changed.desc }}</p>

              <!-- 6효 그리기 -->
              <div class="space-y-1.5 max-w-25 mx-auto mb-3">
                <div
                  v-for="(val, index) in [...hexagramLinesDetail.changed.lines].reverse()"
                  :key="index"
                  class="h-2 rounded flex items-center justify-between overflow-hidden"
                >
                  <template v-if="val === 1">
                    <div class="w-full h-full bg-[#93C5FD] rounded-sm"></div>
                  </template>
                  <template v-else>
                    <div class="w-[45%] h-full bg-[#93C5FD] rounded-sm"></div>
                    <div class="w-[45%] h-full bg-[#93C5FD] rounded-sm"></div>
                  </template>
                </div>
              </div>

              <span class="text-[9px] text-[#6B7280] font-serif-kr block">
                {{ hexagramLinesDetail.changed.upperName }} · {{ hexagramLinesDetail.changed.lowerName }}
              </span>
            </div>
          </div>

          <!-- 하단 요약 정보 -->
          <div class="flex justify-between items-center px-2 pt-2 border-t border-[#1E2844] text-[11px]">
            <span class="text-[#9CA3AF]">{{ hexagramLinesDetail.harmonyText }}</span>
            <span class="text-[#FFDE9E] font-bold">{{ hexagramLinesDetail.fortuneBadge }}</span>
          </div>
        </div>

        <!-- 3. 괘도 핵심 요약 (이미지 1:1) -->
        <div class="bg-[#13192E] border border-[#212B4A] rounded-2xl p-5 shadow-lg">
          <div class="flex items-center gap-1.5 text-xs text-[#E8C170] font-bold mb-2">
            <UIcon name="i-heroicons-share" class="w-4 h-4" />
            괘도 핵심 요약
          </div>
          <h2 class="font-serif-kr text-base sm:text-lg font-bold text-[#FFE5A3] mb-2 leading-snug">
            "순풍에 돛을 올리듯, 바른 뜻으로 나아가면 크게 형통합니다"
          </h2>
          <p class="text-xs text-[#D1D5DB] font-light leading-relaxed">
            {{ result.hexagram.nameKorean }}({{ result.hexagram.nameHanji }})는 하늘의 기운이 땅으로 내려오고 땅의 기운이 하늘로 올라 조화롭게 합파되는 최상의 괘상입니다. 바닥부터 차근히 기반을 다지면 점차 결실에 도달합니다.
          </p>
        </div>

        <!-- 4. 고전 원문 심층 풀이 (아코디언, 이미지 1:1) -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-[#E8C170] flex items-center gap-1 px-1 font-serif-kr">
            ✦ 고전 원문 심층 풀이
          </span>

          <div class="iching-accordion-box bg-[#13192E] rounded-2xl overflow-hidden">
            <!-- 아코디언 1: 괘사 본괘 총론 -->
            <div>
              <button
                type="button"
                @click="toggleAccordion('total')"
                class="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-white hover:bg-[#1A223B] transition-colors"
              >
                <span class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-[#1C2642] text-[#E8C170] text-[10px]">괘사 (卦辭)</span>
                  {{ result.hexagram.nameKorean }} 본괘 총론
                </span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 text-[#9CA3AF] transition-transform"
                  :class="accordionOpen.total ? 'rotate-180' : ''"
                />
              </button>
              <div v-if="accordionOpen.total" class="p-4 pt-0 text-xs text-[#D1D5DB] font-serif-kr space-y-2 leading-relaxed">
                <p class="text-[#FFDE9E] font-bold">泰，小往大來，吉亨。</p>
                <p class="font-sans-kr font-light">
                  "태(泰)는 작은 것이 가고 큰 것이 오니, 길하고 형통하리라."
                </p>
                <p class="font-sans-kr font-light text-[#9CA3AF]">
                  불안했던 여건이 물러가고 안정과 희망의 새로운 국면이 열리는 시기입니다. 긍정적인 마음으로 도전을 감행해도 좋은 때입니다.
                </p>
              </div>
            </div>

            <!-- 아코디언 2: 효사 초구 동효의 가르침 -->
            <div>
              <button
                type="button"
                @click="toggleAccordion('line')"
                class="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-white hover:bg-[#1A223B] transition-colors"
              >
                <span class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-[#1C2642] text-[#E8C170] text-[10px]">효사 (爻辭)</span>
                  {{ hexagramLinesDetail.lineText }}의 가르침
                </span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 text-[#9CA3AF] transition-transform"
                  :class="accordionOpen.line ? 'rotate-180' : ''"
                />
              </button>
              <div v-if="accordionOpen.line" class="p-4 pt-0 text-xs text-[#D1D5DB] font-serif-kr space-y-2 leading-relaxed">
                <p class="text-[#FFDE9E] font-bold">初九，拔茅茹，以其彙，征吉。</p>
                <p class="font-sans-kr font-light">
                  "초구는 띠풀 뿌리를 뽑음에 엉킨 풀 함께 뽑힘이니, 뜻을 같이 하는 이들과 나아가면 길하리라."
                </p>
                <p class="font-sans-kr font-light text-[#9CA3AF]">
                  혼자 외롭게 일하지 마시고, 가치관이 맞는 동업자·동료와 유기적으로 연대할 때 더 큰 시너지와 안정을 얻게 됩니다.
                </p>
              </div>
            </div>

            <!-- 아코디언 3: 상전 대자연의 형상과 리더십 -->
            <div>
              <button
                type="button"
                @click="toggleAccordion('symbol')"
                class="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-white hover:bg-[#1A223B] transition-colors"
              >
                <span class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-[#1C2642] text-[#E8C170] text-[10px]">상전 (象傳)</span>
                  대자연의 형상과 리더십
                </span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 text-[#9CA3AF] transition-transform"
                  :class="accordionOpen.symbol ? 'rotate-180' : ''"
                />
              </button>
              <div v-if="accordionOpen.symbol" class="p-4 pt-0 text-xs text-[#D1D5DB] font-sans-kr font-light leading-relaxed">
                하늘과 땅이 교감하듯, 조직이나 서체에서 위아래 소통을 원활히 하고 순응하는 리더십을 발휘할 때 만사가 평온해집니다.
              </div>
            </div>
          </div>
        </div>

        <!-- 5. 영역별 흐름 가이드 (이미지 1:1) -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-[#E8C170] flex items-center gap-1 px-1">
            ✦ 영역별 흐름 가이드
          </span>

          <div class="grid grid-cols-2 gap-2.5">
            <div class="bg-[#13192E] border border-[#212B4A] rounded-2xl p-3.5">
              <div class="flex justify-between items-center mb-1">
                <h4 class="font-serif-kr text-xs font-bold text-white">일 · 사업</h4>
                <span class="px-2 py-0.5 rounded bg-[#065F46] text-[#A7F3D0] text-[9px] font-bold">상승 ▲</span>
              </div>
              <p class="text-[11px] text-[#9CA3AF] font-light">
                협력자와 함께 도모할 때 예상치 못한 성과가 보장됩니다.
              </p>
            </div>

            <div class="bg-[#13192E] border border-[#212B4A] rounded-2xl p-3.5">
              <div class="flex justify-between items-center mb-1">
                <h4 class="font-serif-kr text-xs font-bold text-white">재물 · 투자</h4>
                <span class="px-2 py-0.5 rounded bg-[#065F46] text-[#A7F3D0] text-[9px] font-bold">상승 ▲</span>
              </div>
              <p class="text-[11px] text-[#9CA3AF] font-light">
                새로운 계약과 장기 계획에 순풍이 깃드는 흐름입니다.
              </p>
            </div>

            <div class="bg-[#13192E] border border-[#212B4A] rounded-2xl p-3.5">
              <div class="flex justify-between items-center mb-1">
                <h4 class="font-serif-kr text-xs font-bold text-white">인간관계</h4>
                <span class="px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] text-[9px] font-bold">유지 ▶</span>
              </div>
              <p class="text-[11px] text-[#9CA3AF] font-light">
                오랜 오해가 풀리고 뜻이 맞는 귀인을 만나게 됩니다.
              </p>
            </div>

            <div class="bg-[#13192E] border border-[#212B4A] rounded-2xl p-3.5">
              <div class="flex justify-between items-center mb-1">
                <h4 class="font-serif-kr text-xs font-bold text-white">심신 건강</h4>
                <span class="px-2 py-0.5 rounded bg-[#854D0E] text-[#FEF08A] text-[9px] font-bold">주의 ●</span>
              </div>
              <p class="text-[11px] text-[#9CA3AF] font-light">
                기운이 넓으나 의욕 과다로 인한 피로를 주의하세요.
              </p>
            </div>
          </div>
        </div>

        <!-- 6. 지금 취해야 할 3가지 자세 (處世) (이미지 1:1) -->
        <div class="bg-linear-to-b from-[#1C2642] to-[#13192E] border border-[#212B4A] rounded-2xl p-5 shadow-lg">
          <div class="flex items-center gap-1.5 text-xs font-bold text-white mb-3">
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-[#E8C170]" />
            지금 취해야 할 3가지 자세 (處世)
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <div>
                <strong class="text-[#FFDE9E]">연대와 협업:</strong>
                <span class="text-[#D1D5DB] font-light"> 단독적인 진행보다는 뜻을 함께하는 동료나 멘토와 연대하세요.</span>
              </div>
            </div>

            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <div>
                <strong class="text-[#FFDE9E]">기반 다지기:</strong>
                <span class="text-[#D1D5DB] font-light"> 첫 단추를 꾈 때 기초 계획과 약속을 투명하게 다지세요.</span>
              </div>
            </div>

            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <div>
                <strong class="text-[#FFDE9E]">순리 존중:</strong>
                <span class="text-[#D1D5DB] font-light"> 조급해하지 말고 순리대로 작은 걸음부터 밝아나가세요.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 7. 버튼 영역 (이미지 1:1) -->
        <div class="space-y-2.5 pt-2">
          <button
            type="button"
            class="w-full py-3.5 rounded-full font-bold text-xs sm:text-sm text-[#0B0E1B] bg-linear-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 transition-all shadow-xl shadow-[#E8C170]/20 flex items-center justify-center gap-2"
            @click="copyToClipboard"
          >
            <UIcon name="i-heroicons-bookmark" class="w-4 h-4 text-[#0B0E1B]" />
            결과 저장하기 (클립보드 복사)
          </button>

          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 py-3 rounded-full bg-[#17203A] border border-[#27345B] text-xs font-semibold text-[#D1D5DB] hover:text-white hover:border-[#E8C170] transition-colors flex items-center justify-center gap-1.5"
              @click="resetAll"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-[#E8C170]" />
              다시 점치기
            </button>
            <button
              type="button"
              class="p-3 rounded-full bg-[#17203A] border border-[#27345B] text-xs font-semibold text-[#D1D5DB] hover:text-white transition-colors flex items-center justify-center"
              @click="copyToClipboard"
            >
              <UIcon name="i-heroicons-share" class="w-4 h-4 text-[#E8C170]" />
            </button>
          </div>
        </div>

        <!-- 하단 가이드 문구 -->
        <p class="text-center text-[10px] text-[#6B7280] py-3 leading-relaxed">
          ※ 주역점은 삶의 지혜와 마음을 가다듬기 위한 참고용이며, 최종 선택과 판단은 스스로 내려보세요.
        </p>

      </div>

    </div>

    <!-- 하단 탭바 (첫 번째 이미지 1:1) -->
    <div class="fixed bottom-0 left-0 right-0 bg-[#0B0E1B]/95 backdrop-blur-md border-t border-[#1E2640] z-50 py-2">
      <div class="max-w-md sm:max-w-lg mx-auto grid grid-cols-4 text-center px-4">
        <NuxtLink
          to="/saju"
          class="flex flex-col items-center gap-1 py-1 text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
        >
          <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
          <span class="text-[10px] font-medium">오늘</span>
        </NuxtLink>

        <button
          type="button"
          @click="activeTab = 'iching'"
          class="flex flex-col items-center gap-1 py-1 transition-colors text-[#E8C170]"
        >
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
          <span class="text-[10px] font-medium">주역</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'record'"
          class="flex flex-col items-center gap-1 py-1 text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
        >
          <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
          <span class="text-[10px] font-medium">기록</span>
        </button>

        <NuxtLink
          to="/saju"
          class="flex flex-col items-center gap-1 py-1 text-[#6B7280] hover:text-[#9CA3AF] transition-colors"
        >
          <UIcon name="i-heroicons-user" class="w-5 h-5" />
          <span class="text-[10px] font-medium">내 정보</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iching-textarea {
  border: 1px solid #28355A;
  color: #ffffff;
}
.iching-textarea:focus {
  border-color: #E8C170;
}
.iching-textarea::placeholder {
  color: #4B5563;
}

.iching-accordion-box {
  border: 1px solid #212B4A;
}
.iching-accordion-box > div + div {
  border-top: 1px solid #1E2844;
}

.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
