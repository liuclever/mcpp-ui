const api = require('../../utils/api')

Component({
  properties: {
    pageKey: {
      type: String,
      value: ''
    },
    position: {
      type: String,
      value: 'top' // top 或 bottom
    }
  },

  data: {
    banner: null as any,
    loading: true
  },

  lifetimes: {
    attached() {
      this.loadBanner()
    }
  },

  observers: {
    'pageKey, position': function() {
      if (this.data.pageKey && this.data.position) {
        this.loadBanner()
      }
    }
  },

  methods: {
    async loadBanner() {
      const { pageKey, position } = this.data
      if (!pageKey) return

      try {
        const res = await api.request({
          url: `/page-banner/${pageKey}`,
          method: 'GET',
          showLoading: false
        })
        if (res.code === 200 && res.data) {
          const bannerData = res.data[position]
          if (bannerData && bannerData.imageUrl && bannerData.visible === 1) {
            this.setData({
              banner: bannerData,
              loading: false
            })
          } else {
            this.setData({
              banner: null,
              loading: false
            })
          }
        } else {
          this.setData({
            banner: null,
            loading: false
          })
        }
      } catch (err) {
        console.error('page-banner请求失败:', err)
        this.setData({
          banner: null,
          loading: false
        })
      }
    },

    onBannerTap() {
      const { banner } = this.data
      console.log('点击横幅，banner数据:', banner)
      
      if (!banner) {
        console.log('banner为空')
        return
      }
      
      if (banner.linkType === 'none') {
        console.log('链接类型为none，不跳转')
        return
      }
      
      if (!banner.linkUrl) {
        console.log('linkUrl为空，不跳转')
        return
      }

      console.log('准备跳转到:', banner.linkUrl)
      
      if (banner.linkType === 'page') {
        wx.navigateTo({
          url: banner.linkUrl,
          success: () => {
            console.log('navigateTo成功')
          },
          fail: (err) => {
            console.log('navigateTo失败:', err, '尝试switchTab')
            // 如果 navigateTo 失败，尝试 switchTab
            wx.switchTab({
              url: banner.linkUrl,
              success: () => {
                console.log('switchTab成功')
              },
              fail: (err2) => {
                console.log('switchTab失败:', err2, '尝试reLaunch')
                // 如果 switchTab 也失败，尝试 reLaunch
                wx.reLaunch({
                  url: banner.linkUrl
                })
              }
            })
          }
        })
      }
    }
  }
})
