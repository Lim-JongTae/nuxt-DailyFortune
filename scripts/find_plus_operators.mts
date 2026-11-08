import * as fs from 'fs'

const content = fs.readFileSync('app/pages/guide/saju/ilju/[code].vue', 'utf-8')
const lines = content.split('\n')
lines.forEach((l, i) => {
  if (l.includes('+') && !l.includes('bg-') && !l.includes('border-') && !l.includes('px-') && !l.includes('py-')) {
    console.log(`Line ${i + 1}: ${l}`)
  }
})

