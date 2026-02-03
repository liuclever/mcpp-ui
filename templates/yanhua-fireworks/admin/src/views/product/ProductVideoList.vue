<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getProductVideoList, deleteProductVideo } from '@/api/product-video'
import { getProductDetail } from '@/api/product'
import type { ProductVideo, Product } from '@/api/types'
import ProductVideoUploadDialog from '@/components/ProductVideoUploadDialog.vue'
import ProductVideoPreviewDialog from '@/components/ProductVideoPreviewDialog.vue'
import ProductVideoEditDialog from '@/components/ProductVideoEditDialog.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const tableData = ref<ProductVideo[]>([])
const product = ref<Product | null>(null)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const statusFilter = ref<number | undefined>(undefined)

// 上传对话框
const showUploadDialog = ref(false)

// 预览对话框
const showPreviewDialog = ref(false)
const selectedVideo = ref<ProductVideo | null>(null)

// 编辑对话框
const showEditDialog = ref(false)
const editingVideo = ref<ProductVideo | null>(null)

// 产品ID（从路由参数获取）
const productId = computed(() => {
  return Number(route.params.productId)
})

// 状态选项
const statusOptions = [
  { label: '全部', value: undefined },
  { label: '待审核', value: 0 },
  { label: '已发布', value: 1 },
  { label: '已拒绝', value: 2 }
]

// 获取状态标签类型
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case 2:
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '待审核'
    case 1:
      return '已发布'
    case 2:
      return '已拒绝'
    default:
      return '未知'
  }
}

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

// 加载产品信息
const loadProduct = async () => {
  try {
    const response = await getProductDetail(productId.value)
    
    if (response.code === 200) {
      product.value = response.data
    } else {
      ElMessage.error(response.message || '获取产品信息失败')
    }
  } catch (error: any) {
    console.error('加载产品信息失败', error)
    ElMessage.error(error.message || '获取产品信息失败')
  }
}

// 加载产品视频列表
const loadProductVideos = async () => {
  loading.value = true
  try {
    const response = await getProductVideoList(productId.value, {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: statusFilter.value
    })
    
    if (response.code === 200) {
      tableData.value = response.data.records
      total.value = response.data.total
    } else {
      ElMessage.error(response.message || '获取产品视频列表失败')
    }
  } catch (error: any) {
    console.error('加载产品视频列表失败', error)
    ElMessage.error(error.message || '获取产品视频列表失败')
  } finally {
    loading.value = false
  }
}

// 上传视频
const handleUpload = () => {
  showUploadDialog.value = true
}

// 上传成功回调
const handleUploadSuccess = () => {
  loadProductVideos()
}

// 预览视频
const handlePreview = (row: ProductVideo) => {
  selectedVideo.value = row
  showPreviewDialog.value = true
}

// 编辑视频
const handleEdit = (row: ProductVideo) => {
  editingVideo.value = row
  showEditDialog.value = true
}

// 编辑成功回调
const handleEditSuccess = () => {
  loadProductVideos()
}

// 删除视频
const handleDelete = async (row: ProductVideo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除视频"${row.title}"吗？删除后将无法恢复。`, 
      '删除确认', 
      { 
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )
    
    const response = await deleteProductVideo(row.id)
    
    if (response.code === 200) {
      ElMessage.success('删除成功')
      // 如果当前页没有数据了，返回上一页
      if (tableData.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
      loadProductVideos()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 状态筛选变化
const handleStatusChange = () => {
  currentPage.value = 1
  loadProductVideos()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadProductVideos()
}

// 返回产品列表
const handleBack = () => {
  router.push('/product/list')
}

// 初始化
onMounted(() => {
  loadProduct()
  loadProductVideos()
})
</script>

<template>
  <div class="page-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/product/list' }">产品管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="product">{{ product.name }}</el-breadcrumb-item>
      <el-breadcrumb-item>视频管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="main-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button link @click="handleBack" class="back-button">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <span class="title">产品视频管理</span>
            <span v-if="product" class="product-name">{{ product.name }}</span>
          </div>
          <el-button type="primary" @click="handleUpload">上传视频</el-button>
        </div>
      </template>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-select 
          v-model="statusFilter" 
          placeholder="状态筛选" 
          style="width: 150px"
          @change="handleStatusChange"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <!-- 视频列表 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="120">
          <template #default="{ row }">
            <el-image
              v-if="row.coverUrl"
              :src="row.coverUrl"
              fit="cover"
              style="width: 80px; height: 60px; border-radius: 4px;"
              :preview-src-list="[row.coverUrl]"
            />
            <span v-else style="color: #909399;">无封面</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column label="时长" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handlePreview(row)">预览</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 上传对话框 -->
    <ProductVideoUploadDialog
      v-model:visible="showUploadDialog"
      :product-id="productId"
      @success="handleUploadSuccess"
    />

    <!-- 预览对话框 -->
    <ProductVideoPreviewDialog
      v-model:visible="showPreviewDialog"
      :video="selectedVideo"
    />

    <!-- 编辑对话框 -->
    <ProductVideoEditDialog
      v-model:visible="showEditDialog"
      :video="editingVideo"
      @success="handleEditSuccess"
    />
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.main-card {
  margin-top: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  padding: 0;
  font-size: 14px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.product-name {
  font-size: 14px;
  color: #606266;
  padding: 4px 12px;
  background-color: #f4f4f5;
  border-radius: 4px;
}

.filter-bar {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
