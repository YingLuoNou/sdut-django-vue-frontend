<template>
  <div class="user-info">
    <el-tabs v-model="activeTab" type="card">
      <!-- 用户信息选项卡 -->
      <el-tab-pane label="个人信息" name="info">
        <el-card>
          <h2>用户信息</h2>
          <el-form :model="userInfo" label-width="120px">
            <el-form-item label="姓名">
              <el-text>{{ userInfo.last_name }}</el-text>
            </el-form-item>

            <el-form-item label="工号">
              <el-text>{{ userInfo.student_number }}</el-text>
            </el-form-item>

            <el-form-item label="身份">
              <el-text>教师</el-text>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 修改密码选项卡 -->
      <el-tab-pane label="修改密码" name="change-password">
        <el-card>
          <h2>修改密码</h2>
          <el-form :model="passwordForm" label-width="120px">
            <el-form-item label="当前密码" :rules="[ { required: true, message: '请输入当前密码', trigger: 'blur' } ]">
              <el-input v-model="passwordForm.currentPassword" type="password" placeholder="请输入当前密码" />
            </el-form-item>

            <el-form-item label="新密码" :rules="[ { required: true, message: '请输入新密码', trigger: 'blur' } ]">
              <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
            </el-form-item>

            <el-form-item label="确认密码" :rules="[ { required: true, message: '请确认密码', trigger: 'blur' } ]">
              <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="changePassword">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      
    </el-tabs>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

export default {
  name: 'TchInfo',
  setup() {
    const activeTab = ref('info'); // 默认选中的选项卡
    const userInfo = ref({
      class_name: '',
      student_number: '',
      email: '',
      last_name: '',
      user_group: ''
    });
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const errorForm = ref({
      first_name: '',
      email: '',
      phone: ''
    });

    // 查询用户信息
    const fetchUserInfo = async () => {
      try {
        const response = await request.get('/UserInfoView/');
        userInfo.value = {
          class_name: response.class_name,
          student_number: response.student_number,
          last_name: response.last_name,
          user_group: response.user_group
        };
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    };

    // 修改密码
    const changePassword = async () => {
      const { currentPassword, newPassword, confirmPassword } = passwordForm.value;
      if (newPassword !== confirmPassword) {
        ElMessage.error('新密码和确认密码不一致');
        return;
      }
      try {
        const response = await request.post('/change-password/', {
          currentPassword,
          newPassword
        });
        if (response.detail) {
          ElMessage.success('密码修改成功');
        }
      } catch (error) {
        ElMessage.error('密码修改失败');
      }
    };

    // 提交信息更正
    const correctInfo = async () => {
      const { first_name, email, phone } = errorForm.value;
      try {
        const response = await request.post('/correct-user-info/', {
          first_name,
          email,
          phone
        });
        if (response.success) {
          ElMessage.success('信息已提交更正');
        }
      } catch (error) {
        ElMessage.error('信息更正失败');
      }
    };

    // 组件挂载时获取用户信息
    onMounted(() => {
      fetchUserInfo();
    });

    return {
      activeTab,
      userInfo,
      passwordForm,
      errorForm,
      fetchUserInfo,
      changePassword,
      correctInfo
    };
  }
};
</script>

<style scoped>
.user-info {
  padding: 20px;
}

.el-card {
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
}
</style>
