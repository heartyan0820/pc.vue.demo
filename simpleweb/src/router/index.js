import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/login", component: () => import("../views/Login.vue") },
  {
    path: "/",
    component: () => import("../views/Layout.vue"),
    redirect: "/users",
    children: [
      { path: "users", component: () => import("../views/UserList.vue") },
    ],
  },
  { path: "/404", component: () => import("../views/error/404.vue") },
  { path: "/:pathMatch(.*)*", redirect: "/404" },
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
