import { request } from '@/utils/request'

/**
 * 关于联系信息接口类型
 */
export interface AboutContact {
  id?: number
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
  createTime?: string
  updateTime?: string
}

/**
 * 获取联系信息
 */
export function getContact() {
  return request<AboutContact>({
    url: '/about/contact',
    method: 'get'
  })
}

/**
 * 更新联系信息（管理员）
 */
export function updateContact(data: AboutContact) {
  return request<boolean>({
    url: '/admin/about/contact',
    method: 'put',
    data
  })
}

/**
 * 关于联系信息API对象（用于组件中使用）
 */
export const aboutContactApi = {
  getContact,
  updateContact
}
