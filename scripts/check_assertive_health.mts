import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

const assertiveWords = ['반드시', '절대', '무조건']
const diseaseWords = ['고혈압', '당뇨', '심장', '뇌졸중', '동맥경화', '협심증', '암', '위염', '위궤양', '관절염', '간염', '신부전']

console.log('=== 단정 표현 검사 ===')
for (let i = 1; i <= 64; i++) {
  const detail = getEnhancedHexagramDetail(i)
  const fullText = JSON.stringify(detail)
  let count = 0
  for (const w of assertiveWords) {
    const matches = fullText.match(new RegExp(w, 'g'))
    if (matches) count += matches.length
  }
  if (count >= 4) {
    console.log(`제${i}괘: 단정어 ${count}회`)
  }
}

console.log('\n=== 질환명 검사 (fields.health) ===')
for (let i = 1; i <= 64; i++) {
  const detail = getEnhancedHexagramDetail(i)
  const healthText = detail?.content?.fields?.health || ''
  const foundDiseases = diseaseWords.filter(d => healthText.includes(d))
  if (foundDiseases.length > 0) {
    console.log(`제${i}괘 건강 항목 질환명: ${foundDiseases.join(', ')} -> "${healthText.slice(0, 60)}..."`)
  }
}

