<template>
  <el-container style="height:100vh;">
    <el-aside width="200px" style="background:#1d3557;color:#fff;">
      <h3 style="padding:20px;">后台管理</h3>
      <el-menu router background-color="#1d3557" text-color="#fff" active-text-color="#409eff">
        <el-menu-item index="/users">用户列表</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="display:flex;justify-content:space-between;align-items:center;">
        <span>首页</span>
        <div style="display:flex;align-items:center;cursor:pointer;">
          <img src="@assets/images/commonImages/ai.png" alt="头像"
            style="width:32px;height:32px;border-radius:50%;margin:0px 10px;border:1px solid #ccc;" />
          <div style="border:0px solid #ccc;">
            {{ userStore.userInfo?.name }}（{{ userStore.userInfo?.role }}）
            <el-button type="text" style="border:0px solid #ccc;" @click="logout">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>
