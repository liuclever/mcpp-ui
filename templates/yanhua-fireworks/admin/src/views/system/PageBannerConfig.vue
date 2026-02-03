<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getAllBanners, saveBanner, type PageBanner } from '@/api/page-banner'

const loading = ref(false)
const saving = ref(false)

// 页面配置
const pages = [
  { key: 'official', name: '首页' },
  { key: 'product', name: '产品' },
  { key: 'community', name: '社区' },
  { key: 'about', name: '关于' },
  { key: 'mine', name: '我的' }
]

// 小程序页面列表
const miniProgramPages = [
  { path: '/pages/official/index', name: '首页' },
  { path: '/pages/product/index', name: '产品首页' },
  { path: '/pages/product/list', name: '产品列表' },
  { path: '/pages/product/search', name: '产品搜索' },
  { path: '/pages/community/index', name: '社区' },
  { path: '/pages/about/index', name: '关于我们' },
  { path: '/pages/mine/index', name: '我的' },
  { path: '/pages/enterprise/index', name: '企业中心' },
  { path: '/pages/enterprise/brand-list', name: '品牌故事列表' },
  { path: '/pages/store/list', name: '门店列表' },
  { path: '/pages/store/apply', name: '门店申请' }
]

// 横幅数据
const banners = ref<Record<string, Record<string, PageBanner>>>({})

// 上传配置
const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/api/upload/image'
const uploadHeaders = {
  Authorization: 'Bearer ' + localStorage.getItem('admin_token')
}

// 初始化横幅数据结构
const initBanners = () => {
  pages.forEach(page => {
    banners.value[page.key] = {
      top: {
        pageKey: page.key,
        position: 'top',
        imageUrl: '',
        linkUrl: '',
        linkType: 'none',
        visible: 1,
        sortOrder: 0
      },
      bottom: {
        pageKey: page.key,
        position: 'bottom',
        imageUrl: '',
        linkUrl: '',
        linkType: 'none',
        visible: 1,
        sortOrder: 0
      }
    }
  })
}

// 加载配置
const loadBanners = async () => {
  loading.value = true
  initBanners()
  
  try {
    const res: any = await getAllBanners()
    if (res.code === 200 && res.data) {
      res.data.forEach((banner: PageBanner) => {
        if (banners.value[banner.pageKey] && banners.value[banner.pageKey][banner.position]) {
          banners.value[banner.pageKey][banner.position] = banner
        }
      })
    }
  } catch (error) {
    console.error('加载页面横幅配置失败:', error)
    ElMessage.error('加载配置失败')
  } finally {
    loading.value = false
  }
}

// 保存单个横幅配置
const saveSingleBanner = async (pageKey: string, position: string) => {
  saving.value = true
  try {
    const banner = banners.value[pageKey][position]
    const res: any = await saveBanner(banner)
    if (res.code === 200) {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 上传成功处理
const handleUploadSuccess = (response: any, pageKey: string, position: string) => {
  if (response.code === 200) {
    banners.value[pageKey][position].imageUrl = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
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
  return true
}

// 清除图片
const clearImage = (pageKey: string, position: string) => {
  banners.value[pageKey][position].imageUrl = ''
}

onMounted(() => {
  loadBanners()
})
</script>

<template>
  <div class="page-banner-config" v-loading="loading">
    <div class="page-header">
      <h2>页面横幅配置</h2>
      <p class="tip">配置各页面的顶图和底图，支持自定义链接和显示状态</p>
    </div>
    
    <el-tabs type="border-card">
      <el-tab-pane v-for="page in pages" :key="page.key" :label="page.name">
        <div class="banner-config-grid" v-if="banners[page.key]">
          <!-- 顶图配置 -->
          <el-card class="banner-card">
            <template #header>
              <div class="card-header">
                <span>顶图</span>
                <el-switch 
                  v-model="banners[page.key].top.visible" 
                  :active-value="1" 
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </div>
            </template>
            
            <el-form label-width="80px" v-if="banners[page.key]?.top">
              <el-form-item label="图片">
                <div class="upload-area">
                  <el-upload
                    class="banner-uploader"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="(res: any) => handleUploadSuccess(res, page.key, 'top')"
                    :before-upload="beforeUpload"
                  >
                    <img v-if="banners[page.key].top.imageUrl" :src="banners[page.key].top.imageUrl" class="banner-preview" />
                    <div v-else class="upload-placeholder">
                      <el-icon><Plus /></el-icon>
                      <span>点击上传</span>
                    </div>
                  </el-upload>
                  <el-button v-if="banners[page.key].top.imageUrl" type="danger" size="small" @click="clearImage(page.key, 'top')">
                    清除图片
                  </el-button>
                </div>
              </el-form-item>
              
              <el-form-item label="链接类型">
                <el-radio-group v-model="banners[page.key].top.linkType">
                  <el-radio value="none">无链接</el-radio>
                  <el-radio value="page">页面跳转</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="跳转页面" v-if="banners[page.key].top.linkType === 'page'">
                <el-select v-model="banners[page.key].top.linkUrl" placeholder="请选择跳转页面" style="width: 100%">
                  <el-option 
                    v-for="p in miniProgramPages" 
                    :key="p.path" 
                    :label="p.name" 
                    :value="p.path"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :loading="saving" @click="saveSingleBanner(page.key, 'top')">
                  保存顶图配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
          
          <!-- 底图配置 -->
          <el-card class="banner-card">
            <template #header>
              <div class="card-header">
                <span>底图</span>
                <el-switch 
                  v-model="banners[page.key].bottom.visible" 
                  :active-value="1" 
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </div>
            </template>
            
            <el-form label-width="80px" v-if="banners[page.key]?.bottom">
              <el-form-item label="图片">
                <div class="upload-area">
                  <el-upload
                    class="banner-uploader"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="(res: any) => handleUploadSuccess(res, page.key, 'bottom')"
                    :before-upload="beforeUpload"
                  >
                    <img v-if="banners[page.key].bottom.imageUrl" :src="banners[page.key].bottom.imageUrl" class="banner-preview" />
                    <div v-else class="upload-placeholder">
                      <el-icon><Plus /></el-icon>
                      <span>点击上传</span>
                    </div>
                  </el-upload>
                  <el-button v-if="banners[page.key].bottom.imageUrl" type="danger" size="small" @click="clearImage(page.key, 'bottom')">
                    清除图片
                  </el-button>
                </div>
              </el-form-item>
              
              <el-form-item label="链接类型">
                <el-radio-group v-model="banners[page.key].bottom.linkType">
                  <el-radio value="none">无链接</el-radio>
                  <el-radio value="page">页面跳转</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="跳转页面" v-if="banners[page.key].bottom.linkType === 'page'">
                <el-select v-model="banners[page.key].bottom.linkUrl" placeholder="请选择跳转页面" style="width: 100%">
                  <el-option 
                    v-for="p in miniProgramPages" 
                    :key="p.path" 
                    :label="p.name" 
                    :value="p.path"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" :loading="saving" @click="saveSingleBanner(page.key, 'bottom')">
                  保存底图配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.page-banner-config {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
}

.page-header .tip {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.banner-config-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.banner-card {
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.banner-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.banner-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.upload-placeholder {
  width: 300px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
  font-size: 14px;
}

.upload-placeholder .el-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.banner-preview {
  max-width: 300px;
  max-height: 200px;
  object-fit: contain;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
