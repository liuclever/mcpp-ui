import request from '@/utils/request'

/**
 * 销售网点接口
 */
export interface SalesPoint {
  id?: number
  name: string
  province: string
  city: string
  district?: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  businessHours?: string
  images?: string
  enabled: number
  createTime?: string
  updateTime?: string
}

/**
 * 网点列表查询参数
 */
export interface SalesPointListParams {
  page?: number
  pageSize?: number
  province?: string
  city?: string
  keyword?: string
}

/**
 * 地址解析结果
 */
export interface GeocodeResult {
  latitude: number
  longitude: number
}

/**
 * 获取销售网点列表（管理后台）
 */
export function getSalesPointList(params: SalesPointListParams) {
  return request({
    url: '/admin/sales-points',
    method: 'get',
    params
  })
}

/**
 * 获取销售网点详情
 */
export function getSalesPointDetail(id: number) {
  return request({
    url: `/admin/sales-points/${id}`,
    method: 'get'
  })
}

/**
 * 新增销售网点
 */
export function createSalesPoint(data: SalesPoint) {
  return request({
    url: '/admin/sales-points',
    method: 'post',
    data
  })
}

/**
 * 更新销售网点
 */
export function updateSalesPoint(id: number, data: SalesPoint) {
  return request({
    url: `/admin/sales-points/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除销售网点
 */
export function deleteSalesPoint(id: number) {
  return request({
    url: `/admin/sales-points/${id}`,
    method: 'delete'
  })
}

/**
 * 地址解析（获取经纬度）
 */
export function geocodeAddress(address: string) {
  return request({
    url: '/admin/geocode',
    method: 'get',
    params: { address }
  })
}
