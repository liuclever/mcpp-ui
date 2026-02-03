<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProductList, getCategories, getChildCategories, addProduct, updateProduct, deleteProduct } from '@/api/product'
import { getBatchProductVideoCounts } from '@/api/product-video'
import type { Product, Category } from '@/api/types'
import type { UploadProps } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(false)
const tableData = ref<Product[]>([])
const categories = ref<Category[]>([])
const childCategories = ref<Category[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 产品视频数量映射
const videoCountMap = ref<Record<number, number>>({})

const dialogVisible = ref(false)
const dialogTitle = ref('新增产品')
const formRef = ref()
const form = reactive<Partial<Product>>({
  id: undefined,
  name: '',
  code: '',
  categoryId: undefined,
  content: '',
  volume: '',
  image: '',
  videoUrl: '',
  burnDuration: undefined,
  status: 1
})

// 视频上传相关
const uploadLoading = ref(false)
const videoFileList = ref<any[]>([])

// 图片上传相关
const imageUploadLoading = ref(false)
const imageFileList = ref<any[]>([])

// 图片上传前的验证
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const isImage = imageTypes.includes(rawFile.type)
  
  if (!isImage) {
    ElMessage.error('只支持图片格式(jpg、png、gif、webp)')
    return false
  }
  
  const maxSize = 10 // 图片10MB
  const isLtMaxSize = rawFile.size / 1024 / 1024 < maxSize
  
  if (!isLtMaxSize) {
    ElMessage.error(`图片大小不能超过 ${maxSize}MB`)
    return false
  }
  
  return true
}

// 图片上传处理
const handleImageUpload: UploadProps['httpRequest'] = async (options) => {
  imageUploadLoading.value = true
  try {
    const file = options.file as File
    const formData = new FormData()
    formData.append('file', file)

    const response = await request.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.code === 200) {
      form.image = response.data.url
      imageFileList.value = [{
        name: file.name,
        url: response.data.url
      }]
      ElMessage.success('图片上传成功')
      options.onSuccess(response)
    } else {
      ElMessage.error(response.message || '上传失败')
      options.onError(new Error(response.message))
    }
  } catch (error: any) {
    console.error('图片上传失败', error)
    ElMessage.error(error.message || '上传失败')
    options.onError(error)
  } finally {
    imageUploadLoading.value = false
  }
}

// 移除图片
const handleImageRemove = () => {
  form.image = ''
  imageFileList.value = []
}

// 视频上传前的验证
const beforeVideoUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-flv']
  
  const isVideo = videoTypes.includes(rawFile.type)
  
  if (!isVideo) {
    ElMessage.error('只支持视频格式(mp4、mov、avi、wmv、flv)')
    return false
  }
  
  const maxSize = 500 // 视频500MB
  const isLtMaxSize = rawFile.size / 1024 / 1024 < maxSize
  
  if (!isLtMaxSize) {
    ElMessage.error(`视频大小不能超过 ${maxSize}MB`)
    return false
  }
  
  return true
}

// 从视频提取第一帧作为封面
const extractVideoFrame = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // 设置视频属性
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    
    // 当视频元数据加载完成时
    video.onloadedmetadata = () => {
      // 设置canvas尺寸
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // 跳转到更合适的位置截取封面（避免开头黑屏）
      // 使用1秒或视频时长的25%，取较小值，确保不超过视频时长
      const targetTime = Math.min(1, video.duration * 0.25, video.duration - 0.1)
      video.currentTime = Math.max(0.1, targetTime)
    }
    
    // 当视频可以播放时（已经有足够的数据）
    video.onseeked = async () => {
      try {
        // 绘制当前帧到canvas
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // 转换为blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('无法截取视频封面'))
            return
          }
          
          try {
            // 上传封面图片
            const formData = new FormData()
            formData.append('file', blob, 'cover.jpg')
            
            const response = await request.post('/upload/image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            
            if (response.code === 200) {
              resolve(response.data.url)
            } else {
              reject(new Error(response.message || '封面上传失败'))
            }
          } catch (error: any) {
            reject(error)
          } finally {
            // 清理资源
            URL.revokeObjectURL(video.src)
            video.src = ''
          }
        }, 'image/jpeg', 0.9)
      } catch (error) {
        URL.revokeObjectURL(video.src)
        reject(error)
      }
    }
    
    video.onerror = (e) => {
      URL.revokeObjectURL(video.src)
      console.error('视频加载错误:', e)
      reject(new Error('视频加载失败，请确保视频文件格式正确'))
    }
    
    // 加载视频
    try {
      video.src = URL.createObjectURL(videoFile)
    } catch (error) {
      reject(new Error('无法创建视频URL'))
    }
  })
}

// 视频上传处理
const handleVideoUpload: UploadProps['httpRequest'] = async (options) => {
  uploadLoading.value = true
  try {
    const file = options.file as File
    
    // 1. 上传视频
    const formData = new FormData()
    formData.append('file', file)

    const response = await request.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 600000 // 10分钟超时，支持大视频上传
    })

    if (response.code === 200) {
      form.videoUrl = response.data.url
      ElMessage.success('视频上传成功')
      
      // 2. 自动截取视频第一帧作为预览（不覆盖产品封面图）
      try {
        ElMessage.info('正在生成视频预览...')
        const coverUrl = await extractVideoFrame(file)
        // 使用截取的帧作为视频预览图（不设置到form.image）
        videoFileList.value = [{
          name: response.data.filename || '视频',
          url: coverUrl
        }]
        ElMessage.success('视频预览生成成功')
      } catch (error: any) {
        console.error('视频预览生成失败', error)
        // 使用视频占位图标
        const videoPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMGYwZjAiLz48cG9seWdvbiBwb2ludHM9IjQwLDMwIDQwLDcwIDcwLDUwIiBmaWxsPSIjNjY2Ii8+PC9zdmc+'
        videoFileList.value = [{
          name: response.data.filename || '视频',
          url: videoPlaceholder
        }]
        ElMessage.warning('视频预览生成失败')
      }
      
      options.onSuccess(response)
    } else {
      ElMessage.error(response.message || '上传失败')
      const error = new Error(response.data.message) as any
      error.status = response.status
      error.method = 'POST'
      error.url = '/upload/video'
      options.onError(error)
    }
  } catch (error: any) {
    console.error('视频上传失败', error)
    ElMessage.error(error.message || '上传失败')
    options.onError(error)
  } finally {
    uploadLoading.value = false
  }
}

// 移除视频
const handleVideoRemove = () => {
  form.videoUrl = ''
  videoFileList.value = []
}

// 打开对话框时初始化文件列表
const initFileList = () => {
  // 初始化图片文件列表
  if (form.image) {
    imageFileList.value = [{
      name: '当前图片',
      url: form.image
    }]
  } else {
    imageFileList.value = []
  }
  
  // 初始化视频文件列表（使用data URI显示视频图标）
  const videoPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMGYwZjAiLz48cG9seWdvbiBwb2ludHM9IjQwLDMwIDQwLDcwIDcwLDUwIiBmaWxsPSIjNjY2Ii8+PC9zdmc+'
  if (form.videoUrl) {
    videoFileList.value = [{
      name: '当前视频',
      url: videoPlaceholder
    }]
  } else {
    videoFileList.value = []
  }
}

// 计算属性：获取所有分类（包括父分类和子分类）用于显示
const allCategories = computed(() => {
  const result: Category[] = []
  categories.value.forEach(parent => {
    result.push(parent)
    if (parent.children && parent.children.length > 0) {
      result.push(...parent.children)
    }
  })
  return result
})

// 加载产品列表
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await getProductList({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    if (response.code === 200) {
      tableData.value = response.data.records
      total.value = response.data.total
      
      // 加载产品视频数量
      await loadProductVideoCounts()
    } else {
      ElMessage.error(response.message || '获取产品列表失败')
    }
  } catch (error: any) {
    console.error('加载产品列表失败', error)
    ElMessage.error(error.message || '获取产品列表失败')
  } finally {
    loading.value = false
  }
}

// 加载产品视频数量（优化版本）
const loadProductVideoCounts = async () => {
  // 如果没有产品数据,清空映射并返回
  if (tableData.value.length === 0) {
    videoCountMap.value = {}
    return
  }
  
  try {
    // 批量获取产品ID列表
    const productIds = tableData.value.map(p => p.id)
    
    // 批量查询产品视频数量（单次请求获取所有数量）
    const response = await getBatchProductVideoCounts(productIds)
    
    if (response.code === 200) {
      // 将数量映射到 videoCountMap
      videoCountMap.value = response.data || {}
    } else {
      // 失败时不影响主流程,只记录错误
      console.error('获取产品视频数量失败', response.message)
      videoCountMap.value = {}
    }
  } catch (error: any) {
    // 网络错误或其他异常,不影响主流程
    console.error('加载产品视频数量失败', error)
    videoCountMap.value = {}
  }
}

// 获取产品视频数量
const getVideoCount = (productId: number) => {
  return videoCountMap.value[productId] || 0
}

// 跳转到产品视频管理页面
const handleGoToVideos = (productId: number) => {
  router.push(`/product/videos/${productId}`)
}

// 加载分类列表（树形结构，用于显示）
const loadCategories = async () => {
  try {
    const response = await getCategories()
    
    if (response.code === 200) {
      categories.value = response.data
    } else {
      ElMessage.error(response.message || '获取分类列表失败')
    }
  } catch (error: any) {
    console.error('加载分类失败', error)
    ElMessage.error(error.message || '获取分类列表失败')
  }
}

// 加载子分类列表（用于产品关联）
const loadChildCategories = async () => {
  try {
    const response = await getChildCategories()
    
    if (response.code === 200) {
      childCategories.value = response.data
    } else {
      ElMessage.error(response.message || '获取子分类列表失败')
    }
  } catch (error: any) {
    console.error('加载子分类失败', error)
    ElMessage.error(error.message || '获取子分类列表失败')
  }
}

// 获取分类名称
const getCategoryName = (categoryId: number) => {
  const category = allCategories.value.find(c => c.id === categoryId)
  return category ? category.name : '-'
}

// 新增产品
const handleAdd = () => {
  dialogTitle.value = '新增产品'
  Object.assign(form, {
    id: undefined,
    name: '',
    code: '',
    categoryId: undefined,
    content: '',
    volume: '',
    image: '',
    videoUrl: '',
    burnDuration: undefined,
    status: 1
  })
  initFileList()
  dialogVisible.value = true
}

// 编辑产品
const handleEdit = (row: Product) => {
  dialogTitle.value = '编辑产品'
  Object.assign(form, row)
  initFileList()
  dialogVisible.value = true
}

// 删除产品
const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm('确定删除该产品吗？', '提示', { type: 'warning' })
    
    const response = await deleteProduct(row.id)
    
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadProducts()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  // 前端验证：确保选择的是子分类
  if (form.categoryId) {
    const selectedCategory = childCategories.value.find(c => c.id === form.categoryId)
    if (!selectedCategory) {
      ElMessage.error('请选择有效的子分类')
      return
    }
    // 双重检查：确保选择的分类是子分类（parentId > 0）
    if (!selectedCategory.parentId || selectedCategory.parentId === 0) {
      ElMessage.error('产品只能关联到子分类，不能关联到父分类')
      return
    }
  }
  
  try {
    let response
    if (form.id) {
      // 更新
      response = await updateProduct(form as Product)
    } else {
      // 新增
      response = await addProduct(form)
    }
    
    if (response.code === 200) {
      ElMessage.success(form.id ? '更新成功' : '添加成功')
      dialogVisible.value = false
      loadProducts()
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error: any) {
    console.error('保存失败', error)
    ElMessage.error(error.message || '操作失败')
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadProducts()
}

// 初始化
onMounted(() => {
  loadCategories()
  loadChildCategories()
  loadProducts()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>产品列表</span>
          <el-button type="primary" @click="handleAdd">新增产品</el-button>
        </div>
      </template>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="code" label="编号" />
        <el-table-column label="分类">
          <template #default="{ row }">
            {{ getCategoryName(row.categoryId) }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="含量" />
        <el-table-column label="产品视频" width="100" align="center">
          <template #default="{ row }">
            <el-link 
              v-if="getVideoCount(row.id) > 0"
              type="primary" 
              @click="handleGoToVideos(row.id)"
            >
              {{ getVideoCount(row.id) }} 个
            </el-link>
            <span v-else style="color: #909399;">0</span>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100" />
        <el-table-column prop="likes" label="点赞数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="产品名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品编号" prop="code" required>
          <el-input v-model="form.code" placeholder="请输入产品编号" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId" required>
          <el-select v-model="form.categoryId" placeholder="请选择分类（仅显示子分类）" style="width: 100%">
            <el-option
              v-for="category in childCategories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            >
              <span>{{ category.name }}</span>
              <span style="color: #8492a6; font-size: 12px; margin-left: 8px">
                ({{ getCategoryName(category.parentId || 0) }})
              </span>
            </el-option>
          </el-select>
          <div style="color: #909399; font-size: 12px; margin-top: 4px;">
            注意：产品只能关联到子分类，不能关联到父分类
          </div>
        </el-form-item>
        <el-form-item label="含量" prop="content">
          <el-input v-model="form.content" placeholder="如：6/50/35" />
        </el-form-item>
        <el-form-item label="体积" prop="volume">
          <el-input v-model="form.volume" placeholder="如：41*24.5*24.3" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image">
          <div style="width: 100%;">
            <el-upload
              v-model:file-list="imageFileList"
              :http-request="handleImageUpload"
              :before-upload="beforeImageUpload"
              :on-remove="handleImageRemove"
              :limit="1"
              list-type="picture-card"
              :disabled="imageUploadLoading"
            >
              <el-icon v-if="!imageUploadLoading"><Plus /></el-icon>
              <div v-else class="upload-loading">上传中...</div>
            </el-upload>
            <div style="color: #909399; font-size: 12px; margin-top: 4px;">
              支持图片格式(jpg、png、gif、webp)，大小不超过10MB
            </div>
            <el-input 
              v-model="form.image" 
              placeholder="或直接输入图片URL" 
              style="margin-top: 8px;"
            />
          </div>
        </el-form-item>
        <el-form-item label="视频URL" prop="videoUrl">
          <div style="width: 100%;">
            <el-upload
              v-model:file-list="videoFileList"
              :http-request="handleVideoUpload"
              :before-upload="beforeVideoUpload"
              :on-remove="handleVideoRemove"
              :limit="1"
              list-type="picture-card"
              :disabled="uploadLoading"
            >
              <el-icon v-if="!uploadLoading"><Plus /></el-icon>
              <div v-else class="upload-loading">上传中...</div>
            </el-upload>
            <div style="color: #909399; font-size: 12px; margin-top: 4px;">
              支持视频格式(mp4、mov、avi、wmv、flv)，大小不超过500MB，上传后自动生成封面
            </div>
            <el-input 
              v-model="form.videoUrl" 
              placeholder="或直接输入视频URL" 
              style="margin-top: 8px;"
            />
          </div>
        </el-form-item>
        <el-form-item label="燃放时长" prop="burnDuration">
          <el-input-number 
            v-model="form.burnDuration" 
            :min="0" 
            :max="9999" 
            placeholder="秒"
          />
          <span style="margin-left: 8px; color: #909399;">秒（小程序端显示"正常燃放时长约XX秒"）</span>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.upload-loading {
  font-size: 12px;
  color: #409eff;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>
