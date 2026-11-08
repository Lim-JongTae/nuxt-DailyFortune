import * as fs from 'fs'

const content = fs.readFileSync('app/pages/guide/saju/ilju/[code].vue', 'utf-8')
const lines = content.split('\n')

// 어떤 함수 호출 형태: fn(fIdx), fn(idx) 등
lines.forEach((l, i) => {
  if (l.match(/\b\w+\s*\(\s*(fIdx|idx|scIdx|cIdx)\s*\)/)) {
    console.log(`Line ${i + 1}: ${l.trim()}`)
  }
})

