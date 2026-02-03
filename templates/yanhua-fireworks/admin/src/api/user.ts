import request from '@/utils/request'
import type { 
  ApiResponse, 
  PageParams, 
  PageResult, 
  User, 
  PointsLog,
  UpdateUserStatusRequest 
} from './types'

/**
 * 获取用户列表
 */
export function getUserList(params: PageParams & { keyword?: string }) {
  return request.get<ApiResponse<PageResult<User>>>('/user/admin/list', { params })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: number) {
  return request.get<ApiResponse<User>>(`/user/admin/detail/${id}`)
}

/**
 * 更新用户状态（启用/禁用）
 */
export function updateUserStatus(data: UpdateUserStatusRequest) {
  return request.put<ApiResponse<string>>('/user/admin/status', data)
}

/**
 * 获取用户积分记录
 */
export function getUserPoints(params: PageParams & { userId?: number }) {
  return request.get<ApiResponse<PageResult<PointsLog>>>('/user/admin/points', { params })
}

/**
 * 调整用户积分
 */
export function adjustUserPoints(data: { userId: number; points: number; reason: string }) {
  return request.post<ApiResponse<any>>('/user/admin/points/adjust', data)
}
