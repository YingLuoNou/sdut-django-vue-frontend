<template>
    <!-- 底部固定横向导航栏 -->
    <el-footer class="navbar">
      <el-row type="flex" justify="center" align="middle" class="navbar-container">
        <el-col :span="24">
          <el-menu mode="horizontal" class="navbar-menu" active-text-color="#007bff">
            <el-menu-item index="1"><router-link to="/askleave">提交请假</router-link></el-menu-item>
            <el-menu-item index="2"><router-link to="/leaveinfo">查询请假信息</router-link></el-menu-item>
            <el-menu-item index="3"><router-link to="userinfo">个人信息</router-link></el-menu-item>
            <!-- <el-menu-item index="4">服务</el-menu-item>
            <el-menu-item index="5">联系我们</el-menu-item> -->
          </el-menu>
        </el-col>
      </el-row>
    </el-footer>
  </template>
  
  <script>
  export default {
    name: 'Stu_Navbar',
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
    padding: 0; /* 消除内边距 */
    margin: 0;  /* 消除外边距 */
  }
  
  /* 导航栏容器 */
  .navbar-container {
    width: 100%;
    padding: 0;
    margin: 0;
  }
  
  /* 菜单样式 */
  .navbar-menu {
    display: flex;
    justify-content: space-evenly; /* 平均分布菜单项 */
    padding: 0;
    margin: 0;
    background-color: #f9f9f9; /* 设置背景颜色 */
    border-radius: 0; /* 去掉默认边框 */
  }
  
  /* 单个菜单项样式 */
  .navbar-menu .el-menu-item {
    /* padding: 0 20px; */
    font-size: 16px;
    font-weight: 500;
    border: none;  /* 去除菜单项边框 */
    text-align: center; /* 文字居中 */
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
  
  /* 响应式设计，调整菜单项的间距和字体 */
  @media (max-width: 768px) {
    .navbar-menu .el-menu-item {
      padding: 0 15px;
      font-size: 14px;
    }
  }
  
  /* 高亮的选项卡样式 */
  .el-menu-item.is-active {
    background-color: #d5dbe0;
    color: white;
  }
  
  /* 鼠标悬停高亮样式 */
  .el-menu-item:hover {
    background-color: rgba(0, 123, 255, 0.2);
  }
  </style>
  