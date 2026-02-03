<template>
  <div class="sales-point-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>销售网点管理</span>
          <el-button type="primary" @click="handleAdd">新增网点</el-button>
        </div>
      </template>

      <!-- 搜索筛选区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="省份">
          <el-select 
            v-model="searchForm.province" 
            placeholder="全部省份" 
            clearable 
            filterable
            @change="handleProvinceChange"
          >
            <el-option 
              v-for="province in provinceList" 
              :key="province" 
              :label="province" 
              :value="province" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="城市">
          <el-select 
            v-model="searchForm.city" 
            placeholder="全部城市" 
            clearable 
            filterable
            @change="handleSearch"
          >
            <el-option 
              v-for="city in cityList" 
              :key="city" 
              :label="city" 
              :value="city" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="网点名称或地址"
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
        <el-table-column prop="name" label="网点名称" width="180" show-overflow-tooltip />
        <el-table-column label="地区" width="200">
          <template #default="{ row }">
            {{ row.province }} {{ row.city }} {{ row.district || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="详细地址" show-overflow-tooltip />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="businessHours" label="营业时间" width="150" />
        <el-table-column prop="enabled" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.enabled === 1 ? 'success' : 'info'">
              {{ row.enabled === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSalesPointList, deleteSalesPoint } from '@/api/sales-point'
import type { SalesPoint } from '@/api/sales-point'

const router = useRouter()
const loading = ref(false)
const tableData = ref<SalesPoint[]>([])

// 省份和城市列表
const provinceList = ref<string[]>([
  '北京市', '天津市', '上海市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省', '甘肃省',
  '青海省', '台湾省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', 
  '宁夏回族自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区'
])

const cityList = ref<string[]>([])

const searchForm = reactive({
  province: '',
  city: '',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
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

    if (searchForm.province) {
      params.province = searchForm.province
    }

    if (searchForm.city) {
      params.city = searchForm.city
    }

    if (searchForm.keyword) {
      params.keyword = searchForm.keyword
    }

    const res = await getSalesPointList(params)
    if (res && res.code === 200) {
      // 处理响应数据
      if (res.data && res.data.records) {
        tableData.value = res.data.records
        pagination.total = res.data.total
      } else if (res.data && res.data.list) {
        tableData.value = res.data.list
        pagination.total = res.data.total
      } else if (Array.isArray(res.data)) {
        tableData.value = res.data
        pagination.total = res.data.length
      } else {
        tableData.value = []
        pagination.total = 0
      }
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

function handleProvinceChange() {
  // 清空城市选择
  searchForm.city = ''
  // 根据省份加载城市列表（这里简化处理，实际可以从后端获取）
  updateCityList(searchForm.province)
  handleSearch()
}

function updateCityList(province: string) {
  // 简化的城市列表，实际项目中应该从后端获取或使用完整的省市区数据
  const cityMap: Record<string, string[]> = {
    '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
    '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
    '北京市': ['北京市'],
    '上海市': ['上海市'],
    '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
    '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市']
  }
  
  cityList.value = cityMap[province] || []
}

function handleAdd() {
  router.push('/enterprise/sales-point/edit')
}

function handleEdit(row: SalesPoint) {
  router.push({
    path: '/enterprise/sales-point/edit',
    query: { id: row.id }
  })
}

async function handleDelete(row: SalesPoint) {
  try {
    await ElMessageBox.confirm(
      `确定要删除网点"${row.name}"吗？删除后将无法恢复。`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      }
    )

    const res = await deleteSalesPoint(row.id!)
    if (res && res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(res?.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style scoped>
.sales-point-list {
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
