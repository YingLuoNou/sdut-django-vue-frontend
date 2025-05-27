import { defineStore } from "pinia"
import { ref } from "vue"
import request from "@/utils/request"

// 定义接口，确保返回的数据符合期望的结构
interface UserInfo {
    class_name: string | null
    email: string | null
    first_name: string | null
    last_name: string | null
    student_number: string | null
    user_group: string | null
}

interface RefreshResponse {
    access: string
    refresh: string
}

export const useUserStore = defineStore("user", () => {
    // 存储 access_token 和 refresh_token
    const accessToken = ref<string | null>(
        localStorage.getItem("access_token") || null
    )
    const refreshToken = ref<string | null>(
        localStorage.getItem("refresh_token") || null
    )

    // 存储用户的详细信息
    const userInfo = ref<UserInfo>(
        JSON.parse(localStorage.getItem("user_info") || "null") || {
            class_name: null,
            email: null,
            first_name: null,
            last_name: null,
            student_number: null,
            user_group: null
        }
    )

    // 设置 tokens
    const setTokens = (access: string, refresh: string) => {
        accessToken.value = access
        refreshToken.value = refresh

        // 将 tokens 保存在 localStorage 中，方便后续使用
        localStorage.setItem("access_token", access)
        localStorage.setItem("refresh_token", refresh)
    }

    // 刷新 accessToken
    const refreshAccessToken = async () => {
        if (refreshToken.value) {
            try {
                const response = await request.post<RefreshResponse>(
                    "/refresh-token/",
                    {
                        refresh: refreshToken.value
                    }
                )
                if (response && response.data.access) {
                    setTokens(
                        response.data.access,
                        response.data.refresh || refreshToken.value
                    )
                }
            } catch (error) {
                console.error("刷新 token 失败", error)
                clearUserInfo() // 刷新失败时清空用户状态
            }
        }
    }

    // 获取用户信息
    const fetchUserInfo = async () => {
        try {
            const response = await request.get<UserInfo>("/UserInfoView/")
            if (response) {
                userInfo.value = {
                    class_name: response.data.class_name || null,
                    email: response.data.email || null,
                    first_name: response.data.first_name || null,
                    last_name: response.data.last_name || null,
                    student_number: response.data.student_number || null,
                    user_group: response.data.user_group || null
                }

                // 持久化用户信息
                localStorage.setItem(
                    "user_info",
                    JSON.stringify(userInfo.value)
                )
            }
        } catch (error) {
            console.error("获取用户信息失败", error)
            clearUserInfo() // 如果获取失败，清空用户信息
        }
    }

    // 清空用户信息
    const clearUserInfo = () => {
        userInfo.value = {
            class_name: null,
            email: null,
            first_name: null,
            last_name: null,
            student_number: null,
            user_group: null
        }
        accessToken.value = null
        refreshToken.value = null

        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_info")
    }

    // 初始化时检查 accessToken 是否有效
    const initializeUser = async () => {
        if (accessToken.value) {
            try {
                await fetchUserInfo() // 获取用户信息
            } catch (error) {
                console.error("初始化用户信息失败", error)
                await refreshAccessToken() // 如果 accessToken 失效，尝试刷新
                if (accessToken.value) {
                    await fetchUserInfo() // 刷新成功后重新获取用户信息
                }
            }
        } else {
            clearUserInfo() // 如果没有 accessToken，清空用户信息
        }
    }

    return {
        accessToken,
        refreshToken,
        userInfo,
        setTokens,
        refreshAccessToken,
        fetchUserInfo,
        initializeUser,
        clearUserInfo
    }
})
