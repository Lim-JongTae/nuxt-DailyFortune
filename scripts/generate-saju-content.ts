import fs from 'fs'
import path from 'path'

// 1. 10천간 데이터
const stems = [
  { code: 'gap', stem: '갑', hanja: '甲', element: '목(Wood)', polarity: '양(Yang)', symbol: '동량지목 (큰 나무, 기둥)', tendency: '뿌리를 깊게 내린 큰 나무처럼 추진력과 독립심이 강하고 우두머리 기질이 있습니다. 타인에게 굽히기 싫어하며 시작하는 힘이 뛰어납니다.' },
  { code: 'eul', stem: '을', hanja: '乙', element: '목(Wood)', polarity: '음(Yin)', symbol: '화초, 덩굴 식물', tendency: '바람에 흔들려도 꺾이지 않는 유연한 화초나 넝쿨 식물처럼 적응력이 뛰어나고 외유내강형입니다. 끈기 있고 실속을 챙기는 능력이 있습니다.' },
  { code: 'byeong', stem: '병', hanja: '丙', element: '화(Fire)', polarity: '양(Yang)', symbol: '태양, 거대한 불꽃', tendency: '세상을 두루 밝히는 태양처럼 정열적이고 화려하며, 솔직담백하고 자신감이 넘칩니다. 성격이 급한 면이 있으나 뒤끝이 없고 공명정대합니다.' },
  { code: 'jeong', stem: '정', hanja: '丁', element: '화(Fire)', polarity: '음(Yin)', symbol: '등대, 촛불, 모닥불', tendency: '어둠을 밝히는 등대, 촛불 혹은 따뜻한 모닥불처럼 온화하고 배려심이 깊으며 조용합니다. 보이지 않는 곳에서 강한 열정과 집중력을 보입니다.' },
  { code: 'mu', stem: '무', hanja: '戊', element: '토(Earth)', polarity: '양(Yang)', symbol: '태산, 광활한 대지', tendency: '듬직하고 거대한 태산처럼 포용력이 넓고 신용을 중시합니다. 묵직하고 주관이 뚜렷하나 다소 고집스럽거나 변화를 꺼리는 면이 있습니다.' },
  { code: 'gi', stem: '기', hanja: '己', element: '토(Earth)', polarity: '음(Yin)', symbol: '전답, 텃밭, 정원', tendency: '생명을 기르는 비옥한 정원이나 대지처럼 온화하고 성실하며 어머니 같은 포용력이 있습니다. 내면이 알차고 타인을 조화롭게 돕는 능력이 뛰어납니다.' },
  { code: 'gyeong', stem: '경', hanja: '庚', element: '금(Metal)', polarity: '양(Yang)', symbol: '원석, 강철, 큰 칼', tendency: '단단하고 강직한 원석이나 잘 제련된 큰 칼처럼 결단력과 정의감이 넘치며 신의를 소중히 합니다. 공과 사가 뚜렷하며 의리가 깊습니다.' },
  { code: 'sin', stem: '신', hanja: '辛', element: '금(Metal)', polarity: '음(Yin)', symbol: '보석, 정밀 메스', tendency: '빛나는 보석이나 정밀한 메스처럼 섬세하고 날카로우며 완벽주의적 성향이 있습니다. 개성이 뚜렷하고 자신만의 깔끔함과 자존심이 매우 강합니다.' },
  { code: 'im', stem: '임', hanja: '壬', element: '수(Water)', polarity: '양(Yang)', symbol: '바다, 거대한 강물', tendency: '모든 것을 품는 거대한 바다나 강물처럼 지혜롭고 유연하며 통찰력이 깊습니다. 스케일이 크고 임기응변에 강하나 생각을 종잡기 힘든 면이 있습니다.' },
  { code: 'gye', stem: '계', hanja: '癸', element: '수(Water)', polarity: '음(Yin)', symbol: '단비, 옹달샘, 이슬', tendency: '만물을 적시는 단비나 맑은 옹달샘처럼 지혜롭고 상상력이 풍부합니다. 다정다감하고 세심하며 남을 배려하고 보듬는 심성이 뛰어납니다.' }
]

// 2. 12지간 데이터
const jijis = [
  { code: 'ja', name: '자', hanja: '子', animal: '쥐', element: '수(Water)', season: '한겨울 (12월)', time: '23:10 ~ 01:10 (자시)', description: '자수(子水)를 가진 사람은 지혜롭고 생각이 깊으며 비밀이 많고 신중합니다. 밤의 기운을 담아 임기응변과 치밀한 계획성이 뛰어납니다.' },
  { code: 'chuk', name: '축', hanja: '丑', animal: '소', element: '토(Earth)', season: '늦겨울 (1월)', time: '01:10 ~ 03:10 (축시)', description: '축토(丑土)를 가진 사람은 인내심과 끈기가 강하며 우직하고 성실합니다. 대기만성형으로 묵묵히 자신의 길을 개척하고 신용을 중시합니다.' },
  { code: 'in', name: '인', hanja: '寅', animal: '호랑이', element: '목(Wood)', season: '초봄 (2월)', time: '03:10 ~ 05:10 (인시)', description: '인목(寅木)을 가진 사람은 시작하는 힘과 추진력이 강하며 독립심과 리더십이 뛰어납니다. 적극적이고 명예를 소중히 생각합니다.' },
  { code: 'myo', name: '묘', hanja: '卯', animal: '토끼', element: '목(Wood)', season: '한봄 (3월)', time: '05:10 ~ 07:10 (묘시)', description: '묘목(卯木)을 가진 사람은 섬세하고 감수성이 풍부하며 기획력과 미적 감각이 뛰어납니다. 모험보다는 안전과 평화로운 조화를 선호합니다.' },
  { code: 'jin', name: '진', hanja: '辰', animal: '용', element: '토(Earth)', season: '늦봄 (4월)', time: '07:10 ~ 09:10 (진시)', description: '진토(辰土)를 가진 사람은 꿈과 이상이 높으며 다재다능하고 변화무쌍합니다. 스케일이 크고 포부가 당당하나 다소 변덕이 있을 수 있습니다.' },
  { code: 'sa', name: '사', hanja: '巳', animal: '뱀', element: '화(Fire)', season: '초여름 (5월)', time: '09:10 ~ 11:10 (사시)', description: '사화(巳火)를 가진 사람은 직관력이 날카롭고 표현력이 뛰어나며 대외적인 활동력이 강합니다. 정열적이고 예의를 갖추는 지혜로운 성격입니다.' },
  { code: 'o', name: '오', hanja: '午', animal: '말', element: '화(Fire)', season: '한여름 (6월)', time: '11:10 ~ 13:10 (오시)', description: '오화(午火)를 가진 사람은 열정적이고 활동적이며 매력이 많고 화려함을 선호합니다. 밝고 개방적이나 급하게 달아올랐다 식는 면이 있습니다.' },
  { code: 'mi', name: '미', hanja: '未', animal: '양', element: '토(Earth)', season: '늦여름 (7월)', time: '13:10 ~ 15:10 (미시)', description: '미토(未土)를 가진 사람은 온화하고 배려심이 많으며 규칙과 선을 지키는 정직함이 있습니다. 내면에는 강한 고집과 굳건한 주관을 품고 있습니다.' },
  { code: 'sin', name: '신', hanja: '申', animal: '원숭이', element: '금(Metal)', season: '초가을 (8월)', time: '15:10 ~ 17:10 (신시)', description: '신금(申金)을 가진 사람은 다재다능하고 임기응변에 강하며 기술적, 기계적 재능이 뛰어납니다. 분주히 움직이며 실용적인 이익을 추구합니다.' },
  { code: 'yu', name: '유', hanja: '酉', animal: '닭', element: '금(Metal)', season: '한가을 (9월)', time: '17:10 ~ 19:10 (유시)', description: '유금(酉金)을 가진 사람은 칼같이 예리하고 섬세하며 분석력과 분별력이 뛰어납니다. 결단력이 있고 깨끗하며 마무리가 확실합니다.' },
  { code: 'sul', name: '술', hanja: '戌', animal: '개', element: '토(Earth)', season: '늦가을 (10월)', time: '19:10 ~ 21:10 (술시)', description: '술토(戌土)를 가진 사람은 충성심과 의리가 깊으며 정직하고 신용을 생명처럼 여깁니다. 책임감이 강하고 수호자 역할을 훌륭히 해냅니다.' },
  { code: 'hae', name: '해', hanja: '亥', animal: '돼지', element: '수(Water)', season: '초겨울 (11월)', time: '21:10 ~ 23:10 (해시)', description: '해수(亥水)를 가진 사람은 넓은 포용력과 낙천적인 성향이 있으며 지혜가 깊습니다. 남을 돕는 봉사 정신과 예술적 감수성이 발달했습니다.' }
]

// 3. 10십신 데이터
const shipsins = [
  { code: 'bigyeon', name: '비견', hanja: '比肩', category: '비겁(比劫)', description: '자신의 주체성과 신념이 강해지는 기운입니다. 독립적으로 무언가를 추진하기에 좋은 날이지만, 지나치게 고집을 부리면 갈등이 생길 수 있으니 경청하는 태도가 길합니다.' },
  { code: 'geobjae', name: '겁재', hanja: '劫財', category: '비겁(比劫)', description: '경쟁심과 투지, 모험심이 자극받는 날입니다. 뜻밖의 지출이나 이견 대립을 조심해야 하지만, 강한 돌파력이 되어주기도 합니다.' },
  { code: 'siksin', name: '식신', hanja: '食神', category: '식상(食傷)', description: '자신의 재능과 아이디어를 맘껏 발휘하고 의식주가 풍족해지는 길한 날입니다. 새로운 일의 기획에 유리하며 베풂으로써 더 큰 운을 부릅니다.' },
  { code: 'sanggwan', name: '상관', hanja: '傷官', category: '식상(食傷)', description: '자신의 독특한 개성과 뛰어난 표현력이 극대화되는 시기입니다. 낡은 규범을 타파하고 혁신을 시도하기 좋으나 언행을 신중히 가다듬어야 합니다.' },
  { code: 'pyeonjae', name: '편재', hanja: '偏財', category: '재성(財星)', description: '유통성 재물이나 새로운 비즈니스 기회 등 큰돈의 흐름이 활발해지는 시기입니다. 시야가 넓어지고 대범하게 투자나 확장을 노릴 수 있습니다.' },
  { code: 'jeongjae', name: '정재', hanja: '正財', category: '재성(財星)', description: '성실함의 결실을 맺는 날로, 계획적이고 안정적인 재물 관리가 이루어집니다. 약속 이행과 직장 업무에서 정당한 결과를 차곡차곡 쌓아갑니다.' },
  { code: 'pyeongwan', name: '편관', hanja: '偏官', category: '관성(官星)', description: '책임감, 도전 과제, 그리고 강한 압박감이 찾아오는 날입니다. 강한 정신력으로 이를 극복하면 권한이 커지고 명예를 얻습니다.' },
  { code: 'jeonggwan', name: '정관', hanja: '正官', category: '관성(官星)', description: '사회적인 규칙이나 법규를 잘 따르며 명예와 신용이 상승하는 날입니다. 시험, 취업 면접, 공공 계약 등에 매우 유리합니다.' },
  { code: 'pyeonin', name: '편인', hanja: '偏印', category: '인성(印星)', description: '기술, 예술, 종교, 철학 등 깊이 있는 전문 학문에 몰두하기 좋은 기운입니다. 직관과 통찰력이 날카로워집니다.' },
  { code: 'jeongin', name: '정인', hanja: '正印', category: '인성(印星)', description: '귀인의 도움, 문서운, 그리고 학업운이 따르는 안정적인 날입니다. 상사나 윗사람의 따뜻한 조력을 받기 쉽고 계약에 유리합니다.' }
]

// 4. 60일주 연동 매핑 유틸
const stemsList = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
const stemsCodeList = ['gap', 'eul', 'byeong', 'jeong', 'mu', 'gi', 'gyeong', 'sin', 'im', 'gye']
const stemsHanjaList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

const jijisList = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
const jijisCodeList = ['ja', 'chuk', 'in', 'myo', 'jin', 'sa', 'o', 'mi', 'sin', 'yu', 'sul', 'hae']
const jijisHanjaList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

function run() {
  const baseDir = path.resolve(process.cwd(), 'content/ko/saju')

  // 1) 10천간 생성
  const cheonganDir = path.join(baseDir, 'cheongan')
  if (!fs.existsSync(cheonganDir)) fs.mkdirSync(cheonganDir, { recursive: true })
  for (const s of stems) {
    const md = `---
title: "${s.stem}목(${s.hanja}) - ${s.symbol}"
code: "${s.code}"
hanja: "${s.hanja}"
element: "${s.element}"
polarity: "${s.polarity}"
symbol: "${s.symbol}"
description: "${s.tendency}"
---

# ${s.hanja} ${s.stem}간(${s.hanja}) 해설

${s.stem}간은 10천간 중 오행 ${s.element}, ${s.polarity}의 기운을 띱니다.

## 1. 성격 및 기질
${s.tendency}

## 2. 물상적 상징
- **상징**: ${s.symbol}
- **기운**: ${s.polarity} 오행 ${s.element}의 특성을 바탕으로 우직하고 정직한 기운을 발휘합니다.
`
    fs.writeFileSync(path.join(cheonganDir, `${s.code}.md`), md, 'utf-8')
  }

  // 2) 12지간 생성
  const jijiDir = path.join(baseDir, 'jiji')
  if (!fs.existsSync(jijiDir)) fs.mkdirSync(jijiDir, { recursive: true })
  for (const j of jijis) {
    const md = `---
title: "${j.name}수(${j.hanja}) - ${j.animal}의 지혜"
code: "${j.code}"
hanja: "${j.hanja}"
animal: "${j.animal}"
element: "${j.element}"
season: "${j.season}"
time: "${j.time}"
description: "${j.description}"
---

# ${j.hanja} ${j.name}지(${j.hanja}) 해설

12지간 중 ${j.animal}를 상징하는 ${j.name}지(${j.hanja})의 성질과 특징입니다.

## 1. 특성 및 계절
- **상징 동물**: ${j.animal}
- **오행 및 계절**: ${j.element}, ${j.season}
- **상징 시각**: ${j.time}

## 2. 성격 풀이
${j.description}
`
    fs.writeFileSync(path.join(jijiDir, `${j.code}.md`), md, 'utf-8')
  }

  // 3) 10십신 생성
  const shipsinDir = path.join(baseDir, 'shipsin')
  if (!fs.existsSync(shipsinDir)) fs.mkdirSync(shipsinDir, { recursive: true })
  for (const sh of shipsins) {
    const md = `---
title: "${sh.name}(${sh.hanja}) - ${sh.category}"
code: "${sh.code}"
hanja: "${sh.hanja}"
category: "${sh.category}"
description: "${sh.description}"
---

# 십신 ${sh.name}(${sh.hanja}) 해설

${sh.name}(${sh.hanja})은 사주 명리학의 십신 중 ${sh.category} 카테고리에 속합니다.

## 1. 핵심 운세 및 지혜
${sh.description}
`
    fs.writeFileSync(path.join(shipsinDir, `${sh.code}.md`), md, 'utf-8')
  }

  // 4) 60일주 생성 (60개 자동 생성)
  const iljuDir = path.join(baseDir, 'ilju')
  if (!fs.existsSync(iljuDir)) fs.mkdirSync(iljuDir, { recursive: true })

  let count = 0
  for (let i = 0; i < 60; i++) {
    const sIdx = i % 10
    const jIdx = i % 12

    const stemKr = stemsList[sIdx]
    const stemCd = stemsCodeList[sIdx]
    const stemHj = stemsHanjaList[sIdx]

    const jijiKr = jijisList[jIdx]
    const jijiCd = jijisCodeList[jIdx]
    const jijiHj = jijisHanjaList[jIdx]

    const ganzhiKr = `${stemKr}${jijiKr}`
    const ganzhiHj = `${stemHj}${jijiHj}`
    const codeStr = `${stemCd}-${jijiCd}`

    const md = `---
title: "${ganzhiKr}일주(${ganzhiHj}) - ${stemKr}목과 ${jijiKr}수의 조화"
code: "${codeStr}"
cheongan: "${stemCd}"
jiji: "${jijiCd}"
shipsin: "jeongin"
description: "${ganzhiKr}일주는 천간 ${stemKr}(${stemHj})와 지지 ${jijiKr}(${jijiHj})가 어우러진 육십갑자의 제${i+1}번째 일주입니다."
keywords: ["${ganzhiKr}일주", "${ganzhiKr}일주 성격", "${ganzhiKr}일주 재물운", "${ganzhiKr}일주 애정운"]
---

# ${ganzhiHj} ${ganzhiKr}일주 실전 처세 가이드

${ganzhiKr}일주(${ganzhiHj})는 [천간 ${stemKr}(${stemHj})](/saju/cheongan/${stemCd})와 [12지간 ${jijiKr}(${jijiHj})](/saju/jiji/${jijiCd})의 조화로 형성된 일주입니다.

## 1. 성격 및 기질 특징
천간의 ${stemKr} 기운과 지지의 ${jijiKr} 기운이 결합하여 독창적인 매력과 리더십, 끈기를 형성합니다.

## 2. 직업운 및 재물운
자신의 분야에서 끈기와 신뢰를 바탕으로 실속을 다지며, 학문, 전문 기술, 금융 및 기획 관리 분야에 유리합니다.

## 3. 애정운 및 처세 조언
상대방을 존중하고 내면의 고집을 조절하여 따뜻한 소통을 이어갈 때 지속적인 인복이 따릅니다.
`
    fs.writeFileSync(path.join(iljuDir, `${codeStr}.md`), md, 'utf-8')
    count++
  }

  console.log(`Successfully generated Saju content! (10 Cheongan, 12 Jiji, 10 Shipsin, 60 Ilju: total ${10+12+10+count} md files)`)
}

run()
