<template>
  <div class="delete-student-form">
    <h2>删除学生</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label>学号:
          <input v-model="username" placeholder="输入学号" required />
        </label>
      </div>
      <button type="submit">删除</button>
    </form>

    <div v-if="message" class="success">
      {{ message }}
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue"
import request from "@/utils/request"
import { ElMessage, ElMessageBox } from "element-plus"

const username = ref('')
const message = ref('')
const error = ref('')

async function submitForm() {
  message.value = ''
  error.value = ''
  try {
    const token = localStorage.getItem('access_token')
    await request.post(`/admin/students/delete/${username.value}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    message.value = `学生 ${username.value} 已被成功删除。`
    username.value = ''
  } catch (err) {
    if (err.response && err.response.data) {
      // 后端返回的 detail 或 message
      error.value = err.response.data.detail || err.response.data.message || JSON.stringify(err.response.data)
    } else {
      error.value = '网络或服务器错误，请重试。'
    }
  }
}
</script>

<style scoped>
.delete-student-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.delete-student-form div {
  margin-bottom: 12px;
}
.delete-student-form label {
  display: block;
  font-weight: 500;
}
.delete-student-form input {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
  box-sizing: border-box;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
