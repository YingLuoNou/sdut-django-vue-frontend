<template>
    <el-card class="login-card">
      <div class="login-form">
        <el-input v-model="username" placeholder="请输入用户名" />
        <el-input v-model="password" type="password" placeholder="请输入密码" />
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </div>
    </el-card>
  </template>
  
  <script lang="ts">
  // Login.vue
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.ts'
import request from '@/utils/request'

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('')
    const password = ref('')
    const userStore = useUserStore()
    const router = useRouter()

    const handleLogin = async () => {
      try {
        const response = await request.post('/token/', {
          username: username.value,
          password: password.value
        })
        console.log(response.access)
        if (response.access) {
          // 登录成功后保存 tokens 到 Pinia
          userStore.setTokens(response.access, response.refresh)

          // 登录成功后获取用户信息
          const userInfoResponse = await request.get('/UserInfoView/')
          console.log('User Info:', userInfoResponse)

          
        }
      } catch (error) {
        console.error('登录失败', error)
      }
    }

    return {
      username,
      password,
      handleLogin
    }
  }
})

  </script>
  
  <style scoped>
  .login-card {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  .login-form {
    display: flex;
    flex-direction: column;
  }
  </style>
  