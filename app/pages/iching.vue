<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/iching`

useSeoMeta({
  title: '주역점 - 하늘과 땅의 64괘',
  description: '마음에 품은 고민을 주역 64괘와 변효로 풀이하여 깊은 가르침과 3가지 처세 조언을 드립니다.',
  ogTitle: '주역점 - 하늘과 땅의 64괘',
  ogDescription: '마음에 품은 고민을 주역 64괘와 변효로 풀이하여 깊은 가르침과 3가지 처세 조언을 드립니다.',
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
        name: '주역점 - 하늘과 땅의 64괘',
        description: '마음에 품은 고민을 주역 64괘와 변효로 풀이하여 깊은 가르침과 3가지 처세 조언을 드립니다.',
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: '일일운세 ✦ 天命',
          url: runtimeConfig.public?.siteUrl || 'https://sajuapp.co.kr'
        },
        about: {
          '@type': 'Thing',
          name: '주역',
          description: '64괘와 384효를 통한 고전 역학 기반 운세 해석'
        }
      })
    }
  ]
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
  1: { nameKorean: '중천건', nameHanji: '乾爲天', desc: '강건함 / 만물의 시작' },
  2: { nameKorean: '중지곤', nameHanji: '坤爲地', desc: '포용함 / 수용과 순응' },
  3: { nameKorean: '수뢰준', nameHanji: '水雷屯', desc: '시련의 시작 / 기초 다지기' },
  4: { nameKorean: '산수몽', nameHanji: '山水蒙', desc: '미숙함 / 배움과 자문' },
  5: { nameKorean: '수천수', nameHanji: '水天需', desc: '여유로운 기다림 / 때를 도모함' },
  6: { nameKorean: '천수송', nameHanji: '天水訟', desc: '시비와 다툼 / 타협과 양보' },
  7: { nameKorean: '지수사', nameHanji: '地水師', desc: '엄중한 결단 / 대중 지휘' },
  8: { nameKorean: '수지비', nameHanji: '水地比', desc: '조화와 친밀 / 상생과 협력' },
  9: { nameKorean: '풍천소축', nameHanji: '風天小畜', desc: '소소한 축적 / 조심스러운 준비' },
  10: { nameKorean: '천택리', nameHanji: '天澤履', desc: '예의범절 / 조심스러운 행보' },
  11: { nameKorean: '지천태', nameHanji: '地天泰', desc: '태평성대 / 만사 형통' },
  12: { nameKorean: '천지비', nameHanji: '天地否', desc: '소통 단절 / 자중과 쇄국' },
  13: { nameKorean: '천화동인', nameHanji: '天火同人', desc: '동료와의 협력 / 위대한 단결' },
  14: { nameKorean: '화천대유', nameHanji: '火天大有', desc: '크게 소유함 / 풍요의 전성기' },
  15: { nameKorean: '지산겸', nameHanji: '地山謙', desc: '겸손의 덕 / 자신을 낮춤' },
  16: { nameKorean: '뇌지예', nameHanji: '雷地豫', desc: '기쁨과 예비 / 즐거운 대비' },
  17: { nameKorean: '택뢰수', nameHanji: '澤雷隨', desc: '대세 순응 / 순리에 따름' },
  18: { nameKorean: '산풍고', nameHanji: '山風蠱', desc: '폐단 개혁 / 쇄신과 보수' },
  19: { nameKorean: '지택림', nameHanji: '地澤臨', desc: '기회의 도래 / 군림과 관용' },
  20: { nameKorean: '풍지관', nameHanji: '風地觀', desc: '정세 관망 / 성찰과 깊은 관찰' },
  21: { nameKorean: '화뢰서합', nameHanji: '火雷噬嗑', desc: '장애 단죄 / 결단력과 돌파' },
  22: { nameKorean: '산화비', nameHanji: '山火賁', desc: '화려한 장식 / 외양의 내실화' },
  23: { nameKorean: '산지박', nameHanji: '山地剝', desc: '쇠락과 침체 / 은신과 내실' },
  24: { nameKorean: '지뢰복', nameHanji: '地雷復', desc: '희망의 회복 / 새로운 출발' },
  25: { nameKorean: '천뢰무망', nameHanji: '天雷無妄', desc: '순리 순응 / 인위적 욕심 비움' },
  26: { nameKorean: '산천대축', nameHanji: '山天大畜', desc: '역량 비축 / 학문과 힘의 축적' },
  27: { nameKorean: '산뢰이', nameHanji: '山雷頤', desc: '몸과 마음의 수양 / 언행 자제' },
  28: { nameKorean: '택풍대과', nameHanji: '澤風大過', desc: '막중한 책임 / 고난 극복' },
  29: { nameKorean: '중수감', nameHanji: '重水坎', desc: '겹친 험난함 / 자중과 신중' },
  30: { nameKorean: '중화리', nameHanji: '重火離', desc: '타오르는 불길 / 명석함과 안착' },
  31: { nameKorean: '택산함', nameHanji: '澤山咸', desc: '호감과 만남 / 마음의 교감' },
  32: { nameKorean: '뇌풍항', nameHanji: '雷風恒', desc: '한결같은 지조 / 지속적인 노력' },
  33: { nameKorean: '천산둔', nameHanji: '天山遯', desc: '한 걸음 물러섬 / 양보와 피함' },
  34: { nameKorean: '뇌천대장', nameHanji: '雷天大壯', desc: '장대한 기세 / 경거망동 경계' },
  35: { nameKorean: '화지진', nameHanji: '火地晉', desc: '솟구치는 기운 / 적극적 전진' },
  36: { nameKorean: '지화명이', nameHanji: '地火明夷', desc: '빛의 은구 / 어둠 속 인내' },
  37: { nameKorean: '풍화가인', nameHanji: '風火家人', desc: '가화만사성 / 내부의 안정' },
  38: { nameKorean: '화택규', nameHanji: '火澤睽', desc: '뜻의 분열 / 대립과 구설 경계' },
  39: { nameKorean: '수산건', nameHanji: '水山蹇', desc: '얼어붙은 난관 / 멈춤과 지혜' },
  40: { nameKorean: '뇌수해', nameHanji: '雷水解', desc: '매듭의 풀림 / 해소와 봄날' },
  41: { nameKorean: '산택손', nameHanji: '山澤損', desc: '절제와 희생 / 덜어내어 채움' },
  42: { nameKorean: '풍뢰익', nameHanji: '風雷益', desc: '실질적 이득 / 번영과 도약' },
  43: { nameKorean: '택천쾌', nameHanji: '澤天夬', desc: '결연한 단판 / 단호한 결단' },
  44: { nameKorean: '천풍구', nameHanji: '天風姤', desc: '예기치 못한 인연 / 뜻밖의 만남' },
  45: { nameKorean: '택지췌', nameHanji: '澤地萃', desc: '인재와 재물 결집 / 번창함' },
  46: { nameKorean: '지풍승', nameHanji: '地風升', desc: '싹을 틔우는 상승 / 도약과 성장' },
  47: { nameKorean: '택수곤', nameHanji: '澤水困', desc: '곤경과 막힘 / 자금/상황 차단' },
  48: { nameKorean: '수풍정', nameHanji: '水風井', desc: '마르지 않는 샘물 / 지속적 공유' },
  49: { nameKorean: '택화혁', nameHanji: '澤火革', desc: '판도 개혁 / 체제와 혁신' },
  50: { nameKorean: '화풍정', nameHanji: '火風鼎', desc: '새로운 안착 / 솥을 거는 번창' },
  51: { nameKorean: '중뢰진', nameHanji: '重雷震', desc: '두 번의 천둥 / 스스로의 각성' },
  52: { nameKorean: '중산간', nameHanji: '重山艮', desc: '첩첩산중 / 멈추어 서는 고요' },
  53: { nameKorean: '풍산점', nameHanji: '風山漸', desc: '점진적 성숙 / 단계별 발전' },
  54: { nameKorean: '뇌택귀매', nameHanji: '雷澤歸妹', desc: '절차 무시 경계 / 급한 결정 자제' },
  55: { nameKorean: '뇌화풍', nameHanji: '雷火豊', desc: '최절정의 풍요 / 몰락 그늘 경계' },
  56: { nameKorean: '화산려', nameHanji: '火山旅', desc: '외로운 나그네 / 겸손한 처신' },
  57: { nameKorean: '중풍손', nameHanji: '重風巽', desc: '부드러운 유연성 / 침투와 적응' },
  58: { nameKorean: '중택태', nameHanji: '重澤兌', desc: '즐거운 화합 / 다정한 소통' },
  59: { nameKorean: '풍수환', nameHanji: '風水渙', desc: '걱정의 산화 / 해묵은 앙금 해소' },
  60: { nameKorean: '수택절', nameHanji: '水澤節', desc: '적절한 절제 / 규범과 도리' },
  61: { nameKorean: '풍택중부', nameHanji: '風澤中孚', desc: '맑은 신뢰 / 진심 어린 믿음' },
  62: { nameKorean: '뇌산소과', nameHanji: '雷山小過', desc: '낮게 내림 / 소소한 과오 넘김' },
  63: { nameKorean: '수화기제', nameHanji: '水火旣濟', desc: '만사 완성 / 쇠퇴 대비' },
  64: { nameKorean: '화수미제', nameHanji: '火水未濟', desc: '미완의 상태 / 새로운 도전 희망' }
}

const store = useFortuneStore()
const { ichingWorry: worry, ichingResult: result } = storeToRefs(store)
const toast = useToast()

const { formatMarkdown } = useMarkdownFormatter()

const formattedInterpretation = computed(() => {
  return formatMarkdown(result.value?.aiInterpretation)
})

const currentStep = ref(0)
const loading = ref(false)
const activeTab = ref('iching')
const disclaimerModalRef = ref<any>(null)

// 아코디언 열림 상태
const accordionOpen = ref({
  total: false,
  line: false,
  symbol: false
})

// 스크롤 시 아래에서 솟아오르는 효과 (IntersectionObserver)
const setupScrollObserver = () => {
  if (typeof window === 'undefined') return
  nextTick(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    })

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach(el => observer.observe(el))
  })
}

onMounted(() => {
  setupScrollObserver()
})

watch(currentStep, () => {
  setupScrollObserver()
})

const toggleAccordion = (key: 'total' | 'line' | 'symbol') => {
  accordionOpen.value[key] = !accordionOpen.value[key]
  setupScrollObserver()
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
  toast.add({
    title: '☯️ 주역 괘 도출 시작',
    description: '1단계: 마음을 가다듬고 하괘(下卦) 점대를 선택해 주세요.',
    icon: 'i-heroicons-sparkles',
    color: 'warning'
  })
}

const handleStickClick = async (stick: any) => {
  if (stick.isFlipped) return
  stick.isFlipped = true

  if (currentStep.value === 1) {
    lowerTrigram.value = stick.trigram
    setTimeout(() => {
      currentStep.value = 2
      initTrigramSticks()
      toast.add({
        title: '☯️ 2단계: 상괘(上卦) 선택',
        description: '두 번째 대나무 점대를 선택해 주세요.',
        icon: 'i-heroicons-sparkles',
        color: 'warning'
      })
    }, 1000)
  } else if (currentStep.value === 2) {
    upperTrigram.value = stick.trigram
    setTimeout(() => {
      currentStep.value = 3
      initLineSticks()
      toast.add({
        title: '☯️ 3단계: 동효(動爻) 선택',
        description: '변화할 효(動爻) 점대를 선택해 주세요.',
        icon: 'i-heroicons-sparkles',
        color: 'warning'
      })
    }, 1000)
  } else if (currentStep.value === 3) {
    selectedLine.value = stick.lineNum
    setTimeout(async () => {
      currentStep.value = 4
      loading.value = true
      toast.add({
        title: '☯️ 본괘와 변괘 맞추는 중...',
        description: '384효 고전 원전과 AI 지혜 조언을 조율하고 있습니다.',
        icon: 'i-heroicons-arrow-path',
        color: 'neutral'
      })

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
            if (res.isAiGenerated) {
              toast.add({
                title: '✨ AI 주역 맞춤 분석 완료',
                description: 'AI의 실시간 맞춤 괘사와 처세 조언이 도출되었습니다.',
                icon: 'i-heroicons-sparkles',
                color: 'success',
                duration: 3500
              })
            } else {
              toast.add({
                title: '📜 고전 원전 괘 해설 도출',
                description: '주역 64괘 및 384효 원천 DB 해설이 준비되었습니다.',
                icon: 'i-heroicons-book-open',
                color: 'warning',
                duration: 3500
              })
            }
            if (res.hexagram) {
              fetchLikeStats(res.hexagram.id, res.hexagram.lineNumber)
            }
          } else {
            toast.add({
              title: '오류 발생',
              description: res.error || '운세를 불러오는 중 오류가 발생했습니다.',
              icon: 'i-heroicons-exclamation-triangle',
              color: 'error'
            })
            currentStep.value = 0
          }
          loading.value = false
        }, remainingTime)
      } catch (error: any) {
        const statusCode = error?.statusCode || error?.status || error?.response?.status
        const statusMessage = error?.statusMessage || error?.data?.statusMessage || error?.data?.message || error?.message || ''

        if (statusCode === 429) {
          // 1일 1회 조회 제한 안내
          toast.add({
            title: '✦ 오늘의 주역 조회 안내',
            description: `${statusMessage}\n오늘 이미 조회하신 결과를 확인하실 수 있습니다.`,
            icon: 'i-heroicons-information-circle',
            color: 'warning',
            duration: 6000
          })
          // 저장된 결과가 없으면 로컬 스토리지에서 불러와 표시
          if (!result.value) {
            store.loadFromLocalStorage()
          }
          if (result.value) {
            currentStep.value = 5
          } else {
            currentStep.value = 0
          }
        } else {
          console.error('[IChing API Error]', error)
          toast.add({
            title: '서버 연결 오류',
            description: statusMessage || '서버 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
            icon: 'i-heroicons-exclamation-triangle',
            color: 'error'
          })
          currentStep.value = 0
        }
        loading.value = false
      }
    }, 1000)
  }
}

// 운세 결과 공감/좋아요 카운터
const likeCount = ref(0)
const alreadyLiked = ref(false)
const showAlreadyLikedTooltip = ref(false) // 두 번째 클릭부터 2초간 표시
let tooltipTimer: ReturnType<typeof setTimeout> | null = null

// localStorage에서 좋아요 상태 복원
const loadLikeState = (targetKey: string) => {
  if (import.meta.client) {
    const stored = localStorage.getItem(`like_${targetKey}`)
    if (stored === 'true') {
      alreadyLiked.value = true
    } else {
      alreadyLiked.value = false
    }
  }
}

const fetchLikeStats = async (hexId: number, lineNum: number) => {
  const targetKey = `iching_${hexId}_${lineNum}`
  loadLikeState(targetKey)
  try {
    const res: any = await $fetch('/api/fortune/like', {
      params: { type: 'iching', targetKey }
    })
    if (res?.success) {
      likeCount.value = res.likeCount
      // 서버 alreadyLiked 값도 반영 (localStorage와 OR)
      if (res.alreadyLiked) alreadyLiked.value = true
    }
  } catch (e) {
    console.warn('Failed to fetch like stats:', e)
  }
}

const toggleLike = async () => {
  if (!result.value?.hexagram) return
  const hexId = result.value.hexagram.id
  const lineNum = result.value.hexagram.lineNumber
  const targetKey = `iching_${hexId}_${lineNum}`

  if (alreadyLiked.value) {
    // 두 번째 클릭: 풍선 메시지 2초 표시
    showAlreadyLikedTooltip.value = true
    if (tooltipTimer) clearTimeout(tooltipTimer)
    tooltipTimer = setTimeout(() => {
      showAlreadyLikedTooltip.value = false
    }, 2000)
    return
  }

  try {
    alreadyLiked.value = true
    likeCount.value++
    // localStorage에 좋아요 상태 저장
    if (import.meta.client) {
      localStorage.setItem(`like_${targetKey}`, 'true')
    }
    await $fetch('/api/fortune/like', {
      method: 'POST',
      body: { type: 'iching', targetKey }
    })
  } catch (e) {
    console.warn('Failed to post like:', e)
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

function getFateBadge(fateText: string | undefined | null, fallbackLabel: string = '조언 ●') {
  if (!fateText) {
    return {
      label: fallbackLabel,
      class: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
    }
  }

  const text = fateText.trim()

  if (
    /형통|대길|성공|최고|상승|풍요|번창|전성기|도약|호조|유리|상승세|길합니다|좋으나|훌륭한|기회/i.test(text) &&
    !/손해|위기|다툼|마찰|주의|난항|지연|경계/i.test(text.slice(0, 15))
  ) {
    if (/형통|대길|전성기|번창|성공/i.test(text)) {
      return {
        label: '대길 ▲',
        class: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
      }
    }
    return {
      label: '길함 ▲',
      class: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
    }
  }

  if (/안정|조화|협력|화합|원만|신뢰|헌신|상생|친밀|도움/i.test(text)) {
    return {
      label: '안정 ▶',
      class: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
    }
  }

  if (/난항|시비|다툼|마찰|손해|위기|손실|절대 보류|차단|곤경|단절|불가|경계|자제/i.test(text)) {
    return {
      label: '주의 ▼',
      class: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
    }
  }

  return {
    label: '조언 ●',
    class: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
  }
}

const fateCategories = computed(() => {
  if (!result.value?.hexagram) return []

  const hex = result.value.hexagram
  return [
    {
      title: '일 · 사업',
      text: hex.businessFate,
      badge: getFateBadge(hex.businessFate, '길함 ▲')
    },
    {
      title: '재물 · 투자',
      text: hex.wealthFate,
      badge: getFateBadge(hex.wealthFate, '안정 ▶')
    },
    {
      title: '인간관계',
      text: hex.loveFate,
      badge: getFateBadge(hex.loveFate, '화합 ▶')
    },
    {
      title: '종합 운세',
      text: hex.generalFate,
      badge: getFateBadge(hex.generalFate, '조언 ●')
    }
  ]
})

// KST(한국 표준시) 기준 날짜 및 시간 계산
const formattedKstDateTime = computed(() => {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const kst = new Date(utc + (9 * 60 * 60 * 1000))

  const year = kst.getFullYear()
  const month = String(kst.getMonth() + 1).padStart(2, '0')
  const date = String(kst.getDate()).padStart(2, '0')
  const hours = String(kst.getHours()).padStart(2, '0')
  const minutes = String(kst.getMinutes()).padStart(2, '0')

  const stems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"]
  const branches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"]
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const dayOfWeek = dayNames[kst.getDay()]!
  
  let stemIdx = (year - 4) % 10
  if (stemIdx < 0) stemIdx += 10
  let branchIdx = (year - 4) % 12
  if (branchIdx < 0) branchIdx += 12

  const yearGanzhi = `${stems[stemIdx]}${branches[branchIdx]}년`

  return `${yearGanzhi} ${month}월 ${date}일 ${dayOfWeek} · ${year}.${month}.${date} ${hours}:${minutes}`
})

const copyToClipboard = () => {
  if (!navigator.clipboard) {
    alert('이 브라우저는 복사 기능을 지원하지 않습니다.')
    return
  }
  if (!result.value) return

  const hex = result.value.hexagram
  const detail = hexagramLinesDetail.value

  const shareText = `☯️ [sajuapp.co.kr] I CHING ORACLE 주역점 결과 ☯️
--------------------------------------
● 선택한 고민: "${worry.value || '오늘 하루의 운세와 지혜'}"
● 본괘: 제${hex.id}괘 ${hex.nameKorean} (${hex.nameHanji})
● 변괘: 제${detail.changed.id}괘 ${detail.changed.nameKorean} (${detail.changed.nameHanji})
● 변효: ${detail.lineText}
● 괘사 요약: "${hex.summary}"

[핵심 요약]
"순풍에 돛을 올리듯, 바른 뜻으로 나아가면 크게 형통합니다"

--------------------------------------
나의 주역 괘 직접 점쳐보기: https://sajuapp.co.kr/iching`

  navigator.clipboard.writeText(shareText)
    .then(() => {
      toast.add({
        title: '📋 주역점 결과 복사 완료',
        description: '결과 보고서가 복사되었습니다. 카카오톡이나 SNS에 공유해보세요!',
        icon: 'i-heroicons-clipboard-document-check',
        color: 'success'
      })
    })
    .catch(err => {
      console.error(err)
      toast.add({
        title: '복사 실패',
        description: '클립보드 복사 중 오류가 발생했습니다.',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error'
      })
    })
}
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-lg mx-auto px-4 py-4 sm:py-6">

      <!-- 헤더 (첫 번째 이미지 1:1) -->
      <div class="flex items-center justify-between pb-3 border-b pg-border mb-4">
        <NuxtLink to="/" class="p-1.5 rounded-full pg-back-btn transition-colors">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="text-center">
          <span class="text-[9px] font-bold tracking-widest text-[#4b360c] block uppercase">I CHING ORACLE</span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            주역점 결과
          </h1>
        </div>
        <button type="button" class="p-1.5 rounded-full pg-text-muted hover:pg-text transition-colors">
          <UIcon name="i-heroicons-[#1E2640]" class="w-5 h-5 i-heroicons-bookmark" />
        </button>
      </div>

      <!-- ========================================== -->
      <!-- 단계 0: 질문 입력 박스 -->
      <!-- ========================================== -->
      <div v-if="currentStep === 0" class="pg-card border rounded-3xl p-5 sm:p-6 shadow-xl mb-6 relative overflow-hidden reveal-on-scroll">
        <!-- Background Watermark (z-0) -->
        <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
          易
        </div>

        <div class="relative z-10">
          <div class="text-center py-2 mb-4">
            <span class="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-[#E8C170]/10 border border-amber-300 dark:border-[#E8C170]/30 text-amber-800 dark:text-amber-300 text-xs font-bold font-serif-kr mb-2">
              ☯️ I CHING ORACLE
            </span>
            <h2 class="font-serif-kr text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              풀어내고자 하는 고민을 떠올려보세요
            </h2>
            <p class="text-xs text-gray-600 dark:text-gray-300 max-w-xs mx-auto leading-relaxed font-normal">
              주역 64괘의 괘사와 변효(動爻)가 당신의 고민에 전하는 처세와 지혜를 명확히 제시합니다.
            </p>
          </div>

          <div class="mb-5">
            <label for="worry-iching" class="block text-xs font-bold text-amber-800 dark:text-amber-300 mb-2 font-serif-kr">
              ❓ 질문 내용 (예: 새로운 일을 시작해도 될까요?)
            </label>
            <textarea
              id="worry-iching"
              v-model="worry"
              placeholder="마음속에 간절히 바라거나 판단이 필요한 고민을 입력해 보세요."
              rows="3"
              class="iching-textarea w-full py-3 px-4 rounded-2xl focus:outline-hidden text-xs sm:text-sm resize-none text-gray-900 dark:text-gray-100"
            ></textarea>
          </div>

          <button
            type="button"
            class="hover:cursor-pointer w-full py-3.5 rounded-full font-bold text-sm text-[#0B0E1B] bg-gradient-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 transition-all shadow-lg shadow-[#E8C170]/20 flex items-center justify-center gap-2"
            @click="startRitual"
          >
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-[#0B0E1B]" />
            주역 괘 도출하기 (3단계)
          </button>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- 단계 1 ~ 3: 3단계 대나무 점대 드로우 -->
      <!-- ========================================== -->
      <div v-if="currentStep >= 1 && currentStep <= 3" class="pg-card border rounded-3xl p-5 sm:p-6 shadow-xl mb-6 relative overflow-hidden reveal-on-scroll">
        <!-- Background Watermark (z-0) -->
        <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
          易
        </div>

        <div class="relative z-10">
          <div class="flex justify-between items-center mb-6 border-b pg-border pb-4">
            <div>
              <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 tracking-wider uppercase block mb-0.5"></span>
              <h2 class="font-serif-kr text-base font-bold text-gray-900 dark:text-gray-100">
                <span v-if="currentStep === 1">1단계: 하괘(下卦) 선택</span>
                <span v-if="currentStep === 2">2단계: 상괘(上卦) 선택</span>
                <span v-if="currentStep === 3">3단계: 동효(動爻) 선택</span>
              </h2>
            </div>
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full" :class="currentStep >= 1 ? 'bg-(--fortune-gold)' : 'pg-card-inner border pg-border'"></span>
              <span class="w-2.5 h-2.5 rounded-full" :class="currentStep >= 2 ? 'bg-(--fortune-gold)' : 'pg-card-inner border pg-border'"></span>
              <span class="w-2.5 h-2.5 rounded-full" :class="currentStep >= 3 ? 'bg-(--fortune-gold)' : 'pg-card-inner border pg-border'"></span>
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
              <div class="absolute inset-0 bg-gradient-to-b from-[#78350F] via-[#713F12] to-[#451A03] flex flex-col items-center justify-between py-3 border border-[#B45309]/50 rounded-xl shadow-lg backface-hidden z-10">
                <span class="text-[12px] text-[#FDE047]/40 select-none">☯</span>
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
      </div>

      <!-- ========================================== -->
      <!-- 단계 4: 로딩 화면 -->
      <!-- ========================================== -->
      <div v-if="currentStep === 4" class="pg-card border rounded-3xl p-8 sm:p-10 text-center shadow-xl mb-6 relative overflow-hidden">
        <!-- Background Watermark (z-0) -->
        <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
          易
        </div>

        <div class="relative z-10">
          <div class="relative w-24 h-24 mx-auto flex items-center justify-center mb-6">
            <div class="absolute inset-0 rounded-full border-4 border-dashed border-[#E8C170]/40 animate-spin" style="animation-duration: 6s;"></div>
            <div class="w-12 h-12 rounded-full pg-card-inner border pg-border flex items-center justify-center shadow-inner animate-pulse">
              <span class="seal-stamp text-xs px-2 py-0.5">易</span>
            </div>
          </div>
          <h3 class="font-serif-kr text-base font-bold text-gray-900 dark:text-gray-100 mb-1 animate-pulse">
            본괘와 변괘를 맞추는 중입니다...
          </h3>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- 단계 5: 주역점 결과 화면 (이미지 1:1 완벽 반영) -->
      <!-- ========================================== -->
      <div v-if="currentStep === 5 && result" class="space-y-4">

        <!-- 1. 질문 카드 (상단 인풋 요약) -->
        <div class="pg-card border rounded-2xl p-4 relative reveal-on-scroll">
          <div class="flex justify-between items-start mb-2">
            <h2 class="font-serif-kr text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 leading-snug">
              "{{ worry || '오늘 하루의 운세와 지혜' }}"
            </h2>
          </div>
          <div class="flex items-center justify-between text-[12px] text-gray-600 dark:text-gray-300">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
              {{ formattedKstDateTime }}
            </span>
            <span class="px-2 py-0.5 rounded-md pg-chip text-amber-700 dark:text-amber-300 border pg-border text-[11px]">
              문사 (問事)
            </span>
          </div>
        </div>

        <!-- 2. 본괘 & 변괘 6효 카드 (이미지 메인 1:1) -->
        <div class="pg-card border rounded-3xl p-5 shadow-2xl relative overflow-hidden reveal-on-scroll">
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0">
            易
          </div>

          <div class="relative z-10">
            <!-- 상단 뱃지 -->
            <div class="text-center mb-4">
              <span class="inline-block px-3 py-0.5 rounded-full pg-chip border pg-border text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                ● 동효: {{ hexagramLinesDetail.lineText }} ✦
              </span>
            </div>

            <!-- 본괘 ➔ 변괘 대칭 디스플레이 -->
            <div class="grid grid-cols-2 gap-4 items-stretch mb-5 relative">

              <!-- 본괘 (Origin) -->
              <div class="pg-card-inner border pg-border-strong rounded-2xl p-3.5 text-center flex flex-col justify-between h-full">
                <div>
                  <span class="text-[11px] text-amber-700 dark:text-amber-300 font-bold block mb-1">본괘 [本卦]</span>
                  <h3 class="font-serif-kr text-base font-extrabold text-gray-900 dark:text-gray-100 mb-1">
                    제{{ hexagramLinesDetail.origin.id }}괘 {{ hexagramLinesDetail.origin.nameKorean }}
                  </h3>
                  <div class="min-h-10 flex items-center justify-center mb-3">
                    <p class="text-[11px] text-gray-600 dark:text-gray-300 leading-tight">{{ hexagramLinesDetail.origin.desc }}</p>
                  </div>

                  <!-- 6효 그리기 (상효 ~ 초효: 아래에서 위로) -->
                  <div class="space-y-1.5 max-w-25 mx-auto mb-3">
                    <div
                      v-for="(val, index) in [...hexagramLinesDetail.origin.lines].reverse()"
                      :key="index"
                      class="h-2 rounded flex items-center justify-between overflow-hidden relative"
                      :class="6 - index === hexagramLinesDetail.lineNum ? 'ring-2 ring-amber-600 dark:ring-[#E8C170] shadow-[0_0_10px_rgba(217,119,6,0.4)] dark:shadow-[0_0_10px_rgba(232,193,112,0.6)]' : ''"
                    >
                      <!-- 양효 (1): 통 줄 -->
                      <template v-if="val === 1">
                        <div class="w-full h-full bg-[#93C5FD] rounded-sm shadow-sm" :class="6 - index === hexagramLinesDetail.lineNum ? 'bg-amber-600 dark:bg-[#FDE047] animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.8)] dark:shadow-[0_0_8px_#FDE047]' : ''"></div>
                      </template>
                      <!-- 음효 (0): 두 갈래 -->
                      <template v-else>
                        <div class="w-[45%] h-full bg-[#93C5FD] rounded-sm" :class="6 - index === hexagramLinesDetail.lineNum ? 'bg-amber-600 dark:bg-[#FDE047] animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.8)] dark:shadow-[0_0_8px_#FDE047]' : ''"></div>
                        <div class="w-[45%] h-full bg-[#93C5FD] rounded-sm" :class="6 - index === hexagramLinesDetail.lineNum ? 'bg-amber-600 dark:bg-[#FDE047] animate-pulse shadow-[0_0_8px_rgba(217,119,6,0.8)] dark:shadow-[0_0_8px_#FDE047]' : ''"></div>
                      </template>
                    </div>
                  </div>
                </div>

                <span class="text-[11px] text-gray-500 dark:text-gray-400 font-serif-kr block">
                  {{ hexagramLinesDetail.origin.upperName }} · {{ hexagramLinesDetail.origin.lowerName }}
                </span>
              </div>

              <!-- 변효 화살표 (중앙 - 좌우 흐름 애니메이션 & 라이트/다크모드 시인성 강화) -->
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full text-amber-700 dark:text-[#FFDE9E] border border-amber-500/60 dark:border-[#E8C170]/60 shadow-lg shadow-amber-600/30 dark:shadow-[#E8C170]/20 bg-amber-50 dark:bg-[#1A1D2E]">
                <UIcon name="i-heroicons-arrow-right" class="w-4.5 h-4.5 text-amber-700 dark:text-[#E8C170] animate-arrow-flow" />
              </div>

              <!-- 변괘 (Changed) -->
              <div class="pg-card-inner border pg-border-strong rounded-2xl p-3.5 text-center flex flex-col justify-between h-full">
                <div>
                  <span class="text-[11px] text-amber-700 dark:text-amber-300 font-bold block mb-1">변괘 [變卦]</span>
                  <h3 class="font-serif-kr text-base font-extrabold text-gray-900 dark:text-gray-100 mb-1">
                    제{{ hexagramLinesDetail.changed.id }}괘 {{ hexagramLinesDetail.changed.nameKorean }}
                  </h3>
                  <div class="min-h-10 flex items-center justify-center mb-3">
                    <p class="text-[11px] text-gray-600 dark:text-gray-300 leading-tight">{{ hexagramLinesDetail.changed.desc }}</p>
                  </div>

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
                </div>

                <span class="text-[11px] text-gray-500 dark:text-gray-400 font-serif-kr block">
                  {{ hexagramLinesDetail.changed.upperName }} · {{ hexagramLinesDetail.changed.lowerName }}
                </span>
              </div>
            </div>

            <!-- 하단 요약 정보 -->
            <div class="flex justify-between items-center px-2 pt-2 border-t pg-border text-[11px]">
              <span class="text-gray-600 dark:text-gray-300">{{ hexagramLinesDetail.harmonyText }}</span>
              <span class="text-amber-700 dark:text-amber-300 font-bold">{{ hexagramLinesDetail.fortuneBadge }}</span>
            </div>
          </div>
        </div>

        <!-- 3. AI 주역 지혜 보고서 (Claude / Gemini AI 총평) -->
        <div v-if="result.aiInterpretation" class="pg-card border rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden reveal-on-scroll">
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-3 -bottom-5 text-slate-400/20 dark:text-[#E8C170]/08 text-8xl font-serif-kr select-none pointer-events-none z-0">
            易
          </div>

          <div class="relative z-10 space-y-3">
            <div class="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-bold pb-2 border-b pg-border">
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-amber-600 dark:text-amber-300" />
              <span>AI 주역 맞춤 지혜 조언</span>
              <span v-if="result.isAiGenerated" class="ml-auto text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-[#10B981]/20 text-emerald-700 dark:text-emerald-300 font-normal">AI 실시간 분석</span>
            </div>
            <div v-html="formattedInterpretation" class="markdown-body max-w-none text-xs sm:text-sm leading-relaxed font-normal text-gray-800 dark:text-gray-200"></div>
          </div>
        </div>

        <!-- 4. 괘도 핵심 요약 -->
        <div class="pg-card border rounded-2xl p-5 shadow-lg relative overflow-hidden reveal-on-scroll">
          <!-- Background Watermark (z-0) -->
          <div class="absolute -right-3 -top-5 text-slate-400/20 dark:text-[#E8C170]/08 text-8xl font-serif-kr select-none pointer-events-none z-0">
            易
          </div>

          <div class="relative z-10">
            <div class="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-bold mb-2">
              <UIcon name="i-heroicons-share" class="w-4 h-4" />
              괘도 핵심 요약
            </div>
            <h2 class="font-serif-kr text-base sm:text-lg font-bold text-amber-800 dark:text-amber-300 mb-2 leading-snug">
              "{{ result.hexagram.summary }}"
            </h2>
            <p class="text-xs text-gray-800 dark:text-gray-200 font-normal leading-relaxed">
              {{ result.hexagram.nameKorean }}({{ result.hexagram.nameHanji }}) - {{ result.hexagram.meaning }}
            </p>
          </div>
        </div>

        <!-- 5. 고전 원문 심층 풀이 (아코디언) -->
        <div class="space-y-2 reveal-on-scroll">
          <span class="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 px-1 font-serif-kr">
            ✦ 고전 원문 심층 풀이
          </span>

          <div class="iching-accordion-box pg-card rounded-2xl overflow-hidden">
            <!-- 아코디언 1: 괘사 본괘 총론 -->
            <div>
              <button
                type="button"
                @click="toggleAccordion('total')"
                class="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded pg-chip text-amber-700 dark:text-amber-300 border pg-border text-[10px]">괘사 (卦辭)</span>
                  {{ result.hexagram.nameKorean }} 본괘 총론
                </span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
                  :class="accordionOpen.total ? 'rotate-180' : ''"
                />
              </button>
              <div v-if="accordionOpen.total" class="p-4 pt-0 text-xs text-gray-800 dark:text-gray-200 font-serif-kr space-y-2 leading-relaxed">
                <p class="text-amber-800 dark:text-amber-300 font-bold">{{ result.hexagram.nameHanji }} - {{ result.hexagram.nameKorean }}</p>
                <p class="font-sans-kr font-normal text-gray-800 dark:text-gray-200">
                  "{{ result.hexagram.summary }}"
                </p>
                <p class="font-sans-kr font-normal text-gray-600 dark:text-gray-300">
                  {{ result.hexagram.meaning }}
                </p>
              </div>
            </div>

            <!-- 아코디언 2: 효사 동효의 가르침 -->
            <div>
              <button
                type="button"
                @click="toggleAccordion('line')"
                class="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded pg-chip text-amber-700 dark:text-amber-300 border pg-border text-[10px]">효사 (爻辭)</span>
                  {{ hexagramLinesDetail.lineText }}의 가르침
                </span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
                  :class="accordionOpen.line ? 'rotate-180' : ''"
                />
              </button>
              <div v-if="accordionOpen.line" class="p-4 pt-0 text-xs text-gray-800 dark:text-gray-200 font-serif-kr space-y-2 leading-relaxed">
                <p class="text-amber-800 dark:text-amber-300 font-bold">● 동효: {{ hexagramLinesDetail.lineText }}</p>
                <p class="font-sans-kr font-normal text-gray-800 dark:text-gray-200">
                  "{{ hexagramLinesDetail.lineText }}가 움직여 {{ hexagramLinesDetail.changed.nameKorean }}({{ hexagramLinesDetail.changed.nameHanji }}) 괘의 기운으로 변화합니다."
                </p>
                <p class="font-sans-kr font-normal text-gray-600 dark:text-gray-300">
                  {{ hexagramLinesDetail.changed.desc }}
                </p>
              </div>
            </div>

            <!-- 아코디언 3: 상전 대자연의 형상과 리더십 -->
            <div>
              <button
                type="button"
                @click="toggleAccordion('symbol')"
                class="w-full p-4 flex justify-between items-center text-left text-xs font-bold text-gray-900 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded pg-chip text-amber-700 dark:text-amber-300 border pg-border text-[10px]">상전 (象傳)</span>
                  대자연의 형상과 리더십
                </span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
                  :class="accordionOpen.symbol ? 'rotate-180' : ''"
                />
              </button>
              <div v-if="accordionOpen.symbol" class="p-4 pt-0 text-xs text-gray-800 dark:text-gray-200 font-sans-kr font-normal leading-relaxed">
                {{ hexagramLinesDetail.origin.upperName }}와 {{ hexagramLinesDetail.origin.lowerName }}가 상응하는 형상으로, {{ result.hexagram.generalFate }}
              </div>
            </div>
          </div>
        </div>

        <!-- 6. 영역별 흐름 가이드 -->
        <div class="space-y-2 reveal-on-scroll">
          <span class="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 px-1">
            ✦ 영역별 흐름 가이드
          </span>

          <div class="grid grid-cols-2 gap-2.5">
            <div
              v-for="cat in fateCategories"
              :key="cat.title"
              class="pg-card-inner border pg-border rounded-2xl p-3.5 flex flex-col justify-between"
            >
              <div>
                <div class="flex justify-between items-center mb-1.5">
                  <h4 class="font-serif-kr text-xs font-bold text-gray-900 dark:text-gray-100">{{ cat.title }}</h4>
                  <span
                    class="px-2 py-0.5 rounded text-[9px] font-bold shrink-0"
                    :class="cat.badge.class"
                  >
                    {{ cat.badge.label }}
                  </span>
                </div>
                <p class="text-[11px] text-gray-700 dark:text-gray-300 font-normal leading-relaxed">
                  {{ cat.text }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 7. 지금 취해야 할 3가지 자세 (處世) -->
        <div class="pg-card border pg-border rounded-2xl p-5 shadow-lg reveal-on-scroll" style="background: linear-gradient(to bottom, var(--fortune-card), var(--fortune-card-deep));">
          <div class="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-gray-100 mb-3">
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-amber-700 dark:text-amber-300" />
            지금 취해야 할 3가지 자세 (處世)
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-emerald-100 dark:bg-[#10B981]/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <div>
                <strong class="text-amber-800 dark:text-amber-300 font-bold">본괘의 지혜:</strong>
                <span class="text-gray-800 dark:text-gray-200 font-normal"> {{ result.hexagram.nameKorean }} 괘의 뜻을 되새겨 차분하게 중심을 잡으세요.</span>
              </div>
            </div>

            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-emerald-100 dark:bg-[#10B981]/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <div>
                <strong class="text-amber-800 dark:text-amber-300 font-bold">동효의 조언:</strong>
                <span class="text-gray-800 dark:text-gray-200 font-normal"> {{ hexagramLinesDetail.lineText }}가 움직여 변화하는 기운에 맞춰 유연하게 순응하세요.</span>
              </div>
            </div>

            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-emerald-100 dark:bg-[#10B981]/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <div>
                <strong class="text-amber-800 dark:text-amber-300 font-bold">변괘의 방향:</strong>
                <span class="text-gray-800 dark:text-gray-200 font-normal"> 결국 {{ hexagramLinesDetail.changed.nameKorean }} 괘상처럼 {{ hexagramLinesDetail.changed.desc }}의 결실로 지혜롭게 나아가게 됩니다.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 7-1. 운세 공감 / 좋아요 반응 박스 -->
        <div class="p-4 rounded-2xl pg-card-inner border pg-border flex items-center justify-between shadow-xs reveal-on-scroll">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-800 dark:text-gray-200 font-medium">❤️ 오늘 <span class="font-bold text-amber-700 dark:text-amber-300">{{ likeCount }}</span>명의 방문자가 이 운세 조언에 공감했습니다.</span>
          </div>
          <div class="relative group shrink-0">
            <!-- 이미 선택하였음을 알리는 말풍선 - 두 번째 클릭부터 2초간만 표시 -->
            <div
              v-if="showAlreadyLikedTooltip"
              class="absolute -top-8 right-0 whitespace-nowrap bg-rose-950/90 dark:bg-rose-100 text-rose-200 dark:text-rose-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg border border-rose-400/40 pointer-events-none flex items-center gap-1 transition-opacity duration-300"
            >
              <span>이미 선택하셨습니다</span>
              <!-- 말풍선 꼬리 (삼각형) -->
              <span class="absolute -bottom-1 right-5 w-2 h-2 bg-rose-950/90 dark:bg-rose-100 rotate-45 border-r border-b border-rose-400/40"></span>
            </div>

            <button
              type="button"
              @click="toggleLike"
              :disabled="alreadyLiked"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0"
              :class="alreadyLiked ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 cursor-default' : 'bg-gradient-to-r from-[#FFE5A3] to-[#E8C170] text-[#0B0E1B] hover:brightness-110 active:scale-95 cursor-pointer'"
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

        <!-- 8. 버튼 영역 (이미지 1:1) -->
        <div class="space-y-2.5 pt-2 reveal-on-scroll">
          <button
            type="button"
            class="w-full py-3.5 rounded-full font-bold text-xs sm:text-sm text-[#0B0E1B] bg-gradient-to-r from-[#FFE5A3] via-[#E8C170] to-[#C99632] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-[#E8C170]/20 flex items-center justify-center gap-2"
            @click="copyToClipboard"
          >
            <UIcon name="i-heroicons-bookmark" class="w-4 h-4 text-[#0B0E1B]" />
            결과 저장하기 (클립보드 복사)
          </button>

          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 py-3 rounded-full bg-[#F3F4F6] dark:bg-[#0F2323] border border-gray-300 dark:border-[#1A3030] text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#153838] hover:border-amber-500 dark:hover:border-amber-400 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5"
              @click="resetAll"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-amber-700 dark:text-amber-300" />
              다시 점치기
            </button>
            <button
              type="button"
              class="p-3 rounded-full bg-[#F9FAFB] dark:bg-[#0A1A1A] border border-gray-300 dark:border-[#1A3030] text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#153838] hover:border-amber-500 dark:hover:border-amber-400 active:scale-95 transition-all duration-200 flex items-center justify-center"
              @click="copyToClipboard"
            >
              <UIcon name="i-heroicons-share" class="w-4 h-4 text-amber-700 dark:text-amber-300" />
            </button>
          </div>
        </div>

        <!-- 하단 가이드 문구 -->
        <p class="text-center text-[10px] pg-text-soft py-3 leading-relaxed">
          ※ 주역점은 삶의 지혜와 마음을 가다듬기 위한 참고용이며, 최종 선택과 판단은 스스로 내려보세요.
        </p>

      </div>

    </div>

    <!-- 하단 탭바 -->
    <div class="fixed bottom-0 left-0 right-0 bg-(--fortune-bg)/95 backdrop-blur-md border-t pg-border z-50 py-2">
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
          class="flex flex-col items-center gap-1 py-1 pg-text-soft hover:pg-text-muted transition-colors"
        >
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
          <span class="text-[10px] font-medium">오늘 사주</span>
        </NuxtLink>

        <NuxtLink
          to="/iching"
          class="flex flex-col items-center gap-1 py-1 transition-colors pg-text-gold"
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
      title="오늘의 주역 비결 64괘 정밀 분석 중"
      subtitle="뽑으신 괘사, 효사 및 동효 변괘를 정밀 풀이하느라 약 30~35초가 소요됩니다."
      :estimated-seconds="35"
      icon="☯️"
      :tips="[
        '☯️ 주역(周易)은 만물의 순환과 변화의 이치를 다스리는 64괘의 지혜서입니다.',
        '📜 본괘(本卦)는 현재의 상황을, 지괘(之卦/변괘)는 앞으로 나아갈 변화의 방향을 뜻합니다.',
        '⚡ 동효(動爻)는 현재 시점에서 가장 역동적으로 조심하거나 발휘해야 할 핵심 포인트입니다.',
        '🌊 수뢰준(水雷屯)이나 중수감(重水坎)처럼 험난한 괘가 나와도 인내하면 반드시 회복의 괘가 도래합니다.',
        '🌟 처세의 지혜를 마음 깊이 되새기면 다가올 위기를 기회로 바꿀 수 있습니다.'
      ]"
    />
  </div>
</template>

<style scoped>
.iching-textarea {
  border: 1px solid var(--fortune-border-strong);
  color: var(--fortune-text);
  background-color: var(--fortune-input-bg);
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
.iching-textarea:focus {
  border-color: var(--fortune-gold);
}
.iching-textarea::placeholder {
  color: var(--fortune-text-soft);
}

.iching-accordion-box {
  border: 1px solid var(--fortune-border);
}
.iching-accordion-box > div + div {
  border-top: 1px solid var(--fortune-border);
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

/* 본괘 -> 변괘 화살표 좌우 흐름 애니메이션 */
@keyframes arrowFlow {
  0% {
    transform: translateX(-3px);
    opacity: 0.7;
    filter: drop-shadow(0 0 2px rgba(217, 119, 6, 0.4));
  }
  50% {
    transform: translateX(4px);
    opacity: 1;
    filter: drop-shadow(0 0 8px rgba(217, 119, 6, 0.9));
  }
  100% {
    transform: translateX(-3px);
    opacity: 0.7;
    filter: drop-shadow(0 0 2px rgba(217, 119, 6, 0.4));
  }
}

.animate-arrow-flow {
  animation: arrowFlow 1.6s ease-in-out infinite;
}

/* 아래 스크롤/진입 시 순차적 등장 Fade-In-Up 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
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
