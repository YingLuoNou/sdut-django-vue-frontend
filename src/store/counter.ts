// counter.ts
import { ref } from "vue"
import { defineStore } from "pinia"

interface IUser {
    id: string
    name: string
    age: number | null  // 允许 age 为 null
}

export const useCounterStore = defineStore("user", () => {
    const user = ref<IUser>({
        id: "",
        name: "",
        age: null  // 允许 null
    })

    function login(userInfo: IUser) {
        user.value = userInfo
    }

    return { user, login }
})
