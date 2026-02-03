/**
 * 页面访问守卫工具
 * 用于检查用户是否需要绑定手机号才能访问某些页面
 * 需求: 6.4, 6.5, 6.6
 */

/**
 * 检查页面访问权限
 * 在页面的onShow生命周期中调用此方法
 * @returns true表示可以访问，false表示需要绑定手机号
 */
export function checkPageAccess(): boolean {
  const app = getApp<IAppOption>()
  const token = wx.getStorageSync('token')
  
  // 未登录用户可以访问
  if (!token) {
    return true
  }
  
  // 检查是否需要强制绑定
  if (app.globalData.forceBindPhone && app.globalData.needBindPhone) {
    console.log('[页面访问守卫] 需要绑定手机号，拦截访问')
    
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

/**
 * 刷新绑定状态
 * 在绑定手机号成功后调用此方法更新全局状态
 */
export function refreshBindingStatus(): Promise<void> {
  return new Promise((resolve) => {
    const app = getApp<IAppOption>()
    const token = wx.getStorageSync('token')
    
    if (!token) {
      console.log('[刷新绑定状态] 用户未登录，跳过刷新')
      app.globalData.needBindPhone = false
      resolve()
      return
    }
    
    console.log('[刷新绑定状态] 开始刷新绑定状态...')
    
    // 获取用户绑定状态
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/auth/binding/status',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: (res: any) => {
        if (res.data && res.data.code === 200 && res.data.data) {
          const bindingStatus = res.data.data
          const hasPhone = bindingStatus.hasPhone || false
          
          console.log('[刷新绑定状态] 绑定状态刷新成功', {
            hasPhone: hasPhone,
            timestamp: new Date().toISOString()
          })
          
          // 更新全局状态
          app.globalData.needBindPhone = !hasPhone
          
          resolve()
        } else {
          console.error('[刷新绑定状态] 获取绑定状态失败', {
            response: res.data,
            timestamp: new Date().toISOString()
          })
          resolve()
        }
      },
      fail: (err) => {
        console.error('[刷新绑定状态] 获取绑定状态请求失败', {
          error: err,
          timestamp: new Date().toISOString()
        })
        resolve()
      }
    })
  })
}

/**
 * 检查是否需要绑定手机号
 * 用于在页面中显示提示信息
 * @returns true表示需要绑定，false表示不需要
 */
export function needBindPhone(): boolean {
  const app = getApp<IAppOption>()
  const token = wx.getStorageSync('token')
  
  // 未登录用户不需要绑定
  if (!token) {
    return false
  }
  
  return app.globalData.forceBindPhone && app.globalData.needBindPhone
}
