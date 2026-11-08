import { getEnhancedHexagramDetail } from '../server/utils/iching/index'
import { hexagramNamesKorean } from '../server/utils/iching/calcGwae'

console.log('=== 64괘 참고 문헌(sources) 일치 전수 검사 ===')
let mismatchCount = 0

for (let i = 1; i <= 64; i++) {
  const detail = getEnhancedHexagramDetail(i)
  const expectedName = hexagramNamesKorean[i]
  const sources = detail?.content?.sources || []

  // 모든 source 항목에 expectedName이 포함되어 있는지 검사
  const nonMatching = sources.filter((s: string) => !s.includes(expectedName))
  if (nonMatching.length > 0) {
    mismatchCount++
    console.log(`제${i}괘 불일치 발견! 기대값: ${expectedName}, 불일치 sources:`, nonMatching)
  }
}

if (mismatchCount === 0) {
  console.log('✅ 64개 전 괘의 참고 문헌(sources)이 해당 괘 이름과 100% 정확히 일치합니다!! (불일치: 0건)')
} else {
  console.log(`❌ 총 불일치 괘 수: ${mismatchCount}건`)
}

