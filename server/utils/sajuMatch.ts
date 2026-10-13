/**
 * 사주명리 2인 궁합 (연인·인연 케미스트리) 정통 알고리즘 연산 모듈
 * 4대 정통 명리학 지표: 천간합(25점), 지지합·충(30점), 오행 상호 보완도(25점), 60일주론 기질 매칭(20점)
 */

import {
  STEMS,
  BRANCHES,
  ELEM_NAMES,
  BRANCH_ELEMENT_MAP,
  getGanzhiOfDay,
  getGanzhiOfYear,
  getHourBranch
} from './saju'
import { SAJU_ILJU_DATA } from './sajuIljuData'

export interface PersonSajuInput {
  name?: string
  birthDate: string // YYYY-MM-DD
  birthTime?: string | null // HH:MM or empty
  gender?: 'man' | 'woman' | string
}

export interface PersonSajuProfile {
  name: string
  gender: string
  birthDate: string
  birthTime: string
  dayGanzhi: string // 일주 (예: 갑자)
  yearGanzhi: string // 년주 (예: 갑진)
  dayStem: string // 일간 (예: 갑)
  dayBranch: string // 일지 (예: 자)
  hourBranch: string // 시지 (예: 자 or 모름)
  stemIdx: number
  branchIdx: number
  stemElemIdx: number
  branchElemIdx: number
  stemElemName: string
  branchElemName: string
  elementsCount: number[] // [木, 火, 土, 金, 水]
  iljuData?: {
    ganzhi: string
    ganzhiHanja?: string
    character?: string
    romanceAdvice?: string
  }
}

export interface CompatibilityResult {
  score: number // 0 ~ 100점 종합 점수
  tier: {
    level: string // 천생연분, 찰떡궁합, 좋은인연, 노력형인연, 자극형인연
    badge: string // ✦✦✦✦✦ 등
    summary: string // 한 줄 요약
  }
  person1: PersonSajuProfile
  person2: PersonSajuProfile
  relationType: 'lover' | 'some' | 'couple' | 'friend' | string
  indicators: {
    stemHarmony: {
      name: string
      score: number // max 25
      maxScore: number
      isCombination: boolean // 천간합 여부
      relation: string // 중정지합, 상생, 상극 등
      description: string
    }
    branchHarmony: {
      name: string
      score: number // max 30
      maxScore: number
      relationType: 'liuhe' | 'sanhe' | 'chong' | 'yuanzhen' | 'normal'
      relationName: string // 육합, 삼합, 칠충, 원진, 무난
      description: string
    }
    elementSynergy: {
      name: string
      score: number // max 25
      maxScore: number
      p1Deficient: string[] // person1 부족 오행
      p2Deficient: string[] // person2 부족 오행
      p1SuppliedByP2: string[] // p2가 p1에게 채워준 오행
      p2SuppliedByP1: string[] // p1이 p2에게 채워준 오행
      description: string
    }
    iljuMatch: {
      name: string
      score: number // max 20
      maxScore: number
      advice: string
    }
  }
  factSummaryText: string // AI 프롬프트 주입용 역학 팩트 요약
}

// 5대 천간합 맵핑 (甲己, 乙庚, 丙辛, 丁壬, 戊癸)
const HEAVENLY_COMBOS: Record<string, { partner: string; name: string; meaning: string }> = {
  갑: { partner: '기', name: '갑기합(甲己合) - 중정지합', meaning: '넓은 아량과 신뢰로 서로의 중심을 굳건히 지켜주는 화합' },
  기: { partner: '갑', name: '갑기합(甲己合) - 중정지합', meaning: '넓은 아량과 신뢰로 서로의 중심을 굳건히 지켜주는 화합' },
  을: { partner: '경', name: '을경합(乙庚合) - 인의지합', meaning: '단단한 결단력과 부드러운 배려가 어우러져 의리를 다지는 조화' },
  경: { partner: '을', name: '을경합(乙庚合) - 인의지합', meaning: '단단한 결단력과 부드러운 배려가 어우러져 의리를 다지는 조화' },
  병: { partner: '신', name: '병신합(丙辛合) - 위엄지합', meaning: '태양의 밝은 빛과 보석의 반짝임이 만나 첫눈에 강렬히 끌리는 인연' },
  신: { partner: '병', name: '병신합(丙辛合) - 위엄지합', meaning: '태양의 밝은 빛과 보석의 반짝임이 만나 첫눈에 강렬히 끌리는 인연' },
  정: { partner: '임', name: '정임합(丁壬合) - 다정지합', meaning: '따뜻한 촛불과 깊은 바다가 만나 깊은 감정적 교감과 애정을 이루는 결합' },
  임: { partner: '정', name: '정임합(丁壬合) - 다정지합', meaning: '따뜻한 촛불과 깊은 바다가 만나 깊은 감정적 교감과 애정을 이루는 결합' },
  무: { partner: '계', name: '무계합(戊癸合) - 유정지합', meaning: '우직한 큰 산과 촉촉한 봄비가 만나 서로를 풍요롭게 적셔주는 결합' },
  계: { partner: '무', name: '무계합(戊癸合) - 유정지합', meaning: '우직한 큰 산과 촉촉한 봄비가 만나 서로를 풍요롭게 적셔주는 결합' }
}

// 지지 6대 육합(六合) 맵핑
const EARTHLY_LIUHE: Record<string, { partner: string; name: string; desc: string }> = {
  자: { partner: '축', name: '자축육합(子丑合)', desc: '지혜와 끈기가 만나 서로에게 깊은 안정감을 주는 결합' },
  축: { partner: '자', name: '자축육합(子丑合)', desc: '지혜와 끈기가 만나 서로에게 깊은 안정감을 주는 결합' },
  인: { partner: '해', name: '인해육합(寅亥合)', desc: '큰 바다와 푸른 나무가 만나 생명력 넘치는 사랑과 발전' },
  해: { partner: '인', name: '인해육합(寅亥合)', desc: '큰 바다와 푸른 나무가 만나 생명력 넘치는 사랑과 발전' },
  묘: { partner: '술', name: '묘술육합(卯戌合)', desc: '따뜻한 온기와 은근한 신뢰가 바탕이 되는 다정한 인연' },
  술: { partner: '묘', name: '묘술육합(卯戌合)', desc: '따뜻한 온기와 은근한 신뢰가 바탕이 되는 다정한 인연' },
  진: { partner: '유', name: '진유육합(辰酉合)', desc: '넓은 대지와 알찬 결실이 만나 현실적 풍요를 이루는 결합' },
  유: { partner: '진', name: '진유육합(辰酉合)', desc: '넓은 대지와 알찬 결실이 만나 현실적 풍요를 이루는 결합' },
  사: { partner: '신', name: '사신육합(巳申合)', desc: '뜨거운 활력과 날카로운 재치가 만나 역동적인 케미스트리' },
  신: { partner: '사', name: '사신육합(巳申合)', desc: '뜨거운 활력과 날카로운 재치가 만나 역동적인 케미스트리' },
  오: { partner: '미', name: '오미육합(午未合)', desc: '태양의 열정과 대지의 온기가 하나로 뭉치는 뜨거운 인연' },
  미: { partner: '오', name: '오미육합(午未合)', desc: '태양의 열정과 대지의 온기가 하나로 뭉치는 뜨거운 인연' }
}

// 지지 삼합(三合) 군
const EARTHLY_SANHE_GROUPS = [
  { branches: ['신', '자', '진'], name: '신자진 수국(申子辰 水局) 삼합', desc: '지혜와 유연함이 극대화되는 삼합 인연' },
  { branches: ['사', '유', '축'], name: '사유축 금국(巳酉丑 金局) 삼합', desc: '결단력과 결실을 함께 맺는 삼합 인연' },
  { branches: ['인', '오', '술'], name: '인오술 화국(寅午戌 火局) 삼합', desc: '뜨거운 열정과 밝은 이상을 공유하는 삼합 인연' },
  { branches: ['해', '묘', '미'], name: '해묘미 목국(亥卯未 木局) 삼합', desc: '새로운 성장과 따뜻한 생명력을 키워가는 삼합 인연' }
]

// 지지 칠충(七沖) 맵핑
const EARTHLY_CHONG: Record<string, { partner: string; name: string; desc: string }> = {
  자: { partner: '오', name: '자오충(子午沖)', desc: '물과 불의 정면충돌, 감정의 기복과 가치관 충돌 주의' },
  오: { partner: '자', name: '자오충(子午沖)', desc: '물과 불의 정면충돌, 감정의 기복과 가치관 충돌 주의' },
  축: { partner: '미', name: '축미충(丑未沖)', desc: '대지 간의 부딪힘, 고집과 현실적 입장 차이 조율 필요' },
  미: { partner: '축', name: '축미충(丑未沖)', desc: '대지 간의 부딪힘, 고집과 현실적 입장 차이 조율 필요' },
  인: { partner: '신', name: '인신충(寅申沖)', desc: '활동력 강한 두 기운의 충돌, 주도권 다툼 주의' },
  신: { partner: '인', name: '인신충(寅申沖)', desc: '활동력 강한 두 기운의 충돌, 주도권 다툼 주의' },
  묘: { partner: '유', name: '묘유충(卯酉沖)', desc: '나무와 칼날의 충돌, 말 한마디로 인한 마음의 상처 주의' },
  유: { partner: '묘', name: '묘유충(卯酉沖)', desc: '나무와 칼날의 충돌, 말 한마디로 인한 마음의 상처 주의' },
  진: { partner: '술', name: '진술충(辰戌沖)', desc: '자존심과 영역 싸움, 유연한 양보와 배려가 핵심' },
  술: { partner: '진', name: '진술충(辰戌沖)', desc: '자존심과 영역 싸움, 유연한 양보와 배려가 핵심' },
  사: { partner: '해', name: '사해충(巳亥沖)', desc: '활동성과 생각의 격차, 차분한 대화와 템포 조절 필요' },
  해: { partner: '사', name: '사해충(巳亥沖)', desc: '활동성과 생각의 격차, 차분한 대화와 템포 조절 필요' }
}

// 지지 원진(怨嗔) 맵핑
const EARTHLY_YUANZHEN: Record<string, { partner: string; name: string; desc: string }> = {
  자: { partner: '미', name: '자미원진(子未怨嗔)', desc: '애정이 깊으나 사소한 오해로 서운함이 생기기 쉬운 기운' },
  미: { partner: '자', name: '자미원진(子未怨嗔)', desc: '애정이 깊으나 사소한 오해로 서운함이 생기기 쉬운 기운' },
  축: { partner: '오', name: '축오원진(丑午怨嗔)', desc: '서로의 표현 방식 차이로 답답함을 느낄 수 있는 기운' },
  오: { partner: '축', name: '축오원진(丑午怨嗔)', desc: '서로의 표현 방식 차이로 답답함을 느낄 수 있는 기운' },
  인: { partner: '유', name: '인유원진(寅酉怨嗔)', desc: '자존심이 맞부딪혀 사소한 자극에 예민해질 수 있는 기운' },
  유: { partner: '인', name: '인유원진(寅酉怨嗔)', desc: '자존심이 맞부딪혀 사소한 자극에 예민해질 수 있는 기운' },
  묘: { partner: '신', name: '묘신원진(卯申怨嗔)', desc: '기대치가 높아 작은 약속 불이행에도 실망하기 쉬운 기운' },
  신: { partner: '묘', name: '묘신원진(卯申怨嗔)', desc: '기대치가 높아 작은 약속 불이행에도 실망하기 쉬운 기운' },
  진: { partner: '해', name: '진해원진(辰亥怨嗔)', desc: '속마음을 숨겨 혼자 끙끙 앓기 쉬우니 투명한 표현이 필수' },
  해: { partner: '진', name: '진해원진(辰亥怨嗔)', desc: '속마음을 숨겨 혼자 끙끙 앓기 쉬우니 투명한 표현이 필수' },
  사: { partner: '술', name: '사술원진(巳戌怨嗔)', desc: '열정과 차분함의 온도 차이로 오해가 쌓일 수 있는 기운' },
  술: { partner: '사', name: '사술원진(巳戌怨嗔)', desc: '열정과 차분함의 온도 차이로 오해가 쌓일 수 있는 기운' }
}

/**
 * 1인 만세력 사주 프로필 빌드
 */
export function buildPersonProfile(input: PersonSajuInput, defaultName: string = '본인'): PersonSajuProfile {
  const name = input.name?.trim() || defaultName
  const gender = input.gender || 'man'
  const birthDate = input.birthDate
  const birthTime = input.birthTime || '모름'

  const dayGz = getGanzhiOfDay(birthDate)
  const birthYearNum = parseInt(birthDate.split('-')[0] || '2000', 10)
  const yearGz = getGanzhiOfYear(birthYearNum)
  const hourBranch = getHourBranch(birthTime)

  // 4주 오행 카운트 [목, 화, 토, 금, 수]
  const elemCounts = [0, 0, 0, 0, 0]

  // 년주 반영
  elemCounts[yearGz.stemElemIdx] = (elemCounts[yearGz.stemElemIdx] || 0) + 1
  elemCounts[yearGz.branchElemIdx] = (elemCounts[yearGz.branchElemIdx] || 0) + 1

  // 일주 반영 (가중치 1.5)
  elemCounts[dayGz.stemElemIdx] = (elemCounts[dayGz.stemElemIdx] || 0) + 2
  elemCounts[dayGz.branchElemIdx] = (elemCounts[dayGz.branchElemIdx] || 0) + 2

  // 시지 반영 (있을 경우)
  if (hourBranch !== '모름') {
    const hbIdx = BRANCHES.indexOf(hourBranch as any)
    if (hbIdx >= 0) {
      const hbElem = BRANCH_ELEMENT_MAP[hbIdx] ?? 0
      elemCounts[hbElem] = (elemCounts[hbElem] || 0) + 1
    }
  }

  // 60일주 원천 데이터 찾기
  const iljuRecord = SAJU_ILJU_DATA.find(r => r.ganzhi === dayGz.fullName)

  return {
    name,
    gender,
    birthDate,
    birthTime,
    dayGanzhi: dayGz.fullName,
    yearGanzhi: yearGz.fullName,
    dayStem: dayGz.stem,
    dayBranch: dayGz.branch,
    hourBranch,
    stemIdx: dayGz.stemIdx,
    branchIdx: dayGz.branchIdx,
    stemElemIdx: dayGz.stemElemIdx,
    branchElemIdx: dayGz.branchElemIdx,
    stemElemName: ELEM_NAMES[dayGz.stemElemIdx] || '오행',
    branchElemName: ELEM_NAMES[dayGz.branchElemIdx] || '오행',
    elementsCount: elemCounts,
    iljuData: iljuRecord ? {
      ganzhi: iljuRecord.ganzhi,
      ganzhiHanja: iljuRecord.ganzhiHanja,
      character: iljuRecord.character,
      romanceAdvice: iljuRecord.romanceAdvice
    } : undefined
  }
}

/**
 * 2인 사주명리 정통 4대 궁합 지표 연산
 */
export function calculateSajuCompatibility(
  person1Input: PersonSajuInput,
  person2Input: PersonSajuInput,
  relationType: 'lover' | 'some' | 'couple' | 'friend' | string = 'lover'
): CompatibilityResult {
  const p1 = buildPersonProfile(person1Input, '본인')
  const p2 = buildPersonProfile(person2Input, '상대방')

  // ================= 1. 천간합 (天干合) 판정 (배점 25점) =================
  let stemScore = 15
  let stemIsCombo = false
  let stemRelation = '상생 조화'
  let stemDesc = ''

  const p1Stem = p1.dayStem
  const p2Stem = p2.dayStem
  const combo = HEAVENLY_COMBOS[p1Stem]

  if (combo && combo.partner === p2Stem) {
    stemScore = 25
    stemIsCombo = true
    stemRelation = combo.name
    stemDesc = combo.meaning
  } else {
    // 오행 상생/상극 판정
    const e1 = p1.stemElemIdx
    const e2 = p2.stemElemIdx

    if (e1 === e2) {
      // 비견 (동일 오행)
      stemScore = 18
      stemRelation = `동일 오행 (${ELEM_NAMES[e1]}과 ${ELEM_NAMES[e2]}) 비견 조화`
      stemDesc = '비슷한 시선과 사고방식을 지녀 첫 만남부터 친근한 동질감을 느낍니다.'
    } else if ((e1 + 1) % 5 === e2 || (e2 + 1) % 5 === e1) {
      // 상생 관계 (木-火, 火-土, 土-金, 金-水, 水-木)
      stemScore = 22
      const giver = (e1 + 1) % 5 === e2 ? p1.name : p2.name
      const receiver = giver === p1.name ? p2.name : p1.name
      stemRelation = `오행 상생 (${ELEM_NAMES[e1]} ↔ ${ELEM_NAMES[e2]})`
      stemDesc = `${giver}님의 기운이 ${receiver}님을 자연스럽게 북돋아 주는 온화한 관계입니다.`
    } else {
      // 상극 관계
      stemScore = 13
      stemRelation = `오행 상극 (${ELEM_NAMES[e1]} ↔ ${ELEM_NAMES[e2]})`
      stemDesc = '서로 다른 시선과 기질을 지녀 호기심과 긴장감이 공존하는 관계입니다.'
    }
  }

  // ================= 2. 지지합·충 (地支合·沖) 판정 (배점 30점) =================
  let branchScore = 22
  let branchType: 'liuhe' | 'sanhe' | 'chong' | 'yuanzhen' | 'normal' = 'normal'
  let branchName = '무난한 일상 조화'
  let branchDesc = '모나지 않게 평온한 생활 리듬을 맞추어 갈 수 있는 일지 관계입니다.'

  const p1Branch = p1.dayBranch
  const p2Branch = p2.dayBranch

  // 육합 검사
  const liuhe = EARTHLY_LIUHE[p1Branch]
  if (liuhe && liuhe.partner === p2Branch) {
    branchScore = 30
    branchType = 'liuhe'
    branchName = liuhe.name
    branchDesc = `${liuhe.desc} 생활 습관과 현실적 가치관이 척척 맞아떨어지는 최상의 결합입니다.`
  } else {
    // 삼합 검사 (두 글자가 같은 삼합 그룹에 속하는지)
    const sanheGroup = EARTHLY_SANHE_GROUPS.find(g => g.branches.includes(p1Branch) && g.branches.includes(p2Branch))
    if (sanheGroup) {
      branchScore = 26
      branchType = 'sanhe'
      branchName = sanheGroup.name
      branchDesc = `${sanheGroup.desc} 함께 목표를 향해 나아갈 때 강력한 시너지를 발휘합니다.`
    } else {
      // 칠충 검사
      const chong = EARTHLY_CHONG[p1Branch]
      if (chong && chong.partner === p2Branch) {
        branchScore = 11
        branchType = 'chong'
        branchName = chong.name
        branchDesc = `${chong.desc} 부딪힘을 두려워하기보다 솔직하고 담백한 대화로 풀어가야 합니다.`
      } else {
        // 원진 검사
        const yz = EARTHLY_YUANZHEN[p1Branch]
        if (yz && yz.partner === p2Branch) {
          branchScore = 14
          branchType = 'yuanzhen'
          branchName = yz.name
          branchDesc = `${yz.desc} 속으로 쌓아두지 않고 작은 감정도 투명하게 나누는 태도가 복을 부릅니다.`
        }
      }
    }
  }

  // ================= 3. 오행 상호 보완도 (배점 25점) =================
  // 결핍(0개) 오행 찾기
  const p1Deficient: string[] = []
  const p2Deficient: string[] = []
  const p1SuppliedByP2: string[] = []
  const p2SuppliedByP1: string[] = []

  ELEM_NAMES.forEach((elem, idx) => {
    const c1 = p1.elementsCount[idx] || 0
    const c2 = p2.elementsCount[idx] || 0

    if (c1 === 0) {
      p1Deficient.push(elem)
      if (c2 >= 2) p1SuppliedByP2.push(elem)
    }
    if (c2 === 0) {
      p2Deficient.push(elem)
      if (c1 >= 2) p2SuppliedByP1.push(elem)
    }
  })

  let synergyScore = 18
  const totalSupplied = p1SuppliedByP2.length + p2SuppliedByP1.length

  if (totalSupplied >= 2) {
    synergyScore = 25
  } else if (totalSupplied === 1) {
    synergyScore = 22
  } else if (p1Deficient.length === 0 && p2Deficient.length === 0) {
    synergyScore = 20
  } else {
    synergyScore = 16
  }

  let elementDesc = ''
  if (totalSupplied > 0) {
    const suppliedList = [...new Set([...p1SuppliedByP2, ...p2SuppliedByP1])].join(', ')
    elementDesc = `서로에게 결핍된 ${suppliedList} 기운을 풍부하게 채워주어 부족함을 완벽히 보완하는 이상적인 상호보완 관계입니다.`
  } else {
    elementDesc = '두 사람의 오행 흐름이 균형 있게 어우러져 서로의 에너지를 억누르지 않고 조화롭게 순환합니다.'
  }

  // ================= 4. 60일주론 기질 매칭 (배점 20점) =================
  let iljuScore = 17
  let iljuAdvice = ''

  if (stemIsCombo && branchType === 'liuhe') {
    iljuScore = 20
    iljuAdvice = '천간과 지지가 모두 합(合)을 이루는 천생연분의 인연으로, 생각과 생활 방식 모두 물 흐르듯 통합니다.'
  } else if (stemIsCombo || branchType === 'liuhe' || branchType === 'sanhe') {
    iljuScore = 19
    iljuAdvice = '정신적 혹은 현실적 가치관 중 한 축이 강력히 결합되어 서로에게 든든한 안식처가 되어 줍니다.'
  } else if (branchType === 'chong') {
    iljuScore = 12
    iljuAdvice = '서로 다른 개성과 매력을 지녀 첫 호기심은 강하지만, 지속적인 존중과 다름을 인정하는 노력이 관계를 단단히 만듭니다.'
  } else {
    iljuScore = 16
    iljuAdvice = `${p1.dayGanzhi}일주와 ${p2.dayGanzhi}일주의 조화로, 편안하고 잔잔하게 서로의 일상을 지지해 주는 관계입니다.`
  }

  // ================= 총점 산출 (0~100점) =================
  const totalScore = Math.min(100, Math.max(30, stemScore + branchScore + synergyScore + iljuScore))

  // 티어 및 등급 요약
  let tier = {
    level: '좋은 인연',
    badge: '✦✦✦',
    summary: '서로를 배려하며 아름다운 조화를 이뤄가는 복된 만남'
  }

  if (totalScore >= 90) {
    tier = {
      level: '천생연분 (천기화합)',
      badge: '✦✦✦✦✦',
      summary: '하늘과 땅이 맺어준 듯 깊은 교감과 완벽한 상호보완을 이루는 인연'
    }
  } else if (totalScore >= 80) {
    tier = {
      level: '찰떡궁합 (상호보완)',
      badge: '✦✦✦✦',
      summary: '서로의 부족함을 채우고 장점을 배가시키는 든든한 시너지의 인연'
    }
  } else if (totalScore >= 70) {
    tier = {
      level: '좋은 인연 (화합조화)',
      badge: '✦✦✦',
      summary: '평온하고 안정적인 온도로 서로에게 힘이 되어주는 관계'
    }
  } else if (totalScore >= 60) {
    tier = {
      level: '노력형 인연 (이해와 배려)',
      badge: '✦✦',
      summary: '서로 다른 매력을 가졌기에 경청과 양보를 통해 더욱 깊어지는 인연'
    }
  } else {
    tier = {
      level: '자극형 인연 (다름의 인정)',
      badge: '✦',
      summary: '서로 다른 개성으로 새로운 시야를 열어주며, 소통이 열쇠가 되는 관계'
    }
  }

  // 띠 동물 계산 헬퍼
  const getAnimalName = (ganzhi: string) => {
    const branchChar = ganzhi.slice(1, 2)
    const bList = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
    const aList = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지']
    const idx = bList.indexOf(branchChar)
    return idx >= 0 ? aList[idx] : ''
  }

  const p1Animal = p1.yearGanzhi ? getAnimalName(p1.yearGanzhi) : ''
  const p2Animal = p2.yearGanzhi ? getAnimalName(p2.yearGanzhi) : ''

  // AI 프롬프트에 주입할 명확한 역학 팩트 요약문 빌드 (환각 차단용)
  const factSummaryText = `
[두 사람의 사주명리 팩트 데이터]
1. 본인(${p1.name}): ${p1.yearGanzhi}생${p1Animal ? `(${p1Animal}띠)` : ''} · ${p1.dayGanzhi}일주 (${p1.dayStem}/${p1.dayBranch}, ${p1.stemElemName}), 오행분포 [木:${p1.elementsCount[0]}, 火:${p1.elementsCount[1]}, 土:${p1.elementsCount[2]}, 金:${p1.elementsCount[3]}, 水:${p1.elementsCount[4]}]
   - 본인 일주 기질: "${p1.iljuData?.character || '명리학적 고유 기질'}"
   - 본인 연애 스타일: "${p1.iljuData?.romanceAdvice || '진중하고 깊은 인연 추구'}"
2. 상대방(${p2.name}): ${p2.yearGanzhi}생${p2Animal ? `(${p2Animal}띠)` : ''} · ${p2.dayGanzhi}일주 (${p2.dayStem}/${p2.dayBranch}, ${p2.stemElemName}), 오행분포 [木:${p2.elementsCount[0]}, 火:${p2.elementsCount[1]}, 土:${p2.elementsCount[2]}, 金:${p2.elementsCount[3]}, 水:${p2.elementsCount[4]}]
   - 상대방 일주 기질: "${p2.iljuData?.character || '명리학적 고유 기질'}"
   - 상대방 연애 스타일: "${p2.iljuData?.romanceAdvice || '진중하고 깊은 인연 추구'}"
3. 천간 관계 (정신적 교감): ${stemRelation} (${stemScore}/25점) - ${stemDesc}
4. 지지 관계 (현실적 조화): ${branchName} (${branchScore}/30점) - ${branchDesc}
5. 오행 상호 보완도: ${elementDesc} (${synergyScore}/25점)
6. 60일주 기질 궁합: ${iljuAdvice} (${iljuScore}/20점)
7. 종합 궁합 점수: ${totalScore}점 (${tier.level})
`.trim()

  return {
    score: totalScore,
    tier,
    person1: p1,
    person2: p2,
    relationType,
    indicators: {
      stemHarmony: {
        name: '천간합 (정신적 교감)',
        score: stemScore,
        maxScore: 25,
        isCombination: stemIsCombo,
        relation: stemRelation,
        description: stemDesc
      },
      branchHarmony: {
        name: '지지합·충 (현실/속궁합)',
        score: branchScore,
        maxScore: 30,
        relationType: branchType,
        relationName: branchName,
        description: branchDesc
      },
      elementSynergy: {
        name: '오행 상호 보완도',
        score: synergyScore,
        maxScore: 25,
        p1Deficient,
        p2Deficient,
        p1SuppliedByP2,
        p2SuppliedByP1,
        description: elementDesc
      },
      iljuMatch: {
        name: '60일주론 기질 매칭',
        score: iljuScore,
        maxScore: 20,
        advice: iljuAdvice
      }
    },
    factSummaryText
  }
}
