import request from '@/utils/request'

/**
 * 表单提交接口
 */
export interface FormSubmission {
  id?: number
  name: string
  phone: string
  province: string
  city: string
  district?: string
  budget?: string
  message?: string
  status: 'pending' | 'contacted' | 'closed' | 'abandoned'
  remark?: string
  submitTime?: string
  handleTime?: string
}

/**
 * 表单列表查询参数
 */
export interface FormListParams {
  page?: number
  pageSize?: number
  status?: string
  startTime?: string
  endTime?: string
  keyword?: string
}

/**
 * 获取表单提交列表
 */
export function getFormSubmissions(params: FormListParams) {
  return request({
    url: '/admin/form/submissions',
    method: 'get',
    params
  })
}

/**
 * 获取表单详情
 */
export function getFormSubmissionDetail(id: number) {
  return request({
    url: `/admin/form/submissions/${id}`,
    method: 'get'
  })
}

/**
 * 更新表单状态
 */
export function updateFormStatus(id: number, data: { status: string; remark?: string }) {
  return request({
    url: `/admin/form/submissions/${id}/status`,
    method: 'put',
    data
  })
}

/**
 * 导出表单数据
 */
export function exportFormSubmissions(params: {
  status?: string
  startTime?: string
  endTime?: string
}) {
  return request({
    url: '/admin/form/submissions/export',
    method: 'get',
    params
  })
}
