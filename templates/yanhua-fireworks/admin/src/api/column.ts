import request from '@/utils/request'

/**
 * 栏目配置接口
 */
export interface ColumnConfig {
  id?: number
  name: string
  type: 'single' | 'list' | 'map' | 'form'
  displayMode?: 'text' | 'image-text' | 'image-grid'
  icon?: string
  description?: string
  sortOrder?: number
  enabled?: boolean
  isSystem?: boolean
  createTime?: string
  updateTime?: string
}

/**
 * 获取所有栏目列表
 */
export function getAllColumns() {
  return request({
    url: '/admin/columns',
    method: 'get'
  })
}

/**
 * 根据ID获取栏目
 */
export function getColumnById(id: number) {
  return request({
    url: `/admin/columns/${id}`,
    method: 'get'
  })
}

/**
 * 创建栏目
 */
export function createColumn(data: ColumnConfig) {
  return request({
    url: '/admin/columns',
    method: 'post',
    data
  })
}

/**
 * 更新栏目
 */
export function updateColumn(id: number, data: ColumnConfig) {
  return request({
    url: `/admin/columns/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除栏目
 */
export function deleteColumn(id: number) {
  return request({
    url: `/admin/columns/${id}`,
    method: 'delete'
  })
}

/**
 * 更新栏目状态
 */
export function updateColumnStatus(id: number, enabled: boolean) {
  return request({
    url: `/admin/columns/${id}/status`,
    method: 'put',
    params: { enabled }
  })
}

/**
 * 更新栏目排序
 */
export function updateColumnSort(columns: ColumnConfig[]) {
  return request({
    url: '/admin/columns/sort',
    method: 'put',
    data: columns
  })
}
