<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createProductVideo } from '@/api/product-video'
import type { ProductVideo } from '@/api/types'
import request from '@/utils/request'

interface Props {
  visible: boolean
  productId: number
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref()
const uploading = ref(false)
const uploadingVideo = ref(false)
const uploadingCover = ref(false)

const form = reactive({
  title: '',
  description: '',
  videoUrl: '',
  coverUrl: '',
  duration: 0,
  fileSize: 0,
  sortOrder: 0,
  status: 0
})

// 视频文件
const videoFile = ref<File | null>(null)
// 封面文件
const coverFile = ref<File | null>(null)

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  videoUrl: [
    { required: true, message: '请上传视频文件', trigger: 'change' }
  ]
}

// 监听对话框显示状态
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

// 重置表单
const resetForm = () => {
  form.title = ''
  form.description = ''
  form.videoUrl = ''
  form.coverUrl = ''
  form.duration = 0
  form.fileSize = 0
  form.sortOrder = 0
  form.status = 0
  videoFile.value = null
  coverFile.value = null
  formRef.value?.clearValidate()
}

// 处理视频文件选择
const handleVideoChange = (file: any) => {
  const selectedFile = file.raw
  
  // 验证文件类型
  const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-flv']
  if (!validTypes.includes(selectedFile.type)) {
    ElMessage.error('只支持 MP4、MOV、AVI、WMV、FLV 格式的视频')
    return false
  }
  
  // 验证文件大小（500MB）
  const maxSize = 500 * 1024 * 1024
  if (selectedFile.size > maxSize) {
    ElMessage.error('视频大小不能超过 500MB')
    return false
  }
  
  videoFile.value = selectedFile
  form.fileSize = selectedFile.size
  
  // 获取视频时长
  getVideoDuration(selectedFile)
  
  return false // 阻止自动上传
}

// 获取视频时长
const getVideoDuration = (file: File) => {
  const video = document.createElement('video')
  video.preload = 'metadata'
  
  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src)
    form.duration = Math.round(video.duration)
  }
  
  video.src = URL.createObjectURL(file)
}

// 处理封面文件选择
const handleCoverChange = (file: any) => {
  const selectedFile = file.raw
  
  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp']
  if (!validTypes.includes(selectedFile.type)) {
    ElMessage.error('只支持 JPG、PNG、GIF、BMP 格式的图片')
    return false
  }
  
  // 验证文件大小（10MB）
  const maxSize = 10 * 1024 * 1024
  if (selectedFile.size > maxSize) {
    ElMessage.error('图片大小不能超过 10MB')
    return false
  }
  
  coverFile.value = selectedFile
  
  return false // 阻止自动上传
}

// 上传视频文件
const uploadVideoFile = async () => {
  if (!videoFile.value) {
    throw new Error('请选择视频文件')
  }
  
  uploadingVideo.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', videoFile.value)
    
    const response = await request({
      url: '/upload/video',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 600000 // 10分钟超时，支持大视频上传
    })
    
    if (response.data.code === 200) {
      form.videoUrl = response.data.data.url
      ElMessage.success('视频上传成功')
    } else {
      throw new Error(response.data.message || '视频上传失败')
    }
  } finally {
    uploadingVideo.value = false
  }
}

// 上传封面文件
const uploadCoverFile = async () => {
  if (!coverFile.value) {
    return // 封面是可选的
  }
  
  uploadingCover.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', coverFile.value)
    
    const response = await request({
      url: '/upload/image',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.code === 200) {
      form.coverUrl = response.data.data.url
      ElMessage.success('封面上传成功')
    } else {
      throw new Error(response.data.message || '封面上传失败')
    }
  } finally {
    uploadingCover.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  // 验证表单
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  // 验证是否选择了视频文件
  if (!videoFile.value) {
    ElMessage.error('请选择视频文件')
    return
  }
  
  uploading.value = true
  
  try {
    // 1. 上传视频文件
    await uploadVideoFile()
    
    // 2. 上传封面文件（如果有）
    if (coverFile.value) {
      await uploadCoverFile()
    }
    
    // 3. 创建产品视频记录
    const videoData: Partial<ProductVideo> = {
      productId: props.productId,
      title: form.title,
      description: form.description,
      videoUrl: form.videoUrl,
      coverUrl: form.coverUrl,
      duration: form.duration,
      fileSize: form.fileSize,
      sortOrder: form.sortOrder,
      status: form.status
    }
    
    const response = await createProductVideo(videoData)
    
    if (response.data.code === 200) {
      ElMessage.success('视频创建成功')
      emit('success')
      handleClose()
    } else {
      throw new Error(response.data.message || '创建失败')
    }
  } catch (error: any) {
    console.error('上传失败', error)
    ElMessage.error(error.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 格式化时长
const formatDuration = (seconds: number) => {
  if (!seconds) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="上传产品视频"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <!-- 视频文件 -->
      <el-form-item label="视频文件" prop="videoUrl" required>
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleVideoChange"
          :limit="1"
          accept="video/*"
        >
          <el-button type="primary" :disabled="uploading">选择视频</el-button>
        </el-upload>
        <div v-if="videoFile" class="file-info">
          <div>已选择: {{ videoFile.name }}</div>
          <div>大小: {{ formatFileSize(videoFile.size) }}</div>
          <div v-if="form.duration">时长: {{ formatDuration(form.duration) }}</div>
        </div>
        <div v-else class="upload-tip">
          支持 MP4、MOV、AVI、WMV、FLV 格式，最大 500MB
        </div>
      </el-form-item>

      <!-- 封面图片 -->
      <el-form-item label="封面图片">
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleCoverChange"
          :limit="1"
          accept="image/*"
        >
          <el-button :disabled="uploading">选择封面</el-button>
        </el-upload>
        <div v-if="coverFile" class="file-info">
          <div>已选择: {{ coverFile.name }}</div>
          <div>大小: {{ formatFileSize(coverFile.size) }}</div>
        </div>
        <div v-else class="upload-tip">
          可选，支持 JPG、PNG、GIF、BMP 格式，最大 10MB
        </div>
      </el-form-item>

      <!-- 视频标题 -->
      <el-form-item label="视频标题" prop="title" required>
        <el-input 
          v-model="form.title" 
          placeholder="请输入视频标题"
          maxlength="100"
          show-word-limit
          :disabled="uploading"
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
          :disabled="uploading"
        />
      </el-form-item>

      <!-- 排序顺序 -->
      <el-form-item label="排序顺序">
        <el-input-number 
          v-model="form.sortOrder" 
          :min="0" 
          :max="9999"
          :disabled="uploading"
        />
        <div class="upload-tip">数值越小越靠前</div>
      </el-form-item>

      <!-- 状态 -->
      <el-form-item label="状态">
        <el-radio-group v-model="form.status" :disabled="uploading">
          <el-radio :label="0">待审核</el-radio>
          <el-radio :label="1">已发布</el-radio>
          <el-radio :label="2">已拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose" :disabled="uploading">取消</el-button>
      <el-button 
        type="primary" 
        :loading="uploading" 
        @click="handleSubmit"
      >
        {{ uploading ? '上传中...' : '确定上传' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.file-info {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f4f4f5;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
}

.file-info > div {
  margin: 4px 0;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
