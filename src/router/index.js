// 路由配置：定义"URL 路径 -> 页面组件"的对应关系
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layout/MainLayout.vue'
import PersonalCenter from '../views/PersonalCenter.vue'
import OrderList from '../views/OrderList.vue'
import DataStats from '../views/DataStats.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  // hash 模式：URL 中带 #（例如 /#/orders），本地开发最简单
  history: createWebHashHistory(),
  routes: [
    // 登录页：不需要主框架（侧边栏/顶栏），meta.public 表示"未登录也可访问"
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录', public: true },
    },
    // 主框架页：登录后才能访问，里面的页面都作为 children 渲染在 MainLayout 的 <router-view /> 里
    {
      path: '/',
      component: MainLayout,
      redirect: '/orders',
      children: [
        {
          path: 'orders',
          name: 'orders',
          component: OrderList,
          meta: { title: '订单管理' }, // meta 里的标题会显示在顶部栏
        },
        {
          path: 'stats',
          name: 'stats',
          component: DataStats,
          meta: { title: '数据统计' },
        },
        {
          path: 'personal',
          name: 'personal',
          component: PersonalCenter,
          meta: { title: '个人中心' },
        },
      ],
    },
  ],
})

// 全局前置守卫：每次页面跳转前都会执行
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 未登录：只允许访问带 meta.public 的页面（目前只有登录页），其余全部跳回登录页
  if (!authStore.isLoggedIn && !to.meta.public) {
    return { path: '/login' }
  }

  // 已登录还去访问登录页时，直接送回订单管理页
  if (authStore.isLoggedIn && to.path === '/login') {
    return '/orders'
  }
  // 返回 undefined 表示放行，正常跳转
})

export default router
