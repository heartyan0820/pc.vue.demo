import { createRouter, createWebHistory } from "vue-router";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.path !== "/login" && !localStorage.getItem("token")) {
    return "/login";
  }
});

export default router;
