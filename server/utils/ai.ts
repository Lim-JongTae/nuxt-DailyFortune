export async function callAiModel(prompt: string): Promise<{ text: string; isAiGenerated: boolean }> {
  const claudeEndPoint = (process.env.CLAUDE_API_END_POINT || 'https://aiapiflow.com').replace(/\/$/, '')
  const claudeApiKey = process.env.CLAUDE_API_KEY
  const claudeModel = process.env.CLAUDE_MODEL || 'claude-fable-5'
  const geminiApiKey = process.env.GEMINI_API_KEY

  // 1. Claude API (aiapiflow.com 프록시 기반 Anthropic Messages API) 시도
  if (claudeApiKey) {
    try {
      const response: any = await $fetch(`${claudeEndPoint}/v1/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': claudeApiKey,
          'authorization': `Bearer ${claudeApiKey}`,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: {
          model: claudeModel,
          max_tokens: 4096,
          messages: [
            { role: 'user', content: prompt }
          ]
        }
      })

      if (response?.content?.[0]?.text) {
        return {
          text: response.content[0].text,
          isAiGenerated: true
        }
      }
    } catch (claudeError: any) {
      console.error('Claude API (aiapiflow.com) Error:', claudeError?.data || claudeError?.message || claudeError)
    }
  }

  // 2. Gemini API Fallback 시도
  if (geminiApiKey) {
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
        return {
          text: response.candidates[0].content.parts[0].text,
          isAiGenerated: true
        }
      }
    } catch (geminiError: any) {
      console.error('Gemini API Fallback Error:', geminiError)
    }
  }

  return {
    text: '',
    isAiGenerated: false
  }
}
