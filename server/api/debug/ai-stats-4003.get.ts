import prisma from '../../utils/prisma'
import { getTodayKstString } from '../../utils/stats'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const targetDate = (query.date as string) || getTodayKstString()

  try {
    // 1. 대상 일자의 모든 AI 로그 조회
    const logs = await prisma.aiUsageLog.findMany({
      where: {
        date: targetDate
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 2. 전체 통계 집계
    const totalCalls = logs.length
    const successCalls = logs.filter(l => l.status === 'success').length
    const errorCalls = logs.filter(l => l.status === 'error').length
    const overallSuccessRate = totalCalls > 0 ? `${((successCalls / totalCalls) * 100).toFixed(1)}%` : '0%'

    // 3. 모델별 집계
    const modelStatsMap: Record<string, {
      provider: string;
      total: number;
      success: number;
      error: number;
      successRate: string;
      avgLatencyMs: number;
      statusCodes: Record<string, number>;
    }> = {}

    for (const log of logs) {
      const key = `${log.provider}:${log.model}`
      if (!modelStatsMap[key]) {
        modelStatsMap[key] = {
          provider: log.provider,
          total: 0,
          success: 0,
          error: 0,
          successRate: '0%',
          avgLatencyMs: 0,
          statusCodes: {}
        }
      }

      const item = modelStatsMap[key]
      item.total += 1
      if (log.status === 'success') {
        item.success += 1
      } else {
        item.error += 1
      }

      const code = log.statusCode || 'Unknown'
      item.statusCodes[code] = (item.statusCodes[code] || 0) + 1
    }

    // 모델별 성공률 및 평균 Latency 계산
    const modelStats = Object.entries(modelStatsMap).map(([key, item]) => {
      const [provider, model] = key.split(':')
      const modelLogs = logs.filter(l => l.provider === provider && l.model === model && l.latencyMs)
      const totalLatency = modelLogs.reduce((acc, cur) => acc + (cur.latencyMs || 0), 0)
      const avgLatency = modelLogs.length > 0 ? Math.round(totalLatency / modelLogs.length) : 0

      return {
        provider,
        model,
        total: item.total,
        success: item.success,
        error: item.error,
        successRate: item.total > 0 ? `${((item.success / item.total) * 100).toFixed(1)}%` : '0%',
        avgLatencyMs: avgLatency,
        statusCodes: item.statusCodes
      }
    })

    // 4. 최근 에러 로그 10건 추출
    const recentErrors = logs
      .filter(l => l.status === 'error')
      .slice(0, 10)
      .map(l => ({
        time: l.createdAt.toISOString(),
        serviceType: l.serviceType,
        provider: l.provider,
        model: l.model,
        statusCode: l.statusCode,
        errorMessage: l.errorMessage,
        latencyMs: l.latencyMs
      }))

    return {
      success: true,
      date: targetDate,
      summary: {
        totalCalls,
        successCalls,
        errorCalls,
        overallSuccessRate
      },
      modelStats,
      recentErrors
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || String(err)
    }
  }
})
