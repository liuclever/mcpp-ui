import request from '@/utils/request'
import type { ApiResponse } from './types'

/**
 * 登录配置接口
 */

/**
 * 登录配置响应
 */
export interface LoginConfigResponse {
  wechatEnabled: boolean
  phoneEnabled: boolean
  forceBindPhone: boolean
  updatedAt?: string
  updatedBy?: string
}

/**
 * 更新登录配置请求
 */
export interface UpdateLoginConfigRequest {
  wechatEnabled: boolean
  phoneEnabled: boolean
  forceBindPhone: boolean
}

/**
 * 获取登录配置
 */
export function getLoginConfig() {
  return request<ApiResponse<LoginConfigResponse>>({
    url: '/admin/login-config',
    method: 'get'
  })
}

/**
 * 更新登录配置
 */
export function updateLoginConfig(data: UpdateLoginConfigRequest) {
  return request<ApiResponse<void>>({
    url: '/admin/login-config',
    method: 'put',
    data
  })
}
