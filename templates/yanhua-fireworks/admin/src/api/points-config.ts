import request from '@/utils/request'

export interface PointsConfig {
  id: number
  ruleCode: string
  ruleName: string
  points: number
  dailyLimit: number
  description: string
  enabled: number
  createTime?: string
  updateTime?: string
}

/**
 * 获取所有积分规则配置
 */
export function getPointsConfigList() {
  return request({
    url: '/admin/points-config/list',
    method: 'get'
  })
}

/**
 * 根据ID获取积分规则配置
 */
export function getPointsConfigById(id: number) {
  return request({
    url: `/admin/points-config/${id}`,
    method: 'get'
  })
}

/**
 * 更新积分规则配置
 */
export function updatePointsConfig(id: number, data: Partial<PointsConfig>) {
  return request({
    url: `/admin/points-config/${id}`,
    method: 'put',
    data
  })
}

/**
 * 批量更新积分规则配置
 */
export function batchUpdatePointsConfig(configs: Partial<PointsConfig>[]) {
  return request({
    url: '/admin/points-config/batch',
    method: 'put',
    data: configs
  })
}

/**
 * 切换规则启用状态
 */
export function togglePointsConfig(id: number) {
  return request({
    url: `/admin/points-config/${id}/toggle`,
    method: 'put'
  })
}
