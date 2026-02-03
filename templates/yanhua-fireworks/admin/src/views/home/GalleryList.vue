<template>
  <div class="gallery-list-container">
    <el-card>
      <!-- 头部操作栏 -->
      <div class="header-actions">
        <!-- 暂时只保留首页内容图片 -->
        <!-- <el-tabs v-model="activeTab" @tab-click="handleTabChange">
          <el-tab-pane label="品牌故事" name="brand-story"></el-tab-pane>
          <el-tab-pane label="首页内容图片" name="content"></el-tab-pane>
          <el-tab-pane label="产品页头图" name="product-header"></el-tab-pane>
        </el-tabs> -->
        <h3 style="margin: 0; font-size: 16px; color: #303133;">首页内容图片</h3>
        
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加图片
        </el-button>
      </div>

      <!-- 品牌故事提示 -->
      <el-alert 
        v-if="activeTab === 'brand-story'"
        title="品牌故事图片显示在顶图下方、视频上方，可在描述字段填写跳转链接"
        type="info"
        :closable="false"
        style="margin-bottom: 16px">
      </el-alert>

      <!-- 首页内容图片提示 -->
      <el-alert 
        v-if="activeTab === 'content'"
        title="首页内容图片按排序显示，用于展示品牌介绍、产品优势、合作支持等内容"
        type="info"
        :closable="false"
        style="margin-bottom: 16px">
      </el-alert>

      <!-- 产品页头图特殊提示 -->
      <el-alert 
        v-if="activeTab === 'product-header'"
        title="产品页头图只能启用1张图片,启用新图片时会自动禁用其他图片"
        type="info"
        :closable="false"
        style="margin-bottom: 16px">
      </el-alert>

      <!-- 图片列表 -->
      <div class="gallery-grid" v-loading="loading">
        <div 
          v-for="item in galleryList" 
          :key="item.id"
          class="gallery-card"
        >
          <div class="image-wrapper">
            <el-image 
              :src="item.imageUrl" 
              fit="cover"
              class="gallery-image"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <span>加载失败</span>
                </div>
              </template>
            </el-image>
            
            <!-- 状态标签 -->
            <el-tag 
              :type="item.status === 1 ? 'success' : 'info'"
              class="status-tag"
            >
              {{ item.status === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </div>

          <div class="card-content">
            <div class="card-title">{{ item.title || '无标题' }}</div>
            <div class="card-order">排序: {{ item.sortOrder }}</div>
          </div>

          <div class="card-actions">
            <el-button size="small" @click="handleEdit(item)">编辑</el-button>
            <el-button 
              size="small" 
              :type="item.status === 1 ? 'warning' : 'success'"
              @click="handleToggleStatus(item)"
            >
              {{ item.status === 1 ? '隐藏' : '显示' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(item)"
            >
              删除
            </el-button>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty 
          v-if="!loading && galleryList.length === 0" 
          description="暂无图片"
        ></el-empty>
      </div>
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
        <el-form-item label="模块类型" prop="moduleType">
          <el-select v-model="formData.moduleType" placeholder="请选择模块类型" disabled>
            <el-option label="首页内容图片" value="content"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图片" prop="imageUrl">
          <div class="upload-section">
            <el-upload
              class="image-uploader"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              accept="image/*"
            >
              <el-button type="primary" :loading="uploading">
                <el-icon><Upload /></el-icon>
                {{ uploading ? '上传中...' : '选择图片上传' }}
              </el-button>
            </el-upload>
            
            <div class="upload-tip">支持 jpg、png、gif 格式，大小不超过10MB</div>
            
            <!-- 图片预览 -->
            <div v-if="formData.imageUrl" class="image-preview">
              <el-image 
                :src="formData.imageUrl" 
                fit="contain"
                style="width: 200px; height: 150px;"
              >
                <template #error>
                  <div class="image-error-small">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            
            <!-- 手动输入URL -->
            <el-input 
              v-model="formData.imageUrl" 
              placeholder="或手动输入图片URL"
              style="margin-top: 10px;"
            >
              <template #prepend>URL</template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="标题">
          <el-input 
            v-model="formData.title" 
            placeholder="请输入图片标题(可选)"
          ></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input 
            v-model="formData.description" 
            type="textarea"
            :rows="3"
            placeholder="请输入图片描述(可选)"
          ></el-input>
        </el-form-item>

        <el-form-item label="跳转链接">
          <el-select 
            v-model="formData.linkUrl" 
            placeholder="选择跳转页面" 
            clearable
            filterable
            allow-create
            style="width: 100%"
          >
            <el-option-group label="首页模块">
              <el-option label="首页" value="/pages/official/index" />
              <el-option label="图片画廊" value="/pages/official/gallery" />
            </el-option-group>
            <el-option-group label="企业模块">
              <el-option label="企业介绍" value="/pages/enterprise/index" />
              <el-option label="品牌故事列表" value="/pages/enterprise/brand-list" />
              <el-option label="新闻资讯列表" value="/pages/enterprise/list" />
            </el-option-group>
            <el-option-group label="产品模块">
              <el-option label="产品首页" value="/pages/product/index" />
              <el-option label="产品列表" value="/pages/product/list" />
              <el-option label="产品搜索" value="/pages/product/search" />
            </el-option-group>
            <el-option-group label="门店模块">
              <el-option label="门店首页" value="/pages/store/index" />
              <el-option label="附近门店" value="/pages/store/nearby" />
            </el-option-group>
            <el-option-group label="社区模块">
              <el-option label="社区首页" value="/pages/community/index" />
              <el-option label="视频流" value="/pages/community/feed" />
              <el-option label="上传视频" value="/pages/community/upload" />
            </el-option-group>
            <el-option-group label="关于模块">
              <el-option label="关于我们" value="/pages/about/index" />
            </el-option-group>
            <el-option-group label="我的模块">
              <el-option label="个人中心" value="/pages/mine/index" />
              <el-option label="我的收藏" value="/pages/mine/collect" />
              <el-option label="我的点赞" value="/pages/mine/like" />
              <el-option label="积分规则" value="/pages/mine/points-rules" />
            </el-option-group>
            <el-option-group v-if="columnList.length > 0" label="栏目页面">
              <el-option 
                v-for="column in columnList" 
                :key="'column-' + column.id" 
                :label="column.name"
                :value="`/pages/enterprise/detail?columnId=${column.id}`"
              />
            </el-option-group>
            <el-option-group v-if="enterpriseList.length > 0" label="企业内容详情">
              <el-option 
                v-for="content in enterpriseList" 
                :key="'enterprise-' + content.id" 
                :label="content.title"
                :value="`/pages/enterprise/detail?id=${content.id}`"
              />
            </el-option-group>
            <el-option-group v-if="articleList.length > 0" label="CMS文章详情">
              <el-option 
                v-for="article in articleList" 
                :key="'article-' + article.id" 
                :label="article.title"
                :value="`/pages/cms/detail?id=${article.id}`"
              />
            </el-option-group>
          </el-select>
          <div class="form-tip">可选择页面或文章，也可手动输入自定义路径</div>
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
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
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
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Picture, Upload } from '@element-plus/icons-vue'
import { 
  getHomeGalleryList, 
  addHomeGallery, 
  updateHomeGallery, 
  deleteHomeGallery,
  type HomeGallery 
} from '@/api/home-gallery'
import { getCMSContentList, type CMSContent } from '@/api/cms-content'
import { enterpriseContentApi, type EnterpriseContent } from '@/api/enterprise-content'
import { getAllColumns, type ColumnConfig } from '@/api/column'

// 数据
const activeTab = ref('content')
const loading = ref(false)
const galleryList = ref<HomeGallery[]>([])
const uploading = ref(false)

// 文章列表（用于跳转链接选择）
const articleList = ref<CMSContent[]>([])
// 企业内容列表
const enterpriseList = ref<EnterpriseContent[]>([])
// 栏目列表
const columnList = ref<ColumnConfig[]>([])

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
const dialogTitle = ref('添加图片')
const submitting = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<HomeGallery>({
  moduleType: 'content',
  imageUrl: '',
  seriesName: '',
  seriesOrder: 0,
  title: '',
  description: '',
  linkUrl: '',
  sortOrder: 0,
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  moduleType: [
    { required: true, message: '请选择模块类型', trigger: 'change' }
  ],
  imageUrl: [
    { required: true, message: '请上传图片或输入图片URL', trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
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
    formData.imageUrl = response.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 上传失败
const handleUploadError = (error: any) => {
  uploading.value = false
  console.error('上传失败:', error)
  ElMessage.error('图片上传失败')
}

// 加载图片列表
const loadGalleryList = async () => {
  loading.value = true
  try {
    console.log('正在加载图片列表，模块类型:', activeTab.value)
    const response: any = await getHomeGalleryList({ moduleType: activeTab.value })
    console.log('API响应:', response)
    
    // 响应拦截器已返回 response.data，所以这里直接访问 code 和 data
    if (response.code === 200) {
      galleryList.value = response.data || []
      console.log('更新后的galleryList:', galleryList.value)
      console.log('列表长度:', galleryList.value.length)
    } else {
      console.error('API返回错误:', response)
      ElMessage.error(response.message || '加载失败')
    }
  } catch (error) {
    console.error('加载失败:', error)
    ElMessage.error('加载图片列表失败')
  } finally {
    loading.value = false
  }
}

// Tab切换
const handleTabChange = (tab: any) => {
  const newTabName = tab.paneName || tab.props?.name
  console.log('Tab切换到:', newTabName)
  // 直接使用新的tab值，不依赖activeTab的更新
  activeTab.value = newTabName
  // 确保activeTab已经更新后再加载数据
  nextTick(() => {
    console.log('开始加载数据，当前activeTab:', activeTab.value)
    loadGalleryList()
  })
}

// 添加图片
const handleAdd = () => {
  dialogTitle.value = '添加图片'
  Object.assign(formData, {
    id: undefined,
    moduleType: 'content',
    imageUrl: '',
    seriesName: '',
    seriesOrder: 0,
    title: '',
    description: '',
    linkUrl: '',
    sortOrder: 0,
    status: 1
  })
  dialogVisible.value = true
}

// 编辑图片
const handleEdit = (item: HomeGallery) => {
  dialogTitle.value = '编辑图片'
  // 使用JSON深拷贝避免响应式引用问题
  const itemCopy = JSON.parse(JSON.stringify(item))
  formData.id = itemCopy.id
  formData.moduleType = itemCopy.moduleType
  formData.imageUrl = itemCopy.imageUrl
  formData.seriesName = itemCopy.seriesName || ''
  formData.seriesOrder = itemCopy.seriesOrder || 0
  formData.title = itemCopy.title || ''
  formData.description = itemCopy.description || ''
  formData.linkUrl = itemCopy.linkUrl || ''
  formData.sortOrder = itemCopy.sortOrder || 0
  formData.status = itemCopy.status
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (item: HomeGallery) => {
  try {
    const newStatus = item.status === 1 ? 0 : 1
    const response: any = await updateHomeGallery(item.id!, { status: newStatus })
    if (response.code === 200) {
      ElMessage.success('状态更新成功')
      await loadGalleryList()
    } else {
      ElMessage.error(response.message || '状态更新失败')
    }
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 删除图片
const handleDelete = (item: HomeGallery) => {
  ElMessageBox.confirm('确定要删除这张图片吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteHomeGallery(item.id!)
      ElMessage.success('删除成功')
      loadGalleryList()
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
      let response: any
      if (formData.id) {
        // 更新
        response = await updateHomeGallery(formData.id, formData)
        if (response.code === 200) {
          ElMessage.success('更新成功')
        } else {
          ElMessage.error(response.message || '更新失败')
          return
        }
      } else {
        // 添加
        response = await addHomeGallery(formData)
        if (response.code === 200) {
          ElMessage.success('添加成功')
        } else {
          ElMessage.error(response.message || '添加失败')
          return
        }
      }
      
      // 先关闭对话框
      dialogVisible.value = false
      
      // 然后刷新列表
      await loadGalleryList()
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 加载文章列表
const loadArticleList = async () => {
  try {
    const res = await getCMSContentList({ page: 1, pageSize: 100, status: 1 })
    if (res.code === 200 && res.data) {
      articleList.value = res.data.records || res.data.list || []
    }
  } catch (error) {
    console.error('加载文章列表失败:', error)
  }
}

// 加载企业内容列表
const loadEnterpriseList = async () => {
  try {
    const res: any = await enterpriseContentApi.getList({ page: 1, pageSize: 100, status: 'published' })
    if (res.code === 200 && res.data) {
      enterpriseList.value = res.data.records || res.data.list || []
    }
  } catch (error) {
    console.error('加载企业内容列表失败:', error)
  }
}

// 加载栏目列表
const loadColumnList = async () => {
  try {
    const res: any = await getAllColumns()
    if (res.code === 200 && res.data) {
      columnList.value = res.data.filter((c: ColumnConfig) => c.enabled)
    }
  } catch (error) {
    console.error('加载栏目列表失败:', error)
  }
}

// 初始化
onMounted(() => {
  loadGalleryList()
  loadArticleList()
  loadEnterpriseList()
  loadColumnList()
})
</script>

<style scoped lang="scss">
.gallery-list-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  min-height: 400px;
}

.gallery-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}

.image-wrapper {
  position: relative;
  height: 200px;
  background: #f5f7fa;
}

.gallery-image {
  width: 100%;
  height: 100%;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  font-size: 14px;

  .el-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }
}

.status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-order {
  font-size: 12px;
  color: #909399;
}

.card-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-top: 1px solid #e4e7ed;
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

.image-error-small {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  
  .el-icon {
    font-size: 32px;
  }
}
</style>
