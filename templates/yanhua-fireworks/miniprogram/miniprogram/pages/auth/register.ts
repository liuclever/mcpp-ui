// pages/auth/register.ts
import api from '../../utils/api'
import { validatePhone, validatePassword, validateVerifyCode, getPasswordStrength } from '../../utils/validator'

Page({
  data: {
    currentTab: 'register',
    phone: '',
    password: '',
    confirmPassword: '',
    code: '',
    countdown: 0,
    
    // 验证状态
    phoneError: '',
    passwordError: '',
    confirmPasswordError: '',
    codeError: '',
    passwordStrength: '' as 'weak' | 'medium' | 'strong' | '',
    
    // UI状态
    isRegistering: false,
    showPasswordStrength: false
  },

  timer: null as number | null,

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  // 切换Tab
  switchTab(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.tab
    if (tab === 'login') {
      wx.redirectTo({
        url: '/pages/auth/login'
      })
    }
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
      
      // 如果确认密码已输入，同时验证两次密码是否一致
      if (this.data.confirmPassword) {
        this.validateConfirmPassword()
      }
    } else {
      this.setData({ 
        passwordError: '',
        passwordStrength: '',
        showPasswordStrength: false
      })
    }
  },

  /**
   * 确认密码
   * 需求: 4.3
   */
  onConfirmPasswordInput(e: WechatMiniprogram.Input) {
    const confirmPassword = e.detail.value
    this.setData({ confirmPassword })
    
    // 实时验证两次密码是否一致
    if (confirmPassword) {
      this.validateConfirmPassword()
    } else {
      this.setData({ confirmPasswordError: '' })
    }
  },

  /**
   * 验证确认密码
   */
  validateConfirmPassword() {
    const { password, confirmPassword } = this.data
    if (confirmPassword && password !== confirmPassword) {
      this.setData({ confirmPasswordError: '两次密码输入不一致' })
    } else {
      this.setData({ confirmPasswordError: '' })
    }
  },

  /**
   * 输入验证码
   */
  onCodeInput(e: WechatMiniprogram.Input) {
    const code = e.detail.value
    this.setData({ code })
    
    // 实时验证验证码格式
    if (code) {
      const result = validateVerifyCode(code)
      this.setData({ 
        codeError: result.valid ? '' : (result.message || '')
      })
    } else {
      this.setData({ codeError: '' })
    }
  },

  /**
   * 发送验证码
   * 需求: 4.5, 4.6, 7.2, 7.3, 7.4, 7.5, 7.6
   */
  sendCode() {
    // 防止重复点击
    if (this.data.countdown > 0) {
      return
    }
    
    const { phone } = this.data
    
    // 验证手机号
    const phoneResult = validatePhone(phone)
    if (!phoneResult.valid) {
      this.setData({ phoneError: phoneResult.message || '' })
      wx.showToast({ 
        title: phoneResult.message || '请输入正确的手机号', 
        icon: 'none' 
      })
      return
    }

    // 显示加载状态
    wx.showLoading({ 
      title: '发送中...', 
      mask: true 
    })

    // 调用API发送验证码
    api.sendSmsCode(phone, 'REGISTER')
      .then(() => {
        wx.hideLoading()
        wx.showToast({ 
          title: '验证码已发送', 
          icon: 'success' 
        })
        
        // 开始倒计时（60秒）
        this.setData({ countdown: 60 })
        this.timer = setInterval(() => {
          if (this.data.countdown <= 1) {
            clearInterval(this.timer!)
            this.setData({ countdown: 0 })
          } else {
            this.setData({ countdown: this.data.countdown - 1 })
          }
        }, 1000) as unknown as number
        
        console.log('[验证码发送成功]', {
          phone: this.maskPhone(phone),
          timestamp: new Date().toISOString()
        })
      })
      .catch((err: any) => {
        wx.hideLoading()
        
        const errorMessage = this.getSmsErrorMessage(err)
        wx.showToast({ 
          title: errorMessage, 
          icon: 'none',
          duration: 2500
        })
        
        console.error('[验证码发送失败]', {
          phone: this.maskPhone(phone),
          error: err,
          message: errorMessage,
          timestamp: new Date().toISOString()
        })
      })
  },

  /**
   * 获取短信发送错误提示信息
   * 需求: 11.1, 11.2, 11.3, 11.6
   */
  getSmsErrorMessage(err: any): string {
    let errorMessage = '验证码发送失败，请稍后重试'
    
    if (!err) {
      return errorMessage
    }
    
    const errMsg = err.message || err.errMsg || ''
    
    // 频率限制
    if (errMsg.includes('频繁') || errMsg.includes('频率') || errMsg.includes('60秒')) {
      errorMessage = '发送过于频繁，请60秒后再试'
    }
    // 每日次数限制
    else if (errMsg.includes('每日') || errMsg.includes('次数') || errMsg.includes('10次')) {
      errorMessage = '今日发送次数已达上限'
    }
    // IP限制
    else if (errMsg.includes('IP') || errMsg.includes('小时')) {
      errorMessage = '发送次数过多，请稍后再试'
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
   * 注册
   * 需求: 4.1, 4.2, 4.3, 4.7, 4.8, 4.9
   */
  doRegister() {
    const { phone, password, confirmPassword, code } = this.data
    
    // 验证手机号
    const phoneResult = validatePhone(phone)
    if (!phoneResult.valid) {
      this.setData({ phoneError: phoneResult.message || '' })
      wx.showToast({ 
        title: phoneResult.message || '请输入正确的手机号', 
        icon: 'none' 
      })
      return
    }
    
    // 验证密码
    const passwordResult = validatePassword(password)
    if (!passwordResult.valid) {
      this.setData({ passwordError: passwordResult.message || '' })
      wx.showToast({ 
        title: passwordResult.message || '密码格式不正确', 
        icon: 'none' 
      })
      return
    }
    
    // 验证确认密码
    if (password !== confirmPassword) {
      this.setData({ confirmPasswordError: '两次密码输入不一致' })
      wx.showToast({ 
        title: '两次密码输入不一致', 
        icon: 'none' 
      })
      return
    }
    
    // 验证验证码
    const codeResult = validateVerifyCode(code)
    if (!codeResult.valid) {
      this.setData({ codeError: codeResult.message || '' })
      wx.showToast({ 
        title: codeResult.message || '请输入6位验证码', 
        icon: 'none' 
      })
      return
    }

    // 防止重复提交
    if (this.data.isRegistering) {
      return
    }
    
    // 设置注册状态
    this.setData({ isRegistering: true })
    
    // 显示加载状态
    wx.showLoading({ 
      title: '注册中...', 
      mask: true 
    })
    
    console.log('[注册开始]', {
      phone: this.maskPhone(phone),
      timestamp: new Date().toISOString()
    })

    // 调用API注册
    api.phoneRegister({ 
      phone, 
      smsCode: code, 
      password 
    })
      .then((res: any) => {
        wx.hideLoading()
        
        // 注册成功后自动登录
        // 保存token和用户信息
        if (res.data && res.data.token) {
          wx.setStorageSync('token', res.data.token)
          if (res.data.user || res.data.userInfo) {
            wx.setStorageSync('userInfo', res.data.user || res.data.userInfo)
          }
          
          wx.showToast({ 
            title: '注册成功', 
            icon: 'success',
            duration: 1500
          })
          
          console.log('[注册成功]', {
            phone: this.maskPhone(phone),
            userId: res.data.user?.id || res.data.userInfo?.id,
            timestamp: new Date().toISOString()
          })
          
          // 跳转到个人中心
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/mine/index'
            })
          }, 1500)
        } else {
          // 如果没有返回token，提示用户去登录
          wx.showToast({ 
            title: '注册成功，请登录', 
            icon: 'success',
            duration: 1500
          })
          
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/auth/login'
            })
          }, 1500)
        }
      })
      .catch((err: any) => {
        wx.hideLoading()
        
        const errorMessage = this.getRegisterErrorMessage(err)
        wx.showToast({ 
          title: errorMessage, 
          icon: 'none',
          duration: 2500
        })
        
        console.error('[注册失败]', {
          phone: this.maskPhone(phone),
          error: err,
          message: errorMessage,
          timestamp: new Date().toISOString()
        })
      })
      .finally(() => {
        // 重置注册状态
        this.setData({ isRegistering: false })
      })
  },

  /**
   * 获取注册错误提示信息
   * 需求: 11.1, 11.2, 11.3, 11.4, 11.5
   */
  getRegisterErrorMessage(err: any): string {
    let errorMessage = '注册失败，请稍后重试'
    
    if (!err) {
      return errorMessage
    }
    
    const errMsg = err.message || err.errMsg || ''
    
    // 手机号已注册
    if (errMsg.includes('已注册') || errMsg.includes('已存在') || errMsg.includes('already')) {
      errorMessage = '该手机号已被注册'
    }
    // 验证码错误
    else if (errMsg.includes('验证码错误') || errMsg.includes('验证码不正确') || errMsg.includes('code')) {
      errorMessage = '验证码错误，请重新输入'
    }
    // 验证码过期
    else if (errMsg.includes('过期') || errMsg.includes('expired')) {
      errorMessage = '验证码已过期，请重新获取'
    }
    // 密码格式错误
    else if (errMsg.includes('密码') || errMsg.includes('password')) {
      errorMessage = '密码格式不符合要求'
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
   * 脱敏显示手机号（显示前3位和后4位）
   */
  maskPhone(phone: string): string {
    if (!phone || phone.length !== 11) {
      return '***'
    }
    return phone.substring(0, 3) + '****' + phone.substring(7)
  },

  // 微信登录
  wechatLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 调用真实API
          api.wechatLogin({ code: res.code }).then((result: any) => {
            wx.setStorageSync('token', result.data.token)
            wx.setStorageSync('userInfo', result.data.userInfo || result.data.user)
            
            wx.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => {
              // 跳转到"我的"页面
              wx.switchTab({
                url: '/pages/mine/index'
              })
            }, 1500)
          }).catch((err: any) => {
            wx.showToast({ 
              title: err.message || '微信登录失败', 
              icon: 'none' 
            })
          })
        } else {
          wx.showToast({ title: '获取微信授权失败', icon: 'none' })
        }
      },
      fail: () => {
        wx.showToast({ title: '微信登录失败', icon: 'none' })
      }
    })
  },

  // 手机号快捷登录
  phoneLogin() {
    wx.showToast({ title: '请完成注册后登录', icon: 'none' })
  }
})
