# 烟花小程序项目

## 项目简介

这是一个完整的烟花产品展示与社区互动小程序项目，包含管理后台和微信小程序端。

## 技术栈

### 管理后台 (admin)
- Vue 3 + TypeScript
- Vite
- Element Plus
- Vue Router
- Pinia

### 微信小程序 (miniprogram)
- 微信小程序原生开发
- TypeScript
- 组件化开发

## 功能特性

### 小程序端
- 产品展示与分类浏览
- 视频播放与互动（点赞、评论、收藏）
- 社区动态发布与浏览
- 门店查询与导航
- 用户中心与积分系统
- 企业官网展示

### 管理后台
- 产品管理
- 视频内容管理
- 用户管理
- 评论审核
- 数据统计
- 系统配置

## 数据库

项目使用 MySQL 数据库，数据库结构文件：`database.sql`

## 配置说明

### 后台配置

修改 `admin/.env.development` 和 `admin/.env.production` 中的 API 地址：

```
VITE_API_BASE_URL=your_api_url
```

### 小程序配置

1. 修改 `miniprogram/project.config.json` 中的 `appid`
2. 修改 `miniprogram/miniprogram/utils/api.ts` 中的 `BASE_URL`
3. 修改 `miniprogram/miniprogram/app.ts` 中的 `apiBase`

## 安装与运行

### 管理后台

```bash
cd admin
npm install
npm run dev  # 开发环境
npm run build  # 生产构建
```

### 微信小程序

1. 使用微信开发者工具打开 `miniprogram` 目录
2. 配置 AppID
3. 点击编译运行

## 注意事项

1. 需要配置后端 API 服务
2. 小程序需要在微信公众平台配置合法域名
3. 图片和视频资源需要配置 CDN 或对象存储服务

## 许可证

本项目仅供学习参考使用
