/**
 * 认证工具函数
 * 提供登录状态检查、Token管理、登录跳转等功能
 */

// Token存储的key
const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number
  phone: string
  nickname?: string
  avatar?: string
}

/**
 * 检查登录状态
 * @returns 是否已登录
 * 
 * @example
 * if (checkLogin()) {
 *   // 已登录，执行操作
 * } else {
 *   // 未登录，跳转登录页
 *   navigateToLogin()
 * }
 */
export function checkLogin(): boolean {
  const token = getToken()
  return !!token && token.length > 0
}

/**
 * 获取Token
 * @returns Token字符串，如果不存在返回空字符串
 * 
 * @example
 * const token = getToken()
 * if (token) {
 *   // 使用token进行API调用
 * }
 */
export function getToken(): string {
  try {
    const token = wx.getStorageSync(TOKEN_KEY)
    return token || ''
  } catch (error) {
    console.error('获取Token失败:', error)
    return ''
  }
}

/**
 * 设置Token
 * @param token Token字符串
 * @returns 是否设置成功
 * 
 * @example
 * setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
 */
export function setToken(token: string): boolean {
  try {
    wx.setStorageSync(TOKEN_KEY, token)
    return true
  } catch (error) {
    console.error('设置Token失败:', error)
    return false
  }
}

/**
 * 清除Token
 * @returns 是否清除成功
 * 
 * @example
 * clearToken() // 退出登录时调用
 */
export function clearToken(): boolean {
  try {
    wx.removeStorageSync(TOKEN_KEY)
    return true
  } catch (error) {
    console.error('清除Token失败:', error)
    return false
  }
}

/**
 * 获取用户信息
 * @returns 用户信息对象，如果不存在返回null
 * 
 * @example
 * const userInfo = getUserInfo()
 * if (userInfo) {
 *   console.log('用户昵称:', userInfo.nickname)
 * }
 */
export function getUserInfo(): UserInfo | null {
  try {
    const userInfoStr = wx.getStorageSync(USER_INFO_KEY)
    if (userInfoStr) {
      return JSON.parse(userInfoStr) as UserInfo
    }
    return null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 设置用户信息
 * @param userInfo 用户信息对象
 * @returns 是否设置成功
 * 
 * @example
 * setUserInfo({
 *   id: 1,
 *   phone: '13800138000',
 *   nickname: '张三',
 *   avatar: 'https://example.com/avatar.jpg'
 * })
 */
export function setUserInfo(userInfo: UserInfo): boolean {
  try {
    wx.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo))
    return true
  } catch (error) {
    console.error('设置用户信息失败:', error)
    return false
  }
}

/**
 * 清除用户信息
 * @returns 是否清除成功
 * 
 * @example
 * clearUserInfo() // 退出登录时调用
 */
export function clearUserInfo(): boolean {
  try {
    wx.removeStorageSync(USER_INFO_KEY)
    return true
  } catch (error) {
    console.error('清除用户信息失败:', error)
    return false
  }
}

/**
 * 跳转到登录页
 * @param redirectUrl 登录成功后要跳转的页面路径（可选）
 * 
 * @example
 * // 直接跳转登录页
 * navigateToLogin()
 * 
 * // 登录成功后跳转到指定页面
 * navigateToLogin('/pages/mine/index')
 */
export function navigateToLogin(redirectUrl?: string): void {
  const url = redirectUrl 
    ? `/pages/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
    : '/pages/auth/login'
  
  wx.navigateTo({
    url,
    fail: (error) => {
      console.error('跳转登录页失败:', error)
      // 如果navigateTo失败（可能是页面栈已满），使用redirectTo
      wx.redirectTo({
        url,
        fail: (error) => {
          console.error('redirectTo登录页失败:', error)
        }
      })
    }
  })
}

/**
 * 退出登录
 * 清除Token和用户信息，并跳转到登录页
 * 
 * @example
 * logout() // 用户点击退出登录按钮时调用
 */
export function logout(): void {
  clearToken()
  clearUserInfo()
  
  wx.showToast({
    title: '已退出登录',
    icon: 'success',
    duration: 1500
  })
  
  setTimeout(() => {
    navigateToLogin()
  }, 1500)
}

/**
 * 检查登录状态并在未登录时跳转登录页
 * @param redirectUrl 登录成功后要跳转的页面路径（可选）
 * @returns 是否已登录
 * 
 * @example
 * // 在需要登录的页面中使用
 * if (!checkLoginAndNavigate()) {
 *   return // 未登录，已跳转登录页
 * }
 * // 已登录，继续执行后续逻辑
 */
export function checkLoginAndNavigate(redirectUrl?: string): boolean {
  if (!checkLogin()) {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 1500
    })
    
    setTimeout(() => {
      navigateToLogin(redirectUrl)
    }, 1500)
    
    return false
  }
  
  return true
}

/**
 * 刷新Token（如果后端支持Token刷新机制）
 * @returns Promise，成功返回新Token，失败返回null
 * 
 * @example
 * const newToken = await refreshToken()
 * if (newToken) {
 *   console.log('Token刷新成功')
 * } else {
 *   console.log('Token刷新失败，需要重新登录')
 *   logout()
 * }
 */
export async function refreshToken(): Promise<string | null> {
  // 这里需要根据后端实际的Token刷新接口实现
  // 目前返回null，表示不支持Token刷新
  // 如果后端支持，可以调用刷新接口获取新Token
  
  try {
    // 示例代码（需要根据实际API调整）:
    // const response = await wx.request({
    //   url: 'https://api.example.com/auth/refresh',
    //   method: 'POST',
    //   header: {
    //     'Authorization': `Bearer ${getToken()}`
    //   }
    // })
    // 
    // if (response.data.code === 200) {
    //   const newToken = response.data.data.token
    //   setToken(newToken)
    //   return newToken
    // }
    
    return null
  } catch (error) {
    console.error('刷新Token失败:', error)
    return null
  }
}

/**
 * 绑定状态接口
 */
export interface BindingStatus {
  hasWechat: boolean
  hasPhone: boolean
  phone?: string
  wechatNickname?: string
}

/**
 * 检查用户是否已绑定手机号
 * @returns Promise<boolean> 是否已绑定手机号
 * 
 * @example
 * const hasPhone = await checkPhoneBinding()
 * if (!hasPhone) {
 *   console.log('用户未绑定手机号')
 * }
 */
export async function checkPhoneBinding(): Promise<boolean> {
  const token = getToken()
  
  if (!token) {
    return false
  }
  
  return new Promise((resolve) => {
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/auth/binding/status',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      success: (res: any) => {
        if (res.data && res.data.code === 200 && res.data.data) {
          resolve(res.data.data.hasPhone || false)
        } else {
          resolve(false)
        }
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 检查是否启用强制绑定手机号
 * @returns Promise<boolean> 是否启用强制绑定
 * 
 * @example
 * const forceBindEnabled = await checkForceBindPhone()
 * if (forceBindEnabled) {
 *   console.log('已启用强制绑定手机号')
 * }
 */
export async function checkForceBindPhone(): Promise<boolean> {
  return new Promise((resolve) => {
    wx.request({
      url: 'https://fireworks-project.zhengpan.cn/api/auth/config',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res: any) => {
        if (res.data && res.data.code === 200 && res.data.data) {
          resolve(res.data.data.forceBindPhone || false)
        } else {
          resolve(false)
        }
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 检查功能权限
 * 如果启用强制绑定且用户未绑定手机号,则提示并跳转到绑定页面
 * @param showToast 是否显示提示信息,默认为true
 * @returns Promise<boolean> 是否有权限访问
 * 
 * @example
 * // 在需要权限的页面onLoad中使用
 * const hasPermission = await checkPermission()
 * if (!hasPermission) {
 *   return // 已跳转到绑定页面
 * }
 * // 继续执行页面逻辑
 */
export async function checkPermission(showToast: boolean = true): Promise<boolean> {
  // 1. 检查是否已登录
  if (!checkLogin()) {
    if (showToast) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
      
      setTimeout(() => {
        navigateToLogin()
      }, 1500)
    }
    return false
  }
  
  // 2. 检查是否启用强制绑定
  const forceBindEnabled = await checkForceBindPhone()
  
  if (!forceBindEnabled) {
    // 未启用强制绑定,允许访问
    return true
  }
  
  // 3. 检查是否已绑定手机号
  const hasPhone = await checkPhoneBinding()
  
  if (hasPhone) {
    // 已绑定手机号,允许访问
    return true
  }
  
  // 4. 未绑定手机号且启用强制绑定,提示并跳转
  if (showToast) {
    wx.showModal({
      title: '提示',
      content: '请先绑定手机号才能使用此功能',
      showCancel: true,
      confirmText: '去绑定',
      cancelText: '暂不绑定',
      success: (modalRes) => {
        if (modalRes.confirm) {
          wx.navigateTo({
            url: '/pages/auth/bind-phone',
            fail: () => {
              wx.redirectTo({
                url: '/pages/auth/bind-phone'
              })
            }
          })
        }
      }
    })
  }
  
  return false
}

/**
 * 检查功能权限(静默模式)
 * 不显示提示信息,仅返回是否有权限
 * @returns Promise<boolean> 是否有权限访问
 * 
 * @example
 * const hasPermission = await checkPermissionSilent()
 * if (hasPermission) {
 *   // 显示功能按钮
 * } else {
 *   // 隐藏功能按钮或显示"需要绑定手机号"提示
 * }
 */
export async function checkPermissionSilent(): Promise<boolean> {
  return checkPermission(false)
}
