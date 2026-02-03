<template>
  <div class="comment-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>产品评论管理</span>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 150px">
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="未通过" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品ID">
          <el-input v-model="searchForm.productId" placeholder="请输入产品ID" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="commentList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="productId" label="产品ID" width="120" />
        <el-table-column label="用户信息" width="220">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="40" :src="getUserAvatar(row.userAvatar)" />
              <span class="user-name">{{ row.userName || '未知用户' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" min-width="320">
          <template #default="{ row }">
            <div class="comment-content">{{ row.content }}</div>
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
            <el-button v-if="row.status === 0" type="success" size="small" @click="handleReview(row, 1)">通过</el-button>
            <el-button v-if="row.status === 0" type="warning" size="small" @click="handleReview(row, 2)">拒绝</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductCommentList, reviewProductComment, deleteProductComment } from '@/api/product-comment'

const router = useRouter()

const searchForm = reactive({
  status: null as number | null,
  productId: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const commentList = ref<any[]>([])
const loading = ref(false)

const loadCommentList = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
      return
    }

    const params = {
      status: searchForm.status === null ? undefined : searchForm.status,
      productId: searchForm.productId || undefined,
      page: pagination.page,
      pageSize: pagination.pageSize
    }

    const res: any = await getProductCommentList(params)
    if (res.code === 200 && res.data) {
      commentList.value = res.data.records || res.data.list || []
      pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '加载评论列表失败')
    }
  } catch (error: any) {
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

const handleSearch = () => {
  pagination.page = 1
  loadCommentList()
}

const handleReset = () => {
  searchForm.status = null
  searchForm.productId = ''
  pagination.page = 1
  loadCommentList()
}

const handleReview = async (row: any, status: number) => {
  try {
    await reviewProductComment({
      commentId: row.id,
      status
    })
    ElMessage.success('审核成功')
    loadCommentList()
  } catch (error) {
    ElMessage.error('审核失败')
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteProductComment(row.id)
    ElMessage.success('删除成功')
    loadCommentList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = () => {
  pagination.page = 1
  loadCommentList()
}

const handlePageChange = () => {
  loadCommentList()
}

onMounted(() => {
  loadCommentList()
})

const getUserAvatar = (avatar: string | null | undefined) => {
  if (!avatar) {
    return '/assets/images/default-avatar.png'
  }

  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }

  if (avatar.startsWith('/')) {
    return `https://fireworks-project.zhengpan.cn${avatar}`
  }

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
