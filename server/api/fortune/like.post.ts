import { defineEventHandler, readBody, getCookie, setCookie, getRequestIP, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) || {}
    const { type, targetKey } = body // type: "saju" | "iching", targetKey: "iching_3_2" or "saju_갑_신축"

    if (!type || !targetKey) {
      throw createError({
        statusCode: 400,
        statusMessage: '올바른 운세 종류와 대상 키가 전달되지 않았습니다.'
      })
    }

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
    const cookieName = `fortune_liked_${type}_${targetKey}`
    const hasLiked = getCookie(event, cookieName)

    let count = 0
    try {
      // 쿠키로 이미 좋아요를 눌렀는지 확인 후 DB 저장
      if (!hasLiked) {
        await prisma.fortuneLike.create({
          data: {
            type,
            targetKey,
            ip: clientIp
          }
        })
        console.log('[Like Post] Created:', { type, targetKey, ip: clientIp })
      }

      // 좋아요 개수 조회
      count = await prisma.fortuneLike.count({
        where: { type, targetKey }
      })
    } catch (dbErr: any) {
      console.warn('[Like Post] DB error:', {
        error: dbErr.message,
        code: dbErr.code,
        type,
        targetKey,
        ip: clientIp
      })
    }

    // 쿠키 설정 (30일 유효)
    setCookie(event, cookieName, 'true', {
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    })

    return {
      success: true,
      alreadyLiked: true,
      likeCount: count
    }
  } catch (error: any) {
    console.error('[Like Post] Error:', {
      error: error.message,
      stack: error.stack
    })
    return {
      success: false,
      error: error.message || '좋아요 처리 중 오류가 발생했습니다.'
    }
  }
})
