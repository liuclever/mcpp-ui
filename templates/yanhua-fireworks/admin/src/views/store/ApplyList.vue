<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getApplyList, reviewApply } from '@/api/store'
import type { JoinApply } from '@/api/types'

const loading = ref(false)
const tableData = ref<JoinApply[]>([])

const searchForm = reactive({
  status: undefined as number | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 加载申请列表
const loadApplyList = async () => {
  loading.value = true
  try {
    const response = await getApplyList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      status: searchForm.status
    })
    
    if (response.code === 200) {
      tableData.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取申请列表失败')
    }
  } catch (error: any) {
    console.error('获取申请列表失败:', error)
    ElMessage.error(error.message || '获取申请列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadApplyList()
}

// 重置
const handleReset = () => {
  searchForm.status = undefined
  pagination.page = 1
  loadApplyList()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadApplyList()
}

// 通过申请
const handleApprove = async (row: JoinApply) => {
  try {
    await ElMessageBox.confirm(
      `确定通过"${row.name}"的入驻申请吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await reviewApply({
      id: row.id,
      status: 1,
      remark: '审核通过'
    })
    
    if (response.code === 200) {
      ElMessage.success('已通过')
      loadApplyList()
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('审核失败:', error)
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 拒绝申请
const handleReject = async (row: JoinApply) => {
  try {
    const { value: remark } = await ElMessageBox.prompt(
      `确定拒绝"${row.name}"的入驻申请吗？请输入拒绝原因：`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入拒绝原因',
        inputValidator: (value) => {
          if (!value || value.trim() === '') {
            return '请输入拒绝原因'
          }
          return true
        }
      }
    )
    
    const response = await reviewApply({
      id: row.id,
      status: 2,
      remark: remark || '审核不通过'
    })
    
    if (response.code === 200) {
      ElMessage.success('已拒绝')
      loadApplyList()
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('审核失败:', error)
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadApplyList()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 150px">
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已拒绝" :value="2" />
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
        <span>入驻申请列表</span>
      </template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="联系人" width="120" />
        <el-table-column prop="company" label="公司名称" min-width="200" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="createTime" label="申请时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 0 ? '待审核' : row.status === 1 ? '已通过' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 0">
              <el-button type="success" link @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link @click="handleReject(row)">拒绝</el-button>
            </template>
            <span v-else class="text-gray">已处理</span>
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
  </div>
</template>

<style scoped>
.text-gray {
  color: #999;
}
</style>
