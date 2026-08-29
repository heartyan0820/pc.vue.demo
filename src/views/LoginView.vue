<script setup>
// 登录页：演示账号 admin / 123456
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// 记住账号密码用的 localStorage key
const REMEMBER_KEY = 'pc-vue-demo-remember'

// 登录表单数据
const form = reactive({
  username: '',
  password: '',
})

// "记住我"开关，初始值从 localStorage 读取（上次是否勾选过）
const rememberMe = ref(localStorage.getItem(REMEMBER_KEY) === '1')

// 进入页面时：如果上次勾选了"记住我"，把保存的账号密码回填到表单
if (rememberMe.value) {
  try {
    // JSON.parse 把字符串转回对象；解析失败就当没存过
    const saved = JSON.parse(localStorage.getItem(REMEMBER_KEY + '-cred') || '{}')
    form.username = saved.username || ''
    form.password = saved.password || ''
  } catch {
    // 解析失败不做任何事
  }
}

const formRef = ref()

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value.validate() // 校验不通过会抛异常，不会往下走

  if (authStore.login(form.username, form.password)) {
    // 登录成功后再处理"记住我"：勾选了就保存账号密码，没勾就清除
    if (rememberMe.value) {
      localStorage.setItem(REMEMBER_KEY, '1') // 标记"已勾选"
      localStorage.setItem(
        REMEMBER_KEY + '-cred',
        JSON.stringify({ username: form.username, password: form.password })
      )
    } else {
      localStorage.removeItem(REMEMBER_KEY)
      localStorage.removeItem(REMEMBER_KEY + '-cred')
    }

    ElMessage.success('登录成功')
    router.push('/orders') // 登录成功进入订单管理页
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <h1 class="login-title">订单管理系统</h1>
      <p class="login-subtitle">欢迎登录，请输入账号密码</p>

      <el-form ref="formRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="密码"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberMe">记住账号密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <p class="login-hint">演示账号：admin　密码：123456</p>
    </el-card>
  </div>
</template>

<style scoped>
/* 整屏背景 + 垂直水平居中 */
.login-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2b7de9 0%, #6f42c1 100%);
}

.login-card {
  width: 380px;
  padding: 8px 12px;
}

.login-title {
  text-align: center;
  font-size: 22px;
  color: #303133;
  margin-bottom: 8px;
}

.login-subtitle {
  text-align: center;
  color: #909399;
  font-size: 13px;
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
}

.login-hint {
  text-align: center;
  color: #909399;
  font-size: 12px;
}
</style>
