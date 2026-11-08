import {
  BAEKHO_LIST,
  GOEGANG_LIST,
  ALL_60_GANZHI,
  calcIljuPair,
  BRANCH_CHUNG,
  BRANCH_WONJIN,
  BRANCH_HAE,
  STEM_CHUNG
} from '../server/utils/saju/calcIlju.js'
import { enhancedIljuMap } from '../server/utils/saju/index.js'

console.log('====================================================')
console.log('🚀 60일주 전수 정밀 학술 검증 시작')
console.log('====================================================\n')

let errors = 0
let warnings = 0

// 1. 60개 일주 완비 검사
const loadedCodes = Object.keys(enhancedIljuMap)
console.log(`[1] 60일주 로드 수량: ${loadedCodes.length} / 60`)
if (loadedCodes.length !== 60) {
  console.error(`❌ 누락된 일주가 있습니다! 로드된 수: ${loadedCodes.length}`)
  errors++
} else {
  console.log(`✅ 60일주 100% 완전 로드 확인`)
}

// 검사 대상 질환명 목록
const DISEASE_TERMS = [
  '당뇨', '고혈압', '저혈압', '심근경색', '협심증', '부정맥', '심장마비',
  '뇌졸중', '뇌혈관', '우울증', '공황장애', '불안장애', '불면증',
  '간경화', '간염', '지방간', '위궤양', '십이지장궤양', '역류성 식도염',
  '신부전', '신장 결석', '방광염', '갑상선'
]

// 2. 일주별 개별 검증
for (const code of loadedCodes) {
  const ilju = enhancedIljuMap[code]
  const ganzhi = ilju.ganzhi

  // A. 백호살 검증: 백호 7대 일주가 아닌데 백호살이 언급되었는가?
  const fullText = JSON.stringify(ilju.content)
  const isTargetBaekho = BAEKHO_LIST.includes(ganzhi)
  if (!isTargetBaekho && fullText.includes('백호살')) {
    console.error(`❌ [${ganzhi}] 백호대살 일주가 아닌데 백호살 언급 발견!`)
    errors++
  }

  // B. 괴강살 검증: 괴강 4대 일주가 아닌데 괴강살이 언급되었는가?
  const isTargetGoegang = GOEGANG_LIST.includes(ganzhi)
  if (!isTargetGoegang && fullText.includes('괴강')) {
    console.error(`❌ [${ganzhi}] 괴강살 일주가 아닌데 괴강 언급 발견!`)
    errors++
  }

  // C. 무진일주 특별 검증: 괴강이 절대 없어야 함
  if (ganzhi === '무진' && fullText.includes('괴강')) {
    console.error(`❌ [무진] 괴강살 언급이 아직 남아있습니다!`)
    errors++
  }

  // D. 궁합 good 검증: 충, 원진, 해, 천간충이 들어있는가?
  for (const goodItem of ilju.content.compat.good) {
    const otherGanzhi = goodItem.name.slice(0, 2)
    const rel = calcIljuPair(ganzhi, otherGanzhi)

    if (BRANCH_CHUNG[ganzhi[1]] === otherGanzhi[1]) {
      console.error(`❌ [${ganzhi}] good 궁합에 지지충(${otherGanzhi}) 발견!`)
      errors++
    }
    if (BRANCH_WONJIN[ganzhi[1]] === otherGanzhi[1]) {
      console.error(`❌ [${ganzhi}] good 궁합에 지지원진(${otherGanzhi}) 발견!`)
      errors++
    }
    if (BRANCH_HAE[ganzhi[1]] === otherGanzhi[1]) {
      console.error(`❌ [${ganzhi}] good 궁합에 지지해(${otherGanzhi}) 발견!`)
      errors++
    }
    if (STEM_CHUNG[ganzhi[0]] === otherGanzhi[0]) {
      console.error(`❌ [${ganzhi}] good 궁합에 천간충(${otherGanzhi}) 발견!`)
      errors++
    }
  }

  // E. 궁합 clash 검증: 천극지충인데 천충지충으로 오기되었는가?
  for (const clashItem of ilju.content.compat.clash) {
    const otherGanzhi = clashItem.name.slice(0, 2)
    const rel = calcIljuPair(ganzhi, otherGanzhi)
    if (rel.isCheongeukJichung && clashItem.reason.includes('천충지충')) {
      console.error(`❌ [${ganzhi} ↔ ${otherGanzhi}] 천극지충인데 천충지충으로 표기됨!`)
      errors++
    }
  }

  // F. 건강 항목 임상 질환명 검사
  for (const disease of DISEASE_TERMS) {
    if (ilju.content.fields.health.includes(disease)) {
      console.warn(`⚠️ [${ganzhi}] 건강 항목에 질환명 '${disease}' 발견!`)
      warnings++
    }
  }

  // G. 단정 표현 ("반드시", "절대", "우연이 아닙니다") 횟수 검사
  const absoluteMatches = fullText.match(/반드시|절대|우연이 아닙니다/g) || []
  if (absoluteMatches.length >= 4) {
    console.warn(`⚠️ [${ganzhi}] 단정 표현 4회 이상 검출: ${absoluteMatches.length}회`)
    warnings++
  }

  // H. 계해일주 납음(대해수) 검사
  if (ganzhi === '계해' && !ilju.content.structureNote.includes('대해수')) {
    console.error(`❌ [계해] 납음오행 대해수(大海水) 서술 누락!`)
    errors++
  }
}

console.log('\n====================================================')
console.log(`📊 전수 검증 결과 보고: 에러 ${errors}건, 경고 ${warnings}건`)
console.log('====================================================')

if (errors === 0 && warnings === 0) {
  console.log('🎉 모든 60일주 페이지가 100% 정통 학술 및 애드센스 품질 기준을 통과했습니다!')
}

