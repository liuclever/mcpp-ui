<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([
  { id: 1, title: '我的烟花视频', user: '用户A', type: 'video', createTime: '2024-01-01' },
  { id: 2, title: '春节快乐', user: '用户B', type: 'video', createTime: '2024-01-02' },
])

const handleApprove = (row: any) => {
  ElMessageBox.confirm('确定通过该内容审核吗？', '提示').then(() => {
    ElMessage.success('审核通过')
  })
}

const handleReject = (row: any) => {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝原因', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    console.log('拒绝原因:', value)
    ElMessage.success('已拒绝')
  })
}

const handlePreview = (row: any) => {
  console.log('预览', row)
}
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>内容审核</span>
          <el-badge :value="tableData.length" class="badge">待审核</el-badge>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="user" label="发布者" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            {{ row.type === 'video' ? '视频' : '图文' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handlePreview(row)">预览</el-button>
            <el-button type="success" link @click="handleApprove(row)">通过</el-button>
            <el-button type="danger" link @click="handleReject(row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
