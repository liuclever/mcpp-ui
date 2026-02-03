<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductList } from '@/api/product'

const loading = ref(false)
const tableData = ref([
  { id: 1, productName: '愤怒的小鸟A', videoUrl: '', duration: '01:05', views: 628, status: 1 },
  { id: 2, productName: '福临门', videoUrl: '', duration: '00:58', views: 432, status: 1 },
])

const dialogVisible = ref(false)
const form = ref({ productId: '', videoUrl: '' })
const productList = ref<any[]>([])

// 加载产品列表
const loadProducts = async () => {
  try {
    const response = await getProductList({ page: 1, pageSize: 100 })
    console.log('产品列表响应:', response)
    
    // 处理响应数据
    if (response && response.code === 200) {
      const pageResult = response.data
      const list = pageResult?.records || []
      productList.value = list
      console.log('加载产品列表成功:', list.length, '个产品')
    } else {
      const errorMsg = response?.message || '加载产品列表失败'
      console.error('加载产品列表失败:', errorMsg)
      ElMessage.error(errorMsg)
    }
  } catch (error: any) {
    console.error('加载产品列表异常:', error)
    ElMessage.error(error.message || '加载产品列表失败')
  }
}

const handleUpload = () => {
  form.value = { productId: '', videoUrl: '' }
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定删除该视频吗？', '提示', { type: 'warning' }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleSubmit = () => {
  if (!form.value.productId) {
    ElMessage.warning('请选择关联产品')
    return
  }
  ElMessage.success('上传成功')
  dialogVisible.value = false
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>视频管理</span>
          <el-button type="primary" @click="handleUpload">上传视频</el-button>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="productName" label="关联产品" />
        <el-table-column label="视频预览" width="200">
          <template #default>
            <div class="video-preview">
              <el-icon :size="40"><VideoPlay /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" />
        <el-table-column prop="views" label="播放量" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已发布' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link>预览</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="上传视频" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="关联产品">
          <el-select 
            v-model="form.productId" 
            placeholder="请选择产品" 
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="product in productList"
              :key="product.id"
              :label="`${product.name} (${product.code})`"
              :value="product.id"
            >
              <span style="float: left">{{ product.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ product.code }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload action="#" :auto-upload="false" accept="video/*">
            <el-button type="primary">选择视频</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">上传</el-button>
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
.video-preview {
  width: 160px;
  height: 90px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
</style>
