<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const menuList = [
  { path: '/dashboard', title: '控制台', icon: 'Odometer' },
  {
    path: '/user',
    title: '用户管理',
    icon: 'User',
    children: [
      { path: '/user/list', title: '用户列表' },
      { path: '/user/points', title: '积分记录' },
      { path: '/user/points-config', title: '积分规则配置' },
      { path: '/user/points-rules', title: '积分规则说明' }
    ]
  },
  {
    path: '/product',
    title: '产品管理',
    icon: 'Goods',
    children: [
      { path: '/product/list', title: '产品列表' },
      { path: '/product/category', title: '分类管理' },
      { path: '/product/comment', title: '评论管理' }
    ]
  },
  {
    path: '/store',
    title: '门店管理',
    icon: 'Shop',
    children: [
      { path: '/store/list', title: '门店列表' },
      { path: '/store/apply', title: '入驻申请' }
    ]
  },
  {
    path: '/ugc',
    title: 'UGC管理',
    icon: 'VideoCamera',
    children: [
      { path: '/ugc/video', title: '视频管理' },
      { path: '/ugc/comment', title: '评论管理' }
    ]
  },
    {
    path: '/about',
    title: '关于管理',
    icon: 'InfoFilled',
    children: [
      { path: '/about/contact', title: '联系信息' }
    ]
  },
    {
    path: '/activity',
    title: '活动话题',
    icon: 'CollectionTag',
    children: [
      { path: '/activity/list', title: '话题管理' }
    ]
  },
  {
    path: '/enterprise',
    title: '企业中心',
    icon: 'OfficeBuilding',
    children: [
      { path: '/enterprise/config', title: '配置管理' },
      { path: '/enterprise/column/list', title: '栏目管理' },
      { path: '/enterprise/content/list', title: '内容管理' },
      { path: '/enterprise/form', title: '表单管理' },
      { path: '/enterprise/sales-point', title: '销售网点' }
    ]
  },
  {
    path: '/home',
    title: '首页管理',
    icon: 'HomeFilled',
    children: [
      { path: '/home/gallery', title: '首页图片管理' }
    ]
  },
  {
    path: '/system',
    title: '系统设置',
    icon: 'Setting',
    children: [
      { path: '/system/admin', title: '管理员' },
      { path: '/system/login-config', title: '登录配置' },
      { path: '/system/video-config', title: '视频配置' },
      { path: '/system/page-banner', title: '页面横幅' }
    ]
  }
]

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :style="{ width: isCollapse ? '64px' : '220px' }">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
        <span v-if="!isCollapse" class="logo-text">正攀烟花管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#d03a6a"
        router
        class="sidebar-menu"
      >
        <template v-for="menu in menuList" :key="menu.path">
          <el-sub-menu v-if="menu.children" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.path"
              :index="child.path"
            >
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.icon" /></el-icon>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-area">
      <!-- 顶部 -->
      <div class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">
              {{ route.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="admin-info">
              <el-avatar :size="32" src="" />
              <span class="admin-name">管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sidebar {
  background-color: #001529;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  transition: width 0.3s;
}

.sidebar-menu {
  border-right: none !important;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
  white-space: nowrap;
}

.header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.admin-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.admin-name {
  margin-left: 10px;
  font-size: 14px;
}

.content {
  flex: 1;
  background: #f0f2f5;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.content > * {
  flex: 1;
}
</style>
