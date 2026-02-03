<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([
  { id: 1, title: '春节烟花燃放', user: '用户A', type: 'video', status: 1, views: 100, createTime: '2024-01-01' },
  { id: 2, title: '元宵节烟花', user: '用户B', type: 'video', status: 2, views: 50, createTime: '2024-01-02' },
])

const handleView = (row: any) => {
  console.log('查看', row)
}

const handleTop = (row: any) => {
  ElMessageBox.confirm('确定置顶该内容吗？', '提示').then(() => {
    ElMessage.success('置顶成功')
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定删除该内容吗？', '提示', { type: 'warning' }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <span>内容列表</span>
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
        <el-table-column prop="views" label="浏览量" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 2 ? 'warning' : 'danger'">
              {{ row.status === 1 ? '已发布' : row.status === 2 ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="warning" link @click="handleTop(row)">置顶</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
