import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

const diseaseKeywords = [
  '고혈압', '당뇨', '심장', '뇌졸중', '동맥경화', '협심증', '암', '위염', '위궤양', 
  '관절염', '간염', '신부전', '뇌출혈', '공황장애', '심장마비', '치주염', '턱관절', 
  '디스크', '신경계', '림프', '요로결석', '혈관', '안과 질환', '뇌혈관', '피부 건조증'
]

console.log('=== 64괘 건강 항목 임상 질환명 검출 ===')
let count = 0
for (let i = 1; i <= 64; i++) {
  const detail = getEnhancedHexagramDetail(i)
  const health = detail?.content?.fields?.health || ''
  const found = diseaseKeywords.filter(k => health.includes(k))
  if (found.length > 0) {
    count++
    console.log(`[제${i}괘 ${detail.nameKorean}] 발견(${found.join(', ')}):`)
    console.log(`  "${health}"\n`)
  }
}
console.log(`총 임상 질환명 포함 괘 수: ${count}개`)

