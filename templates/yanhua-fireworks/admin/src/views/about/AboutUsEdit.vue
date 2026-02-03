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
    // response 是 AxiosResponse
    // response.data 是 ApiResponse { code, message, data }
    // response.data.data 是 AboutUsContent
    if (response.data.code === 200 && response.data.data) {
      form.value.content = response.data.data.content
      updateTime.value = response.data.data.updateTime
    } else {
      ElMessage.error(response.data.message || '获取内容失败')
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
    const response = await aboutUsApi.updateContent(form.value.content)
    if (response.data.code === 200) {
      ElMessage.success('保存成功')
      // 重新获取内容以更新时间
      await fetchContent()
    } else {
      ElMessage.error(response.data.message || '保存失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    loading.value = false
  }
}

// 取消操作
const handleCancel = () => {
  // 重新获取内容，恢复到保存前的状态
  fetchContent()
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
          <span>关于我们内容管理</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="100px">
        <el-form-item label="内容介绍">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="15"
            placeholder="请输入关于我们的内容"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="更新时间" v-if="updateTime">
          <span class="update-time">{{ updateTime }}</span>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">
            保存
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.update-time {
  color: #909399;
  font-size: 14px;
}
</style>
