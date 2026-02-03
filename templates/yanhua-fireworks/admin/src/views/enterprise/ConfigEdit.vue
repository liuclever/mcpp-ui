<template>
  <div class="enterprise-config-container">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">企业中心配置</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            保存配置
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="config-form"
        v-loading="loading"
      >
        <!-- 海报图片 -->
        <el-form-item label="海报图片" prop="bannerImageUrl">
          <div class="upload-section">
            <el-upload
              class="banner-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleBannerSuccess"
              :before-upload="beforeBannerUpload"
              :headers="uploadHeaders"
            >
              <img v-if="formData.bannerImageUrl" :src="formData.bannerImageUrl" class="banner-preview" />
              <el-icon v-else class="banner-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">
              <el-text type="info" size="small">
                建议尺寸：750x400px，支持 JPG、PNG 格式，大小不超过 2MB
              </el-text>
            </div>
          </div>
        </el-form-item>

        <!-- 品牌简介 -->
        <el-form-item label="品牌简介" prop="introductionText">
          <el-input
            v-model="formData.introductionText"
            type="textarea"
            :rows="8"
            placeholder="请输入品牌简介内容"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预览区域 -->
    <el-card class="preview-card" style="margin-top: 20px">
      <template #header>
        <span class="card-title">预览效果</span>
      </template>
      <div class="preview-content">
        <div class="preview-banner">
          <img v-if="formData.bannerImageUrl" :src="formData.bannerImageUrl" alt="海报预览" />
          <div v-else class="preview-placeholder">海报图片预览</div>
        </div>
        <div class="preview-buttons">
          <div class="preview-button">品牌故事</div>
          <div class="preview-button">企业荣誉</div>
          <div class="preview-button">领导来访</div>
          <div class="preview-button">招商加盟</div>
          <div class="preview-button">服务中心</div>
          <div class="preview-button">销售网点</div>
        </div>
        <div class="preview-introduction">
          <div class="preview-title">品牌简介</div>
          <div class="preview-text">{{ formData.introductionText || '暂无内容' }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getEnterpriseCenterConfig, updateEnterpriseCenterConfig, type EnterpriseCenterConfig } from '@/api/enterprise-center'

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 表单数据
const formData = reactive<EnterpriseCenterConfig>({
  bannerImageUrl: '',
  introductionText: ''
})

// 保存状态
const saving = ref(false)

// 上传配置
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/admin/upload/image'
const uploadHeaders = computed(() => ({
  Authorization: 'Bearer ' + localStorage.getItem('admin_token')
}))

// 表单验证规则
const rules: FormRules = {
  bannerImageUrl: [
    { required: true, message: '请上传海报图片', trigger: 'change' }
  ],
  introductionText: [
    { required: true, message: '请输入品牌简介', trigger: 'blur' },
    { min: 10, max: 1000, message: '品牌简介长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 加载配置
const loadConfig = async () => {
  loading.value = true
  try {
    const res: any = await getEnterpriseCenterConfig()
    if (res.code === 200 && res.data) {
      const config = res.data
      formData.id = config.id
      formData.bannerImageUrl = config.bannerImageUrl || ''
      formData.introductionText = config.introductionText || ''
    } else {
      ElMessage.error(res.message || '加载配置失败')
    }
  } catch (error) {
    console.error('加载配置失败:', error)
    ElMessage.error('加载配置失败')
  } finally {
    loading.value = false
  }
}

// 海报上传成功
const handleBannerSuccess = (response: any) => {
  console.log('上传响应:', response)
  if (response.code === 200 && response.data) {
    formData.bannerImageUrl = response.data.url || response.data
    ElMessage.success('图片上传成功')
  } else if (response.data && response.data.url) {
    formData.bannerImageUrl = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '图片上传失败')
  }
}

// 海报上传前验证
const beforeBannerUpload = (file: File) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 保存配置
const handleSave = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    // 确认保存
    await ElMessageBox.confirm(
      '确定要保存企业中心配置吗？保存后将立即生效。',
      '确认保存',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    saving.value = true

    // 调用API保存
    const res: any = await updateEnterpriseCenterConfig(formData)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      await loadConfig()
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('保存配置失败:', error)
      ElMessage.error(error.message || '保存失败')
    }
  } finally {
    saving.value = false
  }
}

// 页面加载时获取配置
onMounted(() => {
  loadConfig()
})
</script>

<style scoped lang="scss">
.enterprise-config-container {
  padding: 20px;
}

.config-card {
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

.config-form {
  max-width: 800px;
}

.upload-section {
  .banner-uploader {
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

    .banner-preview {
      width: 375px;
      height: 200px;
      display: block;
      object-fit: cover;
    }

    .banner-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 375px;
      height: 200px;
      text-align: center;
      line-height: 200px;
    }
  }

  .upload-tip {
    margin-top: 8px;
  }
}

.preview-card {
  .card-title {
    font-size: 18px;
    font-weight: 600;
  }
}

.preview-content {
  max-width: 375px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;

  .preview-banner {
    width: 100%;
    height: 200px;
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
    }
  }

  .preview-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 20px 15px;
    background: #fff;

    .preview-button {
      height: 80px;
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      box-shadow: 0 2px 6px rgba(255, 165, 0, 0.3);
    }
  }

  .preview-introduction {
    background: #fff;
    margin-top: 10px;
    padding: 20px 15px;

    .preview-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
    }

    .preview-text {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
      white-space: pre-wrap;
    }
  }
}
</style>
