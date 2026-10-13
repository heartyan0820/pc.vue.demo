<template>
  <div class="login-box">
    <el-card>
      <h2 style="text-align:center;">后台管理系统</h2>
      <el-form :model="form">
        <el-form-item>
          <el-input v-model="form.username" placeholder="账号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" show-password />
        </el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({ username: 'admin', password: '123456' })

async function handleLogin() {
  if (!form.username || !form.password) {
    return ElMessage.warning('请输入账号密码')
  }
  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功')
    router.push('/users')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-box {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.login-box :deep(.el-card) {
  width: 360px;
  padding: 10px;
}
</style>
