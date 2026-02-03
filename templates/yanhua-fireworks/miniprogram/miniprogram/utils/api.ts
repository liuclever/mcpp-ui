// API请求封装
const BASE_URL = 'http://localhost:8080/api' // 后端API地址 - 请修改为实际地址
const REQUEST_TIMEOUT = 30000 // 请求超时时间（毫秒）- 增加到30秒以应对网络延迟

// 获取基础URL
function getBaseUrl(): string {
  return BASE_URL
}

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  showLoading?: boolean
  timeout?: number
}

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// Token刷新状态
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

// 添加Token刷新订阅
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

// 通知所有订阅者Token已刷新
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

// Token自动刷新
async function refreshToken(): Promise<string> {
  try {
    const token = wx.getStorageSync('token')
    if (!token) {
      throw new Error('No token')
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + '/user/refreshToken',
        method: 'POST',
        header: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        success: (res) => {
          const result = res.data as ApiResponse<{ token: string }>
          if (result.code === 200 && result.data && result.data.token) {
            wx.setStorageSync('token', result.data.token)
            console.log('[Token刷新] Token自动刷新成功')
            resolve(result.data.token)
          } else {
            reject(new Error('Token refresh failed'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  } catch (error) {
    // Token刷新失败，清除登录信息
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    throw error
  }
}

// 请求拦截器：添加Token
function requestInterceptor(options: RequestOptions): RequestOptions {
  const { header = {} } = options
  
  // 添加Token
  const token = wx.getStorageSync('token')
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  return {
    ...options,
    header: {
      'Content-Type': 'application/json',
      ...header
    },
    timeout: options.timeout || REQUEST_TIMEOUT
  }
}

// 响应拦截器：处理错误
async function responseInterceptor<T>(
  response: WechatMiniprogram.RequestSuccessCallbackResult,
  options: RequestOptions
): Promise<ApiResponse<T>> {
  const result = response.data as ApiResponse<T>

  // 成功响应
  if (result.code === 200) {
    return result
  }

  // Token过期，尝试刷新
  if (result.code === 401) {
    if (!isRefreshing) {
      isRefreshing = true
      try {
        const newToken = await refreshToken()
        isRefreshing = false
        onTokenRefreshed(newToken)
        
        // 重新发起原请求
        return request<T>(options)
      } catch (error) {
        isRefreshing = false
        wx.showToast({ title: '请重新登录', icon: 'none' })
        // 可以在这里跳转到登录页
        // wx.navigateTo({ url: '/pages/auth/login' })
        throw result
      }
    } else {
      // 正在刷新Token，等待刷新完成后重试
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          request<T>(options).then(resolve).catch(reject)
        })
      })
    }
  }

  // 其他错误 - 直接抛出，由调用方处理错误提示
  const error = new Error(result.message || '请求失败') as any
  error.code = result.code
  error.data = result.data
  throw error
}

// 请求封装
export function request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
  const { url, method = 'GET', data, showLoading = true } = options
  
  if (showLoading) {
    wx.showLoading({ title: '加载中...', mask: true })
  }

  // 应用请求拦截器
  const interceptedOptions = requestInterceptor(options)

  // 处理GET请求的参数（手动拼接，兼容小程序环境）
  let requestUrl = BASE_URL + url
  let requestData = data
  
  if (method === 'GET' && data) {
    // 手动拼接参数，避免使用URLSearchParams（小程序不支持）
    const params: string[] = []
    Object.keys(data).forEach(key => {
      const value = data[key]
      if (value !== undefined && value !== null && value !== '') {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      }
    })
    if (params.length > 0) {
      requestUrl += (url.includes('?') ? '&' : '?') + params.join('&')
    }
    requestData = undefined // GET请求不需要body
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      method,
      data: requestData,
      header: interceptedOptions.header,
      timeout: interceptedOptions.timeout,
      success: async (res) => {
        if (showLoading) wx.hideLoading()
        
        try {
          // 应用响应拦截器
          const result = await responseInterceptor<T>(res, options)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      },
      fail: (err) => {
        if (showLoading) wx.hideLoading()
        
        // 处理超时错误
        if (err.errMsg && err.errMsg.includes('timeout')) {
          wx.showToast({ title: '请求超时，请重试', icon: 'none' })
        } else {
          wx.showToast({ title: '网络错误', icon: 'none' })
        }
        reject(err)
      }
    })
  })
}

// API接口
export const api = {
  // 通用请求方法
  request: request,
  
  // 认证相关
  getLoginConfig: () => 
    request({ url: '/auth/config', method: 'GET' }),
  
  // 发送短信验证码（禁用自动弹窗，由调用方处理错误提示）
  sendSmsCode: (data: { phone: string; type: 'REGISTER' | 'LOGIN' | 'BIND' | 'RESET_PASSWORD' }) => 
    request({ url: '/auth/sms/send', method: 'POST', data, showLoading: false }),
  
  // 手机号注册
  phoneRegister: (data: { phone: string; smsCode: string; password: string }) => 
    request({ url: '/auth/phone/register', method: 'POST', data }),
  
  // 手机号登录
  phoneLogin: (data: { phone: string; password: string }) => 
    request({ url: '/auth/phone/login', method: 'POST', data }),
  
  // 微信登录
  wechatLogin: (data: { code: string }) => 
    request({ 
      url: '/auth/wechat/login', 
      method: 'POST', 
      data,
      timeout: 30000
    }),
  
  // 绑定手机号
  bindPhone: (data: { phone: string; smsCode: string; password: string }) => 
    request({ url: '/auth/bind/phone', method: 'POST', data }),
  
  // 绑定微信
  bindWechat: (data: { code: string }) => 
    request({ url: '/auth/bind/wechat', method: 'POST', data }),
  
  // 账号合并
  mergeAccount: (data: { targetUserId: number; password: string }) => 
    request({ url: '/auth/merge', method: 'POST', data }),
  
  // 获取绑定状态（使用user接口，检查User表的openid和phone字段）
  getBindingStatus: () => 
    request({ url: '/user/binding-status', method: 'GET' }),
  
  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) => 
    request({ url: '/auth/password/change', method: 'POST', data }),
  
  // 解绑手机号
  unbindPhone: (data: { password: string }) => 
    request({ url: '/auth/unbind/phone', method: 'POST', data }),
  
  // 解绑微信
  unbindWechat: (data: { password: string }) => 
    request({ url: '/auth/unbind/wechat', method: 'POST', data }),
  
  // 用户相关
  login: (data: { phone: string; password: string }) => 
    request({ url: '/user/login', method: 'POST', data }),
  
  register: (data: { phone: string; password: string; code: string }) => 
    request({ url: '/user/register', method: 'POST', data }),
  
  wxLogin: (data: { code: string; nickname?: string; avatar?: string }) => 
    request({ 
      url: '/user/wxLogin', 
      method: 'POST', 
      data,
      timeout: 30000  // 微信登录使用30秒超时，因为涉及多次网络请求
    }),
  
  sendCode: (phone: string) => 
    request({ url: '/user/sendCode', method: 'POST', data: { phone } }),
  
  getUserInfo: () => 
    request({ url: '/user/info' }),
  
  updateUserInfo: (data: { nickname?: string; avatar?: string; region?: string }) => 
    request({ url: '/user/update', method: 'POST', data }),

  // 产品相关
  getCategories: () => 
    request({ url: '/product/categories' }),
  
  getProducts: (params: { categoryId?: string; page: number; pageSize: number; sort?: string }) => 
    request({ url: '/product/list', method: 'GET', data: params }),
  
  getProductDetail: (id: string) => 
    request({ url: `/product/detail/${id}` }),
  
  searchProducts: (keyword: string) => 
    request({ url: '/product/search', method: 'GET', data: { keyword } }),

  // 门店相关
  getNearbyStores: (lat: number, lng: number) => 
    request({ url: '/store/nearby', data: { lat, lng } }),
  
  searchStores: (keyword: string) => 
    request({ url: '/store/search', data: { keyword } }),

  // 加盟申请
  submitJoinApply: (data: { name: string; company: string; phone: string }) => 
    request({ url: '/store/apply', method: 'POST', data }),

  // 点赞收藏
  likeProduct: (productId: string) => 
    request({ url: `/product/like?productId=${encodeURIComponent(productId)}`, method: 'POST', showLoading: false }),

  unlikeProduct: (productId: string) =>
    request({ url: `/product/like?productId=${encodeURIComponent(productId)}`, method: 'DELETE', showLoading: false }),
  
  collectProduct: (productId: string) => 
    request({ url: `/product/collect?productId=${encodeURIComponent(productId)}`, method: 'POST', showLoading: false }),

  // 视频相关
  getVideoList: (params: { status?: number; userId?: number; page: number; pageSize: number }) => 
    request({ url: '/video/list', method: 'GET', data: params }),
  
  getVideoDetail: (id: number) => 
    request({ url: `/video/detail/${id}` }),
  
  // 用户收藏和点赞列表
  getMyCollects: (params: { page: number; pageSize: number }) => 
    request({ url: '/video/my-collects', method: 'GET', data: params }),
  
  getMyLikes: (params: { page: number; pageSize: number }) => 
    request({ url: '/video/my-likes', method: 'GET', data: params }),

  // 关于我们内容
  getAboutUsContent: () => 
    request({ url: '/about-us/content', method: 'GET' }),

  // 联系信息
  getAboutContact: () => 
    request({ url: '/about/contact', method: 'GET' }),

  // 获取基础URL
  getBaseUrl: () => getBaseUrl(),
}

// 类型定义 - 后端返回的原始数据结构
export interface AboutContactBackend {
  id: number
  logoUrl: string
  companyName: string
  address: string
  phone1: string
  phone2?: string
  phone3?: string
  fax?: string
  email: string
  latitude?: number
  longitude?: number
  createTime: string
  updateTime: string
}

// 前端使用的联系信息接口（简化版）
export interface AboutContact {
  id: number
  companyName: string
  address: string
  phone: string  // 从phone1转换而来
  email?: string
  wechat?: string
  workingHours?: string
  latitude?: number
  longitude?: number
  createTime?: string
  updateTime?: string
}

export default api
