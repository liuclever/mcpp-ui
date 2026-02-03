# API工具函数实现说明

## 概述

本文档说明UGC小程序端API工具函数的实现，包括基础请求封装、视频API、互动API和用户API。

## 实现文件

### 1. utils/api.ts - 基础请求封装

**功能特性：**

✅ **请求拦截器**
- 自动添加Authorization Token到请求头
- 设置默认Content-Type为application/json
- 配置请求超时时间（10秒）

✅ **响应拦截器**
- 统一处理成功响应（code=200）
- 自动处理Token过期（code=401）
- 统一错误提示和错误处理

✅ **Token自动刷新**
- 检测到401错误时自动刷新Token
- 使用refreshToken获取新Token
- 刷新成功后自动重试原请求
- 支持并发请求的Token刷新队列
- 刷新失败时清除登录信息

✅ **请求超时处理**
- 默认超时时间10秒
- 超时时显示友好提示
- 支持自定义超时时间

✅ **GET请求参数处理**
- 自动将参数拼接到URL
- 过滤空值参数
- URL编码处理

**核心函数：**
```typescript
request<T>(options: RequestOptions): Promise<ApiResponse<T>>
```

---

### 2. utils/video-api.ts - 视频相关API

**实现接口：**

✅ **getVideoList** - 获取视频列表
- 支持分页查询
- 支持按状态筛选（待审核/已通过/未通过）
- 支持按用户ID筛选
- 对应需求：2 - 视频列表展示

✅ **getVideoDetail** - 获取视频详情
- 根据视频ID获取完整信息
- 包含用户信息、统计数据、互动状态
- 对应需求：5 - 视频详情页

✅ **uploadVideo** - 上传视频
- 使用wx.uploadFile上传文件
- 支持上传进度回调
- 自动添加Token认证
- 上传成功后提示等待审核
- 对应需求：1 - 视频发布功能

✅ **deleteVideo** - 删除视频
- 根据视频ID删除
- 删除成功后显示提示
- 对应需求：11 - 我的发布页面

**数据类型：**
```typescript
interface Video {
  id: number
  title: string
  description: string
  videoUrl: string
  coverUrl: string
  userId: number
  userName: string
  userAvatar: string
  location: string
  views: number
  likes: number
  collects: number
  comments: number
  shares: number
  isLiked: boolean
  isCollected: boolean
  status: number
  rejectReason?: string
  createTime: string
}
```

---

### 3. utils/interaction-api.ts - 互动相关API

**实现接口：**

✅ **likeVideo** - 点赞视频
- 不显示loading（快速响应）
- 对应需求：6 - 点赞和收藏功能

✅ **unlikeVideo** - 取消点赞视频
- 不显示loading（快速响应）
- 对应需求：6 - 点赞和收藏功能

✅ **collectVideo** - 收藏视频
- 收藏成功显示提示
- 对应需求：6 - 点赞和收藏功能

✅ **uncollectVideo** - 取消收藏视频
- 取消成功显示提示
- 对应需求：6 - 点赞和收藏功能

✅ **publishComment** - 发布评论
- 支持顶级评论和回复评论
- 提交成功提示等待审核
- 对应需求：7 - 评论功能

✅ **getCommentList** - 获取评论列表
- 支持分页查询
- 支持查询顶级评论或子评论
- 只返回已审核通过的评论
- 对应需求：7 - 评论功能

✅ **likeComment** - 点赞评论（扩展功能）
- 不显示loading（快速响应）

✅ **unlikeComment** - 取消点赞评论（扩展功能）
- 不显示loading（快速响应）

**数据类型：**
```typescript
interface Comment {
  id: number
  videoId: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  parentId: number | null
  replyToId: number | null
  replyToName?: string
  likes: number
  status: number
  createTime: string
  children?: Comment[]
}
```

---

### 4. utils/user-api.ts - 用户个人内容API

**实现接口：**

✅ **getMyCollectList** - 获取我的收藏列表
- 支持分页查询
- 返回收藏的视频列表
- 对应需求：9 - 我的收藏页面

✅ **getMyLikeList** - 获取我的点赞列表
- 支持分页查询
- 返回点赞的视频列表
- 对应需求：10 - 我的点赞页面

✅ **getMyPublishList** - 获取我的发布列表
- 支持分页查询
- 返回发布的视频列表（包含所有状态）
- 对应需求：11 - 我的发布页面

✅ **getUserInfo** - 获取用户信息
- 获取当前登录用户信息

✅ **updateUserInfo** - 更新用户信息
- 支持更新昵称、头像、手机号
- 更新成功显示提示

---

## 使用示例

### 1. 获取视频列表

```typescript
import { getVideoList } from '../../utils/video-api'

// 获取已通过审核的视频列表
const result = await getVideoList({
  page: 1,
  pageSize: 10,
  status: 1  // 1=已通过
})

console.log(result.records)  // 视频列表
console.log(result.total)    // 总数
```

### 2. 上传视频

```typescript
import { uploadVideo } from '../../utils/video-api'

// 选择视频
wx.chooseVideo({
  success: async (res) => {
    // 上传视频
    const result = await uploadVideo(
      res.tempFilePath,
      {
        title: '烟花视频',
        description: '美丽的烟花',
        location: '北京市'
      },
      (progress) => {
        console.log('上传进度：', progress)
      }
    )
    console.log('上传成功：', result)
  }
})
```

### 3. 点赞视频

```typescript
import { likeVideo, unlikeVideo } from '../../utils/interaction-api'

// 点赞
await likeVideo(videoId)

// 取消点赞
await unlikeVideo(videoId)
```

### 4. 发布评论

```typescript
import { publishComment } from '../../utils/interaction-api'

// 发布顶级评论
await publishComment({
  videoId: 1,
  content: '很棒的视频！'
})

// 回复评论
await publishComment({
  videoId: 1,
  content: '谢谢！',
  parentId: 10,  // 父评论ID
  replyToId: 5   // 被回复的用户ID
})
```

### 5. 获取我的收藏

```typescript
import { getMyCollectList } from '../../utils/user-api'

const result = await getMyCollectList({
  page: 1,
  pageSize: 10
})

console.log(result.records)  // 收藏的视频列表
```

---

## 错误处理

所有API调用都会自动处理以下错误：

1. **网络错误** - 显示"网络错误"提示
2. **超时错误** - 显示"请求超时，请重试"提示
3. **认证错误（401）** - 自动刷新Token或提示重新登录
4. **业务错误** - 显示服务器返回的错误信息

---

## 注意事项

1. **Token管理**
   - Token存储在wx.storage中
   - 每次请求自动携带Token
   - Token过期自动刷新
   - 刷新失败清除登录信息

2. **请求超时**
   - 默认超时时间10秒
   - 可通过options.timeout自定义

3. **Loading状态**
   - 默认显示loading
   - 可通过options.showLoading=false关闭
   - 点赞、收藏等快速操作不显示loading

4. **错误提示**
   - 所有错误都会显示toast提示
   - 可以通过catch捕获错误进行自定义处理

5. **后端API地址**
   - 当前配置为：http://localhost:8080/api
   - 生产环境需要修改为实际域名

---

## 后续工作

这些API工具函数已经完成，可以在后续的页面开发中直接使用：

- ✅ 第三阶段：社区首页开发（使用video-api）
- ✅ 第四阶段：信息流页面开发（使用video-api）
- ✅ 第五阶段：视频详情页开发（使用video-api + interaction-api）
- ✅ 第六阶段：视频发布页开发（使用video-api）
- ✅ 第七阶段：个人内容页面开发（使用user-api + interaction-api）

---

## 测试建议

1. **单元测试**
   - 测试请求拦截器是否正确添加Token
   - 测试响应拦截器是否正确处理错误
   - 测试Token刷新逻辑

2. **集成测试**
   - 测试各个API接口是否正常调用
   - 测试错误处理是否正确
   - 测试Token过期后的自动刷新

3. **真机测试**
   - 测试网络异常情况
   - 测试请求超时情况
   - 测试Token刷新流程

---

## 版本信息

- 创建时间：2026-01-02
- 对应任务：.kiro/specs/ugc-miniprogram/tasks.md - 任务6
- 实现状态：✅ 已完成
