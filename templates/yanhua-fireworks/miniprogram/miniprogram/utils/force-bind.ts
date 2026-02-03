/**
 * 强制绑定手机号工具函数
 * 需求: 6.2, 6.3, 6.4, 6.5, 6.6
 */

/**
 * 需要强制绑定手机号才能访问的页面列表
 * 这些页面在用户未绑定手机号时将被限制访问
 */
const RESTRICTED_PAGES = [
  '/pages/community/upload',      // 视频上传
  '/pages/community/detail',      // 视频详情（评论功能）
  '/pages/mine/publish',          // 我的发布
  '/pages/mine/collect',          // 我的收藏
  '/pages/mine/like',             // 我的点赞
  '/pages/mine/edit',             // 编辑资料
  '/pages/enterprise/form',       // 加盟申请
]

/**
 * 检查当前页面是否需要强制绑定手机号
 * @param pagePath 页面路径
 * @returns 是否需要强制绑定
 */
export function isRestrictedPage(pagePath: string): boolean {
  // 标准化路径（移除开头的斜杠）
  const normalizedPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`
  
  return RESTRICTED_PAGES.some(restrictedPath => 
    normalizedPath === restrictedPath || 
    normalizedPath.startsWith(restrictedPath)
  )
}

/**
 * 检查用户是否需要绑定手机号
 * @param forceRefresh 是否强制刷新（忽略缓存）
 * @returns Promise<boolean> 是否需要绑定
 */
export async function checkNeedBindPhone(forceRefresh: boolean = false): Promise<boolean> {
  try {
    const app = getApp<IAppOption>()
    
    // 如果全局状态中已经有结果且不强制刷新，直接返回
    if (!forceRefresh && app.globalData.needBindPhone !== undefined) {
      console.log('[强制绑定检查] 使用缓存结果', {
        needBindPhone: app.globalData.needBindPhone
      })
      return app.globalData.needBindPhone
    }
    
    const token = wx.getStorageSync('token')
    if (!token) {
      console.log('[强制绑定检查] 用户未登录')
      app.globalData.needBindPhone = false
      return false
    }
    
    console.log('[强制绑定检查] 开始检查绑定状态...')
    
    // 获取登录配置
    const configRes = await wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/auth/config',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })
    
    const config = (configRes.data as any)?.data
    console.log('[强制绑定检查] 登录配置', config)
    
    if (!config || !config.forceBindPhone) {
      console.log('[强制绑定检查] 未启用强制绑定')
      app.globalData.forceBindPhone = false
      app.globalData.needBindPhone = false
      return false
    }
    
    app.globalData.forceBindPhone = true
    
    // 获取绑定状态
    const bindingRes = await wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/auth/binding/status',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const bindingStatus = (bindingRes.data as any)?.data
    console.log('[强制绑定检查] 绑定状态', bindingStatus)
    
    const hasPhone = bindingStatus?.hasPhone === true
    const needBind = !hasPhone
    
    console.log('[强制绑定检查] 检查结果', {
      hasPhone,
      needBind,
      timestamp: new Date().toISOString()
    })
    
    app.globalData.needBindPhone = needBind
    return needBind
  } catch (error) {
    console.error('[强制绑定检查] 检查失败', error)
    const app = getApp<IAppOption>()
    app.globalData.needBindPhone = false
    return false
  }
}

/**
 * 检查页面访问权限并在需要时跳转到绑定页面
 * 需求: 6.4
 * @param pagePath 当前页面路径
 * @param forceRefresh 是否强制刷新绑定状态
 * @returns Promise<boolean> 是否允许访问
 */
export async function checkPageAccess(pagePath: string, forceRefresh: boolean = false): Promise<boolean> {
  console.log('[页面访问检查] 检查页面访问权限', { pagePath })
  
  // 如果不是受限页面，允许访问
  if (!isRestrictedPage(pagePath)) {
    console.log('[页面访问检查] 非受限页面，允许访问')
    return true
  }
  
  console.log('[页面访问检查] 受限页面，检查绑定状态')
  
  // 检查是否需要绑定手机号
  const needBind = await checkNeedBindPhone(forceRefresh)
  
  if (needBind) {
    console.log('[页面访问检查] 需要绑定手机号，拦截访问')
    
    // 显示提示并跳转到绑定页面
    wx.showModal({
      title: '提示',
      content: '该功能需要绑定手机号后才能使用',
      confirmText: '去绑定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/auth/bind-phone',
            fail: () => {
              wx.navigateTo({
                url: '/pages/auth/bind-phone'
              })
            }
          })
        } else {
          // 用户取消，返回上一页
          wx.navigateBack({
            fail: () => {
              wx.switchTab({
                url: '/pages/mine/index'
              })
            }
          })
        }
      }
    })
    
    return false
  }
  
  console.log('[页面访问检查] 已绑定手机号，允许访问')
  return true
}

/**
 * 显示"请先绑定手机号"提示
 * 需求: 6.4
 */
export function showBindPhoneRequired(): void {
  wx.showModal({
    title: '提示',
    content: '该功能需要绑定手机号后才能使用',
    confirmText: '去绑定',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/auth/bind-phone'
        })
      }
    }
  })
}

/**
 * 在页面onLoad中调用，检查访问权限
 * 需求: 6.4
 * @example
 * // 在页面的onLoad中使用
 * async onLoad() {
 *   const canAccess = await checkPageAccessOnLoad(this.route)
 *   if (!canAccess) {
 *     return // 页面被限制访问，已自动跳转
 *   }
 *   // 继续页面初始化逻辑
 * }
 */
export async function checkPageAccessOnLoad(route: string): Promise<boolean> {
  const pagePath = `/${route}`
  return await checkPageAccess(pagePath, false)
}

/**
 * 在页面onShow中调用，检查访问权限
 * 需求: 6.4, 6.5
 * 用于在页面显示时重新检查绑定状态，防止用户绕过绑定要求
 * @example
 * // 在页面的onShow中使用
 * async onShow() {
 *   const canAccess = await checkPageAccessOnShow(this.route)
 *   if (!canAccess) {
 *     return // 页面被限制访问，已自动跳转
 *   }
 * }
 */
export async function checkPageAccessOnShow(route: string): Promise<boolean> {
  const pagePath = `/${route}`
  // 在onShow中强制刷新绑定状态，确保获取最新状态
  return await checkPageAccess(pagePath, true)
}

/**
 * 刷新绑定状态
 * 在绑定手机号成功后调用此方法更新全局状态
 */
export async function refreshBindingStatus(): Promise<void> {
  console.log('[刷新绑定状态] 开始刷新...')
  await checkNeedBindPhone(true)
  console.log('[刷新绑定状态] 刷新完成')
}
