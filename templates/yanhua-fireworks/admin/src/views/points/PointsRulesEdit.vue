<template>
  <div class="points-rules-edit">
    <el-card shadow="never" v-loading="fetchLoading">
      <template #header>
        <div class="card-header">
          <span>积分规则管理</span>
          <el-tag v-if="updateTime" type="info" size="small">
            最后更新: {{ updateTime }}
          </el-tag>
        </div>
      </template>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="规则内容" prop="content">
          <div ref="editorRef" style="width: 100%; border: 1px solid #ccc;"></div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saving">
            保存
          </el-button>
          <el-button @click="handlePreview">
            预览
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="预览" width="60%">
      <div class="preview-content" v-html="previewHtml"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { pointsRulesApi } from '@/api/points-rules'
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, type IDomEditor } from '@wangeditor/editor'

// 表单引用
const formRef = ref<FormInstance>()

// 富文本编辑器
const editorRef = ref<HTMLElement>()
let editor: IDomEditor | null = null

// 加载状态
const fetchLoading = ref(false)
const saving = ref(false)

// 表单数据
const form = reactive({
  content: ''
})

// 更新时间
const updateTime = ref('')

// 预览相关
const previewVisible = ref(false)
const previewHtml = ref('')

// 表单验证规则
const rules: FormRules = {
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' }
  ]
}

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value) return

  editor = createEditor({
    selector: editorRef.value,
    html: form.content || '',
    config: {
      placeholder: '请输入积分规则内容...',
      MENU_CONF: {
        // 配置上传图片
        uploadImage: {
          server: import.meta.env.VITE_API_BASE_URL + '/api/upload/image',
          fieldName: 'file',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
          },
          maxFileSize: 2 * 1024 * 1024, // 2MB
          allowedFileTypes: ['image/*'],
          customInsert(res: any, insertFn: any) {
            // res 是服务器返回的结果
            if (res.code === 200 && res.data) {
              insertFn(res.data, '', res.data)
            } else {
              ElMessage.error('图片上传失败：' + (res.message || '未知错误'))
            }
          }
        }
      }
    },
    mode: 'default'
  })

  // 设置编辑器最小高度
  const editorElem = editorRef.value.querySelector('.w-e-text-container')
  if (editorElem) {
    (editorElem as HTMLElement).style.minHeight = '400px'
  }

  // 监听内容变化
  editor.on('change', () => {
    form.content = editor?.getHtml() || ''
  })
}

// 获取内容
const fetchContent = async () => {
  fetchLoading.value = true
  try {
    const response = await pointsRulesApi.getContent()
    // axios interceptor already returns response.data, so response is { code, data, message }
    if (response.code === 200 && response.data) {
      form.content = response.data.content
      updateTime.value = response.data.updateTime
      
      // 更新编辑器内容
      if (editor) {
        editor.setHtml(form.content || '')
      }
    } else {
      ElMessage.error(response.message || '获取内容失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取内容失败')
  } finally {
    fetchLoading.value = false
  }
}

// 保存内容
const handleSave = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    if (!form.content || !form.content.trim()) {
      ElMessage.warning('内容不能为空')
      return
    }

    saving.value = true
    const response = await pointsRulesApi.updateContent(form.content)
    
    // axios interceptor already returns response.data, so response is { code, data, message }
    if (response.code === 200) {
      ElMessage.success('保存成功')
      // 重新获取内容以更新时间
      await fetchContent()
    } else {
      ElMessage.error(response.message || '保存失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '保存失败')
    }
  } finally {
    saving.value = false
  }
}

// 预览
const handlePreview = () => {
  previewHtml.value = form.content
  previewVisible.value = true
}

// 取消操作
const handleCancel = () => {
  // 重新获取内容，恢复到保存前的状态
  fetchContent()
}

// 组件挂载
onMounted(() => {
  // 初始化编辑器
  initEditor()
  
  // 加载内容
  fetchContent()
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
.points-rules-edit {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.preview-content {
  padding: 20px;
  line-height: 1.8;
  font-size: 14px;
}

.preview-content :deep(h1) {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0 10px;
}

.preview-content :deep(h2) {
  font-size: 20px;
  font-weight: bold;
  margin: 16px 0 8px;
}

.preview-content :deep(h3) {
  font-size: 18px;
  font-weight: bold;
  margin: 12px 0 6px;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  padding-left: 30px;
  margin: 10px 0;
}

.preview-content :deep(li) {
  margin: 5px 0;
}

.preview-content :deep(p) {
  margin: 10px 0;
}

.preview-content :deep(strong) {
  font-weight: bold;
}

.preview-content :deep(em) {
  font-style: italic;
}

.preview-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}
</style>
