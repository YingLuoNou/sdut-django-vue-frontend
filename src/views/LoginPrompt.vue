<template>
    <el-card class="login-prompt-card">
      <div class="login-content">
        <h2 class="title">请先登录</h2>
        <p class="description">登录后才能访问系统的所有功能。</p>
        <el-button type="primary" class="login-button" @click="handleLoginClick">立即登录</el-button>
      </div>
    </el-card>
  </template>
  
  <script>
  export default {
    name: 'LoginPrompt',
    methods: {
      handleLoginClick() {
        // 这里可以添加登录跳转逻辑
        console.log("跳转到登录页");
      }
    }
  }
  </script>
  
  <style scoped>
  .login-prompt-card {
    background-color: #f9f9f9; /* 背景色简化为浅灰 */
    border-radius: 12px; /* 圆角，符合苹果风格 */
    padding: 40px;
    box-shadow: none; /* 去除阴影 */
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
    border: 1px solid #e1e1e1; /* 简单边框，增强结构感 */
  }
  
  .title {
    font-size: 28px;
    font-weight: 600;
    color: #333; /* 深灰色字体 */
    margin-bottom: 16px;
  }
  
  .description {
    font-size: 16px;
    color: #666; /* 浅灰色文字 */
    margin-bottom: 24px;
  }
  
  .login-button {
    background-color: #007aff; /* 苹果蓝色 */
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 8px; /* 圆角按钮 */
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s; /* 平滑过渡 */
  }
  
  .login-button:hover {
    background-color: #0051a8; /* 按钮悬停时变深 */
    transform: scale(1.05); /* 按钮缩放效果 */
  }
  
  .login-button:active {
    background-color: #003c75; /* 按钮点击时颜色 */
  }
  </style>
  