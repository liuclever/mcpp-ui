// 互动相关API（点赞、收藏、评论）
import { request } from './api'

// 评论数据类型
export interface Comment {
  id: string  // 改为string避免精度丢失
  videoId: string  // 改为string
  userId: number
  userName: string
  userAvatar: string
  content: string
  parentId: string | null  // 改为string
  replyToId: number | null
  replyToName?: string
  likes: number
  status: number  // 0=待审核, 1=已通过, 2=未通过
  createTime: string
  children?: Comment[]  // 子评论列表
}

// 产品评论数据类型
export interface ProductComment {
  id: string
  productId: string
  userId: number
  userName: string
  userAvatar: string
  content: string
  parentId: string | null
  replyToId: number | null
  replyToName?: string
  likes: number
  status: number
  createTime: string
  children?: ProductComment[]
}

// 评论列表查询参数
export interface CommentListParams {
  videoId: string  // 改为string
  parentId?: string  // 改为string
  page: number
  pageSize: number
}

// 评论列表响应
export interface CommentListResponse<T = Comment> {
  records: T[]
  total: number
  page: number
  pageSize: number
}

// 发布评论参数
export interface PublishCommentParams {
  videoId: string  // 改为string
  content: string
  parentId?: string  // 改为string
  replyToId?: number  // 被回复的用户ID
}

// 产品评论发布参数
export interface PublishProductCommentParams {
  productId: string
  content: string
  parentId?: string
  replyToId?: number
}

// 产品评论列表查询参数
export interface ProductCommentListParams {
  productId: string
  parentId?: string
  page: number
  pageSize: number
}

// 互动操作响应
export interface InteractionResponse {
  success: boolean
  message?: string
}

/**
 * 点赞视频
 * 需求：6 - 点赞和收藏功能
 */
export function likeVideo(videoId: string): Promise<InteractionResponse> {
  console.log('=== likeVideo API调用 ===')
  console.log('videoId:', videoId, 'type:', typeof videoId)
  console.log('URL:', `/interaction/like?videoId=${videoId}`)
  
  return request<void>({
    url: `/interaction/like?videoId=${videoId}`,
    method: 'POST',
    showLoading: false
  }).then(res => {
    console.log('likeVideo API响应:', res)
    return {
      success: res.code === 200,
      message: res.message
    }
  }).catch(err => {
    console.error('likeVideo API错误:', err)
    throw err
  })
}

/**
 * 取消点赞视频
 * 需求：6 - 点赞和收藏功能
 */
export function unlikeVideo(videoId: string): Promise<InteractionResponse> {
  console.log('=== unlikeVideo API调用 ===')
  console.log('videoId:', videoId, 'type:', typeof videoId)
  console.log('URL:', `/interaction/like?videoId=${videoId}`)
  
  return request<void>({
    url: `/interaction/like?videoId=${videoId}`,
    method: 'DELETE',
    showLoading: false
  }).then(res => {
    console.log('unlikeVideo API响应:', res)
    return {
      success: res.code === 200,
      message: res.message
    }
  }).catch(err => {
    console.error('unlikeVideo API错误:', err)
    throw err
  })
}

/**
 * 收藏视频
 * 需求：6 - 点赞和收藏功能
 */
export function collectVideo(videoId: string): Promise<InteractionResponse> {
  return request<void>({
    url: `/interaction/collect?videoId=${videoId}`,
    method: 'POST',
    showLoading: false
  }).then(res => {
    if (res.code === 200) {
      wx.showToast({ title: '收藏成功', icon: 'success', duration: 1500 })
    }
    return {
      success: res.code === 200,
      message: res.message
    }
  })
}

/**
 * 取消收藏视频
 * 需求：6 - 点赞和收藏功能
 */
export function uncollectVideo(videoId: string): Promise<InteractionResponse> {
  console.log('=== uncollectVideo API调用 ===')
  console.log('videoId:', videoId, 'type:', typeof videoId)
  console.log('URL:', `/interaction/collect?videoId=${videoId}`)
  
  return request<void>({
    url: `/interaction/collect?videoId=${videoId}`,
    method: 'DELETE',
    showLoading: false
  }).then(res => {
    console.log('uncollectVideo API响应:', res)
    return {
      success: res.code === 200,
      message: res.message
    }
  }).catch(err => {
    console.error('uncollectVideo API错误:', err)
    throw err
  })
}

/**
 * 发布评论
 * 需求：7 - 评论功能
 */
export function publishComment(params: PublishCommentParams): Promise<Comment> {
  return request<Comment>({
    url: '/interaction/comment',
    method: 'POST',
    data: params
  }).then(res => {
    wx.showToast({ title: '评论成功，等待审核', icon: 'success' })
    return res.data
  })
}

/**
 * 发布产品评论
 */
export function publishProductComment(params: PublishProductCommentParams): Promise<ProductComment> {
  return request<ProductComment>({
    url: '/product/comment',
    method: 'POST',
    data: params
  }).then(res => {
    wx.showToast({ title: '评论成功，等待审核', icon: 'success' })
    return res.data
  })
}

/**
 * 获取评论列表
 * 需求：7 - 评论功能
 */
export function getCommentList(params: CommentListParams): Promise<CommentListResponse> {
  return request<CommentListResponse>({
    url: '/interaction/comment/list',
    method: 'GET',
    data: params
  }).then(res => res.data)
}

/**
 * 获取产品评论列表
 */
export function getProductCommentList(params: ProductCommentListParams): Promise<CommentListResponse<ProductComment>> {
  return request<CommentListResponse<ProductComment>>({
    url: '/product/comment/list',
    method: 'GET',
    data: params
  }).then(res => res.data)
}

/**
 * 点赞评论
 * 需求：7 - 评论功能（扩展）
 */
export function likeComment(commentId: number): Promise<void> {
  return request<void>({
    url: '/interaction/comment/like',
    method: 'POST',
    data: { commentId },
    showLoading: false
  }).then(res => res.data)
}

/**
 * 取消点赞评论
 * 需求：7 - 评论功能（扩展）
 */
export function unlikeComment(commentId: number): Promise<void> {
  return request<void>({
    url: '/interaction/comment/like',
    method: 'DELETE',
    data: { commentId },
    showLoading: false
  }).then(res => res.data)
}

// 导出所有API
export const interactionApi = {
  likeVideo,
  unlikeVideo,
  collectVideo,
  uncollectVideo,
  publishComment,
  getCommentList,
  publishProductComment,
  getProductCommentList,
  likeComment,
  unlikeComment
}

export default interactionApi
