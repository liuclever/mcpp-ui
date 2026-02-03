<template>
  <div class="cms-content-edit">
    <el-page-header @back="handleBack" :content="isEdit ? '编辑内容' : '新增内容'" />
    
    <el-card class="form-card" style="margin-top: 20px;">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 900px;"
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        
        <el-form-item label="类别" prop="categoryType">
          <el-select v-model="form.categoryType" placeholder="请选择类别" @change="handleCategoryChange">
            <el-option label="品牌故事" value="brand" />
            <el-option label="企业荣誉" value="honor" />
            <el-option label="领导来访" value="visit" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>

        <el-form-item 
          v-if="form.categoryType === 'custom'" 
          label="类别ID" 
          prop="categoryId"
        >
          <el-input-number 
            v-model="form.categoryId" 
            :min="1"
            :max="999999"
            placeholder="请输入自定义类别ID"
          />
          <span style="margin-left: 10px; color: #909399;">自定义类别的ID</span>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="form.title" 
            placeholder="请输入标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <!-- 封面和摘要 -->
        <el-divider content-position="left">封面和摘要</el-divider>
        
        <el-form-item label="封面图片" prop="coverImage">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <el-upload
              class="cover-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload"
            >
              <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" />
              <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
            </el-upload>
            
            <div style="flex: 1;">
              <el-checkbox v-model="form.autoExtractCover" label="自动从正文提取" />
              <el-tooltip content="如果勾选,系统会自动从正文中提取第一张图片作为封面" placement="top">
                <el-icon style="margin-left: 5px; cursor: help;"><QuestionFilled /></el-icon>
              </el-tooltip>
              <div style="color: #909399; font-size: 12px; margin-top: 5px;">
                建议尺寸: 800x600px,支持JPG、PNG格式,大小不超过5MB
              </div>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="内容摘要" prop="summary">
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <el-input
              v-model="form.summary"
              type="textarea"
              :rows="4"
              placeholder="请输入内容摘要(最多200字)"
              maxlength="200"
              show-word-limit
              :disabled="form.autoExtractSummary"
            />
            
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-checkbox v-model="form.autoExtractSummary" label="自动从正文提取" />
              
              <el-tooltip content="如果勾选,系统会自动从正文中提取前200字作为摘要" placement="top">
                <el-icon style="cursor: help;"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div style="color: #909399; font-size: 12px;">
              摘要用于在列表页显示,建议控制在100-200字之间
            </div>
          </div>
        </el-form-item>

        <!-- 内容编辑 -->
        <el-divider content-position="left">内容编辑</el-divider>
        
        <el-form-item label="内容" prop="content">
          <div ref="editorRef" style="width: 100%;"></div>
        </el-form-item>

        <!-- 图片管理 -->
        <el-divider content-position="left">图片管理</el-divider>
        
        <el-form-item label="图片列表">
          <div class="image-upload-section">
            <el-upload
              v-model:file-list="imageFileList"
              :action="uploadUrl"
              :headers="uploadHeaders"
              list-type="picture-card"
              :on-success="handleImageSuccess"
              :on-remove="handleImageRemove"
              :before-upload="beforeImageUpload"
              accept="image/*"
              multiple
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">
              建议尺寸：750x500px，支持jpg、png格式，每张大小不超过2MB，最多上传10张
            </div>
          </div>
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
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saving">
            保存
          </el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadUserFile } from 'element-plus'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { cmsContentApi, type CMSContent } from '@/api/cms-content'
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

// 图片文件列表
const imageFileList = ref<UploadUserFile[]>([])
const imageUrls = ref<string[]>([])

// 表单数据
const form = reactive<Partial<CMSContent>>({
  categoryType: 'brand',
  categoryId: 0,
  title: '',
  content: '',
  images: '[]',
  status: 1,
  sortOrder: 0,
  coverImage: '',
  summary: '',
  autoExtractCover: true,
  autoExtractSummary: true
})

// 表单验证规则
const rules: FormRules = {
  categoryType: [
    { required: true, message: '请选择类别', trigger: 'change' }
  ],
  categoryId: [
    { 
      required: true, 
      message: '请输入类别ID', 
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (form.categoryType === 'custom' && (!value || value < 1)) {
          callback(new Error('请输入有效的类别ID'))
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
      MENU_CONF: {
        // 图片上传配置
        uploadImage: {
          server: uploadUrl.value,
          fieldName: 'file',
          headers: uploadHeaders.value,
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedFileTypes: ['image/*'],
          onSuccess(file: File, res: any) {
            console.log('图片上传成功', res)
          },
          onFailed(file: File, res: any) {
            ElMessage.error('图片上传失败：' + (res.message || '未知错误'))
          },
          onError(file: File, err: any) {
            ElMessage.error('图片上传错误：' + err.message)
          },
          customInsert(res: any, insertFn: Function) {
            // 从响应中获取图片URL并插入到编辑器
            if (res.code === 200 && res.data && res.data.url) {
              insertFn(res.data.url, '', res.data.filename || '')
            }
          }
        },
        // 视频上传配置
        uploadVideo: {
          server: uploadUrl.value.replace('/image', '/video'),
          fieldName: 'file',
          headers: uploadHeaders.value,
          maxFileSize: 50 * 1024 * 1024, // 50MB
          allowedFileTypes: ['video/*'],
          onSuccess(file: File, res: any) {
            console.log('视频上传成功', res)
          },
          onFailed(file: File, res: any) {
            ElMessage.error('视频上传失败：' + (res.message || '未知错误'))
          },
          onError(file: File, err: any) {
            ElMessage.error('视频上传错误：' + err.message)
          },
          customInsert(res: any, insertFn: Function) {
            // 从响应中获取视频URL并插入到编辑器
            if (res.code === 200 && res.data && res.data.url) {
              insertFn(`<video src="${res.data.url}" controls style="max-width: 100%; height: auto;" />`)
            }
          }
        }
      }
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
    const res = await cmsContentApi.getDetail(contentId.value)
    if (res.data && res.data.data) {
      const data = res.data.data
      Object.assign(form, data)
      
      // 更新编辑器内容
      if (editor) {
        editor.setHtml(form.content || '')
      }
      
      // 解析图片列表
      if (data.images) {
        try {
          const images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images
          if (Array.isArray(images)) {
            imageUrls.value = [...images]  // 创建新数组，确保响应式
            imageFileList.value = images.map((url: string, index: number) => ({
              name: `image-${index}`,
              url: url,
              uid: Date.now() + index,
              status: 'success'  // 添加状态标记
            }))
          }
        } catch (e) {
          console.error('解析图片列表失败:', e)
          imageUrls.value = []
          imageFileList.value = []
        }
      }
    }
  } catch (error: any) {
    ElMessage.error('加载内容失败：' + (error.message || '未知错误'))
  }
}

// 分类变化处理
const handleCategoryChange = () => {
  if (form.categoryType !== 'custom') {
    form.categoryId = 0
  }
}

// 监听自动提取摘要选项变化
watch(() => form.autoExtractSummary, (newVal) => {
  if (newVal) {
    // 如果启用自动提取,清空手动输入的摘要
    form.summary = ''
  }
})

// 监听手动上传封面
watch(() => form.coverImage, (newVal) => {
  if (newVal && !form.autoExtractCover) {
    // 如果手动上传了封面,保持自动提取为false
    // 这个逻辑在handleCoverSuccess中已经处理
  }
})

// 封面图片上传成功
const handleCoverSuccess = (response: any) => {
  if (response.code === 200 && response.data && response.data.url) {
    form.coverImage = response.data.url
    // 如果手动上传了封面,取消自动提取
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
    ElMessage.error('图片大小不能超过5MB!')
    return false
  }
  return true
}

// 图片上传成功
const handleImageSuccess = (response: any, file: UploadUserFile) => {
  console.log('图片上传响应:', response)
  console.log('上传的文件:', file)
  
  if (response.code === 200 && response.data && response.data.url) {
    // 后端返回的data是一个对象: {url: "...", filename: "..."}
    // 我们需要提取url字段
    const imageUrl = response.data.url
    imageUrls.value.push(imageUrl)
    
    // 更新文件列表中的URL,确保file.url被正确设置
    file.url = imageUrl
    
    console.log('添加图片URL:', imageUrl)
    console.log('当前所有图片:', imageUrls.value)
    
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败：' + (response.message || '未知错误'))
    // 移除失败的文件
    const index = imageFileList.value.findIndex(f => f.uid === file.uid)
    if (index > -1) {
      imageFileList.value.splice(index, 1)
    }
  }
}

// 图片移除
const handleImageRemove = (file: UploadUserFile) => {
  // 根据文件的URL来删除对应的imageUrl
  if (file.url) {
    const urlIndex = imageUrls.value.indexOf(file.url)
    if (urlIndex > -1) {
      imageUrls.value.splice(urlIndex, 1)
      console.log('移除图片:', file.url)
      console.log('剩余图片:', imageUrls.value)
    }
  }
}

// 图片上传前验证
const beforeImageUpload = (file: File) => {
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
  if (imageFileList.value.length >= 10) {
    ElMessage.error('最多只能上传10张图片!')
    return false
  }
  return true
}

// 保存内容
const handleSave = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    // 确认操作
    await ElMessageBox.confirm(
      '确定要保存此内容吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    saving.value = true

    // 设置图片列表 - 确保是有效的JSON数组字符串
    const validImageUrls = imageUrls.value.filter(url => url && url.trim())
    form.images = JSON.stringify(validImageUrls)
    
    console.log('保存的图片数据:', form.images)
    console.log('图片URL数组:', validImageUrls)

    // 调用API
    if (isEdit.value && contentId.value) {
      await cmsContentApi.update(contentId.value, form as CMSContent)
      ElMessage.success('保存成功')
    } else {
      await cmsContentApi.create(form as CMSContent)
      ElMessage.success('创建成功')
    }

    // 返回列表页
    router.push('/cms/content/list')
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
  router.push('/cms/content/list')
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
.cms-content-edit {
  padding: 20px;
}

.form-card {
  margin-top: 20px;
}

.image-upload-section {
  width: 100%;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}

/* 封面上传样式 */
.cover-uploader {
  width: 200px;
  height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 148px;
  height: 148px;
}

:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
}
</style>
