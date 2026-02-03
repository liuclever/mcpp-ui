// pages/mine/publish.ts
import { getVideoList, deleteVideo, type Video } from '../../utils/video-api'
import { checkPageAccessOnLoad } from '../../utils/force-bind'

Page({
  data: {
    videos: [] as Video[],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    isEmpty: false,
    userId: 0
  },

  async onLoad() {
    // 检查页面访问权限
    // 需求: 6.4 - 限制未绑定用户访问部分功能
    const canAccess = await checkPageAccessOnLoad(this.route || '')
    if (!canAccess) {
      return // 页面被限制访问，已自动跳转
    }
    
    // 获取当前用户ID
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.id) {
      this.setData({ userId: userInfo.id })
      this.loadMyVideos(true)
    } else {
      // 未登录，跳转到登录页
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/login' })
          } else {
            wx.navigateBack()
          }
        }
      })
    }
  },

  onShow() {
    // 页面显示时刷新数据
    if (this.data.userId && this.data.videos.length > 0) {
      this.loadMyVideos(true)
    }
  },

  onPullDownRefresh() {
    this.loadMyVideos(true)
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMyVideos(false)
    }
  },

  /**
   * 加载我的视频列表
   * @param refresh 是否刷新
   */
  async loadMyVideos(refresh: boolean) {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      const page = refresh ? 1 : this.data.page + 1
      const result = await getVideoList({
        page,
        pageSize: this.data.pageSize,
        userId: this.data.userId // 只查询当前用户的视频
      })

      const newVideos = result.records || []
      const videos = refresh ? newVideos : [...this.data.videos, ...newVideos]
      
      this.setData({
        videos,
        page,
        hasMore: videos.length < result.total,
        isEmpty: videos.length === 0,
        loading: false
      })

      // 停止下拉刷新动画
      if (refresh) {
        wx.stopPullDownRefresh()
      }
    } catch (error) {
      console.error('加载视频列表失败:', error)
      this.setData({ loading: false })
      
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  /**
   * 获取状态文本
   */
  getStatusText(status: number): string {
    switch (status) {
      case 0: return '待审核'
      case 1: return '已通过'
      case 2: return '未通过'
      default: return '未知'
    }
  },

  /**
   * 获取状态样式类
   */
  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-pending'
      case 1: return 'status-approved'
      case 2: return 'status-rejected'
      default: return ''
    }
  },

  /**
   * 查看视频详情
   */
  onVideoTap(e: any) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/community/detail?id=${id}`
    })
  },

  /**
   * 删除视频
   */
  onDeleteVideo(e: any) {
    const { id, index } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个视频吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...', mask: true })
            
            await deleteVideo(id)
            
            wx.hideLoading()
            
            // 从列表中移除
            const videos = [...this.data.videos]
            videos.splice(index, 1)
            
            this.setData({
              videos,
              isEmpty: videos.length === 0
            })
            
          } catch (error: any) {
            wx.hideLoading()
            console.error('删除失败:', error)
            wx.showToast({
              title: error.message || '删除失败',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  /**
   * 跳转到发布页面
   */
  goPublish() {
    wx.navigateTo({
      url: '/pages/community/upload'
    })
  }
})
