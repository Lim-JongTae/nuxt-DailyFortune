// 프로덕션 서버에서 외부 AI API 직접 연결 테스트
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const results: Record<string, any> = {}

  // 1. Claude API 연결 테스트 (최소한의 요청)
  const claudeEndPoint = (config.claudeApiEndPoint || 'https://api.anthropic.com').replace(/\/$/, '')
  const claudeApiKey = config.claudeApiKey || ''
  try {
    // Vercel 환경에서는 api.anthropic.com 직연결 권장 (프록시는 동적 IP 차단 가능)
    const isDirectApi = claudeEndPoint.includes('api.anthropic.com')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10초 타임아웃
    const res: any = await $fetch(`${claudeEndPoint}/v1/messages`, {
      method: 'POST',
      headers: {
        ...(isDirectApi
          ? { 'authorization': `Bearer ${claudeApiKey}` }
          : { 'x-api-key': claudeApiKey }
        ),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: {
        model: config.claudeModel || 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'hi' }]
      },
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    results.claude = { status: 'success', model: config.claudeModel, endpoint: claudeEndPoint, hasContent: !!res?.content?.[0]?.text }
  } catch (err: any) {
    results.claude = {
      status: 'error',
      message: err?.message || String(err),
      statusCode: err?.statusCode || err?.status,
      cause: err?.cause?.message || err?.data?.error?.message || null,
      type: err?.name || null,
      hint: `Endpoint: ${claudeEndPoint} | API Key: ${claudeApiKey ? '✓ set' : '✗ missing'}`
    }
  }

  // 2. Gemini API 연결 테스트
  const geminiApiKey = config.geminiApiKey || ''
  try {
    // Gemini 모델: 최신 모델부터 fallback
    const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest']

    let geminiSuccess = false
    let lastError: any = null

    for (const model of geminiModels) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)
        const res: any = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          body: {
            contents: [{ parts: [{ text: 'hi' }] }],
            generationConfig: { maxOutputTokens: 10 }
          },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        results.gemini = { status: 'success', model, hasContent: !!res?.candidates?.[0]?.content?.parts?.[0]?.text }
        geminiSuccess = true
        break
      } catch (err: any) {
        lastError = err
        continue
      }
    }

    if (!geminiSuccess) {
      results.gemini = {
        status: 'error',
        message: lastError?.message || String(lastError),
        statusCode: lastError?.statusCode || lastError?.status,
        cause: lastError?.cause?.message || lastError?.data?.error?.message || null,
        type: lastError?.name || null
      }
    }
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
