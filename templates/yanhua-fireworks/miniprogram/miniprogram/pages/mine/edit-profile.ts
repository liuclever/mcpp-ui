// pages/mine/edit-profile.ts
import { checkPermission } from '../../utils/auth'
import api from '../../utils/api'

Page({
  data: {
    avatar: '',
    nickname: '',
    region: '',
    regionValue: [] as string[],
    hasChanges: false
  },

  originalData: {
    avatar: '',
    nickname: '',
    region: ''
  },

  onLoad() {
    this.loadUserInfo()
  },

  async loadUserInfo() {
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      wx.navigateBack()
      return
    }

    try {
      const res = await api.getUserInfo()
      console.log('编辑资料-用户信息:', res)
      if (res.code === 200 && res.data) {
        const user = res.data
        const regionValue = user.region ? user.region.split(' ') : []
        
        this.originalData = {
          avatar: user.avatar || '',
          nickname: user.nickname || '',
          region: user.region || ''
        }
        
        this.setData({
          avatar: user.avatar || '',
          nickname: user.nickname || '',
          region: user.region || '',
          regionValue
        })
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  // 选择头像
  chooseAvatar() {
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
    wx.showLoading({ title: '上传中...' })
    
    try {
      const token = wx.getStorageSync('token')
      const uploadRes = await new Promise<any>((resolve, reject) => {
        wx.uploadFile({
          url: 'https://fireworks-project.zhengpan.cn/api/upload/image',
          filePath,
          name: 'file',
          header: {
            'Authorization': `Bearer ${token}`
          },
          success: (res) => {
            const data = JSON.parse(res.data)
            resolve(data)
          },
          fail: reject
        })
      })

      if (uploadRes.code === 200 && uploadRes.data) {
        this.setData({ 
          avatar: uploadRes.data,
          hasChanges: true
        })
        wx.showToast({ title: '头像已更新', icon: 'success' })
      } else {
        wx.showToast({ title: uploadRes.message || '上传失败', icon: 'none' })
      }
    } catch (error) {
      console.error('上传头像失败:', error)
      wx.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 昵称输入
  onNicknameInput(e: WechatMiniprogram.Input) {
    this.setData({ 
      nickname: e.detail.value,
      hasChanges: true
    })
  },

  // 地区选择
  onRegionChange(e: WechatMiniprogram.PickerChange) {
    const value = e.detail.value as string[]
    this.setData({
      region: value.join(' '),
      regionValue: value,
      hasChanges: true
    })
  },

  // 保存资料
  async saveProfile() {
    const { avatar, nickname, region } = this.data
    
    // 检查是否有修改
    if (avatar === this.originalData.avatar && 
        nickname === this.originalData.nickname && 
        region === this.originalData.region) {
      wx.showToast({ title: '没有修改', icon: 'none' })
      return
    }

    if (!nickname.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })

    try {
      const res = await api.updateUserInfo({
        avatar,
        nickname: nickname.trim(),
        region
      })

      if (res.code === 200) {
        wx.showToast({ title: '保存成功', icon: 'success' })
        
        // 更新本地存储的用户信息
        const userInfoStr = wx.getStorageSync('userInfo')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          userInfo.avatar = avatar
          userInfo.nickname = nickname.trim()
          userInfo.region = region
          wx.setStorageSync('userInfo', JSON.stringify(userInfo))
        }

        // 返回上一页并刷新
        setTimeout(() => {
          const pages = getCurrentPages()
          if (pages.length > 1) {
            const prevPage = pages[pages.length - 2]
            if (prevPage && typeof prevPage.loadUserInfo === 'function') {
              prevPage.loadUserInfo()
            }
          }
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({ title: res.message || '保存失败', icon: 'none' })
      }
    } catch (error) {
      console.error('保存资料失败:', error)
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 返回
  goBack() {
    if (this.data.hasChanges) {
      wx.showModal({
        title: '提示',
        content: '您有未保存的修改，确定要离开吗？',
        confirmText: '离开',
        cancelText: '继续编辑',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
    } else {
      wx.navigateBack()
    }
  }
})
