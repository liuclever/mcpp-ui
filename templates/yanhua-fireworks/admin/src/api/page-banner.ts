import request from '@/utils/request'

export interface PageBanner {
  id?: number
  pageKey: string
  position: string
  imageUrl: string
  linkUrl: string
  linkType: string
  visible: number
  sortOrder: number
  createTime?: string
  updateTime?: string
}

/**
 * 获取所有页面横幅配置
 */
export function getAllBanners() {
  return request({
    url: '/admin/page-banner/list',
    method: 'get'
  })
}

/**
 * 获取指定页面的横幅配置
 */
export function getPageBanners(pageKey: string) {
  return request({
    url: `/admin/page-banner/${pageKey}`,
    method: 'get'
  })
}

/**
 * 保存横幅配置
 */
export function saveBanner(data: PageBanner) {
  return request({
    url: '/admin/page-banner/save',
    method: 'post',
    data
  })
}

/**
 * 删除横幅配置
 */
export function deleteBanner(id: number) {
  return request({
    url: `/admin/page-banner/${id}`,
    method: 'delete'
  })
}
