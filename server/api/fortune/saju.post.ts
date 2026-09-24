import { defineEventHandler, readBody, getCookie, setCookie, getRequestIP, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getGanzhiOfDay, getHourBranch, getShipsin, getGanzhiOfYear } from '../../utils/saju'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) || {}
    const { birthDate, birthTime, gender, worry } = body

    if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: '올바른 생년월일 형식(YYYY-MM-DD)이 아닙니다.'
      })
    }

    // 0. Rate limiting check (Cookie-based & IP-based) - 개발 환경에서는 제한 해제
    const isDev = process.env.NODE_ENV !== 'production'
    const limitDurationMs = 12 * 60 * 60 * 1000 // 12시간 제한
    const cookieName = 'fortune_last_saju'
    const lastRequestCookie = getCookie(event, cookieName)
    const now = Date.now()

    if (!isDev && lastRequestCookie) {
      const timeDiff = now - Number(lastRequestCookie)
      if (timeDiff < limitDurationMs) {
        const remainingHours = Math.ceil((limitDurationMs - timeDiff) / (1000 * 60 * 60))
        throw createError({
          statusCode: 429,
          statusMessage: `최근 12시간 이내에 이미 사주 운세를 확인하셨습니다. 주역/사주는 하루에 한 번 정성껏 확인하는 것이 좋습니다. ${remainingHours}시간 후에 다시 확인해 주세요.`
        })
      }
    }

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
    if (!isDev) {
      const dbLimit = await prisma.fortuneRateLimit.findFirst({
        where: {
          ip: clientIp,
          type: 'saju',
          createdAt: {
            gte: new Date(now - limitDurationMs)
          }
        }
      })

      if (dbLimit) {
        const timeDiff = now - dbLimit.createdAt.getTime()
        const remainingHours = Math.ceil((limitDurationMs - timeDiff) / (1000 * 60 * 60))
        throw createError({
          statusCode: 429,
          statusMessage: `최근 12시간 이내에 동일한 IP에서 이미 사주 운세를 확인하셨습니다. ${remainingHours}시간 후에 다시 확인해 주세요.`
        })
      }
    }

    // 1. 사용자 사주 계산 (일간 및 출생 연도 간지/띠 계산)
    const userSaju = getGanzhiOfDay(birthDate)
    const birthHourBranch = getHourBranch(birthTime)
    const birthYearNum = parseInt(birthDate.split('-')[0] || '2000', 10)
    const userYearSaju = getGanzhiOfYear(birthYearNum)

    // 2. 오늘의 일진 계산 (KST 기준 날짜 계산)
    const nowUtc = new Date().getTime()
    const kstOffset = 9 * 60 * 60 * 1000 // UTC+9
    const todayKst = new Date(nowUtc + kstOffset)
    const todayStr = todayKst.toISOString().split('T')[0] || ''
    const todaySaju = getGanzhiOfDay(todayStr)

    // 3. 일간과 오늘 일진의 십신 관계 계산
    const shipsinName = getShipsin(userSaju.stemIdx, todaySaju.stemIdx)

    // 4. DB에서 명리학적 원천 자료 조회
    const [ilganData, shipsinData, iljiData, sijiData] = await Promise.all([
      prisma.sajuIlgan.findUnique({
        where: { stem: userSaju.stem }
      }),
      prisma.sajuShipsin.findUnique({
        where: { name: shipsinName }
      }),
      prisma.sajuJiji.findUnique({
        where: { name: userSaju.branch }
      }),
      birthHourBranch !== '모름' ? prisma.sajuJiji.findUnique({
        where: { name: birthHourBranch }
      }) : null
    ])

    // 5. AI 모델 호출 (Claude / Gemini 통합)
    const prompt = `당신은 사주명리학(Four Pillars of Destiny)에 정통한 고결한 역학자입니다. 
사용자의 사주 정보와 오늘의 일진 정보, 그리고 이들의 관계성인 '십신(Shipsin)'에 대한 명리학적 텍스트를 바탕으로, 사용자의 고민에 대해 깊이 있는 해설과 행동 지침을 조언해 주어야 합니다.
어조는 신뢰감을 주며 따뜻하고 정중한 높임말을 사용하고, 너무 미신적인 단정보다는 지혜로운 조언 형태로 답해주십시오.

[사용자 사주 정보]
- 성별: ${gender === 'man' ? '남성' : '여성'}
- 태어난 날의 천간(일간): ${userSaju.stem} (${userSaju.fullName}일생)
- 일간 성향: ${ilganData ? ilganData.tendency : '유연하고 다재다능한 성향'}
- 태어난 날의 지지(일지): ${userSaju.branch} ${iljiData ? `(${iljiData.animal}띠 기운 - ${iljiData.description})` : ''}
- 태어난 시간 지지(시지): ${birthHourBranch} ${sijiData ? `(${sijiData.animal}의 시간 - ${sijiData.description})` : ''}

[오늘의 일진 정보]
- 오늘의 일진: ${todaySaju.fullName}일

[명리학적 관계성 (십신)]
- 오늘의 십신: ${shipsinName}
- 십신의 의미와 작용: ${shipsinData ? shipsinData.meaning : '오늘 흐르는 에너지의 일반적인 작용'}

[사용자의 고민]
${worry || "오늘 하루의 종합적인 조언과 기운에 대해 질문합니다."}

답변은 반드시 맨 첫 부분에 아래와 동일한 구조의 JSON 블록(\`\`\`json ... \`\`\`)을 포함하고, 그 바로 뒤에 마크다운 종합 분석 보고서를 이어서 작성해 주십시오:

\`\`\`json
{
  "headline": "오늘 하루를 관통하는 메인 총평 한 줄 (큰따옴표 없이 25자 내외)",
  "headlineSub": "총평을 부연 조언하는 따뜻한 1~2문장",
  "categories": {
    "wealth": { "score": 85, "summary": "재물운 동적 1줄 요약 (20자 이내)" },
    "love": { "score": 92, "summary": "애정운 동적 1줄 요약 (20자 이내)" },
    "health": { "score": 78, "summary": "건강운 동적 1줄 요약 (20자 이내)" },
    "business": { "score": 90, "summary": "직업·학업운 동적 1줄 요약 (20자 이내)" }
  },
  "timeFlow": {
    "peakText": "오늘 가장 상승하는 시간대 요약 (예: 오후가 절정)",
    "morning": { "desc": "오전(08~12시) 기운 1줄 설명", "stars": "★★★★☆" },
    "afternoon": { "desc": "오후(12~18시) 기운 1줄 설명", "stars": "★★★★★" },
    "evening": { "desc": "저녁(18~24시) 기운 1줄 설명", "stars": "★★★★☆" }
  },
  "luckyItems": {
    "colorName": "행운의 색상명 (예: 청록빛 옥색)",
    "colorHex": "해당 색상의 헥사코드 (예: #10B981)",
    "number": "행운의 숫자 (예: 7 과 18)",
    "direction": "행운의 방위 (예: 남동쪽 (풍요))"
  },
  "wisdom": "마음에 새기는 오늘의 지혜/화두 1문장"
}
\`\`\`

종합 분석 보고서 작성 지침:
1. 사용자의 태어난 성향과 오늘 일진과의 조화 요약
2. 고민에 대한 직접적인 조언과 해결책
3. 마크다운의 문두 문법을 정상 적용하고 문장을 명확히 완결해 주세요.`

    let { text: rawAiText, isAiGenerated } = await callAiModel(prompt)

    let parsedData: any = null
    let aiInterpretation = ''

    if (isAiGenerated && rawAiText) {
      // 1. 닫힌 ```json ... ``` 코드블록 파싱 시도
      const closedMatch = rawAiText.match(/```json\s*([\s\S]*?)\s*```/)
      if (closedMatch && closedMatch[1]) {
        try {
          parsedData = JSON.parse(closedMatch[1])
        } catch (e) {
          console.warn('JSON.parse failed on closed block:', e)
        }
        aiInterpretation = rawAiText.replace(/```json\s*[\s\S]*?\s*```/, '').trim()
      } else {
        // 2. 미완성/열린 ```json ... 코드블록 처리
        const unclosedMatch = rawAiText.match(/```json\s*([\s\S]*)/)
        if (unclosedMatch && unclosedMatch[1]) {
          const jsonStr = unclosedMatch[1].split(/^(?=#|###|####|\*\*|\n\n)/m)[0] || ''
          try {
            parsedData = JSON.parse(jsonStr)
          } catch (e) {
            console.warn('JSON.parse failed on unclosed block:', e)
          }
          aiInterpretation = rawAiText.replace(/```json\s*[\s\S]*/, '').trim()
        } else {
          // 3. 순수 JSON 객체 { ... } 로 시작하는 경우
          const rawMatch = rawAiText.match(/^\s*(\{[\s\S]*?\})\s*(\n\n|#|$)/)
          if (rawMatch && rawMatch[1]) {
            try {
              parsedData = JSON.parse(rawMatch[1])
            } catch (e) {
              console.warn('JSON.parse failed on raw object:', e)
            }
            aiInterpretation = rawAiText.replace(/^\s*\{[\s\S]*?\}/, '').trim()
          } else {
            aiInterpretation = rawAiText.trim()
          }
        }
      }

      // 잔여 ``` 마크다운 찌꺼기 완벽 정제
      aiInterpretation = aiInterpretation.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
    }

    if (!isAiGenerated) {
      aiInterpretation = `**[AI 해석 알림]** API 연결에 일시적인 제한이 있어 데이터베이스 원천 자료를 토대로 기본 운세를 해석해 드립니다.

### 나의 일주(日柱): ${userSaju.fullName} (${ilganData?.element} 기운)
* **일간 성향:** ${ilganData?.tendency || '태어난 날의 기운이 깃들어 있습니다.'}
* **일지(${userSaju.branch} - ${iljiData?.animal}) 특징:** ${iljiData?.description || '태어난 지지 기운이 깃들어 있습니다.'}
* 태어난 시간 지지(시지): **${birthHourBranch}시** ${sijiData ? `(${sijiData.animal}의 기운 - ${sijiData.description})` : ''}

### 오늘의 일진과 기운: ${todaySaju.fullName}일 (${shipsinName}의 날)
* **${shipsinName}의 작용:** ${shipsinData?.meaning || '오늘의 기운이 일간에 미치는 영향입니다.'}

*조금 더 상세하고 개인화된 조언을 원하시면 나중에 다시 시도해 주세요.*`
    }

    await prisma.fortuneRateLimit.create({
      data: {
        ip: clientIp,
        type: 'saju'
      }
    })

    setCookie(event, cookieName, String(now), {
      maxAge: 10 * 24 * 60 * 60,
      path: '/'
    })

    return {
      success: true,
      userSaju: {
        birthGanzhi: userSaju.fullName,
        ilgan: userSaju.stem,
        ilganElement: ilganData?.element,
        siji: birthHourBranch,
        yearGanzhi: userYearSaju.fullName,
        animal: userYearSaju.animal,
        zodiacName: userYearSaju.zodiacName,
        birthYear: birthYearNum
      },
      todaySaju: {
        ganzhi: todaySaju.fullName,
        shipsin: shipsinName
      },
      parsedData,
      aiInterpretation,
      isAiGenerated
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message || '서버 오류가 발생했습니다.'
    }
  }
})
