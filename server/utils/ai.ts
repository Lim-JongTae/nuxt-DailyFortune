export interface AiResponse {
  text: string;
  isAiGenerated: boolean;
  model?: string;
  latencyMs?: number;
}

export async function callAiModel(prompt: string): Promise<AiResponse> {
  // useRuntimeConfig()를 사용해야 Nuxt 프로덕션에서도 환경변수가 올바르게 주입됨
  const config = useRuntimeConfig()
  const claudeEndPoint = (config.claudeApiEndPoint || process.env.CLAUDE_API_END_POINT || 'https://aiapiflow.com').replace(/\/$/, '')
  const claudeApiKey = config.claudeApiKey || process.env.CLAUDE_API_KEY
  const claudeModel = config.claudeModel || process.env.CLAUDE_MODEL || 'claude-sonnet-5'
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

  // 1. Claude API (1순위) - Vercel 동적 IP 환경에서는 403이 발생할 수 있으나,
  //    에러 시 자동으로 Gemini fallback으로 전환됨
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
        return { text, isAiGenerated: true, model: claudeModel, latencyMs: elapsed }
      }
      console.warn('[Claude API] ⚠️ Invalid or insufficient text content in response, falling back to Gemini')
    } catch (claudeError: any) {
      const elapsed = Date.now() - startTime
      const statusCode = claudeError?.statusCode || claudeError?.status
      const errorMsg = claudeError?.message || claudeError?.data?.error?.message || String(claudeError)
      const errorData = claudeError?.data || claudeError?.response?.data

      console.error('[Claude API Error] ❌ Falling back to Gemini', {
        elapsed: `${elapsed}ms`,
        endpoint: `${claudeEndPoint}/v1/messages`,
        message: errorMsg,
        statusCode,
        errorType: claudeError?.name,
        errorData: errorData ? JSON.stringify(errorData).slice(0, 200) : undefined,
        hint: statusCode === 403 ? 'Vercel dynamic IP blocked by proxy. Auto-switching to Gemini.' :
              statusCode === 429 ? 'Rate limit exceeded' :
              statusCode === 401 ? 'Invalid API key' :
              claudeError?.name === 'AbortError' ? 'Request timeout' : undefined
      })
    }
  } else {
    console.warn('[Claude API] ⚠️ No API key configured, skipping to Gemini')
  }

  // 2. Gemini API (2순위 fallback - 구글 직연결: gemini-2.0-flash / gemini-1.5-flash)
  if (geminiApiKey) {
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash']
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
          return { text, isAiGenerated: true, model, latencyMs: elapsed }
        }
        console.warn(`[Gemini API] ⚠️ No valid text content using model: ${model}`)
      } catch (geminiError: any) {
        const elapsed = Date.now() - startTime
        const errorMsg = geminiError?.message || geminiError?.data?.error?.message || String(geminiError)
        const statusCode = geminiError?.statusCode || geminiError?.status

        console.error(`[Gemini API Error] ❌ Model ${model} failed`, {
          elapsed: `${elapsed}ms`,
          message: errorMsg,
          statusCode,
          errorType: geminiError?.name,
          hint: statusCode === 429 ? 'Rate limit exceeded' :
                statusCode === 400 ? 'Invalid request format' :
                geminiError?.name === 'AbortError' ? 'Request timeout' : undefined
        })
      }
    }
  } else {
    console.warn('[Gemini API] ⚠️ No API key configured, skipping Gemini')
  }

  console.error('[AI Models] ❌ All AI services failed or unavailable')
  return { text: '', isAiGenerated: false }
}
