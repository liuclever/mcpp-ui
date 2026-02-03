import request from '@/utils/request'

/**
 * 视频配置接口
 */
export interface VideoConfig {
  title: string
  coverUrl: string
  videoUrl: string
}

/**
 * 获取首页视频配置
 */
export function getHomeVideoConfig() {
  return request({
    url: '/home/video-config',
    method: 'get'
  })
}

/**
 * 更新首页视频配置
 */
export function updateHomeVideoConfig(data: VideoConfig) {
  return request({
    url: '/admin/home/video-config',
    method: 'put',
    data
  })
}

/**
 * 获取产品首页视频配置
 */
export function getProductVideoConfig() {
  return request({
    url: '/product/video-config',
    method: 'get'
  })
}

/**
 * 更新产品首页视频配置
 */
export function updateProductVideoConfig(data: VideoConfig) {
  return request({
    url: '/admin/product/video-config',
    method: 'put',
    data
  })
}

/**
 * 获取产品页视频1配置
 */
export function getProductVideo1Config() {
  return request({
    url: '/admin/product/video1-config',
    method: 'get'
  })
}

/**
 * 更新产品页视频1配置
 */
export function updateProductVideo1Config(data: VideoConfig) {
  return request({
    url: '/admin/product/video1-config',
    method: 'put',
    data
  })
}

/**
 * 获取产品页视频2配置
 */
export function getProductVideo2Config() {
  return request({
    url: '/admin/product/video2-config',
    method: 'get'
  })
}

/**
 * 更新产品页视频2配置
 */
export function updateProductVideo2Config(data: VideoConfig) {
  return request({
    url: '/admin/product/video2-config',
    method: 'put',
    data
  })
}
