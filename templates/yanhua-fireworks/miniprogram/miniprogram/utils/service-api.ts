/**
 * 服务中心API工具函数
 * 提供服务中心内容的查询接口
 */

import { request } from './api'

/**
 * 服务中心内容接口
 */
export interface ServiceContent {
  id: number
  category: string  // 分类：guide=使用指南, safety=安全须知, faq=常见问题
  subCategory?: string  // 二级分类（仅FAQ使用）
  title: string  // 标题
  content: string  // 内容（富文本HTML）
  coverImage?: string  // 封面图片URL
  videoUrl?: string  // 视频URL
  status: number  // 状态：0=草稿，1=已发布
  sortOrder: number  // 排序序号
  viewCount: number  // 浏览次数
  createTime: string  // 创建时间
  updateTime: string  // 更新时间
}

/**
 * 获取服务中心内容列表
 * @param category 分类（guide/safety/faq）
 * @param subCategory 二级分类（可选，仅FAQ使用）
 * @returns 内容列表
 */
export async function getServiceList(
  category: string,
  subCategory?: string
): Promise<ServiceContent[]> {
  try {
    const params: any = { category }
    if (subCategory) {
      params.subCategory = subCategory
    }

    const result = await request<ServiceContent[]>({
      url: '/service/list',
      method: 'GET',
      data: params,
      showLoading: true
    })

    return result.data || []
  } catch (error) {
    console.error('[服务中心] 获取内容列表失败:', error)
    return []
  }
}

/**
 * 获取服务中心内容详情
 * @param id 内容ID
 * @returns 内容详情
 */
export async function getServiceDetail(id: number): Promise<ServiceContent | null> {
  try {
    const result = await request<ServiceContent>({
      url: `/service/detail/${id}`,
      method: 'GET',
      showLoading: true
    })

    return result.data || null
  } catch (error) {
    console.error('[服务中心] 获取内容详情失败:', error)
    wx.showToast({
      title: '加载失败',
      icon: 'none'
    })
    return null
  }
}

/**
 * 搜索服务中心内容
 * @param keyword 搜索关键词
 * @returns 搜索结果列表
 */
export async function searchService(keyword: string): Promise<ServiceContent[]> {
  try {
    if (!keyword || keyword.trim() === '') {
      return []
    }

    const result = await request<ServiceContent[]>({
      url: '/service/search',
      method: 'GET',
      data: { keyword: keyword.trim() },
      showLoading: true
    })

    return result.data || []
  } catch (error) {
    console.error('[服务中心] 搜索内容失败:', error)
    return []
  }
}

/**
 * 分类枚举
 */
export const ServiceCategory = {
  GUIDE: 'guide',      // 使用指南
  SAFETY: 'safety',    // 安全须知
  FAQ: 'faq'           // 常见问题
} as const

/**
 * 分类显示名称映射
 */
export const CategoryNames: Record<string, string> = {
  guide: '使用指南',
  safety: '安全须知',
  faq: '常见问题'
}

/**
 * 获取分类显示名称
 * @param category 分类代码
 * @returns 分类显示名称
 */
export function getCategoryName(category: string): string {
  return CategoryNames[category] || category
}
