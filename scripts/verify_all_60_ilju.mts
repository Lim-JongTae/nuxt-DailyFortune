import { getEnhancedIljuDetail } from '../server/utils/saju/index'
import { SAJU_ILJU_DATA } from '../server/utils/sajuIljuData'

console.log('=== 60일주 고밀도 정통 해설 전수 무결성 검증 시작 ===\n')

let totalErrors = 0
let totalChars = 0
let minChars = Infinity
let maxChars = 0
let minCharIlju = ''
let maxCharIlju = ''

const expectedCodes = SAJU_ILJU_DATA.map(i => i.code)

if (expectedCodes.length !== 60) {
  console.error(`[ERROR] sajuIljuData length is not 60, got ${expectedCodes.length}`)
  totalErrors++
}

for (let i = 0; i < expectedCodes.length; i++) {
  const code = expectedCodes[i]
  const detail = getEnhancedIljuDetail(code)

  if (!detail) {
    console.error(`[ERROR] [${code}] Detail is null or undefined!`)
    totalErrors++
    continue
  }

  if (!detail.isEnhanced) {
    console.error(`[ERROR] [${code}] isEnhanced is not true!`)
    totalErrors++
  }

  if (detail.order !== i + 1) {
    console.error(`[ERROR] [${code}] Expected order ${i + 1}, got ${detail.order}`)
    totalErrors++
  }

  const c = detail.content
  if (!c) {
    console.error(`[ERROR] [${code}] content object is missing!`)
    totalErrors++
    continue
  }

  // 11대 섹션 무결성 검증
  if (!c.summary || c.summary.length < 50) {
    console.error(`[ERROR] [${code}] summary is too short or missing!`)
    totalErrors++
  }
  if (!c.structureNote || c.structureNote.length < 100) {
    console.error(`[ERROR] [${code}] structureNote is too short or missing!`)
    totalErrors++
  }
  if (!c.traits || !c.traits.strengths || c.traits.strengths.length < 2) {
    console.error(`[ERROR] [${code}] traits.strengths is invalid!`)
    totalErrors++
  }
  if (!c.traits.weaknesses || c.traits.weaknesses.length < 2) {
    console.error(`[ERROR] [${code}] traits.weaknesses is invalid!`)
    totalErrors++
  }
  if (!c.traits.scenes || c.traits.scenes.length !== 3) {
    console.error(`[ERROR] [${code}] traits.scenes must have exactly 3 items, got ${c.traits.scenes?.length}`)
    totalErrors++
  }

  if (!c.fields || !c.fields.career || !c.fields.wealth || !c.fields.love || !c.fields.health) {
    console.error(`[ERROR] [${code}] fields are missing required properties!`)
    totalErrors++
  }

  if (c.fields?.health && !c.fields.health.includes('전문 의료기관')) {
    console.error(`[ERROR] [${code}] health disclaimer is missing!`)
    totalErrors++
  }

  if (!c.seasonFlow || c.seasonFlow.length < 50) {
    console.error(`[ERROR] [${code}] seasonFlow is too short!`)
    totalErrors++
  }

  if (!c.compat || !c.compat.good || c.compat.good.length < 1 || !c.compat.clash || c.compat.clash.length < 1) {
    console.error(`[ERROR] [${code}] compat (good/clash) is incomplete!`)
    totalErrors++
  }

  if (!c.misconceptions || c.misconceptions.length < 30) {
    console.error(`[ERROR] [${code}] misconceptions is too short!`)
    totalErrors++
  }

  if (!c.faq || c.faq.length < 3) {
    console.error(`[ERROR] [${code}] faq must have at least 3 items, got ${c.faq?.length}`)
    totalErrors++
  }

  if (!c.sources || c.sources.length < 3) {
    console.error(`[ERROR] [${code}] sources must have at least 3 items, got ${c.sources?.length}`)
    totalErrors++
  }

  if (c.reviewedAt !== '2026-11-08') {
    console.error(`[ERROR] [${code}] reviewedAt must be '2026-11-08', got ${c.reviewedAt}`)
    totalErrors++
  }

  // 글자수 계산
  const fullText = [
    c.summary,
    c.structureNote,
    ...(c.traits.strengths || []),
    ...(c.traits.weaknesses || []),
    ...(c.traits.scenes || []),
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

  const charCount = fullText.length
  totalChars += charCount

  if (charCount < minChars) {
    minChars = charCount
    minCharIlju = `${detail.order}. ${detail.ganzhi} (${code})`
  }
  if (charCount > maxChars) {
    maxChars = charCount
    maxCharIlju = `${detail.order}. ${detail.ganzhi} (${code})`
  }

  // 금지어 검사
  if (fullText.includes('사주앱 동양철학 역학 연구팀 검수 완료')) {
    console.error(`[ERROR] [${code}] Found forbidden string: '사주앱 동양철학 역학 연구팀 검수 완료'`)
    totalErrors++
  }
}

console.log('----------------------------------------------------')
console.log(`검증 대상 일주 수: ${expectedCodes.length}개`)
console.log(`총 에러 건수: ${totalErrors}건`)
console.log(`전체 일주 총 글자수: ${totalChars.toLocaleString()}자`)
console.log(`일주당 평균 글자수: Math.round(${Math.round(totalChars / expectedCodes.length)}자)`)
console.log(`최소 글자수 일주: ${minCharIlju} -> ${minChars}자`)
console.log(`최대 글자수 일주: ${maxCharIlju} -> ${maxChars}자`)
console.log('----------------------------------------------------')

if (totalErrors === 0) {
  console.log('✅ [SUCCESS] 60개 전체 일주 데이터가 정통 명리학 기준 및 11대 스키마를 100% 완벽히 충족합니다!')
} else {
  console.error(`❌ [FAILURE] 총 ${totalErrors}개의 검증 오류가 발견되었습니다.`)
  process.exit(1)
}
