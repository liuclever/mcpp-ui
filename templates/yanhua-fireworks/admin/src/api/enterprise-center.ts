import request from '@/utils/request'

/**
 * 企业中心配置接口
 */
export interface EnterpriseCenterConfig {
  id?: number
  bannerImageUrl: string
  introductionText: string
  customButtonName?: string
  customCategoryId?: number
  createTime?: string
  updateTime?: string
}

/**
 * 获取企业中心配置
 */
export function getEnterpriseCenterConfig() {
  return request({
    url: '/enterprise-center/config',
    method: 'get'
  })
}

/**
 * 更新企业中心配置（管理后台使用）
 */
export function updateEnterpriseCenterConfig(data: EnterpriseCenterConfig) {
  return request({
    url: '/enterprise-center/config',
    method: 'put',
    data
  })
}

/**
 * 获取管理后台企业中心配置
 */
export function getAdminEnterpriseCenterConfig() {
  return request({
    url: '/admin/enterprise-center/config',
    method: 'get'
  })
}

/**
 * 更新管理后台企业中心配置
 */
export function updateAdminEnterpriseCenterConfig(data: EnterpriseCenterConfig) {
  return request({
    url: '/admin/enterprise-center/config',
    method: 'put',
    data
  })
}
