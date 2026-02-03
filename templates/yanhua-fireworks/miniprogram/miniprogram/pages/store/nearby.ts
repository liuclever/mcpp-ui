// pages/store/nearby.ts
import api from '../../utils/api'

Page({
  data: {
    city: '',
    searchKeyword: '',
    loading: true,
    latitude: 0,
    longitude: 0,
    storeList: [] as any[]
  },

  onLoad() {
    this.getLocation()
  },

  // 获取定位
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.reverseGeocoder(res.latitude, res.longitude)
        this.loadNearbyStores()
      },
      fail: () => {
        this.setData({ loading: false, city: '' })
        wx.showModal({
          title: '提示',
          content: '需要获取您的位置信息才能查找附近网点',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      }
    })
  },

  // 逆地理编码 - 获取区/县名称
  reverseGeocoder(lat: number, lng: number) {
    // 调用后端API进行逆地理编码
    wx.request({
      url: `https://fireworks-project.zhengpan.cn/api/location/reverse-geocode?lat=${lat}&lng=${lng}`,
      success: (res: any) => {
        console.log('逆地理编码结果:', res.data)
        if (res.data && res.data.code === 200 && res.data.data) {
          const data = res.data.data
          // 优先显示区/县，其次是城市
          let locationName = data.district || data.city || ''
          if (locationName) {
            // 移除末尾的"市"、"区"、"县"后缀，保持简洁
            locationName = locationName.replace(/(市|区|县)$/, '')
            this.setData({ city: locationName })
          } else {
            // 如果没有获取到地区，从门店地址中提取
            this.extractLocationFromStores()
          }
        } else {
          // 后端API失败时，从门店地址中提取
          this.extractLocationFromStores()
        }
      },
      fail: () => {
        // 请求失败时，从门店地址中提取
        this.extractLocationFromStores()
      }
    })
  },

  // 从门店地址中提取地区信息
  extractLocationFromStores() {
    const stores = this.data.storeList
    if (stores && stores.length > 0) {
      const address = stores[0].address || ''
      // 尝试从地址中提取城市/区县，如"湖南省浏阳市新民路123号"
      const match = address.match(/省(.+?市)/) || address.match(/(.+?市)/)
      if (match && match[1]) {
        const cityName = match[1].replace(/市$/, '')
        this.setData({ city: cityName })
        return
      }
    }
    // 无法提取时显示定位图标
    this.setData({ city: '已定位' })
  },

  // 加载附近网点
  loadNearbyStores() {
    const { latitude, longitude } = this.data
    
    // 调用真实API获取附近网点
    api.getNearbyStores(latitude, longitude).then((res: any) => {
      this.setData({
        storeList: res.data || [],
        loading: false
      })
      // 如果还没有获取到地区名称，尝试从门店地址提取
      if (!this.data.city || this.data.city === '定位中' || this.data.city === '已定位' || this.data.city === '定位成功') {
        this.extractLocationFromStores()
      }
    }).catch(() => {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  // 搜索输入
  onSearchInput(e: WechatMiniprogram.Input) {
    this.setData({ searchKeyword: e.detail.value })
    // 可以实现实时搜索
  },

  // 拨打电话
  callStore(e: WechatMiniprogram.TouchEvent) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 导航到店
  navigateTo(e: WechatMiniprogram.TouchEvent) {
    const store = e.currentTarget.dataset.store
    wx.openLocation({
      latitude: store.latitude,
      longitude: store.longitude,
      name: store.name,
      address: store.address
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

  // 重新定位
  relocate() {
    this.setData({ city: '定位中', loading: true })
    wx.showLoading({ title: '定位中...' })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.hideLoading()
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.reverseGeocoder(res.latitude, res.longitude)
        this.loadNearbyStores()
      },
      fail: () => {
        wx.hideLoading()
        this.setData({ loading: false, city: '定位失败' })
        wx.showToast({ title: '定位失败', icon: 'none' })
      }
    })
  },

  // 申请入驻
  applyJoin() {
    wx.switchTab({
      url: '/pages/mine/index'
    })
  }
})
