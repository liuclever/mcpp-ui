// pages/auth/change-password.ts
import api from '../../utils/api'

Page({
  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  },

  // 输入旧密码
  onOldPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({ oldPassword: e.detail.value })
  },

  // 输入新密码
  onNewPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({ newPassword: e.detail.value })
  },

  // 输入确认密码
  onConfirmPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({ confirmPassword: e.detail.value })
  },

  // 切换旧密码显示
  toggleOldPassword() {
    this.setData({ showOldPassword: !this.data.showOldPassword })
  },

  // 切换新密码显示
  toggleNewPassword() {
    this.setData({ showNewPassword: !this.data.showNewPassword })
  },

  // 切换确认密码显示
  toggleConfirmPassword() {
    this.setData({ showConfirmPassword: !this.data.showConfirmPassword })
  },

  // 验证密码格式
  validatePassword(password: string): boolean {
    if (password.length < 8) {
      wx.showToast({ title: '密码至少8位', icon: 'none' })
      return false
    }
    
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    
    if (!hasLetter || !hasNumber) {
      wx.showToast({ title: '密码必须包含字母和数字', icon: 'none' })
      return false
    }
    
    return true
  },

  // 提交修改密码
  async handleSubmit() {
    const { oldPassword, newPassword, confirmPassword } = this.data

    // 验证输入
    if (!oldPassword) {
      wx.showToast({ title: '请输入旧密码', icon: 'none' })
      return
    }

    if (!newPassword) {
      wx.showToast({ title: '请输入新密码', icon: 'none' })
      return
    }

    if (!confirmPassword) {
      wx.showToast({ title: '请确认新密码', icon: 'none' })
      return
    }

    // 验证新密码格式
    if (!this.validatePassword(newPassword)) {
      return
    }

    // 验证两次密码输入一致
    if (newPassword !== confirmPassword) {
      wx.showToast({ title: '两次密码输入不一致', icon: 'none' })
      return
    }

    // 验证新旧密码不同
    if (oldPassword === newPassword) {
      wx.showToast({ title: '新密码不能与旧密码相同', icon: 'none' })
      return
    }

    try {
      wx.showLoading({ title: '修改中...', mask: true })

      const result = await api.changePassword({
        oldPassword,
        newPassword
      })

      wx.hideLoading()

      if (result.code === 200) {
        wx.showToast({ 
          title: '密码修改成功', 
          icon: 'success',
          duration: 2000
        })

        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      } else {
        wx.showToast({ 
          title: result.message || '修改失败', 
          icon: 'none' 
        })
      }
    } catch (error: any) {
      wx.hideLoading()
      console.error('修改密码失败：', error)
      wx.showToast({ 
        title: error.message || '修改失败', 
        icon: 'none' 
      })
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  }
})
