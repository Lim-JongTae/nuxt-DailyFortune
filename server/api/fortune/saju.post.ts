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

    // 5. Gemini API 호출 준비
    const geminiApiKey = process.env.GEMINI_API_KEY

    let aiInterpretation = ''
    let isAiGenerated = false

    if (geminiApiKey) {
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

답변은 마크다운(Markdown) 형식으로 작성하여 가독성을 높여주세요. 아래 단계를 포함해 작성해 주세요:
1. 사용자의 태어난 성향(일간 및 일지/지간 조화)에 대한 격려와 오늘 일진과의 조화 요약
2. 고민에 대한 직접적인 조언과 해결책 (오늘 흐르는 십신의 작용과 엮어서 자연스럽게 풀어주세요)
3. 오늘의 종합 운세 점수 (0~100점) 및 행운을 높여주는 키워드(예: 행운의 색상, 행운의 방향, 마음가짐) 제안

주의: 답변이 중간에 뚝 끊기지 않도록 문장을 반드시 완결하고, 마크다운 문법의 끝을 맞춰주십시오.`

      try {
        const response: any = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          body: {
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192
            }
          }
        })

        if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiInterpretation = response.candidates[0].content.parts[0].text
          isAiGenerated = true
        }
      } catch (apiError) {
        console.error('Gemini API Error (Saju):', apiError)
      }
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
