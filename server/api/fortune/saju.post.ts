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
      const cookieTime = Number(lastRequestCookie)
      if (!isNaN(cookieTime)) {
        const timeDiff = now - cookieTime
        if (timeDiff >= 0 && timeDiff < limitDurationMs) {
          const remainingHours = Math.max(1, Math.ceil((limitDurationMs - timeDiff) / (1000 * 60 * 60)))
          throw createError({
            statusCode: 429,
            statusMessage: `최근 12시간 이내에 이미 사주 운세를 확인하셨습니다. 주역/사주는 하루에 한 번 정성껏 확인하는 것이 좋습니다. 약 ${remainingHours}시간 후에 다시 확인해 주세요.`
          })
        }
      }
    }

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
    if (!isDev) {
      try {
        const dbLimit = await prisma.fortuneRateLimit.findFirst({
          where: {
            ip: clientIp,
            type: 'saju',
            createdAt: {
              gte: new Date(now - limitDurationMs)
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        if (dbLimit) {
          const timeDiff = now - dbLimit.createdAt.getTime()
          if (timeDiff >= 0 && timeDiff < limitDurationMs) {
            const remainingHours = Math.max(1, Math.ceil((limitDurationMs - timeDiff) / (1000 * 60 * 60)))
            throw createError({
              statusCode: 429,
              statusMessage: `최근 12시간 이내에 동일한 IP에서 이미 사주 운세를 확인하셨습니다. 약 ${remainingHours}시간 후에 다시 확인해 주세요.`
            })
          }
        }
      } catch (err: any) {
        // Rate limit 에러는 다시 throw
        if (err?.statusCode === 429) throw err
        // DB 연결 에러는 로그만 하고 계속 진행 (Rate limit 우회)
        console.warn('[Rate Limit DB Check] Error, bypassing:', {
          error: err.message,
          ip: clientIp
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

    // 4. DB에서 명리학적 원천 자료 조회 (60일주 데이터 포함)
    let iljuData: any = null
    try {
      iljuData = await prisma.sajuIlju.findFirst({
        where: { ganzhi: userSaju.fullName }
      })

      if (!iljuData) {
        console.warn('[SajuIlju DB Fetch] No data found for:', userSaju.fullName)
      }
    } catch (e: any) {
      console.error('[SajuIlju DB Fetch] Error:', {
        error: e.message,
        code: e.code,
        ganzhi: userSaju.fullName
      })
    }

    let ilganData: any = null
    let shipsinData: any = null
    let iljiData: any = null
    let sijiData: any = null

    try {
      ;[ilganData, shipsinData, iljiData, sijiData] = await Promise.all([
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

      // 데이터 누락 여부 로깅
      if (!ilganData) console.warn('[DB] ilganData not found for stem:', userSaju.stem)
      if (!shipsinData) console.warn('[DB] shipsinData not found for shipsin:', shipsinName)
      if (!iljiData) console.warn('[DB] iljiData not found for branch:', userSaju.branch)
      if (birthHourBranch !== '모름' && !sijiData) {
        console.warn('[DB] sijiData not found for hour branch:', birthHourBranch)
      }
    } catch (dbErr: any) {
      console.error('[DB 원천 데이터 조회] Error:', {
        error: dbErr.message,
        code: dbErr.code,
        stem: userSaju.stem,
        shipsin: shipsinName,
        branch: userSaju.branch
      })
    }

    const iljuRaw: any = iljuData?.rawAnalysis || {}

    // 5. AI 모델 호출 (Claude / Gemini 통합) - 속도 최적화 및 60일주론 명리 프롬프트
    const prompt = `당신은 60일주론과 오행 생극제화에 정통한 고결한 역학자입니다.
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
- 오늘 실천할 처세 지침 및 일주 체질에 맞는 실질적 건강 조언.`

    let { text: rawAiText, isAiGenerated } = await callAiModel(prompt)

    let parsedData: any = null
    let aiInterpretation = ''

    if (isAiGenerated && rawAiText) {
      // 1. 닫힌 코드블록 시도 (```json ... ```)
      const closedMatch = rawAiText.match(/```json\s*([\s\S]*?)\s*```/)
      if (closedMatch && closedMatch[1]) {
        try {
          parsedData = JSON.parse(closedMatch[1])
          aiInterpretation = rawAiText.replace(/```json\s*[\s\S]*?\s*```/, '').trim()
        } catch (e: any) {
          console.warn('[JSON Parse] Closed block failed:', e.message)
        }
      }

      // 2. 닫히지 않은 코드블록 시도 (```json ...)
      if (!parsedData) {
        const unclosedMatch = rawAiText.match(/```json\s*([\s\S]*)/)
        if (unclosedMatch && unclosedMatch[1]) {
          const jsonStr = unclosedMatch[1].split(/^(?=#|###|####|\*\*|\n\n)/m)[0] || ''
          try {
            parsedData = JSON.parse(jsonStr)
            aiInterpretation = rawAiText.replace(/```json\s*[\s\S]*/, '').trim()
          } catch (e: any) {
            console.warn('[JSON Parse] Unclosed block failed:', e.message)
          }
        }
      }

      // 3. 백틱 없이 생성된 생 JSON 시도 ({ "headline": ... })
      if (!parsedData) {
        const rawJsonMatch = rawAiText.match(/^\s*(\{[\s\S]*?\})(?=\s*(\n\n|#|###|####|\*\*|$))/)
        if (rawJsonMatch && rawJsonMatch[1]) {
          try {
            parsedData = JSON.parse(rawJsonMatch[1])
            aiInterpretation = rawAiText.substring(rawJsonMatch[0].length).trim()
          } catch (e: any) {
            console.warn('[JSON Parse] Raw JSON match failed:', e.message)
          }
        }
      }

      // 4. 파싱 실패 시에도 aiInterpretation에 Raw JSON이 섞이지 않도록 방어 정제(Sanitize)
      if (!aiInterpretation || /^\s*\{\s*"headline"/i.test(aiInterpretation)) {
        // Raw JSON 부분(중괄호 쌍 또는 첫 마크다운 헤더 전까지) 제거
        let cleaned = rawAiText.replace(/```json\s*[\s\S]*?\s*```/gi, '').trim()
        if (/^\s*\{/i.test(cleaned)) {
          const lastBraceIdx = cleaned.lastIndexOf('}')
          if (lastBraceIdx !== -1) {
            cleaned = cleaned.substring(lastBraceIdx + 1).trim()
          } else {
            const headerIdx = cleaned.search(/^#+/m)
            cleaned = headerIdx !== -1 ? cleaned.substring(headerIdx).trim() : ''
          }
        }
        aiInterpretation = cleaned
      }

      // 잔여 백틱 및 마크다운 찌꺼기 정리
      aiInterpretation = aiInterpretation
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/g, '')
        .replace(/```$/g, '')
        .trim()
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

    // Rate limit 기록 저장 (성공 시에만)
    if (!isDev) {
      try {
        await prisma.fortuneRateLimit.create({
          data: {
            ip: clientIp,
            type: 'saju'
          }
        })
      } catch (err: any) {
        // 중복 키 에러가 아닌 경우만 로그
        if (err.code !== 'P2002') {
          console.warn('[Rate Limit DB Insert] Error:', {
            error: err.message,
            code: err.code,
            ip: clientIp
          })
        }
      }
    }

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
    // createError로 생성된 에러는 상태 코드 포함
    const statusCode = error.statusCode || 500
    const statusMessage = error.statusMessage || error.message || '서버 오류가 발생했습니다.'

    console.error('[Saju API Error]', {
      statusCode,
      message: statusMessage,
      stack: error.stack
    })

    // Rate limit 에러는 명시적으로 throw하여 Nuxt가 처리하도록
    if (statusCode === 429) {
      throw error
    }

    return {
      success: false,
      error: statusMessage
    }
  }
})
