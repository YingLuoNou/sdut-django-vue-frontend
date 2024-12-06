<template>
    <div class="common-layout">
      <el-container class="layout-container">
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-content">
            <span class="logo">电气学院请假系统</span>
            <div class="nav-items">
              <div class="nav-item">学生</div>
              <div class="nav-item">导员</div>
              <div class="nav-item">书记</div>
            </div>
          </div>
        </el-header>
        
        <!-- 主体区域 -->
        <el-main>
          <Login />
        </el-main>
  
        <!-- 底部区域 -->
        <el-footer class="footer">
          <div class="footer-content">
            <span>© 2024 EH 版权所有</span>
            <span class="privacy-policy">隐私政策</span> | <span class="terms-of-service">服务条款</span>
          </div>
        </el-footer>
      </el-container>
    </div>
  </template>
  
  <script>
  import LoginPrompt from '@/views/LoginPrompt.vue';
  import Login from '@/views/Login.vue';
  export default {
    components: {
      LoginPrompt,
      Login
    }
  }

  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background-color: #003366;
    color: #fff;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .logo {
    font-size: 20px;
    font-weight: bold;
  }
  
  .nav-items {
    display: flex;
    align-items: center;
  }
  
  .nav-item {
    margin-left: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }
  
  .nav-item:hover {
    text-decoration: underline;
  }
  
  .footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 20px 0;
    font-size: 14px;
    border-top: 1px solid #444;
  }
  
  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .footer-content span {
    margin: 0 10px;
  }
  
  .privacy-policy,
  .terms-of-service {
    color: #8e8e8e;
    cursor: pointer;
  }
  
  .privacy-policy:hover,
  .terms-of-service:hover {
    color: #fff;
    text-decoration: underline;
  }
  </style>
  