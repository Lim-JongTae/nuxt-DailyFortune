export async function callAiModel(prompt: string): Promise<{ text: string; isAiGenerated: boolean }> {
  const claudeEndPoint = (process.env.CLAUDE_API_END_POINT || 'https://aiapiflow.com').replace(/\/$/, '')
  const claudeApiKey = process.env.CLAUDE_API_KEY
  const claudeModel = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022'
  const geminiApiKey = process.env.GEMINI_API_KEY

  // Helper: fetch with timeout
  const fetchWithTimeout = async (url: string, opts: any, timeoutMs: number) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await $fetch(url, { ...opts, signal: controller.signal })
      return res
    } finally {
      clearTimeout(id)
    }
  }

  const timeout = Number(process.env.AI_API_TIMEOUT_MS) || 30000 // 30s default
  const maxTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 4096

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
    } catch (claudeError: any) {
      console.error('Claude API (aiapiflow.com) Error:', claudeError?.data || claudeError?.message || claudeError)
    }
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
    } catch (geminiError: any) {
      console.error('Gemini API Fallback Error:', geminiError)
    }
  }

  return { text: '', isAiGenerated: false }
}

