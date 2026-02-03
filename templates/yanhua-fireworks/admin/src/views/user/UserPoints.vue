<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserPoints, getUserList } from '@/api/user'
import type { PointsLog, User } from '@/api/types'

const loading = ref(false)
const tableData = ref<PointsLog[]>([])

const searchForm = reactive({
  userId: undefined as number | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 用户列表（用于筛选）
const userList = ref<User[]>([])
const loadingUsers = ref(false)

// 加载用户列表（用于筛选）
const loadUserList = async () => {
  loadingUsers.value = true
  try {
    const response = await getUserList({
      page: 1,
      pageSize: 100
    })
    
    if (response.code === 200) {
      userList.value = response.data.records
    }
  } catch (error: any) {
    console.error('获取用户列表失败:', error)
  } finally {
    loadingUsers.value = false
  }
}

// 加载积分记录
const loadPointsLog = async () => {
  loading.value = true
  try {
    const response = await getUserPoints({
      page: pagination.page,
      pageSize: pagination.pageSize,
      userId: searchForm.userId
    })
    
    if (response.code === 200) {
      tableData.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取积分记录失败')
    }
  } catch (error: any) {
    console.error('获取积分记录失败:', error)
    ElMessage.error(error.message || '获取积分记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadPointsLog()
}

// 重置
const handleReset = () => {
  searchForm.userId = undefined
  pagination.page = 1
  loadPointsLog()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadPointsLog()
}

// 获取积分类型文本
const getPointsTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'register': '注册奖励',
    'login': '每日登录',
    'publish': '发布内容',
    'comment': '发表评论',
    'like': '点赞',
    'share': '分享',
    'admin': '管理员操作'
  }
  return typeMap[type] || type
}

// 页面加载时获取数据
onMounted(() => {
  loadUserList()
  loadPointsLog()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户筛选">
          <el-select 
            v-model="searchForm.userId" 
            placeholder="请选择用户" 
            clearable 
            filterable
            style="width: 200px"
            :loading="loadingUsers"
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="`${user.nickname} (${user.phone})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <span>积分变动记录</span>
      </template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="points" label="积分变动" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.points > 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.points > 0 ? '+' : '' }}{{ row.points }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            {{ getPointsTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="200" />
        <el-table-column prop="createTime" label="时间" width="180" />
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.page-container {
  padding: 0;
}
.search-card {
  margin-bottom: 20px;
}
.table-card {
  margin-bottom: 20px;
}
.pagination-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
