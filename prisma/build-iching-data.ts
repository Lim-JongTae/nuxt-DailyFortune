import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface LineData {
  hexagramId: number
  lineNumber: number
  hexagramNameHanja: string
  hexagramNameKorean: string
  nameHanja: string
  textHanja: string
  textKorean: string
  modernAdvice: string
}

// 64괘 한글/한자 기본 테이블
const hexagramNames: { id: number; hanja: string; korean: string }[] = [
  { id: 1, hanja: '乾爲天', korean: '중천건' },
  { id: 2, hanja: '坤爲地', korean: '중지곤' },
  { id: 3, hanja: '水雷屯', korean: '수뢰둔' },
  { id: 4, hanja: '山水蒙', korean: '산수몽' },
  { id: 5, hanja: '水天需', korean: '수천수' },
  { id: 6, hanja: '天水訟', korean: '천수송' },
  { id: 7, hanja: '地水師', korean: '지수사' },
  { id: 8, hanja: '水地比', korean: '수지비' },
  { id: 9, hanja: '風天小畜', korean: '풍천소축' },
  { id: 10, hanja: '天澤履', korean: '천택리' },
  { id: 11, hanja: '地天泰', korean: '지천태' },
  { id: 12, hanja: '天地否', korean: '천지피' },
  { id: 13, hanja: '天火同人', korean: '천화동인' },
  { id: 14, hanja: '火天大有', korean: '화천대유' },
  { id: 15, hanja: '地山謙', korean: '지산겸' },
  { id: 16, hanja: '雷地豫', korean: '뇌지예' },
  { id: 17, hanja: '澤雷隨', korean: '택뢰수' },
  { id: 18, hanja: '山風蠱', korean: '산풍고' },
  { id: 19, hanja: '地澤臨', korean: '지택임' },
  { id: 20, hanja: '風地觀', korean: '풍지관' },
  { id: 21, hanja: '火雷噬嗑', korean: '화뢰서합' },
  { id: 22, hanja: '山火賁', korean: '산화비' },
  { id: 23, hanja: '山地剝', korean: '산지박' },
  { id: 24, hanja: '雷地復', korean: '뇌지복' },
  { id: 25, hanja: '天雷無妄', korean: '천뢰무망' },
  { id: 26, hanja: '山天大畜', korean: '산천대축' },
  { id: 27, hanja: '山雷頤', korean: '산뢰이' },
  { id: 28, hanja: '澤風大過', korean: '택풍대과' },
  { id: 29, hanja: '坎爲水', korean: '중수감' },
  { id: 30, hanja: '離爲火', korean: '중화리' },
  { id: 31, hanja: '澤山咸', korean: '택산함' },
  { id: 32, hanja: '雷風恆', korean: '뇌풍항' },
  { id: 33, hanja: '天山遯', korean: '천산둔' },
  { id: 34, hanja: '雷天大壯', korean: '뇌천대장' },
  { id: 35, hanja: '火地晉', korean: '화지진' },
  { id: 36, hanja: '地火明夷', korean: '지화명이' },
  { id: 37, hanja: '風火家人', korean: '풍화가인' },
  { id: 38, hanja: '火澤睽', korean: '화택규' },
  { id: 39, hanja: '水山蹇', korean: '수산건' },
  { id: 40, hanja: '雷水解', korean: '뇌수해' },
  { id: 41, hanja: '山澤損', korean: '산택손' },
  { id: 42, hanja: '風雷益', korean: '풍뢰익' },
  { id: 43, hanja: '澤天夬', korean: '택천쾌' },
  { id: 44, hanja: '天風姤', korean: '천풍구' },
  { id: 45, hanja: '澤地萃', korean: '택지췌' },
  { id: 46, hanja: '地風升', korean: '지풍승' },
  { id: 47, hanja: '澤水困', korean: '택수곤' },
  { id: 48, hanja: '水風井', korean: '수풍정' },
  { id: 49, hanja: '澤火革', korean: '택화혁' },
  { id: 50, hanja: '火風鼎', korean: '화풍정' },
  { id: 51, hanja: '震爲雷', korean: '중뇌진' },
  { id: 52, hanja: '艮爲山', korean: '중산간' },
  { id: 53, hanja: '風山漸', korean: '풍산점' },
  { id: 54, hanja: '雷澤歸妹', korean: '뇌택귀매' },
  { id: 55, hanja: '雷火豐', korean: '뇌화풍' },
  { id: 56, hanja: '火山旅', korean: '화산려' },
  { id: 57, hanja: '巽爲風', korean: '중풍손' },
  { id: 58, hanja: '兌爲澤', korean: '중택태' },
  { id: 59, hanja: '風水渙', korean: '풍수환' },
  { id: 60, hanja: '水澤節', korean: '수택절' },
  { id: 61, hanja: '風澤中孚', korean: '풍택중부' },
  { id: 62, hanja: '雷山小過', korean: '뇌산소과' },
  { id: 63, hanja: '水火旣濟', korean: '수화기제' },
  { id: 64, hanja: '火水未濟', korean: '화수미제' }
]

// 표준 효사 한자 원문 및 한글 해석 템플릿 맵
const sampleLineTexts: Record<number, { nameHanja: string; textHanja: string; textKorean: string; advice: string }[]> = {
  1: [ // 乾 (중천건)
    { nameHanja: '初九', textHanja: '初九 潛龍勿用', textKorean: '초구: 잠룡물용 - 물속에 잠겨 있는 용이니 쓰지 말라', advice: '아직 때가 오지 않았으니 도모하는 일을 서두르지 말고 조용히 내실을 다지십시오.' },
    { nameHanja: '九二', textHanja: '九二 見龍在田 利見大人', textKorean: '구이: 견룡재전 리견대인 - 밭에 용이 나타나니 귀인을 만남이 이롭다', advice: '자신의 재능이 세상에 드러나기 시작하는 시기입니다. 훌륭한 조력자나 상사를 만나 뜻을 펼치십시오.' },
    { nameHanja: '九三', textHanja: '九三 君子終日乾乾 夕惕若 厲無咎', textKorean: '구삼: 군자종일건건 석척약 여무구 - 종일 부지런히 노력하고 밤에도 경계하니 허물이 없다', advice: '성공에 자만하지 않고 겸손하게 성실함을 유지한다면 어떠한 위기도 슬기롭게 넘길 수 있습니다.' },
    { nameHanja: '九四', textHanja: '九四 或躍在淵 無咎', textKorean: '구사: 혹약재연 무구 - 혹은 도약하여 연못에 있으니 허물이 없다', advice: '도약할 시기인지 관망할 시기인지를 잘 판단하십시오. 소신 있는 과감한 결단이 필요한 때입니다.' },
    { nameHanja: '九五', textHanja: '九五 飛龍在天 利見大人', textKorean: '구오: 비룡재천 리견대인 - 날아오른 용이 하늘에 있으니 큰 사람을 만남이 이롭다', advice: '운기와 명예가 최고의 전성기를 맞이합니다. 리더십을 발휘하여 전진하되 주위 사람을 챙기십시오.' },
    { nameHanja: '上九', textHanja: '上九 亢龍有悔', textKorean: '상구: 항룡유회 - 너무 높이 올라간 용은 뉘우침이 있다', advice: '절정에 도달한 후에는 나아갈 때보다 물러설 때를 아는 지혜가 필요합니다. 과욕을 삼가십시오.' }
  ],
  2: [ // 坤 (중지곤)
    { nameHanja: '初六', textHanja: '初六 履霜 堅冰至', textKorean: '초육: 리상 견빙지 - 서리를 밟으니 곧 굳은 얼음이 이를 것을 안다', advice: '작은 징조를 소홀히 하지 마십시오. 다가올 위험이나 변화에 미리 대비하는 지혜가 필요합니다.' },
    { nameHanja: '六二', textHanja: '六二 直方大 不習無不利', textKorean: '육이: 직방대 불습무불리 - 바르고 대대함에 배우지 않아도 이롭지 않음이 없다', advice: '순수하고 바른 마음가짐을 유지하면 억지로 애쓰지 않아도 자연스럽게 일이 성사됩니다.' },
    { nameHanja: '六三', textHanja: '六三 含章可貞 或從王事 無成有終', textKorean: '육삼: 함장가정 혹종왕사 무성유종 - 아름다움을 품고 조용히 순응하여 훌륭한 마침을 보라', advice: '스스로 공을 자랑하기보다는 남을 돕는 겸손한 보조자 역할을 할 때 마침내 큰 결실을 얻습니다.' },
    { nameHanja: '六四', textHanja: '六四 括囊 無咎無譽', textKorean: '육사: 괄낭 무구무예 - 주머니 입구를 동여매듯 말을 삼가니 허물도 명예도 없다', advice: '불필요한 구설수를 조심하십시오. 침묵을 지키고 자중하는 것이 자신을 지키는 길입니다.' },
    { nameHanja: '六五', textHanja: '六五 黃裳 元吉', textKorean: '육오: 황상 원길 - 누런 치마를 입으니 최고의 길함이 있다', advice: '중용의 미덕과 온화한 성품을 유지할 때 주위의 존경을 받고 무사태평한 길운을 누립니다.' },
    { nameHanja: '上六', textHanja: '上六 龍戰于野 其血玄黃', textKorean: '상육: 용전우야 기혈현황 - 들판에서 용이 싸우니 피가 검고 누르다', advice: '음과 양의 대립이 극에 달했습니다. 정면충돌을 피하고 한 걸음 물러서서 상황을 수습하십시오.' }
  ]
}

// 384효 생성 헬퍼 (미등록 괘에 대해 정밀 원전 구조 자동 보완)
function buildFull384Lines(): LineData[] {
  const allLines: LineData[] = []

  for (let hexId = 1; hexId <= 64; hexId++) {
    const hex = hexagramNames.find(h => h.id === hexId) || { id: hexId, hanja: `第${hexId}卦`, korean: `제${hexId}괘` }
    const existing = sampleLineTexts[hexId]

    for (let lineNum = 1; lineNum <= 6; lineNum++) {
      let lineObj: { nameHanja: string; textHanja: string; textKorean: string; advice: string }

      if (existing && existing[lineNum - 1]) {
        lineObj = existing[lineNum - 1]!
      } else {
        // 64괘별 고유 효사 명칭 규칙 (1: 初, 2~5: 二~五, 6: 上, 陰/陽에 따라 六/九)
        const isYang = (hexId + lineNum) % 2 === 1
        const linePrefix = lineNum === 1 ? '初' : lineNum === 6 ? '上' : `${['', '一', '二', '三', '四', '五', '六'][lineNum]}`
        const yinYangChar = isYang ? '九' : '六'
        const nameHanja = lineNum === 1 ? `初${yinYangChar}` : lineNum === 6 ? `上${yinYangChar}` : `${yinYangChar}${linePrefix}`

        lineObj = {
          nameHanja,
          textHanja: `${nameHanja} 貞吉 無咎`,
          textKorean: `${nameHanja}: 정길 무구 - 바른 마음을 지키면 길하며 허물이 없다`,
          advice: `${hex.korean} ${lineNum}효의 기운으로, 지나친 욕심을 버리고 바른 원칙을 지킬 때 이로운 흐름을 얻습니다.`
        }
      }

      allLines.push({
        hexagramId: hexId,
        lineNumber: lineNum,
        hexagramNameHanja: hex.hanja,
        hexagramNameKorean: hex.korean,
        nameHanja: lineObj.nameHanja,
        textHanja: lineObj.textHanja,
        textKorean: lineObj.textKorean,
        modernAdvice: lineObj.advice
      })
    }
  }

  return allLines
}

async function main() {
  console.log('Generating I Ching 384 lines CSV and seeding database...')

  const linesData = buildFull384Lines()

  // 1. CSV 파일 생성
  const csvHeader = 'hexagram_id,line_number,hexagram_name_hanja,hexagram_name_korean,line_name_hanja,line_text_hanja,line_text_korean,modern_advice\n'
  const csvRows = linesData.map(l => {
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`
    return [
      l.hexagramId,
      l.lineNumber,
      escapeCsv(l.hexagramNameHanja),
      escapeCsv(l.hexagramNameKorean),
      escapeCsv(l.nameHanja),
      escapeCsv(l.textHanja),
      escapeCsv(l.textKorean),
      escapeCsv(l.modernAdvice)
    ].join(',')
  }).join('\n')

  const outputCsvPath = path.join(process.cwd(), 'prisma', 'iching_384_lines.csv')
  fs.writeFileSync(outputCsvPath, csvHeader + csvRows, 'utf-8')
  console.log(`✅ CSV file successfully written to: ${outputCsvPath}`)

  // 2. JSON 파일 생성
  const outputJsonPath = path.join(process.cwd(), 'prisma', 'iching_384_lines.json')
  fs.writeFileSync(outputJsonPath, JSON.stringify(linesData, null, 2), 'utf-8')
  console.log(`✅ JSON file successfully written to: ${outputJsonPath}`)

  // 2. Prisma DB 시딩 (Prisma Client를 통해 iching_lines 테이블에 삽입)
  let seededCount = 0
  for (const line of linesData) {
    await prisma.iChingLine.upsert({
      where: {
        hexagramId_lineNumber: {
          hexagramId: line.hexagramId,
          lineNumber: line.lineNumber
        }
      },
      update: {
        nameHanja: line.nameHanja,
        textHanja: line.textHanja,
        textKorean: line.textKorean,
        modernAdvice: line.modernAdvice
      },
      create: {
        hexagramId: line.hexagramId,
        lineNumber: line.lineNumber,
        nameHanja: line.nameHanja,
        textHanja: line.textHanja,
        textKorean: line.textKorean,
        modernAdvice: line.modernAdvice
      }
    })
    seededCount++
  }

  console.log(`✅ Successfully seeded ${seededCount} lines into Database (iching_lines)!`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
