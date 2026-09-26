<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'
import { getGanzhiOfDay, getGanzhiOfYear, getTodayLunarDateString } from '~/utils/saju'

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/saju`

useSeoMeta({
  title: '일일 사주명리 - 오늘의 운세',
  description: '생년월일시를 입력하여 나만의 일간(日干)과 오늘 일진의 십신 조화를 분석하고 맞춤 AI 사주 리포트를 확인하세요.',
  ogTitle: '일일 사주명리 - 오늘의 운세',
  ogDescription: '생년월일시를 입력하여 나만의 일간(日干)과 오늘 일진의 십신 조화를 분석하고 맞춤 AI 사주 리포트를 확인하세요.',
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.png`,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.png`
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

const store = useFortuneStore()
const {
  birthDate,
  birthTime,
  noTime,
  gender,
  sajuWorry: worry,
  sajuResult: result
} = storeToRefs(store)

const toast = useToast()

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
  // result.value는 초기화하지 않음 - 429 시 기존 결과를 그대로 유지하기 위해

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

  } catch (error: any) {
    const statusCode = error?.statusCode || error?.status || error?.response?.status
    const statusMessage = error?.statusMessage || error?.data?.statusMessage || error?.data?.message || error?.message || ''

    if (statusCode === 429) {
      toast.clear()
      // 1일 1회 조회 제한 - 로컬 스토리지에서 이전 결과 강제 복원 (만료 무시)
      store.loadFromLocalStorage(true)
      toast.add({
        title: '✦ 오늘의 운세 조회 안내',
        description: statusMessage || '오늘 이미 사주 운세를 조회하셨습니다.',
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

const deferredPrompt = ref<any>(null)

const onInstallPWA = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const choice = await deferredPrompt.value.userChoice
    if (choice?.outcome === 'accepted') {
      deferredPrompt.value = null
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

  const shareText = `🔮 [사주앱 - sajuapp.co.kr] 오늘의 사주명리 분석 보고서 🔮
--------------------------------------
● 내 일간: ${user.ilgan} (${user.ilganElement})
● 오늘의 일진: ${today.ganzhi}일 (${today.shipsin}의 날)
● 운세 지수: ${sajuScores.value.totalScore}점 (${sajuScores.value.rankText})

${plainText}

--------------------------------------
내 일일 사주 직접 보기: https://sajuapp.co.kr/saju`

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

  const parsedCat = result.value.parsedData?.categories
  const ilgan = result.value.userSaju?.ilgan || '갑'
  const charCode = ilgan.charCodeAt(0)
  
  const wealthScore = parsedCat?.wealth?.score ?? Math.min(98, Math.max(70, ((charCode * 3) % 20) + 78))
  const loveScore = parsedCat?.love?.score ?? Math.min(98, Math.max(70, ((charCode * 7) % 20) + 80))
  const healthScore = parsedCat?.health?.score ?? Math.min(98, Math.max(70, ((charCode * 5) % 20) + 72))
  const businessScore = parsedCat?.business?.score ?? Math.min(98, Math.max(70, ((charCode * 9) % 20) + 80))

  const totalScore = Math.round((wealthScore + loveScore + healthScore + businessScore) / 4)

  let rankText = '상위 8% 길(吉)'
  if (totalScore >= 90) rankText = '상위 3% 대길(大吉)'
  else if (totalScore >= 85) rankText = '상위 4% 대길(大吉)'
  else if (totalScore >= 80) rankText = '상위 10% 중길(中吉)'

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

const sajuDynamicData = computed(() => {
  const parsed = result.value?.parsedData

  return {
    headline: sanitizeKoreanText(parsed?.headline) || "오늘은 작은 인연이 큰 기회가 됩니다",
    headlineSub: sanitizeKoreanText(parsed?.headlineSub) || "마음속에 품고 있던 오랜 계획을 소심스레 꺼내어보세요. 귀인의 따스한 조언에 순풍이 되어줄 것입니다.",
    categories: {
      wealth: {
        score: sajuScores.value.wealthScore,
        summary: sanitizeKoreanText(parsed?.categories?.wealth?.summary) || "뜻밖의 소소한 이득이 찾아옵니다."
      },
      love: {
        score: sajuScores.value.loveScore,
        summary: sanitizeKoreanText(parsed?.categories?.love?.summary) || "마음을 터놓는 대화가 깊은 신뢰를 만듭니다."
      },
      health: {
        score: sajuScores.value.healthScore,
        summary: sanitizeKoreanText(parsed?.categories?.health?.summary) || "가벼운 산책과 충분한 수분 섭취가 필요합니다."
      },
      business: {
        score: sajuScores.value.businessScore,
        summary: sanitizeKoreanText(parsed?.categories?.business?.summary) || "집중력이 발휘되어 막혔던 문제가 풀립니다."
      }
    },
    timeFlow: {
      peakText: sanitizeKoreanText(parsed?.timeFlow?.peakText) || "오후가 절정",
      morning: {
        desc: sanitizeKoreanText(parsed?.timeFlow?.morning?.desc) || "차분한 준비의 시간",
        stars: parsed?.timeFlow?.morning?.stars || "★★★★☆"
      },
      afternoon: {
        desc: sanitizeKoreanText(parsed?.timeFlow?.afternoon?.desc) || "오늘의 최고조 상승운",
        stars: parsed?.timeFlow?.afternoon?.stars || "★★★★★"
      },
      evening: {
        desc: sanitizeKoreanText(parsed?.timeFlow?.evening?.desc) || "편안한 휴식과 정리",
        stars: parsed?.timeFlow?.evening?.stars || "★★★★☆"
      }
    },
    luckyItems: {
      colorName: sanitizeKoreanText(parsed?.luckyItems?.colorName) || "청록빛 옥색",
      colorHex: parsed?.luckyItems?.colorHex || "#10B981",
      number: sanitizeKoreanText(parsed?.luckyItems?.number) || "7 과 18",
      direction: sanitizeKoreanText(parsed?.luckyItems?.direction) || "남동쪽 (풍요)"
    },
    wisdom: sanitizeKoreanText(parsed?.wisdom) || "바람이 불지 않을 때 바람개비를 돌리는 방법은, 내가 앞으로 달려가는 것이다."
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
const animatedScores = ref({
  totalScore: 0,
  wealthScore: 0,
  loveScore: 0,
  healthScore: 0,
  businessScore: 0
})

const triggerScoreAnimation = () => {
  isAnimated.value = false
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
      const duration = 2000
      const start = performance.now()
      const target = sajuScores.value

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        animatedScores.value.totalScore = Math.round(target.totalScore * easeOut)
        animatedScores.value.wealthScore = Math.round(target.wealthScore * easeOut)
        animatedScores.value.loveScore = Math.round(target.loveScore * easeOut)
        animatedScores.value.healthScore = Math.round(target.healthScore * easeOut)
        animatedScores.value.businessScore = Math.round(target.businessScore * easeOut)

        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    }, 200)
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
      deferredPrompt.value = e
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

// 오늘 날짜 및 일진 헤더 동적 계산 (KST 기준)
const todayHeaderInfo = computed(() => {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const kst = new Date(utc + (9 * 60 * 60 * 1000))

  const year = kst.getFullYear()
  const month = kst.getMonth() + 1
  const date = kst.getDate()
  
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const dayOfWeek = dayNames[kst.getDay()]!

  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
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
  }, 1500)
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
    triggerLikeTooltip('이미 선택하셨습니다!')
    return
  }
  toggleLike()
}

const toggleLike = async () => {
  if (alreadyLiked.value) return
  try {
    const res: any = await $fetch('/api/fortune/like', {
      method: 'POST',
      body: { type: 'saju', targetKey: targetKey.value }
    })
    if (res?.success) {
      likeCount.value = res.likeCount ?? res.count ?? (likeCount.value + 1)
      alreadyLiked.value = true
      // localStorage에 좋아요 상태 저장
      if (import.meta.client) {
        localStorage.setItem(`like_${targetKey.value}`, 'true')
      }
      triggerLikeTooltip('공감이 반영되었습니다! ❤️')
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
        <button type="button" @click="store.clearSaju()" class="text-xs pg-text-gold hover:pg-text-gold-light underline underline-offset-2">
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
          <span class="inline-block px-3 py-1 rounded-full bg-[var(--fortune-gold)]/10 border border-[var(--fortune-gold)]/30 pg-text-gold text-xs font-bold font-serif-kr mb-2">
            🔮 일일 사주명리
          </span>
          <h2 class="font-serif-kr text-xl sm:text-2xl font-bold pg-text mb-2">
            오늘 나의 명식과 일진 분석
          </h2>
          <p class="text-xs pg-text-muted max-w-xs mx-auto leading-relaxed font-light">
            태어난 연월일시를 입력하면 본인의 일간(日干)과 오늘 일진의 십신 상호작용을 정밀 계산합니다.
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
                :class="gender === 'male' ? 'pg-card-deep border-[var(--fortune-gold)] pg-text-gold-light' : 'pg-card-inner pg-border pg-text-muted'"
                @click="gender = 'male'"
              >
                남성 (陽)
              </button>
              <button
                type="button"
                class="py-2.5 rounded-xl border text-xs font-bold transition-all"
                :class="gender === 'female' ? 'pg-card-deep border-[var(--fortune-gold)] pg-text-gold-light' : 'pg-card-inner pg-border pg-text-muted'"
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
            class="w-full py-3.5 rounded-full font-bold text-sm text-[#0F1226] bg-gradient-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 transition-all shadow-lg shadow-[#E8C170]/20 flex items-center justify-center gap-2"
            @click="startSajuFortune"
          >
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-[#0F1226]" />
            오늘의 사주명리 분석 시작
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
            <span class="text-[10px] pg-text-bold block mb-0.5">오늘의 일진</span>
            <strong class="text-xs pg-text-gold font-serif-kr block">
              {{ result.todaySaju?.ganzhi }}일 ({{ result.todaySaju?.shipsin }})
            </strong>
          </div>
        </div>

        <!-- 2. 중앙 종합 점수 & 원형 게이지 링 카드 -->
        <div class="pg-card border rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl reveal-on-scroll">
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
            命
          </div>

          <div class="relative z-10">
            <!-- 상단 뱃지 -->
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full pg-card-deep pg-border text-[11px] font-semibold pg-text-gold-light mb-5">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--fortune-gold);"></span>
            오늘의 천기누설 · 총평 ✦
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
                :stroke-dashoffset="isAnimated ? sajuScores.strokeDash : 283"
                class="transition-all duration-2000ms ease-out"
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
              <span class="text-[12px] pg-text-soft font-bold mb-0.5">운세 지수</span>
              <div class="flex items-baseline gap-0.5">
                <span class="text-3xl font-extrabold font-serif-kr pg-text tracking-tight">
                  {{ animatedScores.totalScore }}
                </span>
                <span class="text-xs pg-text-gold font-bold">점</span>
              </div>
              <span class="mt-1 text-[10px] px-2 py-0.5 rounded-full pg-card-inner pg-text-gold-bold border pg-border">
                {{ sajuScores.rankText }}
              </span>
            </div>
          </div>

          <!-- 메인 총평 문구 -->
          <h2 class="font-serif-kr text-xl sm:text-2xl font-bold pg-text-gold mb-2 leading-snug">
            "{{ sajuDynamicData.headline }}"
          </h2>
          <p class="text-xs pg-text-muted font-bold max-w-sm mx-auto leading-relaxed">
            {{ sajuDynamicData.headlineSub }}
          </p>
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
                  <span class="text-xs font-bold pg-text-gold">{{ animatedScores.wealthScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">재물운</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.wealth.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-gradient-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated ? `${sajuScores.wealthScore}%` : '0%' }"></div>
              </div>
            </div>

            <!-- 애정운 -->
            <div class="pg-card border rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">🕊️</span>
                  <span class="text-xs font-bold pg-text-gold">{{ animatedScores.loveScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">애정운</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.love.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-gradient-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated ? `${sajuScores.loveScore}%` : '0%' }"></div>
              </div>
            </div>

            <!-- 건강운 -->
            <div class="pg-card border rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">🌿</span>
                  <span class="text-xs font-bold pg-text-gold">{{ animatedScores.healthScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">건강운</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.health.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-gradient-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated ? `${sajuScores.healthScore}%` : '0%' }"></div>
              </div>
            </div>

            <!-- 직업·학업 -->
            <div class="pg-card border rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl">📜</span>
                  <span class="text-xs font-bold pg-text-gold">{{ animatedScores.businessScore }} 점</span>
                </div>
                <h4 class="font-serif-kr text-xs font-bold pg-text mb-1">직업·학업</h4>
                <p class="text-[11px] pg-text-muted font-bold line-clamp-2">
                  {{ sajuDynamicData.categories.business.summary }}
                </p>
              </div>
              <div class="w-full pg-card-inner h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-gradient-to-r from-[#FFE5A3] to-[#E8C170] h-full rounded-full transition-all duration-2000ms ease-out" :style="{ width: isAnimated ? `${sajuScores.businessScore}%` : '0%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 시간대별 일진(日辰) 흐름 (이미지 2 1:1) -->
        <div class="pg-card border rounded-3xl p-5 shadow-lg reveal-on-scroll">
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
                class="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.2 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60 dark:bg-amber-500 dark:text-amber-950 dark:border-amber-400 transition-colors"
              >
                절정
              </span>
              <span :class="[item.isPeak ? 'pg-text-gold' : 'pg-text-muted', 'text-[10px] block mb-0.5']">{{ item.label }}</span>
              <span class="text-[10px] pg-text-soft block mb-1">{{ item.time }}</span>
              <div class="pg-text-gold text-xs font-bold mb-1">{{ item.stars }}</div>
              <span :class="[item.isPeak ? 'pg-text-gold font-bold' : 'pg-text-muted font-bold', 'text-[10px]']">{{ item.desc }}</span>
            </div>
          </div>
        </div>

        <!-- 5. 오늘의 조력 기운 (이미지 2 1:1) -->
        <div class="space-y-2 reveal-on-scroll">
          <span class="text-xs font-bold pg-text-muted flex items-center gap-1 px-1">
            <UIcon name="i-heroicons-chevron-left" class="w-3.5 h-3.5" />
            오늘의 조력 기운
          </span>

          <div class="grid grid-cols-3 gap-2.5">
            <div class="pg-card border rounded-2xl p-3 text-center">
              <span class="text-[10px] pg-text-bold block mb-2">행운의 색</span>
              <div class="w-8 h-8 rounded-full mx-auto mb-2 border border-white/20 shadow-md" :style="{ backgroundColor: sajuDynamicData.luckyItems.colorHex }"></div>
              <span class="text-xs font-bold pg-text block truncate">{{ sajuDynamicData.luckyItems.colorName }}</span>
            </div>

            <div class="pg-card border rounded-2xl p-3 text-center">
              <span class="text-[10px] pg-text-bold block mb-2">행운의 수</span>
              <div class="w-8 h-8 rounded-full pg-card-deep pg-border mx-auto mb-2 flex items-center justify-center pg-text-gold text-xs font-bold">
                #
              </div>
              <span class="text-xs font-bold pg-text-gold-light block truncate">{{ sajuDynamicData.luckyItems.number }}</span>
            </div>

            <div class="pg-card border rounded-2xl p-3 text-center">
              <span class="text-[10px] pg-text-bold block mb-2">행운의 방위</span>
              <div class="w-8 h-8 rounded-full pg-card-deep border pg-border mx-auto mb-2 flex items-center justify-center pg-text-gold shadow-xs">
                <svg class="w-6 h-6 text-[var(--fortune-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                  <polygon points="16.24,7.76 13.8,13.8 7.76,16.24 10.2,10.2" stroke="currentColor" stroke-width="1.2" fill="currentColor" />
                </svg>
              </div>
              <span class="text-xs font-bold pg-text block truncate">{{ sajuDynamicData.luckyItems.direction }}</span>
            </div>
          </div>
        </div>

        <!-- 6. 오늘의 지혜 카드 (이미지 2 1:1) -->
        <div class="pg-card-deep border pg-border-strong rounded-2xl p-5 shadow-lg reveal-on-scroll">
          <span class="text-xs font-bold pg-text-gold flex items-center gap-1 mb-2 font-serif-kr">
            ◆ 오늘의 지혜
          </span>
          <p class="font-serif-kr text-sm pg-text italic leading-relaxed mb-3">
            "{{ sajuDynamicData.wisdom }}"
          </p>
          <p class="text-right text-[11px] pg-text-bold font-serif-kr">
            — 마음에 새기는 화두
          </p>
        </div>

        <!-- 7. 세부 AI 보고서 본문 -->
        <div class="pg-card border rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden reveal-on-scroll">
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
            命
          </div>

          <div class="relative z-10">
            <h3 class="font-serif-kr text-base font-bold pg-text mb-4 border-b pg-border pb-3 flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 pg-text-gold" />
            AI 맞춤 사주명리 보고서
          </h3>
          <div v-html="formattedInterpretation" class="markdown-body"></div>
        </div>
      </div>

        <!-- 7-1. 운세 공감 / 좋아요 반응 박스 -->
        <div class="p-4 rounded-2xl pg-card-inner border pg-border flex items-center justify-between shadow-xs reveal-on-scroll">
          <div class="flex items-center gap-2">
            <span class="text-xs pg-text font-medium">❤️ 오늘 <span class="font-bold text-amber-600 dark:text-[#FFDE9E]">{{ likeCount }}</span>명의 방문자가 이 운세 조언에 공감했습니다.</span>
          </div>
          <div class="relative group shrink-0" @click="handleLikeClick">
            <!-- 1.5초 후 사라지는 이벤트 말풍선 (Tooltip Bubble) -->
            <Transition name="fade-slide">
              <div
                v-if="showLikeTooltip"
                class="absolute -top-9 right-0 whitespace-nowrap bg-rose-950/90 dark:bg-rose-100 text-rose-200 dark:text-rose-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-rose-400/40 pointer-events-none flex items-center gap-1 z-20"
              >
                <span>{{ likeTooltipText }}</span>
                <!-- 말풍선 꼬리 (삼각형) -->
                <span class="absolute -bottom-1 right-5 w-2 h-2 bg-rose-950/90 dark:bg-rose-100 rotate-45 border-r border-b border-rose-400/40"></span>
              </div>
            </Transition>

            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 select-none cursor-pointer"
              :class="alreadyLiked ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' : 'bg-gradient-to-r from-[#FFE5A3] to-[#E8C170] text-[#0B0E1B] hover:brightness-110 active:scale-95'"
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

        <!-- 8. 하단 버튼 영역 (이미지 2 1:1) -->
        <div class="space-y-3 pt-2">
          <button
            type="button"
            class="w-full py-4 rounded-full font-bold text-sm text-[#0F1226] bg-gradient-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 transition-all shadow-xl shadow-[#E8C170]/20 flex items-center justify-center gap-2"
            @click="copyToClipboard"
          >
            <UIcon name="i-heroicons-share" class="w-5 h-5 text-[#0F1226]" />
            오늘의 운세 나누기 (결과 공유)
          </button>

          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="py-3 rounded-full pg-card border text-xs font-semibold pg-text-muted hover:pg-text transition-colors flex items-center justify-center gap-1.5 pg-hover-gold"
              @click="onInstallPWA"
            >
              <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4 pg-text-gold" />
              홈 화면에 앱 추가
            </button>
            <button
              type="button"
              class="py-3 rounded-full pg-card border text-xs font-semibold pg-text-muted hover:pg-text transition-colors flex items-center justify-center gap-1.5 pg-hover-gold"
              @click="store.clearSaju()"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 pg-text-gold" />
              내 사주 다시 입력
            </button>
          </div>
        </div>

        <div class="text-center py-3">
          <p class="text-[11px] pg-text-soft">
            선천적 기운 계산 완료 · {{ todayLunarText }}
          </p>
        </div>

        <!-- AdSense: AI 결과가 있을 때만 표시 (Google 정책 준수) -->
        <div v-if="result && result.aiInterpretation" class="flex justify-center my-4">
          <AdSense adSlot="8877665544" />
        </div>

      </div>

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
  transform: translateY(32px);
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
