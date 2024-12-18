<template>
  <div class="admin-leave-list">
    <h2>请假审批列表</h2>
    <el-table :data="leaveRequests" border style="width: 100%">
      <!-- 请假详情 -->
      <el-table-column prop="student_name" label="学生姓名" width="150"></el-table-column>
      <el-table-column prop="reason" label="请假事由"></el-table-column>
      <el-table-column label="开始时间" :formatter="(row) => formatDate(row.start_date)" width="180"></el-table-column>
      <el-table-column label="结束时间" :formatter="(row) => formatDate(row.end_date)" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <span v-if="row.status === 0">未批准</span>
          <span v-else-if="row.status === 1">已批准</span>
          <span v-else-if="row.status === 2">已驳回</span>
          <span v-else-if="row.status === 3">已销假</span>
          <span v-else-if="row.status === 4">待审核</span>
          <span v-else-if="row.status === 5">已审核</span>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button v-if="row.status === 0 || row.status === 4" type="success" size="small" @click="approveLeave(row.id)">
            批准
          </el-button>
          <el-button v-if="row.status === 0 || row.status === 4" type="danger" size="small" @click="rejectLeave(row.id)">
            拒绝
          </el-button>
          <el-button v-if="row.status === 1 " type="success" size="small" @click="completeLeave(row.id)">
            销假
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus' // 导入 ElMessage

export default {
  name: 'AdminLeaveList',
  setup() {
    const leaveRequests = ref([])

    // 获取假条列表
    const fetchLeaveRequests = async () => {
      try {
        const response = await request.get('/admin/leaves/')
        leaveRequests.value = response
      } catch (error) {
        console.error('获取假条列表失败:', error)
        ElMessage.error('获取假条列表失败')
      }
    }

    // 格式化日期
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    // 批准请假
    const approveLeave = async (leaveId) => {
      try {
        await request.patch(`/admin/approve-leave/${leaveId}/`, { status: 1 })
        await fetchLeaveRequests() // 刷新列表
        ElMessage.success('假条已批准')
      } catch (error) {
        console.error('批准请假失败:', error)
        ElMessage.error('批准失败')
      }
    }

    // 销假
    const completeLeave = async (leaveId) => {
      try {
        await request.patch(`/CompleteLeavingView/${leaveId}/`, { status: 3 }) // 假设状态3代表已销假
        await fetchLeaveRequests() // 刷新列表
        ElMessage.success('已销假')
      } catch (error) {
        console.error('销假失败:', error)
        ElMessage.error('销假失败')
      }
    }

    // 定义 rejectLeave 函数
  const rejectLeave = async (leaveId) => {
  try {
    // 使用 Element Plus 的 MessageBox.prompt 提示用户输入拒绝理由
    const { value: rejectReason } = await ElMessageBox.prompt(
      '请输入拒绝理由', // 提示信息
      '拒绝请假',       // 弹窗标题
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '拒绝理由',
        inputValidator: (value) => {
          if (!value.trim()) {
            return '拒绝理由不能为空'
          }
          return true
        }
      }
    )

    // 发送 POST 请求，包含 reject_reason
    await request.post(`/admin/reject-leave/${leaveId}/`, {
      reject_reason: rejectReason
    })

    // 刷新请假请求列表
    await fetchLeaveRequests()

    // 显示成功消息
    ElMessage.success('假条已拒绝')
  } catch (error) {
    // 处理用户取消输入的情况
    if (error === 'cancel') {
      ElMessage.info('取消拒绝操作')
      return
    }

    // 处理其他错误
    console.error('拒绝请假失败:', error)
    // 判断后端返回的具体错误信息
    if (error.response && error.response.data) {
      const errorMsg = error.response.data.error || '拒绝失败'
      ElMessage.error(errorMsg)
    } else {
      ElMessage.error('拒绝失败')
    }
  }
}


    onMounted(() => {
      fetchLeaveRequests()
    })

    return {
      leaveRequests,
      fetchLeaveRequests,
      approveLeave,
      rejectLeave,
      completeLeave, // 添加 completeLeave
      formatDate
    }
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
