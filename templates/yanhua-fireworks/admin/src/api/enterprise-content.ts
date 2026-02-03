import request from '@/utils/request'
import type { ApiResponse, PageParams, PageResult } from './types'

/**
 * 企业中心内容接口类型
 */
export interface EnterpriseContent {
  id?: number
  columnId: number // 所属栏目ID
  title: string
  coverImage?: string // 封面图片URL
  summary?: string // 摘要
  content: string // 正文内容(富文本HTML)
  status: 'draft' | 'published' // 发布状态
  publishTime?: string // 发布时间
  sortOrder: number // 排序权重
  viewCount?: number // 浏览次数
  createTime?: string
  updateTime?: string
}

/**
 * 企业中心内容列表查询参数
 */
export interface EnterpriseContentListParams extends PageParams {
  columnId?: number
  status?: string
  keyword?: string
}

/**
 * 获取企业中心内容列表（管理后台）
 */
export function getEnterpriseContentList(params: EnterpriseContentListParams) {
  return request<ApiResponse<PageResult<EnterpriseContent>>>({
    url: '/admin/content/list',
    method: 'get',
    params
  })
}

/**
 * 获取企业中心内容详情
 */
export function getEnterpriseContentDetail(id: number) {
  return request<ApiResponse<EnterpriseContent>>({
    url: `/admin/content/${id}`,
    method: 'get'
  })
}

/**
 * 创建企业中心内容
 */
export function createEnterpriseContent(data: EnterpriseContent) {
  return request<ApiResponse<number>>({
    url: '/admin/content',
    method: 'post',
    data
  })
}

/**
 * 更新企业中心内容
 */
export function updateEnterpriseContent(id: number, data: EnterpriseContent) {
  return request<ApiResponse<void>>({
    url: `/admin/content/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除企业中心内容
 */
export function deleteEnterpriseContent(id: number) {
  return request<ApiResponse<void>>({
    url: `/admin/content/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除企业中心内容
 */
export function batchDeleteEnterpriseContent(ids: number[]) {
  return request<ApiResponse<void>>({
    url: '/admin/content/batch-delete',
    method: 'post',
    data: { ids }
  })
}

/**
 * 企业中心内容API对象（用于组件中使用）
 */
export const enterpriseContentApi = {
  getList: getEnterpriseContentList,
  getDetail: getEnterpriseContentDetail,
  create: createEnterpriseContent,
  update: updateEnterpriseContent,
  delete: deleteEnterpriseContent,
  batchDelete: batchDeleteEnterpriseContent
}
