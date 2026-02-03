# 评论列表组件 (comment-list)

## 概述

评论列表组件用于展示视频评论，支持父子评论层级显示、评论回复、评论点赞和分页加载功能。

## 功能特性

- ✅ 评论列表展示
- ✅ 父子评论层级显示（支持展开/收起）
- ✅ 回复按钮
- ✅ 评论点赞
- ✅ 分页加载
- ✅ 空状态显示
- ✅ 时间格式化显示
- ✅ 数字格式化显示

## 使用方法

### 1. 在页面 JSON 中引入组件

```json
{
  "usingComponents": {
    "comment-list": "/components/comment-list/comment-list"
  }
}
```

### 2. 在页面 WXML 中使用组件

```xml
<comment-list
  videoId="{{videoId}}"
  comments="{{comments}}"
  hasMore="{{hasMore}}"
  loading="{{loading}}"
  showEmpty="{{showEmpty}}"
  bind:reply="onReply"
  bind:likeComment="onLikeComment"
  bind:loadMore="onLoadMore"
/>
```

### 3. 在页面 TS 中处理事件

```typescript
Page({
  data: {
    videoId: 1,
    comments: [],
    hasMore: true,
    loading: false,
    showEmpty: false
  },

  // 回复评论
  onReply(e: any) {
    const { comment } = e.detail;
    console.log('回复评论:', comment);
    // 显示评论输入框，设置回复对象
  },

  // 点赞评论
  onLikeComment(e: any) {
    const { comment } = e.detail;
    console.log('点赞评论:', comment);
    // 调用点赞API
  },

  // 加载更多评论
  onLoadMore(e: any) {
    const { videoId } = e.detail;
    console.log('加载更多评论:', videoId);
    // 调用API加载更多评论
  }
})
```

## 属性说明

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| videoId | Number | 0 | 是 | 视频ID |
| comments | Array | [] | 是 | 评论列表数据 |
| hasMore | Boolean | false | 否 | 是否有更多评论 |
| loading | Boolean | false | 否 | 是否正在加载 |
| showEmpty | Boolean | false | 否 | 是否显示空状态 |

## 事件说明

| 事件名 | 说明 | 返回参数 |
|--------|------|----------|
| reply | 点击回复按钮时触发 | { comment: Comment } |
| likeComment | 点击点赞按钮时触发 | { comment: Comment } |
| loadMore | 点击加载更多时触发 | { videoId: number } |

## 数据结构

### Comment 接口

```typescript
interface Comment {
  id: number              // 评论ID
  userId: number          // 用户ID
  userName: string        // 用户名
  userAvatar: string      // 用户头像URL
  content: string         // 评论内容
  parentId: number | null // 父评论ID（null表示顶级评论）
  replyToId: number | null // 回复的评论ID
  replyToName?: string    // 回复的用户名
  likes: number           // 点赞数
  isLiked?: boolean       // 是否已点赞
  createTime: string      // 创建时间
  children?: Comment[]    // 子评论列表
}
```

## 样式定制

组件使用了标准的 WXSS 样式，可以通过以下方式进行定制：

1. 修改 `comment-list.wxss` 文件中的样式变量
2. 在父页面中使用 `::v-deep` 或 `/deep/` 选择器覆盖样式

## 注意事项

1. **评论层级**：组件支持两级评论（父评论和子评论），子评论会显示在父评论下方
2. **展开/收起**：当父评论有子评论时，会显示展开/收起按钮
3. **时间格式化**：自动将时间格式化为"刚刚"、"X分钟前"、"X小时前"等
4. **数字格式化**：自动将大数字格式化为"1.2k"、"3.4w"等
5. **空状态**：当 `showEmpty` 为 true 且评论列表为空时，会显示空状态提示
6. **分页加载**：当 `hasMore` 为 true 时，会显示"加载更多"按钮

## 示例数据

```typescript
const comments = [
  {
    id: 1,
    userId: 101,
    userName: '张三',
    userAvatar: 'https://example.com/avatar1.jpg',
    content: '这个烟花太漂亮了！',
    parentId: null,
    replyToId: null,
    likes: 123,
    isLiked: false,
    createTime: '2024-01-01 12:00:00',
    children: [
      {
        id: 2,
        userId: 102,
        userName: '李四',
        userAvatar: 'https://example.com/avatar2.jpg',
        content: '确实很美！',
        parentId: 1,
        replyToId: 1,
        replyToName: '张三',
        likes: 45,
        isLiked: true,
        createTime: '2024-01-01 12:05:00'
      }
    ]
  }
];
```

## 版本历史

- v1.0.0 (2024-01-02)
  - 初始版本
  - 实现评论列表展示
  - 实现父子评论层级显示
  - 实现回复和点赞功能
  - 实现分页加载
