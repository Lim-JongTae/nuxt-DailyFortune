/**
 * AI 운세 분석용 프롬프트 생성 유틸리티
 */

export interface SajuPromptParams {
  userSaju: {
    fullName: string;
    stem: string;
    branch: string;
  };
  iljuData: any;
  ilganData: any;
  todaySaju: {
    fullName: string;
    stem: string;
    branch: string;
  };
  shipsinName: string;
  shipsinData: any;
  worry?: string;
}

export interface IChingPromptParams {
  hexagram: any;
  lineNumber: number;
  lineDetail?: any;
  lineHanjaText: string;
  lineKoreanText: string;
  lineModernAdvice?: string;
  worry?: string;
}

/**
 * 60일주론 및 오행 생극제화 사주 AI 프롬프트 생성
 */
export function buildSajuPrompt(params: SajuPromptParams): string {
  const { userSaju, iljuData, ilganData, todaySaju, shipsinName, shipsinData, worry } = params;
  const iljuRaw: any = iljuData?.rawAnalysis || {};

  return `당신은 60일주론과 오행 생극제화에 정통한 고결한 역학자입니다.
사용자의 사주 일주와 오늘 일진 정보, 고민을 바탕으로 품격 있고 정밀한 명리 보고서를 작성하십시오. 장황한 수사여구는 배제하고 군더더기 없이 명료하며 깊이 있는 언어로 조언하십시오.

[사용자 60일주(日柱) 정보]
- 일주: ${userSaju.fullName}일주 ${iljuData?.ganzhiHanja ? `(${iljuData.ganzhiHanja})` : ''} [육십갑자 ${iljuData?.order || ''}번]
- 천간/지지 오행: 천간 ${iljuData?.stemElement || userSaju.stem} / 지지 ${iljuData?.branchElement || userSaju.branch}
- 일주 물상론: ${iljuRaw.mulsang || iljuData?.character || '자연의 신비로운 기운을 머금은 상'}
- 일주 고유 성향: ${iljuData?.character || ilganData?.tendency || '자신만의 독자적인 매력과 주관 보유'}
- 자좌 십신 & 12운성: ${iljuRaw.shipsinSelf || '자좌 십신'} / ${iljuRaw.twelveStar || '12운성'}
- 보유 신살 및 귀인: ${iljuRaw.sinsal || '대표 신살과 귀인의 기운'}
- 분야별 소양: (직업) ${iljuData?.careerFortune || '전문성'} / (재물) ${iljuData?.wealthFortune || '성실 자산'} / (애정) ${iljuData?.romanceAdvice || '상호 존중'} / (건강) ${iljuData?.healthFortune || '오행 균형'}

[오늘의 일진(日辰) 정보]
- 오늘의 일진: ${todaySaju.fullName}일 (${todaySaju.stem} / ${todaySaju.branch})
- 오늘의 일진 오행: 천간(${todaySaju.stem}) / 지지(${todaySaju.branch}) 오행 기운
- 오늘의 핵심 십신: ${shipsinName} (${shipsinData ? shipsinData.meaning : '일진 작용'})

[사용자의 고민]
${worry || "오늘 하루의 종합적인 운세 흐름과 나아갈 길에 대해 질문합니다."}

답변은 반드시 첫 부분에 아래 JSON 블록(\`\`\`json ... \`\`\`)을 포함하고, 그 바로 뒤에 마크다운 분석 보고서를 이어서 작성하십시오:

\`\`\`json
{
  "headline": "오늘 하루 메인 총평 1줄 (25자 이내)",
  "headlineSub": "일주와 오늘 일진 조화 부연 따뜻한 1~2문장",
  "categories": {
    "wealth": { "score": 85, "summary": "재물운 1줄 요약 (20자 이내)" },
    "love": { "score": 92, "summary": "애정운 1줄 요약 (20자 이내)" },
    "health": { "score": 78, "summary": "건강운 1줄 요약 (20자 이내)" },
    "business": { "score": 90, "summary": "직업운 1줄 요약 (20자 이내)" }
  },
  "timeFlow": {
    "peakText": "상승 시간대 요약",
    "morning": { "desc": "오전 기운 1줄", "stars": "★★★★☆" },
    "afternoon": { "desc": "오후 기운 1줄", "stars": "★★★★★" },
    "evening": { "desc": "저녁 기운 1줄", "stars": "★★★★☆" }
  },
  "luckyItems": {
    "colorName": "행운 색상명",
    "colorHex": "#10B981",
    "number": "행운의 숫자",
    "direction": "행운의 방위"
  },
  "wisdom": "마음에 새길 지혜 1문장"
}
\`\`\`

종합 분석 보고서 작성 지침 (각 섹션별 2~3문장으로 명료하고 품격 있게 작성):
### 1. ${userSaju.fullName}일주 본연의 기질과 오행 생극제화
- 사용자의 ${userSaju.fullName}일주 물상론과 오늘 ${todaySaju.fullName}일(${shipsinName}) 간의 오행 상생/상극 핵심 해설.
### 2. 오늘의 십신 조화와 고민에 대한 조언
- 오늘의 ${shipsinName} 기운과 일주 자좌 십신/12운성이 만난 시너지 및 고민에 대한 명확한 해답.
### 3. 실천적 처세술 및 체질적 건강 지침
- 오늘 실천할 처세 지침 및 일주 체질에 맞는 실질적 건강 조언.`;
}

/**
 * 주역 64괘 및 384효 AI 프롬프트 생성
 */
export function buildIChingPrompt(params: IChingPromptParams): string {
  const { hexagram, lineNumber, lineDetail, lineHanjaText, lineKoreanText, lineModernAdvice, worry } = params;

  return `당신은 주역(I Ching)과 명리학에 정통한 고결한 역학자입니다.
사용자가 직접 점대를 뽑아 조합한 주역 괘의 괘사와 효사 정보를 바탕으로, 사용자의 고민에 대해 깊이 있는 해설과 행동 지침을 조언해 주어야 합니다.
어조는 신뢰감을 주며 따뜻하고 정중한 높임말을 사용하고, 너무 미신적인 단정보다는 지혜로운 조언 형태로 답해주십시오.

[주역 괘 정보]
- 괘 번호: ${hexagram.id}
- 이름: ${hexagram.nameKorean} (${hexagram.nameHanji})
- 괘사 요약: ${hexagram.summary}
- 괘사 의미: ${hexagram.meaning}
- 오늘의 동효 (변화하는 효): ${lineNumber}번째 효 (1: 초효, 2: 이효, 3: 삼효, 4: 사효, 5: 오효, 6: 상효)
- 괘의 부문별 일반 운세: 전체운(${hexagram.generalFate}), 사업운(${hexagram.businessFate}), 연애운(${hexagram.loveFate}), 금전운(${hexagram.wealthFate})

[오늘의 동효 384효 원문 및 해석]
- 동효 명칭: ${lineDetail?.nameHanja || `${lineNumber}효`}
- 효사 한자 원문 (漢字 原文): ${lineHanjaText}
- 효사 한글 풀이: ${lineKoreanText}
${lineModernAdvice ? `- 원전 처세 지침: ${lineModernAdvice}` : ''}

[사용자의 고민]
${worry || "오늘 하루의 종합적인 조언과 기운에 대해 질문합니다."}

답변 작성 시 주의사항:
1. 사용자가 뽑은 **[오늘의 동효]인 ${lineNumber}번째 효의 한자 원문(${lineHanjaText})**을 반드시 상단에 언급하며 친절하게 풀어서 조언해 주세요.
2. 해당 효사가 사용자의 고민에 전하는 구체적인 해설과 행동 지침을 작성해 주세요.
3. 답변은 마크다운(Markdown) 형식으로 작성하여 가독성을 높여주세요. 아래 단계를 포함해 작성해 주세요:
   - 괘에 대한 친절한 설명과 요약
   - 오늘의 동효(${lineNumber}번째 효: **${lineHanjaText}**)의 한자/한글 해석 및 직접적인 조언
   - 전체적인 기운의 흐름(직업, 연애, 재물)과 행동 지침
   - 오늘의 행운을 높여주는 키워드나 마음가짐 제안

주의: 답변이 중간에 뚝 끊기지 않도록 문장을 반드시 완결하고, 마크다운 문법의 끝을 맞춰주십시오.`;
}
