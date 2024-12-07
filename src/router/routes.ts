import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue"

export const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Login.vue')
      }
    ]
  },
  {
    path: '/teacher',
    name: 'TeacherHome',
    components: {
      default: HomeView, // 主内容区域
      navbar: () => import('@/views/TeacherNavbar.vue'), // 教师身份的导航栏
    }
  },
  {
    path: '/student',
    name: 'StudentHome',
    components: {
      default: HomeView, // 主内容区域
      navbar: () => import('@/views/StudentNavbar.vue'), // 学生身份的导航栏
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
