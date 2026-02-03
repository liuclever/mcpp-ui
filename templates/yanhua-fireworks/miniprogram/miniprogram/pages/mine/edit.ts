// pages/mine/edit.ts
import api from '../../utils/api'
import { checkPermission } from '../../utils/auth'

interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  points: number
  region: string
}

Page({
  data: {
    userInfo: {
      id: '',
      nickname: '',
      avatar: '',
      phone: '',
      points: 0,
      region: ''
    } as UserInfo,
    originalNickname: '', // 保存原始昵称，用于判断是否修改
    originalAvatar: '',   // 保存原始头像，用于判断是否修改
    originalRegion: '',   // 保存原始地区，用于判断是否修改
    regionValue: [] as string[] // 地区选择器的值
  },

  async onLoad() {
    // 检查功能权限
    // 需求: 6.4 - 限制未绑定用户访问部分功能
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      return // 已显示提示并跳转
    }
    
    this.loadUserInfo()
  },

  // 加载用户信息
  async loadUserInfo() {
    try {
      wx.showLoading({ title: '加载中...', mask: true })
      
      const result = await api.getUserInfo()
      
      if (result.code === 200 && result.data) {
        const userInfo: UserInfo = {
          id: result.data.id || '',
          nickname: result.data.nickname || '',
          avatar: result.data.avatar || '',
          phone: result.data.phone || '',
          points: result.data.points || 0,
          region: result.data.region || ''
        }
        
        // 解析地区字符串为数组（用于picker的默认值）
        const regionValue = userInfo.region ? userInfo.region.split(' ') : []
        
        this.setData({
          userInfo,
          originalNickname: userInfo.nickname,
          originalAvatar: userInfo.avatar,
          originalRegion: userInfo.region,
          regionValue
        })
      } else {
        wx.showToast({
          title: result.message || '加载失败',
          icon: 'none'
        })
      }
    } catch (error: any) {
      console.error('加载用户信息失败：', error)
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 微信头像选择回调 - 使用 open-type="chooseAvatar"
  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    console.log('微信头像临时路径：', avatarUrl)
    
    if (avatarUrl) {
      // 上传头像到服务器
      this.uploadAvatar(avatarUrl)
    }
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
      
      // 调用上传接口 - 使用正确的后端API地址
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
              reject(new Error('上传失败'))
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
    this.setData({
      'userInfo.nickname': e.detail.value
    })
  },

  // 昵称输入框失去焦点 - 处理微信昵称自动填充
  onNicknameBlur(e: WechatMiniprogram.InputBlur) {
    const nickname = e.detail.value
    if (nickname && nickname !== this.data.userInfo.nickname) {
      this.setData({
        'userInfo.nickname': nickname
      })
      console.log('获取到微信昵称：', nickname)
    }
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
    const { userInfo, originalNickname, originalAvatar, originalRegion } = this.data
    
    // 验证昵称
    if (!userInfo.nickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    // 检查是否有修改
    const nicknameChanged = userInfo.nickname !== originalNickname
    const avatarChanged = userInfo.avatar !== originalAvatar
    const regionChanged = userInfo.region !== originalRegion
    
    if (!nicknameChanged && !avatarChanged && !regionChanged) {
      wx.showToast({
        title: '没有修改',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({ title: '保存中...', mask: true })
      
      // 准备更新数据
      const updateData: { nickname?: string; avatar?: string; region?: string } = {}
      if (nicknameChanged) {
        updateData.nickname = userInfo.nickname.trim()
      }
      if (avatarChanged) {
        updateData.avatar = userInfo.avatar
      }
      if (regionChanged) {
        updateData.region = userInfo.region
      }
      
      // 调用更新接口
      const result = await api.updateUserInfo(updateData)
      
      wx.hideLoading()
      
      if (result.code === 200) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
        
        // 更新本地存储
        const cachedUserInfo = wx.getStorageSync('userInfo')
        if (cachedUserInfo) {
          const updatedUserInfo = {
            ...cachedUserInfo,
            ...updateData
          }
          wx.setStorageSync('userInfo', updatedUserInfo)
        }
        
        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({
          title: result.message || '保存失败',
          icon: 'none'
        })
      }
    } catch (error: any) {
      wx.hideLoading()
      console.error('保存用户信息失败：', error)
      wx.showToast({
        title: error.message || '保存失败，请重试',
        icon: 'none'
      })
    }
  },

  // 跳转到收藏列表
  goToCollect() {
    wx.navigateTo({
      url: '/pages/mine/collect'
    })
  },

  // 跳转到我的发布
  goToPublish() {
    wx.navigateTo({
      url: '/pages/mine/publish'
    })
  },

  // 跳转到点赞列表
  goToLike() {
    wx.navigateTo({
      url: '/pages/mine/like'
    })
  }
})
