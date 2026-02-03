// pages/about/index.ts
import api from '../../utils/api'

interface AboutContact {
  id: number
  companyName: string
  address: string
  phone1: string
  phone2?: string
  phone3?: string
  fax?: string
  email?: string
  latitude?: number
  longitude?: number
}

Page({
  data: {
    companyInfo: {
      name: '正攀烟花',
      address: '某某市某某区某某街道',
      phone1: '+86-0111-12312312',
      latitude: 28.19,
      longitude: 113.09
    },
    contactInfo: null as AboutContact | null,
    loading: true,
    topBannerUrl: '',
    bottomBannerUrl: ''
  },

  onLoad() {
    this.loadContactInfo()
    this.loadBanners()
  },

  // 加载横幅配置
  async loadBanners() {
    try {
      const res = await api.request({
        url: '/page-banner/about',
        method: 'GET',
        showLoading: false
      })
      if (res.code === 200 && res.data) {
        const banners = res.data
        // 只有visible=1且有图片URL时才显示
        const topBanner = banners.top
        const bottomBanner = banners.bottom
        this.setData({
          topBannerUrl: (topBanner?.visible === 1 && topBanner?.imageUrl) ? topBanner.imageUrl : '',
          bottomBannerUrl: (bottomBanner?.visible === 1 && bottomBanner?.imageUrl) ? bottomBanner.imageUrl : ''
        })
      }
    } catch (err) {
      console.error('加载横幅配置失败:', err)
    }
  },

  // 加载联系信息
  async loadContactInfo() {
    try {
      this.setData({ loading: true })
      const res = await api.getAboutContact()
      
      if (res.code === 200 && res.data) {
        // 转换后端数据格式
        const backendData = res.data as any
        const contactInfo: AboutContact = {
          id: backendData.id,
          companyName: backendData.companyName,
          address: backendData.address,
          phone1: backendData.phone1 || '',
          phone2: backendData.phone2,
          phone3: backendData.phone3,
          fax: backendData.fax,
          email: backendData.email,
          latitude: backendData.latitude,
          longitude: backendData.longitude
        }
        
        console.log('关于页面-联系信息加载成功:', contactInfo)
        
        // 更新companyInfo数据
        this.setData({ 
          contactInfo: contactInfo,
          companyInfo: {
            name: contactInfo.companyName,
            address: contactInfo.address,
            phone1: contactInfo.phone1,
            latitude: contactInfo.latitude || 28.19,
            longitude: contactInfo.longitude || 113.09
          },
          loading: false
        })
      }
    } catch (error) {
      console.error('关于页面-加载联系信息失败:', error)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载联系信息失败',
        icon: 'none'
      })
    }
  },

  // 一键导航
  openNavigation() {
    const { latitude, longitude, name, address } = this.data.companyInfo
    
    if (!latitude || !longitude) {
      wx.showToast({
        title: '暂无位置信息',
        icon: 'none'
      })
      return
    }
    
    wx.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale: 18
    })
  },

  // 一键拨号
  makeCall() {
    const { contactInfo } = this.data
    
    if (!contactInfo || !contactInfo.phone1) {
      wx.showToast({
        title: '暂无联系电话',
        icon: 'none'
      })
      return
    }
    
    // 收集所有可用的电话号码
    const phones: Array<{label: string, number: string}> = []
    
    if (contactInfo.phone1) {
      phones.push({ label: '主要电话', number: contactInfo.phone1 })
    }
    if (contactInfo.phone2) {
      phones.push({ label: '备用电话1', number: contactInfo.phone2 })
    }
    if (contactInfo.phone3) {
      phones.push({ label: '备用电话2', number: contactInfo.phone3 })
    }
    
    // 如果只有一个电话，直接拨打
    if (phones.length === 1) {
      wx.makePhoneCall({
        phoneNumber: phones[0].number.replace(/[^0-9]/g, ''),
        fail: (error) => {
          console.error('拨打电话失败:', error)
          wx.showToast({
            title: '拨打电话失败',
            icon: 'none'
          })
        }
      })
    } else {
      // 如果有多个电话，显示选择列表
      wx.showActionSheet({
        itemList: phones.map(p => `${p.label}: ${p.number}`),
        success: (res) => {
          const selectedPhone = phones[res.tapIndex]
          wx.makePhoneCall({
            phoneNumber: selectedPhone.number.replace(/[^0-9]/g, ''),
            fail: (error) => {
              console.error('拨打电话失败:', error)
              wx.showToast({
                title: '拨打电话失败',
                icon: 'none'
              })
            }
          })
        }
      })
    }
  }
})
