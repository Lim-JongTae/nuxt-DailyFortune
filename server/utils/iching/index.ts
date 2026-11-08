import type { HexagramDetailData } from './types'
import { hexagrams1_8 } from './hexagrams1_8'
import { hexagrams9_16 } from './hexagrams9_16'
import { hexagrams17_24 } from './hexagrams17_24'
import { hexagrams25_32 } from './hexagrams25_32'
import { hexagrams33_40 } from './hexagrams33_40'
import { hexagrams41_48 } from './hexagrams41_48'
import { hexagrams49_56 } from './hexagrams49_56'
import { hexagrams57_64 } from './hexagrams57_64'
import { getIChingHexagramDetail as getLegacyHexagramDetail } from '../ichingData'

const enhancedHexagramsMap: Record<number, HexagramDetailData> = {
  ...hexagrams1_8,
  ...hexagrams9_16,
  ...hexagrams17_24,
  ...hexagrams25_32,
  ...hexagrams33_40,
  ...hexagrams41_48,
  ...hexagrams49_56,
  ...hexagrams57_64
}

export function getEnhancedHexagramDetail(id: number): any {
  // 1. 신규 고밀도 학술 데이터가 존재하는 경우 우선 반환
  if (enhancedHexagramsMap[id]) {
    const hex = enhancedHexagramsMap[id]
    const prevId = id > 1 ? id - 1 : 64
    const nextId = id < 64 ? id + 1 : 1

    const prevLegacy = getLegacyHexagramDetail(prevId)
    const nextLegacy = getLegacyHexagramDetail(nextId)

    return {
      ...hex,
      isEnhanced: true,
      prevHexagram: prevLegacy ? { id: prevLegacy.id, nameKorean: prevLegacy.nameKorean, slug: prevLegacy.slug } : null,
      nextHexagram: nextLegacy ? { id: nextLegacy.id, nameKorean: nextLegacy.nameKorean, slug: nextLegacy.slug } : null
    }
  }

  // 2. 아직 신규 데이터 작성 전인 괘는 기존 데이터를 반환하되 isEnhanced: false 플래그 부여
  const legacy = getLegacyHexagramDetail(id)
  if (!legacy) return null

  return {
    ...legacy,
    isEnhanced: false
  }
}

