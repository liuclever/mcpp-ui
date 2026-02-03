// components/comment-input/comment-input.ts

/**
 * 评论输入组件
 * 支持发表评论、回复评论、字数统计和@回复功能
 */

interface Comment {
  id: number
  userId: number
  userName: string
  content: string
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
    // 父评论ID（回复评论时使用）
    parentId: {
      type: String,  // 改为String
      value: '',
      optionalTypes: [null]
    },
    // 回复目标用户ID
    replyToId: {
      type: Number,
      value: 0,
      optionalTypes: [null]
    },
    // 回复目标用户名（用于@显示）
    replyToName: {
      type: String,
      value: ''
    },
    // 占位符文本
    placeholder: {
      type: String,
      value: '发表评论...'
    },
    // 是否显示输入框
    show: {
      type: Boolean,
      value: false
    },
    // 是否自动聚焦
    autoFocus: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 评论内容
    content: '',
    // 字数统计
    charCount: 0,
    // 最大字数
    maxLength: 200,
    // 是否正在提交
    submitting: false,
    // 是否聚焦
    focused: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 阻止事件冒泡（空函数）
     */
    onWrapperTap() {
      // 空函数，仅用于阻止事件冒泡到遮罩层
    },

    /**
     * 输入框内容变化
     * @param e 事件对象
     */
    onInput(e: any) {
      const content = e.detail.value;
      const charCount = content.length;
      
      this.setData({
        content,
        charCount
      });
    },

    /**
     * 输入框获得焦点
     */
    onFocus() {
      this.setData({
        focused: true
      });
    },

    /**
     * 输入框失去焦点
     */
    onBlur() {
      this.setData({
        focused: false
      });
    },

    /**
     * 提交评论
     */
    onSubmit() {
      const { content, submitting, maxLength } = this.data;
      const { videoId, parentId, replyToId } = this.properties;

      // 验证是否正在提交
      if (submitting) {
        return;
      }

      // 验证内容不能为空
      const trimmedContent = content.trim();
      if (!trimmedContent) {
        wx.showToast({
          title: '请输入评论内容',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 验证字数限制
      if (trimmedContent.length > maxLength) {
        wx.showToast({
          title: `评论不能超过${maxLength}字`,
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 设置提交状态
      this.setData({
        submitting: true
      });

      // 触发提交事件
      this.triggerEvent('submit', {
        videoId,
        content: trimmedContent,
        parentId: parentId || null,
        replyToId: replyToId || null
      });

      // 提交后清空内容（由父组件控制是否成功）
      // 这里不清空，等待父组件调用 reset 方法
    },

    /**
     * 取消评论
     */
    onCancel() {
      // 清空内容
      this.setData({
        content: '',
        charCount: 0,
        focused: false
      });

      // 触发取消事件
      this.triggerEvent('cancel');
    },

    /**
     * 重置输入框（提交成功后由父组件调用）
     */
    reset() {
      this.setData({
        content: '',
        charCount: 0,
        submitting: false,
        focused: false
      });
    },

    /**
     * 设置提交状态（由父组件调用）
     * @param submitting 是否正在提交
     */
    setSubmitting(submitting: boolean) {
      this.setData({
        submitting
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
      this.setData({
        content: '',
        charCount: 0,
        submitting: false,
        focused: false
      });
    }
  },

  /**
   * 监听属性变化
   */
  observers: {
    'show': function(show: boolean) {
      // 当显示状态变化时，如果是显示且需要自动聚焦，则聚焦
      if (show && this.properties.autoFocus) {
        // 延迟聚焦，确保输入框已渲染
        setTimeout(() => {
          this.setData({
            focused: true
          });
        }, 100);
      }
    },
    'replyToName': function(replyToName: string) {
      // 当回复目标用户名变化时，更新占位符
      if (replyToName) {
        this.setData({
          placeholder: `回复 @${replyToName}`
        });
      } else {
        this.setData({
          placeholder: '发表评论...'
        });
      }
    }
  }
});
