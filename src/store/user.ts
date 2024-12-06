// store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 存储 access_token 和 refresh_token
  const accessToken = ref<string | null>(localStorage.getItem('access_token') || null)
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token') || null)

  // 设置 tokens
  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access
    refreshToken.value = refresh

    // 将 tokens 保存在 localStorage 中，方便后续使用
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  return {
    accessToken,
    refreshToken,
    setTokens
  }
})
