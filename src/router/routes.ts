import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue"

export const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/askleave",
    name: "askleave",
    component: () => import("@/views/askleave.vue"),
  },
  {
    path:"/leaveinfo",
    name:"leaveinfo",
    component: () => import("@/views/leaveinfo.vue"),
  },
  {
    path:"/userinfo",
    name:"userinfo",
    component: () => import("@/views/userinfo.vue"),
  },
  {
    path:"/tchinfo",
    name:"tchinfo",
    component: () => import("@/views/tchinfo.vue"),
  },
  {
    path:"/",
    name:"login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path:"/masinfo",
    name:"masinfo",
    component: () => import("@/views/masinfo.vue"),
  },
  {
    path:"/approveleave",
    name:"approveleave",
    component: () => import("@/views/approveleave.vue"),
  },
  {
    path:"/leavedetail",
    name:"leavedetail",
    component: () => import("@/views/leavedetail.vue"),
  },
  {
    path:"/approveleave_mas",

    name:"approveleave_mas",
    component: () => import("@/views/approveleave_mas.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
