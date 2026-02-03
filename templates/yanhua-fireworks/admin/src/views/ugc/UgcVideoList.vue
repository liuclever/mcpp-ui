<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getVideoList, deleteVideo, auditVideo, uploadVideo, type Video } from '@/api/ugc-video'

const loading = ref(false)
const tableData = ref<Video[]>([])
const total = ref(0)
const queryParams = ref({
  status: undefined as number | undefined,
  page: 1,
  pageSize: 20
})

// 上传对话框
const showUploadDialog = ref(false)
const uploadForm = ref({
  title: '',
  description: '',
  location: '',
  file: null as File | null
})
const uploading = ref(false)

// 状态选项
const statusOptions = [
  { label: '全部', value: undefined },
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '未通过', value: 2 }
]

// 加载视频列表
const loadVideos = async () => {
  loading.value = true
  try {
    const response = await getVideoList(queryParams.value)
    console.log('UGC视频列表完整响应:', response)
    
    // 响应拦截器已返回 response.data
    // response 是 ApiResponse { code, message, data }
    // response.data 是 PageResult { records, total, page, pageSize }
    const pageResult = response.data
    
    if (pageResult && pageResult.records) {
      tableData.value = pageResult.records
      total.value = pageResult.total || 0
      console.log('✅ 加载UGC视频列表成功:', pageResult.records.length, '个视频, 总数:', pageResult.total)
      if (pageResult.records.length > 0) {
        console.log('第一条视频数据:', pageResult.records[0])
      }
    } else {
      console.warn('⚠️ 响应数据结构异常:', response.data)
      tableData.value = []
      total.value = 0
    }
  } catch (error: any) {
    console.error('❌ 加载视频列表失败:', error)
    console.error('错误详情:', error.response)
    ElMessage.error(error.message || '加载失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.value.page = 1
  loadVideos()
}

// 重置
const handleReset = () => {
  queryParams.value = {
    status: undefined,
    page: 1,
    pageSize: 20
  }
  loadVideos()
}

// 分页
const handlePageChange = (page: number) => {
  queryParams.value.page = page
  loadVideos()
}

// 删除视频
const handleDelete = (row: Video) => {
  ElMessageBox.confirm(
    `确定删除视频"${row.title || '无标题'}"吗？`,
    '提示',
    { type: 'warning' }
  ).then(async () => {
    try {
      const res = await deleteVideo(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        loadVideos()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      console.error('删除视频失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 审核视频
const handleAudit = (row: Video, status: number) => {
  const statusText = status === 1 ? '通过' : '拒绝'
  ElMessageBox.confirm(
    `确定${statusText}该视频吗？`,
    '提示',
    { type: 'warning' }
  ).then(async () => {
    try {
      const res = await auditVideo(row.id, status)
      if (res.code === 200) {
        ElMessage.success(`${statusText}成功`)
        loadVideos()
      } else {
        ElMessage.error(res.message || `${statusText}失败`)
      }
    } catch (error) {
      console.error('审核视频失败:', error)
      ElMessage.error(`${statusText}失败`)
    }
  })
}

// 预览视频
const handlePreview = (row: Video) => {
  window.open(row.videoUrl, '_blank')
}

// 格式化状态
const formatStatus = (status: number) => {
  const map: Record<number, string> = {
    0: '待审核',
    1: '已通过',
    2: '未通过',
    3: '已删除'
  }
  return map[status] || '未知'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return dateStr.replace('T', ' ').substring(0, 19)
}

// 处理文件选择
const handleFileChange = (file: any) => {
  uploadForm.value.file = file.raw
  return false // 阻止自动上传
}

// 上传视频
const handleUpload = async () => {
  if (!uploadForm.value.file) {
    ElMessage.error('请选择视频文件')
    return
  }
  if (!uploadForm.value.title) {
    ElMessage.error('请输入视频标题')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', uploadForm.value.file)
    formData.append('title', uploadForm.value.title)
    if (uploadForm.value.description) {
      formData.append('description', uploadForm.value.description)
    }
    if (uploadForm.value.location) {
      formData.append('location', uploadForm.value.location)
    }

    // 使用统一的 API 调用，会自动使用配置的 baseURL 和 token
    const response = await uploadVideo(formData)
    
    if (response.code === 200) {
      ElMessage.success('上传成功')
      showUploadDialog.value = false
      uploadForm.value = {
        title: '',
        description: '',
        location: '',
        file: null
      }
      loadVideos()
    } else {
      ElMessage.error(response.message || '上传失败')
    }
  } catch (error: any) {
    console.error('上传视频失败:', error)
    ElMessage.error(error.response?.data?.message || error.message || '上传失败')
  } finally {
    uploading.value = false
  }
}

// 取消上传
const handleCancelUpload = () => {
  showUploadDialog.value = false
  uploadForm.value = {
    title: '',
    description: '',
    location: '',
    file: null
  }
}

onMounted(() => {
  loadVideos()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>UGC视频管理</span>
          <el-button type="primary" @click="showUploadDialog = true">上传视频</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :model="queryParams" inline>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="120">
          <template #default="{ row }">
            <el-image
              v-if="row.coverUrl"
              :src="row.coverUrl"
              fit="cover"
              style="width: 100px; height: 60px; border-radius: 4px"
              :preview-src-list="[row.coverUrl]"
            />
            <div v-else class="no-cover">无封面</div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150">
          <template #default="{ row }">
            {{ row.title || '无标题' }}
          </template>
        </el-table-column>
        <el-table-column label="发布者" width="150">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="30" :src="row.userAvatar" />
              <span style="margin-left: 8px">{{ row.userName || '未知用户' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="120" />
        <el-table-column prop="topics" label="话题" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.topics" type="info" size="small">{{ row.topics }}</el-tag>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>
        <el-table-column label="数据" width="200">
          <template #default="{ row }">
            <div class="stats">
              <span>👁️ {{ row.views }}</span>
              <span>❤️ {{ row.likes }}</span>
              <span>⭐ {{ row.collects }}</span>
              <span>💬 {{ row.comments }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 1 ? 'success' : row.status === 0 ? 'warning' : 'danger'"
            >
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handlePreview(row)">预览</el-button>
            <el-button
              v-if="row.status === 0"
              type="success"
              link
              @click="handleAudit(row, 1)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="warning"
              link
              @click="handleAudit(row, 2)"
            >
              拒绝
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.page"
        :page-size="queryParams.pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      title="上传视频"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="uploadForm" label-width="80px">
        <el-form-item label="视频文件" required>
          <el-upload
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
            accept="video/*"
            :file-list="[]"
          >
            <el-button type="primary">选择视频</el-button>
            <template #tip>
              <div class="el-upload__tip">
                {{ uploadForm.file ? `已选择: ${uploadForm.file.name}` : '支持MP4格式，最大100MB' }}
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频标题" required>
          <el-input v-model="uploadForm.title" placeholder="请输入视频标题" />
        </el-form-item>
        <el-form-item label="视频描述">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入视频描述"
          />
        </el-form-item>
        <el-form-item label="拍摄位置">
          <el-input v-model="uploadForm.location" placeholder="请输入拍摄位置" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancelUpload">取消</el-button>
        <el-button type="primary" :loading="uploading" @click="handleUpload">
          {{ uploading ? '上传中...' : '确定上传' }}
        </el-button>
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

.user-info {
  display: flex;
  align-items: center;
}

.stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.no-cover {
  width: 100px;
  height: 60px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #999;
  font-size: 12px;
}
</style>
