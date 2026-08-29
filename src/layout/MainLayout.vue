<script setup>
// MainLayout 是主框架：登录后的所有页面都套在这个壳子里（侧边栏 + 顶栏 + 内容区）
// 登录页不使用这个壳子，它是一个独立的路由页面
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'
import { useUiStore } from '../stores/ui'
import { useAuthStore } from '../stores/auth'

const userStore = useUserStore()
const ui = useUiStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// 页面标题跟随当前路由变化（标题在 router/index.js 的 meta 里定义）
const pageTitle = computed(() => route.meta.title || '')

// 字体大小 -> Element Plus 组件尺寸（小/中/大 三档）
const componentSize = computed(
  () => ({ 12: 'small', 14: 'default', 16: 'large' })[userStore.fontSize] || 'default'
)

// 侧边栏宽度：窄屏时占满一行；宽屏时折叠为 64px / 展开 200px
const asideWidth = computed(() => {
  if (ui.isMobile) return '100%'
  return ui.isCollapsed ? '64px' : '200px'
})

// 右上角用户下拉菜单的指令处理（command 值在模板里定义）
function onUserCommand(command) {
  if (command === 'personal') {
    router.push('/personal') // 跳转到个人中心
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' })
      .then(() => {
        authStore.logout() // 清空登录状态
        ElMessage.success('已退出登录')
        router.push('/login') // 回到登录页（路由守卫也会拦截未登录的访问）
      })
      .catch(() => {}) // 用户点"取消"会走到这里，什么都不用做
  }
}
</script>

<template>
  <!-- el-config-provider：把组件尺寸设置传递给所有 Element Plus 子组件 -->
  <el-config-provider :size="componentSize">
    <!-- 响应式：窄屏时改为上下结构（菜单在顶部），宽屏时左右结构 -->
    <el-container class="layout" :direction="ui.isMobile ? 'vertical' : 'horizontal'">
      <!-- 左侧导航菜单（可折叠：折叠时只剩图标，宽度 64px） -->
      <el-aside :width="asideWidth" class="layout-aside">
        <div class="logo" :class="{ 'logo-mobile': ui.isMobile }">
          {{ !ui.isMobile && ui.isCollapsed ? '订' : '订单管理系统' }}
        </div>
        <!-- collapse 属性：是否折叠（折叠模式只在竖向菜单下生效） -->
        <el-menu
          :default-active="route.path"
          :mode="ui.isMobile ? 'horizontal' : 'vertical'"
          :collapse="!ui.isMobile && ui.isCollapsed"
          :collapse-transition="false"
          router
        >
          <el-menu-item index="/orders">
            <el-icon><Tickets /></el-icon>
            <template #title>订单管理</template>
          </el-menu-item>
          <el-menu-item index="/stats">
            <el-icon><TrendCharts /></el-icon>
            <template #title>数据统计</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部栏：左边是折叠按钮 + 页面标题，右边是用户下拉菜单 -->
        <el-header class="layout-header">
          <div class="header-left">
            <!-- 点击图标切换侧边栏折叠（窄屏下是横向菜单，不需要折叠按钮） -->
            <el-icon
              v-if="!ui.isMobile"
              class="fold-btn"
              :title="ui.isCollapsed ? '展开菜单' : '折叠菜单'"
              @click="ui.toggleCollapse()"
            >
              <Expand v-if="ui.isCollapsed" />
              <Fold v-else />
            </el-icon>
            <span class="page-title">{{ pageTitle }}</span>
          </div>

          <!-- 用户区域：头像 + 用户名，鼠标悬停/点击弹出下拉菜单 -->
          <el-dropdown @command="onUserCommand">
            <span class="user-info">
              <el-avatar :size="34" class="user-avatar">
                {{ userStore.nickname.slice(0, 1) }}
              </el-avatar>
              <span class="user-text">
                <span class="user-name">{{ userStore.nickname }}</span>
                <span class="user-role">管理员</span>
              </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <!-- 内容区：子路由页面（订单管理/数据统计/个人中心）渲染在这里 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
.layout {
  height: 100%;
}

.layout-aside {
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: bold;
  color: #409eff;
  border-bottom: 1px solid #e4e7ed;
}

/* 窄屏时 logo 变矮一点，为菜单腾出空间 */
.logo-mobile {
  height: 44px;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 折叠按钮：可点击的图标 */
.fold-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.fold-btn:hover {
  color: #409eff;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
}

/* 右上角用户区域 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.user-avatar {
  background-color: #409eff;
  font-size: 16px;
}

.user-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-weight: bold;
}

.user-role {
  font-size: 12px;
  color: #909399;
}
</style>
