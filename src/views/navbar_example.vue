<template>
    <!-- 底部固定横向导航栏 -->
    <el-footer class="navbar">
      <el-row type="flex" justify="space-between" align="middle" class="navbar-container">
        <el-col :span="24">
          <el-menu mode="horizontal" class="navbar-menu" active-text-color="#007bff">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">关于我们</el-menu-item>
            <el-menu-item index="3">产品</el-menu-item>
            <el-menu-item index="4">服务</el-menu-item>
            <el-menu-item index="5">联系我们</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-footer>
  </template>
  
  <script>
  export default {
    name: 'navbar_example',
  };
  </script>
  
  <style scoped>
  /* 底部固定导航栏样式 */
  .navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #343a40;
    color: white;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  /* 导航栏容器 */
  .navbar-container {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  
  /* 菜单样式 */
  .navbar-menu {
    display: flex;
    justify-content: center;
    padding: 0;
    margin: 0;
  }
  
  /* 单个菜单项样式 */
  .navbar-menu .el-menu-item {
    padding: 0 20px;
    font-size: 16px;
    font-weight: 500;
  }
  
  /* 鼠标悬停效果 */
  .navbar-menu .el-menu-item:hover {
    color: #007bff;
    text-decoration: underline;
  }
  
  /* 菜单项激活时的颜色 */
  .navbar-menu .el-menu-item.is-active {
    color: #007bff;
  }
  
  /* 响应式设计，调整菜单项的间距 */
  @media (max-width: 768px) {
    .navbar-menu .el-menu-item {
      padding: 0 10px;
      font-size: 14px;
    }
  }
  </style>
  