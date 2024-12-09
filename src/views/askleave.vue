<template>
    <el-card class="leave-request-card">
      <h3>请假申请</h3>
  
      <!-- 表单区域 -->
      <el-form :model="leaveForm" ref="form" label-width="100px" @submit.prevent="submitLeaveRequest">
        <el-form-item label="姓名" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
          <el-input v-model="leaveForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
  
        <el-form-item label="学号" :rules="[{ required: true, message: '请输入学号', trigger: 'blur' }]">
          <el-input v-model="leaveForm.studentNumber" placeholder="请输入学号"></el-input>
        </el-form-item>
  
        <el-form-item label="请假开始日期" :rules="[{ required: true, message: '请选择请假开始日期', trigger: 'change' }]">
          <el-date-picker v-model="leaveForm.startDate" type="date" placeholder="请选择请假开始日期"></el-date-picker>
        </el-form-item>
  
        <el-form-item label="请假结束日期" :rules="[{ required: true, message: '请选择请假结束日期', trigger: 'change' }]">
          <el-date-picker v-model="leaveForm.endDate" type="date" placeholder="请选择请假结束日期"></el-date-picker>
        </el-form-item>
  
        <el-form-item label="请假原因" :rules="[{ required: true, message: '请输入请假原因', trigger: 'blur' }]">
          <el-input v-model="leaveForm.reason" type="textarea" placeholder="请输入请假原因" :rows='4'></el-input>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="submitLeaveRequest">提交申请</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'Ask_Leave',
    setup() {
      // 表单数据
      const leaveForm = ref({
        startDate: '',
        endDate: '',
        reason: ''
      })
  
      // 提交请假请求
      const submitLeaveRequest = () => {
        // 校验表单
        const form = this.$refs.form
        form.validate((valid) => {
          if (valid) {
            // 假设这里发送到后端 API
            console.log('提交的请假数据:', leaveForm.value)
  
            // 提交成功提示
            ElMessage.success('请假申请提交成功！')
          } else {
            ElMessage.error('请检查表单项')
          }
        })
      }
  
      // 重置表单
      const resetForm = () => {
        leaveForm.value = {
          startDate: '',
          endDate: '',
          reason: ''
        }
      }
  
      return {
        leaveForm,
        submitLeaveRequest,
        resetForm
      }
    }
  }
  </script>
  
  <style scoped>
  .leave-request-card {
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-button {
    margin-right: 10px;
  }
  </style>
  