import { recordAiUsageLog } from './stats'

export interface AiResponse {
  text: string;
  isAiGenerated: boolean;
  model?: string;
  latencyMs?: number;
}

export async function callAiModel(prompt: string, serviceType: string = 'general'): Promise<AiResponse> {
  // useRuntimeConfig()를 사용해야 Nuxt 프로덕션에서도 환경변수가 올바르게 주입됨
  const config = useRuntimeConfig()
  const claudeEndPoint = (config.claudeApiEndPoint || process.env.CLAUDE_API_END_POINT || 'https://api.anthropic.com').replace(/\/$/, '')
  const claudeApiKey = config.claudeApiKey || process.env.CLAUDE_API_KEY
  const claudeModel = config.claudeModel || process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001'
  const geminiApiKey = config.geminiApiKey || process.env.GEMINI_API_KEY

  const timeout = Number(config.aiApiTimeoutMs) || Number(process.env.AI_API_TIMEOUT_MS) || 90000
  const maxTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 3500

  // Helper: fetch with timeout
  const fetchWithTimeout = async (url: string, opts: any, timeoutMs: number) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await $fetch(url, { ...opts, signal: controller.signal })
      clearTimeout(timeoutId)
      return res
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError' || error.code === 'ABORT_ERR') {
        throw new Error(`Request timeout after ${timeoutMs}ms`)
      }
      throw error
    }
  }

  // Helper: text quality check
  const isValidAiText = (text: string): boolean => {
    if (!text || text.trim().length < 40) return false
    // 단순 쉼표, 기호 또는 빈 마크다운 찌꺼기 방지
    const clean = text.replace(/```json[\s\S]*?```/gi, '').replace(/[,\s\n\r`]/g, '')
    return clean.length > 20
  }

  // 1. Gemini API (1순위 - 구글 호환 모델 자동 검색)
  if (geminiApiKey) {
    const configuredModel = (config.geminiModel || process.env.GEMINI_MODEL || '').trim()
    const defaultModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash']
    const models = configuredModel
      ? [configuredModel, ...defaultModels.filter(m => m !== configuredModel)]
      : defaultModels

    for (const model of models) {
      const startTime = Date.now()
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
        console.log('[Gemini API] Request starting:', {
          model,
          maxTokens: maxTokens,
          promptLength: prompt.length,
          timeout
        })

        const response: any = await fetchWithTimeout(
          `${endpoint}?key=${geminiApiKey}`,
          {
            method: 'POST',
            body: {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: maxTokens
              }
            }
          },
          timeout
        )

        const elapsed = Date.now() - startTime
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || ''

        console.log('[Gemini API] Response received:', {
          model,
          elapsed: `${elapsed}ms`,
          hasCandidates: !!response?.candidates?.length,
          textLength: text.length,
          finishReason: response?.candidates?.[0]?.finishReason
        })

        if (isValidAiText(text)) {
          console.log(`[Gemini API] ✅ Success using model: ${model} (${elapsed}ms)`)
          recordAiUsageLog({
            serviceType,
            provider: 'gemini',
            model,
            status: 'success',
            statusCode: '200',
            latencyMs: elapsed
          }).catch(() => {})
          return { text, isAiGenerated: true, model, latencyMs: elapsed }
        }
        console.warn(`[Gemini API] ⚠️ No valid text content using model: ${model}`)
        recordAiUsageLog({
          serviceType,
          provider: 'gemini',
          model,
          status: 'error',
          statusCode: '204',
          errorMessage: 'No valid text content generated',
          latencyMs: elapsed
        }).catch(() => {})
      } catch (geminiError: any) {
        const elapsed = Date.now() - startTime
        const errorMsg = geminiError?.message || geminiError?.data?.error?.message || String(geminiError)
        const statusCode = geminiError?.statusCode ||
                           geminiError?.status ||
                           geminiError?.response?.status ||
                           geminiError?.data?.error?.code ||
                           'Unknown'

        const is503 = statusCode === 503 || /\b503\b/.test(String(errorMsg))
        const is429 = statusCode === 429 || /\b429\b/.test(String(errorMsg))
        const is404 = statusCode === 404 || /\b404\b/.test(String(errorMsg))

        console.error(`[Gemini API Error] ❌ Model ${model} failed`, {
          elapsed: `${elapsed}ms`,
          message: errorMsg,
          statusCode,
          errorType: geminiError?.name,
          hint: is404 ? 'Model not found (404)' :
                is429 ? 'Rate limit exceeded (429)' :
                is503 ? 'Service Unavailable (503)' :
                (statusCode === 400 || /\b400\b/.test(String(errorMsg))) ? 'Invalid request format (400)' :
                geminiError?.name === 'AbortError' ? 'Request timeout' : undefined
        })

        // DB에 실패 로그 저장
        recordAiUsageLog({
          serviceType,
          provider: 'gemini',
          model,
          status: 'error',
          statusCode: String(statusCode),
          errorMessage: errorMsg,
          latencyMs: elapsed
        }).catch(() => {})

        // 503(서버 과부하) 또는 429(요청 제한) 발생 시 구글 인프라 전역 일시 문제이므로
        // 지연 시간 누적으로 인한 사용자 이탈을 방지하기 위해 즉시 2순위 Claude API로 전환(Fast Failover)
        if (is503 || is429) {
          console.warn(`[Gemini API] ⚠️ 구글 Gemini 서버 일시 장애/제한(${statusCode}) 감지. 지연 이탈 방지를 위해 즉시 Claude API로 전환합니다.`)
          break
        }
      }
    }
    console.warn('[Gemini API] ⚠️ Gemini 시도 종료. 2순위 Claude API로 전환하여 처리합니다.')
  } else {
    console.warn('[Gemini API] ⚠️ GEMINI_API_KEY 미설정, 2순위 Claude API로 진행합니다.')
  }

  // 2. Claude API (2순위 fallback)
  if (claudeApiKey) {
    const startTime = Date.now()
    try {
      const endpoint = `${claudeEndPoint}/v1/messages`
      console.log('[Claude API] Request starting:', {
        endpoint,
        model: claudeModel,
        maxTokens: maxTokens,
        promptLength: prompt.length,
        timeout
      })

      const response: any = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: {
          model: claudeModel,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }]
        }
      }, timeout)

      const elapsed = Date.now() - startTime
      console.log('[Claude API] Response received:', {
        elapsed: `${elapsed}ms`,
        hasContent: !!response?.content,
        contentLength: response?.content?.length,
        textLength: response?.content?.[0]?.text?.length,
        usage: response?.usage
      })

      const text = response?.content?.[0]?.text || ''
      if (isValidAiText(text)) {
        console.log(`[Claude API] ✅ Success - Valid text generated (${elapsed}ms)`)
        recordAiUsageLog({
          serviceType,
          provider: 'claude',
          model: claudeModel,
          status: 'success',
          statusCode: '200',
          latencyMs: elapsed
        }).catch(() => {})
        return { text, isAiGenerated: true, model: claudeModel, latencyMs: elapsed }
      }
      console.warn('[Claude API] ⚠️ Invalid or insufficient text content in response')
      recordAiUsageLog({
        serviceType,
        provider: 'claude',
        model: claudeModel,
        status: 'error',
        statusCode: '204',
        errorMessage: 'Invalid or insufficient text content in response',
        latencyMs: elapsed
      }).catch(() => {})
    } catch (claudeError: any) {
      const elapsed = Date.now() - startTime
      const errorMsg = claudeError?.message || claudeError?.data?.error?.message || String(claudeError)
      const statusCode = claudeError?.statusCode ||
                         claudeError?.status ||
                         claudeError?.response?.status ||
                         claudeError?.data?.error?.code ||
                         'Unknown'
      const errorData = claudeError?.data || claudeError?.response?.data

      console.error('[Claude API Error] ❌ Claude API failed', {
        elapsed: `${elapsed}ms`,
        endpoint: `${claudeEndPoint}/v1/messages`,
        message: errorMsg,
        statusCode,
        errorType: claudeError?.name,
        errorData: errorData ? JSON.stringify(errorData).slice(0, 200) : undefined,
        hint: (statusCode === 403 || /\b403\b/.test(String(errorMsg))) ? 'Dynamic IP blocked' :
              (statusCode === 429 || /\b429\b/.test(String(errorMsg))) ? 'Rate limit exceeded' :
              (statusCode === 401 || /\b401\b/.test(String(errorMsg))) ? 'Invalid API key' :
              claudeError?.name === 'AbortError' ? 'Request timeout' : undefined
      })

      recordAiUsageLog({
        serviceType,
        provider: 'claude',
        model: claudeModel,
        status: 'error',
        statusCode: String(statusCode),
        errorMessage: errorMsg,
        latencyMs: elapsed
      }).catch(() => {})
    }
  } else {
    console.warn('[Claude API] ⚠️ No API key configured')
  }

  console.error('[AI Models] ❌ All AI services failed or unavailable')
  return { text: '', isAiGenerated: false }
}
