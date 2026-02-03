// pages/product/list.ts
interface Category {
  id: number
  name: string
  code: string
  sort: number
  status: number
  parentId?: number
  children?: Category[]
}

interface VideoConfig {
  title: string
  coverUrl: string
  videoUrl: string
}

Page({
  data: {
    category: '',
    tag: '',
    sortType: '',
    viewsOrder: '', // 'asc' | 'desc' | ''
    newOrder: '', // 'asc' | 'desc' | ''
    productList: [] as any[],
    productVideos: [] as VideoConfig[],  // 产品页视频列表
    playingVideoIndex: -1,  // 当前正在播放的视频索引，-1表示没有播放
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    showCategoryPopup: false,
    selectedCategory: '',
    tempCategory: '', // 临时选中的分类
    categoryList: [] as Category[],  // 从API加载的分类列表(父类列表)
    selectedParentIndex: 0,  // 当前选中的父类索引
    currentChildren: [] as Category[]  // 当前父类的子分类列表
  },

  onLoad(options) {
    if (options.category) {
      this.setData({ category: options.category })
    }
    if (options.tag) {
      this.setData({ tag: options.tag })
    }
    // 先加载分类列表,再加载产品
    this.loadCategories()
    this.loadProducts()
    this.loadProductVideos()
  },

  // 加载产品页视频列表
  loadProductVideos() {
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/product/videos-config',
      method: 'GET',
      success: (res: any) => {
        console.log('产品页视频配置:', res.data)
        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({ productVideos: res.data.data || [] })
        }
      },
      fail: (error) => {
        console.error('加载产品页视频失败:', error)
      }
    })
  },

  // 播放视频 - 内嵌播放
  playProductVideo(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const video = this.data.productVideos[index]
    if (video && video.videoUrl) {
      this.setData({ playingVideoIndex: index })
    }
  },

  // 视频播放结束
  onListVideoEnded() {
    this.setData({ playingVideoIndex: -1 })
  },

  // 视频播放错误
  onListVideoError(e: any) {
    console.error('视频播放错误:', e)
    this.setData({ playingVideoIndex: -1 })
    wx.showToast({ title: '视频加载失败', icon: 'none' })
  },

  // 加载分类列表
  loadCategories() {
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/product/categories',
      method: 'GET',
      success: (res: any) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          // 保持树形结构,不展平
          const categories = res.data.data || []
          
          // 初始化第一个父类的子分类
          const firstChildren = categories.length > 0 && categories[0].children 
            ? categories[0].children 
            : []
          
          this.setData({
            categoryList: categories,  // 父类列表
            currentChildren: firstChildren,  // 第一个父类的子分类
            selectedParentIndex: 0
          })
          
          console.log('加载分类列表成功:', categories)
        } else {
          console.error('加载分类失败:', res.data)
          this.useDefaultCategories()
        }
      },
      fail: (error) => {
        console.error('加载分类失败:', error)
        this.useDefaultCategories()
      }
    })
  },

  // 使用默认分类列表(降级方案)
  useDefaultCategories() {
    console.log('使用默认分类列表')
    const defaultCategories: Category[] = [
      { id: 1, name: '玩具系列', code: 'toy', sort: 1, status: 1, children: [] },
      { id: 2, name: '夜景系列', code: 'night', sort: 2, status: 1, children: [] },
      { id: 3, name: '日景系列', code: 'day', sort: 3, status: 1, children: [] },
      { id: 4, name: '精品系列', code: 'fine', sort: 4, status: 1, children: [] }
    ]
    
    this.setData({
      categoryList: defaultCategories,
      currentChildren: [],
      selectedParentIndex: 0
    })
  },

  // 选择父类
  selectParent(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const parent = this.data.categoryList[index]
    
    this.setData({
      selectedParentIndex: index,
      currentChildren: parent.children || []
    })
  },

  // 加载产品列表
  loadProducts() {
    this.setData({ loading: true })
    
    const api = require('../../utils/api').default
    const { page, pageSize, selectedCategory, sortType } = this.data
    
    // 构建排序参数
    let sort = ''
    if (sortType === 'views') {
      sort = 'views'
    } else if (sortType === 'new') {
      sort = 'new'
    }
    
    // 构建请求参数，只传递有值的参数
    const params: any = {
      page,
      pageSize
    }
    
    // 只有当分类ID存在且不为空时才添加
    if (selectedCategory && selectedCategory !== '') {
      params.categoryId = selectedCategory
    }
    
    // 只有当排序存在且不为空时才添加
    if (sort && sort !== '') {
      params.sort = sort
    }
    
    api.getProducts(params).then((res: any) => {
      const newProducts = res.data.records || []
      const total = res.data.total || 0
      
      this.setData({
        productList: page === 1 ? newProducts : [...this.data.productList, ...newProducts],
        loading: false,
        hasMore: this.data.productList.length + newProducts.length < total
      })
    }).catch((err: any) => {
      this.setData({ loading: false })
      console.error('加载产品失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  // 切换分类
  toggleCategory() {
    this.setData({
      showCategoryPopup: !this.data.showCategoryPopup,
      tempCategory: this.data.selectedCategory // 打开时初始化为当前选中的分类
    })
  },

  // 隐藏分类弹窗
  hideCategoryPopup() {
    this.setData({
      showCategoryPopup: false
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 选择临时分类(从子分类中选择)
  selectTempCategory(e: WechatMiniprogram.TouchEvent) {
    const category = e.currentTarget.dataset.category
    this.setData({
      tempCategory: category
    })
  },

  // 选择父类作为分类(点击父类时直接选择该父类)
  selectParentCategory(e: WechatMiniprogram.TouchEvent) {
    const categoryId = e.currentTarget.dataset.category
    this.setData({
      tempCategory: categoryId
    })
  },

  // 确认分类选择
  confirmCategory() {
    this.setData({
      selectedCategory: this.data.tempCategory,
      showCategoryPopup: false,
      sortType: 'category',
      viewsOrder: '',
      newOrder: '',
      page: 1,
      productList: []
    })
    this.loadProducts()
  },

  // 切换浏览量排序
  toggleViews() {
    let newOrder = ''
    if (this.data.viewsOrder === '') {
      newOrder = 'desc' // 首次点击，按浏览量降序
    } else if (this.data.viewsOrder === 'desc') {
      newOrder = 'asc' // 再次点击，按浏览量升序
    } else {
      newOrder = 'desc'
    }
    
    this.setData({
      sortType: 'views',
      viewsOrder: newOrder,
      newOrder: '',
      page: 1,
      productList: []
    })
    this.loadProducts()
  },

  // 切换新品排序
  toggleNew() {
    let newOrder = ''
    if (this.data.newOrder === '') {
      newOrder = 'desc' // 首次点击，显示最新的（时间降序）
    } else if (this.data.newOrder === 'desc') {
      newOrder = 'asc' // 再次点击，按时间升序
    } else {
      newOrder = 'desc'
    }
    
    this.setData({
      sortType: 'new',
      newOrder: newOrder,
      viewsOrder: '',
      page: 1,
      productList: []
    })
    this.loadProducts()
  },

  // 跳转搜索
  goSearch() {
    wx.navigateTo({
      url: '/pages/product/search'
    })
  },

  // 扫码
  scanCode() {
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果:', res)
      }
    })
  },

  // 跳转详情
  goDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    })
  },

  // 跳转视频
  goVideo(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/video?id=${id}`
    })
  },

  // 关闭卡片
  closeCard(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要关闭此卡片吗？',
      success: (res) => {
        if (res.confirm) {
          const productList = this.data.productList.filter(item => item.id !== id)
          this.setData({ productList })
        }
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ 
      page: 1, 
      productList: [],
      sortType: '',
      viewsOrder: '',
      newOrder: '',
      selectedCategory: ''
    })
    this.loadProducts()
    wx.stopPullDownRefresh()
  },

  // 返回首页
  goBack() {
    wx.switchTab({
      url: '/pages/official/index'
    })
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadProducts()
    }
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '正攀烟花产品 - 专业烟花品牌',
      path: '/pages/product/list',
      imageUrl: 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/share-cover.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '正攀烟花产品 - 专业烟花品牌',
      query: '',
      imageUrl: 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/share-cover.png'
    }
  }
})
