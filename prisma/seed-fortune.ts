import { PrismaClient } from '@prisma/client'
declare const process: any

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
})

async function main() {
  console.log('Seeding fortune data...')

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

  for (const s of stems) {
    await prisma.sajuIlgan.upsert({
      where: { stem: s.stem },
      update: s,
      create: s
    })
  }
  console.log('Seeded Saju Stems.')

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

  for (const sh of shipsins) {
    await prisma.sajuShipsin.upsert({
      where: { name: sh.name },
      update: sh,
      create: sh
    })
  }
  console.log('Seeded Saju Shipsins.')

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

  for (const j of jijis) {
    await prisma.sajuJiji.upsert({
      where: { name: j.name },
      update: j,
      create: j
    })
  }
  console.log('Seeded Saju Jijis.')

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

  for (const ilju of iljus) {
    await prisma.sajuIlju.upsert({
      where: { order: ilju.order },
      update: ilju,
      create: ilju
    })
  }
  console.log('Seeded 60 Saju Iljus.')

  // 4. I Ching 64 Hexagrams (주역 64괘)
  const hexagrams = [
    {
      id: 1,
      nameHanji: '乾爲天',
      nameKorean: '중천건',
      summary: '하늘 위에 또 하늘이 있으니, 강건하고 역동적인 기운의 절정입니다.',
      meaning: '하늘(陽)의 기운만이 가득한 형상으로 강하고 굳건한 태도를 의미합니다. 최고조에 달한 기운인 만큼 자만하여 무리하게 나아가면 실패할 수 있으니 겸손한 리더십이 요구됩니다.',
      generalFate: '운기가 최고조에 달해 강하게 추진하면 성과를 낼 수 있으나 독단적인 태도는 피하십시오.',
      businessFate: '새로운 사업을 주도적으로 시작하기에 좋으나 내부 동업자와의 조율이 필수적입니다.',
      loveFate: '적극적이고 열정적인 관계가 형성되나 상대방을 지나치게 억누르지 않도록 조심하세요.',
      wealthFate: '투자나 사업을 통한 수익 상승을 기대할 수 있으나 유동자금 관리에 철저해야 합니다.'
    },
    {
      id: 2,
      nameHanji: '坤爲地',
      nameKorean: '중지곤',
      summary: '대지 위에 또 대지가 있으니, 만물을 품어 기르는 순종과 수용의 미덕입니다.',
      meaning: '땅(陰)의 기운이 두텁게 쌓인 형상으로 온화하고 포용력 있는 자세를 뜻합니다. 스스로 앞장서기보다는 다른 사람을 지원하고 따를 때 길함이 찾아옵니다.',
      generalFate: '새로운 모험보다는 기존의 것을 지키고 사람들의 의견을 포용하는 온건한 태도가 유리합니다.',
      businessFate: '2인자의 자리에서 협조하거나 뒤를 받쳐주는 파트너십 형태의 비즈니스가 길합니다.',
      loveFate: '부드럽고 헌신적인 사랑이 이루어지며, 서로를 깊이 이해하고 신뢰를 쌓아가는 시기입니다.',
      wealthFate: '과도한 욕심을 버리고 안정적인 자산 관리와 저축에 무게를 두는 것이 현명합니다.'
    },
    {
      id: 3,
      nameHanji: '水雷屯',
      nameKorean: '수뢰준',
      summary: '험난한 물속에서 번개가 요동치니, 새싹이 굳은 땅을 뚫고 돋아나려는 시련의 시작입니다.',
      meaning: '세상의 만물이 처음 생겨날 때 겪는 험난함(어려움)을 의미합니다. 성급하게 나아가면 장벽에 막히니 기초를 튼튼히 닦고 귀인의 도움을 기다려야 합니다.',
      generalFate: '초기 단계의 난관이 예상되니 서두르지 말고 계획을 면밀히 재검토하며 차분히 대비하십시오.',
      businessFate: '창업이나 신규 프로젝트 초기에 난항을 겪을 수 있으나 전문가의 자문을 얻어 버텨내야 합니다.',
      loveFate: '서로에 대해 알아가는 과정에서 다소의 서먹함이나 오해가 발생할 수 있으니 시간을 두세요.',
      wealthFate: '자금 사정이 일시적으로 묶일 수 있으니 불필요한 대출이나 투자는 절대 보류하십시오.'
    },
    {
      id: 4,
      nameHanji: '山水蒙',
      nameKorean: '산수몽',
      summary: '산 아래 맑은 샘물이 안개에 가려진 격이니, 미숙함 속에서 지혜를 구하는 시기입니다.',
      meaning: '아직 깨우치지 못한 어린아이처럼 어리석고 몽매함을 뜻합니다. 섣부른 판단을 경계하고 훌륭한 스승이나 경험자의 가르침을 적극 수용하여 배워야 할 때입니다.',
      generalFate: '상황이 불투명하고 안개 속에 있는 형국입니다. 독자적 행동을 멈추고 자문을 받으십시오.',
      businessFate: '새로운 기술이나 지식을 습득하고 인프라를 정비하는 등 내부 교육과 정비에 최적기입니다.',
      loveFate: '상대방의 마음을 잘 읽지 못해 서툴 수 있으니, 솔직한 대화와 소통으로 오해를 풀어야 합니다.',
      wealthFate: '재정적인 관리에 아직 미숙한 점이 많으니 투자 권유에 귀를 닫고 보수적으로 움직이십시오.'
    },
    {
      id: 5,
      nameHanji: '水天需',
      nameKorean: '수천수',
      summary: '하늘 위에 비구름이 가득 차 있는 형상이니, 비가 내리기를 여유롭게 기다리는 때입니다.',
      meaning: '풍요를 가져다줄 비를 기다리는 지혜를 말합니다. 눈앞의 기회를 쫓아 서두르지 말고 심신을 재충전하며 때(기회)가 무르익기를 차분히 기다리는 것이 유리합니다.',
      generalFate: '기다림이 최고의 전략입니다. 조급해하지 말고 여유롭게 준비하면서 다음 기회를 도모하십시오.',
      businessFate: '진행 중인 협상이나 계약이 지연될 수 있으나 무리하게 독촉하지 말고 순리를 따르십시오.',
      loveFate: '서두르면 관계를 그르칠 수 있으니 상대방의 감정 변화를 기다려주는 깊은 배려가 필요합니다.',
      wealthFate: '기대했던 수익이나 자금 회수가 지연될 수 있으나 결국 해결되니 비상 예비금을 관리하세요.'
    },
    {
      id: 6,
      nameHanji: '天水訟',
      nameKorean: '천수송',
      summary: '하늘은 위로 가려 하고 물은 아래로 흐르니, 서로 뜻이 달라 다투는 형상입니다.',
      meaning: '의견 차이로 인해 시비나 소송, 다툼이 일어나는 것을 의미합니다. 끝까지 싸워 이기려 하면 서로 상처만 남으니, 중간에 타협점을 찾거나 양보하는 것이 최종적으로 길합니다.',
      generalFate: '갈등과 마찰이 우려되는 날입니다. 논쟁에서 한 걸음 물러나 타협하는 자세가 필요합니다.',
      businessFate: '계약서 조항을 면밀히 검토하고 동업자나 고객과의 마찰 시 법적 다툼보다는 중재를 선택하세요.',
      loveFate: '사소한 자존심 싸움이 큰 말다툼으로 번질 수 있으니 역지사지의 마음으로 대해야 합니다.',
      wealthFate: '금전 거래와 관련된 시비가 생길 수 있으니 차용증을 확실히 작성하고 빌려주는 것은 삼가세요.'
    },
    {
      id: 7,
      nameHanji: '地水師',
      nameKorean: '지수사',
      summary: '땅속에 거대한 물줄기가 모여 흐르니, 대중을 이끌고 나아가는 전쟁터와 같은 상황입니다.',
      meaning: '군사를 모아 전쟁에 나서는 엄중한 상태를 뜻합니다. 강력한 기율과 리더십, 그리고 대의명분이 있어야 험난한 고비를 뚫고 승리할 수 있습니다.',
      generalFate: '경쟁이 치열하고 긴장감이 팽팽한 하루입니다. 책임감 있게 사람들을 조율해야 합니다.',
      businessFate: '구조조정이나 힘겨운 시장 개척 등 중대한 결단이 필요하며, 리더의 신중한 지휘가 요구됩니다.',
      loveFate: '관계에 주도권 싸움이 있을 수 있으며, 서로 예의와 선을 지킬 때 갈등이 해소됩니다.',
      wealthFate: '목돈이 나갈 수 있는 위기 상황일 수 있으니 지출 통제를 확실히 하고 방어적으로 대처하십시오.'
    },
    {
      id: 8,
      nameHanji: '水地比',
      nameKorean: '수지비',
      summary: '땅 위에 물이 고여 조화롭게 섞이니, 서로 친밀하게 돕고 뭉치는 형상입니다.',
      meaning: '주위 사람들과 협력하고 친하게 지내는 상생과 동반 관계를 의미합니다. 신용을 바탕으로 조력자를 구하거나 협조적인 태도를 취하면 만사가 형통합니다.',
      generalFate: '대인관계운이 매우 좋습니다. 주위 동료나 친구들과 소통하며 협력 체계를 구축하십시오.',
      businessFate: '파트너십 계약, 협력 제휴 등 공동의 이익을 도모하는 프로젝트에 매우 훌륭한 타이밍입니다.',
      loveFate: '서로 마음이 아주 잘 통하고 호감도가 급격히 상승하는 날입니다. 고백하기에도 좋은 흐름입니다.',
      wealthFate: '주위 사람의 좋은 조언이나 소개를 통해 유리한 투자 기회나 재정적 도움을 얻을 수 있습니다.'
    }
  ]

  const allHexNames = [
    { id: 9, nameHanji: '風天小畜', nameKorean: '풍천소축', summary: '바람이 하늘 위에서 구름을 모으지만 아직 비는 내리지 않는 소소한 축적입니다.' },
    { id: 10, nameHanji: '天澤履', nameKorean: '천택리', summary: '호랑이 꼬리를 밟는 것 같은 위험한 상황이나 예의를 갖춰 조심히 걸어가는 때입니다.' },
    { id: 11, nameHanji: '地天泰', nameKorean: '지천태', summary: '하늘과 땅의 기운이 평화롭게 소통하니, 평화롭고 만사가 형통하는 태평성대입니다.' },
    { id: 12, nameHanji: '天地否', nameKorean: '천지비', summary: '하늘과 땅이 서로 등을 돌려 소통이 단절되니, 꽉 막혀 나아가기 힘든 쇠퇴기입니다.' },
    { id: 13, nameHanji: '天火同人', nameKorean: '천화동인', summary: '하늘 아래 불길이 넓게 번지듯, 뜻을 같이하는 현명한 동료들과 힘을 모으는 때입니다.' },
    { id: 14, nameHanji: '火天大有', nameKorean: '화천대유', summary: '하늘 위에 태양이 눈부시게 빛나니, 크게 소유하고 풍요를 누리는 전성기입니다.' },
    { id: 15, nameHanji: '地山謙', nameKorean: '지산겸', summary: '높은 산이 넓은 땅 아래로 엎드린 형상이니, 자신을 낮추는 겸손함으로 덕을 베풉니다.' },
    { id: 16, nameHanji: '雷地豫', nameKorean: '뇌지예', summary: '대지 위로 천둥번개가 울리며 봄비가 내릴 기미를 알리니, 기쁘고 유쾌하게 대비합니다.' },
    { id: 17, nameHanji: '澤雷隨', nameKorean: '택뢰수', summary: '연못 아래에 천둥이 잠겨 흐름에 순응하니, 순리와 대세에 따라 움직여야 이롭습니다.' },
    { id: 18, nameHanji: '山風蠱', nameKorean: '산풍고', summary: '산 아래 바람이 막혀 그릇 속에 벌레가 생기는 형상이니, 낡은 폐단을 개혁해야 합니다.' },
    { id: 19, nameHanji: '地澤臨', nameKorean: '지택림', summary: '대지가 연못을 품고 위에서 내려다보니, 세력이 커지고 기회가 다가오는 군림의 상입니다.' },
    { id: 20, nameHanji: '風地觀', nameKorean: '풍지관', summary: '바람이 대지 위를 휩쓸며 만물을 널리 살피니, 성찰하고 정세를 관망하는 시기입니다.' },
    { id: 21, nameHanji: '火雷噬嗑', nameKorean: '화뢰서합', summary: '입속에 단단한 장애물이 걸려 있어 이를 씹어 넘기듯, 장애를 단호히 단죄하고 돌파합니다.' },
    { id: 22, nameHanji: '山火賁', nameKorean: '산화비', summary: '산 아래에 아름다운 불빛이 비치어 겉모습을 화려하게 꾸미는 장식의 예술성입니다.' },
    { id: 23, nameHanji: '山지剝', nameKorean: '산지박', summary: '산 아래 땅이 깎여나가 기둥만 위태롭게 남은 형상이니, 쇠락하여 은신해야 할 때입니다.' },
    { id: 24, nameHanji: '地雷復', nameKorean: '지뢰복', summary: '땅속 깊은 곳에서 하나의 양기가 다시 꿈틀거리니, 시련 끝에 희망이 돌아오는 회복입니다.' },
    { id: 25, nameHanji: '天雷無妄', nameKorean: '천뢰무망', summary: '하늘 아래 천둥이 치니 인위적 기대를 버리고 자연스러운 순리에 따르는 무망입니다.' },
    { id: 26, nameHanji: '山天大畜', nameKorean: '산천대축', summary: '산속에 큰 하늘을 품고 있는 형상이니, 지식과 힘을 크게 비축하여 기회를 기다립니다.' },
    { id: 27, nameHanji: '山雷頤', nameKorean: '산뢰이', summary: '산 아래에 번개가 요동치며 턱을 움직여 음식을 먹듯, 몸과 마음을 기르는 수양입니다.' },
    { id: 28, nameHanji: '澤風大過', nameKorean: '택풍대과', summary: '연못물이 무거워 든든한 대들보가 휘어지는 형상이니, 책임이 막중하고 고난의 한계점입니다.' },
    { id: 29, nameHanji: '重水坎', nameKorean: '중수감', summary: '물속에 또 험난한 물이 겹겹이 갇혀 있으니, 험한 함정에 빠진 격이라 조심히 인내합니다.' },
    { id: 30, nameHanji: '重火離', nameKorean: '중화리', summary: '타오르는 불길이 겹쳐서 세상을 밝히니, 명석하고 화려하나 붙어 있을 터전이 필요합니다.' },
    { id: 31, nameHanji: '澤山咸', nameKorean: '택산함', summary: '연못과 산의 기운이 조화롭게 만나니, 남녀가 마음으로 통하고 호감과 매력이 넘칩니다.' },
    { id: 32, nameHanji: '雷風恒', nameKorean: '뇌풍항', summary: '천둥과 바람이 서로 조화를 이루며 끊임없이 순환하니, 한결같은 마음을 지켜냅니다.' },
    { id: 33, nameHanji: '天山遯', nameKorean: '천산둔', summary: '산이 하늘을 쫓아오나 하늘이 물러나 피하듯, 세속의 번잡함을 피해 한 걸음 물러섭니다.' },
    { id: 34, nameHanji: '雷天大壯', nameKorean: '뇌천대장', summary: '하늘 위로 우렁찬 번개가 치니 기세가 충천하고 힘이 넘치나 경거망동을 조심하십시오.' },
    { id: 35, nameHanji: '火地晉', nameKorean: '화지진', summary: '대지 위로 밝은 태양이 우뚝 솟아오르듯, 재능을 널리 알리고 전진해 나아갑니다.' },
    { id: 36, nameHanji: '地火明夷', nameKorean: '지화명이', summary: '밝은 빛이 땅 아래로 묻혀 어두워진 격이니, 자신의 빛을 감추고 밤이 지나길 인내합니다.' },
    { id: 37, nameHanji: '風火家人', nameKorean: '풍화가인', summary: '집안의 따뜻한 모닥불에서 훈풍이 불어 나오듯, 가정을 화목하게 가꾸고 안정을 취합니다.' },
    { id: 38, nameHanji: '火澤睽', nameKorean: '화택규', summary: '불길은 위로 치솟고 못물은 아래로 흐르니, 뜻이 어긋나 대립하고 분열하는 형상입니다.' },
    { id: 39, nameHanji: '水山蹇', nameKorean: '수산건', summary: '눈 덮인 험한 산 앞에 얼어붙은 강이 가로막은 형국이니, 나아가지 말고 멈춰 서야 합니다.' },
    { id: 40, nameHanji: '雷水解', nameKorean: '뇌수해', summary: '봄눈이 녹아 시냇물로 흘러가고 천둥이 장애를 깨부수니, 맺힌 고난과 오해가 풀립니다.' },
    { id: 41, nameHanji: '山澤損', nameKorean: '산택손', summary: '산 아래 연못을 깊게 파서 산을 높이듯, 아래를 덜어내어 위를 살찌우는 자기희생입니다.' },
    { id: 42, nameHanji: '風雷益', nameKorean: '풍뢰익', summary: '바람과 천둥이 서로를 돕고 강화시켜주니, 덜어냈던 손실이 가치 있는 이익으로 돌아옵니다.' },
    { id: 43, nameHanji: '澤天夬', nameKorean: '택천쾌', summary: '하늘 위에 연못물이 가득 차 넘쳐나듯, 결연한 의지로 적폐나 난관을 결단하는 때입니다.' },
    { id: 44, nameHanji: '天風姤', nameKorean: '천풍구', summary: '하늘 아래 바람이 불어와 뜻밖의 강력한 기운(인연)을 마주하게 되는 예기치 못한 만남입니다.' },
    { id: 45, nameHanji: '澤地萃', nameKorean: '택지췌', summary: '대지 위에 연못이 넓게 형성되어 온갖 인재와 재물이 조화롭게 모여드는 번창함입니다.' },
    { id: 46, nameHanji: '地風昇', nameKorean: '지풍승', summary: '땅 아래에서 나무 씨앗이 싹을 틔워 하늘을 향해 차분하고 꼿꼿하게 자라나는 상승기입니다.' },
    { id: 47, nameHanji: '澤水困', nameKorean: '택수곤', summary: '연못 밑바닥의 물마저 빠져나가 나무들이 말라 죽어가니, 자금과 환경이 막힌 곤궁함입니다.' },
    { id: 48, nameHanji: '水風井', nameKorean: '수풍정', summary: '바람이 마르지 않는 샘물을 긷듯이, 한결같은 마음으로 마르지 않는 지혜를 널리 나눕니다.' },
    { id: 49, nameHanji: '澤火革', nameKorean: '택화혁', summary: '물과 불이 냄비 속에서 격렬히 싸워 본질을 바꾸어내듯, 낡은 체제를 뒤바꾸는 혁신입니다.' },
    { id: 50, nameHanji: '火風鼎', nameKorean: '화풍정', summary: '세 발 솥 아래 바람을 불어넣어 음식을 완성하듯, 신선한 기운을 모아 새롭게 안착시킵니다.' },
    { id: 51, nameHanji: '重雷震', nameKorean: '중뢰진', summary: '우르릉 쾅쾅 하늘을 울리는 큰 천둥이 거듭 치니, 깜짝 놀라 스스로를 살피고 각성합니다.' },
    { id: 52, nameHanji: '重山艮', nameKorean: '중산간', summary: '앞을 가로막은 거대한 첩첩산중이니, 무리하여 나아가지 말고 멈추어 서는 고요함입니다.' },
    { id: 53, nameHanji: '風山漸', nameKorean: '풍산점', summary: '산 위에 나무가 바람을 맞으며 한 해 한 해 묵묵히 성장하듯, 차분하고 순차적인 발전입니다.' },
    { id: 54, nameHanji: '雷澤歸妹', nameKorean: '뇌택귀매', summary: '소녀가 순리에 어긋나 급하게 시집가는 형국이니, 절차와 명분을 무시해 후회하게 됩니다.' },
    { id: 55, nameHanji: '雷火豊', nameKorean: '뇌화풍', summary: '대낮에 번개가 치듯 화려하고 번창한 최고조의 풍요를 얻었으나, 몰락의 그늘을 경계해야 합니다.' },
    { id: 56, nameHanji: '火山旅', nameKorean: '화산려', summary: '산 위에 홀로 타오르는 불길처럼 외로운 나그네의 길이니, 쓸쓸하고 겸손히 처신해야 합니다.' },
    { id: 57, nameHanji: '重風巽', nameKorean: '중풍손', summary: '바람이 거듭 불어 좁은 틈새까지 부드럽게 파고들듯, 유연하고 순종적인 자세로 침투합니다.' },
    { id: 58, nameHanji: '重澤兌', nameKorean: '중택태', summary: '출렁이는 두 연못물이 서로를 기쁘게 적셔주니, 다정하고 화합하는 즐거운 소통의 행복입니다.' },
    { id: 59, nameHanji: '風水渙', nameKorean: '풍수환', summary: '강풍이 얼어붙은 강물을 사정없이 녹여 흩어버리듯, 해묵은 걱정과 장벽이 흩어져 해소됩니다.' },
    { id: 60, nameHanji: '水澤節', nameKorean: '수택절', summary: '연못에 물이 넘치지 않게 둑을 쌓아 조절하듯, 삶의 규모와 지나친 욕심을 절제하는 법도입니다.' },
    { id: 61, nameHanji: '風澤中孚', nameKorean: '풍택중부', summary: '연못 위로 맑은 바람이 부니, 티 없이 맑은 신뢰와 정성어린 믿음이 상대의 마음을 움직입니다.' },
    { id: 62, nameHanji: '雷山小過', nameKorean: '뇌산소과', summary: '높이 날지 못하는 새가 둥지 아래로 낮게 내리듯, 소소한 과오는 넘기되 낮게 임해야 이롭습니다.' },
    { id: 63, nameHanji: '水火旣濟', nameKorean: '수화기제', summary: '물과 불이 조화를 이루어 밥을 다 지었으니, 목적한 바를 이루었으나 쇠퇴에 대비해야 합니다.' },
    { id: 64, nameHanji: '火水未濟', nameKorean: '화수미제', summary: '물과 불이 엇갈려 아직 밥을 짓지 못했으니, 미완성의 상태라 희망을 갖고 다시 도전합니다.' }
  ]

  for (const h of allHexNames) {
    const exists = hexagrams.find(item => item.id === h.id)
    const targetData = exists || {
      id: h.id,
      nameHanji: h.nameHanji,
      nameKorean: h.nameKorean,
      summary: h.summary,
      meaning: `${h.nameKorean} 괘는 ${h.summary.replace('입니다.', '')}을 상징합니다.`,
      generalFate: `이 시기는 ${h.summary.replace('입니다.', '')}과 같은 흐름이므로 무리하기보다는 현재 상황을 냉정히 분석하고 대처하는 것이 길합니다.`,
      businessFate: '철저한 계획과 내부의 조화로운 조율을 거쳐 일을 도모해야 손해가 없습니다.',
      loveFate: '과도한 열정이나 급박한 고백보다는 서로의 신뢰를 천천히 쌓아갈 필요가 있는 때입니다.',
      wealthFate: '충동적인 소비를 줄하고 지출 관리를 단단히 함으로써 재정적 안정을 이뤄야 합니다.'
    }

    await prisma.iChingHexagram.upsert({
      where: { id: targetData.id },
      update: targetData,
      create: targetData
    })
  }

  for (const h of hexagrams.slice(0, 8)) {
    await prisma.iChingHexagram.upsert({
      where: { id: h.id },
      update: h,
      create: h
    })
  }

  console.log('Seeded I Ching 64 Hexagrams.')
  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
