import { getEnhancedHexagramDetail } from '../server/utils/iching/index'

console.log('================================================================')
console.log('       [주역 64괘] 복사-붙여넣기 및 내용 누락 정밀 전수 검증       ')
console.log('================================================================\n')

let missingFieldCount = 0
let intraDuplicationCount = 0
let interDuplicationCount = 0
let thinAdviceCount = 0

// 1. 내용 누락 및 길이 검사
console.log('--- 1. 각 필드별 내용 누락 및 유효성 전수 검사 ---')

for (let id = 1; id <= 64; id++) {
  const hex = getEnhancedHexagramDetail(id)
  if (!hex || !hex.content) {
    console.error(`[CRITICAL] 제${id}괘: hex 또는 content 데이터가 완전히 누락되었습니다.`)
    missingFieldCount++
    continue
  }

  const c = hex.content

  // 주요 텍스트 필드 검사
  if (!c.summary || c.summary.length < 80) {
    console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): summary가 누락되었거나 너무 짧습니다. (${c.summary?.length || 0}자)`)
    missingFieldCount++
  }
  if (!c.structureNote || c.structureNote.length < 100) {
    console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): structureNote가 누락되었거나 너무 짧습니다. (${c.structureNote?.length || 0}자)`)
    missingFieldCount++
  }

  // 4대 분야 검사
  const fields = ['career', 'wealth', 'love', 'health'] as const
  for (const f of fields) {
    const val = c.fields?.[f]
    if (!val || val.length < 50) {
      console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): fields.${f}가 누락되었거나 너무 짧습니다. (${val?.length || 0}자)`)
      missingFieldCount++
    }
  }

  // 6효 검사
  if (!c.lines || c.lines.length !== 6) {
    console.error(`[누락] 제${id}괘(${hex.nameKorean}): 6효 데이터의 개수가 6이 아닙니다. (${c.lines?.length || 0}개)`)
    missingFieldCount++
  } else {
    for (let l = 0; l < 6; l++) {
      const line = c.lines[l]
      if (!line.nameHanja) { console.error(`[누락] 제${id}괘 효${l+1}: nameHanja 누락`); missingFieldCount++ }
      if (!line.nameKorean) { console.error(`[누락] 제${id}괘 효${l+1}: nameKorean 누락`); missingFieldCount++ }
      if (!line.textHanja) { console.error(`[누락] 제${id}괘 효${l+1}: textHanja 누락`); missingFieldCount++ }
      if (!line.textKorean) { console.error(`[누락] 제${id}괘 효${l+1}: textKorean 누락`); missingFieldCount++ }
      if (!line.traditionalInterp) { console.error(`[누락] 제${id}괘 효${l+1}: traditionalInterp 누락`); missingFieldCount++ }
      if (!line.scene || line.scene.length < 15) {
        console.error(`[누락/미흡] 제${id}괘 효${l+1}: scene이 너무 짧습니다. (${line.scene?.length || 0}자)`);
        missingFieldCount++
      }
      if (!line.modernAdvice || line.modernAdvice.length < 50) {
        console.error(`[누락/미흡] 제${id}괘 효${l+1}: modernAdvice가 누락되었거나 너무 짧습니다. (${line.modernAdvice?.length || 0}자)`);
        missingFieldCount++
      } else if (line.modernAdvice.length < 150) {
        thinAdviceCount++
      }
    }
  }

  // idioms, compareWith, misconceptions, faq, sources
  if (!c.idioms || c.idioms.length < 2) {
    console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): idioms 개수 부족 (${c.idioms?.length || 0}개)`); missingFieldCount++
  }
  if (!c.compareWith || c.compareWith.length < 1) {
    console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): compareWith 부족 (${c.compareWith?.length || 0}개)`); missingFieldCount++
  }
  if (!c.misconceptions || c.misconceptions.length < 40) {
    console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): misconceptions 너무 짧음 (${c.misconceptions?.length || 0}자)`); missingFieldCount++
  }
  if (!c.faq || c.faq.length < 3) {
    console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): faq 부족 (${c.faq?.length || 0}개)`); missingFieldCount++
  }
  if (!c.sources || c.sources.length < 3) {
    console.error(`[누락/미흡] 제${id}괘(${hex.nameKorean}): sources 부족 (${c.sources?.length || 0}개)`); missingFieldCount++
  }
}

console.log(`=> 내용 누락 점검 완료: 총 결측치 ${missingFieldCount}건, 권장 분량 미달(150자 미만) 조언 ${thinAdviceCount}건\n`)

// 2. 괘 내(Intra) 복사-붙여넣기 검사 (문장 단위)
console.log('--- 2. 괘 내부(Intra) 섹션 간 문장 복사-붙여넣기 검사 ---')

for (let id = 1; id <= 64; id++) {
  const hex = getEnhancedHexagramDetail(id)
  const c = hex.content

  // 주요 텍스트 쪼개기
  const summarySentences = (c.summary || '').split(/[.?!]\s+/).map((s: string) => s.trim()).filter((s: string) => s.length > 20)
  const otherTexts = [
    c.structureNote,
    c.misconceptions,
    ...c.faq.map((f: any) => f.q + ' ' + f.a),
    ...c.idioms.map((i: any) => i.note)
  ].join(' ')

  for (const sent of summarySentences) {
    if (otherTexts.includes(sent)) {
      console.warn(`[괘 내부 문장 복붙] 제${id}괘(${hex.nameKorean}): 요약문 문장이 다른 섹션에 그대로 중복됨: "${sent.slice(0, 50)}..."`)
      intraDuplicationCount++
    }
  }
}

console.log(`=> 괘 내부 문장 복사-붙여넣기 점검 완료: 총 ${intraDuplicationCount}건 발견\n`)

// 3. 괘 간(Inter) 복사-붙여넣기 검사
console.log('--- 3. 괘 간(Inter) 문장 단위 복사-붙여넣기 전수 검사 ---')

const sentenceMap = new Map<string, { id: number; field: string }>()

for (let id = 1; id <= 64; id++) {
  const hex = getEnhancedHexagramDetail(id)
  const c = hex.content

  const textBlocks: Array<{ field: string; text: string }> = [
    { field: 'summary', text: c.summary || '' },
    { field: 'structureNote', text: c.structureNote || '' },
    { field: 'career', text: c.fields?.career || '' },
    { field: 'wealth', text: c.fields?.wealth || '' },
    { field: 'love', text: c.fields?.love || '' },
    { field: 'misconceptions', text: c.misconceptions || '' },
    ...c.lines.map((l: any, idx: number) => ({ field: `line${idx+1}.advice`, text: l.modernAdvice || '' })),
    ...c.faq.map((f: any, idx: number) => ({ field: `faq${idx+1}.a`, text: f.a || '' }))
  ]

  for (const block of textBlocks) {
    const sentences = block.text.split(/[.?!]\s+/).map(s => s.trim()).filter(s => s.length > 25)
    for (const sent of sentences) {
      // 일반적인 면책 문구 및 주역 공통 용어는 제외
      if (sent.includes('전문 의료기관') || sent.includes('상징적 풀이') || sent.includes('전통 동양철학')) continue

      if (sentenceMap.has(sent)) {
        const prev = sentenceMap.get(sent)!
        if (prev.id !== id) {
          console.warn(`[괘 간 문장 복붙] 제${id}괘(${hex.nameKorean}, ${block.field}) <-> 제${prev.id}괘(${prev.field}): 동일 문장 발견!`)
          console.warn(`   중복 문장: "${sent}"`)
          interDuplicationCount++
        }
      } else {
        sentenceMap.set(sent, { id, field: block.field })
      }
    }
  }
}

console.log(`=> 괘 간 문장 복사-붙여넣기 점검 완료: 총 ${interDuplicationCount}건 발견\n`)

console.log('================================================================')
console.log(`[주역 64괘 종합 결과] 결측치: ${missingFieldCount}건 | 내부 복붙: ${intraDuplicationCount}건 | 괘간 복붙: ${interDuplicationCount}건`)
console.log('================================================================\n')

