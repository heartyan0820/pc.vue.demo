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
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  if (to.path !== "/login" && !localStorage.getItem("token")) {
    return "/login";
  }
});

export default router;
