import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from './types'

export interface Video {
  id: number | string // 支持string类型以避免JavaScript精度丢失
  userId: number
  userName?: string
  userAvatar?: string
  title?: string
  description?: string
  videoUrl: string
  coverUrl?: string
  location?: string
  status: number // 0-待审核 1-已通过 2-未通过 3-已删除
  isTop: number
  topOrder: number
  views: number
  likes: number
  collects: number
  comments: number
  shares: number
  createTime: string
  updateTime: string
}

export interface VideoListParams {
  status?: number
  userId?: number
  page?: number
  pageSize?: number
}

export interface VideoListResponse {
  records: Video[]
  total: number
  page: number
  pageSize: number
}

// 获取视频列表
export const getVideoList = (params: VideoListParams): Promise<AxiosResponse<ApiResponse<VideoListResponse>>> => {
  return request.get<ApiResponse<VideoListResponse>>('/video/list', { params })
}

// 获取视频详情
export const getVideoDetail = (id: number | string): Promise<AxiosResponse<ApiResponse<Video>>> => {
  return request.get<ApiResponse<Video>>(`/video/detail/${id}`)
}

// 删除视频（管理员接口，不验证用户权限）
export const deleteVideo = (id: number | string): Promise<AxiosResponse<ApiResponse<any>>> => {
  return request.delete(`/video/admin/delete/${id}`)
}

// 审核视频
export const auditVideo = (id: number | string, status: number, reason?: string): Promise<AxiosResponse<ApiResponse<any>>> => {
  const params: any = { status }
  if (reason) params.reason = reason
  return request.post(`/video/audit/${id}`, null, { params })
}

// 置顶视频
export const topVideo = (id: number | string, isTop: number, topOrder?: number): Promise<AxiosResponse<ApiResponse<any>>> => {
  const params: any = { isTop }
  if (topOrder !== undefined) params.topOrder = topOrder
  return request.post(`/video/top/${id}`, null, { params })
}

// 上传视频
export const uploadVideo = (formData: FormData): Promise<AxiosResponse<ApiResponse<any>>> => {
  return request.post('/video/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
