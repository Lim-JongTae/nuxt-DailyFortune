// 주역 64괘 상황별 인생 처세 교훈 100% 완전체 데이터셋 (제1괘 ~ 제64괘 전수 매핑)

export interface IchingLessonItem {
  id: string
  hexagramId: number
  hexagramNameKorean: string
  hexagramNameHanji: string
  category: 'business' | 'wealth' | 'love' | 'career' | 'health' | 'resilience'
  categoryName: string
  categoryIcon: string
  idiomHanja: string
  idiomKorean: string
  originQuote: string
  coreMeaning: string
  situationSummary: string
  modernLesson: string
  actionSteps: [string, string, string]
  searchKeywords: string[]
}

export interface FamousQuoteHighlight {
  idiomHanja: string
  idiomKorean: string
  quote: string
  meaning: string
  funFact?: string
  categoryName: string
  category: 'business' | 'wealth' | 'love' | 'career' | 'health' | 'resilience'
  hexagramId: number
  hexagramName: string
}

// 상단 하이라이트 명언 배너 데이터 (역사적 배경 + 위트 있는 현대적 해석)
export const famousQuoteHighlights: FamousQuoteHighlight[] = [
  {
    idiomHanja: '十朋之龜',
    idiomKorean: '십붕지구 (전문가 자문과 성의)',
    quote: '或益之十朋之龜 弗克違 元吉',
    meaning: '빈손으로 묻지 마라: 십붕(十朋, 고대 조개껍데기 묶음 거액 화폐)을 치르고 거북의 지혜를 사듯, 합당한 대가와 정성으로 최고 전문가의 자문을 구하라.',
    funFact: '‘붕(朋)’은 고대 은·주나라 때 쓰인 조개껍데기 화폐 10개 묶음입니다. 십붕은 지금의 수천만~수억 원 상당의 거금! 공짜 커피 한 잔으로 남의 수년 치 노하우를 얻으려 하지 말고, 정당한 자문료와 깍듯한 성의를 갖추어야 상대도 100% 진짜 비기를 열어줍니다.',
    categoryName: '사업·창업',
    category: 'business',
    hexagramId: 41,
    hexagramName: '산택손'
  },
  {
    idiomHanja: '愼言節食',
    idiomKorean: '신언절식 (입을 단속하는 최고의 양생법)',
    quote: '君子以愼言語 節飮食 觀頤 自求口實',
    meaning: '먹는 입과 말하는 입을 다스려라: 몸을 망치는 야식·폭식과 인생을 망치는 말실수를 끊는 것이 동양 3,000년 최고의 무병장수 및 다이어트 비결이다.',
    funFact: '주역의 이(頤)괘는 사람의 벌린 입과 위아래 턱을 본뜬 괘상입니다. 몸을 병들게 하는 독소(야식·가공식품)와 관계를 병들게 하는 독설(험담·독단)을 차단하는 것이 최고의 건강관리이자 멘탈 디톡스입니다.',
    categoryName: '건강·자기관리',
    category: 'health',
    hexagramId: 27,
    hexagramName: '산뢰이'
  },
  {
    idiomHanja: '利涉大川',
    idiomKorean: '이섭대천 (큰 강을 건너라)',
    quote: '利涉大川 往有功也',
    meaning: '과감히 결단하고 실행하라: 배수진을 치고 큰 강을 건너듯, 검증이 끝났다면 두려움을 뚫고 시장에 뛰어들어라.',
    funFact: '뗏목만 바라보고 있으면 물때를 놓칩니다. 완벽한 안전이 보장된 비즈니스는 세상에 없습니다. 결단하는 순간 기회가 열립니다.',
    categoryName: '사업·창업',
    category: 'business',
    hexagramId: 1,
    hexagramName: '중천건'
  },
  {
    idiomHanja: '利有攸往',
    idiomKorean: '이유유왕 (돈과 기회의 땅으로)',
    quote: '利有攸往 柔得尊位',
    meaning: '수요와 자본이 모이는 곳으로 가라: 쪼그라드는 사양산업에 머물지 말고, 메가트렌드가 폭발하는 성장 시장을 선점하라.',
    funFact: '물이 마른 웅덩이에서 아무리 그물을 던져봐야 물고기는 없습니다. 자본과 대중의 관심이 쏠리는 길목에 자리를 잡는 것이 부의 제1원칙입니다.',
    categoryName: '부·재테크',
    category: 'wealth',
    hexagramId: 14,
    hexagramName: '화천대유'
  },
  {
    idiomHanja: '感應和合',
    idiomKorean: '감응화합 (진심 어린 공감)',
    quote: '天地感而萬物化生 聖人感人心',
    meaning: '조건과 계산을 내려놓고 공감하라: 스펙이나 조건을 앞세우지 말고, 상대의 감정과 눈높이에 귀를 기울여라.',
    funFact: '사람의 마음은 논리로 설득되지 않고 진심 어린 공감으로 열립니다. 내 자랑을 멈추고 상대의 이야기에 10분만 온전히 귀 기울여 보세요.',
    categoryName: '사랑·인간관계',
    category: 'love',
    hexagramId: 31,
    hexagramName: '택산함'
  },
  {
    idiomHanja: '韜光養晦',
    idiomKorean: '도광양회 (빛을 감추고 버텨라)',
    quote: '內文明而外柔順 以蒙大難',
    meaning: '어둠 속에서 실력을 기르며 버텨라: 억울하고 불리한 상황에서는 함부로 맞서지 말고, 조용히 내공을 쌓으며 때를 기다려라.',
    funFact: '겨울 나무가 잎을 다 떨구고 뿌리에 수분을 모으듯, 억울할 땐 말로 다투지 말고 자격증·포트폴리오 등 진짜 실력을 갈고닦으세요.',
    categoryName: '위기·멘탈',
    category: 'resilience',
    hexagramId: 36,
    hexagramName: '지화명이'
  },
  {
    idiomHanja: '卑以自尊',
    idiomKorean: '비이자존 (낮춤으로써 높아진다)',
    quote: '地中有山 謙 君子以裒多益寡',
    meaning: '겸손은 가장 강력한 갑옷: 뛰어난 성과를 냈을 때 공을 동료에게 돌려야 질투를 피하고 자리를 영구히 보존한다.',
    funFact: '주역 64괘 중 6효 모두 길(吉)한 유일한 괘가 겸(謙)괘입니다. 실력자가 겸손하면 그 누구도 적으로 만들 수 없습니다.',
    categoryName: '직장·처세',
    category: 'career',
    hexagramId: 15,
    hexagramName: '지산겸'
  }
]

// 6대 카테고리 정의
export const lessonCategories = [
  { id: 'all', name: '전체 64괘 교훈', icon: 'i-heroicons-sparkles', desc: '삶의 모든 국면을 아우르는 64괘 고전 처세술' },
  { id: 'business', name: '사업·창업', icon: 'i-heroicons-briefcase', desc: '결단, 전문 자문, 위기 돌파, 피보팅과 조직 리더십' },
  { id: 'wealth', name: '부·재테크', icon: 'i-heroicons-banknotes', desc: '돈을 버는 법, 지키는 법, 손절매와 자산 비축' },
  { id: 'love', name: '사랑·인간관계', icon: 'i-heroicons-heart', desc: '남녀 연애, 신뢰 형성, 유혹 경계와 가정 평화' },
  { id: 'career', name: '직장·조직 처세', icon: 'i-heroicons-user-group', desc: '승진, 평판 관리, 겸손의 무기와 팀워크' },
  { id: 'health', name: '건강·자기관리', icon: 'i-heroicons-heart', desc: '식습관, 수면, 척추 교정, 운동 루틴과 심신 양생' },
  { id: 'resilience', name: '위기·멘탈 관리', icon: 'i-heroicons-shield-check', desc: '번아웃 극복, 침체기 버티기, 회복탄력성' }
] as const

// 64괘 전수 매핑 목록 (제1괘 ~ 제64괘 100% 완전체)
export const ichingLessonsList: IchingLessonItem[] = [
  // 1. 중천건 (사업·창업)
  {
    id: 'lesson-01',
    hexagramId: 1,
    hexagramNameKorean: '중천건',
    hexagramNameHanji: '乾爲天',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '利涉大川',
    idiomKorean: '이섭대천 (큰 강을 건너라)',
    originQuote: '乾 元亨利貞 利涉大川',
    coreMeaning: '사업의 망설임을 끊고, 준비가 끝났다면 과감히 시장에 뛰어들어라',
    situationSummary: '신규 사업 아이템을 준비했으나 불확실성 때문에 출시나 론칭을 주저하는 상황',
    modernLesson: '완벽한 타이밍은 영원히 오지 않습니다. 시장 검증이 끝났다면 배수진을 치고 돌파해야 시장의 주도권을 잡습니다.',
    actionSteps: [
      '리스크를 100% 없애려 하지 말고 최소 기능 제품(MVP)으로 빠르게 시장 피드백을 확보하십시오.',
      '결정권자로서 우유부단함을 버리고 팀원들에게 명확한 실행 로드맵을 선포하십시오.',
      '초기 반대나 저항에 흔들리지 말고 본질적인 원칙(利貞)을 굳건히 지키십시오.'
    ],
    searchKeywords: ['사업', '창업', '결단', '이섭대천', '실행력', '신규사업', '론칭', '도전']
  },
  // 2. 중지곤 (직장·조직)
  {
    id: 'lesson-02',
    hexagramId: 2,
    hexagramNameKorean: '중지곤',
    hexagramNameHanji: '坤爲地',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '後得主利',
    idiomKorean: '후득주리 (앞서지 말고 서포트하며 실리를 챙겨라)',
    originQuote: '先迷 後得主利 西南得朋 東北喪朋 安貞吉',
    coreMeaning: '내가 먼저 총대 매지 말고, 든든한 조력자로서 신임을 얻어 실리를 취하라',
    situationSummary: '새로운 부서나 프로젝트에서 주도권 다툼이 심해 섣불리 앞장섰다가 표적이 될까 두려운 상황',
    modernLesson: '대지의 덕은 어머니처럼 포용하고 뒤에서 받쳐주는 데 있습니다. 권력의 선두에 서기보다 핵심 실무를 묵묵히 챙길 때 오래갑니다.',
    actionSteps: [
      '상사의 성과를 돋보이게 돕고 결정적 지원군 역할을 자처하십시오.',
      '불필요한 파벌 싸움에 휘말리지 말고 실무 데이터와 전문성으로 무장하십시오.',
      '조급하게 주도권을 탐하지 말고 신뢰가 무르익을 때까지 기다리십시오.'
    ],
    searchKeywords: ['조직생활', '서포트', '중지곤', '처세술', '실리', '직장', '상사관계']
  },
  // 3. 수뢰준 (사업·창업)
  {
    id: 'lesson-03',
    hexagramId: 3,
    hexagramNameKorean: '수뢰준',
    hexagramNameHanji: '水雷屯',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '創業艱難',
    idiomKorean: '창업지난 (씨앗이 흙을 뚫는 고통)',
    originQuote: '屯 元亨利貞 勿用有攸往 利建侯',
    coreMeaning: '창업 초기의 극심한 혼란에서는 서두르지 말고 단단한 기초와 동지를 모아라',
    situationSummary: '창업 초기 자금 압박과 체계 부족으로 운영상 혼란이 극심한 상황',
    modernLesson: '새싹이 단단한 땅을 뚫고 나올 때 가장 많은 에너지가 소모됩니다. 지금의 혼란은 실패가 아니라 생명이 태동하는 정상적인 진통입니다.',
    actionSteps: [
      '외형 확장을 멈추고 제품 본질의 기초를 먼저 다지십시오(勿用有攸往).',
      '혼자 모든 짐을 지지 말고 뜻을 같이할 핵심 코어 팀원(利建侯)을 확보하십시오.',
      '초기 고객 한 명 한 명의 피드백을 수집하며 작은 성공 경험을 축적하십시오.'
    ],
    searchKeywords: ['창업초기', '스타트업', '수뢰준', '기초', '동업', '인재영입', '초기위기']
  },
  // 4. 산수몽 (사업·창업)
  {
    id: 'lesson-04',
    hexagramId: 4,
    hexagramNameKorean: '산수몽',
    hexagramNameHanji: '山水蒙',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '童蒙求我',
    idiomKorean: '동몽구아 (무지를 인정하고 스승에게 물어라)',
    originQuote: '匪我求童蒙 童蒙求我 初筮告 再三瀆 瀆則不告',
    coreMeaning: '자신의 무지를 솔직히 인정하고, 겸손하고 진지한 자세로 멘토에게 자문을 구하라',
    situationSummary: '경험이 전혀 없는 새로운 분야에 진출하려는데 자존심 때문에 남에게 묻지 못하는 상황',
    modernLesson: '스승이 먼저 다가와 가르쳐주지 않습니다. 모르는 것을 아는 척하지 말고, 정중한 태도로 질문할 때 비로소 지혜의 문이 열립니다.',
    actionSteps: [
      '내 분야에서 이미 검증된 성과를 낸 전문가나 멘토를 적극 찾아가십시오.',
      '같은 질문을 건성으로 반복하지 말고(再三瀆), 질문을 명확히 정리해 가십시오.',
      '배운 내용을 즉시 현업에 적용해 보고 결과를 피드백하십시오.'
    ],
    searchKeywords: ['멘토', '자문', '산수몽', '배움', '질문법', '공부', '초심자']
  },
  // 5. 수천수 (건강·자기관리)
  {
    id: 'lesson-05',
    hexagramId: 5,
    hexagramNameKorean: '수천수',
    hexagramNameHanji: '水天需',
    category: 'health',
    categoryName: '건강·자기관리',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '飮食宴樂',
    idiomKorean: '음식연락 (규칙적인 영양 섭취와 생체 리듬의 회복)',
    originQuote: '需 有孚 光亨 貞吉 利涉大川 君子以飮食宴樂',
    coreMeaning: '무리한 단식이나 불규칙한 식사를 멈추고, 제철 영양과 휴식으로 면역력을 길러라',
    situationSummary: '바쁜 일상 때문에 끼니를 거르고 커피와 에너지 드링크로 버티며 위장과 몸이 망가진 상황',
    modernLesson: '비구름이 하늘에 가득 차도 비가 내리기까지는 때가 필요합니다. 내 몸을 쥐어짜며 조급해하지 말고, 좋은 제철 음식을 천천히 섭취하며(飮食宴樂) 신체 에너지를 정상화하십시오.',
    actionSteps: [
      '삼시 세끼 정해진 시간에 가공식품을 줄이고 제철 채소와 단백질 위주로 식사하십시오.',
      '카페인 의존을 줄이고 하루 1.5리터 이상의 미온수를 꾸준히 섭취하십시오.',
      '식사 후 15분간 가볍게 산책하며 혈당 스파이크를 방지하십시오.'
    ],
    searchKeywords: ['건강', '식습관', '수천수', '생체리듬', '영양관리', '위장건강', '자기관리']
  },
  // 6. 천수송 (직장·조직)
  {
    id: 'lesson-06',
    hexagramId: 6,
    hexagramNameKorean: '천수송',
    hexagramNameHanji: '天水訟',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '中途而止',
    idiomKorean: '중도이지 (소송과 다툼은 끝까지 가지 말고 타협하라)',
    originQuote: '訟 有孚 窒惕 中吉 終凶 利見大人 不利涉大川',
    coreMeaning: '아무리 내가 옳더라도 끝까지 싸우면 상처뿐인 승리다. 중간에 타협하는 자가 이긴다',
    situationSummary: '직장 동료나 거래처와 심각한 분쟁이나 소송 직전까지 치달아 감정이 극에 달한 상황',
    modernLesson: '주역은 다툼(訟)에서 끝까지 가면 흉(終凶)하다고 경고합니다. 승소하더라도 시간, 감정, 소송비용으로 파탄 납니다. 제3자(大人)를 통해 합의하는 것이 이익입니다.',
    actionSteps: [
      '감정적인 비난을 멈추고 객관적인 손익 계산서를 작성해 보십시오.',
      '중립적인 중재자나 전문가를 통해 쌍방이 한 걸음씩 양보하는 합의안을 도출하십시오.',
      '승패에 집착하지 말고 하루빨리 본업의 생산성으로 복귀하십시오.'
    ],
    searchKeywords: ['분쟁', '소송', '갈등', '천수송', '타협', '합의', '직장갈등', '화해']
  },
  // 7. 지수사 (사업·창업)
  {
    id: 'lesson-07',
    hexagramId: 7,
    hexagramNameKorean: '지수사',
    hexagramNameHanji: '地水師',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '律法之軍',
    idiomKorean: '율법지군 (조직의 엄격한 규율과 공정한 리더십)',
    originQuote: '師 貞 丈人 吉 无咎 師出以律 否臧凶',
    coreMeaning: '전쟁터 같은 시장에서 살아남으려면 엄격한 규율과 공정한 신상필벌이 필수다',
    situationSummary: '직원들의 기강이 해이해지고 근태와 품질 관리가 엉망인데도 싫은 소리를 못 하는 상황',
    modernLesson: '군대를 이끄는 장수처럼 사업가는 좋은 사람이 아니라 공정한 지휘관이어야 합니다. 규율이 무너지면(否臧凶) 조직 전체가 공멸합니다.',
    actionSteps: [
      '애매한 구두 지시를 없애고 명문화된 업무 규정과 KPI 기준을 세우십시오.',
      '성과에는 확실히 보상하고, 규정 위반에는 예외 없이 엄격한 원칙을 적용하십시오.',
      '리더 자신이 먼저 언행일치와 솔선수범을 보여 군자의 위엄을 갖추십시오.'
    ],
    searchKeywords: ['리더십', '조직관리', '지수사', '규율', '신상필벌', '경영', '팀관리']
  },
  // 8. 수지비 (사랑·관계)
  {
    id: 'lesson-08',
    hexagramId: 8,
    hexagramNameKorean: '수지비',
    hexagramNameHanji: '水地比',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '原筮元永',
    idiomKorean: '원서원영 (진짜 내 편과 깊게 연대하라)',
    originQuote: '比 吉 原筮 元永貞 无咎 不寧方來 後夫凶',
    coreMeaning: '물이 땅에 스며들듯 마음이 통하는 진짜 인연과 연대하고, 늦게 온 얌체는 경계하라',
    situationSummary: '수많은 인맥 속에서 진짜 믿을 수 있는 내 편이 누구인지 헷갈리는 상황',
    modernLesson: '인간관계는 넓이보다 깊이입니다. 어려울 때 곁을 지켜준 사람과 깊은 유대를 맺고, 이익을 보고 뒤늦게 찾아온 기회주의자(後夫)는 멀리하십시오.',
    actionSteps: [
      '어려운 시절 나를 지지해 준 소수의 진정한 지인들에게 정성을 쏟으십시오.',
      '관계에서 계산기를 두드리지 말고 먼저 맑은 물처럼 스며드는 배려를 보여주십시오.',
      '약속을 밥 먹듯 어기거나 간을 보는 사람은 단호하게 관계를 정리하십시오.'
    ],
    searchKeywords: ['인맥', '진짜친구', '수지비', '인간관계', '의리', '상생', '내편']
  },
  // 9. 풍천소축 (부·재테크)
  {
    id: 'lesson-09',
    hexagramId: 9,
    hexagramNameKorean: '풍천소축',
    hexagramNameHanji: '風天小畜',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '密雲不雨',
    idiomKorean: '밀운불우 (구름만 끼고 비는 안 온다, 작은 시드머니를 모아라)',
    originQuote: '小畜 亨 密雲不雨 自我西郊',
    coreMeaning: '아직 대박의 비는 내리지 않는다. 실망하지 말고 작은 시드머니를 알뜰히 축적하라',
    situationSummary: '열심히 아끼고 모았으나 자산 증식 속도가 너무 더뎌 답답하고 조급한 상황',
    modernLesson: '구름이 잔뜩 꼈으나 아직 비가 내릴 임계점에 도달하지 못했습니다. 조급해하지 말고 작은 돈을 아끼고 축적(小畜)하는 인내가 필요합니다.',
    actionSteps: [
      '잔돈 저축, 적금 등 작은 돈 모으기를 우습게 보지 말고 지속하십시오.',
      '무리한 코인이나 선물 옵션 등 한방을 노리는 도박성 투자를 끊으십시오.',
      '비가 내릴 날(대세 상승장)을 대비해 투자 대상에 대한 분석을 게을리하지 마십시오.'
    ],
    searchKeywords: ['절약', '시드머니', '풍천소축', '인내', '자산축적', '밀운불우', '종잣돈']
  },
  // 10. 천택리 (직장·조직)
  {
    id: 'lesson-10',
    hexagramId: 10,
    hexagramNameKorean: '천택리',
    hexagramNameHanji: '天澤履',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '虎尾踏履',
    idiomKorean: '호미답리 (호랑이 꼬리를 밟아도 예의를 지키면 물리지 않는다)',
    originQuote: '履虎尾 不咥人 亨 君子以辯上下 定民志',
    coreMeaning: '까다로운 상사나 권력자 앞에서도 철저한 예의와 절차를 지키면 화를 면한다',
    situationSummary: '변덕스럽고 폭군 같은 상사나 VIP 고객을 상대해야 해서 매일 살얼음판을 걷는 상황',
    modernLesson: '호랑이 꼬리를 밟는 위태로운 상황에서도 예법(履)과 온화함을 잃지 않으면 호랑이도 물지 않습니다. 상대를 자극하지 말고 철저히 규정과 예의로 방어하십시오.',
    actionSteps: [
      '보고 시 감정을 섞지 말고 육하원칙에 입각한 팩트와 정중한 언어를 사용하십시오.',
      '상사의 성향과 지뢰 포인트를 미리 파악하여 불필요한 마찰을 사전 차단하십시오.',
      '중요한 업무 지시는 반드시 메일이나 메신저로 문서화하여 근거를 남기십시오.'
    ],
    searchKeywords: ['상사대응', '천택리', '예의', '호랑이꼬리', '직장처세', 'VIP응대', '안전']
  },
  // 11. 지천태 (부·재테크)
  {
    id: 'lesson-11',
    hexagramId: 11,
    hexagramNameKorean: '지천태',
    hexagramNameHanji: '地天泰',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '小往大來',
    idiomKorean: '소왕대래 (작은 것이 가고 큰 것이 온다, 태평성대의 선순환)',
    originQuote: '泰 小往大來 吉 亨 天地交而萬物通也',
    coreMeaning: '기운이 통하여 자본이 순환하는 황금기, 투자를 아끼지 말고 대범하게 확장하라',
    situationSummary: '사업과 투자가 모두 순항하여 현금 흐름이 매우 원활하고 기회가 쏟아지는 상황',
    modernLesson: '하늘과 땅이 기운을 교류하듯 자금의 선순환이 일어나는 최고의 길운입니다. 이 시기에는 움츠러들지 말고 유망한 곳에 과감히 재투자하여 부의 스케일을 키워야 합니다.',
    actionSteps: [
      '벌어들인 수익을 금고에 묶어두지 말고 미래 성장 동력에 재투자하십시오.',
      '수익의 일부를 팀원과 파트너에게 넉넉히 인센티브로 나누어 기운을 북돋우십시오.',
      '호황일수록 방심하지 말고 재무 건전성을 함께 점검하십시오.'
    ],
    searchKeywords: ['호황', '황금기', '지천태', '재투자', '소왕대래', '부자', '성장']
  },
  // 12. 천지비 (위기·멘탈)
  {
    id: 'lesson-12',
    hexagramId: 12,
    hexagramNameKorean: '천지비',
    hexagramNameHanji: '天地否',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '君子儉德',
    idiomKorean: '군자검덕 (소통이 꽉 막힌 빙하기, 소비를 줄이고 웅크려라)',
    originQuote: '否之匪人 不利君子貞 大往小來 君子以儉德辟難',
    coreMeaning: '하늘과 땅이 불통인 빙하기, 억지로 설득하려 하지 말고 소비를 줄이고 은신하라',
    situationSummary: '시장 전체가 얼어붙고 사방의 대화와 거래가 꽉 막혀 어떤 노력도 통하지 않는 상황',
    modernLesson: '비(否)괘는 만물이 얼어붙은 한겨울입니다. 이럴 때 억지로 뚫으려 하면 부러집니다. 검소하게 지출을 줄이고(儉德) 은신하여 재난을 피하십시오.',
    actionSteps: [
      '모든 공격적 투자를 즉각 멈추고 현금 보유 비중을 80% 이상으로 높이십시오.',
      '말이 통하지 않는 사람들과 언쟁하지 말고 조용히 거리를 두십시오.',
      '내실을 다지며 시장의 얼음이 녹을 다음 계절을 차분히 준비하십시오.'
    ],
    searchKeywords: ['빙하기', '불황', '천지비', '지출줄이기', '생존', '은신', '소통단절']
  },
  // 13. 천화동인 (사랑·관계)
  {
    id: 'lesson-13',
    hexagramId: 13,
    hexagramNameKorean: '천화동인',
    hexagramNameHanji: '天火同人',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '同人于野',
    idiomKorean: '동인우야 (사리사욕을 버리고 넓은 들판에서 연대하라)',
    originQuote: '同人于野 亨 利涉大川 利君子貞',
    coreMeaning: '끼리끼리 파벌을 짓지 말고, 오픈 마인드로 공정한 뜻을 가진 동료와 뭉쳐라',
    situationSummary: '조직이나 모임에서 편 가르기와 파벌 싸움으로 인해 피로감이 극에 달한 상황',
    modernLesson: '밀실에서 사익을 도모하면 결국 분열합니다. 탁 트인 들판(野)처럼 공명정대하게 뜻을 모을 때 큰 강을 건너는 기적이 일어납니다.',
    actionSteps: [
      '사적인 친분이나 학연·지연에 얽매이지 말고 실력과 인품을 기준으로 사람을 대하십시오.',
      '회의나 의사결정 과정을 투명하게 공개하여 불필요한 오해를 없애십시오.',
      '공동의 비전을 명확히 제시하여 구성원들의 사명감을 하나로 묶으십시오.'
    ],
    searchKeywords: ['단결', '협력', '천화동인', '동업', '연대', '투명성', '팀워크']
  },
  // 14. 화천대유 (부·재테크)
  {
    id: 'lesson-14',
    hexagramId: 14,
    hexagramNameKorean: '화천대유',
    hexagramNameHanji: '火天大有',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '利有攸往',
    idiomKorean: '이유유왕 (돈과 기회가 흐르는 성장 시장으로 가라)',
    originQuote: '火在天上 大有 順天休命',
    coreMeaning: '태양이 하늘 높이 뜬 전성기, 시대적 메가트렌드 자산에 과감히 올라타라',
    situationSummary: '어디에 투자해야 자산을 크게 불릴 수 있을지 방향을 잡지 못하는 상황',
    modernLesson: '태양이 온 세상을 비추듯 대세 트렌드가 형성된 곳에 자본을 배치해야 부자가 됩니다. 침체된 과거의 방식에 머물지 말고 시대가 원하는 곳으로 가십시오.',
    actionSteps: [
      '성장률이 꺾인 자산을 과감히 정리하고 미래 산업의 1등 주도주로 포트폴리오를 교체하십시오.',
      '풍요의 정점일수록 교만해지지 말고 번 돈의 일부를 안전 자산으로 옮겨두십시오.',
      '사회적 가치를 창출하는 곳에 돈을 흘려보내 선한 부자의 지위를 다지십시오.'
    ],
    searchKeywords: ['부자', '화천대유', '이유유왕', '성장주', '메가트렌드', '자산증식', '대박']
  },
  // 15. 지산겸 (직장·조직)
  {
    id: 'lesson-15',
    hexagramId: 15,
    hexagramNameKorean: '지산겸',
    hexagramNameHanji: '地山謙',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '卑以自尊',
    idiomKorean: '비이자존 (자신을 낮추어야 만인이 따른다)',
    originQuote: '謙 亨 君子有終 地中有山 謙',
    coreMeaning: '높은 산이 땅 아래로 몸을 낮추듯, 실력이 뛰어날수록 공을 동료에게 돌려라',
    situationSummary: '큰 프로젝트를 성공시켜 주목받고 있으나 동료들의 시기와 견제가 두려운 상황',
    modernLesson: '주역 64괘 중 유일하게 6효 모두 길(吉)한 최상의 괘입니다. 능력자가 겸손할 때 적이 사라지고 평판이 영원히 빛납니다.',
    actionSteps: [
      '성과 발표 때 내 공을 10%만 말하고 팀원들과 상사의 노고를 90% 언급하십시오.',
      '후배 직원의 작은 실수도 너그럽게 품어주며 따뜻한 멘토가 되어주십시오.',
      '남의 단점을 지적하여 내 우월함을 증명하려는 유혹을 철저히 차단하십시오.'
    ],
    searchKeywords: ['겸손', '지산겸', '처세술', '평판', '리더십', '질투방지', '직장생활']
  },
  // 16. 뇌지예 (사랑·관계)
  {
    id: 'lesson-16',
    hexagramId: 16,
    hexagramNameKorean: '뇌지예',
    hexagramNameHanji: '雷地豫',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '豫備歡喜',
    idiomKorean: '예비환희 (기쁨에 취해 방심하지 말고 다음을 예비하라)',
    originQuote: '豫 利建侯行師 介于石 不終日 貞吉',
    coreMeaning: '분위기가 화기애애할수록 방심하지 말고, 선을 넘지 않는 절제와 대비를 하라',
    situationSummary: '연애 초기의 달콤함이나 술자리 분위기에 취해 지키지 못할 약속을 남발하는 상황',
    modernLesson: '기쁨(豫)은 삶의 활력소이지만 지나치면 나태와 실수를 부릅니다. 바위처럼 단단한 중심(介于石)을 지키며 즐거움 속에서도 미래를 예비해야 합니다.',
    actionSteps: [
      '술자리나 흥분된 분위기에서 섣부른 금전 거래나 중대 약속을 하지 마십시오.',
      '연인과의 행복한 순간에도 각자의 커리어와 독립된 시간 관리를 철저히 하십시오.',
      '즐거움 뒤에 찾아올 수 있는 현실적인 문제들을 미리 대화로 나누어 두십시오.'
    ],
    searchKeywords: ['방심경계', '뇌지예', '절제', '연애초기', '약속', '신중함', '준비']
  },
  // 17. 택뢰수 (직장·조직)
  {
    id: 'lesson-17',
    hexagramId: 17,
    hexagramNameKorean: '택뢰수',
    hexagramNameHanji: '澤雷隨',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '隨時順應',
    idiomKorean: '수시순응 (때의 흐름과 대세에 부드럽게 순응하라)',
    originQuote: '隨 元亨利貞 无咎 君子以嚮晦入宴息',
    coreMeaning: '내 고집만 피우지 말고, 시대와 조직의 거대한 흐름에 유연하게 발을 맞춰라',
    situationSummary: '회사의 새로운 정책이나 업계 패러다임 변화에 불만을 품고 삐딱하게 반발하는 상황',
    modernLesson: '흐르는 물을 거슬러 오르려 하면 힘만 빠집니다. 대세가 기울었을 때는 내 자존심을 꺾고 빠르게 적응하는 자가 결국 살아남아 기회를 잡습니다.',
    actionSteps: [
      '과거의 성공 공식이나 낡은 방식에 대한 미련을 깨끗이 털어내십시오.',
      '조직이 추진하는 새 시스템이나 툴을 솔선수범하여 가장 먼저 마스터하십시오.',
      '퇴근 후에는 일 생각을 끄고 온전히 쉬며 에너지 밸런스를 맞추십시오(入宴息).'
    ],
    searchKeywords: ['적응력', '택뢰수', '대세순응', '유연성', '트렌드', '직장처세']
  },
  // 18. 산풍고 (사업·창업)
  {
    id: 'lesson-18',
    hexagramId: 18,
    hexagramNameKorean: '산풍고',
    hexagramNameHanji: '山風蠱',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '幹父之蠱',
    idiomKorean: '간부지고 (오래 곪은 적폐를 도려내고 과감히 쇄신하라)',
    originQuote: '蠱 元亨 利涉大川 先甲三日 後甲三日',
    coreMeaning: '곪아 터진 환부를 미루지 말고 수술하라. 철저한 사전 준비 후 과감한 개혁을 단행하라',
    situationSummary: '수년간 누적된 부실 재고, 무능한 거래처, 부패한 관행 때문에 회사가 멍들고 있는 상황',
    modernLesson: '고(蠱)는 그릇 속에 벌레가 우글거리는 상태입니다. 미적거리면 집 전체가 무너집니다. 전후 3일을 깊이 고민하되(先甲三日 後甲三日), 칼을 뽑을 땐 자비 없이 개혁해야 합니다.',
    actionSteps: [
      '수익을 갉아먹는 한계 사업부나 불량 거래처와의 계약을 정리하십시오.',
      '개혁을 시작하기 전 이해관계자들의 반발을 시뮬레이션하고 대비책을 세우십시오.',
      '환부를 도려낸 자리에 투명한 새 시스템과 젊은 피를 수혈하십시오.'
    ],
    searchKeywords: ['구조조정', '적폐청산', '산풍고', '개혁', '쇄신', '비즈니스회생']
  },
  // 19. 지택림 (직장·조직)
  {
    id: 'lesson-19',
    hexagramId: 19,
    hexagramNameKorean: '지택림',
    hexagramNameHanji: '地澤臨',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '臨民以寬',
    idiomKorean: '림민이관 (권한이 생겼을 때 따뜻한 관용으로 부하를 품어라)',
    originQuote: '臨 元亨利貞 至于八月有凶',
    coreMeaning: '팀장이 되고 승진했을 때 고압적 지시를 버리고, 너그러운 관용으로 신망을 얻어라',
    situationSummary: '신임 리더로 부임하여 권위를 세우려다 팀원들과 벽이 생기고 반발이 일어나는 상황',
    modernLesson: '임(臨)은 군림한다는 뜻이지만 진정한 군림은 억압이 아닌 보살핌입니다. 그러나 호시절도 8월이 되면 쇠퇴하듯(至于八月有凶), 관용을 베풀되 기강의 균형을 놓치지 마십시오.',
    actionSteps: [
      '팀원들의 고충을 1:1 티타임으로 경청하고 실질적인 업무 장애물을 치워주십시오.',
      '사소한 실수에는 관용을 베풀되, 약속된 납기와 핵심 품질은 철저히 관리하십시오.',
      '지금 누리는 리더의 권한이 영원하지 않음을 기억하며 항상 겸손하십시오.'
    ],
    searchKeywords: ['신임팀장', '지택림', '관리자', '관용', '리더십', '팀원관리']
  },
  // 20. 풍지관 (위기·멘탈)
  {
    id: 'lesson-20',
    hexagramId: 20,
    hexagramNameKorean: '풍지관',
    hexagramNameHanji: '風地觀',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '觀國之光',
    idiomKorean: '관국지광 (움직임을 멈추고 높은 곳에서 판세를 조망하라)',
    originQuote: '觀 盥而不薦 有孚顒若 君子以省方觀民設敎',
    coreMeaning: '시야가 좁아졌을 때 섣불리 행동하지 말고, 한 걸음 물러나 큰 그림을 통찰하라',
    situationSummary: '눈앞의 당면 과제에 매몰되어 방향성을 잃고 쳇바퀴만 돌고 있는 답답한 상황',
    modernLesson: '바람이 땅 위를 훑고 지나가듯(觀), 높은 산에 올라 아래를 굽어보아야 전체 숲이 보입니다. 모든 일을 잠시 멈추고 나의 인생과 비즈니스의 거시적 판세를 점검하십시오.',
    actionSteps: [
      '주말 동안 모든 실무 연락을 차단하고 1박 2일 사색의 시간을 가지십시오.',
      '올해 나의 핵심 목표 3가지가 제대로 가고 있는지 냉정하게 평가하십시오.',
      '나의 부족함을 정직하게 직시하고 배움의 계획을 다시 세우십시오.'
    ],
    searchKeywords: ['통찰', '풍지관', '메타인지', '큰그림', '조망', '성찰', '방향성']
  },
  // 21. 화뢰서합 (직장·조직)
  {
    id: 'lesson-21',
    hexagramId: 21,
    hexagramNameKorean: '화뢰서합',
    hexagramNameHanji: '火雷噬嗑',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '斷罪噬嗑',
    idiomKorean: '단죄서합 (입안의 가시를 씹어 뱉듯 방해물을 단호히 제거하라)',
    originQuote: '噬嗑 亨 利用獄 先王以明罰勅法',
    coreMeaning: '조직을 망치는 오피스 빌런이나 부조리는 어설프게 감싸지 말고 단호히 징계하라',
    situationSummary: '조직 내에서 지속적으로 분란을 일으키고 가스라이팅하는 빌런 때문에 팀 전체가 병드는 상황',
    modernLesson: '음식을 씹을 때 돌이나 가시가 씹히면 세게 깨물어 뱉어내야 합니다(噬嗑). 법과 원칙을 명확히 세워(明罰勅法) 암적인 요소를 단호하게 처단해야 선량한 다수가 보호받습니다.',
    actionSteps: [
      '빌런의 부적절한 언행과 규정 위반 사례를 구체적인 일시와 증거로 기록하십시오.',
      '인사팀이나 상급자에게 공식 징계 절차를 요청하고 단호한 분리 조치를 단행하십시오.',
      '어설픈 동정심으로 용서하여 사태를 더 키우는 실수를 범하지 마십시오.'
    ],
    searchKeywords: ['오피스빌런', '화뢰서합', '단호함', '징계', '조직정화', '원칙']
  },
  // 22. 산화비 (사랑·관계)
  {
    id: 'lesson-22',
    hexagramId: 22,
    hexagramNameKorean: '산화비',
    hexagramNameHanji: '山火賁',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '白賁无咎',
    idiomKorean: '백비무구 (과한 포장을 벗고 소박한 본연의 매력으로 다가가라)',
    originQuote: '賁 亨 小利有攸往 白賁无咎',
    coreMeaning: '화려한 명품과 겉치레로 치장하지 말고, 맑고 담백한 본연의 인품으로 승부하라',
    situationSummary: '이성에게 잘 보이고 싶어 과도하게 허세를 부리거나 분수에 넘치는 소비를 하는 상황',
    modernLesson: '노을빛이 산을 물들이듯 장식(賁)은 아름답지만, 최고의 아름다움은 꾸밈없는 흰색의 소박함(白賁)에 있습니다. 과한 화장과 허세는 금방 들통납니다. 내면의 진솔함이 백배 낫습니다.',
    actionSteps: [
      'SNS나 만남 자리에서 과시용 소비나 부풀린 자랑을 멈추십시오.',
      '단정하고 깔끔한 기본 옷차림과 바른 언행으로 신뢰감을 주십시오.',
      '나의 부족한 점도 담담하게 인정하는 솔직하고 건강한 자존감을 보여주십시오.'
    ],
    searchKeywords: ['허세금지', '산화비', '담백함', '진솔함', '외모치장', '자존감', '연애']
  },
  // 23. 산지박 (위기·멘탈)
  {
    id: 'lesson-23',
    hexagramId: 23,
    hexagramNameKorean: '산지박',
    hexagramNameHanji: '山地剝',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '碩果不食',
    idiomKorean: '석과불식 (마지막 남은 씨앗 하나는 지켜라, 절체절명의 방어전)',
    originQuote: '剝 不利有攸往 碩果不食 君子得輿 小人剝廬',
    coreMeaning: '모든 것이 깎여나가는 대몰락의 시기, 확장하지 말고 핵심 자산 하나를 결사 방어하라',
    situationSummary: '매출이 급감하고 자산이 폭락하며 사방에서 빚 독촉이 밀려오는 절체절명의 위기 상황',
    modernLesson: '나무의 모든 과일이 떨어져도 가장 꼭대기의 큰 과일(碩果) 하나는 먹지 않고 남겨 씨앗으로 삼아야 합니다. 무리한 반격을 멈추고 최소한의 생존 자금과 가족을 지키십시오.',
    actionSteps: [
      '어설픈 반등을 기대하고 신규 자금을 투입하지 마십시오(不利有攸往).',
      '내가 파산하더라도 재기할 수 있는 최소한의 종잣돈과 거주지를 법적으로 방어하십시오.',
      '상황이 바닥을 치고 회복될 때까지 자세를 극도로 낮추고 버티십시오.'
    ],
    searchKeywords: ['몰락', '산지박', '석과불식', '최후의보루', '생존전략', '위기방어', '파산방지']
  },
  // 24. 지뢰복 (건강·자기관리)
  {
    id: 'lesson-24',
    hexagramId: 24,
    hexagramNameKorean: '지뢰복',
    hexagramNameHanji: '地雷復',
    category: 'health',
    categoryName: '건강·자기관리',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '一陽來復',
    idiomKorean: '일양내복 (깊은 수면과 세포의 재생, 면역력 리셋)',
    originQuote: '復 亨 出入无疾 朋來无咎 反復其道 七日來復 利有攸往',
    coreMeaning: '겨울잠을 자듯 온전한 숙면을 취하라. 가장 깊은 어둠 속에서 면역 세포가 재생된다',
    situationSummary: '만성 불면증과 수면 부족으로 인해 만성 피로와 뇌 안개(Brain Fog)에 시달리는 상황',
    modernLesson: '가장 추운 동짓날 땅속에서 하나의 따뜻한 양기가 회복되듯(一陽來復), 인체는 수면 중에 뇌의 노폐물을 청소하고 면역력을 리셋합니다. 잠을 줄여가며 일하지 마십시오.',
    actionSteps: [
      '수면 1시간 전 스마트폰과 블루라이트를 차단하고 침실을 어둡고 시원하게 만드십시오.',
      '매일 밤 11시 전 취침하여 최소 7시간의 숙면 시간을 절대적으로 사수하십시오.',
      '기상 직후 아침 햇빛을 10분간 쬐어 멜라토닌 분비 리듬을 정상화하십시오.'
    ],
    searchKeywords: ['수면', '숙면', '지뢰복', '면역력', '피로회복', '불면증', '생체시계', '자기관리']
  },
  // 25. 천뢰무망 (부·재테크)
  {
    id: 'lesson-25',
    hexagramId: 25,
    hexagramNameKorean: '천뢰무망',
    hexagramNameHanji: '天雷無妄',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '無妄之災',
    idiomKorean: '무망지재 (벼락부자 망상을 버려야 불의의 사고를 면한다)',
    originQuote: '無妄 元亨利貞 其匪正有眚 不利有攸往',
    coreMeaning: '허황된 욕심과 사기성 투자에 현혹되지 말고, 정직한 땀방울로 자산을 지켜라',
    situationSummary: '원금 보장과 월 10% 수익을 약속하는 솔깃한 다단계나 리딩방 유혹에 빠진 상황',
    modernLesson: '세상에 공짜 점심과 무위도식의 부는 없습니다. 망상(妄)을 품고 쫓아가면 재앙(眚)을 맞습니다. 순리와 정직한 가치 창출에만 내 돈을 맡기십시오.',
    actionSteps: [
      '내가 완전히 이해하지 못하는 파생상품이나 고수익 보장 투자를 전면 거절하십시오.',
      'SNS에 넘쳐나는 슈퍼카와 일확천금 인증 피드를 언팔로우하여 뇌를 정화하십시오.',
      '매일의 본업 수익을 소중히 여기며 정석적인 분산 저축을 실천하십시오.'
    ],
    searchKeywords: ['사기예방', '천뢰무망', '벼락부자망상', '정석투자', '원금보장사기', '재테크원칙']
  },
  // 26. 산천대축 (부·재테크)
  {
    id: 'lesson-26',
    hexagramId: 26,
    hexagramNameKorean: '산천대축',
    hexagramNameHanji: '山天大畜',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '豐富大畜',
    idiomKorean: '풍부대축 (종잣돈과 내공을 크게 비축하라)',
    originQuote: '大畜 利貞 不家食吉 利涉大川',
    coreMeaning: '큰 뜻을 펼치기 전까지는 집에서 밥을 축내지 말고, 지식과 자본을 크게 비축하라',
    situationSummary: '시드머니가 아직 모이지 않았는데 조급하게 퇴사하거나 대출 투자를 하려는 상황',
    modernLesson: '산속에 커다란 하늘의 기운을 가두어두듯(大畜), 충분한 자본과 전문성이 쌓여야 비로소 큰 강을 건널 수 있습니다. 준비 없는 독립은 고난의 지름길입니다.',
    actionSteps: [
      '월급의 50% 이상을 악착같이 저축하여 목표 시드머니를 먼저 달성하십시오.',
      '퇴근 후 2시간씩 업계 전문 자격증 취득과 시장 조사에 집중하십시오.',
      '멘토와 선배들의 실전 노하우를 스펀지처럼 흡수하여 내공을 기르십시오.'
    ],
    searchKeywords: ['시드머니', '산천대축', '자산비축', '종잣돈', '독립준비', '공부', '내공']
  },
  // 27. 산뢰이 (건강·자기관리)
  {
    id: 'lesson-27',
    hexagramId: 27,
    hexagramNameKorean: '산뢰이',
    hexagramNameHanji: '山雷頤',
    category: 'health',
    categoryName: '건강·자기관리',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '愼言節食',
    idiomKorean: '신언절식 (먹는 입과 말하는 입을 다스리는 최고의 양생법)',
    originQuote: '頤 貞吉 觀頤 自求口實 君子以愼言語 節飮食',
    coreMeaning: '야식과 폭식으로 몸을 망치고, 험담과 독설로 영혼을 망친다. 입을 엄격히 단속하라',
    situationSummary: '스트레스를 자극적인 배달 음식, 야식, 폭식으로 풀다 건강 지표가 붉은불이 켜진 상황',
    modernLesson: '이(頤)는 턱입니다. 턱으로 들어가는 음식과 턱에서 나오는 말이 인생의 길흉과 수명을 좌우합니다. 과식을 절제하고(節飮食) 맑은 음식을 먹어야 몸과 정신이 맑아집니다.',
    actionSteps: [
      '밤 8시 이후 야식과 야간 음주를 전면 금지하고 12시간 공복을 유지하십시오.',
      '달고 짠 초가공식품을 멀리하고 씹는 횟수를 30회 이상 늘려 천천히 식사하십시오.',
      '부정적인 독설과 불평불만을 멈추고 긍정적인 감사 일기를 작성하십시오.'
    ],
    searchKeywords: ['다이어트', '산뢰이', '신언절식', '식습관', '야식금지', '간헐적단식', '양생법', '건강']
  },
  // 28. 택풍대과 (건강·자기관리)
  {
    id: 'lesson-28',
    hexagramId: 28,
    hexagramNameKorean: '택풍대과',
    hexagramNameHanji: '澤風大過',
    category: 'health',
    categoryName: '건강·자기관리',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '棟撓獨立',
    idiomKorean: '동요독립 (과로의 한계선, 몸의 대들보가 무너지기 전에 쉬어라)',
    originQuote: '大過 棟撓 利有攸往 亨 君子以獨立不懼 遯世无悶',
    coreMeaning: '몸의 대들보(척추와 심장)가 과부하로 휘어지고 있다. 강제 휴식으로 생명을 지켜라',
    situationSummary: '주 70시간 이상의 과도한 노동과 야근으로 몸에서 심장 두근거림이나 어지럼증 등 위험 신호를 보내는 상황',
    modernLesson: '대들보가 지나친 무게로 휘어지는 상(棟撓)입니다. 여기서 더 버티면 몸 전체가 무너집니다. 일을 줄이고 과감하게 병원 진료와 강제 휴식을 선택하는 것이 용기입니다.',
    actionSteps: [
      '내 몸이 보내는 경고 신호(만성 통증, 부정맥 등)를 무시하지 말고 종합검진을 받으십시오.',
      '절대 양보할 수 없는 휴식 요일을 주 1회 이상 캘린더에 못 박아두십시오.',
      '완벽주의 강박을 내려놓고 업무의 20%는 위임하거나 거절하십시오.'
    ],
    searchKeywords: ['과로사방지', '택풍대과', '번아웃', '건강검진', '휴식', '자기관리', '심신보호']
  },
  // 29. 중수감 (위기·멘탈)
  {
    id: 'lesson-29',
    hexagramId: 29,
    hexagramNameKorean: '중수감',
    hexagramNameHanji: '重水坎',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '習坎心亨',
    idiomKorean: '습감심형 (험난함이 겹쳐도 내면의 중심을 잃지 않는 담대함)',
    originQuote: '習坎 有孚 維心亨 行有尙',
    coreMeaning: '산 넘어 험한 물길이 겹겹이 밀려와도, 두려움에 떨지 말고 담대하게 물살을 타라',
    situationSummary: '하나의 문제가 해결되기도 전에 또 다른 대형 악재가 터져 패닉에 빠진 상황',
    modernLesson: '물은 험난함을 만나도 멈추지 않고 흘러 바다에 도달합니다. 두려움에 얼어붙으면 익사합니다. 중심의 진실함(維心亨)을 단단히 붙들고 한 걸음씩 난관을 헤쳐가십시오.',
    actionSteps: [
      '닥쳐온 악재들을 종이에 객관적으로 나열하고 최악의 시나리오를 미리 수용하십시오.',
      '두려움 때문에 충동적인 자포자기 선택을 내리지 마십시오.',
      '물이 웅덩이를 채우고 흐르듯 차분히 현실적인 해결책을 하나씩 실행하십시오.'
    ],
    searchKeywords: ['사면초가', '중수감', '악재연속', '담대함', '위기극복', '패닉방지']
  },
  // 30. 중화리 (직장·조직)
  {
    id: 'lesson-30',
    hexagramId: 30,
    hexagramNameKorean: '중화리',
    hexagramNameHanji: '重火離',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '明哲保身',
    idiomKorean: '명철보신 (불꽃처럼 명석한 지혜를 품되 바른 곳에 안착하라)',
    originQuote: '離 利貞 亨 畜牝牛 吉 重明以麗乎正 乃化成天下',
    coreMeaning: '뛰어난 지혜와 통찰력을 발휘하되, 암투에 휘말리지 말고 바른 조직에 몸을 맡겨라',
    situationSummary: '명석한 두뇌로 회사의 핵심 전략을 짰으나 사내 파벌 싸움의 도구로 이용당할 위기인 상황',
    modernLesson: '불은 홀로 타오를 수 없고 탈 나무(안식처)에 붙어야 빛납니다. 나의 재능을 악덕 상사에게 바치지 말고, 도덕적이고 유망한 바른 플랫폼(麗乎正)에 안착해야 번영합니다.',
    actionSteps: [
      '나의 지적 자산과 아이디어가 누구를 위해 쓰이고 있는지 점검하십시오.',
      '순종적이고 성실한 암소처럼(畜牝牛) 온화한 처세로 주변과 조화를 이루십시오.',
      '지나치게 날카로운 비판으로 사람들에게 상처를 주지 마십시오.'
    ],
    searchKeywords: ['명석함', '중화리', '지혜', '안착', '직장처세', '플랫폼', '전문성']
  },
  // 31. 택산함 (사랑·관계)
  {
    id: 'lesson-31',
    hexagramId: 31,
    hexagramNameKorean: '택산함',
    hexagramNameHanji: '澤山咸',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '感應和合',
    idiomKorean: '감응화합 (순수한 마음으로 상대에게 공감하라)',
    originQuote: '咸 亨 利貞 取女吉 男下女',
    coreMeaning: '조건과 계산을 버리고, 자신을 낮추어 상대방의 마음에 귀를 기울여라',
    situationSummary: '호감 가는 사람과의 만남에서 스펙이나 조건만 따지다 마음의 문을 열지 못하는 상황',
    modernLesson: '젊은 남녀가 순수한 마음으로 서로에게 감응하듯, 남을 존중하고 눈높이를 맞출 때 진정한 사랑과 협력이 시작됩니다. 계산기를 내려놓으십시오.',
    actionSteps: [
      '대화할 때 나의 스펙을 자랑하지 말고 상대의 관심사를 경청하십시오.',
      '사소한 약속을 철저히 지켜 신뢰의 기본기를 증명하십시오.',
      '상대의 외모나 조건보다 일상의 배려심과 가치관을 확인하십시오.'
    ],
    searchKeywords: ['연애', '사랑', '택산함', '호감', '공감', '소개팅', '진심']
  },
  // 32. 뇌풍항 (사랑·관계)
  {
    id: 'lesson-32',
    hexagramId: 32,
    hexagramNameKorean: '뇌풍항',
    hexagramNameHanji: '雷風恒',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '恒久之德',
    idiomKorean: '항구지덕 (한결같은 신뢰와 성실한 의리)',
    originQuote: '恒 亨 无咎 利貞 利有攸往',
    coreMeaning: '설렘이 식은 권태기의 자리, 매일의 성실한 배려와 의리로 평생의 반려자가 되어라',
    situationSummary: '연애 초기의 열정이 식고 사소한 일로 다툼이 잦아진 오랜 연인/부부 상황',
    modernLesson: '성숙한 사랑은 감정의 기복이 아니라 한결같은 태도에 있습니다. 바깥의 헛된 유혹에 흔들리지 말고 매일의 작은 약속을 지키는 의리가 관계를 지킵니다.',
    actionSteps: [
      '상대방을 내 입맛대로 뜯어고치려 하지 말고 있는 그대로 수용하십시오.',
      '하루에 한 번 고마움과 수고를 다정한 말로 표현하십시오.',
      '함께할 수 있는 새로운 취미나 운동 루틴을 만들어 유대감을 새롭게 하십시오.'
    ],
    searchKeywords: ['권태기', '뇌풍항', '부부관계', '의리', '한결같음', '신뢰', '오랜연인']
  },
  // 33. 천산둔 (직장·조직)
  {
    id: 'lesson-33',
    hexagramId: 33,
    hexagramNameKorean: '천산둔',
    hexagramNameHanji: '天山遯',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '遠引逃避',
    idiomKorean: '원인도피 (소인의 판에서는 지혜롭게 한 걸음 물러나라)',
    originQuote: '遯 亨 小利貞 君子以遠小人 不惡而嚴',
    coreMeaning: '소인배들이 득세한 판에서 억지로 맞서지 말고, 품위를 지키며 깔끔하게 물러나라',
    situationSummary: '부패하거나 편협한 세력이 주도권을 잡은 조직에서 부당한 공격을 받고 있는 상황',
    modernLesson: '똥이 무서워서 피하나 더러워서 피합니다. 악한 자들과 진흙탕 싸움을 벌이면 나도 더러워집니다. 미련 없이 거리를 두고 다음 기회를 도모하십시오.',
    actionSteps: [
      '소인배들과 사적인 감정싸움을 벌이지 말고 냉정하고 엄격한 태도를 유지하십시오(不惡而嚴).',
      '이직이나 부서 이동 등 안전한 탈출구를 물밑에서 치밀하게 준비하십시오.',
      '퇴사나 이직 시 감정적 폭언을 삼가고 인수인계를 깔끔하게 끝내 명분을 챙기십시오.'
    ],
    searchKeywords: ['이직', '퇴사', '천산둔', '후퇴', '소인배', '거리두기', '자기보호']
  },
  // 34. 뇌천대장 (직장·조직)
  {
    id: 'lesson-34',
    hexagramId: 34,
    hexagramNameKorean: '뇌천대장',
    hexagramNameHanji: '雷天大壯',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '大壯警戒',
    idiomKorean: '대장경계 (힘이 세어졌을 때 경거망동을 경계하라)',
    originQuote: '大壯 利貞 羝羊觸藩 羸其角',
    coreMeaning: '권력과 기세가 등등할 때 함부로 휘두르면 숫양의 뿔처럼 덫에 걸려 자멸한다',
    situationSummary: '승진하거나 입지가 커져 위세를 떨치며 규정을 무시하고 독단적으로 일하는 상황',
    modernLesson: '힘센 숫양이 울타리를 들이받았다가 뿔이 걸려 꼼짝 못 하듯, 힘이 생겼을 때의 오만은 치명적입니다. 기세가 좋을수록 법과 규범(利貞)을 더 엄격히 지켜야 안전합니다.',
    actionSteps: [
      '내 권한을 과시하며 부하 직원에게 갑질하거나 무리한 요구를 하지 마십시오.',
      '중요한 결정일수록 공식 절차와 규정을 철저히 밟아 반대파의 꼬투리를 차단하십시오.',
      '반대 의견을 내는 팀원에게 보복하지 말고 논리적으로 설득하십시오.'
    ],
    searchKeywords: ['갑질경계', '뇌천대장', '권력', '오만', '규범준수', '리더십']
  },
  // 35. 화지진 (직장·조직)
  {
    id: 'lesson-35',
    hexagramId: 35,
    hexagramNameKorean: '화지진',
    hexagramNameHanji: '火地晉',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '晝日三接',
    idiomKorean: '주일삼접 (실력을 인정받아 초고속 승진하는 대낮의 전진)',
    originQuote: '晉 康侯 用錫馬蕃庶 晝日三接',
    coreMeaning: '태양이 대지 위로 솟구치듯, 최고 경영진의 신임을 받아 능력을 마음껏 펼쳐라',
    situationSummary: '내 역량이 만천하에 드러나 주요 프로젝트의 리더로 발탁되고 기회가 열린 상황',
    modernLesson: '왕이 충신에게 하루에 세 번 말을 하사하듯 큰 인정을 받는 전성기입니다. 망설이지 말고 적극적으로 전진하여 압도적인 성과를 만들어내십시오.',
    actionSteps: [
      '주어진 기회를 두려워하지 말고 과감하게 큰 프로젝트의 키를 잡으십시오.',
      '경영진의 비전과 일치하는 방향으로 신속하게 결과물을 도출하십시오.',
      '성과를 낼 때 나를 도와준 실무진들에게 확실한 보상을 챙겨주십시오.'
    ],
    searchKeywords: ['승진', '화지진', '발탁', '성과', '전성기', '초고속승진', '도약']
  },
  // 36. 지화명이 (위기·멘탈)
  {
    id: 'lesson-36',
    hexagramId: 36,
    hexagramNameKorean: '지화명이',
    hexagramNameHanji: '地火明夷',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '韜光養晦',
    idiomKorean: '도광양회 (어둠 속에서 실력을 감추고 때를 기다려라)',
    originQuote: '明入地中 明夷 君子以莅衆 用晦而明',
    coreMeaning: '태양이 땅속으로 들어간 암흑기, 억울함을 참고 지혜를 감추며 내실을 길러라',
    situationSummary: '부당한 대우나 핍박을 받고 있으나 지금 정면으로 맞서면 내가 잘릴 것 같은 상황',
    modernLesson: '빛이 상처를 입은 시기입니다. 겉으로는 순응하는 척하면서도 내면의 명석함(用晦而明)을 유지하며 조용히 내공을 쌓으십시오. 칼을 갈며 겨울을 버텨야 합니다.',
    actionSteps: [
      '감정적으로 폭발하여 SNS 등에 억울함을 토로하지 말고 철저히 침묵하십시오.',
      '근무 외 시간을 활용해 이직에 필요한 자격증과 포트폴리오를 치밀하게 준비하십시오.',
      '운동과 독서로 멘탈이 무너지지 않도록 방어하십시오.'
    ],
    searchKeywords: ['버티기', '도광양회', '지화명이', '암흑기', '인내', '멘탈', '비밀준비']
  },
  // 37. 풍화가인 (사랑·관계)
  {
    id: 'lesson-37',
    hexagramId: 37,
    hexagramNameKorean: '풍화가인',
    hexagramNameHanji: '風火家人',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '家和萬事',
    idiomKorean: '가화만사 (가정의 질서와 서로의 역할 존중)',
    originQuote: '家人 利女貞 父父子子 兄兄弟弟 夫夫婦婦 而家道正',
    coreMeaning: '바깥일이 잘 풀리려면 집안 화합이 먼저다. 가족 간의 경계와 역할을 존중하라',
    situationSummary: '외부 일에만 치여 가족과의 대화가 단절되고 집안이 냉랭해진 상황',
    modernLesson: '가정이 편안해야 밖에서도 승리합니다. 가장 가까운 사이일수록 예의를 지키고 각자의 영역과 고충을 배려해야 안식처가 유지됩니다.',
    actionSteps: [
      '밖에서 받은 스트레스를 가족에게 화풀이하지 마십시오.',
      '가사 분담과 재정 관리에 대해 솔직하고 투명하게 대화하십시오.',
      '주말에는 온전히 가족과 함께하는 따뜻한 식사 시간을 확보하십시오.'
    ],
    searchKeywords: ['가정평화', '가화만사성', '풍화가인', '부부관계', '존중', '가족']
  },
  // 38. 화택규 (사랑·관계)
  {
    id: 'lesson-38',
    hexagramId: 38,
    hexagramNameKorean: '화택규',
    hexagramNameHanji: '火澤睽',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '求同存異',
    idiomKorean: '구동존이 (서로 다른 차이를 인정하고 작은 공통점을 찾아라)',
    originQuote: '睽 小事吉 君子以同而異',
    coreMeaning: '생각과 가치관이 정반대인 사람과 부딪칠 때, 억지로 바꾸려 하지 말고 공통분모만 찾아라',
    situationSummary: '성격이나 정치관, 소비 습관이 완전히 다른 연인이나 동료와 사사건건 부딪치는 상황',
    modernLesson: '불은 위로 솟고 물은 아래로 흘러 어긋나는(睽) 형국입니다. 큰일을 함께 도모하긴 어렵지만, 작은 일에서는 서로의 다름을 인정하고(求同存異) 타협할 수 있습니다.',
    actionSteps: [
      '상대방을 내 가치관대로 설득하거나 개조하려 하지 마십시오.',
      '합의할 수 있는 작은 공통 목표(소소한 프로젝트, 일정 약속)에만 집중하십시오.',
      '서로의 프라이버시와 취향을 침범하지 않는 안전거리를 두십시오.'
    ],
    searchKeywords: ['성격차이', '화택규', '구동존이', '갈등해소', '다름인정', '타협']
  },
  // 39. 수산건 (위기·멘탈)
  {
    id: 'lesson-39',
    hexagramId: 39,
    hexagramNameKorean: '수산건',
    hexagramNameHanji: '水山蹇',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '反身修德',
    idiomKorean: '반신수덕 (앞엔 물 뒤엔 산, 무리하지 말고 내 실력을 점검하라)',
    originQuote: '蹇 利西南 不利東北 利見大人 貞吉',
    coreMeaning: '앞길이 꽁꽁 얼어붙었을 때 억지 전진을 멈추고, 자신을 돌아보며 귀인의 도움을 청하라',
    situationSummary: '사방이 막혀서 어떤 해결책도 나오지 않고 발이 묶여버린 답답한 상황',
    modernLesson: '절름발이가 얼음판을 걷는 형국입니다. 억지로 나아가면 다리만 부러집니다. 나를 돌아보고 수양하며(反身修德), 지혜로운 어른(大人)에게 길을 물어야 합니다.',
    actionSteps: [
      '무리한 돌파를 멈추고 안전지대(西南)로 후퇴하십시오.',
      '업계 선배나 신뢰할 수 있는 전문가를 찾아가 현재 상황의 활로를 자문하십시오.',
      '내 능력의 한계를 솔직히 인정하고 부족한 스킬을 보강하십시오.'
    ],
    searchKeywords: ['사면초가', '수산건', '자문', '반신수덕', '멈춤', '내실']
  },
  // 40. 뇌수해 (위기·멘탈)
  {
    id: 'lesson-40',
    hexagramId: 40,
    hexagramNameKorean: '뇌수해',
    hexagramNameHanji: '雷水解',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '解冤釋結',
    idiomKorean: '해원석결 (묵은 갈등과 매듭이 봄눈 녹듯 풀린다)',
    originQuote: '解 利西南 无所往 其來復吉 有攸往 夙吉',
    coreMeaning: '얼어붙었던 문제가 풀리기 시작하면, 과거의 원망을 털어내고 신속하게 정상화하라',
    situationSummary: '길었던 침체기나 분쟁이 마침내 해결 국면에 접어들어 매듭이 풀리는 상황',
    modernLesson: '봄비가 얼음을 녹이듯 모든 문제가 풀리는 길운입니다. 이때 과거의 앙금을 물고 늘어지지 말고, 너그럽게 사면하고 빠르게 본업의 자리로 돌아가십시오(夙吉).',
    actionSteps: [
      '오랜 갈등 관계에 있던 상대에게 먼저 화해의 손을 내미십시오.',
      '지체되었던 핵심 프로젝트를 지체 없이 신속하게 재개하십시오.',
      '풀린 상황에 방심하지 말고 원점으로 돌아와 기본기를 다잡으십시오.'
    ],
    searchKeywords: ['해결', '뇌수해', '봄날', '화해', '매듭풀림', '정상화', '신속함']
  },
  // 41. 산택손 (사업 & 부)
  {
    id: 'lesson-41',
    hexagramId: 41,
    hexagramNameKorean: '산택손',
    hexagramNameHanji: '山澤損',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '十朋之龜',
    idiomKorean: '십붕지구 (전문가의 자문과 성의 있는 대가)',
    originQuote: '或益之十朋之龜 弗克違 元吉 損下益上 其道上行',
    coreMeaning: '빈손으로 자문을 구하지 마라. 거액의 보배 거북처럼 합당한 대가를 치르고 최고 지혜를 얻어라',
    situationSummary: '중대한 계약, 소송, 투자 기로에서 혼자만의 감으로 밀어붙이려 하거나, 공짜로 남의 조언을 바라는 상황',
    modernLesson: '‘십붕(十朋)’은 고대 조개껍데기 화폐 10묶음으로 수억 원 상당의 거금입니다. 최고의 전문가에게 정당한 대가와 깍듯한 성의를 갖추어야 상대도 100% 진짜 비기를 열어줍니다.',
    actionSteps: [
      '세무·법률·업계 최고 멘토에게 자문을 구할 때는 정당한 자문료나 성의를 먼저 준비하십시오.',
      '‘커피 한 잔 사줄 테니 알려줘’ 식의 가벼운 태도를 버리고 질문을 날카롭게 정리해 가십시오.',
      '손실 난 분야는 과감히 손절매(損)하여 더 큰 이익(益)을 위한 시드를 확보하십시오.'
    ],
    searchKeywords: ['십붕지구', '산택손', '전문가자문', '멘토링', '손절매', '성의', '자문료']
  },
  // 42. 풍뢰익 (부·재테크)
  {
    id: 'lesson-42',
    hexagramId: 42,
    hexagramNameKorean: '풍뢰익',
    hexagramNameHanji: '風雷益',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '損上益下',
    idiomKorean: '손상익하 (고객과 파트너에게 먼저 이익을 주어라)',
    originQuote: '益 損上益下 民說無疆 自上下下 其道大光 利涉大川',
    coreMeaning: '남에게 먼저 마진을 양보할 때, 거대한 신뢰와 복리 수익이 나에게 되돌아온다',
    situationSummary: '수수료를 쥐어짜거나 단기 마진에 집착하여 고객과 거래처의 불만이 커진 상황',
    modernLesson: '윗사람이 조금 덜어 아랫사람을 풍요롭게 하면 천하가 기뻐하며 도약합니다. 거래처와 고객에게 더 많은 혜택을 주는 비즈니스가 장기적으로 시장을 독점합니다.',
    actionSteps: [
      '고객이 지불한 가격보다 훨씬 더 큰 실질적 가치와 감동을 제공하십시오.',
      '파트너사와의 협상에서 지나치게 깎지 말고 상생의 마진을 보장하십시오.',
      '단기 수익의 유혹을 뿌리치고 평판 자본을 축적하십시오.'
    ],
    searchKeywords: ['상생', '풍뢰익', '손상익하', '고객만족', '장기투자', '복리', '부자원리']
  },
  // 43. 택천쾌 (사업·창업)
  {
    id: 'lesson-43',
    hexagramId: 43,
    hexagramNameKorean: '택천쾌',
    hexagramNameHanji: '澤天夬',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '決斷斷乎',
    idiomKorean: '결단단호 (썩은 부위를 도려내는 단호한 마지막 단판)',
    originQuote: '夬 揚于王庭 孚號 有厲 告自邑 不利卽戎 利有攸往',
    coreMeaning: '더 이상 미룰 수 없다. 공개적인 자리에서 명분을 밝히고 부조리를 단호히 끊어내라',
    situationSummary: '회사에 해악을 끼치는 동업자나 한계 사업부를 미적거리다 골든타임을 놓칠 위기인 상황',
    modernLesson: '못의 물이 넘쳐 둑을 터뜨리듯 결단의 때가 왔습니다. 음모나 무력(卽戎)으로 하지 말고, 공명정대하게 명분을 선포하여 깨끗하게 정리하십시오.',
    actionSteps: [
      '동업자나 협력사와의 결별 시 모든 계약 조건과 정산 내역을 투명하게 문서화하십시오.',
      '사적인 감정을 배제하고 회사의 생존과 비전을 위한 불가피한 결정임을 밝히십시오.',
      '결단 후에는 뒤돌아보지 말고 새로운 미래 목표를 향해 전력투구하십시오.'
    ],
    searchKeywords: ['결단', '택천쾌', '단판', '동업정리', '구조조정', '단호함']
  },
  // 44. 천풍구 (사랑·관계)
  {
    id: 'lesson-44',
    hexagramId: 44,
    hexagramNameKorean: '천풍구',
    hexagramNameHanji: '天風姤',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '愼勿天風',
    idiomKorean: '신물천풍 (달콤하지만 위험한 유혹을 경계하라)',
    originQuote: '姤 女壯 勿用取女',
    coreMeaning: '첫눈에 혹하는 지나치게 달콤한 인연 뒤에 숨은 리스크를 냉정히 분별하라',
    situationSummary: '만난 지 얼마 안 된 사람에게 홀려 큰돈을 빌려주거나 인생의 중대 결정을 내리려는 상황',
    modernLesson: '바람이 불어 뜻밖의 인연을 만나는 상이지만, 동시에 나를 집어삼킬 위험한 유혹(女壯)입니다. 충동에 휘둘리지 말고 상대방의 배경과 진면목을 시간을 두고 검증하십시오.',
    actionSteps: [
      '지나치게 저돌적이거나 달콤한 말을 쏟아내는 사람을 일단 한 걸음 떨어져 관찰하십시오.',
      '돈 거래나 법적 보증 등 돌이킬 수 없는 결정은 절대 단기간에 내리지 마십시오.',
      '믿을 수 있는 오랜 지인들의 객관적인 평가를 반드시 구하십시오.'
    ],
    searchKeywords: ['유혹경계', '천풍구', '가스라이팅', '사기연애', '신중함', '인연검증']
  },
  // 45. 택지췌 (사업·창업)
  {
    id: 'lesson-45',
    hexagramId: 45,
    hexagramNameKorean: '택지췌',
    hexagramNameHanji: '澤地萃',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '聚秀人才',
    idiomKorean: '취수인재 (사람과 자본이 구름처럼 모이는 결집의 번창)',
    originQuote: '萃 亨 王假有廟 利見大人 亨 利貞 用大牲 吉 利有攸往',
    coreMeaning: '사람과 돈이 모여들 때일수록 구심점을 확립하고, 엄정한 규율과 대비를 하라',
    situationSummary: '투자 유치에 성공하고 인재들이 대거 입사하여 조직 규모가 급팽창하는 상황',
    modernLesson: '물이 모여 거대한 호수를 이루는 번창의 상입니다. 사람이 많이 모일수록 도난과 분쟁의 위험도 커집니다. 확실한 중심 철학(王假有廟)과 방비책을 세워야 합니다.',
    actionSteps: [
      '새로 영입된 인재들이 융화될 수 있도록 온보딩 시스템과 조직 문화를 정비하십시오.',
      '자금이 넉넉할 때 방만한 지출을 통제하고 비상금을 비축하십시오.',
      '보안과 정보 유출 방지를 위한 사내 시스템을 강화하십시오.'
    ],
    searchKeywords: ['투자유치', '택지췌', '인재영입', '조직확장', '번창', '스케일업']
  },
  // 46. 지풍승 (직장·조직)
  {
    id: 'lesson-46',
    hexagramId: 46,
    hexagramNameKorean: '지풍승',
    hexagramNameHanji: '地風升',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '漸進上升',
    idiomKorean: '점진상승 (뿌리를 내리며 순리대로 차근차근 올라라)',
    originQuote: '升 元亨 用見大人 勿恤 南征吉',
    coreMeaning: '나무가 흙속에서 자라 거목이 되듯, 조급함을 버리고 실력을 누적하여 승진하라',
    situationSummary: '승진이나 이직을 앞두고 사내 정치에 편승하려다 중심을 잃을 위기인 상황',
    modernLesson: '지풍승은 땅속의 싹이 하늘을 향해 자라는 정직한 상승입니다. 꼼수나 줄타기 대신 대체 불가능한 실력과 윗사람(大人)의 신망을 얻어 순리대로 도약하십시오.',
    actionSteps: [
      '남과의 승진 속도 비교를 멈추고 내 핵심 업무 포트폴리오를 고도화하십시오.',
      '상사 및 유관 부서 리더들과 정기적인 업무 성과를 공유하며 신뢰를 쌓으십시오.',
      '더 큰 무대(南征)로 나아갈 수 있는 역량 개발에 투자하십시오.'
    ],
    searchKeywords: ['승진', '지풍승', '커리어', '역량강화', '차근차근', '도약']
  },
  // 47. 택수곤 (위기·멘탈)
  {
    id: 'lesson-47',
    hexagramId: 47,
    hexagramNameKorean: '택수곤',
    hexagramNameHanji: '澤水困',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '困而不絶',
    idiomKorean: '곤이불절 (연못 밑으로 물이 빠진 극심한 곤경, 변명하지 말고 버텨라)',
    originQuote: '困 亨 貞 大人吉 无咎 有言不信',
    coreMeaning: '자금줄이 마르고 고립되었을 때, 말로 변명하려 하지 말고 묵묵히 행동으로 견뎌라',
    situationSummary: '통장 잔고가 바닥나고 주변에서 아무도 믿어주지 않아 극심한 자괴감에 빠진 상황',
    modernLesson: '연못 아래로 물이 다 새어버린 최악의 가뭄입니다. 이때 억울하다고 떠들어봐야 아무도 믿지 않습니다(有言不信). 입을 다물고 오직 버티며 때를 기다려야 군자의 길(大人吉)이 열립니다.',
    actionSteps: [
      '남들에게 하소연하거나 구차한 변명을 늘어놓지 마십시오.',
      '최소한의 생계비를 확보하기 위해 궂은일도 마다하지 않는 결기를 보이십시오.',
      '이 고난이 나의 내공을 다이아몬드처럼 단단하게 만드는 수련의 과정임을 믿으십시오.'
    ],
    searchKeywords: ['극심한곤경', '택수곤', '침묵', '인내', '자금고갈', '버티기', '자괴감극복']
  },
  // 48. 수풍정 (부·재테크)
  {
    id: 'lesson-48',
    hexagramId: 48,
    hexagramNameKorean: '수풍정',
    hexagramNameHanji: '水風井',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '井德勿新',
    idiomKorean: '정덕물신 (마르지 않는 샘물처럼 패시브 인컴 시스템을 구축하라)',
    originQuote: '井 改邑不改井 无喪无得 往來井井 汔至 亦未繘井 羸其瓶 凶',
    coreMeaning: '마을은 바뀌어도 우물은 마르지 않는다. 끊임없이 샘솟는 캐시카우 시스템을 만들어라',
    situationSummary: '노동 소득에만 의존하다 보니 몸이 아프거나 은퇴 후의 현금 흐름이 극도로 불안한 상황',
    modernLesson: '두레박이 바닥에 닿기 전에 깨지면(羸其瓶) 헛수고입니다. 꾸준히 마르지 않고 돈이 나오는 배당, 콘텐츠, 부동산 등 지속 가능한 우물(井) 시스템을 완성해야 진정한 부자입니다.',
    actionSteps: [
      '매월 또박또박 현금이 들어오는 배당주나 정기 수익형 자산군을 구축하십시오.',
      '시스템을 완성하기 직전에 방심하여 그만두지 말고 끝까지 두레박을 길어 올리십시오.',
      '내가 구축한 지식과 노하우를 타인과 나누어 샘물의 가치를 더 키우십시오.'
    ],
    searchKeywords: ['패시브인컴', '수풍정', '현금흐름', '캐시카우', '우물', '자산시스템']
  },
  // 49. 택화혁 (사업·창업)
  {
    id: 'lesson-49',
    hexagramId: 49,
    hexagramNameKorean: '택화혁',
    hexagramNameHanji: '澤火革',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '革故鼎新',
    idiomKorean: '혁고정신 (낡은 판을 부수고 새롭게 피보팅하라)',
    originQuote: '巳日乃孚 元亨利貞 悔亡',
    coreMeaning: '시장이 변했음을 인정하고, 기존 비즈니스 모델을 과감히 폐기하고 피보팅하라',
    situationSummary: '과거 잘나가던 매출 모델이 꺾이고 고객 이탈이 심각한데도 옛 방식에 집착하는 상황',
    modernLesson: '뱀이 허물을 벗지 못하면 죽듯이 체질을 혁신해야 합니다. 시기가 무르익었을 때(巳日) 단호히 쇄신해야 후회가 사라집니다.',
    actionSteps: [
      '수익성이 없거나 미래 가치가 떨어진 프로젝트를 과감하게 정리하십시오.',
      '조직 내 기득권의 저항에 타협하지 말고 명확한 혁신 비전과 보상안을 제시하십시오.',
      '새로운 기술과 트렌드를 도입하여 고객의 실질적 문제를 해결하십시오.'
    ],
    searchKeywords: ['피보팅', '택화혁', '사업혁신', '체질개선', '쇄신', '구조개혁']
  },
  // 50. 화풍정 (사업·창업)
  {
    id: 'lesson-50',
    hexagramId: 50,
    hexagramNameKorean: '화풍정',
    hexagramNameHanji: '火風鼎',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '鼎力協同',
    idiomKorean: '정력협동 (새로운 기틀 위에 인재를 모아라)',
    originQuote: '鼎 元吉 亨 君子以正位凝命',
    coreMeaning: '새로운 솥을 걸어 만인을 먹이듯, 훌륭한 시스템과 뛰어난 인재를 등용하라',
    situationSummary: '사업이 안착 단계에 접어들어 1인 대표 체제에서 기업형 시스템으로 도약해야 하는 상황',
    modernLesson: '정(鼎)은 고대 제사용 솥으로 나라의 기틀을 상징합니다. 대표 개인기에 의존하던 단계에서 벗어나 권한을 위임하고 탁월한 인재에게 걸맞은 대우를 해야 번창합니다.',
    actionSteps: [
      'C레벨 및 핵심 리더들에게 과감한 권한과 책임을 위임하십시오.',
      '표준 업무 매뉴얼(SOP)을 확립하여 시스템이 일하는 구조를 만드십시오.',
      '수익의 일정 부분을 직원 복지와 인재 육성에 재투자하십시오.'
    ],
    searchKeywords: ['인재등용', '화풍정', '시스템구축', '권한위임', '기업문화', '솥']
  },
  // 51. 중뢰진 (위기·멘탈)
  {
    id: 'lesson-51',
    hexagramId: 51,
    hexagramNameKorean: '중뢰진',
    hexagramNameHanji: '重雷震',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '恐懼脩省',
    idiomKorean: '공구수성 (천둥이 칠 때 두려워하며 스스로를 돌아보라)',
    originQuote: '震 亨 震來虩虩 笑言啞啞 震驚百里 不喪匕鬯',
    coreMeaning: '벼락같은 위기와 충격이 닥쳐와도, 제사 술잔을 떨어뜨리지 않는 침착함을 지켜라',
    situationSummary: '갑작스러운 세무조사, 규제 변경, 대형 클레임 등 마른하늘에 날벼락을 맞은 상황',
    modernLesson: '천둥이 백 리를 뒤흔들어도 장수와 군자는 제사용 숟가락을 떨어뜨리지 않습니다(不喪匕鬯). 벼락이 칠 때 공포에 질려 도망치지 말고, 나를 돌아보며 침착하게 대응하십시오.',
    actionSteps: [
      '충격적인 소식을 들었을 때 즉각적인 감정 반응을 멈추고 10번 깊게 심호흡하십시오.',
      '최악의 법적·재정적 리스크 범위를 파악하고 전문가와 방어선을 구축하십시오.',
      '이번 위기를 계기로 내부의 부실했던 보안과 절차를 완벽히 정비하십시오.'
    ],
    searchKeywords: ['날벼락', '중뢰진', '위기대응', '침착함', '자기반성', '멘탈관리']
  },
  // 52. 중산간 (건강·자기관리)
  {
    id: 'lesson-52',
    hexagramId: 52,
    hexagramNameKorean: '중산간',
    hexagramNameHanji: '重山艮',
    category: 'health',
    categoryName: '건강·자기관리',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '動善靜止',
    idiomKorean: '동선정지 & 간기배 (척추를 곧게 펴고 잡념을 멈추는 자세 교정과 명상)',
    originQuote: '艮其背 不獲其身 行其庭 不見其人 无咎',
    coreMeaning: '등과 척추를 바로 세우고(艮其背) 멈추어라. 거북목과 과열된 뇌를 식히는 최고의 양생 명상',
    situationSummary: '하루 종일 구부정한 자세로 모니터만 보아 목·어깨 통증과 두통, 만성 스트레스에 시달리는 상황',
    modernLesson: '산처럼 우뚝 멈추어 서서 등(背)을 바르게 펴라는 것이 주역 간괘의 가르침입니다. 척추가 바로 서야 척수액과 혈액이 뇌로 원활히 통합니다. 바른 자세와 호흡이 최고의 명약입니다.',
    actionSteps: [
      '50분 근무 후 반드시 일어나 턱을 당기고 가슴을 펴는 척추 스트레칭을 3분간 하십시오.',
      '하루 10분 복식호흡 명상을 통해 뇌파를 안정시키고 코르티솔 수치를 낮추십시오.',
      '의자와 모니터 높이를 눈높이에 맞추어 거북목 유발 환경을 근본적으로 교정하십시오.'
    ],
    searchKeywords: ['자세교정', '중산간', '거북목', '척추건강', '명상', '호흡법', '스트레칭', '자기관리', '건강']
  },
  // 53. 풍산점 (사랑·관계)
  {
    id: 'lesson-53',
    hexagramId: 53,
    hexagramNameKorean: '풍산점',
    hexagramNameHanji: '風山漸',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '漸進進度',
    idiomKorean: '점진진도 (기러기가 날아오르듯 순서를 밟아 인연을 맺어라)',
    originQuote: '漸 女歸吉 利貞 鴻漸于干 鴻漸于磐 鴻漸于陸',
    coreMeaning: '서두르면 탈이 난다. 정식 절차와 단계를 밟아가며 단단한 신뢰를 쌓아라',
    situationSummary: '결혼이나 연애에서 절차를 생략하고 서둘러 결론을 내리려다 상대방에게 부담을 주는 상황',
    modernLesson: '기러기가 물가에서 바위로, 바위에서 육지로 한 단계씩 날아오르듯(鴻漸), 진정한 인연과 결혼은 단계별 성숙이 필요합니다. 조급해하지 말고 서로의 가정을 존중하며 나아가십시오.',
    actionSteps: [
      '연인 간에 결혼이나 동거를 서두르지 말고 깊이 있는 대화와 신뢰를 먼저 확인하십시오.',
      '양가 부모님과 집안 어른들에게 예의를 다해 정식 절차를 밟으십시오.',
      '관계의 속도보다 방향성과 정서적 안정성을 최우선으로 두십시오.'
    ],
    searchKeywords: ['결혼준비', '풍산점', '점진적관계', '기러기', '신뢰쌓기', '절차', '연애']
  },
  // 54. 뇌택귀매 (사랑·관계)
  {
    id: 'lesson-54',
    hexagramId: 54,
    hexagramNameKorean: '뇌택귀매',
    hexagramNameHanji: '雷澤歸妹',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '正節警戒',
    idiomKorean: '정절경계 (충동과 조급함으로 절차를 건너뛰면 후회만 남는다)',
    originQuote: '歸妹 征凶 无攸利 君子以永終知敝',
    coreMeaning: '욕정에 눈이 멀어 도리와 절차를 무시하고 맺은 인연은 끝이 불행하다',
    situationSummary: '유부남/유부녀와의 부적절한 만남이나, 충동적인 원나잇 등으로 인생이 꼬일 위기인 상황',
    modernLesson: '귀매(歸妹)는 순서를 무시하고 첩으로 들어가는 불길한 상입니다. 정당하지 못한 관계나 도리를 저버린 사랑은 처음엔 달콤해도 끝은 파멸(征凶)입니다. 즉시 손절하십시오.',
    actionSteps: [
      '비윤리적이거나 불륜 등 사회적 지탄을 받는 관계를 단호히 정리하십시오.',
      '순간의 성적 충동이나 외로움 때문에 인생의 소중한 명예와 가정을 파괴하지 마십시오.',
      '시작이 바르지 못한 관계는 끝도 결코 아름다울 수 없음을 명심하십시오.'
    ],
    searchKeywords: ['불륜경계', '뇌택귀매', '충동적관계', '절차무시', '후회', '단호한손절']
  },
  // 55. 뇌화풍 (사업·창업)
  {
    id: 'lesson-55',
    hexagramId: 55,
    hexagramNameKorean: '뇌화풍',
    hexagramNameHanji: '雷火豊',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '日中則昃',
    idiomKorean: '일중즉측 (해가 중천에 뜨면 기운다, 전성기 때 출구전략을 짜라)',
    originQuote: '豊 亨 王假之 勿憂 宜日中 日中則昃 月盈則食',
    coreMeaning: '최절정의 풍요를 누릴 때 방심하지 말고, 곧 다가올 쇠퇴와 그늘을 대비하라',
    situationSummary: '사상 최대 실적을 달성하고 매출이 폭발하여 돈을 물 쓰듯 쓰며 방심하는 상황',
    modernLesson: '태양이 한낮에 이르면 기울기 시작하고 달도 차면 깁니다(日中則昃 月盈則食). 전성기일 때 출구 전략(Exit)과 현금 비축, 차세대 먹거리를 준비해야 기업이 영속합니다.',
    actionSteps: [
      '최대 실적에 취해 사옥 매입이나 무리한 확장 등 과시성 투자를 자제하십시오.',
      '호황기 수익의 30%를 현금 유동성으로 잠가두어 불황에 대비하십시오.',
      '현재 주력 상품의 수명이 끝나기 전에 신사업 R&D 투자를 시작하십시오.'
    ],
    searchKeywords: ['전성기', '뇌화풍', '출구전략', '일중즉측', '방심경계', '비상금']
  },
  // 56. 화산려 (직장·조직)
  {
    id: 'lesson-56',
    hexagramId: 56,
    hexagramNameKorean: '화산려',
    hexagramNameHanji: '火山旅',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '羈旅謙遜',
    idiomKorean: '기려겸손 (낯선 곳에 새로 들어갔을 땐 나그네처럼 겸손하라)',
    originQuote: '旅 小亨 旅貞吉 君子以明愼用刑 而不留獄',
    coreMeaning: '이직한 직장이나 낯선 환경에서는 텃세를 자극하지 말고, 조용히 관찰하며 적응하라',
    situationSummary: '경력직으로 새 회사에 입사하여 의욕이 넘쳐 기존 직원들의 방식을 비판하다 미움받는 상황',
    modernLesson: '나그네(旅)는 객지에서 힘이 없습니다. 내 집이 아닌 곳에서 뻣뻣하게 굴면 쫓겨납니다. 자세를 낮추고 예의를 지키며 그 조직의 룰을 먼저 익혀야 정착할 수 있습니다.',
    actionSteps: [
      '새 직장 입사 초기 3개월간은 기존 업무 프로세스를 전적으로 존중하고 배우십시오.',
      '“전 회사에서는 이렇게 했는데”라는 말을 입 밖으로 절대 꺼내지 마십시오.',
      '기존 텃주대감들과 식사하며 인간적인 친밀감을 먼저 형성하십시오.'
    ],
    searchKeywords: ['이직초기', '화산려', '텃세극복', '나그네', '겸손', '적응', '경력직처세']
  },
  // 57. 중풍손 (직장·조직)
  {
    id: 'lesson-57',
    hexagramId: 57,
    hexagramNameKorean: '중풍손',
    hexagramNameHanji: '重風巽',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '柔順浸透',
    idiomKorean: '유순침투 (바람처럼 부드럽게 스며들어 사람의 마음을 얻어라)',
    originQuote: '巽 小亨 利有攸往 利見大人 重巽以申命',
    coreMeaning: '강한 힘으로 찍어누르지 말고, 부드러운 바람처럼 상대의 틈새로 파고들어 설득하라',
    situationSummary: '까다로운 거래처나 고집불통인 파트너를 설득해야 하는데 정면충돌만 일어나는 상황',
    modernLesson: '바람은 형태가 없으나 어떤 틈새도 뚫고 들어갑니다. 권위나 논리로 상대를 굴복시키려 하지 말고, 부드러운 태도와 반복된 정성으로 스며들듯 설득하십시오.',
    actionSteps: [
      '상대의 반론을 끊지 말고 “그 말씀도 일리가 있습니다”로 먼저 인정해 주십시오.',
      '명령조의 지시 대신 상대방이 스스로 선택했다고 느끼도록 질문형 화법을 쓰십시오.',
      '한 번에 끝내려 하지 말고 여러 번에 나누어 부드럽게 제안을 전달하십시오.'
    ],
    searchKeywords: ['설득의기술', '중풍손', '유연함', '협상', '부드러움', '스며들기']
  },
  // 58. 중택태 (사랑·관계)
  {
    id: 'lesson-58',
    hexagramId: 58,
    hexagramNameKorean: '중택태',
    hexagramNameHanji: '重澤兌',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '朋友講習',
    idiomKorean: '붕우강습 (유쾌한 유머와 다정한 대화로 마음의 빗장을 풀어라)',
    originQuote: '兌 亨 利貞 麗澤 兌 君子以朋友講習',
    coreMeaning: '두 연못이 서로를 적셔주듯, 기분 좋은 대화와 다정한 미소로 사람을 끌어당겨라',
    situationSummary: '인간관계가 너무 딱딱하고 사무적이어서 주변에 사람이 모이지 않는 상황',
    modernLesson: '기쁨(兌)은 최고의 매력 자본입니다. 심각한 얼굴만 하고 있으면 누구도 다가오지 않습니다. 친구와 함께 학문을 강습하듯 유쾌하고 지혜로운 대화로 주변을 밝히십시오.',
    actionSteps: [
      '대화할 때 밝은 미소와 긍정적인 추임새를 아끼지 마십시오.',
      '남을 깎아내리는 유머가 아닌 유익하고 재치 있는 이야기로 분위기를 이끄십시오.',
      '좋은 정보나 배움이 있으면 아까워하지 말고 동료들과 기쁘게 공유하십시오.'
    ],
    searchKeywords: ['유머', '중택태', '매력', '화기애애', '대화의기술', '호감', '친구']
  },
  // 59. 풍수환 (사업·창업)
  {
    id: 'lesson-59',
    hexagramId: 59,
    hexagramNameKorean: '풍수환',
    hexagramNameHanji: '風水渙',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '渙散救濟',
    idiomKorean: '환산구제 (흩어진 조직과 자금을 하나로 다시 수습하라)',
    originQuote: '渙 亨 王假有廟 利涉大川 利貞',
    coreMeaning: '팀원들의 마음이 흩어지고 분열될 때, 강력한 사명감과 비전으로 재결집하라',
    situationSummary: '회사 분사, 경영난 등으로 팀원들이 흩어지고 사기가 땅에 떨어진 상황',
    modernLesson: '봄바람이 불어 얼음을 녹여 흩어버리듯(渙), 위기 뒤에는 조직이 와해되기 쉽습니다. 이때 구심점(王假有廟)을 세우고 새로운 비전으로 묶어야 다시 큰 강을 건널 수 있습니다.',
    actionSteps: [
      '전 직원이 모이는 타운홀 미팅을 열어 솔직한 현황과 미래 비전을 공유하십시오.',
      '조직의 분열을 조장하는 불평불만 세력과 1:1 면담하여 방향을 재정립하십시오.',
      '작은 목표를 빠르게 달성하여 팀원들의 승리 감각을 되살려주십시오.'
    ],
    searchKeywords: ['조직재결집', '풍수환', '사기진작', '비전제시', '위기수습', '단결']
  },
  // 60. 수택절 (부·재테크)
  {
    id: 'lesson-60',
    hexagramId: 60,
    hexagramNameKorean: '수택절',
    hexagramNameHanji: '水澤節',
    category: 'wealth',
    categoryName: '부·재테크',
    categoryIcon: 'i-heroicons-banknotes',
    idiomHanja: '節制有度',
    idiomKorean: '절제유도 (규범과 절제로 지출 누수를 틀어막아라)',
    originQuote: '節 亨 苦節 不可貞 君子以制數度 議德行',
    coreMeaning: '연못에 둑을 쌓아 물을 아끼듯, 지속 가능한 규칙과 예산으로 새는 돈을 막아라',
    situationSummary: '수입은 제법 많으나 충동소비와 잦은 외식으로 저축이 전혀 안 되는 상황',
    modernLesson: '절제(節)가 없으면 아무리 큰 부도 순식간에 마릅니다. 다만 너무 혹독한 절약(苦節)은 요요현상을 부르니, 지속 가능한 건강한 재정 규칙을 세우십시오.',
    actionSteps: [
      '월급날 투자 통장으로 30%를 자동이체하는 ‘선저축 후지출’을 강제하십시오.',
      '배달 음식과 택시 이용 한도를 주 1회로 제한하는 명확한 룰을 만드십시오.',
      '3개월간 사용하지 않은 모든 유료 구독 서비스를 즉시 해지하십시오.'
    ],
    searchKeywords: ['가계부', '수택절', '절제', '지출통제', '저축', '현금흐름', '소비습관']
  },
  // 61. 풍택중부 (사랑·관계)
  {
    id: 'lesson-61',
    hexagramId: 61,
    hexagramNameKorean: '풍택중부',
    hexagramNameHanji: '風澤中孚',
    category: 'love',
    categoryName: '사랑·인간관계',
    categoryIcon: 'i-heroicons-heart',
    idiomHanja: '信賴充滿',
    idiomKorean: '신뢰충만 (알을 품는 어미 새처럼 한 톨의 거짓 없는 진심)',
    originQuote: '中孚 豚魚吉 利涉大川 利貞',
    coreMeaning: '돼지와 물고기 같은 미물도 감동시키는 맑은 신뢰로 사람의 마음을 얻어라',
    situationSummary: '신뢰가 깨져 오해를 받고 있거나, 진심을 의심받아 관계가 위태로운 상황',
    modernLesson: '중부(中孚)는 마음 중심의 지극한 정성입니다. 화려한 말재주나 변명은 통하지 않습니다. 묵묵히 행동으로 진심을 보여줄 때 상대의 닫힌 문이 열립니다.',
    actionSteps: [
      '오해를 풀기 위해 말로 다투지 말고, 행동으로 신뢰 회복의 증거를 쌓으십시오.',
      '작은 약속이라도 어겼을 땐 즉시 솔직하게 인정하고 사과하십시오.',
      '비즈니스 계약에서도 계약서 이상의 진정성을 보여주어 평생의 파트너십을 만드십시오.'
    ],
    searchKeywords: ['신뢰회복', '풍택중부', '진심', '정성', '믿음', '인간관계']
  },
  // 62. 뇌산소과 (직장·조직)
  {
    id: 'lesson-62',
    hexagramId: 62,
    hexagramNameKorean: '뇌산소과',
    hexagramNameHanji: '雷山小過',
    category: 'career',
    categoryName: '직장·조직 처세',
    categoryIcon: 'i-heroicons-user-group',
    idiomHanja: '小過有喜',
    idiomKorean: '소과유희 (디테일에 목숨 걸어라, 작은 실수를 철저히 방지하라)',
    originQuote: '小過 亨 利貞 可小事 不大事 飛鳥遺之音 不宜上 宜下 大吉',
    coreMeaning: '큰일을 벌이지 말고, 새가 낮게 날듯 몸을 낮추고 디테일한 작은 일에 집중하라',
    situationSummary: '큰 비전을 좇다 실무의 사소한 오탈자나 정산 오류로 신뢰를 잃을 위기인 상황',
    modernLesson: '새가 높이 날면 사냥꾼의 화살을 맞습니다(不宜上 宜下). 지금은 거창한 전략보다 보고서 오탈자, 숫자 검증, 일정 준수 등 디테일에서 완벽을 기해야 살아남습니다.',
    actionSteps: [
      '최종 보고 전 숫자와 맞춤법을 최소 3번 이상 크로스 체크하십시오.',
      '무리한 사업 확장이나 거액의 계약 체결을 미루고 실무 점검에 집중하십시오.',
      '겸손한 태도로 지출을 평소보다 더 아끼고 몸을 사리십시오.'
    ],
    searchKeywords: ['디테일', '뇌산소과', '실수방지', '작은일집중', '낮은자세', '검증']
  },
  // 63. 수화기제 (사업·창업)
  {
    id: 'lesson-63',
    hexagramId: 63,
    hexagramNameKorean: '수화기제',
    hexagramNameHanji: '水火旣濟',
    category: 'business',
    categoryName: '사업·창업',
    categoryIcon: 'i-heroicons-briefcase',
    idiomHanja: '初吉終亂',
    idiomKorean: '초길종란 (완성 뒤에 찾아오는 쇠퇴를 경계하라)',
    originQuote: '旣濟 亨小 利貞 初吉 終亂 思患而豫防之',
    coreMeaning: '목표를 달성하고 성공했을 때가 가장 위험하다. 미리 재앙을 생각하고 예방하라',
    situationSummary: '오랫동안 준비한 프로젝트를 완벽히 론칭하고 대성공을 거두어 축제 분위기인 상황',
    modernLesson: '물이 불 위에 있어 모든 요리가 완성된 상태(旣濟)입니다. 하지만 완성 뒤에는 필연적으로 쇠퇴(終亂)가 시작됩니다. 샴페인을 너무 일찍 터뜨리지 말고 안전 점검을 하십시오.',
    actionSteps: [
      '성공에 도취되어 경거망동하지 말고 시스템의 보안 취약점을 즉시 점검하십시오.',
      '고객 불만과 시스템 에러에 대응할 비상대응팀(CS)을 24시간 가동하십시오.',
      '초심을 잃지 않도록 조직의 기강을 다잡고 다음 프로젝트 기획에 착수하십시오.'
    ],
    searchKeywords: ['성공경계', '수화기제', '초길종란', '예방', '위기관리', '완성뒤쇠퇴']
  },
  // 64. 화수미제 (사업 & 멘탈)
  {
    id: 'lesson-64',
    hexagramId: 64,
    hexagramNameKorean: '화수미제',
    hexagramNameHanji: '火水未濟',
    category: 'resilience',
    categoryName: '위기·멘탈 관리',
    categoryIcon: 'i-heroicons-shield-check',
    idiomHanja: '更新挑戰',
    idiomKorean: '갱신도전 (아직 끝나지 않았다, 미완성을 새로운 시작으로 삼아라)',
    originQuote: '未濟 亨 小狐汔濟 濡其尾 无攸利 君子以愼辨物居方',
    coreMeaning: '주역의 마지막은 완성이 아닌 미완성이다. 실패를 딛고 새로운 차원의 도전을 준비하라',
    situationSummary: '프로젝트가 아쉽게 90%에서 멈추었거나, 인생의 한 챕터가 끝나 공허함과 아쉬움이 남는 상황',
    modernLesson: '어린 여우가 강을 거의 다 건넜다가 꼬리를 적시듯(濡其尾), 인생은 결코 영원한 완성이 없습니다. 미완(未濟)은 실패가 아니라 새로운 시작(Next Stage)을 알리는 신호탄입니다.',
    actionSteps: [
      '마지막 순간에 방심하여 꼬리를 적시지 않도록 결승선 통과 직전까지 집중하십시오.',
      '지금까지의 시행착오를 다음 도전을 위한 소중한 자산으로 정리하십시오.',
      '새로운 모험과 성장을 향해 설레는 마음으로 다시 신발 끈을 묶으십시오.'
    ],
    searchKeywords: ['미완성', '화수미제', '새로운도전', '주역마지막괘', '재도전', '희망', '끝없는성장']
  }
]
