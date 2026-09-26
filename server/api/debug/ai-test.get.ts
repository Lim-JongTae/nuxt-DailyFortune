// 프로덕션 서버에서 외부 AI API 직접 연결 테스트
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const results: Record<string, any> = {}

  // 1. Claude API 연결 테스트 (최소한의 요청)
  const claudeEndPoint = (config.claudeApiEndPoint || 'https://aiapiflow.com').replace(/\/$/, '')
  const claudeApiKey = config.claudeApiKey || ''
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10초 타임아웃
    const res: any = await $fetch(`${claudeEndPoint}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey,
        'authorization': `Bearer ${claudeApiKey}`,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: {
        model: config.claudeModel || 'claude-sonnet-5',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'hi' }]
      },
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    results.claude = { status: 'success', hasContent: !!res?.content?.[0]?.text }
  } catch (err: any) {
    results.claude = {
      status: 'error',
      message: err?.message || String(err),
      statusCode: err?.statusCode || err?.status,
      cause: err?.cause?.message || err?.data?.error?.message || null,
      type: err?.name || null
    }
  }

  // 2. Gemini API 연결 테스트
  const geminiApiKey = config.geminiApiKey || ''
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    const res: any = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      body: {
        contents: [{ parts: [{ text: 'hi' }] }],
        generationConfig: { maxOutputTokens: 10 }
      },
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    results.gemini = { status: 'success', hasContent: !!res?.candidates?.[0]?.content?.parts?.[0]?.text }
  } catch (err: any) {
    results.gemini = {
      status: 'error',
      message: err?.message || String(err),
      statusCode: err?.statusCode || err?.status,
      cause: err?.cause?.message || err?.data?.error?.message || null,
      type: err?.name || null
    }
  }

  return { env: process.env.NODE_ENV, results }
})
