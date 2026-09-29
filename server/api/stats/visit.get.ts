import { defineEventHandler, getCookie, setCookie } from 'h3'
import prisma from '../../utils/prisma'
import { recordDailyVisit } from '../../utils/stats'

export default defineEventHandler(async (event) => {
  try {
    const nowUtc = Date.now()
    const kstOffset = 9 * 60 * 60 * 1000 // KST UTC+9
    const todayKstStr = new Date(nowUtc + kstOffset).toISOString().split('T')[0] || ''

    // 중복 카운트 방지 쿠키 확인 (저장된 날짜 string)
    const cookieName = 'fortune_visited_today'
    const visitedDateCookie = getCookie(event, cookieName)
    // 오늘 첫 방문 여부 (쿠키가 없거나, 저장된 날짜가 오늘 KST 날짜와 다를 때)
    const isNewVisitToday = !visitedDateCookie || visitedDateCookie !== todayKstStr

    let stats = await prisma.siteStats.findUnique({
      where: { id: 1 }
    })

    // 데이터가 없으면 초기 생성
    if (!stats) {
      stats = await prisma.siteStats.create({
        data: {
          id: 1,
          totalViews: 1,
          todayViews: 1,
          todayDate: todayKstStr
        }
      })

      setCookie(event, cookieName, todayKstStr, {
        maxAge: 30 * 60, // 30분 동안 중복 카운트 방지
        path: '/'
      })

      await recordDailyVisit(true)

      console.log('[Visit Stats] Initial create:', {
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      })

      return {
        success: true,
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      }
    }

    // DB 기준 날짜가 바뀌었는지 확인 (00:00 자정 경과)
    const dateChanged = stats.todayDate !== todayKstStr

    // 날짜가 바뀌었으면 오늘 첫 방문자 여부에 따라 todayViews 세팅
    if (dateChanged) {
      stats = await prisma.siteStats.update({
        where: { id: 1 },
        data: {
          todayViews: isNewVisitToday ? 1 : 0,
          todayDate: todayKstStr,
          totalViews: isNewVisitToday ? { increment: 1 } : stats.totalViews
        }
      })

      if (isNewVisitToday) {
        setCookie(event, cookieName, todayKstStr, {
          maxAge: 30 * 60, // 30분 동안 중복 카운트 방지
          path: '/'
        })
      }

      await recordDailyVisit(isNewVisitToday)

      console.log('[Visit Stats] Date changed:', {
        date: todayKstStr,
        todayViews: stats.todayViews,
        totalViews: stats.totalViews,
        isNewVisitToday
      })

      return {
        success: true,
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      }
    }

    // 같은 날짜 && 오늘 첫 방문자 (쿠키가 없거나 어제 자 쿠키였을 경우)
    if (isNewVisitToday) {
      stats = await prisma.siteStats.update({
        where: { id: 1 },
        data: {
          totalViews: { increment: 1 },
          todayViews: { increment: 1 }
        }
      })

      setCookie(event, cookieName, todayKstStr, {
        maxAge: 30 * 60, // 30분 동안 중복 카운트 방지
        path: '/'
      })

      await recordDailyVisit(true)

      console.log('[Visit Stats] New visitor today:', {
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      })
    } else {
      await recordDailyVisit(false)
    }

    return {
      success: true,
      todayViews: stats.todayViews,
      totalViews: stats.totalViews
    }
  } catch (error: any) {
    console.error('[Visit Stats] Error:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    })

    // Prepared statement 에러(42P05)인 경우 연결 재시도
    if (error.code === '42P05') {
      try {
        await prisma.$disconnect()
        console.log('[Visit Stats] Reconnecting after prepared statement error...')

        const stats = await prisma.siteStats.findUnique({
          where: { id: 1 }
        })

        if (stats) {
          return {
            success: true,
            todayViews: stats.todayViews,
            totalViews: stats.totalViews
          }
        }
      } catch (retryError: any) {
        console.error('[Visit Stats] Retry failed:', retryError.message)
      }
    }

    // 재시도 실패 시 DB에서 최소한 현재 값이라도 가져오기 시도
    try {
      const stats = await prisma.siteStats.findUnique({
        where: { id: 1 }
      })

      if (stats) {
        return {
          success: true,
          todayViews: stats.todayViews,
          totalViews: stats.totalViews
        }
      }
    } catch (fallbackError) {
      console.error('[Visit Stats] Fallback read failed')
    }

    return {
      success: false,
      todayViews: 0,
      totalViews: 0,
      error: 'Failed to fetch visit stats',
      details: process.env.NODE_ENV === 'production' ? undefined : {
        message: error.message,
        code: error.code,
        name: error.name
      }
    }
  }
})
