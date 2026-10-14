<template>
  <el-container class="containerStyle" :style="containerStyle">
    <el-aside width="200px" style="background:#1d3557;color:#fff;">
      <h3 style="padding:20px;">后台管理</h3>
      <el-menu router background-color="#1d3557" text-color="#fff" active-text-color="#409eff">
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
</style>