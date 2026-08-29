<script setup>
// App.vue 是根组件：现在只负责全局性的设置（字体大小 CSS 变量）
// 页面结构由路由决定：/login 显示登录页，其余页面套在 MainLayout 主框架里
import { watchEffect } from 'vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

// watchEffect：依赖的数据（fontSize）一变化就自动重新执行
// 把字号写入 <html> 根元素的 CSS 变量，全站文字立即生效
watchEffect(() => {
  document.documentElement.style.setProperty('--app-font-size', `${userStore.fontSize}px`)
  // 同步 Element Plus 组件库的基础字号，让组件里的文字也一起变化
  document.documentElement.style.setProperty('--el-font-size-base', `${userStore.fontSize}px`)
})
</script>

<template>
  <!-- 路由出口：登录页 / 主框架页都会渲染在这里 -->
  <router-view />
</template>
