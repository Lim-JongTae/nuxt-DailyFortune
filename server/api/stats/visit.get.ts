import { defineEventHandler, getCookie, setCookie } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const nowUtc = Date.now()
    const kstOffset = 9 * 60 * 60 * 1000 // KST UTC+9
    const todayKstStr = new Date(nowUtc + kstOffset).toISOString().split('T')[0] || ''

    // 중복 카운트 방지 쿠키 먼저 확인
    const cookieName = 'fortune_visited_today'
    const hasVisitedCookie = getCookie(event, cookieName)

    let stats = await prisma.siteStats.findUnique({
      where: { id: 1 }
    })

    // 데이터가 없으면 초기 생성
    if (!stats) {
      stats = await prisma.siteStats.create({
        data: {
          id: 1,
          totalViews: hasVisitedCookie ? 0 : 1,
          todayViews: hasVisitedCookie ? 0 : 1,
          todayDate: todayKstStr
        }
      })

      if (!hasVisitedCookie) {
        setCookie(event, cookieName, todayKstStr, {
          maxAge: 24 * 60 * 60,
          path: '/'
        })
      }

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

    // 날짜가 바뀌었는지 확인
    const dateChanged = stats.todayDate !== todayKstStr

    // 날짜가 바뀌었으면 todayViews 리셋
    if (dateChanged) {
      stats = await prisma.siteStats.update({
        where: { id: 1 },
        data: {
          todayViews: hasVisitedCookie ? 0 : 1,
          todayDate: todayKstStr,
          totalViews: hasVisitedCookie ? stats.totalViews : { increment: 1 }
        }
      })

      if (!hasVisitedCookie) {
        setCookie(event, cookieName, todayKstStr, {
          maxAge: 24 * 60 * 60,
          path: '/'
        })
      }

      console.log('[Visit Stats] Date changed:', {
        date: todayKstStr,
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      })

      return {
        success: true,
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      }
    }

    // 같은 날짜 && 쿠키 없음 → 새 방문자
    if (!hasVisitedCookie) {
      stats = await prisma.siteStats.update({
        where: { id: 1 },
        data: {
          totalViews: { increment: 1 },
          todayViews: { increment: 1 }
        }
      })

      setCookie(event, cookieName, todayKstStr, {
        maxAge: 24 * 60 * 60,
        path: '/'
      })

      console.log('[Visit Stats] New visitor:', {
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      })
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

    return {
      success: false,
      todayViews: 0,
      totalViews: 0,
      error: 'Failed to fetch visit stats'
    }
  }
})
