<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([
  { id: 1, username: 'admin', nickname: '超级管理员', role: 'super', status: 1, createTime: '2024-01-01' },
  { id: 2, username: 'editor', nickname: '编辑员', role: 'editor', status: 1, createTime: '2024-01-02' },
])

const dialogVisible = ref(false)
const form = ref({ id: 0, username: '', nickname: '', password: '', role: 'editor' })

const handleAdd = () => {
  form.value = { id: 0, username: '', nickname: '', password: '', role: 'editor' }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  form.value = { ...row, password: '' }
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  if (row.role === 'super') {
    ElMessage.warning('不能删除超级管理员')
    return
  }
  ElMessageBox.confirm('确定删除该管理员吗？', '提示', { type: 'warning' }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleSubmit = () => {
  ElMessage.success('保存成功')
  dialogVisible.value = false
}
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>管理员列表</span>
          <el-button type="primary" @click="handleAdd">新增管理员</el-button>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'super' ? 'danger' : 'primary'">
              {{ row.role === 'super' ? '超级管理员' : '编辑员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" :disabled="row.role === 'super'" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)" :disabled="row.role === 'super'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="管理员编辑" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" :disabled="form.id > 0" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="密码" :label-width="100">
          <el-input v-model="form.password" type="password" :placeholder="form.id > 0 ? '留空则不修改' : '请输入密码'" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role">
            <el-option label="超级管理员" value="super" />
            <el-option label="编辑员" value="editor" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
