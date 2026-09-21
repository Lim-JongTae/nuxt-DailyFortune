<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'

useSeoMeta({
  title: '일일 사주명리 - 오늘의 운세 | 일일운세.kr',
  description: '생년월일시를 입력하여 나의 일간(日干)과 오늘 날짜(일진)의 상호작용인 십신(Shipsin)을 분석하고 맞춤 AI 운세 보고서를 받으세요.'
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

const getWesternAge = (y: number, m: number, d: number): number => {
  const today = new Date()
  let age = today.getFullYear() - y
  const monthDiff = today.getMonth() - (m - 1)
  const dayDiff = today.getDate() - d

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--
  }
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
}, {
  message: '존재하지 않는 날짜입니다.'
})

const errors = ref({
  year: false,
  month: false,
  day: false
})

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
    if (!fullParsed.success) {
      errors.value.day = true
    } else {
      const age = getWesternAge(y, m, d)
      if (age < 15) {
        errors.value.year = true
        errors.value.month = true
        errors.value.day = true
      }
    }
  }
}

watch(birthYear, (newYear) => {
  if (newYear && String(newYear).length >= 4) {
    const parsedY = parseInt(String(newYear), 10)
    const limitYear = new Date().getFullYear() - 15
    if (!Number.isNaN(parsedY) && parsedY > limitYear) {
      alert(`만 15세 미만은 일일 사주를 조회할 수 없습니다. (${limitYear}년 이전 출생자만 가능)`)
      setTimeout(() => {
        birthYear.value = ''
      }, 0)
    }
  }
})

watch([birthYear, birthMonth, birthDay], () => {
  validateInputs()
})

const loading = ref(false)
const animationActive = ref(false)

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
  if (val) {
    birthTime.value = ''
  }
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
    alert('태어난 날짜 정보가 올바른 숫자가 아닙니다. 다시 입력해 주세요.')
    return
  }

  const age = getWesternAge(y, m, d)
  if (age < 15) {
    alert(`입력하신 나이는 만 ${age}세입니다. 만 15세 미만은 일일 사주를 조회할 수 없습니다.`)
    return
  }

  const dateObj = new Date(y, m - 1, d)
  if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
    alert('존재하지 않는 날짜입니다. 다시 확인해 주세요.')
    return
  }

  if (errors.value.year || errors.value.month || errors.value.day) {
    alert('태어난 날짜의 입력이 올바르지 않습니다. 빨간색 테두리로 표시된 부분을 확인해 주세요.')
    return
  }

  const yearStr = String(birthYear.value).padStart(4, '0')
  const monthStr = String(birthMonth.value).padStart(2, '0')
  const dayStr = String(birthDay.value).padStart(2, '0')
  birthDate.value = `${yearStr}-${monthStr}-${dayStr}`

  loading.value = true
  result.value = null
  animationActive.value = true

  const startTime = Date.now()

  try {
    const res: any = await $fetch('/api/fortune/saju', {
      method: 'POST',
      body: {
        birthDate: birthDate.value,
        birthTime: noTime.value ? null : birthTime.value,
        gender: gender.value,
        worry: worry.value
      }
    })

    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(2500 - elapsedTime, 0)

    setTimeout(() => {
      if (res.success) {
        result.value = res
        store.saveToLocalStorage()
      } else {
        alert(res.error || '오류가 발생했습니다.')
      }
      loading.value = false
      animationActive.value = false
    }, remainingTime)

  } catch (error) {
    console.error(error)
    alert('서버 통신 중 오류가 발생했습니다.')
    loading.value = false
    animationActive.value = false
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
    .replace(/# /g, '★ ')
    .replace(/\* /g, '• ')
    .replace(/- /g, '• ')

  const shareText = `🔮 [일일운세.kr] 나의 일일 사주명리 결과 보고서 🔮
--------------------------------------
● 태어난 일주: ${user.birthGanzhi} (${user.ilgan}일생)
● 오늘의 일진: ${today.ganzhi}일
● 오늘의 십신: ${today.shipsin}의 날 (나와 오늘의 조화)

${plainText}

--------------------------------------
내 일일 사주 직접 확인하기: https://일일운세.kr/saju`

  navigator.clipboard.writeText(shareText)
    .then(() => alert('나의 사주 결과 보고서가 텍스트로 복사되었습니다. 카카오톡이나 SNS에 붙여넣어 공유해 보세요!'))
    .catch(err => console.error(err))
}

const formattedInterpretation = computed(() => {
  if (!result.value?.aiInterpretation) return ''
  
  let text = result.value.aiInterpretation

  text = text.replace(/^### (.*$)/gim, '<h3 class="text-amber-800 dark:text-[#FFDE9E] text-lg font-serif-kr font-bold mt-6 mb-3 border-b border-slate-200 dark:border-[#4d4638]/40 pb-2 flex items-center gap-2"><span class="w-1.5 h-4 bg-amber-600 dark:bg-[#FFDE9E] rounded-sm"></span>$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2 class="text-xl font-serif-kr font-extrabold text-amber-700 dark:text-[#FFDF9E] mt-8 mb-4 border-l-4 border-amber-600 dark:border-[#FFDE9E] pl-3">$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-serif-kr font-extrabold text-slate-900 dark:text-white mt-10 mb-6">$1</h1>')

  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-amber-800 dark:text-[#FFDE9E]">$1</strong>')

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
          class="p-2 rounded-full bg-slate-100 dark:bg-[#181C38] border border-slate-200 dark:border-[#FFDE9E]/30 text-amber-700 dark:text-[#FFDE9E] hover:bg-slate-200 dark:hover:bg-[#26293e] transition-colors"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="flex items-center gap-3">
          <span class="seal-stamp text-xs px-2 py-0.5">命</span>
          <h1 class="font-serif-kr text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            일일 사주명리
            <span class="text-xs text-amber-700 dark:text-[#FFDE9E]/80 font-sans-kr font-normal">(Daily Saju)</span>
          </h1>
        </div>
      </div>

      <!-- 1. 입력 폼 화면 -->
      <div v-if="!result && !loading" class="gold-filament-card p-6 sm:p-8">
        <h2 class="font-serif-kr text-lg font-bold text-amber-800 dark:text-[#FFDE9E] mb-6 border-b border-slate-200 dark:border-[#4d4638]/40 pb-3 flex items-center gap-2">
          <span>✦</span> 탄생 정보와 오늘 마음 속 질문 입력
        </h2>

        <div class="space-y-6">
          <!-- 성별 선택 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-[#d1c5b3] mb-2">성별</label>
            <div class="flex gap-4">
              <button
                type="button"
                class="flex-1 py-3 px-4 rounded-xl border font-semibold text-sm transition-all duration-200"
                :class="gender === 'man' 
                  ? 'border-amber-600 bg-amber-500/10 text-amber-800 dark:border-[#FFDE9E] dark:bg-[#FFDE9E]/10 dark:text-[#FFDE9E]' 
                  : 'border-slate-300 dark:border-[#4d4638]/40 text-slate-500 dark:text-[#9a8f7f] hover:text-slate-900 dark:hover:text-white'"
                @click="gender = 'man'"
              >
                남성
              </button>
              <button
                type="button"
                class="flex-1 py-3 px-4 rounded-xl border font-semibold text-sm transition-all duration-200"
                :class="gender === 'woman' 
                  ? 'border-amber-600 bg-amber-500/10 text-amber-800 dark:border-[#FFDE9E] dark:bg-[#FFDE9E]/10 dark:text-[#FFDE9E]' 
                  : 'border-slate-300 dark:border-[#4d4638]/40 text-slate-500 dark:text-[#9a8f7f] hover:text-slate-900 dark:hover:text-white'"
                @click="gender = 'woman'"
              >
                여성
              </button>
            </div>
          </div>

          <!-- 태어난 날짜 -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-[#d1c5b3] mb-2">태어난 날짜 (양력)</label>
            <div class="flex gap-2">
              <div class="flex-[2]">
                <input
                  id="birthYear"
                  v-model="birthYear"
                  type="number"
                  placeholder="년 (4자리)"
                  min="1900"
                  :max="new Date().getFullYear()"
                  class="w-full py-2.5 px-3 border bg-slate-50 dark:bg-[#171a2e] rounded-xl text-slate-900 dark:text-white focus:outline-none text-sm text-center border-slate-300 dark:border-[#4d4638]/50 focus:border-amber-600 dark:focus:border-[#FFDE9E]"
                  :class="errors.year ? 'border-red-500 text-red-500' : ''"
                />
              </div>
              <div class="flex-1">
                <input
                  id="birthMonth"
                  v-model="birthMonth"
                  type="number"
                  placeholder="월"
                  min="1"
                  max="12"
                  class="w-full py-2.5 px-3 border bg-slate-50 dark:bg-[#171a2e] rounded-xl text-slate-900 dark:text-white focus:outline-none text-sm text-center border-slate-300 dark:border-[#4d4638]/50 focus:border-amber-600 dark:focus:border-[#FFDE9E]"
                  :class="errors.month ? 'border-red-500 text-red-500' : ''"
                />
              </div>
              <div class="flex-1">
                <input
                  id="birthDay"
                  v-model="birthDay"
                  type="number"
                  placeholder="일"
                  min="1"
                  max="31"
                  class="w-full py-2.5 px-3 border bg-slate-50 dark:bg-[#171a2e] rounded-xl text-slate-900 dark:text-white focus:outline-none text-sm text-center border-slate-300 dark:border-[#4d4638]/50 focus:border-amber-600 dark:focus:border-[#FFDE9E]"
                  :class="errors.day ? 'border-red-500 text-red-500' : ''"
                />
              </div>
            </div>
          </div>

          <!-- 태어난 시간 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="birthTime" class="block text-xs font-bold text-slate-700 dark:text-[#d1c5b3]">태어난 시각</label>
              <label class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#9a8f7f] cursor-pointer">
                <input type="checkbox" v-model="noTime" class="rounded border-slate-300 dark:border-[#4d4638] text-amber-600 dark:text-[#FFDE9E] focus:ring-amber-500" />
                태어난 시간 모름
              </label>
            </div>
            <input
              id="birthTime"
              v-model="birthTime"
              type="time"
              :disabled="noTime"
              class="w-full py-2.5 px-4 border border-slate-300 dark:border-[#4d4638]/50 bg-slate-50 dark:bg-[#171a2e] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-600 dark:focus:border-[#FFDE9E] disabled:opacity-40 text-sm"
            />
          </div>

          <!-- 고민 질문 -->
          <div>
            <label for="worry" class="block text-xs font-bold text-slate-700 dark:text-[#d1c5b3] mb-2">
              오늘 특히 알고 싶으신 부문이나 고민이 있으신가요? (선택)
            </label>
            <textarea
              id="worry"
              v-model="worry"
              placeholder="예: 오늘 중요한 계약이 있는데 결과가 어떨까요?, 오늘 연인과의 관계 흐름이 궁금합니다 등 적어주시면 AI가 해당 내용을 집중적으로 짚어드립니다."
              rows="3"
              class="w-full py-2.5 px-4 border border-slate-300 dark:border-[#4d4638]/50 bg-slate-50 dark:bg-[#171a2e] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-600 dark:focus:border-[#FFDE9E] text-sm resize-none"
            ></textarea>
          </div>

          <!-- 제출 버튼 -->
          <div class="pt-4">
            <button
              type="button"
              class="w-full py-3.5 px-6 rounded-full font-bold text-sm text-[#402d00] bg-gradient-to-r from-[#FFDF9E] to-[#E8C170] hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
              @click="startSajuFortune"
            >
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-[#402d00]" />
              오늘의 사주명리 분석 시작
            </button>
          </div>
        </div>
      </div>

      <!-- 2. 계산 로딩 화면 -->
      <div v-if="loading" class="gold-filament-card p-8 sm:p-12 text-center">
        <div class="relative w-32 h-32 mx-auto flex items-center justify-center mb-8">
          <div class="absolute inset-0 rounded-full border-4 border-dashed border-amber-600/40 dark:border-[#FFDE9E]/40 animate-spin" style="animation-duration: 8s;"></div>
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#171a2e] border border-amber-500/30 dark:border-[#FFDE9E]/30 flex items-center justify-center shadow-inner animate-pulse">
            <span class="seal-stamp text-sm px-2 py-0.5">命</span>
          </div>
        </div>
        
        <h3 class="font-serif-kr text-xl font-bold text-slate-900 dark:text-white mb-2 animate-pulse">
          사주명리 천간지지의 기운을 읽는 중입니다...
        </h3>
        <p class="text-xs text-slate-500 dark:text-[#9a8f7f] max-w-xs mx-auto leading-relaxed">
          태어난 날의 일간과 오늘 날짜의 십신 조화를 계산하여 나만의 맞춤 AI 리포트를 작성하고 있습니다.
        </p>
      </div>

      <!-- 3. 결과 노출 화면 -->
      <div v-if="result" class="space-y-6">
        <div class="gold-filament-card p-6 sm:p-8">
          <!-- 핵심 요약 지표 -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-[#171a2e] rounded-2xl mb-6 text-center border border-slate-200 dark:border-[#4d4638]/40">
            <div>
              <span class="block text-[11px] text-slate-500 dark:text-[#9a8f7f] mb-1">내 일간(태어난 날)</span>
              <span class="text-sm font-bold text-amber-800 dark:text-[#FFDE9E]">
                {{ result.userSaju.ilgan }} ({{ result.userSaju.ilganElement }})
              </span>
            </div>
            <div>
              <span class="block text-[11px] text-slate-500 dark:text-[#9a8f7f] mb-1">태어난 시지</span>
              <span class="text-sm font-bold text-slate-900 dark:text-white">
                {{ result.userSaju.siji }}시
              </span>
            </div>
            <div>
              <span class="block text-[11px] text-slate-500 dark:text-[#9a8f7f] mb-1">오늘의 일진</span>
              <span class="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                {{ result.todaySaju.ganzhi }}일
              </span>
            </div>
            <div>
              <span class="block text-[11px] text-slate-500 dark:text-[#9a8f7f] mb-1">나와 오늘의 조화</span>
              <span class="text-sm font-bold text-amber-700 dark:text-amber-300">
                {{ result.todaySaju.shipsin }}의 날
              </span>
            </div>
          </div>

          <!-- AI 해석 본문 -->
          <div class="border-t border-slate-200 dark:border-[#4d4638]/40 pt-6">
            <div v-html="formattedInterpretation" class="markdown-body"></div>
          </div>

          <!-- 공유 버튼 -->
          <div class="mt-8 pt-6 border-t border-slate-200 dark:border-[#4d4638]/40 flex flex-wrap gap-4 justify-between items-center">
            <button
              type="button"
              class="px-4 py-2 rounded-full border border-slate-300 dark:border-[#4d4638]/60 text-xs text-slate-600 dark:text-[#d1c5b3] hover:text-slate-900 dark:hover:text-white hover:border-amber-600 dark:hover:border-[#FFDE9E] transition-colors"
              @click="store.clearSaju()"
            >
              다시 확인하기
            </button>

            <div class="flex gap-2">
              <button
                type="button"
                class="px-5 py-2.5 rounded-full bg-amber-500/10 dark:bg-[#FFDE9E]/10 border border-amber-500/30 dark:border-[#FFDE9E]/40 text-xs font-bold text-amber-800 dark:text-[#FFDE9E] hover:bg-amber-500/20 dark:hover:bg-[#FFDE9E]/20 transition-colors flex items-center gap-1.5"
                @click="copyToClipboard"
              >
                <UIcon name="i-heroicons-share" class="w-4 h-4" />
                결과지 복사 및 공유
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-center my-6">
          <AdSense adSlot="8877665544" />
        </div>
      </div>
    </div>
  </div>
</template>
