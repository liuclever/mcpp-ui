import request from '@/utils/request'
import type { 
  ApiResponse, 
  PageResult, 
  ProductVideo, 
  ProductVideoListParams,
  ProductVideoCountMap 
} from './types'

/**
 * 产品视频 API 模块
 * 用于管理产品相关的视频内容
 */

/**
 * 获取产品视频列表（分页）
 * @param productId 产品ID
 * @param params 查询参数（分页和状态筛选）
 */
export function getProductVideoList(productId: number, params: ProductVideoListParams) {
  return request<ApiResponse<PageResult<ProductVideo>>>({
    url: `/admin/product-videos/product/${productId}`,
    method: 'get',
    params
  })
}

/**
 * 创建产品视频
 * @param data 产品视频数据
 */
export function createProductVideo(data: Partial<ProductVideo>) {
  return request<ApiResponse<ProductVideo>>({
    url: '/admin/product-videos',
    method: 'post',
    data
  })
}

/**
 * 更新产品视频
 * @param id 视频ID
 * @param data 更新的数据
 */
export function updateProductVideo(id: number, data: Partial<ProductVideo>) {
  return request<ApiResponse<void>>({
    url: `/admin/product-videos/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除产品视频
 * @param id 视频ID
 */
export function deleteProductVideo(id: number) {
  return request<ApiResponse<void>>({
    url: `/admin/product-videos/${id}`,
    method: 'delete'
  })
}

/**
 * 获取单个产品的视频数量
 * @param productId 产品ID
 */
export function getProductVideoCount(productId: number) {
  return request<ApiResponse<number>>({
    url: `/product/${productId}/video-count`,
    method: 'get'
  })
}

/**
 * 批量获取产品视频数量
 * @param productIds 产品ID列表
 */
export function getBatchProductVideoCounts(productIds: number[]) {
  return request<ApiResponse<ProductVideoCountMap>>({
    url: '/product/video-counts',
    method: 'post',
    data: productIds
  })
}

/**
 * 产品视频 API 对象（可选的导出方式）
 */
export const productVideoApi = {
  getList: getProductVideoList,
  create: createProductVideo,
  update: updateProductVideo,
  delete: deleteProductVideo,
  getCount: getProductVideoCount,
  getBatchCounts: getBatchProductVideoCounts
}

export default productVideoApi
