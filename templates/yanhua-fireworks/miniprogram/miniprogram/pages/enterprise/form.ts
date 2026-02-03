import { request } from '../../utils/api'
import { checkPermission } from '../../utils/auth'

interface FormData {
  name: string
  phone: string
  province: string
  city: string
  district: string
  budget: string
  message: string
}

Page({
  data: {
    formData: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      budget: '',
      message: ''
    } as FormData,
    regionArray: [] as string[],
    regionText: '',
    budgetOptions: [
      '10万以下',
      '10-30万',
      '30-50万',
      '50-100万',
      '100万以上'
    ],
    budgetIndex: -1,
    submitting: false,
    hasSubmitted: false // 防重复提交标记
  },

  async onLoad(options: any) {
    // 可以从options中获取栏目信息
    const columnName = options.columnName || '招商加盟'
    wx.setNavigationBarTitle({ title: columnName })
    
    // 检查功能权限
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      // 没有权限，已经跳转到绑定页面
      return
    }
  },

  // 姓名输入
  onNameInput(e: any) {
    this.setData({
      'formData.name': e.detail.value.trim()
    })
  },

  // 手机号输入
  onPhoneInput(e: any) {
    this.setData({
      'formData.phone': e.detail.value.trim()
    })
  },

  // 地区选择
  onRegionChange(e: any) {
    const region = e.detail.value
    this.setData({
      regionArray: region,
      regionText: region.join(' '),
      'formData.province': region[0] || '',
      'formData.city': region[1] || '',
      'formData.district': region[2] || ''
    })
  },

  // 预算选择
  onBudgetChange(e: any) {
    const index = parseInt(e.detail.value)
    this.setData({
      budgetIndex: index,
      'formData.budget': this.data.budgetOptions[index]
    })
  },

  // 留言输入
  onMessageInput(e: any) {
    this.setData({
      'formData.message': e.detail.value
    })
  },

  // 表单验证
  validateForm(): { valid: boolean; message: string } {
    const { name, phone, province } = this.data.formData

    // 验证姓名
    if (!name) {
      return { valid: false, message: '请输入姓名' }
    }
    if (name.length < 2 || name.length > 20) {
      return { valid: false, message: '姓名长度应在2-20个字符之间' }
    }

    // 验证手机号
    if (!phone) {
      return { valid: false, message: '请输入手机号' }
    }
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: '手机号格式不正确' }
    }

    // 验证地区
    if (!province) {
      return { valid: false, message: '请选择所在地区' }
    }

    return { valid: true, message: '' }
  },

  // 提交表单
  async onSubmit() {
    // 防重复提交
    if (this.data.submitting || this.data.hasSubmitted) {
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none'
      })
      return
    }

    // 表单验证
    const validation = this.validateForm()
    if (!validation.valid) {
      wx.showToast({
        title: validation.message,
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 提交数据
    this.setData({ submitting: true })

    try {
      const { name, phone, province, city, district, budget, message } = this.data.formData

      await request({
        url: '/enterprise-center/form/submit',
        method: 'POST',
        data: {
          name,
          phone,
          province,
          city,
          district,
          budget: budget || '',
          message: message || ''
        }
      })

      // 提交成功
      this.setData({ hasSubmitted: true })
      
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })

      // 延迟返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)

    } catch (error: any) {
      console.error('表单提交失败:', error)
      
      // 显示错误信息
      const errorMessage = error?.message || '提交失败，请重试'
      wx.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000
      })
    } finally {
      this.setData({ submitting: false })
    }
  },

  // 页面卸载时重置防重复提交标记
  onUnload() {
    this.setData({ hasSubmitted: false })
  }
})
