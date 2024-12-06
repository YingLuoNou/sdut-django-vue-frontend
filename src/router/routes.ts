import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";

export const routes = [
    // {
    //     path: "/",
    //     name: "home",
    //     component: () => import("@/views/HomeView.vue")
    // },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue")
    },
    {
        path:"/Dashboard",
        name:"Dashboard",
        component: () => import("@/views/Dashboard.vue")
    },
    {
        path:"/",
        component: () => import("@/views/HomeView.vue"),
        children:[
            {
                path:"Dashboard",
                name:"Dashboard",
                component: () => import("@/views/Dashboard.vue")
            }]

    }
]
