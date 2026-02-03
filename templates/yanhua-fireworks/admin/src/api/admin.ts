import request from '@/utils/request'
import type { 
  ApiResponse, 
  AdminLoginRequest, 
  AdminLoginResponse,
  AdminInfo 
} from './types'

/**
 * 管理员登录
 */
export function adminLogin(data: AdminLoginRequest) {
  return request<ApiResponse<AdminLoginResponse>>({
    url: '/admin/login',
    method: 'post',
    data
  })
}

/**
 * 获取管理员信息
 */
export function getAdminInfo() {
  return request<ApiResponse<AdminInfo>>({
    url: '/admin/info',
    method: 'get'
  })
}

/**
 * 退出登录
 */
export function adminLogout() {
  return request<ApiResponse<void>>({
    url: '/admin/logout',
    method: 'post'
  })
}
