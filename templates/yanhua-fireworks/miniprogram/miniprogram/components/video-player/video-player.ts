// components/video-player/video-player.ts

/**
 * 视频播放器组件
 * 封装微信小程序video组件，提供播放控制和状态管理
 */

// 存储视频上下文的Map，使用组件实例作为key
const videoContextMap = new WeakMap<any, WechatMiniprogram.VideoContext>();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 视频URL
    videoUrl: {
      type: String,
      value: ''
    },
    // 封面图URL
    coverUrl: {
      type: String,
      value: ''
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      value: false
    },
    // 是否循环播放
    loop: {
      type: Boolean,
      value: false
    },
    // 是否显示默认控制栏
    controls: {
      type: Boolean,
      value: true
    },
    // 是否显示中间播放按钮
    showCenterPlayBtn: {
      type: Boolean,
      value: true
    },
    // 是否显示底部播放按钮
    showPlayBtn: {
      type: Boolean,
      value: true
    },
    // 是否启用手势控制进度
    enableProgressGesture: {
      type: Boolean,
      value: true
    },
    // 视频填充模式 contain | fill | cover
    objectFit: {
      type: String,
      value: 'contain'
    },
    // 是否显示自定义播放按钮
    showCustomPlayBtn: {
      type: Boolean,
      value: false
    },
    // 播放器ID（用于多个播放器实例）
    playerId: {
      type: String,
      value: 'default'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlaying: false,      // 是否正在播放
    isLoading: false,      // 是否正在加载
    currentTime: 0,        // 当前播放时间
    duration: 0            // 视频总时长
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取视频上下文对象
     */
    getVideoContext() {
      let ctx = videoContextMap.get(this);
      if (!ctx) {
        const videoId = `video-player-${this.data.playerId}`;
        ctx = wx.createVideoContext(videoId, this);
        videoContextMap.set(this, ctx);
      }
      return ctx;
    },

    /**
     * 播放视频
     */
    play() {
      const ctx = this.getVideoContext();
      ctx.play();
    },

    /**
     * 暂停视频
     */
    pause() {
      const ctx = this.getVideoContext();
      ctx.pause();
    },

    /**
     * 停止视频
     */
    stop() {
      const ctx = this.getVideoContext();
      ctx.stop();
    },

    /**
     * 跳转到指定位置
     * @param position 位置（秒）
     */
    seek(position: number) {
      const ctx = this.getVideoContext();
      ctx.seek(position);
    },

    /**
     * 切换播放/暂停
     */
    togglePlay() {
      if (this.data.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    /**
     * 请求全屏
     * @param direction 0-正常竖向, 90-屏幕逆时针90度, -90-屏幕顺时针90度
     */
    requestFullScreen(direction: 0 | 90 | -90 = 0) {
      const ctx = this.getVideoContext();
      ctx.requestFullScreen({ direction });
    },

    /**
     * 退出全屏
     */
    exitFullScreen() {
      const ctx = this.getVideoContext();
      ctx.exitFullScreen();
    },

    /**
     * 发送弹幕
     * @param text 弹幕文本
     * @param color 弹幕颜色
     */
    sendDanmu(text: string, color: string = '#ffffff') {
      const ctx = this.getVideoContext();
      ctx.sendDanmu({
        text,
        color
      });
    },

    /**
     * 设置播放速率
     * @param rate 播放速率 0.5/0.8/1.0/1.25/1.5
     */
    playbackRate(rate: number) {
      const ctx = this.getVideoContext();
      ctx.playbackRate(rate);
    },

    /**
     * 播放事件
     */
    onPlay() {
      this.setData({
        isPlaying: true,
        isLoading: false
      });
      
      // 触发父组件的播放回调
      this.triggerEvent('play', {
        currentTime: this.data.currentTime
      });
    },

    /**
     * 暂停事件
     */
    onPause() {
      this.setData({
        isPlaying: false
      });
      
      // 触发父组件的暂停回调
      this.triggerEvent('pause', {
        currentTime: this.data.currentTime
      });
    },

    /**
     * 播放结束事件
     */
    onEnded() {
      this.setData({
        isPlaying: false
      });
      
      // 触发父组件的结束回调
      this.triggerEvent('ended', {
        duration: this.data.duration
      });
    },

    /**
     * 错误事件
     */
    onError(e: any) {
      console.error('视频播放错误:', e.detail);
      
      this.setData({
        isPlaying: false,
        isLoading: false
      });
      
      // 触发父组件的错误回调
      this.triggerEvent('error', {
        errMsg: e.detail.errMsg
      });
    },

    /**
     * 播放进度更新事件
     */
    onTimeUpdate(e: any) {
      const { currentTime, duration } = e.detail;
      
      this.setData({
        currentTime,
        duration
      });
      
      // 触发父组件的进度更新回调
      this.triggerEvent('timeupdate', {
        currentTime,
        duration,
        progress: duration > 0 ? currentTime / duration : 0
      });
    },

    /**
     * 视频缓冲事件
     */
    onWaiting() {
      this.setData({
        isLoading: true
      });
      
      // 触发父组件的缓冲回调
      this.triggerEvent('waiting', {});
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
      // 清理视频上下文
      const ctx = videoContextMap.get(this);
      if (ctx) {
        this.stop();
        videoContextMap.delete(this);
      }
    }
  },

  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show() {
      // 页面被展示时执行
    },
    
    hide() {
      // 页面被隐藏时执行
      // 暂停视频播放
      if (this.data.isPlaying) {
        this.pause();
      }
    }
  }
});
