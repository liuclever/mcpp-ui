// components/interaction-bar/interaction-bar.ts

/**
 * 互动按钮栏组件
 * 提供点赞、收藏、评论、分享功能
 */

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 视频ID - 改为String避免精度丢失
    videoId: {
      type: String,
      value: ''
    },
    // 点赞数
    likes: {
      type: Number,
      value: 0
    },
    // 收藏数
    collects: {
      type: Number,
      value: 0
    },
    // 评论数
    comments: {
      type: Number,
      value: 0
    },
    // 分享数
    shares: {
      type: Number,
      value: 0
    },
    // 是否已点赞
    isLiked: {
      type: Boolean,
      value: false
    },
    // 是否已收藏
    isCollected: {
      type: Boolean,
      value: false
    },
    // 布局方式: horizontal | vertical
    layout: {
      type: String,
      value: 'horizontal'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    likeAnimating: false  // 点赞动画状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 格式化数字显示
     * @param num 数字
     * @returns 格式化后的字符串
     */
    formatNumber(num: number): string {
      if (!num || num === 0) {
        return '0';
      }
      
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num.toString();
    },

    /**
     * 点赞按钮点击事件
     */
    onLikeTap() {
      // 调试日志
      console.log('=== interaction-bar 点赞按钮点击 ===')
      console.log('videoId:', this.properties.videoId, 'type:', typeof this.properties.videoId)
      console.log('isLiked:', this.properties.isLiked)
      
      // 触发点赞动画
      if (!this.data.isLiked) {
        this.setData({
          likeAnimating: true
        });

        // 动画结束后重置状态
        setTimeout(() => {
          this.setData({
            likeAnimating: false
          });
        }, 600);
      }

      // 触发父组件的点赞事件
      this.triggerEvent('like', {
        videoId: this.properties.videoId,
        isLiked: this.properties.isLiked
      });
    },

    /**
     * 收藏按钮点击事件
     */
    onCollectTap() {
      // 触发父组件的收藏事件
      this.triggerEvent('collect', {
        videoId: this.properties.videoId,
        isCollected: this.properties.isCollected
      });
    },

    /**
     * 评论按钮点击事件
     */
    onCommentTap() {
      // 触发父组件的评论事件
      this.triggerEvent('comment', {
        videoId: this.properties.videoId
      });
    },

    /**
     * 分享按钮点击事件
     */
    onShareTap() {
      // 触发父组件的分享事件
      this.triggerEvent('share', {
        videoId: this.properties.videoId
      });
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 组件实例被放入页面节点树时执行
    },
    
    detached() {
      // 组件实例被从页面节点树移除时执行
    }
  }
});
