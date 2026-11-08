import { ichingLinesByHexagram } from '../server/utils/iching384LinesData'
import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

for (const id of [1, 12, 36, 50]) {
  console.log(`\n=================== 괘 ${id} ===================`)
  const detail = getEnhancedHexagramDetail(id)
  const lines = detail?.content?.lines || []
  lines.slice(0, 2).forEach((l: any) => {
    console.log(`[제${l.n}효] ${l.nameKorean} (${l.nameHanja})`)
    console.log(`  효사 한자: ${l.textHanja}`)
    console.log(`  효사 한글: ${l.textKorean}`)
    console.log(`  전통해석: ${l.traditionalInterp}`)
  })
}

