<template>
    <el-card class="dashboard-card">
      <div class="dashboard-content">
        <!-- 显示欢迎信息 -->
        <h2 v-if="userInfo.username">欢迎回来，{{ userInfo.username }}!</h2>
        <h2 v-else>加载中...</h2>
        <p v-if="userInfo.user_group">用户组: {{ userInfo.user_group }}</p>
  
        <div v-if="userInfo.class_name">
          <p>欢迎，{{ userInfo.first_name }} {{ userInfo.last_name }}</p>
          <p>学号：{{ userInfo.student_number }}</p>
          <p>班级：{{ userInfo.class_name }}</p>
          <p>用户组：{{ userInfo.user_group }}</p>
        </div>
        <!-- 纵向排列统计卡片 -->
        <el-row gutter="20" direction="vertical">
          <el-col :span="24">
            <el-card>
              <h3>统计一</h3>
              <p>这里可以显示一些统计数据或者其他信息。</p>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card>
              <h3>统计二</h3>
              <p>这里可以显示一些统计数据或者其他信息。</p>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card>
              <h3>统计三</h3>
              <p>这里可以显示一些统计数据或者其他信息。</p>
            </el-card>
          </el-col>
        </el-row>
  
        <!-- 注销按钮 -->
        <el-button 
          type="danger" 
          icon="el-icon-switch-button" 
          @click="handleLogout" 
          class="logout-button">
          注销登录
        </el-button>
      </div>
    </el-card>
  </template>
  
  <script>
  import { defineComponent, onMounted, computed } from 'vue'
  import { useUserStore } from '@/store/user'
  import { useRouter } from 'vue-router'
  
  export default defineComponent({
    name: 'Dashboard',
    setup() {
      const userStore = useUserStore()
      const router = useRouter()
  
      // 页面加载时获取用户信息
      onMounted(async () => {
        if (!userStore.userGroup) {
          await userStore.fetchUserInfo()
        }
      })
  
      // 通过计算属性获取用户信息
      const userInfo = computed(() => ({
        username: '用户名',  // 如果你在 userStore 中存储更多用户信息，可以从中提取。
        user_group: userStore.userGroup || '未知'
      }))
  
      // 处理注销操作
      const handleLogout = () => {
        userStore.setTokens(null, null) // 清除 tokens
        router.push('/') // 跳转到登录页面
      }
  
      return {
        userInfo,
        handleLogout
      }
    }
  })
  </script>
  
  <style scoped>
  .dashboard-card {
    padding: 20px;
    max-width: 1000px;
    margin: 20px auto;
  }
  
  .dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
  }
  
  h2 {
    font-size: 24px;
    color: #333;
  }
  
  p {
    font-size: 16px;
    color: #666;
  }
  
  .el-row {
    margin-top: 20px;
  }
  
  .el-card {
    margin-bottom: 20px;
  }
  
  /* 右下角的注销按钮 */
  .logout-button {
    position: relative;
    /* bottom: 20px; */
    /* right: 20px; */
    z-index: 100;
  }
  </style>
  