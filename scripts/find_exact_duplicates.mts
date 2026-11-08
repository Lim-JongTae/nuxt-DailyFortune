import { getEnhancedIljuDetail } from '../server/utils/saju/index'
import { SAJU_ILJU_DATA } from '../server/utils/sajuIljuData'
import fs from 'node:fs'

const expectedCodes = SAJU_ILJU_DATA.map(i => i.code)
const sentenceMap = new Map<string, Array<{ code: string; field: string }>>()

for (const code of expectedCodes) {
  const ilju = getEnhancedIljuDetail(code)
  const c = ilju.content

  const textBlocks: Array<{ field: string; text: string }> = [
    { field: 'summary', text: c.summary || '' },
    { field: 'structureNote', text: c.structureNote || '' },
    { field: 'career', text: c.fields?.career || '' },
    { field: 'wealth', text: c.fields?.wealth || '' },
    { field: 'love', text: c.fields?.love || '' },
    { field: 'health', text: c.fields?.health || '' },
    { field: 'seasonFlow', text: c.seasonFlow || '' },
    { field: 'misconceptions', text: c.misconceptions || '' },
    ...c.traits.scenes.map((s: string, idx: number) => ({ field: `scene${idx+1}`, text: s })),
    ...c.faq.map((f: any, idx: number) => ({ field: `faq${idx+1}.a`, text: f.a || '' }))
  ]

  for (const block of textBlocks) {
    const sentences = block.text.split(/[.?!]\s+/).map(s => s.trim()).filter(s => s.length > 25)
    for (const sent of sentences) {
      if (sent.includes('전문 의료기관') || sent.includes('상징적 풀이') || sent.includes('전통 동양철학')) continue

      if (!sentenceMap.has(sent)) {
        sentenceMap.set(sent, [])
      }
      sentenceMap.get(sent)!.push({ code, field: block.field })
    }
  }
}

const duplicates: Array<{ sentence: string; occurrences: Array<{ code: string; field: string }> }> = []
for (const [sentence, occurrences] of sentenceMap.entries()) {
  if (occurrences.length > 1) {
    duplicates.push({ sentence, occurrences })
  }
}

console.log(`총 중복 문장 종류: ${duplicates.length}개`)
fs.writeFileSync('scripts/duplicates_report.json', JSON.stringify(duplicates, null, 2), 'utf8')
console.log('Report saved to scripts/duplicates_report.json')

