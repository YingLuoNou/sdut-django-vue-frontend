<template>
    <div class="leave-detail">
      <h2 class="title">请假条</h2>
      <div v-if="leave && userInfo" class="leave-content">
        <div class="header-info">
          <p>姓名：{{ userInfo.last_name }}</p>
          <p>学号：{{ userInfo.student_number }}</p>
          <p>班级：{{ userInfo.class_name }}</p>
          <p>学院：电气与电子工程学院</p>
        </div>
  
        <div class="leave-body">
          <p><strong>请假原因：</strong>{{ leave.reason }}</p>
          <p><strong>请假时间：</strong>{{ formattedLeaveDate }}</p>
          <p><strong>当前状态：</strong>{{ formattedStatus }}</p>
        </div>
  
        <!-- 底部区域：盖章和签字 -->
        <div class="footer-info">
          <div class="stamp-sign">
            <div class="stamp">
              <!-- 假设这里放一张印章的图片，如果有的话 -->
              <!-- <img src="@/assets/stamp.png" alt="印章" /> -->
              <span class="stamp-placeholder">[盖章处]</span>
            </div>
            <div class="sign">
              <span class="sign-placeholder">[签字处]</span>
            </div>
          </div>
        </div>
  
        <!-- 批准和拒绝按钮（根据状态显示） -->
        <div class="actions" v-if="leave.status === 0 || leave.status === 4">
          <el-button type="success" size="mini" @click="approveLeave">批准</el-button>
          <el-button type="danger" size="mini" @click="rejectLeave">拒绝</el-button>
        </div>
      </div>
      <div v-else>
        <p>正在加载请假信息...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import request from '@/utils/request'
  import { useRoute } from 'vue-router'
  
  export default {
    name: 'LeaveDetail',
    props: {
      leaveId: {
        type: Number,
        required: true
      }
    },
    setup(props) {
      const userInfo = ref(null)
      const leave = ref(null)
      const route = useRoute()
  
      // 格式化日期函数
      const formatDate = (utcStr) => {
        const date = new Date(utcStr)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
          date.getMinutes()
        ).padStart(2, '0')}`
      }
  
      const formattedLeaveDate = computed(() => {
        if (!leave.value) return ''
        const startFormatted = formatDate(leave.value.start_date)
        const endFormatted = formatDate(leave.value.end_date)
        return `从 ${startFormatted} 到 ${endFormatted}`
      })
  
      const formattedStatus = computed(() => {
        if (!leave.value) return ''
        switch (leave.value.status) {
          case 0:
            return '未批准'
          case 1:
            return '已批准'
          case 2:
            return '已驳回'
          case 3:
            return '已销假'
          case 4:
            return '待审核'
          case 5:
            return '已审核'
          default:
            return '未知状态'
        }
      })
  
      const fetchData = async () => {
        try {
          // 获取用户信息
          const userRes = await request.get('/UserInfoView/')
          userInfo.value = userRes
  
          // 获取请假条详情（假设通过 leave_id 参数获取详细信息）
          const leaveRes = await request.get('/view-leave/', {
            params: { leave_id: props.leaveId }
          })
          // 根据后端返回格式调整，此处假设返回单条记录对象
          leave.value = Array.isArray(leaveRes) ? leaveRes[0] : leaveRes
        } catch (error) {
          console.error('获取数据出错:', error)
        }
      }
  
      const approveLeave = async () => {
        try {
          // 假设批准请假使用的接口为 /admin/approve-leave/<leave_id>/
          await request.patch(`/admin/approve-leave/${props.leaveId}/`, { status: 1 })
          ElMessage.success('请假已批准')
          await fetchData() // 刷新数据
        } catch (error) {
          console.error('批准失败:', error)
          ElMessage.error('批准失败，请稍后重试')
        }
      }
  
      const rejectLeave = async () => {
        try {
          // 假设拒绝请假使用的接口为 /admin/reject-leave/<leave_id>/
          await request.patch(`/admin/reject-leave/${props.leaveId}/`, { status: 2 })
          ElMessage.success('请假已拒绝')
          await fetchData() // 刷新数据
        } catch (error) {
          console.error('拒绝失败:', error)
          ElMessage.error('拒绝失败，请稍后重试')
        }
      }
  
      onMounted(() => {
        fetchData()
      })
  
      return {
        userInfo,
        leave,
        formattedLeaveDate,
        formattedStatus,
        approveLeave,
        rejectLeave
      }
    }
  }
  </script>
  
  <style scoped>
  .leave-detail {
    padding: 20px;
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
  
  .footer-info {
    position: relative;
    min-height: 100px;
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
  
  .stamp-sign {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .stamp-placeholder,
  .sign-placeholder {
    display: inline-block;
    width: 100px;
    height: 50px;
    border: 2px dashed #999;
    line-height: 50px;
    text-align: center;
    color: #999;
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .actions {
    margin-top: 20px;
    text-align: center;
  }
  </style>
  