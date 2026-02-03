<template>
  <div class="comment-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>UGC评论管理</span>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 150px">
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="未通过" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频ID">
          <el-input v-model="searchForm.videoId" placeholder="请输入视频ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 评论列表 -->
      <el-table :data="commentList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="videoId" label="视频ID" width="100" />
        <el-table-column label="用户信息" width="200">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="40" :src="getUserAvatar(row.userAvatar)" />
              <span class="user-name">{{ row.userName || '未知用户' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" min-width="300">
          <template #default="{ row }">
            <div class="comment-content">
              {{ row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞数" width="100" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="row.status === 1" type="success">已通过</el-tag>
            <el-tag v-else-if="row.status === 2" type="danger">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 0"
              type="success"
              size="small"
              @click="handleReview(row, 1)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="warning"
              size="small"
              @click="handleReview(row, 2)"
            >
              拒绝
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 拒绝原因对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="拒绝原因" width="500px">
      <el-form :model="rejectForm">
        <el-form-item label="拒绝原因">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCommentList, reviewComment, deleteComment } from '@/api/comment'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  status: null as number | null,
  videoId: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 评论列表
const commentList = ref<any[]>([])
const loading = ref(false)

// 拒绝对话框
const rejectDialogVisible = ref(false)
const rejectForm = reactive({
  commentId: 0,
  reason: ''
})

// 加载评论列表
const loadCommentList = async () => {
  loading.value = true
  try {
    // 检查token是否存在
    const token = localStorage.getItem('admin_token')
    if (!token) {
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
      return
    }
    
    const params = {
      status: searchForm.status === null ? undefined : searchForm.status,
      videoId: searchForm.videoId || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const res: any = await getCommentList(params)
    if (res.code === 200 && res.data) {
      commentList.value = res.data.records || res.data.list || []
      pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '加载评论列表失败')
    }
  } catch (error: any) {
    console.error('Load error:', error)
    
    // 如果是401错误，清除token并跳转登录
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      router.push('/login')
    } else {
      ElMessage.error('加载评论列表失败')
    }
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadCommentList()
}

// 重置
const handleReset = () => {
  searchForm.status = null
  searchForm.videoId = ''
  pagination.page = 1
  loadCommentList()
}

// 审核评论
const handleReview = async (row: any, status: number) => {
  if (status === 2) {
    // 拒绝需要填写原因
    rejectForm.commentId = row.id
    rejectForm.reason = ''
    rejectDialogVisible.value = true
  } else {
    // 通过直接审核
    try {
      console.log('开始审核评论:', row.id, '状态:', status)
      const res = await reviewComment({
        commentId: row.id,
        status: status
      })
      console.log('审核响应:', res)
      ElMessage.success('审核成功')
      console.log('开始刷新列表...')
      await loadCommentList()
      console.log('列表刷新完成')
    } catch (error) {
      console.error('审核失败:', error)
      ElMessage.error('审核失败')
    }
  }
}

// 确认拒绝
const confirmReject = async () => {
  if (!rejectForm.reason.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }
  
  try {
    console.log('开始拒绝评论:', rejectForm.commentId, '原因:', rejectForm.reason)
    const res = await reviewComment({
      commentId: rejectForm.commentId,
      status: 2,
      rejectReason: rejectForm.reason
    })
    console.log('拒绝响应:', res)
    ElMessage.success('审核成功')
    rejectDialogVisible.value = false
    console.log('开始刷新列表...')
    await loadCommentList()
    console.log('列表刷新完成')
  } catch (error) {
    console.error('拒绝失败:', error)
    ElMessage.error('审核失败')
  }
}

// 删除评论
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteComment(row.id)
    ElMessage.success('删除成功')
    loadCommentList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 分页变化
const handleSizeChange = () => {
  pagination.page = 1
  loadCommentList()
}

const handlePageChange = () => {
  loadCommentList()
}

// 初始化
onMounted(() => {
  // 直接加载,路由守卫已经确保token可用
  loadCommentList()
})

// 获取用户头像URL（处理可能的格式错误）
const getUserAvatar = (avatar: string | null | undefined) => {
  if (!avatar) {
    return '/assets/images/default-avatar.png'
  }
  
  // 如果是完整URL，直接返回
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }
  
  // 如果是相对路径，添加基础URL
  if (avatar.startsWith('/')) {
    return `https://fireworks-project.zhengpan.cn${avatar}`
  }
  
  // 其他情况返回默认头像
  return '/assets/images/default-avatar.png'
}
</script>

<style scoped lang="scss">
.comment-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .user-name {
    font-size: 14px;
  }
}

.comment-content {
  line-height: 1.6;
  word-break: break-all;
}
</style>
