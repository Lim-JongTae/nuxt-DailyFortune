<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import { getGanzhiOfDay, getGanzhiOfYear, getTodayLunarDateString } from '~/utils/saju'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface SajuResultResponse {
  success: boolean
  isAiGenerated?: boolean
  error?: string
  userSaju?: {
    ilgan: string
    ilganElement: string
    birthGanzhi: string
    siji?: string
  }
  todaySaju?: {
    ganzhi: string
    shipsin: string
  }
  parsedData?: {
    categories?: {
      wealth?: { score: number; summary?: string }
      love?: { score: number; summary?: string }
      health?: { score: number; summary?: string }
      business?: { score: number; summary?: string }
    }
  }
  aiInterpretation?: string
}

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/saju`

const sajuTitle = '무료 사주팔자 & 오늘의 일일사주 AI 분석 (회원가입 없음)'
const sajuDesc = '생년월일시 입력으로 나만의 일간(日干)과 오늘 일진의 십신 조화를 즉시 무료 분석하는 AI 사주명리 리포트.'

useSeoMeta({
  title: sajuTitle,
  description: sajuDesc,
  ogTitle: sajuTitle,
  ogDescription: sajuDesc,
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`
})

useHead({
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: [
    {
      type: 'application/ld+json' as const,
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '일일 사주명리',
        description: '생년월일시를 입력하여 나만의 일간(日干)과 오늘 일진의 십신 조화를 분석하고 맞춤 AI 사주 리포트를 확인하세요.',
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: '일일운세 ✦ 天命',
          url: runtimeConfig.public?.siteUrl || 'https://sajuapp.co.kr'
        },
        about: {
          '@type': 'Thing',
          name: '사주명리학',
          description: '60일주론과 오행 생극제화를 기반으로 한 명리학적 운세 분석'
        }
      })
    }
  ]
})

const { $pinia } = useNuxtApp()
const store = useFortuneStore($pinia)
const {
  birthDate,
  birthTime,
  noTime,
  gender,
  sajuWorry: worry,
  sajuResult: result
} = storeToRefs(store)

const toast = useToast()
const router = useRouter()
const route = useRoute()
const isNewYearMode = ref(route.query.type === 'newyear')

watch(() => route.query.type, (newType) => {
  isNewYearMode.value = newType === 'newyear'
})

const isNewYearFortune = computed(() => {
  return result.value?.fortuneType === 'newyear' || isNewYearMode.value
})

const setFortuneMode = (mode: 'daily' | 'newyear') => {
  isNewYearMode.value = mode === 'newyear'
}

const goToTalisman = () => {
  if (!result.value || !result.value.userSaju) {
    toast.clear()
    toast.add({
      title: '✦ 사주 운세 조회 필요',
      description: '먼저 오늘의 사주 운세를 조회하신 후 맞춤 부적을 발급받으실 수 있습니다.',
      icon: 'i-heroicons-information-circle',
      color: 'warning',
      duration: 4500
    })
    return
  }
  router.push('/talisman')
}

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
  if (!birthYear.value) return null
  const y = parseInt(birthYear.value, 10)
  if (Number.isNaN(y) || y < 1900 || y > new Date().getFullYear()) return null

  const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"]
  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"]
  const animals = ["쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠", "원숭이띠", "닭띠", "개띠", "돼지띠"]
  const emoji = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐒", "🐔", "🐶", "🐷"]

  // 전통 육십간지 연도 계산법 (기준년도 -4 오프셋 검증: 2024년 -> (2024-4)%10=0(甲), (2024-4)%12=4(辰) -> 갑진년(甲辰年) 정확함)
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

const otherZodiacZhi = computed(() => {
  const currentBranchIdx = userZodiacInfo.value?.branchIdx
  if (currentBranchIdx === undefined) return zodiacZhi
  return zodiacZhi.filter(item => item.branchIdx !== currentBranchIdx)
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
const showCooldownNotice = ref(false)
const cooldownTimeStr = ref('')

onMounted(() => {
  store.loadFromLocalStorage()
  if (birthDate.value && birthDate.value.includes('-')) {
    const [y, m, d] = birthDate.value.split('-')
    birthYear.value = y || ''
    birthMonth.value = m ? String(parseInt(m, 10)) : ''
    birthDay.value = d ? String(parseInt(d, 10)) : ''
  }

  // 12시간 쿨다운 확인 및 이전 결과 자동 복원
  if (store.hasRecentResult('saju')) {
    if (!result.value && store.sajuResult) {
      result.value = store.sajuResult
    }
    const cool = store.getRemainingCoolTime('saju')
    if (cool.isLimited) {
      showCooldownNotice.value = true
      cooldownTimeStr.value = `${cool.hours}시간 ${cool.minutes}분`
    }
  }
})

watch([birthDate, birthTime, noTime, gender, worry], () => {
  store.saveToLocalStorage()
})

watch(noTime, (val) => {
  if (val) birthTime.value = ''
})

const startSajuFortune = async () => {
  // 사전 검증: 최근 12시간 이내에 이미 사주 조회가 이루어졌고 백업 데이터가 있는지 확인
  if (store.hasRecentResult('saju')) {
    store.loadFromLocalStorage(true)
    if (store.sajuResult) {
      result.value = store.sajuResult
      const cool = store.getRemainingCoolTime('saju')
      if (cool.isLimited) {
        showCooldownNotice.value = true
        cooldownTimeStr.value = `${cool.hours}시간 ${cool.minutes}분`
      }
      toast.clear()
      toast.add({
        title: '✦ 오늘의 운세 조회 안내',
        description: '최근 12시간 이내에 이미 사주 운세를 확인하셨습니다. 이전 결과를 보여드립니다.',
        icon: 'i-heroicons-information-circle',
        color: 'warning',
        duration: 5000
      })
      return
    }
  }

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
  // result.value는 초기화하지 않음 - 429 시 기존 결과를 그대로 유지하기 위해

  const startTime = Date.now()

  console.log('[Saju Frontend] Starting API call', {
    birthDate: birthDate.value,
    hasWorry: !!worry.value,
    timestamp: new Date().toISOString()
  })

  try {
    const res = await $fetch<SajuResultResponse>('/api/fortune/saju', {
      method: 'POST',
      body: {
        birthDate: birthDate.value,
        birthTime: birthTime.value,
        gender: gender.value,
        worry: worry.value,
        fortuneType: isNewYearMode.value ? 'newyear' : 'daily'
      }
    })

    const elapsedTime = Date.now() - startTime
    console.log('[Saju Frontend] API call successful', {
      elapsed: `${elapsedTime}ms`,
      hasResult: !!res,
      success: res?.success
    })

    if (res.success) {
      result.value = res
      // 점수 데이터가 정상적으로 수신되었을 때만 12시간 쿨타임 성공 기록
      const hasScores = !!(res.parsedData?.categories?.wealth?.score && res.parsedData?.categories?.love?.score)
      if (hasScores) {
        store.recordFortuneSuccess('saju')
        store.saveToLocalStorage()
      } else {
        toast.clear()
        toast.add({
          title: '⚠️ 운세 분석 오류',
          description: '분석 중 오류 발생, 다시 조회하시기 바랍니다.',
          icon: 'i-heroicons-exclamation-triangle',
          color: 'warning',
          duration: 6000
        })
      }
    } else {
      alert(res.error || '오류가 발생했습니다.')
    }
    loading.value = false

  } catch (error: unknown) {
    const errObj = error as Record<string, any>
    const statusCode = errObj?.statusCode || errObj?.status || errObj?.response?.status
    const statusMessage = errObj?.statusMessage || errObj?.data?.statusMessage || errObj?.data?.message || errObj?.message || ''

    console.error('[Saju Frontend] API call failed', {
      statusCode,
      statusMessage,
      errorType: errObj?.name,
      error: error
    })

    if (statusCode === 429) {
      toast.clear()
      // 1일 1회 조회 제한 - 로컬 스토리지 및 백업에서 이전 결과 강제 복원 (만료 무시)
      store.loadFromLocalStorage(true)
      if (store.sajuResult) {
        result.value = store.sajuResult
      }
      const cool = store.getRemainingCoolTime('saju')
      if (cool.isLimited) {
        showCooldownNotice.value = true
        cooldownTimeStr.value = `${cool.hours}시간 ${cool.minutes}분`
      }
      toast.add({
        title: '✦ 오늘의 운세 조회 안내',
        description: statusMessage || '최근 12시간 이내에 이미 사주 운세를 조회하셨습니다. 이전 조회 결과를 보여드립니다.',
        icon: 'i-heroicons-information-circle',
        color: 'warning',
        duration: 6000
      })
    } else {
      console.error('[Saju API Error]', error)
      toast.add({
        title: '오류 발생',
        description: statusMessage || '서버 연결 중 오류가 발생했습니다.',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
        duration: 5000
      })
    }
    loading.value = false
  }
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isPwaInstalled = ref(false)
const isTalismanDownloaded = ref(false)

const updateTalismanStatus = () => {
  isTalismanDownloaded.value = store.isTalismanDownloadedToday()
}

onMounted(() => {
  updateTalismanStatus()
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      isPwaInstalled.value = true
    }
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
    })
    window.addEventListener('appinstalled', () => {
      isPwaInstalled.value = true
      deferredPrompt.value = null
    })
  }
})

const onInstallPWA = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const choice = await deferredPrompt.value.userChoice
    if (choice?.outcome === 'accepted') {
      deferredPrompt.value = null
      isPwaInstalled.value = true
    }
  } else {
    if (typeof window !== 'undefined') {
      const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
      if (isiOS) {
        alert('Safari 하단 공유 메뉴[↑]에서 "홈 화면에 추가"를 누르시면 모바일 앱으로 즉시 설치됩니다.')
      } else {
        alert('브라우저 우측 상단 메뉴[⋮]에서 "홈 화면에 추가" 또는 "앱 설치"를 선택하시면 앱 아이콘으로 설치됩니다.')
      }
    }
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

  const scoreDisplay = sajuScores.value.hasScores
    ? `${sajuScores.value.totalScore}점 (${sajuScores.value.rankText})`
    : '분석 중 오류 발생, 다시 조회하시기 바랍니다.'

  const isNY = isNewYearFortune.value

  const shareText = isNY
    ? `✨ [사주앱 - sajuapp.co.kr] 2027 정미년(丁未年) 신년운세 & 삼재 비결 보고서 ✨
--------------------------------------
● 내 출생: ${user.zodiacName || userZodiacInfo.value?.zodiacName || '-'}
● 내 일간: ${user.ilgan} (${user.ilganElement})
● 2027 세운: 정미(丁未)년 (붉은 양의 해) · ${user.isSamjae ? '날삼재' : '삼재 비해당'}
● 신년 지수: ${scoreDisplay}

${plainText}

--------------------------------------
내 2027 신년운세 직접 보기: https://sajuapp.co.kr/saju?type=newyear`
    : `🔮 [사주앱 - sajuapp.co.kr] 오늘의 사주명리 분석 보고서 🔮
--------------------------------------
● 내 일간: ${user.ilgan} (${user.ilganElement})
● 오늘의 일진: ${today.ganzhi}일 (${today.shipsin}의 날)
● 운세 지수: ${scoreDisplay}

${plainText}

--------------------------------------
내 일일 사주 직접 보기: https://sajuapp.co.kr/saju`

  navigator.clipboard.writeText(shareText)
    .then(() => alert(isNY ? '2027 신년운세 결과 보고서가 복사되었습니다. 카카오톡이나 SNS에 공유해 보세요!' : '오늘의 사주명리 결과 보고서가 복사되었습니다. 카카오톡이나 SNS에 공유해 보세요!'))
    .catch(err => console.error(err))
}

const handleResetSaju = (force: boolean = false) => {
  const isForce = typeof force === 'boolean' ? force : false
  if (!isForce) {
    const coolTime = store.getRemainingCoolTime('saju')
    if (coolTime.isLimited) {
      toast.clear()
      const timeText = coolTime.hours > 0 
        ? (coolTime.minutes > 0 ? `${coolTime.hours}시간 ${coolTime.minutes}분` : `${coolTime.hours}시간`)
        : `${coolTime.minutes}분`
      toast.add({
        title: '⏳ 사주 재조회 대기 시간 안내',
        description: `최근 12시간 이내에 이미 사주 운세를 확인하셨습니다. 약 ${timeText} 후에 다시 입력 및 조회가 가능합니다.`,
        icon: 'i-heroicons-clock',
        color: 'warning',
        duration: 6000
      })
      return
    }
  }
  showCooldownNotice.value = false
  store.clearSaju()
  result.value = null
}

const sajuScores = computed(() => {
  if (!result.value) {
    return {
      hasScores: false,
      totalScore: 0,
      rankText: '추후 조회',
      wealthScore: 0,
      loveScore: 0,
      healthScore: 0,
      businessScore: 0,
      strokeDash: 283
    }
  }

  const parsedCat = result.value.parsedData?.categories
  
  // 파싱된 점수 안전 추출 (숫자 변환, 하드코딩 가짜 점수 fallback 배치 금지, 누락 시 null 반환)
  const parseNumScore = (val: any) => {
    if (val === undefined || val === null || val === '') return null
    const n = parseInt(String(val), 10)
    if (isNaN(n) || n <= 0 || n > 100) return null
    return n
  }

  const wealthScore = parseNumScore(parsedCat?.wealth?.score)
  const loveScore = parseNumScore(parsedCat?.love?.score)
  const healthScore = parseNumScore(parsedCat?.health?.score)
  const businessScore = parseNumScore(parsedCat?.business?.score)

  const hasScores = wealthScore !== null && loveScore !== null && healthScore !== null && businessScore !== null

  if (!hasScores) {
    return {
      hasScores: false,
      totalScore: 0,
      rankText: '다시 조회하시기 바랍니다',
      wealthScore: 0,
      loveScore: 0,
      healthScore: 0,
      businessScore: 0,
      strokeDash: 283
    }
  }

  const totalScore = Math.round((wealthScore! + loveScore! + healthScore! + businessScore!) / 4)

  let rankText = '상위 50% 보통(平運)'
  if (totalScore >= 95) rankText = '상위 2% 최상대길(最上大吉)'
  else if (totalScore >= 90) rankText = '상위 5% 대길(大吉)'
  else if (totalScore >= 85) rankText = '상위 12% 길(吉)'
  else if (totalScore >= 80) rankText = '상위 22% 중길(中吉)'
  else if (totalScore >= 75) rankText = '상위 35% 소길(小吉)'
  else if (totalScore >= 70) rankText = '상위 50% 보통(平運)'
  else if (totalScore >= 60) rankText = '상위 70% 성찰(省察)'
  else rankText = '상위 85% 신중(愼重)'

  const strokeDash = Math.round(283 * (1 - totalScore / 100))

  return {
    hasScores: true,
    totalScore,
    rankText,
    wealthScore: wealthScore!,
    loveScore: loveScore!,
    healthScore: healthScore!,
    businessScore: businessScore!,
    strokeDash
  }
})

const sajuDynamicData = computed(() => {
  const parsed = result.value?.parsedData
  const user = result.value?.userSaju
  const today = result.value?.todaySaju

  const birthGanzhi = user?.birthGanzhi || '사주'
  const ilganElement = user?.ilganElement || '오행'
  const shipsin = today?.shipsin || '십신'

  const siji = user?.siji || ''
  const charSum = (birthGanzhi.charCodeAt(0) || 0) + (birthGanzhi.charCodeAt(1) || 0)
  
  let peakSlot: 'morning' | 'afternoon' | 'evening' = 'afternoon'
  if (/인|묘|진|사/i.test(siji) || charSum % 3 === 0) {
    peakSlot = 'morning'
  } else if (/술|해|자|축/i.test(siji) || charSum % 3 === 2) {
    peakSlot = 'evening'
  } else {
    peakSlot = 'afternoon'
  }

  const defaultTimeFlow = {
    peakText: peakSlot === 'morning' ? "오전 기운 집중" : peakSlot === 'evening' ? "저녁 기운 집중" : "오후 기운 집중",
    morning: {
      desc: peakSlot === 'morning' ? `${ilganElement} 기운 최고조 상승` : `${ilganElement} 기운 준비의 시간`,
      stars: peakSlot === 'morning' ? "★★★★★" : "★★★★☆"
    },
    afternoon: {
      desc: peakSlot === 'afternoon' ? `${shipsin} 기운 최고조 상승` : `${shipsin} 기운 안정적 흐름`,
      stars: peakSlot === 'afternoon' ? "★★★★★" : "★★★★☆"
    },
    evening: {
      desc: peakSlot === 'evening' ? `${shipsin} 기운 최고조 안착` : "기운 정돈과 결실의 시간",
      stars: peakSlot === 'evening' ? "★★★★★" : "★★★★☆"
    }
  }

  return {
    headline: sanitizeKoreanText(parsed?.headline) || (sajuScores.value.hasScores ? `${birthGanzhi}일주와 오늘 ${shipsin} 기운의 조화` : '분석 중 오류 발생'),
    headlineSub: sanitizeKoreanText(parsed?.headlineSub) || (sajuScores.value.hasScores ? `타고난 ${ilganElement} 기운의 본질을 바탕으로 오늘 ${shipsin}의 흐름을 지혜롭게 활용하는 날입니다.` : '분석 중 오류 발생, 다시 조회하시기 바랍니다.'),
    categories: {
      wealth: {
        score: sajuScores.value.wealthScore,
        summary: sanitizeKoreanText(parsed?.categories?.wealth?.summary) || (sajuScores.value.hasScores ? `${birthGanzhi}일주에 ${shipsin} 기운이 작용하여 재물 흐름을 이끕니다.` : '분석 중 오류 발생, 다시 조회하시기 바랍니다.')
      },
      love: {
        score: sajuScores.value.loveScore,
        summary: sanitizeKoreanText(parsed?.categories?.love?.summary) || (sajuScores.value.hasScores ? `대인관계와 인연에서 ${shipsin}의 덕이 발휘됩니다.` : '분석 중 오류 발생, 다시 조회하시기 바랍니다.')
      },
      health: {
        score: sajuScores.value.healthScore,
        summary: sanitizeKoreanText(parsed?.categories?.health?.summary) || (sajuScores.value.hasScores ? `${ilganElement} 기운의 오행 균형을 이룰 수 있도록 안정을 취하세요.` : '분석 중 오류 발생, 다시 조회하시기 바랍니다.')
      },
      business: {
        score: sajuScores.value.businessScore,
        summary: sanitizeKoreanText(parsed?.categories?.business?.summary) || (sajuScores.value.hasScores ? `${shipsin}의 역량이 발휘되어 과업의 결실을 맺는 시기입니다.` : '분석 중 오류 발생, 다시 조회하시기 바랍니다.')
      }
    },
    timeFlow: {
      peakText: sanitizeKoreanText(parsed?.timeFlow?.peakText) || defaultTimeFlow.peakText,
      morning: {
        desc: sanitizeKoreanText(parsed?.timeFlow?.morning?.desc) || defaultTimeFlow.morning.desc,
        stars: parsed?.timeFlow?.morning?.stars || defaultTimeFlow.morning.stars
      },
      afternoon: {
        desc: sanitizeKoreanText(parsed?.timeFlow?.afternoon?.desc) || defaultTimeFlow.afternoon.desc,
        stars: parsed?.timeFlow?.afternoon?.stars || defaultTimeFlow.afternoon.stars
      },
      evening: {
        desc: sanitizeKoreanText(parsed?.timeFlow?.evening?.desc) || defaultTimeFlow.evening.desc,
        stars: parsed?.timeFlow?.evening?.stars || defaultTimeFlow.evening.stars
      }
    },
    luckyItems: {
      colorName: sanitizeKoreanText(parsed?.luckyItems?.colorName) || (isNewYearFortune.value ? "2027년 수호 색상" : "기운 보완 색상"),
      colorHex: parsed?.luckyItems?.colorHex || "#10B981",
      number: sanitizeKoreanText(parsed?.luckyItems?.number) || "상생의 수",
      direction: sanitizeKoreanText(parsed?.luckyItems?.direction) || "길한 방위"
    },
    wisdom: sanitizeKoreanText(parsed?.wisdom) || (isNewYearFortune.value ? "2027년 정미년 한 해의 지혜를 가슴에 새기고 나아가세요." : `${birthGanzhi}일주의 지혜로 오늘 ${shipsin}의 흐름을 바르고 신중하게 다스리세요.`)
  }
})

const timeFlowSlots = computed(() => {
  const tf = sajuDynamicData.value.timeFlow

  const getStarCount = (s: string) => (s.match(/★/g) || []).length
  const mStars = getStarCount(tf.morning.stars)
  const aStars = getStarCount(tf.afternoon.stars)
  const eStars = getStarCount(tf.evening.stars)

  let peakKey = 'afternoon'
  if (tf.peakText.includes('오전')) peakKey = 'morning'
  else if (tf.peakText.includes('저녁')) peakKey = 'evening'
  else if (tf.peakText.includes('오후')) peakKey = 'afternoon'
  else {
    if (mStars > aStars && mStars >= eStars) peakKey = 'morning'
    else if (eStars > aStars && eStars > mStars) peakKey = 'evening'
    else peakKey = 'afternoon'
  }

  return [
    {
      key: 'morning',
      label: '오전',
      time: '08:00~12:00',
      stars: tf.morning.stars,
      desc: tf.morning.desc,
      isPeak: peakKey === 'morning'
    },
    {
      key: 'afternoon',
      label: '오후',
      time: '12:00~18:00',
      stars: tf.afternoon.stars,
      desc: tf.afternoon.desc,
      isPeak: peakKey === 'afternoon'
    },
    {
      key: 'evening',
      label: '저녁',
      time: '18:00~24:00',
      stars: tf.evening.stars,
      desc: tf.evening.desc,
      isPeak: peakKey === 'evening'
    }
  ]
})

const isAnimated = ref(false)
const disclaimerModalRef = ref<any>(null)
const animatedStrokeDashoffset = ref(283)
const animatedScores = ref({
  totalScore: 0,
  wealthScore: 0,
  loveScore: 0,
  healthScore: 0,
  businessScore: 0
})

const triggerScoreAnimation = () => {
  isAnimated.value = false
  animatedStrokeDashoffset.value = 283
  animatedScores.value = {
    totalScore: 0,
    wealthScore: 0,
    loveScore: 0,
    healthScore: 0,
    businessScore: 0
  }

  nextTick(() => {
    setTimeout(() => {
      isAnimated.value = true
      const duration = 1600
      const start = performance.now()
      const target = sajuScores.value
      const targetDash = target.strokeDash

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        animatedScores.value.totalScore = Math.round(target.totalScore * easeOut)
        animatedScores.value.wealthScore = Math.round(target.wealthScore * easeOut)
        animatedScores.value.loveScore = Math.round(target.loveScore * easeOut)
        animatedScores.value.healthScore = Math.round(target.healthScore * easeOut)
        animatedScores.value.businessScore = Math.round(target.businessScore * easeOut)

        // 283 (0점 빈 원) -> targetDash (85점 42.45 채워진 원)
        animatedStrokeDashoffset.value = 283 - (283 - targetDash) * easeOut

        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          animatedScores.value.totalScore = target.totalScore
          animatedScores.value.wealthScore = target.wealthScore
          animatedScores.value.loveScore = target.loveScore
          animatedScores.value.healthScore = target.healthScore
          animatedScores.value.businessScore = target.businessScore
          animatedStrokeDashoffset.value = targetDash
        }
      }
      requestAnimationFrame(step)
    }, 150)
  })
}

// 스크롤 시 아래에서 솟아오르는 효과 (IntersectionObserver)
const setupScrollObserver = () => {
  if (typeof window === 'undefined') return
  nextTick(() => {
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      }, {
        threshold: 0.02,
        rootMargin: '100px 0px 50px 0px'
      })

      const elements = document.querySelectorAll('.reveal-on-scroll')
      elements.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 100 && rect.bottom > 0) {
          el.classList.add('is-visible')
        }
        observer.observe(el)
      })
    }, 200)
  })
}

watch(result, (newVal) => {
  if (newVal) {
    nextTick(() => {
      triggerScoreAnimation()
      setupScrollObserver()
    })
  }
}, { immediate: true })

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
    })
  }

  nextTick(() => {
    setupScrollObserver()
    if (result.value) {
      triggerScoreAnimation()
    }
  })
})

const markdownFormatter = useMarkdownFormatter()

const formattedInterpretation = computed(() => {
  return markdownFormatter.formatMarkdown(result.value?.aiInterpretation)
})

// 오늘 날짜 및 일진 헤더 동적 계산 (KST 실시간 오늘 날짜 기준 정밀 계산)
const todayHeaderInfo = computed(() => {
  const now = new Date()

  const todayStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul'
  }).format(now)

  const dateParts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long'
  }).formatToParts(now)

  const partMap: Record<string, string> = {}
  for (const part of dateParts) {
    partMap[part.type] = part.value
  }

  const year = parseInt(partMap.year || todayStr.split('-')[0] || '2026', 10)
  const monthStr = partMap.month || todayStr.split('-')[1] || '01'
  const dateStr = partMap.day || todayStr.split('-')[2] || '01'
  const month = parseInt(monthStr, 10)
  const date = parseInt(dateStr, 10)
  const dayOfWeek = partMap.weekday || ''

  const todaySaju = getGanzhiOfDay(todayStr)
  const yearSaju = getGanzhiOfYear(year)

  return {
    yearTitle: `${yearSaju.fullName}년 (${todaySaju.fullName}일)`,
    dateSubTitle: `${year}년 ${month}월 ${date}일 ${dayOfWeek} · 오늘의 일진`
  }
})

const todayLunarText = computed(() => {
  return getTodayLunarDateString()
})

// 공감 / 좋아요 로직
const likeCount = ref(0)
const alreadyLiked = ref(false)
const showLikeTooltip = ref(false)
const likeTooltipText = ref('')
let likeTooltipTimer: any = null

const triggerLikeTooltip = (msg: string) => {
  likeTooltipText.value = msg
  showLikeTooltip.value = true
  if (likeTooltipTimer) clearTimeout(likeTooltipTimer)
  likeTooltipTimer = setTimeout(() => {
    showLikeTooltip.value = false
  }, 2000)
}

const targetKey = computed(() => {
  if (!result.value) return 'saju_default'
  const ilgan = result.value.userSaju?.ilgan || 'default'
  const shipsin = result.value.todaySaju?.shipsin || 'default'
  return `saju_${ilgan}_${shipsin}`
})

const fetchLikeStats = async () => {
  if (!targetKey.value) return
  // localStorage에서 좋아요 상태 먼저 복원
  if (import.meta.client) {
    const stored = localStorage.getItem(`like_${targetKey.value}`)
    if (stored === 'true') alreadyLiked.value = true
  }
  try {
    const res: any = await $fetch(`/api/fortune/like?type=saju&targetKey=${targetKey.value}`)
    if (res?.success) {
      likeCount.value = res.likeCount ?? res.count ?? 0
      // 서버 alreadyLiked도 반영 (localStorage와 OR)
      if (res.alreadyLiked) alreadyLiked.value = true
    }
  } catch (err) {
    console.error('Failed to fetch saju like stats:', err)
  }
}

const handleLikeClick = () => {
  if (alreadyLiked.value) {
    triggerLikeTooltip('이미 클릭했습니다.')
    return
  }
  toggleLike()
}

const toggleLike = async () => {
  if (alreadyLiked.value) return

  alreadyLiked.value = true
  likeCount.value++
  if (import.meta.client) {
    localStorage.setItem(`like_${targetKey.value}`, 'true')
  }
  triggerLikeTooltip('공감이 반영되었습니다! ❤️')

  try {
    const res: any = await $fetch('/api/fortune/like', {
      method: 'POST',
      body: { type: 'saju', targetKey: targetKey.value }
    })
    if (res?.success && (res.likeCount !== undefined || res.count !== undefined)) {
      likeCount.value = res.likeCount ?? res.count ?? likeCount.value
    }
  } catch (err) {
    console.error('Failed to toggle saju like:', err)
  }
}

watch(result, (newVal) => {
  if (newVal) {
    fetchLikeStats()
    nextTick(() => {
      triggerScoreAnimation()
      setupScrollObserver()
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-lg mx-auto px-4 py-4 sm:py-6">

      <!-- 1. 최상단 날짜 & 헤더 바 (이미지 2 1:1 완벽 반영) -->
      <div class="flex items-center justify-between py-2 border-b pg-border mb-4">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="p-1.5 rounded-full pg-back-btn transition-colors">
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          </NuxtLink>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-tight">
                {{ todayHeaderInfo.yearTitle }}
              </h1>
              <span class="text-xs font-bold" style="color: var(--fortune-gold);">+</span>
            </div>
            <p class="text-[11px] pg-text-muted font-bold">
              {{ todayHeaderInfo.dateSubTitle }}
            </p>
          </div>
        </div>

        <button type="button" class="p-2 rounded-full pg-text-muted hover:opacity-80 transition-colors">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
        </button>
      </div>

      <!-- 서브 헤더 탭 / 명식 바 -->
      <div class="flex items-center justify-between text-xs pg-text-muted mb-3 px-1 font-medium">
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--fortune-gold);"></span>
          십이지신 및 명식
        </span>
        <button type="button" @click="handleResetSaju(false)" class="text-xs pg-text-gold hover:pg-text-gold-light underline underline-offset-2">
          내 사주 변경
        </button>
      </div>

      <!-- 십이지신/띠 수평 칩 슬라이더 -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        <template v-if="userZodiacInfo">
          <button
            type="button"
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-serif-kr flex items-center gap-1.5 transition-all border shadow-sm font-bold"
            style="background: linear-gradient(to right, rgba(255, 229, 163, 0.25), rgba(232, 193, 112, 0.35)); border-color: var(--fortune-gold); color: var(--fortune-gold-light);"
          >
            <span>{{ userZodiacInfo.animal }}</span>
            <span>{{ userZodiacInfo.zodiacName }}</span>
          </button>
          <button
            v-for="z in otherZodiacZhi"
            :key="z.branchIdx"
            type="button"
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-serif-kr flex items-center gap-1.5 transition-all pg-chip border"
          >
            <span>{{ z.animal }}</span>
            <span>{{ z.name }}</span>
          </button>
        </template>
        <template v-else>
          <button
            v-for="z in zodiacZhi"
            :key="z.branchIdx"
            type="button"
            class="shrink-0 px-3 py-1.5 rounded-full text-xs font-serif-kr flex items-center gap-1.5 transition-all pg-chip border"
          >
            <span>{{ z.animal }}</span>
            <span>{{ z.name }}</span>
          </button>
        </template>
      </div>

      <!-- 12시간 쿨다운 알림 배너 (사주궁합과 1:1 통일) -->
      <div 
        v-if="showCooldownNotice && result" 
        class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs sm:text-sm mb-4"
      >
        <div class="flex items-center gap-2.5">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-500 shrink-0" />
          <span class="pg-text-muted">
            오늘 이미 조회하신 사주 결과입니다.<br> 다음 새로운 조회까지 <strong>{{ cooldownTimeStr }}</strong> 남았습니다.
          </span>
        </div>
        <button 
          type="button" 
          @click="showCooldownNotice = false" 
          :class="['text-xs px-2.5 py-1 rounded-lg border pg-border hover:bg-black/5 cursor-pointer shrink-0', 'dark:hover:bg-white/5']"
        >
          닫기
        </button>
      </div>

      <!-- ========================================== -->
      <!-- 운세 모드 선택 토글 (일일운세 vs 2027 신년운세) -->
      <!-- ========================================== -->
      <div v-if="!result && !loading" class="grid grid-cols-2 gap-2 p-1.5 rounded-2xl pg-card-inner border pg-border mb-4 font-serif-kr text-xs shadow-xs">
        <button
          type="button"
          @click="setFortuneMode('daily')"
          :class="[
            'py-2.5 px-3 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer',
            !isNewYearMode
              ? 'bg-amber-100 text-amber-950 border border-amber-300/80 shadow-xs'
              : 'pg-text-muted hover:pg-text hover:bg-black/5',
            !isNewYearMode
              ? 'dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-400/40 dark:shadow-none'
              : 'dark:hover:bg-white/5'
          ]"
        >
          <span>🔮 오늘의 일일운세</span>
        </button>
        <button
          type="button"
          @click="setFortuneMode('newyear')"
          :class="[
            'py-2.5 px-3 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer',
            isNewYearMode
              ? 'bg-amber-100 text-amber-950 border border-amber-300/80 shadow-xs'
              : 'pg-text-muted hover:pg-text hover:bg-black/5',
            isNewYearMode
              ? 'dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-400/40 dark:shadow-none'
              : 'dark:hover:bg-white/5'
          ]"
        >
          <span>✨ 2027 신년운세</span>
        </button>
      </div>

      <!-- ========================================== -->
      <!-- 생년월일시 입력 폼 (결과가 없을 때) -->
      <!-- ========================================== -->
      <div v-if="!result && !loading" class="pg-card border rounded-3xl p-5 sm:p-6 shadow-xl mb-6 relative overflow-hidden">
        <!-- Background Watermark (z-0) -->
        <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
          命
        </div>

        <div class="relative z-10">
          <div class="text-center py-2 mb-4">
          <span class="inline-block px-3 py-1 rounded-full bg-(--fortune-gold)/10 border border-(--fortune-gold)/30 pg-text-gold text-xs font-bold font-serif-kr mb-2">
            {{ isNewYearMode ? '✨ 2027 정미년(丁未年) 신년운세' : '🔮 일일 사주명리' }}
          </span>
          <h2 class="font-serif-kr text-xl sm:text-2xl font-bold pg-text mb-2">
            {{ isNewYearMode ? '2027 정미년 신년운세 & 삼재 비결' : '오늘 나의 명식과 일진 분석' }}
          </h2>
          <p class="text-xs pg-text-muted max-w-xs mx-auto leading-relaxed font-bold">
            {{ isNewYearMode ? '생년월일시를 바탕으로 붉은 양의 해(정미년) 1년 총운과 날삼재, 길한 세운의 흐름을 분석합니다.' : '태어난 연월일시를 입력하면 본인의 일간(日干)과 오늘 일진의 십신 상호작용을 정밀 계산합니다.' }}
          </p>
        </div>

        <div class="space-y-4">
          <!-- 성별 선택 -->
          <div>
            <label class="block text-xs font-bold pg-text-gold mb-2 font-serif-kr">성별</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                class="py-2.5 rounded-xl border text-xs font-bold transition-all"
                :class="gender === 'male' ? 'pg-card-deep border-(--fortune-gold) pg-text-gold-light' : 'pg-card-inner pg-border pg-text-muted'"
                @click="gender = 'male'"
              >
                남성 (陽)
              </button>
              <button
                type="button"
                class="py-2.5 rounded-xl border text-xs font-bold transition-all"
                :class="gender === 'female' ? 'pg-card-deep border-(--fortune-gold) pg-text-gold-light' : 'pg-card-inner pg-border pg-text-muted'"
                @click="gender = 'female'"
              >
                여성 (陰)
              </button>
            </div>
          </div>

          <!-- 태어난 날짜 -->
          <div>
            <label class="block text-xs font-bold pg-text-gold mb-2 font-serif-kr">태어난 날짜 (양력 기준)</label>
            <div class="grid grid-cols-12 gap-1.5 sm:gap-2 w-full">
              <div class="col-span-6 min-w-0">
                <input
                  v-model="birthYear"
                  type="number"
                  placeholder="년(YYYY)"
                  class="saju-input w-full min-w-0 py-2.5 px-2 sm:px-3 rounded-xl text-xs text-center"
                />
              </div>
              <div class="col-span-3 min-w-0">
                <input
                  v-model="birthMonth"
                  type="number"
                  placeholder="월"
                  class="saju-input w-full min-w-0 py-2.5 px-1 sm:px-2 rounded-xl text-xs text-center"
                />
              </div>
              <div class="col-span-3 min-w-0">
                <input
                  v-model="birthDay"
                  type="number"
                  placeholder="일"
                  class="saju-input w-full min-w-0 py-2.5 px-1 sm:px-2 rounded-xl text-xs text-center"
                />
              </div>
            </div>
          </div>

          <!-- 태어난 시간 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold pg-text-gold font-serif-kr">태어난 시각</label>
              <label class="flex items-center gap-1.5 text-xs pg-text-muted cursor-pointer">
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
            <label for="worry-saju" class="block text-xs font-bold pg-text-gold mb-2 font-serif-kr">
              {{ isNewYearMode ? '2027년 신년 고민이나 소망 (선택)' : '오늘의 특정 고민이나 운세 질문 (선택)' }}
            </label>
            <textarea
              id="worry-saju"
              v-model="worry"
              :placeholder="isNewYearMode ? '예: 2027년 이직/사업운과 재물운 흐름이 궁금합니다.' : '예: 오늘 중요한 조율이 있는데 금전운 흐름이 어떨까요?'"
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
            {{ isNewYearMode ? '2027 정미년 신년운세 무료 분석 시작' : '오늘의 사주명리 분석 시작' }}
          </button>
        </div>
      </div>
    </div>

      <!-- 로딩 화면 -->
      <div v-if="loading" class="pg-card border rounded-3xl p-8 sm:p-10 text-center shadow-xl mb-6">
        <div class="relative w-28 h-28 mx-auto flex items-center justify-center mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-dashed animate-spin" style="border-color: var(--fortune-gold); opacity: 0.4; animation-duration: 7s;"></div>
          <div class="w-14 h-14 rounded-full pg-card-deep border flex items-center justify-center shadow-inner animate-pulse" style="border-color: var(--fortune-gold); opacity: 0.4;">
            <span class="seal-stamp text-xs px-2 py-0.5">命</span>
          </div>
        </div>
        <h3 class="font-serif-kr text-lg font-bold pg-text mb-2 animate-pulse">
          천간지지의 기운을 분석하는 중입니다...
        </h3>
      </div>

      <!-- ========================================== -->
      <!-- 사주 결과 노출 화면 -->
      <div v-if="result" class="space-y-4">

        <!-- 1. 내 명식 요약 지표 (1965년생 을사년 뱀띠 연동) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pg-card border rounded-2xl p-3 text-center text-xs reveal-on-scroll">
          <div class="pg-card-inner p-2 rounded-xl border">
            <span class="text-[10px] pg-text-bold block mb-0.5">내 출생년도 / 띠</span>
            <strong class="text-xs pg-text-gold-light font-serif-kr block truncate">
              {{ result.userSaju?.zodiacName || userZodiacInfo?.zodiacName || '-' }}
            </strong>
          </div>
          <div class="pg-card-inner p-2 rounded-xl border">
            <span class="text-[10px] pg-text-bold block mb-0.5">내 일간(태어난 날)</span>
            <strong class="text-xs pg-text font-serif-kr block">
              {{ result.userSaju?.ilgan }} ({{ result.userSaju?.ilganElement }})
            </strong>
          </div>
          <div class="pg-card-inner p-2 rounded-xl border">
            <span class="text-[10px] pg-text-bold block mb-0.5">태어난 시지</span>
            <strong class="text-xs pg-text font-serif-kr block">
              {{ result.userSaju?.siji }}시
            </strong>
          </div>
          <div class="pg-card-inner p-2 rounded-xl border">
            <span class="text-[10px] pg-text-bold block mb-0.5">
              {{ isNewYearFortune ? '2027년 세운' : '오늘의 일진' }}
            </span>
            <strong class="text-xs pg-text-gold font-serif-kr block">
              {{ isNewYearFortune ? '정미(丁未)년 붉은 양' : `${result.todaySaju?.ganzhi}일 (${result.todaySaju?.shipsin})` }}
            </strong>
          </div>
        </div>

        <!-- 분석 오류 발생 시 상단 알림 배너 및 재조회 버튼 -->
        <div v-if="!sajuScores.hasScores" class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2.5 reveal-on-scroll">
          <div class="flex items-center justify-center gap-1.5 text-amber-500 font-bold text-xs">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
            <span>분석 중 오류 발생</span>
          </div>
          <p class="text-xs pg-text-muted font-medium">
            분석 중 오류 발생, 다시 조회하시기 바랍니다.
          </p>
          <button
            type="button"
            @click="handleResetSaju(true)"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-linear-to-r from-[#FFE5A3] to-[#E8C170] text-[#0F1226] hover:brightness-110 active:scale-95 transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-[#0F1226]" />
            <span>운세 다시 조회하기</span>
          </button>
        </div>

        <!-- 2. 중앙 종합 점수 & 원형 게이지 링 카드 -->
        <div class="pg-card border rounded-3xl p-4 sm:p-6 text-center relative overflow-hidden shadow-2xl reveal-on-scroll">
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
            命
          </div>

          <div class="relative z-10">
            <!-- 상단 뱃지 -->
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full pg-card-deep pg-border text-[11px] font-semibold pg-text-gold-light mb-5">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--fortune-gold);"></span>
            {{ isNewYearFortune ? '2027 정미년(丁未年) 신년 총운 ✦' : '오늘의 천기누설 · 총평 ✦' }}
          </div>

          <!-- 원형 프로그레스 게이지 (Score Circle Gauge) -->
          <div class="relative w-44 h-44 mx-auto mb-5 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" stroke-width="6" class="pg-text-soft opacity-20" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="url(#goldGradientSaju)"
                stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="283"
                :stroke-dashoffset="animatedStrokeDashoffset"
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
              <span class="text-[12px] pg-text-soft font-bold mb-0.5">
                {{ isNewYearFortune ? '2027 신년 지수' : '운세 지수' }}
              </span>
              <div class="flex items-baseline gap-0.5">
                <template v-if="sajuScores.hasScores">
                  <span class="text-3xl font-extrabold font-serif-kr pg-text tracking-tight">
                    {{ animatedScores.totalScore }}
                  </span>
                  <span class="text-xs pg-text-gold font-bold">점</span>
                </template>
                <template v-else>
                  <span class="text-sm font-bold text-amber-500">
                    오류
                  </span>
                </template>
              </div>
              <span 
                class="mt-1 text-[10px] px-2 py-0.5 rounded-full pg-card-inner border"
                :class="sajuScores.hasScores ? 'pg-text-gold-bold pg-border' : 'text-amber-500/90 border-amber-500/30'"
              >
                {{ sajuScores.rankText }}
              </span>
            </div>
          </div>

          <!-- 메인 총평 문구 (무조건 1줄 고정) -->
          <h2 class="font-serif-kr text-[13px] sm:text-base md:text-xl font-bold pg-text-gold mb-2 leading-snug tracking-tighter whitespace-nowrap">
            "{{ sajuDynamicData.headline }}"
          </h2>
          <p class="text-xs pg-text-muted font-bold max-w-sm mx-auto leading-relaxed">
            {{ sajuDynamicData.headlineSub }}
          </p>
        </div>
      </div>

        <!-- 2-1. 2027 정미년 신년운세 전용 하이라이트 (삼재 & 대운 & 황금의 달) -->
        <div v-if="isNewYearFortune" class="pg-card border rounded-3xl p-5 shadow-xl mb-4 relative overflow-hidden reveal-on-scroll">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg">✨</span>
            <h3 class="font-serif-kr text-sm sm:text-base font-bold pg-text-gold">
              2027 정미년(丁未年) 세운 특별 진단
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <!-- 삼재 진단 카드 -->
            <div
              :class="[
                'p-3.5 rounded-2xl border transition-all',
                result?.userSaju?.isSamjae
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950',
                result?.userSaju?.isSamjae
                  ? 'dark:bg-rose-950/25 dark:border-rose-800/40 dark:text-rose-200'
                  : 'dark:bg-emerald-950/25 dark:border-emerald-800/40 dark:text-emerald-200'
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span
                  :class="[
                    'text-xs font-bold font-serif-kr',
                    result?.userSaju?.isSamjae ? 'text-rose-700' : 'text-emerald-700',
                    result?.userSaju?.isSamjae ? 'dark:text-rose-300' : 'dark:text-emerald-300'
                  ]"
                >
                  {{ result?.userSaju?.isSamjae ? '⚠️ 2027년 출삼재 (날삼재)' : '✨ 2027년 삼재 비해당' }}
                </span>
                <span
                  :class="[
                    'text-[10px] px-1.5 py-0.5 rounded pg-text-muted font-bold',
                    'bg-black/5',
                    'dark:bg-black/30'
                  ]"
                >
                  {{ result?.userSaju?.zodiacName || '내 띠' }}
                </span>
              </div>
              <p class="text-[11px] pg-text leading-snug">
                {{ result?.parsedData?.samjaeStatus?.advice || (result?.userSaju?.isSamjae ? (result?.userSaju?.animal === '토끼' ? '날삼재에 해당하나 묘미 반합의 기운이 겹쳐 복삼재로 풀이될 수 있는 흐름입니다. 방심을 경계하되 협력과 인연의 기운을 차분히 살피세요.' : '3년 삼재의 마지막 해로 묵은 액운이 빠져나가는 시기입니다. 중요한 계약과 투자는 신중을 기하세요.') : '2027년은 삼재의 액운이 미치지 않아 평안하고 순탄하게 기운을 펼칠 수 있습니다.') }}
              </p>
            </div>

            <!-- 세운 합충 카드 -->
            <div
              :class="[
                'p-3.5 rounded-2xl border transition-all',
                'bg-amber-50 border-amber-200',
                'dark:bg-amber-950/25 dark:border-amber-800/40'
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span
                  :class="[
                    'text-xs font-bold font-serif-kr',
                    'text-amber-800',
                    'dark:text-amber-300'
                  ]"
                >
                  {{ result?.userSaju?.isYukhab ? '💖 오미(午未) 육합 길운' : result?.userSaju?.animal === '토끼' ? '🌟 묘미(卯未) 반합 · 복삼재' : (result?.userSaju?.isBanhab || result?.userSaju?.isSamhab) ? '🌟 해미(亥未) 반합 길운' : result?.userSaju?.isBonmyeong ? '🐑 정미(丁未) 본명년 성찰' : result?.userSaju?.isChung ? '⚡ 축미(丑未) 충 변화수' : '🌿 세운 상생 조화' }}
                </span>
                <span
                  :class="[
                    'text-[10px] px-1.5 py-0.5 rounded font-bold',
                    'bg-amber-100 text-amber-900 border border-amber-300/60',
                    'dark:bg-black/30 dark:text-amber-200 dark:border-transparent'
                  ]"
                >
                  丁未年 기운
                </span>
              </div>
              <p class="text-[11px] pg-text leading-snug">
                {{ result?.userSaju?.isYukhab ? '오미 육합의 기운으로 대인관계 협력과 인연의 기운이 기대되는 해로 풀이됩니다.' : result?.userSaju?.animal === '토끼' ? '날삼재의 마무리에 묘미 반합의 기운이 더해져 복삼재로 전환될 수 있는 흐름으로 풀이됩니다.' : (result?.userSaju?.isBanhab || result?.userSaju?.isSamhab) ? '세운과의 반합(半合) 기운으로 협력과 발전이 기대되는 흐름으로 풀이됩니다.' : result?.userSaju?.isBonmyeong ? '자신의 띠와 세운이 마주하는 본명년으로 무리한 확장보다 내실을 다지는 것이 길합니다.' : result?.userSaju?.isChung ? '활동 무대, 직장, 거주지의 커다란 변화와 이동이 따르는 역동적인 해로 풀이됩니다.' : '정미년의 온화한 불과 흙 기운이 본연의 일주와 무난한 조화를 이룹니다.' }}
              </p>
            </div>
          </div>

          <!-- 황금 대운의 달 (Best Months) -->
          <div v-if="result?.parsedData?.bestMonths && result.parsedData.bestMonths.length" class="p-3.5 rounded-2xl pg-card-inner border pg-border shadow-xs">
            <span class="text-[11px] font-bold pg-text-gold block mb-1.5 font-serif-kr">
              🗓️ 2027년 가장 운이 트이는 '황금의 달'
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="(bm, bIdx) in result.parsedData.bestMonths"
                :key="bIdx"
                :class="[
                  'text-[11px] flex items-start gap-1.5 p-2.5 rounded-xl shadow-xs',
                  'bg-white/90 border border-slate-200/80 text-slate-700',
                  'dark:bg-black/30 dark:border-transparent dark:text-slate-300'
                ]"
              >
                <span
                  :class="[
                    'font-bold shrink-0',
                    'text-amber-700',
                    'dark:text-amber-400'
                  ]"
                >
                  ✦ {{ bm.month }}:
                </span>
                <span class="leading-tight">{{ bm.reason }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 영역별 세부 운세 2x2 Grid (이미지 2 1:1) -->
        <div class="space-y-2.5 reveal-on-scroll">
          <div class="flex justify-between items-center px-1">
            <h3 class="font-serif-kr text-sm font-bold pg-text flex items-center gap-1.5">
              <span class="pg-text-gold">✦</span> 영역별 세부 운세
            </h3>
            <span class="text-[11px] pg-text-soft">모범 조율 분석</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- 재물운 -->
            <div class="pg-card border rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">💰</span>
                  <span class="text-xs font-bold" :class="sajuScores.hasScores ? 'pg-text-gold' : 'text-amber-500'">
                    {{ sajuScores.hasScores ? `${animatedScores.wealthScore} 점` : '오류' }}
                  </span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">재물운</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.wealth.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated && sajuScores.hasScores ? `${sajuScores.wealthScore}%` : '0%' }"></div>
              </div>
            </div>

            <!-- 애정운 -->
            <div class="pg-card border rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">🕊️</span>
                  <span class="text-xs font-bold" :class="sajuScores.hasScores ? 'pg-text-gold' : 'text-amber-500'">
                    {{ sajuScores.hasScores ? `${animatedScores.loveScore} 점` : '오류' }}
                  </span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">애정운</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.love.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated && sajuScores.hasScores ? `${sajuScores.loveScore}%` : '0%' }"></div>
              </div>
            </div>

            <!-- 건강운 -->
            <div class="pg-card border rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">🌿</span>
                  <span class="text-xs font-bold" :class="sajuScores.hasScores ? 'pg-text-gold' : 'text-amber-500'">
                    {{ sajuScores.hasScores ? `${animatedScores.healthScore} 점` : '오류' }}
                  </span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">건강운</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.health.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated && sajuScores.hasScores ? `${sajuScores.healthScore}%` : '0%' }"></div>
              </div>
            </div>

            <!-- 직업·학업 -->
            <div class="pg-card border rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">📜</span>
                  <span class="text-xs font-bold" :class="sajuScores.hasScores ? 'pg-text-gold' : 'text-amber-500'">
                    {{ sajuScores.hasScores ? `${animatedScores.businessScore} 점` : '오류' }}
                  </span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">직업·학업</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.business.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-linear-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated && sajuScores.hasScores ? `${sajuScores.businessScore}%` : '0%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 시간대별 일진(日辰) 흐름 (일일운세 전용 - 신년운세 모드 시 숨김) -->
        <div v-if="!isNewYearFortune" class="pg-card border rounded-3xl p-5 shadow-lg reveal-on-scroll">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-serif-kr text-xs font-bold pg-text flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 pg-text-gold" />
              시간대별 일진(日辰) 흐름
            </h3>
            <span class="text-[11px] pg-text-gold">{{ sajuDynamicData.timeFlow.peakText }}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center">
            <div
              v-for="item in timeFlowSlots"
              :key="item.key"
              :class="[
                item.isPeak
                  ? 'pg-card-deep border pg-border-strong relative shadow-md'
                  : 'pg-card-inner border',
                'rounded-2xl p-3'
              ]"
            >
              <span
                v-if="item.isPeak"
                :class="[
                  'absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full border inline-flex items-center gap-1 shadow-xs transition-colors whitespace-nowrap',
                  'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
                  'dark:bg-purple-900/80 dark:text-purple-200 dark:border-purple-500/50'
                ]"
              >
                <UIcon name="i-heroicons-sparkles" class="w-3 h-3 shrink-0" />
                <span>절정</span>
              </span>
              <span :class="[item.isPeak ? 'pg-text-gold' : 'pg-text-muted', 'text-[10px] block mb-0.5']">{{ item.label }}</span>
              <span class="text-[10px] pg-text-soft block mb-1">{{ item.time }}</span>
              <div class="pg-text-gold text-xs font-bold mb-1">{{ item.stars }}</div>
              <span :class="[item.isPeak ? 'pg-text-gold font-bold' : 'pg-text-muted font-bold', 'text-[10px]']">{{ item.desc }}</span>
            </div>
          </div>
        </div>

        <!-- 5. 조력 기운 (신년운세 vs 일일운세 동적 분기) -->
        <div class="space-y-2 reveal-on-scroll">
          <span class="text-xs font-bold pg-text-muted flex items-center gap-1 px-1">
            <UIcon :name="isNewYearFortune ? 'i-heroicons-sparkles' : 'i-heroicons-chevron-left'" class="w-3.5 h-3.5" :class="isNewYearFortune ? 'pg-text-gold' : ''" />
            {{ isNewYearFortune ? '✨ 2027년 한 해를 돕는 조력 기운' : '오늘의 조력 기운' }}
          </span>

          <div class="grid grid-cols-3 gap-2.5">
            <div class="pg-card border rounded-2xl p-3 text-center">
              <span class="text-[10px] pg-text-bold block mb-2">{{ isNewYearFortune ? '1년 수호 색상' : '행운의 색' }}</span>
              <div class="w-8 h-8 rounded-full mx-auto mb-2 border border-white/20 shadow-md" :style="{ backgroundColor: sajuDynamicData.luckyItems.colorHex }"></div>
              <span class="text-xs font-bold pg-text block truncate">{{ sajuDynamicData.luckyItems.colorName }}</span>
            </div>

            <div class="pg-card border rounded-2xl p-3 text-center">
              <span class="text-[10px] pg-text-bold block mb-2">{{ isNewYearFortune ? '1년 행운의 수' : '행운의 수' }}</span>
              <div class="w-8 h-8 rounded-full pg-card-deep pg-border mx-auto mb-2 flex items-center justify-center pg-text-gold text-xs font-bold">
                #
              </div>
              <span class="text-xs font-bold pg-text-gold-light block truncate">{{ sajuDynamicData.luckyItems.number }}</span>
            </div>

            <div class="pg-card border rounded-2xl p-3 text-center">
              <span class="text-[10px] pg-text-bold block mb-2">{{ isNewYearFortune ? '1년 길한 방위' : '행운의 방위' }}</span>
              <div class="w-8 h-8 rounded-full pg-card-deep border pg-border mx-auto mb-2 flex items-center justify-center pg-text-gold shadow-xs">
                <svg class="w-6 h-6 text-(--fortune-gold)" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                  <polygon points="16.24,7.76 13.8,13.8 7.76,16.24 10.2,10.2" stroke="currentColor" stroke-width="1.2" fill="currentColor" />
                </svg>
              </div>
              <span class="text-xs font-bold pg-text block truncate">{{ sajuDynamicData.luckyItems.direction }}</span>
            </div>
          </div>
        </div>

        <!-- 6. 지혜 카드 (신년운세 vs 일일운세 동적 분기) -->
        <div class="pg-card-deep border pg-border-strong rounded-2xl p-5 shadow-lg reveal-on-scroll">
          <span class="text-xs font-bold pg-text-gold flex items-center gap-1 mb-2 font-serif-kr">
            {{ isNewYearFortune ? '◆ 2027년 신년 지혜의 화두' : '◆ 오늘의 지혜' }}
          </span>
          <p class="font-serif-kr text-sm pg-text italic leading-relaxed mb-3">
            "{{ sajuDynamicData.wisdom }}"
          </p>
          <p class="text-right text-[11px] pg-text-bold font-serif-kr">
            {{ isNewYearFortune ? '— 2027년 정미년(丁未年) 마음에 새기는 화두' : '— 마음에 새기는 화두' }}
          </p>
        </div>

        <!-- 7. 세부 AI 보고서 본문 컴포넌트 -->
        <FortuneReportContent
          :title="isNewYearFortune ? '2027 정미년 AI 신년운세 심층 보고서' : 'AI 맞춤 사주명리 보고서'"
          :ai-interpretation="result?.aiInterpretation"
          :is-ai-generated="result?.isAiGenerated"
          watermark-text="命"
        />

        <!-- 7-1. 운세 공감 / 좋아요 반응 박스 -->
        <div class="p-4 rounded-2xl pg-card-inner border pg-border flex items-center justify-between shadow-xs reveal-on-scroll">
          <div class="flex items-center gap-2">
            <span class="text-xs pg-text font-medium">❤️ 오늘 <span class="font-bold pg-text-gold">{{ likeCount }}</span>명의 방문자가 {{ isNewYearFortune ? '2027 신년운세' : '사주명리' }} 조언에 공감했습니다.</span>
          </div>
          <div class="relative group shrink-0" @click="handleLikeClick">
            <!-- 1.5초 후 사라지는 이벤트 말풍선 (Tooltip Bubble) -->
            <Transition name="fade-slide">
              <div
                v-if="showLikeTooltip"
                class="absolute -top-9 right-0 whitespace-nowrap bg-rose-900 text-rose-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-rose-400/40 pointer-events-none flex items-center gap-1 z-20"
              >
                <span>{{ likeTooltipText }}</span>
                <!-- 말풍선 꼬리 (삼각형) -->
                <span class="absolute -bottom-1 right-5 w-2 h-2 bg-rose-900 rotate-45 border-r border-b border-rose-400/40"></span>
              </div>
            </Transition>

            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 select-none cursor-pointer"
              :class="alreadyLiked ? 'pg-card-inner pg-text-gold border pg-border' : 'bg-linear-to-r from-[#FFE5A3] to-[#E8C170] text-[#0B0E1B] hover:brightness-110 active:scale-95'"
            >
              <UIcon
                :name="alreadyLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                class="w-4 h-4"
                :class="alreadyLiked ? 'text-rose-500 animate-pulse' : ''"
              />
              <span>{{ alreadyLiked ? '공감 완료' : '좋아요' }}</span>
            </button>
          </div>
        </div>

        <!-- 8. 하단 버튼 영역 (컴팩트 2열 메인 버튼 + 동적 PWA 버튼) -->
        <div class="space-y-2.5 pt-2">
          <!-- 1행: 메인 버튼 영역 (오늘 부적 다운로드 시 부적 버튼 숨김 & 공유 버튼 반응형 확대) -->
          <div :class="!isTalismanDownloaded ? 'grid grid-cols-2 gap-2' : 'block'">
            <button
              v-if="!isTalismanDownloaded"
              type="button"
              @click="goToTalisman"
              :class="[
                'py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-1.5 shrink-0 cursor-pointer',
                result && result.userSaju
                  ? ['text-[#0F1226] bg-linear-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 active:scale-95 shadow-[#E8C170]/20']
                  : ['pg-card-deep border pg-border pg-text-muted hover:border-amber-500/40 opacity-75']
              ]"
            >
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4" :class="result && result.userSaju ? 'text-[#0F1226]' : 'pg-text-gold'" />
              <span>{{ isNewYearFortune ? '📜 2027 신년 수호부적 발급' : '📜 맞춤 부적 발급' }}</span>
            </button>

            <button
              type="button"
              :class="[
                'py-3.5 px-3 rounded-2xl font-bold text-xs sm:text-sm pg-card border pg-border pg-text hover:bg-amber-500/10 hover:border-amber-500/60 hover:shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                !isTalismanDownloaded ? 'w-full' : 'w-full shadow-md'
              ]"
              @click="copyToClipboard"
            >
              <UIcon name="i-heroicons-share" class="w-4 h-4 pg-text-gold" />
              <span>💬 운세 결과 공유</span>
            </button>
          </div>

          <!-- 부적 다운로드 완료 시 서브 안내 뱃지 -->
          <div v-if="isTalismanDownloaded" class="flex items-center justify-center px-3.5 py-2 rounded-xl pg-card-deep border pg-border text-[11px] pg-text-muted">
            <span class="flex items-center gap-1 font-semibold">
              <span>✨ {{ isNewYearFortune ? '2027 신년 수호부적' : '오늘 맞춤 부적' }} 저장 완료</span>
            </span>
          </div>

          <!-- 12시간 경과 또는 날짜 변경 시에만 노출되는 재조회 버튼 -->
          <button
            v-if="!store.getRemainingCoolTime('saju').isLimited"
            type="button"
            :class="[
              'w-full py-3 px-4 rounded-xl font-bold text-xs pg-card border pg-border hover:bg-amber-500/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer mb-3 shadow-xs',
              'text-amber-900',
              'dark:text-amber-300'
            ]"
            @click="handleResetSaju(false)"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 pg-text-gold" />
            <span>{{ isNewYearFortune ? '🔄 2027 신년운세 다시 보기 (재조회 입력)' : '🔄 오늘 사주 다시 보기 (재조회 입력)' }}</span>
          </button>

          <!-- 2행: 미설치 사용자에게만 우측 하단 동적 소형 노출 -->
          <div v-if="!isPwaInstalled" class="flex justify-end pt-1">
            <button
              type="button"
              class="py-1.5 px-3 rounded-full pg-card-deep border pg-border text-[11px] font-medium pg-text-muted hover:pg-text hover:border-amber-500/60 hover:bg-amber-500/15 hover:shadow-sm hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              @click="onInstallPWA"
            >
              <UIcon name="i-heroicons-device-phone-mobile" class="w-3.5 h-3.5 pg-text-gold" />
              <span>📱 앱(홈 화면)에 추가</span>
            </button>
          </div>
        </div>

        <div class="text-center py-3">
          <p class="text-[11px] pg-text-soft">
            선천적 기운 계산 완료 · {{ todayLunarText }}
          </p>
        </div>

        <!-- AI 결과 배너 -->
        <div v-if="result && result.aiInterpretation" class="space-y-4 my-4">
          <HiggsfieldBanner variant="card" />
        </div>

      </div>

      <!-- [Google AdSense 인증용 정적 SEO 콘텐츠: 승인 완료 후 아래 한 줄만 삭제하시면 완전히 제거됩니다] -->
      <AdsenseVerificationSection />

    </div>

    <!-- 9. 하단 탭바 -->
    <div class="fixed bottom-0 left-0 right-0 pg-bg backdrop-blur-md border-t pg-border z-50 py-2" style="background-color: var(--fortune-bg); opacity: 0.95;">
      <div class="max-w-md sm:max-w-lg mx-auto grid grid-cols-4 text-center px-4">
        <NuxtLink
          to="/"
          class="flex flex-col items-center gap-1 py-1 pg-text-soft hover:pg-text-muted transition-colors"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5" />
          <span class="text-[10px] font-medium">홈</span>
        </NuxtLink>

        <NuxtLink
          to="/saju"
          class="flex flex-col items-center gap-1 py-1 transition-colors pg-text-gold"
        >
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
          <span class="text-[10px] font-medium">오늘 사주</span>
        </NuxtLink>

        <NuxtLink
          to="/iching"
          class="flex flex-col items-center gap-1 py-1 pg-text-soft hover:pg-text-muted transition-colors"
        >
          <UIcon name="i-heroicons-sun" class="w-5 h-5" />
          <span class="text-[10px] font-medium">오늘 주역</span>
        </NuxtLink>

        <button
          type="button"
          @click="disclaimerModalRef?.openModal()"
          class="flex flex-col items-center gap-1 py-1 pg-text-soft hover:pg-text-muted transition-colors"
        >
          <UIcon name="i-heroicons-shield-check" class="w-5 h-5 pg-text-gold" />
          <span class="text-[10px] font-medium">면책조항</span>
        </button>
      </div>
    </div>

    <!-- 면책조항 & 개인정보 팝업 모달 -->
    <DisclaimerModal ref="disclaimerModalRef" />

    <!-- AI 정밀 분석 진행 상태 Toast 프로그레스 바 -->
    <AiLoadingProgress
      :show="loading"
      title="오늘의 사주명리 정밀 분석 중"
      subtitle="60일주 원천 데이터와 오행 생극제화를 정밀 분석하느라 약 30~35초가 소요됩니다."
      :estimated-seconds="35"
      icon="🔮"
      :tips="[
        '💡 사주명리학에서 일주(日柱)는 나 자신의 본연의 심성과 그릇을 상징합니다.',
        '✨ 오늘의 일진과 내 일주 간의 오행 조화는 하루의 에너지 흐름을 결정합니다.',
        '🌿 지장간(支藏干)은 지지 속에 숨겨진 천간의 기운으로 내면의 잠재력을 의미합니다.',
        '🌟 12운성은 일간의 생로병사 기운의 왕성함과 쇠퇴함을 나타냅니다.',
        '🎯 명리적 조언을 삶의 지혜로 활용하면 다가올 난관을 지혜롭게 피할 수 있습니다.'
      ]"
    />
  </div>
</template>

<style scoped>
.saju-input {
  border: 1px solid var(--fortune-border-strong);
  background-color: var(--fortune-input-bg);
  color: var(--fortune-text);
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
.saju-input:focus {
  border-color: var(--fortune-gold);
  outline: none;
}
.saju-input::placeholder {
  color: var(--fortune-text-soft);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.pg-hover-gold:hover {
  border-color: var(--fortune-gold);
}

/* 마우스 스크롤을 아래로 내릴 때 수직으로 스르륵 솟아오르는 효과 (Scroll Reveal) */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.reveal-on-scroll.is-visible {
  opacity: 1 !important;
  transform: none !important;
  will-change: auto !important;
}
</style>
