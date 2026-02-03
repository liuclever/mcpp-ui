import request from '@/utils/request'
import type { ApiResponse } from './types'

/**
 * 积分规则接口类型
 */
export interface PointsRules {
  id: number
  content: string
  createTime: string
  updateTime: string
}

/**
 * 更新内容请求参数
 */
export interface UpdateContentRequest {
  content: string
}

/**
 * 获取积分规则内容
 */
export function getContent() {
  return request<ApiResponse<PointsRules>>({
    url: '/points-rules',
    method: 'get'
  })
}

/**
 * 更新积分规则内容（管理员）
 */
export function updateContent(content: string) {
  return request<ApiResponse<boolean>>({
    url: '/admin/points-rules',
    method: 'put',
    data: { content }
  })
}

/**
 * 积分规则API对象（用于组件中使用）
 */
export const pointsRulesApi = {
  getContent,
  updateContent
}
