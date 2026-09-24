import { defineEventHandler, getQuery, getCookie } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type = String(query.type || 'iching')
    const targetKey = String(query.targetKey || 'default')

    const db = (prisma as any).fortuneLike
    let count = 0
    if (db) {
      count = await db.count({
        where: { type, targetKey }
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
    return {
      success: true,
      likeCount: 0,
      alreadyLiked: false
    }
  }
})
