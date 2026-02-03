// 积分规则相关API
import { request } from './api'

/**
 * 积分规则数据类型
 */
export interface PointsRules {
  id: number
  content: string
  createTime: string
  updateTime: string
}

/**
 * 获取积分成长规则
 * 需求：4.3 - 小程序从后端检索最新积分规则
 * 
 * @returns Promise<PointsRules> 积分规则内容
 */
export function getPointsRules(): Promise<PointsRules> {
  return request<PointsRules>({
    url: '/points-rules',
    method: 'GET',
    showLoading: true
  }).then(res => res.data)
}

// 导出所有API
export const pointsApi = {
  getPointsRules
}

export default pointsApi
