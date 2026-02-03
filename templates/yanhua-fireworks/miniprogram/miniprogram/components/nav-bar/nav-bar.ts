Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    showBack: {
      type: Boolean,
      value: false
    },
    showClose: {
      type: Boolean,
      value: false
    },
    showScan: {
      type: Boolean,
      value: false
    },
    showMore: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 20
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 20
      })
    }
  },

  methods: {
    onBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.switchTab({
          url: '/pages/product/index',
          fail: () => {
            wx.reLaunch({
              url: '/pages/product/index'
            })
          }
        })
      }
    },
    
    onScan() {
      wx.scanCode({
        success: (res) => {
          console.log('扫码结果:', res)
          this.triggerEvent('scan', { result: res })
        },
        fail: (err) => {
          console.error('扫码失败:', err)
        }
      })
    },

    onClose() {
      // 关闭小程序或返回上一页
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        // 无法关闭小程序，返回首页
        wx.switchTab({
          url: '/pages/product/index'
        })
      }
    },

    onMore() {
      // 触发更多操作事件
      this.triggerEvent('more')
    }
  }
})
