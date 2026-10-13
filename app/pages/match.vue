<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { z } from 'zod'

interface MatchResultResponse {
  success: boolean
  isAiGenerated?: boolean
  error?: string
  compatibility?: {
    score: number
    tier: {
      level: string
      badge: string
      summary: string
    }
    person1: {
      name: string
      gender: string
      birthDate: string
      birthTime: string
      dayGanzhi: string
      yearGanzhi: string
      dayStem: string
      dayBranch: string
      stemElemName: string
      branchElemName: string
      elementsCount: number[]
    }
    person2: {
      name: string
      gender: string
      birthDate: string
      birthTime: string
      dayGanzhi: string
      yearGanzhi: string
      dayStem: string
      dayBranch: string
      stemElemName: string
      branchElemName: string
      elementsCount: number[]
    }
    relationType: string
    indicators: {
      stemHarmony: {
        name: string
        score: number
        maxScore: number
        isCombination: boolean
        relation: string
        description: string
      }
      branchHarmony: {
        name: string
        score: number
        maxScore: number
        relationType: string
        relationName: string
        description: string
      }
      elementSynergy: {
        name: string
        score: number
        maxScore: number
        p1Deficient: string[]
        p2Deficient: string[]
        p1SuppliedByP2: string[]
        p2SuppliedByP1: string[]
        description: string
      }
      iljuMatch: {
        name: string
        score: number
        maxScore: number
        advice: string
      }
    }
  }
  parsedData?: {
    headline: string
    tags: string[]
    summary: string
    categories: {
      mental: { score: number; summary: string }
      reality: { score: number; summary: string }
      conflict: { score: number; summary: string }
      dating: { score: number; summary: string }
    }
  }
  aiInterpretation?: string
  model?: string
}

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/match`

useSeoMeta({
  title: 'AI 사주 궁합 ✦ 연인·인연 케미스트리 - 일일운세',
  description: '정통 만세력과 60일주론, 천간합과 지지합충 기반으로 두 사람의 사주명리 궁합과 AI 심층 케미스트리 리포트를 확인하세요.',
  ogTitle: 'AI 사주 궁합 ✦ 연인·인연 케미스트리 | 일일운세',
  ogDescription: '정통 만세력과 60일주론, 천간합과 지지합충 기반으로 두 사람의 사주명리 궁합과 AI 심층 케미스트리 리포트를 확인하세요.',
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image',
  twitterImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`
})

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json' as const,
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'AI 사주 궁합',
        description: '두 사람의 생년월일시 만세력 기반 4대 정통 역학 궁합 분석 및 AI 케미스트리 리포트',
        url: pageUrl
      })
    }
  ]
})

const { $pinia } = useNuxtApp()
const store = useFortuneStore($pinia)
const {
  matchPerson1: person1,
  matchPerson2: person2,
  matchRelationType: relationType,
  matchResult: result
} = storeToRefs(store)

const toast = useToast()

interface RelationOption {
  id: string
  label: string
  icon: string
  badge: string
  colorClass: string
}

const defaultRelation: RelationOption = {
  id: 'lover',
  label: '연인 (연애)',
  icon: 'i-heroicons-heart',
  badge: '💖 연인 궁합',
  colorClass: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
}

// 관계 유형 옵션
const relationOptions: RelationOption[] = [
  defaultRelation,
  { id: 'some', label: '관계 (호감)', icon: 'i-heroicons-sparkles', badge: '✨ 호감·썸 궁합', colorClass: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400' },
  { id: 'couple', label: '부부 (결혼)', icon: 'i-heroicons-home', badge: '🏡 부부 궁합', colorClass: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' },
  { id: 'friend', label: '친구 / 동업', icon: 'i-heroicons-user-group', badge: '🤝 친구·동업 궁합', colorClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' }
]

const currentRelationObj = computed<RelationOption>(() => {
  return relationOptions.find(r => r.id === relationType.value) || defaultRelation
})

// 본인 생년월일 입력 분할
const p1Year = ref<string | number>('')
const p1Month = ref<string | number>('')
const p1Day = ref<string | number>('')
const p1NoTime = ref(false)

// 상대방 생년월일 입력 분할
const p2Year = ref<string | number>('')
const p2Month = ref<string | number>('')
const p2Day = ref<string | number>('')
const p2NoTime = ref(false)

const loading = ref(false)
const loadingStep = ref(1) // 1: 만세력 대조, 2: 4대 궁합 지표 연산, 3: AI 심층 리포트 생성
const showCooldownNotice = ref(false)
const cooldownTimeStr = ref('')

// 결과 화면 점수 애니메이션 카운트업
const animatedScore = ref(0)

// Zod 유효성 검증
const matchSchema = z.object({
  p1Date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '본인의 생년월일을 올바르게 선택해 주세요.'),
  p2Date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '상대방의 생년월일을 올바르게 선택해 주세요.')
})

const updateP1Date = () => {
  if (p1Year.value && p1Month.value && p1Day.value) {
    const y = String(p1Year.value).trim()
    const m = String(p1Month.value).trim().padStart(2, '0')
    const d = String(p1Day.value).trim().padStart(2, '0')
    person1.value.birthDate = `${y}-${m}-${d}`
  } else {
    person1.value.birthDate = ''
  }
}

const updateP2Date = () => {
  if (p2Year.value && p2Month.value && p2Day.value) {
    const y = String(p2Year.value).trim()
    const m = String(p2Month.value).trim().padStart(2, '0')
    const d = String(p2Day.value).trim().padStart(2, '0')
    person2.value.birthDate = `${y}-${m}-${d}`
  } else {
    person2.value.birthDate = ''
  }
}

watch([p1Year, p1Month, p1Day], updateP1Date)
watch([p2Year, p2Month, p2Day], updateP2Date)

watch(p1NoTime, (val) => {
  if (val) person1.value.birthTime = ''
})

watch(p2NoTime, (val) => {
  if (val) person2.value.birthTime = ''
})

const startScoreAnimation = (target: number) => {
  animatedScore.value = 0
  const duration = 1200
  const start = performance.now()
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    animatedScore.value = Math.round(target * easeOut)
    if (progress < 1) requestAnimationFrame(step)
    else animatedScore.value = target
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  store.loadFromLocalStorage()

  if (person1.value.birthDate) {
    const parts = person1.value.birthDate.split('-')
    if (parts.length === 3) {
      p1Year.value = parts[0] || ''
      p1Month.value = parts[1] || ''
      p1Day.value = parts[2] || ''
    }
  }

  if (person2.value.birthDate) {
    const parts = person2.value.birthDate.split('-')
    if (parts.length === 3) {
      p2Year.value = parts[0] || ''
      p2Month.value = parts[1] || ''
      p2Day.value = parts[2] || ''
    }
  }

  if (!person1.value.birthTime) p1NoTime.value = true
  if (!person2.value.birthTime) p2NoTime.value = true

  // 12시간 쿨다운 확인
  if (store.hasRecentResult('match')) {
    const cool = store.getRemainingCoolTime('match')
    if (cool.isLimited) {
      showCooldownNotice.value = true
      cooldownTimeStr.value = `${cool.hours}시간 ${cool.minutes}분`
    }
  }

  // 기존 결과가 있으면 점수 애니메이션 실행
  if (result.value?.compatibility?.score) {
    startScoreAnimation(result.value.compatibility.score)
  }
})

// 분석 실행
const submitMatch = async () => {
  updateP1Date()
  updateP2Date()

  const valid = matchSchema.safeParse({
    p1Date: person1.value.birthDate,
    p2Date: person2.value.birthDate
  })

  if (!valid.success) {
    toast.add({
      title: '입력 확인',
      description: valid.error.issues[0]?.message || '두 사람의 생년월일을 모두 입력해 주세요.',
      color: 'warning',
      icon: 'i-heroicons-exclamation-triangle'
    })
    return
  }

  // 쿨다운 검사
  const cool = store.getRemainingCoolTime('match')
  if (cool.isLimited) {
    toast.add({
      title: '조회 제한 안내',
      description: `궁합은 하루에 한 번 정성껏 확인하는 것이 좋습니다. 약 ${cool.hours}시간 ${cool.minutes}분 후 다시 확인하실 수 있습니다.`,
      color: 'info',
      icon: 'i-heroicons-clock'
    })
    return
  }

  loading.value = true
  loadingStep.value = 1

  const timer1 = setTimeout(() => { loadingStep.value = 2 }, 900)
  const timer2 = setTimeout(() => { loadingStep.value = 3 }, 2000)

  try {
    const res: any = await $fetch('/api/fortune/match', {
      method: 'POST',
      body: {
        person1: person1.value,
        person2: person2.value,
        relationType: relationType.value
      }
    })

    if (res?.success) {
      result.value = res
      store.recordFortuneSuccess('match')
      store.saveToLocalStorage()
      startScoreAnimation(res.compatibility?.score || 80)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast.add({
        title: '궁합 분석 완료',
        description: '두 사람의 정통 사주 궁합 리포트가 완성되었습니다.',
        color: 'success',
        icon: 'i-heroicons-check-circle'
      })
    } else {
      throw new Error(res?.error || '결과를 불러올 수 없습니다.')
    }
  } catch (err: any) {
    console.error('Match fetch error:', err)
    toast.add({
      title: '분석 실패',
      description: err?.data?.statusMessage || err?.message || '일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    clearTimeout(timer1)
    clearTimeout(timer2)
    loading.value = false
  }
}

// 결과 재입력 / 다시 보기
const resetMatchForm = () => {
  store.clearMatch()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 클립보드 복사 헬퍼 (최신 Clipboard API + textarea 레거시 Fallback 100% 호환)
const copyToClipboardRobust = async (text: string): Promise<boolean> => {
  if (import.meta.client) {
    // 1. 최신 Clipboard API 시도
    if (navigator?.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch (e) {
        console.warn('[Copy] Clipboard API failed, falling back to execCommand:', e)
      }
    }

    // 2. Fallback: 임시 textarea를 활용한 execCommand 복사
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      textArea.style.top = '-9999px'
      textArea.style.opacity = '0'
      textArea.setAttribute('readonly', '')
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    } catch (err) {
      console.error('[Copy] Fallback failed:', err)
      return false
    }
  }
  return false
}

const isCopied = ref(false)

// 십이지 동물 계산 헬퍼
const getZodiacAnimal = (ganzhiStr: string): string => {
  if (!ganzhiStr || ganzhiStr.length < 2) return ''
  const branchChar = ganzhiStr.slice(1, 2)
  const branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
  const animals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지']
  const idx = branches.indexOf(branchChar)
  return (idx >= 0 ? animals[idx] : '') || ''
}

// 공유 텍스트 생성 (기본 명식 + 4대 지표 상세 + AI 처세 솔루션 풍부한 풀버전)
const getMatchShareText = (): string => {
  if (!result.value) return ''
  const comp = result.value.compatibility
  const p1 = comp?.person1
  const p2 = comp?.person2
  const p1Animal = p1?.yearGanzhi ? getZodiacAnimal(p1.yearGanzhi) : ''
  const p2Animal = p2?.yearGanzhi ? getZodiacAnimal(p2.yearGanzhi) : ''

  const p1Desc = `${p1?.name || '본인'}: ${p1?.yearGanzhi || ''}생${p1Animal ? `(${p1Animal}띠)` : ''} · ${p1?.dayGanzhi || ''}일주 (${p1?.stemElemName || '오행'} / ${p1?.gender === 'man' ? '남성' : '여성'})`
  const p2Desc = `${p2?.name || '상대방'}: ${p2?.yearGanzhi || ''}생${p2Animal ? `(${p2Animal}띠)` : ''} · ${p2?.dayGanzhi || ''}일주 (${p2?.stemElemName || '오행'} / ${p2?.gender === 'man' ? '남성' : '여성'})`

  const headline = result.value.parsedData?.headline || comp?.tier?.summary || ''
  const summary = result.value.parsedData?.summary || comp?.tier?.summary || ''

  return `🔮 [사주앱 ✦ Daily-Fortune] 2인 사주명리 궁합 리포트 🔮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❤️ 두 사람의 기본 사주 명식:
● ${p1Desc}
● ${p2Desc}

● 인연 궁합 점수: ${comp?.score}점 【${comp?.tier?.level || '궁합'}】
● 한 줄 총평: "${headline}"

[📜 4대 정통 명리학 핵심 지표 분석]
1. 정신적 교감 (천간합): ${comp?.indicators?.stemHarmony?.relation || '조화'} (${comp?.indicators?.stemHarmony?.score ?? 0}/25점)
   - ${comp?.indicators?.stemHarmony?.description || '자료가 없음'}
2. 현실적 조화 (지지합·충): ${comp?.indicators?.branchHarmony?.relationName || '조화'} (${comp?.indicators?.branchHarmony?.score ?? 0}/25점)
   - ${comp?.indicators?.branchHarmony?.description || '자료가 없음'}
3. 에너지 시너지 (오행 보완): ${comp?.indicators?.elementSynergy?.score ?? 0}/25점
   - ${comp?.indicators?.elementSynergy?.description || '자료가 없음'}
4. 60일주 기질 조화: ${comp?.indicators?.iljuMatch?.score ?? 0}/25점
   - ${comp?.indicators?.iljuMatch?.advice || '자료가 없음'}

[💡 두 사람을 위한 맞춤 처세 솔루션]
${summary}

🏷️ #${p1?.yearGanzhi || ''}생 #${p2?.yearGanzhi || ''}생 #${p1?.dayGanzhi || ''}일주 #${p2?.dayGanzhi || ''}일주 #사주궁합
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ 우리 둘의 사주 궁합도 직접 확인해보기:
👉 https://sajuapp.co.kr/match`
}

// 결과 공유 기능 (모바일은 네이티브 공유 시트, PC/미지원 시 즉시 클립보드 복사)
const shareMatch = async () => {
  if (!import.meta.client || !result.value) return

  const shareText = getMatchShareText()
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024)

  if (isMobile && navigator.share) {
    try {
      await navigator.share({
        title: 'Daily-Fortune ✦ 사주명리 궁합 리포트',
        text: shareText,
        url: 'https://sajuapp.co.kr/match'
      })
      return
    } catch (e: any) {
      if (e?.name === 'AbortError') return
      // 공유창 취소 이외 에러 시 클립보드 복사 폴백 진행
    }
  }

  // 데스크톱 PC 환경 또는 모바일 Web Share 미지원 시 클립보드 복사 실행
  const success = await copyToClipboardRobust(shareText)
  if (success) {
    isCopied.value = true
    setTimeout(() => { isCopied.value = false }, 2500)
    toast.add({
      title: '📋 궁합 결과 복사 완료',
      description: '사주 명식과 궁합 상세 리포트가 클립보드에 복사되었습니다. 카카오톡이나 SNS에 바로 붙여넣어 공유해 보세요!',
      color: 'success',
      icon: 'i-heroicons-clipboard-document-check'
    })
  } else {
    toast.add({
      title: '복사 실패',
      description: '클립보드 접근이 차단되었습니다. 브라우저 설정을 확인해 주세요.',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }
}

const elemNames = ['木', '火', '土', '金', '水']
const elemColorClasses = [
  'bg-emerald-500 text-emerald-100',
  'bg-rose-500 text-rose-100',
  'bg-amber-500 text-amber-100',
  'bg-slate-500 text-slate-100',
  'bg-sky-500 text-sky-100'
]

// AI 마크다운 포맷터
const markdownFormatter = useMarkdownFormatter()

const formattedAiInterpretation = computed(() => {
  if (!result.value?.aiInterpretation) return ''
  let text = result.value.aiInterpretation
  // 잔여 JSON 블록 및 찌꺼기 제거
  text = text.replace(/```json\s*[\s\S]*?\s*```/gi, '')
  text = text.replace(/```json\s*[\s\S]*/gi, '')
  text = text.replace(/```[\s\S]*?```/g, '')
  return markdownFormatter.formatMarkdown(text)
})

// 백엔드에서 전달받은 모델명 정제 표시 (1순위 Gemini -> 2순위 Claude -> 3순위 Daily-Fortune 역학 엔진)
const displayModelName = computed(() => {
  if (!result.value) return 'Daily-Fortune 역학 엔진'

  if (result.value.isAiGenerated === false) {
    return 'Daily-Fortune 역학 엔진'
  }

  const m = result.value.model || ''
  if (!m) {
    return result.value.isAiGenerated !== false ? 'Google Gemini 3.1 Flash Lite' : 'Daily-Fortune 역학 엔진'
  }

  // 1순위: Gemini
  if (m.includes('gemini-3.1-flash-lite') || m === 'gemini-3.1-flash-lite') return 'Google Gemini 3.1 Flash Lite'
  if (m.includes('gemini-2.5-flash')) return 'Google Gemini 2.5 Flash'
  if (m.includes('gemini-1.5-flash')) return 'Google Gemini 1.5 Flash'
  if (m.includes('gemini')) return 'Google Gemini'

  // 2순위: Claude
  if (m.includes('claude-haiku') || m.includes('claude-haiku-4-5')) return 'Anthropic Claude Haiku'
  if (m.includes('claude-sonnet')) return 'Anthropic Claude Sonnet'
  if (m.includes('claude')) return 'Anthropic Claude'

  // 3순위: Daily-Fortune 역학 엔진
  if (m.includes('Daily-Fortune') || m.includes('역학')) return 'Daily-Fortune 역학 엔진'

  return m
})
</script>

<template>
  <div class="bg-celestial-canvas pg-text min-h-screen font-sans-kr pt-10 pb-28 sm:pb-20 px-4 md:px-8 transition-colors duration-300">
    <main class="max-w-4xl mx-auto space-y-8">
      
      <!-- 상단 헤더 섹션 -->
      <header v-reveal class="text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full pg-card-inner border pg-border shadow-xs">
          <span class="text-rose-500 text-xs">♥</span>
          <span class="text-xs sm:text-sm font-medium pg-text-gold">정통 명리학 4대 지표 & AI 종합 리포트</span>
        </div>
        <h1 class="text-xl sm:text-3xl md:text-4xl font-serif-kr font-bold pg-text tracking-tight">
          인연과 사랑의 깊이를 읽는 <span class="pg-text-gold">사주 궁합</span>
        </h1>
        <p class="text-xs sm:text-sm pg-text-muted max-w-xl mx-auto leading-relaxed">
          천간합(정신적 끌림), 지지합충(현실 조화), 오행 상호 보완도, 60일주론 기질 매칭을 종합하여 두 사람만의 고유한 인연 케미스트리를 풀어 드립니다.
        </p>
      </header>

      <!-- 12시간 쿨다운 알림 배너 -->
      <div 
        v-if="showCooldownNotice && result" 
        class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs sm:text-sm"
      >
        <div class="flex items-center gap-2.5">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-amber-500 shrink-0" />
          <span class="pg-text-muted">
            오늘 이미 조회하신 궁합 결과입니다.<br> 다음 새로운 조회까지 <strong>{{ cooldownTimeStr }}</strong> 남았습니다.
          </span>
        </div>
        <button 
          type="button" 
          @click="showCooldownNotice = false" 
          class="text-xs px-2.5 py-1 rounded-lg border pg-border hover:bg-black/5 dark:hover:bg-white/5"
        >
          닫기
        </button>
      </div>

      <!-- 로딩 모달/오버레이 -->
      <div 
        v-if="loading" 
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
      >
        <div class="relative w-32 h-32 mb-6 flex items-center justify-center animate-celestial-float">
          <!-- 음양 태극 회전 링 -->
          <svg class="w-full h-full text-rose-400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 4" class="animate-spin origin-center" style="animation-duration: 20s;" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#f59e0b" stroke-width="1.5" class="animate-pulse" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center text-3xl">
            ☯
          </div>
        </div>

        <h3 class="text-xl font-serif-kr font-bold text-white mb-2">두 사람의 기운을 맞추어 보는 중입니다</h3>
        <p class="text-sm text-amber-200/90 min-h-6 transition-all duration-300">
          <span v-if="loadingStep === 1">1단계: 두 사람의 만세력 4주 8자 산출 중...</span>
          <span v-else-if="loadingStep === 2">2단계: 천간합·지지합충·오행 시너지 지수 분석 중...</span>
          <span v-else>3단계: Gemini AI 심층 케미스트리 조언 생성 중...</span>
        </p>
      </div>

      <!-- ================= 결과 리포트 대시보드 ================= -->
      <div v-if="result?.compatibility" class="space-y-8 animate-fade-in">
        
        <!-- 종합 점수 메인 카드 -->
        <section v-reveal class="gold-filament-card p-6 sm:p-10 text-center relative overflow-hidden">
          <!-- Background Watermark (z-0: 우측 상단 & 동적 펄스 애니메이션) -->
          <div class="absolute -right-2 -top-4 sm:-right-3 sm:-top-5 pg-watermark-text animate-watermark-pulse text-8xl sm:text-9xl font-serif-kr select-none pointer-events-none z-0">
            緣
          </div>

          <!-- 관계 유형 뱃지 -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full pg-card-inner border pg-border text-xs mb-4 shadow-2xs">
            <span class="text-rose-500 font-bold">♥</span>
            <span class="pg-text-gold font-medium">{{ result.compatibility.person1.name }} & {{ result.compatibility.person2.name }}</span>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full font-bold border transition-all duration-200" :class="currentRelationObj.colorClass">
              {{ currentRelationObj.badge }}
            </span>
          </div>

          <!-- 종합 점수 원형 게이지 -->
          <div class="relative w-40 h-40 mx-auto my-4 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6" class="pg-text-soft opacity-20" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill="none" 
                stroke="url(#roseGoldGrad)" 
                stroke-width="6" 
                stroke-linecap="round"
                :stroke-dasharray="264"
                :stroke-dashoffset="264 - (264 * animatedScore) / 100"
                class="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f43f5e" />
                  <stop offset="50%" stop-color="#fbbf24" />
                  <stop offset="100%" stop-color="#e11d48" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl sm:text-5xl font-extrabold font-serif-kr pg-text tracking-tight">
                {{ animatedScore }}<span class="text-xl sm:text-2xl font-normal pg-text-gold">점</span>
              </span>
              <span class="text-[11px] font-semibold text-rose-500 mt-0.5">
                {{ result.compatibility.tier.level }}
              </span>
            </div>
          </div>

          <!-- 두 사람의 기본 사주 명식 (년주 OO생/일주/오행) 비교 카드 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mt-4 text-left">
            <!-- 본인 명식 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-rose-500 flex items-center gap-1">
                  <span>♥</span>
                  <span>{{ result.compatibility.person1.name }}</span>
                </span>
                <span class="text-[11px] pg-text-muted">
                  {{ result.compatibility.person1.gender === 'man' ? '남성' : '여성' }}
                </span>
              </div>
              <div class="text-xs sm:text-sm font-serif-kr font-bold pg-text">
                {{ result.compatibility.person1.yearGanzhi }}생 ({{ getZodiacAnimal(result.compatibility.person1.yearGanzhi) }}띠) · {{ result.compatibility.person1.dayGanzhi }}일주
              </div>
              <div class="text-[11px] pg-text-muted">
                {{ result.compatibility.person1.stemElemName }} 기운 · {{ result.compatibility.person1.hourBranch !== '모름' ? result.compatibility.person1.hourBranch + '시생' : '시 모름' }}
              </div>
            </div>

            <!-- 상대방 명식 -->
            <div class="p-3 sm:p-3.5 rounded-xl pg-card-inner border pg-border text-left space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-amber-500 flex items-center gap-1">
                  <span>♥</span>
                  <span>{{ result.compatibility.person2.name }}</span>
                </span>
                <span class="text-[11px] pg-text-muted">
                  {{ result.compatibility.person2.gender === 'man' ? '남성' : '여성' }}
                </span>
              </div>
              <div class="text-xs sm:text-sm font-serif-kr font-bold pg-text">
                {{ result.compatibility.person2.yearGanzhi }}생 ({{ getZodiacAnimal(result.compatibility.person2.yearGanzhi) }}띠) · {{ result.compatibility.person2.dayGanzhi }}일주
              </div>
              <div class="text-[11px] pg-text-muted">
                {{ result.compatibility.person2.stemElemName }} 기운 · {{ result.compatibility.person2.hourBranch !== '모름' ? result.compatibility.person2.hourBranch + '시생' : '시 모름' }}
              </div>
            </div>
          </div>

          <!-- 한 줄 헤드라인 & 키워드 태그 -->
          <h2 class="text-lg sm:text-2xl font-serif-kr font-bold pg-text mt-4 max-w-xl mx-auto leading-snug">
            "{{ result.parsedData?.headline || result.compatibility.tier.summary }}"
          </h2>
          <p class="text-xs sm:text-sm pg-text-muted mt-2 max-w-lg mx-auto leading-relaxed">
            {{ result.parsedData?.summary || result.compatibility.tier.summary }}
          </p>

          <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span 
              v-for="(tag, idx) in (result.parsedData?.tags || ['#정통명리궁합', '#인연케미'])" 
              :key="idx"
              class="px-3 py-1 rounded-full text-xs font-medium pg-card-inner border pg-border pg-text-gold"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 공유 및 액션 버튼군 -->
          <div class="mt-8 pt-6 border-t pg-border flex flex-wrap justify-center gap-3">
            <button 
              type="button" 
              @click="shareMatch" 
              class="btn-gold-action cursor-pointer px-5 py-2.5 text-xs font-bold transition-all inline-flex items-center gap-1.5"
            >
              <UIcon :name="isCopied ? 'i-heroicons-check' : 'i-heroicons-share'" class="w-4 h-4" />
              <span>{{ isCopied ? '결과 복사 완료!' : '결과 공유하기' }}</span>
            </button>
            <button 
              type="button" 
              @click="resetMatchForm" 
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border pg-border pg-card-inner text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
              <span>다른 인연 확인하기</span>
            </button>
          </div>
        </section>

        <!-- 4대 정통 역학 지표 분석 카드 -->
        <section v-reveal class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- 1. 천간합 (정신적 교감) -->
          <div class="gold-filament-card p-5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-rose-500">1. 정신적 교감 (천간합)</span>
              <span class="text-xs font-bold pg-text-gold">{{ result.compatibility.indicators.stemHarmony.score }} / 25점</span>
            </div>
            <h3 class="font-serif-kr font-bold text-base pg-text">
              {{ result.compatibility.indicators.stemHarmony.relation }}
            </h3>
            <p class="text-xs pg-text-muted leading-relaxed">
              {{ result.compatibility.indicators.stemHarmony.description }}
            </p>
          </div>

          <!-- 2. 지지합충 (현실/생활 궁합) -->
          <div class="gold-filament-card p-5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-500">2. 현실적 조화 (지지합·충)</span>
              <span class="text-xs font-bold pg-text-gold">{{ result.compatibility.indicators.branchHarmony.score }} / 30점</span>
            </div>
            <h3 class="font-serif-kr font-bold text-base pg-text">
              {{ result.compatibility.indicators.branchHarmony.relationName }}
            </h3>
            <p class="text-xs pg-text-muted leading-relaxed">
              {{ result.compatibility.indicators.branchHarmony.description }}
            </p>
          </div>

          <!-- 3. 오행 상호 보완도 -->
          <div class="gold-filament-card p-5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-500">3. 에너지 시너지 (오행 보완)</span>
              <span class="text-xs font-bold pg-text-gold">{{ result.compatibility.indicators.elementSynergy.score }} / 25점</span>
            </div>
            <h3 class="font-serif-kr font-bold text-base pg-text">부족함을 채워주는 상호보완</h3>
            <p class="text-xs pg-text-muted leading-relaxed">
              {{ result.compatibility.indicators.elementSynergy.description }}
            </p>
          </div>

          <!-- 4. 60일주론 기질 매칭 -->
          <div class="gold-filament-card p-5 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-purple-500">4. 60일주론 기질 조화</span>
              <span class="text-xs font-bold pg-text-gold">{{ result.compatibility.indicators.iljuMatch.score }} / 20점</span>
            </div>
            <h3 class="font-serif-kr font-bold text-base pg-text">
              {{ result.compatibility.person1.dayGanzhi }}일주 ✕ {{ result.compatibility.person2.dayGanzhi }}일주
            </h3>
            <p class="text-xs pg-text-muted leading-relaxed">
              {{ result.compatibility.indicators.iljuMatch.advice }}
            </p>
          </div>
        </section>

        <!-- 오행 밸런스 비교 바 차트 -->
        <section v-reveal class="gold-filament-card p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-serif-kr font-bold text-base pg-text">
              ⚖️ 두 사람의 오행(木火土金水) 에너지 비교
            </h3>
            <span class="text-xs pg-text-muted">기운 분포 비교</span>
          </div>

          <div class="space-y-3">
            <div v-for="(name, idx) in elemNames" :key="name" class="space-y-1">
              <div class="flex justify-between text-xs">
                <span class="font-bold">{{ name }} 기운</span>
                <span class="pg-text-muted text-[11px]">
                  {{ result.compatibility.person1.name }}: {{ result.compatibility.person1.elementsCount[idx] }}개 /
                  {{ result.compatibility.person2.name }}: {{ result.compatibility.person2.elementsCount[idx] }}개
                </span>
              </div>
              <!-- 듀얼 프로그레스 바 -->
              <div class="grid grid-cols-2 gap-1.5 h-3">
                <div :class="['bg-black/10', 'dark:bg-white/10']" class="rounded-full overflow-hidden flex justify-end">
                  <div 
                    class="h-full rounded-full transition-all duration-500"
                    :class="elemColorClasses[idx]"
                    :style="{ width: `${Math.min(100, (result.compatibility.person1.elementsCount[idx] || 0) * 20)}%` }"
                  ></div>
                </div>
                <div :class="['bg-black/10', 'dark:bg-white/10']" class="rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-500 opacity-80"
                    :class="elemColorClasses[idx]"
                    :style="{ width: `${Math.min(100, (result.compatibility.person2.elementsCount[idx] || 0) * 20)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <p class="text-xs pg-text-muted pt-2 text-center">
            * 좌측 게이지: {{ result.compatibility.person1.name }}님 | 우측 게이지: {{ result.compatibility.person2.name }}님
          </p>
        </section>

        <!-- 애드센스 인피드 광고 슬롯 -->
        <div class="my-6">
          <AdSense adSlot="8877665544" />
        </div>

        <!-- AI 심층 리포트 카드 (마크다운 파싱 렌더링) -->
        <section v-reveal class="gold-filament-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <!-- Background Watermark (z-0: 우측 상단 & 동적 펄스 애니메이션) -->
          <div class="absolute -right-2 -top-4 sm:-right-3 sm:-top-5 pg-watermark-text animate-watermark-pulse text-8xl sm:text-9xl font-serif-kr select-none pointer-events-none z-0">
            合
          </div>

          <div class="relative z-10 flex items-center justify-between border-b pg-border pb-4">
            <div class="flex items-center gap-2">
              <span class="seal-stamp text-xs px-2 py-0.5">秘訣</span>
              <h3 class="font-serif-kr text-lg sm:text-xl font-bold pg-text">
                AI 심층 명리 케미스트리 처세 보고서
              </h3>
            </div>
            <span
              v-if="result.isAiGenerated !== false"
              class="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-medium"
            >
              <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 text-amber-500" />
              <span>AI 실시간 분석</span>
            </span>
            <span
              v-else
              class="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30 font-normal"
            >
              역학 엔진 원천 해설
            </span>
          </div>

          <!-- 마크다운 보고서 본문 렌더링 (###, **, - 등이 아름답게 스타일링됨) -->
          <div class="relative z-10">
            <div v-html="formattedAiInterpretation" class="markdown-body font-serif-kr"></div>
          </div>

          <div class="relative z-10 pt-6 border-t pg-border flex flex-wrap justify-between items-center gap-3 text-xs pg-text-muted">
            <span>✦ 정통 60일주론과 만세력 역학 데이터를 바탕으로 생성되었습니다.</span>
            <span
              class="inline-flex items-center gap-1.5 font-medium font-sans-kr"
              :class="['text-rose-500', 'dark:text-rose-400']"
            >
              <UIcon v-if="result.isAiGenerated !== false" name="i-heroicons-sparkles" class="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{{ displayModelName }}</span>
            </span>
          </div>
        </section>

      </div>

      <!-- ================= 2인 사주 입력 폼 ================= -->
      <div v-else class="space-y-6 animate-fade-in">

        <!-- 관계 유형 선택 탭 -->
        <div class="flex gap-2 p-1.5 rounded-2xl pg-card-inner border pg-border overflow-x-auto">
          <button
            v-for="rel in relationOptions"
            :key="rel.id"
            type="button"
            @click="relationType = rel.id"
            class="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            :class="relationType === rel.id ? 'bg-amber-500 text-slate-900 font-bold shadow-xs' : 'pg-text-muted hover:pg-text'"
          >
            <UIcon :name="rel.icon" class="w-4 h-4" />
            <span>{{ rel.label }}</span>
          </button>
        </div>

        <!-- 듀얼 카드 폼 (본인 / 상대방) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          <!-- 카드 1: 본인 정보 -->
          <div class="gold-filament-card p-5 sm:p-7 space-y-5">
            <div class="flex items-center justify-between pb-3 border-b pg-border">
              <div class="flex items-center gap-2">
                <span class="seal-stamp text-xs px-2 py-0.5">本</span>
                <h2 class="font-serif-kr font-bold text-base sm:text-lg pg-text">본인 정보</h2>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] px-2.5 py-0.5 rounded-full font-bold border transition-all duration-200" :class="currentRelationObj.colorClass">
                  {{ currentRelationObj.badge }}
                </span>
                <span class="text-xs pg-text-gold font-medium">1번째 사주</span>
              </div>
            </div>

            <!-- 이름 (선택) -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium pg-text-muted flex items-center gap-1">
                <span>이름 또는 애칭</span>
                <span class="text-[10px] text-slate-400">(선택)</span>
              </label>
              <input
                v-model="person1.name"
                type="text"
                placeholder="예: 나, 홍길동"
                maxlength="10"
                class="w-full px-3.5 py-2.5 rounded-xl border pg-border pg-card-inner text-sm focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <!-- 성별 선택 -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium pg-text-muted">성별</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="person1.gender = 'man'"
                  class="py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer"
                  :class="person1.gender === 'man' ? ['border-amber-500 bg-amber-500/10 text-amber-600 font-bold', 'dark:text-amber-400'] : 'pg-border pg-card-inner pg-text-muted'"
                >
                  남성
                </button>
                <button
                  type="button"
                  @click="person1.gender = 'woman'"
                  class="py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer"
                  :class="person1.gender === 'woman' ? ['border-rose-500 bg-rose-500/10 text-rose-600 font-bold', 'dark:text-rose-400'] : 'pg-border pg-card-inner pg-text-muted'"
                >
                  여성
                </button>
              </div>
            </div>

            <!-- 생년월일 (양력 기준) -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium pg-text-muted">생년월일 (양력)</label>
              <div class="grid grid-cols-3 gap-2">
                <input
                  v-model="p1Year"
                  type="number"
                  placeholder="YYYY (년)"
                  min="1920"
                  max="2030"
                  class="w-full px-2.5 py-2.5 rounded-xl border pg-border pg-card-inner text-xs sm:text-sm text-center focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <input
                  v-model="p1Month"
                  type="number"
                  placeholder="MM (월)"
                  min="1"
                  max="12"
                  class="w-full px-2.5 py-2.5 rounded-xl border pg-border pg-card-inner text-xs sm:text-sm text-center focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <input
                  v-model="p1Day"
                  type="number"
                  placeholder="DD (일)"
                  min="1"
                  max="31"
                  class="w-full px-2.5 py-2.5 rounded-xl border pg-border pg-card-inner text-xs sm:text-sm text-center focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- 태어난 시간 -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-medium pg-text-muted">태어난 시간</label>
                <label class="flex items-center gap-1.5 text-xs pg-text-muted cursor-pointer">
                  <input v-model="p1NoTime" type="checkbox" class="rounded accent-amber-500" />
                  <span>시간 모름</span>
                </label>
              </div>
              <input
                v-if="!p1NoTime"
                v-model="person1.birthTime"
                type="time"
                class="w-full px-3.5 py-2.5 rounded-xl border pg-border pg-card-inner text-sm focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              <div v-else class="text-xs pg-text-muted p-2 rounded-xl pg-card-inner border pg-border text-center">
                시간 모름 (삼주 기반으로 분석)
              </div>
            </div>
          </div>

          <!-- 카드 2: 상대방 정보 -->
          <div class="gold-filament-card p-5 sm:p-7 space-y-5">
            <div class="flex items-center justify-between pb-3 border-b pg-border">
              <div class="flex items-center gap-2">
                <span class="seal-stamp text-xs px-2 py-0.5">緣</span>
                <h2 class="font-serif-kr font-bold text-base sm:text-lg pg-text">상대방 정보</h2>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] px-2.5 py-0.5 rounded-full font-bold border transition-all duration-200" :class="currentRelationObj.colorClass">
                  {{ currentRelationObj.badge }}
                </span>
                <span class="text-xs text-rose-500 font-medium">2번째 사주</span>
              </div>
            </div>

            <!-- 이름 (선택) -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium pg-text-muted flex items-center gap-1">
                <span>이름 또는 애칭</span>
                <span class="text-[10px] text-slate-400">(선택)</span>
              </label>
              <input
                v-model="person2.name"
                type="text"
                placeholder="예: 그 사람, 성춘향"
                maxlength="10"
                class="w-full px-3.5 py-2.5 rounded-xl border pg-border pg-card-inner text-sm focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <!-- 성별 선택 -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium pg-text-muted">성별</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="person2.gender = 'man'"
                  class="py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer"
                  :class="person2.gender === 'man' ? ['border-amber-500 bg-amber-500/10 text-amber-600 font-bold', 'dark:text-amber-400'] : 'pg-border pg-card-inner pg-text-muted'"
                >
                  남성
                </button>
                <button
                  type="button"
                  @click="person2.gender = 'woman'"
                  class="py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer"
                  :class="person2.gender === 'woman' ? ['border-rose-500 bg-rose-500/10 text-rose-600 font-bold', 'dark:text-rose-400'] : 'pg-border pg-card-inner pg-text-muted'"
                >
                  여성
                </button>
              </div>
            </div>

            <!-- 생년월일 (양력 기준) -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium pg-text-muted">생년월일 (양력)</label>
              <div class="grid grid-cols-3 gap-2">
                <input
                  v-model="p2Year"
                  type="number"
                  placeholder="YYYY (년)"
                  min="1920"
                  max="2030"
                  class="w-full px-2.5 py-2.5 rounded-xl border pg-border pg-card-inner text-xs sm:text-sm text-center focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <input
                  v-model="p2Month"
                  type="number"
                  placeholder="MM (월)"
                  min="1"
                  max="12"
                  class="w-full px-2.5 py-2.5 rounded-xl border pg-border pg-card-inner text-xs sm:text-sm text-center focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <input
                  v-model="p2Day"
                  type="number"
                  placeholder="DD (일)"
                  min="1"
                  max="31"
                  class="w-full px-2.5 py-2.5 rounded-xl border pg-border pg-card-inner text-xs sm:text-sm text-center focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- 태어난 시간 -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-medium pg-text-muted">태어난 시간</label>
                <label class="flex items-center gap-1.5 text-xs pg-text-muted cursor-pointer">
                  <input v-model="p2NoTime" type="checkbox" class="rounded accent-amber-500" />
                  <span>시간 모름</span>
                </label>
              </div>
              <input
                v-if="!p2NoTime"
                v-model="person2.birthTime"
                type="time"
                class="w-full px-3.5 py-2.5 rounded-xl border pg-border pg-card-inner text-sm focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              <div v-else class="text-xs pg-text-muted p-2 rounded-xl pg-card-inner border pg-border text-center">
                시간 모름 (삼주 기반으로 분석)
              </div>
            </div>
          </div>

        </div>

        <!-- 분석 시작 버튼 -->
        <div class="text-center pt-4">
          <button
            type="button"
            @click="submitMatch"
            :disabled="loading"
            :class="[
              'w-full sm:w-auto px-10 py-4 rounded-full font-bold text-base transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 mx-auto active:scale-98',
              'bg-linear-to-r from-amber-300 via-rose-300 to-amber-300 text-slate-900 hover:brightness-110 hover:shadow-rose-500/20',
              'dark:bg-linear-to-r dark:from-emerald-800 dark:via-emerald-700 dark:to-teal-700 dark:text-emerald-100 dark:border dark:border-emerald-500/40 dark:hover:brightness-110 dark:hover:shadow-emerald-500/20'
            ]"
          >
            <UIcon name="i-heroicons-sparkles" :class="['w-5 h-5 animate-pulse', 'text-rose-600', 'dark:text-emerald-300']" />
            <span>사주 궁합 분석하기</span>
            <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
          </button>
          <p class="text-[11px] pg-text-muted mt-3">
            ✦ 입력하신 정보는 저장되지 않으며, 오직 궁합 분석을 위한 만세력 계산에만 사용됩니다.
          </p>
        </div>

        <!-- 하단 애드센스 슬롯 -->
        <div class="pt-6">
          <AdSense adSlot="8877665544" />
        </div>

      </div>


    </main>

    <!-- 하단 모바일 고정 탭바 (홈, 오늘 사주, 오늘 주역, 사주 궁합) -->
    <div class="fixed bottom-0 left-0 right-0 bg-(--fortune-bg)/95 backdrop-blur-md border-t pg-border z-50 py-2" style="background-color: var(--fortune-bg); opacity: 0.95;">
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
          class="flex flex-col items-center gap-1 py-1 pg-text-soft hover:pg-text-muted transition-colors"
        >
          <UIcon name="i-heroicons-sun" class="w-5 h-5" />
          <span class="text-[10px] font-medium">오늘 주역</span>
        </NuxtLink>

        <NuxtLink
          to="/match"
          class="flex flex-col items-center gap-1 py-1 transition-colors text-rose-500 font-bold"
        >
          <UIcon name="i-heroicons-heart" class="w-5 h-5 text-rose-500" />
          <span class="text-[10px] font-medium text-rose-500">사주 궁합</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes celestialFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.animate-celestial-float {
  animation: celestialFloat 4s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
