<template>
    <el-menu :default-active="'1'" class="el-menu-vertical-demo" background-color="#f4f4f4" text-color="#000" active-text-color="#20a0ff">
      <el-menu-item index="1">教师首页</el-menu-item>
      <el-menu-item index="2">课程管理</el-menu-item>
      <el-menu-item index="3">学生成绩</el-menu-item>
    </el-menu>
  </template>
  
  <script>
  export default {
    name: 'TeacherNavbar'
  }
  </script>
  