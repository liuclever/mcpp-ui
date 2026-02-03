<template>
  <div class="column-list-container">
    <h1>栏目管理测试页面</h1>
    <p>如果你能看到这个页面，说明路由和组件加载正常</p>
    
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">栏目列表</span>
        </div>
      </template>

      <div v-if="loading">加载中...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <p>共找到 {{ columns.length }} 个栏目</p>
        <div v-for="column in columns" :key="column.id" style="padding: 10px; border: 1px solid #eee; margin: 5px 0;">
          <strong>{{ column.name }}</strong> - {{ column.type }} - {{ column.enabled ? '启用' : '禁用' }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ColumnConfig {
  id?: number
  name: string
  type: string
  enabled?: boolean
}

const loading = ref(false)
const error = ref('')
const columns = ref<ColumnConfig[]>([])

const loadColumns = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('开始加载栏目数据...')
    
    // 直接使用fetch测试API
    const response = await fetch('http://localhost:8080/api/admin/columns', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
      }
    })
    
    console.log('API响应状态:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API响应数据:', data)
    
    if (data.code === 200) {
      columns.value = data.data || []
    } else {
      error.value = data.message || '加载失败'
    }
  } catch (err) {
    console.error('加载栏目失败:', err)
    error.value = err.message || '网络请求失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('组件已挂载，开始加载数据')
  loadColumns()
})
</script>

<style scoped>
.column-list-container {
  padding: 20px;
}
</style>
