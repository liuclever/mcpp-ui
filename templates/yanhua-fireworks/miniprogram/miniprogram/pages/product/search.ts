// pages/product/search.ts
Page({
  data: {
    keyword: '',
    suggestions: [] as string[],
    history: [] as string[],
    searchResult: false,
    resultList: [] as any[]
  },

  onLoad() {
    this.loadHistory()
  },

  // 加载搜索历史
  loadHistory() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ history })
  },

  // 输入关键词
  onInput(e: WechatMiniprogram.Input) {
    const keyword = e.detail.value
    this.setData({ keyword, searchResult: false })
    
    if (keyword) {
      this.getSuggestions(keyword)
    } else {
      this.setData({ suggestions: [] })
    }
  },

  // 获取搜索建议
  getSuggestions(keyword: string) {
    // 模拟搜索建议
    const allSuggestions = ['烟花伞', '烟花棒', '烟花筒', '烟花礼盒', '烟花组合']
    const suggestions = allSuggestions.filter(item => item.includes(keyword))
    this.setData({ suggestions })
  },

  // 选择建议
  selectSuggestion(e: WechatMiniprogram.TouchEvent) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ keyword })
    this.doSearch()
  },

  // 执行搜索
  doSearch() {
    const { keyword } = this.data
    if (!keyword.trim()) {
      wx.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }

    // 保存搜索历史
    this.saveHistory(keyword)

    wx.showLoading({ title: '搜索中...', mask: true })
    
    const api = require('../../utils/api').default
    api.searchProducts(keyword).then((res: any) => {
      wx.hideLoading()
      this.setData({
        searchResult: true,
        suggestions: [],
        resultList: res.data || []
      })
      
      if (!res.data || res.data.length === 0) {
        wx.showToast({ title: '未找到相关产品', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '搜索失败', icon: 'none' })
    })
  },

  // 保存搜索历史
  saveHistory(keyword: string) {
    let history = this.data.history.filter(item => item !== keyword)
    history.unshift(keyword)
    history = history.slice(0, 10) // 最多保存10条
    this.setData({ history })
    wx.setStorageSync('searchHistory', history)
  },

  // 清空历史
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
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

  // 跳转详情
  goDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    })
  }
})
