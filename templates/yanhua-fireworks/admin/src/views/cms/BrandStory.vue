<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { aboutUsApi } from '@/api/about-us'

const loading = ref(false)
const fetchLoading = ref(false)
const form = ref({
  content: ''
})
const updateTime = ref('')

// 获取内容
const fetchContent = async () => {
  fetchLoading.value = true
  try {
    const response = await aboutUsApi.getContent()
    if (response.data && response.data.code === 200 && response.data.data) {
      form.value.content = response.data.data.content || ''
      updateTime.value = response.data.data.updateTime || ''
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取内容失败')
  } finally {
    fetchLoading.value = false
  }
}

// 保存内容
const handleSave = async () => {
  if (!form.value.content || !form.value.content.trim()) {
    ElMessage.warning('内容不能为空')
    return
  }

  loading.value = true
  try {
    await aboutUsApi.updateContent(form.value.content)
    ElMessage.success('保存成功')
    // 重新获取内容以更新时间
    await fetchContent()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取内容
onMounted(() => {
  fetchContent()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" v-loading="fetchLoading">
      <template #header>
        <div class="card-header">
          <span>品牌故事编辑</span>
          <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
        </div>
      </template>
      
      <el-form :model="form" label-width="100px">
        <el-form-item label="内容介绍">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="15"
            placeholder="请输入品牌介绍内容"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="更新时间" v-if="updateTime">
          <span class="update-time">{{ updateTime }}</span>
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

.update-time {
  color: #909399;
  font-size: 14px;
}
</style>
