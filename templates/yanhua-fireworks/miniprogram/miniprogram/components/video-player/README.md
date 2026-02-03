# Video Player Component

视频播放器组件，封装微信小程序的video组件，提供更便捷的播放控制和状态管理。

## 功能特性

- ✅ 封装wx.createVideoContext，提供统一的播放控制接口
- ✅ 支持播放/暂停控制
- ✅ 支持自动播放和循环播放
- ✅ 提供播放状态回调（play, pause, ended, error, timeupdate, waiting）
- ✅ 支持自定义播放按钮
- ✅ 支持全屏控制
- ✅ 支持播放速率调整
- ✅ 支持弹幕发送
- ✅ 自动管理视频上下文生命周期

## 使用方法

### 1. 在页面json中引入组件

```json
{
  "usingComponents": {
    "video-player": "/components/video-player/video-player"
  }
}
```

### 2. 在页面wxml中使用

```xml
<video-player
  videoUrl="{{videoUrl}}"
  coverUrl="{{coverUrl}}"
  autoplay="{{true}}"
  loop="{{true}}"
  controls="{{true}}"
  bindplay="onVideoPlay"
  bindpause="onVideoPause"
  bindended="onVideoEnded"
  binderror="onVideoError"
  bindtimeupdate="onVideoTimeUpdate"
/>
```

### 3. 在页面ts中处理事件

```typescript
Page({
  data: {
    videoUrl: 'https://example.com/video.mp4',
    coverUrl: 'https://example.com/cover.jpg'
  },

  onVideoPlay(e: any) {
    console.log('视频开始播放', e.detail);
  },

  onVideoPause(e: any) {
    console.log('视频暂停', e.detail);
  },

  onVideoEnded(e: any) {
    console.log('视频播放结束', e.detail);
  },

  onVideoError(e: any) {
    console.error('视频播放错误', e.detail);
  },

  onVideoTimeUpdate(e: any) {
    const { currentTime, duration, progress } = e.detail;
    console.log(`播放进度: ${(progress * 100).toFixed(2)}%`);
  }
});
```

### 4. 通过组件实例控制播放

```typescript
Page({
  onReady() {
    // 获取组件实例
    this.videoPlayer = this.selectComponent('#myVideoPlayer');
  },

  playVideo() {
    this.videoPlayer.play();
  },

  pauseVideo() {
    this.videoPlayer.pause();
  },

  seekTo(position: number) {
    this.videoPlayer.seek(position);
  },

  toggleFullScreen() {
    this.videoPlayer.requestFullScreen(0);
  }
});
```

## 属性列表

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| videoUrl | String | '' | 视频URL |
| coverUrl | String | '' | 封面图URL |
| autoplay | Boolean | false | 是否自动播放 |
| loop | Boolean | false | 是否循环播放 |
| controls | Boolean | true | 是否显示默认控制栏 |
| showCenterPlayBtn | Boolean | true | 是否显示中间播放按钮 |
| showPlayBtn | Boolean | true | 是否显示底部播放按钮 |
| enableProgressGesture | Boolean | true | 是否启用手势控制进度 |
| objectFit | String | 'contain' | 视频填充模式：contain/fill/cover |
| showCustomPlayBtn | Boolean | false | 是否显示自定义播放按钮 |
| playerId | String | 'default' | 播放器ID（用于多个播放器实例） |

## 事件列表

| 事件名 | 说明 | 返回参数 |
|--------|------|----------|
| play | 视频开始播放 | { currentTime } |
| pause | 视频暂停 | { currentTime } |
| ended | 视频播放结束 | { duration } |
| error | 视频播放错误 | { errMsg } |
| timeupdate | 播放进度更新 | { currentTime, duration, progress } |
| waiting | 视频缓冲中 | {} |

## 方法列表

| 方法名 | 参数 | 说明 |
|--------|------|------|
| play() | - | 播放视频 |
| pause() | - | 暂停视频 |
| stop() | - | 停止视频 |
| seek(position) | position: number | 跳转到指定位置（秒） |
| togglePlay() | - | 切换播放/暂停 |
| requestFullScreen(direction) | direction: 0\|90\|-90 | 请求全屏 |
| exitFullScreen() | - | 退出全屏 |
| sendDanmu(text, color) | text: string, color?: string | 发送弹幕 |
| playbackRate(rate) | rate: number | 设置播放速率 |

## 注意事项

1. 视频URL必须是https协议
2. 视频URL需要在小程序后台配置域名白名单
3. 组件会在页面隐藏时自动暂停视频
4. 组件销毁时会自动清理视频上下文
5. 多个播放器实例需要设置不同的playerId

## 示例场景

### 场景1：信息流模式（抖音式）

```xml
<video-player
  videoUrl="{{currentVideo.videoUrl}}"
  coverUrl="{{currentVideo.coverUrl}}"
  autoplay="{{true}}"
  loop="{{true}}"
  controls="{{false}}"
  objectFit="cover"
  showCustomPlayBtn="{{true}}"
  bindplay="onVideoPlay"
/>
```

### 场景2：视频详情页

```xml
<video-player
  videoUrl="{{video.videoUrl}}"
  coverUrl="{{video.coverUrl}}"
  autoplay="{{true}}"
  loop="{{false}}"
  controls="{{true}}"
  bindended="onVideoEnded"
/>
```

### 场景3：多个视频列表

```xml
<block wx:for="{{videos}}" wx:key="id">
  <video-player
    playerId="video-{{item.id}}"
    videoUrl="{{item.videoUrl}}"
    coverUrl="{{item.coverUrl}}"
    autoplay="{{false}}"
  />
</block>
```
