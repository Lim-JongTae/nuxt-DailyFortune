import fs from 'node:fs'

const data = JSON.parse(fs.readFileSync('scripts/duplicates_report.json', 'utf8'))
data.sort((a: any, b: any) => b.occurrences.length - a.occurrences.length)
console.log('Top 30 most duplicated sentences:')
for (let i = 0; i < Math.min(30, data.length); i++) {
  const item = data[i]
  console.log(`[${item.occurrences.length}회] "${item.sentence}"`)
  console.log(`   -> 대상: ${item.occurrences.map((o: any) => `${o.code}(${o.field})`).join(', ')}`)
}

