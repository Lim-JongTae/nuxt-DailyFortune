/**
 * 주역 64괘 호괘(互卦)·착괘(錯卦)·종괘(綜卦) 계산 모듈
 * 문왕 64괘 차례 및 8괘(건·태·리·진·손·감·간·곤) 음양 이진수 기반 수학적 계산
 */

// 8괘 이진수 표현 (아래 효부터 위 효 순서: 1=양, 0=음)
const TRI: Record<string, string> = {
  건: '111',
  태: '110',
  리: '101',
  진: '100',
  손: '011',
  감: '010',
  간: '001',
  곤: '000'
}

const ORDER = ['건', '태', '리', '진', '손', '감', '간', '곤'] as const

// 하괘 → [상괘 건, 태, 리, 진, 손, 감, 간, 곤] 매핑 (문왕 64괘 괘 번호)
const ROWS: Record<string, number[]> = {
  건: [1, 43, 14, 34, 9, 5, 26, 11],
  태: [10, 58, 38, 54, 61, 60, 41, 19],
  리: [13, 49, 30, 55, 37, 63, 22, 36],
  진: [25, 17, 21, 51, 42, 3, 27, 24],
  손: [44, 28, 50, 32, 57, 48, 18, 46],
  감: [6, 47, 64, 40, 59, 29, 4, 7],
  간: [33, 31, 56, 62, 53, 39, 52, 15],
  곤: [12, 45, 35, 16, 20, 8, 23, 2]
}

const byLines: Record<string, number> = {}
const lines: Record<number, string> = {}

for (const lo of ORDER) {
  ORDER.forEach((up, i) => {
    const n = ROWS[lo][i]
    const l = TRI[lo] + TRI[up] // 1효~6효 (하괘 3효 + 상괘 3효)
    byLines[l] = n
    lines[n] = l
  })
}

// 음양 반전 (1 -> 0, 0 -> 1)
const flip = (l: string) => [...l].map(c => (c === '1' ? '0' : '1')).join('')

/**
 * 호괘(互卦): 2, 3, 4효로 하괘를 삼고, 3, 4, 5효로 상괘를 삼아 이루어진 괘
 */
export const hogwae = (n: number): number => {
  const l = lines[n]
  if (!l) return n
  return byLines[l.slice(1, 4) + l.slice(2, 5)]
}

/**
 * 착괘(錯卦): 6개 효의 음양을 모두 반전시킨 괘 (대대괘, 반대 성질)
 */
export const chakgwae = (n: number): number => {
  const l = lines[n]
  if (!l) return n
  return byLines[flip(l)]
}

/**
 * 종괘(綜卦): 6개 효의 위아래를 뒤집은 괘 (전도괘/도립괘, 상대방의 시각)
 */
export const jonggwae = (n: number): number => {
  const l = lines[n]
  if (!l) return n
  return byLines[[...l].reverse().join('')]
}

/**
 * 64괘 한국어 이름 맵
 */
export const hexagramNamesKorean: Record<number, string> = {
  1: '중천건', 2: '중지곤', 3: '수뢰준', 4: '산수몽', 5: '수천수', 6: '천수송', 7: '지수사', 8: '수지비',
  9: '풍천소축', 10: '천택리', 11: '지천태', 12: '천지비', 13: '천화동인', 14: '화천대유', 15: '지산겸', 16: '뇌지예',
  17: '택뢰수', 18: '산풍고', 19: '지택림', 20: '풍지관', 21: '화뢰서합', 22: '산화비', 23: '산지박', 24: '지뢰복',
  25: '천뢰무망', 26: '산천대축', 27: '산뢰이', 28: '택풍대과', 29: '중수감', 30: '중화리', 31: '택산함', 32: '뇌풍항',
  33: '천산둔', 34: '뇌천대장', 35: '화지진', 36: '지화명이', 37: '풍화가인', 38: '화택규', 39: '수산건', 40: '뇌수해',
  41: '산택손', 42: '풍뢰익', 43: '택천쾌', 44: '천풍구', 45: '택지췌', 46: '지풍승', 47: '택수곤', 48: '수풍정',
  49: '택화혁', 50: '화풍정', 51: '중뢰진', 52: '중산간', 53: '풍산점', 54: '뇌택귀매', 55: '뇌화풍', 56: '화산려',
  57: '중풍손', 58: '중택태', 59: '풍수환', 60: '수택절', 61: '풍택중부', 62: '뇌산소과', 63: '수화기제', 64: '화수미제'
}

/**
 * 괘 번호에 따른 호괘·착괘·종괘 종합 정보
 */
export const getHexagramRelations = (n: number) => {
  const hId = hogwae(n)
  const cId = chakgwae(n)
  const jId = jonggwae(n)
  return {
    hogwae: { id: hId, name: hexagramNamesKorean[hId] },
    chakgwae: { id: cId, name: hexagramNamesKorean[cId] },
    jonggwae: { id: jId, name: hexagramNamesKorean[jId] },
    isChakEqualsJong: cId === jId,
    isSelfSymmetric: jId === n // 상하를 뒤집어도 자기 자신인 부전괘(건, 곤, 감, 리, 이, 대과, 중부, 소과 8개)
  }
}
