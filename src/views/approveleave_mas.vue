<template>
  <div class="admin-leave-list">
    <h2>请假审批列表</h2>

    <!-- Tab 容器 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <!-- 待审批 Tab (状态 0) -->
      <el-tab-pane label="待审批" name="0">
        <el-table :data="filteredLeaveRequests['0']" border style="width: 100%" v-loading="isLoading">
          <!-- 请假详情 -->
          <el-table-column prop="student_name" label="学生姓名" width="150"></el-table-column>
          <el-table-column prop="reason" label="请假事由"></el-table-column>
          <!-- <el-table-column label="开始时间" :formatter="formatDate" width="180"></el-table-column> -->
          <!-- <el-table-column label="结束时间" :formatter="formatDate" width="180"></el-table-column> -->
          <el-table-column label="开始时间" :formatter="(row) => formatDate(row.start_date)" width="180"></el-table-column>
          <el-table-column label="结束时间" :formatter="(row) => formatDate(row.end_date)" width="180"></el-table-column>
          <el-table-column label="请假时间" :formatter="(row) => formatDate(row.leave_time)" width="180"></el-table-column>
          
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span v-if="row.status === 0">未批准</span>
              <span v-else-if="row.status === 1">已批准</span>
              <span v-else-if="row.status === 2">已驳回</span>
              <span v-else-if="row.status === 3">已销假</span>
              <span v-else-if="row.status === 4">待审核</span>
              <span v-else-if="row.status === 5">已审核</span>
              <span v-else>未知状态</span>
            </template>
          </el-table-column>
          <!-- 操作按钮 -->
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 0 || row.status === 4"
                type="success"
                size="small"
                @click="approveLeave(row.id)"
                :disabled="isApproving[row.id]"
                :loading="isApproving[row.id]"
              >
                批准
              </el-button>
              <el-button
                v-if="row.status === 0 || row.status === 4"
                type="danger"
                size="small"
                @click="rejectLeave(row.id)"
                :disabled="isRejecting[row.id]"
                :loading="isRejecting[row.id]"
              >
                拒绝
              </el-button>
              <el-button
                v-if="row.status === 1"
                type="success"
                size="small"
                @click="completeLeave(row.id)"
                :disabled="isCompleting[row.id]"
                :loading="isCompleting[row.id]"
              >
                销假
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 已审批 Tab (状态 1) -->
      <el-tab-pane label="已审批" name="1">
        <el-table :data="filteredLeaveRequests['1']" border style="width: 100%" v-loading="isLoading">
          <!-- 请假详情 -->
          <el-table-column prop="student_name" label="学生姓名" width="150"></el-table-column>
          <el-table-column prop="reason" label="请假事由"></el-table-column>
          <el-table-column label="开始时间" :formatter="(row) => formatDate(row.start_date)" width="180"></el-table-column>
          <el-table-column label="结束时间" :formatter="(row) => formatDate(row.end_date)" width="180"></el-table-column>
          <el-table-column label="请假时间" :formatter="(row) => formatDate(row.leave_time)" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span v-if="row.status === 0">未批准</span>
              <span v-else-if="row.status === 1">已批准</span>
              <span v-else-if="row.status === 2">已驳回</span>
              <span v-else-if="row.status === 3">已销假</span>
              <span v-else-if="row.status === 4">待审核</span>
              <span v-else-if="row.status === 5">已审核</span>
              <span v-else>未知状态</span>
            </template>
          </el-table-column>
          <!-- 操作按钮 -->
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 1"
                type="success"
                size="small"
                @click="completeLeave(row.id)"
                :disabled="isCompleting[row.id]"
                :loading="isCompleting[row.id]"
              >
                销假
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 已拒绝 Tab (状态 2) -->
      <el-tab-pane label="已拒绝" name="2">
        <el-table :data="filteredLeaveRequests['2']" border style="width: 100%" v-loading="isLoading">
          <!-- 请假详情 -->
          <el-table-column prop="student_name" label="学生姓名" width="150"></el-table-column>
          <el-table-column prop="reason" label="请假事由"></el-table-column>
          <el-table-column label="开始时间" :formatter="(row) => formatDate(row.start_date)" width="180"></el-table-column>
          <el-table-column label="结束时间" :formatter="(row) => formatDate(row.end_date)" width="180"></el-table-column>
          <el-table-column label="请假时间" :formatter="(row) => formatDate(row.leave_time)" width="180"></el-table-column>
          <el-table-column prop="reject_reason" label="拒绝理由"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span v-if="row.status === 0">未批准</span>
              <span v-else-if="row.status === 1">已批准</span>
              <span v-else-if="row.status === 2">已驳回</span>
              <span v-else-if="row.status === 3">已销假</span>
              <span v-else-if="row.status === 4">待审核</span>
              <span v-else-if="row.status === 5">已审核</span>
              <span v-else>未知状态</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 已销假 Tab (状态 3) -->
      <el-tab-pane label="已销假" name="3">
        <el-table :data="filteredLeaveRequests['3']" border style="width: 100%" v-loading="isLoading">
          <!-- 请假详情 -->
          <el-table-column prop="student_name" label="学生姓名" width="150"></el-table-column>
          <el-table-column prop="reason" label="请假事由"></el-table-column>
          <el-table-column label="开始时间" :formatter="(row) => formatDate(row.start_date)" width="180"></el-table-column>
          <el-table-column label="结束时间" :formatter="(row) => formatDate(row.end_date)" width="180"></el-table-column>
          <el-table-column label="请假时间" :formatter="(row) => formatDate(row.leave_time)" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span v-if="row.status === 0">未批准</span>
              <span v-else-if="row.status === 1">已批准</span>
              <span v-else-if="row.status === 2">已驳回</span>
              <span v-else-if="row.status === 3">已销假</span>
              <span v-else-if="row.status === 4">待审核</span>
              <span v-else-if="row.status === 5">已审核</span>
              <span v-else>未知状态</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 长假待审核 Tab (状态 4) -->
      <el-tab-pane label="长时请假待审核" name="5">
        <el-table :data="filteredLeaveRequests['5']" border style="width: 100%" v-loading="isLoading">
          <!-- 请假详情 -->
          <el-table-column prop="student_name" label="学生姓名" width="150"></el-table-column>
          <el-table-column prop="reason" label="请假事由"></el-table-column>
          <el-table-column label="开始时间" :formatter="(row) => formatDate(row.start_date)" width="180"></el-table-column>
          <el-table-column label="结束时间" :formatter="(row) => formatDate(row.end_date)" width="180"></el-table-column>
          <el-table-column label="请假时间" :formatter="(row) => formatDate(row.leave_time)" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span v-if="row.status === 0">未批准</span>
              <span v-else-if="row.status === 1">已批准</span>
              <span v-else-if="row.status ===

2">已驳回</span>
              <span v-else-if="row.status === 3">已销假</span>
              <span v-else-if="row.status === 4">待审核</span>
              <span v-else-if="row.status === 5">已审核</span>
              <span v-else>未知状态</span>
            </template>
          </el-table-column>
          <!-- 操作按钮 -->
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 5"
                type="success"
                size="small"
                @click="approveLeave(row.id)"
                :disabled="isApproving[row.id]"
                :loading="isApproving[row.id]"
              >
                批准
              </el-button>
              <el-button
                v-if="row.status === 5"
                type="danger"
                size="small"
                @click="rejectLeave(row.id)"
                :disabled="isRejecting[row.id]"
                :loading="isRejecting[row.id]"
              >
                拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue'
import request from '@/utils/request' // 确保路径正确
import { ElMessage, ElMessageBox, ElTable, ElTableColumn, ElButton, ElTabs, ElTabPane } from 'element-plus'

export default {
  name: 'AdminLeaveList',
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElTabs,
    ElTabPane
  },
  setup() {
    const leaveRequests = ref([])
    const isLoading = ref(false)
    const activeTab = ref('0') // 默认选中“待审批”Tab

    // 使用 reactive 来跟踪按钮的禁用和加载状态
    const isApproving = reactive({})
    const isRejecting = reactive({})
    const isCompleting = reactive({})

    // 获取假条列表
    const fetchLeaveRequests = async () => {
      isLoading.value = true
      try {
        const response = await request.get('/admin/leaves/')
        // 假设 response 是一个数组
        leaveRequests.value = Array.isArray(response) ? response : []
        console.log('获取到的假条数据:', leaveRequests.value) // 调试用
      } catch (error) {
        console.error('获取假条列表失败:', error)
        ElMessage.error('获取假条列表失败')
      } finally {
        isLoading.value = false
      }
    }


    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    // 批准请假
    const approveLeave = async (leaveId) => {
      if (isApproving[leaveId]) return // 防止多次点击

      try {
        isApproving[leaveId] = true
        await request.patch(`/admin/approve-leave/${leaveId}/`, { status: 1 })
        await fetchLeaveRequests() // 刷新列表
        ElMessage.success('假条已批准')
      } catch (error) {
        console.error('批准请假失败:', error)
        ElMessage.error('批准失败')
      } finally {
        // 三秒后恢复按钮状态
        setTimeout(() => {
          isApproving[leaveId] = false
        }, 3000)
      }
    }

    // 销假
    const completeLeave = async (leaveId) => {
      if (isCompleting[leaveId]) return // 防止多次点击

      try {
        isCompleting[leaveId] = true
        await request.patch(`/CompleteLeavingView/${leaveId}/`, { status: 3 }) // 假设状态3代表已销假
        await fetchLeaveRequests() // 刷新列表
        ElMessage.success('已销假')
      } catch (error) {
        console.error('销假失败:', error)
        ElMessage.error('销假失败')
      } finally {
        // 三秒后恢复按钮状态
        setTimeout(() => {
          isCompleting[leaveId] = false
        }, 3000)
      }
    }

    // 拒绝请假
    const rejectLeave = async (leaveId) => {
      if (isRejecting[leaveId]) return // 防止多次点击

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

        isRejecting[leaveId] = true

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
      } finally {
        // 三秒后恢复按钮状态
        setTimeout(() => {
          isRejecting[leaveId] = false
        }, 3000)
      }
    }

    // 计算每个状态对应的请假请求
    const filteredLeaveRequests = computed(() => {
      const categories = {
        '0': [],
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': []
      }

      leaveRequests.value.forEach((leave) => {
        const status = String(leave.status)
        if (categories[status]) {
          categories[status].push(leave)
        }
      })

      console.log('分类后的请假数据:', categories) // 调试用
      return categories
    })

    // 处理Tab切换，重新获取数据（可选）
    const handleTabClick = (tab) => {
      // 如果需要在切换Tab时重新获取数据，可以在这里调用 fetchLeaveRequests()
      // fetchLeaveRequests()
    }

    onMounted(() => {
      fetchLeaveRequests()
    })

    return {
      leaveRequests,
      isLoading,
      activeTab,
      fetchLeaveRequests,
      approveLeave,
      rejectLeave,
      completeLeave,
      formatDate,
      filteredLeaveRequests,
      isApproving,
      isRejecting,
      isCompleting,
      handleTabClick
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

.el-table {
  margin-top: 20px;
}

.el-button {
  margin-right: 10px;
}
</style>
