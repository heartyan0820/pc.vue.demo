import { createRouter, createWebHashHistory } from "vue-router";
const Layout = () => import("@/layout/index.vue");
const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true, title: "易齿盟登录管理" }
  },
  {
    path: "/logins",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true, title: "易齿盟登录管理" }
  },
  {
    path: "/print",
    name: "print",
    component: () => import("@/views/print/index.vue"),
    meta: { hidden: false, title: "" }
  },
  {
    path: "/v",
    name: "v",
    component: () => import("@/views/videopaly/index.vue"),
    meta: { hidden: false, title: "易齿盟视频播放" }
  },
  {
    path: "/doc",
    name: "doc",
    component: () => import("@/views/doc/index.vue"),
    meta: { hidden: false, title: "易齿盟在线文档" }
  },
  {
    path: "/wpfxd",
    name: "wpfxd",
    component: () => import("@/views/wpfxd/index.vue"),
    meta: { hidden: false, title: "易齿盟WPF在线下单" }
  },
  {
    path: "/wpfup",
    name: "wpfup",
    component: () => import("@/views/wpfuporder/index.vue"),
    meta: { hidden: false, title: "易齿盟WPF修改订单" }
  },
  {
    path: "/wpforder",
    name: "wpforder",
    component: () => import("@/views/order/index.vue"),
    meta: { hidden: false, title: "易齿盟WPF在线下单" }
  },
  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/index/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "index",
        meta: {
          title: "易齿盟首页",
          icon: "homepage",
          affix: true,
          keepAlive: false,
          needRefresh: true
        }
      },
      {
        path: "order",
        name: "order",
        component: () => import("@/views/order/index.vue"),
        meta: { keepAlive: false, title: "易齿盟在线下单", needRefresh: true }
      },
      {
        path: "orders",
        name: "orders",
        component: () => import("@/views/orders/index.vue"),
        meta: { keepAlive: false, title: "易齿盟订单管理", needRefresh: true }
      },
      {
        path: "user",
        name: "user",
        component: () => import("@/views/user/index.vue"),
        meta: { keepAlive: false, title: "易齿盟个人中心", needRefresh: true }
      },
      {
        path: "member",
        name: "member",
        component: () => import("@/views/user/index.vue"),
        meta: { keepAlive: false, title: "易齿盟成员管理", needRefresh: true }
      },
      {
        path: "customerorg",
        name: "customerorg",
        component: () => import("@/views/user/index.vue"),
        meta: { keepAlive: false, title: "易齿盟医疗机构", needRefresh: true }
      },
      {
        path: "help",
        name: "help",
        component: () => import("@/views/help/index.vue"),
        meta: { keepAlive: false, title: "易齿盟网页门诊端", needRefresh: true }
      },
      {
        path: "operating",
        name: "operating",
        component: () => import("@/views/operating/index.vue"),
        meta: { keepAlive: false, title: "易齿盟运营公司端", needRefresh: true }
      },
      {
        path: "installmanual",
        name: "installmanual",
        component: () => import("@/views/installmanual/index.vue"),
        meta: { keepAlive: false, title: "易齿盟安装手册", needRefresh: true }
      },
      {
        path: "designend",
        name: "designend",
        component: () => import("@/views/designend/index.vue"),
        meta: { keepAlive: false, title: "易齿盟设计端", needRefresh: true }
      },
      {
        path: "factoryend",
        name: "factoryend",
        component: () => import("@/views/factoryend/index.vue"),
        meta: { keepAlive: false, title: "易齿盟工厂端", needRefresh: true }
      },
      {
        path: "test",
        name: "test",
        component: () => import("@/views/test/index.vue"),
        meta: { keepAlive: false, title: "易齿盟测试数据", needRefresh: true }
      },
      {
        path: "certification",
        name: "certification",
        component: () => import("@/views/certification/index.vue"),
        meta: { keepAlive: false, title: "易齿盟申请认证", needRefresh: true }
      },
      {
        path: "details",
        name: "details",
        component: () => import("@/views/details/index.vue"),
        meta: { keepAlive: false, title: "易齿盟订单详情", needRefresh: true }
      },
      {
        path: "about",
        name: "about",
        component: () => import("@/views/about/index.vue"),
        meta: { keepAlive: false, title: "易齿盟关于我们", needRefresh: true }
      },
      {
        path: "contact",
        name: "contact",
        component: () => import("@/views/contact/index.vue"),
        meta: { keepAlive: false, title: "易齿盟联系我们", needRefresh: true }
      },
      {
        path: "softwarecenter",
        name: "softwarecenter",
        component: () => import("@/views/softwarecenter/index.vue"),
        meta: { keepAlive: false, title: "易齿盟软件中心", needRefresh: true }
      },
      {
        path: "teleconsultation",
        name: "teleconsultation",
        component: () => import("@/views/teleconsultation/index.vue"),
        meta: { keepAlive: false, title: "易齿盟远程会诊", needRefresh: true }
      },
      {
        path: "ecmshop",
        name: "ecmshop",
        component: () => import("@/views/ecmshop/index.vue"),
        meta: { keepAlive: false, title: "易齿盟商城", needRefresh: true }
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true, title: "易齿盟无权访问", needRefresh: true }
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true, title: "易齿盟页面不存在", needRefresh: true }
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", icon: "user", hidden: true, needRefresh: true }
      },
      {
        path: "myNotice",
        name: "MyNotice",
        component: () => import("@/views/system/notice/components/MyNotice.vue"),
        meta: { title: "我的通知", icon: "user", hidden: true }
      }
    ]
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});
function setupRouter(app) {
  app.use(router);
}
var stdin_default = router;
export {
  Layout,
  constantRoutes,
  stdin_default as default,
  setupRouter
};
