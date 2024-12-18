<script lang="ts" setup>
import { RouterView } from "vue-router"
// import navbar_example from "@/views/navbar_example.vue"
import Stu_Navbar from "./views/Stu_Navbar.vue";
import Tch_Navbar from "./views/Tch_Navbar.vue";
import {useUserStore} from "@/store/user"
import {ref,computed,watch} from "vue"
import Mas_Navbar from "./views/Mas_Navbar.vue";

const store = useUserStore()
const isStu = ref(false);
const isTch = ref(false);
const isMas = ref(false);
const userGroup = computed(() => store.userInfo.user_group);  // userInfo 存储在userStore.userInfo
// 监听 userGroup 的变化
watch(userGroup, (newGroup) => {
  console.log(newGroup)
  isStu.value = newGroup === 'stu';  // 如果用户组为 'stu'，则显示学生导航栏
  isTch.value = userGroup.value === 'tch';
  isMas.value = userGroup.value === 'mas';
});

isStu.value = userGroup.value === 'stu';
isTch.value = userGroup.value === 'tch';
isMas.value = userGroup.value === 'mas';


</script>

<template>
    <div class="common-layout">
      <el-container class="layout-container">
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-content">
            <span class="logo">请假(预览版)</span>
            <!-- <img src="./assets/" alt=""> -->
          </div>
        </el-header>
        <!-- 主体区域 -->
        <el-main>
          <!-- 根据登录状态来展示不同的内容 -->
          <router-view />

        </el-main>
  
        <!-- 底部区域 -->
        <el-footer class="navibar">
          <div v-if="isStu">
            <Stu_Navbar />
          </div>
          <div v-if="isTch">
            <Tch_Navbar />
          </div>
          <div v-if="isMas">
            <Mas_Navbar />
          </div>
        </el-footer>
      </el-container>
    </div>
</template>


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
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav-items {
  display: flex;
  align-items: center;
}

.nav-item {
  margin-left: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  text-decoration: underline;
}

.footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  border-top: 1px solid #444;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content span {
  margin: 0 10px;
}

.privacy-policy,
.terms-of-service {
  color: #8e8e8e;
  cursor: pointer;
}

.privacy-policy:hover,
.terms-of-service:hover {
  color: #fff;
  text-decoration: underline;
}
</style>
