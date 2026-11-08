import fs from 'node:fs'

const data = JSON.parse(fs.readFileSync('scripts/duplicates_report.json', 'utf8'))
console.log(`Total duplicate sentences: ${data.length}`)

// 전체 중복 문장 목록과 출현 위치 출력
for (let i = 0; i < data.length; i++) {
  const item = data[i]
  console.log(`[#${i + 1}] (${item.occurrences.length}회) ${item.sentence}`)
  for (const occ of item.occurrences) {
    console.log(`   - ${occ.code} (${occ.field})`)
  }
}

