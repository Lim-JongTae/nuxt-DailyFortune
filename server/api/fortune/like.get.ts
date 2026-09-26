import { defineEventHandler, getQuery, getCookie } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = String(query.type || 'iching')
    const targetKey = String(query.targetKey || 'default')

    let count = 0
    let dbError: string | null = null
    try {
      count = await prisma.fortuneLike.count({
        where: { type, targetKey }
      })
    } catch (dbErr: any) {
      dbError = dbErr.message
      console.error('[Like Get] DB count error:', {
        error: dbErr.message,
        code: dbErr.code,
        type,
        targetKey
      })
    }

    const cookieName = `fortune_liked_${type}_${targetKey}`
    const alreadyLiked = Boolean(getCookie(event, cookieName))

    return {
      success: true,
      likeCount: count,
      alreadyLiked,
      // 개발 디버그용: DB 에러 여부 (프론트에서 콘솔 확인 가능)
      ...(dbError && process.env.NODE_ENV !== 'production' ? { dbError } : {})
    }
  } catch (error: any) {
    console.error('[Like Get] Error:', {
      error: error.message,
      stack: error.stack
    })
    return {
      success: true,
      likeCount: 0,
      alreadyLiked: false
    }
  }
})
