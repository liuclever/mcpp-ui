<template>
  <div class="cms-content-list">
    <el-card>
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="类别">
            <el-select v-model="filterForm.categoryType" placeholder="全部类别" clearable @change="handleFilter">
              <el-option label="品牌故事" value="brand" />
              <el-option label="企业荣誉" value="honor" />
              <el-option label="领导来访" value="visit" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="全部状态" clearable @change="handleFilter">
              <el-option label="禁用" :value="0" />
              <el-option label="启用" :value="1" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="搜索">
            <el-input
              v-model="filterForm.keyword"
              placeholder="请输入标题关键词"
              clearable
              @clear="handleFilter"
              @keyup.enter="handleFilter"
              style="width: 200px"
            >
              <template #append>
                <el-button :icon="Search" @click="handleFilter" />
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增内容</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="categoryType" label="类别" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.categoryType)">
              {{ getCategoryLabel(row.categoryType) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="categoryId" label="类别ID" width="100" />
        
        <el-table-column prop="images" label="封面图" width="120">
          <template #default="{ row }">
            <el-image
              v-if="getCoverImage(row.images)"
              :src="getCoverImage(row.images)"
              :preview-src-list="getImageList(row.images)"
              fit="cover"
              style="width: 80px; height: 60px; border-radius: 4px;"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span v-else style="color: #909399;">无图片</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="images" label="图片数量" width="100">
          <template #default="{ row }">
            {{ getImageCount(row.images) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="sortOrder" label="排序" width="80" />
        
        <el-table-column prop="createTime" label="创建时间" width="180" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { cmsContentApi, type CMSContent } from '@/api/cms-content'

const router = useRouter()

// 筛选表单
const filterForm = reactive({
  categoryType: '',
  status: undefined as number | undefined,
  keyword: ''
})

// 表格数据
const tableData = ref<CMSContent[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 获取类别标签
const getCategoryLabel = (categoryType: string) => {
  const map: Record<string, string> = {
    brand: '品牌简介',
    honor: '企业荣誉',
    visit: '领导来访',
    custom: '自定义'
  }
  return map[categoryType] || categoryType
}

// 获取类别类型
const getCategoryType = (categoryType: string) => {
  const map: Record<string, any> = {
    brand: 'primary',
    honor: 'success',
    visit: 'warning',
    custom: 'info'
  }
  return map[categoryType] || ''
}

// 获取封面图片
const getCoverImage = (images: string) => {
  if (!images) return ''
  
  try {
    const imageList = typeof images === 'string' ? JSON.parse(images) : images
    if (Array.isArray(imageList) && imageList.length > 0) {
      return imageList[0]
    }
    return ''
  } catch (e) {
    console.error('解析图片数据失败:', images)
    return ''
  }
}

// 获取图片列表
const getImageList = (images: string) => {
  if (!images) return []
  try {
    const imageList = typeof images === 'string' ? JSON.parse(images) : images
    return Array.isArray(imageList) ? imageList : []
  } catch {
    return []
  }
}

// 获取图片数量
const getImageCount = (images: string) => {
  if (!images) return 0
  try {
    const imageList = typeof images === 'string' ? JSON.parse(images) : images
    return Array.isArray(imageList) ? imageList.length : 0
  } catch {
    return 0
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  
  try {
    // 检查登录状态
    const token = localStorage.getItem('admin_token')
    if (!token) {
      ElMessage.error('请先登录管理后台')
      router.push('/login')
      return
    }
    
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    if (filterForm.categoryType) {
      params.categoryType = filterForm.categoryType
    }
    
    if (filterForm.status !== undefined) {
      params.status = filterForm.status
    }
    
    if (filterForm.keyword) {
      params.keyword = filterForm.keyword
    }
    
    console.log('请求参数:', params)
    const result = await cmsContentApi.getList(params)
    console.log('API响应:', result)
    console.log('响应类型:', typeof result)
    console.log('响应结构:', {
      hasCode: 'code' in result,
      hasData: 'data' in result,
      codeValue: result.code,
      dataType: typeof result.data,
      dataKeys: result.data ? Object.keys(result.data) : []
    })
    
    // 处理响应数据
    if (result && result.code === 200 && result.data) {
      // 标准格式: {code: 200, data: {records: [], total: 0}}
      if (result.data.records && Array.isArray(result.data.records)) {
        tableData.value = result.data.records
        pagination.total = result.data.total || 0
        console.log('✅ 数据加载成功:', { 
          recordsCount: tableData.value.length, 
          total: pagination.total,
          firstRecord: tableData.value[0]
        })
      } else {
        console.error('❌ 数据格式错误: data中没有records数组')
        ElMessage.error('数据格式错误')
        tableData.value = []
        pagination.total = 0
      }
    } else {
      console.error('❌ 响应格式错误:', result)
      ElMessage.error('响应格式错误')
      tableData.value = []
      pagination.total = 0
    }
    
    if (tableData.value.length === 0) {
      console.log('⚠️ 没有数据')
    }
    
  } catch (error: any) {
    console.error('❌ 加载数据失败:', error)
    console.error('错误详情:', {
      message: error.message,
      response: error.response,
      status: error.response?.status
    })
    
    // 处理401错误
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      router.push('/login')
      return
    }
    
    ElMessage.error(error.response?.data?.message || error.message || '加载数据失败')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 筛选
const handleFilter = () => {
  pagination.page = 1
  loadData()
}

// 分页大小改变
const handleSizeChange = () => {
  loadData()
}

// 页码改变
const handlePageChange = () => {
  loadData()
}

// 新增
const handleAdd = () => {
  router.push('/cms/content/edit')
}

// 编辑
const handleEdit = (row: CMSContent) => {
  router.push(`/cms/content/edit?id=${row.id}`)
}

// 删除
const handleDelete = async (row: CMSContent) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该内容吗？删除后无法恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await cmsContentApi.delete(row.id!)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.cms-content-list {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
