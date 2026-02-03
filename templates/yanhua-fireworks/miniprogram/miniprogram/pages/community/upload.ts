// pages/community/upload.ts
import { uploadVideo } from '../../utils/video-api'
import { getActivityList } from '../../utils/activity-api'
import { checkPageAccessOnLoad } from '../../utils/force-bind'

interface Topic {
  id: number
  name: string
  selected: boolean
}

interface Product {
  id: number
  name: string
}

Page({
  data: {
    videoPath: '',
    coverPath: '',
    title: '',
    description: '',
    location: '',
    productIndex: -1,
    productList: [] as Product[],
    topicList: [] as Topic[],
    uploading: false,
    uploadProgress: 0,
    showPicker: false,
    tempProductIndex: -1,
    statusBarHeight: 20  // 状态栏高度
  },

  async onLoad() {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 20
    })
    
    // 检查页面访问权限
    // 需求: 6.4 - 限制未绑定用户访问部分功能
    const canAccess = await checkPageAccessOnLoad(this.route || '')
    if (!canAccess) {
      return // 页面被限制访问，已自动跳转
    }
    
    // 加载产品列表和话题列表
    this.loadProductList()
    this.loadTopicList()
  },

  /**
   * 加载产品列表
   */
  loadProductList() {
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/product/list',
      method: 'GET',
      data: {
        page: 1,
        pageSize: 100  // 获取所有产品用于选择
      },
      success: (res) => {
        console.log('产品列表API响应:', res)
        if (res.statusCode === 200 && res.data) {
          const result = res.data as any
          if (result.code === 200 && result.data && result.data.records) {
            console.log('产品数量:', result.data.records.length)
            this.setData({
              productList: result.data.records.map((p: any) => ({
                id: p.id,
                name: p.name
              }))
            })
            console.log('productList已更新:', this.data.productList)
          } else {
            console.error('产品数据格式错误:', result)
            this.useDefaultProducts()
          }
        } else {
          console.error('API响应错误:', res.statusCode)
          this.useDefaultProducts()
        }
      },
      fail: (error) => {
        console.error('加载产品列表失败:', error)
        this.useDefaultProducts()
      }
    })
  },

  /**
   * 使用默认产品列表
   */
  useDefaultProducts() {
    console.log('使用模拟产品数据')
    this.setData({
      productList: [
        { id: 1, name: '烟花套装A' },
        { id: 2, name: '烟花套装B' },
        { id: 3, name: '烟花套装C' }
      ]
    })
  },

  /**
   * 加载话题列表
   * 需求：3.1 - 从API加载活动话题列表
   * 需求：3.2 - 显示所有已上线的话题标签
   * 需求：3.5 - 话题列表加载失败时使用默认话题列表作为降级方案
   */
  async loadTopicList() {
    try {
      // 从后端API获取话题列表
      const activities = await getActivityList()
      
      // 转换为Topic格式
      this.setData({
        topicList: activities.map(a => ({
          id: a.id,
          name: a.name,
          selected: false
        }))
      })
      
      console.log('话题列表加载成功:', this.data.topicList)
    } catch (error) {
      console.error('加载话题列表失败:', error)
      // 使用默认话题作为降级方案
      this.useDefaultTopics()
    }
  },

  /**
   * 使用默认话题列表（降级方案）
   * 需求：3.5 - 话题列表加载失败时的降级方案
   */
  useDefaultTopics() {
    console.log('使用默认话题列表')
    this.setData({
      topicList: [
        { id: 1, name: '#春节烟花', selected: false },
        { id: 2, name: '#元宵节', selected: false },
        { id: 3, name: '#国庆烟花', selected: false },
        { id: 4, name: '#婚庆烟花', selected: false }
      ]
    })
  },

  /**
   * 选择视频
   */
  async chooseVideo() {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['video'],
        sourceType: ['album', 'camera'],
        maxDuration: 60, // 最长60秒
        camera: 'back'
      })

      if (res.tempFiles && res.tempFiles.length > 0) {
        const video = res.tempFiles[0]
        
        // 检查视频大小（限制300MB）
        if (video.size > 300 * 1024 * 1024) {
          wx.showToast({
            title: '视频大小不能超过300MB',
            icon: 'none'
          })
          return
        }

        // 检查视频时长
        if (video.duration && video.duration > 60) {
          wx.showToast({
            title: '视频时长不能超过60秒',
            icon: 'none'
          })
          return
        }

        console.log('视频信息:', video)
        console.log('视频路径:', video.tempFilePath)
        console.log('缩略图路径:', video.thumbTempFilePath)

        // 使用微信自动生成的缩略图作为封面（这就是视频第一帧）
        this.setData({
          videoPath: video.tempFilePath,
          coverPath: video.thumbTempFilePath || ''
        })

        if (video.thumbTempFilePath) {
          wx.showToast({
            title: '已自动生成封面',
            icon: 'success',
            duration: 1500
          })
        }
      }
    } catch (error) {
      console.error('选择视频失败:', error)
    }
  },

  /**
   * 输入标题
   */
  onTitleInput(e: WechatMiniprogram.Input) {
    this.setData({ title: e.detail.value })
  },

  /**
   * 输入描述
   */
  onDescInput(e: WechatMiniprogram.Input) {
    this.setData({ description: e.detail.value })
  },

  /**
   * 显示产品选择器
   */
  showProductPicker() {
    console.log('显示产品选择器')
    console.log('当前productList:', this.data.productList)
    console.log('productList长度:', this.data.productList.length)
    
    // 如果产品列表为空，尝试重新加载
    if (this.data.productList.length === 0) {
      console.log('产品列表为空，重新加载')
      this.loadProductList()
    }
    
    this.setData({
      showPicker: true,
      tempProductIndex: this.data.productIndex
    })
  },

  /**
   * 隐藏产品选择器
   */
  hideProductPicker() {
    this.setData({
      showPicker: false
    })
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止点击内容区域时关闭弹窗
  },

  /**
   * 选择产品
   */
  selectProduct(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    this.setData({
      tempProductIndex: index
    })
  },

  /**
   * 确认选择产品
   */
  confirmProduct() {
    this.setData({
      productIndex: this.data.tempProductIndex,
      showPicker: false
    })
  },

  /**
   * 选择产品（原生picker方法，保留作为备用）
   */
  onProductChange(e: WechatMiniprogram.PickerChange) {
    this.setData({
      productIndex: Number(e.detail.value)
    })
  },

  /**
   * 切换话题标签
   */
  toggleTopic(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    const topicList = this.data.topicList
    topicList[index].selected = !topicList[index].selected
    this.setData({ topicList })
  },

  /**
   * 预览视频
   */
  previewVideo() {
    const { videoPath } = this.data
    
    if (!videoPath) {
      wx.showToast({ title: '请先选择视频', icon: 'none' })
      return
    }

    // 跳转到预览页面或使用video组件全屏播放
    wx.navigateTo({
      url: `/pages/community/preview?videoPath=${encodeURIComponent(videoPath)}`
    })
  },

  /**
   * 选择地理位置
   */
  async chooseLocation() {
    try {
      // 先获取当前位置
      let latitude = 31.2304  // 默认上海
      let longitude = 121.4737
      
      try {
        const locationRes = await wx.getLocation({
          type: 'gcj02'
        })
        latitude = locationRes.latitude
        longitude = locationRes.longitude
        console.log('获取当前位置成功:', latitude, longitude)
      } catch (locErr) {
        console.log('获取当前位置失败，使用默认位置:', locErr)
      }
      
      const res = await wx.chooseLocation({
        latitude: latitude,
        longitude: longitude
      })
      
      this.setData({
        location: res.name || res.address
      })
      
      wx.showToast({
        title: '位置已选择',
        icon: 'success',
        duration: 1500
      })
    } catch (error: any) {
      console.log('选择地理位置错误:', error)
      
      // 用户取消选择
      if (error.errMsg && error.errMsg.includes('cancel')) {
        return
      }
      
      // 权限被拒绝
      if (error.errMsg && error.errMsg.includes('auth deny')) {
        wx.showModal({
          title: '需要位置权限',
          content: '选择地理位置需要授权位置信息，是否前往设置？',
          confirmText: '去授权',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (settingRes) => {
                  console.log('授权设置结果:', settingRes)
                }
              })
            }
          }
        })
      } else {
        // 其他错误
        wx.showToast({
          title: '选择位置失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  /**
   * 发布视频
   * 需求：3.4 - 将选中的话题ID列表发送到后端
   */
  async publishVideo() {
    const { videoPath, coverPath, title, description, productIndex, productList, topicList, uploading } = this.data

    // 验证
    if (!videoPath) {
      wx.showToast({ title: '请先选择视频', icon: 'none' })
      return
    }

    if (!title.trim()) {
      wx.showToast({ title: '请输入视频标题', icon: 'none' })
      return
    }

    if (title.length > 50) {
      wx.showToast({ title: '标题不能超过50字', icon: 'none' })
      return
    }

    if (description.length > 200) {
      wx.showToast({ title: '描述不能超过200字', icon: 'none' })
      return
    }

    if (uploading) {
      return
    }

    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/auth/login' })
          }
        }
      })
      return
    }

    try {
      this.setData({ uploading: true, uploadProgress: 0 })

      // 获取选中的产品和话题
      const selectedProduct = productIndex >= 0 ? productList[productIndex] : null
      // 需求：3.4 - 发送话题ID列表而不是话题名称
      const selectedTopicIds = topicList.filter(t => t.selected).map(t => t.id)

      await uploadVideo(
        videoPath,
        coverPath,  // 传递封面路径
        {
          title: title.trim(),
          description: description.trim(),
          location: this.data.location,  // 需求：4.3 - 地理位置可以为空
          productId: selectedProduct?.id,
          topicIds: selectedTopicIds  // 发送话题ID列表
        },
        (progress) => {
          this.setData({ uploadProgress: progress })
        }
      )

      // 上传成功，返回上一页并刷新
      wx.showToast({
        title: '上传成功，等待审核',
        icon: 'success',
        duration: 2000
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 2000)

    } catch (error: any) {
      console.error('上传失败:', error)
      this.setData({ uploading: false })
      
      wx.showToast({
        title: error.message || '上传失败，请重试',
        icon: 'none'
      })
    }
  },

  /**
   * 取消发布
   */
  cancel() {
    if (this.data.uploading) {
      wx.showToast({ title: '正在上传中...', icon: 'none' })
      return
    }

    wx.navigateBack()
  }
})
