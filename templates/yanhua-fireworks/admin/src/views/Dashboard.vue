<script setup lang="ts">
</script>

<template>
  <div class="dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <h1>后台管理</h1>
      <p>欢迎使用正攀烟花后台管理系统</p>
    </div>

    <!-- 快捷操作 -->
    <el-card class="quick-actions">
      <template #header>快捷操作</template>
      <div class="action-buttons">
        <el-button type="primary" @click="$router.push('/product/list')">产品管理</el-button>
        <el-button type="warning" @click="$router.push('/store/list')">门店管理</el-button>
        <el-button type="success" @click="$router.push('/user/list')">用户管理</el-button>
        <el-button @click="$router.push('/content/list')">内容管理</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 40px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.welcome-banner h1 {
  font-size: 32px;
  margin: 0 0 10px 0;
}

.welcome-banner p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.quick-actions {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
</style>
