import { defineEventHandler, readBody, getCookie, setCookie, getRequestIP, createError } from 'h3'
import prisma from '../../utils/prisma'
import { calculateSajuCompatibility, type PersonSajuInput } from '../../utils/sajuMatch'
import { callAiModel } from '../../utils/ai'

export default defineEventHandler(async (event) => {
  const requestId = `match_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  console.log(`[${requestId}] Saju Match API Request Started`, {
    timestamp: new Date().toISOString(),
    ip: getRequestIP(event, { xForwardedFor: true })
  })

  try {
    const body = await readBody(event) || {}
    const { person1, person2, relationType = 'lover' } = body

    if (!person1?.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(person1.birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: '본인의 올바른 생년월일 형식(YYYY-MM-DD)을 입력해 주세요.'
      })
    }

    if (!person2?.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(person2.birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: '상대방의 올바른 생년월일 형식(YYYY-MM-DD)을 입력해 주세요.'
      })
    }

    // 0. Rate limiting 검증 (Cookie & DB IP 기반) - 12시간 제한
    const isDev = process.env.NODE_ENV !== 'production'
    const limitDurationMs = 12 * 60 * 60 * 1000 // 12시간
    const cookieName = 'fortune_last_match'
    const lastRequestCookie = getCookie(event, cookieName)
    const now = Date.now()

    const getKstDateStr = (ts: number): string => {
      return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date(ts))
    }
    const todayKstStr = getKstDateStr(now)

    // 1) 쿠키 검증
    if (!isDev && lastRequestCookie) {
      const cookieTime = Number(lastRequestCookie)
      if (!isNaN(cookieTime)) {
        const cookieKstDate = getKstDateStr(cookieTime)
        const isSameDate = cookieKstDate === todayKstStr
        const timeDiff = now - cookieTime

        if (isSameDate && timeDiff >= 0 && timeDiff < limitDurationMs) {
          const remainingHours = Math.max(1, Math.ceil((limitDurationMs - timeDiff) / (1000 * 60 * 60)))
          throw createError({
            statusCode: 429,
            statusMessage: `최근 12시간 이내에 이미 궁합 운세를 확인하셨습니다. 약 ${remainingHours}시간 후에 다시 확인해 주세요.`
          })
        }
      }
    }

    // 2) DB IP 검증
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
    if (!isDev) {
      try {
        const startOfTodayKst = new Date(new Date(now + 9 * 60 * 60 * 1000).setUTCHours(0, 0, 0, 0) - 9 * 60 * 60 * 1000)
        await prisma.fortuneRateLimit.deleteMany({
          where: {
            type: 'match',
            createdAt: { lt: startOfTodayKst }
          }
        })

        const dbLimit = await prisma.fortuneRateLimit.findFirst({
          where: {
            ip: clientIp,
            type: 'match',
            createdAt: { gte: new Date(now - limitDurationMs) }
          },
          orderBy: { createdAt: 'desc' }
        })

        if (dbLimit) {
          const dbKstDate = getKstDateStr(dbLimit.createdAt.getTime())
          const isSameDate = dbKstDate === todayKstStr
          const timeDiff = now - dbLimit.createdAt.getTime()

          if (isSameDate && timeDiff >= 0 && timeDiff < limitDurationMs) {
            const remainingHours = Math.max(1, Math.ceil((limitDurationMs - timeDiff) / (1000 * 60 * 60)))
            throw createError({
              statusCode: 429,
              statusMessage: `최근 12시간 이내에 동일한 IP에서 이미 궁합을 확인하셨습니다. 약 ${remainingHours}시간 후에 다시 확인해 주세요.`
            })
          }
        }
      } catch (err: any) {
        if (err?.statusCode === 429) throw err
        console.warn('[Match Rate Limit] DB check bypassed:', err?.message)
      }
    }

    // 1. 4대 정통 명리학 궁합 알고리즘 연산
    const p1Input: PersonSajuInput = {
      name: person1.name || '본인',
      birthDate: person1.birthDate,
      birthTime: person1.birthTime,
      gender: person1.gender || 'man'
    }

    const p2Input: PersonSajuInput = {
      name: person2.name || '상대방',
      birthDate: person2.birthDate,
      birthTime: person2.birthTime,
      gender: person2.gender || 'woman'
    }

    const compResult = calculateSajuCompatibility(p1Input, p2Input, relationType)

    // 2. AI 리포트 생성용 프롬프트 빌드 (팩트 주입 및 관계 유형별 특화)
    const relationNameMap: Record<string, string> = {
      lover: '연인 (연애)',
      some: '관계 (호감 / 짝사랑 / 썸)',
      couple: '부부 (결혼 생활)',
      friend: '친구 / 동업 파트너'
    }
    const relText = relationNameMap[relationType] || '연인'

    // 관계 유형별 맞춤 지침 및 4번 챕터 제목 분기
    let relationGuidelines = '두 사람은 사랑을 가꾸어 가는 "연인" 관계입니다. 감정적 교감과 애정 표현, 생활 속 데이트 케미스트리, 갈등 예방과 신뢰 구축을 중점적으로 다루십시오.'
    let section4Title = '두 사람을 위한 행운의 데이트 & 시너지 조언'
    let section4Tips = '서로의 부족한 오행을 채워주는 추천 활동/장소/분위기와 관계의 온도를 지켜줄 명리적 덕담'

    if (relationType === 'couple') {
      relationGuidelines = '두 사람은 법적·현실적 가정을 꾸린 "부부" 관계입니다. 살림과 일상의 호흡, 재정 및 가치관 조율, 권태기 극복과 백년해로를 위한 현실적 화합 처세를 중점적으로 다루십시오.'
      section4Title = '슬기로운 부부 생활과 가정의 화합을 위한 시너지 처세'
      section4Tips = '가정의 평화와 지속 가능한 행복을 위해 부족한 오행을 채워주는 생활 습관 및 부부 대화 솔루션'
    } else if (relationType === 'some') {
      relationGuidelines = '두 사람은 아직 연인으로 확정되지 않은 "호감 / 짝사랑 / 썸" 관계입니다. 상대방의 마음을 여는 대화법, 호감 신호 확인법, 조급함을 피하고 자연스럽게 연인으로 발전하기 위한 다가서기를 중점적으로 다루십시오.'
      section4Title = '호감에서 인연으로 발전하기 위한 행운의 타이밍과 조언'
      section4Tips = '서로의 마음의 문을 열어줄 부담 없는 만남 장소, 분위기 및 추천 대화 주제'
    } else if (relationType === 'friend') {
      relationGuidelines = '두 사람은 "친구 또는 사업/동업 파트너" 관계입니다. 연애 감정이 아닌 인간적인 신뢰, 의리, 동업 시의 역할 분담과 금전·이해관계 조율, 동반자적 시너지를 중점적으로 다루십시오.'
      section4Title = '두 사람의 성공적 파트너십과 오랜 우정을 위한 시너지 조언'
      section4Tips = '함께 일하거나 교류할 때 상호 보완을 이룰 수 있는 역할 분담 및 시너지 극대화 방안'
    }

    const prompt = `당신은 60일주론과 정통 명리학(천간합·지지합충·오행상생상극)에 정통한 고결한 역학자입니다.
아래 산출된 두 사람의 정밀한 사주명리 팩트 데이터와 관계 유형을 바탕으로, 깊이 있고 품격 넘치는 '2인 사주명리 궁합 리포트'를 작성해 주십시오.
장황하고 허황된 미신적 수식어는 배제하고, 두 사람이 서로의 다름을 이해하고 아름다운 관계를 가꾸어 갈 수 있도록 실질적이고 따뜻한 처세 솔루션을 제시하십시오.

[관계 유형 및 분석 지침]
- 관계 유형: ${relText}
- 특화 지침: ${relationGuidelines}

${compResult.factSummaryText}

답변은 반드시 첫 부분에 아래 JSON 블록(\`\`\`json ... \`\`\`)을 포함하고, 그 바로 뒤에 마크다운 분석 보고서를 작성하십시오:

\`\`\`json
{
  "headline": "두 사람의 케미스트리 핵심을 관통하는 한 줄 타이틀 (25자 이내)",
  "tags": ["#핵심키워드1", "#핵심키워드2", "#핵심키워드3"],
  "summary": "종합 궁합 총평 (2~3문장)",
  "categories": {
    "mental": { "score": ${compResult.indicators.stemHarmony.score * 4}, "summary": "정신적 교감 및 가치관 일치 1줄 요약" },
    "reality": { "score": Math.round(compResult.indicators.branchHarmony.score * 3.33), "summary": "일상 생활 및 현실적 조화 1줄 요약" },
    "conflict": { "score": Math.round(compResult.indicators.iljuMatch.score * 5), "summary": "갈등 예방 및 소통의 열쇠 1줄 요약" },
    "dating": { "score": ${compResult.indicators.elementSynergy.score * 4}, "summary": "에너지 시너지 및 맞춤 조언 1줄 요약" }
  }
}
\`\`\`

### 1. 첫인상과 정신적 교감 (마음 궁합)
- 두 사람의 일간(천간) 관계와 첫인상에서의 끌림
- 서로의 생각과 감정을 공유할 때 나타나는 특징

### 2. 일상 속 케미스트리와 현실적 조화 (생활 궁합)
- 일지(지지)와 60일주가 보여주는 생활 습관, 소통 방식 및 현실적 호흡
- 함께할 때 편안함을 느끼는 지점과 시너지

### 3. 갈등 예방과 슬기로운 화해법 (처세 솔루션)
- 충돌이나 오해가 생기기 쉬운 지점 (지지 충·원진 및 오행 편중 분석)
- 갈등 발생 시 절대 하지 말아야 할 말/행동과 가장 효과적인 대화법

### 4. ${section4Title}
- ${section4Tips}`.trim()

    // 3. AI 모델 호출
    let aiResponseText = ''
    let isAiGenerated = false

    try {
      const aiRes = await callAiModel(prompt, 'match')
      if (aiRes && aiRes.text) {
        aiResponseText = aiRes.text
        isAiGenerated = aiRes.isAiGenerated
      }
    } catch (aiErr: any) {
      console.warn('[Match API] AI Generation error, using structured fallback:', aiErr?.message)
    }

    // 4. JSON 파싱 및 데이터 정제
    let parsedData: any = {
      headline: `${compResult.tier.level} - ${compResult.tier.summary}`,
      tags: ['#정통명리궁합', `#${compResult.person1.dayGanzhi}일주`, `#${compResult.person2.dayGanzhi}일주`],
      summary: compResult.tier.summary,
      categories: {
        mental: { score: compResult.indicators.stemHarmony.score * 4, summary: compResult.indicators.stemHarmony.description },
        reality: { score: Math.round(compResult.indicators.branchHarmony.score * 3.33), summary: compResult.indicators.branchHarmony.description },
        conflict: { score: Math.round(compResult.indicators.iljuMatch.score * 5), summary: compResult.indicators.iljuMatch.advice },
        dating: { score: compResult.indicators.elementSynergy.score * 4, summary: compResult.indicators.elementSynergy.description }
      }
    }

    let markdownReport = ''

    if (aiResponseText) {
      const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsed = JSON.parse(jsonMatch[1])
          parsedData = { ...parsedData, ...parsed }
          markdownReport = aiResponseText.replace(/```json[\s\S]*?```/, '').trim()
        } catch (e) {
          console.warn('[Match API] Failed to parse AI JSON block:', e)
          markdownReport = aiResponseText.trim()
        }
      } else {
        markdownReport = aiResponseText.trim()
      }
    }

    // AI 리포트가 없는 경우 정통 팩트 기반 정밀 보고서 조립 (100% 자체 DB 데이터 기반)
    if (!markdownReport) {
      const p1Advice = compResult.person1.iljuData?.romanceAdvice ? `\n- ${compResult.person1.name}님 성향: ${compResult.person1.iljuData.romanceAdvice}` : ''
      const p2Advice = compResult.person2.iljuData?.romanceAdvice ? `\n- ${compResult.person2.name}님 성향: ${compResult.person2.iljuData.romanceAdvice}` : ''

      markdownReport = `
### 1. 첫인상과 정신적 교감 (마음 궁합)
${compResult.person1.name}님(${compResult.person1.yearGanzhi}생)의 **${compResult.person1.dayGanzhi}일주**와 ${compResult.person2.name}님(${compResult.person2.yearGanzhi}생)의 **${compResult.person2.dayGanzhi}일주**는 천간에서 **${compResult.indicators.stemHarmony.relation}**의 기운을 이룹니다.
${compResult.indicators.stemHarmony.description} 서로의 존재만으로도 든든한 정신적 버팀목이 되어 줍니다.

### 2. 일상 속 케미스트리와 현실적 조화 (생활 궁합)
지지에서는 **${compResult.indicators.branchHarmony.relationName}**의 결합을 보입니다.
${compResult.indicators.branchHarmony.description} 생활 리듬과 현실적인 가치관에서 서로를 깊이 이해하고 존중할 수 있는 토대가 마련되어 있습니다.

### 3. 갈등 예방과 슬기로운 화해법 (처세 솔루션)
두 사람의 관계에서 가장 중요한 처세는 **'다름의 인정과 경청'**입니다.
${compResult.indicators.iljuMatch.advice}${p1Advice}${p2Advice}
의견 차이가 생겼을 때는 즉각적인 반박보다는 상대방의 입장을 먼저 한 템포 수용해 주는 여유가 두 분의 신뢰를 배가시킵니다.

### 4. 두 사람을 위한 행운의 데이트 & 시너지 조언
${compResult.indicators.elementSynergy.description}
주말이나 특별한 날에는 탁 트인 자연이나 아늑한 온기를 느낄 수 있는 공간에서 깊은 대화를 나누어 보세요. 서로에게 더없이 따뜻한 행운의 에너지가 샘솟을 것입니다.
`.trim()
    }

    // 5. 성공 기록 (쿠키 및 DB IP)
    if (!isDev) {
      setCookie(event, cookieName, String(now), {
        maxAge: 12 * 60 * 60,
        path: '/',
        httpOnly: true,
        sameSite: 'lax'
      })

      try {
        await prisma.fortuneRateLimit.create({
          data: {
            ip: clientIp,
            type: 'match'
          }
        })
      } catch (rateErr: any) {
        console.warn('[Match API] Rate limit record failed:', rateErr?.message)
      }
    }

    return {
      success: true,
      compatibility: {
        score: compResult.score,
        tier: compResult.tier,
        person1: compResult.person1,
        person2: compResult.person2,
        relationType,
        indicators: compResult.indicators
      },
      parsedData,
      aiInterpretation: markdownReport,
      isAiGenerated
    }
  } catch (error: any) {
    console.error(`[${requestId}] Saju Match API Error:`, error)
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: error.message || '궁합 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    })
  }
})
