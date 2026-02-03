// 活动话题相关API
import { request } from './api'

/**
 * 活动话题数据类型
 * 需求：3.1, 3.2 - 小程序话题选择
 */
export interface Activity {
  id: number
  name: string
  description?: string
  coverUrl?: string
  status?: number  // 0=草稿，1=已上线，2=已下线
  sortOrder?: number
  createTime?: string
  updateTime?: string
}

/**
 * 获取活动话题列表（小程序用）
 * 只返回状态为"已上线"的话题
 * 
 * 需求：3.1 - 从API加载活动话题列表
 * 需求：3.2 - 显示所有已上线的话题标签
 * 
 * @returns Promise<Activity[]> 已上线的活动话题列表
 * @throws 当网络请求失败或服务器返回错误时抛出异常
 */
export function getActivityList(): Promise<Activity[]> {
  return request<Activity[]>({
    url: '/activity/list',
    method: 'GET',
    showLoading: false  // 不显示loading，避免影响用户体验
  })
    .then(res => {
      // 请求成功，返回数据
      if (res.data && Array.isArray(res.data)) {
        return res.data
      }
      // 数据格式不正确
      console.error('活动话题列表数据格式错误:', res.data)
      throw new Error('数据格式错误')
    })
    .catch(error => {
      // 错误处理：记录日志并重新抛出
      console.error('获取活动话题列表失败:', error)
      throw error
    })
}

// 导出所有API
export const activityApi = {
  getActivityList
}

export default activityApi
