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
        'x-api-key': claudeApiKey,
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

  // 2. Gemini API 연결 테스트 (ModelService.ListModels 사전 탐색 지원)
  const geminiApiKey = config.geminiApiKey || ''
  if (geminiApiKey) {
    try {
      // 1) 발급받은 API 키로 구글 서버에서 이용 가능한 모델 목록 사전 조회
      let availableModels: string[] = []
      try {
        const listRes: any = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`)
        if (listRes?.models && Array.isArray(listRes.models)) {
          availableModels = listRes.models
            .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m: any) => m.name.replace(/^models\//, ''))
        }
      } catch (listErr: any) {
        console.warn('[Gemini Test] ListModels failed, using fallback list:', listErr.message)
      }

      // 후보 모델 순서 (조회된 지원 모델 우선 + fallback)
      const candidateModels = Array.from(new Set([        
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
        ...availableModels,        
      ]))

      let geminiSuccess = false
      let lastError: any = null
      let matchedModel = ''

      for (const model of candidateModels) {
        // v1beta 및 v1 엔드포인트 순차 시도
        const apiVersions = ['v1beta', 'v1']
        for (const ver of apiVersions) {
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000)
            const res: any = await $fetch(`https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              body: {
                contents: [{ parts: [{ text: 'hi' }] }],
                generationConfig: { maxOutputTokens: 10 }
              },
              signal: controller.signal
            })
            clearTimeout(timeoutId)
            const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || ''
            if (text) {
              results.gemini = {
                status: 'success',
                model,
                apiVersion: ver,
                hasContent: true,
                availableModelsCount: availableModels.length
              }
              geminiSuccess = true
              matchedModel = model
              break
            }
          } catch (err: any) {
            lastError = err
          }
        }
        if (geminiSuccess) break
      }

      if (!geminiSuccess) {
        results.gemini = {
          status: 'error',
          message: lastError?.message || String(lastError),
          statusCode: lastError?.statusCode || lastError?.status,
          cause: lastError?.cause?.message || lastError?.data?.error?.message || null,
          availableModelsSample: availableModels.slice(0, 5)
        }
      }
    } catch (err: any) {
      results.gemini = {
        status: 'error',
        message: err?.message || String(err),
        statusCode: err?.statusCode || err?.status,
        cause: err?.cause?.message || err?.data?.error?.message || null
      }
    }
  } else {
    results.gemini = {
      status: 'error',
      message: 'GEMINI_API_KEY가 설정되지 않았습니다.'
    }
  }

  return { env: process.env.NODE_ENV, results }
})
