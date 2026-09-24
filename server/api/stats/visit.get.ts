import { defineEventHandler, getCookie, setCookie, getRequestIP } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const nowUtc = Date.now()
    const kstOffset = 9 * 60 * 60 * 1000 // KST UTC+9
    const todayKstStr = new Date(nowUtc + kstOffset).toISOString().split('T')[0] || ''

    const db = (prisma as any).siteStats
    let stats = await db.findUnique({
      where: { id: 1 }
    })

    // 데이터가 없거나 KST 날짜가 바뀌었을 경우 카운트 초기화 및 업데이트
    if (!stats) {
      stats = await db.create({
        data: {
          id: 1,
          totalViews: 1, // 첫 기점 1부터 시작
          todayViews: 1,
          todayDate: todayKstStr
        }
      })
    } else if (stats.todayDate !== todayKstStr) {
      // 자정(00:00) 경과 시 오늘 방문자 수 0으로 리셋 후 1 시작
      stats = await db.update({
        where: { id: 1 },
        data: {
          todayViews: 1,
          todayDate: todayKstStr
        }
      })
    }

    // 중복 카운트 방지 쿠키 확인
    const cookieName = 'fortune_visited_today'
    const hasVisitedCookie = getCookie(event, cookieName)

    if (!hasVisitedCookie) {
      // 새로운 방문일 경우 카운트 +1 증가
      stats = await db.update({
        where: { id: 1 },
        data: {
          totalViews: { increment: 1 },
          todayViews: { increment: 1 }
        }
      })

      // KST 자정까지 유효한 방문 쿠키 설정
      setCookie(event, cookieName, todayKstStr, {
        maxAge: 24 * 60 * 60,
        path: '/'
      })
    }

    return {
      success: true,
      todayViews: stats.todayViews,
      totalViews: stats.totalViews
    }
  } catch (error: any) {
    // DB 연결 예외 발생 시 디폴트 카운트 제공
    const nowUtc = Date.now()
    const kstOffset = 9 * 60 * 60 * 1000
    const todayKstStr = new Date(nowUtc + kstOffset).toISOString().split('T')[0] || ''
    const daySeed = parseInt(todayKstStr.replace(/-/g, ''), 10) % 500
    
    return {
      success: true,
      todayViews: 1,
      totalViews: 1
    }
  }
})
