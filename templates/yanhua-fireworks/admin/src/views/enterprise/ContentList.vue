<template>
  <div class="enterprise-content-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>企业中心内容管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增内容</el-button>
        </div>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="所属栏目">
            <el-select 
              v-model="filterForm.columnId" 
              placeholder="全部栏目" 
              clearable 
              @change="handleFilter"
              style="width: 200px"
            >
              <el-option
                v-for="column in columns"
                :key="column.id"
                :label="column.name"
                :value="column.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select 
              v-model="filterForm.status" 
              placeholder="全部状态" 
              clearable 
              @change="handleFilter"
              style="width: 150px"
            >
              <el-option label="草稿" value="draft" />
              <el-option label="已发布" value="published" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="搜索">
            <el-input
              v-model="filterForm.keyword"
              placeholder="请输入标题关键词"
              clearable
              @clear="handleFilter"
              @keyup.enter="handleFilter"
              style="width: 250px"
            >
              <template #append>
                <el-button :icon="Search" @click="handleFilter" />
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column prop="coverImage" label="封面" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.coverImage"
              :src="row.coverImage"
              :preview-src-list="[row.coverImage]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
            />
            <span v-else style="color: #ccc;">无封面</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="columnId" label="所属栏目" width="150">
          <template #default="{ row }">
            {{ getColumnName(row.columnId) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="viewCount" label="浏览次数" width="100" />
        
        <el-table-column prop="publishTime" label="发布时间" width="180" />
        
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

      <!-- 批量操作 -->
      <div class="batch-actions" v-if="selectedIds.length > 0">
        <el-button type="danger" @click="handleBatchDelete">
          批量删除 ({{ selectedIds.length }})
        </el-button>
      </div>

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
import { Search, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { enterpriseContentApi, type EnterpriseContent } from '@/api/enterprise-content'

const router = useRouter()

// 栏目列表
const columns = ref<any[]>([])

// 筛选表单
const filterForm = reactive({
  columnId: undefined as number | undefined,
  status: '',
  keyword: ''
})

// 表格数据
const tableData = ref<EnterpriseContent[]>([])
const loading = ref(false)

// 选中的行
const selectedIds = ref<number[]>([])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 加载栏目列表
const loadColumns = async () => {
  try {
    const { getAllColumns } = await import('@/api/column')
    const response: any = await getAllColumns()
    if (response.code === 200 && response.data) {
      columns.value = response.data
    } else {
      console.error('加载栏目列表失败:', response.message)
    }
  } catch (error: any) {
    console.error('加载栏目列表失败:', error)
  }
}

// 获取栏目名称
const getColumnName = (columnId: number) => {
  const column = columns.value.find(c => c.id === columnId)
  return column ? column.name : '未知栏目'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    if (filterForm.columnId) {
      params.columnId = filterForm.columnId
    }
    
    if (filterForm.status) {
      params.status = filterForm.status
    }
    
    if (filterForm.keyword) {
      params.keyword = filterForm.keyword
    }
    
    const result = await enterpriseContentApi.getList(params)
    console.log('API响应:', result)
    if (result && result.code === 200 && result.data) {
      const pageResult = result.data
      tableData.value = pageResult.records || pageResult.list || []
      pagination.total = pageResult.total || 0
      console.log('数据加载成功:', { count: tableData.value.length, total: pagination.total })
    } else {
      console.error('响应格式错误:', result)
      tableData.value = []
      pagination.total = 0
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败')
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

// 选择改变
const handleSelectionChange = (selection: EnterpriseContent[]) => {
  selectedIds.value = selection.map(item => item.id!).filter(id => id !== undefined)
}

// 新增
const handleAdd = () => {
  router.push('/enterprise/content/edit')
}

// 编辑
const handleEdit = (row: EnterpriseContent) => {
  router.push(`/enterprise/content/edit?id=${row.id}`)
}

// 删除
const handleDelete = async (row: EnterpriseContent) => {
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
    
    await enterpriseContentApi.delete(row.id!)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条内容吗？删除后无法恢复！`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await enterpriseContentApi.batchDelete(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '批量删除失败')
    }
  }
}

onMounted(() => {
  loadColumns()
  loadData()
})
</script>

<style scoped>
.enterprise-content-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
}

.batch-actions {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
