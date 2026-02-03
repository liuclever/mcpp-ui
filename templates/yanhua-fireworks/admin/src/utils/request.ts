import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// API响应类型 - 后端统一返回格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 根据环境变量获取API基础URL
// 开发环境: http://localhost:8080/api
// 生产环境: https://fireworks-project.zhengpan.cn/api
const getBaseURL = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL
  // 确保baseURL以/api结尾
  return envBaseUrl ? `${envBaseUrl}/api` : 'http://localhost:8080/api'
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 300000, // 5分钟超时，支持大文件上传
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('admin_token')
    console.log('🔍 Request Interceptor - BaseURL:', config.baseURL)
    console.log('🔍 Request Interceptor - URL:', config.url)
    console.log('🔍 Request Interceptor - Full URL:', `${config.baseURL}${config.url}`)
    console.log('🔍 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Authorization header set')
    } else {
      console.log('❌ No token found in localStorage')
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 返回响应数据部分(包含code, data, message)
    return response.data
  },
  (error) => {
    console.error('响应错误：', error)
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_info')
          router.push('/login')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(error.response.data.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

// 类型化的请求函数 - 返回解包后的ApiResponse
// 由于拦截器已返回response.data，这里正确声明返回类型
function request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return service(config) as unknown as Promise<ApiResponse<T>>
}

// 导出类型化的请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request<T>({ ...config, url, method: 'GET' })
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request<T>({ ...config, url, method: 'POST', data })
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request<T>({ ...config, url, method: 'PUT', data })
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return request<T>({ ...config, url, method: 'DELETE' })
  }
}

export { request }
export default service
