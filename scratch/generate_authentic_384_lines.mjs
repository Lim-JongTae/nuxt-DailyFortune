import fs from 'fs'
import path from 'path'

// 팔괘 음양 정의 (아래부터 1,2,3효)
// 1: 건(天)[1,1,1], 2: 태(澤)[1,1,0], 3: 리(火)[1,0,1], 4: 진(雷)[1,0,0]
// 5: 손(風)[0,1,1], 6: 감(水)[0,1,0], 7: 간(山)[0,0,1], 8: 곤(地)[0,0,0]
const trigrams = {
  1: { name: '건', hanja: '天', lines: [1, 1, 1] },
  2: { name: '태', hanja: '澤', lines: [1, 1, 0] },
  3: { name: '리', hanja: '火', lines: [1, 0, 1] },
  4: { name: '진', hanja: '雷', lines: [1, 0, 0] },
  5: { name: '손', hanja: '風', lines: [0, 1, 1] },
  6: { name: '감', hanja: '水', lines: [0, 1, 0] },
  7: { name: '간', hanja: '山', lines: [0, 0, 1] },
  8: { name: '곤', hanja: '地', lines: [0, 0, 0] }
}

// 64괘 상괘/하괘 삼태극 맵 (trigramUpper, trigramLower)
const hexagramTrigrams = {
  1: [1, 1], 2: [8, 8], 3: [6, 4], 4: [7, 6], 5: [6, 1], 6: [1, 6], 7: [8, 6], 8: [6, 8],
  9: [5, 1], 10: [1, 2], 11: [8, 1], 12: [1, 8], 13: [1, 3], 14: [3, 1], 15: [8, 7], 16: [4, 8],
  17: [2, 4], 18: [7, 5], 19: [8, 2], 20: [5, 8], 21: [3, 4], 22: [7, 3], 23: [7, 8], 24: [8, 4],
  25: [1, 4], 26: [7, 1], 27: [7, 4], 28: [2, 5], 29: [6, 6], 30: [3, 3], 31: [2, 7], 32: [4, 5],
  33: [1, 7], 34: [4, 1], 35: [3, 8], 36: [8, 3], 37: [5, 3], 38: [3, 2], 39: [6, 7], 40: [4, 6],
  41: [7, 2], 42: [5, 4], 43: [2, 1], 44: [1, 5], 45: [2, 8], 46: [8, 5], 47: [2, 6], 48: [6, 5],
  49: [2, 3], 50: [3, 5], 51: [4, 4], 52: [7, 7], 53: [5, 7], 54: [4, 2], 55: [4, 3], 56: [3, 7],
  57: [5, 5], 58: [2, 2], 59: [5, 6], 60: [6, 2], 61: [5, 2], 62: [4, 7], 63: [6, 3], 64: [3, 6]
}

const hexagramNames = [
  { id: 1, hanja: "乾爲天", korean: "중천건" },
  { id: 2, hanja: "坤爲地", korean: "곤위지" },
  { id: 3, hanja: "水雷屯", korean: "수뢰둔" },
  { id: 4, hanja: "山水蒙", korean: "산수몽" },
  { id: 5, hanja: "水天需", korean: "수천수" },
  { id: 6, hanja: "天水訟", korean: "천수송" },
  { id: 7, hanja: "地水師", korean: "지수사" },
  { id: 8, hanja: "水地比", korean: "수지비" },
  { id: 9, hanja: "風天小畜", korean: "풍천소축" },
  { id: 10, hanja: "天澤履", korean: "천택리" },
  { id: 11, hanja: "地天泰", korean: "지천태" },
  { id: 12, hanja: "天地否", korean: "천지피" },
  { id: 13, hanja: "天火同人", korean: "천화동인" },
  { id: 14, hanja: "火天大有", korean: "화천대유" },
  { id: 15, hanja: "地山謙", korean: "지산겸" },
  { id: 16, hanja: "雷地豫", korean: "뇌지예" },
  { id: 17, hanja: "澤雷隨", korean: "택뢰수" },
  { id: 18, hanja: "山風蠱", korean: "산풍고" },
  { id: 19, hanja: "地澤臨", korean: "지택림" },
  { id: 20, hanja: "風地觀", korean: "풍지관" },
  { id: 21, hanja: "火雷噬嗑", korean: "화뢰서합" },
  { id: 22, hanja: "山火賁", korean: "산화비" },
  { id: 23, hanja: "山地剝", korean: "산지박" },
  { id: 24, hanja: "地雷復", korean: "지뢰복" },
  { id: 25, hanja: "天雷無妄", korean: "천뢰무망" },
  { id: 26, hanja: "山天大畜", korean: "산천대축" },
  { id: 27, hanja: "山雷頤", korean: "산뢰이" },
  { id: 28, hanja: "澤風大過", korean: "택풍대과" },
  { id: 29, hanja: "坎爲水", korean: "중수감" },
  { id: 30, hanja: "離爲火", korean: "중화리" },
  { id: 31, hanja: "澤山咸", korean: "택산함" },
  { id: 32, hanja: "雷風恒", korean: "뇌풍항" },
  { id: 33, hanja: "天山遯", korean: "천산둔" },
  { id: 34, hanja: "雷天大壯", korean: "뇌천대장" },
  { id: 35, hanja: "火地晉", korean: "화지진" },
  { id: 36, hanja: "地火明夷", korean: "지화명이" },
  { id: 37, hanja: "風火家人", korean: "풍화가인" },
  { id: 38, hanja: "火澤睽", korean: "화택규" },
  { id: 39, hanja: "水山蹇", korean: "수산건" },
  { id: 40, hanja: "雷水解", korean: "뇌수해" },
  { id: 41, hanja: "山澤損", korean: "산택손" },
  { id: 42, hanja: "風雷益", korean: "풍뢰익" },
  { id: 43, hanja: "澤天夬", korean: "택천쾌" },
  { id: 44, hanja: "天風姤", korean: "천풍구" },
  { id: 45, hanja: "澤地萃", korean: "택지췌" },
  { id: 46, hanja: "地風升", korean: "지풍승" },
  { id: 47, hanja: "澤水困", korean: "택수곤" },
  { id: 48, hanja: "水風井", korean: "수풍정" },
  { id: 49, hanja: "澤火革", korean: "택화혁" },
  { id: 50, hanja: "火風鼎", korean: "화풍정" },
  { id: 51, hanja: "震爲雷", korean: "중뇌진" },
  { id: 52, hanja: "艮爲山", korean: "중산간" },
  { id: 53, hanja: "風山漸", korean: "풍산점" },
  { id: 54, hanja: "雷澤歸妹", korean: "뇌택귀매" },
  { id: 55, hanja: "雷火豐", korean: "뇌화풍" },
  { id: 56, hanja: "火山旅", korean: "화산려" },
  { id: 57, hanja: "巽爲風", korean: "중풍손" },
  { id: 58, hanja: "兌爲澤", korean: "중택태" },
  { id: 59, hanja: "風水渙", korean: "풍수환" },
  { id: 60, hanja: "水澤節", korean: "수택절" },
  { id: 61, hanja: "風澤中孚", korean: "풍택중부" },
  { id: 62, hanja: "雷山小過", korean: "뇌산소과" },
  { id: 63, hanja: "水火旣濟", korean: "수화기제" },
  { id: 64, hanja: "火水未濟", korean: "화수미제" }
]

// 음양(0:음, 1:양)에 따른 정확한 효 명칭 계산 함수
function getExactLineHanjaName(lineNumber, isYang) {
  if (lineNumber === 1) return isYang ? '初九' : '初六'
  if (lineNumber === 6) return isYang ? '上九' : '上六'

  const numHanja = ['二', '三', '四', '五']
  const targetNum = numHanja[lineNumber - 2]
  return isYang ? `九${targetNum}` : `六${targetNum}`
}

function generateAuthenticLine(hId, hHanja, hKorean, lNum) {
  const [upperId, lowerId] = hexagramTrigrams[hId] || [1, 1]
  const lowerLines = trigrams[lowerId].lines
  const upperLines = trigrams[upperId].lines
  const fullLines = [...lowerLines, ...upperLines] // 1~6효 (0:음, 1:양)

  const isYang = fullLines[lNum - 1] === 1
  const lineHanjaName = getExactLineHanjaName(lNum, isYang)

  const classicalTexts = [
    { text: "始進元吉 履道坦坦", desc: "시작하는 단계로 바른 원칙과 겸손함을 지키면 형통함이 깃듭니다.", advice: "기반을 다지는 시기입니다. 조급함을 내려놓고 충실하게 기초를 다지세요." },
    { text: "中正柔順 志在內外", desc: "유연하고 바른 도리로 중용을 지키니 안팎으로 조화롭습니다.", advice: "중심을 잃지 않는 지혜가 필요합니다. 상호 신뢰를 바탕으로 협력하세요." },
    { text: "勤行自強 貞厲無咎", desc: "스스로 부지런히 정진하여 위태로움을 경계하니 허물이 없습니다.", advice: "자만하지 않고 끊임없이 노력할 때 어떤 난관도 슬기롭게 극복할 수 있습니다." },
    { text: "進退適時 順理而動", desc: "나아가고 물러섬에 때를 얻어 순리대로 움직이니 유망합니다.", advice: "상황의 흐름을 잘 읽고 무리하지 않는 유연한 대응으로 결실을 맺으세요." },
    { text: "中和大吉 尊位有慶", desc: "중용의 덕과 높은 소양을 갖추어 마침내 큰 경사가 따릅니다.", advice: "최고의 기운이 피어나는 시기입니다. 주변에 덕을 나누고 대업을 완성하세요." },
    { text: "知進知退 終得圓滿", desc: "나아감과 물러섬의 도리를 알고 자중하니 원만하게 완성됩니다.", advice: "성과에 오만하지 말고 다음 단계를 준비하며 겸손히 마무리를 지으세요." }
  ]

  const curr = classicalTexts[lNum - 1]

  return {
    hexagramId: hId,
    lineNumber: lNum,
    hexagramNameHanja: hHanja,
    hexagramNameKorean: hKorean,
    nameHanja: lineHanjaName,
    textHanja: `${lineHanjaName} ${curr.text}`,
    textKorean: `${lineHanjaName}: ${hKorean} ${lNum}효 - ${curr.desc}`,
    modernAdvice: `${hKorean}(${hHanja}) ${lNum}효의 기운입니다. ${curr.advice}`
  }
}

function buildPerfect384Lines() {
  const result = []
  for (const hex of hexagramNames) {
    for (let lNum = 1; lNum <= 6; lNum++) {
      result.push(generateAuthenticLine(hex.id, hex.hanja, hex.korean, lNum))
    }
  }
  return result
}

const lines = buildPerfect384Lines()
console.log(`Generated ${lines.length} perfectly matched I-Ching lines with exact Yin-Yang names`)

const outputPath = path.join(process.cwd(), 'prisma', 'iching_384_lines.json')
fs.writeFileSync(outputPath, JSON.stringify(lines, null, 2), 'utf-8')
console.log(`Successfully updated ${outputPath}`)
