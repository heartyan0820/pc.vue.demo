<template>
  <el-container class="containerStyle" :style="containerStyle">
    <el-aside class="sidebar" :width="menuCollapsed ? '64px' : '200px'" style="background:#1d3557;color:#fff;">
      <h3 class="sidebar-title">{{ menuCollapsed ? '管' : '后台管理' }}</h3>
      <el-menu class="sidebar-menu" :collapse="menuCollapsed" :mode="isMobile ? 'horizontal' : 'vertical'"
        :default-active="route.path" :default-openeds="openMenuKeys" router background-color="#1d3557" text-color="#fff"
        active-text-color="#409eff">
        <el-sub-menu index="business">
          <template #title>
            <el-icon>
              <Operation />
            </el-icon>
            <span>业务管理</span>
          </template>
          <el-menu-item index="/orders">
            <el-icon>
              <List />
            </el-icon>
            <span>订单列表</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon>
              <User />
            </el-icon>
            <span>用户列表</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="toolManage">
          <template #title>
            <el-icon>
              <Operation />
            </el-icon>
            <span>工具管理</span>
          </template>
          <el-menu-item index="/file-manage">
            <el-icon>
              <List />
            </el-icon>
            <span>文件管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="page-header">
        <div class="header-left">
          <el-button class="collapse-toggle" link aria-label="折叠或展开导航" @click="isCollapsed = !isCollapsed">
            <el-icon>
              <Expand v-if="menuCollapsed" />
              <Fold v-else />
            </el-icon>
          </el-button>
          <span class="header-title">{{ route.meta.title || '首页' }}</span>
        </div>
        <div class="header-actions">
          <el-dropdown trigger="click" @command="navigateQuickly">
            <el-button class="header-icon-button" circle aria-label="快捷导航">
              <el-icon>
                <Plus />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="/orders">订单管理</el-dropdown-item>
                <el-dropdown-item command="/users">用户管理</el-dropdown-item>
                <el-dropdown-item command="/file-manage">文件管理</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-popover placement="bottom-end" :width="isMobile ? 'calc(100vw - 24px)' : 400" trigger="click"
            :show-arrow="false" popper-class="notification-popper">
            <template #reference>
              <el-button class="header-icon-button" circle aria-label="通知">
                <el-icon>
                  <Bell />
                </el-icon>
              </el-button>
            </template>
            <div class="notification-panel">
              <div class="notification-header">
                <div class="notification-tabs">
                  <button type="button" :class="{ active: activeNotificationTab === 'unread' }"
                    @click="activeNotificationTab = 'unread'">
                    未读消息({{ unreadNotifications.length }})
                  </button>
                  <button type="button" :class="{ active: activeNotificationTab === 'all' }"
                    @click="activeNotificationTab = 'all'">
                    全部消息
                  </button>
                </div>
                <div class="notification-tools">
                  <el-tooltip content="全部标为已读" placement="top">
                    <el-button link aria-label="全部标为已读" :disabled="unreadNotifications.length === 0"
                      @click="markAllNotificationsRead">
                      <el-icon>
                        <Check />
                      </el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="清空消息" placement="top">
                    <el-button link aria-label="清空消息" :disabled="notifications.length === 0"
                      @click="clearNotifications">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="通知设置" placement="top">
                    <el-button link aria-label="通知设置" @click="showNotificationSettings">
                      <el-icon>
                        <Setting />
                      </el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              <div class="notification-content">
                <ul v-if="visibleNotifications.length" class="notification-list">
                  <li v-for="notification in visibleNotifications" :key="notification.id"
                    :class="{ unread: !notification.read }">
                    <strong>{{ notification.title }}</strong>
                    <p>{{ notification.content }}</p>
                    <small>{{ notification.time }}</small>
                  </li>
                </ul>
                <span v-else class="notification-empty">暂无</span>
              </div>
            </div>
          </el-popover>
          <el-dropdown trigger="click" @command="handleAccountCommand">
            <button class="profile-trigger" type="button" aria-label="打开账户菜单">
              <img src="@assets/images/commonImages/ai.png" alt="" />
            </button>
            <template #dropdown>
              <el-dropdown-menu class="account-menu">
                <li class="account-summary">
                  <img src="@assets/images/commonImages/ai.png" alt="" />
                  <span>
                    <strong>{{ userStore.userInfo?.name || '用户' }}</strong>
                    <small>{{ userStore.userInfo?.role || '未设置角色' }}</small>
                  </span>
                </li>
                <el-dropdown-item command="profile">
                  <el-icon>
                    <User />
                  </el-icon>
                  <span>个人档案</span>
                </el-dropdown-item>
                <el-dropdown-item command="password">
                  <el-icon>
                    <Lock />
                  </el-icon>
                  <span>修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="content-main">
        <router-view />
      </el-main>
      <el-footer
        style="text-align:center;color:#999;font-size:12px;border-top:0px solid #ccc;display:flex;flex-direction: column;justify-content: center;">
        <span>© 2000 - {{ new Date().getFullYear() }} SimpleWeb. All rights reserved.</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElFooter, ElMessage } from 'element-plus'
import { Bell, Check, Delete, Expand, Fold, List, Lock, Operation, Plus, Setting, SwitchButton, User } from '@element-plus/icons-vue'
import loginBackground from '@assets/images/commonImages/bj.png'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapsed = ref(false)
const isMobile = ref(false)
const menuCollapsed = computed(() => isCollapsed.value && !isMobile.value)
const openMenuKeys = computed(() => route.path === '/file-manage' ? ['toolManage'] : ['business'])
const activeNotificationTab = ref('unread')
const notifications = ref([])
const unreadNotifications = computed(() => notifications.value.filter((notification) => !notification.read))
const visibleNotifications = computed(() => activeNotificationTab.value === 'unread'
  ? unreadNotifications.value
  : notifications.value)

let mobileMediaQuery

const containerStyle = {
  height: '100vh',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center right',
  backgroundImage: `url(${loginBackground})`,
}

function updateMobileState(event) {
  isMobile.value = event.matches
}

onMounted(() => {
  mobileMediaQuery = window.matchMedia('(max-width: 767px)')
  isMobile.value = mobileMediaQuery.matches
  mobileMediaQuery.addEventListener('change', updateMobileState)
})

onUnmounted(() => {
  mobileMediaQuery?.removeEventListener('change', updateMobileState)
})

function logout() {
  userStore.logout()
  router.push('/login')
}

function navigateQuickly(path) {
  router.push(path)
}

function markAllNotificationsRead() {
  notifications.value = notifications.value.map((notification) => ({ ...notification, read: true }))
}

function clearNotifications() {
  notifications.value = []
}

function showNotificationSettings() {
  ElMessage.info('通知设置功能尚未开放')
}

function handleAccountCommand(command) {
  if (command === 'logout') {
    logout()
    return
  }

  ElMessage.info(command === 'profile' ? '个人档案功能尚未开放' : '修改密码功能尚未开放')
}
</script>

<style scoped>
:global(body) {
  margin: 0;
}

.containerStyle {
  height: 100vh;
  background-repeat: no-repeat;
  background-position: center right;
  background: url("@assets/images/commonImages/bj.png") no-repeat center right;
}

.sidebar {
  overflow: hidden;
  transition: width 0.2s ease;
}

.sidebar-title {
  margin: 0;
  padding: 20px;
  text-align: center;
  white-space: nowrap;
}

.sidebar-menu {
  border-right: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  background: #3784f7;
  color: #fff;
}

.header-left,
.header-actions {
  display: flex;
  align-items: center;
}

.header-left {
  gap: 12px;
}

.collapse-toggle {
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: #fff;
}

.header-actions {
  gap: 10px;
}

.header-actions :deep(.header-icon-button) {
  border-color: rgba(255, 255, 255, 0.5);
  background: transparent;
  color: #fff;
}

.header-actions :deep(.header-icon-button:hover) {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.profile-trigger {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.profile-trigger img,
.account-summary img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.account-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  list-style: none;
}

.account-summary span {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.account-summary strong {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.account-summary small {
  color: #909399;
  font-size: 12px;
}

:global(.notification-popper) {
  padding: 0 !important;
}

.notification-panel {
  display: flex;
  min-height: 280px;
  flex-direction: column;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
  border-bottom: 1px solid #ebeef5;
}

.notification-tabs,
.notification-tools {
  display: flex;
  align-items: center;
}

.notification-tabs {
  gap: 20px;
}

.notification-tabs button {
  padding: 14px 0 10px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #303133;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.notification-tabs button.active {
  border-bottom-color: #409eff;
  color: #409eff;
}

.notification-tools {
  gap: 4px;
}

.notification-tools :deep(.el-button) {
  width: 28px;
  height: 28px;
  margin: 0;
  color: #303133;
}

.notification-content {
  display: grid;
  min-height: 230px;
  flex: 1;
  place-items: center;
  color: #8490a0;
  font-size: 14px;
}

.notification-list {
  width: 100%;
  align-self: stretch;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notification-list li {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
}

.notification-list li.unread {
  background: #f5f9ff;
}

.notification-list p {
  margin: 6px 0;
  color: #606266;
}

.notification-list small {
  color: #a0a8b3;
}

.content-main {
  min-width: 0;
}

@media (max-width: 767px) {
  .containerStyle {
    height: 100dvh;
    flex-direction: column;
    background-position: center;
    background-size: cover;
  }

  .containerStyle> :deep(.el-aside) {
    width: 100% !important;
    height: auto !important;
    flex: 0 0 auto;
  }

  .containerStyle> :deep(.el-aside h3) {
    margin: 0;
    padding: 10px 16px !important;
    font-size: 16px;
    text-align: left;
  }

  .containerStyle> :deep(.el-aside .el-menu) {
    display: flex;
    border-right: 0;
  }

  .containerStyle> :deep(.el-aside .el-menu-item) {
    flex: 1;
    justify-content: center;
    height: 44px;
    line-height: 44px;
    padding: 0 8px !important;
  }

  .containerStyle>.el-container {
    flex: 1;
    min-height: 0;
    min-width: 0;
  }

  .containerStyle>.el-container> :deep(.el-header) {
    height: 56px;
    padding: 0 12px;
  }

  .header-actions {
    gap: 6px;
  }

  .notification-header {
    gap: 4px;
    padding: 0 8px;
  }

  .notification-tabs {
    gap: 12px;
  }

  .collapse-toggle {
    display: none;
  }

  .containerStyle>.el-container>.content-main {
    padding: 12px;
  }

  .containerStyle>.el-container> :deep(.el-footer) {
    display: none;
  }
}
</style>