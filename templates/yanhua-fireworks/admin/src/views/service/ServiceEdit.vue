<template>
  <div class="service-edit">
    <el-page-header @back="handleBack" :content="isEdit ? '编辑内容' : '新增内容'" />
    
    <el-card class="form-card" style="margin-top: 20px;">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 800px;"
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" @change="handleCategoryChange">
            <el-option label="使用指南" value="guide" />
            <el-option label="安全须知" value="safety" />
            <el-option label="常见问题" value="faq" />
          </el-select>
        </el-form-item>

        <el-form-item 
          v-if="form.category === 'faq'" 
          label="问题分类" 
          prop="subCategory"
        >
          <el-input 
            v-model="form.subCategory" 
            placeholder="请输入问题分类，如：产品使用、安全问题等"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="form.title" 
            placeholder="请输入标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="封面图片" prop="coverImage">
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
          <div class="upload-tip">建议尺寸：750x400px，支持jpg、png格式，大小不超过2MB</div>
        </el-form-item>

        <el-form-item label="视频" prop="videoUrl">
          <el-input 
            v-model="form.videoUrl" 
            placeholder="请输入视频URL（可选）"
          >
            <template #append>
              <el-upload
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleVideoSuccess"
                :before-upload="beforeVideoUpload"
                accept="video/*"
              >
                <el-button :icon="Upload">上传视频</el-button>
              </el-upload>
            </template>
          </el-input>
          <div class="upload-tip">支持mp4格式，大小不超过50MB</div>
        </el-form-item>

        <!-- 内容编辑 -->
        <el-divider content-position="left">内容编辑</el-divider>
        
        <el-form-item label="内容" prop="content">
          <div ref="editorRef" style="width: 100%;"></div>
        </el-form-item>

        <!-- 其他设置 -->
        <el-divider content-position="left">其他设置</el-divider>
        
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number 
            v-model="form.sortOrder" 
            :min="0" 
            :max="9999"
            placeholder="数字越小越靠前"
          />
          <span style="margin-left: 10px; color: #909399;">数字越小越靠前</span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">已发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSave(0)" :loading="saving">
            保存为草稿
          </el-button>
          <el-button type="success" @click="handleSave(1)" :loading="saving">
            发布
          </el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import { serviceApi, type ServiceContent } from '@/api/service'
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, type IDomEditor } from '@wangeditor/editor'

const route = useRoute()
const router = useRouter()

// 判断是编辑还是新增
const isEdit = ref(false)
const contentId = ref<number>()

// 表单引用
const formRef = ref<FormInstance>()

// 富文本编辑器
const editorRef = ref<HTMLElement>()
let editor: IDomEditor | null = null

// 上传配置
const uploadUrl = ref(import.meta.env.VITE_API_BASE_URL + '/api/upload/image')
const uploadHeaders = ref({
  'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
})

// 表单数据
const form = reactive<Partial<ServiceContent>>({
  category: 'guide',
  subCategory: '',
  title: '',
  content: '',
  coverImage: '',
  videoUrl: '',
  status: 0,
  sortOrder: 0
})

// 表单验证规则
const rules: FormRules = {
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  subCategory: [
    { 
      required: true, 
      message: '请输入问题分类', 
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (form.category === 'faq' && !value) {
          callback(new Error('请输入问题分类'))
        } else {
          callback()
        }
      }
    }
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 200, message: '标题长度在1-200个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
}

// 保存状态
const saving = ref(false)

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value) return

  editor = createEditor({
    selector: editorRef.value,
    html: form.content || '',
    config: {
      placeholder: '请输入内容...',
      // 禁用图片上传功能,只保留文本编辑
      MENU_CONF: {}
    },
    mode: 'default'
  })

  // 监听内容变化
  editor.on('change', () => {
    form.content = editor?.getHtml() || ''
  })
}

// 加载内容详情
const loadContent = async () => {
  if (!contentId.value) return

  try {
    const res = await serviceApi.getDetail(contentId.value)
    if (res.data) {
      Object.assign(form, res.data)
      // 更新编辑器内容
      if (editor) {
        editor.setHtml(form.content || '')
      }
    }
  } catch (error: any) {
    ElMessage.error('加载内容失败：' + (error.message || '未知错误'))
  }
}

// 分类变化处理
const handleCategoryChange = () => {
  if (form.category !== 'faq') {
    form.subCategory = ''
  }
}

// 封面图片上传成功
const handleCoverSuccess = (response: any) => {
  if (response.code === 200 && response.data) {
    form.coverImage = response.data
    ElMessage.success('封面图片上传成功')
  } else {
    ElMessage.error('封面图片上传失败：' + (response.message || '未知错误'))
  }
}

// 封面图片上传前验证
const beforeCoverUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 视频上传成功
const handleVideoSuccess = (response: any) => {
  if (response.code === 200 && response.data) {
    form.videoUrl = response.data
    ElMessage.success('视频上传成功')
  } else {
    ElMessage.error('视频上传失败：' + (response.message || '未知错误'))
  }
}

// 视频上传前验证
const beforeVideoUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/')
  const isLt50M = file.size / 1024 / 1024 < 50

  if (!isVideo) {
    ElMessage.error('只能上传视频文件!')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('视频大小不能超过 50MB!')
    return false
  }
  return true
}

// 保存内容
const handleSave = async (status: number) => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    // 设置状态
    form.status = status

    // 确认操作
    const action = status === 1 ? '发布' : '保存'
    await ElMessageBox.confirm(
      `确定要${action}此内容吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    saving.value = true

    // 调用API
    if (isEdit.value && contentId.value) {
      await serviceApi.update(contentId.value, form as ServiceContent)
      ElMessage.success(`${action}成功`)
    } else {
      await serviceApi.create(form as ServiceContent)
      ElMessage.success(`${action}成功`)
    }

    // 返回列表页
    router.push('/service/list')
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
  router.push('/service/list')
}

// 组件挂载
onMounted(() => {
  // 检查是否是编辑模式
  if (route.query.id) {
    isEdit.value = true
    contentId.value = Number(route.query.id)
  }

  // 初始化编辑器
  initEditor()

  // 如果是编辑模式，加载内容
  if (isEdit.value) {
    loadContent()
  }
})

// 组件卸载
onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
    editor = null
  }
})
</script>

<style scoped>
.service-edit {
  padding: 20px;
}

.form-card {
  margin-top: 20px;
}

.cover-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.cover-uploader:hover {
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
  margin-top: 5px;
}
</style>
