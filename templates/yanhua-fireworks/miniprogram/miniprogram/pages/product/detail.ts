// pages/product/detail.ts
import interactionApi from '../../utils/interaction-api'

Page({
  data: {
    productId: '',
    currentTab: 'video',
    showShareModal: false,
    showCommentModal: false,
    showCommentInput: false,
    showReplyInput: false,
    replyComment: null,
    product: {
      id: 1,
      name: '愤怒的小鸟A',
      nameEn: 'ZHENGPANYANHUA',
      category: '玩具类',
      code: 'CQ00316',
      content: '6/50/35',
      volume: '41*24.5*24.3=0.02m³',
      image: '',
      qrcode: '',
      videoUrl: '',
      tutorialUrl: '',
      views: 628,
      likes: 240
    },
    comments: [],
    hasMoreComments: false,
    loadingComments: false,
    showEmptyComments: false,
    isVideoPlaying: false,      // 视频是否正在播放
    isTutorialPlaying: false    // 教程是否正在播放
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ productId: options.id })
      this.loadProductDetail(options.id)
    }
  },

  // 加载产品详情
  loadProductDetail(id: string) {
    wx.showLoading({ title: '加载中...', mask: true })
    
    const api = require('../../utils/api').default
    api.getProductDetail(id).then((res: any) => {
      wx.hideLoading()
      this.setData({ product: res.data })
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  // 切换tab并播放对应视频
  switchTab(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    
    // 点击后直接播放对应视频
    if (tab === 'video') {
      this.playVideo()
    } else if (tab === 'tutorial') {
      this.playTutorial()
    }
  },

  // 播放视频 - 内嵌播放
  playVideo() {
    const videoUrl = this.data.product.videoUrl
    if (!videoUrl) {
      wx.showToast({ title: '暂无视频', icon: 'none' })
      return
    }
    // 停止教程播放，开始视频播放
    this.setData({ 
      isVideoPlaying: true,
      isTutorialPlaying: false 
    })
  },

  // 播放教程 - 内嵌播放
  playTutorial() {
    const tutorialUrl = this.data.product.tutorialUrl
    if (!tutorialUrl) {
      wx.showToast({ title: '暂无教程', icon: 'none' })
      return
    }
    // 停止视频播放，开始教程播放
    this.setData({ 
      isVideoPlaying: false,
      isTutorialPlaying: true 
    })
  },

  // 视频播放结束
  onVideoEnded() {
    this.setData({ isVideoPlaying: false })
  },

  // 视频播放错误
  onVideoError(e: any) {
    console.error('视频播放错误:', e)
    this.setData({ isVideoPlaying: false })
    wx.showToast({ title: '视频加载失败', icon: 'none' })
  },

  // 教程播放结束
  onTutorialEnded() {
    this.setData({ isTutorialPlaying: false })
  },

  // 教程播放错误
  onTutorialError(e: any) {
    console.error('教程播放错误:', e)
    this.setData({ isTutorialPlaying: false })
    wx.showToast({ title: '教程加载失败', icon: 'none' })
  },

  // 跳转附近网点
  goNearby() {
    wx.navigateTo({
      url: '/pages/store/nearby'
    })
  },

  // 显示二维码/分享卡片
  showQrcode() {
    this.setData({ showShareModal: true })
    // 加载产品二维码
    this.loadProductQrCode()
  },

  // 加载产品小程序码
  loadProductQrCode() {
    const productId = this.data.productId
    if (!productId) return
    
    // 如果已有二维码，不重复加载
    if (this.data.product.qrcode) return
    
    wx.request({
      url: `https://fireworks-project.zhengpan.cn/api/wxacode/product/${productId}`,
      method: 'GET',
      success: (res: any) => {
        if (res.statusCode === 200 && res.data.code === 200 && res.data.data) {
          this.setData({
            'product.qrcode': res.data.data
          })
        }
      },
      fail: (error) => {
        console.error('加载产品二维码失败:', error)
      }
    })
  },

  // 隐藏分享弹窗
  hideShareModal() {
    this.setData({ showShareModal: false })
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

  // 扫码
  scanCode() {
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果:', res)
      }
    })
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/official/index'
    })
  },

  // 分享产品
  shareProduct() {
    this.setData({ showShareModal: true })
    this.loadProductQrCode()
  },

  // 保存分享图片到相册 - 绘制整个卡片
  saveShareImage() {
    const that = this
    const product = this.data.product
    
    if (!product) {
      wx.showToast({ title: '产品信息加载中', icon: 'none' })
      return
    }
    
    wx.showLoading({ title: '生成图片中...' })
    
    // 获取canvas
    const query = wx.createSelectorQuery()
    query.select('#shareCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          wx.hideLoading()
          wx.showToast({ title: '生成图片失败', icon: 'none' })
          return
        }
        
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        
        // 设置canvas尺寸
        const dpr = wx.getSystemInfoSync().pixelRatio
        const canvasWidth = 600
        const canvasHeight = 800
        canvas.width = canvasWidth * dpr
        canvas.height = canvasHeight * dpr
        ctx.scale(dpr, dpr)
        
        // 绘制白色背景
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        
        // 准备图片URL
        let productImageUrl = product.image || ''
        let qrcodeUrl = product.qrcode || ''
        const logoUrl = '/assets/images/brand-logo-small.png'
        
        // 确保URL完整
        if (productImageUrl.startsWith('//')) {
          productImageUrl = 'https:' + productImageUrl
        } else if (productImageUrl && !productImageUrl.startsWith('http')) {
          productImageUrl = 'https://fireworks-project.zhengpan.cn' + productImageUrl
        }
        
        if (qrcodeUrl.startsWith('//')) {
          qrcodeUrl = 'https:' + qrcodeUrl
        } else if (qrcodeUrl && !qrcodeUrl.startsWith('http')) {
          qrcodeUrl = 'https://fireworks-project.zhengpan.cn' + qrcodeUrl
        }
        
        // 下载所有图片并绘制
        const downloadPromises: Promise<string>[] = []
        
        if (productImageUrl) {
          downloadPromises.push(that.downloadImageToLocal(productImageUrl))
        } else {
          downloadPromises.push(Promise.resolve(''))
        }
        
        if (qrcodeUrl) {
          downloadPromises.push(that.downloadImageToLocal(qrcodeUrl))
        } else {
          downloadPromises.push(Promise.resolve(''))
        }
        
        Promise.all(downloadPromises).then((localPaths) => {
          const productImgPath = localPaths[0]
          const qrcodePath = localPaths[1]
          
          // 绘制头部logo区域
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvasWidth, 80)
          
          // 绘制品牌文字
          ctx.fillStyle = '#d03a6a'
          ctx.font = 'bold 28px sans-serif'
          ctx.fillText('正擎烟花', 30, 50)
          ctx.font = '14px sans-serif'
          ctx.fillStyle = '#999999'
          ctx.fillText('儿童安全烟花领导品牌', 30, 70)
          
          // 绘制产品图片
          if (productImgPath) {
            const productImg = canvas.createImage()
            productImg.onload = () => {
              ctx.drawImage(productImg, 50, 100, 500, 350)
              
              // 绘制产品信息
              that.drawProductInfo(ctx, product, canvasWidth)
              
              // 绘制二维码
              if (qrcodePath) {
                const qrcodeImg = canvas.createImage()
                qrcodeImg.onload = () => {
                  ctx.drawImage(qrcodeImg, 450, 480, 120, 120)
                  ctx.font = '12px sans-serif'
                  ctx.fillStyle = '#666666'
                  ctx.textAlign = 'center'
                  ctx.fillText('扫一扫看效果', 510, 620)
                  
                  // 绘制视频标签
                  ctx.fillStyle = '#d03a6a'
                  ctx.fillRect(470, 635, 80, 24)
                  ctx.fillStyle = '#ffffff'
                  ctx.font = '12px sans-serif'
                  ctx.fillText('内有视频', 510, 652)
                  ctx.textAlign = 'left'
                  
                  // 导出图片
                  that.exportCanvasImage(canvas)
                }
                qrcodeImg.src = qrcodePath
              } else {
                that.exportCanvasImage(canvas)
              }
            }
            productImg.src = productImgPath
          } else {
            that.drawProductInfo(ctx, product, canvasWidth)
            that.exportCanvasImage(canvas)
          }
        }).catch((err) => {
          wx.hideLoading()
          console.error('下载图片失败:', err)
          wx.showToast({ title: '生成图片失败', icon: 'none' })
        })
      })
  },

  // 绘制产品信息
  drawProductInfo(ctx: any, product: any, canvasWidth: number) {
    // 产品名称
    ctx.fillStyle = '#333333'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText(product.name || '', 30, 490)
    
    // 产品规格
    ctx.font = '18px sans-serif'
    ctx.fillStyle = '#666666'
    const specs = [
      `类别：${product.category || ''}`,
      `编号：${product.code || ''}`,
      `含量：${product.content || ''}`,
      `体积：${product.volume || ''}`
    ]
    
    let y = 530
    specs.forEach(spec => {
      ctx.fillText(spec, 30, y)
      y += 30
    })
  },

  // 下载图片到本地
  downloadImageToLocal(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve('')
        return
      }
      wx.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            resolve('')
          }
        },
        fail: () => {
          resolve('')
        }
      })
    })
  },

  // 导出canvas为图片并保存
  exportCanvasImage(canvas: any) {
    wx.canvasToTempFilePath({
      canvas: canvas,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading()
            wx.showToast({ title: '已保存到相册', icon: 'success' })
          },
          fail: (err) => {
            wx.hideLoading()
            console.error('保存到相册失败:', err)
            if (err.errMsg && err.errMsg.includes('auth deny')) {
              wx.showModal({
                title: '提示',
                content: '需要授权保存图片到相册',
                confirmText: '去设置',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting({})
                  }
                }
              })
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' })
            }
          }
        })
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('导出图片失败:', err)
        wx.showToast({ title: '生成图片失败', icon: 'none' })
      }
    })
  },

  // 显示评论
  showComment() {
    this.setData({ 
      showCommentModal: true,
      showEmptyComments: this.data.comments.length === 0
    })
    // 加载评论列表
    this.loadComments()
  },

  // 隐藏评论弹窗
  hideCommentModal() {
    this.setData({ showCommentModal: false })
  },

  // 加载评论列表
  loadComments() {
    // 调用API加载产品评论
    const productId = this.data.productId
    
    if (!productId) {
      console.warn('productId 不存在，无法加载评论')
      return
    }
    
    interactionApi.getProductCommentList({
      productId: productId,
      page: 1,
      pageSize: 20
    }).then((res: any) => {
      this.setData({
        comments: res.records || [],
        showEmptyComments: (res.records || []).length === 0,
        hasMoreComments: res.total > res.records.length
      })
    }).catch((err: any) => {
      console.error('加载评论失败:', err)
      // 失败时显示空状态
      this.setData({
        comments: [],
        showEmptyComments: true
      })
    })
  },

  // 回复评论
  onReplyComment(e: any) {
    const { comment } = e.detail
    console.log('回复评论:', comment)
    
    // 显示回复输入框
    this.setData({
      showReplyInput: true,
      replyComment: comment
    })
  },

  // 显示评论输入框
  showCommentInput() {
    this.setData({
      showCommentInput: true
    })
  },

  // 提交评论
  onCommentSubmit(e: any) {
    const { videoId, content } = e.detail
    console.log('提交评论:', { videoId, content })
    
    // 调用API提交评论
    interactionApi.publishProductComment({
      productId: this.data.productId,
      content: content
    }).then(() => {
      // 重置输入框
      const commentInput = this.selectComponent('#commentInput') as any
      if (commentInput) {
        commentInput.reset()
      }
      
      // 隐藏输入框
      this.setData({
        showCommentInput: false
      })
      
      // 刷新评论列表
      this.loadComments()
    }).catch((err: any) => {
      console.error('评论失败:', err)
      wx.showToast({
        title: '评论失败，请重试',
        icon: 'none'
      })
    })
  },

  // 取消评论
  onCommentCancel() {
    this.setData({
      showCommentInput: false
    })
  },

  // 提交回复
  onReplySubmit(e: any) {
    const { videoId, content, parentId, replyToId } = e.detail
    console.log('提交回复:', { videoId, content, parentId, replyToId })
    
    // 调用API提交回复
    interactionApi.publishProductComment({
      productId: this.data.productId,
      content: content,
      parentId: parentId,
      replyToId: replyToId
    }).then(() => {
      // 重置输入框
      const replyInput = this.selectComponent('#replyInput') as any
      if (replyInput) {
        replyInput.reset()
      }
      
      // 隐藏输入框
      this.setData({
        showReplyInput: false,
        replyComment: null
      })
      
      // 刷新评论列表
      this.loadComments()
    }).catch((err: any) => {
      console.error('回复失败:', err)
      wx.showToast({
        title: '回复失败，请重试',
        icon: 'none'
      })
    })
  },

  // 取消回复
  onReplyCancel() {
    this.setData({
      showReplyInput: false,
      replyComment: null
    })
  },

  // 点赞评论
  onLikeComment(e: any) {
    const { comment } = e.detail
    wx.showToast({
      title: comment.isLiked ? '取消点赞' : '点赞成功',
      icon: 'none'
    })
    // TODO: 调用点赞API
  },

  // 加载更多评论
  onLoadMoreComments() {
    if (this.data.loadingComments) return
    
    this.setData({ loadingComments: true })
    
    // TODO: 调用API加载更多评论
    setTimeout(() => {
      this.setData({ 
        loadingComments: false,
        hasMoreComments: false
      })
    }, 1000)
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: this.data.product.name + ' - 正攀烟花',
      path: `/pages/product/detail?id=${this.data.productId}`
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.data.product.name + ' - 正攀烟花',
      query: `id=${this.data.productId}`,
      imageUrl: this.data.product.image || ''
    }
  }
})
