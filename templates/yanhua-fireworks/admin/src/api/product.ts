import request from '@/utils/request'
import type { ApiResponse, PageResult, PageParams, Product, Category } from './types'

/**
 * 获取产品分类（树形结构）
 */
export function getCategories() {
  return request<ApiResponse<Category[]>>({
    url: '/product/categories',
    method: 'get'
  })
}

/**
 * 获取子分类列表（用于产品关联）
 */
export function getChildCategories() {
  return request<ApiResponse<Category[]>>({
    url: '/product/categories/children',
    method: 'get'
  })
}

/**
 * 获取产品列表（分页）
 */
export function getProductList(params: PageParams & { categoryId?: number; sort?: string }) {
  return request<ApiResponse<PageResult<Product>>>({
    url: '/product/list',
    method: 'get',
    params
  })
}

/**
 * 获取产品详情
 */
export function getProductDetail(id: number) {
  return request<ApiResponse<Product>>({
    url: `/product/detail/${id}`,
    method: 'get'
  })
}

/**
 * 搜索产品
 */
export function searchProducts(keyword: string) {
  return request<ApiResponse<Product[]>>({
    url: '/product/search',
    method: 'get',
    params: { keyword }
  })
}

/**
 * 添加产品（管理员）
 */
export function addProduct(data: Partial<Product>) {
  return request<ApiResponse<void>>({
    url: '/product/add',
    method: 'post',
    data
  })
}

/**
 * 更新产品（管理员）
 */
export function updateProduct(data: Product) {
  return request<ApiResponse<void>>({
    url: '/product/update',
    method: 'put',
    data
  })
}

/**
 * 删除产品（管理员）
 */
export function deleteProduct(id: number) {
  return request<ApiResponse<void>>({
    url: `/product/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 添加分类（管理员）
 */
export function addCategory(data: Partial<Category>) {
  return request<ApiResponse<void>>({
    url: '/product/category/add',
    method: 'post',
    data
  })
}

/**
 * 更新分类（管理员）
 */
export function updateCategory(data: Category) {
  return request<ApiResponse<void>>({
    url: '/product/category/update',
    method: 'put',
    data
  })
}

/**
 * 删除分类（管理员）
 */
export function deleteCategory(id: number) {
  return request<ApiResponse<void>>({
    url: `/product/category/delete/${id}`,
    method: 'delete'
  })
}
