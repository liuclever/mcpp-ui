import request from '@/utils/request'

export function getProductCommentList(params: {
  status?: number
  productId?: string
  page: number
  pageSize: number
}) {
  const token = localStorage.getItem('admin_token')
  return request({
    url: '/admin/product/comment/list',
    method: 'get',
    params,
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  })
}

export function reviewProductComment(data: {
  commentId: number
  status: number
}) {
  return request({
    url: '/admin/product/comment/review',
    method: 'post',
    params: data
  })
}

export function deleteProductComment(id: number) {
  return request({
    url: `/admin/product/comment/delete/${id}`,
    method: 'delete'
  })
}
