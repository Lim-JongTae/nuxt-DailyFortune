import { defineEventHandler } from 'h3'
import { getAllIljuList } from '../../../utils/sajuIljuData'

export default defineEventHandler(async () => {
  try {
    const list = getAllIljuList()
    return {
      success: true,
      data: list
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '60일주 목록을 불러오는 데 실패했습니다.'
    }
  }
})
