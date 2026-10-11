import { defineEventHandler, getRouterParam } from 'h3'
import { getIChingHexagramDetail } from '../../utils/ichingData'

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const hexagramId = parseInt(idParam || '1', 10)

    if (isNaN(hexagramId) || hexagramId < 1 || hexagramId > 64) {
      return {
        success: false,
        message: '유효하지 않은 괘 번호입니다. (1~64)'
      }
    }

    // AI 호출 및 DB 지연 없이 인메모리에서 0.001초 만에 64괘 고전 정통 데이터 및 6효사 조회
    const data = getIChingHexagramDetail(hexagramId)

    if (!data) {
      return {
        success: false,
        message: '괘 정보를 찾을 수 없습니다.'
      }
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '괘 정보를 불러오는 데 실패했습니다.'
    }
  }
})

