// components/comment-list/comment-list.ts

/**
 * 评论列表组件
 * 展示视频评论，支持父子评论层级显示和分页加载
 */

interface Comment {
  id: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  parentId: number | null
  replyToId: number | null
  replyToName?: string
  likes: number
  createTime: string
  children?: Comment[]  // 子评论列表
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 视频ID
    videoId: {
      type: String,  // 改为String避免精度丢失
      value: ''
    },
    // 评论列表
    comments: {
      type: Array,
      value: []
    },
    // 是否有更多评论
    hasMore: {
      type: Boolean,
      value: false
    },
    // 是否正在加载
    loading: {
      type: Boolean,
      value: false
    },
    // 是否显示空状态
    showEmpty: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点赞评论
     * @param e 事件对象
     */
    onLikeTap(e: any) {
      const { comment } = e.currentTarget.dataset;
      
      // 触发父组件的点赞事件
      this.triggerEvent('likeComment', {
        comment: comment
      });
    },

    /**
     * 回复评论
     * @param e 事件对象
     */
    onReplyTap(e: any) {
      const { comment } = e.currentTarget.dataset;
      
      // 触发父组件的回复事件
      this.triggerEvent('replyComment', {
        comment: comment
      });
    },

    /**
     * 加载更多评论
     */
    onLoadMore() {
      if (this.data.loading || !this.data.hasMore) {
        return;
      }
      
      // 触发父组件的加载更多事件
      this.triggerEvent('loadMore', {
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
