import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

console.log('=== 주역 64괘 고밀도 정통 해설 전수 무결성 검증 시작 ===\n')

let totalErrors = 0
let totalWarning = 0

// 검사할 의심스러운 패턴
const suspiciousSourcesPatterns = [
  /론$/, /설$/, /고$/, /편$/, /의$/, /해$/, /의설$/, /약설$/, /총설$/, /강의$/
]

for (let id = 1; id <= 64; id++) {
  const hex = getEnhancedHexagramDetail(id)
  if (!hex) {
    console.error(`[ERROR] [Hex ${id}] Not found!`)
    totalErrors++
    continue
  }

  if (!hex.isEnhanced) {
    console.error(`[ERROR] [Hex ${id}] isEnhanced is false!`)
    totalErrors++
  }

  const c = hex.content
  if (!c) {
    console.error(`[ERROR] [Hex ${id}] content is missing!`)
    totalErrors++
    continue
  }

  // 1. 6효 무결성 검사
  if (!c.lines || c.lines.length !== 6) {
    console.error(`[ERROR] [Hex ${id}] lines count is not 6, got ${c.lines?.length}`)
    totalErrors++
  } else {
    for (let lIdx = 0; lIdx < 6; lIdx++) {
      const line = c.lines[lIdx]
      if (!line.nameHanja || line.nameHanja.trim() === '') {
        console.error(`[ERROR] [Hex ${id} Line ${lIdx + 1}] nameHanja is empty!`)
        totalErrors++
      }
      if (!line.nameKorean || line.nameKorean.trim() === '') {
        console.error(`[ERROR] [Hex ${id} Line ${lIdx + 1}] nameKorean is empty!`)
        totalErrors++
      }
      if (!line.textHanja || line.textHanja.trim() === '') {
        console.error(`[ERROR] [Hex ${id} Line ${lIdx + 1}] textHanja is empty!`)
        totalErrors++
      }
      if (!line.textKorean || line.textKorean.trim() === '') {
        console.error(`[ERROR] [Hex ${id} Line ${lIdx + 1}] textKorean is empty!`)
        totalErrors++
      }
      if (!line.traditionalInterp || line.traditionalInterp.trim() === '') {
        console.error(`[ERROR] [Hex ${id} Line ${lIdx + 1}] traditionalInterp is empty!`)
        totalErrors++
      }
      if (!line.scene || line.scene.trim() === '') {
        console.error(`[ERROR] [Hex ${id} Line ${lIdx + 1}] scene is empty!`)
        totalErrors++
      }
      if (!line.modernAdvice || line.modernAdvice.trim() === '') {
        console.error(`[ERROR] [Hex ${id} Line ${lIdx + 1}] modernAdvice is empty!`)
        totalErrors++
      }
    }
  }

  // 2. FAQ 검사
  if (!c.faq || c.faq.length < 3) {
    console.error(`[ERROR] [Hex ${id}] FAQ count is less than 3!`)
    totalErrors++
  } else {
    for (let fIdx = 0; fIdx < c.faq.length; fIdx++) {
      const f = c.faq[fIdx]
      if (!f.q || f.q.trim() === '') {
        console.error(`[ERROR] [Hex ${id} FAQ ${fIdx + 1}] Question is empty!`)
        totalErrors++
      }
      if (!f.a || f.a.trim() === '') {
        console.error(`[ERROR] [Hex ${id} FAQ ${fIdx + 1}] Answer is empty!`)
        totalErrors++
      }
    }
  }

  // 3. 참고 문헌 검사
  if (!c.sources || c.sources.length < 3) {
    console.error(`[ERROR] [Hex ${id}] Sources count is less than 3!`)
    totalErrors++
  } else {
    for (const src of c.sources) {
      // 끝자리가 가짜 소제목으로 의심되는 경우 경고
      const parts = src.split(' ')
      const lastWord = parts[parts.length - 1]
      for (const pattern of suspiciousSourcesPatterns) {
        if (pattern.test(lastWord) && !lastWord.includes('괘') && !lastWord.includes('주역') && !lastWord.includes('전') && !lastWord.includes('의')) {
          console.warn(`[WARN] [Hex ${id}] Suspicious source subtitle: "${src}"`)
          totalWarning++
          break
        }
      }
    }
  }

  // 4. 건강 항목 검사 (의료법/과장 문구 점검)
  if (!c.fields || !c.fields.health) {
    console.error(`[ERROR] [Hex ${id}] fields.health is missing!`)
    totalErrors++
  } else {
    if (c.fields.health.includes('삼계탕') || c.fields.health.includes('한방 탕약') || c.fields.health.includes('고지혈증')) {
      console.warn(`[WARN] [Hex ${id}] fields.health contains questionable prescription phrases: "${c.fields.health.slice(0, 60)}..."`)
      totalWarning++
    }
  }
}

console.log('----------------------------------------------------')
console.log(`총 에러: ${totalErrors}건`)
console.log(`총 경고: ${totalWarning}건`)
console.log('----------------------------------------------------')

