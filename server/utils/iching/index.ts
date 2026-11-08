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
import { ichingLinesByHexagram, type IChingLine } from '../iching384LinesData'

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

    // 384효 원천 데이터(한자/한글 이름, 효사 한자/한글 원문, 전통 원문 해석)를 100% 자동 병합
    const baseLines = ichingLinesByHexagram[id] || []
    const mergedLines = (hex.content?.lines || []).map((l: any, idx: number) => {
      const base: Partial<IChingLine> = baseLines[idx] || {}
      return {
        ...base,
        ...l,
        n: l.n || base.lineNumber || idx + 1,
        nameHanja: l.nameHanja || base.nameHanja || '',
        nameKorean: l.nameKorean || base.nameKorean || '',
        textHanja: l.textHanja || base.textHanja || '',
        textKorean: l.textKorean || base.textKorean || '',
        // 정통 소상전(象曰) 원문이 포함된 원천 데이터를 최우선으로 반영
        traditionalInterp: (base.traditionalInterp && base.traditionalInterp.includes('象曰'))
          ? base.traditionalInterp
          : (l.traditionalInterp || base.traditionalInterp || ''),
        scene: l.scene || '',
        modernAdvice: l.modernAdvice || base.modernAdvice || ''
      }
    })

    // 참고 문헌(sources)을 해당 괘의 정확한 이름(hex.nameKorean) 변수로 100% 자동 동적 생성
    const dynamicSources = [
      `『주역(周易)』 ${hex.nameKorean}괘 괘사·단전·상전·효사`,
      `정이 『이천역전(伊川易傳)』 ${hex.nameKorean}괘`,
      `주희 『주역본의(周易本義)』 ${hex.nameKorean}괘`,
      `정약용 『주역사전(周易四箋)』 ${hex.nameKorean}괘`
    ]

    return {
      ...hex,
      isEnhanced: true,
      content: hex.content ? {
        ...hex.content,
        sources: dynamicSources,
        lines: mergedLines
      } : undefined,
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

