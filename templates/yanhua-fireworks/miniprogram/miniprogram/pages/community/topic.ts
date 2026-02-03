// pages/community/topic.ts
import api from '../../utils/api'

interface Video {
  id: number
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
  createTime: string
}

Page({
  data: {
    topic: '',
    videos: [] as Video[],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    isEmpty: false
  },

  onLoad(options: any) {
    const { topic } = options
    if (topic) {
      this.setData({ topic: decodeURIComponent(topic) })
      wx.setNavigationBarTitle({
        title: `#${decodeURIComponent(topic)}`
      })
      this.loadVideoList(true)
    }
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadVideoList(false)
    }
  },

  /**
   * 加载话题视频列表
   */
  async loadVideoList(refresh: boolean) {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      const page = refresh ? 1 : this.data.page + 1
      const result = await api.request({
        url: `/video/topic/${encodeURIComponent(this.data.topic)}`,
        method: 'GET',
        data: {
          page,
          pageSize: this.data.pageSize
        }
      })

      if (result.code === 200 && result.data) {
        const newVideos = result.data.records || []
        const videos = refresh ? newVideos : [...this.data.videos, ...newVideos]
        
        this.setData({
          videos,
          page,
          hasMore: videos.length < result.data.total,
          isEmpty: videos.length === 0,
          loading: false
        })
      } else {
        this.setData({ loading: false })
        wx.showToast({
          title: result.message || '加载失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载话题视频失败:', error)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  /**
   * 点击视频
   */
  onVideoTap(e: any) {
    const { index } = e.currentTarget.dataset
    // 跳转到信息流页面
    wx.navigateTo({
      url: `/pages/community/feed?index=${index}&topic=${encodeURIComponent(this.data.topic)}`
    })
  }
})
