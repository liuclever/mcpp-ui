// pages/community/detail.ts
import { getCommentList, publishComment, likeComment, unlikeComment } from '../../utils/interaction-api'
import { formatTime } from '../../utils/format'
import api from '../../utils/api'
import { checkPermission } from '../../utils/auth'

interface Video {
  id: string
  title: string
  description?: string
  videoUrl: string
  coverUrl: string
  userId: number
  userName?: string
  userAvatar?: string
  views: number
  likes: number
  collects: number
  comments: number
  createTime: string
  productNames?: string[]  // 相关产品
}

interface Comment {
  id: string
  videoId: string
  userId: number
  userName: string
  userAvatar: string
  content: string
  parentId: string | null
  replyToId: number | null
  replyToName?: string
  likes: number
  isLiked?: boolean
  createTime: string
  children?: Comment[]
}

Page({
  data: {
    videoId: '' as string,
    video: null as Video | null,
    comments: [] as Comment[],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    showCommentInput: false,
    scrollToComment: false,  // 是否滚动到评论区
    replyComment: null as Comment | null  // 当前回复的评论
  },

  async onLoad(options: any) {
    const { id, scrollTo } = options
    
    if (id) {
      this.setData({ 
        videoId: id,
        scrollToComment: scrollTo === 'comment'
      })
      this.loadVideoDetail()
      this.loadComments()
    }
  },

  // 显示评论输入框
  async showCommentInput() {
    // 检查登录状态和权限
    // 需求: 6.4 - 限制未绑定用户访问部分功能
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      return // 已显示提示并跳转
    }

    this.setData({ 
      showCommentInput: true,
      replyComment: null
    })
  },

  // 回复评论
  async onReplyComment(e: any) {
    const { comment } = e.detail
    
    // 检查登录状态和权限
    // 需求: 6.4 - 限制未绑定用户访问部分功能
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      return // 已显示提示并跳转
    }

    this.setData({
      showCommentInput: true,
      replyComment: comment
    })
  },

  // 加载评论列表
  async loadComments() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const result = await getCommentList({
        videoId: this.data.videoId,
        page: this.data.page,
        pageSize: this.data.pageSize
      })

      const formattedComments = result.records.map(comment => ({
        ...comment,
        createTime: formatTime(comment.createTime)
      }))

      const comments = this.data.page === 1 
        ? formattedComments 
        : [...this.data.comments, ...formattedComments]

      this.setData({
        comments,
        hasMore: comments.length < result.total,
        loading: false
      })

      // 如果需要滚动到评论区
      if (this.data.scrollToComment && this.data.page === 1) {
        setTimeout(() => {
          wx.pageScrollTo({
            selector: '#comment-section',
            duration: 300
          })
        }, 500)
      }
    } catch (error) {
      console.error('加载评论失败:', error)
      this.setData({ loading: false })
    }
  },

  // 加载更多评论
  onLoadMoreComments() {
    this.setData({ page: this.data.page + 1 })
    this.loadComments()
  },


  // 提交评论
  async onSubmitComment(e: any) {
    const { content } = e.detail
    const { videoId, replyComment } = this.data

    try {
      const params: any = {
        videoId,
        content
      }

      // 如果是回复评论
      if (replyComment) {
        params.parentId = replyComment.parentId || replyComment.id
        params.replyToId = replyComment.userId
      }

      await publishComment(params)

      // 关闭输入框
      this.setData({
        showCommentInput: false,
        replyComment: null
      })

      // 重新加载评论列表
      this.setData({ page: 1, comments: [], hasMore: true })
      this.loadComments()

      // 通知comment-input组件重置
      const commentInput = this.selectComponent('#comment-input')
      if (commentInput) {
        commentInput.reset()
      }
    } catch (error) {
      console.error('发表评论失败:', error)
      
      // 通知comment-input组件停止提交状态
      const commentInput = this.selectComponent('#comment-input')
      if (commentInput) {
        commentInput.setSubmitting(false)
      }
    }
  },

  // 取消评论
  onCancelComment() {
    this.setData({
      showCommentInput: false,
      replyComment: null
    })
  },

  // 点赞评论
  async onLikeComment(e: any) {
    const { comment } = e.detail
    
    // 检查登录状态和权限
    // 需求: 6.4 - 限制未绑定用户访问部分功能
    const hasPermission = await checkPermission()
    if (!hasPermission) {
      return // 已显示提示并跳转
    }

    try {
      if (comment.isLiked) {
        await unlikeComment(parseInt(comment.id))
      } else {
        await likeComment(parseInt(comment.id))
      }

      // 更新评论列表中的点赞状态
      const comments = this.data.comments.map(c => {
        if (c.id === comment.id) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1
          }
        }
        return c
      })

      this.setData({ comments })
    } catch (error) {
      console.error('点赞评论失败:', error)
    }
  },

  // 加载视频详情
  async loadVideoDetail() {
    try {
      const result = await api.request({
        url: `/video/detail/${this.data.videoId}`,
        method: 'GET'
      })

      if (result.code === 200 && result.data) {
        this.setData({
          video: {
            ...result.data,
            createTime: formatTime(result.data.createTime)
          }
        })
      }
    } catch (error) {
      console.error('加载视频详情失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 返回
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
