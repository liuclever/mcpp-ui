<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStoreList, addStore, updateStore, deleteStore } from '@/api/store'
import type { Store } from '@/api/types'

const loading = ref(false)
const tableData = ref<Store[]>([])

const searchForm = reactive({
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增门店')
const form = ref<Partial<Store>>({
  name: '',
  address: '',
  phone: '',
  latitude: 0,
  longitude: 0,
  businessHours: '09:00-18:00',
  status: 1
})

// 加载门店列表
const loadStoreList = async () => {
  loading.value = true
  try {
    const response = await getStoreList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined
    })
    
    if (response.code === 200) {
      tableData.value = response.data.records
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.message || '获取门店列表失败')
    }
  } catch (error: any) {
    console.error('获取门店列表失败:', error)
    ElMessage.error(error.message || '获取门店列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadStoreList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  pagination.page = 1
  loadStoreList()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadStoreList()
}

// 新增门店
const handleAdd = () => {
  dialogTitle.value = '新增门店'
  form.value = {
    name: '',
    address: '',
    phone: '',
    latitude: 0,
    longitude: 0,
    businessHours: '09:00-18:00',
    status: 1
  }
  dialogVisible.value = true
}

// 编辑门店
const handleEdit = (row: Store) => {
  dialogTitle.value = '编辑门店'
  form.value = { ...row }
  dialogVisible.value = true
}

// 删除门店
const handleDelete = async (row: Store) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除门店"${row.name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteStore(row.id)
    
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadStoreList()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除门店失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  // 验证表单
  if (!form.value.name) {
    ElMessage.warning('请输入门店名称')
    return
  }
  if (!form.value.address) {
    ElMessage.warning('请输入门店地址')
    return
  }
  if (!form.value.phone) {
    ElMessage.warning('请输入联系电话')
    return
  }
  
  try {
    let response
    if (form.value.id) {
      // 更新
      response = await updateStore(form.value as Store)
    } else {
      // 新增
      response = await addStore(form.value)
    }
    
    if (response.code === 200) {
      ElMessage.success(form.value.id ? '更新成功' : '添加成功')
      dialogVisible.value = false
      loadStoreList()
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error: any) {
    console.error('保存门店失败:', error)
    ElMessage.error(error.message || '操作失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadStoreList()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="门店名称/地址/电话" clearable style="width: 250px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>门店列表</span>
          <el-button type="primary" @click="handleAdd">新增门店</el-button>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="门店名称" min-width="150" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="businessHours" label="营业时间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '营业中' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="门店名称" required>
          <el-input v-model="form.name" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店地址" required>
          <el-input v-model="form.address" placeholder="请输入门店地址" />
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="营业时间">
          <el-input v-model="form.businessHours" placeholder="例如：09:00-18:00" />
        </el-form-item>
        <el-form-item label="经纬度">
          <div style="display: flex; gap: 10px;">
            <el-input-number v-model="form.latitude" :precision="6" placeholder="纬度" style="flex: 1;" />
            <el-input-number v-model="form.longitude" :precision="6" placeholder="经度" style="flex: 1;" />
          </div>
          <div style="color: #999; font-size: 12px; margin-top: 5px;">
            提示：可以在地图上获取门店的经纬度坐标
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">营业中</el-radio>
            <el-radio :label="0">已关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
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
</style>
