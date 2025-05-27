<template>
    <el-card class="login-card">
        <div class="login-form">
            <img src="@/assets/favicon.ico" alt="logo" />
            <el-input v-model="username" placeholder="请输入用户名" />
            <el-input
                v-model="password"
                type="password"
                placeholder="请输入密码"
            />
            <el-button type="primary" @click="handleLogin">登录</el-button>
        </div>
    </el-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/user"
import request from "@/utils/request"
import { ElMessage } from "element-plus"

export default defineComponent({
    name: "Login",
    setup() {
        const username = ref("")
        const password = ref("")
        const userStore = useUserStore()
        const router = useRouter()

        const handleLogin = async () => {
            try {
                // 只传相对路径，baseURL + prefix 已在 request.ts 里配置好
                const response = await request.post("/token/", {
                    username: username.value,
                    password: password.value
                })
                const data = response.data
                if (data.access) {
                    // 保存 tokens 到 Pinia
                    userStore.setTokens(data.access, data.refresh)
                    // 拉取并保存用户信息
                    await userStore.fetchUserInfo()
                    ElMessage.success("登录成功！")

                    // 根据用户组跳转
                    const group = userStore.userInfo.user_group
                    if (group === "stu") {
                        router.replace({ path: "/userinfo" })
                    } else if (group === "tch") {
                        router.replace({ path: "/tchinfo" })
                    } else {
                        router.replace({ path: "/" })
                    }
                } else {
                    ElMessage.error("获取 token 失败，请稍后再试。")
                }
            } catch (err) {
                console.error("登录失败", err)
                ElMessage.error("登录失败，请检查用户名或密码！")
            }
        }

        return {
            username,
            password,
            handleLogin
        }
    }
})
</script>

<style scoped>
.login-card {
    max-width: 400px;
    margin: 100px auto;
    padding: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.login-form img {
    width: 50px;
    height: 50px;
    margin-bottom: 20px;
}
.el-input {
    width: 100%;
    margin-bottom: 15px;
}
.el-button {
    width: 100%;
}
@media (max-width: 480px) {
    .login-card {
        width: 90%;
        padding: 20px;
    }
    .el-input,
    .el-button {
        font-size: 14px;
    }
}
</style>
