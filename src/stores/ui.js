// UI 状态 store：存放"全局界面"相关的状态，目前只有"是否是窄屏（手机）"
import { ref } from 'vue'
import { defineStore } from 'pinia'

// 判断当前是否为窄屏（小于 768px 视为手机/窄屏）
function check() {
  return window.innerWidth < 768
}

export const useUiStore = defineStore('ui', () => {
  const isMobile = ref(check())

  // 侧边栏是否折叠（窄屏时用的是横向菜单，折叠只对宽屏有意义）
  const isCollapsed = ref(false)

  // 窗口大小变化时自动更新（store 是全局单例，这个监听器全站只需注册一次）
  window.addEventListener('resize', () => {
    isMobile.value = check()
  })

  // 切换侧边栏折叠/展开
  function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value
  }

  return { isMobile, isCollapsed, toggleCollapse }
})
