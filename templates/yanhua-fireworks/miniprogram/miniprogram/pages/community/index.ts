// pages/community/index.ts
console.log('===== 社区页面文件已加载 =====', new Date().toLocaleString())

import { getVideoList } from '../../utils/video-api'
import api from '../../utils/api'

interface Banner {
  id: number
  title: string
  imageUrl: string
  topic: string
  sortOrder: number
  status: number
}

interface Activity {
  id: number
  name: string
  description: string
  coverUrl: string
  status: number
  sortOrder: number
}

interface Video {
  id: string  // 使用string避免JavaScript精度丢失
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
    banners: [] as Banner[],
    activities: [] as Activity[],
    videos: [] as Video[],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    refreshing: false,
    isEmpty: false,
    layoutMode: 'double' as 'single' | 'double', // 布局模式：single=单列，double=双列
    sortType: 'views' as 'views' | 'comments' | 'collects', // 排序类型：views=播放数，comments=评论数，collects=收藏数
    sortOrder: 'desc' as 'desc' | 'asc' // 排序方向：desc=降序，asc=升序
  },

  onLoad() {
    console.log('===== onLoad 方法执行了！=====')
    console.log('当前时间:', new Date().toLocaleString())
    
    // 显示一个Toast，确认页面加载
    wx.showToast({
      title: 'onLoad执行了',
      icon: 'none',
      duration: 2000
    })
    
    // 读取用户偏好的布局模式
    const savedLayoutMode = wx.getStorageSync('community_layout_mode')
    if (savedLayoutMode) {
      this.setData({
        layoutMode: savedLayoutMode
      })
    }
    
    // 加载活动列表和视频列表
    this.loadActivities()
    this.loadVideoList(true)
  },

  onShow() {
    // 页面显示时刷新数据（可能有新的点赞/收藏状态）
    if (this.data.videos.length > 0) {
      this.loadVideoList(true)
    }
  },

  onPullDownRefresh() {
    this.loadVideoList(true)
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadVideoList(false)
    }
  },

  /**
   * 活动卡片点击事件
   */
  onActivityTap(e: any) {
    console.log('===== Banner点击事件触发 =====')
    console.log('事件对象:', e)
    console.log('dataset:', e.currentTarget.dataset)
    const { name } = e.currentTarget.dataset
    console.log('活动名称:', name)
    console.log('活动名称类型:', typeof name)
    console.log('活动名称长度:', name ? name.length : 0)
    
    if (name) {
      console.log('准备跳转到话题页面:', name)
      const encodedName = encodeURIComponent(name)
      console.log('编码后的名称:', encodedName)
      const url = `/pages/community/topic?topic=${encodedName}`
      console.log('跳转URL:', url)
      
      // 跳转到话题页面，使用活动名称作为话题
      wx.navigateTo({
        url: url,
        success: () => {
          console.log('跳转成功')
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          wx.showToast({
            title: '跳转失败: ' + err.errMsg,
            icon: 'none',
            duration: 3000
          })
        }
      })
    } else {
      console.log('活动名称为空，无法跳转')
      console.log('当前activities数据:', this.data.activities)
      wx.showToast({
        title: '活动数据未加载',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 加载活动列表（Banner话题）
   * 只显示后台设置为Banner的前2个话题
   */
  async loadActivities() {
    console.log('===== 开始加载Banner活动列表 =====')
    try {
      const result = await api.request({
        url: '/activity/banner',
        method: 'GET'
      })

      console.log('Banner活动API响应:', result)
      console.log('响应code:', result.code)
      console.log('响应data:', result.data)

      if (result.code === 200 && result.data) {
        console.log('Banner活动数量:', result.data.length)
        console.log('Banner活动列表:', result.data)
        
        this.setData({
          activities: result.data
        })
        
        console.log('Banner活动数据已设置到页面')
        console.log('当前activities:', this.data.activities)
        
        // 验证Banner活动的名称
        if (this.data.activities.length > 0) {
          this.data.activities.forEach((activity, index) => {
            console.log(`Banner ${index + 1} 名称:`, activity.name)
          })
        }
      } else {
        console.error('Banner活动API返回错误:', result)
        wx.showToast({
          title: '加载Banner失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载Banner活动列表失败:', error)
      wx.showToast({
        title: '加载Banner失败: ' + (error as any).message,
        icon: 'none'
      })
    }
  },

  /**
   * 话题卡片点击事件
   */
  onTopicTap(e: any) {
    const { topic } = e.currentTarget.dataset
    if (topic) {
      // 跳转到话题页面
      wx.navigateTo({
        url: `/pages/community/topic?topic=${encodeURIComponent(topic)}`
      })
    }
  },

  /**
   * 加载视频列表
   * @param refresh 是否刷新（true=重新加载第一页，false=加载下一页）
   */
  async loadVideoList(refresh: boolean) {
    if (this.data.loading) return

    console.log('=== loadVideoList 开始 ===')
    console.log('refresh:', refresh)
    console.log('当前page:', this.data.page)

    this.setData({ 
      loading: true,
      refreshing: refresh
    })

    try {
      const page = refresh ? 1 : this.data.page + 1
      console.log('请求参数:', { page, pageSize: this.data.pageSize, status: 1 })
      
      const result = await getVideoList({
        page,
        pageSize: this.data.pageSize,
        status: 1 // 只显示审核通过的视频
      })

      console.log('API返回结果:', result)
      console.log('result类型:', typeof result)
      console.log('result.records:', result.records)
      console.log('result.total:', result.total)

      // getVideoList已经返回了res.data，所以直接访问records和total
      const newVideos = result.records || []
      const total = result.total || 0
      
      console.log('newVideos数量:', newVideos.length)
      console.log('total:', total)
      console.log('newVideos内容:', newVideos)
      
      const videos = refresh ? newVideos : [...this.data.videos, ...newVideos]
      console.log('最终videos数量:', videos.length)
      
      const isEmpty = videos.length === 0
      console.log('isEmpty:', isEmpty)
      
      this.setData({
        videos,
        page,
        hasMore: videos.length < total,
        isEmpty: isEmpty,
        loading: false,
        refreshing: false
      })

      console.log('setData完成，当前状态:', {
        videosCount: this.data.videos.length,
        isEmpty: this.data.isEmpty,
        hasMore: this.data.hasMore
      })

      // 停止下拉刷新动画
      if (refresh) {
        wx.stopPullDownRefresh()
      }
    } catch (error) {
      console.error('加载视频列表失败:', error)
      this.setData({ 
        loading: false,
        refreshing: false
      })
      
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    }
  },

  /**
   * 点击视频卡片
   */
  onVideoTap(e: any) {
    const { index } = e.currentTarget.dataset
    
    // 将当前视频列表保存到全局数据中
    const app = getApp<IAppOption>()
    if (!app.globalData) {
      app.globalData = {} as any
    }
    (app.globalData as any).communityVideos = this.data.videos;
    (app.globalData as any).communityVideoIndex = index
    
    // 跳转到信息流页面，从当前视频开始播放
    wx.navigateTo({
      url: `/pages/community/feed?index=${index}&from=community`
    })
  },

  /**
   * 切换布局模式
   */
  toggleLayout() {
    const newMode = this.data.layoutMode === 'double' ? 'single' : 'double'
    this.setData({
      layoutMode: newMode
    })
    
    // 保存用户偏好
    wx.setStorageSync('community_layout_mode', newMode)
  },

  /**
   * 切换排序方式
   */
  onSortChange(e: any) {
    const { type } = e.currentTarget.dataset
    
    // 如果点击的是当前已选中的排序类型，切换排序方向
    if (type === this.data.sortType) {
      const newOrder = this.data.sortOrder === 'desc' ? 'asc' : 'desc'
      this.setData({
        sortOrder: newOrder
      })
    } else {
      // 如果点击的是不同的排序类型，切换类型并重置为降序
      this.setData({
        sortType: type,
        sortOrder: 'desc'
      })
    }
    
    // 重新排序视频列表
    this.sortVideos()
  },

  /**
   * 排序视频列表
   */
  sortVideos() {
    const { videos, sortType, sortOrder } = this.data
    const sortedVideos = [...videos].sort((a, b) => {
      const aValue = a[sortType] || 0
      const bValue = b[sortType] || 0
      
      // 根据排序方向决定排序顺序
      if (sortOrder === 'desc') {
        return bValue - aValue  // 降序：大的在前
      } else {
        return aValue - bValue  // 升序：小的在前
      }
    })
    
    this.setData({
      videos: sortedVideos
    })
  },

  /**
   * 跳转到发布页面
   */
  onPublish() {
    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/login' })
          }
        }
      })
      return
    }

    wx.navigateTo({
      url: '/pages/community/upload'
    })
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '正攀烟花社区 - 分享烟花精彩瞬间',
      path: '/pages/community/index',
      imageUrl: 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/share-cover.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '正攀烟花社区 - 分享烟花精彩瞬间',
      query: '',
      imageUrl: 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/share-cover.png'
    }
  }
})
