<template>
  <div class="form-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>表单详情</span>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </template>

      <div v-if="formData" class="detail-content">
        <!-- 基本信息 -->
        <el-descriptions title="申请人信息" :column="2" border class="detail-section">
          <el-descriptions-item label="姓名">{{ formData.name }}</el-descriptions-item>
          <el-descriptions-item label="手机号">
            <span>{{ formData.phone }}</span>
            <el-button type="primary" link size="small" @click="callPhone" style="margin-left: 10px;">
              <el-icon><Phone /></el-icon> 拨打
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="省份">{{ formData.province }}</el-descriptions-item>
          <el-descriptions-item label="城市">{{ formData.city }}</el-descriptions-item>
          <el-descriptions-item label="区县">{{ formData.district || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="投资预算">{{ formData.budget || '未填写' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 留言内容 -->
        <el-descriptions title="留言内容" :column="1" border class="detail-section">
          <el-descriptions-item label="留言">
            <div class="message-content">{{ formData.message || '无留言' }}</div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 处理状态 -->
        <el-descriptions title="处理状态" :column="2" border class="detail-section">
          <el-descriptions-item label="当前状态">
            <el-tag :type="getStatusType(formData.status)" size="large">
              {{ getStatusText(formData.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ formData.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="处理时间">{{ formData.handleTime || '未处理' }}</el-descriptions-item>
          <el-descriptions-item label="处理备注">
            <div class="remark-content">{{ formData.remark || '无备注' }}</div>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 操作区域 -->
        <div class="action-section">
          <el-card shadow="never">
            <template #header>
              <span>更新处理状态</span>
            </template>
            <el-form :model="editForm" label-width="100px">
              <el-form-item label="处理状态">
                <el-select v-model="editForm.status" placeholder="请选择状态" style="width: 200px;">
                  <el-option label="待处理" value="pending">
                    <el-tag type="warning" size="small">待处理</el-tag>
                  </el-option>
                  <el-option label="已联系" value="contacted">
                    <el-tag type="primary" size="small">已联系</el-tag>
                  </el-option>
                  <el-option label="已成交" value="closed">
                    <el-tag type="success" size="small">已成交</el-tag>
                  </el-option>
                  <el-option label="已放弃" value="abandoned">
                    <el-tag type="info" size="small">已放弃</el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="处理备注">
                <el-input
                  v-model="editForm.remark"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入处理备注，记录跟进情况..."
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSave" :loading="saving">
                  保存更新
                </el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>

      <el-empty v-else-if="!loading" description="未找到表单数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Phone } from '@element-plus/icons-vue'
import { getFormSubmissionDetail, updateFormStatus } from '@/api/form'
import type { FormSubmission } from '@/api/form'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const formData = ref<FormSubmission | null>(null)

const editForm = reactive({
  status: '',
  remark: ''
})

onMounted(() => {
  loadDetail()
})

async function loadDetail() {
  const id = route.query.id as string
  if (!id) {
    ElMessage.error('缺少表单ID参数')
    return
  }

  loading.value = true
  try {
    const res: any = await getFormSubmissionDetail(Number(id))
    if (res && res.code === 200) {
      formData.value = res.data
      // 初始化编辑表单
      editForm.status = res.data.status
      editForm.remark = res.data.remark || ''
    } else {
      ElMessage.error(res?.message || '获取详情失败')
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!formData.value?.id) return

  saving.value = true
  try {
    const res: any = await updateFormStatus(formData.value.id, {
      status: editForm.status,
      remark: editForm.remark
    })
    if (res && res.code === 200) {
      ElMessage.success('保存成功')
      // 重新加载数据以显示最新状态
      await loadDetail()
    } else {
      ElMessage.error(res?.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

function resetForm() {
  if (formData.value) {
    editForm.status = formData.value.status
    editForm.remark = formData.value.remark || ''
  }
}

function goBack() {
  router.push('/enterprise/form')
}

function callPhone() {
  if (formData.value?.phone) {
    window.location.href = `tel:${formData.value.phone}`
  }
}

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    contacted: 'primary',
    closed: 'success',
    abandoned: 'info'
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    pending: '待处理',
    contacted: '已联系',
    closed: '已成交',
    abandoned: '已放弃'
  }
  return textMap[status] || status
}
</script>

<style scoped>
.form-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content {
  max-width: 900px;
}

.detail-section {
  margin-bottom: 24px;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 60px;
  line-height: 1.6;
}

.remark-content {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;
}

.action-section {
  margin-top: 24px;
}

.action-section :deep(.el-card__header) {
  padding: 12px 20px;
  background-color: #f5f7fa;
}
</style>
