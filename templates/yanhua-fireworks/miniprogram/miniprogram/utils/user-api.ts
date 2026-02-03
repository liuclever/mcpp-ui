// 用户个人内容相关API
import { request } from './api'
import type { VideoListResponse } from './video-api'

// 个人内容列表查询参数
export interface UserContentParams {
  page: number
  pageSize: number
}

/**
 * 获取我的收藏列表
 * 需求：9 - 我的收藏页面
 */
export function getMyCollectList(params: UserContentParams): Promise<VideoListResponse> {
  return request<VideoListResponse>({
    url: '/user/video/collect/list',
    method: 'GET',
    data: params
  }).then(res => res.data)
}

/**
 * 获取我的点赞列表
 * 需求：10 - 我的点赞页面
 */
export function getMyLikeList(params: UserContentParams): Promise<VideoListResponse> {
  return request<VideoListResponse>({
    url: '/user/video/like/list',
    method: 'GET',
    data: params
  }).then(res => res.data)
}

/**
 * 获取我的发布列表
 * 需求：11 - 我的发布页面
 */
export function getMyPublishList(params: UserContentParams): Promise<VideoListResponse> {
  return request<VideoListResponse>({
    url: '/user/video/publish/list',
    method: 'GET',
    data: params
  }).then(res => res.data)
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<any> {
  return request<any>({
    url: '/user/info',
    method: 'GET'
  }).then(res => res.data)
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: {
  nickname?: string
  avatar?: string
  phone?: string
  region?: string
}): Promise<void> {
  return request<void>({
    url: '/user/update',
    method: 'POST',
    data
  }).then(res => {
    wx.showToast({ title: '更新成功', icon: 'success' })
    return res.data
  })
}

// 导出所有API
export const userApi = {
  getMyCollectList,
  getMyLikeList,
  getMyPublishList,
  getUserInfo,
  updateUserInfo
}

export default userApi
