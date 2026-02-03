import request from '@/utils/request'
import type { ApiResponse, PageParams, PageResult } from './types'

/**
 * 文件接口类型
 */
export interface FileInfo {
  id?: number
  fileName: string
  fileType: 'image' | 'video'
  fileUrl: string
  fileSize: number
  coverUrl?: string // 视频封面URL
  uploadTime?: string
}

/**
 * 文件列表查询参数
 */
export interface FileListParams extends PageParams {
  type?: 'image' | 'video'
}

/**
 * 文件上传结果
 */
export interface FileUploadResult {
  url: string
  coverUrl?: string
}

/**
 * 获取文件列表
 */
export function getFileList(params: FileListParams) {
  return request<ApiResponse<PageResult<FileInfo>>>({
    url: '/admin/files',
    method: 'get',
    params
  })
}

/**
 * 删除文件
 */
export function deleteFile(id: number) {
  return request<ApiResponse<void>>({
    url: `/admin/files/${id}`,
    method: 'delete'
  })
}

/**
 * 上传图片
 */
export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request<ApiResponse<string>>({
    url: '/admin/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 上传视频
 */
export function uploadVideo(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request<ApiResponse<FileUploadResult>>({
    url: '/admin/upload/video',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 文件API对象（用于组件中使用）
 */
export const fileApi = {
  getList: getFileList,
  delete: deleteFile,
  uploadImage,
  uploadVideo
}
