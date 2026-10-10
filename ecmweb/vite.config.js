import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 相对路径资源：Tauri WebView 和 GitHub Pages 子路径下都能正确加载
  base: "./",
  server: {
    host: "0.0.0.0",
    // 与 app1 (5173) 错开，避免同时跑两个 dev 互相冲突
    port: 5174,
    strictPort: true,
  },
});
