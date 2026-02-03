# Comment Input Component (评论输入组件)

## 概述

评论输入组件用于发表评论和回复评论，支持字数统计、@回复功能和输入验证。

## 功能特性

- ✅ 评论输入框
- ✅ 字数统计（最多200字）
- ✅ @回复功能
- ✅ 提交和取消按钮
- ✅ 输入验证
- ✅ 加载状态显示
- ✅ 自动聚焦
- ✅ 遮罩层交互

## 使用方法

### 1. 在页面JSON中引入组件

```json
{
  "usingComponents": {
    "comment-input": "/components/comment-input/comment-input"
  }
}
```

### 2. 在页面WXML中使用组件

```xml
<!-- 发表评论 -->
<comment-input
  videoId="{{videoId}}"
  show="{{showCommentInput}}"
  autoFocus="{{true}}"
  bind:submit="onCommentSubmit"
  bind:cancel="onCommentCancel"
/>

<!-- 回复评论 -->
<comment-input
  videoId="{{videoId}}"
  parentId="{{replyComment.id}}"
  replyToId="{{replyComment.userId}}"
  replyToName="{{replyComment.userName}}"
  show="{{showReplyInput}}"
  autoFocus="{{true}}"
  bind:submit="onReplySubmit"
  bind:cancel="onReplyCancel"
/>
```

### 3. 在页面TS中处理事件

```typescript
Page({
  data: {
    videoId: 1,
    showCommentInput: false,
    showReplyInput: false,
    replyComment: null
  },

  // 显示评论输入框
  showCommentInput() {
    this.setData({
      showCommentInput: true
    });
  },

  // 显示回复输入框
  showReplyInput(comment: any) {
    this.setData({
      showReplyInput: true,
      replyComment: comment
    });
  },

  // 提交评论
  onCommentSubmit(e: any) {
    const { videoId, content } = e.detail;
    
    // 调用API提交评论
    wx.request({
      url: 'https://api.example.com/comment',
      method: 'POST',
      data: {
        videoId,
        content
      },
      success: (res) => {
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        });
        
        // 重置输入框
        const commentInput = this.selectComponent('#commentInput');
        commentInput.reset();
        
        // 隐藏输入框
        this.setData({
          showCommentInput: false
        });
        
        // 刷新评论列表
        this.loadComments();
      },
      fail: () => {
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        });
        
        // 重置提交状态
        const commentInput = this.selectComponent('#commentInput');
        commentInput.setSubmitting(false);
      }
    });
  },

  // 提交回复
  onReplySubmit(e: any) {
    const { videoId, content, parentId, replyToId } = e.detail;
    
    // 调用API提交回复
    wx.request({
      url: 'https://api.example.com/comment',
      method: 'POST',
      data: {
        videoId,
        content,
        parentId,
        replyToId
      },
      success: (res) => {
        wx.showToast({
          title: '回复成功',
          icon: 'success'
        });
        
        // 重置输入框
        const replyInput = this.selectComponent('#replyInput');
        replyInput.reset();
        
        // 隐藏输入框
        this.setData({
          showReplyInput: false,
          replyComment: null
        });
        
        // 刷新评论列表
        this.loadComments();
      },
      fail: () => {
        wx.showToast({
          title: '回复失败',
          icon: 'none'
        });
        
        // 重置提交状态
        const replyInput = this.selectComponent('#replyInput');
        replyInput.setSubmitting(false);
      }
    });
  },

  // 取消评论
  onCommentCancel() {
    this.setData({
      showCommentInput: false
    });
  },

  // 取消回复
  onReplyCancel() {
    this.setData({
      showReplyInput: false,
      replyComment: null
    });
  }
});
```

## 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| videoId | Number | 0 | 是 | 视频ID |
| parentId | Number | 0 | 否 | 父评论ID（回复评论时使用） |
| replyToId | Number | 0 | 否 | 回复目标用户ID |
| replyToName | String | '' | 否 | 回复目标用户名（用于@显示） |
| placeholder | String | '发表评论...' | 否 | 占位符文本 |
| show | Boolean | false | 是 | 是否显示输入框 |
| autoFocus | Boolean | false | 否 | 是否自动聚焦 |

## 事件 (Events)

| 事件名 | 说明 | 返回参数 |
|--------|------|----------|
| submit | 提交评论 | { videoId, content, parentId, replyToId } |
| cancel | 取消评论 | - |

## 方法 (Methods)

组件提供以下方法供父组件调用：

### reset()

重置输入框（提交成功后调用）

```typescript
const commentInput = this.selectComponent('#commentInput');
commentInput.reset();
```

### setSubmitting(submitting: boolean)

设置提交状态（提交失败后调用）

```typescript
const commentInput = this.selectComponent('#commentInput');
commentInput.setSubmitting(false);
```

## 数据验证

组件内置以下验证规则：

1. **内容不能为空**：提交时会自动trim并验证
2. **字数限制**：最多200字，超出会提示
3. **防重复提交**：提交中禁用按钮

## 样式定制

组件使用的主要颜色变量：

- 主色调：`#ff6b9d`（粉色）
- 背景色：`#ffffff`（白色）
- 输入框背景：`#f8f8f8`（浅灰）
- 文字颜色：`#333333`（深灰）
- 占位符颜色：`#999999`（中灰）

可以通过修改 `comment-input.wxss` 文件来自定义样式。

## 注意事项

1. **显示控制**：通过 `show` 属性控制组件显示/隐藏
2. **提交处理**：父组件需要处理 `submit` 事件并调用API
3. **状态重置**：提交成功后需要调用 `reset()` 方法
4. **错误处理**：提交失败后需要调用 `setSubmitting(false)` 恢复状态
5. **回复功能**：回复评论时需要传入 `parentId`、`replyToId` 和 `replyToName`
6. **自动聚焦**：设置 `autoFocus="{{true}}"` 可以在显示时自动聚焦

## 完整示例

```xml
<!-- page.wxml -->
<view class="page">
  <!-- 评论列表 -->
  <comment-list
    videoId="{{videoId}}"
    comments="{{comments}}"
    bind:reply="onReply"
  />
  
  <!-- 发表评论按钮 -->
  <button bindtap="showCommentInput">发表评论</button>
  
  <!-- 评论输入组件 -->
  <comment-input
    id="commentInput"
    videoId="{{videoId}}"
    show="{{showCommentInput}}"
    autoFocus="{{true}}"
    bind:submit="onCommentSubmit"
    bind:cancel="onCommentCancel"
  />
  
  <!-- 回复输入组件 -->
  <comment-input
    id="replyInput"
    videoId="{{videoId}}"
    parentId="{{replyComment.id}}"
    replyToId="{{replyComment.userId}}"
    replyToName="{{replyComment.userName}}"
    show="{{showReplyInput}}"
    autoFocus="{{true}}"
    bind:submit="onReplySubmit"
    bind:cancel="onReplyCancel"
  />
</view>
```

## 更新日志

### v1.0.0 (2026-01-02)

- ✅ 初始版本
- ✅ 实现评论输入功能
- ✅ 实现字数统计
- ✅ 实现@回复功能
- ✅ 实现提交和取消按钮
- ✅ 实现输入验证
- ✅ 实现加载状态
