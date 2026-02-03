<template>
  <div class="column-list-container">
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">栏目管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增栏目
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="columns"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="name" label="栏目名称" width="150" />
        
        <el-table-column prop="type" label="栏目类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ typeMap[row.type] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="displayMode" label="展示形式" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.displayMode === 'text'" type="info">文字标题</el-tag>
            <el-tag v-else-if="row.displayMode === 'image-text'" type="success">图文</el-tag>
            <el-tag v-else-if="row.displayMode === 'image-grid'" type="warning">图片列表</el-tag>
            <el-tag v-else type="info">未设置</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="简介" min-width="200" show-overflow-tooltip />

        <el-table-column prop="sortOrder" label="排序" width="80" align="center" />

        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="isSystem" label="系统预设" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isSystem" type="info" size="small">是</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              :disabled="row.isSystem"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="栏目名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入栏目名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="栏目类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择栏目类型" style="width: 100%">
            <el-option label="单页" value="single" />
            <el-option label="列表页" value="list" />
            <el-option label="地图页" value="map" />
            <el-option label="表单页" value="form" />
          </el-select>
        </el-form-item>

        <el-form-item label="展示形式" prop="displayMode">
          <el-select v-model="formData.displayMode" placeholder="请选择展示形式" style="width: 100%">
            <el-option label="文字标题" value="text">
              <div>
                <div style="font-weight: 600;">文字标题</div>
                <div style="font-size: 12px; color: #999; margin-top: 4px;">
                  只显示标题和文字摘要,适合文字为主的内容
                </div>
              </div>
            </el-option>
            <el-option label="图文" value="image-text">
              <div>
                <div style="font-weight: 600;">图文</div>
                <div style="font-size: 12px; color: #999; margin-top: 4px;">
                  显示标题、封面图片和文字摘要,适合图文结合的内容
                </div>
              </div>
            </el-option>
            <el-option label="图片列表" value="image-grid">
              <div>
                <div style="font-weight: 600;">图片列表</div>
                <div style="font-size: 12px; color: #999; margin-top: 4px;">
                  网格布局显示多张图片,适合图片为主的内容
                </div>
              </div>
            </el-option>
          </el-select>
          <el-text type="info" size="small" style="margin-top: 8px; display: block">
            展示形式决定了内容在小程序端的显示方式
          </el-text>
        </el-form-item>

        <el-form-item label="栏目简介">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入栏目简介"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="排序权重" prop="sortOrder">
          <el-input-number
            v-model="formData.sortOrder"
            :min="0"
            :max="9999"
            style="width: 200px"
          />
          <el-text type="info" size="small" style="margin-left: 10px">
            数字越小越靠前
          </el-text>
        </el-form-item>

        <el-form-item label="启用状态">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getAllColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  updateColumnStatus,
  type ColumnConfig
} from '@/api/column'

// 表单引用
const formRef = ref<FormInstance>()

// 数据状态
const loading = ref(false)
const columns = ref<ColumnConfig[]>([])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('新增栏目')
const isEdit = ref(false)
const submitting = ref(false)

// 表单数据
const formData = reactive<ColumnConfig>({
  name: '',
  type: 'single',
  displayMode: 'image-text',
  icon: '',
  description: '',
  sortOrder: 0,
  enabled: true,
  isSystem: false
})

// 上传配置
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/upload/image'
const uploadHeaders = {
  Authorization: 'Bearer ' + localStorage.getItem('admin_token')
}

// 类型映射
const typeMap: Record<string, string> = {
  single: '单页',
  list: '列表页',
  map: '地图页',
  form: '表单页'
}

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入栏目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '栏目名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择栏目类型', trigger: 'change' }
  ],
  sortOrder: [
    { required: true, message: '请输入排序权重', trigger: 'blur' }
  ]
}

// 获取类型标签颜色
const getTypeTagType = (type: string) => {
  const typeColors: Record<string, any> = {
    single: 'success',
    list: 'primary',
    map: 'warning',
    form: 'danger'
  }
  return typeColors[type] || ''
}

// 加载栏目列表
const loadColumns = async () => {
  loading.value = true
  try {
    const response: any = await getAllColumns()
    // 响应拦截器已返回response.data，所以直接访问code
    if (response.code === 200) {
      columns.value = response.data || []
    } else {
      ElMessage.error(response.message || '加载栏目列表失败')
    }
  } catch (error) {
    console.error('加载栏目列表失败:', error)
    ElMessage.error('加载栏目列表失败')
  } finally {
    loading.value = false
  }
}

// 新增栏目
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增栏目'
  resetForm()
  dialogVisible.value = true
}

// 编辑栏目
const handleEdit = (row: ColumnConfig) => {
  isEdit.value = true
  dialogTitle.value = '编辑栏目'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除栏目
const handleDelete = async (row: ColumnConfig) => {
  if (row.isSystem) {
    ElMessage.warning('系统预设栏目不能删除')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除栏目"${row.name}"吗？删除后该栏目下的所有内容也将被删除。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response: any = await deleteColumn(row.id!)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadColumns()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除栏目失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 更新状态
const handleStatusChange = async (row: ColumnConfig) => {
  try {
    const response: any = await updateColumnStatus(row.id!, row.enabled!)
    if (response.code === 200) {
      ElMessage.success('状态更新成功')
    } else {
      ElMessage.error(response.message || '状态更新失败')
      // 恢复原状态
      row.enabled = !row.enabled
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('状态更新失败')
    // 恢复原状态
    row.enabled = !row.enabled
  }
}

// 图标上传成功
const handleIconSuccess = (response: any) => {
  if (response.code === 200) {
    formData.icon = response.data.url
    ElMessage.success('图标上传成功')
  } else {
    ElMessage.error(response.message || '图标上传失败')
  }
}

// 图标上传前验证
const beforeIconUpload = (file: File) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt1M) {
    ElMessage.error('图片大小不能超过 1MB!')
    return false
  }
  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitting.value = true

    if (isEdit.value) {
      console.log('📋 更新栏目 - formData:', JSON.stringify(formData))
      console.log('📋 更新栏目 - displayMode:', formData.displayMode)
      const response: any = await updateColumn(formData.id!, formData)
      console.log('📋 更新栏目 - response:', response)
      if (response.code === 200) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        loadColumns()
      } else {
        ElMessage.error(response.message || '更新失败')
      }
    } else {
      const response: any = await createColumn(formData)
      if (response.code === 200) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        loadColumns()
      } else {
        ElMessage.error(response.message || '创建失败')
      }
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('提交失败:', error)
      ElMessage.error(error.message || '提交失败')
    }
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.id = undefined
  formData.name = ''
  formData.type = 'single'
  formData.displayMode = 'image-text'
  formData.icon = ''
  formData.description = ''
  formData.sortOrder = 0
  formData.enabled = true
  formData.isSystem = false
  formRef.value?.clearValidate()
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 页面加载时获取栏目列表
onMounted(() => {
  loadColumns()
})
</script>

<style scoped lang="scss">
.column-list-container {
  padding: 20px;
}

.list-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
}

.column-icon {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.no-icon {
  color: #999;
}

.icon-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .icon-preview {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }

  .icon-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }
}
</style>
