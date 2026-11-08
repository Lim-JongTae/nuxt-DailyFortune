import { getEnhancedIljuDetail } from '../server/utils/saju/index'
import { SAJU_ILJU_DATA } from '../server/utils/sajuIljuData'

console.log('================================================================')
console.log('       [사주 60일주] 복사-붙여넣기 및 내용 누락 정밀 전수 검증       ')
console.log('================================================================\n')

let missingFieldCount = 0
let intraDuplicationCount = 0
let interDuplicationCount = 0
let totalChars = 0

const expectedCodes = SAJU_ILJU_DATA.map(i => i.code)

console.log('--- 1. 60일주 각 필드별 내용 누락 및 유효성 전수 검사 ---')

for (let i = 0; i < expectedCodes.length; i++) {
  const code = expectedCodes[i]
  const ilju = getEnhancedIljuDetail(code)

  if (!ilju || !ilju.content) {
    console.error(`[CRITICAL] [${code}] 데이터 또는 content가 누락되었습니다.`)
    missingFieldCount++
    continue
  }

  const c = ilju.content

  if (!c.summary || c.summary.length < 100) {
    console.error(`[누락/미흡] [${code}] summary가 너무 짧습니다 (${c.summary?.length || 0}자)`)
    missingFieldCount++
  }
  if (!c.structureNote || c.structureNote.length < 150) {
    console.error(`[누락/미흡] [${code}] structureNote가 너무 짧습니다 (${c.structureNote?.length || 0}자)`)
    missingFieldCount++
  }
  if (!c.traits?.strengths || c.traits.strengths.length < 2) {
    console.error(`[누락/미흡] [${code}] traits.strengths 부족`)
    missingFieldCount++
  }
  if (!c.traits?.weaknesses || c.traits.weaknesses.length < 2) {
    console.error(`[누락/미흡] [${code}] traits.weaknesses 부족`)
    missingFieldCount++
  }
  if (!c.traits?.scenes || c.traits.scenes.length !== 3) {
    console.error(`[누락/미흡] [${code}] traits.scenes 3개 미달 (${c.traits?.scenes?.length || 0}개)`)
    missingFieldCount++
  }

  const fields = ['career', 'wealth', 'love', 'health'] as const
  for (const f of fields) {
    const val = c.fields?.[f]
    if (!val || val.length < 150) {
      console.error(`[누락/미흡] [${code}] fields.${f}가 너무 짧습니다 (${val?.length || 0}자)`)
      missingFieldCount++
    }
  }

  if (!c.seasonFlow || c.seasonFlow.length < 100) {
    console.error(`[누락/미흡] [${code}] seasonFlow가 너무 짧습니다 (${c.seasonFlow?.length || 0}자)`)
    missingFieldCount++
  }
  if (!c.compat?.good || c.compat.good.length < 1 || !c.compat?.clash || c.compat.clash.length < 1) {
    console.error(`[누락/미흡] [${code}] compat 궁합 데이터 누락`)
    missingFieldCount++
  }
  if (!c.misconceptions || c.misconceptions.length < 50) {
    console.error(`[누락/미흡] [${code}] misconceptions가 너무 짧습니다 (${c.misconceptions?.length || 0}자)`)
    missingFieldCount++
  }
  if (!c.faq || c.faq.length < 3) {
    console.error(`[누락/미흡] [${code}] FAQ 개수 부족 (${c.faq?.length || 0}개)`)
    missingFieldCount++
  }
  if (!c.sources || c.sources.length < 3) {
    console.error(`[누락/미흡] [${code}] sources 개수 부족 (${c.sources?.length || 0}개)`)
    missingFieldCount++
  }

  // 글자수 합산
  const fullText = [
    c.summary,
    c.structureNote,
    ...c.traits.strengths,
    ...c.traits.weaknesses,
    ...c.traits.scenes,
    c.fields.career,
    c.fields.wealth,
    c.fields.love,
    c.fields.health,
    c.seasonFlow,
    ...c.compat.good.map((g: any) => g.reason),
    ...c.compat.clash.map((k: any) => k.reason),
    c.misconceptions,
    ...c.faq.map((f: any) => f.q + ' ' + f.a),
    ...c.sources
  ].join(' ')

  totalChars += fullText.length
}

console.log(`=> 사주 내용 누락 점검 완료: 결측치 ${missingFieldCount}건 | 60일주 총 글자수: ${totalChars.toLocaleString()}자 (평균 ${Math.round(totalChars/60)}자)\n`)

// 2. 일주 내(Intra) 섹션 간 문장 복붙 검사
console.log('--- 2. 일주 내부(Intra) 섹션 간 문장 복사-붙여넣기 검사 ---')

for (const code of expectedCodes) {
  const ilju = getEnhancedIljuDetail(code)
  const c = ilju.content

  const summarySentences = (c.summary || '').split(/[.?!]\s+/).map((s: string) => s.trim()).filter((s: string) => s.length > 20)
  const otherTexts = [
    c.structureNote,
    c.misconceptions,
    c.fields.career,
    c.fields.wealth,
    c.fields.love,
    ...c.faq.map((f: any) => f.q + ' ' + f.a)
  ].join(' ')

  for (const sent of summarySentences) {
    if (otherTexts.includes(sent)) {
      console.warn(`[일주 내부 문장 복붙] [${code}]: 요약문 문장이 다른 섹션에 그대로 중복됨: "${sent.slice(0, 50)}..."`)
      intraDuplicationCount++
    }
  }
}

console.log(`=> 일주 내부 문장 복사-붙여넣기 점검 완료: 총 ${intraDuplicationCount}건 발견\n`)

// 3. 일주 간(Inter) 문장 단위 복사-붙여넣기 전수 검사
console.log('--- 3. 일주 간(Inter) 문장 단위 복사-붙여넣기 전수 검사 ---')

const sajuSentenceMap = new Map<string, { code: string; field: string }>()

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

      if (sajuSentenceMap.has(sent)) {
        const prev = sajuSentenceMap.get(sent)!
        if (prev.code !== code) {
          console.warn(`[일주 간 문장 복붙] [${code}, ${block.field}] <-> [${prev.code}, ${prev.field}]: 동일 문장 발견!`)
          console.warn(`   중복 문장: "${sent}"`)
          interDuplicationCount++
        }
      } else {
        sajuSentenceMap.set(sent, { code, field: block.field })
      }
    }
  }
}

console.log(`=> 일주 간 문장 복사-붙여넣기 점검 완료: 총 ${interDuplicationCount}건 발견\n`)

console.log('================================================================')
console.log(`[사주 60일주 종합 결과] 결측치: ${missingFieldCount}건 | 내부 복붙: ${intraDuplicationCount}건 | 일주간 복붙: ${interDuplicationCount}건`)
console.log('================================================================\n')

