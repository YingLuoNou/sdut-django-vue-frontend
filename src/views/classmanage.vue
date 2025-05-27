<template>
    <div class="add-student-form">
        <h2>添加学生</h2>
        <form @submit.prevent="submitForm">
            <div>
                <label
                    >学号:
                    <input v-model="form.username" required />
                </label>
            </div>
            <div>
                <label
                    >姓名:
                    <input v-model="form.last_name" required />
                </label>
            </div>
            <div>
                <label
                    >密码:
                    <input
                        type="password"
                        v-model="form.password"
                        placeholder="默认123456"
                    />
                </label>
            </div>
            <div>
                <label
                    >邮箱:
                    <input type="email" v-model="form.email" />
                </label>
            </div>
            <div>
                <label
                    >班级:
                    <input v-model="form.class_name" required />
                </label>
            </div>
            <div>
                <label
                    >辅导员姓名:
                    <input v-model="form.advisor_last_name" required />
                </label>
            </div>
            <button type="submit">提交</button>
        </form>
        <div v-if="message" class="success">
            {{ message }}
        </div>
        <div v-if="errors" class="errors">
            <ul>
                <li v-for="(msgs, field) in errors" :key="field">
                    {{ field }}: {{ msgs.join(", ") }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue"
import request from "@/utils/request"
import { ElMessage, ElMessageBox } from "element-plus"

const form = reactive({
    username: "",
    password: "123456",
    last_name: "",
    email: "",
    class_name: "",
    advisor_last_name: ""
})

const message = ref("")
const errors = ref(null)

async function submitForm() {
    message.value = ""
    errors.value = null
    try {
        const response = await request.post("/admin/students/add/", form)
        message.value = response.message
        // 清空表单或保留视需求调整
    } catch (err) {
        if (err.response && err.response.data) {
            errors.value = err.response.data
        } else {
            message.value = "网络或服务器错误"
        }
    }
}
</script>

<style scoped>
.add-student-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}
.add-student-form div {
    margin-bottom: 12px;
}
.add-student-form label {
    display: block;
    font-weight: 500;
}
.add-student-form input {
    width: 100%;
    padding: 6px;
    margin-top: 4px;
    box-sizing: border-box;
}
.success {
    color: green;
    margin-top: 10px;
}
.errors {
    color: red;
    margin-top: 10px;
}
</style>
