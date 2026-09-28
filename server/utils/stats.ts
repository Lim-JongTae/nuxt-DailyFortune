import prisma from './prisma'

export function getTodayKstString(): string {
  const nowUtc = Date.now()
  const kstOffset = 9 * 60 * 60 * 1000 // KST UTC+9
  return new Date(nowUtc + kstOffset).toISOString().split('T')[0] || ''
}

export async function recordDailyVisit(isNewVisitor: boolean): Promise<void> {
  const todayStr = getTodayKstString()
  try {
    // 1. DailyVisitLog 일자별 레코드 upsert
    await prisma.dailyVisitLog.upsert({
      where: { date: todayStr },
      create: {
        date: todayStr,
        totalViews: isNewVisitor ? 1 : 0,
        sajuViews: 0,
        ichingViews: 0
      },
      update: isNewVisitor
        ? { totalViews: { increment: 1 } }
        : {}
    })
  } catch (error: any) {
    console.error('[DailyVisitLog] Error recording visit:', error.message)
  }
}

export async function recordSajuView(): Promise<void> {
  const todayStr = getTodayKstString()
  try {
    await prisma.dailyVisitLog.upsert({
      where: { date: todayStr },
      create: {
        date: todayStr,
        totalViews: 0,
        sajuViews: 1,
        ichingViews: 0
      },
      update: { sajuViews: { increment: 1 } }
    })
  } catch (error: any) {
    console.error('[DailyVisitLog] Error recording saju view:', error.message)
  }
}

export async function recordIchingView(): Promise<void> {
  const todayStr = getTodayKstString()
  try {
    await prisma.dailyVisitLog.upsert({
      where: { date: todayStr },
      create: {
        date: todayStr,
        totalViews: 0,
        sajuViews: 0,
        ichingViews: 1
      },
      update: { ichingViews: { increment: 1 } }
    })
  } catch (error: any) {
    console.error('[DailyVisitLog] Error recording iching view:', error.message)
  }
}
