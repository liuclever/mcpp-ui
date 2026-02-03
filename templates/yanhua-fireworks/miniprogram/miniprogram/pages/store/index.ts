// pages/store/index.ts
Page({
  data: {
    city: '',
    currentTab: 'image',
    storeImages: [
      '/assets/images/store1.png',
      '/assets/images/store2.png',
      '/assets/images/store3.png',
      '/assets/images/store4.png'
    ],
    shelfImages: [
      '/assets/images/shelf1.png',
      '/assets/images/shelf2.png',
      '/assets/images/shelf3.png',
      '/assets/images/shelf4.png'
    ],
    brandImages: [
      '/assets/images/brand1.png',
      '/assets/images/brand2.png',
      '/assets/images/brand3.png',
      '/assets/images/brand4.png'
    ],
    videoList: [
      { id: 1, title: '门店老板' },
      { id: 2, title: '门店老板' }
    ]
  },

  onLoad() {
    this.getLocation()
  },

  // 获取定位
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.reverseGeocoder(res.latitude, res.longitude)
      },
      fail: () => {
        this.setData({ city: '定位失败' })
      }
    })
  },

  // 逆地理编码获取城市
  reverseGeocoder(lat: number, lng: number) {
    // TODO: 调用腾讯地图API获取城市名称
    this.setData({ city: '上海' })
  },

  // 选择位置
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({ city: res.name || res.address })
      }
    })
  },

  // 切换Tab
  switchTab(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
  },

  // 预览图片
  previewImage(e: WechatMiniprogram.TouchEvent) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: this.data.storeImages
    })
  }
})
