import { ichingLinesByHexagram } from '../server/utils/iching384LinesData'
import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

const hasXiangZhuan: number[] = []
const noXiangZhuan: number[] = []

for (let i = 1; i <= 64; i++) {
  const detail = getEnhancedHexagramDetail(i)
  const lines = detail?.content?.lines || []
  // 6개 효 모두에 '象曰' 또는 '상전' 표기가 있는지 확인
  const countWithXiang = lines.filter((l: any) => 
    (l.traditionalInterp && (l.traditionalInterp.includes('象曰') || l.traditionalInterp.includes('상전'))) ||
    (l.textHanja && l.textHanja.includes('象曰'))
  ).length

  if (countWithXiang >= 4) {
    hasXiangZhuan.push(i)
  } else {
    noXiangZhuan.push(i)
  }
}

console.log('상전 포함 괘 수:', hasXiangZhuan.length, hasXiangZhuan)
console.log('상전 누락 괘 수:', noXiangZhuan.length, noXiangZhuan)

