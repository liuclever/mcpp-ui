// 通用响应结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应数据
export interface PageResult<T> {
  records: T[]
  list?: T[]  // 兼容不同的后端返回格式
  total: number
  size: number
  current: number
  pages: number
}

// 管理员登录请求
export interface AdminLoginRequest {
  username: string
  password: string
}

// 管理员登录响应
export interface AdminLoginResponse {
  id: number
  username: string
  nickname: string
  role: string
  token: string
}

// 管理员信息
export interface AdminInfo {
  id: number
  username: string
  nickname: string
  role: string
  status: number
  createTime: string
}

// 产品信息
export interface Product {
  id: number
  name: string
  nameEn?: string
  code: string
  categoryId: number
  content: string
  volume: string
  image: string
  videoUrl?: string
  burnDuration?: number
  views: number
  likes: number
  sort: number
  status: number
  createTime?: string
  updateTime?: string
}

// 产品分类
export interface Category {
  id: number
  parentId: number
  name: string
  code: string
  icon?: string
  sort: number
  status: number
  children?: Category[]
}

// 用户信息
export interface User {
  id: number
  phone: string
  nickname: string
  avatar?: string
  region?: string
  points: number
  status: number
  createTime?: string
  updateTime?: string
}

// 积分记录
export interface PointsLog {
  id: number
  userId: number
  points: number
  type: string
  reason: string
  createTime: string
}

// 更新用户状态请求
export interface UpdateUserStatusRequest {
  id: number
  status: number
}

// 门店信息
export interface Store {
  id: number
  name: string
  address: string
  phone: string
  latitude: number
  longitude: number
  businessHours: string
  image?: string
  status: number
  createTime?: string
  updateTime?: string
}

// 入驻申请
export interface JoinApply {
  id: number
  name: string
  company: string
  phone: string
  status: number
  remark?: string
  createTime?: string
}

// ==================== 产品视频相关类型 ====================

// 产品视频信息
export interface ProductVideo {
  id: number
  productId: number
  title: string
  description: string
  videoUrl: string
  coverUrl: string
  duration: number
  fileSize: number
  status: number
  sortOrder: number
  createTime: string
  updateTime: string
  productName?: string  // 扩展字段：产品名称
}

// 产品视频列表查询参数
export interface ProductVideoListParams {
  page: number
  pageSize: number
  status?: number  // 可选：状态筛选 0=待审核, 1=已发布, 2=已拒绝
}

// 产品视频数量映射
export interface ProductVideoCountMap {
  [productId: number]: number
}
