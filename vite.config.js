import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 部署到 GitHub Pages 时，站点不在域名根路径，而在 用户名.github.io/仓库名/ 下
  // base 决定所有静态资源（JS/CSS/图片）的前缀，必须和仓库名对齐，否则会 404
  base: '/pc.vue.demo/',
})
