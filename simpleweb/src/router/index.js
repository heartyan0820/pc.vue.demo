import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    name: "login",
    path: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    name: "layout",
    path: "/",
    component: () => import("../views/Layout.vue"),
    redirect: "/orders",
    children: [
      {
        name: "orders",
        path: "orders",
        meta: { title: "订单管理" },
        component: () => import("../views/OrderList.vue"),
      },
      {
        name: "users",
        path: "users",
        meta: { title: "用户管理" },
        component: () => import("../views/UserList.vue"),
      },
      {
        name: "404",
        path: "/404",
        component: () => import("../views/error/404.vue"),
      },
    ],
  },
  { name: "not-found", path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  if (!["/login", "/404"].includes(to.path) && !localStorage.getItem("token")) {
    return "/login";
  }
});

export default router;
