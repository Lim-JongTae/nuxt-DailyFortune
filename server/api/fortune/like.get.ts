import { defineEventHandler, getQuery, getCookie } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = String(query.type || 'iching')
    const targetKey = String(query.targetKey || 'default')

    let count = 0
    try {
      count = await prisma.fortuneLike.count({
        where: { type, targetKey }
      })
    } catch (dbErr: any) {
      console.warn('[Like Get] DB count error:', {
        error: dbErr.message,
        type,
        targetKey
      })
    }

    const cookieName = `fortune_liked_${type}_${targetKey}`
    const alreadyLiked = Boolean(getCookie(event, cookieName))

    return {
      success: true,
      likeCount: count,
      alreadyLiked
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
