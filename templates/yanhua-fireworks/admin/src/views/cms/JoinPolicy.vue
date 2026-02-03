<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const form = ref({
  title: '招商加盟',
  policy: '加盟政策内容...',
  conditions: '加盟条件内容...',
  support: '加盟扶持内容...'
})

const handleSave = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('保存成功')
  }, 1000)
}
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>招商加盟编辑</span>
          <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
        </div>
      </template>
      
      <el-form :model="form" label-width="100px">
        <el-form-item label="页面标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="加盟政策">
          <el-input v-model="form.policy" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="加盟条件">
          <el-input v-model="form.conditions" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="加盟扶持">
          <el-input v-model="form.support" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
