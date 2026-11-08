import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

for (const id of [1, 7, 23, 24, 25, 29, 32]) {
  console.log(`\n=================== 제${id}괘 ===================`)
  const detail = getEnhancedHexagramDetail(id)
  const fullText = JSON.stringify(detail)
  const matches = fullText.match(/.{0,30}(반드시|절대|무조건).{0,30}/g) || []
  matches.forEach(m => console.log(`  - "${m.trim()}"`))
}

