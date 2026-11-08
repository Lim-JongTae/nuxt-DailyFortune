import * as fs from 'fs'

const content = fs.readFileSync('app/pages/guide/iching/[id].vue', 'utf-8')
const lines = content.split('\n')

const regex = /['"`]([^'"`]*\bdark:[^'"`]*)['"`]/g

console.log('=== app/pages/guide/iching/[id].vue 내 단일 문자열 혼용 dark: 검사 ===')
lines.forEach((line, lineNum) => {
  let match
  while ((match = regex.exec(line)) !== null) {
    const str = match[1]
    // 만약 dark: 외에 다른 라이트모드 스타일(bg-, text-, border- 등)이 같은 문자열에 혼용되어 있다면
    const hasLightColor = /\b(text|bg|border)-[a-z]+-\d+/.test(str)
    const hasDarkColor = /\bdark:(text|bg|border)-[a-z]+-\d+/.test(str)
    if (hasLightColor && hasDarkColor) {
      console.log(`Line ${lineNum + 1}: "${str}"`)
    }
  }
})

