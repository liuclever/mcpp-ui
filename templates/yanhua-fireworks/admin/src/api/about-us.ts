import request from '@/utils/request'
import type { ApiResponse } from './types'

/**
 * 关于我们内容接口类型
 */
export interface AboutUsContent {
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
 * 获取关于我们内容
 */
export function getContent() {
  return request<ApiResponse<AboutUsContent>>({
    url: '/about-us/content',
    method: 'get'
  })
}

/**
 * 更新关于我们内容（管理员）
 */
export function updateContent(content: string) {
  return request<ApiResponse<boolean>>({
    url: '/admin/about-us/content',
    method: 'put',
    data: { content }
  })
}

/**
 * 关于我们API对象（用于组件中使用）
 */
export const aboutUsApi = {
  getContent,
  updateContent
}
