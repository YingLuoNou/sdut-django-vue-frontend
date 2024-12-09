<template>
    <div class="leave-info">
      <el-row>
        <el-col :span="24">
          <!-- 标题 -->
          <h2>我的请假信息</h2>
          <el-table
            :data="leaveRequests"
            border
            style="width: 100%;"
          >
            <el-table-column
              label="请假日期"
              prop="leaveDate"
              width="180"
            />
            <el-table-column
              label="请假事由"
              prop="reason"
            />
            <el-table-column
              label="状态"
              prop="status"
              width="150"
            />
            <el-table-column
              label="操作"
              width="180"
            >
              <template v-slot="scope">
                <el-button
                  v-if="scope.row.status === 'Pending'"
                  type="primary"
                  size="small"
                  @click="handleApproval(scope.row)"
                >
                  审批
                </el-button>
                <el-button
                  v-if="scope.row.status === 'Approved'"
                  type="success"
                  size="small"
                >
                  已批准
                </el-button>
                <el-button
                  v-if="scope.row.status === 'Rejected'"
                  type="danger"
                  size="small"
                >
                  已拒绝
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import request from '@/utils/request'
  
  export default {
    name: 'LeaveRequestList',
    setup() {
      // 存储请假信息
      const leaveRequests = ref([])
  
      // 获取用户信息
      const userStore = useUserStore()
  
      // 查询用户的请假信息
      const fetchLeaveRequests = async () => {
        try {
          const response = await request.get('/leave-requests', {
            params: { studentNumber: userStore.userInfo.student_number }
          })
          leaveRequests.value = response.data || []
        } catch (error) {
          console.error('获取请假信息失败:', error)
        }
      }
  
      // 审批操作
      const handleApproval = (row) => {
        // 审批操作的逻辑
        console.log(`审批请假请求:`, row)
        // 调用 API 进行审批
      }
  
      // 组件挂载后获取请假信息
      onMounted(() => {
        fetchLeaveRequests()
      })
  
      return {
        leaveRequests,
        handleApproval
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
  