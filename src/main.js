// 项目入口文件：负责"装配"整个应用
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // Element Plus 全局样式（必须引入，否则组件没有样式）
import zhCn from 'element-plus/es/locale/lang/zh-cn' // Element Plus 中文语言包
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 官方图标库
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia()) // Pinia：全局状态管理（用户信息、订单数据都放在这里）
app.use(router) // Vue Router：页面路由（个人中心 / 订单管理之间的切换）
app.use(ElementPlus, { locale: zhCn }) // Element Plus：UI 组件库

// 把所有图标注册成全局组件，模板里可以直接写 <el-icon><Tickets /></el-icon>
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}

app.mount('#app')
