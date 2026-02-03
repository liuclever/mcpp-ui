import request from '@/utils/request'

export interface HomeGallery {
  id?: string
  moduleType: string
  imageUrl: string
  seriesName?: string
  seriesOrder?: number
  title?: string
  description?: string
  linkUrl?: string
  sortOrder: number
  status: number
}

export interface HomeGalleryListParams {
  moduleType?: string
}

export interface SortItem {
  id: string
  sortOrder: number
}

// 获取图片列表
export function getHomeGalleryList(params?: HomeGalleryListParams) {
  return request({
    url: '/admin/home-gallery/list',
    method: 'get',
    params
  })
}

// 添加图片
export function addHomeGallery(data: HomeGallery) {
  return request({
    url: '/admin/home-gallery/add',
    method: 'post',
    data
  })
}

// 更新图片
export function updateHomeGallery(id: string, data: Partial<HomeGallery>) {
  return request({
    url: `/admin/home-gallery/update/${id}`,
    method: 'put',
    data
  })
}

// 删除图片
export function deleteHomeGallery(id: string) {
  return request({
    url: `/admin/home-gallery/delete/${id}`,
    method: 'delete'
  })
}

// 批量更新排序
export function updateHomeGallerySort(items: SortItem[]) {
  return request({
    url: '/admin/home-gallery/sort',
    method: 'put',
    data: { items }
  })
}
