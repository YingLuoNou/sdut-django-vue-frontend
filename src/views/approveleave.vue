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

    // 拒绝请假
    const rejectLeave = async (leaveId) => {
      try {
        await request.patch(`/admin/reject-leave/${leaveId}/`, { status: 2 })
        await fetchLeaveRequests() // 刷新列表
        ElMessage.success('假条已拒绝')
      } catch (error) {
        console.error('拒绝请假失败:', error)
        ElMessage.error('拒绝失败')
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
