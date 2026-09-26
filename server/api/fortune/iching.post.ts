import fs from 'fs'
import path from 'path'
import { defineEventHandler, readBody, getCookie, setCookie, getRequestIP, createError } from 'h3'
import prisma from '../../utils/prisma'

// 384효 데이터 캐싱 (서버 시작 시 한 번만 로드)
let cachedLines: any[] | null = null

function loadIchingLines(): any[] {
  if (cachedLines !== null) {
    return cachedLines
  }

  try {
    const jsonPath = path.resolve(process.cwd(), 'prisma/iching_384_lines.json')
    if (fs.existsSync(jsonPath)) {
      const rawJson = fs.readFileSync(jsonPath, 'utf8')
      cachedLines = JSON.parse(rawJson)
      console.log('[I Ching] Loaded 384 lines data successfully')
      return cachedLines
    }
  } catch (e: any) {
    console.error('[I Ching] Failed to load 384 lines data:', e.message)
  }

  cachedLines = []
  return cachedLines
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) || {}
    const { worry } = body

    // 0. Rate limiting check (Cookie-based & IP-based) - 개발 환경에서는 제한 해제
    const isDev = process.env.NODE_ENV !== 'production'
    const limitDurationMs = 12 * 60 * 60 * 1000 // 12시간 제한
    const cookieName = 'fortune_last_iching'
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
            statusMessage: `최근 12시간 이내에 이미 주역 괘를 확인하셨습니다. 주역/사주는 하루에 한 번 정성껏 확인하는 것이 좋습니다. 약 ${remainingHours}시간 후에 다시 확인해 주세요.`
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
            type: 'iching',
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
              statusMessage: `최근 12시간 이내에 동일한 IP에서 이미 주역 괘를 확인하셨습니다. 약 ${remainingHours}시간 후에 다시 확인해 주세요.`
            })
          }
        }
      } catch (err: any) {
        // Rate limit 에러는 다시 throw
        if (err?.statusCode === 429) throw err
        // DB 연결 에러는 로그만 하고 계속 진행
        console.warn('[Rate Limit DB Check] Error, bypassing:', {
          error: err.message,
          ip: clientIp
        })
      }
    }

    const hexagramId = Number(body.hexagramId) || Math.floor(Math.random() * 64) + 1
    const lineNumber = Number(body.lineNumber) || Math.floor(Math.random() * 6) + 1

    const hexagram = await prisma.iChingHexagram.findUnique({
      where: { id: hexagramId }
    })

    if (!hexagram) {
      throw createError({
        statusCode: 404,
        statusMessage: '주역 괘 데이터를 찾을 수 없습니다.'
      })
    }

    // 384효(爻) 원문 데이터 로드 (캐싱된 데이터 사용)
    const allLines = loadIchingLines()
    const lineDetail = allLines.find((l: any) => l.hexagramId === hexagramId && l.lineNumber === lineNumber)

    const lineHanjaText = lineDetail?.textHanja || `${hexagram.nameHanji} ${lineNumber}爻`
    const lineKoreanText = lineDetail?.textKorean || `${lineNumber}번째 효사 기운`
    const lineModernAdvice = lineDetail?.modernAdvice || ''

    // 5. AI 모델 호출 (Claude / Gemini 통합)
    const prompt = `당신은 주역(I Ching)과 명리학에 정통한 고결한 역학자입니다.
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

주의: 답변이 중간에 뚝 끊기지 않도록 문장을 반드시 완결하고, 마크다운 문법의 끝을 맞춰주십시오.`

    let { text: rawAiText, isAiGenerated } = await callAiModel(prompt)
    let aiInterpretation = rawAiText || ''

    if (isAiGenerated && aiInterpretation) {
      aiInterpretation = aiInterpretation
        .replace(/```json\s*[\s\S]*?\s*```/gi, '')
        .replace(/```json\s*[\s\S]*/gi, '')
        .replace(/^```json\s*/gi, '')
        .replace(/^```\s*/g, '')
        .replace(/```$/g, '')
        .trim()
    }

    if (!isAiGenerated) {
      aiInterpretation = `**[AI 해석 알림]** API 연결에 일시적인 제한이 있어 데이터베이스 원천 자료를 토대로 해석을 제공합니다.

### 괘의 의미: ${hexagram.nameKorean} (${hexagram.nameHanji}) - ${hexagram.summary}
* **기본 해설:** ${hexagram.meaning}
* **오늘의 동효:** **${lineNumber}번째 효**가 움직였습니다.
* **오늘의 운세 흐름:** ${hexagram.generalFate}

### 부문별 조언
* **사업/직업:** ${hexagram.businessFate}
* **연애/결혼:** ${hexagram.loveFate}
* **재물/금전:** ${hexagram.wealthFate}

*조금 더 상세하고 개인화된 조언을 원하시면 나중에 다시 시도해 주세요.*`
    }

    // Rate limit 기록 저장
    if (!isDev) {
      try {
        await prisma.fortuneRateLimit.create({
          data: {
            ip: clientIp,
            type: 'iching'
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
      hexagram: {
        id: hexagram.id,
        nameHanji: hexagram.nameHanji,
        nameKorean: hexagram.nameKorean,
        summary: hexagram.summary,
        meaning: hexagram.meaning,
        generalFate: hexagram.generalFate,
        businessFate: hexagram.businessFate,
        loveFate: hexagram.loveFate,
        wealthFate: hexagram.wealthFate,
        lineNumber,
        lineHanja: lineHanjaText,
        lineKorean: lineKoreanText,
        lineAdvice: lineModernAdvice
      },
      aiInterpretation,
      isAiGenerated
    }

  } catch (error: any) {
    // createError로 생성된 에러는 상태 코드 포함
    const statusCode = error.statusCode || 500
    const statusMessage = error.statusMessage || error.message || '서버 오류가 발생했습니다.'

    console.error('[I Ching API Error]', {
      statusCode,
      message: statusMessage,
      stack: error.stack
    })

    // Rate limit 에러는 명시적으로 throw
    if (statusCode === 429) {
      throw error
    }

    return {
      success: false,
      error: statusMessage
    }
  }
})
