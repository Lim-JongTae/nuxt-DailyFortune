<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'

useSeoMeta({
  title: '일일 사주명리 - 오늘의 운세 | 일일운세.kr',
  description: '생년월일시를 입력하여 나만의 일간(日干)과 오늘 일진의 십신 조화를 분석하고 맞춤 AI 사주 리포트를 확인하세요.'
})

const store = useFortuneStore()
const {
  birthDate,
  birthTime,
  noTime,
  gender,
  sajuWorry: worry,
  sajuResult: result
} = storeToRefs(store)

const birthYear = ref('')
const birthMonth = ref('')
const birthDay = ref('')
const activeTab = ref('today')

const zodiacZhi = [
  { name: '자 쥐띠', animal: '🐭', branchIdx: 0 },
  { name: '축 소띠', animal: '🐮', branchIdx: 1 },
  { name: '인 호랑이띠', animal: '🐯', branchIdx: 2 },
  { name: '묘 토끼띠', animal: '🐰', branchIdx: 3 },
  { name: '진 용띠', animal: '🐲', branchIdx: 4 },
  { name: '사 뱀띠', animal: '🐍', branchIdx: 5 },
  { name: '오 말띠', animal: '🐴', branchIdx: 6 },
  { name: '미 양띠', animal: '🐑', branchIdx: 7 },
  { name: '신 원숭이띠', animal: '🐒', branchIdx: 8 },
  { name: '유 닭띠', animal: '🐔', branchIdx: 9 },
  { name: '술 개띠', animal: '🐶', branchIdx: 10 },
  { name: '해 돼지띠', animal: '🐷', branchIdx: 11 }
]

const userZodiacInfo = computed(() => {
  const y = birthYear.value ? parseInt(birthYear.value, 10) : 1965
  if (Number.isNaN(y)) return { fullName: '을사', animal: '🐍', zodiacName: '1965년 을사년 뱀띠', branchIdx: 5 }

  const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"]
  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"]
  const animals = ["쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠", "원숭이띠", "닭띠", "개띠", "돼지띠"]
  const emoji = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐒", "🐔", "🐶", "🐷"]

  let sIdx = (y - 4) % 10
  if (sIdx < 0) sIdx += 10
  let bIdx = (y - 4) % 12
  if (bIdx < 0) bIdx += 12

  const fullName = `${stems[sIdx]}${branches[bIdx]}`
  return {
    year: y,
    fullName,
    animal: emoji[bIdx]!,
    zodiacName: `${y}년 ${fullName}년 ${animals[bIdx]}`,
    branchIdx: bIdx
  }
})

const getWesternAge = (y: number, m: number, d: number): number => {
  const today = new Date()
  let age = today.getFullYear() - y
  const monthDiff = today.getMonth() - (m - 1)
  const dayDiff = today.getDate() - d
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--
  return age
}

const sajuDateSchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31)
}).refine((data) => {
  const date = new Date(data.year, data.month - 1, data.day)
  return date.getFullYear() === data.year &&
         date.getMonth() === data.month - 1 &&
         date.getDate() === data.day
}, { message: '존재하지 않는 날짜입니다.' })

const errors = ref({ year: false, month: false, day: false })

const validateInputs = () => {
  errors.value = { year: false, month: false, day: false }
  const y = birthYear.value ? parseInt(birthYear.value, 10) : NaN
  const m = birthMonth.value ? parseInt(birthMonth.value, 10) : NaN
  const d = birthDay.value ? parseInt(birthDay.value, 10) : NaN

  if (birthYear.value && !Number.isNaN(y)) {
    const yearParsed = z.number().int().min(1900).max(new Date().getFullYear()).safeParse(y)
    if (!yearParsed.success) errors.value.year = true
  }
  if (birthMonth.value && !Number.isNaN(m)) {
    const monthParsed = z.number().int().min(1).max(12).safeParse(m)
    if (!monthParsed.success) errors.value.month = true
  }
  if (birthDay.value && !Number.isNaN(d)) {
    const dayParsed = z.number().int().min(1).max(31).safeParse(d)
    if (!dayParsed.success) errors.value.day = true
  }

  if (birthYear.value && birthMonth.value && birthDay.value &&
      !errors.value.year && !errors.value.month && !errors.value.day &&
      !Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
    const fullParsed = sajuDateSchema.safeParse({ year: y, month: m, day: d })
    if (!fullParsed.success) errors.value.day = true
    else {
      const age = getWesternAge(y, m, d)
      if (age < 15) errors.value.year = errors.value.month = errors.value.day = true
    }
  }
}

watch(birthYear, (newYear) => {
  if (newYear && String(newYear).length >= 4) {
    const parsedY = parseInt(String(newYear), 10)
    const limitYear = new Date().getFullYear() - 15
    if (!Number.isNaN(parsedY) && parsedY > limitYear) {
      alert(`만 15세 미만은 일일 사주를 조회할 수 없습니다. (${limitYear}년 이전 출생자만 가능)`)
      setTimeout(() => { birthYear.value = '' }, 0)
    }
  }
})

watch([birthYear, birthMonth, birthDay], () => { validateInputs() })

const loading = ref(false)

onMounted(() => {
  store.loadFromLocalStorage()
  if (birthDate.value && birthDate.value.includes('-')) {
    const [y, m, d] = birthDate.value.split('-')
    birthYear.value = y || ''
    birthMonth.value = m ? String(parseInt(m, 10)) : ''
    birthDay.value = d ? String(parseInt(d, 10)) : ''
  }
})

watch([birthDate, birthTime, noTime, gender, worry], () => {
  store.saveToLocalStorage()
})

watch(noTime, (val) => {
  if (val) birthTime.value = ''
})

const startSajuFortune = async () => {
  if (!birthYear.value || !birthMonth.value || !birthDay.value) {
    alert('태어난 날짜(연, 월, 일)를 모두 입력해 주세요.')
    return
  }

  const y = parseInt(birthYear.value, 10)
  const m = parseInt(birthMonth.value, 10)
  const d = parseInt(birthDay.value, 10)

  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
    alert('태어난 날짜 정보가 올바른 숫자가 아닙니다.')
    return
  }

  const age = getWesternAge(y, m, d)
  if (age < 15) {
    alert(`만 15세 미만은 일일 사주를 조회할 수 없습니다.`)
    return
  }

  const dateObj = new Date(y, m - 1, d)
  if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
    alert('존재하지 않는 날짜입니다.')
    return
  }

  const yearStr = String(birthYear.value).padStart(4, '0')
  const monthStr = String(birthMonth.value).padStart(2, '0')
  const dayStr = String(birthDay.value).padStart(2, '0')
  birthDate.value = `${yearStr}-${monthStr}-${dayStr}`

  loading.value = true
  result.value = null

  const startTime = Date.now()

  try {
    const res: any = await $fetch('/api/fortune/saju', {
      method: 'POST',
      body: {
        birthDate: birthDate.value,
        birthTime: birthTime.value,
        gender: gender.value,
        worry: worry.value
      }
    })

    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(2000 - elapsedTime, 0)

    setTimeout(() => {
      if (res.success) {
        result.value = res
        store.saveToLocalStorage()
      } else {
        alert(res.error || '오류가 발생했습니다.')
      }
      loading.value = false
    }, remainingTime)

  } catch (error) {
    console.error(error)
    alert('서버 연결 중 오류가 발생했습니다.')
    loading.value = false
  }
}

const onNotifyReservation = () => {
  if (typeof window !== 'undefined') {
    window.alert('내일 새벽 운세 알림이 등록되었습니다!')
  }
}

const copyToClipboard = () => {
  if (!navigator.clipboard) {
    alert('이 브라우저는 복사 기능을 지원하지 않습니다.')
    return
  }
  if (!result.value) return

  const user = result.value.userSaju
  const today = result.value.todaySaju

  const plainText = result.value.aiInterpretation
    .replace(/\*\*/g, '')
    .replace(/### /g, '■ ')
    .replace(/## /g, '◈ ')

  const shareText = `🔮 [일일운세.kr] 오늘의 사주명리 분석 보고서 🔮
--------------------------------------
● 내 일간: ${user.ilgan} (${user.ilganElement})
● 오늘의 일진: ${today.ganzhi}일 (${today.shipsin}의 날)
● 운세 지수: ${sajuScores.value.totalScore}점 (${sajuScores.value.rankText})

${plainText}

--------------------------------------
내 일일 사주 직접 보기: https://일일운세.kr/saju`

  navigator.clipboard.writeText(shareText)
    .then(() => alert('오늘의 사주명리 결과 보고서가 복사되었습니다. 카카오톡이나 SNS에 공유해 보세요!'))
    .catch(err => console.error(err))
}

const sajuScores = computed(() => {
  if (!result.value) {
    return {
      totalScore: 87,
      rankText: '상위 4% 대길(大吉)',
      wealthScore: 85,
      loveScore: 92,
      healthScore: 78,
      businessScore: 90,
      strokeDash: 260
    }
  }

  const ilgan = result.value.userSaju?.ilgan || '갑'
  const charCode = ilgan.charCodeAt(0)
  const totalScore = Math.min(98, Math.max(72, (charCode % 20) + 78))

  let rankText = '상위 8% 길(吉)'
  if (totalScore >= 90) rankText = '상위 3% 대길(大吉)'
  else if (totalScore >= 85) rankText = '상위 4% 대길(大吉)'
  else if (totalScore >= 80) rankText = '상위 10% 중길(中吉)'

  const wealthScore = Math.min(98, Math.max(70, ((charCode * 3) % 20) + 78))
  const loveScore = Math.min(98, Math.max(70, ((charCode * 7) % 20) + 80))
  const healthScore = Math.min(98, Math.max(70, ((charCode * 5) % 20) + 72))
  const businessScore = Math.min(98, Math.max(70, ((charCode * 9) % 20) + 80))

  const strokeDash = Math.round(283 * (1 - totalScore / 100))

  return {
    totalScore,
    rankText,
    wealthScore,
    loveScore,
    healthScore,
    businessScore,
    strokeDash
  }
})

const formattedInterpretation = computed(() => {
  if (!result.value?.aiInterpretation) return ''

  let text = result.value.aiInterpretation

  text = text.replace(/^### (.*$)/gim, '<h3 class="text-[#FFDE9E] text-base sm:text-lg font-serif-kr font-bold mt-6 mb-3 border-b border-[#2D3958] pb-2 flex items-center gap-2"><span class="w-1.5 h-4 bg-[#E8C170] rounded-sm"></span>$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2 class="text-lg sm:text-xl font-serif-kr font-extrabold text-[#FFE5A3] mt-7 mb-3 border-l-4 border-[#E8C170] pl-3">$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h1 class="text-xl sm:text-2xl font-serif-kr font-extrabold text-white mt-8 mb-4">$1</h1>')

  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#FFDE9E]">$1</strong>')
  text = text.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-[#CBD5E1] my-1.5 text-xs sm:text-sm">$1</li>')

  const lines = text.split('\n')
  return lines.map((line: string) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed === '') return line
    return `<p class="text-[#CBD5E1] leading-relaxed my-2 text-xs sm:text-sm font-light">${line}</p>`
  }).join('\n')
})
</script>

<template>
  <div class="bg-[#0B0F1D] min-h-screen text-[#E2E8F0] font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-lg mx-auto px-4 py-4 sm:py-6">

      <!-- 1. 최상단 날짜 & 헤더 바 (이미지 2 1:1 완벽 반영) -->
      <div class="flex items-center justify-between py-2 border-b border-[#1E2942]/60 mb-4">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="p-1.5 rounded-full bg-[#161F38] text-[#94A3B8] hover:text-white transition-colors">
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          </NuxtLink>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="font-serif-kr text-base sm:text-lg font-bold text-white tracking-tight">
                갑진년 정월 초하루날
              </h1>
              <span class="text-[#E8C170] text-xs font-bold">+</span>
            </div>
            <p class="text-[11px] text-[#94A3B8] font-light">
              9월 21일 월요일 · 음력 8월 10일
            </p>
          </div>
        </div>

        <button type="button" class="p-2 rounded-full text-[#94A3B8] hover:text-white transition-colors">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
        </button>
      </div>

      <!-- 서브 헤더 탭 / 명식 바 -->
      <div class="flex items-center justify-between text-xs text-[#94A3B8] mb-3 px-1 font-medium">
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#E8C170]"></span>
          십이지신 및 명식
        </span>
        <button type="button" @click="store.clearSaju()" class="text-xs text-[#E8C170]/80 hover:text-[#E8C170] underline underline-offset-2">
          내 사주 변경
        </button>
      </div>

      <!-- 십이지신/띠 수평 칩 슬라이더 -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        <!-- 동적 계산된 내 띠 칩 (가장 앞에 강조 표시) -->
        <button
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-serif-kr flex items-center gap-1.5 transition-all bg-linear-to-r from-[#FFE5A3]/25 to-[#E8C170]/35 border border-[#E8C170] text-[#FFDE9E] shadow-sm font-bold"
        >
          <span>{{ userZodiacInfo.animal }}</span>
          <span>{{ userZodiacInfo.zodiacName }}</span>
        </button>

        <!-- 일반 띠 칩 목록 -->
        <button
          v-for="z in zodiacZhi.filter(item => item.branchIdx !== userZodiacInfo.branchIdx)"
          :key="z.branchIdx"
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-full text-xs font-serif-kr flex items-center gap-1.5 transition-all bg-[#151C33] border border-[#253150] text-[#94A3B8] hover:border-[#3B4C78]"
        >
          <span>{{ z.animal }}</span>
          <span>{{ z.name }}</span>
        </button>
      </div>

      <!-- ========================================== -->
      <!-- 생년월일시 입력 폼 (결과가 없을 때) -->
      <!-- ========================================== -->
      <div v-if="!result && !loading" class="bg-[#151C33] border border-[#232E4A] rounded-3xl p-5 sm:p-6 shadow-xl mb-6">
        <div class="text-center py-2 mb-4">
          <span class="inline-block px-3 py-1 rounded-full bg-[#E8C170]/10 border border-[#E8C170]/30 text-[#E8C170] text-xs font-bold font-serif-kr mb-2">
            🔮 일일 사주명리
          </span>
          <h2 class="font-serif-kr text-xl sm:text-2xl font-bold text-white mb-2">
            오늘 나의 명식과 일진 분석
          </h2>
          <p class="text-xs text-[#94A3B8] max-w-xs mx-auto leading-relaxed font-light">
            태어난 연월일시를 입력하면 본인의 일간(日干)과 오늘 일진의 십신 상호작용을 정밀 계산합니다.
          </p>
        </div>

        <div class="space-y-4">
          <!-- 성별 선택 -->
          <div>
            <label class="block text-xs font-bold text-[#E8C170] mb-2 font-serif-kr">성별</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                class="py-2.5 rounded-xl border text-xs font-bold transition-all"
                :class="gender === 'male' ? 'bg-[#1C2646] border-[#E8C170] text-[#FFDE9E]' : 'bg-[#0E1325] border-[#232E4A] text-[#94A3B8]'"
                @click="gender = 'male'"
              >
                남성 (陽)
              </button>
              <button
                type="button"
                class="py-2.5 rounded-xl border text-xs font-bold transition-all"
                :class="gender === 'female' ? 'bg-[#1C2646] border-[#E8C170] text-[#FFDE9E]' : 'bg-[#0E1325] border-[#232E4A] text-[#94A3B8]'"
                @click="gender = 'female'"
              >
                여성 (陰)
              </button>
            </div>
          </div>

          <!-- 태어난 날짜 -->
          <div>
            <label class="block text-xs font-bold text-[#E8C170] mb-2 font-serif-kr">태어난 날짜 (양력 기준)</label>
            <div class="flex gap-2">
              <input
                v-model="birthYear"
                type="number"
                placeholder="년(YYYY)"
                class="saju-input flex-1 py-2.5 px-3 rounded-xl text-xs text-center"
              />
              <input
                v-model="birthMonth"
                type="number"
                placeholder="월"
                class="saju-input w-20 py-2.5 px-3 rounded-xl text-xs text-center"
              />
              <input
                v-model="birthDay"
                type="number"
                placeholder="일"
                class="saju-input w-20 py-2.5 px-3 rounded-xl text-xs text-center"
              />
            </div>
          </div>

          <!-- 태어난 시간 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-[#E8C170] font-serif-kr">태어난 시각</label>
              <label class="flex items-center gap-1.5 text-xs text-[#94A3B8] cursor-pointer">
                <input type="checkbox" v-model="noTime" class="rounded border-[#2D3958] text-[#E8C170]" />
                시간 모름
              </label>
            </div>
            <input
              v-model="birthTime"
              type="time"
              :disabled="noTime"
              class="saju-input w-full py-2.5 px-4 rounded-xl text-xs disabled:opacity-40"
            />
          </div>

          <!-- 고민 질문 -->
          <div>
            <label for="worry-saju" class="block text-xs font-bold text-[#E8C170] mb-2 font-serif-kr">
              오늘의 특정 고민이나 운세 질문 (선택)
            </label>
            <textarea
              id="worry-saju"
              v-model="worry"
              placeholder="예: 오늘 중요한 조율이 있는데 금전운 흐름이 어떨까요?"
              rows="2"
              class="saju-input w-full py-2.5 px-4 rounded-xl text-xs resize-none"
            ></textarea>
          </div>

          <button
            type="button"
            class="w-full py-3.5 rounded-full font-bold text-sm text-[#0F1226] bg-linear-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 transition-all shadow-lg shadow-[#E8C170]/20 flex items-center justify-center gap-2"
            @click="startSajuFortune"
          >
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-[#0F1226]" />
            오늘의 사주명리 분석 시작
          </button>
        </div>
      </div>

      <!-- 로딩 화면 -->
      <div v-if="loading" class="bg-[#151C33] border border-[#232E4A] rounded-3xl p-8 sm:p-10 text-center shadow-xl mb-6">
        <div class="relative w-28 h-28 mx-auto flex items-center justify-center mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-dashed border-[#E8C170]/40 animate-spin" style="animation-duration: 7s;"></div>
          <div class="w-14 h-14 rounded-full bg-[#0E1325] border border-[#E8C170]/40 flex items-center justify-center shadow-inner animate-pulse">
            <span class="seal-stamp text-xs px-2 py-0.5">命</span>
          </div>
        </div>
        <h3 class="font-serif-kr text-lg font-bold text-white mb-2 animate-pulse">
          천간지지의 기운을 분석하는 중입니다...
        </h3>
      </div>

      <!-- ========================================== -->
      <!-- 사주 결과 노출 화면 -->
      <div v-if="result" class="space-y-4">

        <!-- 1. 내 명식 요약 지표 (1965년생 을사년 뱀띠 연동) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#151C33] border border-[#232E4A] rounded-2xl p-3 text-center text-xs">
          <div class="bg-[#0E1325] p-2 rounded-xl border border-[#1E2942]">
            <span class="text-[10px] text-[#94A3B8] block mb-0.5">내 출생년도 / 띠</span>
            <strong class="text-xs text-[#FFDE9E] font-serif-kr block truncate">
              {{ result.userSaju?.zodiacName || userZodiacInfo.zodiacName }}
            </strong>
          </div>
          <div class="bg-[#0E1325] p-2 rounded-xl border border-[#1E2942]">
            <span class="text-[10px] text-[#94A3B8] block mb-0.5">내 일간(태어난 날)</span>
            <strong class="text-xs text-white font-serif-kr block">
              {{ result.userSaju?.ilgan }} ({{ result.userSaju?.ilganElement }})
            </strong>
          </div>
          <div class="bg-[#0E1325] p-2 rounded-xl border border-[#1E2942]">
            <span class="text-[10px] text-[#94A3B8] block mb-0.5">태어난 시지</span>
            <strong class="text-xs text-white font-serif-kr block">
              {{ result.userSaju?.siji }}시
            </strong>
          </div>
          <div class="bg-[#0E1325] p-2 rounded-xl border border-[#1E2942]">
            <span class="text-[10px] text-[#94A3B8] block mb-0.5">오늘의 일진</span>
            <strong class="text-xs text-[#E8C170] font-serif-kr block">
              {{ result.todaySaju?.ganzhi }}일 ({{ result.todaySaju?.shipsin }})
            </strong>
          </div>
        </div>

        <!-- 2. 중앙 종합 점수 & 원형 게이지 링 카드 -->
        <div class="bg-[#151C33] border border-[#232E4A] rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl">
          <!-- 상단 뱃지 -->
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2646] border border-[#2D3B66] text-[11px] font-semibold text-[#FFDE9E] mb-5">
            <span class="w-1.5 h-1.5 rounded-full bg-[#E8C170]"></span>
            오늘의 천기누설 · 총평 ✦
          </div>

          <!-- 원형 프로그레스 게이지 (Score Circle Gauge) -->
          <div class="relative w-44 h-44 mx-auto mb-5 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#1E2846" stroke-width="6" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="url(#goldGradientSaju)"
                stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="283"
                :stroke-dashoffset="sajuScores.strokeDash"
                class="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="goldGradientSaju" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFE5A3" />
                  <stop offset="50%" stop-color="#E8C170" />
                  <stop offset="100%" stop-color="#D49E35" />
                </linearGradient>
              </defs>
            </svg>

            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-[11px] text-[#94A3B8] font-light mb-0.5">운세 지수</span>
              <div class="flex items-baseline gap-0.5">
                <span class="text-3xl font-extrabold font-serif-kr text-white tracking-tight">
                  {{ sajuScores.totalScore }}
                </span>
                <span class="text-xs text-[#E8C170] font-bold">점</span>
              </div>
              <span class="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#1C2646] text-[#FFDE9E] border border-[#2D3958]">
                {{ sajuScores.rankText }}
              </span>
            </div>
          </div>

          <!-- 메인 총평 문구 -->
          <h2 class="font-serif-kr text-xl sm:text-2xl font-bold text-[#FFE5A3] mb-2 leading-snug">
            "오늘은 작은 인연이 큰 기회가 됩니다"
          </h2>
          <p class="text-xs text-[#CBD5E1] font-light max-w-sm mx-auto leading-relaxed">
            마음속에 품고 있던 오랜 계획을 소심스레 꺼내어보세요. 귀인의 따스한 조언에 순풍이 되어줄 것입니다.
          </p>
        </div>

        <!-- 3. 영역별 세부 운세 2x2 Grid (이미지 2 1:1) -->
        <div class="space-y-2.5">
          <div class="flex justify-between items-center px-1">
            <h3 class="font-serif-kr text-sm font-bold text-white flex items-center gap-1.5">
              <span class="text-[#E8C170]">✦</span> 영역별 세부 운세
            </h3>
            <span class="text-[11px] text-[#64748B]">모범 조율 분석</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- 재물운 -->
            <div class="bg-[#151C33] border border-[#232E4A] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">💰</span>
                  <span class="text-xs font-bold text-[#E8C170]">{{ sajuScores.wealthScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold text-white mb-1">재물운</h4>
                <p class="text-[11px] text-[#94A3B8] font-light line-clamp-2">
                  뜻밖의 소소한 이득이 찾아옵니다.
                </p>
              </div>
              <div class="w-full bg-[#0E1325] h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full" :style="{ width: `${sajuScores.wealthScore}%` }"></div>
              </div>
            </div>

            <!-- 애정운 -->
            <div class="bg-[#151C33] border border-[#232E4A] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">🕊️</span>
                  <span class="text-xs font-bold text-[#E8C170]">{{ sajuScores.loveScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold text-white mb-1">애정운</h4>
                <p class="text-[11px] text-[#94A3B8] font-light line-clamp-2">
                  마음을 터놓는 대화가 깊은 신뢰를 만듭니다.
                </p>
              </div>
              <div class="w-full bg-[#0E1325] h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full" :style="{ width: `${sajuScores.loveScore}%` }"></div>
              </div>
            </div>

            <!-- 건강운 -->
            <div class="bg-[#151C33] border border-[#232E4A] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">🌿</span>
                  <span class="text-xs font-bold text-[#E8C170]">{{ sajuScores.healthScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold text-white mb-1">건강운</h4>
                <p class="text-[11px] text-[#94A3B8] font-light line-clamp-2">
                  가벼운 산책과 충분한 수분 섭취가 필요합니다.
                </p>
              </div>
              <div class="w-full bg-[#0E1325] h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full" :style="{ width: `${sajuScores.healthScore}%` }"></div>
              </div>
            </div>

            <!-- 직업·학업 -->
            <div class="bg-[#151C33] border border-[#232E4A] rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">📜</span>
                  <span class="text-xs font-bold text-[#E8C170]">{{ sajuScores.businessScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold text-white mb-1">직업·학업</h4>
                <p class="text-[11px] text-[#94A3B8] font-light line-clamp-2">
                  집중력이 발휘되어 막혔던 문제가 풀립니다.
                </p>
              </div>
              <div class="w-full bg-[#0E1325] h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full" :style="{ width: `${sajuScores.businessScore}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 시간대별 일진(日辰) 흐름 (이미지 2 1:1) -->
        <div class="bg-[#151C33] border border-[#232E4A] rounded-3xl p-5 shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-serif-kr text-xs font-bold text-white flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 text-[#E8C170]" />
              시간대별 일진(日辰) 흐름
            </h3>
            <span class="text-[11px] text-[#E8C170]">오후가 절정</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="bg-[#0E1325] border border-[#232E4A] rounded-2xl p-3">
              <span class="text-[10px] text-[#94A3B8] block mb-0.5">오전</span>
              <span class="text-[10px] text-[#64748B] block mb-1">08:00~12:00</span>
              <div class="text-[#E8C170] text-xs font-bold mb-1">★★★★☆</div>
              <span class="text-[10px] text-[#CBD5E1] font-light">차분한 준비의 시간</span>
            </div>

            <div class="bg-[#1A2544] border border-[#E8C170]/60 rounded-2xl p-3 relative shadow-md">
              <span class="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 bg-[#E8C170] text-[#0F1226] text-[9px] font-bold rounded-full">
                절정
              </span>
              <span class="text-[10px] text-[#FFDE9E] block mb-0.5">오후</span>
              <span class="text-[10px] text-[#94A3B8] block mb-1">12:00~18:00</span>
              <div class="text-[#E8C170] text-xs font-bold mb-1">★★★★★</div>
              <span class="text-[10px] text-[#FFE5A3] font-medium">오늘의 최고조 상승운</span>
            </div>

            <div class="bg-[#0E1325] border border-[#232E4A] rounded-2xl p-3">
              <span class="text-[10px] text-[#94A3B8] block mb-0.5">저녁</span>
              <span class="text-[10px] text-[#64748B] block mb-1">18:00~24:00</span>
              <div class="text-[#E8C170] text-xs font-bold mb-1">★★★★☆</div>
              <span class="text-[10px] text-[#CBD5E1] font-light">편안한 휴식과 정리</span>
            </div>
          </div>
        </div>

        <!-- 5. 오늘의 조력 기운 (이미지 2 1:1) -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-[#94A3B8] flex items-center gap-1 px-1">
            <UIcon name="i-heroicons-chevron-left" class="w-3.5 h-3.5" />
            오늘의 조력 기운
          </span>

          <div class="grid grid-cols-3 gap-2.5">
            <div class="bg-[#151C33] border border-[#232E4A] rounded-2xl p-3 text-center">
              <span class="text-[10px] text-[#94A3B8] block mb-2">행운의 색</span>
              <div class="w-8 h-8 rounded-full bg-[#10B981] mx-auto mb-2 border border-white/20 shadow-md"></div>
              <span class="text-xs font-bold text-white block truncate">청록빛 옥색</span>
            </div>

            <div class="bg-[#151C33] border border-[#232E4A] rounded-2xl p-3 text-center">
              <span class="text-[10px] text-[#94A3B8] block mb-2">행운의 수</span>
              <div class="w-8 h-8 rounded-full bg-[#1C2646] border border-[#2D3958] mx-auto mb-2 flex items-center justify-center text-[#E8C170] text-xs font-bold">
                #
              </div>
              <span class="text-xs font-bold text-[#FFDE9E] block truncate">7 과 18</span>
            </div>

            <div class="bg-[#151C33] border border-[#232E4A] rounded-2xl p-3 text-center">
              <span class="text-[10px] text-[#94A3B8] block mb-2">행운의 방위</span>
              <div class="w-8 h-8 rounded-full bg-[#1C2646] border border-[#2D3958] mx-auto mb-2 flex items-center justify-center text-[#E8C170]">
                <UIcon name="i-heroicons-compass" class="w-4 h-4" />
              </div>
              <span class="text-xs font-bold text-white block truncate">남동쪽 (풍요)</span>
            </div>
          </div>
        </div>

        <!-- 6. 오늘의 지혜 카드 (이미지 2 1:1) -->
        <div class="bg-linear-to-b from-[#1C2646] to-[#151C33] border border-[#E8C170]/40 rounded-2xl p-5 shadow-lg">
          <span class="text-xs font-bold text-[#E8C170] flex items-center gap-1 mb-2 font-serif-kr">
            ◆ 오늘의 지혜
          </span>
          <p class="font-serif-kr text-sm text-white italic leading-relaxed mb-3">
            "바람이 불지 않을 때 바람개비를 돌리는 방법은, 내가 앞으로 달려가는 것이다."
          </p>
          <p class="text-right text-[11px] text-[#94A3B8] font-serif-kr">
            — 마음에 새기는 화두
          </p>
        </div>

        <!-- 7. 세부 AI 보고서 본문 -->
        <div class="bg-[#151C33] border border-[#232E4A] rounded-3xl p-5 sm:p-6 shadow-xl">
          <h3 class="font-serif-kr text-base font-bold text-white mb-4 border-b border-[#232E4A] pb-3 flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-[#E8C170]" />
            AI 맞춤 사주명리 보고서
          </h3>
          <div v-html="formattedInterpretation" class="markdown-body"></div>
        </div>

        <!-- 8. 하단 버튼 영역 (이미지 2 1:1) -->
        <div class="space-y-3 pt-2">
          <button
            type="button"
            class="w-full py-4 rounded-full font-bold text-sm text-[#0F1226] bg-linear-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 transition-all shadow-xl shadow-[#E8C170]/20 flex items-center justify-center gap-2"
            @click="copyToClipboard"
          >
            <UIcon name="i-heroicons-share" class="w-5 h-5 text-[#0F1226]" />
            오늘의 운세 나누기 (결과 공유)
          </button>

          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="py-3 rounded-full bg-[#182038] border border-[#2D3A5E] text-xs font-semibold text-[#CBD5E1] hover:text-white hover:border-[#E8C170] transition-colors flex items-center justify-center gap-1.5"
              @click="onNotifyReservation"
            >
              <UIcon name="i-heroicons-bell" class="w-4 h-4 text-[#E8C170]" />
              내일 새벽 운세 알림 예약
            </button>
            <button
              type="button"
              class="py-3 rounded-full bg-[#182038] border border-[#2D3A5E] text-xs font-semibold text-[#CBD5E1] hover:text-white hover:border-[#E8C170] transition-colors flex items-center justify-center gap-1.5"
              @click="store.clearSaju()"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-[#E8C170]" />
              내 사주 다시 입력
            </button>
          </div>
        </div>

        <div class="text-center py-3">
          <p class="text-[11px] text-[#64748B]">
            선천적 기운 계산 완료 · 陰曆 八月 朔日
          </p>
        </div>

        <div class="flex justify-center my-4">
          <AdSense adSlot="8877665544" />
        </div>

      </div>

    </div>

    <!-- 9. 하단 탭바 (이미지 2 1:1) -->
    <div class="fixed bottom-0 left-0 right-0 bg-[#0B0F1D]/95 backdrop-blur-md border-t border-[#1E2942] z-50 py-2">
      <div class="max-w-md sm:max-w-lg mx-auto grid grid-cols-4 text-center px-4">
        <button
          type="button"
          @click="activeTab = 'today'"
          class="flex flex-col items-center gap-1 py-1 transition-colors text-[#E8C170]"
        >
          <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
          <span class="text-[10px] font-medium">오늘</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'weekly'"
          class="flex flex-col items-center gap-1 py-1 text-[#64748B] hover:text-[#94A3B8] transition-colors"
        >
          <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
          <span class="text-[10px] font-medium">주간</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'monthly'"
          class="flex flex-col items-center gap-1 py-1 text-[#64748B] hover:text-[#94A3B8] transition-colors"
        >
          <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
          <span class="text-[10px] font-medium">월간</span>
        </button>

        <NuxtLink
          to="/saju"
          class="flex flex-col items-center gap-1 py-1 text-[#64748B] hover:text-[#94A3B8] transition-colors"
        >
          <UIcon name="i-heroicons-user" class="w-5 h-5" />
          <span class="text-[10px] font-medium">내 정보</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.saju-input {
  border: 1px solid #2D3958;
  background-color: #0E1325;
  color: #ffffff;
}
.saju-input:focus {
  border-color: #E8C170;
  outline: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
