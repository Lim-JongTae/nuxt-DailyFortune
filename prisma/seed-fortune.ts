import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
declare const process: any

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
})

async function main() {
  try {
    console.log('Seeding fortune data...')

    await prisma.$transaction(async (tx) => {
      // 1. Saju Stems (천간 10종)
      const stems = [
    { stem: '갑', element: '목', tendency: '뿌리를 깊게 내린 큰 나무처럼 추진력과 독립심이 강하고 우두머리 기질이 있습니다. 타인에게 굽히기 싫어하며 시작하는 힘이 뛰어납니다.' },
    { stem: '을', element: '목', tendency: '바람에 흔들려도 꺾이지 않는 유연한 화초나 넝쿨 식물처럼 적응력이 뛰어나고 외유내강형입니다. 끈기 있고 실속을 챙기는 능력이 있습니다.' },
    { stem: '병', element: '화', tendency: '세상을 두루 밝히는 태양처럼 정열적이고 화려하며, 솔직담백하고 자신감이 넘칩니다. 성격이 급한 면이 있으나 뒤끝이 없고 공명정대합니다.' },
    { stem: '정', element: '화', tendency: '어둠을 밝히는 등대, 촛불 혹은 따뜻한 모닥불처럼 온화하고 배려심이 깊으며 조용합니다. 보이지 않는 곳에서 강한 열정과 집중력을 보입니다.' },
    { stem: '무', element: '토', tendency: '듬직하고 거대한 태산처럼 포용력이 넓고 신용을 중시합니다. 묵직하고 주관이 뚜렷하나 다소 고집스럽거나 변화를 꺼리는 면이 있습니다.' },
    { stem: '기', element: '토', tendency: '생명을 기르는 비옥한 정원이나 대지처럼 온화하고 성실하며 어머니 같은 포용력이 있습니다. 내면이 알차고 타인을 조화롭게 돕는 능력이 뛰어납니다.' },
    { stem: '경', element: '금', tendency: '단단하고 강직한 원석이나 잘 제련된 큰 칼처럼 결단력과 정의감이 넘치며 신의를 소중히 합니다. 공과 사가 뚜렷하며 의리가 깊습니다.' },
    { stem: '신', element: '금', tendency: '빛나는 보석이나 정밀한 메스처럼 섬세하고 날카로우며 완벽주의적 성향이 있습니다. 개성이 뚜렷하고 자신만의 깔끔함과 자존심이 매우 강합니다.' },
    { stem: '임', element: '수', tendency: '모든 것을 품는 거대한 바다나 강물처럼 지혜롭고 유연하며 통찰력이 깊습니다. 스케일이 크고 임기응변에 강하나 생각을 종잡기 힘든 면이 있습니다.' },
    { stem: '계', element: '수', tendency: '만물을 적시는 단비나 맑은 옹달샘처럼 지혜롭고 상상력이 풍부합니다. 다정다감하고 세심하며 남을 배려하고 보듬는 심성이 뛰어납니다.' }
  ]

  await Promise.all(
    stems.map(s =>
      tx.sajuIlgan.upsert({
        where: { stem: s.stem },
        update: s,
        create: s
      })
    )
  )
  console.log(`✓ Seeded ${stems.length} Saju Stems.`)

  // 2. Saju Shipsin (십신 10종)
  const shipsins = [
    { name: '비견', meaning: '자신의 주체성과 신념이 강해지는 기운입니다. 독립적으로 무언가를 추진하기에 좋은 날이지만, 지나치게 고집을 부리면 대인관계에서 갈등이 생길 수 있으니 타인의 의견을 경청하는 태도가 길합니다.' },
    { name: '겁재', meaning: '경쟁심과 투지, 모험심이 자극받는 날입니다. 뜻밖의 재물 지출이나 동업자와의 이견 대립을 조심해야 하는 시기이지만, 동시에 경쟁 관계에서 치고 나갈 수 있는 강력한 돌파력이 되어주기도 합니다.' },
    { name: '식신', meaning: '자신의 재능과 아이디어를 맘껏 발휘하고 의식주가 풍족해지는 길한 날입니다. 창의적인 연구나 취미 생활, 새로운 일의 기획에 유리하며 주위에 베풂으로써 더 큰 운을 부르는 흐름입니다.' },
    { name: '상관', meaning: '자신의 독특한 개성과 뛰어난 표현력이 극대화되는 시기입니다. 낡은 규범을 타파하고 혁신을 시도하기 좋으나, 말로 인한 구설수나 윗사람과의 트러블을 주의하고 언행을 한 번 더 신중히 가다듬어야 합니다.' },
    { name: '편재', meaning: '유통성 재물이나 새로운 비즈니스 기회 등 큰돈의 흐름이 활발해지는 시기입니다. 시야가 넓어지고 대범하게 투자나 확장을 노릴 수 있으나, 일확천금을 쫓기보단 철저한 계산 아래 움직여야 손실을 막습니다.' },
    { name: '정재', meaning: '성실함의 결실을 맺는 날로, 계획적이고 안정적인 재물 관리가 이루어지는 시기입니다. 약속 이행이나 직장 업무, 문서 계약 등에서 신뢰를 쌓아 정당하고 값진 결과를 차곡차곡 쌓아가기 좋습니다.' },
    { name: '편관', meaning: '책임감, 도전 과제, 그리고 일시적인 압박감이 찾아오는 날입니다. 스트레스를 받을 수 있으니 건강과 컨디션 조절에 유의해야 하나, 강한 정신력으로 이를 극복하면 권한이 커지고 명예를 얻습니다.' },
    { name: '정관', meaning: '사회적인 규칙이나 법규를 잘 따르며 명예와 신용이 상승하는 날입니다. 시험, 취업 면접, 공공 계약 등에 매우 유리하며 직장 내에서 주위 사람들의 깊은 신뢰와 인정을 받을 수 있습니다.' },
    { name: '편인', meaning: '기술, 예술, 종교, 철학 등 깊이 있는 전문 학문에 몰두하기 좋은 기운입니다. 직관과 통찰력이 날카로워지지만, 생각이 지나치게 많아져 쓸데없는 의심이나 고독감에 빠지기 쉬우니 단순함을 유지하십시오.' },
    { name: '정인', meaning: '귀인의 도움, 문서운, 그리고 학업운이 따르는 안정적인 날입니다. 상사나 어머니 같은 윗사람의 따뜻한 조력을 받기 쉬우며 자격증 취득, 계약 서명 등 문서상의 계약에서 매우 유리한 작용을 합니다.' }
  ]

  await Promise.all(
    shipsins.map(sh =>
      tx.sajuShipsin.upsert({
        where: { name: sh.name },
        update: sh,
        create: sh
      })
    )
  )
  console.log(`✓ Seeded ${shipsins.length} Saju Shipsins.`)

  // 3. Saju Jiji (지지 12종)
  const jijis = [
    { name: '자', animal: '쥐', element: '수', description: '자수(子水)를 가진 사람은 지혜롭고 생각이 깊으며 비밀이 많고 신중합니다. 밤의 기운을 담아 임기응변과 치밀한 계획성이 뛰어납니다.' },
    { name: '축', animal: '소', element: '토', description: '축토(丑土)를 가진 사람은 인내심과 끈기가 강하며 우직하고 성실합니다. 대기만성형으로 묵묵히 자신의 길을 개척하고 신용을 중시합니다.' },
    { name: '인', animal: '호랑이', element: '목', description: '인목(寅木)을 가진 사람은 시작하는 힘과 추진력이 강하며 독립심과 리더십이 뛰어납니다. 적극적이고 명예를 소중히 생각합니다.' },
    { name: '묘', animal: '토끼', element: '목', description: '묘목(卯木)을 가진 사람은 섬세하고 감수성이 풍부하며 기획력과 미적 감각이 뛰어납니다. 모험보다는 안전과 평화로운 조화를 선호합니다.' },
    { name: '진', animal: '용', element: '토', description: '진토(辰土)를 가진 사람은 꿈과 이상이 높으며 다재다능하고 변화무쌍합니다. 스케일이 크고 포부가 당당하나 다소 변덕이 있을 수 있습니다.' },
    { name: '사', animal: '뱀', element: '화', description: '사화(巳火)를 가진 사람은 직관력이 날카롭고 표현력이 뛰어나며 대외적인 활동력이 강합니다. 정열적이고 예의를 갖추는 지혜로운 성격입니다.' },
    { name: '오', animal: '말', element: '화', description: '오화(午火)를 가진 사람은 열정적이고 활동적이며 매력이 많고 화려함을 선호합니다. 밝고 개방적이나 급하게 달아올랐다 식는 면이 있습니다.' },
    { name: '미', animal: '양', element: '토', description: '미토(未土)를 가진 사람은 온화하고 배려심이 많으며 규칙과 선을 지키는 정직함이 있습니다. 내면에는 강한 고집과 굳건한 주관을 품고 있습니다.' },
    { name: '신', animal: '원숭이', element: '금', description: '신금(申金)을 가진 사람은 다재다능하고 임기응변에 강하며 기술적, 기계적 재능이 뛰어납니다. 분주히 움직이며 실용적인 이익을 추구합니다.' },
    { name: '유', animal: '닭', element: '금', description: '유금(酉金)을 가진 사람은 칼같이 예리하고 섬세하며 분석력과 분별력이 뛰어납니다. 결단력이 있고 깨끗하며 마무리가 확실합니다.' },
    { name: '술', animal: '개', element: '토', description: '술토(戌土)를 가진 사람은 충성심과 의리가 깊으며 정직하고 신용을 생명처럼 여깁니다. 책임감이 강하고 수호자 역할을 훌륭히 해냅니다.' },
    { name: '해', animal: '돼지', element: '수', description: '해수(亥水)를 가진 사람은 넓은 포용력과 낙천적인 성향이 있으며 지혜가 깊습니다. 남을 돕는 봉사 정신과 예술적 감수성이 발달했습니다.' }
  ]

  await Promise.all(
    jijis.map(j =>
      tx.sajuJiji.upsert({
        where: { name: j.name },
        update: j,
        create: j
      })
    )
  )
  console.log(`✓ Seeded ${jijis.length} Saju Jijis.`)

  // 3-1. Saju Ilju (육십갑자 60일주 상세 원천 데이터)
  const iljus = [
    {
      order: 1, ganzhi: '갑자', ganzhiHanja: '甲子', stemHanja: '甲', stemElement: '양목(陽木)', branchHanja: '子', branchElement: '양수(陽水)',
      character: '큰 나무가 한겨울 깊은 물(水生木) 위에 뿌리를 내리고 꼿꼿이 서 있는 상으로, 시작과 우두머리의 강직함과 내면 깊은 탐구심, 예민한 감수성을 품고 있습니다.',
      careerFortune: '교육, 연구, 학술, 문학, 기획, 기획 컨설팅, 전문 문서 자격 등 지식 축적과 탐구심을 발휘하는 분야에 독보적입니다.',
      wealthFortune: '불확실한 투기보다는 학식과 자격, 정인(正印)의 문서운을 바탕으로 한 정직하고 안정적인 재물 축적이 유리합니다.',
      romanceAdvice: '자좌 도화와 목욕(沐浴)의 매력으로 이성에게 호감을 얻으나, 정인과 편인의 이중적 감정 기복을 다스리고 절제를 유지할 때 화목합니다.',
      healthFortune: '수(水)와 목(木)의 조화 속에서 신장, 방광, 신경계 질환, 불면증 및 냉증 관리에 유의하는 것이 길합니다.',
      rawAnalysis: {
        mulsang: '큰 나무가 한겨울 깊은 물 위에 뿌리를 내리고 꼿꼿하게 서 있는 형상',
        ilganIlji: '양목(甲)과 양수(子)의 수생목 조화, 우두머리의 강직함과 예민한 감수성의 공존',
        shipsinSelf: '정인(계수 정기) 및 편인(임수 여기)',
        jijanggan: '임수(壬水, 여기 10일) · 계수(癸水, 정기 20일)',
        twelveStar: '목욕(沐浴 - 매력과 변화의 기운)',
        sinsal: '태극귀인·나체도화·사왕지(子午卯酉) 도화',
        features: '배움과 지식 축적의 강한 본능, 문곡·문서운 우수, 대인관계 매력'
      }
    },
    {
      order: 2, ganzhi: '을축', ganzhiHanja: '乙丑', stemHanja: '乙', stemElement: '음목(陰木)', branchHanja: '丑', branchElement: '음토(陰土)',
      character: '하얀 눈밭에 피어난 화초의 상으로 은근한 인내심과 끈기가 뛰어나며 자수성가형 실속파입니다.',
      careerFortune: '금융, 회계, 부동산, 자원 관리, 정밀 기술 분야 등 꼼꼼한 마무리가 요구되는 직업이 길합니다.',
      wealthFortune: '알뜰한 금전 감각으로 꾸준히 자산을 불려 나가며, 중년 이후 큰 재산을 형성하는 재고의 기운입니다.',
      romanceAdvice: '내면의 굳건함이 있으나 지나친 의심이나 계산적인 태도는 연인 간의 다정함을 방해할 수 있습니다.',
      healthFortune: '습한 흙과 화초의 기운으로 위장 질환, 관절, 류머티즘 및 간 기능 보양에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '눈 덮인 겨울 들녘의 야생화', shipsinSelf: '편재', twelveStar: '쇠', sinsal: '백호살·금여록' }
    },
    {
      order: 3, ganzhi: '병인', ganzhiHanja: '丙寅', stemHanja: '丙', stemElement: '양화(陽火)', branchHanja: '寅', branchElement: '양목(陽木)',
      character: '숲속을 밝히는 태양의 형상으로 활달하고 명랑하며 창의적인 기획력과 추진력이 남다릅니다.',
      careerFortune: '언론, 방송, 홍보, 예술, 벤처 창업, 교육 등 세상에 자신을 널리 알리는 분야에서 대성합니다.',
      wealthFortune: '재물 번창의 기운이 강하나 스케일이 커서 지출도 클 수 있으니 계획적인 자금 관리가 요구됩니다.',
      romanceAdvice: '솔직하고 열정적인 사랑을 추구하며 귀인의 조력이 따르나 성급한 결정은 경계해야 합니다.',
      healthFortune: '심혈관계, 고혈압, 안과 질환 및 신경 과로로 인한 불면증 예방이 중요합니다.',
      rawAnalysis: { mulsang: '태양이 솟아오르는 삼림', shipsinSelf: '편인', twelveStar: '장생', sinsal: '홍염살·학당귀인' }
    },
    {
      order: 4, ganzhi: '정묘', ganzhiHanja: '丁卯', stemHanja: '丁', stemElement: '음화(陰火)', branchHanja: '卯', branchElement: '음목(陰木)',
      character: '달빛 아래 토끼처럼 다정다감하고 감수성이 풍부하며 섬세한 미적 감각을 보유하고 있습니다.',
      careerFortune: '디자인, 예술, 상담, 의료, 종교, 인문학 등 온화한 공감 능력과 감각을 발휘하는 분야가 길합니다.',
      wealthFortune: '자신의 재능과 귀인의 도움으로 안정적 수입을 올리나 충동적 지출을 삼가는 자세가 필요합니다.',
      romanceAdvice: '다정한 매력으로 이성의 인기를 얻으나 유유부단함으로 인한 이성 문제 구설을 조심하십시오.',
      healthFortune: '심장, 소장, 시력 보호 및 신경성 두통, 갑상선 질환 관리가 필요합니다.',
      rawAnalysis: { mulsang: '달빛 아래 조용히 타오르는 등불', shipsinSelf: '편인', twelveStar: '병', sinsal: '문곡귀인·도화살' }
    },
    {
      order: 5, ganzhi: '무진', ganzhiHanja: '戊辰', stemHanja: '戊', stemElement: '양토(陽土)', branchHanja: '辰', branchElement: '양토(陽土)',
      character: '거대한 태산과 용의 조화로 주관이 뚜렷하고 카리스마와 당당한 리더십을 발휘합니다.',
      careerFortune: '정치, 행정, 대기업 리더, 토목, 대형 프로젝트 총괄 등 중책을 맡아 이끄는 자리에 어울립니다.',
      wealthFortune: '큰돈을 만질 수 있는 포부와 기운을 가졌으나 과도한 투기는 경계하고 안전자산을 보유하십시오.',
      romanceAdvice: '자존심이 강하여 상대방을 억누를 수 있으니 유연한 대화와 겸손한 태도가 화목을 부릅니다.',
      healthFortune: '위장, 비장, 피부 질환 및 소화기계 계통의 주기적인 건강 검진이 권장됩니다.',
      rawAnalysis: { mulsang: '구름을 품은 거대한 황산과 용', shipsinSelf: '비견', twelveStar: '관대', sinsal: '괴강살·홍염살' }
    },
    {
      order: 6, ganzhi: '기사', ganzhiHanja: '己巳', stemHanja: '己', stemElement: '음토(陰土)', branchHanja: '巳', branchElement: '양화(陽火)',
      character: '따사로운 대지와 태양의 만남으로 공부에 깊이가 있고 포용력과 성실함이 돋보입니다.',
      careerFortune: '학문, 연구, 공직, 부동산, 전문 기술직 등 꾸준함과 신뢰가 중심이 되는 분야에 탁월합니다.',
      wealthFortune: '문서운과 부동산재운이 좋아 부동산이나 안정된 금융 자산을 바탕으로 유산을 불려 나갑니다.',
      romanceAdvice: '어머니처럼 상대를 품어주나 내면의 고집이 있으니 타협하는 자세가 이성 관계를 깊게 합니다.',
      healthFortune: '비위 기능, 췌장, 척추 및 피부 알레르기 관리에 유의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '태양 빛을 받아 비옥해진 전답', shipsinSelf: '정인', twelveStar: '제왕', sinsal: '태극귀인·역마살' }
    },
    {
      order: 7, ganzhi: '경오', ganzhiHanja: '庚午', stemHanja: '庚', stemElement: '양금(陽金)', branchHanja: '午', branchElement: '양화(陽火)',
      character: '단단한 원석을 강렬한 화염으로 제련하는 형상으로 원칙을 지키며 정의감이 넘칩니다.',
      careerFortune: '법조계, 군·경찰, 공공기관, 관리직, 금속/기계 엔지니어 등 책임감 있는 직책에 최적입니다.',
      wealthFortune: '정당한 노동과 직장 상승을 통한 안정 재물이 주를 이루며 타인과의 금전 동업은 신중해야 합니다.',
      romanceAdvice: '용모가 단정하고 인기가 많으나 주관이 지나치게 강하면 마찰이 생기니 따뜻한 유연함이 필요.',
      healthFortune: '폐, 대장, 호흡기 계통 및 순환계 질환 관리에 주의를 기울이십시오.',
      rawAnalysis: { mulsang: '용광로에서 제련되는 순금 원석', shipsinSelf: '정관', twelveStar: '목욕', sinsal: '금여록·복성귀인' }
    },
    {
      order: 8, ganzhi: '신미', ganzhiHanja: '辛未', stemHanja: '辛', stemElement: '음금(陰金)', branchHanja: '未', branchElement: '음토(陰土)',
      character: '빛나는 보석과 차분한 흙의 조화로 분석력이 날카롭고 섬세하며 주관이 매우 철저합니다.',
      careerFortune: '의료(치과/성형), 세무, 정밀 분석, 연구, 예술 세공 등 정교한 능력을 발휘하는 일에 길합니다.',
      wealthFortune: '알뜰한 절약 정신과 정밀 계산으로 재산을 안전하게 가꾸어 나가며 불필요한 위험 투자는 피함.',
      romanceAdvice: '자기 방어 기제가 작용하여 예민해질 수 있으니 마음을 열고 상대방을 인정하는 자세가 중요.',
      healthFortune: '폐, 피부, 지루성 염증, 소화기 장애 및 치아 건강에 신경 쓰시는 것이 좋습니다.',
      rawAnalysis: { mulsang: '흙 속에서 발굴된 반짝이는 다이아몬드', shipsinSelf: '편인', twelveStar: '쇠', sinsal: '현침살·암록' }
    },
    {
      order: 9, ganzhi: '임신', ganzhiHanja: '壬申', stemHanja: '壬', stemElement: '양수(陽水)', branchHanja: '申', branchElement: '양금(陽金)',
      character: '거대한 바위에서 솟아나는 샘물로 두뇌 회전이 빠르고 지혜가 샘솟으며 기획력이 독보적입니다.',
      careerFortune: '무역, 글로벌 비즈니스, 기획, IT, 수산업, 물류 등 넓은 무대에서 지혜를 발휘하는 업종에 우수.',
      wealthFortune: '금생수의 흐름으로 재물 샘샘이 마르지 않으나 유동성이 크므로 부동산 등 고정자산으로 묶는 것이 길.',
      romanceAdvice: '지혜롭고 매력적이나 생각이 너무 많으면 불필요한 오해가 생길 수 있으니 솔직 담백하게 대화.',
      healthFortune: '신장, 방광, 혈액 순환 및 대장 건강에 유의하고 주기적인 운동이 필수적입니다.',
      rawAnalysis: { mulsang: '암반을 뚫고 솟아오르는 거대한 강줄기', shipsinSelf: '편인', twelveStar: '장생', sinsal: '학당귀인·문곡귀인' }
    },
    {
      order: 10, ganzhi: '계유', ganzhiHanja: '癸酉', stemHanja: '癸', stemElement: '음수(陰水)', branchHanja: '酉', branchElement: '음금(陰金)',
      character: '맑은 이슬과 정교한 보석의 만남으로 순발력이 뛰어나고 예술적/학문적 센스가 비상합니다.',
      careerFortune: '전문 학술, 상담, 예술, 어학, 금융 분석, 약학 등 섬세한 통찰이 요구되는 분야에 어울립니다.',
      wealthFortune: '기술이나 자격증, 재능을 바탕으로 차곡차곡 재물을 모으며 자산 관리가 비교적 철저합니다.',
      romanceAdvice: '세련된 취향으로 이성의 호감을 사나 자좌 귀문의 작용으로 예민해지기 쉬우니 낙천성을 유지.',
      healthFortune: '신장, 자궁/생식기, 기관지 및 우울감/스트레스 해소에 유념하십시오.',
      rawAnalysis: { mulsang: '보석 겉면에 맺힌 청결한 아침 이슬', shipsinSelf: '편인', twelveStar: '병', sinsal: '귀문관살·도화살' }
    },

    {
      order: 11, ganzhi: '갑술', ganzhiHanja: '甲戌', stemHanja: '甲', stemElement: '양목(陽木)', branchHanja: '戌', branchElement: '양토(陽土)',
      character: '푸른 소나무와 드넓은 들녘의 형상으로 책임감이 강하고 수완이 좋으며 촉이 매우 발달했습니다.',
      careerFortune: '금융, 부동산, 법조, 사업가, 부동산 개발 등 커다란 목표를 조직적으로 달성하는 분야에 우수.',
      wealthFortune: '재고를 차고 있어 재물 축적 운이 대단히 강하지만 백호의 기운이 있으니 지출 통제가 필요.',
      romanceAdvice: '솔직하고 듬직하나 은근한 고집이 있으니 상대방의 감정을 더 읽어주는 자세가 행복을 부릅니다.',
      healthFortune: '쓸개, 간, 위장 장애 및 관절, 척추 부상에 유의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '가을 들판에 우뚝 선 푸른 소나무', shipsinSelf: '편재', twelveStar: '양', sinsal: '백호살·천문성' }
    },
    {
      order: 12, ganzhi: '을해', ganzhiHanja: '乙亥', stemHanja: '乙', stemElement: '음목(陰木)', branchHanja: '亥', branchElement: '음수(陰水)',
      character: '맑은 물에 떠 있는 연꽃의 형상으로 마음이 따뜻하고 평화주의자이며 두뇌 회전이 유연합니다.',
      careerFortune: '교육, 사회복지, 문화 예술, 종교, 출판 등 남을 보살피고 정서적 가치를 만드는 업이 길함.',
      wealthFortune: '윗사람이나 귀인의 도우미로 안정적인 생활 재물을 모으며 다정다감한 성품이 재운을 돕습니다.',
      romanceAdvice: '순수하고 헌신적인 사랑을 하나 주체성이 흔들릴 수 있으니 뚜렷한 소신을 가지는 것이 길.',
      healthFortune: '간, 담낭, 하체 냉증, 방광 및 알레르기성 질환 예방에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '호수 위에 호젓하게 핀 아름다운 연꽃', shipsinSelf: '정인', twelveStar: '사', sinsal: '천덕귀인·천문성' }
    },
    {
      order: 13, ganzhi: '병자', ganzhiHanja: '丙子', stemHanja: '丙', stemElement: '양화(陽火)', branchHanja: '子', branchElement: '양수(陽水)',
      character: '밤하늘을 비추는 맑은 불빛으로 예의 바르고 단정하며 신용과 명예를 최고 가치로 삼습니다.',
      careerFortune: '공무원, 행정관, 금융 기관, 학자, 대기업 임원 등 원칙과 도덕성이 중시되는 조직에 최적.',
      wealthFortune: '정당한 봉급과 안정적 관운을 바탕으로 차곡차곡 재산을 구축하며 사기나 투기 운은 적습니다.',
      romanceAdvice: '젠틀하고 인기가 많으나 속마음을 잘 드러내지 않아 소통의 공백이 생길 수 있으니 적극 대화.',
      healthFortune: '심장, 소장, 눈 건강 및 수화교제로 인한 스트레스성 신경 질환 관리가 필요.',
      rawAnalysis: { mulsang: '잔잔한 밤바다 위에 비치는 밝은 태양/달', shipsinSelf: '정관', twelveStar: '태', sinsal: '복성귀인·관귀학관' }
    },
    {
      order: 14, ganzhi: '정축', ganzhiHanja: '丁丑', stemHanja: '丁', stemElement: '음화(陰火)', branchHanja: '丑', branchElement: '음토(陰土)',
      character: '온기를 간직한 흙처럼 친절하고 봉사 정신이 깊으며 맛과 멋을 즐길 줄 아는 풍류가입니다.',
      careerFortune: '요리/외식업, 아동 교육, 복지, 예술, 서비스업, 의료 등 타인에게 베푸는 분야에서 성공.',
      wealthFortune: '식신제살의 기운으로 먹고사는데 걱정이 없으며 끈기 있게 재산을 모아 노후가 풍요롭습니다.',
      romanceAdvice: '다정하고 베푸는 심성으로 이성에게 호감을 얻으나 일시적 헌신 후 서운함이 생기지 않게 조절.',
      healthFortune: '위장, 십이지장, 심장 약화 및 뼈/치아 건강 보양에 유념하십시오.',
      rawAnalysis: { mulsang: '겨울철 온기를 품은 모닥불과 흙', shipsinSelf: '식신', twelveStar: '묘', sinsal: '백호살·정록' }
    },
    {
      order: 15, ganzhi: '무인', ganzhiHanja: '戊寅', stemHanja: '戊', stemElement: '양토(陽土)', branchHanja: '寅', branchElement: '양목(陽木)',
      character: '산속의 호랑이처럼 권위와 리더십이 뛰어나며 도전 정신과 강렬한 승부욕을 간직하고 있습니다.',
      careerFortune: '정치, 법조, 군경, 리더, 무역, 사업가 등 명예와 영향력을 발휘하는 위치에 어울립니다.',
      wealthFortune: '큰 목표를 향해 나아가며 명예를 얻으면 재물이 따라오는 구조로, 과도한 조급함은 지양.',
      romanceAdvice: '카리스마가 있으나 상대방을 지배하려 할 수 있으니 겸손함과 상호 존중이 관계를 지킵니다.',
      healthFortune: '간, 담, 위장 질환, 관절 부상 및 과로로 인한 피로 누적을 경계하십시오.',
      rawAnalysis: { mulsang: '산속을 당당히 호령하는 용맹한 호랑이', shipsinSelf: '편관', twelveStar: '장생', sinsal: '역마살·학당귀인' }
    },
    {
      order: 16, ganzhi: '기묘', ganzhiHanja: '己卯', stemHanja: '己', stemElement: '음토(陰土)', branchHanja: '卯', branchElement: '음목(陰木)',
      character: '비옥한 밭에 솟아난 새싹으로 감각이 민감하고 섬세하며 신중하고 완벽함을 지향합니다.',
      careerFortune: '디자인, 농업/원예, 정밀 기술, 세무, 교육, 의류 등 섬세한 감각을 쏟는 분야가 길함.',
      wealthFortune: '꾸준한 노력과 정직한 재물운을 가지고 있으나 타인과의 보증이나 금전 차용은 금물입니다.',
      romanceAdvice: '자좌 편관의 영향으로 스트레스에 예민할 수 있으니 대범한 마음으로 연인을 대하십시오.',
      healthFortune: '비위장, 척추, 신경통, 피부 알레르기 및 간 기능 관리에 신경 써야 합니다.',
      rawAnalysis: { mulsang: '정원 흙을 뚫고 올라오는 풋풋한 새싹', shipsinSelf: '편관', twelveStar: '병', sinsal: '현침살·구추방가' }
    },
    {
      order: 17, ganzhi: '경진', ganzhiHanja: '庚辰', stemHanja: '庚', stemElement: '양금(陽金)', branchHanja: '辰', branchElement: '양토(陽土)',
      character: '강철 용의 형상으로 배짱이 두텁고 결단력이 뛰어나며 대범한 개척가 심성을 품고 있습니다.',
      careerFortune: '건설, 중공업, 금융, 수사관, 정치가, 대형 사업 등 결단과 승부수가 필요한 분야에 탁월.',
      wealthFortune: '괴강의 기운으로 부귀를 크게 얻을 수 있으나 굴곡이 있을 수 있으니 자산 안배를 철저히.',
      romanceAdvice: '당당하고 의리가 깊으나 자기주장이 강할 수 있으니 부드러운 화법으로 상대방을 배려할 것.',
      healthFortune: '폐, 대장, 피부, 관절 및 갑작스러운 외상/부상 주의가 필요합니다.',
      rawAnalysis: { mulsang: '진흙 속에서 모습을 드러낸 강철 용', shipsinSelf: '편인', twelveStar: '양', sinsal: '괴강살·인수' }
    },
    {
      order: 18, ganzhi: '신사', ganzhiHanja: '辛巳', stemHanja: '辛', stemElement: '음금(陰金)', branchHanja: '巳', branchElement: '양화(陽火)',
      character: '화염 속에서 빛나는 보석으로 세련되고 도덕적이며 깔끔함과 고귀한 명예를 소중히 생각합니다.',
      careerFortune: '외교관, 공직, 귀금속/패션, 금융 컨설팅, 행정가 등 명예롭고 품격 있는 업종에 어울림.',
      wealthFortune: '천을귀인의 덕으로 안정된 수입과 고귀한 보상을 얻으며 무리한 투기보다 안정 투자가 길.',
      romanceAdvice: '용모가 수려하고 품격이 있어 인기가 많으나 완벽주의적 눈높이를 조금 낮출 필요가 있음.',
      healthFortune: '폐, 심장, 시력, 신경계 및 열성 질환 관리에 주의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '불꽃 아래서 아름답게 빛나는 명품 보석', shipsinSelf: '정관', twelveStar: '사', sinsal: '복성귀인·천을귀인' }
    },
    {
      order: 19, ganzhi: '임오', ganzhiHanja: '壬午', stemHanja: '壬', stemElement: '양수(陽水)', branchHanja: '午', branchElement: '양화(陽火)',
      character: '거대한 수류와 뜨거운 불의 조화로 수완이 좋고 사교적이며 뛰어난 재물 감각을 지녔습니다.',
      careerFortune: '무역, 금융, 유통, 엔터테인먼트, 펀드 매니저 등 돈의 흐름과 사람을 연결하는 일에 우수.',
      wealthFortune: '정재 자좌와 암록의 기운으로 은근한 재물복이 지속되며 재테크 감각이 비상하게 발달.',
      romanceAdvice: '이성 매력이 넘치고 조화로우나 들뜬 마음에 다정함이 과해지지 않도록 신의를 지킬 것.',
      healthFortune: '신장, 방광, 심장, 소장 및 수화기제 불균형으로 인한 혈압 관리가 필요.',
      rawAnalysis: { mulsang: '햇살이 부서지는 거대한 호수 표면', shipsinSelf: '정재', twelveStar: '태', sinsal: '비인살·암록' }
    },
    {
      order: 20, ganzhi: '계미', ganzhiHanja: '癸未', stemHanja: '癸', stemElement: '음수(陰水)', branchHanja: '未', branchElement: '음토(陰土)',
      character: '메마른 대지를 적시는 단비로 집념과 인내가 대단하며 반전과 위기 극복 능력이 뛰어납니다.',
      careerFortune: '연구, 기술, 군경, 자원 개척, 의료, 복지 등 험난한 과제를 해결하는 직업에 탁월.',
      wealthFortune: '백호와 편관의 기운을 극복하면 큰 재물을 얻으나 건강과 안전을 담보로 한 투자는 금물.',
      romanceAdvice: '인내심이 깊으나 속마음을 조용히 태울 수 있으니 여유를 갖고 밝게 소통하시길 과제.',
      healthFortune: '신장, 방광, 위장, 췌장 및 스트레스성 신경염 질환 예방에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '가뭄 든 메마른 땅에 내리는 가뭄비', shipsinSelf: '편관', twelveStar: '묘', sinsal: '백호살·현침살' }
    },

    {
      order: 21, ganzhi: '갑신', ganzhiHanja: '甲申', stemHanja: '甲', stemElement: '양목(陽木)', branchHanja: '申', branchElement: '양금(陽金)',
      character: '바위 위에 곧게 선 소나무로 절제력이 강하고 책임감과 결단력이 남다르게 뛰어납니다.',
      careerFortune: '군·경, 검찰, 수사, 철강, 스포츠, 엄격한 규율 조직의 리더 자리에 매우 잘 부합합니다.',
      wealthFortune: '원칙에 기반한 정당한 재물을 얻으며 결단력이 있어 사업적 승부수를 던지기 좋습니다.',
      romanceAdvice: '자기 통제가 강해 무뚝뚝해 보일 수 있으니 부드럽고 다정한 화법으로 애정을 표할 것.',
      healthFortune: '간, 담, 뼈/관절, 두통 및 교통사고/외상 주의가 요구되는 일주입니다.',
      rawAnalysis: { mulsang: '바위 절벽 위 절개를 지키는 소나무', shipsinSelf: '편관', twelveStar: '절', sinsal: '역마살·현침살' }
    },
    {
      order: 22, ganzhi: '을유', ganzhiHanja: '乙酉', stemHanja: '乙', stemElement: '음목(陰木)', branchHanja: '酉', branchElement: '음금(陰金)',
      character: '날카로운 칼날 속에서 피어난 꽃처럼 위기 속에서 고고한 절개와 미적 감각을 나타냅니다.',
      careerFortune: '디자인, 의류, 원예, 세공, 의료(외과), 예술 등 예리한 감각을 발휘하는 일에 길함.',
      wealthFortune: '자신의 세심한 기술과 재능을 통해 실속 있는 재화를 모으나 과도한 위험 투자는 피함.',
      romanceAdvice: '감수성이 풍부하나 자좌 절지의 영향으로 상처받기 쉬우니 대범한 마음가짐이 필요.',
      healthFortune: '간, 담, 신경계, 피부 및 칼/날카로운 도구 사용 시 손상에 주의하십시오.',
      rawAnalysis: { mulsang: '바위 사이에서 결기를 머금고 피어난 들꽃', shipsinSelf: '편관', twelveStar: '절', sinsal: '가곡살·도화살' }
    },
    {
      order: 23, ganzhi: '병술', ganzhiHanja: '丙戌', stemHanja: '丙', stemElement: '양화(陽火)', branchHanja: '戌', branchElement: '양토(陽土)',
      character: '붉은 노을빛 태양의 형상으로 화려함과 동시에 내면의 묵직한 수양과 학문성을 품었습니다.',
      careerFortune: '종교, 철학, 문학, 방송, 종예, 예술, 학술 연구 등 깊이 있는 정신적 가치 분야에 우수.',
      wealthFortune: '식신의 재능으로 의식주가 유여하나 묘지 백호의 기운이 있으니 안전 자산 위주 관리가 길.',
      romanceAdvice: '열정적이나 감정 소비가 빠를 수 있으니 한결같은 신뢰와 차분함으로 연인을 대할 것.',
      healthFortune: '심장, 소장, 위장, 피부 및 소화기 계통 관리에 유의하시는 것이 좋습니다.',
      rawAnalysis: { mulsang: '서산 너머 만산을 물들이는 노을빛 태양', shipsinSelf: '식신', twelveStar: '묘', sinsal: '백호살·화개살' }
    },
    {
      order: 24, ganzhi: '정해', ganzhiHanja: '丁亥', stemHanja: '丁', stemElement: '음화(陰火)', branchHanja: '亥', branchElement: '음수(陰水)',
      character: '칠흑 같은 밤바다를 비추는 등대로 품위가 고결하고 도덕적이며 귀인의 조력이 항상 따릅니다.',
      careerFortune: '공직, 교육, 학술, 외교, 문화 재단, 귀빈 대우를 받는 고품격 서비스 분야에 우수합니다.',
      wealthFortune: '천을귀인 정관의 정당한 명예와 관운을 따라 재물이 자연스럽게 융성하는 길격입니다.',
      romanceAdvice: '품격 있고 다정하여 훌륭한 배우자운을 지녔으나 소극적인 태도를 극복하고 마음을 표할 것.',
      healthFortune: '심장, 시력, 신장, 방광 및 수화교제 관련 호르몬 균형 유지에 힘쓰십시오.',
      rawAnalysis: { mulsang: '캄캄한 칠흑 밤바다를 밝히는 인자한 등대', shipsinSelf: '정관', twelveStar: '태', sinsal: '천을귀인·천문성' }
    },
    {
      order: 25, ganzhi: '무자', ganzhiHanja: '戊子', stemHanja: '戊', stemElement: '양토(陽土)', branchHanja: '子', branchElement: '양수(陽水)',
      character: '넓은 태산과 맑은 호수의 만남으로 알뜰하고 성실하며 비상한 금전 감각을 갖추고 있습니다.',
      careerFortune: '금융, 은행, 회계, 부동산, 자산 관리, 유통 등 자금과 자산을 정밀히 다루는 업에 최적.',
      wealthFortune: '자좌 정재와 재고 기운으로 재물 축적 능력이 탁월하며 평생 돈 가뭄이 드물고 풍요롭습니다.',
      romanceAdvice: '알뜰하고 성실하나 너무 실속만 따지면 삭막해질 수 있으니 베푸는 다정함을 보여줄 것.',
      healthFortune: '위장, 비장, 신장, 방광 및 허리/요통 관리에 주의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '태산 아래 맑고 깊게 고인 호수', shipsinSelf: '정재', twelveStar: '태', sinsal: '육수살·재고귀인' }
    },
    {
      order: 26, ganzhi: '기축', ganzhiHanja: '己丑', stemHanja: '己', stemElement: '음토(陰土)', branchHanja: '丑', branchElement: '음토(陰土)',
      character: '동지 지나 새싹을 잉태한 땅처럼 우직하고 깊은 성실함과 은근한 고집을 간직하고 있습니다.',
      careerFortune: '농업, 축산, 학술 연구, 역사, 인문학, 부동산, 종교 등 묵묵히 뿌리내리는 업종에 길합니다.',
      wealthFortune: '성실하고 끈기 있게 모은 재산으로 자수성가하며, 후반으로 갈수록 자산 가치가 빛을 발함.',
      romanceAdvice: '자기표현이 다소 서툴 수 있으나 진실함이 무기이므로 다정한 따뜻한 표현을 늘릴 것.',
      healthFortune: '소화기계, 췌장, 관절, 냉증 및 피부 질환 보양에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '봄을 기다리며 씨앗을 품고 있는 비옥한 논밭', shipsinSelf: '비견', twelveStar: '묘', sinsal: '정록·화개살' }
    },
    {
      order: 27, ganzhi: '경인', ganzhiHanja: '庚寅', stemHanja: '庚', stemElement: '양금(陽金)', branchHanja: '寅', branchElement: '양목(陽木)',
      character: '호랑이의 용맹함과 강철의 결단력으로 개척 정신이 강하고 대범한 사업적 성과를 이룹니다.',
      careerFortune: '무역, 글로벌 비즈니스, 건설, 사업가, 금융 투자 등 활동 범위를 크게 펼치는 일에 우수.',
      wealthFortune: '편재의 강렬한 재운으로 큰돈을 만질 수 있으나 급격한 지출이나 조급 투자는 경계할 것.',
      romanceAdvice: '호방하고 다정하나 성격이 급할 수 있으니 상대방의 의견을 끝까지 듣는 배려가 필요.',
      healthFortune: '폐, 대장, 간, 담 및 신경통, 관절통 부상 예방에 신경 써야 합니다.',
      rawAnalysis: { mulsang: '울창한 숲속을 가르는 날카로운 보검과 호랑이', shipsinSelf: '편재', twelveStar: '절', sinsal: '역마살·태극귀인' }
    },
    {
      order: 28, ganzhi: '신묘', ganzhiHanja: '辛卯', stemHanja: '辛', stemElement: '음금(陰金)', branchHanja: '卯', branchElement: '음목(陰木)',
      character: '날카로운 칼날과 토끼의 민첩함으로 재치가 뛰어나고 실속을 정확하게 가려내는 센스 보유.',
      careerFortune: '의료(치과/외과), 디자인, 세공, IT 소프트웨어, 재무 분석 등 정교한 작업에 최적.',
      wealthFortune: '재치 있는 수완으로 재물을 모으나 예민한 신경으로 스트레스를 받을 수 있으니 여유를 지님.',
      romanceAdvice: '매력적이나 이성에게 까칠하게 비칠 수 있으니 포용력과 온화한 다정함을 갖추십시오.',
      healthFortune: '폐, 기관지, 간 기능, 피부 알레르기 및 손발 부상에 유의하십시오.',
      rawAnalysis: { mulsang: '정교한 가위로 아름다운 화초를 정듬는 모습', shipsinSelf: '편재', twelveStar: '절', sinsal: '현침살·문곡귀인' }
    },
    {
      order: 29, ganzhi: '임진', ganzhiHanja: '壬辰', stemHanja: '壬', stemElement: '양수(陽水)', branchHanja: '辰', branchElement: '양토(陽土)',
      character: '거대한 물과 용의 만남으로 포용력이 넓고 카리스마와 대범한 조직 리더십이 당당합니다.',
      careerFortune: '정치, 행정, 수자원, 해운, 대기업 경영, 수사기관 등 거대한 무대에서 장수로 활약.',
      wealthFortune: '괴강과 수고의 기운으로 대재를 모을 잠재력이 크나 리스크 관리에 각별히 유의하십시오.',
      romanceAdvice: '리더십이 있어 듬직하나 감정 기복이 클 수 있으니 연인에게 온화한 대화와 위로를 건넬 것.',
      healthFortune: '신장, 방광, 위장, 피부 및 수해/안전사고 예방이 요구됩니다.',
      rawAnalysis: { mulsang: '거대한 강물 속에서 승천을 기다리는 용', shipsinSelf: '편관', twelveStar: '묘', sinsal: '괴강살·수고귀인' }
    },
    {
      order: 30, ganzhi: '계사', ganzhiHanja: '癸巳', stemHanja: '癸', stemElement: '음수(陰水)', branchHanja: '巳', branchElement: '양화(陽火)',
      character: '맑은 단비와 태양의 조화로 지혜롭고 수완이 뛰어나며 안팎으로 존경과 사랑을 받습니다.',
      careerFortune: '외교, 금융, 공직, 학술, 유통, 컨설팅 등 지성과 사교성을 고루 발휘하는 업에 최적.',
      wealthFortune: '천을귀인 자좌와 정재/정관의 조화로 평생 재물 복록이 무궁하고 차곡차곡 유산을 쌓아감.',
      romanceAdvice: '배우자 복이 매우 훌륭하며 서로를 아껴주나 완벽한 관계에 대한 집착은 내려놓을 것.',
      healthFortune: '신장, 방광, 심장, 혈관 및 안과 질환 관리에 주의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '따스한 태양 햇살 아래 내리는 단비', shipsinSelf: '정재', twelveStar: '사', sinsal: '천을귀인·복성귀인' }
    },

    {
      order: 31, ganzhi: '갑오', ganzhiHanja: '甲午', stemHanja: '甲', stemElement: '양목(陽木)', branchHanja: '午', branchElement: '양화(陽火)',
      character: '달리는 푸른 말처럼 역동적이며 자기표현력이 화려하고 솔직담백하며 재능이 넘쳐납니다.',
      careerFortune: '예술, 연예, 방송, 벤처, 강사, 스포츠, 디자인 등 창의적 에너지를 발산하는 직업에 길.',
      wealthFortune: '자신의 화려한 재능과 활동력으로 재화를 벌어들이나 기분에 따른 충동 지출을 삼가야 함.',
      romanceAdvice: '홍염과 도화의 매력으로 인기가 대단하나 조급한 감정 표출은 오해를 부르니 절제 필요.',
      healthFortune: '간, 담, 심장, 신경 과로 및 호흡기 계통 관리에 유념하십시오.',
      rawAnalysis: { mulsang: '초원을 거침없이 달리는 푸른 야생마', shipsinSelf: '상관', twelveStar: '사', sinsal: '홍염살·도화살' }
    },
    {
      order: 32, ganzhi: '을미', ganzhiHanja: '乙未', stemHanja: '乙', stemElement: '음목(陰木)', branchHanja: '未', branchElement: '음토(陰土)',
      character: '푸른 초원의 순한 양으로 알뜰하고 생활력이 강하며 특유의 온화한 친화력이 돋보입니다.',
      careerFortune: '부동산, 금융, 건축 인테리어, 원예, 복지, 서비스 등 알뜰한 실속을 차리는 일에 우수.',
      wealthFortune: '백호살과 재고 기운으로 큰 재물을 축적할 수 있는 바탕을 지녔으나 무리한 투자는 삼갈 것.',
      romanceAdvice: '다정다감하고 헌신적이나 내면의 굳은 고집이 있으니 연인과의 타협이 화목의 열쇠.',
      healthFortune: '간, 담, 위장, 관절, 피부 및 췌장 건강관리에 신경 쓰시는 것이 길함.',
      rawAnalysis: { mulsang: '푸른 초목이 우거진 들판의 순한 양', shipsinSelf: '편재', twelveStar: '양', sinsal: '백호살·목고귀인' }
    },
    {
      order: 33, ganzhi: '병신', ganzhiHanja: '丙申', stemHanja: '丙', stemElement: '양화(陽火)', branchHanja: '申', branchElement: '양금(陽金)',
      character: '태양과 은빛 원석의 만남으로 수완이 비상하고 사교적이며 두뇌 회전과 행동력이 빠릅니다.',
      careerFortune: '무역, 금융, IT, 방송, 마케팅, 펀드, 유통 등 변화무쌍하고 다이내믹한 산업에 최적.',
      wealthFortune: '문창과 편재의 조합으로 재물적 직관과 수완이 매우 뛰어나 문무를 겸비한 부를 형성.',
      romanceAdvice: '밝고 사교적이어 이성 인기가 높으나 지나친 활동성으로 가정이 소외되지 않도록 주의.',
      healthFortune: '심장, 소장, 폐, 대장 및 역마로 인한 안전사고 예방이 요구됩니다.',
      rawAnalysis: { mulsang: '은빛 암석 산 위로 떠오른 붉은 태양', shipsinSelf: '편재', twelveStar: '병', sinsal: '역마살·문창귀인' }
    },
    {
      order: 34, ganzhi: '정유', ganzhiHanja: '丁酉', stemHanja: '丁', stemElement: '음화(陰火)', branchHanja: '酉', branchElement: '음금(陰金)',
      character: '촛불과 보석의 만남으로 세련되고 섬세하며 정교한 미적 감각과 귀인의 조력이 함께합니다.',
      careerFortune: '보석/패션, 세무, 디자인, 의학(성형/치과), 귀빈 응대, 학술 등 세련된 분야에서 성공.',
      wealthFortune: '천을귀인 자좌 정재로 평생 은근한 금전 복록이 따르며 정당한 자산 가치가 크게 상승함.',
      romanceAdvice: '용모가 단정하고 품격이 있어 좋은 인연을 만나나 예민한 성격을 조금 완화할 필요가 있음.',
      healthFortune: '심장, 시력, 폐, 대장 및 신경성 스트레스 질환 예방에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '빛나는 보석 겉면을 조용히 비추는 촛불', shipsinSelf: '편재', twelveStar: '장생', sinsal: '천을귀인·학당귀인' }
    },
    {
      order: 35, ganzhi: '무술', ganzhiHanja: '戊戌', stemHanja: '戊', stemElement: '양토(陽土)', branchHanja: '戌', branchElement: '양토(陽土)',
      character: '신의가 두텁고 신념이 강하며 대단한 포용력과 묵직한 카리스마를 품고 있습니다.',
      careerFortune: '정치, 종교, 군·경, 토목, 대기업 경영, 부동산 등 중후한 카리스마가 요구되는 직에 부합.',
      wealthFortune: '괴강의 강렬한 주관으로 스스로 부를 개척하나 고집으로 인한 투자 손실을 경계할 것.',
      romanceAdvice: '신의가 깊고 듬직하나 표현이 다소 경직될 수 있으니 솔직하고 따뜻한 미소로 연인을 대함.',
      healthFortune: '위장, 십이지장, 척추, 피부 및 소화기 질환 보양에 신경 써야 합니다.',
      rawAnalysis: { mulsang: '가을 단풍으로 물든 웅장한 태산', shipsinSelf: '비견', twelveStar: '묘', sinsal: '괴강살·화개살' }
    },
    {
      order: 36, ganzhi: '기해', ganzhiHanja: '己亥', stemHanja: '己', stemElement: '음토(陰土)', branchHanja: '亥', branchElement: '음수(陰水)',
      character: '비옥한 대지와 강물의 만남으로 다정다감하고 평화로우며 재물과 인복이 대단히 안정적입니다.',
      careerFortune: '금융, 행정, 무역, 부동산, 농수산 유통, 교육 등 차분한 인품을 바탕으로 하는 일에 길.',
      wealthFortune: '자좌 정재와 암관의 기운으로 성실하게 부를 축적하며 노후 자산이 풍족한 길격입니다.',
      romanceAdvice: '다정하고 안정적인 애정관을 지녔으나 지나친 기우나 의구심을 버리고 믿음을 갖출 것.',
      healthFortune: '비위장, 췌장, 신장, 방광 및 냉증 관련 질환 예방에 유의하십시오.',
      rawAnalysis: { mulsang: '거대한 강물을 감싸 안은 따뜻한 논밭', shipsinSelf: '정재', twelveStar: '태', sinsal: '천문성·의처/의부' }
    },
    {
      order: 37, ganzhi: '경자', ganzhiHanja: '庚子', stemHanja: '庚', stemElement: '양금(陽金)', branchHanja: '子', branchElement: '양수(陽水)',
      character: '맑은 수면에 비친 칼날처럼 언변이 뛰어나고 논리적이며 비상한 완벽주의를 추구합니다.',
      careerFortune: '언론, 평론, 연구, IT, 기획, 방송, 법률 상담 등 sharp한 논리와 언변을 쓰는 분야에 탁월.',
      wealthFortune: '재능과 언변으로 부를 형성하나 수생목의 흐름을 잘 살려 실속 자산으로 전환하는 것이 중요.',
      romanceAdvice: '도화와 상관의 조화로 인기가 높으나 가시 돋친 언변은 상처를 줄 수 있으니 칭찬을 건넬 것.',
      healthFortune: '폐, 대장, 신장, 방광 및 치아 건강과 호흡기 질환 관리가 필요.',
      rawAnalysis: { mulsang: '청정한 샘물에 깨끗이 씻긴 날카로운 보검', shipsinSelf: '상관', twelveStar: '사', sinsal: '상관도화·태극귀인' }
    },
    {
      order: 38, ganzhi: '신축', ganzhiHanja: '辛丑', stemHanja: '辛', stemElement: '음금(陰金)', branchHanja: '丑', branchElement: '음토(陰土)',
      character: '보석과 차가운 흙의 조화로 장인 정신이 우수하고 정밀한 분야에 뛰어난 집중력을 보입니다.',
      careerFortune: '전문 기술, 연구, 의약, 세무, 치기공, 문화재 보존 등 철저한 전문직에 부합합니다.',
      wealthFortune: '성실하고 알뜰한 자산 관리를 보여주나 효신의 기운으로 자금 융통에 신중함이 요구됨.',
      romanceAdvice: '내면의 외로움이 있을 수 있으니 마음의 문을 열고 상대를 포용하는 낙천성을 배울 것.',
      healthFortune: '폐, 기관지, 위장, 관절 및 수족냉증 관리에 각별히 신경 쓰십시오.',
      rawAnalysis: { mulsang: '겨울 흙 속에서 빛을 기다리는 다이아몬드', shipsinSelf: '편인', twelveStar: '양', sinsal: '효신살·금고귀인' }
    },
    {
      order: 39, ganzhi: '임인', ganzhiHanja: '壬寅', stemHanja: '壬', stemElement: '양수(陽水)', branchHanja: '寅', branchElement: '양목(陽木)',
      character: '거대한 바다와 호랑이의 만남으로 호방하고 아이디어가 샘솟으며 의식주 복록이 넘칩니다.',
      careerFortune: '무역, 글로벌 마케팅, 사업가, 컨설팅, 교육, 외식업 등 넓은 분야에서 탁월한 수완 발휘.',
      wealthFortune: '식신 문창과 암록의 기운으로 평생 먹고사는 재물 걱정이 드물고 기회를 잘 사로잡음.',
      romanceAdvice: '호방하고 다정하여 연인에게 활력을 주나 분주한 활동으로 관계가 소원해지지 않게 챙길 것.',
      healthFortune: '신장, 방광, 간, 담 및 과로로 인한 간기능 보호에 힘쓰십시오.',
      rawAnalysis: { mulsang: '새벽 숲속을 당당히 가르는 거대한 강물과 호랑이', shipsinSelf: '식신', twelveStar: '병', sinsal: '문창귀인·암록' }
    },
    {
      order: 40, ganzhi: '계묘', ganzhiHanja: '癸卯', stemHanja: '癸', stemElement: '음수(陰水)', branchHanja: '卯', branchElement: '음목(陰木)',
      character: '맑은 이슬과 귀여운 토끼로 심성이 순수하고 고결하며 대인관계 인기가 매우 높습니다.',
      careerFortune: '예술, 디자인, 교육, 아동 복지, 의료, 언론, 디자인 등 온화하고 미적인 분야에 최적.',
      wealthFortune: '천을귀인 식신의 길기로 평생 귀인의 도움과 안정적 재복이 지속되는 축복받은 일주입니다.',
      romanceAdvice: '순수하고 다정하여 사랑을 받으나 타인에게 지나치게 기대기보다 스스로 주체성을 기를 것.',
      healthFortune: '신장, 자궁, 간, 신경통 및 알레르기 예방에 유의하시는 것이 길함.',
      rawAnalysis: { mulsang: '봄날 돋아난 난초 잎에 맺힌 정결한 아침 이슬', shipsinSelf: '식신', twelveStar: '장생', sinsal: '천을귀인·복성귀인' }
    },

    {
      order: 41, ganzhi: '갑진', ganzhiHanja: '甲辰', stemHanja: '甲', stemElement: '양목(陽木)', branchHanja: '辰', branchElement: '양토(陽土)',
      character: '청룡의 기세와 울창한 숲으로 사업가적 수완이 대단하고 카리스마와 배짱이 두텁습니다.',
      careerFortune: '부동산, 금융, 건설, 사업가, 대형 유통, 리더직 등 규모가 큰 사업을 이끄는 자리에 우수.',
      wealthFortune: '백호살과 편재의 기운으로 큰 재물을 형성하는 재능이 탁월하나 무리한 확장 투자는 지양.',
      romanceAdvice: '듬직하고 능력이 있으나 독단적인 태도로 연인을 서운하게 하지 않도록 조심하십시오.',
      healthFortune: '간, 쓸개, 위장, 관절 및 스트레스성 소화 장애 보양에 힘쓰십시오.',
      rawAnalysis: { mulsang: '울창한 숲 위로 당당히 승천하는 청룡', shipsinSelf: '편재', twelveStar: '쇠', sinsal: '백호살·덕령' }
    },
    {
      order: 42, ganzhi: '을사', ganzhiHanja: '乙巳', stemHanja: '乙', stemElement: '음목(陰木)', branchHanja: '巳', branchElement: '양화(陽火)',
      character: '화려한 꽃과 뱀의 조화로 자기표현력이 뛰어나며 센스와 감각적인 매력이 독보적입니다.',
      careerFortune: '패션, 디자인, 연예, 홍보, 마케팅, 강사, 외교 등 자신을 화려하게 드러내는 일에 최적.',
      wealthFortune: '자신의 감각과 표현력으로 빠른 재물을 모으나 소비 성향이 높을 수 있으니 저축에 힘쓸 것.',
      romanceAdvice: '목욕도화의 매력으로 이성을 매료시키나 언행의 가벼움을 경계하고 진중함을 유지할 것.',
      healthFortune: '간, 담, 심장, 안과 질환 및 신경성 과로에 유념하시는 것이 좋습니다.',
      rawAnalysis: { mulsang: '화려하게 피어난 꽃밭을 지나는 지혜로운 뱀', shipsinSelf: '상관', twelveStar: '목욕', sinsal: '목욕도화·학당귀인' }
    },
    {
      order: 43, ganzhi: '병오', ganzhiHanja: '丙午', stemHanja: '丙', stemElement: '양화(陽火)', branchHanja: '午', branchElement: '양화(陽火)',
      character: '정열적인 붉은 말처럼 추진력과 자신감이 천하를 호령할 만큼 강렬하고 솔직합니다.',
      careerFortune: '정치, 리더, 군경, 무역, 스포츠, 벤처 사업가 등 강인한 에너지를 쏟는 분야에서 대성.',
      wealthFortune: '양인살의 강렬한 승부사 기질로 성취가 크나 손실 위험도 존재하므로 분산 투자가 필수.',
      romanceAdvice: '열정이 넘치나 불같은 성격으로 마찰이 생길 수 있으니 차분함과 겸손함으로 상대를 대함.',
      healthFortune: '심장, 소장, 혈압, 눈 건강 및 급성 염증 질환 관리에 각별히 유의.',
      rawAnalysis: { mulsang: '한여름 대지를 강렬하게 비추는 조양과 붉은 말', shipsinSelf: '겁재', twelveStar: '제왕', sinsal: '양인살·홍염살' }
    },
    {
      order: 44, ganzhi: '정미', ganzhiHanja: '丁未', stemHanja: '丁', stemElement: '음화(陰火)', branchHanja: '未', branchElement: '음토(陰土)',
      character: '모닥불과 온화한 양의 조화로 인정이 깊고 정직하며 헌신적인 따뜻함을 지녔습니다.',
      careerFortune: '교육, 사회복지, 외식업, 종교, 상담, 예술 등 타인에게 따뜻함을 전하는 직업에 우수.',
      wealthFortune: '정록과 식신의 길기로 먹고사는데 풍요로우나 타인을 돕다가 손해 보지 않도록 경계.',
      romanceAdvice: '헌신적이고 따뜻하나 상대방에게 과도한 배려를 쏟다 상처받지 않게 자아 중심을 유지.',
      healthFortune: '심장, 위장, 췌장, 관절 및 수분 부족/체력 저하 예방에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '따사로운 모닥불 옆에서 휴식을 취하는 양', shipsinSelf: '식신', twelveStar: '관대', sinsal: '정록·화개살' }
    },
    {
      order: 45, ganzhi: '무신', ganzhiHanja: '戊申', stemHanja: '戊', stemElement: '양토(陽土)', branchHanja: '申', branchElement: '양금(陽金)',
      character: '거대한 암석과 베푸는 마음의 조화로 식복이 풍족하고 활동 범위가 넓고 능수능란합니다.',
      careerFortune: '무역, 토목/건설, 유통, 식음료, 문창 관련 학술, 마케팅 등 유기적인 사업에 탁월.',
      wealthFortune: '문창 식신의 복록으로 평생 재물 운이 끊이지 않으나 이동수가 크므로 과도한 지출 유의.',
      romanceAdvice: '활동적이고 친절하나 외부 활동이 많아 집안에 소홀할 수 있으니 가정 충실에 힘쓸 것.',
      healthFortune: '위장, 비장, 폐, 대장 및 역마 관련 부상 주의가 필요합니다.',
      rawAnalysis: { mulsang: '단단한 암석 산 속에서 흘러나오는 옥수', shipsinSelf: '식신', twelveStar: '병', sinsal: '문창귀인·역마살' }
    },
    {
      order: 46, ganzhi: '기유', ganzhiHanja: '己酉', stemHanja: '己', stemElement: '음토(陰土)', branchHanja: '酉', branchElement: '음금(陰金)',
      character: '황금 들녘의 곡식처럼 성실하고 정직하며 자신의 재능을 정밀하게 세상에 드러냅니다.',
      careerFortune: '교육, 세무, 금융, 식품, 정밀 기술, 연구, 예술 등 고도의 세심함이 필요한 분야에 부합.',
      wealthFortune: '식신 장생의 길기로 알뜰하게 자산을 불려 가며 노후로 갈수록 자산 안정성이 매우 높음.',
      romanceAdvice: '성실하고 깔끔한 매력을 보이나 완벽을 요구하면 마찰이 생기니 부드러운 순응이 필요.',
      healthFortune: '비위장, 췌장, 폐, 기관지 및 피부 건강 관리에 유념하십시오.',
      rawAnalysis: { mulsang: '결실을 맺은 풍요로운 황금 들녘', shipsinSelf: '식신', twelveStar: '장생', sinsal: '학당귀인·문곡귀인' }
    },
    {
      order: 47, ganzhi: '경술', ganzhiHanja: '庚戌', stemHanja: '庚', stemElement: '양금(陽金)', branchHanja: '戌', branchElement: '양토(陽土)',
      character: '의리와 지조가 남다르고 강직하며 묵직한 수양과 카리스마를 고루 겸비하고 있습니다.',
      careerFortune: '법조, 군경, 수사, 종교, 공직, 대형 관리직 등 엄격한 정의감과 권위가 필요한 조직에 최적.',
      wealthFortune: '괴강과 인수의 결합으로 자수성가하여 중년 이후 큰 자산을 모으나 고집 투자는 지양.',
      romanceAdvice: '의리가 깊고 듬직하나 표현이 다소 딱딱할 수 있으니 부드럽고 다정한 언어를 쓸 것.',
      healthFortune: '폐, 대장, 위장, 척추/관절 및 심혈관 질환에 주의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '가을 태산 아래 웅장하게 서 있는 강철 파수꾼', shipsinSelf: '편인', twelveStar: '쇠', sinsal: '괴강살·금여록' }
    },
    {
      order: 48, ganzhi: '신해', ganzhiHanja: '辛亥', stemHanja: '辛', stemElement: '음금(陰金)', branchHanja: '亥', branchElement: '음수(陰水)',
      character: '보석을 맑은 물로 씻어내는 형상으로 자태가 세련되었고 지혜와 미적 센스가 드높습니다.',
      careerFortune: '예술, 디자인, 어학, 무역, 세공, 상담, 학술 연구 등 세련된 감각의 전문 분야에 우수.',
      wealthFortune: '자신의 뛰어난 재능으로 금전을 창출하나 유동성이 크므로 안전자산으로 차곡차곡 축적할 것.',
      romanceAdvice: '용모가 세련되고 인기 많으나 언변이 가시가 될 수 있으니 다정한 따뜻함으로 대할 것.',
      healthFortune: '폐, 기관지, 신장, 방광 및 수족냉증 관리에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '맑고 깊은 호수 물속에서 씻겨 나오는 다이아몬드', shipsinSelf: '상관', twelveStar: '목욕', sinsal: '금여록·태극귀인' }
    },
    {
      order: 49, ganzhi: '임자', ganzhiHanja: '壬子', stemHanja: '壬', stemElement: '양수(陽水)', branchHanja: '子', branchElement: '양수(陽水)',
      character: '도도하게 흐르는 거대한 바다의 형상으로 주체성이 막강하고 담대한 리더십을 갖추었습니다.',
      careerFortune: '글로벌 사업, 정치, 대기업 경영, 수산/물류, 수자원, 연구소 등 커다란 무대에 어울림.',
      wealthFortune: '양인살의 스케일로 큰 자산을 만질 수 있으나 굴곡을 방지하기 위해 분산 자산 관리가 필수.',
      romanceAdvice: '당당하고 듬직하나 주관이 너무 강할 수 있으니 연인의 의견에 경청하는 유연함이 필요.',
      healthFortune: '신장, 방광, 혈액 순환, 전립선/자궁 및 수해 관련 안전 주의가 필요.',
      rawAnalysis: { mulsang: '밤하늘 아래 끊임없이 소용돌이치는 거대한 도강', shipsinSelf: '겁재', twelveStar: '제왕', sinsal: '양인살·홍염살' }
    },
    {
      order: 50, ganzhi: '계축', ganzhiHanja: '癸丑', stemHanja: '癸', stemElement: '음수(陰水)', branchHanja: '丑', branchElement: '음토(陰土)',
      character: '겨울 눈보라 속 암석처럼 인내와 집념이 대단하며 위기를 딛고 일어서는 반전의 힘 보유.',
      careerFortune: '의료, 군경, 수사, 자원 연구, 세무, 농업 등 험난한 과제를 인내로 해결하는 업에 길함.',
      wealthFortune: '백호 편관의 시련을 극복하고 강력한 재포를 형성하나 유연한 자금 융통 계획이 요구됨.',
      romanceAdvice: '집념이 강하고 진실하나 예민해질 수 있으니 긍정적이고 낙천적인 마음으로 연인을 대함.',
      healthFortune: '신장, 방광, 위장, 관절 및 신경통/냉증 보양에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '동토의 겨울 땅에 내리는 매서운 눈보라', shipsinSelf: '편관', twelveStar: '쇠', sinsal: '백호살·암록' }
    },

    {
      order: 51, ganzhi: '갑인', ganzhiHanja: '甲寅', stemHanja: '甲', stemElement: '양목(陽木)', branchHanja: '寅', branchElement: '양목(陽木)',
      character: '우뚝 솟은 큰 소나무처럼 직진성이 강하고 정직하며 당당한 주체성을 지니고 있습니다.',
      careerFortune: '교육, 목재/건축, 벤처 리더, 기획, 스포츠, 언론 등 주도적으로 이끄는 일에 탁월.',
      wealthFortune: '건록의 자립 기운으로 스스로 부를 일구며 자수성가하나 지나친 고집 투자는 삼갈 것.',
      romanceAdvice: '정직하고 듬직하나 타협이 어려울 수 있으니 상대방을 위해 한 걸음 양보하는 지혜 필요.',
      healthFortune: '간, 쓸개, 신경계, 척추 및 고혈압 질환 관리에 주의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '울창하게 우뚝 솟아오른 웅장한 대숲과 소나무', shipsinSelf: '비견', twelveStar: '제왕', sinsal: '건록·학당귀인' }
    },
    {
      order: 52, ganzhi: '을묘', ganzhiHanja: '乙卯', stemHanja: '乙', stemElement: '음목(陰木)', branchHanja: '卯', branchElement: '음목(陰木)',
      character: '봄날의 푸른 풀밭처럼 적응력과 생활력이 강하며 끈질긴 인내심과 유연함이 돋보입니다.',
      careerFortune: '원예, 디자인, 의류, 교육, 유통, 상담, 예체능 등 부드러운 매력을 살리는 업종에 최적.',
      wealthFortune: '알뜰한 인내와 수완으로 차곡차곡 금전을 모으나 타인과의 금전 보증은 피해야 함.',
      romanceAdvice: '다정하고 적응력이 높으나 우유부단해질 수 있으니 명확한 의사 표현을 하는 것이 길.',
      healthFortune: '간, 담, 신경통, 손발 부상 및 피부 알레르기 예방에 유념하십시오.',
      rawAnalysis: { mulsang: '봄기운을 받아 무성하게 피어난 들판의 야생화', shipsinSelf: '비견', twelveStar: '제왕', sinsal: '건록·구추방가' }
    },
    {
      order: 53, ganzhi: '병진', ganzhiHanja: '丙辰', stemHanja: '丙', stemElement: '양화(陽火)', branchHanja: '辰', branchElement: '양토(陽土)',
      character: '솟아오르는 태양과 용의 조화로 희망차고 다정하며 대단한 포용력과 활력을 안겨줍니다.',
      careerFortune: '방송, 언론, 교육, 행정, 종교, 문화 사업 등 대중에게 희망을 전하는 분야에서 성취.',
      wealthFortune: '식신의 재능으로 의식주가 유여하며 수완이 좋아 넉넉하고 안정적인 재운을 유지합니다.',
      romanceAdvice: '희망차고 다정하여 귀인 인연이 많으나 행동의 품격을 유지하고 신뢰를 쌓아갈 것.',
      healthFortune: '심장, 소장, 위장, 피부 및 소화기계 건강관리에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '비옥한 습지 위로 찬란히 떠오르는 아침 태양', shipsinSelf: '식신', twelveStar: '관대', sinsal: '관대·관귀학관' }
    },
    {
      order: 54, ganzhi: '정사', ganzhiHanja: '丁巳', stemHanja: '丁', stemElement: '음화(陰火)', branchHanja: '巳', branchElement: '양화(陽火)',
      character: '타오르는 뜨거운 불꽃의 상으로 정열과 에너지가 넘치고 거침없는 솔직함을 보여줍니다.',
      careerFortune: '연예, 예술, 전기/전자, IT, 마케팅, 스포츠, 렌탈 등 열정을 쏟아붓는 일에 탁월.',
      wealthFortune: '건록 겁재의 기운으로 성취력이 비상하나 솔직하고 급한 지출을 삼가고 알뜰히 축적할 것.',
      romanceAdvice: '열정적이고 솔직하나 감정이 조급해지면 다툼이 생기니 차분한 관조가 화합의 열쇠.',
      healthFortune: '심장, 소장, 시력, 혈관 및 화상/열성 질환에 주의하십시오.',
      rawAnalysis: { mulsang: '세상을 눈부시게 밝히는 뜨거운 횃불', shipsinSelf: '겁재', twelveStar: '제왕', sinsal: '건록·구추방가' }
    },
    {
      order: 55, ganzhi: '무오', ganzhiHanja: '戊午', stemHanja: '戊', stemElement: '양토(陽土)', branchHanja: '午', branchElement: '양화(陽火)',
      character: '넓은 들판과 태양의 열기로 학문적 포용력이 깊고 존재감이 묵직하며 신의가 두텁습니다.',
      careerFortune: '학자, 공직, 대기업 임원, 토목/부동산, 종교, 복지 등 묵직한 영향력을 갖는 업에 최적.',
      wealthFortune: '양인 정인의 조화로 문서를 통한 부동산 재운이 강하나 타인과의 주체성 갈등은 경계.',
      romanceAdvice: '듬직하나 은근히 고집스러울 수 있으니 따뜻하고 융통성 있는 화법으로 다가갈 것.',
      healthFortune: '위장, 췌장, 심장, 혈압 및 피부 염증 예방에 유의하시는 것이 길합니다.',
      rawAnalysis: { mulsang: '한여름 뜨거운 열기를 머금은 거대한 광야', shipsinSelf: '정인', twelveStar: '제왕', sinsal: '양인살·태극귀인' }
    },
    {
      order: 56, ganzhi: '기미', ganzhiHanja: '己未', stemHanja: '己', stemElement: '음토(陰土)', branchHanja: '未', branchElement: '음토(陰土)',
      character: '두터운 흙과 양의 만남으로 자립심이 강하고 우직하며 약속을 생명처럼 소중히 지킵니다.',
      careerFortune: '부동산, 농업, 건축, 교육, 행정, 정밀 기술 등 성실함이 최고의 자산이 되는 분야에 길.',
      wealthFortune: '건록의 기운으로 성실히 재산을 모으나 고집으로 인한 투자 위험을 삼가는 지혜가 필요.',
      romanceAdvice: '우직하고 성실하나 표현이 다소 투박할 수 있으니 자상한 언어로 마음을 표현하십시오.',
      healthFortune: '비위장, 척추, 소화기계 및 수분 부족 관련 건강 보양에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '단단하고 따뜻하게 굳어진 비옥한 토양', shipsinSelf: '비견', twelveStar: '관대', sinsal: '건록·양인살' }
    },
    {
      order: 57, ganzhi: '경신', ganzhiHanja: '庚申', stemHanja: '庚', stemElement: '양금(陽金)', branchHanja: '申', branchElement: '양금(陽金)',
      character: '거대한 바위와 강철의 조화로 의리가 넘치고 강직하며 결단력이 칼처럼 확실합니다.',
      careerFortune: '군경, 검찰, 수사, 철강, 스포츠, 금융, 기계 엔지니어 등 강렬한 결단직에 부합.',
      wealthFortune: '건록의 힘으로 스스로 재물을 당당히 일구며 명예를 지킬 때 재운도 함께 승상함.',
      romanceAdvice: '의리가 깊으나 경직된 태도는 상대를 위축시킬 수 있으니 온화한 미소를 띨 것.',
      healthFortune: '폐, 대장, 뼈/관절, 두통 및 외상/교통 안전에 각별히 유의하십시오.',
      rawAnalysis: { mulsang: '절벽 위에 자리 잡은 웅장한 바위와 강철', shipsinSelf: '비견', twelveStar: '제왕', sinsal: '건록·태극귀인' }
    },
    {
      order: 58, ganzhi: '신유', ganzhiHanja: '辛酉', stemHanja: '辛', stemElement: '음금(陰金)', branchHanja: '酉', branchElement: '음금(陰金)',
      character: '정교하게 깎인 보석으로 깔끔하고 완벽을 추구하며 사람을 이끄는 도화 매력 보유.',
      careerFortune: '세공, 패션, 의료(치과/성형), 세무, 귀금속, 음악/예술 등 완벽한 섬세함이 요구되는 일.',
      wealthFortune: '자신의 독보적 기술과 전문성으로 고귀한 재화를 창출하며 체계적으로 자산을 관리.',
      romanceAdvice: '도화 매력으로 인기가 높으나 지나치게 날카로운 기준은 내려놓고 용납할 것.',
      healthFortune: '폐, 기관지, 피부, 신경성 염증 및 치아 건강 보양에 힘쓰십시오.',
      rawAnalysis: { mulsang: '정교한 가공을 거쳐 빛나는 완벽한 보옥', shipsinSelf: '비견', twelveStar: '제왕', sinsal: '건록·도화살' }
    },
    {
      order: 59, ganzhi: '임술', ganzhiHanja: '壬戌', stemHanja: '壬', stemElement: '양수(陽水)', branchHanja: '戌', branchElement: '양토(陽土)',
      character: '깊은 호수와 밤의 파수꾼으로 직관이 예리하고 책임감과 사명감이 매우 막중합니다.',
      careerFortune: '수사, 종교, 군경, 무역, IT, 안전 관리, 학술 연구 등 깊이 있는 과제를 이끄는 업에 길.',
      wealthFortune: '백호살과 수고의 자좌로 거대한 부를 형성할 힘이 있으나 기복을 줄이는 안정을 지향.',
      romanceAdvice: '책임감이 강하고 듬직하나 내면의 외로움이 있을 수 있으니 편안하게 소통할 것.',
      healthFortune: '신장, 방광, 위장, 척추 및 수화 불균형 질환 예방에 신경 쓰십시오.',
      rawAnalysis: { mulsang: '어두운 밤 산속 호수를 지키는 파수꾼', shipsinSelf: '편관', twelveStar: '관대', sinsal: '백호살·수고' }
    },
    {
      order: 60, ganzhi: '계해', ganzhiHanja: '癸亥', stemHanja: '癸', stemElement: '음수(陰水)', branchHanja: '亥', branchElement: '음수(陰水)',
      character: '모든 물이 거대한 바다로 모이듯 지혜의 결정체이며 순응과 깊은 포용의 미덕을 가졌습니다.',
      careerFortune: '학술 연구, 외교, 무역, 수산업, 인문학, 종교, 예술 등 깊은 지혜를 베푸는 분야에 최적.',
      wealthFortune: '천문성과 제왕의 기수로 무한한 가능성의 재복을 갖고 있으나 주체적인 결단력이 중요.',
      romanceAdvice: '지혜롭고 다정하나 우유부단해지지 않도록 명확한 소신으로 연인을 대할 것.',
      healthFortune: '신장, 방광, 생식기, 하체 냉증 및 신경성 피로 해소에 유념하십시오.',
      rawAnalysis: { mulsang: '모든 시냇물이 다다라 완성된 거대한 아침 바다', shipsinSelf: '겁재', twelveStar: '제왕', sinsal: '천문성·태극귀인' }
    }
  ]

  // 10개씩 청크 단위 병렬 처리
  for (let i = 0; i < iljus.length; i += 10) {
    const chunk = iljus.slice(i, i + 10)
    await Promise.all(
      chunk.map(ilju =>
        tx.sajuIlju.upsert({
          where: { order: ilju.order },
          update: ilju,
          create: ilju
        })
      )
    )
  }
  console.log(`✓ Seeded ${iljus.length} Saju Iljus.`)

  // 4. I Ching 64 Hexagrams (주역 64괘 100% 고유 정통 시드 데이터)
  const hexagramsToSeed = [
  {
    "id": 1,
    "nameHanji": "乾爲天",
    "nameKorean": "중천건",
    "summary": "강건함 / 만물의 시작",
    "meaning": "하늘의 무한한 강건함과 번창함의 기운으로, 주저함 없이 원칙을 지키며 전진할 때 크게 형통합니다.",
    "generalFate": "하늘의 기운은 끝없이 강건하여 만물이 이를 바탕으로 아침을 열고 태동합니다. 원칙을 굳건히 세우고 공명정대하게 전진할 때 크게 형통합니다.",
    "businessFate": "운기가 최고조에 달하여 추진하는 신규 사업이나 프로젝트가 크게 형통합니다. 과감한 결단과 리더십을 발휘하십시오.",
    "loveFate": "당당하고 매력적인 기운이 분출되는 시기입니다. 다만 솔직함이 지나쳐 독단적으로 흐르지 않도록 상대방을 배려하십시오.",
    "wealthFate": "자산 상승과 투자 성과가 기대되는 전성기입니다. 단, 과욕을 부리거나 자만하면 손실이 올 수 있으니 원칙을 지키십시오."
  },
  {
    "id": 2,
    "nameHanji": "坤爲地",
    "nameKorean": "중지곤",
    "summary": "포용함 / 수용과 순응",
    "meaning": "땅의 온화하고 넓은 포용력으로 모든 것을 받아들이며, 순리에 따라 협력할 때 비로소 평안함을 얻습니다.",
    "generalFate": "땅의 온화하고 넓은 포용력으로 만물을 길러내듯, 하늘의 이치에 순응하고 조력자의 역할을 기꺼이 수행할 때 비로소 진정한 길함과 결실을 얻습니다.",
    "businessFate": "독단적 결정보다는 팀원 및 파트너와의 상생 협력이 이롭습니다. 윗사람의 자문과 조력을 받아 안정적으로 추진하십시오.",
    "loveFate": "상대방의 입장과 마음을 경청하고 감싸 안아주는 포용력이 큰 애정을 부릅니다. 헌신적인 자세가 이롭습니다.",
    "wealthFate": "과도한 투자 확장은 자제하고 내실 있는 자산 수성 및 저축에 집중하십시오. 조용히 축적하는 운이 길합니다."
  },
  {
    "id": 3,
    "nameHanji": "水雷屯",
    "nameKorean": "수뢰준",
    "summary": "시련의 시작 / 기초 다지기",
    "meaning": "새로운 만물이 싹을 틔울 때 겪는 창업의 시련처럼, 서두르지 말고 조력자를 확보하여 튼튼한 기반을 다지십시오.",
    "generalFate": "만물이 처음 태동할 때 겪는 창업과 시련의 시기입니다. 험난함 속에서도 소신을 굽히지 않고 근본 기틀을 바로 세우며 조력자를 구해야 합니다.",
    "businessFate": "창업이나 신규 프로젝트 초기의 난관에 직면합니다. 조급히 확장하지 말고 인재를 영입하고 기본 조직 체계를 다지십시오.",
    "loveFate": "서로에 대한 탐색전이 길어져 어색함이 흐를 수 있습니다. 서두르지 말고 진실된 태도로 차근차근 다가가십시오.",
    "wealthFate": "초기 투자 비용 지출이 많아 수확까지 시간이 필요합니다. 안정을 다지며 기반 축적에 주력해야 합니다."
  },
  {
    "id": 4,
    "nameHanji": "山水蒙",
    "nameKorean": "산수몽",
    "summary": "미숙함 / 배움과 자문",
    "meaning": "아직 미숙하고 몽매한 상태이므로 자신을 낮추고 훌륭한 스승이나 전문가의 배움과 자문을 구하는 것이 이롭습니다.",
    "generalFate": "산 아래 험한 샘물이 고여 어둡고 몽매한 상태입니다. 스승을 찾아 존중하고 청해야 배움을 얻으며, 자만과 의심을 버릴 때 계몽의 형통함이 옴을 가르칩니다.",
    "businessFate": "독단적 판단은 실패를 부릅니다. 멘토나 전문가의 자문을 수용하고 교육훈련을 강화할 때 길합니다.",
    "loveFate": "상대방을 이해하는 배려와 소통이 부족할 수 있습니다. 자신의 고집을 내려놓고 경청하는 자세를 배우십시오.",
    "wealthFate": "정보 부족이나 미숙한 판단으로 인한 자금 실수를 경계하십시오. 검증된 전문가의 조언을 듣는 것이 상책입니다."
  },
  {
    "id": 5,
    "nameHanji": "水天需",
    "nameKorean": "수천수",
    "summary": "여유로운 기다림 / 때를 도모함",
    "meaning": "앞에 험난함이 기다리고 있으나 조급하게 나아가지 말고 여유로운 마음으로 내실을 비축하며 때를 기다리십시오.",
    "generalFate": "앞에 강물이 막혀 위태로우나, 굳건한 내실과 진실된 신뢰를 지니고 때를 여유롭게 기다리면 마침내 큰 강을 건너 형통함을 얻습니다.",
    "businessFate": "당장 가시적 결과를 내려고 조급해하지 마십시오. 체력을 비축하고 준비를 다지다 보면 좋은 타이밍이 찾아옵니다.",
    "loveFate": "상대방의 마음이 열릴 때까지 기다려주는 인내가 필요한 시기입니다. 억지로 다가가면 부담을 줍니다.",
    "wealthFate": "투자의 결실이 맺히기까지 시차가 존재합니다. 여유로운 관망과 자금 축적이 이롭습니다."
  },
  {
    "id": 6,
    "nameHanji": "天水訟",
    "nameKorean": "천수송",
    "summary": "시비와 다툼 / 타협과 양보",
    "meaning": "서로의 뜻이 대립하여 시비와 다툼이 생기기 쉬우니 무리하게 다투지 말고 중도에 타협하고 화해하는 것이 길합니다.",
    "generalFate": "하늘은 위로 가고 물은 아래로 흘러 뜻이 상충되어 다투는 상입니다. 중도를 지키고 타협하면 길하나, 끝까지 분쟁을 고집하면 흉합니다.",
    "businessFate": "계약이나 권리 문제로 법적/조직적 분쟁이 발생하기 쉬운 때입니다. 소송을 오래 끌지 말고 중간 타협을 모색하십시오.",
    "loveFate": "자존심 싸움으로 감정의 골이 깊어질 수 있습니다. 자신이 먼저 고개를 숙이고 화해의 손을 내미십시오.",
    "wealthFate": "이익 분배 시 시비가 생기기 쉽습니다. 욕심을 덜어내고 공정하게 합의하는 것이 손실을 막는 길입니다."
  },
  {
    "id": 7,
    "nameHanji": "地水師",
    "nameKorean": "지수사",
    "summary": "엄중한 결단 / 대중 지휘",
    "meaning": "대중을 이끌고 험난함을 헤쳐나가는 중책을 맡았으니, 엄격한 규율과 군자의 덕목으로 결단하십시오.",
    "generalFate": "땅 아래 물이 모이듯 대중을 지휘하여 험난함을 헤쳐나가는 중책을 맡은 괘입니다. 덕망 있는 지도자(장인)의 지휘 아래 엄격한 규율을 세워야 형통합니다.",
    "businessFate": "조직이나 팀을 강력하게 리드해야 할 책임이 생깁니다. 공정한 규율과 명확한 방향 제시로 팀을 지휘하십시오.",
    "loveFate": "상대방과의 관계에서 주도적인 책임감을 가져야 할 때입니다. 듬직한 행동으로 신뢰를 안겨주십시오.",
    "wealthFate": "큰 규모의 자금 집행이나 조직 예산 관리에 신중을 기해야 합니다. 사사로운 지출을 단호히 통제하십시오."
  },
  {
    "id": 8,
    "nameHanji": "水地比",
    "nameKorean": "수지비",
    "summary": "조화와 친밀 / 상생과 협력",
    "meaning": "물이 땅으로 스며들듯 친밀하게 화합하고 협력하는 시기입니다. 맑은 마음으로 뜻이 같은 정다운 동료와 상생하십시오.",
    "generalFate": "물이 땅 위로 조화롭게 스며들듯 사람과 사람 간 친밀하게 화합하고 협력하는 괘입니다. 머뭇거리다 늦게 동참하는 자는 기회를 잃게 됩니다.",
    "businessFate": "훌륭한 파트너나 동업자를 만나 협력 프로젝트가 번창합니다. 네트워크를 적극적으로 확장하십시오.",
    "loveFate": "서로를 이해하고 감싸 안아주는 친밀한 연애운입니다. 마음의 문을 열면 매우 길합니다.",
    "wealthFate": "상생 협력을 통한 공동 이익 창출 운이 우수합니다. 뜻이 맞는 이들과 기쁨을 나누십시오."
  },
  {
    "id": 9,
    "nameHanji": "風天小畜",
    "nameKorean": "풍천소축",
    "summary": "소소한 축적 / 조심스러운 준비",
    "meaning": "아직 커다란 도약을 이루기는 어려우나 소소한 힘과 자원을 차곡차곡 축적하며 조심스럽게 인내하는 때입니다.",
    "generalFate": "구름이 가득하나 아직 비가 내리지 않는 준비 단계입니다. 아직 커다란 도약을 이룰 때는 아니므로 소소한 자원과 역량을 조용히 축적하십시오.",
    "businessFate": "커다란 대형 사업 추진은 시기상조입니다. 소규모 과제부터 착실히 완수하며 실력을 기르십시오.",
    "loveFate": "소소한 관심과 세심한 이벤트가 마음을 사로잡습니다. 과도한 요구는 피하십시오.",
    "wealthFate": "적금이나 소액 투자를 통해 차곡차곡 재물을 비축하기에 적합한 시기입니다."
  },
  {
    "id": 10,
    "nameHanji": "天澤履",
    "nameKorean": "천택리",
    "summary": "예의범절 / 조심스러운 행보",
    "meaning": "호랑이 꼬리를 밟듯 위태로운 상황에서도 범절과 예의를 지키며 자중하면 화를 면하고 무사함을 누립니다.",
    "generalFate": "호랑이 꼬리를 밟는 듯 위태롭고 조심스러운 상황에 처했으나, 겸손과 예의범절을 지키면 화를 면하고 무사함을 상징합니다.",
    "businessFate": "위험요소가 상존하는 까다로운 사안입니다. 규정 및 계약 절차를 철저히 지키면 안전하게 성사됩니다.",
    "loveFate": "상대방과의 예의를 지키고 조심스럽게 다가가야 길합니다. 무례하거나 넘치는 태도는 화를 부릅니다.",
    "wealthFate": "고수익 high-risk 투자에 주의하십시오. 조심스러운 리스크 관리가 재산을 지키는 핵심입니다."
  },
  {
    "id": 11,
    "nameHanji": "地天泰",
    "nameKorean": "지천태",
    "summary": "태평성대 / 만사 형통",
    "meaning": "하늘과 땅의 기운이 조화롭게 통하여 태평성대를 이루니, 소인은 물러가고 군자의 도리가 형통하게 빛납니다.",
    "generalFate": "하늘의 기운은 아래에서 올라가고 땅의 기운은 위에서 내려와 서로 원만히 사귀고 소통하는 소통과 태평성대의 전성기입니다.",
    "businessFate": "막혔던 계약과 거래가 순조롭게 성사되고 협력이 강화됩니다. 준비해 온 프로젝트를 자신 있게 전개하십시오.",
    "loveFate": "서로 간의 오해가 맑게 풀리고 깊은 신뢰와 사랑을 쌓는 평화롭고 따뜻한 조화가 이루어집니다.",
    "wealthFate": "수익과 재물이 크게 늘어나는 호운입니다. 실속을 다지며 발전적인 투자와 상생을 도모하십시오."
  },
  {
    "id": 12,
    "nameHanji": "天地否",
    "nameKorean": "천지비",
    "summary": "소통 단절 / 자중과 쇄국",
    "meaning": "하늘과 땅의 기운이 상하로 꽉 막혀 소통이 단절된 시기입니다. 억지로 추진하지 말고 내실을 다지며 때를 자중하십시오.",
    "generalFate": "하늘의 기운은 위로 올라가려 하고 땅의 기운은 아래로 내려가 서로 만나지 못하니 상하가 소통하지 못하는 형국입니다. 안으로는 유약하고 소인이 득세하며 밖으로는 군자가 소외되는 침체기입니다.",
    "businessFate": "새로운 창업이나 사업 확장은 절대 보류하십시오. 기존 자산의 방어와 내부 조직 정돈에 집중할 때입니다.",
    "loveFate": "서로 간의 대화가 단절되고 오해가 생기기 쉬운 때입니다. 억지로 설득하려 하지 말고 시간을 두고 기다리십시오.",
    "wealthFate": "투자 및 주식, 부동산 구매에 신중해야 합니다. 큰 자금 유출을 차단하고 현금 유동성을 확보하십시오."
  },
  {
    "id": 13,
    "nameHanji": "天火同人",
    "nameKorean": "천화동인",
    "summary": "동료와의 협력 / 위대한 단결",
    "meaning": "마음을 열고 들판에서 여럿이 뜻을 같이하는 형국입니다. 사심을 비우고 공정한 단결을 도모하면 큰 이로움이 있습니다.",
    "generalFate": "넓은 들판에서 사심 없이 만인과 마음을 트고 뜻을 모으는 위대한 단결의 괘입니다. 공정함과 원칙을 지키면 큰 강을 건너듯 대업을 이룹니다.",
    "businessFate": "동료 및 파트너와의 공동 프로젝트나 협동 사업이 크게 형통합니다. 사적인 이익보다 공정한 협력을 도모하십시오.",
    "loveFate": "취향과 가치관이 통하는 이성과의 맑고 정다운 만남이 이루어집니다. 친구처럼 편안하고 진솔한 대화가 애정을 기릅니다.",
    "wealthFate": "공동 투자나 펀딩, 파트너십을 통한 재물 증대 운이 높습니다. 투명한 회계 및 공정한 수익 분배가 결실을 보존합니다."
  },
  {
    "id": 14,
    "nameHanji": "火天大有",
    "nameKorean": "화천대유",
    "summary": "크게 소유함 / 풍요의 전성기",
    "meaning": "태양이 하늘 높이 솟아 세상을 고루 밝히듯 풍요롭고 커다란 결실을 소유하게 되는 밝은 전성기입니다.",
    "generalFate": "태양이 하늘 높이 솟아 온 세상을 고루 밝히듯 풍요와 성공을 크게 소유하는 최고의 전성기 괘입니다. 자만하지 않고 덕을 펼칠 때 형통이 영원합니다.",
    "businessFate": "사업과 프로젝트가 최고조의 결실을 맺는 찬란한 전성기입니다. 리더십을 공정하게 발휘하고 악 요소를 차단하십시오.",
    "loveFate": "상대방과의 애정이 더욱 깊어지고 경사가 겹치는 풍요로운 관계입니다. 자만하지 않고 겸손히 아끼십시오.",
    "wealthFate": "재물과 자산이 크게 불어나는 만사형통의 호운입니다. 번 돈을 주위와 따뜻하게 나누고 베풀 때 복이 지속됩니다."
  },
  {
    "id": 15,
    "nameHanji": "地山謙",
    "nameKorean": "지산겸",
    "summary": "겸손의 덕 / 자신을 낮춤",
    "meaning": "높은 산이 높은 자세를 낮추어 땅 아래로 들어가 있는 겸손의 덕을 상징합니다. 자신을 낮출 때 만인이 따르고 길합니다.",
    "generalFate": "높고 거대한 산이 자신을 낮추어 땅 아래로 들어가 있는 지극히 바르고 겸손한 덕의 괘입니다. 스스로를 낮출 때 만인이 우러러보며 끝내 결실을 맺습니다.",
    "businessFate": "자신의 공을 과시하지 않고 팀원들과 공을 나누는 겸손한 리더십이 대성공을 가져옵니다. 협력자들의 절대적 지지를 얻습니다.",
    "loveFate": "상대방의 의사와 입장을 배려하는 겸손하고 온화한 태도가 마음을 깊이 감동시킵니다. 인망이 높습니다.",
    "wealthFate": "자산이 넘칠수록 사치하지 않고 아랫사람과 나눔을 실천할 때 자산이 더욱 안정을 누리고 길함이 솟구칩니다."
  },
  {
    "id": 16,
    "nameHanji": "雷地豫",
    "nameKorean": "뇌지예",
    "summary": "기쁨과 예비 / 즐거운 대비",
    "meaning": "봄 천둥이 땅을 깨우듯 기쁨과 즐거움이 찾아오는 시기입니다. 즐거움에 빠져 방심하지 말고 미래를 예비하십시오.",
    "generalFate": "봄 천둥이 마침내 대지를 깨워 만물이 새 기쁨을 누리는 상입니다. 유쾌함에 취해 무방비로 있지 말고 다가올 미래를 미리 철저히 대비(豫)하십시오.",
    "businessFate": "사기 및 분위기가 고조되어 새로운 신규 사업이나 이벤트를 전개하기에 길합니다. 단 방심은 금물입니다.",
    "loveFate": "서로 간에 활력과 기쁨이 넘치는 즐거운 만남이 지속됩니다. 이벤트와 데이트가 활력을 불어넣습니다.",
    "wealthFate": "기분 좋은 자금 유입과 수익 창출이 기대됩니다. 즐거움에 취해 유흥비나 과소비로 유출되지 않도록 경계하십시오."
  },
  {
    "id": 17,
    "nameHanji": "澤雷隨",
    "nameKorean": "택뢰수",
    "summary": "대세 순응 / 순리에 따름",
    "meaning": "때의 흐름과 대세에 부드럽게 순응하는 지혜가 필요합니다. 고집을 버리고 순리에 맞추어 나아갈 때 탈이 없습니다.",
    "generalFate": "때의 흐름과 대세에 부드럽게 순응하며 따르는 괘입니다. 고집을 피우지 말고 주변과 순리에 발맞추어 나아갈 때 탈이 없고 형통합니다.",
    "businessFate": "자신의 주장만을 고집하지 말고 고객과 시장 트렌드에 유연하게 발맞추어 나아가야 사업이 성장합니다.",
    "loveFate": "상대방의 기분과 취향에 부드럽게 발맞추어 주는 겸손함이 깊은 친밀감을 가져옵니다.",
    "wealthFate": "독단적 자금 운용보다는 시장의 흐름과 전문가 가이드라인을 따르는 것이 이롭습니다."
  },
  {
    "id": 18,
    "nameHanji": "山風蠱",
    "nameKorean": "산풍고",
    "summary": "폐단 개혁 / 쇄신과 보수",
    "meaning": "오랫동안 쌓여온 폐단과 부패를 과감히 개혁하고 쇄신해야 할 때입니다. 초심으로 돌이켜 새로운 기틀을 마련하십시오.",
    "generalFate": "오랫동안 방치되어 그릇에 벌레가 생기듯 폐단과 부패가 쌓인 상태입니다. 과감히 쇄신하고 구조조정을 시행할 때 새로운 생명력이 돋아납니다.",
    "businessFate": "오래된 조직의 부실이나 방치된 업무 프로세스를 과감히 인수인계받아 쇄신해야 하는 시기입니다.",
    "loveFate": "과거의 오해나 묵은 감정을 솔직히 털어놓고 관계를 바로잡아야 새 출발이 가능합니다.",
    "wealthFate": "새어 나가는 소소한 지출이나 부실 자산을 과감히 정리하십시오. 쇄신 후 재정 안정이 찾아옵니다."
  },
  {
    "id": 19,
    "nameHanji": "地澤臨",
    "nameKorean": "지택림",
    "summary": "기회의 도래 / 군림과 관용",
    "meaning": "희망찬 운기와 좋은 기회가 가까이 다가오는 시기입니다. 관용과 정성스러운 태도로 아랫사람을 돌보면 형통합니다.",
    "generalFate": "양의 기운이 땅 위로 힘차게 커져 올라오는 희망찬 관용의 시기입니다. 윗사람으로서 아랫사람을 기쁘게 돌봐야 하나 전성기가 지나 침체할 때도 대비해야 합니다.",
    "businessFate": "새로운 기회와 좋은 사업 환경이 도래하여 발전합니다. 아랫사람을 포용하며 온화하게 통솔하십시오.",
    "loveFate": "서로를 따뜻하게 감싸 안아주는 깊은 정이 커져갑니다. 성실하고 듬직한 커뮤니케이션이 이롭습니다.",
    "wealthFate": "소득 상승과 자산 가치 증가가 기대되는 길운입니다. 호운일 때 미래 침체기를 대비해 비축하십시오."
  },
  {
    "id": 20,
    "nameHanji": "風地觀",
    "nameKorean": "풍지관",
    "summary": "정세 관망 / 성찰과 깊은 관찰",
    "meaning": "바람이 땅 위를 살피듯 성급한 행동을 멈추고 상황과 정세를 깊이 관망하며 성찰하는 지혜가 필요한 때입니다.",
    "generalFate": "바람이 땅 위를 살피며 불듯, 성급한 행동을 멈추고 관망하며 깊이 성찰하는 괘입니다. 숭고한 신뢰와 경건한 태도로 정세를 파악해야 길합니다.",
    "businessFate": "당장 적극적으로 전진하기보다는 시장 반응과 주변 정세를 꼼꼼하게 관찰하고 모니터링해야 할 때입니다.",
    "loveFate": "상대방의 반응과 성품을 깊이 관찰하고 마음을 성찰하는 시기입니다. 억지로 다가서지 마십시오.",
    "wealthFate": "성급한 투자나 섣부른 자금 집행을 금하십시오. 신중하게 전반 상황을 분석하는 것이 재산을 지킵니다."
  },
  {
    "id": 21,
    "nameHanji": "火雷噬嗑",
    "nameKorean": "화뢰서합",
    "summary": "장애 단죄 / 결단력과 돌파",
    "meaning": "음식을 씹어 방해물을 단호히 제거하듯, 장애물이나 부정함을 결단력 있게 적발하고 과감히 정리하십시오.",
    "generalFate": "입속에 방해물이 있어 이를 다물 수 없듯 씹어서 끊어내야 하는 상입니다. 장애물이나 부정함을 결단력 있게 적발하여 정리해야 형통합니다.",
    "businessFate": "사업을 방해하는 계약상의 계약 위반이나 걸림돌을 법적/조직적 결단력으로 적발하고 정리해야 형통합니다.",
    "loveFate": "관계 속 오해나 제3자의 방해 요소를 솔직하고 단호하게 대화로 끊어내야 관계가 회복됩니다.",
    "wealthFate": "부실 채권이나 방해되는 지출 요소를 단호히 처리하십시오. 결단력 있는 정리가 자산을 지킵니다."
  },
  {
    "id": 22,
    "nameHanji": "山火賁",
    "nameKorean": "산화비",
    "summary": "화려한 장식 / 외양의 내실화",
    "meaning": "산 아래 문채가 빛나듯 화려함으로 장식하는 형국입니다. 외형의 화려함에만 치중하지 말고 내실을 알차게 기르십시오.",
    "generalFate": "산 아래 불꽃이 밝아 아름답게 꾸미고 장식하는 괘입니다. 외형적 화려함만 추구하지 말고 본질적인 내실을 갖추어야 작은 이로움이 지속됩니다.",
    "businessFate": "브랜딩, 디자인, 마케팅 외양을 아름답게 가다듬기에 유익합니다. 단, 알맹이 없는 과장은 삼가하십시오.",
    "loveFate": "매력적이고 화려한 호감이 피어나나 외모나 겉모습보다 내면의 성품과 진실성을 확인하십시오.",
    "wealthFate": "소소한 이익과 자산의 화려함은 있으나 겉치레 비용이나 불필요한 과소비를 단호히 자제해야 합니다."
  },
  {
    "id": 23,
    "nameHanji": "山地剝",
    "nameKorean": "산지박",
    "summary": "쇠락과 침체 / 은신과 내실",
    "meaning": "산이 무너져 내리고 기운이 깎여나가는 쇠락의 시기입니다. 무리한 확장을 자제하고 은신하여 스스로를 보호하십시오.",
    "generalFate": "산이 깎여나가고 기운이 쇠락하는 침체기입니다. 소인의 기운이 자라고 군자가 입지를 잃으니 적극적 행동을 자제하고 은신하여 내실을 수성하십시오.",
    "businessFate": "무리한 사업 확장이나 공격적 투자는 절대 금물입니다. 기존 기반의 수성과 리스크 차단이 유일한 상책입니다.",
    "loveFate": "상대방과의 대립이나 외적 시련으로 관계가 쉽게 시들어갑니다. 자중하며 마음을 보살피십시오.",
    "wealthFate": "자산 가치 하락과 지출 유출이 우려되는 시기입니다. 보증이나 고위험 투자를 전면 보류하십시오."
  },
  {
    "id": 24,
    "nameHanji": "地雷復",
    "nameKorean": "지뢰복",
    "summary": "희망의 회복 / 새로운 출발",
    "meaning": "어둠 속에서 양(陽)의 한 기운이 되돌아오는 회복의 때입니다. 허물을 깨닫고 초심의 바른 길로 돌아오면 희망이 솟아납니다.",
    "generalFate": "동짓날 땅속에서 양의 한 기운이 비로소 회복되듯 긴 어둠을 깨고 회복과 생기(復)가 찾아옵니다. 허물을 깨닫고 본래의 바른 도리로 돌아오면 형통합니다.",
    "businessFate": "침체되었던 사업과 업무에 다시 온기가 돌고 희망의 물꼬가 트입니다. 서두르지 말고 차근차근 부활시키십시오.",
    "loveFate": "갈등이나 냉전 상태였던 관계에 화해의 봄바람이 붑니다. 지난 허물을 뉘우치고 먼저 다가가하십시오.",
    "wealthFate": "막혔던 자금 흐름이 차츰 해소되기 시작합니다. 욕심을 내기보다 바른 길로 실속을 다져나가십시오."
  },
  {
    "id": 25,
    "nameHanji": "天雷無妄",
    "nameKorean": "천뢰무망",
    "summary": "순리 순응 / 인위적 욕심 비움",
    "meaning": "인위적인 욕심이나 허망함을 버리고 순수한 자연의 이치에 따르십시오. 순리를 지키면 뜻밖의 재앙도 면하게 됩니다.",
    "generalFate": "인위적인 욕심이나 거짓 없이 순수한 자연의 이치와 진실함에 순응하는 괘입니다. 올바르지 않은 허망한 욕심을 부리면 재앙(眚)을 입게 됩니다.",
    "businessFate": "인위적 사기나 투기적 꼼수를 부리지 말고 순리와 원칙대로 명백히 임해야 사업이 순항합니다.",
    "loveFate": "거짓 없는 순수한 진심이 상대방의 마음을 감동시킵니다. 계산적인 태도를 전면 내려놓으십시오.",
    "wealthFate": "정당한 노동과 노력에 따른 결실이 이롭습니다. 요행이나 대박을 노린 투기 행위는 재앙을 부릅니다."
  },
  {
    "id": 26,
    "nameHanji": "山天大畜",
    "nameKorean": "산천대축",
    "summary": "역량 비축 / 학문과 힘의 축적",
    "meaning": "산 속에 커다란 하늘의 기운을 담아두듯 학문, 역량, 자산을 대규모로 비축하는 시기입니다. 크게 축적하여 인재를 기르십시오.",
    "generalFate": "산속에 커다란 하늘의 기운과 자산을 가득 담아두듯 대규모로 학문과 역량을 축적하는 괘입니다. 인재를 우대하고 크게 비축하여 대업을 준비하십시오.",
    "businessFate": "대형 프로젝트나 장기 비전을 위해 자본, 인재, 기술을 대대적으로 비축하고 학습해야 할 시기입니다.",
    "loveFate": "서로 간의 신뢰와 깊은 깊이를 차곡차곡 쌓아가는 시간입니다. 듬직하고 내실 있는 모습이 존경을 부릅니다.",
    "wealthFate": "큰 재물과 자산을 저축하고 비축하는 운기가 지극히 우수합니다. 내실 있는 자금 다지기에 주력하십시오."
  },
  {
    "id": 27,
    "nameHanji": "山雷頤",
    "nameKorean": "산뢰이",
    "summary": "몸과 마음의 수양 / 언행 자제",
    "meaning": "턱으로 음식과 말을 다스리듯 몸과 마음을 기르는 수양의 시기입니다. 올바른 식생활과 언행의 자제가 귀함의 핵심입니다.",
    "generalFate": "턱으로 입에 음식과 말을 다스리듯 스스로 몸과 마음을 기르고 남을 양육하는 괘입니다. 언행을 삼가고 올바른 식생활과 양생을 다스릴 때 길합니다.",
    "businessFate": "내부 임직원 교육 및 양성, 서비스 품질 향상에 주력하십시오. 불필요한 공약이나 과장된 언행은 경계해야 합니다.",
    "loveFate": "서로에게 따뜻한 언어와 마음의 양분을 건네는 관계입니다. 험담이나 까다로운 투정은 관계를 해칩니다.",
    "wealthFate": "지출과 소비 습관을 점검하십시오. 식비나 불필요한 유흥 지출을 절제하고 알찬 자금 운용을 도모하십시오."
  },
  {
    "id": 28,
    "nameHanji": "澤風大過",
    "nameKorean": "택풍대과",
    "summary": "막중한 책임 / 고난 극복",
    "meaning": "대들보가 지나친 무게로 들뜨는 상으로, 지나치게 중차대한 임무를 맡아 위태로우나 정직한 중용으로 헤쳐나가하십시오.",
    "generalFate": "대들보가 과도한 무게로 인해 구부러질 정도로 막중한 과업이나 시련을 짊어진 상입니다. 비상한 시기에는 굳건한 중용과 지혜로 결단해야 헤쳐나갑니다.",
    "businessFate": "중차대한 과제나 리스크가 막중하여 어깨가 무겁습니다. 비상대책을 세우고 과감한 결단력으로 중용을 고수하십시오.",
    "loveFate": "서로 간의 부담이나 외적 무게감이 상당할 수 있습니다. 홀로 바로 서서 중심을 잡는 지혜가 필요한 때입니다.",
    "wealthFate": "막대한 자금 부담이나 부채 관리에 신중해야 합니다. 무리한 영끌 투자나 무모한 보증을 절대 삼가야 합니다."
  },
  {
    "id": 29,
    "nameHanji": "重水坎",
    "nameKorean": "중수감",
    "summary": "겹친 험난함 / 자중과 신중",
    "meaning": "험난한 물길이 겹겹이 밀려오는 중첩된 난관의 때입니다. 두려움에 사로잡히지 말고 굳건한 신념으로 자중하며 신중하십시오.",
    "generalFate": "험난함이 겹겹이 밀려오는 중수의 시련입니다. 그러나 물이 그 신용과 중심을 잃지 않고 앞으로 나아가듯 굳건한 신념으로 견디면 이겨냅니다.",
    "businessFate": "자금난이나 예기치 못한 차질이 올 수 있습니다. 무리한 확장이나 계약 추진을 멈추고 현상을 지키는 것이 이롭습니다.",
    "loveFate": "서로 간의 오해나 외적 시련이 가중되기 쉬운 때입니다. 성급하게 따지기보다 진심 어린 신뢰를 유지함이 우선입니다.",
    "wealthFate": "보증이나 투자는 절대 위험합니다. 지출을 최소화하고 유동 자금을 단단히 지키하십시오."
  },
  {
    "id": 30,
    "nameHanji": "重火離",
    "nameKorean": "중화리",
    "summary": "타오르는 불길 / 명석함과 안착",
    "meaning": "타오르는 불꽃처럼 명석한 지혜와 분별력을 발휘할 때입니다. 바른 인자에 안착할 때 더욱 환하게 빛납니다.",
    "generalFate": "해와 달이 하늘에 걸려 세상을 밝히듯 명석한 지혜와 분별력이 환하게 빛나는 시기입니다. 바른 도리에 안착할 때 길합니다.",
    "businessFate": "자신의 능력과 기획이 세상의 인정을 받는 시기입니다. 외양에만 치중하지 말고 내실과의 균형을 이루십시오.",
    "loveFate": "서로 간의 호감과 애정이 화려하게 피어납니다. 정열적이나 지나친 질투나 다툼을 자제해야 무탈합니다.",
    "wealthFate": "화려한 소득 기회가 생기나 과소비나 불필요한 장식 지출을 주의하십시오. 내실 있는 자금 관리가 길합니다."
  },
  {
    "id": 31,
    "nameHanji": "澤山咸",
    "nameKorean": "택산함",
    "summary": "호감과 만남 / 마음의 교감",
    "meaning": "산 위에 연못이 있어 연못과 산이 서로 감응하듯 남녀 간, 타인 간의 마음이 맑게 통하고 교감하는 길한 분위기입니다.",
    "generalFate": "산 위에 연못이 있어 기운이 서로 감응하고 교감하는 괘입니다. 순수한 마음으로 타인을 대하고 호응할 때 마음과 애정이 연원히 통합니다.",
    "businessFate": "고객이나 파트너와의 진정성 있는 교감이 성과를 낳습니다. 상대의 니즈를 겸손히 받아들이고 호응하십시오.",
    "loveFate": "남녀 간의 감응과 깊은 애정이 순수하게 피어나는 최고의 인연운입니다. 혼인이나 깊은 결합이 길합니다.",
    "wealthFate": "상호 신뢰에 기반한 정당한 거래와 협력 수익이 원만하게 창출됩니다. 사기나 가식을 멀리하십시오."
  },
  {
    "id": 32,
    "nameHanji": "雷風恒",
    "nameKorean": "뇌풍항",
    "summary": "한결같은 지조 / 지속적인 노력",
    "meaning": "바람과 천둥이 어우러져 한결같음을 유지하듯, 초심의 조화로운 지조와 끈기를 오랜 기간 지속하는 것이 이롭습니다.",
    "generalFate": "바람과 천둥이 어우러져 한결같음을 유지하듯, 초심의 조화로운 지조와 변치 않는 노력을 오랜 기간 지속하는 것이 길합니다.",
    "businessFate": "단기 성과에 일희일비하지 말고 지목한 목표를 향해 한결같은 서비스와 품격을 유지가 성공을 보장합니다.",
    "loveFate": "초심을 잃지 않는 한결같은 변함없는 사랑이 깊은 결실을 맺습니다. 수수한 신뢰를 계속 지켜나가십시오.",
    "wealthFate": "꾸준한 저축과 변함없는 자금 관리가 자산을 불려줍니다. 잦은 변덕이나 우왕좌왕 투자는 손실을 부릅니다."
  },
  {
    "id": 33,
    "nameHanji": "天山遯",
    "nameKorean": "천산둔",
    "summary": "한 걸음 물러섬 / 양보와 피함",
    "meaning": "소인의 기운이 자라나므로 무리하게 정면충돌하지 말고 한 걸음 지혜롭게 물러서며 양보하는 것이 상책입니다.",
    "generalFate": "하늘 아래 산이 솟아 세력이 물러나는 모양입니다. 음의 소인 세력이 늘어날 때는 정면충돌하지 않고 한 걸음 지혜롭게 물러서며 양보함이 상책입니다.",
    "businessFate": "소인이나 부정적 환경과 정면 대립하지 말고 한발 물러서서 내실을 다지고 전열을 재정비해야 합니다.",
    "loveFate": "집착이나 억지 고집을 내려놓고 거리두기를 취하십시오. 한 걸음 물러섬이 도리어 관계를 정돈해 줍니다.",
    "wealthFate": "무리한 투자를 멈추고 자금을 안전하게 회수하거나 현금 유동성을 확보해야 손실을 면합니다."
  },
  {
    "id": 34,
    "nameHanji": "雷天大壯",
    "nameKorean": "뇌천대장",
    "summary": "장대한 기세 / 경거망동 경계",
    "meaning": "하늘 위에서 천둥이 울리듯 강성한 기세와 힘이 넘칩니다. 힘만 믿고 경거망동하지 말고 올바른 예의를 지키십시오.",
    "generalFate": "하늘 위에서 천둥이 쾅 울리듯 강성한 기세와 힘이 솟구치는 전성기입니다. 힘이 셀수록 교만하지 않고 바른 예의를 지켜야 형통함이 보존됩니다.",
    "businessFate": "기세와 사업 동력이 매우 강성합니다. 자신감 있게 추진하되 힘만 믿고 무례하게 행하는 것을 주의하십시오.",
    "loveFate": "당당하고 자신감 있는 매력이 돋보이나 독단적으로 기분을 다루어 상대를 억누르지 않도록 예의를 지키십시오.",
    "wealthFate": "재물 운기가 힘차게 상승하나 오만함이나 경거망동으로 인한 지출이나 부주의 손실을 경계해야 합니다."
  },
  {
    "id": 35,
    "nameHanji": "火地晉",
    "nameKorean": "화지진",
    "summary": "솟구치는 기운 / 적극적 전진",
    "meaning": "밝은 태양이 땅 위로 찬란히 솟구쳐 전진하는 형상입니다. 상사의 인정을 받고 적극적으로 나아가 능력을 발휘하십시오.",
    "generalFate": "밝은 태양이 땅 위로 솟아올라 온 세상을 환히 비추며 진일보하는 괘입니다. 능력과 신뢰를 인정받아 위정자의 후원과 승진의 결실을 얻습니다.",
    "businessFate": "상사나 기관의 신임을 받아 승진이나 사업 전개의 탄력을 받는 전성기입니다. 당당하게 실력을 펼치십시오.",
    "loveFate": "서로의 존재가 서로를 환하게 빛내주는 축복받은 연애운입니다. 공개적이고 당당한 관계 발전이 길합니다.",
    "wealthFate": "포상, 승진, 사업 확장으로 인한 재물 수확이 풍성합니다. 밝고 정당한 소득이 이어집니다."
  },
  {
    "id": 36,
    "nameHanji": "地火明夷",
    "nameKorean": "지화명이",
    "summary": "빛의 은구 / 어둠 속 인내",
    "meaning": "밝은 빛이 땅속으로 들어가 어두워진 상황입니다. 자신의 지혜를 드러내지 말고 은신하여 마음을 가다듬으십시오.",
    "generalFate": "밝은 태양이 땅속으로 삼켜져 세상이 컴컴해진 암흑기입니다. 자신의 지혜를 드러내지 말고 재능을 감추며 어둠 속에서 은신하고 참아내야 길합니다.",
    "businessFate": "상사나 조직의 시기질투나 억압이 있을 수 있습니다. 자신의 유능함을 드러내어 자랑하지 말고 겸손히 버티십시오.",
    "loveFate": "오해나 마음의 상처를 입기 쉬운 어두운 시기입니다. 억지로 설득하기보다 내면의 마음을 가다듬으며 견디십시오.",
    "wealthFate": "손실이나 자금 압박을 경계하십시오. 화려한 소비나 과시형 지출을 전면 자제하고 수성에 집중하십시오."
  },
  {
    "id": 37,
    "nameHanji": "風火家人",
    "nameKorean": "풍화가인",
    "summary": "가화만사성 / 내부의 안정",
    "meaning": "바람이 불꽃을 부채질하며 내부에서 일어나는 형국입니다. 가정과 조직 내부의 도리와 질서를 기르는 것이 근본입니다.",
    "generalFate": "바람이 불길을 일으키듯 내부와 가정의 질서를 바로 세우는 괘입니다. 집안과 조직 내부가 평안하고 화목해야 외부의 만사가 번창합니다(가화만사성).",
    "businessFate": "외부 확장보다 기업 내부의 내실, 조직 규율, 팀워크 정비를 우선시할 때 비로소 튼튼한 성장이 보장됩니다.",
    "loveFate": "가족 및 연인 간의 성실한 도리와 깊은 책임감이 핵심입니다. 따뜻한 화목함이 큰 기쁨을 안겨줍니다.",
    "wealthFate": "가계 예산과 내부 자금 유출을 점검하십시오. 내부 수성을 단단히 할 때 재물이 밖으로 새지 않습니다."
  },
  {
    "id": 38,
    "nameHanji": "火澤睽",
    "nameKorean": "화택규",
    "summary": "뜻의 분열 / 대립과 구설 경계",
    "meaning": "불은 위로 솟고 물은 아래로 흘러 반목하고 대립하는 상입니다. 불필요한 구설을 경계하고 작은 조화를 추구하십시오.",
    "generalFate": "불은 위로 올라가고 물은 아래로 내려가 서로 반목하고 대립하는 상입니다. 대립과 이견이 생기기 쉬우니 대업을 무리하게 추진하기보다 소소한 상생을 도모하십시오.",
    "businessFate": "파트너나 이해관계자와의 의견 대립이 올 수 있습니다. 큰 승부를 벌이기보다 소소한 협의부터 조율해 나가하십시오.",
    "loveFate": "성격 차이나 가치관 대립으로 구설수가 생기기 쉬운 때입니다. 서로의 다름(異)을 인정하는 관용이 필요합니다.",
    "wealthFate": "자금 갈등이나 이익 분배 반목을 경계하십시오. 욕심을 내려놓고 작은 합의점을 찾는 것이 유익합니다."
  },
  {
    "id": 39,
    "nameHanji": "水山蹇",
    "nameKorean": "수산건",
    "summary": "얼어붙은 난관 / 멈춤과 지혜",
    "meaning": "앞에는 험한 물이 있고 뒤에는 높은 산이 막힌 난관의 상입니다. 나아감을 멈추고 반성하며 내실을 다지십시오.",
    "generalFate": "앞에는 깊은 물이 막히고 뒤에는 높은 산이 우뚝 서서 걸음이 멈춰 선 난관입니다. 성급히 나아가지 말고 물러서서 인재와 귀인의 조력을 구하십시오.",
    "businessFate": "앞길이 꽉 막힌 얼어붙은 난관입니다. 성급한 직진을 멈추고 전문가의 자문과 반성으로 내실을 다지십시오.",
    "loveFate": "장벽과 현실적 시련으로 관계가 나아가기 힘듭니다. 억지로 밀어붙이지 말고 자신을 성찰하며 기다리십시오.",
    "wealthFate": "자금 출구가 막히고 지출 부담이 큽니다. 투자나 확장을 단호히 보류하고 원금을 지키십시오."
  },
  {
    "id": 40,
    "nameHanji": "雷水解",
    "nameKorean": "뇌수해",
    "summary": "매듭의 풀림 / 해소와 봄날",
    "meaning": "봄 천둥과 비가 얼어붙은 대지를 녹이듯 오랫동안 묵은 난관과 매듭이 시원하게 풀리는 시기입니다.",
    "generalFate": "봄 천둥과 비가 대지에 내려 얼어붙은 눈과 앙금을 시원하게 풀어나가는 해소의 괘입니다. 오랜 난관이 해소되니 매듭을 풀어 조속히 일상으로 복귀하십시오.",
    "businessFate": "오랫동안 묶여 있던 얽힌 계약, 소송, 난관이 풀리기 시작합니다. 기회가 왔을 때 신속하게 매듭을 짓고 전진하십시오.",
    "loveFate": "오해와 오랫동안 쌓인 감정의 응어리가 맑게 풀어지고 화해와 해소의 봄바람이 불어옵니다.",
    "wealthFate": "막혔던 자금선이 트이고 미수금이나 자금이 회수되는 기분 좋은 수확운입니다."
  },
  {
    "id": 41,
    "nameHanji": "山澤損",
    "nameKorean": "산택손",
    "summary": "절제와 희생 / 덜어내어 채움",
    "meaning": "아랫사람이나 소소한 이익을 덜어내어 큰 도리를 채우는 희생과 절제의 상입니다. 덜어냄이 결국 유익함으로 되돌아옵니다.",
    "generalFate": "아랫사람이나 지나친 자산을 절제하여 덜어내고 위와 대의를 채우는 괘입니다. 당장의 덜어냄과 희생이 나중에 큰 형통과 유익함으로 보답 받습니다.",
    "businessFate": "비효율적인 부서나 과도한 비용 항목을 솔선하여 덜어내야 합니다. 구조조정 후 실속이 크게 좋아집니다.",
    "loveFate": "자신의 이기심과 요구를 덜어내고 상대방을 위해 양보하는 결단이 진정한 애정을 불러옵니다.",
    "wealthFate": "당장의 소소한 지출 감소와 절약이 필수적입니다. 나눔이나 봉사를 실천할 때 나중에 큰 복으로 되돌아옵니다."
  },
  {
    "id": 42,
    "nameHanji": "風雷益",
    "nameKorean": "풍뢰익",
    "summary": "실질적 이득 / 번영과 도약",
    "meaning": "바람과 천둥이 서로 도와 풍요로움을 더해주는 형국입니다. 적극적으로 좋은 일을 도모하면 도약의 결실이 있습니다.",
    "generalFate": "바람과 천둥이 서로 도와 풍요로움을 더해주는 형국입니다. 위에서 아랫사람을 돌보고 적극적으로 좋은 일을 도모할 때 결실과 이득이 배가됩니다.",
    "businessFate": "아랫사람과 팀원들에게 혜택을 나누고 투자할 때 사업이 폭발적으로 확장하고 도약합니다.",
    "loveFate": "서로에게 이로움을 안겨주며 사랑과 신뢰가 더욱 두터워집니다. 함께 도약하는 미래가 열립니다.",
    "wealthFate": "수익 상승, 자산 증가, 이익 증대가 겹치는 호운입니다. 좋은 일에 적극 투자하십시오."
  },
  {
    "id": 43,
    "nameHanji": "澤天夬",
    "nameKorean": "택천쾌",
    "summary": "결연한 단판 / 단호한 결단",
    "meaning": "못의 물이 하늘 높이 올라 차올라 마침내 단판을 짓는 결단의 때입니다. 사심을 없애고 단호하고 공정하게 결단하십시오.",
    "generalFate": "연못의 물이 하늘 위로 가득 차올라 마침내 단판을 짓는 단호한 결단의 괘입니다. 소인의 부정함을 제거하되 무력보다는 공정한 정의로 결단해야 합니다.",
    "businessFate": "부정이나 부실한 사안을 공명정대하게 단판 짓고 제거해야 하는 결단의 타이밍입니다.",
    "loveFate": "결단력 있게 관계의 방향을 바로잡아야 합니다. 애매한 태도를 버리고 명확히 결정하십시오.",
    "wealthFate": "손실 요소를 단호히 정리하고 회수할 때입니다. 사사로운 연정에 이끌려 미루지 마십시오."
  },
  {
    "id": 44,
    "nameHanji": "天風姤",
    "nameKorean": "천풍구",
    "summary": "예기치 못한 인연 / 뜻밖의 만남",
    "meaning": "하늘 아래 바람이 불어 예기치 못한 인연과 상황이 부딪치는 때입니다. 유혹이나 성급한 결합을 주의깊게 관찰하십시오.",
    "generalFate": "하늘 아래 바람이 불어 뜻하지 않은 인연이나 유혹과 부딪치는 괘입니다. 성급한 결합이나 자만된 유혹에 넘어가면 해가 되니 삼가 관찰해야 합니다.",
    "businessFate": "뜻밖의 인연이나 수주 기회가 찾아오나, 지나치게 파격적인 조건의 유혹은 검증을 거쳐 신중해야 합니다.",
    "loveFate": "강렬하고 매혹적인 기습 인연이 찾아오나, 조급하게 깊은 결합을 추진하면 수성이 어려울 수 있으니 주의하십시오.",
    "wealthFate": "불로소득이나 투기성 제안에 주의하십시오. 화려한 제안 뒤에 위험이 도사릴 수 있습니다."
  },
  {
    "id": 45,
    "nameHanji": "澤地萃",
    "nameKorean": "택지췌",
    "summary": "인재와 재물 결집 / 번창함",
    "meaning": "땅 위에 인재와 재물이 물처럼 함께 모여 결집하는 번창의 상입니다. 모일수록 성실하고 중용한 자세를 지키십시오.",
    "generalFate": "땅 위에 인재와 자금이 물처럼 흘러 들어와 모여드는 모임과 결집의 괘입니다. 무리가 모일수록 중심 리더십과 바른 규율을 지켜야 길함이 보존됩니다.",
    "businessFate": "인재, 자금, 투자금이 모여드는 대형 번창의 기회입니다. 중심이 되는 굳건한 경영 규율을 정립하십시오.",
    "loveFate": "뜻을 같이하는 동료나 인연들이 모여들어 기쁨을 나눕니다. 모임 속에서 매력적인 만남이 성사됩니다.",
    "wealthFate": "재물과 자산이 큰 무리로 집결하여 자산 가치가 상승하는 우수한 자금 모음 운입니다."
  },
  {
    "id": 46,
    "nameHanji": "地風升",
    "nameKorean": "지풍승",
    "summary": "싹을 틔우는 상승 / 도약과 성장",
    "meaning": "땅속의 나무 싹이 지면을 뚫고 솟아올라 커지듯 점진적으로 상승하는 도약의 시기입니다. 윗사람의 인도를 받으면 길합니다.",
    "generalFate": "땅속의 나무 싹이 단단한 지면을 뚫고 지상으로 솟아올라 성장하는 상승의 괘입니다. 서두르지 말고 정직하게 노력하면 높은 위치로 크게 도약합니다.",
    "businessFate": "사업이 꾸준하고 힘차게 도약하는 길운입니다. 귀인이나 상사의 후원을 입어 남쪽(발전 방향)으로 나아가십시오.",
    "loveFate": "관계가 한 단계 더 높은 성숙함과 깊이로 도약합니다. 겸손하고 순리를 따르면 축복을 받습니다.",
    "wealthFate": "자산 가치와 소득이 차근차근 점진적으로 성장하여 큰 결실에 도달합니다."
  },
  {
    "id": 47,
    "nameHanji": "澤水困",
    "nameKorean": "택수곤",
    "summary": "곤경과 막힘 / 자금/상황 차단",
    "meaning": "연못 아래로 물이 빠져나가 얼어붙은 극심한 곤경의 상입니다. 말로 변명하려 하지 말고 바른 마음으로 인내하십시오.",
    "generalFate": "연못 아래로 물이 모두 빠져나가 얼어붙은 극심한 고난의 괘입니다. 말로 변명하여 난관을 벗어나려 하지 말고, 바른 지조를 지키며 자중하고 인내하십시오.",
    "businessFate": "자금줄 차단이나 곤경에 직면합니다. 변명하려 애쓰지 말고 중심을 바르게 지키며 내실을 인내로 수성하십시오.",
    "loveFate": "말다툼이나 말로 해명하려 할수록 오해가 깊어집니다. 묵묵히 행동으로 바른 지조를 보이십시오.",
    "wealthFate": "극심한 자금 압박과 가뭄의 상입니다. 소비를 최소화하고 바른 신념으로 인내해야 시련이 지나갑니다."
  },
  {
    "id": 48,
    "nameHanji": "水風井",
    "nameKorean": "수풍정",
    "summary": "마르지 않는 샘물 / 지속적 공유",
    "meaning": "마을은 옮겨가도 마르지 않고 무한히 솟아나는 샘물의 형국입니다. 내면의 혜안을 닦아 타인과 지혜를 지속 공유하십시오.",
    "generalFate": "마을은 옮겨가도 마르지 않고 언제나 샘물을 퍼 올리는 아량과 공유의 괘입니다. 내면의 혜안을 끊임없이 다듬어 사람들에게 지혜와 가치를 베푸십시오.",
    "businessFate": "마르지 않는 기술력이나 본질적 가치를 다져 사람들에게 지속적으로 제공할 때 사업이 안정적 형통을 누립니다.",
    "loveFate": "변함없는 샘물처럼 언제나 마음에 위로와 깊은 샘물을 안겨주는 정답고 성숙한 연애운입니다.",
    "wealthFate": "꾸준하고 마르지 않는 수입원이 형성됩니다. 자만하여 두레박(자금 관리 체계)을 깨뜨리지 않도록 삼가하십시오."
  },
  {
    "id": 49,
    "nameHanji": "澤火革",
    "nameKorean": "택화혁",
    "summary": "판도 개혁 / 체제와 혁신",
    "meaning": "못 가운데 불이 있어 가죽을 무두질하듯 구태를 철저히 쇄신하는 혁신의 시기입니다. 명분이 바르고 시기가 무르익었을 때 나아가하십시오.",
    "generalFate": "연못 가운데 불이 붙어 낡은 가죽을 무두질하듯 체제와 구태를 과감히 개혁하는 괘입니다. 명분이 정당하고 시기가 무르익었을 때 쇄신하면 만인이 신뢰합니다.",
    "businessFate": "낡은 업무 방식이나 구태의연한 시스템을 과감히 파기하고 새로운 혁신을 단행해야 할 시기입니다.",
    "loveFate": "매너리즘이나 나쁜 습관을 털어내고 새로운 규칙과 관계로의 획기적 쇄신이 필요합니다.",
    "wealthFate": "부실 자산이나 구조적 적자 항목을 과감히 포트폴리오 개편하십시오. 쇄신 후 수익성이 호전됩니다."
  },
  {
    "id": 50,
    "nameHanji": "火風鼎",
    "nameKorean": "화풍정",
    "summary": "새로운 안착 / 솥을 거는 번창",
    "meaning": "솥 아래 불을 지펴 맛있는 음식을 대접하듯 새로운 기틀과 섭리를 안착시키는 번창의 상입니다. 인재를 등용하십시오.",
    "generalFate": "솥 아래 불을 지펴 조화롭게 음식을 익히고 인재를 대접하는 안정과 체제 안착의 괘입니다. 혁신(革) 다음에 새로운 도리와 인재를 안착시킬 때 길합니다.",
    "businessFate": "개혁 후 새로운 체제와 신규 인재가 안착하여 안정된 대성공과 번창을 누립니다. 인재를 적극 우대하십시오.",
    "loveFate": "서로를 이해하고 조화롭게 보살피는 성숙한 안착의 관계입니다. 혼인이나 가정의 축복이 깃듭니다.",
    "wealthFate": "안정적인 소득 창출과 자산 가치 상승이 도래합니다. 알찬 결실을 주위 사람들과 풍요롭게 나누십시오."
  },
  {
    "id": 51,
    "nameHanji": "重雷震",
    "nameKorean": "중뢰진",
    "summary": "두 번의 천둥 / 스스로의 각성",
    "meaning": "두 번의 강렬한 천둥소리가 잇달아 진동하듯 주위를 놀라게 하는 소식이 오나, 자만하지 않고 경계하며 각성하면 길합니다.",
    "generalFate": "강렬한 천둥소리가 잇달아 쿵쿵 진동하듯 주위를 놀라게 하는 벼락같은 소식이 오나, 두려움 속에서 반성하고 각성하면 마침내 웃음과 길함이 되돌아옵니다.",
    "businessFate": "갑작스러운 시장 변화나 놀라운 충격 소식이 오나, 당황하지 않고 내부 방비를 철저히 하면 도리어 복이 됩니다.",
    "loveFate": "갑작스러운 말다툼이나 놀라운 오해가 불거지나, 성찰하고 자중하면 서로 웃음을 찾고 더욱 정이 다져집니다.",
    "wealthFate": "일시적인 유동성 파동이나 자금 소동이 생길 수 있습니다. 내실을 차분히 정돈하면 곧 안정을 회복합니다."
  },
  {
    "id": 52,
    "nameHanji": "重山艮",
    "nameKorean": "중산간",
    "summary": "첩첩산중 / 멈추어 서는 고요",
    "meaning": "산 넘어 첩첩산중이 막혀 멈추어 서야 할 때입니다. 그침과 멈춤의 정돈을 통해 내면의 고요와 절제를 배우십시오.",
    "generalFate": "산 넘어 첩첩산중이 막혀 멈추어 서야 하는 그침(止)과 절제의 괘입니다. 나아갈 때와 멈출 때를 명확히 분별하여 내면의 고요함을 유지할 때 탈이 없습니다.",
    "businessFate": "무리한 전진이나 신규 계약 추진을 전면 일시 정지하십시오. 마음의 정돈과 내면 수양에 매진할 때입니다.",
    "loveFate": "감정의 소동을 멈추고 거리를 두며 마음의 고요를 유지하십시오. 조급히 다가가가지 않는 것이 이롭습니다.",
    "wealthFate": "자금 지출과 투자를 완벽히 동결하고 현 상태를 유지하십시오. 그침의 지혜가 자산을 안전하게 보존합니다."
  },
  {
    "id": 53,
    "nameHanji": "風山漸",
    "nameKorean": "풍산점",
    "summary": "점진적 성숙 / 단계별 발전",
    "meaning": "산 위에 나무가 나날이 자라나듯 무리하지 않고 단계별로 차분히 점진적으로 발전하는 정돈된 길운입니다.",
    "generalFate": "산 위에 나무가 나날이 차분히 자라나듯 무리하지 않고 단계별로 점진적으로 성숙하여 결실을 맺는 괘입니다. 서두르지 말고 차근차근 전진하십시오.",
    "businessFate": "단계별로 수순을 밟아 나가는 안정된 프로젝트 확장이 성과를 가져옵니다. 단계를 뛰어넘으려 하지 마십시오.",
    "loveFate": "서로 간의 절차와 매너를 지키며 천천히 깊어지는 원만한 인연운입니다. 혼인이나 정식 교제에 지극히 길합니다.",
    "wealthFate": "적금이나 점진적 저축으로 자산이 날마다 두터워집니다. 차근차근 모아 나가는 자금운이 우수합니다."
  },
  {
    "id": 54,
    "nameHanji": "雷澤歸妹",
    "nameKorean": "뇌택귀매",
    "summary": "절차 무시 경계 / 급한 결정 자제",
    "meaning": "절차와 도리를 무시하고 성급하게 성사시키려다 도리어 불리해지는 상입니다. 조급한 탐욕을 버리고 순리를 지키십시오.",
    "generalFate": "절차와 도리를 무시하고 성급하게 결과를 얻으려다 도리어 큰 손실을 입는 경계의 괘입니다. 탐욕과 조급함을 버리고 정당한 절차를 지켜야 합니다.",
    "businessFate": "정당한 정식 계약 절차나 순서를 생략하고 쾌속 추진하려다 법적/상거래 분쟁에 휘말리기 쉽습니다. 수순을 지키십시오.",
    "loveFate": "충동적인 감정에 끌려 서둘러 결합하려다 후회하기 쉽습니다. 서로의 됨됨이와 예의를 제대로 확인해야 합니다.",
    "wealthFate": "편법이나 사사로운 연줄을 이용한 투자는 반드시 흉으로 되돌아옵니다. 정당한 자금 지출을 도모하십시오."
  },
  {
    "id": 55,
    "nameHanji": "雷火豊",
    "nameKorean": "뇌화풍",
    "summary": "최절정의 풍요 / 몰락 그늘 경계",
    "meaning": "천둥과 번개가 함께 작용하여 최절정의 화려함과 풍요를 누리는 전성기입니다. 해가 차면 지듯 그늘을 미리 대비하십시오.",
    "generalFate": "천둥과 번개가 어우러져 최절정의 화려함과 풍요를 누리는 전성기 괘입니다. 해가 차면 지듯이 절정의 순간일수록 음지의 몰락을 대비하는 지혜가 필수적입니다.",
    "businessFate": "사업이 찬란한 최정상의 풍요와 성공을 거둡니다. 전성기일수록 오만해지지 말고 다가올 차후 침체기를 대비하십시오.",
    "loveFate": "화려하고 정열적인 사랑과 애정이 절정에 도달합니다. 지나친 과시나 사치에 빠지지 않도록 유의하십시오.",
    "wealthFate": "막대한 매출과 재물이 들어오는 풍요로운 호운입니다. 돈이 흘러넘칠 때 내실 자산을 저축해 두어야 안전합니다."
  },
  {
    "id": 56,
    "nameHanji": "火山旅",
    "nameKorean": "화산려",
    "summary": "외로운 나그네 / 겸손한 처신",
    "meaning": "산 위에 불이 지나가는 객지의 외로운 나그네 상입니다. 자만하지 말고 주위 사람들에게 온화하고 겸손하게 처신하십시오.",
    "generalFate": "산 위에 불이 스쳐 지나가듯 객지에서 타향살이를 하는 외로운 나그네의 괘입니다. 이기심과 교만을 버리고 겸손하고 신중히 처신해야 이로움이 있습니다.",
    "businessFate": "타향이나 새로운 시장, 해외 진출 등의 과제가 주어집니다. 텃세나 낯선 환경에 겸손하게 처신해야 안전합니다.",
    "loveFate": "외로움이 깊어지기 쉬운 정처 없는 운기입니다. 상대방에게 고집을 피우지 말고 조용히 정성을 다하십시오.",
    "wealthFate": "체류비나 여비 지출이 많아질 수 있습니다. 객지에서의 방심한 자금 지출을 삼가고 알뜰하게 수성하십시오."
  },
  {
    "id": 57,
    "nameHanji": "重風巽",
    "nameKorean": "중풍손",
    "summary": "부드러운 유연성 / 침투와 적응",
    "meaning": "바람이 겹쳐서 만물에 침투하듯 부드럽고 겸손한 태도로 적응하며 파고드는 이로운 처세의 시기입니다.",
    "generalFate": "바람이 겹겹이 스며들어 만물에 침투하듯 부드럽고 유연하며 겸손한 태도로 타인의 마음을 얻고 사태에 적응하는 처세의 시기입니다.",
    "businessFate": "강압적 무력보다는 부드럽고 집요한 설득과 조율이 성과를 만듭니다. 고객의 니즈를 깊숙이 파고드십시오.",
    "loveFate": "상대방의 마음에 부드럽고 다정하게 스며드는 애정운입니다. 강요하지 말고 온화한 태도를 지키십시오.",
    "wealthFate": "소소하게 구하는 바가 원만히 성사됩니다. 부드럽게 유동 자금을 운용하며 이익을 챙기십시오."
  },
  {
    "id": 58,
    "nameHanji": "重澤兌",
    "nameKorean": "중택태",
    "summary": "즐거운 화합 / 다정한 소통",
    "meaning": "두 연못이 서로를 적셔주듯 즐겁게 화합하고 진심 어린 다정한 소통을 통해 형통한 기쁨을 나누는 시기입니다.",
    "generalFate": "두 연못이 서로 적셔주듯 즐겁고 기쁘게 화합하는 소통의 괘입니다. 진심 어린 대화와 기쁨을 나눌 때 만인이 감복하여 어떠한 난관도 함께 극복합니다.",
    "businessFate": "고객 만족 및 커뮤니케이션 중심 서비스가 대호평을 받습니다. 기쁨과 웃음을 전하는 비즈니스가 대길합니다.",
    "loveFate": "대화가 맑게 통하고 웃음꽃이 피어나는 가장 기분 좋은 연애운입니다. 진심 어린 다정함이 사랑을 완성합니다.",
    "wealthFate": "즐거운 소통을 통한 재물 거래와 협력 이익이 솟구칩니다. 유흥 과소비만 주의하면 자금이 넉넉합니다."
  },
  {
    "id": 59,
    "nameHanji": "風水渙",
    "nameKorean": "풍수환",
    "summary": "걱정의 산화 / 해묵은 앙금 해소",
    "meaning": "바람이 물 위를 지나가 앙금과 얼음을 흩뿌려 해소하듯, 오랜 근심과 걱정이 맑게 산화되어 풀리는 상입니다.",
    "generalFate": "봄바람이 강물 위를 불어 얼어붙은 앙금과 근심을 시원하게 흩뿌려 해소하는 괘입니다. 묵은 앙금을 비우고 사람들을 규합하면 대업을 달성합니다.",
    "businessFate": "오래된 근심이나 묵은 앙금이 바람에 흩어지듯 풀립니다. 흩어진 역량을 중심으로 모아 대형 프로젝트를 추진하십시오.",
    "loveFate": "오해가 바람에 날아가듯 맑게 씻깁니다. 마음을 비우고 진실되게 사람을 대하면 마음이 성대하게 통합니다.",
    "wealthFate": "지출이나 자금 소모가 다소 흩어질 수 있으나, 목적 있는 투자로 전환하면 큰 강을 건너듯 대성과가 옵니다."
  },
  {
    "id": 60,
    "nameHanji": "水澤節",
    "nameKorean": "수택절",
    "summary": "적절한 절제 / 규범과 도리",
    "meaning": "연못에 수량이 일정하여 넘치거나 마르지 않도록 알맞게 절제하는 상입니다. 규범과 자제를 지킬 때 형통함이 지속됩니다.",
    "generalFate": "연못에 일정한 수량이 차 있어 넘치거나 마르지 않도록 절제하는 괘입니다. 규범과 자제를 지켜야 통하나 지나치게 가혹하고 고통스러운 절제는 지속될 수 없습니다.",
    "businessFate": "조직의 절약 규칙과 마일스톤 기준을 정립하십시오. 단, 직원들을 들볶는 가혹한 절제(苦節)는 반발을 부릅니다.",
    "loveFate": "서로 간의 예의와 경계를 아끼며 알맞은 절제를 유지하는 것이 오래가는 인연의 비결입니다.",
    "wealthFate": "계획적인 지출 통제와 자산 절제가 자금을 안락하게 보호해 줍니다. 분수에 맞는 소비가 핵심입니다."
  },
  {
    "id": 61,
    "nameHanji": "風澤中孚",
    "nameKorean": "풍택중부",
    "summary": "맑은 신뢰 / 진심 어린 믿음",
    "meaning": "새가 알을 품듯 맑은 진심과 신뢰가 내면에 충만한 상태입니다. 진정성을 지니고 사람들을 대하면 만사가 통합니다.",
    "generalFate": "새가 알을 품듯 순수한 진실과 맑은 신뢰가 내면에 그득한 괘입니다. 까다로운 사람이나 미물에게까지 진심이 통하니 큰 강을 건너듯 대업을 이룹니다.",
    "businessFate": "고객 및 상거래 관계에서 100% 진정성과 신뢰로 임할 때 까다로운 계약도 성사되고 대업을 이룹니다.",
    "loveFate": "새가 알을 다정하게 품듯 진심 어린 사랑과 맑은 신뢰가 내면에 가득 찬 성숙한 사랑입니다.",
    "wealthFate": "진실된 거래와 정당한 신뢰에 기반한 자산 증대가 이루어집니다. 맑은 투자가 큰 이로움을 부릅니다."
  },
  {
    "id": 62,
    "nameHanji": "雷山小過",
    "nameKorean": "뇌산소과",
    "summary": "낮게 내림 / 소소한 과오 넘김",
    "meaning": "새가 높이 날지 않고 낮게 내리듯, 큰일보다는 작은 일에 집중하고 스스로를 낮추어 소소한 과오를 넘기는 시기입니다.",
    "generalFate": "새가 높이 날지 않고 낮게 내리듯 소소한 지나침이나 실수는 용납되나 대업을 크게 벌여서는 안 되는 괘입니다. 스스로를 낮추고 작은 일부터 정성껏 챙기십시오.",
    "businessFate": "대형 무리한 확장은 금물입니다. 소소한 정돈 과제나 작은 일부터 정확히 처리할 때 안전함과 형통을 누립니다.",
    "loveFate": "상대방에게 지나칠 정도로 겸손하게(行過乎恭) 자신을 낮추고 정성을 다하는 태도가 마음을 사로잡습니다.",
    "wealthFate": "큰 재물 투자는 금물이며 지출을 지나칠 정도로 검소하게(用過乎儉) 통제하는 것이 지혜입니다."
  },
  {
    "id": 63,
    "nameHanji": "水火旣濟",
    "nameKorean": "수화기제",
    "summary": "만사 완성 / 쇠퇴 대비",
    "meaning": "물이 위에 있고 불이 아래에 있어 만사가 이미 완벽하게 도달하고 성취된 상태입니다. 자만하지 말고 쇠퇴를 준비하십시오.",
    "generalFate": "물이 위에 있고 불이 아래에 있어 기운이 조화롭게 다스려진 완벽한 성취의 상태입니다. 완성 뒤의 쇠퇴를 방지해야 합니다.",
    "businessFate": "목표했던 성공과 마무리가 이루어진 시기입니다. 확장을 노리기보다 현재의 성과를 안전하게 유지하십시오.",
    "loveFate": "원만한 결실과 관계 안정을 누리지만 매너리즘이나 작은 소홀함이 오해를 낳지 않도록 정성을 다하십시오.",
    "wealthFate": "소득과 자산이 안정되어 있으나 방심한 지출이나 투자는 삼가야 합니다. 보수적 수성이 상책입니다."
  },
  {
    "id": 64,
    "nameHanji": "火水未濟",
    "nameKorean": "화수미제",
    "summary": "미완의 상태 / 새로운 도전 희망",
    "meaning": "불이 위에 있고 물이 아래 있어 아직 완성되지 않은 미완의 상태입니다. 새로운 차원의 성공을 향해 도전을 준비하십시오.",
    "generalFate": "불이 위에 있고 물이 아래에 있어 아직 조화에 도달하지 못한 미완의 상태입니다. 그러나 무한한 가능성과 새로운 도전을 품고 있습니다.",
    "businessFate": "마무리 단계에서 서두르다 그르칠 수 있습니다. 마지막까지 꼼꼼히 점검하고 새로운 도전을 차분히 준비하십시오.",
    "loveFate": "서로 마음을 터놓기 직전의 조심스러운 시기입니다. 서두르지 말고 천천히 진심을 나누어야 성사됩니다.",
    "wealthFate": "손실이나 자금 차질을 막기 위해 최종 도장 찍기까지 신중해야 합니다. 차후 호운을 바라보고 기반을 다지십시오."
  }
];

  // 10개씩 청크 단위 병렬 처리
  const chunkSize = 10;
  for (let i = 0; i < hexagramsToSeed.length; i += chunkSize) {
    const chunk = hexagramsToSeed.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(h =>
        tx.iChingHexagram.upsert({
          where: { id: h.id },
          update: h,
          create: h
        })
      )
    );
  }

  console.log(`✓ Seeded ${hexagramsToSeed.length} I Ching 64 Hexagrams.`);

  // 384효 (IChingLine) 정통 시드 데이터 시딩
  const linesJsonPath = path.join(process.cwd(), 'prisma', 'iching_384_lines.json')
  if (fs.existsSync(linesJsonPath)) {
    const rawLines = JSON.parse(fs.readFileSync(linesJsonPath, 'utf-8'))
    for (let i = 0; i < rawLines.length; i += 20) {
      const chunk = rawLines.slice(i, i + 20)
      await Promise.all(
        chunk.map((l: any) =>
          tx.iChingLine.upsert({
            where: {
              hexagramId_lineNumber: {
                hexagramId: l.hexagramId,
                lineNumber: l.lineNumber
              }
            },
            update: {
              nameHanja: l.nameHanja,
              textHanja: l.textHanja,
              textKorean: l.textKorean,
              modernAdvice: l.modernAdvice
            },
            create: {
              hexagramId: l.hexagramId,
              lineNumber: l.lineNumber,
              nameHanja: l.nameHanja,
              textHanja: l.textHanja,
              textKorean: l.textKorean,
              modernAdvice: l.modernAdvice
            }
          })
        )
      )
    }
    console.log(`✓ Seeded ${rawLines.length} I Ching 384 Lines.`)
  }
    }, {
      timeout: 90000 // 90초 타임아웃
    })

    console.log('✅ Database seeding completed successfully.')
  } catch (error) {
    console.error('❌ Database seeding failed:')
    console.error(error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
