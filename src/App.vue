<template>
    <div class="common-layout">
      <el-container class="layout-container">
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-content">
            <span class="logo" @click="confirmLogout">请假页</span>
          </div>
        </el-header>
  
        <!-- 主体区域 -->
        <el-main>
          <router-view />
        </el-main>
  
        <!-- 底部区域 -->
        <el-footer class="navibar">
          <!-- 三种角色的导航栏 -->
          <div v-if="isStu">
            <Stu_Navbar />
          </div>
          <div v-if="isTch">
            <Tch_Navbar />
          </div>
          <div v-if="isMas">
            <Mas_Navbar />
          </div>
          <!-- 如果都不渲染导航栏，就显示版权信息 -->
          <div v-if="!isStu && !isTch && !isMas" class="copyright">
            ©copyright 2025 eh  All rights reserved.
          </div>
        </el-footer>
      </el-container>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from "vue";
  import { useRouter } from "vue-router";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { useUserStore } from "@/store/user";
  
  import Stu_Navbar from "./views/Stu_Navbar.vue";
  import Tch_Navbar from "./views/Tch_Navbar.vue";
  import Mas_Navbar from "./views/Mas_Navbar.vue";
  
  const store = useUserStore();
  const router = useRouter();
  
  const isStu = ref(false);
  const isTch = ref(false);
  const isMas = ref(false);
  
  const userGroup = computed(() => store.userInfo.user_group);
  
  // 监听 userGroup 的变化
  watch(
    userGroup,
    (newGroup) => {
      isStu.value = newGroup === "stu";
      isTch.value = newGroup === "tch";
      isMas.value = newGroup === "mas";
    },
    { immediate: true }
  );
  
  // 点击顶部 Logo 时确认退出登录
  async function confirmLogout() {
    try {
      await ElMessageBox.confirm(
        "确认要取消登录吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      store.clearUserInfo();    // 请在 user store 中实现 clearUserInfo()
      router.push("/");
      ElMessage.success("已退出登录");
    } catch {
      // 取消或关闭，无操作
    }
  }
  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background-color: #003366;
    color: #fff;
    padding: 10px 20px;
    display: flex;
    align-items: center;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .logo {
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  }
  
 
.navibar {
  background-color: #343a40;
  padding: 0;
  position: relative;
}

/* 版权信息 */
.navibar .copyright {
  text-align: center;
  font-size: 12px;
  color: #aaaaaa;
  padding: 8px 0;
  background-color: #2c2f33;
  white-space: nowrap;
}
  </style>
  