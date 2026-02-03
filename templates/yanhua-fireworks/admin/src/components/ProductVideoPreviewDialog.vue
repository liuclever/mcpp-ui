<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ProductVideo } from '@/api/types'

interface Props {
  visible: boolean
  video: ProductVideo | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const videoRef = ref<HTMLVideoElement>()

// 获取状态标签类型
const getStatusType = computed(() => {
  if (!props.video) return 'info'
  switch (props.video.status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case 2:
      return 'danger'
    default:
      return 'info'
  }
})

// 获取状态文本
const getStatusText = computed(() => {
  if (!props.video) return '未知'
  switch (props.video.status) {
    case 0:
      return '待审核'
    case 1:
      return '已发布'
    case 2:
      return '已拒绝'
    default:
      return '未知'
  }
})

// 格式化时长（秒转为 mm:ss）
const formatDuration = (seconds: number) => {
  if (!seconds) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 监听对话框显示状态
watch(() => props.visible, (newVal) => {
  if (!newVal && videoRef.value) {
    // 关闭对话框时暂停视频
    videoRef.value.pause()
  }
})

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="视频预览"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-if="video" class="preview-container">
      <!-- 视频播放器 -->
      <div class="video-player">
        <video
          ref="videoRef"
          :src="video.videoUrl"
          :poster="video.coverUrl"
          controls
          class="video-element"
        >
          您的浏览器不支持视频播放
        </video>
      </div>

      <!-- 视频信息 -->
      <div class="video-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="视频ID">
            {{ video.id }}
          </el-descriptions-item>
          
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType">
              {{ getStatusText }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="视频标题" :span="2">
            {{ video.title }}
          </el-descriptions-item>

          <el-descriptions-item label="视频描述" :span="2">
            <div class="description">
              {{ video.description || '无描述' }}
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="产品ID">
            {{ video.productId }}
          </el-descriptions-item>

          <el-descriptions-item label="产品名称">
            {{ video.productName || '-' }}
          </el-descriptions-item>

          <el-descriptions-item label="视频时长">
            {{ formatDuration(video.duration) }}
          </el-descriptions-item>

          <el-descriptions-item label="文件大小">
            {{ formatFileSize(video.fileSize) }}
          </el-descriptions-item>

          <el-descriptions-item label="排序顺序">
            {{ video.sortOrder }}
          </el-descriptions-item>

          <el-descriptions-item label="创建时间">
            {{ formatDateTime(video.createTime) }}
          </el-descriptions-item>

          <el-descriptions-item label="视频URL" :span="2">
            <el-link :href="video.videoUrl" target="_blank" type="primary">
              {{ video.videoUrl }}
            </el-link>
          </el-descriptions-item>

          <el-descriptions-item v-if="video.coverUrl" label="封面URL" :span="2">
            <el-link :href="video.coverUrl" target="_blank" type="primary">
              {{ video.coverUrl }}
            </el-link>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty description="暂无视频信息" />
    </div>

    <template #footer>
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-player {
  width: 100%;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-element {
  width: 100%;
  max-height: 500px;
  display: block;
}

.video-info {
  width: 100%;
}

.description {
  max-height: 100px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: 500;
}

:deep(.el-descriptions__content) {
  word-break: break-all;
}
</style>
