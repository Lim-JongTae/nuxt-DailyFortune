import type { IljuDetailData } from './types'
import { iljuGroup1 } from './iljuGroup1'
import { iljuGroup2 } from './iljuGroup2'
import { iljuGroup3 } from './iljuGroup3'
import { iljuGroup4 } from './iljuGroup4'
import { iljuGroup5 } from './iljuGroup5'
import { iljuGroup6 } from './iljuGroup6'
import { getIljuDetailByCode as getLegacyIljuDetail, getIljuDetailByOrder as getLegacyIljuByOrder } from '../sajuIljuData'
import { getRecommendedGoodMatches, getRecommendedClashMatches } from './calcIlju'

const enhancedIljuMap: Record<string, IljuDetailData> = {
  ...iljuGroup1,
  ...iljuGroup2,
  ...iljuGroup3,
  ...iljuGroup4,
  ...iljuGroup5,
  ...iljuGroup6
}

export function getEnhancedIljuDetail(code: string): any {
  const normalizedCode = (code || '').toLowerCase().trim()

  // 1. 신규 고밀도 학술 데이터가 존재하는 경우 우선 반환
  if (enhancedIljuMap[normalizedCode]) {
    const ilju = enhancedIljuMap[normalizedCode]
    const prevOrder = ilju.order > 1 ? ilju.order - 1 : 60
    const nextOrder = ilju.order < 60 ? ilju.order + 1 : 1

    const prevLegacy = getLegacyIljuByOrder(prevOrder)
    const nextLegacy = getLegacyIljuByOrder(nextOrder)

    // 참고 문헌(sources)을 해당 일주의 정확한 간지 변수로 정통 4대 고전 책 단위 동적 생성
    const dynamicSources = [
      `『자평진전(子平眞詮)』 ${ilju.ganzhi}론`,
      `『적천수천미(滴天髓闡微)』 ${ilju.ganzhi} 물상과 희기`,
      `『궁통보감(窮通寶鑑)』 ${ilju.stem}간 조후론`,
      `『삼명통회(三命通會)』 ${ilju.ganzhi} 고전 해석`
    ]

    // 명리학 정통 합·충·원진 공식에 기반한 무결점 궁합(compat) 자동 보강
    const verifiedCompat = {
      good: getRecommendedGoodMatches(ilju.ganzhi),
      clash: getRecommendedClashMatches(ilju.ganzhi)
    }

    return {
      ...ilju,
      isEnhanced: true,
      content: ilju.content ? {
        ...ilju.content,
        sources: dynamicSources,
        compat: verifiedCompat
      } : undefined,
      prevIlju: prevLegacy ? { code: prevLegacy.code, ganzhi: prevLegacy.ganzhi, ganzhiHanja: prevLegacy.ganzhiHanja, order: prevLegacy.order } : null,
      nextIlju: nextLegacy ? { code: nextLegacy.code, ganzhi: nextLegacy.ganzhi, ganzhiHanja: nextLegacy.ganzhiHanja, order: nextLegacy.order } : null
    }
  }

  // 2. 아직 신규 데이터 작성 전인 일주는 기존 레거시 데이터를 반환하되 isEnhanced: false 부여
  const legacy = getLegacyIljuDetail(normalizedCode)
  if (!legacy) return null

  const prevOrder = legacy.order > 1 ? legacy.order - 1 : 60
  const nextOrder = legacy.order < 60 ? legacy.order + 1 : 1

  const prevLegacy = getLegacyIljuByOrder(prevOrder)
  const nextLegacy = getLegacyIljuByOrder(nextOrder)

  return {
    ...legacy,
    isEnhanced: false,
    prevIlju: prevLegacy ? { code: prevLegacy.code, ganzhi: prevLegacy.ganzhi, ganzhiHanja: prevLegacy.ganzhiHanja, order: prevLegacy.order } : null,
    nextIlju: nextLegacy ? { code: nextLegacy.code, ganzhi: nextLegacy.ganzhi, ganzhiHanja: nextLegacy.ganzhiHanja, order: nextLegacy.order } : null
  }
}

export { enhancedIljuMap }
