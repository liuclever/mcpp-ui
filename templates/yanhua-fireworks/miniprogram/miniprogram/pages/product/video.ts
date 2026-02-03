// pages/product/video.ts
import api from '../../utils/api'

Page({
  data: {
    productId: '',
    videoType: 'video', // 'video' 或 'tutorial'
    videoUrl: '',
    isPlaying: false,
    isFullScreen: false,
    isLiked: false,
    likeCount: 0,
    currentTime: '00:00',
    totalTime: '01:05',
    progress: 0,
    durationSeconds: 0,
    playbackRate: 1.0,
    showSpeedModal: false,
    burnDurationTip: '',
    product: {
      name: '愤怒的小鸟A',
      nameEn: 'ZHENGPANYANHUA',
      code: 'CQ00316',
      content: '6/50/35'
    }
  },

  videoContext: null as WechatMiniprogram.VideoContext | null,

  onLoad(options) {
    const videoType = options.type === 'tutorial' ? 'tutorial' : 'video'
    if (options.id) {
      this.setData({ productId: options.id, videoType })
      this.loadVideoInfo(options.id, videoType)
    }
    this.videoContext = wx.createVideoContext('productVideo')
  },

  // 加载视频信息
  loadVideoInfo(id: string, videoType: string = 'video') {
    api.getProductDetail(id).then((res: any) => {
      const product = res.data
      console.log('产品详情:', product)

      const likedKey = `productVideoLiked_${id}`
      const isLiked = !!wx.getStorageSync(likedKey)
      
      // 根据类型选择视频或教程URL
      const url = videoType === 'tutorial' ? (product.tutorialUrl || '') : (product.videoUrl || '')
      const noVideoMsg = videoType === 'tutorial' ? '该产品暂无教程' : '该产品暂无视频'
      
      // 设置产品信息和视频URL
      // 如果后台配置了燃放时长，优先使用配置值
      const burnTip = product.burnDuration ? `正常燃放时长约${product.burnDuration}秒` : ''
      
      this.setData({
        product: {
          name: product.name || '',
          nameEn: product.nameEn || '',
          code: product.code || '',
          content: product.content || ''
        },
        videoUrl: url,
        burnDurationTip: burnTip,
        likeCount: typeof product.likes === 'number' ? product.likes : (this.data.likeCount || 0),
        isLiked
      })
      
      if (!url) {
        wx.showToast({
          title: noVideoMsg,
          icon: 'none'
        })
      }
    }).catch((err: any) => {
      console.error('加载产品详情失败:', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  },

  // 播放/暂停切换
  togglePlay() {
    if (this.data.isPlaying) {
      this.videoContext?.pause()
    } else {
      this.videoContext?.play()
    }
  },

  onPlay() {
    this.setData({ isPlaying: true })
  },

  onPause() {
    this.setData({ isPlaying: false })
  },

  onEnded() {
    this.setData({ isPlaying: false, progress: 0 })
  },

  // 进度更新
  onTimeUpdate(e: WechatMiniprogram.VideoTimeUpdate) {
    const { currentTime, duration } = e.detail
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    // 如果后台已配置燃放时长，保持不变；否则使用视频时长
    const burnDurationTip = this.data.burnDurationTip || (duration > 0 ? `正常燃放时长约${Math.round(duration)}秒` : '')
    this.setData({
      currentTime: this.formatTime(currentTime),
      totalTime: this.formatTime(duration),
      progress,
      burnDurationTip,
      durationSeconds: duration || 0
    })
  },

  // 进度条拖动
  onProgressChange(e: WechatMiniprogram.SliderChange) {
    const progress = e.detail.value
    // 计算跳转时间
    const duration = this.data.durationSeconds
    if (duration > 0) {
      this.videoContext?.seek(progress / 100 * duration)
    }
  },

  // 格式化时间
  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.switchTab({
          url: '/pages/product/index'
        })
      }
    })
  },

  // 倍速播放
  changeSpeed() {
    this.setData({ showSpeedModal: true })
  },

  hideSpeedModal() {
    this.setData({ showSpeedModal: false })
  },

  setSpeed(e: WechatMiniprogram.TouchEvent) {
    const rate = parseFloat(e.currentTarget.dataset.rate)
    this.setData({ playbackRate: rate, showSpeedModal: false })
    this.videoContext?.playbackRate(rate)
  },

  toggleFullScreen() {
    // 确保videoContext存在
    if (!this.videoContext) {
      this.videoContext = wx.createVideoContext('productVideo')
    }
    
    if (this.data.isFullScreen) {
      this.videoContext.exitFullScreen()
    } else {
      // direction: 90 表示横屏全屏播放
      this.videoContext.requestFullScreen({ direction: 90 })
    }
  },

  onFullScreenChange(e: any) {
    this.setData({ isFullScreen: !!e.detail.fullScreen })
  },

  // 跳转官网
  goOfficial() {
    wx.switchTab({
      url: '/pages/official/index'
    })
  },

  // 点赞
  async toggleLike() {
    const productId = this.data.productId
    if (!productId) return

    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    const prevLiked = this.data.isLiked
    const prevCount = this.data.likeCount
    const likedKey = `productVideoLiked_${productId}`

    const nextLiked = !prevLiked
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1)

    // 乐观更新
    this.setData({
      isLiked: nextLiked,
      likeCount: nextCount
    })

    try {
      if (prevLiked) {
        await api.unlikeProduct(productId)
        wx.removeStorageSync(likedKey)
      } else {
        await api.likeProduct(productId)
        wx.setStorageSync(likedKey, true)
      }

      // 重新拉取一次产品详情，确保点赞数和后端一致
      this.loadVideoInfo(productId, this.data.videoType)

      wx.showToast({
        title: prevLiked ? '已取消点赞' : '点赞成功',
        icon: 'success',
        duration: 1500
      })
    } catch (error) {
      console.error('点赞操作失败:', error)
      this.setData({
        isLiked: prevLiked,
        likeCount: prevCount
      })
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  },

  // 附近网点
  goNearby() {
    wx.navigateTo({
      url: '/pages/store/nearby'
    })
  },

  // 产品详情
  goDetail() {
    wx.navigateTo({
      url: `/pages/product/detail?id=${this.data.productId}`
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.product.name + ' - 烟花燃放效果',
      path: `/pages/product/video?id=${this.data.productId}`
    }
  }
})
