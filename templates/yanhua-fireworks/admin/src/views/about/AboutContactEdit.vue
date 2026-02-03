<template>
  <div class="about-contact-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>联系信息管理</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        v-loading="loading"
      >
        <!-- 公司名称 -->
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            v-model="formData.companyName"
            placeholder="请输入公司名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <!-- 地址 -->
        <el-form-item label="公司地址" prop="address">
          <el-input
            v-model="formData.address"
            type="textarea"
            :rows="3"
            placeholder="请输入公司地址"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <!-- Logo上传 -->
        <el-form-item label="公司Logo" prop="logoUrl">
          <el-input
            v-model="formData.logoUrl"
            placeholder="请输入Logo图片URL"
            maxlength="500"
          />
          <div class="form-tip">请先上传图片到服务器，然后填入图片URL</div>
        </el-form-item>

        <!-- 联系电话1 -->
        <el-form-item label="主要电话" prop="phone1">
          <el-input
            v-model="formData.phone1"
            placeholder="请输入主要联系电话"
            maxlength="20"
          />
        </el-form-item>

        <!-- 联系电话2 -->
        <el-form-item label="备用电话1" prop="phone2">
          <el-input
            v-model="formData.phone2"
            placeholder="请输入备用电话（选填）"
            maxlength="20"
          />
        </el-form-item>

        <!-- 联系电话3 -->
        <el-form-item label="备用电话2" prop="phone3">
          <el-input
            v-model="formData.phone3"
            placeholder="请输入备用电话（选填）"
            maxlength="20"
          />
        </el-form-item>

        <!-- 传真 -->
        <el-form-item label="传真" prop="fax">
          <el-input
            v-model="formData.fax"
            placeholder="请输入传真号码（选填）"
            maxlength="20"
          />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="100"
          />
        </el-form-item>

        <!-- 经度 -->
        <el-form-item label="经度" prop="longitude">
          <el-input
            v-model.number="formData.longitude"
            placeholder="请输入经度（用于地图导航）"
            type="number"
            step="0.000001"
          />
          <div class="form-tip">用于小程序一键导航功能</div>
        </el-form-item>

        <!-- 纬度 -->
        <el-form-item label="纬度" prop="latitude">
          <el-input
            v-model.number="formData.latitude"
            placeholder="请输入纬度（用于地图导航）"
            type="number"
            step="0.000001"
          />
          <div class="form-tip">用于小程序一键导航功能</div>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            保存
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getContact, updateContact, type AboutContact } from '@/api/about-contact'

// 表单引用
const formRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const formData = ref<{
  id: number
  logoUrl: string
  companyName: string
  address: string
  phone1: string
  phone2: string
  phone3: string
  fax: string
  email: string
  latitude: number | undefined
  longitude: number | undefined
}>({
  id: 1,
  logoUrl: '',
  companyName: '',
  address: '',
  phone1: '',
  phone2: '',
  phone3: '',
  fax: '',
  email: '',
  latitude: undefined,
  longitude: undefined
})

// 表单验证规则
const rules: FormRules = {
  logoUrl: [
    { required: true, message: '请输入Logo图片URL', trigger: 'blur' }
  ],
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入公司地址', trigger: 'blur' },
    { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
  ],
  phone1: [
    { required: true, message: '请输入主要联系电话', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/,
      message: '请输入正确的电话号码格式',
      trigger: 'blur'
    }
  ],
  phone2: [
    { 
      pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/,
      message: '请输入正确的电话号码格式',
      trigger: 'blur'
    }
  ],
  phone3: [
    { 
      pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/,
      message: '请输入正确的电话号码格式',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur'
    }
  ],
  latitude: [
    {
      type: 'number',
      min: -90,
      max: 90,
      message: '纬度范围为 -90 到 90',
      trigger: 'blur'
    }
  ],
  longitude: [
    {
      type: 'number',
      min: -180,
      max: 180,
      message: '经度范围为 -180 到 180',
      trigger: 'blur'
    }
  ]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getContact()
    console.log('=== API Response Debug ===')
    console.log('Full response:', res)
    console.log('res.data:', res.data)
    console.log('res.data.code:', res.data?.code)
    console.log('res.data.data:', res.data?.data)
    
    // 响应拦截器已返回 response.data，所以 res 就是 {code, message, data}
    if (res && res.code === 200 && res.data) {
      console.log('Setting formData with:', res.data)
      const data = res.data
      formData.value = {
        id: data.id || 1,
        logoUrl: data.logoUrl || '',
        companyName: data.companyName || '',
        address: data.address || '',
        phone1: data.phone1 || '',
        phone2: data.phone2 || '',
        phone3: data.phone3 || '',
        fax: data.fax || '',
        email: data.email || '',
        latitude: data.latitude,
        longitude: data.longitude
      }
      console.log('formData after set:', formData.value)
    } else {
      console.error('Invalid response structure:', res)
      ElMessage.error(res?.message || '数据格式错误')
    }
  } catch (error) {
    console.error('加载联系信息失败:', error)
    ElMessage.error('加载联系信息失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    submitting.value = true
    const res = await updateContact(formData.value)
    
    console.log('=== Update Response Debug ===')
    console.log('Full response:', res)
    console.log('res.data:', res.data)
    console.log('res.data.code:', res.data?.code)
    
    // 响应拦截器已返回 response.data
    if (res && res.code === 200) {
      ElMessage.success('保存成功')
      await loadData() // 重新加载数据
    } else {
      ElMessage.error(res?.message || '保存失败')
    }
  } catch (error: any) {
    if (error !== false) { // 不是表单验证错误
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
    }
  } finally {
    submitting.value = false
  }
}

// 取消
const handleCancel = () => {
  loadData() // 重新加载数据，恢复原始值
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.about-contact-edit {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-textarea__inner) {
    font-family: inherit;
  }
}
</style>
