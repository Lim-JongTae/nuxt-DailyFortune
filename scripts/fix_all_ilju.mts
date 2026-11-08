import fs from 'node:fs'
import path from 'node:path'
import {
  calcIljuPair,
  getRecommendedGoodMatches,
  getRecommendedClashMatches,
  isBaekho,
  isGoegang,
  ALL_60_GANZHI,
  GANZHI_TO_CODE
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

// 1. 임상 질환명 및 민감 표현 완화 사전
const DISEASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/당뇨병|당뇨|대사증후군/g, '식습관 불균형과 신진대사 저하'],
  [/고혈압|저혈압/g, '혈행 순환과 혈압 안정'],
  [/심근경색|협심증|부정맥|심장마비/g, '가슴 답답함과 기혈 순환 불균형'],
  [/뇌졸중|뇌혈관 질환|뇌경색/g, '두부 순환과 과도한 신경 피로'],
  [/우울증|공황장애|불안장애/g, '과도한 심리적 스트레스와 무기력감'],
  [/불면증|만성 불면/g, '수면 리듬 불균형과 신경 예민'],
  [/간경화|간염|지방간/g, '과로로 인한 만성 피로와 간기(肝氣) 울체'],
  [/위궤양|십이지장궤양|역류성 식도염/g, '소화 기능 저하와 속쓰림'],
  [/신부전|신장 결석|방광염|비뇨기 질환/g, '하복부 순환 저하와 수분 대사 불균형'],
  [/갑상선 질환|갑상선 기능/g, '목 부위 긴장과 호르몬 리듬'],
  [/심장·방광/g, '화(火)와 수(水)의 기운'],
  [/심혈관계/g, '순환기 계통'],
  [/수족냉증/g, '손발 차가움'],
  [/하복부 질환/g, '아랫배 냉증'],
  [/안구 건조증/g, '눈의 피로감']
]

// 2. 단정 표현 순화 사전
const ABSOLUTE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/반드시 /g, '가급적 '],
  [/반드시,/g, '가급적,'],
  [/결코 우연이 아닙니다/g, '오랜 명리학적 임상 경험이 보여주는 귀중한 지혜입니다'],
  [/우연이 아닙니다/g, '깊은 명리학적 이치가 깃들어 있습니다'],
  [/절대 /g, '가급적 '],
  [/절대로 /g, '무리하게 하지 말고 ']
]

console.log('>>> 60일주 전수 데이터 정밀 교정 시작...')

for (const f of GROUP_FILES) {
  const filePath = path.join(SAJU_DIR, f)
  let content = fs.readFileSync(filePath, 'utf-8')

  // 1) 특정 일주 백호/괴강 오기 전수 교정
  if (f === 'iljuGroup1.ts') {
    // 을축(eul-chuk): 백호살 오기 삭제
    content = content.replace(
      /을축일주는 백호살\(白虎殺\)이나 곡각살\(曲脚殺\)이 있어/g,
      '을축일주는 곡각살(曲脚殺)이나 쇠지(衰地)의 기운이 있어'
    )
    content = content.replace(
      /'『명리정종\(命理正宗\)』 백호살 및 재관인 희기론'/g,
      "'『명리정종(命理正宗)』 재관인 희기론'"
    )

    // 무진(mu-jin): 괴강살 오기 삭제 (무진은 백호임, 괴강 아님)
    content = content.replace(
      /백호\(白虎\)와 괴강\(魁罡\)의 막강한 기백/g,
      '백호대살(白虎大殺)의 웅장한 기백'
    )
    content = content.replace(
      /백호대살\(白虎大殺\)과 괴강\(魁罡\)이 있어/g,
      '백호대살(白虎大殺)의 기운이 있어'
    )
    content = content.replace(
      /하지만 백호와 괴강은 현대 사회에서/g,
      '하지만 백호대살은 현대 사회에서'
    )
    content = content.replace(
      /'『연해자평\(淵海子平\)』 백호관대 및 괴강격 심층론'/g,
      "'『연해자평(淵海子平)』 백호관대 및 관인상생론'"
    )
  }

  if (f === 'iljuGroup2.ts') {
    // 갑술(gap-sul): 백호살 오기 삭제
    content = content.replace(
      /내면에는 백호\(白虎\)의 폭발적인 기백과/g,
      '내면에는 편재(偏財)의 폭발적인 기백과'
    )
    content = content.replace(
      /백호살의 기운을 내재/g,
      '편재의 기운을 내재'
    )

    // 경진(gyeong-jin): 백호살 오기 삭제 (경진은 괴강임, 백호 아님)
    content = content.replace(
      /백호와 괴강의 서슬 퍼런 카리스마/g,
      '괴강(魁罡)의 서슬 퍼런 카리스마'
    )
    content = content.replace(
      /백호살과 괴강/g,
      '괴강살'
    )

    // 임진(im-jin): 백호살 오기 삭제 (임진은 괴강임, 백호 아님)
    content = content.replace(
      /괴강살과 백호살을 동시에 놓아/g,
      '괴강살(魁罡殺)의 강력한 기운을 놓아'
    )
    content = content.replace(
      /괴강과 백호의/g,
      '괴강의'
    )

    // 계미(gye-mi): "백호에 준하는" 모호한 표현 교정
    content = content.replace(
      /백호에 준하는/g,
      '편관의 서슬 퍼런'
    )
  }

  if (f === 'iljuGroup3.ts') {
    // 경인(gyeong-in): 백수의 제왕 백호 -> 호랑이
    content = content.replace(
      /백수의 제왕 백호/g,
      '용맹한 숲속의 제왕 호랑이'
    )
  }

  if (f === 'iljuGroup6.ts') {
    // 병진(byeong-jin): "백호에 준하는" 모호한 표현 교정
    content = content.replace(
      /백호에 준하는/g,
      '일지 관대(冠帶)의 당당한'
    )

    // 계해(gye-hae): 납음(대해수, 大海水) 누락 보충
    if (!content.includes('대해수') && content.includes('60: {')) {
      content = content.replace(
        /(structureNote: '천간 계수\(癸水\)는[^']+)(',)/,
        "$1 납음오행은 대해수(大海水)로 모든 냇물을 수용하는 거대한 대양의 깊은 포용력과 끝없는 지혜를 나타냅니다.$2"
      )
    }
  }

  // 2) 궁합 천간 쌍 4개 오류 전수 교정
  // 신사 ↔ 정해
  content = content.replace(/천간에서는 정계충, 지지에서는 사해충/g, '천간에서는 정신극(丁辛剋), 지지에서는 사해충(巳亥沖)')
  // 신축 ↔ 정미
  content = content.replace(/천간에서는 정계극, 지지에서는 축미충/g, '천간에서는 정신극(丁辛剋), 지지에서는 축미충(丑未沖)')
  // 기유 ↔ 신묘
  content = content.replace(/천간에서는 을신충, 지지에서는 묘유충/g, '천간에서는 기토와 신금의 상생 흐름이나 지지에서는 묘유충(卯酉沖)')
  // 신유 ↔ 정묘
  content = content.replace(/천간에서는 정계충, 지지에서는 묘유충/g, '천간에서는 정신극(丁辛剋), 지지에서는 묘유충(卯酉沖)')

  // 3) 천극지충 21건 전수 교정:
  // "천간에서는 [무임극|갑무극|갑기극|을기극|을무극|병경극|병신극|정신극|정경극|무계극|기계극|경갑극|경을극|신을극|신갑극|임병극|임정극|계정극|계병극][^,]+, 지지에서는 [^일]+이 일어나는 천충지충\(天沖地沖\)"
  // -> "천극지충(天剋地沖)"으로 전수 교정!
  content = content.replace(
    /(천간에서는 [^,]+극[^,]+, 지지에서는 [^이]+이 일어나는 )천충지충\(天沖地沖\)/g,
    '$1천극지충(天剋地沖)'
  )

  // 4) 임상 질환명 완화 전수 적용
  for (const [re, rep] of DISEASE_REPLACEMENTS) {
    content = content.replace(re, rep)
  }

  // 5) 단정 표현 순화
  for (const [re, rep] of ABSOLUTE_REPLACEMENTS) {
    content = content.replace(re, rep)
  }

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`√ Updated ${f}`)
}

console.log('>>> 1차 텍스트 정밀 교정 완료. 이제 60일주 compat(good & clash) 전수 수학적 재선출 진행...')

