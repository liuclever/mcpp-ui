// pages/mine/points-history.ts
import { checkPermission } from '../../utils/auth'

const api = require('../../utils/api')

interface PointsRecord {
  id: number
  userId: number
  points: number
  type: string
  reason: string
  createTime: string
}

Page({
  data: {
    userPoints: 0,
    records: [] as PointsRecord[],
    loading: true,
    hasMore: true,
    page: 1,
    pageSize: 20
  },

  async onLoad() {
    // 检查登录状态
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      return
    }
    
    this.loadUserInfo()
    this.loadRecords()
  },

  onPullDownRefresh() {
    this.setData({
      records: [],
      page: 1,
      hasMore: true
    })
    this.loadRecords()
  },

  // 加载用户信息获取当前积分
  async loadUserInfo() {
    try {
      // 直接调用积分计算接口获取最新积分
      const res = await api.request({
        url: '/user/points/total',
        method: 'GET'
      })
      console.log('积分总数返回:', res)
      if (res.code === 200 && res.data !== undefined) {
        this.setData({ userPoints: res.data })
      } else {
        // 备用：从用户信息获取
        const userRes = await api.getUserInfo()
        if (userRes.code === 200 && userRes.data) {
          this.setData({ userPoints: userRes.data.points || 0 })
        }
      }
    } catch (error) {
      console.error('获取积分失败:', error)
    }
  },

  // 加载积分记录
  async loadRecords() {
    if (!this.data.hasMore) return
    
    this.setData({ loading: true })
    
    try {
      const res = await api.request({
        url: '/user/points/history',
        method: 'GET',
        data: {
          page: this.data.page,
          pageSize: this.data.pageSize
        }
      })
      
      if (res.code === 200) {
        const newRecords = res.data.records || []
        const allRecords = this.data.page === 1 ? newRecords : [...this.data.records, ...newRecords]
        
        this.setData({
          records: allRecords,
          hasMore: newRecords.length >= this.data.pageSize,
          loading: false
        })
      } else {
        this.setData({ loading: false })
        wx.showToast({
          title: res.message || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载积分记录失败:', error)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.stopPullDownRefresh()
    }
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      })
      this.loadRecords()
    }
  },

  // 获取类型文字
  getTypeText(type: string): string {
    const typeMap: Record<string, string> = {
      'daily_login': '登录',
      'publish_video': '发布',
      'comment': '评论',
      'like': '点赞',
      'collect': '收藏',
      'share': '分享',
      'register': '注册',
      'admin_add': '奖励',
      'admin_deduct': '扣除'
    }
    return typeMap[type] || '其他'
  }
})
