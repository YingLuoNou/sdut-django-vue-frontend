import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

// 定义接口，确保返回的数据符合期望的结构
interface UserInfo {
  class_name: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  student_number: string | null
  user_group: string | null
}

interface RefreshResponse {
  access: string
  refresh: string
}

export const useUserStore = defineStore('user', () => {
  // 存储 access_token 和 refresh_token
  const accessToken = ref<string | null>(localStorage.getItem('access_token') || null)
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token') || null)

  // 存储用户的详细信息
  const userInfo = ref<UserInfo>({
    class_name: null,
    email: null,
    first_name: null,
    last_name: null,
    student_number: null,
    user_group: null
  })

  // 设置 tokens
  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access
    refreshToken.value = refresh

    // 将 tokens 保存在 localStorage 中，方便后续使用
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  // 刷新 accessToken
  const refreshAccessToken = async () => {
    if (refreshToken.value) {
      try {
        const response = await request.post<RefreshResponse>('/refresh-token/', {
          refresh: refreshToken.value
        })
        if (response && response.access && response.refresh) {
          setTokens(response.access, response.refresh)
        }
      } catch (error) {
        console.error('刷新 token 失败', error)
      }
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await request.get<UserInfo>('/UserInfoView/')
      if (response) {
        userInfo.value = {
          class_name: response.class_name || null,
          email: response.email || null,
          first_name: response.first_name || null,
          last_name: response.last_name || null,
          student_number: response.student_number || null,
          user_group: response.user_group || null
        }
        // console.log('获取用户信息成功', userInfo.value)
      }
    } catch (error) {
      console.error('获取用户信息失败', error)
      // 如果获取失败，可以清空用户信息
      userInfo.value = {
        class_name: null,
        email: null,
        first_name: null,
        last_name: null,
        student_number: null,
        user_group: null
      }
    }
  }

  // 初始化时检查 accessToken 是否有效
  const initializeUser = async () => {
    if (accessToken.value) {
      await fetchUserInfo()
    } else {
      // 如果没有 accessToken，清空用户信息
      userInfo.value = {
        class_name: null,
        email: null,
        first_name: null,
        last_name: null,
        student_number: null,
        user_group: null
      }
    }
  }

  return {
    accessToken,
    refreshToken,
    userInfo,
    setTokens,
    refreshAccessToken,
    fetchUserInfo,
    initializeUser
  }
})
