export async function callAiModel(prompt: string): Promise<{ text: string; isAiGenerated: boolean }> {
  // useRuntimeConfig()를 사용해야 Nuxt 프로덕션에서도 환경변수가 올바르게 주입됨
  const config = useRuntimeConfig()
  const claudeEndPoint = (config.claudeApiEndPoint || process.env.CLAUDE_API_END_POINT || 'https://aiapiflow.com').replace(/\/$/, '')
  const claudeApiKey = config.claudeApiKey || process.env.CLAUDE_API_KEY
  const claudeModel = config.claudeModel || process.env.CLAUDE_MODEL || 'claude-sonnet-5'
  const geminiApiKey = config.geminiApiKey || process.env.GEMINI_API_KEY

  const timeout = Number(config.aiApiTimeoutMs) || Number(process.env.AI_API_TIMEOUT_MS) || 90000
  const maxTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 2500

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

  // 1. Claude API (1순위) - Vercel 동적 IP 환경에서는 403이 발생할 수 있으나,
  //    에러 시 자동으로 Gemini fallback으로 전환됨
  if (claudeApiKey) {
    try {
      const response: any = await fetchWithTimeout(`${claudeEndPoint}/v1/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': claudeApiKey,
          'authorization': `Bearer ${claudeApiKey}`,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: {
          model: claudeModel,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }]
        }
      }, timeout)

      if (response?.content?.[0]?.text) {
        return { text: response.content[0].text, isAiGenerated: true }
      }
      console.warn('[Claude API] No text content in response, falling back to Gemini')
    } catch (claudeError: any) {
      const statusCode = claudeError?.statusCode || claudeError?.status
      const errorMsg = claudeError?.message || claudeError?.data?.error?.message || String(claudeError)
      console.error('[Claude API Error] Falling back to Gemini', {
        message: errorMsg,
        status: statusCode,
        // 403: Vercel 동적 IP가 프록시에 차단됨 → Gemini로 자동 전환
        hint: statusCode === 403 ? 'Vercel dynamic IP blocked by proxy. Auto-switching to Gemini.' : undefined
      })
      // 에러 시 Gemini fallback으로 계속 진행 (throw 하지 않음)
    }
  } else {
    console.warn('[Claude API] No API key configured, skipping to Gemini')
  }

  // 2. Gemini API (2순위 fallback - gemini-2.5-flash, IP 제한 없음)
  if (geminiApiKey) {
    try {
      const response: any = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
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

      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return { text: response.candidates[0].content.parts[0].text, isAiGenerated: true }
      }
      console.warn('[Gemini API] No text content in response')
    } catch (geminiError: any) {
      const errorMsg = geminiError?.message || geminiError?.data?.error?.message || String(geminiError)
      console.error('[Gemini API Error]', {
        message: errorMsg,
        status: geminiError?.statusCode || geminiError?.status,
        cause: geminiError?.data?.error?.message
      })
    }
  } else {
    console.warn('[Gemini API] No API key configured, skipping Gemini')
  }

  console.error('[AI Models] All AI services failed or unavailable')
  return { text: '', isAiGenerated: false }
}
