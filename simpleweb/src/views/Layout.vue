<template>
  <el-container class="containerStyle" :style="containerStyle">
    <el-aside class="sidebar" :width="menuCollapsed ? '64px' : '200px'" style="background:#1d3557;color:#fff;">
      <h3 class="sidebar-title">{{ menuCollapsed ? '管' : '后台管理' }}</h3>
      <el-menu class="sidebar-menu" :collapse="menuCollapsed" router background-color="#1d3557" text-color="#fff"
        active-text-color="#409eff">
        <el-menu-item index="/orders" class="sidebar-item">
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
        <div class="user-area">
          <img src="@assets/images/commonImages/ai.png" alt="头像"
            style="width:32px;height:32px;border-radius:50%;margin:0px 10px;border:1px solid #ccc;" />
          <div>
            {{ userStore.userInfo?.name }}（{{ userStore.userInfo?.role }}）
            <el-button link style="border:0px solid #ccc;" @click="logout">退出登录</el-button>
          </div>
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
import { ElFooter } from 'element-plus'
import { Expand, Fold, List, User } from '@element-plus/icons-vue'
import loginBackground from '@assets/images/commonImages/bj.png'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapsed = ref(false)
const isMobile = ref(false)
const menuCollapsed = computed(() => isCollapsed.value && !isMobile.value)

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
}

.header-left,
.user-area {
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