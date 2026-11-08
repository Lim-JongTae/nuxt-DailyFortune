/**
 * 사주명리 60일주 정통 합·충·원진·신살 수학적 조견 및 판별 엔진
 * 천충지충, 천극지충, 천지합덕, 백호대살, 괴강살 정밀 계산
 */

export const ILJU_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const
export const STEM_HANJA: Record<string, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
}

export const ILJU_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const
export const BRANCH_HANJA: Record<string, string> = {
  '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
  '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥'
}

// 1. 정통 백호대살(白虎大殺) - 정통 명리학 7대 일주
export const BAEKHO_LIST = ['갑진', '을미', '병술', '정축', '무진', '임술', '계축']
export const isBaekho = (ganzhi: string) => BAEKHO_LIST.includes(ganzhi)

// 2. 정통 괴강살(魁罡殺) - 정통 4대 일주 (무진은 괴강이 아니며 백호임)
export const GOEGANG_LIST = ['경진', '경술', '임진', '무술']
export const isGoegang = (ganzhi: string) => GOEGANG_LIST.includes(ganzhi)

// 3. 천간합 (5합)
export const STEM_HAP: Record<string, string> = {
  '갑': '기', '기': '갑',
  '을': '경', '경': '을',
  '병': '신', '신': '병',
  '정': '임', '임': '정',
  '무': '계', '계': '무'
}

// 4. 천간충 (4충 - 甲庚, 乙辛, 丙壬, 丁癸) ※ 戊·己는 충이 없고 극만 존재
export const STEM_CHUNG: Record<string, string> = {
  '갑': '경', '경': '갑',
  '을': '신', '신': '을',
  '병': '임', '임': '병',
  '정': '계', '계': '정'
}

// 5. 천간극 (상극 관계: 甲戊, 乙己, 丙庚, 丁辛, 戊壬, 己癸 등)
export const STEM_GEUK_MAP: Record<string, string[]> = {
  '갑': ['무', '기'],
  '을': ['무', '기'],
  '병': ['경', '신'],
  '정': ['경', '신'],
  '무': ['임', '계'],
  '기': ['임', '계'],
  '경': ['갑', '을'],
  '신': ['갑', '을'],
  '임': ['병', '정'],
  '계': ['병', '정']
}

export function isStemGeuk(a: string, b: string): boolean {
  return (STEM_GEUK_MAP[a]?.includes(b) || STEM_GEUK_MAP[b]?.includes(a)) ?? false
}

// 6. 지지 육합 (6합)
export const BRANCH_YUKHAP: Record<string, string> = {
  '자': '축', '축': '자',
  '인': '해', '해': '인',
  '묘': '술', '술': '묘',
  '진': '유', '유': '진',
  '사': '신', '신': '사',
  '오': '미', '미': '오'
}

// 7. 지지 충 (6충)
export const BRANCH_CHUNG: Record<string, string> = {
  '자': '오', '오': '자',
  '축': '미', '미': '축',
  '인': '신', '신': '인',
  '묘': '유', '유': '묘',
  '진': '술', '술': '진',
  '사': '해', '해': '사'
}

// 8. 지지 원진 (6원진)
export const BRANCH_WONJIN: Record<string, string> = {
  '자': '미', '미': '자',
  '축': '오', '오': '축',
  '인': '유', '유': '인',
  '묘': '신', '신': '묘',
  '진': '해', '해': '진',
  '사': '술', '술': '사'
}

// 9. 지지 육해 (6해)
export const BRANCH_HAE: Record<string, string> = {
  '자': '미', '미': '자',
  '축': '오', '오': '축',
  '인': '사', '사': '인',
  '묘': '진', '진': '묘',
  '신': '해', '해': '신',
  '유': '술', '술': '유'
}

// 10. 지지 삼합 그룹 (4국)
export const SAMHAP_GROUPS = [
  { name: '수국(水局)', branches: ['신', '자', '진'] },
  { name: '목국(木局)', branches: ['해', '묘', '미'] },
  { name: '화국(火局)', branches: ['인', '오', '술'] },
  { name: '금국(金局)', branches: ['사', '유', '축'] }
]

export function isBranchSamhap(b1: string, b2: string): boolean {
  if (b1 === b2) return false
  return SAMHAP_GROUPS.some(g => g.branches.includes(b1) && g.branches.includes(b2))
}

export function getBranchSamhapName(b1: string, b2: string): string | null {
  const g = SAMHAP_GROUPS.find(gr => gr.branches.includes(b1) && gr.branches.includes(b2))
  return g ? g.name : null
}

export interface PairRelationResult {
  stemRelation: '합' | '충' | '극' | '생/동' | '무관계'
  stemText: string
  branchRelation: '육합' | '삼합' | '충' | '원진' | '해' | '무관계'
  branchText: string
  label: string
  isCheonchungJichung: boolean // 천충지충 (천간충 + 지지충)
  isCheongeukJichung: boolean  // 천극지충 (천간극 + 지지충)
  isCheonjiHapdeok: boolean    // 천지합덕 (천간합 + 지지육합)
}

/**
 * 두 일주(간지) 간의 정확한 명리학적 관계 계산
 */
export function calcIljuPair(ganzhiA: string, ganzhiB: string): PairRelationResult {
  const sA = ganzhiA.charAt(0)
  const bA = ganzhiA.charAt(1)
  const sB = ganzhiB.charAt(0)
  const bB = ganzhiB.charAt(1)

  const sHanjaA = STEM_HANJA[sA] || sA
  const sHanjaB = STEM_HANJA[sB] || sB
  const bHanjaA = BRANCH_HANJA[bA] || bA
  const bHanjaB = BRANCH_HANJA[bB] || bB

  // 천간 관계 분석
  let stemRelation: PairRelationResult['stemRelation'] = '무관계'
  let stemText = ''
  if (STEM_HAP[sA] === sB) {
    stemRelation = '합'
    stemText = `${sA}${sB}합(${sHanjaA}${sHanjaB}合)`
  } else if (STEM_CHUNG[sA] === sB) {
    stemRelation = '충'
    stemText = `${sA}${sB}충(${sHanjaA}${sHanjaB}沖)`
  } else if (isStemGeuk(sA, sB)) {
    stemRelation = '극'
    stemText = `${sA}${sB}극(${sHanjaA}${sHanjaB}剋)`
  } else {
    stemRelation = '생/동'
    stemText = `천간 ${sA}·${sB}`
  }

  // 지지 관계 분석
  let branchRelation: PairRelationResult['branchRelation'] = '무관계'
  let branchText = ''
  if (BRANCH_YUKHAP[bA] === bB) {
    branchRelation = '육합'
    branchText = `${bA}${bB}육합(${bHanjaA}${bHanjaB}六合)`
  } else if (BRANCH_CHUNG[bA] === bB) {
    branchRelation = '충'
    branchText = `${bA}${bB}충(${bHanjaA}${bHanjaB}沖)`
  } else if (BRANCH_WONJIN[bA] === bB) {
    branchRelation = '원진'
    branchText = `${bA}${bB}원진(${bHanjaA}${bHanjaB}怨嗔)`
  } else if (BRANCH_HAE[bA] === bB) {
    branchRelation = '해'
    branchText = `${bA}${bB}해(${bHanjaA}${bHanjaB}害)`
  } else if (isBranchSamhap(bA, bB)) {
    branchRelation = '삼합'
    const sName = getBranchSamhapName(bA, bB) || '삼합'
    branchText = `${bA}${bB} ${sName}`
  } else {
    branchText = `지지 ${bA}·${bB}`
  }

  const isCheonchungJichung = (stemRelation === '충' && branchRelation === '충')
  const isCheongeukJichung = (stemRelation === '극' && branchRelation === '충')
  const isCheonjiHapdeok = (stemRelation === '합' && branchRelation === '육합')

  let label = ''
  if (isCheonjiHapdeok) label = '천지합덕(天地合德)'
  else if (isCheonchungJichung) label = '천충지충(天沖地沖)'
  else if (isCheongeukJichung) label = '천극지충(天剋地沖)'
  else if (branchRelation === '충') label = `${stemText} 및 ${branchText}`
  else if (branchRelation === '원진') label = `${branchText}`
  else if (branchRelation === '육합') label = `${stemText} 및 ${branchText}`
  else if (branchRelation === '삼합') label = `${branchText}`
  else label = `${stemText}·${branchText}`

  return {
    stemRelation,
    stemText,
    branchRelation,
    branchText,
    label,
    isCheonchungJichung,
    isCheongeukJichung,
    isCheonjiHapdeok
  }
}

export const ALL_60_GANZHI = [
  '갑자', '을축', '병인', '정묘', '무진', '기사', '경오', '신미', '임신', '계유',
  '갑술', '을해', '병자', '정축', '무인', '기묘', '경진', '신사', '임오', '계미',
  '갑신', '을유', '병술', '정해', '무자', '기축', '경인', '신묘', '임진', '계사',
  '갑오', '을미', '병신', '정유', '무술', '기해', '경자', '신축', '임인', '계묘',
  '갑진', '을사', '병오', '정미', '무신', '기유', '경술', '신해', '임자', '계축',
  '갑인', '을묘', '병진', '정사', '무오', '기미', '경신', '신유', '임술', '계해'
]

export const GANZHI_TO_CODE: Record<string, string> = {
  '갑자': 'gap-ja', '을축': 'eul-chuk', '병인': 'byeong-in', '정묘': 'jeong-myo', '무진': 'mu-jin',
  '기사': 'gi-sa', '경오': 'gyeong-o', '신미': 'sin-mi', '임신': 'im-sin', '계유': 'gye-yu',
  '갑술': 'gap-sul', '을해': 'eul-hae', '병자': 'byeong-ja', '정축': 'jeong-chuk', '무인': 'mu-in',
  '기묘': 'gi-myo', '경진': 'gyeong-jin', '신사': 'sin-sa', '임오': 'im-o', '계미': 'gye-mi',
  '갑신': 'gap-sin', '을유': 'eul-yu', '병술': 'byeong-sul', '정해': 'jeong-hae', '무자': 'mu-ja',
  '기축': 'gi-chuk', '경인': 'gyeong-in', '신묘': 'sin-myo', '임진': 'im-jin', '계사': 'gye-sa',
  '갑오': 'gap-o', '을미': 'eul-mi', '병신': 'byeong-sin', '정유': 'jeong-yu', '무술': 'mu-sul',
  '기해': 'gi-hae', '경자': 'gyeong-ja', '신축': 'sin-chuk', '임인': 'im-in', '계묘': 'gye-myo',
  '갑진': 'gap-jin', '을사': 'eul-sa', '병오': 'byeong-o', '정미': 'jeong-mi', '무신': 'mu-sin',
  '기유': 'gi-yu', '경술': 'gyeong-sul', '신해': 'sin-hae', '임자': 'im-ja', '계축': 'gye-chuk',
  '갑인': 'gap-in', '을묘': 'eul-myo', '병진': 'byeong-jin', '정사': 'jeong-sa', '무오': 'mu-o',
  '기미': 'gi-mi', '경신': 'gyeong-sin', '신유': 'sin-yu', '임술': 'im-sul', '계해': 'gye-hae'
}

/**
 * 특정 일주에 대해 명리학적으로 결점이 없는 최상의 좋은 인연(good) 3쌍 선출
 */
export function getRecommendedGoodMatches(myGanzhi: string) {
  const myS = myGanzhi.charAt(0)
  const myB = myGanzhi.charAt(1)

  const scored: Array<{ ganzhi: string; score: number; reason: string }> = []

  for (const other of ALL_60_GANZHI) {
    if (other === myGanzhi) continue
    const otherS = other.charAt(0)
    const otherB = other.charAt(1)

    // 충, 원진, 해, 천간충이 있으면 절대 제외!
    if (BRANCH_CHUNG[myB] === otherB) continue
    if (BRANCH_WONJIN[myB] === otherB) continue
    if (BRANCH_HAE[myB] === otherB) continue
    if (STEM_CHUNG[myS] === otherS) continue

    const rel = calcIljuPair(myGanzhi, other)
    let score = 0
    let reason = ''

    if (rel.isCheonjiHapdeok) {
      score = 100
      reason = `천간은 ${rel.stemText}, 지지는 ${rel.branchText}으로 만나는 천지합덕(天地合德)의 천생연분입니다. 서로의 부족한 점을 온전히 채워주며 백년해로의 깊은 신뢰를 이룹니다.`
    } else if (rel.branchRelation === '육합') {
      score = 80
      reason = `지지가 ${rel.branchText}을 이루고 천간에 거스름이 없어, 정서적 유대감이 깊고 일상과 가치관에서 편안한 화합을 이룹니다.`
    } else if (rel.branchRelation === '삼합') {
      score = 70
      reason = `지지가 ${rel.branchText}을 이루어 함께 목표를 도모할 때 막강한 시너지와 결속력을 발휘하는 든든한 동반자입니다.`
    } else if (rel.stemRelation === '합') {
      score = 60
      reason = `천간이 ${rel.stemText}을 이루어 첫인상부터 호감을 느끼고 대화와 가치관이 자연스럽게 통하는 좋은 인연입니다.`
    }

    if (score > 0) {
      scored.push({ ganzhi: other, score, reason })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 3).map(s => ({
    id: GANZHI_TO_CODE[s.ganzhi] || s.ganzhi,
    name: `${s.ganzhi}(${STEM_HANJA[s.ganzhi.charAt(0)] || ''}${BRANCH_HANJA[s.ganzhi.charAt(1)] || ''})`,
    reason: s.reason
  }))
}

/**
 * 특정 일주에 대해 주의해야 할 인연(clash) 2~3쌍 선출 (천충지충 > 천극지충 > 원진)
 */
export function getRecommendedClashMatches(myGanzhi: string) {
  const myS = myGanzhi.charAt(0)
  const myB = myGanzhi.charAt(1)

  const scored: Array<{ ganzhi: string; score: number; reason: string }> = []

  for (const other of ALL_60_GANZHI) {
    if (other === myGanzhi) continue
    const otherS = other.charAt(0)
    const otherB = other.charAt(1)

    const rel = calcIljuPair(myGanzhi, other)
    let score = 0
    let reason = ''

    if (rel.isCheonchungJichung) {
      score = 100
      reason = `천간에서는 ${rel.stemText}, 지지에서는 ${rel.branchText}이 동시에 일어나는 천충지충(天沖地沖) 관계입니다. 가치관과 생활 리듬이 정면 충돌하여 극심한 스트레스와 마찰을 빚기 쉬우므로 적정 거리 유지가 필수적입니다.`
    } else if (rel.isCheongeukJichung) {
      score = 90
      reason = `천간에서는 ${rel.stemText}, 지지에서는 ${rel.branchText}이 일어나는 천극지충(天剋地沖) 관계입니다. 근본적인 기운의 격돌로 서로에게 상처를 주기 쉬우므로 양보와 배려가 절실합니다.`
    } else if (rel.branchRelation === '원진') {
      score = 80
      reason = `지지에서 ${rel.branchText}의 기운이 형성되어 이유 없는 오해와 서운함, 감정적 앙금이 쌓이기 쉬우니 솔직하고 투명한 소통이 필요합니다.`
    } else if (rel.branchRelation === '충') {
      score = 70
      reason = `지지에서 ${rel.branchText}이 발생하여 부딪침이 생기기 쉬우므로 서로의 영역과 방식을 존중해야 갈등을 예방할 수 있습니다.`
    }

    if (score > 0) {
      scored.push({ ganzhi: other, score, reason })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 2).map(s => ({
    id: GANZHI_TO_CODE[s.ganzhi] || s.ganzhi,
    name: `${s.ganzhi}(${STEM_HANJA[s.ganzhi.charAt(0)] || ''}${BRANCH_HANJA[s.ganzhi.charAt(1)] || ''})`,
    reason: s.reason
  }))
}

