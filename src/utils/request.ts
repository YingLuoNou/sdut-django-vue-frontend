// src/utils/request.ts
import axios from "axios"
import type { InternalAxiosRequestConfig , AxiosResponse } from "axios"

// 从环境变量中获取基础配置（Vite）
const BASE_URL = import.meta.env.VITE_REQUEST_BASE_URL as string
const BASE_PREFIX = import.meta.env.VITE_REQUEST_BASE_PREFIX as string
const TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000

console.log("Request Config →", {
    baseURL: BASE_URL,
    prefix: BASE_PREFIX,
    timeout: TIMEOUT
})

const request = axios.create({
    baseURL: `${BASE_URL}${BASE_PREFIX}`,
    timeout: TIMEOUT
})

// 请求拦截器：自动带上 access token
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("access_token")
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器：直接返回 data，或抛出错误
request.interceptors.response.use(
    (response: AxiosResponse) => {
        // 如果后端把真正数据包在 data 对象里，就返回 data.data，
        // 否则返回 response.data 本身
        return (response.data && (response.data as any).data) ?? response.data
    },
    (error) => {
        // 你可以在这里统一做错误弹框或跳转登录等逻辑
        return Promise.reject(error)
    }
)

export default request
