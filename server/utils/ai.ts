export async function callAiModel(prompt: string): Promise<{ text: string; isAiGenerated: boolean }> {
  const claudeEndPoint = (process.env.CLAUDE_API_END_POINT || 'https://aiapiflow.com').replace(/\/$/, '')
  const claudeApiKey = process.env.CLAUDE_API_KEY
  const claudeModel = process.env.CLAUDE_MODEL || 'claude-sonnet-5'
  const geminiApiKey = process.env.GEMINI_API_KEY

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
      // AbortError를 타임아웃 에러로 변환
      if (error.name === 'AbortError' || error.code === 'ABORT_ERR') {
        throw new Error(`Request timeout after ${timeoutMs}ms`)
      }
      throw error
    }
  }

  const timeout = Number(process.env.AI_API_TIMEOUT_MS) || 90000 // 90s default
  const maxTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 2500

  // 1. Claude API (aiapiflow.com proxy) attempt
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
          messages: [
            { role: 'user', content: prompt }
          ]
        }
      }, timeout)

      if (response?.content?.[0]?.text) {
        return { text: response.content[0].text, isAiGenerated: true }
      }
      console.warn('[Claude API] No text content in response')
    } catch (claudeError: any) {
      const errorMsg = claudeError?.message || claudeError?.data?.error?.message || String(claudeError)
      console.error('[Claude API Error]', {
        message: errorMsg,
        status: claudeError?.statusCode || claudeError?.status,
        endpoint: claudeEndPoint
      })
    }
  } else {
    console.warn('[Claude API] No API key configured, skipping Claude')
  }

  // 2. Gemini API fallback attempt
  if (geminiApiKey) {
    try {
      const response: any = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
            maxOutputTokens: maxTokens
          }
        }
      }, timeout)

      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return { text: response.candidates[0].content.parts[0].text, isAiGenerated: true }
      }
      console.warn('[Gemini API] No text content in response')
    } catch (geminiError: any) {
      const errorMsg = geminiError?.message || String(geminiError)
      console.error('[Gemini API Error]', {
        message: errorMsg,
        status: geminiError?.statusCode || geminiError?.status
      })
    }
  } else {
    console.warn('[Gemini API] No API key configured, skipping Gemini')
  }

  console.error('[AI Models] All AI services failed or unavailable')
  return { text: '', isAiGenerated: false }
}


