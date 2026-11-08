import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

for (const id of [42, 45, 61]) {
  console.log(`\n=================== 제${id}괘 ===================`)
  const detail = getEnhancedHexagramDetail(id)
  const fullText = JSON.stringify(detail)
  const matches = fullText.match(/.{0,25}(반드시|절대|무조건).{0,25}/g) || []
  matches.forEach(m => console.log(`  - "${m.trim()}"`))
}

