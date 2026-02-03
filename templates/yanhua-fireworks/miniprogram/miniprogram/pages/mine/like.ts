// pages/mine/like.ts
import api from '../../utils/api'

interface Video {
  id: number
  title: string
  coverUrl: string
  duration?: string
  views: number
  likes: number
  comments: number
  createTime: string
  isLiked: boolean
  isCollected: boolean
}

interface PageData {
  videoList: Video[]
  page: number
  pageSize: number
  total: number
  hasMore: boolean
  loading: boolean
}

Page<PageData, {}>({
  data: {
    videoList: [],
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadLikes()
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      videoList: [],
      hasMore: true
    })
    this.loadLikes()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      })
      this.loadLikes()
    }
  },

  async loadLikes() {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      const result = await api.getMyLikes({
        page: this.data.page,
        pageSize: this.data.pageSize
      })

      if (result.code === 200 && result.data) {
        const { total, records } = result.data
        const list = records || []
        const videoList = this.data.page === 1 ? list : [...this.data.videoList, ...list]
        
        this.setData({
          videoList,
          total,
          hasMore: videoList.length < total,
          loading: false
        })
      } else {
        wx.showToast({
          title: result.message || '加载失败',
          icon: 'none'
        })
        this.setData({ loading: false })
      }
    } catch (error) {
      console.error('加载点赞列表失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    } finally {
      wx.stopPullDownRefresh()
    }
  },

  goVideoDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/video/detail?id=${id}`
    })
  }
})
