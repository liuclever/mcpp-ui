import { request } from '@/utils/request'
import type { PageParams, PageResult } from './types'

/**
 * CMS内容接口类型
 */
export interface CMSContent {
  id?: number
  categoryType: string // brand=品牌简介, honor=企业荣誉, visit=领导来访, custom=自定义
  categoryId?: number // 自定义类别ID
  title: string
  content: string // 富文本HTML
  images: string // JSON格式的图片URL列表
  sortOrder: number
  status: number // 0=禁用，1=启用
  createTime?: string
  updateTime?: string
}

/**
 * CMS内容列表查询参数
 */
export interface CMSContentListParams extends PageParams {
  categoryType?: string
  categoryId?: number
  status?: number
  keyword?: string
}

/**
 * 获取CMS内容列表（管理后台）
 */
export function getCMSContentList(params: CMSContentListParams) {
  return request<PageResult<CMSContent>>({
    url: '/cms/content/admin/list',
    method: 'get',
    params
  })
}

/**
 * 获取CMS内容详情
 */
export function getCMSContentDetail(id: number) {
  return request<CMSContent>({
    url: `/cms/content/detail/${id}`,
    method: 'get'
  })
}

/**
 * 创建CMS内容
 */
export function createCMSContent(data: CMSContent) {
  return request<number>({
    url: '/cms/content',
    method: 'post',
    data
  })
}

/**
 * 更新CMS内容
 */
export function updateCMSContent(id: number, data: CMSContent) {
  return request<void>({
    url: `/cms/content/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除CMS内容
 */
export function deleteCMSContent(id: number) {
  return request<void>({
    url: `/cms/content/${id}`,
    method: 'delete'
  })
}

/**
 * CMS内容API对象（用于组件中使用）
 */
export const cmsContentApi = {
  getList: getCMSContentList,
  getDetail: getCMSContentDetail,
  create: createCMSContent,
  update: updateCMSContent,
  delete: deleteCMSContent
}
