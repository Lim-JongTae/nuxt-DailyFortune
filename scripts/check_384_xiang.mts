import { ichingLinesByHexagram } from '../server/utils/iching384LinesData'

console.log('=== iching384LinesData의 64괘별 traditionalInterp 점검 ===')
const missingXiang: number[] = []

for (let i = 1; i <= 64; i++) {
  const lines = ichingLinesByHexagram[i] || []
  if (lines.length !== 6) {
    console.log(`제${i}괘 효 개수 오류: ${lines.length}개`)
    continue
  }
  const noXiangLines = lines.filter((l: any) => !l.traditionalInterp || !l.traditionalInterp.includes('象曰'))
  if (noXiangLines.length > 0) {
    missingXiang.push(i)
    console.log(`제${i}괘: 象曰 없는 효 ${noXiangLines.length}개 (효 번호: ${noXiangLines.map((x: any) => x.lineNumber).join(', ')})`)
  }
}

if (missingXiang.length === 0) {
  console.log('대박! iching384LinesData에 64괘 384효 전체 象曰 원문이 100% 들어있습니다!!')
} else {
  console.log('누락된 괘들:', missingXiang)
}

