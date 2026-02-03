<template>
  <div class="form-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>招商加盟表单管理</span>
          <el-button type="primary" @click="handleExport">导出Excel</el-button>
        </div>
      </template>

      <!-- 搜索筛选区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable @change="handleSearch">
            <el-option label="待处理" value="pending" />
            <el-option label="已联系" value="contacted" />
            <el-option label="已成交" value="closed" />
            <el-option label="已放弃" value="abandoned" />
          </el-select>
        </el-form-item>

        <el-form-item label="提交时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="handleSearch"
          />
        </el-form-item>

        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="姓名或手机号"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #append>
              <el-button icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column label="地区" width="200">
          <template #default="{ row }">
            {{ row.province }} {{ row.city }} {{ row.district || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="投资预算" width="120" />
        <el-table-column prop="message" label="留言" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
        class="pagination"
      />
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="表单详情" width="600px">
      <el-descriptions :column="1" border v-if="currentForm">
        <el-descriptions-item label="姓名">{{ currentForm.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentForm.phone }}</el-descriptions-item>
        <el-descriptions-item label="地区">
          {{ currentForm.province }} {{ currentForm.city }} {{ currentForm.district || '' }}
        </el-descriptions-item>
        <el-descriptions-item label="投资预算">{{ currentForm.budget || '未填写' }}</el-descriptions-item>
        <el-descriptions-item label="留言内容">{{ currentForm.message || '无' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentForm.status)">
            {{ getStatusText(currentForm.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentForm.submitTime }}</el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ currentForm.handleTime || '未处理' }}</el-descriptions-item>
        <el-descriptions-item label="处理备注">{{ currentForm.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 处理对话框 -->
    <el-dialog v-model="editVisible" title="处理表单" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="处理状态">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option label="待处理" value="pending" />
            <el-option label="已联系" value="contacted" />
            <el-option label="已成交" value="closed" />
            <el-option label="已放弃" value="abandoned" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input
            v-model="editForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入处理备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFormSubmissions, getFormSubmissionDetail, updateFormStatus, exportFormSubmissions } from '@/api/form'
import type { FormSubmission } from '@/api/form'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const tableData = ref<FormSubmission[]>([])
const detailVisible = ref(false)
const editVisible = ref(false)
const currentForm = ref<FormSubmission | null>(null)
const dateRange = ref<[string, string] | null>(null)

const searchForm = reactive({
  status: '',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const editForm = reactive({
  id: 0,
  status: '',
  remark: ''
})

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }

    if (searchForm.status) {
      params.status = searchForm.status
    }

    if (searchForm.keyword) {
      params.keyword = searchForm.keyword
    }

    if (dateRange.value && dateRange.value.length === 2) {
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }

    const res: any = await getFormSubmissions(params)
    if (res && res.code === 200) {
      tableData.value = res.data.list || res.data.records || []
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

async function handleView(row: FormSubmission) {
  router.push({
    path: '/enterprise/form/detail',
    query: { id: row.id }
  })
}

function handleEdit(row: FormSubmission) {
  editForm.id = row.id!
  editForm.status = row.status
  editForm.remark = row.remark || ''
  editVisible.value = true
}

async function handleSave() {
  saving.value = true
  try {
    const res: any = await updateFormStatus(editForm.id, {
      status: editForm.status,
      remark: editForm.remark
    })
    if (res && res.code === 200) {
      ElMessage.success('保存成功')
      editVisible.value = false
      loadData()
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function handleExport() {
  try {
    // 构建导出条件描述
    const conditions: string[] = []
    if (searchForm.status) {
      conditions.push(`状态: ${getStatusText(searchForm.status)}`)
    }
    if (dateRange.value && dateRange.value.length === 2) {
      conditions.push(`时间: ${dateRange.value[0]} 至 ${dateRange.value[1]}`)
    }
    if (searchForm.keyword) {
      conditions.push(`关键词: ${searchForm.keyword}`)
    }

    const conditionText = conditions.length > 0 
      ? `\n\n当前筛选条件:\n${conditions.join('\n')}`
      : '\n\n将导出全部数据'

    await ElMessageBox.confirm(
      `确定要导出表单数据吗？${conditionText}`,
      '导出确认',
      {
        type: 'info',
        confirmButtonText: '确定导出',
        cancelButtonText: '取消'
      }
    )

    ElMessage.info('正在导出数据...')

    const params: any = {}

    if (searchForm.status) {
      params.status = searchForm.status
    }

    if (dateRange.value && dateRange.value.length === 2) {
      params.startTime = dateRange.value[0]
      params.endTime = dateRange.value[1]
    }

    if (searchForm.keyword) {
      params.keyword = searchForm.keyword
    }

    const res: any = await exportFormSubmissions(params)
    if (res && res.code === 200) {
      // 将数据转换为Excel兼容的CSV格式并下载
      const data = res.data.list || res.data.records || []
      if (data.length === 0) {
        ElMessage.warning('没有数据可导出')
        return
      }

      // 创建CSV内容（Excel兼容格式）
      const headers = ['ID', '姓名', '手机号', '省份', '城市', '区县', '投资预算', '留言', '状态', '提交时间', '处理时间', '备注']
      const csvContent = [
        headers.join(','),
        ...data.map((item: FormSubmission) => [
          item.id,
          escapeCSVField(item.name),
          escapeCSVField(item.phone),
          escapeCSVField(item.province),
          escapeCSVField(item.city),
          escapeCSVField(item.district || ''),
          escapeCSVField(item.budget || ''),
          escapeCSVField(item.message || ''),
          escapeCSVField(getStatusText(item.status)),
          escapeCSVField(item.submitTime || ''),
          escapeCSVField(item.handleTime || ''),
          escapeCSVField(item.remark || '')
        ].join(','))
      ].join('\n')

      // 添加BOM以支持中文，使用xls扩展名以便Excel直接打开
      const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      
      // 生成文件名，包含日期
      const now = new Date()
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
      link.download = `招商加盟表单_${dateStr}.xls`
      link.click()

      ElMessage.success(`导出成功，共 ${data.length} 条数据`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('导出失败:', error)
      ElMessage.error('导出失败')
    }
  }
}

// CSV字段转义函数
function escapeCSVField(field: string): string {
  if (!field) return ''
  // 如果字段包含逗号、双引号或换行符，需要用双引号包裹并转义内部双引号
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    contacted: 'primary',
    closed: 'success',
    abandoned: 'info'
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    pending: '待处理',
    contacted: '已联系',
    closed: '已成交',
    abandoned: '已放弃'
  }
  return textMap[status] || status
}
</script>

<style scoped>
.form-list {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
