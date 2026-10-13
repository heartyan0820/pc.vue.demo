import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  publicDir: "../public",
  base: command === "build" ? "/pc.vue.demo/" : "/",
  server: {
    host: "0.0.0.0",
    port: 5176,
    strictPort: true,
  },
}));
