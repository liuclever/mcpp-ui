import request from '@/utils/request'
import type { ApiResponse, PageParams, PageResult } from './types'

/**
 * 服务中心内容接口类型
 */
export interface ServiceContent {
  id?: number
  category: string // guide=使用指南, safety=安全须知, faq=常见问题
  subCategory?: string // 二级分类（仅FAQ使用）
  title: string
  content: string // 富文本HTML
  coverImage?: string
  videoUrl?: string
  status: number // 0=草稿，1=已发布
  sortOrder: number
  viewCount?: number
  createTime?: string
  updateTime?: string
}

/**
 * 服务中心列表查询参数
 */
export interface ServiceListParams extends PageParams {
  category?: string
  status?: number
  keyword?: string
}

/**
 * 排序项
 */
export interface SortItem {
  id: number
  sortOrder: number
}

/**
 * 获取服务中心内容列表（管理后台）
 */
export function getServiceList(params: ServiceListParams) {
  console.log('🌐 [API] 调用 getServiceList，参数:', params)
  console.log('🌐 [API] 请求URL: /api/service/admin/list')
  
  return request<ApiResponse<PageResult<ServiceContent>>>({
    url: '/api/service/admin/list',
    method: 'get',
    params
  }).then(response => {
    console.log('🌐 [API] getServiceList 响应:', response)
    return response
  }).catch(error => {
    console.error('🌐 [API] getServiceList 错误:', error)
    throw error
  })
}

/**
 * 获取服务中心内容详情
 */
export function getServiceDetail(id: number) {
  return request<ApiResponse<ServiceContent>>({
    url: `/api/service/detail/${id}`,
    method: 'get'
  })
}

/**
 * 创建服务中心内容
 */
export function createService(data: ServiceContent) {
  return request<ApiResponse<number>>({
    url: '/api/service/admin/create',
    method: 'post',
    data
  })
}

/**
 * 更新服务中心内容
 */
export function updateService(id: number, data: ServiceContent) {
  return request<ApiResponse<void>>({
    url: `/api/service/admin/update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除服务中心内容
 */
export function deleteService(id: number) {
  return request<ApiResponse<void>>({
    url: `/api/service/admin/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 发布/取消发布服务中心内容
 */
export function publishService(id: number, status: number) {
  return request<ApiResponse<void>>({
    url: `/api/service/admin/publish/${id}`,
    method: 'put',
    params: { status }
  })
}

/**
 * 更新服务中心内容排序
 */
export function updateServiceSort(items: SortItem[]) {
  return request<ApiResponse<void>>({
    url: '/api/service/admin/sort',
    method: 'put',
    data: items
  })
}

/**
 * 上传图片
 */
export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request<ApiResponse<string>>({
    url: '/api/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 上传视频
 */
export function uploadVideo(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request<ApiResponse<string>>({
    url: '/api/upload/video',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 服务中心API对象（用于组件中使用）
 */
export const serviceApi = {
  getList: getServiceList,
  getDetail: getServiceDetail,
  create: createService,
  update: updateService,
  delete: deleteService,
  publish: publishService,
  updateSort: updateServiceSort,
  uploadImage,
  uploadVideo
}
