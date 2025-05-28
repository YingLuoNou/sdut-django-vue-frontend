<!-- leavedetail.vue -->
<template>
    <div class="leave-detail">
        <h2 class="title">请假条</h2>
        <div v-if="leave && userInfo" class="leave-content">
            <div class="header-info">
                <p>姓名：{{ student_name }}</p>
                <p>学号：{{ student_number }}</p>
                <p>班级：{{ student_class }}</p>
                <p>学院：电气与电子工程学院</p>
            </div>

            <div class="leave-body">
                <p><strong>请假原因：</strong>{{ leave.reason }}</p>
                <p><strong>请假时间：</strong>{{ formattedLeaveDate }}</p>
                <p><strong>当前状态：</strong>{{ formattedStatus }}</p>
            </div>

            <div class="warning">
                <p>注：防伪二维码含有个人信息，请勿透漏给陌生人</p>
                <p>
                    除维护等特殊情况外无防伪二维码或二维码无法扫描查询均视为假条无效
                </p>
            </div>

            <div class="footer-info">
                <!-- 左侧：防伪二维码 -->
                <div class="qrcode-block">
                    <p class="qrcode-title">防伪二维码</p>
                    <img
                        v-if="qrcodeUrl"
                        :src="qrcodeUrl"
                        alt="防伪二维码"
                        class="qrcode-image"
                    />
                    <p v-else class="qrcode-hint">二维码加载中…</p>
                </div>

                <!-- 右侧：团委盖章 & 签字区域 -->
                <div class="stamp-sign">
                    <div class="stamp">
                        <span>团委盖章:</span>
                        <img
                            src="@/assets/stamp.png"
                            alt="stamp"
                            class="stamp-image"
                        />
                    </div>
                    <div class="sign">
                        <span>批准人:</span>
                        <img
                            :src="signatureImage"
                            alt="签字"
                            class="sign-image"
                        />
                        <span class="sign-placeholder"
                            >签字人：{{ leave.approver }}</span
                        >
                    </div>
                </div>
            </div>

            <div
                class="actions"
                v-if="leave.status === 0 || leave.status === 4"
            >
                <el-button type="success" size="small" @click="approveLeave"
                    >批准</el-button
                >
                <el-button type="danger" size="small" @click="rejectLeave"
                    >拒绝</el-button
                >
                <el-button type="default" size="small" @click="closeDetail"
                    >关闭</el-button
                >
            </div>
            <div class="actions" v-else>
                <el-button type="default" size="small" @click="closeDetail"
                    >关闭</el-button
                >
            </div>
        </div>
        <div v-else>
            <p>正在加载请假信息...</p>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from "vue"
import { ElMessage } from "element-plus"
import request from "@/utils/request"
import { useUserStore } from "@/store/user"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

export default {
    name: "LeaveDetail",
    props: {
        leave: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const userStore = useUserStore()
        const userInfo = ref(userStore.userInfo)
        const student_name = props.leave.student_name
        const student_number = props.leave.student_number
        const student_class = props.leave.student_class
        // 二维码 URL
        const qrcodeUrl = ref("")
        // 使用 import.meta.glob 批量导入签字图片
        const signatures = import.meta.glob("@/assets/signatures/*.png", {
            eager: true
        })

        // 创建签字图片映射
        const signatureMap = {}
        for (const path in signatures) {
            const fileName = path.split("/").pop().split(".")[0] // 获取文件名（不含扩展名）
            signatureMap[fileName] = signatures[path].default
        }

        watch(
            () => props.leave.verification_uuid,
            async (uuid) => {
                if (!uuid) return
                try {
                    const res = await request.get(
                        `/view-leave/qrcode/${uuid}/`,
                        { responseType: "blob" }
                    )
                    qrcodeUrl.value = URL.createObjectURL(res)
                } catch (err) {
                    console.error("二维码加载失败:", err)
                }
            },
            { immediate: true }
        )

        const formatDate = (utcStr) => {
            const date = dayjs.utc(utcStr).local()
            return `${date.format("YYYY-MM-DD HH:mm")}`
        }

        const formattedLeaveDate = computed(() => {
            if (!props.leave) return ""
            const startFormatted = formatDate(props.leave.start_date)
            const endFormatted = formatDate(props.leave.end_date)
            return `从 ${startFormatted} 到 ${endFormatted}`
        })

        const formattedStatus = computed(() => {
            if (!props.leave) return ""
            switch (props.leave.status) {
                case 0:
                    return "待批准"
                case 1:
                    return "已批准"
                case 2:
                    return "已驳回"
                case 3:
                    return "已销假"
                case 4:
                    return "待审核"
                case 5:
                    return "已审核"
                default:
                    return "未知状态"
            }
        })

        const signatureImage = computed(() => {
            // 根据 approver 获取对应签字图片
            return signatureMap[props.leave.approver] || signatureMap["default"]
        })

        const approveLeave = async () => {
            try {
                const response = await request.post("/approve-leave/", {
                    leaveId: props.leave.id
                })
                ElMessage.success("请假已批准")
                props.leave.status = 1
                emit("close")
            } catch (error) {
                ElMessage.error("批准请假失败")
                console.error("批准请假失败:", error)
            }
        }

        const rejectLeave = async () => {
            try {
                const response = await request.post("/reject-leave/", {
                    leaveId: props.leave.id
                })
                ElMessage.success("请假已拒绝")
                props.leave.status = 2
                emit("close")
            } catch (error) {
                ElMessage.error("拒绝请假失败")
                console.error("拒绝请假失败:", error)
            }
        }

        const closeDetail = () => {
            emit("close")
        }

        return {
            userInfo,
            formattedLeaveDate,
            formattedStatus,
            approveLeave,
            rejectLeave,
            signatureImage,
            closeDetail,
            student_class,
            student_name,
            student_number,
            qrcodeUrl
        }
    }
}
</script>

<style scoped>
.leave-detail {
    padding: 8px;
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    background-color: #fff;
    position: relative;
}

.title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
}

.header-info {
    margin-bottom: 20px;
    font-size: 16px;
}

.leave-body {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 1.5;
}

.warning {
    margin-bottom: 20px;
    font-size: 9px;
    line-height: 1.1;
}

.footer-info {
    position: relative;
    min-height: 100px;
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.stamp-sign {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.stamp {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.stamp-image {
    width: 80px; /* 调整盖章图片大小 */
    height: auto;
}

.stamp-placeholder {
    display: none; /* 隐藏占位符 */
}

.sign {
    display: flex;
    align-items: center;
}

.sign-image {
    width: 80px; /* 调整签字图片大小 */
    height: auto;
}

.sign-placeholder {
    display: none; /* 隐藏占位符 */
}

.actions {
    margin-top: 20px;
    text-align: center;
}
/* 防伪二维码样式 */
.qrcode-block {
    text-align: center;
    margin: 0;
    display: inline-block;
    margin-right: auto;
}
.qrcode-title {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
}
.qrcode-image {
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    padding: 2px;
    margin-left: 5px;
}
.qrcode-hint {
    margin-top: 4px;
    color: #888;
    font-size: 12px;
}
</style>
