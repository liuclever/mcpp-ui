// 视频相关API
import { request } from './api'

// 视频数据类型
export interface Video {
  id: string  // 改为string避免JavaScript精度丢失
  title: string
  description: string
  videoUrl: string
  coverUrl: string
  userId: number
  userName: string
  userAvatar: string
  location: string
  views: number
  likes: number
  collects: number
  comments: number
  shares: number
  isLiked: boolean
  isCollected: boolean
  status: number  // 0=待审核, 1=已通过, 2=未通过
  rejectReason?: string
  createTime: string
  productNames?: string[]  // 相关产品名称列表
}

// 视频列表查询参数
export interface VideoListParams {
  page: number
  pageSize: number
  status?: number  // 1=已通过（默认只显示已通过的）
  userId?: number  // 查询指定用户的视频
}

// 视频列表响应
export interface VideoListResponse {
  records: Video[]
  total: number
  page: number
  pageSize: number
}

// 视频上传参数
export interface VideoUploadParams {
  title: string
  description?: string
  location?: string  // 需求：4.2, 4.3, 4.4 - 地理位置字段保留但为可选
  productId?: number  // 关联的产品ID
  topicIds?: number[]  // 需求：3.4 - 话题ID列表
}

// 视频上传响应
export interface VideoUploadResponse {
  id: number
  videoUrl: string
  coverUrl: string
}

/**
 * 获取视频列表
 * 需求：2 - 视频列表展示
 */
export function getVideoList(params: VideoListParams): Promise<VideoListResponse> {
  return request<VideoListResponse>({
    url: '/video/list',
    method: 'GET',
    data: params
  }).then(res => res.data)
}

/**
 * 获取视频详情
 * 需求：5 - 视频详情页
 */
export function getVideoDetail(id: string): Promise<Video> {
  return request<Video>({
    url: `/video/detail/${id}`,
    method: 'GET'
  }).then(res => res.data)
}

/**
 * 上传视频封面
 * 
 * @param filePath 本地图片文件路径
 */
export function uploadCover(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    if (!token) {
      reject(new Error('未登录'))
      return
    }

    wx.uploadFile({
      url: 'https://fireworks-project.zhengpan.cn/api/upload/image',
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        try {
          const result = JSON.parse(res.data)
          if (result.code === 200 && result.data && result.data.url) {
            resolve(result.data.url)
          } else {
            reject(new Error(result.message || '上传封面失败'))
          }
        } catch (error) {
          reject(error)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 上传视频
 * 需求：1 - 视频发布功能
 * 
 * @param filePath 本地视频文件路径
 * @param coverPath 本地封面图片路径（可选）
 * @param params 视频信息（标题、描述、位置）
 * @param onProgress 上传进度回调
 */
export function uploadVideo(
  filePath: string,
  coverPath: string | undefined,
  params: VideoUploadParams,
  onProgress?: (progress: number) => void
): Promise<VideoUploadResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      // 显示上传中提示
      wx.showLoading({ title: '上传中...', mask: true })

      const token = wx.getStorageSync('token')
      if (!token) {
        wx.hideLoading()
        wx.showToast({ title: '请先登录', icon: 'none' })
        reject(new Error('未登录'))
        return
      }

      // 如果有封面，先上传封面
      let coverUrl = ''
      if (coverPath) {
        try {
          wx.showLoading({ title: '上传封面...', mask: true })
          coverUrl = await uploadCover(coverPath)
          console.log('封面上传成功:', coverUrl)
        } catch (error) {
          console.error('封面上传失败:', error)
          // 封面上传失败不影响视频上传，继续
        }
      }

      // 上传视频
      wx.showLoading({ title: '上传视频...', mask: true })
      
      const formData: any = {
        title: params.title,
        description: params.description || '',
        location: params.location || '',  // 需求：4.3 - 地理位置可以为空
        productId: params.productId ? String(params.productId) : '',
        topicIds: params.topicIds ? params.topicIds.join(',') : ''  // 需求：3.4 - 发送话题ID列表
      }
      
      // 如果有封面URL，添加到formData
      if (coverUrl) {
        formData.coverUrl = coverUrl
      }

      const uploadTask = wx.uploadFile({
        url: 'https://fireworks-project.zhengpan.cn/api/video/upload',
        filePath: filePath,
        name: 'file',
        formData: formData,
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: (res) => {
          wx.hideLoading()
          
          try {
            const result = JSON.parse(res.data)
            if (result.code === 200) {
              wx.showToast({ title: '发布成功，等待审核', icon: 'success' })
              resolve(result.data)
            } else {
              wx.showToast({ title: result.message || '上传失败', icon: 'none' })
              reject(result)
            }
          } catch (error) {
            wx.showToast({ title: '上传失败', icon: 'none' })
            reject(error)
          }
        },
        fail: (err) => {
          wx.hideLoading()
          wx.showToast({ title: '上传失败', icon: 'none' })
          reject(err)
        }
      })

      // 监听上传进度
      if (onProgress) {
        uploadTask.onProgressUpdate((res) => {
          onProgress(res.progress)
        })
      }
    } catch (error) {
      wx.hideLoading()
      reject(error)
    }
  })
}

/**
 * 删除视频
 * 需求：11 - 我的发布页面
 */
export function deleteVideo(id: string): Promise<void> {
  return request<void>({
    url: `/video/delete/${id}`,
    method: 'DELETE'
  }).then(res => {
    wx.showToast({ title: '删除成功', icon: 'success' })
    return res.data
  })
}

// 导出所有API
export const videoApi = {
  getVideoList,
  getVideoDetail,
  uploadVideo,
  deleteVideo
}

export default videoApi
