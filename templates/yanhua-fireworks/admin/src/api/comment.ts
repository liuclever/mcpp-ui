import request from '@/utils/request'

/**
 * 获取评论列表（管理后台）
 */
export function getCommentList(params: {
  status?: number
  videoId?: string
  page: number
  pageSize: number
}) {
  // 确保token被正确传递
  const token = localStorage.getItem('admin_token')
  console.log('🔍 getCommentList - Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND')
  
  return request({
    url: '/admin/comment/list',
    method: 'get',
    params,
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
}

/**
 * 审核评论
 */
export function reviewComment(data: {
  commentId: number
  status: number
  rejectReason?: string
}) {
  return request({
    url: '/admin/comment/review',
    method: 'post',
    params: data
  })
}

/**
 * 删除评论
 */
export function deleteComment(id: number) {
  return request({
    url: `/admin/comment/delete/${id}`,
    method: 'delete'
  })
}
