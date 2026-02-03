import request from '@/utils/request'
import type { ApiResponse } from './types'

/**
 * 活动话题接口类型
 */
export interface Activity {
  id?: string  // 改为string类型，避免JavaScript精度丢失
  name: string
  description?: string
  coverUrl?: string
  status: number  // 0=草稿，1=已上线，2=已下线
  sortOrder: number
  isBanner?: number  // 0=否，1=是
  createTime?: string
  updateTime?: string
}

/**
 * 排序项
 */
export interface SortItem {
  id: string  // 改为string类型
  sortOrder: number
}

/**
 * 获取活动话题列表（管理后台）
 */
export function getActivityList() {
  return request<ApiResponse<Activity[]>>({
    url: '/admin/activity/list',
    method: 'get'
  })
}

/**
 * 添加活动话题
 */
export function addActivity(data: Activity) {
  return request<ApiResponse<void>>({
    url: '/admin/activity/add',
    method: 'post',
    data
  })
}

/**
 * 更新活动话题
 */
export function updateActivity(id: string, data: Activity) {
  return request<ApiResponse<void>>({
    url: `/admin/activity/update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除活动话题
 */
export function deleteActivity(id: string) {
  return request<ApiResponse<void>>({
    url: `/admin/activity/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 批量更新活动话题排序
 */
export function updateActivitySort(items: SortItem[]) {
  return request<ApiResponse<void>>({
    url: '/admin/activity/sort',
    method: 'put',
    data: items
  })
}
