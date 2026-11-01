import { defineEventHandler, readBody, getCookie, setCookie, getRequestIP, createError } from 'h3'
import prisma from '../../utils/prisma'
import { getGanzhiOfDay, getHourBranch, getShipsin, getGanzhiOfYear } from '../../utils/saju'
import { recordSajuView } from '../../utils/stats'

export default defineEventHandler(async (event) => {
  const requestId = `saju_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  console.log(`[${requestId}] Saju API Request Started`, {
    timestamp: new Date().toISOString(),
    ip: getRequestIP(event, { xForwardedFor: true }),
    env: process.env.NODE_ENV
  })

  try {
    const body = await readBody(event) || {}
    const { birthDate, birthTime, gender, worry, fortuneType = 'daily' } = body
    const isNewYearFortune = fortuneType === 'newyear'

    console.log(`[${requestId}] Request body received`, {
      birthDate,
      birthTime: birthTime ? '***' : undefined,
      gender,
      hasWorry: !!worry,
      fortuneType
    })

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

    const getKstDateStr = (ts: number): string => {
      return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date(ts))
    }
    const todayKstStr = getKstDateStr(now)

    // 1) 쿠키 검증: KST 기준 날짜가 변경되었으면 무조건 허가, 동일 날짜 내에서만 12시간 이내 차단
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
            statusMessage: `최근 12시간 이내에 이미 사주 운세를 확인하셨습니다. 주역/사주는 하루에 한 번 정성껏 확인하는 것이 좋습니다. 약 ${remainingHours}시간 후에 다시 확인해 주세요.`
          })
        }
      }
    }

    // 2) DB IP 검증: 오늘 이전의 오래된 제한 데이터는 자동 삭제 청소하고, 동일 날짜 내에서 12시간 미만인 경우만 차단
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
    if (!isDev) {
      try {
        // 오늘 자정 KST 기준 시각
        const startOfTodayKst = new Date(new Date(now + 9 * 60 * 60 * 1000).setUTCHours(0, 0, 0, 0) - 9 * 60 * 60 * 1000)

        // 날짜가 지난 이전 제한 데이터 자동 삭제 (DB 정리)
        await prisma.fortuneRateLimit.deleteMany({
          where: {
            type: 'saju',
            createdAt: {
              lt: startOfTodayKst
            }
          }
        })

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
          const dbKstDate = getKstDateStr(dbLimit.createdAt.getTime())
          const isSameDate = dbKstDate === todayKstStr
          const timeDiff = now - dbLimit.createdAt.getTime()

          if (isSameDate && timeDiff >= 0 && timeDiff < limitDurationMs) {
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

    // 2027 정미년(丁未年) 기준 역학 분석 (삼재 및 합충)
    const samjaeZodiacs = ['뱀', '닭', '소']
    const isSamjae = samjaeZodiacs.includes(userYearSaju.animal)
    const samjaeType = isSamjae ? '날삼재(出三災)' : '삼재 비해당'
    const isYukhab = userYearSaju.animal === '말'
    const isSamhab = ['토끼', '돼지'].includes(userYearSaju.animal)
    const isChung = userYearSaju.animal === '소'

    // 2. 오늘의 일진 계산 (KST 기준 날짜 계산)
    const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())
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

    console.log(`[${requestId}] DB queries completed, calling AI model`)

    // 5. AI 모델 호출 (Claude / Gemini 통합) - 속도 최적화 및 60일주론 명리 프롬프트 (신년운세 vs 일일운세 분기)
    const prompt = isNewYearFortune
      ? `당신은 60일주론과 연운(歲運) 생극제화, 삼합·육합·삼재에 정통한 최고 권위의 동양역학 명리학자입니다.
2027년 정미년(丁未年 - 천간 丁화 음화 / 지지 未토 조토, 붉은 양의 해)을 맞이하여, 사용자의 사주팔자(생년월일시)와 2027년 세운 간의 1년 종합 신년운세 보고서를 작성하십시오. 일일운세(오늘 하루/시간대) 언급은 일체 배제하고, 반드시 2027년 1년 12개월 관점에서 품격 있고 실전적인 통찰을 제공하십시오.

[사용자 사주 원국 정보]
- 일주(본원): ${userSaju.fullName}일주 ${iljuData?.ganzhiHanja ? `(${iljuData.ganzhiHanja})` : ''} [육십갑자 ${iljuData?.order || ''}번]
- 천간/지지 오행: 천간 ${iljuData?.stemElement || userSaju.stem} / 지지 ${iljuData?.branchElement || userSaju.branch}
- 출생 연도 및 띠: ${birthYearNum}년생 ${userYearSaju.fullName}년 (${userYearSaju.zodiacName})
- 태어난 시간: ${birthHourBranch}시
- 일주 물상 및 본연 기질: ${iljuRaw.mulsang || iljuData?.character || '자연의 신비로운 기운을 머금은 상'}

[2027년 정미년(丁未年) 세운 역학 매칭]
- 세운: 2027년 정미년(丁未年 - 붉은 양의 해, 丁화·未토)
- 삼재 분석: ${isSamjae ? `${userYearSaju.zodiacName}는 2027년이 3년 삼재의 마지막인 '날삼재(出三災)'에 해당합니다. 묵은 액운이 빠져나가는 길목이므로 이별수와 재물 손실을 막는 피흉추길 조언이 필수입니다.` : `${userYearSaju.zodiacName}는 2027년 삼재에 해당하지 않아 운세가 안정적입니다.`}
- 합충(合沖) 분석: ${isYukhab ? '오미(午未) 육합 형성으로 최고의 귀인운과 문서합 대운' : isSamhab ? '해묘미(亥卯未) 삼합 형성으로 재물과 확장의 대길 대운' : isChung ? '축미(丑未) 충 형성으로 직장, 거주지, 활동 무대의 커다란 변화와 이동수' : '정미년 세운과의 조화로운 기운 교류'}

[사용자의 신년 고민 및 소망]
${worry || "2027년 정미년 한 해의 총운과 재물, 커리어, 건강, 인간관계의 흐름에 대해 묻습니다."}

답변은 반드시 첫 부분에 아래 JSON 블록(\`\`\`json ... \`\`\`)을 포함하고, 그 바로 뒤에 마크다운 분석 보고서를 이어서 작성하십시오:

\`\`\`json
{
  "headline": "2027년 정미년 1년 총운 메인 핵심 한 줄 (25자 이내)",
  "headlineSub": "정미년 세운과 일주의 조화를 요약한 따뜻한 1~2문장",
  "yearScore": 88,
  "samjaeStatus": {
    "isSamjae": ${isSamjae},
    "type": "${samjaeType}",
    "advice": "삼재 관련 핵심 처세 조언 1문장"
  },
  "categories": {
    "wealth": { "score": 85, "summary": "1년 재물·자산운 1줄 요약 (20자 이내)" },
    "business": { "score": 88, "summary": "1년 직업·승진·이직운 1줄 요약 (20자 이내)" },
    "love": { "score": 80, "summary": "1년 애정·인연·가정운 1줄 요약 (20자 이내)" },
    "health": { "score": 75, "summary": "1년 건강·사고방비 1줄 요약 (20자 이내)" }
  },
  "bestMonths": [
    { "month": "2027년 상반기 기회의 달", "reason": "이 달에 가장 운이 트이는 이유" },
    { "month": "2027년 하반기 결실의 달", "reason": "이 달에 성취하기 좋은 분야" }
  ],
  "luckyItems": {
    "colorName": "2027년 1년 수호 색상",
    "colorHex": "#D97706",
    "number": "행운의 숫자",
    "direction": "2027년 길한 방위"
  },
  "wisdom": "2027년 정미년을 관통하는 피흉추길의 한 줄 지혜"
}
\`\`\`

종합 신년 분석 보고서 작성 지침 (각 섹션별 2~3문장으로 명료하고 품격 있게 작성):
### 1. 2027년 정미년(丁未年) 붉은 양의 해 총운
- ${userSaju.fullName}일주와 2027년 丁未 세운 간의 오행 생극제화 및 1년 전체의 큰 흐름 해설.
### 2. 2027년 삼재(날삼재) 및 합충(合沖) 정밀 진단
- ${userYearSaju.zodiacName}의 ${samjaeType} 영향력과 ${isYukhab ? '육합 대운' : isSamhab ? '삼합 대운' : isChung ? '충극 변화' : '세운 조화'} 기운을 극대화하는 방비책.
### 3. 상반기 vs 하반기 흐름과 황금 대운의 달
- 상반기(1~6월)와 하반기(7~12월)의 기운 전환점 및 추천하는 기회의 달 활용법.
### 4. 분야별(재물·직업·애정·건강) 실전 처세 비결
- 재물, 직업, 애정, 건강 4대 영역에서 정미년 한 해 동안 실천할 구체적인 행동 지침.`
      : `당신은 60일주론과 오행 생극제화에 정통한 고결한 역학자입니다.
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
    "love": { "score": 68, "summary": "애정운 1줄 요약 (20자 이내)" },
    "health": { "score": 75, "summary": "건강운 1줄 요약 (20자 이내)" },
    "business": { "score": 88, "summary": "직업운 1줄 요약 (20자 이내)" }
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

    console.log(`[${requestId}] Calling AI model with prompt length: ${prompt.length}`)
    const aiStartTime = Date.now()

    let { text: rawAiText, isAiGenerated } = await callAiModel(prompt, 'saju')

    const aiElapsed = Date.now() - aiStartTime
    console.log(`[${requestId}] AI model response received`, {
      elapsed: `${aiElapsed}ms`,
      isAiGenerated,
      textLength: rawAiText?.length || 0
    })

    let parsedData: any = null
    let aiInterpretation = ''

    if (isAiGenerated && rawAiText) {
      // Helper: 안전한 JSON 파싱 (후행 쉼표 및 주석 제거 지원)
      const tryParseJson = (rawStr: string) => {
        if (!rawStr) return null
        let s = rawStr.trim()
        try {
          return JSON.parse(s)
        } catch {}
        try {
          s = s
            .replace(/^\uFEFF/, '')
            .replace(/\/\/[^\n]*/g, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/,\s*([}\]])/g, '$1')
          return JSON.parse(s)
        } catch {}
        return null
      }

      // 1. 코드블록 시도 (```json ... ``` 또는 ``` ... ```)
      const codeBlockMatch = rawAiText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
      if (codeBlockMatch && codeBlockMatch[1]) {
        parsedData = tryParseJson(codeBlockMatch[1])
        if (parsedData) {
          aiInterpretation = rawAiText.replace(/```(?:json)?\s*[\s\S]*?\s*```/i, '').trim()
        }
      }

      // 2. 닫히지 않은 코드블록 시도 (```json ...)
      if (!parsedData) {
        const unclosedMatch = rawAiText.match(/```(?:json)?\s*([\s\S]*)/i)
        if (unclosedMatch && unclosedMatch[1]) {
          const jsonStr = unclosedMatch[1].split(/^(?=#|###|####|\*\*|\n\n)/m)[0] || ''
          parsedData = tryParseJson(jsonStr)
          if (parsedData) {
            aiInterpretation = rawAiText.replace(/```(?:json)?\s*[\s\S]*/i, '').trim()
          }
        }
      }

      // 3. 백틱 없이 생성된 생 JSON 시도 ({ ... })
      if (!parsedData) {
        const firstBrace = rawAiText.indexOf('{')
        if (firstBrace !== -1) {
          const headerMatch = rawAiText.search(/\n\s*#{1,4}\s/)
          const searchRange = headerMatch !== -1 ? rawAiText.substring(0, headerMatch) : rawAiText
          const lastBrace = searchRange.lastIndexOf('}')
          if (lastBrace > firstBrace) {
            const potentialJson = searchRange.substring(firstBrace, lastBrace + 1)
            parsedData = tryParseJson(potentialJson)
            if (parsedData) {
              aiInterpretation = rawAiText.substring(lastBrace + 1).trim()
            }
          }
        }
      }

      // 파싱된 데이터 구조 정규화 (LLM 응답 키/구조 변형 방어)
      if (parsedData) {
        if (!parsedData.headline && parsedData.title) {
          parsedData.headline = parsedData.title
        }

        if (!parsedData.categories && parsedData.category) {
          parsedData.categories = parsedData.category
        }
        if (!parsedData.categories && (parsedData.wealth || parsedData['재물운'] || parsedData.scores)) {
          parsedData.categories = parsedData.scores || {
            wealth: parsedData.wealth || parsedData['재물운'],
            love: parsedData.love || parsedData['애정운'],
            health: parsedData.health || parsedData['건강운'],
            business: parsedData.business || parsedData.career || parsedData['직업운']
          }
        }

        if (parsedData.categories) {
          const cats = parsedData.categories
          if (cats['재물운'] && !cats.wealth) cats.wealth = cats['재물운']
          if (cats['재물'] && !cats.wealth) cats.wealth = cats['재물']
          if (cats['애정운'] && !cats.love) cats.love = cats['애정운']
          if (cats['애정'] && !cats.love) cats.love = cats['애정']
          if (cats['건강운'] && !cats.health) cats.health = cats['건강운']
          if (cats['건강'] && !cats.health) cats.health = cats['건강']
          if (cats['직업운'] && !cats.business) cats.business = cats['직업운']
          if (cats['사업운'] && !cats.business) cats.business = cats['사업운']
          if (cats['직업'] && !cats.business) cats.business = cats['직업']

          for (const k of ['wealth', 'love', 'health', 'business'] as const) {
            const item = cats[k]
            if (item !== undefined && item !== null) {
              if (typeof item === 'number' || typeof item === 'string') {
                cats[k] = { score: parseInt(String(item), 10) || 75, summary: '' }
              } else if (typeof item === 'object') {
                const num = parseInt(String(item.score), 10)
                cats[k].score = isNaN(num) ? undefined : num
                cats[k].summary = String(item.summary || '')
              }
            }
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

      // 잔여 백틱 및 쉼표/마크다운 찌꺼기 완벽 정리
      aiInterpretation = aiInterpretation
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/g, '')
        .replace(/```$/g, '')
        .replace(/^[\s,`]+/g, '')
        .replace(/[\s,`]+$/g, '')
        .trim()

      // 정제된 마크다운 텍스트의 유효성 검사 (50자 미만이면 AI 생성 실패로 간주하고 Fallback 템플릿 사용)
      if (!aiInterpretation || aiInterpretation.length < 50) {
        console.warn('[Saju API] aiInterpretation too short or invalid after sanitize, triggering fallback template')
        isAiGenerated = false
      }
    }

    if (!isAiGenerated) {
      if (isNewYearFortune) {
        aiInterpretation = `**[AI 해석 알림]** 일시적으로 원천 명리 데이터를 기반으로 2027 정미년 신년 세운을 안내해 드립니다.

### 나의 일주(日柱): ${userSaju.fullName} (${ilganData?.element} 기운) & ${userYearSaju.zodiacName}
* **2027 정미년(丁未年) 세운:** 천간 丁화(음화)와 지지 未토(음토)의 붉은 양의 해
* **삼재 진단:** ${isSamjae ? `${userYearSaju.zodiacName}는 2027년이 '날삼재(出三災)'입니다. 3년 삼재의 마무리를 맞아 신중한 처세와 자산 관리가 길합니다.` : `${userYearSaju.zodiacName}는 2027년 삼재에 해당하지 않아 평안한 흐름입니다.`}
* **합충 기운:** ${isYukhab ? '오미(午未) 육합으로 귀인운과 인연 합운이 강합니다.' : isSamhab ? '해묘미(亥卯未) 삼합으로 결실과 확장의 기운입니다.' : isChung ? '축미(丑未) 충으로 이직/이사 등 환경 변화수가 큽니다.' : '세운과 무난한 조화를 이룹니다.'}

*정밀한 개인화 1년 심층 리포트를 원하시면 잠시 후 다시 확인해 주세요.*`
      } else {
        aiInterpretation = `**[AI 해석 알림]** API 연결에 일시적인 제한이 있어 데이터베이스 원천 자료를 토대로 기본 운세를 해석해 드립니다.

### 나의 일주(日柱): ${userSaju.fullName} (${ilganData?.element} 기운)
* **일간 성향:** ${ilganData?.tendency || '태어난 날의 기운이 깃들어 있습니다.'}
* **일지(${userSaju.branch} - ${iljiData?.animal}) 특징:** ${iljiData?.description || '태어난 지지 기운이 깃들어 있습니다.'}
* 태어난 시간 지지(시지): **${birthHourBranch}시** ${sijiData ? `(${sijiData.animal}의 기운 - ${sijiData.description})` : ''}

### 오늘의 일진과 기운: ${todaySaju.fullName}일 (${shipsinName}의 날)
* **${shipsinName}의 작용:** ${shipsinData?.meaning || '오늘의 기운이 일간에 미치는 영향입니다.'}

*조금 더 상세하고 개인화된 조언을 원하시면 나중에 다시 시도해 주세요.*`
      }
    }

    // Rate limit 기록 저장 (정상 분석 성공 시에만 저장하여 오류 발생 시 즉시 재조회 가능하도록 보장)
    const isAnalysisComplete = isAiGenerated && !!(parsedData?.categories?.wealth?.score && parsedData?.categories?.love?.score)
    if (!isDev && isAnalysisComplete) {
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

      setCookie(event, cookieName, String(now), {
        maxAge: 10 * 24 * 60 * 60,
        path: '/'
      })
    }

    console.log(`[${requestId}] Saju API completed successfully`, {
      elapsed: `${Date.now() - parseInt(requestId.split('_')[1] || '0')}ms`,
      isAiGenerated,
      hasParsedData: !!parsedData
    })

    recordSajuView().catch(() => {})

    return {
      success: true,
      fortuneType: isNewYearFortune ? 'newyear' : 'daily',
      targetYear: isNewYearFortune ? 2027 : undefined,
      userSaju: {
        birthGanzhi: userSaju.fullName,
        ilgan: userSaju.stem,
        ilganElement: ilganData?.element,
        siji: birthHourBranch,
        yearGanzhi: userYearSaju.fullName,
        animal: userYearSaju.animal,
        zodiacName: userYearSaju.zodiacName,
        birthYear: birthYearNum,
        isSamjae,
        samjaeType,
        isYukhab,
        isSamhab,
        isChung
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

    console.error(`[${requestId}] Saju API Error`, {
      statusCode,
      message: statusMessage,
      stack: error.stack,
      errorName: error.name
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
