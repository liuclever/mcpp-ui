// pages/test-interaction/test-interaction.ts

Page({
  data: {
    // 测试视频1 - 普通数据
    video1: {
      likes: 123,
      collects: 45,
      comments: 67,
      shares: 8,
      isLiked: false,
      isCollected: false
    },
    // 测试视频2 - 已点赞已收藏
    video2: {
      likes: 456,
      collects: 89,
      comments: 12,
      shares: 3,
      isLiked: true,
      isCollected: true
    },
    // 测试视频3 - 大数字
    video3: {
      likes: 12345,
      collects: 6789,
      comments: 234,
      shares: 56,
      isLiked: false,
      isCollected: false
    },
    logs: [] as string[]
  },

  onLoad() {
    this.addLog('页面加载完成');
  },

  /**
   * 添加日志
   */
  addLog(message: string) {
    const time = new Date().toLocaleTimeString();
    const logs = this.data.logs;
    logs.unshift(`[${time}] ${message}`);
    
    // 只保留最近20条日志
    if (logs.length > 20) {
      logs.pop();
    }
    
    this.setData({ logs });
  },

  /**
   * 点赞事件处理
   */
  onLike(e: any) {
    const { videoId, isLiked } = e.detail;
    const videoKey = `video${videoId}`;
    const video = this.data[videoKey as keyof typeof this.data] as any;
    
    if (!video) return;

    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? video.likes + 1 : video.likes - 1;

    this.setData({
      [`${videoKey}.isLiked`]: newIsLiked,
      [`${videoKey}.likes`]: newLikes
    });

    this.addLog(`视频${videoId}: ${newIsLiked ? '点赞' : '取消点赞'} (${newLikes})`);

    // 模拟API调用
    wx.showToast({
      title: newIsLiked ? '点赞成功' : '取消点赞',
      icon: 'success',
      duration: 1500
    });
  },

  /**
   * 收藏事件处理
   */
  onCollect(e: any) {
    const { videoId, isCollected } = e.detail;
    const videoKey = `video${videoId}`;
    const video = this.data[videoKey as keyof typeof this.data] as any;
    
    if (!video) return;

    const newIsCollected = !isCollected;
    const newCollects = newIsCollected ? video.collects + 1 : video.collects - 1;

    this.setData({
      [`${videoKey}.isCollected`]: newIsCollected,
      [`${videoKey}.collects`]: newCollects
    });

    this.addLog(`视频${videoId}: ${newIsCollected ? '收藏' : '取消收藏'} (${newCollects})`);

    // 模拟API调用
    wx.showToast({
      title: newIsCollected ? '收藏成功' : '取消收藏',
      icon: 'success',
      duration: 1500
    });
  },

  /**
   * 评论事件处理
   */
  onComment(e: any) {
    const { videoId } = e.detail;
    
    this.addLog(`视频${videoId}: 点击评论按钮`);

    wx.showModal({
      title: '评论功能',
      content: `打开视频${videoId}的评论列表`,
      showCancel: false
    });
  },

  /**
   * 分享事件处理
   */
  onShare(e: any) {
    const { videoId } = e.detail;
    const videoKey = `video${videoId}`;
    const video = this.data[videoKey as keyof typeof this.data] as any;
    
    if (!video) return;

    const newShares = video.shares + 1;

    this.setData({
      [`${videoKey}.shares`]: newShares
    });

    this.addLog(`视频${videoId}: 点击分享按钮 (${newShares})`);

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.showToast({
      title: '分享功能已触发',
      icon: 'success',
      duration: 1500
    });
  },

  /**
   * 重置数据
   */
  resetData() {
    this.setData({
      video1: {
        likes: 123,
        collects: 45,
        comments: 67,
        shares: 8,
        isLiked: false,
        isCollected: false
      },
      video2: {
        likes: 456,
        collects: 89,
        comments: 12,
        shares: 3,
        isLiked: true,
        isCollected: true
      },
      video3: {
        likes: 12345,
        collects: 6789,
        comments: 234,
        shares: 56,
        isLiked: false,
        isCollected: false
      },
      logs: []
    });

    this.addLog('数据已重置');

    wx.showToast({
      title: '数据已重置',
      icon: 'success'
    });
  },

  /**
   * 分享配置
   */
  onShareAppMessage() {
    return {
      title: '互动按钮组件测试',
      path: '/pages/test-interaction/test-interaction'
    };
  }
});
