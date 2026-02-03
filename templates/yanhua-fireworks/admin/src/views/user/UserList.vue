<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, getUserDetail, updateUserStatus, adjustUserPoints } from '@/api/user'
import type { User } from '@/api/types'

const loading = ref(false)
const tableData = ref<User[]>([])

const searchForm = reactive({
  keyword: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 用户详情对话框
const detailDialogVisible = ref(false)
const currentUser = ref<User | null>(null)

// 积分调整对话框
const pointsDialogVisible = ref(false)
const pointsForm = reactive({
  userId: 0,
  nickname: '',
  currentPoints: 0,
  points: 0,
  reason: ''
})

// 加载用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const response: any = await getUserList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined
    })
    
    // 响应拦截器已返回response.data，所以response就是{code, data, message}
    if (response.code === 200) {
      tableData.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取用户列表失败')
    }
  } catch (error: any) {
    console.error('获取用户列表失败:', error)
    ElMessage.error(error.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadUserList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.dateRange = []
  pagination.page = 1
  loadUserList()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadUserList()
}

// 查看用户详情
const handleViewDetail = async (row: User) => {
  try {
    const response = await getUserDetail(row.id)
    if (response.code === 200) {
      currentUser.value = response.data
      detailDialogVisible.value = true
    } else {
      ElMessage.error(response.message || '获取用户详情失败')
    }
  } catch (error: any) {
    console.error('获取用户详情失败:', error)
    ElMessage.error(error.message || '获取用户详情失败')
  }
}

// 切换用户状态
const handleToggleStatus = async (row: User) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户"${row.nickname}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await updateUserStatus({
      id: row.id,
      status: newStatus
    })
    
    if (response.code === 200) {
      ElMessage.success(`${action}成功`)
      loadUserList()
    } else {
      ElMessage.error(response.message || `${action}失败`)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error(`${action}用户失败:`, error)
      ElMessage.error(error.message || `${action}失败`)
    }
  }
}

// 打开积分调整对话框
const handleAdjustPoints = (row: User) => {
  pointsForm.userId = row.id
  pointsForm.nickname = row.nickname || ''
  pointsForm.currentPoints = row.points || 0
  pointsForm.points = 0
  pointsForm.reason = ''
  pointsDialogVisible.value = true
}

// 提交积分调整
const handleSubmitPoints = async () => {
  if (pointsForm.points === 0) {
    ElMessage.warning('积分变动值不能为0')
    return
  }
  if (!pointsForm.reason.trim()) {
    ElMessage.warning('请填写变动原因')
    return
  }
  
  try {
    const response = await adjustUserPoints({
      userId: pointsForm.userId,
      points: pointsForm.points,
      reason: pointsForm.reason
    })
    
    if (response.code === 200) {
      ElMessage.success('积分调整成功')
      pointsDialogVisible.value = false
      loadUserList()
    } else {
      ElMessage.error(response.message || '积分调整失败')
    }
  } catch (error: any) {
    console.error('积分调整失败:', error)
    ElMessage.error(error.message || '积分调整失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadUserList()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="昵称/手机号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="region" label="地区" width="120" />
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
            <el-button type="warning" link @click="handleAdjustPoints(row)">调整积分</el-button>
            <el-button 
              :type="row.status === 1 ? 'danger' : 'success'" 
              link 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
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

    <!-- 用户详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="600px">
      <el-descriptions v-if="currentUser" :column="2" border>
        <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ currentUser.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
        <el-descriptions-item label="地区">{{ currentUser.region || '未设置' }}</el-descriptions-item>
        <el-descriptions-item label="积分">{{ currentUser.points }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentUser.status === 1 ? 'success' : 'danger'">
            {{ currentUser.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间" :span="2">
          {{ currentUser.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">
          {{ currentUser.updateTime }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 积分调整对话框 -->
    <el-dialog v-model="pointsDialogVisible" title="调整用户积分" width="500px">
      <el-form label-width="100px">
        <el-form-item label="用户">
          <span>{{ pointsForm.nickname }} (ID: {{ pointsForm.userId }})</span>
        </el-form-item>
        <el-form-item label="当前积分">
          <span style="font-weight: bold; color: #409eff;">{{ pointsForm.currentPoints }}</span>
        </el-form-item>
        <el-form-item label="积分变动" required>
          <el-input-number 
            v-model="pointsForm.points" 
            :min="-pointsForm.currentPoints"
            placeholder="正数增加，负数减少"
            style="width: 200px;"
          />
          <span style="margin-left: 10px; color: #909399;">
            调整后: {{ pointsForm.currentPoints + pointsForm.points }}
          </span>
        </el-form-item>
        <el-form-item label="变动原因" required>
          <el-input 
            v-model="pointsForm.reason" 
            type="textarea" 
            :rows="3"
            placeholder="请输入积分变动原因，用户可见"
          />
        </el-form-item>
        <el-form-item>
          <div style="color: #909399; font-size: 12px;">
            常用原因：优秀视频奖励、活动奖励、违规扣除、系统补偿等
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pointsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitPoints">确认调整</el-button>
      </template>
    </el-dialog>
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
