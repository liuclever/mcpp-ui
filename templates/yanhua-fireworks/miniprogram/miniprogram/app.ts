// app.ts
import { clearToken, clearUserInfo } from './utils/auth'

interface IAppInstance {
  globalData: {
    apiBase: string
    forceBindPhone: boolean
    needBindPhone: boolean
    [key: string]: any
  }
  checkLoginStatus(): void
  clearLoginAndNotify(): void
  checkAndRefreshToken(): Promise<boolean>
  checkForceBindPhone(): Promise<void>
}

App<IAppOption & IAppInstance>({
  globalData: {
    // API基础地址 - 本地开发环境
    apiBase: 'http://localhost:8080/api',
    // 生产环境请修改为实际API地址
    
    // 强制绑定配置
    forceBindPhone: false,
    needBindPhone: false
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    this.checkLoginStatus()
    
    // 检查强制绑定状态
    this.checkForceBindPhone()
  },

  /**
   * 检查登录状态
   * 在app.ts的onLaunch中检查token
   * 如果token存在则验证有效性
   * 如果token无效则清除并提示重新登录
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    
    if (!token) {
      // 没有token，用户未登录
      console.log('[登录状态检查] 用户未登录')
      return
    }

    // 有token，验证token有效性
    console.log('[登录状态检查] 开始验证Token有效性...')
    
    // 调用后端接口验证token
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/user/info',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: (res: any) => {
        if (res.data && res.data.code === 200) {
          // Token有效
          console.log('[登录状态检查] Token有效，用户已登录', {
            userId: res.data.data?.id,
            timestamp: new Date().toISOString()
          })
          // 更新用户信息
          if (res.data.data) {
            wx.setStorageSync('userInfo', res.data.data)
          }
        } else if (res.data && res.data.code === 401) {
          // Token无效或过期
          console.warn('[登录状态检查] Token无效或过期，清除登录信息', {
            timestamp: new Date().toISOString()
          })
          this.clearLoginAndNotify()
        } else {
          // 其他错误
          console.error('[登录状态检查] 验证Token时发生错误', {
            response: res.data,
            timestamp: new Date().toISOString()
          })
        }
      },
      fail: (err) => {
        // 网络错误或其他错误
        console.error('[登录状态检查] 验证Token失败', {
          error: err,
          timestamp: new Date().toISOString()
        })
        // 网络错误时不清除token，允许用户继续使用
      }
    })
  },

  /**
   * 清除登录信息并提示用户
   */
  clearLoginAndNotify() {
    console.log('[清除登录] 清除登录信息', {
      timestamp: new Date().toISOString()
    })
    
    // 清除token和用户信息
    clearToken()
    clearUserInfo()
    
    // 提示用户重新登录
    wx.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none',
      duration: 2500
    })
  },

  /**
   * 检测token即将过期并自动刷新
   * 需求: 3.4
   * @returns Promise<boolean> 是否刷新成功
   */
  checkAndRefreshToken(): Promise<boolean> {
    return new Promise((resolve) => {
      const token = wx.getStorageSync('token')
      
      if (!token) {
        console.log('[Token刷新] 没有token，无需刷新')
        resolve(false)
        return
      }

      console.log('[Token刷新] 开始检查token是否需要刷新...')
      
      // 调用后端接口刷新token
      wx.request({
        url: 'https://fireworks-project.zhengpan.cn/api/user/refreshToken',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        success: (res: any) => {
          if (res.data && res.data.code === 200 && res.data.data && res.data.data.token) {
            // Token刷新成功
            const newToken = res.data.data.token
            console.log('[Token刷新] Token刷新成功', {
              timestamp: new Date().toISOString()
            })
            
            // 更新本地存储
            wx.setStorageSync('token', newToken)
            
            resolve(true)
          } else if (res.data && res.data.code === 401) {
            // Token无效，需要重新登录
            console.warn('[Token刷新] Token无效，需要重新登录', {
              timestamp: new Date().toISOString()
            })
            this.clearLoginAndNotify()
            resolve(false)
          } else {
            // 其他错误
            console.error('[Token刷新] Token刷新失败', {
              response: res.data,
              timestamp: new Date().toISOString()
            })
            resolve(false)
          }
        },
        fail: (err) => {
          // 网络错误
          console.error('[Token刷新] Token刷新请求失败', {
            error: err,
            timestamp: new Date().toISOString()
          })
          resolve(false)
        }
      })
    })
  },

  /**
   * 检查强制绑定手机号状态
   * 需求: 6.2, 6.3, 6.4
   * 在app启动时检查登录配置和用户绑定状态
   * 如果强制绑定启用且用户未绑定手机号，则跳转到绑定页面
   */
  checkForceBindPhone(): Promise<void> {
    return new Promise((resolve) => {
      const token = wx.getStorageSync('token')
      
      // 如果用户未登录，不需要检查
      if (!token) {
        console.log('[强制绑定检查] 用户未登录，跳过检查')
        this.globalData.forceBindPhone = false
        this.globalData.needBindPhone = false
        resolve()
        return
      }

      console.log('[强制绑定检查] 开始检查强制绑定状态...')
      
      // 1. 获取登录配置
      wx.request({
        url: 'https://fireworks-project.zhengpan.cn/api/auth/config',
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: (configRes: any) => {
          if (configRes.data && configRes.data.code === 200 && configRes.data.data) {
            const config = configRes.data.data
            this.globalData.forceBindPhone = config.forceBindPhone || false
            
            console.log('[强制绑定检查] 登录配置获取成功', {
              forceBindPhone: config.forceBindPhone,
              timestamp: new Date().toISOString()
            })
            
            // 如果未启用强制绑定，不需要继续检查
            if (!config.forceBindPhone) {
              console.log('[强制绑定检查] 未启用强制绑定，跳过检查')
              this.globalData.needBindPhone = false
              resolve()
              return
            }
            
            // 2. 检查用户绑定状态
            wx.request({
              url: 'https://fireworks-project.zhengpan.cn/api/auth/binding/status',
              method: 'GET',
              header: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              success: (bindingRes: any) => {
                if (bindingRes.data && bindingRes.data.code === 200 && bindingRes.data.data) {
                  const bindingStatus = bindingRes.data.data
                  const hasPhone = bindingStatus.hasPhone || false
                  
                  console.log('[强制绑定检查] 绑定状态获取成功', {
                    hasPhone: hasPhone,
                    timestamp: new Date().toISOString()
                  })
                  
                  // 更新全局状态
                  this.globalData.needBindPhone = !hasPhone
                  
                  // 如果强制绑定启用且用户未绑定手机号
                  if (config.forceBindPhone && !hasPhone) {
                    console.log('[强制绑定检查] 需要绑定手机号，跳转到绑定页面')
                    
                    // 延迟跳转，确保页面加载完成
                    setTimeout(() => {
                      wx.showModal({
                        title: '提示',
                        content: '为了更好地为您服务，请先绑定手机号',
                        showCancel: false,
                        success: () => {
                          wx.redirectTo({
                            url: '/pages/auth/bind-phone',
                            fail: () => {
                              wx.navigateTo({
                                url: '/pages/auth/bind-phone'
                              })
                            }
                          })
                        }
                      })
                    }, 1000)
                  }
                  
                  resolve()
                } else {
                  console.error('[强制绑定检查] 获取绑定状态失败', {
                    response: bindingRes.data,
                    timestamp: new Date().toISOString()
                  })
                  this.globalData.needBindPhone = false
                  resolve()
                }
              },
              fail: (err) => {
                console.error('[强制绑定检查] 获取绑定状态请求失败', {
                  error: err,
                  timestamp: new Date().toISOString()
                })
                this.globalData.needBindPhone = false
                resolve()
              }
            })
          } else {
            console.error('[强制绑定检查] 获取登录配置失败', {
              response: configRes.data,
              timestamp: new Date().toISOString()
            })
            this.globalData.forceBindPhone = false
            this.globalData.needBindPhone = false
            resolve()
          }
        },
        fail: (err) => {
          console.error('[强制绑定检查] 获取登录配置请求失败', {
            error: err,
            timestamp: new Date().toISOString()
          })
          this.globalData.forceBindPhone = false
          this.globalData.needBindPhone = false
          resolve()
        }
      })
    })
  },

  /**
   * 检查页面访问权限
   * 需求: 6.4, 6.5
   * 在需要权限的页面调用此方法检查是否需要绑定手机号
   * @returns true表示可以访问，false表示需要绑定手机号
   */
  checkPageAccess(): boolean {
    const token = wx.getStorageSync('token')
    
    // 未登录用户可以访问
    if (!token) {
      return true
    }
    
    // 检查是否需要强制绑定
    if (this.globalData.forceBindPhone && this.globalData.needBindPhone) {
      console.log('[页面访问检查] 需要绑定手机号，拦截访问')
      
      wx.showModal({
        title: '提示',
        content: '请先绑定手机号后再使用此功能',
        showCancel: false,
        success: () => {
          wx.redirectTo({
            url: '/pages/auth/bind-phone',
            fail: () => {
              wx.navigateTo({
                url: '/pages/auth/bind-phone'
              })
            }
          })
        }
      })
      
      return false
    }
    
    return true
  }
})
