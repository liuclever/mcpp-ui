<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateProductVideo } from '@/api/product-video'
import type { ProductVideo } from '@/api/types'

interface Props {
  visible: boolean
  video: ProductVideo | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref()
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  status: 0,
  sortOrder: 0
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ]
}

// 状态选项
const statusOptions = [
  { label: '待审核', value: 0 },
  { label: '已发布', value: 1 },
  { label: '已拒绝', value: 2 }
]

// 监听对话框显示状态和视频数据
watch(() => props.visible, (newVal) => {
  if (newVal && props.video) {
    // 加载视频数据到表单
    form.title = props.video.title
    form.description = props.video.description || ''
    form.status = props.video.status
    form.sortOrder = props.video.sortOrder
  } else if (!newVal) {
    // 关闭时重置表单
    resetForm()
  }
})

// 重置表单
const resetForm = () => {
  form.title = ''
  form.description = ''
  form.status = 0
  form.sortOrder = 0
  formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value || !props.video) return
  
  // 验证表单
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  
  try {
    const updateData: Partial<ProductVideo> = {
      title: form.title,
      description: form.description,
      status: form.status,
      sortOrder: form.sortOrder
    }
    
    const response = await updateProductVideo(props.video.id, updateData)
    
    if (response.data.code === 200) {
      ElMessage.success('更新成功')
      emit('success')
      handleClose()
    } else {
      throw new Error(response.data.message || '更新失败')
    }
  } catch (error: any) {
    console.error('更新失败', error)
    ElMessage.error(error.message || '更新失败')
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="编辑产品视频"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form 
      v-if="video" 
      ref="formRef" 
      :model="form" 
      :rules="rules" 
      label-width="100px"
    >
      <!-- 视频信息（只读） -->
      <el-form-item label="视频ID">
        <el-input :model-value="video.id" disabled />
      </el-form-item>

      <el-form-item label="产品ID">
        <el-input :model-value="video.productId" disabled />
      </el-form-item>

      <!-- 视频标题 -->
      <el-form-item label="视频标题" prop="title" required>
        <el-input 
          v-model="form.title" 
          placeholder="请输入视频标题"
          maxlength="100"
          show-word-limit
          :disabled="submitting"
        />
      </el-form-item>

      <!-- 视频描述 -->
      <el-form-item label="视频描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入视频描述"
          maxlength="500"
          show-word-limit
          :disabled="submitting"
        />
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态" required>
        <el-select 
          v-model="form.status" 
          placeholder="请选择状态"
          :disabled="submitting"
          style="width: 100%"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <!-- 排序顺序 -->
      <el-form-item label="排序顺序">
        <el-input-number 
          v-model="form.sortOrder" 
          :min="0" 
          :max="9999"
          :disabled="submitting"
          style="width: 100%"
        />
        <div class="form-tip">数值越小越靠前</div>
      </el-form-item>

      <!-- 视频信息（只读） -->
      <el-form-item label="视频URL">
        <el-link :href="video.videoUrl" target="_blank" type="primary">
          查看视频
        </el-link>
      </el-form-item>

      <el-form-item v-if="video.coverUrl" label="封面URL">
        <el-link :href="video.coverUrl" target="_blank" type="primary">
          查看封面
        </el-link>
      </el-form-item>
    </el-form>

    <div v-else class="empty-state">
      <el-empty description="暂无视频信息" />
    </div>

    <template #footer>
      <el-button @click="handleClose" :disabled="submitting">取消</el-button>
      <el-button 
        type="primary" 
        :loading="submitting" 
        @click="handleSubmit"
      >
        {{ submitting ? '保存中...' : '保存' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
