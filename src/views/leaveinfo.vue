<template>
    <div class="leave-info">
      <el-row>
        <el-col :span="24">
          <h2>我的请假信息</h2>
          <!-- 当 leaveRequests 数组不为空时，显示表格 -->
          <el-table
            v-if="leaveRequests.length > 0"
            :data="leaveRequests"
            border
            style="width: 100%;"
            :fit="true"
          >
            <el-table-column
              label="请假日期"
              :formatter="formatLeaveDate"
              width="300"
            />
            <el-table-column
              label="请假事由"
              prop="reason"
            />
            <el-table-column
              label="状态"
              :formatter="formatStatus"
              width="150"
            />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 2 || row.status === 3"
                  type="primary"
                  size="mini"
                  @click="viewLeaveDetail(row)"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 如果没有数据，则显示提示 -->
          <p v-else>没有请假信息</p>
  
          <!-- 假条详情展示 -->
          <leave-detail v-if="selectedLeave" :leave="selectedLeave" />
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import request from '@/utils/request'
  import LeaveDetail from './LeaveDetail.vue'
  
  // 引入 dayjs 及 utc 插件
  import dayjs from 'dayjs'
  import utc from 'dayjs/plugin/utc'
  
  dayjs.extend(utc)
  
  export default {
    name: 'LeaveRequestList',
    components: { LeaveDetail },
    setup() {
      const leaveRequests = ref([])
      const selectedLeave = ref(null)
  
      const userStore = useUserStore()
  
      // 使用 dayjs.utc 来确保按UTC格式解析显示
      const formatDate = (utcStr) => {
        // 使用 dayjs utc 模式解析传入的时间字符串
        const date = dayjs.utc(utcStr)
        // 按照您想要的格式输出，这里保持与您之前的格式一致
        return date.format('MM月DD日 HH时mm分')
      }
  
      // 格式化日期的函数
      const formatLeaveDate = (row) => {
        const startFormatted = formatDate(row.start_date)
        const endFormatted = formatDate(row.end_date)
        return `从${startFormatted}到${endFormatted}`
      }
  
      // 格式化状态的函数
      const formatStatus = (row) => {
        const status = Number(row.status)
        switch (status) {
          case 0:
            return '待审批'
          case 1:
            return '已驳回'
          case 2:
            return '已批准'
          case 3:
            return '已销假'
          case 4:
            return '待审核'
          case 5:
            return '已审核'
          default:
            return '未知状态'
        }
      }
  
      // 请求请假数据的函数
      const fetchLeaveRequests = async () => {
        try {
          const response = await request.get('/view-leave/', {
            params: { studentNumber: userStore.userInfo.student_number }
          })
          console.log('请假信息:', response)
          // 确保返回的数据是数组类型
          leaveRequests.value = Array.isArray(response) ? response : []
          console.log('更新后的请假信息:', leaveRequests.value)
        } catch (error) {
          console.error('获取请假信息失败:', error)
        }
      }
  
      // 查看假条详情
      const viewLeaveDetail = (row) => {
        selectedLeave.value = row
      }
  
      onMounted(() => {
        fetchLeaveRequests()
      })
  
      return {
        leaveRequests,
        formatLeaveDate,
        formatStatus,
        viewLeaveDetail,
        selectedLeave
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