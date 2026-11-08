import * as fs from 'fs'
import * as path from 'path'

const files = [
  'app/pages/guide/saju/ilju/[code].vue',
  'app/pages/guide/iching/[id].vue',
  'app/pages/guide/iching/index.vue',
  'app/pages/guide/saju/index.vue'
]

files.forEach(f => {
  if (fs.existsSync(f)) {
    const lines = fs.readFileSync(f, 'utf-8').split('\n')
    lines.forEach((l, i) => {
      if (l.match(/\b\w+\s*\+\s*1\b/) && !l.includes('idx + 1') && !l.includes('id + 1')) {
        console.log(`${f}:${i + 1} -> ${l.trim()}`)
      }
    })
  }
})

