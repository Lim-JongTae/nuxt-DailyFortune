import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

const sampleIds = [3, 10, 21, 49, 57, 63]

console.log('=== 무작위 6개 괘 정통 원전 대조 데이터 추출 ===\n')

for (const id of sampleIds) {
  const detail = getEnhancedHexagramDetail(id)
  console.log(`========================================`)
  console.log(`[제${id}괘 ${detail.nameKorean} (${detail.nameHanji})]`)
  console.log(`괘사: ${detail.guaCi}`)
  console.log(`단전: ${detail.tuanZhuan?.slice(0, 50)}...`)
  console.log(`상전(대상): ${detail.xiangZhuan?.slice(0, 50)}...`)
  console.log(`효사 샘플:`)
  detail.content.lines.slice(0, 3).forEach((l: any) => {
    console.log(`  - [${l.nameKorean} (${l.nameHanja})]`)
    console.log(`    효사: ${l.textHanja} / ${l.textKorean}`)
    console.log(`    상전: ${l.traditionalInterp?.slice(0, 60)}...`)
  })
  console.log(`\n`)
}

