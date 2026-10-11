import fs from 'fs'
import path from 'path'
import {
  hexagramNames,
  verifiedClassicMap,
  type ClassicExtInfo,
  type IChingLine
} from './ichingClassicData'

export interface IChingLineDetail {
  lineNumber: number
  nameHanja: string
  nameKorean: string
  textHanja: string
  textKorean: string
  traditionalInterp?: string
  modernAdvice?: string
}

export interface IChingDetailResponseData {
  id: number
  slug: string
  nameKorean: string
  nameHanji: string
  desc: string
  meaning: string
  // 고전 십익
  guaCi: string
  tuanZhuan: string
  tuanExplanation: string
  xiangZhuan: string
  xiangLesson: string
  xuGuaZhuan: string
  prevNextCompare: string
  // 분야별 운세
  businessFate: string
  wealthFate: string
  loveFate: string
  healthFate: string
  // 6효사
  lines: IChingLineDetail[]
  // FAQ
  faqList: Array<{ q: string; a: string }>
  // 관련 괘
  relatedHexagrams?: Array<{ id: number; name: string; slug: string }>
}

// 384효 데이터 메모리 캐시 (서버 최초 로드 시 1회만 파싱)
let cachedLinesByHex: Record<number, IChingLine[]> | null = null

function getKoreanLineName(nameHanja: string = '', lineNumber: number): string {
  const map: Record<string, string> = {
    '初': '초',
    '上': '상',
    '六': '육',
    '九': '구',
    '二': '이',
    '三': '삼',
    '四': '사',
    '五': '오'
  }
  if (!nameHanja) return `${lineNumber}효`
  return nameHanja.split('').map(char => map[char] || char).join('')
}

function load384Lines(): Record<number, IChingLine[]> {
  if (cachedLinesByHex) return cachedLinesByHex

  try {
    const jsonPath = path.resolve(process.cwd(), 'prisma/iching_384_lines.json')
    if (fs.existsSync(jsonPath)) {
      const rawLines: IChingLine[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
      const map: Record<number, IChingLine[]> = {}
      for (const line of rawLines) {
        if (!map[line.hexagramId]) {
          map[line.hexagramId] = []
        }
        map[line.hexagramId]!.push(line)
      }
      cachedLinesByHex = map
      return map
    }
  } catch (err: any) {
    console.error('[IChingData] Failed to load 384 lines JSON:', err.message)
  }

  cachedLinesByHex = {}
  return cachedLinesByHex
}

/**
 * 64괘 고유 상세 정보 및 6개 효사 데이터를 0.001초 만에 반환하는 초고속 조회 함수
 */
export function getIChingHexagramDetail(id: number): IChingDetailResponseData | null {
  if (id < 1 || id > 64) return null

  const base = hexagramNames[id]
  const classic = verifiedClassicMap[id] as ClassicExtInfo | undefined
  const linesMap = load384Lines()
  const rawLines = linesMap[id] || []
  rawLines.sort((a, b) => a.lineNumber - b.lineNumber)

  const lines: IChingLineDetail[] = rawLines.map((l) => {
    const nameHanja = l.nameHanja || `${l.lineNumber}효`
    const nameKorean = getKoreanLineName(nameHanja, l.lineNumber)
    const traditionalInterp = classic?.lineExplanations?.[l.lineNumber] || ''

    return {
      lineNumber: l.lineNumber,
      nameHanja,
      nameKorean,
      textHanja: l.textHanja || '',
      textKorean: l.textKorean || '',
      traditionalInterp: traditionalInterp || undefined,
      modernAdvice: l.modernAdvice || undefined
    }
  })

  const prevId = id > 1 ? id - 1 : 64
  const nextId = id < 64 ? id + 1 : 1
  const prevInfo = hexagramNames[prevId]
  const nextInfo = hexagramNames[nextId]

  const defaultFaq = [
    {
      q: `제${id}괘 ${base?.nameKorean || ''}이 나왔을 때 가장 핵심적인 처세 지침은 무엇인가요?`,
      a: classic?.tuanExplanation || base?.meaning || '순리에 따르고 도리를 지키십시오.'
    },
    {
      q: '6개 효사 중 어떤 효를 중점적으로 보아야 하나요?',
      a: '점대를 뽑아 얻은 동효(動爻)가 있다면 해당 효사의 가르침과 현대적 조언을 최우선 지침으로 삼고, 동효가 없다면 본 괘의 괘사와 상전의 조언을 중심에 두는 것이 주역의 오랜 원칙입니다.'
    }
  ]

  return {
    id,
    slug: base?.slug || `${id < 10 ? '0' + id : id}-hexagram`,
    nameKorean: base?.nameKorean || `제${id}괘`,
    nameHanji: base?.nameHanji || '周易',
    desc: base?.desc || '변화의 이치를 담은 주역 괘',
    meaning: base?.meaning || '자연의 섭리에 조화롭게 순응하며 바른 지혜를 다스립니다.',
    // 고전 십익
    guaCi: classic?.guaCi || `${base?.nameHanji || ''} 元亨利貞.`,
    tuanZhuan: classic?.tuanZhuan || '',
    tuanExplanation: classic?.tuanExplanation || base?.meaning || '',
    xiangZhuan: classic?.xiangZhuan || '',
    xiangLesson: classic?.xiangLesson || base?.meaning || '',
    xuGuaZhuan: classic?.xuGuaZhuan || '',
    prevNextCompare: (classic?.prevNextCompare || `제${prevId}괘 [${prevInfo?.nameKorean || ''}](/guide/iching/${prevId})의 흐름을 이어받아 제${nextId}괘 [${nextInfo?.nameKorean || ''}](/guide/iching/${nextId})의 변화로 연결됩니다.`).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
    // 분야별 운세
    businessFate: classic?.businessFate || '원칙과 신뢰를 바탕으로 차분하고 지혜롭게 전진하십시오.',
    wealthFate: classic?.wealthFate || '무리한 확장을 피하고 내실을 다지며 실속을 챙기십시오.',
    loveFate: classic?.loveFate || '상대를 배려하고 진심 어린 소통을 이어가면 좋은 결실을 맺습니다.',
    healthFate: classic?.healthFate || '스트레스를 줄이고 규칙적인 생활 습관을 유지하여 심신의 균형을 잡으십시오.',
    // 6효사
    lines,
    // FAQ
    faqList: (classic?.faqList && classic.faqList.length > 0) ? classic.faqList : defaultFaq,
    // 관련 괘
    relatedHexagrams: classic?.relatedHexagrams || [
      { id: prevId, name: `제${prevId}괘 ${prevInfo?.nameKorean || ''}`, slug: String(prevId) },
      { id: nextId, name: `제${nextId}괘 ${nextInfo?.nameKorean || ''}`, slug: String(nextId) }
    ]
  }
}
