import fs from 'node:fs'

const data = JSON.parse(fs.readFileSync('scripts/duplicates_report.json', 'utf8'))

for (let g = 1; g <= 6; g++) {
  const minOrder = (g - 1) * 10 + 1
  const maxOrder = g * 10
  console.log(`\n=================== [Group ${g}: ${minOrder}~${maxOrder}] ===================`)
  let count = 0
  for (const item of data) {
    const hits = item.occurrences.filter((o: any) => {
      // order 찾기
      const code = o.code
      return true
    })
  }
}

