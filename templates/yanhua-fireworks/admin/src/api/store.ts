import request from '@/utils/request'
import type { 
  ApiResponse, 
  PageParams, 
  PageResult, 
  Store,
  JoinApply
} from './types'

/**
 * 获取门店列表
 */
export function getStoreList(params: PageParams & { keyword?: string }) {
  return request.get<ApiResponse<PageResult<Store>>>('/store/admin/list', { params })
}

/**
 * 添加门店
 */
export function addStore(data: Partial<Store>) {
  return request.post<ApiResponse<string>>('/store/admin/add', data)
}

/**
 * 更新门店
 */
export function updateStore(data: Store) {
  return request.put<ApiResponse<string>>('/store/admin/update', data)
}

/**
 * 删除门店
 */
export function deleteStore(id: number) {
  return request.delete<ApiResponse<string>>(`/store/admin/delete/${id}`)
}

/**
 * 获取入驻申请列表
 */
export function getApplyList(params: PageParams & { status?: number }) {
  return request.get<ApiResponse<PageResult<JoinApply>>>('/store/admin/apply/list', { params })
}

/**
 * 审核入驻申请
 */
export function reviewApply(data: { id: number; status: number; remark?: string }) {
  return request.put<ApiResponse<string>>('/store/admin/apply/review', data)
}
