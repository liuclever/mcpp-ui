<template>
  <div class="tinymce-editor">
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, type IDomEditor } from '@wangeditor/editor'

interface Props {
  modelValue?: string
  height?: number
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 400,
  disabled: false,
  placeholder: '请输入内容...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 编辑器引用
const editorRef = ref<HTMLElement>()
let editor: IDomEditor | null = null

// 上传配置
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/admin/upload/image'
const uploadVideoUrl = import.meta.env.VITE_API_BASE_URL + '/api/admin/upload/video'
const uploadHeaders = {
  'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
}

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value) return

  editor = createEditor({
    selector: editorRef.value,
    html: props.modelValue || '',
    config: {
      placeholder: props.placeholder,
      readOnly: props.disabled,
      MENU_CONF: {
        // 图片上传配置
        uploadImage: {
          server: uploadUrl,
          fieldName: 'file',
          headers: uploadHeaders,
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
            if (res.code === 200 && res.data) {
              const url = typeof res.data === 'string' ? res.data : res.data.url
              insertFn(url, '', '')
            }
          }
        },
        // 视频上传配置
        uploadVideo: {
          server: uploadVideoUrl,
          fieldName: 'file',
          headers: uploadHeaders,
          maxFileSize: 100 * 1024 * 1024, // 100MB
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
            if (res.code === 200 && res.data) {
              const url = typeof res.data === 'string' ? res.data : res.data.url
              insertFn(url, '')
            }
          }
        }
      }
    },
    mode: 'default'
  })

  // 设置编辑器高度
  if (editor) {
    const toolbar = editorRef.value.querySelector('.w-e-toolbar') as HTMLElement
    const editorContainer = editorRef.value.querySelector('.w-e-text-container') as HTMLElement
    if (editorContainer) {
      editorContainer.style.height = `${props.height}px`
    }
  }

  // 监听内容变化
  editor.on('change', () => {
    const html = editor?.getHtml() || ''
    emit('update:modelValue', html)
  })
}

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getHtml()) {
    editor.setHtml(newValue || '')
  }
})

// 监听disabled变化
watch(() => props.disabled, (newValue) => {
  if (editor) {
    if (newValue) {
      editor.disable()
    } else {
      editor.enable()
    }
  }
})

// 组件挂载
onMounted(() => {
  initEditor()
})

// 组件卸载
onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
    editor = null
  }
})

// 暴露编辑器实例方法
defineExpose({
  getHtml: () => editor?.getHtml() || '',
  setHtml: (html: string) => editor?.setHtml(html),
  clear: () => editor?.clear(),
  focus: () => editor?.focus()
})
</script>

<style scoped>
.tinymce-editor {
  width: 100%;
}

.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}

:deep(.w-e-toolbar) {
  border-bottom: 1px solid #ccc;
  background-color: #f5f5f5;
}

:deep(.w-e-text-container) {
  background-color: #fff;
}

:deep(.w-e-text-placeholder) {
  color: #999;
}

/* 编辑器内容样式 */
:deep(.w-e-text-container p) {
  margin: 10px 0;
  line-height: 1.6;
}

:deep(.w-e-text-container img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}

:deep(.w-e-text-container video) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}

:deep(.w-e-text-container table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
}

:deep(.w-e-text-container table td,
.w-e-text-container table th) {
  border: 1px solid #ddd;
  padding: 8px;
}

:deep(.w-e-text-container table th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

:deep(.w-e-text-container blockquote) {
  border-left: 4px solid #ddd;
  padding-left: 16px;
  margin: 10px 0;
  color: #666;
}

:deep(.w-e-text-container pre) {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(.w-e-text-container code) {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}
</style>
