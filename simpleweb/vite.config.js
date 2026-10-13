import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      "@assets": fileURLToPath(new URL("../assets", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  publicDir: "../public",
  base: command === "build" ? "/pc.vue.demo/" : "/",
  server: {
    host: "0.0.0.0",
    port: 5176,
    strictPort: true,
  },
}));
