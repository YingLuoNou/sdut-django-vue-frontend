<template>
    <div class="class-manage">
        <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="添加学生" name="add">
                <!-- 添加学生不需要预查询 -->
                <el-form :model="addForm" ref="addFormRef" label-width="80px">
                    <!-- fields omitted for brevity, same as before -->
                    <el-form-item
                        label="学号"
                        prop="username"
                        :rules="[
                            {
                                required: true,
                                message: '请输入学号',
                                trigger: 'blur'
                            }
                        ]"
                    >
                        <el-input v-model="addForm.username" />
                    </el-form-item>
                    <el-form-item
                        label="姓名"
                        prop="last_name"
                        :rules="[
                            {
                                required: true,
                                message: '请输入姓名',
                                trigger: 'blur'
                            }
                        ]"
                    >
                        <el-input v-model="addForm.last_name" />
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input
                            v-model="addForm.password"
                            placeholder="默认123456"
                            show-password
                        />
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="addForm.email" />
                    </el-form-item>
                    <el-form-item
                        label="班级"
                        prop="class_name"
                        :rules="[
                            {
                                required: true,
                                message: '请输入班级',
                                trigger: 'blur'
                            }
                        ]"
                    >
                        <el-input v-model="addForm.class_name" />
                    </el-form-item>
                    <el-form-item
                        label="辅导员"
                        prop="advisor_last_name"
                        :rules="[
                            {
                                required: true,
                                message: '请输入辅导员姓名',
                                trigger: 'blur'
                            }
                        ]"
                    >
                        <el-input v-model="addForm.advisor_last_name" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitAdd"
                            >提交</el-button
                        >
                    </el-form-item>
                    <el-alert
                        v-if="addMessage"
                        type="success"
                        :title="addMessage"
                        show-icon
                    />
                    <el-alert
                        v-if="addError"
                        type="error"
                        :title="addError"
                        show-icon
                    />
                </el-form>
            </el-tab-pane>

            <!-- 删除学生 -->
            <el-tab-pane label="删除学生(仅管理员)" name="delete">
                <el-form
                    :model="deleteForm"
                    ref="deleteFormRef"
                    label-width="80px"
                >
                    <el-form-item
                        label="学号"
                        prop="username"
                        :rules="[
                            {
                                required: true,
                                message: '请输入学号',
                                trigger: 'blur'
                            }
                        ]"
                    >
                        <el-input v-model="deleteForm.username" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="checkDeleteUser"
                            >查询学生</el-button
                        >
                    </el-form-item>
                    <!-- 预查询成功后显示信息和删除按钮 -->
                    <div v-if="deleteInfo">
                        <el-descriptions title="学生信息" :column="1">
                            <el-descriptions-item label="学号">{{
                                deleteInfo.student_number
                            }}</el-descriptions-item>
                            <el-descriptions-item label="姓名">{{
                                deleteInfo.last_name
                            }}</el-descriptions-item>
                            <el-descriptions-item label="班级">{{
                                deleteInfo.class_name
                            }}</el-descriptions-item>
                            <el-descriptions-item label="辅导员">{{
                                deleteInfo.advisor_name
                            }}</el-descriptions-item>
                        </el-descriptions>
                        <el-button type="danger" @click="submitDelete"
                            >确认删除</el-button
                        >
                    </div>
                    <el-alert
                        v-if="deleteMessage"
                        type="success"
                        :title="deleteMessage"
                        show-icon
                    />
                    <el-alert
                        v-if="deleteError"
                        type="error"
                        :title="deleteError"
                        show-icon
                    />
                </el-form>
            </el-tab-pane>

            <!-- 修改信息 -->
            <el-tab-pane label="修改信息" name="modify">
                <el-form
                    :model="modifyForm"
                    ref="modifyFormRef"
                    label-width="80px"
                >
                    <el-form-item
                        label="学号"
                        prop="username"
                        :rules="[
                            {
                                required: true,
                                message: '请输入学号',
                                trigger: 'blur'
                            }
                        ]"
                    >
                        <el-input v-model="modifyForm.username" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="checkModifyUser"
                            >查询学生</el-button
                        >
                    </el-form-item>

                    <div v-if="modifyInfo">
                        <el-descriptions title="学生信息" :column="1">
                            <el-descriptions-item label="学号">{{
                                modifyInfo.student_number
                            }}</el-descriptions-item>
                            <el-descriptions-item label="姓名">{{
                                modifyInfo.last_name
                            }}</el-descriptions-item>
                            <el-descriptions-item label="班级">{{
                                modifyInfo.class_name
                            }}</el-descriptions-item>
                            <el-descriptions-item label="辅导员">{{
                                modifyInfo.advisor_name
                            }}</el-descriptions-item>
                        </el-descriptions>
                        <el-form-item label="新班级">
                            <el-input
                                v-model="modifyForm.class_name"
                                placeholder="可选"
                            />
                        </el-form-item>
                        <el-form-item label="新辅导员">
                            <el-input
                                v-model="modifyForm.advisor_last_name"
                                placeholder="可选"
                            />
                        </el-form-item>
                        <el-button type="primary" @click="submitModify"
                            >确认修改</el-button
                        >
                    </div>

                    <el-alert
                        v-if="modifyMessage"
                        type="success"
                        :title="modifyMessage"
                        show-icon
                    />
                    <el-alert
                        v-if="modifyError"
                        type="error"
                        :title="modifyError"
                        show-icon
                    />
                </el-form>
            </el-tab-pane>

            <!-- 重置密码 -->
            <el-tab-pane label="重置密码" name="reset">
                <el-form
                    :model="resetForm"
                    ref="resetFormRef"
                    label-width="80px"
                >
                    <el-form-item
                        label="学号"
                        prop="username"
                        :rules="[
                            {
                                required: true,
                                message: '请输入学号',
                                trigger: 'blur'
                            }
                        ]"
                    >
                        <el-input v-model="resetForm.username" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="checkResetUser"
                            >查询学生</el-button
                        >
                    </el-form-item>

                    <div v-if="resetInfo">
                        <el-descriptions title="学生信息" :column="1">
                            <el-descriptions-item label="学号">{{
                                resetInfo.student_number
                            }}</el-descriptions-item>
                            <el-descriptions-item label="姓名">{{
                                resetInfo.last_name
                            }}</el-descriptions-item>
                            <el-descriptions-item label="班级">{{
                                resetInfo.class_name
                            }}</el-descriptions-item>
                            <el-descriptions-item label="辅导员">{{
                                resetInfo.advisor_name
                            }}</el-descriptions-item>
                        </el-descriptions>
                        <el-form-item label="新密码">
                            <el-input
                                v-model="resetForm.new_password"
                                placeholder="可选: 默认123456"
                                show-password
                            />
                        </el-form-item>
                        <el-button type="warning" @click="submitReset"
                            >确认重置</el-button
                        >
                    </div>

                    <el-alert
                        v-if="resetMessage"
                        type="success"
                        :title="resetMessage"
                        show-icon
                    />
                    <el-alert
                        v-if="resetError"
                        type="error"
                        :title="resetError"
                        show-icon
                    />
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import request from "@/utils/request"

const activeTab = ref("add")

const fetchLastName = async () => {
    //自动填充辅导员姓名
    try {
        const res = await request.get("/UserInfoView/")
        const lastName = res.last_name || ""
        addForm.advisor_last_name = lastName
    } catch (e) {
        console.error("获取用户信息失败", e)
    }
}

onMounted(() => {
    fetchLastName()
})

// 添加学生
const addForm = reactive({
    username: "",
    password: "123456",
    last_name: "",
    email: "",
    class_name: "",
    advisor_last_name: ""
})
const addMessage = ref("")
const addError = ref("")
const submitAdd = async () => {
    addMessage.value = ""
    addError.value = ""
    try {
        const res = await request.post("/admin/students/add/", addForm)
        addMessage.value = res.message
    } catch (e) {
        addError.value =
            e.response?.data.detail || JSON.stringify(e.response?.data)
    }
}

// 公共状态与函数：检查学生信息
const deleteForm = reactive({ username: "" })
const deleteInfo = ref(null)
const deleteMessage = ref("")
const deleteError = ref("")
const checkDeleteUser = async () => {
    deleteMessage.value = ""
    deleteError.value = ""
    deleteInfo.value = null
    try {
        const res = await request.get(
            `/admin/students/check/${deleteForm.username}/`
        )
        deleteInfo.value = res
    } catch (e) {
        deleteError.value =
            e.response?.data.detail || JSON.stringify(e.response?.data)
    }
}
const submitDelete = async () => {
    deleteMessage.value = ""
    deleteError.value = ""
    try {
        await request.post(`/admin/students/delete/${deleteForm.username}/`)
        deleteMessage.value = `学生 ${deleteForm.username} 已删除。`
        deleteInfo.value = null
        deleteForm.username = ""
    } catch (e) {
        deleteError.value =
            e.response?.data.detail || JSON.stringify(e.response?.data)
    }
}

// 修改学生
const modifyForm = reactive({
    username: "",
    class_name: null,
    advisor_last_name: null
})
const modifyInfo = ref(null)
const modifyMessage = ref("")
const modifyError = ref("")
const checkModifyUser = async () => {
    modifyInfo.value = null
    modifyMessage.value = ""
    modifyError.value = ""
    try {
        const res = await request.get(
            `/admin/students/check/${modifyForm.username}/`
        )
        modifyInfo.value = res
    } catch (e) {
        modifyError.value =
            e.response?.data.detail || JSON.stringify(e.response?.data)
    }
}
const submitModify = async () => {
    modifyMessage.value = ""
    modifyError.value = ""
    if (!modifyForm.class_name && !modifyForm.advisor_last_name) {
        modifyError.value = "请至少填写 新班级 或 新辅导员姓名。"
        return
    }
    try {
        const res = await request.patch(
            `/admin/students/modify/${modifyForm.username}/`,
            {
                class_name: modifyForm.class_name,
                advisor_last_name: modifyForm.advisor_last_name
            }
        )
        modifyMessage.value = res.detail
        modifyInfo.value = null
        modifyForm.username = ""
        modifyForm.class_name = null
        modifyForm.advisor_last_name = null
    } catch (e) {
        modifyError.value =
            e.response?.data.detail || JSON.stringify(e.response?.data)
    }
}

// 重置密码
const resetForm = reactive({ username: "", new_password: "" })
const resetInfo = ref(null)
const resetMessage = ref("")
const resetError = ref("")
const checkResetUser = async () => {
    resetInfo.value = null
    resetMessage.value = ""
    resetError.value = ""
    try {
        const res = await request.get(
            `/admin/students/check/${resetForm.username}/`
        )
        resetInfo.value = res
    } catch (e) {
        resetError.value =
            e.response?.data.detail || JSON.stringify(e.response?.data)
    }
}
const submitReset = async () => {
    resetMessage.value = ""
    resetError.value = ""
    const pwd =
        resetForm.new_password && resetForm.new_password.trim()
            ? resetForm.new_password.trim()
            : "123456"
    try {
        const res = await request.post(
            `/admin/students/reset_password/${resetForm.username}/`,
            { new_password: pwd }
        )
        resetMessage.value = res.detail
        resetInfo.value = null
        resetForm.username = ""
        resetForm.new_password = ""
    } catch (e) {
        resetError.value =
            e.response?.data.detail || JSON.stringify(e.response?.data)
    }
}
</script>

<style scoped>
.class-manage {
    padding: 20px;
}
</style>
