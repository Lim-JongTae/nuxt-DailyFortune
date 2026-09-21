import { PrismaClient } from '@prisma/client'
declare const process: any

const prisma = new PrismaClient()

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
    { id: 23, nameHanji: '山지박', nameKorean: '산지박', summary: '산 아래 땅이 깎여나가 기둥만 위태롭게 남은 형상이니, 쇠락하여 은신해야 할 때입니다.' },
    { id: 24, nameHanji: '지뢰복', nameKorean: '지뢰복', summary: '땅속 깊은 곳에서 하나의 양기가 다시 꿈틀거리니, 시련 끝에 희망이 돌아오는 회복입니다.' },
    { id: 25, nameHanji: '天雷無妄', nameKorean: '천뢰무망', summary: '하늘 아래 천둥이 치니 인위적 기대를 버리고 자연스러운 순리에 따르는 무망입니다.' },
    { id: 26, nameHanji: '山天大畜', nameKorean: '산천대축', summary: '산속에 큰 하늘을 품고 있는 형상이니, 지식과 힘을 크게 비축하여 기회를 기다립니다.' },
    { id: 27, nameHanji: '山雷이', nameKorean: '산뢰이', summary: '산 아래에 번개가 요동치며 턱을 움직여 음식을 먹듯, 몸과 마음을 기르는 수양입니다.' },
    { id: 28, nameHanji: '澤風大過', nameKorean: '택풍대과', summary: '연못물이 무거워 든든한 대들보가 휘어지는 형상이니, 책임이 막중하고 고난의 한계점입니다.' },
    { id: 29, nameHanji: '중수감', nameKorean: '중수감', summary: '물속에 또 험난한 물이 겹겹이 갇혀 있으니, 험한 함정에 빠진 격이라 조심히 인내합니다.' },
    { id: 30, nameHanji: '중화리', nameKorean: '중화리', summary: '타오르는 불길이 겹쳐서 세상을 밝히니, 명석하고 화려하나 붙어 있을 터전이 필요합니다.' },
    { id: 31, nameHanji: '澤山咸', nameKorean: '택산함', summary: '연못과 산의 기운이 조화롭게 만나니, 남녀가 마음으로 통하고 호감과 매력이 넘칩니다.' },
    { id: 32, nameHanji: '雷風恒', nameKorean: '뇌풍항', summary: '천둥과 바람이 서로 조화를 이루며 끊임없이 순환하니, 한결같은 마음을 지켜냅니다.' },
    { id: 33, nameHanji: '天山돈', nameKorean: '천산돈', summary: '산이 하늘을 쫓아오나 하늘이 물러나 피하듯, 세속의 번잡함을 피해 한 걸음 물러섭니다.' },
    { id: 34, nameHanji: '雷天大壯', nameKorean: '뇌천대장', summary: '하늘 위로 우렁찬 번개가 치니 기세가 충천하고 힘이 넘치나 경거망동을 조심하십시오.' },
    { id: 35, nameHanji: '火地晉', nameKorean: '화지진', summary: '대지 위로 밝은 태양이 우뚝 솟아오르듯, 재능을 널리 알리고 전진해 나아갑니다.' },
    { id: 36, nameHanji: '地火明夷', nameKorean: '지화명이', summary: '밝은 빛이 땅 아래로 묻혀 어두워진 격이니, 자신의 빛을 감추고 밤이 지나길 인내합니다.' },
    { id: 37, nameHanji: '風火家人', nameKorean: '풍화가인', summary: '집안의 따뜻한 모닥불에서 훈풍이 불어 나오듯, 가정을 화목하게 가꾸고 안정을 취합니다.' },
    { id: 38, nameHanji: '火澤규', nameKorean: '화택규', summary: '불길은 위로 치솟고 못물은 아래로 흐르니, 뜻이 어긋나 대립하고 분열하는 형상입니다.' },
    { id: 39, nameHanji: '水山蹇', nameKorean: '수산건', summary: '눈 덮인 험한 산 앞에 얼어붙은 강이 가로막은 형국이니, 나아가지 말고 멈춰 서야 합니다.' },
    { id: 40, nameHanji: '雷水解', nameKorean: '뇌수해', summary: '봄눈이 녹아 시냇물로 흘러가고 천둥이 장애를 깨부수니, 맺힌 고난과 오해가 풀립니다.' },
    { id: 41, nameHanji: '山澤損', nameKorean: '산택손', summary: '산 아래 연못을 깊게 파서 산을 높이듯, 아래를 덜어내어 위를 살찌우는 자기희생입니다.' },
    { id: 42, nameHanji: '風雷益', nameKorean: '풍뢰익', summary: '바람과 천둥이 서로를 돕고 강화시켜주니, 덜어냈던 손실이 가치 있는 이익으로 돌아옵니다.' },
    { id: 43, nameHanji: '澤天夬', nameKorean: '택천쾌', summary: '하늘 위에 연못물이 가득 차 넘쳐나듯, 결연한 의지로 적폐나 난관을 결단하는 때입니다.' },
    { id: 44, nameHanji: '天風구', nameKorean: '천풍구', summary: '하늘 아래 바람이 불어와 뜻밖의 강력한 기운(인연)을 마주하게 되는 예기치 못한 만남입니다.' },
    { id: 45, nameHanji: '澤地萃', nameKorean: '택지췌', summary: '대지 위에 연못이 넓게 형성되어 온갖 인재와 재물이 조화롭게 모여드는 번창함입니다.' },
    { id: 46, nameHanji: '지풍승', nameKorean: '지풍승', summary: '땅 아래에서 나무 씨앗이 싹을 틔워 하늘을 향해 차분하고 꼿꼿하게 자라나는 상승기입니다.' },
    { id: 47, nameHanji: '澤水困', nameKorean: '택수곤', summary: '연못 밑바닥의 물마저 빠져나가 나무들이 말라 죽어가니, 자금과 환경이 막힌 곤궁함입니다.' },
    { id: 48, nameHanji: '水風정', nameKorean: '수풍정', summary: '바람이 마르지 않는 샘물을 긷듯이, 한결같은 마음으로 마르지 않는 지혜를 널리 나눕니다.' },
    { id: 49, nameHanji: '澤火革', nameKorean: '택화혁', summary: '물과 불이 냄비 속에서 격렬히 싸워 본질을 바꾸어내듯, 낡은 체제를 뒤바꾸는 혁신입니다.' },
    { id: 50, nameHanji: '火風鼎', nameKorean: '화풍정', summary: '세 발 솥 아래 바람을 불어넣어 음식을 완성하듯, 신선한 기운을 모아 새롭게 안착시킵니다.' },
    { id: 51, nameHanji: '중뢰진', nameKorean: '중뢰진', summary: '우르릉 쾅쾅 하늘을 울리는 큰 천둥이 거듭 치니, 깜짝 놀라 스스로를 살피고 각성합니다.' },
    { id: 52, nameHanji: '중산간', nameKorean: '중산간', summary: '앞을 가로막은 거대한 첩첩산중이니, 무리하여 나아가지 말고 멈추어 서는 고요함입니다.' },
    { id: 53, nameHanji: '風산점', nameKorean: '풍산점', summary: '산 위에 나무가 바람을 맞으며 한 해 한 해 묵묵히 성장하듯, 차분하고 순차적인 발전입니다.' },
    { id: 54, nameHanji: '雷澤歸妹', nameKorean: '뇌택귀매', summary: '소녀가 순리에 어긋나 급하게 시집가는 형국이니, 절차와 명분을 무시해 후회하게 됩니다.' },
    { id: 55, nameHanji: '雷화풍', nameKorean: '뇌화풍', summary: '대낮에 번개가 치듯 화려하고 번창한 최고조의 풍요를 얻었으나, 몰락의 그늘을 경계해야 합니다.' },
    { id: 56, nameHanji: '火山旅', nameKorean: '화산려', summary: '산 위에 홀로 타오르는 불길처럼 외로운 나그네의 길이니, 쓸쓸하고 겸손히 처신해야 합니다.' },
    { id: 57, nameHanji: '중풍손', nameKorean: '중풍손', summary: '바람이 거듭 불어 좁은 틈새까지 부드럽게 파고들듯, 유연하고 순종적인 자세로 침투합니다.' },
    { id: 58, nameHanji: '중택태', nameKorean: '중택태', summary: '출렁이는 두 연못물이 서로를 기쁘게 적셔주니, 다정하고 화합하는 즐거운 소통의 행복입니다.' },
    { id: 59, nameHanji: '風水渙', nameKorean: '풍수환', summary: '강풍이 얼어붙은 강물을 사정없이 녹여 흩어버리듯, 해묵은 걱정과 장벽이 흩어져 해소됩니다.' },
    { id: 60, nameHanji: '水澤節', nameKorean: '수택절', summary: '연못에 물이 넘치지 않게 둑을 쌓아 조절하듯, 삶의 규모와 지나친 욕심을 절제하는 법도입니다.' },
    { id: 61, nameHanji: '風澤中孚', nameKorean: '풍택중부', summary: '연못 위로 맑은 바람이 부니, 티 없이 맑은 신뢰와 정성어린 믿음이 상대의 마음을 움직입니다.' },
    { id: 62, nameHanji: '雷산소과', nameKorean: '뇌산소과', summary: '높이 날지 못하는 새가 둥지 아래로 낮게 내리듯, 소소한 과오는 넘기되 낮게 임해야 이롭습니다.' },
    { id: 63, nameHanji: '水화기제', nameKorean: '수화기제', summary: '물과 불이 조화를 이루어 밥을 다 지었으니, 목적한 바를 이루었으나 쇠퇴에 대비해야 합니다.' },
    { id: 64, nameHanji: '화수미제', nameKorean: '화수미제', summary: '물과 불이 엇갈려 아직 밥을 짓지 못했으니, 미완성의 상태라 희망을 갖고 다시 도전합니다.' }
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
