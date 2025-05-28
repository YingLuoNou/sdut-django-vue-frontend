<template>
    <div class="leave-info">
        <el-row>
            <el-col :span="24">
                <h2>我的请假信息</h2>

                <el-table
                    v-if="leaveRequests.length > 0"
                    :data="leaveRequests"
                    border
                    style="width: 100%"
                    :fit="true"
                >
                    <el-table-column
                        label="请假日期"
                        :formatter="formatLeaveDate"
                        width="300"
                    />
                    <el-table-column label="请假事由" prop="reason" />
                    <el-table-column
                        label="状态"
                        :formatter="formatStatus"
                        width="150"
                    />
                    <el-table-column label="操作" width="200">
                        <template #default="{ row }">
                            <el-button
                                v-if="row.status === 1 || row.status === 3"
                                type="primary"
                                size="small"
                                @click="viewLeaveDetail(row)"
                            >
                                查看
                            </el-button>
                            <el-button
                                v-if="row.status === 0 "
                                type="danger"
                                size="small"
                                @click="cancelLeave(row.id)"
                            >
                                取消
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <p v-else>没有请假信息</p>

                <leave-detail
                    v-if="selectedLeave"
                    :leave="selectedLeave"
                    @close="selectedLeave = null"
                />

                <!-- 分页组件 -->
                <el-pagination
                    v-if="total > 0"
                    background
                    layout="prev, pager, next, sizes, total"
                    :total="total"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @current-change="onPageChange"
                    @size-change="onSizeChange"
                    style="margin-top: 20px; text-align: center"
                />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { ref, onMounted } from "vue"
import request from "@/utils/request"
import LeaveDetail from "./LeaveDetail.vue"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { ElMessage, ElMessageBox } from "element-plus"

dayjs.extend(utc)

export default {
    name: "LeaveRequestList",
    components: { LeaveDetail },
    setup() {
        const leaveRequests = ref([])
        const selectedLeave = ref(null)

        // 分页状态
        const currentPage = ref(1)
        const pageSize = ref(10)
        const total = ref(0)

        // 时间格式化
        const formatDate = (utcStr) => {
            const date = dayjs(utcStr)
            return date.local().format("MM月DD日 HH时mm分")
        }
        const formatLeaveDate = (row) => {
            const start = formatDate(row.start_date)
            const end = formatDate(row.end_date)
            return `从${start}到${end}`
        }
        const formatStatus = (row) => {
            const s = Number(row.status)
            switch (s) {
                case 0:
                    return "待批准"
                case 1:
                    return "已批准"
                case 2:
                    return row.reject_reason
                        ? `已驳回: ${row.reject_reason}`
                        : "已驳回"
                case 3:
                    return "已销假"
                case 4:
                    return "待审核"
                case 5:
                    return "已审核"
                default:
                    return "未知状态"
            }
        }
        // 取消请假
        const cancelLeave = async (leaveId) => {
            try {
                await ElMessageBox.confirm(
                    "确定要取消这条请假吗？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                await request.patch(`/cancel-leave/${leaveId}/`)
                ElMessage.success("取消成功")
                fetchLeaveRequests()
            } catch (error) {
                if (error !== 'cancel') {
                    console.error("取消失败:", error)
                    ElMessage.error("取消失败，请稍后重试")
                }
            }
        }
        // 分页查询
        const fetchLeaveRequests = async () => {
            try {
                const resp = await request.get("/view-leave/", {
                    params: {
                        page: currentPage.value,
                        page_size: pageSize.value
                        // status 可选：如果想按状态过滤，打开下面一行
                        // status: activeStatus.value
                    }
                })
                // 后端返回 { count, next, previous, results }
                leaveRequests.value = resp.results
                total.value = resp.count
            } catch (error) {
                console.error("获取请假信息失败:", error)
            }
        }

        const viewLeaveDetail = (row) => {
            selectedLeave.value = row
        }

        const onPageChange = (page) => {
            currentPage.value = page
            fetchLeaveRequests()
        }
        const onSizeChange = (size) => {
            pageSize.value = size
            currentPage.value = 1
            fetchLeaveRequests()
        }

        onMounted(() => {
            fetchLeaveRequests()
        })

        return {
            leaveRequests,
            selectedLeave,
            formatLeaveDate,
            formatStatus,
            viewLeaveDetail,
            cancelLeave, 
            currentPage,
            pageSize,
            total,
            onPageChange,
            onSizeChange
        }
    }
}
</script>

<style scoped>
.leave-info {
    padding: 20px;
}
h2 {
    margin-bottom: 20px;
    font-size: 22px;
    color: #333;
}
.el-table {
    width: 100%;
}
.el-table-column {
    text-align: center;
}
.el-button {
    margin-right: 10px;
}
</style>
