<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLoginConfig, updateLoginConfig, type LoginConfigResponse } from '@/api/login-config'

const loading = ref(false)
const config = ref<LoginConfigResponse>({
  wechatEnabled: true,
  phoneEnabled: true,
  forceBindPhone: false
})

// 配置变更历史(暂时使用模拟数据,待后端实现)
const historyData = ref<any[]>([])
const historyLoading = ref(false)

// 加载配置
const loadConfig = async () => {
  loading.value = true
  try {
    const res = await getLoginConfig()
    if (res.code === 200 && res.data) {
      config.value = res.data
    } else {
      ElMessage.error(res.message || '获取配置失败')
    }
  } catch (error) {
    console.error('获取登录配置失败:', error)
    ElMessage.error('获取配置失败')
  } finally {
    loading.value = false
  }
}

// 加载配置变更历史
const loadHistory = async () => {
  historyLoading.value = true
  try {
    // TODO: 待后端实现配置变更历史接口
    // const res = await getLoginConfigHistory()
    // if (res.code === 200 && res.data) {
    //   historyData.value = res.data
    // }
    
    // 暂时显示当前配置作为历史记录
    if (config.value.updatedAt) {
      historyData.value = [{
        id: 1,
        wechatEnabled: config.value.wechatEnabled,
        phoneEnabled: config.value.phoneEnabled,
        forceBindPhone: config.value.forceBindPhone,
        updatedBy: config.value.updatedBy || '系统',
        createdAt: config.value.updatedAt
      }]
    }
  } catch (error) {
    console.error('获取配置历史失败:', error)
  } finally {
    historyLoading.value = false
  }
}

// 保存配置
const handleSave = async () => {
  // 验证至少启用一种登录方式
  if (!config.value.wechatEnabled && !config.value.phoneEnabled) {
    ElMessage.warning('至少需要启用一种登录方式')
    return
  }

  // 如果禁用微信登录,强制绑定手机号也应该禁用
  if (!config.value.wechatEnabled && config.value.forceBindPhone) {
    ElMessageBox.confirm(
      '禁用微信登录后,强制绑定手机号功能将自动关闭,是否继续?',
      '提示',
      {
        type: 'warning',
        confirmButtonText: '继续',
        cancelButtonText: '取消'
      }
    ).then(() => {
      config.value.forceBindPhone = false
      saveConfig()
    }).catch(() => {
      // 用户取消
    })
    return
  }

  await saveConfig()
}

// 执行保存
const saveConfig = async () => {
  loading.value = true
  try {
    const res = await updateLoginConfig({
      wechatEnabled: config.value.wechatEnabled,
      phoneEnabled: config.value.phoneEnabled,
      forceBindPhone: config.value.forceBindPhone
    })
    
    if (res.code === 200) {
      ElMessage.success('保存成功')
      await loadConfig() // 重新加载配置
      await loadHistory() // 重新加载历史
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存登录配置失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 重置配置
const handleReset = () => {
  ElMessageBox.confirm('确定要重置为默认配置吗?', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    config.value = {
      wechatEnabled: true,
      phoneEnabled: true,
      forceBindPhone: false
    }
    ElMessage.success('已重置为默认配置,请点击保存按钮应用更改')
  }).catch(() => {
    // 用户取消
  })
}

// 格式化布尔值显示
const formatBoolean = (value: boolean) => {
  return value ? '启用' : '禁用'
}

onMounted(() => {
  loadConfig()
  loadHistory()
})
</script>

<template>
  <div class="page-container">
    <el-card shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>登录方式配置</span>
          <div>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSave" :loading="loading">保存配置</el-button>
          </div>
        </div>
      </template>

      <el-form :model="config" label-width="150px" style="max-width: 600px">
        <el-divider content-position="left">登录方式</el-divider>
        
        <el-form-item label="微信授权登录">
          <el-switch 
            v-model="config.wechatEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
          <div class="form-item-tip">
            启用后,用户可以通过微信快速登录小程序
          </div>
        </el-form-item>

        <el-form-item label="手机号密码登录">
          <el-switch 
            v-model="config.phoneEnabled"
            active-text="启用"
            inactive-text="禁用"
          />
          <div class="form-item-tip">
            启用后,用户可以使用手机号和密码登录
          </div>
        </el-form-item>

        <el-divider content-position="left">安全策略</el-divider>

        <el-form-item label="强制绑定手机号">
          <el-switch 
            v-model="config.forceBindPhone"
            active-text="启用"
            inactive-text="禁用"
            :disabled="!config.wechatEnabled"
          />
          <div class="form-item-tip">
            <span v-if="!config.wechatEnabled" style="color: #909399">
              需要先启用微信登录才能使用此功能
            </span>
            <span v-else>
              启用后,通过微信登录的用户必须绑定手机号才能使用完整功能
            </span>
          </div>
        </el-form-item>

        <el-divider content-position="left">配置信息</el-divider>

        <el-form-item label="最后更新时间" v-if="config.updatedAt">
          <span>{{ config.updatedAt }}</span>
        </el-form-item>

        <el-form-item label="更新人" v-if="config.updatedBy">
          <span>{{ config.updatedBy }}</span>
        </el-form-item>
      </el-form>

      <el-alert
        title="配置说明"
        type="info"
        :closable="false"
        style="margin-top: 20px"
      >
        <ul style="margin: 0; padding-left: 20px">
          <li>至少需要启用一种登录方式</li>
          <li>配置更改后立即生效,影响所有用户的登录行为</li>
          <li>强制绑定手机号功能仅对微信登录用户有效</li>
          <li>禁用某种登录方式不会影响已登录用户的使用</li>
        </ul>
      </el-alert>
    </el-card>

    <!-- 配置变更历史 -->
    <el-card shadow="never" style="margin-top: 20px">
      <template #header>
        <span>配置变更历史</span>
      </template>
      
      <el-table :data="historyData" v-loading="historyLoading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="微信登录" width="100">
          <template #default="{ row }">
            <el-tag :type="row.wechatEnabled ? 'success' : 'info'" size="small">
              {{ formatBoolean(row.wechatEnabled) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号登录" width="120">
          <template #default="{ row }">
            <el-tag :type="row.phoneEnabled ? 'success' : 'info'" size="small">
              {{ formatBoolean(row.phoneEnabled) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="强制绑定手机号" width="140">
          <template #default="{ row }">
            <el-tag :type="row.forceBindPhone ? 'warning' : 'info'" size="small">
              {{ formatBoolean(row.forceBindPhone) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedBy" label="更新人" width="120" />
        <el-table-column prop="createdAt" label="更新时间" />
      </el-table>

      <el-empty 
        v-if="!historyLoading && historyData.length === 0" 
        description="暂无配置变更历史"
        :image-size="100"
      />
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-item-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  line-height: 1.5;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}
</style>
