<template>
  <el-container class="containerStyle" :style="containerStyle">
    <el-aside width="200px" style="background:#1d3557;color:#fff;">
      <h3 style="padding:20px;">后台管理</h3>
      <el-menu router background-color="#1d3557" text-color="#fff" active-text-color="#409eff">
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
      <el-header style="display:flex;justify-content:space-between;align-items:center;">
        <span class="header-title">首页</span>
        <div style="display:flex;align-items:center;cursor:pointer;">
          <img src="@assets/images/commonImages/ai.png" alt="头像"
            style="width:32px;height:32px;border-radius:50%;margin:0px 10px;border:1px solid #ccc;" />
          <div style="border:0px solid #ccc;">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElFooter } from 'element-plus'
import { List, User } from '@element-plus/icons-vue'
import loginBackground from '@assets/images/commonImages/bj.png'

const router = useRouter()
const userStore = useUserStore()


const containerStyle = {
  height: '100vh',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center right',
  backgroundImage: `url(${loginBackground})`,
}

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

  .containerStyle>.el-container>.content-main {
    padding: 12px;
  }

  .containerStyle>.el-container> :deep(.el-footer) {
    display: none;
  }
}
</style>