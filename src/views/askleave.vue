<template>
  <el-card class="leave-request-card">
    <h3>请假申请</h3>

    <!-- 表单区域 -->
    <el-form
      :model="leaveForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      @submit.prevent="submitLeaveRequest"
    >
      <!-- 请假开始时间 -->
      <el-form-item label="开始时间" prop="start_date">
        <el-date-picker
          v-model="leaveForm.start_date"
          type="datetime"
          placeholder="请选择请假开始时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>

      <!-- 请假结束时间 -->
      <el-form-item label="结束时间" prop="end_date">
        <el-date-picker
          v-model="leaveForm.end_date"
          type="datetime"
          placeholder="请选择请假结束时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>

      <!-- 请假原因 -->
      <el-form-item label="请假原因" prop="reason">
        <el-input
          v-model="leaveForm.reason"
          type="textarea"
          placeholder="请输入请假原因"
          :rows="4"
        ></el-input>
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
import request from '@/utils/request' // 根据实际路径修改

export default {
  name: 'Ask_Leave',
  setup() {
    const formRef = ref(null)

    const leaveForm = ref({
      start_date: null,
      end_date: null,
      reason: ''
    })

    const rules = {
      start_date: [
        { required: true, message: '请选择请假开始时间', trigger: 'change' }
      ],
      end_date: [
        { required: true, message: '请选择请假结束时间', trigger: 'change' }
      ],
      reason: [
        { required: true, message: '请输入请假原因', trigger: 'blur' }
      ]
    }

    const submitLeaveRequest = async () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await request.post('/request-leave/', leaveForm.value)
            console.log('后端返回数据:', response)
            ElMessage.success('请假申请提交成功！')
            // 根据需要在此进行其他逻辑操作，如清空表单等
          } catch (error) {
            console.error('提交请求时出错:', error)
            ElMessage.error('提交失败，请稍后重试')
          }
        } else {
          ElMessage.error('请检查表单项')
        }
      })
    }

    const resetForm = () => {
      formRef.value.resetFields()
    }

    return {
      leaveForm,
      submitLeaveRequest,
      resetForm,
      formRef,
      rules
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
