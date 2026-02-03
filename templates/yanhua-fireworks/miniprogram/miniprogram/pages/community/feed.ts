// pages/community/feed.ts
import { getVideoList } from '../../utils/video-api'
import { likeVideo, unlikeVideo, collectVideo, uncollectVideo } from '../../utils/interaction-api'
import { formatTime } from '../../utils/format'
import api from '../../utils/api'

interface Video {
  id: string  // 改为string避免JavaScript精度丢失
  title: string
  description?: string
  videoUrl: string
  coverUrl: string
  location?: string
  userId: number
  userName?: string
  userAvatar?: string
  views: number
  likes: number
  collects: number
  comments: number
  shares: number
  createTime: string
  isLiked: boolean
  isCollected: boolean
}

Page({
  data: {
    videoList: [] as Video[],
    currentIndex: 0,
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    topic: '' as string, // 话题标签（如果从话题页跳转）
    showCommentPopup: false, // 是否显示评论弹窗
    currentVideoId: '', // 当前评论的视频ID
    commentInputValue: '', // 评论输入框的值
    commentSubmitting: false, // 是否正在提交评论
    comments: [] as any[], // 评论列表
    commentPage: 1, // 评论页码
    commentPageSize: 20, // 评论每页数量
    commentHasMore: true, // 是否有更多评论
    commentLoading: false, // 是否正在加载评论
    showSharePopup: false, // 是否显示分享弹窗
    shareVideoId: '' // 当前分享的视频ID
  },

  onLoad(options: any) {
    const { id, index, topic, from } = options
    
    // 如果有话题参数，保存话题
    if (topic) {
      this.setData({ topic: decodeURIComponent(topic) })
    }
    
    // 如果从社区页面跳转过来，使用社区页面的视频列表
    if (from === 'community' && index !== undefined) {
      const app = getApp<IAppOption>()
      const communityVideos = (app.globalData as any)?.communityVideos
      
      if (communityVideos && communityVideos.length > 0) {
        // 使用社区页面的视频列表
        const startIndex = parseInt(index) || 0
        this.setData({
          videoList: communityVideos,
          currentIndex: startIndex,
          page: 1,
          hasMore: false // 暂时不加载更多，使用社区页面的列表
        })
        
        // 延迟播放，确保页面渲染完成
        setTimeout(() => {
          this.playCurrentVideo()
        }, 300)
        
        return
      }
    }
    
    // 如果从其他页面跳转过来，可能带有视频ID或索引
    if (id) {
      this.loadVideoById(id)
    } else if (index !== undefined) {
      this.setData({ currentIndex: parseInt(index) || 0 })
      this.loadVideos()
    } else {
      this.loadVideos()
    }
  },

  onShow() {
    // 页面显示时，播放当前视频
    this.playCurrentVideo()
  },

  onHide() {
    // 页面隐藏时，暂停所有视频
    this.pauseAllVideos()
  },

  onUnload() {
    // 页面卸载时，暂停所有视频
    this.pauseAllVideos()
  },

  // 返回按钮点击事件
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 加载视频列表
  async loadVideos() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      let records: Video[] = []
      let total = 0
      
      // 如果有话题，按话题查询
      if (this.data.topic) {
        const result = await api.request({
          url: `/video/topic/${encodeURIComponent(this.data.topic)}`,
          method: 'GET',
          data: {
            page: this.data.page,
            pageSize: this.data.pageSize
          }
        })
        
        if (result.code === 200 && result.data) {
          records = result.data.records || []
          total = result.data.total || 0
        } else {
          wx.showToast({
            title: result.message || '加载失败',
            icon: 'none'
          })
          this.setData({ loading: false })
          return
        }
      } else {
        // 否则查询所有视频 - getVideoList已经返回了PageResult对象
        const result = await getVideoList({
          page: this.data.page,
          pageSize: this.data.pageSize,
          status: 1
        })
        
        records = result.records || []
        total = result.total || 0
      }

      if (records.length > 0 || this.data.page === 1) {
        // 格式化时间
        const formattedList = records.map((video: Video) => ({
          ...video,
          createTime: formatTime(video.createTime)
        }))

        const videoList = this.data.page === 1 
          ? formattedList 
          : [...this.data.videoList, ...formattedList]

        // 调试日志 - 检查视频数据
        console.log('=== 视频列表数据 ===')
        console.log('总数:', videoList.length)
        videoList.forEach((video: Video, index: number) => {
          console.log(`视频${index}:`)
          console.log('  id:', video.id, 'type:', typeof video.id)
          console.log('  videoUrl:', video.videoUrl)
          console.log('  coverUrl:', video.coverUrl)
          console.log('  title:', video.title)
        })

        this.setData({
          videoList,
          hasMore: videoList.length < total,
          loading: false
        })

        // 如果是第一页，自动播放指定索引的视频
        if (this.data.page === 1 && videoList.length > 0) {
          setTimeout(() => {
            this.playCurrentVideo()
          }, 300)
        }
      } else {
        // 没有更多数据了
        this.setData({ 
          loading: false,
          hasMore: false
        })
      }
    } catch (error) {
      console.error('加载视频列表失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  // 根据ID加载单个视频
  async loadVideoById(videoId: string) {
    this.setData({ loading: true })

    try {
      const result = await api.request({
        url: `/video/detail/${videoId}`,
        method: 'GET'
      })

      if (result.code === 200 && result.data) {
        const video = {
          ...result.data,
          createTime: formatTime(result.data.createTime)
        }

        this.setData({
          videoList: [video],
          currentIndex: 0,
          loading: false
        })

        setTimeout(() => {
          this.playCurrentVideo()
        }, 300)
      } else {
        wx.showToast({
          title: result.message || '加载失败',
          icon: 'none'
        })
        this.setData({ loading: false })
      }
    } catch (error) {
      console.error('加载视频详情失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  // Swiper切换事件
  onSwiperChange(e: WechatMiniprogram.SwiperChange) {
    const { current } = e.detail
    const oldIndex = this.data.currentIndex

    // 暂停旧视频
    if (oldIndex !== current) {
      this.pauseVideo(oldIndex)
    }

    this.setData({ currentIndex: current })

    // 播放新视频
    this.playVideo(current)

    // 如果滑动到倒数第3个，加载更多
    if (current >= this.data.videoList.length - 3 && this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadVideos()
    }
  },

  // 播放当前视频
  playCurrentVideo() {
    const { currentIndex } = this.data
    this.playVideo(currentIndex)
  },

  // 播放指定索引的视频
  playVideo(index: number) {
    const videoContext = wx.createVideoContext(`video-player-${index}`, this)
    if (videoContext) {
      videoContext.play()
    }
  },

  // 暂停指定索引的视频
  pauseVideo(index: number) {
    const videoContext = wx.createVideoContext(`video-player-${index}`, this)
    if (videoContext) {
      videoContext.pause()
    }
  },

  // 视频点击事件 - 暂停/播放
  onVideoTap(e: WechatMiniprogram.BaseEvent) {
    const { index } = e.currentTarget.dataset
    const videoContext = wx.createVideoContext(`video-player-${index}`, this)
    
    if (videoContext) {
      // 简单的暂停/播放切换
      videoContext.pause()
      setTimeout(() => {
        videoContext.play()
      }, 100)
    }
  },

  // 暂停所有视频
  pauseAllVideos() {
    this.data.videoList.forEach((_, index) => {
      this.pauseVideo(index)
    })
  },

  // 视频播放事件
  onVideoPlay() {
    console.log('=== 视频开始播放 ===')
    // 可以在这里添加播放统计
  },

  // 视频暂停事件
  onVideoPause() {
    console.log('=== 视频暂停 ===')
    // 可以在这里添加暂停统计
  },

  // 视频播放结束事件
  onVideoEnded() {
    console.log('=== 视频播放结束 ===')
    // 视频播放结束，由于设置了loop，会自动循环播放
  },

  // 视频加载错误事件
  onVideoError(e: any) {
    console.error('=== 视频加载错误 ===')
    console.error('错误详情:', e.detail)
    console.error('错误代码:', e.detail.errMsg)
    wx.showToast({
      title: '视频加载失败',
      icon: 'none',
      duration: 2000
    })
  },

  // 点赞事件
  async onLike(e: WechatMiniprogram.CustomEvent) {
    const { videoId, isLiked } = e.detail
    const { currentIndex, videoList } = this.data

    // 调试日志
    console.log('=== 点赞事件调试 ===')
    console.log('videoId:', videoId, 'type:', typeof videoId)
    console.log('isLiked:', isLiked)
    console.log('currentIndex:', currentIndex)
    console.log('当前视频:', videoList[currentIndex])

    // 检查登录状态
    const token = wx.getStorageSync('token')
    console.log('Token:', token ? '存在' : '不存在', 'length:', token?.length)
    
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    try {
      console.log('调用API:', isLiked ? 'unlikeVideo' : 'likeVideo')
      
      let result
      if (isLiked) {
        result = await unlikeVideo(videoId)
      } else {
        result = await likeVideo(videoId)
      }

      console.log('API响应:', result)

      if (result.success) {
        // 更新当前视频的点赞状态
        const updatedList = [...videoList]
        updatedList[currentIndex] = {
          ...updatedList[currentIndex],
          isLiked: !isLiked,
          likes: isLiked ? updatedList[currentIndex].likes - 1 : updatedList[currentIndex].likes + 1
        }
        this.setData({ videoList: updatedList })
        
        wx.showToast({
          title: isLiked ? '已取消点赞' : '点赞成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: result.message || '操作失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('点赞操作失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  },

  // 收藏事件
  async onCollect(e: WechatMiniprogram.CustomEvent) {
    const { videoId, isCollected } = e.detail
    const { currentIndex, videoList } = this.data

    // 调试日志
    console.log('=== 收藏事件调试 ===')
    console.log('videoId:', videoId)
    console.log('isCollected from event:', isCollected)
    console.log('currentVideo.isCollected:', videoList[currentIndex]?.isCollected)

    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    try {
      let result
      if (isCollected) {
        result = await uncollectVideo(videoId)
      } else {
        result = await collectVideo(videoId)
      }

      if (result.success) {
        // 更新当前视频的收藏状态
        const updatedList = [...videoList]
        updatedList[currentIndex] = {
          ...updatedList[currentIndex],
          isCollected: !isCollected,
          collects: isCollected ? updatedList[currentIndex].collects - 1 : updatedList[currentIndex].collects + 1
        }
        this.setData({ videoList: updatedList })

        wx.showToast({
          title: isCollected ? '已取消收藏' : '收藏成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: result.message || '操作失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  },

  // 评论事件
  onComment(e: WechatMiniprogram.CustomEvent) {
    const { videoId } = e.detail
    
    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    
    // 显示评论弹窗并加载评论列表
    this.setData({
      showCommentPopup: true,
      currentVideoId: videoId,
      comments: [],
      commentPage: 1,
      commentHasMore: true
    })
    
    // 加载评论列表
    this.loadComments()
  },

  // 加载评论列表
  async loadComments() {
    if (this.data.commentLoading || !this.data.commentHasMore) return
    
    this.setData({ commentLoading: true })
    
    try {
      const result = await api.request({
        url: '/interaction/comment/list',
        method: 'GET',
        data: {
          videoId: this.data.currentVideoId,
          page: this.data.commentPage,
          pageSize: this.data.commentPageSize
        }
      })
      
      if (result.code === 200 && result.data) {
        const records = result.data.records || []
        const total = result.data.total || 0
        
        const comments = this.data.commentPage === 1 
          ? records 
          : [...this.data.comments, ...records]
        
        this.setData({
          comments,
          commentHasMore: comments.length < total,
          commentLoading: false
        })
        
        console.log('评论加载成功:', comments.length, '条')
      } else {
        this.setData({ commentLoading: false })
        console.error('加载评论失败:', result.message)
      }
    } catch (error) {
      console.error('加载评论失败:', error)
      this.setData({ commentLoading: false })
    }
  },

  // 关闭评论弹窗
  closeCommentPopup() {
    this.setData({
      showCommentPopup: false,
      currentVideoId: '',
      commentInputValue: '',
      commentSubmitting: false
    })
  },

  // 阻止评论弹窗内容区域的点击事件冒泡（空函数）
  onPopupContentTap() {
    // 空函数，仅用于阻止事件冒泡到遮罩层
  },

  // 评论输入框内容变化
  onCommentInput(e: WechatMiniprogram.Input) {
    this.setData({
      commentInputValue: e.detail.value
    })
  },

  // 提交评论
  async onCommentSubmit() {
    const { commentInputValue, currentVideoId, commentSubmitting } = this.data
    
    // 验证
    if (commentSubmitting) return
    if (!commentInputValue || !commentInputValue.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      })
      return
    }
    
    // 检查登录
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    
    this.setData({ commentSubmitting: true })
    
    try {
      const result = await api.request({
        url: '/interaction/comment',
        method: 'POST',
        data: {
          videoId: currentVideoId,
          content: commentInputValue.trim()
        }
      })
      
      if (result.code === 200) {
        // 清空输入框
        this.setData({
          commentInputValue: '',
          commentSubmitting: false
        })
        
        // 更新评论数
        this.onCommentSuccess()
        
        wx.showToast({
          title: '评论成功，等待审核',
          icon: 'success'
        })
      } else {
        this.setData({ commentSubmitting: false })
        wx.showToast({
          title: result.message || '评论失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('评论失败:', error)
      this.setData({ commentSubmitting: false })
      wx.showToast({
        title: '评论失败',
        icon: 'none'
      })
    }
  },

  // 评论发布成功后的回调
  onCommentSuccess() {
    const { currentIndex, videoList } = this.data
    
    // 更新评论数
    const updatedList = [...videoList]
    updatedList[currentIndex] = {
      ...updatedList[currentIndex],
      comments: updatedList[currentIndex].comments + 1
    }
    this.setData({ videoList: updatedList })
    
    wx.showToast({
      title: '评论成功',
      icon: 'success'
    })
  },

  // 分享事件 - 显示分享选择弹窗
  onShare(e: WechatMiniprogram.CustomEvent) {
    const { videoId } = e.detail
    
    // 显示分享选择弹窗
    this.setData({
      showSharePopup: true,
      shareVideoId: videoId
    })
    
    console.log('显示分享弹窗, videoId:', videoId)
  },

  // 关闭分享弹窗
  closeSharePopup() {
    this.setData({
      showSharePopup: false,
      shareVideoId: ''
    })
  },

  // 分享到朋友圈
  shareToTimeline() {
    // 关闭弹窗
    this.closeSharePopup()
    
    // 提示用户通过右上角分享到朋友圈
    wx.showModal({
      title: '分享到朋友圈',
      content: '请点击右上角「...」按钮，选择「分享到朋友圈」',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 页面分享配置
  onShareAppMessage() {
    const { currentIndex, videoList } = this.data
    const video = videoList[currentIndex]

    return {
      title: video.title || '精彩烟花视频',
      path: `/pages/community/feed?id=${video.id}`,
      imageUrl: video.coverUrl
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { currentIndex, videoList } = this.data
    const video = videoList[currentIndex]

    return {
      title: video.title || '精彩烟花视频',
      query: `id=${video.id}`,
      imageUrl: video.coverUrl
    }
  }
})
