// 销售网点地图页面
import { request } from '../../utils/api'

// 销售网点接口
interface SalesPoint {
  id: number
  name: string
  province: string
  city: string
  district: string
  address: string
  latitude: number
  longitude: number
  phone: string
  businessHours: string
  images: string[]
  distance?: number
}

// 地图标记接口
interface MapMarker {
  id: number
  latitude: number
  longitude: number
  iconPath: string
  width: number
  height: number
  callout: {
    content: string
    display: 'ALWAYS' | 'BYCLICK'
    padding: number
    borderRadius: number
    bgColor: string
    color: string
    fontSize: number
  }
}

Page({
  data: {
    centerLat: 28.2345,  // 默认中心纬度（长沙）
    centerLng: 112.9876, // 默认中心经度（长沙）
    markers: [] as MapMarker[],
    salesPoints: [] as SalesPoint[],
    drawerHeight: 300,   // 抽屉高度（单位：px）
    minDrawerHeight: 300,
    maxDrawerHeight: 600,
    startY: 0,           // 触摸开始Y坐标
    currentHeight: 300   // 当前抽屉高度
  },

  onLoad() {
    this.getUserLocation()
    this.loadSalesPoints()
  },

  /**
   * 获取用户当前位置
   */
  async getUserLocation() {
    try {
      const res = await wx.getLocation({ type: 'gcj02' })
      this.setData({
        centerLat: res.latitude,
        centerLng: res.longitude
      })
      console.log('[地图页面] 获取用户位置成功:', res.latitude, res.longitude)
    } catch (error) {
      console.error('[地图页面] 获取用户位置失败:', error)
      wx.showToast({
        title: '定位失败，使用默认位置',
        icon: 'none'
      })
    }
  },

  /**
   * 加载销售网点列表
   */
  async loadSalesPoints() {
    try {
      wx.showLoading({ title: '加载中...' })

      const res = await request<SalesPoint[]>({
        url: '/enterprise-center/sales-points',
        method: 'GET',
        data: {
          latitude: this.data.centerLat,
          longitude: this.data.centerLng
        },
        showLoading: false
      })

      if (res.code === 200 && res.data) {
        const salesPoints = res.data

        // 创建地图标记
        const markers: MapMarker[] = salesPoints.map((point) => ({
          id: point.id,
          latitude: point.latitude,
          longitude: point.longitude,
          iconPath: '/assets/icons/location.png',
          width: 30,
          height: 30,
          callout: {
            content: point.name,
            display: 'ALWAYS',
            padding: 10,
            borderRadius: 5,
            bgColor: '#ffffff',
            color: '#333333',
            fontSize: 12
          }
        }))

        this.setData({
          salesPoints,
          markers
        })

        console.log('[地图页面] 加载销售网点成功，共', salesPoints.length, '个')
      }
    } catch (error) {
      console.error('[地图页面] 加载销售网点失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 地图标记点击事件
   */
  onMarkerTap(e: any) {
    const markerId = e.detail.markerId
    const point = this.data.salesPoints.find(p => p.id === markerId)
    
    if (point) {
      // 地图移动到该网点
      this.setData({
        centerLat: point.latitude,
        centerLng: point.longitude
      })

      console.log('[地图页面] 点击标记:', point.name)
    }
  },

  /**
   * 网点列表项点击事件
   */
  onPointTap(e: any) {
    const point = e.currentTarget.dataset.point as SalesPoint
    
    // 地图移动到该网点
    this.setData({
      centerLat: point.latitude,
      centerLng: point.longitude
    })

    console.log('[地图页面] 点击网点:', point.name)
  },

  /**
   * 拨打电话
   */
  callPhone(e: any) {
    const phone = e.currentTarget.dataset.phone
    
    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        console.log('[地图页面] 拨打电话:', phone)
      },
      fail: (error) => {
        console.error('[地图页面] 拨打电话失败:', error)
        wx.showToast({
          title: '拨打失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 打开导航
   */
  openNavigation(e: any) {
    const point = e.currentTarget.dataset.point as SalesPoint
    
    wx.openLocation({
      latitude: point.latitude,
      longitude: point.longitude,
      name: point.name,
      address: point.address,
      scale: 15,
      success: () => {
        console.log('[地图页面] 打开导航:', point.name)
      },
      fail: (error) => {
        console.error('[地图页面] 打开导航失败:', error)
        wx.showToast({
          title: '导航失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止事件冒泡到父元素
  },

  /**
   * 抽屉触摸开始
   */
  onDrawerTouchStart(e: any) {
    this.setData({
      startY: e.touches[0].clientY,
      currentHeight: this.data.drawerHeight
    })
  },

  /**
   * 抽屉触摸移动
   */
  onDrawerTouchMove(e: any) {
    const deltaY = this.data.startY - e.touches[0].clientY
    let newHeight = this.data.currentHeight + deltaY

    // 限制抽屉高度范围
    newHeight = Math.max(this.data.minDrawerHeight, Math.min(this.data.maxDrawerHeight, newHeight))

    this.setData({
      drawerHeight: newHeight
    })
  },

  /**
   * 抽屉触摸结束
   */
  onDrawerTouchEnd() {
    // 可以在这里添加吸附效果
    const { drawerHeight, minDrawerHeight, maxDrawerHeight } = this.data
    const midHeight = (minDrawerHeight + maxDrawerHeight) / 2

    // 如果接近中间值，吸附到最小或最大高度
    if (drawerHeight < midHeight) {
      this.setData({ drawerHeight: minDrawerHeight })
    } else {
      this.setData({ drawerHeight: maxDrawerHeight })
    }
  }
})
