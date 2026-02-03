<template>
  <div class="enterprise-content-edit">
    <el-page-header @back="handleBack" :content="isEdit ? '编辑内容' : '新增内容'" />
    
    <el-card class="form-card" style="margin-top: 20px;">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 1200px;"
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        
        <el-form-item label="所属栏目" prop="columnId">
          <el-select 
            v-model="form.columnId" 
            placeholder="请选择栏目"
            style="width: 300px"
          >
            <el-option
              v-for="column in columns"
              :key="column.id"
              :label="column.name"
              :value="column.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="form.title" 
            placeholder="请输入标题"
            maxlength="200"
            show-word-limit
            style="width: 600px"
          />
        </el-form-item>

        <el-form-item label="封面图片">
          <div style="display: flex; align-items: flex-start; gap: 15px;">
            <el-upload
              class="cover-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload"
              accept="image/*"
            >
              <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" />
              <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
            </el-upload>
            
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <el-checkbox v-model="form.autoExtractCover" label="自动从正文提取" />
                <el-tooltip content="如果勾选，系统会自动从正文中提取第一张图片作为封面" placement="top">
                  <el-icon style="cursor: help;"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="upload-tip">
                建议尺寸：800x600px，支持JPG、PNG格式，大小不超过5MB
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="内容摘要">
          <div style="width: 600px;">
            <el-input 
              v-model="form.summary" 
              type="textarea" 
              :rows="4"
              placeholder="请输入内容摘要（最多200字）"
              maxlength="200"
              show-word-limit
              :disabled="form.autoExtractSummary"
            />
            
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
              <el-checkbox v-model="form.autoExtractSummary" label="自动从正文提取" />
              <el-tooltip content="如果勾选，系统会自动从正文中提取前200字作为摘要" placement="top">
                <el-icon style="cursor: help;"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            
            <div style="color: #909399; font-size: 12px; margin-top: 4px;">
              摘要用于在列表页显示，建议控制在100-200字之间
            </div>
          </div>
        </el-form-item>

        <!-- 正文内容 -->
        <el-divider content-position="left">正文内容</el-divider>
        
        <el-form-item label="正文" prop="content">
          <tinymce-editor 
            v-model="form.content" 
            :height="500"
            placeholder="请输入正文内容..."
          />
        </el-form-item>

        <!-- 发布设置 -->
        <el-divider content-position="left">发布设置</el-divider>
        
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">已发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item 
          v-if="form.status === 'published'" 
          label="发布时间"
        >
          <el-date-picker
            v-model="form.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 300px"
          />
          <div class="form-tip">
            不选择则使用当前时间
          </div>
        </el-form-item>

        <el-form-item label="排序权重">
          <el-input-number 
            v-model="form.sortOrder" 
            :min="0" 
            :max="9999"
            placeholder="数字越大越靠前"
          />
          <span style="margin-left: 10px; color: #909399;">数字越大越靠前</span>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSave" 
            :loading="saving"
            :icon="isEdit ? 'Edit' : 'Plus'"
          >
            {{ isEdit ? '保存' : '创建' }}
          </el-button>
          <el-button 
            v-if="!isEdit"
            @click="handleSaveDraft" 
            :loading="saving"
          >
            保存草稿
          </el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { enterpriseContentApi, type EnterpriseContent } from '@/api/enterprise-content'
import TinymceEditor from '@/components/TinymceEditor.vue'
import { extractCoverImage, extractSummary } from '@/utils/content-extract'

const route = useRoute()
const router = useRouter()

// 判断是编辑还是新增
const isEdit = ref(false)
const contentId = ref<number>()

// 表单引用
const formRef = ref<FormInstance>()

// 栏目列表
const columns = ref<any[]>([])

// 上传配置
const uploadUrl = ref(import.meta.env.VITE_API_BASE_URL + '/api/admin/upload/image')
const uploadHeaders = ref({
  'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
})

// 表单数据
const form = reactive<Partial<EnterpriseContent>>({
  columnId: undefined,
  title: '',
  coverImage: '',
  summary: '',
  content: '',
  status: 'draft',
  publishTime: '',
  sortOrder: 0,
  autoExtractCover: true,  // 默认启用自动提取封面
  autoExtractSummary: true  // 默认启用自动提取摘要
})

// 表单验证规则
const rules: FormRules = {
  columnId: [
    { required: true, message: '请选择栏目', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 200, message: '标题长度在1-200个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入正文内容', trigger: 'blur' }
  ]
}

// 保存状态
const saving = ref(false)

// 自动保存定时器
let autoSaveTimer: number | null = null

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

// 加载内容详情
const loadContent = async () => {
  if (!contentId.value) return

  try {
    const res: any = await enterpriseContentApi.getDetail(contentId.value)
    console.log('加载内容详情响应:', res)
    if (res.code === 200 && res.data) {
      Object.assign(form, res.data)
    } else {
      ElMessage.error(res.message || '加载内容失败')
    }
  } catch (error: any) {
    ElMessage.error('加载内容失败：' + (error.message || '未知错误'))
  }
}

// 封面图片上传成功
const handleCoverSuccess = (response: any) => {
  if (response.code === 200 && response.data) {
    form.coverImage = typeof response.data === 'string' ? response.data : response.data.url
    // 如果手动上传了封面，取消自动提取
    form.autoExtractCover = false
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error('封面上传失败：' + (response.message || '未知错误'))
  }
}

// 封面图片上传前验证
const beforeCoverUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 自动保存草稿
const autoSaveDraft = async () => {
  if (!form.title || !form.content) return
  
  try {
    if (isEdit.value && contentId.value) {
      // 编辑模式下自动保存
      const draftData = { ...form, status: 'draft' }
      await enterpriseContentApi.update(contentId.value, draftData as EnterpriseContent)
      console.log('自动保存草稿成功')
    }
  } catch (error) {
    console.error('自动保存草稿失败:', error)
  }
}

// 启动自动保存
const startAutoSave = () => {
  // 每30秒自动保存一次
  autoSaveTimer = window.setInterval(() => {
    autoSaveDraft()
  }, 30000)
}

// 停止自动保存
const stopAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
    autoSaveTimer = null
  }
}

// 监听自动提取选项变化
watch(() => form.autoExtractSummary, (newVal) => {
  if (newVal) {
    // 如果启用自动提取，清空手动输入的摘要
    form.summary = ''
  }
})

watch(() => form.autoExtractCover, (newVal) => {
  if (newVal) {
    // 如果启用自动提取，清空手动上传的封面
    // 注意：这里不清空，因为用户可能想保留已上传的封面
    // 只在保存时根据autoExtractCover决定是否使用自动提取
  }
})

// 保存草稿
const handleSaveDraft = async () => {
  if (!formRef.value) return

  try {
    // 只验证必填字段
    await formRef.value.validateField(['columnId', 'title'])

    saving.value = true

    // 设置为草稿状态
    const draftData = { ...form, status: 'draft' }

    if (isEdit.value && contentId.value) {
      await enterpriseContentApi.update(contentId.value, draftData as EnterpriseContent)
      ElMessage.success('草稿保存成功')
    } else {
      const id = await enterpriseContentApi.create(draftData as EnterpriseContent)
      ElMessage.success('草稿保存成功')
      // 切换到编辑模式
      isEdit.value = true
      contentId.value = id.data?.data
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('保存草稿失败：' + (error.message || '未知错误'))
    }
  } finally {
    saving.value = false
  }
}

// 保存内容
const handleSave = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    // 如果是发布状态但没有设置发布时间，使用当前时间
    if (form.status === 'published' && !form.publishTime) {
      const now = new Date()
      form.publishTime = now.toISOString().slice(0, 19).replace('T', ' ')
    }

    // 确认操作
    const confirmText = form.status === 'published' 
      ? '确定要发布此内容吗？' 
      : '确定要保存此内容吗？'
    
    await ElMessageBox.confirm(confirmText, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    saving.value = true

    // 自动提取封面图
    if (form.autoExtractCover && !form.coverImage && form.content) {
      const extractedCover = extractCoverImage(form.content)
      if (extractedCover) {
        form.coverImage = extractedCover
      }
    }

    // 自动提取摘要
    if (form.autoExtractSummary && !form.summary && form.content) {
      const extractedSummary = extractSummary(form.content, 200)
      if (extractedSummary) {
        form.summary = extractedSummary
      }
    }

    // 调用API
    if (isEdit.value && contentId.value) {
      await enterpriseContentApi.update(contentId.value, form as EnterpriseContent)
      ElMessage.success('保存成功')
    } else {
      await enterpriseContentApi.create(form as EnterpriseContent)
      ElMessage.success('创建成功')
    }

    // 返回列表页
    router.push('/enterprise/content/list')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败：' + (error.message || '未知错误'))
    }
  } finally {
    saving.value = false
  }
}

// 返回列表
const handleBack = () => {
  router.push('/enterprise/content/list')
}

// 组件挂载
onMounted(() => {
  // 检查是否是编辑模式
  if (route.query.id) {
    isEdit.value = true
    contentId.value = Number(route.query.id)
  }

  // 加载栏目列表
  loadColumns()

  // 如果是编辑模式，加载内容
  if (isEdit.value) {
    loadContent()
  }

  // 启动自动保存
  if (isEdit.value) {
    startAutoSave()
  }
})

// 组件卸载
onMounted(() => {
  stopAutoSave()
})
</script>

<style scoped>
.enterprise-content-edit {
  padding: 20px;
}

.form-card {
  margin-top: 20px;
}

.cover-uploader {
  display: inline-block;
}

.cover-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.cover-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.cover-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
