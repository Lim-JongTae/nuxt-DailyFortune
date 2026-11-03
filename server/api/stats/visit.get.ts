import { defineEventHandler, getCookie, setCookie, getHeader, getRequestIP, setHeader } from 'h3'
import prisma from '../../utils/prisma'
import { recordDailyVisit } from '../../utils/stats'

// 검색 로봇 및 크롤러 User-Agent 패턴
const BOT_USER_AGENTS = /bot|spider|crawl|slurp|google|bing|yeti|daumoa|semrush|ahrefs|facebookexternalhit|twitterbot|pinterest|curl|wget|python|postman|lighthouse/i

// 최근 5초 이내 방문 카운트가 집계된 클라이언트 IP 캐시 (SSR 동시 요청 및 연쇄 호출 방어)
const recentVisits = new Map<string, number>()

export default defineEventHandler(async (event) => {
  try {
    // 캐시 방지 헤더 설정 (자정 00:00 갱신 수치 실시간 보장)
    setHeader(event, 'cache-control', 'no-store, no-cache, must-revalidate')

    const nowUtc = Date.now()
    const kstOffset = 9 * 60 * 60 * 1000 // KST UTC+9
    const todayKstStr = new Date(nowUtc + kstOffset).toISOString().split('T')[0] || ''

    const userAgent = getHeader(event, 'user-agent') || ''
    const isBot = BOT_USER_AGENTS.test(userAgent)

    // 1. 검색엔진 봇/크롤러인 경우: 카운트는 올리지 않되, 날짜가 바뀌었으면 DB 일자 갱신 및 todayViews 0으로 초기화
    if (isBot) {
      let stats = await prisma.siteStats.findUnique({
        where: { id: 1 }
      })

      if (stats && stats.todayDate !== todayKstStr) {
        stats = await prisma.siteStats.update({
          where: { id: 1 },
          data: {
            todayViews: 0,
            todayDate: todayKstStr
          }
        })
        await recordDailyVisit(false)
      }

      return {
        success: true,
        todayViews: stats?.todayViews ?? 0,
        totalViews: stats?.totalViews ?? 0,
        todayDate: stats?.todayDate ?? todayKstStr
      }
    }

    // 2. 최근 5초 내 동일 IP 연속 요청 체크 (SSR 및 컴포넌트 동시 렌더링 중복 방어)
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    const now = Date.now()

    // 5초 지난 캐시 정리
    if (recentVisits.size > 500) {
      for (const [key, timestamp] of recentVisits.entries()) {
        if (now - timestamp > 5000) {
          recentVisits.delete(key)
        }
      }
    }

    const lastVisitTime = recentVisits.get(clientIp)
    const isBurstDuplicate = !!(lastVisitTime && now - lastVisitTime < 5000)

    // 중복 카운트 방지 쿠키 확인 (저장된 날짜 string)
    const cookieName = 'fortune_visited_today'
    const visitedDateCookie = getCookie(event, cookieName)
    // 오늘 첫 방문 여부 (쿠키가 없거나 오늘 KST 날짜와 다르고, 5초 내 동시 요청이 아닐 때)
    const isNewVisitToday = (!visitedDateCookie || visitedDateCookie !== todayKstStr) && !isBurstDuplicate

    const COOKIE_MAX_AGE = 2 * 60 * 60 // 2시간 (2시간 동안 중복 카운트 방지, 이후 재방문 시 새 세션 카운트)

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
        maxAge: COOKIE_MAX_AGE,
        path: '/'
      })

      recentVisits.set(clientIp, now)
      await recordDailyVisit(true)

      console.log('[Visit Stats] Initial create:', {
        todayViews: stats.todayViews,
        totalViews: stats.totalViews
      })

      return {
        success: true,
        todayViews: stats.todayViews,
        totalViews: stats.totalViews,
        todayDate: stats.todayDate
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
          maxAge: COOKIE_MAX_AGE,
          path: '/'
        })
        recentVisits.set(clientIp, now)
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
        totalViews: stats.totalViews,
        todayDate: stats.todayDate
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
        maxAge: COOKIE_MAX_AGE,
        path: '/'
      })

      recentVisits.set(clientIp, now)
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
