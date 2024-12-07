<template>
    <div class="navbar">
      <ul class="nav-items">
        <li class="nav-item">请假</li>
        <li class="nav-item">查看请假</li>
        <li class="nav-item">信息</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StudentNavbar'
  }
  </script>
  
  <style scoped>
  .navbar {
    width: 100%;
    background-color: transparent; /* 背景透明 */
    padding: 10px 20px;
  }
  
  .nav-items {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: flex-end; /* 使菜单项右对齐 */
  }
  
  .nav-item {
    margin-left: 20px;
    font-family: 'Arial', sans-serif; /* 使用黑体字体 */
    font-weight: 400;
    color: white; /* 文字为白色 */
    cursor: pointer;
  }
  
  .nav-item:hover {
    text-decoration: underline; /* 鼠标悬停时加下划线 */
  }
  </style>
  