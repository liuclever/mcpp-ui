<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { 
  getHomeVideoConfig, 
  updateHomeVideoConfig, 
  getProductVideo1Config,
  updateProductVideo1Config,
  getProductVideo2Config,
  updateProductVideo2Config,
  type VideoConfig 
} from '@/api/video-config'

const loading = ref(false)
const saving = ref(false)

// 首页视频配置
const homeVideoConfig = ref<VideoConfig>({
  title: '',
  coverUrl: '',
  videoUrl: ''
})

// 产品页视频（1-产品拆箱）
const productVideo1Config = ref<VideoConfig>({
  title: '产品拆箱',
  coverUrl: '',
  videoUrl: ''
})

// 产品页视频（2-完整效果）
const productVideo2Config = ref<VideoConfig>({
  title: '完整效果',
  coverUrl: '',
  videoUrl: ''
})

// 上传配置
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/upload/image'
const videoUploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/upload/video'
const uploadHeaders = {
  Authorization: 'Bearer ' + localStorage.getItem('admin_token')
}

// 加载配置
const loadConfig = async () => {
  loading.value = true
  try {
    const [homeRes, video1Res, video2Res] = await Promise.all([
      getHomeVideoConfig(),
      getProductVideo1Config(),
      getProductVideo2Config()
    ])
    
    if ((homeRes as any).code === 200 && (homeRes as any).data) {
      homeVideoConfig.value = {
        title: (homeRes as any).data.title || '',
        coverUrl: (homeRes as any).data.coverUrl || '',
        videoUrl: (homeRes as any).data.videoUrl || ''
      }
    }
    
    if ((video1Res as any).code === 200 && (video1Res as any).data) {
      productVideo1Config.value = {
        title: (video1Res as any).data.title || '产品拆箱',
        coverUrl: (video1Res as any).data.coverUrl || '',
        videoUrl: (video1Res as any).data.videoUrl || ''
      }
    }
    
    if ((video2Res as any).code === 200 && (video2Res as any).data) {
      productVideo2Config.value = {
        title: (video2Res as any).data.title || '完整效果',
        coverUrl: (video2Res as any).data.coverUrl || '',
        videoUrl: (video2Res as any).data.videoUrl || ''
      }
    }
  } catch (error) {
    console.error('加载视频配置失败:', error)
    ElMessage.error('加载配置失败')
  } finally {
    loading.value = false
  }
}

// 保存首页视频配置
const saveHomeConfig = async () => {
  saving.value = true
  try {
    const res: any = await updateHomeVideoConfig(homeVideoConfig.value)
    if (res.code === 200) {
      ElMessage.success('首页视频配置保存成功')
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存首页视频配置失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 封面上传成功
const handleHomeCoverSuccess = (response: any) => {
  if (response.code === 200) {
    homeVideoConfig.value.coverUrl = response.data.url
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 视频上传成功
const handleHomeVideoSuccess = (response: any) => {
  if (response.code === 200) {
    homeVideoConfig.value.videoUrl = response.data.url
    ElMessage.success('视频上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 产品页视频1上传成功
const handleVideo1CoverSuccess = (response: any) => {
  if (response.code === 200) {
    productVideo1Config.value.coverUrl = response.data.url
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const handleVideo1Success = (response: any) => {
  if (response.code === 200) {
    productVideo1Config.value.videoUrl = response.data.url
    ElMessage.success('视频上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 产品页视频2上传成功
const handleVideo2CoverSuccess = (response: any) => {
  if (response.code === 200) {
    productVideo2Config.value.coverUrl = response.data.url
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const handleVideo2Success = (response: any) => {
  if (response.code === 200) {
    productVideo2Config.value.videoUrl = response.data.url
    ElMessage.success('视频上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 保存产品页视频1配置
const saveVideo1Config = async () => {
  saving.value = true
  try {
    const res: any = await updateProductVideo1Config(productVideo1Config.value)
    if (res.code === 200) {
      ElMessage.success('产品页视频1配置保存成功')
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 保存产品页视频2配置
const saveVideo2Config = async () => {
  saving.value = true
  try {
    const res: any = await updateProductVideo2Config(productVideo2Config.value)
    if (res.code === 200) {
      ElMessage.success('产品页视频2配置保存成功')
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 上传前验证
const beforeImageUpload = (file: File) => {
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

const beforeVideoUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/')
  const isLt100M = file.size / 1024 / 1024 < 100
  
  if (!isVideo) {
    ElMessage.error('只能上传视频文件!')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过 100MB!')
    return false
  }
  return true
}

onMounted(() => {
  loadConfig()
})
</script>

<template>
  <div class="video-config-container" v-loading="loading">
    <el-row :gutter="24">
      <!-- 首页视频配置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>首页视频配置</span>
              <el-button type="primary" :loading="saving" @click="saveHomeConfig">
                保存配置
              </el-button>
            </div>
          </template>
          
          <el-form label-width="100px">
            <el-form-item label="视频标题">
              <el-input v-model="homeVideoConfig.title" placeholder="请输入视频标题" />
            </el-form-item>
            
            <el-form-item label="视频封面">
              <div class="upload-container">
                <el-upload
                  class="cover-uploader"
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleHomeCoverSuccess"
                  :before-upload="beforeImageUpload"
                >
                  <img v-if="homeVideoConfig.coverUrl" :src="homeVideoConfig.coverUrl" class="cover-preview" />
                  <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <el-input 
                  v-model="homeVideoConfig.coverUrl" 
                  placeholder="或直接输入封面URL" 
                  style="margin-top: 10px"
                />
              </div>
            </el-form-item>
            
            <el-form-item label="视频文件">
              <div class="upload-container">
                <el-upload
                  class="video-uploader"
                  :action="videoUploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleHomeVideoSuccess"
                  :before-upload="beforeVideoUpload"
                >
                  <el-button type="primary">上传视频</el-button>
                </el-upload>
                <el-input 
                  v-model="homeVideoConfig.videoUrl" 
                  placeholder="或直接输入视频URL" 
                  style="margin-top: 10px"
                />
                <video 
                  v-if="homeVideoConfig.videoUrl" 
                  :src="homeVideoConfig.videoUrl" 
                  controls 
                  class="video-preview"
                />
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
    </el-row>
    
    <!-- 产品页视频列表配置 -->
    <el-divider>产品页视频列表配置（搜索栏下方）</el-divider>
    
    <el-row :gutter="24">
      <!-- 产品页视频1 - 产品拆箱 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>视频1 - 产品拆箱</span>
              <el-button type="primary" :loading="saving" @click="saveVideo1Config">
                保存配置
              </el-button>
            </div>
          </template>
          
          <el-form label-width="100px">
            <el-form-item label="视频标题">
              <el-input v-model="productVideo1Config.title" placeholder="请输入视频标题" />
            </el-form-item>
            
            <el-form-item label="视频封面">
              <div class="upload-container">
                <el-upload
                  class="cover-uploader"
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleVideo1CoverSuccess"
                  :before-upload="beforeImageUpload"
                >
                  <img v-if="productVideo1Config.coverUrl" :src="productVideo1Config.coverUrl" class="cover-preview" />
                  <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <el-input 
                  v-model="productVideo1Config.coverUrl" 
                  placeholder="或直接输入封面URL" 
                  style="margin-top: 10px"
                />
              </div>
            </el-form-item>
            
            <el-form-item label="视频文件">
              <div class="upload-container">
                <el-upload
                  class="video-uploader"
                  :action="videoUploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleVideo1Success"
                  :before-upload="beforeVideoUpload"
                >
                  <el-button type="primary">上传视频</el-button>
                </el-upload>
                <el-input 
                  v-model="productVideo1Config.videoUrl" 
                  placeholder="或直接输入视频URL" 
                  style="margin-top: 10px"
                />
                <video 
                  v-if="productVideo1Config.videoUrl" 
                  :src="productVideo1Config.videoUrl" 
                  controls 
                  class="video-preview"
                />
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <!-- 产品页视频2 - 完整效果 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>视频2 - 完整效果</span>
              <el-button type="primary" :loading="saving" @click="saveVideo2Config">
                保存配置
              </el-button>
            </div>
          </template>
          
          <el-form label-width="100px">
            <el-form-item label="视频标题">
              <el-input v-model="productVideo2Config.title" placeholder="请输入视频标题" />
            </el-form-item>
            
            <el-form-item label="视频封面">
              <div class="upload-container">
                <el-upload
                  class="cover-uploader"
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleVideo2CoverSuccess"
                  :before-upload="beforeImageUpload"
                >
                  <img v-if="productVideo2Config.coverUrl" :src="productVideo2Config.coverUrl" class="cover-preview" />
                  <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <el-input 
                  v-model="productVideo2Config.coverUrl" 
                  placeholder="或直接输入封面URL" 
                  style="margin-top: 10px"
                />
              </div>
            </el-form-item>
            
            <el-form-item label="视频文件">
              <div class="upload-container">
                <el-upload
                  class="video-uploader"
                  :action="videoUploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleVideo2Success"
                  :before-upload="beforeVideoUpload"
                >
                  <el-button type="primary">上传视频</el-button>
                </el-upload>
                <el-input 
                  v-model="productVideo2Config.videoUrl" 
                  placeholder="或直接输入视频URL" 
                  style="margin-top: 10px"
                />
                <video 
                  v-if="productVideo2Config.videoUrl" 
                  :src="productVideo2Config.videoUrl" 
                  controls 
                  class="video-preview"
                />
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.video-config-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-container {
  width: 100%;
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
  width: 200px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-preview {
  width: 200px;
  height: 120px;
  object-fit: cover;
}

.video-preview {
  width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 4px;
}
</style>
