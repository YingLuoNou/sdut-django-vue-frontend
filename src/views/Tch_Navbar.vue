<template>
    <!-- 底部固定横向导航栏 -->
    <el-footer class="navbar">
        <el-row
            type="flex"
            justify="center"
            align="middle"
            class="navbar-container"
        >
            <el-col :span="24">
                <el-menu
                    mode="horizontal"
                    class="navbar-menu"
                    active-text-color="#007bff"
                >
                    <!-- 清空 overflow 触发按钮，彻底去掉“更多”省略号 -->
                    <template #overflowed-indicator></template>

                    <el-menu-item index="1">
                        <router-link to="/approveleave">假条批准</router-link>
                    </el-menu-item>
                    <!--
            <el-menu-item index="2">
              <router-link to="/leaveinfo">所带班级信息</router-link>
            </el-menu-item>
            -->
                    <el-menu-item index="3">
                        <router-link to="/tchinfo">个人信息</router-link>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <router-link to="/classmanage">学生管理</router-link>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </el-footer>
</template>

<script>
export default {
    name: "Tch_Navbar"
}
</script>

<style scoped>
/* 底部固定导航栏样式 */
.navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #343a40;
    color: white;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 0;
    margin: 0;
}

/* 容器 */
.navbar-container {
    width: 100%;
    padding: 0;
    margin: 0;
}

/* 菜单样式 */
.navbar-menu {
    display: flex;
    justify-content: space-evenly;
    padding: 0;
    margin: 0;
    background-color: #f9f9f9;
    border-radius: 0;
    white-space: nowrap; /* 防止换行，保证一行展示 */
}

/* 隐藏 Element-Plus 自动添加的 overflow 按钮 */
.navbar-menu .el-menu__overflowed-button,
.navbar-menu .el-menu__overflowed-dropdown {
    display: none !important;
}

/* 单个菜单项样式 */
.navbar-menu .el-menu-item {
    font-size: 16px;
    font-weight: 500;
    border: none;
    text-align: center;
}

/* 鼠标悬停效果 */
.navbar-menu .el-menu-item:hover {
    color: #007bff;
    text-decoration: underline;
    background-color: rgba(0, 123, 255, 0.2);
}

/* 激活态 */
.navbar-menu .el-menu-item.is-active {
    background-color: #d5dbe0;
    color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .navbar-menu .el-menu-item {
        padding: 0 15px;
        font-size: 14px;
    }
}
</style>
