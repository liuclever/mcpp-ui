// pages/product/index.ts
interface Category {
  id: number
  name: string
  code: string
  sort: number
  status: number
  parentId?: number
  children?: Category[]
  expanded?: boolean  // 展开状态
}

Page({
  data: {
    categories: [] as Category[],  // 一级分类列表
    categoryExpanded: false,       // 分类列表展开状态
    loading: true,
    productHeaderImage: '',        // 产品页头部图片URL
    defaultHeaderImage: 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/product-banner.png', // 默认图片
    productVideo: {
      title: '',
      coverUrl: '',
      videoUrl: ''
    },
    productVideoPlaying: false  // 视频是否正在播放
  },

  onLoad() {
    this.loadProductHeaderImage()
    this.loadCategories()
    this.loadProductVideoConfig()
  },

  // 加载产品首页视频配置
  loadProductVideoConfig() {
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/product/video-config',
      method: 'GET',
      success: (res: any) => {
        if (res.statusCode === 200 && res.data.code === 200 && res.data.data) {
          this.setData({
            productVideo: {
              title: res.data.data.title || '',
              coverUrl: res.data.data.coverUrl || '',
              videoUrl: res.data.data.videoUrl || ''
            }
          })
        }
      },
      fail: (error) => {
        console.error('加载产品首页视频配置失败:', error)
      }
    })
  },

  // 播放产品视频 - 内嵌播放
  playProductVideo() {
    const videoUrl = this.data.productVideo.videoUrl
    if (videoUrl) {
      this.setData({ productVideoPlaying: true })
    }
  },

  // 视频播放结束
  onProductVideoEnded() {
    this.setData({ productVideoPlaying: false })
  },

  // 视频播放错误
  onProductVideoError(e: any) {
    console.error('视频播放错误:', e)
    this.setData({ productVideoPlaying: false })
    wx.showToast({ title: '视频加载失败', icon: 'none' })
  },

  // 加载产品页头部图片
  loadProductHeaderImage() {
    console.log('=== 开始加载产品页头部图片 ===')
    console.log('API URL:', 'https://fireworks-project.zhengpan.cn/api/home-gallery/list')
    console.log('请求参数:', { moduleType: 'product-header' })
    
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/home-gallery/list',
      method: 'GET',
      data: {
        moduleType: 'product-header'
      },
      success: (res: any) => {
        console.log('API响应状态码:', res.statusCode)
        console.log('API响应完整数据:', JSON.stringify(res.data, null, 2))
        
        if (res.statusCode === 200 && res.data.code === 200) {
          const images = res.data.data
          console.log('返回的图片数量:', images ? images.length : 0)
          console.log('图片数据详情:', JSON.stringify(images, null, 2))
          
          // 获取第一张启用状态的图片
          const activeImage = images.find((img: any) => img.status === 1)
          console.log('找到的启用图片:', activeImage ? JSON.stringify(activeImage, null, 2) : '无')
          
          if (activeImage && activeImage.imageUrl) {
            this.setData({
              productHeaderImage: activeImage.imageUrl
            })
            console.log('✅ 设置产品页头部图片成功:', activeImage.imageUrl)
          } else {
            // 使用默认图片
            this.setData({
              productHeaderImage: this.data.defaultHeaderImage
            })
            console.warn('⚠️ 未找到启用状态的图片,使用默认图片')
          }
        } else {
          // API调用失败,使用默认图片
          console.error('❌ API返回错误 - statusCode:', res.statusCode, 'code:', res.data?.code)
          this.setData({
            productHeaderImage: this.data.defaultHeaderImage
          })
          console.warn('使用默认图片')
        }
      },
      fail: (error) => {
        // 网络错误,使用默认图片
        console.error('❌ 网络请求失败:', error)
        console.error('错误详情:', JSON.stringify(error, null, 2))
        this.setData({
          productHeaderImage: this.data.defaultHeaderImage
        })
        console.warn('使用默认图片')
      },
      complete: () => {
        console.log('=== 产品页头部图片加载完成 ===')
      }
    })
  },

  // 加载一级分类数据
  loadCategories() {
    wx.showLoading({ title: '加载中...' })
    
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/product/categories',
      method: 'GET',
      success: (res: any) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          // 后端返回的是树形结构，每个父分类已经包含children
          const categories = res.data.data.map((cat: Category) => ({
            ...cat,
            expanded: false  // 初始化展开状态为收起
          }))
          
          this.setData({
            categories,
            loading: false
          })
          
          console.log('加载一级分类成功:', categories)
        } else {
          throw new Error('加载分类失败')
        }
      },
      fail: (error) => {
        console.error('加载分类失败:', error)
        wx.showToast({
          title: '加载分类失败',
          icon: 'none'
        })
        this.setData({ loading: false })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 切换分类列表展开/收起
  toggleCategory() {
    this.setData({
      categoryExpanded: !this.data.categoryExpanded
    })
  },

  // 切换单个一级分类的展开/收起（显示/隐藏子分类）
  toggleCategoryItem(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    const categories = this.data.categories
    categories[index].expanded = !categories[index].expanded
    this.setData({ categories })
    
    console.log(`${categories[index].name} ${categories[index].expanded ? '展开' : '收起'}子分类`)
  },

  // 跳转搜索页
  goSearch() {
    wx.navigateTo({
      url: '/pages/product/search'
    })
  },

  // 选择一级分类（父分类）- 展开显示子分类
  selectParentCategory(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    const categories = this.data.categories
    
    // 切换展开状态
    categories[index].expanded = !categories[index].expanded
    this.setData({ categories })
    
    console.log(`点击一级分类: ${categories[index].name}，${categories[index].expanded ? '展开' : '收起'}子分类`)
  },

  // 选择子分类 - 跳转到产品列表
  selectChildCategory(e: WechatMiniprogram.TouchEvent) {
    const { categoryId, categoryName } = e.currentTarget.dataset
    console.log('选择子分类:', { categoryId, categoryName })
    
    wx.navigateTo({
      url: `/pages/product/list?categoryId=${categoryId}&categoryName=${categoryName}`,
      fail: (err) => {
        console.error('跳转失败:', err)
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        })
      }
    })
  },

  // 查看全部产品
  viewAllProducts() {
    wx.navigateTo({
      url: '/pages/product/list',
      fail: (err) => {
        console.error('跳转失败:', err)
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        })
      }
    })
  },

  // 图片加载错误处理
  onImageError(e: any) {
    console.error('产品页头部图片加载失败:', e)
    this.setData({
      productHeaderImage: this.data.defaultHeaderImage
    })
  }
})
