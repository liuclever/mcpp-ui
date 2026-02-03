// pages/official/index.ts
import api from '../../utils/api'

interface GalleryImage {
  id: number
  moduleType: string
  imageUrl: string
  seriesName?: string
  seriesOrder?: number
  title?: string
  description?: string
  linkUrl?: string
  sortOrder: number
  status: number
}

interface ContentSeries {
  seriesName: string
  seriesOrder?: number
  images: GalleryImage[]
}

interface BrandStoryItem {
  id: number
  title: string
  summary: string
  coverImage: string
  viewCount: number
  createTime: string
}


Page({
  data: {
    brandStory: {
      imageUrl: '',
      linkUrl: ''
    },
    contentImages: [] as GalleryImage[],  // 首页内容图片列表（保留兼容）
    contentSeries: [] as ContentSeries[],  // 按系列分组的内容图片
    brandStories: [] as BrandStoryItem[],  // 品牌故事列表
    homeVideo: {
      title: '',
      coverUrl: '',
      videoUrl: ''
    },
    homeVideoPlaying: false,  // 首页视频是否正在播放
    brandStoryDisplayMode: 'image-text'  // 品牌故事展示形式
  },

  onLoad() {
    console.log('=== 首页onLoad开始 ===')
    this.loadBrandStory()
    this.loadContentImages()
    this.loadHomeVideoConfig()
    this.loadBrandStories()
    this.loadBrandStoryColumnConfig()
  },

  // 加载品牌故事图片
  async loadBrandStory() {
    console.log('loadBrandStory开始')
    try {
      const res = await api.request({
        url: '/home-gallery/list',
        method: 'GET',
        data: { moduleType: 'brand-story', limit: 1 },
        showLoading: false
      })
      console.log('loadBrandStory返回:', res)
      if (res.code === 200 && res.data && res.data.length > 0) {
        this.setData({
          brandStory: {
            imageUrl: res.data[0].imageUrl || '',
            linkUrl: res.data[0].linkUrl || ''  // 使用linkUrl字段存储跳转链接
          }
        })
      }
    } catch (error) {
      console.error('加载品牌故事失败:', error)
    }
  },

  // 跳转品牌故事详情
  goBrandStory() {
    const linkUrl = this.data.brandStory.linkUrl
    if (linkUrl) {
      wx.navigateTo({
        url: linkUrl,
        fail: () => {
          wx.switchTab({
            url: linkUrl,
            fail: () => {
              wx.reLaunch({ url: linkUrl })
            }
          })
        }
      })
    }
  },

  // 加载首页视频配置
  async loadHomeVideoConfig() {
    console.log('loadHomeVideoConfig开始')
    try {
      const res = await api.request({
        url: '/home/video-config',
        method: 'GET',
        showLoading: false
      })
      console.log('loadHomeVideoConfig返回:', res)
      if (res.code === 200 && res.data) {
        this.setData({
          homeVideo: {
            title: res.data.title || '',
            coverUrl: res.data.coverUrl || '',
            videoUrl: res.data.videoUrl || ''
          }
        })
      }
    } catch (error) {
      console.error('加载首页视频配置失败:', error)
    }
  },

  // 播放首页视频 - 内嵌播放
  playHomeVideo() {
    const videoUrl = this.data.homeVideo.videoUrl
    if (videoUrl) {
      this.setData({ homeVideoPlaying: true })
    }
  },

  // 首页视频播放结束
  onHomeVideoEnded() {
    this.setData({ homeVideoPlaying: false })
  },

  // 首页视频播放错误
  onHomeVideoError(e: any) {
    console.error('首页视频播放错误:', e)
    this.setData({ homeVideoPlaying: false })
    wx.showToast({ title: '视频加载失败', icon: 'none' })
  },

  // 全屏状态变化
  onFullscreenChange(e: any) {
    console.log('全屏状态变化:', e.detail)
  },

  // 加载首页内容图片（按系列分组：品牌介绍、产品优势、合作支持等）
  async loadContentImages() {
    console.log('loadContentImages开始')
    try {
      const res = await api.request({
        url: '/home-gallery/grouped',
        method: 'GET',
        data: { moduleType: 'content' },
        showLoading: false
      })
      console.log('loadContentImages返回:', res)
      if (res.code === 200 && res.data) {
        this.setData({ contentSeries: res.data })
      }
    } catch (error) {
      console.error('加载首页内容图片失败:', error)
      // 如果新接口失败，回退到旧接口
      try {
        const fallbackRes = await api.request({
          url: '/home-gallery/list',
          method: 'GET',
          data: { moduleType: 'content', limit: 20 },
          showLoading: false
        })
        if (fallbackRes.code === 200 && fallbackRes.data) {
          // 将平铺数据转换为系列格式
          this.setData({ 
            contentSeries: [{ seriesName: '', images: fallbackRes.data }]
          })
        }
      } catch (fallbackError) {
        console.error('回退加载也失败:', fallbackError)
      }
    }
  },

  // 点击内容图片
  onContentImageTap(e: WechatMiniprogram.TouchEvent) {
    const item = e.currentTarget.dataset.item as GalleryImage
    if (!item) return
    
    // 如果有跳转链接，则跳转到对应页面
    if (item.linkUrl) {
      const url = item.linkUrl
      const hasQuery = url.includes('?')
      
      wx.navigateTo({
        url: url,
        fail: (err) => {
          console.log('navigateTo失败:', err)
          // switchTab不支持queryString，只对无参数的tabBar页面使用
          if (!hasQuery) {
            wx.switchTab({
              url: url,
              fail: (err2) => {
                console.log('switchTab失败:', err2)
                wx.reLaunch({ url: url })
              }
            })
          } else {
            // 带参数的页面用reLaunch
            wx.reLaunch({ url: url })
          }
        }
      })
      return
    }
    
    // 没有跳转链接则预览图片
    if (item.imageUrl) {
      const urls = this.data.contentImages.map(img => img.imageUrl)
      wx.previewImage({
        current: item.imageUrl,
        urls: urls
      })
    }
  },

  // 从内容中提取摘要
  extractSummary(content: string): string {
    if (!content) return ''
    const text = content.replace(/<[^>]+>/g, '')
    const cleaned = text.replace(/\s+/g, ' ').trim()
    return cleaned.length > 50 ? cleaned.substring(0, 50) + '...' : cleaned
  },

  // 获取封面图
  getCoverImage(imageList: string[]): string {
    if (imageList && imageList.length > 0) {
      return imageList[0]
    }
    return ''
  },

  // 加载品牌故事列表
  async loadBrandStories() {
    console.log('loadBrandStories开始')
    try {
      const res = await api.request({
        url: '/cms/content/list',
        method: 'GET',
        data: { categoryType: 'brand', page: 1, pageSize: 3 },
        showLoading: false
      })
      console.log('loadBrandStories返回:', res)
      if (res.code === 200 && res.data && res.data.records) {
        const stories = res.data.records.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: this.extractSummary(item.content),
          coverImage: this.getCoverImage(item.imageList),
          viewCount: item.viewCount || 0,
          createTime: item.createTime
        }))
        this.setData({ brandStories: stories })
      }
    } catch (error) {
      console.error('加载品牌故事列表失败:', error)
    }
  },

  // 跳转品牌故事详情
  goBrandStoryDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/enterprise/brand-detail?id=${id}`
    })
  },

  // 加载品牌故事栏目配置
  async loadBrandStoryColumnConfig() {
    try {
      const res = await api.request({
        url: '/cms/column/list',
        method: 'GET',
        showLoading: false
      })
      if (res.code === 200 && res.data) {
        const brandStoryColumn = res.data.find((col: any) => col.name === '品牌故事' || col.id === 1)
        if (brandStoryColumn && brandStoryColumn.displayMode) {
          this.setData({ brandStoryDisplayMode: brandStoryColumn.displayMode })
        }
      }
    } catch (error) {
      console.error('加载品牌故事栏目配置失败:', error)
    }
  },

  // 查看更多品牌故事
  goMoreBrandStories() {
    const displayMode = this.data.brandStoryDisplayMode
    wx.navigateTo({
      url: `/pages/enterprise/brand-list?displayMode=${displayMode}`
    })
  },

  // 跳转企业中心
  goEnterprise() {
    wx.navigateTo({
      url: '/pages/enterprise/index',
      fail: (err) => {
        console.error('跳转到企业中心失败:', err)
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        })
      }
    })
  },

  // 跳转搜索
  goSearch() {
    wx.navigateTo({
      url: '/pages/product/search'
    })
  },

  // 跳转到图片列表页
  goGallery(e: WechatMiniprogram.TouchEvent) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/official/gallery?type=${type}`
    })
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '正攀烟花 - 专业烟花品牌',
      path: '/pages/official/index',
      imageUrl: 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/share-cover.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '正攀烟花 - 专业烟花品牌',
      query: '',
      imageUrl: 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/share-cover.png'
    }
  }
})
