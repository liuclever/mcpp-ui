// pages/auth/bind-phone.ts
import api from '../../utils/api'
import { validatePhone } from '../../utils/validator'

Page({
  data: {
    phone: '',
    smsCode: '',
    password: '',
    phoneError: '',
    smsCodeError: '',
    passwordError: '',
    countdown: 0,
    isBinding: false
  },

  /**
   * 输入手机号
   */
  onPhoneInput(e: WechatMiniprogram.Input) {
    const phone = e.detail.value
    this.setData({ phone })
    
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
   * 输入验证码
   */
  onSmsCodeInput(e: WechatMiniprogram.Input) {
    this.setData({ smsCode: e.detail.value })
  },

  /**
   * 输入密码
   */
  onPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({ password: e.detail.value })
  },

  /**
   * 发送验证码
   */
  sendSmsCode() {
    const { phone, countdown } = this.data
    
    // 检查是否在倒计时中
    if (countdown > 0) {
      return
    }
    
    // 验证手机号
    const result = validatePhone(phone)
    if (!result.valid) {
      wx.showToast({ title: result.message || '请输入正确的手机号', icon: 'none' })
      return
    }
    
    // 发送验证码
    wx.showLoading({ title: '发送中...' })
    
    api.sendSmsCode({ phone, type: 'BIND' })
      .then(() => {
        wx.hideLoading()
        wx.showToast({ title: '验证码已发送', icon: 'success' })
        
        // 开始倒计时
        this.startCountdown()
      })
      .catch((err: any) => {
        wx.hideLoading()
        wx.showToast({ 
          title: err.message || '发送失败，请稍后重试', 
          icon: 'none' 
        })
      })
  },

  /**
   * 开始倒计时
   */
  startCountdown() {
    this.setData({ countdown: 60 })
    
    const timer = setInterval(() => {
      const countdown = this.data.countdown - 1
      
      if (countdown <= 0) {
        clearInterval(timer)
        this.setData({ countdown: 0 })
      } else {
        this.setData({ countdown })
      }
    }, 1000)
  },

  /**
   * 绑定手机号
   */
  bindPhone() {
    const { phone, smsCode, password, isBinding } = this.data
    
    // 防止重复提交
    if (isBinding) {
      return
    }
    
    // 验证手机号
    const phoneResult = validatePhone(phone)
    if (!phoneResult.valid) {
      wx.showToast({ title: phoneResult.message || '请输入正确的手机号', icon: 'none' })
      return
    }
    
    // 验证验证码
    if (!smsCode || smsCode.length !== 6) {
      wx.showToast({ title: '请输入6位验证码', icon: 'none' })
      return
    }
    
    // 验证密码
    if (!password || password.length < 8) {
      wx.showToast({ title: '密码至少8位', icon: 'none' })
      return
    }
    
    // 设置绑定状态
    this.setData({ isBinding: true })
    
    wx.showLoading({ title: '绑定中...' })
    
    // 调用绑定接口
    api.bindPhone({ phone, smsCode, password })
      .then(() => {
        wx.hideLoading()
        wx.showToast({ title: '绑定成功', icon: 'success' })
        
        // 更新本地用户信息
        const userInfo = wx.getStorageSync('userInfo') || {}
        userInfo.phone = phone
        wx.setStorageSync('userInfo', userInfo)
        
        // 跳转到个人中心
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/mine/index'
          })
        }, 1500)
      })
      .catch((err: any) => {
        wx.hideLoading()
        wx.showToast({ 
          title: err.message || '绑定失败，请重试', 
          icon: 'none' 
        })
      })
      .finally(() => {
        this.setData({ isBinding: false })
      })
  },

  /**
   * 跳过绑定
   */
  skipBinding() {
    wx.showModal({
      title: '提示',
      content: '跳过绑定后部分功能将无法使用，确定要跳过吗？',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/mine/index'
          })
        }
      }
    })
  }
})
