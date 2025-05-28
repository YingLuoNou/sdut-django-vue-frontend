<template>
  <el-card class="verify-container" shadow="hover">
    <h2>假条防伪验证</h2>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="h1" style="width: 60%;" />
        <el-skeleton-item variant="p" style="width: 40%;" />
        <el-skeleton-item variant="p" style="width: 50%;" />
      </template>

      <template #default>
        <div v-if="error" class="verify-error">
          <el-alert
            :title="error"
            type="error"
            show-icon
            center
          />
        </div>

        <div v-else class="verify-info">
          <!-- 已批准或已销假，正常显示详情 -->
          <el-descriptions title="假条详情" column="1" border>
            <el-descriptions-item label="学号">
              {{ data.student_number }}
            </el-descriptions-item>
            <el-descriptions-item label="姓名">
              {{ data.student_name }}
            </el-descriptions-item>
            <el-descriptions-item label="班级">
              {{ data.student_class }}
            </el-descriptions-item>
            <el-descriptions-item label="起止日期">
              {{ formatDate(data.start_date) }} — {{ formatDate(data.end_date) }}
            </el-descriptions-item>
            <el-descriptions-item label="申请时间">
              {{ formatDateTime(data.leave_time) }}
            </el-descriptions-item>
            <el-descriptions-item label="理由">
              {{ data.reason }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              {{ statusMap[data.status] || data.status }}
            </el-descriptions-item>
            <el-descriptions-item v-if="data.reject_reason" label="驳回原因">
              {{ data.reject_reason }}
            </el-descriptions-item>
          </el-descriptions>

          <!--
          <div class="qrcode">
            <p>防伪二维码（扫描可验证）</p>
            <img
              :src="`/api/leave/qrcode/${data.verification_uuid}/`"
              alt="防伪二维码"
            />
          </div>
          -->
        </div>
      </template>
    </el-skeleton>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'

const route = useRoute<{ uuid: string }>()
const uuid = route.params.uuid!

const data = ref<any>(null)
const loading = ref(true)
const error = ref<string>('')

const statusMap: Record<number, string> = {
  0: '未批准',
  1: '已批准',
  2: '已驳回',
  3: '已销假',
  4: '待审核',
  5: '已审核'
}

function formatDate(val: string) {
  return val.slice(0, 10)
}
function formatDateTime(val: string) {
  return val.replace('T', ' ').slice(0, 19)
}

onMounted(async () => {
  try {
    const res = await request.get(`/api/leave/verify/${uuid}/`)
    data.value = res.data
  } catch (err: any) {
    // 不管是 “不存在” 还是 “未批准”，后端都返回 400
    if (err.response?.status === 400) {
      error.value = '假条不存在或未批准'
    } else {
      error.value = '服务器错误，请稍后再试'
      console.error(err)
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.verify-container {
  max-width: 600px;
  margin: 2em auto;
  padding: 1em;
}
.verify-error {
  margin-top: 1em;
}
.verify-info {
  margin-top: 1em;
}
.qrcode {
  text-align: center;
  margin-top: 2em;
}
.qrcode img {
  width: 180px;
  height: 180px;
}
</style>
