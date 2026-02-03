# 互动按钮栏组件 (interaction-bar)

## 概述

互动按钮栏组件提供视频互动功能，包括点赞、收藏、评论和分享。支持横向和纵向两种布局方式，适用于不同的页面场景。

## 功能特性

- ✅ 点赞功能（带动画效果）
- ✅ 收藏功能
- ✅ 评论功能
- ✅ 分享功能
- ✅ 数字格式化显示（1234 → 1.2k）
- ✅ 横向/纵向布局切换
- ✅ 状态管理（已点赞/已收藏）

## 使用方法

### 1. 在页面 JSON 中引入组件

```json
{
  "usingComponents": {
    "interaction-bar": "/components/interaction-bar/interaction-bar"
  }
}
```

### 2. 在页面 WXML 中使用组件

```xml
<!-- 横向布局（默认） -->
<interaction-bar
  videoId="{{video.id}}"
  likes="{{video.likes}}"
  collects="{{video.collects}}"
  comments="{{video.comments}}"
  shares="{{video.shares}}"
  isLiked="{{video.isLiked}}"
  isCollected="{{video.isCollected}}"
  layout="horizontal"
  bind:like="onLike"
  bind:collect="onCollect"
  bind:comment="onComment"
  bind:share="onShare"
/>

<!-- 纵向布局（信息流模式） -->
<interaction-bar
  videoId="{{video.id}}"
  likes="{{video.likes}}"
  collects="{{video.collects}}"
  comments="{{video.comments}}"
  shares="{{video.shares}}"
  isLiked="{{video.isLiked}}"
  isCollected="{{video.isCollected}}"
  layout="vertical"
  bind:like="onLike"
  bind:collect="onCollect"
  bind:comment="onComment"
  bind:share="onShare"
/>
```

### 3. 在页面 TS 中处理事件

```typescript
Page({
  data: {
    video: {
      id: 1,
      likes: 1234,
      collects: 567,
      comments: 89,
      shares: 12,
      isLiked: false,
      isCollected: false
    }
  },

  // 点赞事件
  onLike(e: any) {
    const { videoId, isLiked } = e.detail;
    
    if (isLiked) {
      // 取消点赞
      this.unlikeVideo(videoId);
    } else {
      // 点赞
      this.likeVideo(videoId);
    }
  },

  // 收藏事件
  onCollect(e: any) {
    const { videoId, isCollected } = e.detail;
    
    if (isCollected) {
      // 取消收藏
      this.uncollectVideo(videoId);
    } else {
      // 收藏
      this.collectVideo(videoId);
    }
  },

  // 评论事件
  onComment(e: any) {
    const { videoId } = e.detail;
    
    // 显示评论列表或输入框
    this.showCommentList(videoId);
  },

  // 分享事件
  onShare(e: any) {
    const { videoId } = e.detail;
    
    // 触发分享
    wx.showShareMenu({
      withShareTicket: true
    });
  }
});
```

## 属性说明

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| videoId | Number | 0 | 是 | 视频ID |
| likes | Number | 0 | 否 | 点赞数 |
| collects | Number | 0 | 否 | 收藏数 |
| comments | Number | 0 | 否 | 评论数 |
| shares | Number | 0 | 否 | 分享数 |
| isLiked | Boolean | false | 否 | 是否已点赞 |
| isCollected | Boolean | false | 否 | 是否已收藏 |
| layout | String | 'horizontal' | 否 | 布局方式：horizontal（横向）或 vertical（纵向） |

## 事件说明

| 事件名 | 说明 | 返回参数 |
|--------|------|----------|
| like | 点赞按钮点击 | { videoId, isLiked } |
| collect | 收藏按钮点击 | { videoId, isCollected } |
| comment | 评论按钮点击 | { videoId } |
| share | 分享按钮点击 | { videoId } |

## 布局模式

### 横向布局 (horizontal)

适用于视频详情页、列表页等场景，按钮横向排列。

```
[❤️ 123] [⭐ 45] [💬 67] [↗️ 8]
```

### 纵向布局 (vertical)

适用于信息流页面，按钮纵向排列在视频右侧。

```
[❤️]
123

[⭐]
45

[💬]
67

[↗️]
8
```

## 动画效果

### 点赞动画

当用户点击点赞按钮时，会触发一个弹跳动画效果，增强交互反馈。动画持续 600ms。

## 数字格式化

组件会自动格式化大数字：

- 小于 1000：显示原数字（如 123）
- 1000-9999：显示 k 单位（如 1.2k）
- 10000 及以上：显示 w 单位（如 1.2w）

## 图标资源

组件使用以下图标资源：

- 点赞未选中：`/assets/icons/视频点赞-0.png` (590字节)
- 点赞已选中：`/assets/icons/视频点赞-1.png` (803字节)
- 收藏未选中：`/assets/icons/heart-gray.png`
- 收藏已选中：`/assets/icons/heart-pink.png`
- 评论：`/assets/icons/comment.png`
- 分享：`/assets/icons/share.png`

**注意**：点赞图标使用专门的视频点赞图标，来自正攀烟花切图资源。

## 样式定制

可以通过外部样式类覆盖组件样式：

```css
/* 修改按钮间距 */
.interaction-bar {
  gap: 40rpx !important;
}

/* 修改图标大小 */
.icon-wrapper {
  width: 60rpx !important;
  height: 60rpx !important;
}

/* 修改数字颜色 */
.count {
  color: #333 !important;
}
```

## 注意事项

1. 确保传入正确的 videoId，用于后续 API 调用
2. 点赞和收藏状态需要从后端获取并同步
3. 分享功能需要配合小程序的分享 API 使用
4. 建议在事件处理中添加登录状态检查

## 相关需求

- 需求 6：点赞和收藏功能
- 需求 7：评论功能
- 需求 8：转发分享功能
