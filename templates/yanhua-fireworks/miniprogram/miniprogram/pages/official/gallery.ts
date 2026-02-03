// pages/official/gallery.ts

interface GalleryImage {
  id: number
  moduleType: string
  imageUrl: string
  title?: string
  description?: string
  sortOrder: number
  status: number
}

Page({
  data: {
    type: '',
    images: [] as GalleryImage[],
    page: 1,
    pageSize: 20,
    loading: false,
    noMore: false
  },

  onLoad(options: any) {
    const type = options.type || 'about'
    this.setData({ type })
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: type === 'about' ? '关于我们' : '领导来访'
    })
    
    this.loadImages()
  },

  // 加载图片
  loadImages() {
    if (this.data.loading || this.data.noMore) return
    
    this.setData({ loading: true })
    
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/home-gallery/list',
      method: 'GET',
      data: {
        moduleType: this.data.type,
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const data = res.data as any
          if (data.code === 200 && data.data) {
            const newImages = data.data as GalleryImage[]
            this.setData({
              images: [...this.data.images, ...newImages],
              page: this.data.page + 1,
              noMore: newImages.length < this.data.pageSize
            })
          }
        }
      },
      fail: (error) => {
        console.error('加载图片失败:', error)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  // 预览图片
  previewImage(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const urls = this.data.images.map(img => img.imageUrl)
    wx.previewImage({
      current: urls[index],
      urls: urls
    })
  },

  // 触底加载更多
  onReachBottom() {
    this.loadImages()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      images: [],
      page: 1,
      noMore: false
    })
    this.loadImages()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
