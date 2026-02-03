<template>
  <div class="file-manager">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>文件管理</span>
          <div class="header-actions">
            <el-radio-group v-model="fileType" @change="handleTypeChange">
              <el-radio-button label="image">图片</el-radio-button>
              <el-radio-button label="video">视频</el-radio-button>
            </el-radio-group>
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :accept="fileType === 'image' ? 'image/*' : 'video/*'"
              multiple
              style="display: inline-block; margin-left: 10px;"
            >
              <el-button type="primary" :icon="Upload">上传文件</el-button>
            </el-upload>
          </div>
        </div>
      </template>

      <!-- 文件网格 -->
      <div v-loading="loading" class="file-grid">
        <div 
          v-for="file in files" 
          :key="file.id"
          class="file-item"
          :class="{ 'selected': selectedFiles.includes(file.id!) }"
          @click="toggleSelect(file.id!)"
        >
          <!-- 图片预览 -->
          <div class="file-preview" v-if="fileType === 'image'">
            <el-image
              :src="file.fileUrl"
              :preview-src-list="[file.fileUrl]"
              fit="cover"
              class="preview-image"
              @click.stop
            />
          </div>
          
          <!-- 视频预览 -->
          <div class="file-preview" v-else>
            <video 
              :src="file.fileUrl" 
              :poster="file.coverUrl"
              class="preview-video"
              controls
              @click.stop
            />
          </div>
          
          <!-- 文件信息 -->
          <div class="file-info">
            <div class="file-name" :title="file.fileName">
              {{ file.fileName }}
            </div>
            <div class="file-meta">
              <span class="file-size">{{ formatFileSize(file.fileSize) }}</span>
              <span class="file-time">{{ formatTime(file.uploadTime) }}</span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="file-actions" @click.stop>
            <el-button 
              size="small" 
              :icon="CopyDocument"
              @click="copyUrl(file.fileUrl)"
            >
              复制链接
            </el-button>
            <el-button 
              size="small" 
              type="danger"
              :icon="Delete"
              @click="handleDelete(file)"
            >
              删除
            </el-button>
          </div>
          
          <!-- 选中标记 -->
          <div class="select-mark" v-if="selectedFiles.includes(file.id!)">
            <el-icon><Check /></el-icon>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty 
        v-if="!loading && files.length === 0" 
        description="暂无文件"
      />

      <!-- 批量操作 -->
      <div class="batch-actions" v-if="selectedFiles.length > 0">
        <el-button type="danger" @click="handleBatchDelete">
          批量删除 ({{ selectedFiles.length }})
        </el-button>
        <el-button @click="clearSelection">取消选择</el-button>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[20, 40, 60, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, CopyDocument, Delete, Check } from '@element-plus/icons-vue'
import { fileApi, type FileInfo } from '@/api/file'

// 文件类型
const fileType = ref<'image' | 'video'>('image')

// 文件列表
const files = ref<FileInfo[]>([])
const loading = ref(false)

// 选中的文件
const selectedFiles = ref<number[]>([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 上传配置
const uploadUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  return fileType.value === 'image' 
    ? `${baseUrl}/api/admin/upload/image`
    : `${baseUrl}/api/admin/upload/video`
})

const uploadHeaders = computed(() => ({
  'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
}))

// 加载文件列表
const loadFiles = async () => {
  loading.value = true
  try {
    const res = await fileApi.getList({
      type: fileType.value,
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    
    if (res.data && res.data.data) {
      const pageResult = res.data.data
      files.value = pageResult.records || pageResult.list || []
      pagination.total = pageResult.total || 0
    }
  } catch (error: any) {
    ElMessage.error('加载文件列表失败：' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 文件类型改变
const handleTypeChange = () => {
  pagination.page = 1
  selectedFiles.value = []
  loadFiles()
}

// 分页改变
const handleSizeChange = () => {
  loadFiles()
}

const handlePageChange = () => {
  loadFiles()
}

// 上传前验证
const beforeUpload = (file: File) => {
  if (fileType.value === 'image') {
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isImage) {
      ElMessage.error('只能上传图片文件!')
      return false
    }
    if (!isLt5M) {
      ElMessage.error('图片大小不能超过 5MB!')
      return false
    }
  } else {
    const isVideo = file.type.startsWith('video/')
    const isLt100M = file.size / 1024 / 1024 < 100

    if (!isVideo) {
      ElMessage.error('只能上传视频文件!')
      return false
    }
    if (!isLt100M) {
      ElMessage.error('视频大小不能超过 100MB!')
      return false
    }
  }
  return true
}

// 上传成功
const handleUploadSuccess = (response: any) => {
  if (response.code === 200) {
    ElMessage.success('上传成功')
    loadFiles()
  } else {
    ElMessage.error('上传失败：' + (response.message || '未知错误'))
  }
}

// 上传失败
const handleUploadError = (error: any) => {
  ElMessage.error('上传失败：' + (error.message || '未知错误'))
}

// 切换选中状态
const toggleSelect = (id: number) => {
  const index = selectedFiles.value.indexOf(id)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(id)
  }
}

// 清除选择
const clearSelection = () => {
  selectedFiles.value = []
}

// 复制URL
const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = url
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('链接已复制到剪贴板')
  }
}

// 删除文件
const handleDelete = async (file: FileInfo) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该文件吗？删除后无法恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await fileApi.delete(file.id!)
    ElMessage.success('删除成功')
    loadFiles()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + (error.message || '未知错误'))
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedFiles.value.length} 个文件吗？删除后无法恢复！`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 逐个删除
    for (const id of selectedFiles.value) {
      await fileApi.delete(id)
    }
    
    ElMessage.success('批量删除成功')
    selectedFiles.value = []
    loadFiles()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败：' + (error.message || '未知错误'))
    }
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 格式化时间
const formatTime = (time?: string): string => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.file-manager {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  min-height: 200px;
}

.file-item {
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.file-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.file-item.selected {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.file-preview {
  width: 100%;
  height: 180px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-info {
  padding: 12px;
  background-color: #fff;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8px;
}

.file-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.file-actions {
  padding: 8px 12px;
  background-color: #f5f7fa;
  display: flex;
  gap: 8px;
  border-top: 1px solid #e4e7ed;
}

.file-actions .el-button {
  flex: 1;
}

.select-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.batch-actions {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  gap: 10px;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
