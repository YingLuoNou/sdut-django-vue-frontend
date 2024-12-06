import axios from "axios"

// 从环境变量中获取基础配置
const BASE_URL: string = import.meta.env.VITE_REQUEST_BASE_URL
const BASE_TIMEOUT: number = import.meta.env.VITE_REQUEST_TIMEOUT
const BASE_PREFIX: string = import.meta.env.VITE_REQUEST_BASE_PREFIX

console.log(BASE_URL, BASE_TIMEOUT, BASE_PREFIX)

const request = axios.create({
    baseURL: BASE_URL + BASE_PREFIX,
    timeout: BASE_TIMEOUT
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 获取保存的 token（从 localStorage 或 Pinia 中获取）
        const accessToken = localStorage.getItem('access_token') || null

        if (accessToken) {
            // 在请求头中加入 Authorization
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default request
