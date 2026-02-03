<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/api/product'
import type { Category } from '@/api/types'

// 扩展 Category 类型以支持 children
interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[]
}

const loading = ref(false)
const tableData = ref<CategoryWithChildren[]>([])
const parentCategories = ref<Category[]>([])

const dialogVisible = ref(false)
const dialogTitle = computed(() => form.value.id ? '编辑分类' : '新增分类')
const form = ref<Partial<Category>>({ 
  id: undefined, 
  parentId: 0,
  name: '', 
  code: '', 
  icon: '',
  sort: 0, 
  status: 1 
})

// 加载分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    const response = await getCategories()
    
    if (response.code === 200) {
      const categories = response.data || []
      
      // 后端已经返回了树形结构，直接使用
      // 只需要过滤出父分类（parentId为0的）
      tableData.value = categories.filter((cat: CategoryWithChildren) => !cat.parentId || cat.parentId === 0)
      
      // 保存父分类列表用于下拉选择
      parentCategories.value = tableData.value
      
      console.log('分类树结构:', tableData.value)
    } else {
      ElMessage.error(response.message || '获取分类列表失败')
    }
  } catch (error: any) {
    console.error('加载分类失败', error)
    ElMessage.error(error.message || '获取分类列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  form.value = { 
    id: undefined, 
    parentId: 0,
    name: '', 
    code: '', 
    icon: '',
    sort: 0, 
    status: 1 
  }
  dialogVisible.value = true
}

const handleEdit = (row: Category) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row: CategoryWithChildren) => {
  try {
    // 检查是否有子分类
    const hasChildren = row.children && row.children.length > 0
    let confirmMessage = '确定删除该分类吗？'
    
    if (hasChildren) {
      // 统计子分类数量
      const childCount = row.children!.length
      confirmMessage = `该分类下还有 ${childCount} 个子分类，删除后将全部删除，是否确定？`
    }
    
    await ElMessageBox.confirm(confirmMessage, '警告', { 
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    
    const response = await deleteCategory(row.id)
    
    if (response.code === 200) {
      ElMessage.success(response.message || '删除成功')
      loadCategories()
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

// 状态切换处理
const handleStatusChange = async (row: Category) => {
  try {
    const response = await updateCategory(row)
    
    if (response.code === 200) {
      ElMessage.success('状态更新成功')
      // 不需要重新加载，因为状态已经在界面上更新了
    } else {
      ElMessage.error(response.message || '状态更新失败')
      // 失败时恢复原状态
      row.status = row.status === 1 ? 0 : 1
    }
  } catch (error: any) {
    console.error('状态更新失败', error)
    ElMessage.error(error.message || '状态更新失败')
    // 失败时恢复原状态
    row.status = row.status === 1 ? 0 : 1
  }
}

const handleSubmit = async () => {
  // 表单验证
  if (!form.value.name || !form.value.name.trim()) {
    ElMessage.error('分类名称不能为空')
    return
  }
  if (!form.value.code || !form.value.code.trim()) {
    ElMessage.error('分类代码不能为空')
    return
  }
  
  try {
    let response
    if (form.value.id) {
      // 更新
      response = await updateCategory(form.value as Category)
    } else {
      // 新增
      response = await addCategory(form.value)
    }
    
    if (response.code === 200) {
      ElMessage.success(form.value.id ? '更新成功' : '添加成功')
      dialogVisible.value = false
      loadCategories()
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error: any) {
    console.error('保存失败', error)
    ElMessage.error(error.message || '操作失败')
  }
}

// 初始化
onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleAdd">新增分类</el-button>
        </div>
      </template>
      
      <!-- 树形表格 -->
      <el-table 
        :data="tableData" 
        v-loading="loading" 
        stripe
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="code" label="分类代码" width="150" />
        <el-table-column prop="icon" label="图标" width="200">
          <template #default="{ row }">
            <span v-if="row.icon" class="icon-preview">
              <img :src="row.icon" alt="icon" style="width: 24px; height: 24px; vertical-align: middle;" />
              <span style="margin-left: 8px;">{{ row.icon }}</span>
            </span>
            <span v-else style="color: #999;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch 
              v-model="row.status" 
              :active-value="1" 
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="父级分类">
          <el-select v-model="form.parentId" placeholder="请选择(留空为父分类)" clearable style="width: 100%">
            <el-option label="无(作为父分类)" :value="0" />
            <el-option 
              v-for="cat in parentCategories" 
              :key="cat.id" 
              :label="cat.name" 
              :value="cat.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" required>
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类代码" required>
          <el-input v-model="form.code" placeholder="请输入分类代码" />
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="form.icon" placeholder="请输入图标URL" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-preview {
  display: inline-flex;
  align-items: center;
}

/* 树形表格样式优化 */
:deep(.el-table__expand-icon) {
  font-size: 14px;
}

:deep(.el-table__placeholder) {
  display: inline-block;
  width: 20px;
}
</style>
