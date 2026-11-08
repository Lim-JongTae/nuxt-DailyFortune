import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

const targetHexes = [14, 18, 23, 26, 33, 41, 42, 43, 45, 46, 51, 54, 61]

console.log('=== 대상 괘 재물(wealth) 및 FAQ/오해 문장 점검 ===\n')

for (const id of targetHexes) {
  const detail = getEnhancedHexagramDetail(id)
  console.log(`[제${id}괘 ${detail.nameKorean}]`)
  console.log(`- wealth: "${detail.content.fields.wealth}"`)
  const full = JSON.stringify(detail)
  
  // 지적된 키워드 검색
  const keywords = ['손절', '매도', '매수', '물타기', '잡주', '치솟', '쌓여갑', '파멸', '반토막', '블루칩', '주식', '테마주']
  keywords.forEach(k => {
    if (full.includes(k)) {
      const matches = full.match(new RegExp(`.{0,25}${k}.{0,25}`, 'g')) || []
      matches.forEach(m => console.log(`  * [${k}]: "...${m.trim()}..."`))
    }
  })

  // 반드시/절대 빈도
  const b = (full.match(/반드시/g) || []).length
  const j = (full.match(/절대/g) || []).length
  const m = (full.match(/무조건/g) || []).length
  console.log(`  * 단정어 빈도: 반드시(${b}), 절대(${j}), 무조건(${m}) -> 총 ${b + j + m}회\n`)
}

