<template>
  <div class="service-list">
    <el-card>
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="分类">
            <el-select v-model="filterForm.category" placeholder="全部分类" clearable @change="handleFilter">
              <el-option label="使用指南" value="guide" />
              <el-option label="安全须知" value="safety" />
              <el-option label="常见问题" value="faq" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="全部状态" clearable @change="handleFilter">
              <el-option label="草稿" :value="0" />
              <el-option label="已发布" :value="1" />
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
        
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="subCategory" label="二级分类" width="120" show-overflow-tooltip />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="viewCount" label="浏览次数" width="100" />
        
        <el-table-column prop="sortOrder" label="排序" width="80" />
        
        <el-table-column prop="createTime" label="创建时间" width="180" />
        
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              link
              :type="row.status === 1 ? 'warning' : 'success'"
              size="small"
              @click="handlePublish(row)"
            >
              {{ row.status === 1 ? '取消发布' : '发布' }}
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

      <!-- 排序功能区域 -->
      <div class="sort-section" v-if="tableData.length > 0">
        <el-divider />
        <div style="margin-bottom: 10px">
          <el-alert
            title="提示：拖拽表格行可以调整显示顺序，调整后点击保存排序按钮"
            type="info"
            :closable="false"
          />
        </div>
        <el-button type="primary" @click="handleSaveSort" :loading="sortLoading">
          保存排序
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { serviceApi, type ServiceContent } from '@/api/service'
import Sortable from 'sortablejs'

const router = useRouter()

// 筛选表单
const filterForm = reactive({
  category: '',
  status: undefined as number | undefined,
  keyword: ''
})

// 表格数据
const tableData = ref<ServiceContent[]>([])
const loading = ref(false)
const sortLoading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    guide: '使用指南',
    safety: '安全须知',
    faq: '常见问题'
  }
  return map[category] || category
}

// 获取分类类型
const getCategoryType = (category: string) => {
  const map: Record<string, any> = {
    guide: 'primary',
    safety: 'danger',
    faq: 'warning'
  }
  return map[category] || ''
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    if (filterForm.category) {
      params.category = filterForm.category
    }
    
    if (filterForm.status !== undefined) {
      params.status = filterForm.status
    }
    
    if (filterForm.keyword) {
      params.keyword = filterForm.keyword
    }
    
    console.log('🚀 [服务中心] 发送请求参数:', params)
    const result = await serviceApi.getList(params)
    
    // 详细打印API响应结果
    console.log('📡 [服务中心] API完整响应:', result)
    console.log('📡 [服务中心] 响应状态码:', result?.status)
    console.log('📡 [服务中心] 响应头:', result?.headers)
    console.log('📡 [服务中心] 响应数据:', result?.data)
    
    // 检查响应数据结构
    if (result && result.data) {
      console.log('📊 [服务中心] 数据结构分析:')
      console.log('  - result.data:', result.data)
      console.log('  - result.data 类型:', typeof result.data)
      console.log('  - result.data.code:', result.data.code)
      console.log('  - result.data.message:', result.data.message)
      console.log('  - result.data.data:', result.data.data)
      
      // 根据实际的响应结构解析数据
      let pageResult = null
      
      // 情况1: 标准格式 { code, message, data: { total, records, ... } }
      if (result.data.code === 200 && result.data.data) {
        pageResult = result.data.data
        console.log('✅ [服务中心] 使用标准格式解析')
      }
      // 情况2: 直接格式 { total, records, ... }
      else if (result.data.total !== undefined && result.data.records) {
        pageResult = result.data
        console.log('✅ [服务中心] 使用直接格式解析')
      }
      // 情况3: 其他格式
      else {
        console.log('❌ [服务中心] 未知的响应格式')
        console.log('完整响应:', JSON.stringify(result.data, null, 2))
      }
      
      if (pageResult) {
        console.log('📋 [服务中心] 分页结果:', pageResult)
        console.log('📋 [服务中心] 总数:', pageResult.total)
        console.log('📋 [服务中心] 当前页:', pageResult.page)
        console.log('📋 [服务中心] 页大小:', pageResult.pageSize)
        console.log('📋 [服务中心] 记录数组:', pageResult.records)
        console.log('📋 [服务中心] 记录数量:', pageResult.records?.length || 0)
        
        // 设置表格数据
        tableData.value = pageResult.records || []
        pagination.total = pageResult.total || 0
        
        console.log('🎯 [服务中心] 最终设置的表格数据:', tableData.value)
        console.log('🎯 [服务中心] 最终设置的总数:', pagination.total)
        
        // 如果有数据，打印第一条记录的详细信息
        if (tableData.value.length > 0) {
          console.log('📝 [服务中心] 第一条记录详情:', tableData.value[0])
        } else {
          console.log('⚠️ [服务中心] 表格数据为空')
        }
      }
    } else {
      console.log('❌ [服务中心] API响应数据为空或格式错误')
      console.log('完整result:', result)
    }
  } catch (error: any) {
    console.error('💥 [服务中心] 加载数据失败:', error)
    console.error('💥 [服务中心] 错误详情:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    })
    ElMessage.error(error.message || '加载数据失败')
  } finally {
    loading.value = false
    console.log('🏁 [服务中心] 数据加载完成，loading状态:', loading.value)
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
  router.push('/service/edit')
}

// 编辑
const handleEdit = (row: ServiceContent) => {
  router.push(`/service/edit?id=${row.id}`)
}

// 发布/取消发布
const handlePublish = async (row: ServiceContent) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = row.status === 1 ? '取消发布' : '发布'
  try {
    await ElMessageBox.confirm(
      `确定要${action}该内容吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await serviceApi.publish(row.id!, newStatus)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || `${action}失败`)
    }
  }
}

// 删除
const handleDelete = async (row: ServiceContent) => {
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
    
    await serviceApi.delete(row.id!)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 保存排序
const handleSaveSort = async () => {
  sortLoading.value = true
  try {
    const items = tableData.value.map((item, index) => ({
      id: item.id!,
      sortOrder: index
    }))
    
    await serviceApi.updateSort(items)
    ElMessage.success('排序保存成功')
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '保存排序失败')
  } finally {
    sortLoading.value = false
  }
}

// 初始化拖拽排序
const initSortable = () => {
  const table = document.querySelector('.el-table__body-wrapper tbody') as HTMLElement
  if (table) {
    Sortable.create(table, {
      animation: 150,
      onEnd: (evt: any) => {
        const oldIndex = evt.oldIndex
        const newIndex = evt.newIndex
        
        if (oldIndex !== newIndex) {
          const movedItem = tableData.value.splice(oldIndex, 1)[0]
          tableData.value.splice(newIndex, 0, movedItem)
        }
      }
    })
  }
}

onMounted(() => {
  loadData()
  // 延迟初始化拖拽，确保表格已渲染
  setTimeout(() => {
    initSortable()
  }, 500)
})
</script>

<style scoped>
.service-list {
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

.sort-section {
  margin-top: 20px;
}
</style>
