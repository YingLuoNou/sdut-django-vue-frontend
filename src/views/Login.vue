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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.ts'
import request from '@/utils/request'
import { ElMessage } from 'element-plus' // 导入 ElMessage

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('')
    const password = ref('')
    const userStore = useUserStore()
    const router = useRouter()

    const handleLogin = async () => {
      try {
        // 使用 POST 请求来获取 token
        const response = await request.post('https://sdut.ehzsy.online/api/token/', {
          username: username.value,
          password: password.value
        })

        if (response.access) {
          // 登录成功后保存 tokens 到 Pinia（用户 store）
          userStore.setTokens(response.access, response.refresh)

          // 登录成功后获取并保存用户信息
          await userStore.fetchUserInfo()
          console.log('登录成功！', userStore.userInfo)
          ElMessage.success('登录成功！')
          if(userStore.userInfo.user_group == "stu"){
            router.replace({ path: '/' })
          }
          // 只更新 URL，不跳转页面
          // router.replace({ path: '/', query: { loggedIn: 'true' } })
        } else {
          ElMessage.error('获取 token 失败，请稍后再试。')
        }
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名或密码！')
        console.error('登录失败', error)
      }
    }

    return {
      username,
      password,
      handleLogin,
      userInfo: userStore.userInfo // 获取用户信息
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
