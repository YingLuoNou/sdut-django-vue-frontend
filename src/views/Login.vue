<template>
  <el-card class="login-card">
    <div class="login-form">
      <img src="@/assets/favicon.ico" />
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
            router.replace({ path: '/userinfo' })
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
/* 设置卡片的外观和布局 */
.login-card {
  max-width: 400px;   /* 卡片的最大宽度 */
  margin: 100px auto;  /* 垂直居中并使卡片水平居中 */
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 轻微的阴影效果 */
}

/* 登录表单的布局样式 */
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;  /* 水平居中 */
}

/* 图片的样式 */
.login-form img {
  width: 50px;
  height: 50px;
  margin-bottom: 20px;  /* 图片和输入框之间的间距 */
}

/* 输入框的样式 */
.el-input {
  width: 100%;
  margin-bottom: 15px;  /* 输入框之间的间距 */
  font-size: 14px;  /* 输入框文字大小 */
  border-radius: 4px;  /* 边框圆角 */
  padding: 10px;
}

/* 按钮的样式 */
.el-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
}

/* 登录按钮的样式 */
.el-button.primary {
  background-color: #409eff;  /* Element Plus 默认蓝色 */
  color: white;
}

/* 鼠标悬停时按钮的颜色变化 */
.el-button.primary:hover {
  background-color: #66b1ff;
}

/* 反应式布局 */
@media (max-width: 480px) {
  .login-card {
    width: 90%;  /* 在小屏幕上卡片宽度为 90% */
    padding: 20px;
  }
  
  .el-input, .el-button {
    font-size: 14px;  /* 小屏幕上减小字体 */
  }
}
</style>
