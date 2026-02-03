// pages/community/preview.ts
Page({
  data: {
    videoPath: ''
  },

  onLoad(options: any) {
    if (options.videoPath) {
      this.setData({
        videoPath: decodeURIComponent(options.videoPath)
      })
    }
  },

  close() {
    wx.navigateBack()
  }
})
