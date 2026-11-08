import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

let healthWarnings = 0
for (let id = 1; id <= 64; id++) {
  const hex = getEnhancedHexagramDetail(id)
  const h = hex?.content?.fields?.health || ''
  if (h.includes('삼계탕') || h.includes('탕약') || h.includes('치료') || h.includes('완치') || h.includes('고지혈증') || h.includes('보약')) {
    console.log(`[Hex ${id}] ${hex.nameKorean}: ${h}`)
    healthWarnings++
  }
}
console.log('Total health questionable phrases:', healthWarnings)

