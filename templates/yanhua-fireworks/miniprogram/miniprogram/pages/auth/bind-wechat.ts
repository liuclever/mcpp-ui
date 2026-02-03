// pages/auth/bind-wechat.ts
import api from '../../utils/api'

Page({
  data: {
    // UI状态
    isBinding: false,
    showMergeDialog: false,
    isBound: false,  // 是否已绑定微信
    isLoading: true, // 加载状态
    
    // 合并相关
    targetUserId: 0,
    mergePassword: '',
    mergePasswordError: '',
    
    // 微信信息
    wechatCode: ''
  },

  onLoad() {
    this.checkBindingStatus()
  },

  // 检查绑定状态
  async checkBindingStatus() {
    try {
      const res = await api.getBindingStatus()
      console.log('绑定状态:', res)
      if (res.code === 200 && res.data) {
        this.setData({
          isBound: res.data.wechatBound || false,
          isLoading: false
        })
      } else {
        this.setData({ isLoading: false })
      }
    } catch (error) {
      console.error('获取绑定状态失败:', error)
      this.setData({ isLoading: false })
    }
  },

  // 解绑微信
  unbindWechat() {
    wx.showModal({
      title: '确认解绑',
      content: '解绑后将无法使用微信快速登录，确定要解绑吗？',
      confirmText: '确认解绑',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          this.doUnbind()
        }
      }
    })
  },

  // 执行解绑
  async doUnbind() {
    wx.showLoading({ title: '解绑中...', mask: true })
    try {
      // 需要输入密码验证
      wx.hideLoading()
      wx.showModal({
        title: '安全验证',
        content: '请输入账号密码以确认解绑',
        editable: true,
        placeholderText: '请输入密码',
        success: async (modalRes) => {
          if (modalRes.confirm && modalRes.content) {
            wx.showLoading({ title: '解绑中...', mask: true })
            try {
              await api.unbindWechat({ password: modalRes.content })
              wx.hideLoading()
              wx.showToast({ title: '解绑成功', icon: 'success' })
              this.setData({ isBound: false })
            } catch (err: any) {
              wx.hideLoading()
              wx.showToast({ title: err.message || '解绑失败', icon: 'none' })
            }
          }
        }
      })
    } catch (error: any) {
      wx.hideLoading()
      wx.showToast({ title: error.message || '解绑失败', icon: 'none' })
    }
  },

  /**
   * 绑定微信
   * 需求: 5.5, 5.7
   */
  bindWechat() {
    // 防止重复点击
    if (this.data.isBinding) {
      console.log('[绑定微信] 正在绑定中，忽略重复点击')
      return
    }
    
    // 设置绑定状态
    this.setData({ isBinding: true })
    
    // 显示加载状态
    wx.showLoading({ 
      title: '绑定中...', 
      mask: true 
    })

    // 调用wx.login()获取code
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('[绑定微信] 获取code成功')
          
          // 保存code
          this.setData({ wechatCode: res.code })
          
          // 调用后端API绑定微信
          api.request({
            url: '/auth/bind/wechat',
            method: 'POST',
            data: { code: res.code }
          })
            .then(() => {
              wx.hideLoading()
              wx.showToast({ 
                title: '绑定成功', 
                icon: 'success',
                duration: 1500
              })
              
              console.log('[绑定微信成功]', {
                timestamp: new Date().toISOString()
              })
              
              // 返回上一页或跳转到个人中心
              setTimeout(() => {
                wx.navigateBack({
                  fail: () => {
                    wx.switchTab({
                      url: '/pages/mine/index'
                    })
                  }
                })
              }, 1500)
            })
            .catch((err: any) => {
              wx.hideLoading()
              
              // 处理"微信已被绑定"错误
              // 需求: 5.7
              const errorMessage = this.getBindErrorMessage(err)
              
              if (this.isWechatAlreadyBoundError(err)) {
                // 显示账号合并对话框
                this.setData({ 
                  showMergeDialog: true,
                  targetUserId: err.data?.userId || 0
                })
              } else {
                wx.showToast({ 
                  title: errorMessage, 
                  icon: 'none',
                  duration: 2500
                })
              }
              
              console.error('[绑定微信失败]', {
                error: err,
                message: errorMessage,
                timestamp: new Date().toISOString()
              })
            })
            .finally(() => {
              // 重置绑定状态
              this.setData({ isBinding: false })
            })
        } else {
          // 获取code失败
          wx.hideLoading()
          this.setData({ isBinding: false })
          
          wx.showToast({ 
            title: '微信授权失败，请重试', 
            icon: 'none',
            duration: 2000
          })
          
          console.error('[微信授权失败] 未获取到code', {
            timestamp: new Date().toISOString()
          })
        }
      },
      fail: (err) => {
        // wx.login调用失败
        wx.hideLoading()
        this.setData({ isBinding: false })
        
        let errorMessage = '微信授权失败'
        if (err.errMsg) {
          if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
            errorMessage = '需要授权才能绑定微信'
          } else if (err.errMsg.includes('fail')) {
            errorMessage = '微信授权失败，请重试'
          }
        }
        
        wx.showToast({ 
          title: errorMessage, 
          icon: 'none',
          duration: 2000
        })
        
        console.error('[wx.login调用失败]', {
          error: err,
          message: errorMessage,
          timestamp: new Date().toISOString()
        })
      }
    })
  },

  /**
   * 判断是否为"微信已被绑定"错误
   * 需求: 5.7
   */
  isWechatAlreadyBoundError(err: any): boolean {
    if (!err) return false
    
    const errMsg = err.message || err.errMsg || ''
    const errCode = err.code || ''
    
    return errMsg.includes('已被绑定') || 
           errMsg.includes('已绑定') || 
           errMsg.includes('already bound') ||
           errCode === 'WECHAT_ALREADY_BOUND'
  },

  /**
   * 获取绑定错误提示信息
   */
  getBindErrorMessage(err: any): string {
    let errorMessage = '绑定失败，请稍后重试'
    
    if (!err) {
      return errorMessage
    }
    
    const errMsg = err.message || err.errMsg || ''
    
    // 微信已被绑定
    if (this.isWechatAlreadyBoundError(err)) {
      errorMessage = '该微信已被其他账号绑定，是否合并账号？'
    }
    // code无效
    else if (errMsg.includes('code无效') || errMsg.includes('invalid code')) {
      errorMessage = '微信授权已过期，请重试'
    }
    // 网络错误
    else if (errMsg.includes('网络') || errMsg.includes('network') || errMsg.includes('timeout')) {
      errorMessage = '网络错误，请检查网络连接'
    }
    // 服务器错误
    else if (errMsg.includes('服务器') || errMsg.includes('server') || errMsg.includes('500')) {
      errorMessage = '服务器繁忙，请稍后重试'
    }
    // 其他错误，显示具体错误信息
    else if (errMsg) {
      errorMessage = errMsg
    }
    
    return errorMessage
  },

  /**
   * 关闭合并对话框
   */
  closeMergeDialog() {
    this.setData({ 
      showMergeDialog: false,
      mergePassword: '',
      mergePasswordError: ''
    })
  },

  /**
   * 输入合并密码
   */
  onMergePasswordInput(e: WechatMiniprogram.Input) {
    const mergePassword = e.detail.value
    this.setData({ mergePassword, mergePasswordError: '' })
  },

  /**
   * 确认合并账号
   */
  confirmMerge() {
    const { mergePassword, targetUserId } = this.data
    
    if (!mergePassword) {
      this.setData({ mergePasswordError: '请输入原账号密码' })
      wx.showToast({ 
        title: '请输入原账号密码', 
        icon: 'none' 
      })
      return
    }

    // 显示加载状态
    wx.showLoading({ 
      title: '合并中...', 
      mask: true 
    })
    
    console.log('[账号合并开始]', {
      timestamp: new Date().toISOString()
    })

    // 调用账号合并API
    api.request({
      url: '/auth/merge',
      method: 'POST',
      data: { 
        targetUserId,
        password: mergePassword 
      }
    })
      .then(() => {
        wx.hideLoading()
        wx.showToast({ 
          title: '账号合并成功', 
          icon: 'success',
          duration: 1500
        })
        
        console.log('[账号合并成功]', {
          timestamp: new Date().toISOString()
        })
        
        // 关闭对话框
        this.closeMergeDialog()
        
        // 合并成功后需要重新登录
        setTimeout(() => {
          wx.showModal({
            title: '提示',
            content: '账号合并成功，请重新登录',
            showCancel: false,
            success: () => {
              // 清除登录信息
              wx.removeStorageSync('token')
              wx.removeStorageSync('userInfo')
              
              // 跳转到登录页
              wx.redirectTo({
                url: '/pages/auth/login'
              })
            }
          })
        }, 1500)
      })
      .catch((err: any) => {
        wx.hideLoading()
        
        const errorMessage = this.getMergeErrorMessage(err)
        wx.showToast({ 
          title: errorMessage, 
          icon: 'none',
          duration: 2500
        })
        
        console.error('[账号合并失败]', {
          error: err,
          message: errorMessage,
          timestamp: new Date().toISOString()
        })
      })
  },

  /**
   * 获取合并错误提示信息
   */
  getMergeErrorMessage(err: any): string {
    let errorMessage = '账号合并失败，请稍后重试'
    
    if (!err) {
      return errorMessage
    }
    
    const errMsg = err.message || err.errMsg || ''
    
    // 密码错误
    if (errMsg.includes('密码错误') || errMsg.includes('密码不正确')) {
      errorMessage = '原账号密码错误'
    }
    // 网络错误
    else if (errMsg.includes('网络') || errMsg.includes('network') || errMsg.includes('timeout')) {
      errorMessage = '网络错误，请检查网络连接'
    }
    // 服务器错误
    else if (errMsg.includes('服务器') || errMsg.includes('server') || errMsg.includes('500')) {
      errorMessage = '服务器繁忙，请稍后重试'
    }
    // 其他错误，显示具体错误信息
    else if (errMsg) {
      errorMessage = errMsg
    }
    
    return errorMessage
  }
})
