<template>
    <div class="admin-leave-list">
        <h2>请假审批列表</h2>

        <!-- 去掉 @tab-click，改成 v-model + watch -->
        <el-tabs v-model="activeTab" stretch>
            <el-tab-pane label="待审批" name="0"></el-tab-pane>
            <el-tab-pane label="已批准" name="1"></el-tab-pane>
            <el-tab-pane label="已拒绝" name="2"></el-tab-pane>
            <el-tab-pane label="已销假" name="3"></el-tab-pane>
            <el-tab-pane label="待审核" name="4"></el-tab-pane>
            <el-tab-pane label="已审核" name="5"></el-tab-pane>
        </el-tabs>

        <el-table
            :data="leaveRequests"
            border
            stripe
            style="width: 100%"
            v-loading="isLoading"
        >
            <el-table-column prop="student_name" label="学生姓名" width="150" />
            <el-table-column prop="reason" label="请假事由" />
            <el-table-column
                label="开始时间"
                :formatter="(row) => formatDate(row.start_date)"
                width="180"
            />
            <el-table-column
                label="结束时间"
                :formatter="(row) => formatDate(row.end_date)"
                width="180"
            />
            <el-table-column
                label="状态"
                :formatter="formatStatus"
                width="120"
            />
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button
                        v-if="row.status === 0 || row.status === 4"
                        type="success"
                        size="small"
                        @click="approveLeave(row.id)"
                        :loading="loadingMap[row.id]?.approving"
                        >批准</el-button
                    >
                    <el-button
                        v-if="row.status === 0 || row.status === 4"
                        type="danger"
                        size="small"
                        @click="rejectLeave(row.id)"
                        :loading="loadingMap[row.id]?.rejecting"
                        >拒绝</el-button
                    >
                    <el-button
                        v-if="row.status === 1"
                        type="primary"
                        size="small"
                        @click="completeLeave(row.id)"
                        :loading="loadingMap[row.id]?.completing"
                        >销假</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="prev, pager, next, sizes, total"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="onPageChange"
            @size-change="onSizeChange"
            style="margin-top: 20px; text-align: center"
        />
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue"
import request from "@/utils/request"
import { ElMessage, ElMessageBox } from "element-plus"

const leaveRequests = ref([])
const isLoading = ref(false)
const activeTab = ref("0")
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loadingMap = reactive({})

function formatDate(s) {
    const d = new Date(s)
    return (
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ` +
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
    )
}

function formatStatus({ status, reject_reason }) {
    switch (status) {
        case 0:
            return "待审批"
        case 1:
            return "已批准"
        case 2:
            return reject_reason ? `已驳回: ${reject_reason}` : "已驳回"
        case 3:
            return "已销假"
        case 4:
            return "待审核"
        case 5:
            return "已审核"
        default:
            return "未知"
    }
}

async function fetchData() {
    isLoading.value = true
    try {
        const resp = await request.get("/admin/leaves/", {
            params: {
                status: activeTab.value,
                page: currentPage.value,
                page_size: pageSize.value
            }
        })
        total.value = resp.count
        leaveRequests.value = resp.results

        if (leaveRequests.value.length === 0 && currentPage.value > 1) {
            currentPage.value--
            return fetchData()
        }
    } catch {
        ElMessage.error("获取请假列表失败")
    } finally {
        isLoading.value = false
    }
}

// 当 activeTab 或分页参数改变时，自动刷新
watch(
    [activeTab, currentPage, pageSize],
    () => {
        // 切 Tab 或翻页、改 pageSize，都重置/拉数据
        // tab 切换时把页码重置到1
        if (activeTab.value !== undefined)
            currentPage.value = currentPage.value || 1
        fetchData()
    },
    { immediate: true }
)

function onPageChange(page) {
    currentPage.value = page
}

function onSizeChange(size) {
    pageSize.value = size
    currentPage.value = 1
}

// 批准
async function approveLeave(id) {
    loadingMap[id] = loadingMap[id] || {}
    loadingMap[id].approving = true
    try {
        await request.patch(`/admin/approve-leave/${id}/`, { status: 1 })
        ElMessage.success("批准成功")
        leaveRequests.value = leaveRequests.value.filter((r) => r.id !== id)
        total.value--
    } catch {
        ElMessage.error("批准失败，可能是学生已取消，请刷新重试")
    } finally {
        loadingMap[id].approving = false
    }
}

// 拒绝
async function rejectLeave(id) {
    try {
        const { value: reason } = await ElMessageBox.prompt(
            "请输入拒绝理由",
            "拒绝请假",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValidator: (v) => !!v.trim() || "理由不能为空"
            }
        )
        loadingMap[id] = loadingMap[id] || {}
        loadingMap[id].rejecting = true
        await request.post(`/admin/reject-leave/${id}/`, {
            reject_reason: reason
        })
        ElMessage.success("拒绝成功")
        leaveRequests.value = leaveRequests.value.filter((r) => r.id !== id)
        total.value--
    } catch (err) {
        if (err !== "cancel") ElMessage.error("拒绝失败，可能是学生已取消，请刷新重试")
    } finally {
        loadingMap[id].rejecting = false
    }
}

// 销假
async function completeLeave(id) {
    loadingMap[id] = loadingMap[id] || {}
    loadingMap[id].completing = true
    try {
        await request.patch(`/admin/complete-leave/${id}/`, { status: 3 })
        ElMessage.success("销假成功")
        leaveRequests.value = leaveRequests.value.filter((r) => r.id !== id)
        total.value--
    } catch {
        ElMessage.error("销假失败")
    } finally {
        loadingMap[id].completing = false
    }
}
</script>

<style scoped>
.admin-leave-list {
    padding: 20px;
}
h2 {
    margin-bottom: 20px;
    font-size: 24px;
}
</style>
