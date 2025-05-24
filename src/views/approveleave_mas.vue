<template>
    <div class="mas-leave-list">
      <h2>长假审批列表</h2>
  
      <!-- 两个 Tab：待审核(4)、已审核(5) -->
      <el-tabs v-model="activeTab" stretch>
        <el-tab-pane label="长假待审核" name="4"></el-tab-pane>
        <el-tab-pane label="已审核"     name="5"></el-tab-pane>
      </el-tabs>
  
      <el-table
        :data="leaveRequests"
        border
        stripe
        style="width:100%"
        v-loading="isLoading"
      >
        <el-table-column prop="student_name" label="学生" width="150"/>
        <el-table-column prop="reason"       label="请假事由"/>
        <el-table-column
          label="开始日期"
          :formatter="r=>formatDate(r.start_date)"
          width="180"
        />
        <el-table-column
          label="结束日期"
          :formatter="r=>formatDate(r.end_date)"
          width="180"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          :formatter="formatStatus"
        />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <!-- 只有待审核可以审批/拒绝 -->
            <el-button
              v-if="activeTab==='4'"
              type="success"
              size="small"
              @click="approveLeave(row.id)"
              :loading="loadingMap[row.id]?.approving"
            >批准</el-button>
            <el-button
              v-if="activeTab==='4'"
              type="danger"
              size="small"
              @click="rejectLeave(row.id)"
              :loading="loadingMap[row.id]?.rejecting"
            >拒绝</el-button>
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
        class="mt-4"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import request from '@/utils/request'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const leaveRequests = ref([])
  const isLoading     = ref(false)
  const activeTab     = ref('4')  // 默认“长假待审核”
  const currentPage   = ref(1)
  const pageSize      = ref(10)
  const total         = ref(0)
  const loadingMap    = reactive({})
  
  function formatDate(iso) {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} `
         + `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }
  
  function formatStatus(status) {
    if (status === 4) return '待审核'
    if (status === 5) return '已审核'
    return '未知'
  }
  
  async function fetchData() {
    isLoading.value = true
    try {
      const resp = await request.get('/admin/leaves/', {
        params: {
          status: activeTab.value,
          page: currentPage.value,
          page_size: pageSize.value
        }
      })
      total.value         = resp.count
      leaveRequests.value = resp.results
      // 空页回退
      if (!leaveRequests.value.length && currentPage.value > 1) {
        currentPage.value--
        return fetchData()
      }
    } catch {
      ElMessage.error('获取列表失败')
    } finally {
      isLoading.value = false
    }
  }
  
  // 监听 Tab、分页参数变化
  watch([activeTab, currentPage, pageSize], () => {
    if (activeTab.value) currentPage.value = 1
    fetchData()
  }, { immediate: true })
  
  function onPageChange(p) {
    currentPage.value = p
  }
  function onSizeChange(size) {
    pageSize.value    = size
    currentPage.value = 1
  }
  
  // 批准长假
  async function approveLeave(id) {
    loadingMap[id] = loadingMap[id] || {}
    loadingMap[id].approving = true
    try {
      await request.patch(`/admin/mas-approve-leave/${id}/`, {})
      ElMessage.success('批准成功')
      leaveRequests.value = leaveRequests.value.filter(r=>r.id!==id)
      total.value--
    } catch {
      ElMessage.error('批准失败')
    } finally {
      loadingMap[id].approving = false
    }
  }
  
  // 拒绝长假
  async function rejectLeave(id) {
    try {
      const { value: reason } = await ElMessageBox.prompt(
        '请输入拒绝理由','拒绝长假',
        { confirmButtonText:'确定',cancelButtonText:'取消', inputValidator:v=>!!v.trim()||'理由不能为空'}
      )
      loadingMap[id] = loadingMap[id] || {}
      loadingMap[id].rejecting = true
      await request.post(`/admin/reject-leave/${id}/`, { reject_reason: reason })
      ElMessage.success('拒绝成功')
      leaveRequests.value = leaveRequests.value.filter(r=>r.id!==id)
      total.value--
    } catch(err) {
      if (err!=='cancel') ElMessage.error('拒绝失败')
    } finally {
      loadingMap[id].rejecting = false
    }
  }
  
  onMounted(fetchData)
  </script>
  
  <style scoped>
  .mas-leave-list {
    padding: 20px;
  }
  h2 {
    margin-bottom: 20px;
    font-size: 24px;
  }
  </style>
  