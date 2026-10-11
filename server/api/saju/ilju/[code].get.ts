import { defineEventHandler, getRouterParam } from 'h3'
import { getIljuDetailByCode, getIljuDetailByOrder } from '../../../utils/sajuIljuData'

export default defineEventHandler(async (event) => {
  try {
    const codeParam = getRouterParam(event, 'code')
    if (!codeParam) {
      return {
        success: false,
        message: '일주 코드가 제공되지 않았습니다.'
      }
    }

    // 0.001초 인메모리 고속 조회
    const data = getIljuDetailByCode(codeParam)

    if (!data) {
      return {
        success: false,
        message: '해당 일주 정보를 찾을 수 없습니다.'
      }
    }

    const prevOrder = data.order > 1 ? data.order - 1 : 60
    const nextOrder = data.order < 60 ? data.order + 1 : 1

    const prevItem = getIljuDetailByOrder(prevOrder)
    const nextItem = getIljuDetailByOrder(nextOrder)

    return {
      success: true,
      data: {
        ...data,
        prevIlju: prevItem ? { code: prevItem.code, ganzhi: prevItem.ganzhi, ganzhiHanja: prevItem.ganzhiHanja, order: prevItem.order } : null,
        nextIlju: nextItem ? { code: nextItem.code, ganzhi: nextItem.ganzhi, ganzhiHanja: nextItem.ganzhiHanja, order: nextItem.order } : null
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '일주 정보를 불러오는 데 실패했습니다.'
    }
  }
})
