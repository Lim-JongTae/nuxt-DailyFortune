import fs from 'node:fs'
import path from 'node:path'
import {
  getRecommendedGoodMatches,
  getRecommendedClashMatches
} from '../server/utils/saju/calcIlju.js'

const SAJU_DIR = path.resolve('server/utils/saju')
const GROUP_FILES = [
  'iljuGroup1.ts',
  'iljuGroup2.ts',
  'iljuGroup3.ts',
  'iljuGroup4.ts',
  'iljuGroup5.ts',
  'iljuGroup6.ts'
]

console.log('>>> 60일주 compat(good & clash) 정적 파일 동기화 시작...')

for (const f of GROUP_FILES) {
  const filePath = path.join(SAJU_DIR, f)
  let content = fs.readFileSync(filePath, 'utf-8')

  // 각 일주 블록 매칭: 'gap-ja': { ... ganzhi: '갑자' ... compat: { ... } , misconceptions:
  const iljuRegex = /('([a-z\-]+)':\s*\{[\s\S]+?ganzhi:\s*'([^']+)'[\s\S]+?compat:\s*\{)([\s\S]+?)(\}\s*,\s*misconceptions:)/g

  let updatedCount = 0
  content = content.replace(iljuRegex, (match, prefix, codeKey, ganzhi, oldCompatBody, suffix) => {
    updatedCount++
    const goodList = getRecommendedGoodMatches(ganzhi)
    const clashList = getRecommendedClashMatches(ganzhi)

    const formatItem = (item: any) => `          {
            id: '${item.id}',
            name: '${item.name}',
            reason: '${item.reason.replace(/'/g, "\\'")}'
          }`

    const newGoodStr = `\n        good: [\n${goodList.map(formatItem).join(',\n')}\n        ]`
    const newClashStr = `\n        clash: [\n${clashList.map(formatItem).join(',\n')}\n        ]\n      `

    return `${prefix}${newGoodStr},${newClashStr}${suffix}`
  })

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`√ Synced ${updatedCount} iljus in ${f}`)
}

console.log('>>> 60일주 compat(good & clash) 파일 동기화 완료!')
