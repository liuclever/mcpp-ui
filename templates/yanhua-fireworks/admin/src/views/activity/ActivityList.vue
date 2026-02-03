<template>
  <div class="activity-list-container">
    <el-card>
      <!-- 头部操作栏 -->
      <div class="header-actions">
        <h2>活动话题管理</h2>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加话题
        </el-button>
      </div>

      <!-- 话题列表表格 -->
      <el-table 
        :data="activityList" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="话题名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否Banner" width="120">
          <template #default="{ row }">
            <el-switch
              v-model="row.isBanner"
              :active-value="1"
              :inactive-value="0"
              @change="handleToggleBanner(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '下线' : '上线' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty 
        v-if="!loading && activityList.length === 0" 
        description="暂无话题"
      ></el-empty>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle"
      width="600px"
    >
      <el-form 
        ref="formRef"
        :model="formData" 
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="话题名称" prop="name">
          <el-input 
            v-model="formData.name" 
            placeholder="请输入话题名称，如：#春节烟花"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input 
            v-model="formData.description" 
            type="textarea"
            :rows="3"
            placeholder="请输入话题描述(可选)"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>


        <el-form-item label="排序" prop="sortOrder">
          <el-input-number 
            v-model="formData.sortOrder" 
            :min="0"
            :max="999"
          ></el-input-number>
          <div class="form-tip">数字越小越靠前</div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">已上线</el-radio>
            <el-radio :label="2">已下线</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否Banner">
          <el-switch
            v-model="formData.isBanner"
            :active-value="1"
            :inactive-value="0"
          />
          <div class="form-tip">设置为Banner后，将在小程序社区页面顶部展示</div>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Picture, Upload } from '@element-plus/icons-vue'
import { 
  getActivityList, 
  addActivity, 
  updateActivity, 
  deleteActivity,
  type Activity 
} from '@/api/activity'

// 数据
const loading = ref(false)
const activityList = ref<Activity[]>([])
const uploading = ref(false)

// 上传配置
const uploadUrl = computed(() => {
  return 'https://fireworks-project.zhengpan.cn/api/upload/image'
})

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('admin_token')
  return {
    'Authorization': `Bearer ${token}`
  }
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加话题')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<Activity>({
  name: '',
  description: '',
  coverUrl: '',
  sortOrder: 0,
  status: 1,
  isBanner: 0
})

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入话题名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 状态文本
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '草稿',
    1: '已上线',
    2: '已下线'
  }
  return statusMap[status] || '未知'
}

// 状态类型
const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status] || 'info'
}

// 上传前验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('图片大小不能超过 10MB!')
    return false
  }
  
  uploading.value = true
  return true
}

// 上传成功
const handleUploadSuccess = (response: any) => {
  uploading.value = false
  if (response.code === 200) {
    formData.coverUrl = response.data.url
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 上传失败
const handleUploadError = (error: any) => {
  uploading.value = false
  console.error('上传失败:', error)
  ElMessage.error('封面上传失败')
}

// 加载话题列表
const loadActivityList = async () => {
  loading.value = true
  try {
    const res: any = await getActivityList()
    if (res.code === 200) {
      activityList.value = res.data || []
    } else {
      ElMessage.error(res.message || '加载失败')
    }
  } catch (error) {
    console.error('加载失败:', error)
    ElMessage.error('加载话题列表失败')
  } finally {
    loading.value = false
  }
}

// 添加话题
const handleAdd = () => {
  dialogTitle.value = '添加话题'
  Object.assign(formData, {
    id: undefined,
    name: '',
    description: '',
    coverUrl: '',
    sortOrder: 0,
    status: 1,
    isBanner: 0
  })
  dialogVisible.value = true
}

// 编辑话题
const handleEdit = (item: Activity) => {
  dialogTitle.value = '编辑话题'
  Object.assign(formData, { ...item })
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (item: Activity) => {
  try {
    const newStatus = item.status === 1 ? 2 : 1
    const statusText = newStatus === 1 ? '上线' : '下线'
    
    await ElMessageBox.confirm(`确定要${statusText}这个话题吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const res: any = await updateActivity(item.id!, { ...item, status: newStatus })
    if (res.code === 200) {
      ElMessage.success(`${statusText}成功`)
      loadActivityList()
    } else {
      ElMessage.error(res.message || '状态更新失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('更新失败:', error)
      ElMessage.error('状态更新失败')
    }
  }
}

// 切换Banner状态
const handleToggleBanner = async (item: Activity) => {
  try {
    const bannerText = item.isBanner === 1 ? '设置为Banner' : '取消Banner'
    
    const res: any = await updateActivity(item.id!, { ...item })
    if (res.code === 200) {
      ElMessage.success(`${bannerText}成功`)
      loadActivityList()
    } else {
      ElMessage.error(res.message || 'Banner状态更新失败')
      // 恢复原状态
      item.isBanner = item.isBanner === 1 ? 0 : 1
    }
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('Banner状态更新失败')
    // 恢复原状态
    item.isBanner = item.isBanner === 1 ? 0 : 1
  }
}

// 删除话题
const handleDelete = (item: Activity) => {
  ElMessageBox.confirm('确定要删除这个话题吗? 删除后将同时删除相关的视频关联记录。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res: any = await deleteActivity(item.id!)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        loadActivityList()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      let res: any
      if (formData.id) {
        // 更新
        res = await updateActivity(formData.id, formData)
      } else {
        // 添加
        res = await addActivity(formData)
      }
      
      if (res.code === 200) {
        ElMessage.success(formData.id ? '更新成功' : '添加成功')
        dialogVisible.value = false
        loadActivityList()
      } else {
        ElMessage.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 初始化
onMounted(() => {
  loadActivityList()
})
</script>

<style scoped lang="scss">
.activity-list-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
}

.image-error-small {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  background: #f5f7fa;
  
  .el-icon {
    font-size: 24px;
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.upload-section {
  width: 100%;
}

.image-uploader {
  margin-bottom: 10px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  margin-bottom: 10px;
}

.image-preview {
  margin: 15px 0;
  padding: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  text-align: center;
}
</style>
