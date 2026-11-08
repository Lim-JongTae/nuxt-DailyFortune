import { ichingLinesByHexagram } from '../server/utils/iching384LinesData'
import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

console.log('=== 1. iching384LinesData traditionalInterp 검사 ===')
const missingIn384: number[] = []
for (let i = 1; i <= 64; i++) {
  const lines = ichingLinesByHexagram[i] || []
  const emptyInterp = lines.filter((l: any) => !l.traditionalInterp || l.traditionalInterp.trim() === '')
  if (emptyInterp.length > 0 || lines.length === 0) {
    missingIn384.push(i)
  }
}
console.log('iching384LinesData 누락 괘 번호:', missingIn384)

console.log('\n=== 2. getEnhancedHexagramDetail merged lines traditionalInterp 검사 ===')
const missingInDetail: number[] = []
for (let i = 1; i <= 64; i++) {
  const detail = getEnhancedHexagramDetail(i)
  const lines = detail?.content?.lines || []
  const emptyInterp = lines.filter((l: any) => !l.traditionalInterp || l.traditionalInterp.trim() === '')
  if (emptyInterp.length > 0 || lines.length === 0) {
    missingInDetail.push(i)
  }
}
console.log('getEnhancedHexagramDetail 누락 괘 번호:', missingInDetail)

