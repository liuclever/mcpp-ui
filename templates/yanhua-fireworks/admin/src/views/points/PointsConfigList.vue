<template>
  <div class="points-config-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>积分规则配置</span>
          <el-button type="primary" @click="handleSaveAll" :loading="saving">
            保存全部
          </el-button>
        </div>
      </template>

      <el-alert
        title="积分规则说明"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <p>配置用户完成各种任务后获得的积分奖励。每日上限为0表示不限制次数。</p>
      </el-alert>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="ruleName" label="规则名称" width="120" />
        <el-table-column prop="ruleCode" label="规则代码" width="140">
          <template #default="{ row }">
            <el-tag size="small">{{ row.ruleCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分值" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.points"
              :min="0"
              :max="1000"
              size="small"
              style="width: 120px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="dailyLimit" label="每日上限" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.dailyLimit"
              :min="0"
              :max="100"
              size="small"
              style="width: 120px"
            />
            <span v-if="row.dailyLimit === 0" class="limit-tip">不限</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <el-input
              v-model="row.description"
              size="small"
              placeholder="规则描述"
            />
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              :active-value="1"
              :inactive-value="0"
              @change="handleToggle(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleSave(row)">
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="rules-preview">
        <h4>积分获取规则预览</h4>
        <ul>
          <li v-for="rule in enabledRules" :key="rule.id">
            <strong>{{ rule.ruleName }}</strong>：
            +{{ rule.points }}积分
            <span v-if="rule.dailyLimit > 0">（每日上限{{ rule.dailyLimit }}次）</span>
            <span v-else>（不限次数）</span>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  getPointsConfigList, 
  updatePointsConfig, 
  batchUpdatePointsConfig,
  togglePointsConfig,
  type PointsConfig 
} from '@/api/points-config'

const loading = ref(false)
const saving = ref(false)
const tableData = ref<PointsConfig[]>([])

// 已启用的规则
const enabledRules = computed(() => {
  return tableData.value.filter(r => r.enabled === 1)
})

// 加载配置列表
const loadData = async () => {
  loading.value = true
  try {
    const response = await getPointsConfigList()
    if (response.code === 200) {
      tableData.value = response.data || []
    } else {
      ElMessage.error(response.message || '加载失败')
    }
  } catch (error: any) {
    console.error('加载积分配置失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 切换启用状态
const handleToggle = async (row: PointsConfig) => {
  try {
    const response = await togglePointsConfig(row.id)
    if (response.code === 200) {
      ElMessage.success(response.message || '操作成功')
    } else {
      // 恢复原状态
      row.enabled = row.enabled === 1 ? 0 : 1
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error: any) {
    row.enabled = row.enabled === 1 ? 0 : 1
    ElMessage.error(error.message || '操作失败')
  }
}

// 保存单条配置
const handleSave = async (row: PointsConfig) => {
  try {
    const response = await updatePointsConfig(row.id, {
      points: row.points,
      dailyLimit: row.dailyLimit,
      description: row.description,
      enabled: row.enabled
    })
    if (response.code === 200) {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(response.message || '保存失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

// 保存全部配置
const handleSaveAll = async () => {
  saving.value = true
  try {
    const configs = tableData.value.map(r => ({
      id: r.id,
      points: r.points,
      dailyLimit: r.dailyLimit,
      description: r.description,
      enabled: r.enabled
    }))
    
    const response = await batchUpdatePointsConfig(configs)
    if (response.code === 200) {
      ElMessage.success('全部保存成功')
    } else {
      ElMessage.error(response.message || '保存失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.points-config-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.limit-tip {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

.rules-preview {
  margin-top: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.rules-preview h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.rules-preview ul {
  margin: 0;
  padding-left: 20px;
}

.rules-preview li {
  margin-bottom: 8px;
  color: #606266;
}

.rules-preview li strong {
  color: #409eff;
}
</style>
