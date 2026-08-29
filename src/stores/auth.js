// 登录状态 store：记录"当前是否已登录"
import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'pc-vue-demo-is-login'

export const useAuthStore = defineStore('auth', () => {
  // 刷新页面后依然保持登录状态（localStorage 持久化）
  const isLoggedIn = ref(localStorage.getItem(STORAGE_KEY) === '1')

  // 登录：校验账号密码
  // 演示项目在这里写死了一个账号；真实项目里这一步应该调用后端接口验证
  function login(username, password) {
    if (username === 'admin' && password === '123456') {
      isLoggedIn.value = true
      localStorage.setItem(STORAGE_KEY, '1')
      return true
    }
    return false
  }

  // 退出登录：清空登录状态
  function logout() {
    isLoggedIn.value = false
    localStorage.removeItem(STORAGE_KEY)
  }

  return { isLoggedIn, login, logout }
})
