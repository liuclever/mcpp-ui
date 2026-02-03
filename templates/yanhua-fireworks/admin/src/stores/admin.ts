import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminLogin, getAdminInfo, adminLogout } from '@/api/admin'
import type { AdminLoginRequest, AdminInfo } from '@/api/types'
import router from '@/router'

export const useAdminStore = defineStore('admin', () => {
  const token = ref<string>(localStorage.getItem('admin_token') || '')
  const adminInfo = ref<AdminInfo | null>(null)
  
  // 登录
  const login = async (loginData: AdminLoginRequest) => {
    const res: any = await adminLogin(loginData)
    // 响应拦截器已返回response.data，所以res就是{code, data, message}
    const loginResponse = res.data
    token.value = loginResponse.token
    adminInfo.value = {
      id: loginResponse.id,
      username: loginResponse.username,
      nickname: loginResponse.nickname,
      role: loginResponse.role,
      status: 1,
      createTime: new Date().toISOString()
    }
    
    // 保存到localStorage
    localStorage.setItem('admin_token', loginResponse.token)
    localStorage.setItem('admin_info', JSON.stringify(adminInfo.value))
    
    console.log('✅ 登录成功，token已保存:', loginResponse.token.substring(0, 20) + '...')
    
    return res
  }
  
  // 获取管理员信息
  const fetchAdminInfo = async () => {
    const res: any = await getAdminInfo()
    // 响应拦截器已返回response.data，所以res就是{code, data, message}
    adminInfo.value = res.data
    localStorage.setItem('admin_info', JSON.stringify(adminInfo.value))
    return res
  }
  
  // 退出登录
  const logout = async () => {
    try {
      await adminLogout()
    } finally {
      token.value = ''
      adminInfo.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      router.push('/login')
    }
  }
  
  // 从localStorage恢复状态
  const restoreState = () => {
    const savedInfo = localStorage.getItem('admin_info')
    if (savedInfo) {
      try {
        adminInfo.value = JSON.parse(savedInfo)
      } catch (e) {
        console.error('恢复管理员信息失败', e)
      }
    }
  }
  
  return {
    token,
    adminInfo,
    login,
    fetchAdminInfo,
    logout,
    restoreState
  }
})
