import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // 최근 60일간 일별 통계 목록 조회 (날짜 오름차순)
    const logs = await prisma.dailyVisitLog.findMany({
      orderBy: { date: 'asc' },
      take: 60
    })

    // 전체 누적 통계
    const siteStats = await prisma.siteStats.findUnique({
      where: { id: 1 }
    })

    const totalViewsAllTime = siteStats?.totalViews || 0

    // 오늘 & 어제 통계 비교
    const nowUtc = Date.now()
    const kstOffset = 9 * 60 * 60 * 1000
    const todayStr = new Date(nowUtc + kstOffset).toISOString().split('T')[0]
    const yesterdayDateObj = new Date(nowUtc + kstOffset - 86400000)
    const yesterdayStr = yesterdayDateObj.toISOString().split('T')[0]

    const todayLog = logs.find(l => l.date === todayStr) || { totalViews: 0, sajuViews: 0, ichingViews: 0 }
    const yesterdayLog = logs.find(l => l.date === yesterdayStr) || { totalViews: 0, sajuViews: 0, ichingViews: 0 }

    // 전일 대비 방문자 성장률 (%)
    let growthRate = 0
    if (yesterdayLog.totalViews > 0) {
      growthRate = Math.round(((todayLog.totalViews - yesterdayLog.totalViews) / yesterdayLog.totalViews) * 100)
    } else if (todayLog.totalViews > 0) {
      growthRate = 100
    }

    // 사주 vs 주역 전체 합계 (로그 데이터 기준)
    const totalSajuViews = logs.reduce((acc, l) => acc + l.sajuViews, 0)
    const totalIchingViews = logs.reduce((acc, l) => acc + l.ichingViews, 0)

    return {
      success: true,
      summary: {
        todayDate: todayStr,
        todayViews: todayLog.totalViews,
        yesterdayViews: yesterdayLog.totalViews,
        growthRate,
        totalViewsAllTime,
        totalSajuViews,
        totalIchingViews
      },
      dailyLogs: logs.map(l => ({
        date: l.date,
        totalViews: l.totalViews,
        sajuViews: l.sajuViews,
        ichingViews: l.ichingViews
      }))
    }
  } catch (error: any) {
    console.error('[Secret Metrics API Error]', error.message)
    return {
      success: false,
      error: 'Failed to load secret daily metrics',
      details: error.message
    }
  }
})
