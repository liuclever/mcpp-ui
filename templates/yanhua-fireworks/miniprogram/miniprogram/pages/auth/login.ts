// pages/auth/login.ts
import api from '../../utils/api'
import { validatePhone, validatePassword, getPasswordStrength } from '../../utils/validator'

// 登录配置接口
interface LoginConfig {
  wechatEnabled: boolean
  phoneEnabled: boolean
  forceBindPhone: boolean
}

// 登录方式类型
type LoginMethod = 'wechat' | 'phone'

Page({
  data: {
    // 登录配置
    loginConfig: {
      wechatEnabled: true,
      phoneEnabled: true,
      forceBindPhone: false
    } as LoginConfig,
    
    // 表单数据
    phone: '',
    password: '',
    
    // 验证状态
    phoneError: '',
    passwordError: '',
    passwordStrength: '' as 'weak' | 'medium' | 'strong' | '',
    
    // UI状态
    isLoggingIn: false,
    showPasswordStrength: false,
    
    // Tab相关
    currentTab: 'login',
    
    // 微信授权弹窗相关
    showAuthModal: false,
    authAvatar: '',
    authNickname: '',
    pendingWxCode: ''  // 保存待使用的微信code
  },

  /**
   * 页面加载时获取登录配置
   */
  onLoad() {
    this.loadLoginConfig()
    this.loadLastLoginMethod()
  },

  /**
   * 加载登录配置
   * 需求: 2.1, 2.2, 3.1, 3.2, 9.1, 9.2, 9.3
   */
  loadLoginConfig() {
    api.getLoginConfig()
      .then((res) => {
        const config = res.data
        this.setData({ 
          loginConfig: config
        })
        
        console.log('[登录配置加载成功]', config)
      })
      .catch((err) => {
        console.error('[登录配置加载失败]', err)
        // 使用默认配置
        wx.showToast({ 
          title: '配置加载失败，使用默认配置', 
          icon: 'none' 
        })
      })
  },

  /**
   * 加载用户上次使用的登录方式
   * 需求: 9.6
   */
  loadLastLoginMethod() {
    try {
      const lastMethod = wx.getStorageSync('lastLoginMethod') as LoginMethod
      if (lastMethod && (lastMethod === 'wechat' || lastMethod === 'phone')) {
        console.log('[加载上次登录方式]', lastMethod)
      }
    } catch (err) {
      console.error('[加载上次登录方式失败]', err)
    }
  },

  /**
   * 保存用户使用的登录方式
   * 需求: 9.6
   */
  saveLastLoginMethod(method: LoginMethod) {
    try {
      wx.setStorageSync('lastLoginMethod', method)
      console.log('[保存登录方式]', method)
    } catch (err) {
      console.error('[保存登录方式失败]', err)
    }
  },

  // 切换Tab
  switchTab(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.tab
    if (tab === 'register') {
      wx.redirectTo({
        url: '/pages/auth/register'
      })
    }
  },
 
  // 返回
  goBack() {
    wx.navigateBack()
  },

  /**
   * 输入手机号
   * 需求: 3.3, 4.4
   */
  onPhoneInput(e: WechatMiniprogram.Input) {
    const phone = e.detail.value
    this.setData({ phone })
    
    // 实时验证手机号格式
    if (phone) {
      const result = validatePhone(phone)
      this.setData({ 
        phoneError: result.valid ? '' : (result.message || '')
      })
    } else {
      this.setData({ phoneError: '' })
    }
  },

  /**
   * 输入密码
   * 需求: 8.1, 8.2
   */
  onPasswordInput(e: WechatMiniprogram.Input) {
    const password = e.detail.value
    this.setData({ password })
    
    // 实时验证密码格式和强度
    if (password) {
      const result = validatePassword(password)
      const strength = getPasswordStrength(password)
      
      this.setData({ 
        passwordError: result.valid ? '' : (result.message || ''),
        passwordStrength: strength,
        showPasswordStrength: password.length >= 8
      })
    } else {
      this.setData({ 
        passwordError: '',
        passwordStrength: '',
        showPasswordStrength: false
      })
    }
  },

  /**
   * 手机号登录
   * 需求: 3.3, 3.4, 3.5, 3.6, 3.7
   */
  doLogin() {
    const { phone, password } = this.data
    
    // 验证手机号
    const phoneResult = validatePhone(phone)
    if (!phoneResult.valid) {
      this.setData({ phoneError: phoneResult.message || '' })
      wx.showToast({ title: phoneResult.message || '请输入正确的手机号', icon: 'none' })
      return
    }
    
    // 验证密码
    const passwordResult = validatePassword(password)
    if (!passwordResult.valid) {
      this.setData({ passwordError: passwordResult.message || '' })
      wx.showToast({ title: passwordResult.message || '密码格式不正确', icon: 'none' })
      return
    }

    // 防止重复点击
    if (this.data.isLoggingIn) {
      return
    }
    
    // 保存登录方式
    this.saveLastLoginMethod('phone')
    
    // 设置登录状态
    this.setData({ isLoggingIn: true })
    
    // 显示加载状态
    wx.showLoading({ 
      title: '登录中...', 
      mask: true 
    })
    
    // 记录登录开始日志
    console.log('[手机号登录开始]', {
      phone: this.maskPhone(phone),
      timestamp: new Date().toISOString()
    })

    // 调用真实API
    api.login({ phone, password }).then((res: any) => {
      wx.setStorageSync('token', res.data.token)
      wx.setStorageSync('userInfo', res.data.userInfo)
      
      wx.hideLoading()
      wx.showToast({ title: '登录成功', icon: 'success' })
      
      // 记录登录成功日志
      console.log('[手机号登录成功]', {
        phone: this.maskPhone(phone),
        userId: res.data.userInfo?.id,
        timestamp: new Date().toISOString()
      })
      
      setTimeout(() => {
        // 跳转到"我的"页面
        wx.switchTab({
          url: '/pages/mine/index'
        })
      }, 1500)
    }).catch((err: any) => {
      wx.hideLoading()
      wx.showToast({ 
        title: err.message || '登录失败，请检查账号密码', 
        icon: 'none' 
      })
      
      // 记录登录失败日志
      console.error('[手机号登录失败]', {
        phone: this.maskPhone(phone),
        error: err,
        message: err.message,
        timestamp: new Date().toISOString()
      })
    }).finally(() => {
      // 重置登录状态
      this.setData({ isLoggingIn: false })
    })
  },
  
  /**
   * 脱敏显示手机号（显示前3位和后4位）
   */
  maskPhone(phone: string): string {
    if (!phone || phone.length !== 11) {
      return '***'
    }
    return phone.substring(0, 3) + '****' + phone.substring(7)
  },

  // 忘记密码
  forgotPassword() {
    wx.showToast({ title: '请联系客服重置密码', icon: 'none' })
  },

  // 微信登录 - 先显示授权弹窗获取头像和昵称
  wechatLogin() {
    // 检查微信登录是否启用
    if (!this.data.loginConfig.wechatEnabled) {
      wx.showToast({ title: '微信登录暂未开放', icon: 'none' })
      return
    }
    
    // 防止重复点击
    if (this.data.isLoggingIn) {
      console.log('[微信登录] 正在登录中，忽略重复点击')
      return
    }
    
    // 显示授权弹窗，让用户获取头像和昵称
    this.setData({
      showAuthModal: true,
      authAvatar: '',
      authNickname: ''
    })
  },
  
  // 授权弹窗 - 选择头像
  onAuthChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    console.log('[授权弹窗] 获取到微信头像：', avatarUrl)
    this.setData({ authAvatar: avatarUrl })
  },
  
  // 授权弹窗 - 昵称输入
  onAuthNicknameInput(e: WechatMiniprogram.Input) {
    this.setData({ authNickname: e.detail.value })
  },
  
  // 授权弹窗 - 昵称失焦
  onAuthNicknameBlur(e: WechatMiniprogram.InputBlur) {
    const nickname = e.detail.value
    if (nickname) {
      this.setData({ authNickname: nickname })
      console.log('[授权弹窗] 获取到微信昵称：', nickname)
    }
  },
  
  // 关闭授权弹窗
  closeAuthModal() {
    this.setData({
      showAuthModal: false,
      authAvatar: '',
      authNickname: ''
    })
  },
  
  // 确认授权并登录
  async confirmAuth() {
    const { authAvatar, authNickname } = this.data
    
    // 关闭弹窗
    this.setData({ showAuthModal: false })
    
    // 保存登录方式
    this.saveLastLoginMethod('wechat')
    
    // 设置登录状态
    this.setData({ isLoggingIn: true })
    
    // 显示加载状态
    wx.showLoading({ 
      title: '登录中...', 
      mask: true
    })

    try {
      // 如果有头像，先上传到服务器获取永久URL
      let avatarUrl = ''
      if (authAvatar) {
        console.log('[微信登录] 开始上传头像...')
        try {
          avatarUrl = await this.uploadAvatarForLogin(authAvatar)
          console.log('[微信登录] 头像上传成功:', avatarUrl)
        } catch (uploadErr) {
          console.error('[微信登录] 头像上传失败，继续登录:', uploadErr)
        }
      }

      // 调用wx.login()获取code
      const loginRes: any = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })

      if (!loginRes.code) {
        throw new Error('获取微信code失败')
      }

      // 发送code和用户信息到后端
      const result: any = await api.wxLogin({ 
        code: loginRes.code,
        nickname: authNickname || undefined,
        avatar: avatarUrl || undefined
      })
      
      // 处理登录成功：存储token和userInfo
      wx.setStorageSync('token', result.data.token)
      wx.setStorageSync('userInfo', result.data.userInfo)
      
      wx.hideLoading()
      
      // 检查是否需要绑定手机号
      if (result.data.needBindPhone) {
        console.log('[微信登录成功] 需要绑定手机号')
        wx.showToast({ title: '请先绑定手机号', icon: 'none', duration: 1500 })
        setTimeout(() => {
          wx.navigateTo({ url: '/pages/auth/bind-phone' })
        }, 1500)
      } else {
        console.log('[微信登录成功] 无需绑定手机号')
        wx.showToast({ title: '登录成功', icon: 'success', duration: 1500 })
        setTimeout(() => {
          wx.switchTab({ url: '/pages/mine/index' })
        }, 1500)
      }
    } catch (err: any) {
      wx.hideLoading()
      const errorMessage = this.getWechatLoginErrorMessage(err)
      wx.showToast({ title: errorMessage, icon: 'none', duration: 2500 })
      console.error('[微信登录失败]', err)
    } finally {
      this.setData({ isLoggingIn: false })
    }
  },
  
  // 登录时上传头像（无需token）
  uploadAvatarForLogin(filePath: string): Promise<string> {
    const uploadUrl = api.getBaseUrl() + '/upload/avatar/public'
    console.log('[头像上传] URL:', uploadUrl)
    console.log('[头像上传] 文件路径:', filePath)
    
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: uploadUrl,
        filePath: filePath,
        name: 'file',
        success: (res) => {
          console.log('[头像上传] 响应状态码:', res.statusCode)
          console.log('[头像上传] 响应数据:', res.data)
          
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data)
              if (data.code === 200 && data.data?.url) {
                resolve(data.data.url)
              } else {
                reject(new Error(data.message || '上传失败'))
              }
            } catch (e) {
              reject(new Error('解析响应失败: ' + res.data))
            }
          } else {
            reject(new Error('上传失败，状态码: ' + res.statusCode + ', 响应: ' + res.data))
          }
        },
        fail: (err) => {
          console.error('[头像上传] 请求失败:', err)
          reject(err)
        }
      })
    })
  },

  /**
   * 获取微信登录错误提示信息
   * 根据不同错误类型返回友好的提示信息
   * 需求: 4.1, 4.2, 4.3, 4.4
   */
  getWechatLoginErrorMessage(err: any): string {
    // 默认错误信息
    let errorMessage = '微信登录失败，请稍后重试'
    
    if (!err) {
      return errorMessage
    }
    
    // 检查错误消息
    const errMsg = err.message || err.errMsg || ''
    
    // 0. 超时错误特殊处理（优先级最高）
    if (errMsg.includes('timeout') || errMsg.includes('time out')) {
      errorMessage = '网络连接超时，请检查网络后重试'
    }
    // 1. 微信授权失败提示 (需求 4.1)
    else if (errMsg.includes('code无效') || 
        errMsg.includes('invalid code') || 
        errMsg.includes('code已使用') ||
        errMsg.includes('40029') ||
        errMsg.includes('40163')) {
      errorMessage = '登录凭证已过期，请重新登录'
    }
    // 2. 网络错误提示 (需求 4.2)
    else if (errMsg.includes('网络') || 
             errMsg.includes('network') ||
             errMsg.includes('连接') ||
             err.statusCode === 0 ||
             err.errno === 'ETIMEDOUT') {
      errorMessage = '网络错误，请检查网络连接'
    }
    // 3. 服务器异常提示 (需求 4.3)
    else if (errMsg.includes('服务器') || 
             errMsg.includes('繁忙') ||
             errMsg.includes('server') ||
             errMsg.includes('500') ||
             errMsg.includes('503') ||
             err.statusCode >= 500) {
      errorMessage = '服务器繁忙，请稍后重试'
    }
    // 4. 频率限制提示
    else if (errMsg.includes('频繁') || 
             errMsg.includes('频率') ||
             errMsg.includes('45011') ||
             errMsg.includes('rate limit')) {
      errorMessage = '登录请求过于频繁，请稍后重试'
    }
    // 5. 用户拒绝授权提示 (需求 4.4)
    else if (errMsg.includes('auth deny') || 
             errMsg.includes('auth denied') ||
             errMsg.includes('拒绝') ||
             errMsg.includes('取消')) {
      errorMessage = '需要授权才能使用完整功能'
    }
    // 6. 配置错误提示
    else if (errMsg.includes('AppID') || 
             errMsg.includes('AppSecret') ||
             errMsg.includes('40013')) {
      errorMessage = '系统配置错误，请联系客服'
    }
    // 7. 账号被禁用
    else if (errMsg.includes('禁用') || 
             errMsg.includes('disabled')) {
      errorMessage = '账号已被禁用，请联系客服'
    }
    // 8. 其他错误，显示具体错误信息
    else if (errMsg) {
      errorMessage = errMsg
    }
    
    return errorMessage
  },

  // 手机号快捷登录
  phoneLogin() {
    wx.showToast({ title: '请使用手机号密码登录', icon: 'none' })
  },

  // 导航到产品页
  navigateToProduct() {
    wx.switchTab({
      url: '/pages/product/index'
    })
  },

  // 导航到门店页
  navigateToStore() {
    wx.switchTab({
      url: '/pages/store/index'
    })
  },

  // 导航到官网页
  navigateToOfficial() {
    wx.switchTab({
      url: '/pages/official/index'
    })
  },

  // 导航到关于页
  navigateToAbout() {
    wx.switchTab({
      url: '/pages/about/index'
    })
  },

  // 导航到我的页
  navigateToMine() {
    wx.switchTab({
      url: '/pages/mine/index'
    })
  }
})
