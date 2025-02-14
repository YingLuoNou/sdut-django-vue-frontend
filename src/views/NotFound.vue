<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const countdown = ref(5) // 倒计时时间（秒）
const router = useRouter()

onMounted(() => {
    const interval = setInterval(() => {
        countdown.value--
        if (countdown.value === 0) {
            clearInterval(interval) // 清理定时器
            router.push("/") // 自动跳转到首页
        }
    }, 1000)
})

const redirectToHome = () => {
    router.push("/") // 手动跳转到首页
}

const halo = () => {
    //   router.push('https://halo.ehzsy.online'); // 手动跳转到首页

    window.location.href = "https://halo.ehzsy.online" // 跳转到外部链接
}
</script>

<template>
    <div class="not-found">
        <p>404 这是一个未定义的页面</p>
        <p>将在 {{ countdown }} 秒后自动返回首页</p>
        <button @click="redirectToHome">立即返回首页</button>
        <div></div>
        <button @click="halo">您也可以来我家看看</button>
    </div>
</template>

<style scoped>
.not-found {
    text-align: center;
    margin-top: 100px;
    font-size: 18px;
    color: #333;
}

p {
    margin: 10px 0;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}
</style>
