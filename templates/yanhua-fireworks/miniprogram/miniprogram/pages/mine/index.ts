// pages/mine/index.ts
import api from '../../utils/api'

Page({
  data: {
    isLoggedIn: false,
    isEditMode: false, // 编辑模式状态
    isEditing: false,
    userInfo: {
      id: '',
      nickname: '',
      avatar: '',
      phone: '',
      points: 0,
      region: ''
    },
    regionValue: [] as string[],
    originalUserInfo: {} as any, // 保存原始数据用于取消编辑
    bindingStatus: {
      hasWechat: false,
      hasPhone: false,
      phone: '',
      wechatNickname: '',
      loginMethod: '' as 'wechat' | 'phone' | ''
    },
    topBannerUrl: ''
  },

  onLoad() {
    this.checkLoginStatus()
    this.loadBanners()
  },

  // 加载横幅配置
  async loadBanners() {
    try {
      const res = await api.request({
        url: '/page-banner/mine',
        method: 'GET',
        showLoading: false
      })
      if (res.code === 200 && res.data) {
        const banners = res.data
        // 只有visible=1且有图片URL时才显示
        const topBanner = banners.top
        this.setData({
          topBannerUrl: (topBanner?.visible === 1 && topBanner?.imageUrl) ? topBanner.imageUrl : ''
        })
      }
    } catch (err) {
      console.error('加载横幅配置失败:', err)
    }
  },

  onShow() {
    this.checkLoginStatus()
    if (this.data.isLoggedIn) {
      this.loadBindingStatus()
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.setData({ isLoggedIn: true })
      this.loadUserInfo()
      this.loadBindingStatus()
    } else {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({
          isLoggedIn: true,
          userInfo
        })
      }
    }
  },

  // 从后端加载用户信息
  async loadUserInfo() {
    try {
      const result = await api.getUserInfo()
      
      if (result.code === 200 && result.data) {
        const userInfo = {
          id: result.data.id || '',
          nickname: result.data.nickname || '用户',
          avatar: result.data.avatar || '',
          phone: result.data.phone || '',
          points: result.data.points || 0,
          region: result.data.region || ''
        }
        
        // 解析地区字符串为数组（用于picker的默认值）
        const regionValue = userInfo.region ? userInfo.region.split(' ') : []
        
        this.setData({ 
          userInfo,
          originalUserInfo: { ...userInfo },
          regionValue
        })
        wx.setStorageSync('userInfo', userInfo)
      } else {
        console.error('获取用户信息失败：', result.message)
        const cachedUserInfo = wx.getStorageSync('userInfo')
        if (cachedUserInfo) {
          this.setData({ 
            userInfo: cachedUserInfo,
            originalUserInfo: { ...cachedUserInfo }
          })
        }
      }
    } catch (error: any) {
      console.error('加载用户信息失败：', error)
      const cachedUserInfo = wx.getStorageSync('userInfo')
      if (cachedUserInfo) {
        this.setData({ 
          userInfo: cachedUserInfo,
          originalUserInfo: { ...cachedUserInfo }
        })
      }
    }
  },

  // 加载绑定状态
  async loadBindingStatus() {
    try {
      const result = await api.getBindingStatus()
      
      if (result.code === 200 && result.data) {
        const bindingStatus = {
          hasWechat: result.data.hasWechat || false,
          hasPhone: result.data.hasPhone || false,
          phone: result.data.phone || '',
          wechatNickname: result.data.wechatNickname || '',
          loginMethod: result.data.loginMethod || '' as 'wechat' | 'phone' | ''
        }
        
        // 处理loginMethod缺失的情况
        if (!bindingStatus.loginMethod) {
          console.warn('警告：API响应中缺少loginMethod字段，将使用默认值（空字符串）')
        }
        
        this.setData({ bindingStatus })
        
        console.log('绑定状态加载成功:', {
          hasWechat: bindingStatus.hasWechat,
          hasPhone: bindingStatus.hasPhone,
          loginMethod: bindingStatus.loginMethod
        })
      } else {
        console.error('获取绑定状态失败：', result.message)
        // API请求失败时，保持当前状态，显示所有未绑定的选项
        console.warn('使用默认绑定状态（显示所有未绑定选项）')
      }
    } catch (error: any) {
      console.error('加载绑定状态失败：', error)
      // 网络错误或其他异常时，保持当前状态
      console.warn('由于错误，使用默认绑定状态（显示所有未绑定选项）')
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({ url: '/pages/index/index' })
      }
    })
  },

  // 跳转登录
  goLogin() {
    wx.navigateTo({
      url: '/pages/auth/login'
    })
  },

  // 选择头像
  chooseAvatar() {
    if (!this.data.isEditMode) {
      return // 非编辑模式下不允许选择头像
    }
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.uploadAvatar(tempFilePath)
      }
    })
  },

  // 上传头像
  async uploadAvatar(filePath: string) {
    try {
      wx.showLoading({ title: '上传中...', mask: true })
      
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.hideLoading()
        wx.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      
      const uploadResult: any = await new Promise((resolve, reject) => {
        wx.uploadFile({
          url: api.getBaseUrl() + '/upload/avatar',
          filePath: filePath,
          name: 'file',
          header: {
            'Authorization': 'Bearer ' + token
          },
          success: (res) => {
            console.log('上传响应：', res)
            if (res.statusCode === 200) {
              try {
                const data = JSON.parse(res.data)
                resolve(data)
              } catch (e) {
                console.error('解析响应失败：', e)
                reject(new Error('解析响应失败'))
              }
            } else {
              console.error('上传失败，状态码：', res.statusCode)
              reject(new Error('上传失败，状态码：' + res.statusCode))
            }
          },
          fail: (err) => {
            console.error('上传请求失败：', err)
            reject(err)
          }
        })
      })
      
      wx.hideLoading()
      
      if (uploadResult.code === 200 && uploadResult.data?.url) {
        // 更新头像URL
        this.setData({
          'userInfo.avatar': uploadResult.data.url
        })
        wx.showToast({ title: '头像已更新', icon: 'success' })
      } else {
        wx.showToast({ title: uploadResult.message || '上传失败', icon: 'none' })
      }
    } catch (error: any) {
      wx.hideLoading()
      console.error('上传头像失败：', error)
      wx.showToast({ title: error.message || '上传失败', icon: 'none' })
    }
  },

  // 昵称输入
  onNicknameInput(e: WechatMiniprogram.Input) {
    this.setData({ 'userInfo.nickname': e.detail.value })
  },

  // 地区选择
  onRegionChange(e: WechatMiniprogram.PickerChange) {
    const value = e.detail.value as string[]
    const region = value.join(' ') // 将省市区用空格连接
    this.setData({
      'userInfo.region': region,
      regionValue: value
    })
  },

  // 保存用户信息
  async saveUserInfo() {
    const { userInfo } = this.data
    
    if (!userInfo.nickname?.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    try {
      wx.showLoading({ title: '保存中...', mask: true })
      
      const result = await api.updateUserInfo({
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        region: userInfo.region
      })
      
      wx.hideLoading()
      
      if (result.code === 200) {
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ 
          originalUserInfo: { ...userInfo },
          isEditMode: false // 保存成功后退出编辑模式
        })
        wx.showToast({ title: '保存成功', icon: 'success' })
      } else {
        wx.showToast({ title: result.message || '保存失败', icon: 'none' })
      }
    } catch (error: any) {
      wx.hideLoading()
      console.error('保存用户信息失败：', error)
      wx.showToast({ title: error.message || '保存失败', icon: 'none' })
    }
  },

  // 切换编辑模式
  toggleEditMode() {
    const { isEditMode, originalUserInfo } = this.data
    
    if (isEditMode) {
      // 取消编辑，恢复原始数据
      this.setData({
        isEditMode: false,
        userInfo: { ...originalUserInfo }
      })
    } else {
      // 进入编辑模式
      this.setData({ isEditMode: true })
    }
  },

  // 跳转到编辑资料页面
  goEditProfile() {
    wx.navigateTo({ url: '/pages/mine/edit-profile' })
  },

  // 跳转到积分明细页面
  goPointsHistory() {
    wx.navigateTo({ url: '/pages/mine/points-history' })
  },

  // 跳转到我的收藏
  goToCollect() {
    wx.navigateTo({ url: '/pages/mine/collect' })
  },

  // 跳转到我的发布
  goToPublish() {
    wx.navigateTo({ url: '/pages/mine/publish' })
  },

  // 跳转到我的点赞
  goToLike() {
    wx.navigateTo({ url: '/pages/mine/like' })
  },

  // 跳转到积分规则页面
  // 需求：4.1 - 小程序应在"我的"页面上提供查看积分规则的入口
  // 需求：4.2 - 当用户点击积分规则入口时，小程序应导航到规则显示页面
  // 需求：6.2 - 入口应位于用户界面内的显著位置
  navigateToPointsRules() {
    wx.navigateTo({ url: '/pages/mine/points-rules' })
  },
  
  // 跳转到积分明细页面
  navigateToPointsHistory() {
    wx.navigateTo({ url: '/pages/mine/points-history' })
  },

  // 跳转到编辑信息页面
  goToEdit() {
    wx.navigateTo({ url: '/pages/mine/edit' })
  },

  // 跳转到绑定手机号页面
  goToBindPhone() {
    wx.navigateTo({ url: '/pages/auth/bind-phone' })
  },

  // 跳转到绑定微信页面
  goToBindWechat() {
    wx.navigateTo({ url: '/pages/auth/bind-wechat' })
  },

  // 跳转到修改密码页面
  goToChangePassword() {
    wx.navigateTo({ url: '/pages/auth/change-password' })
  },

  // 解绑手机号
  async handleUnbindPhone() {
    const { bindingStatus } = this.data
    
    // 检查是否至少保留一种登录方式
    if (!bindingStatus.hasWechat) {
      wx.showToast({ 
        title: '至少保留一种登录方式', 
        icon: 'none' 
      })
      return
    }

    wx.showModal({
      title: '解绑手机号',
      content: '解绑后将无法使用手机号登录，确定要解绑吗？',
      success: async (res) => {
        if (res.confirm) {
          // 要求输入密码验证
          this.showPasswordInput('unbindPhone')
        }
      }
    })
  },

  // 解绑微信
  async handleUnbindWechat() {
    const { bindingStatus } = this.data
    
    // 检查是否至少保留一种登录方式
    if (!bindingStatus.hasPhone) {
      wx.showToast({ 
        title: '至少保留一种登录方式', 
        icon: 'none' 
      })
      return
    }

    wx.showModal({
      title: '解绑微信',
      content: '解绑后将无法使用微信登录，确定要解绑吗？',
      success: async (res) => {
        if (res.confirm) {
          // 要求输入密码验证
          this.showPasswordInput('unbindWechat')
        }
      }
    })
  },

  // 显示密码输入框
  showPasswordInput(action: 'unbindPhone' | 'unbindWechat') {
    wx.showModal({
      title: '请输入密码',
      editable: true,
      placeholderText: '请输入密码以验证身份',
      success: async (res) => {
        if (res.confirm && res.content) {
          const password = res.content.trim()
          
          if (!password) {
            wx.showToast({ title: '请输入密码', icon: 'none' })
            return
          }

          try {
            wx.showLoading({ title: '处理中...', mask: true })

            let result
            console.log('开始解绑，action:', action, 'password:', password ? '已输入' : '未输入')
            if (action === 'unbindPhone') {
              result = await api.unbindPhone({ password })
            } else {
              result = await api.unbindWechat({ password })
            }
            console.log('解绑返回结果:', result)

            wx.hideLoading()

            if (result.code === 200) {
              wx.showToast({ 
                title: '解绑成功', 
                icon: 'success' 
              })
              
              // 延迟重新加载绑定状态，确保后端数据已更新
              setTimeout(() => {
                console.log('开始重新加载绑定状态...')
                this.loadBindingStatus()
              }, 500)
            } else {
              console.log('解绑失败，code:', result.code, 'message:', result.message)
              wx.showToast({ 
                title: result.message || '解绑失败', 
                icon: 'none' 
              })
            }
          } catch (error: any) {
            wx.hideLoading()
            console.error('解绑异常：', error)
            wx.showToast({ 
              title: error.message || '解绑失败', 
              icon: 'none' 
            })
          }
        }
      }
    })
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的登录信息
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          
          this.setData({
            isLoggedIn: false,
            userInfo: {
              id: '',
              nickname: '',
              avatar: '',
              phone: '',
              points: 0,
              region: ''
            },
            regionValue: []
          })
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})
