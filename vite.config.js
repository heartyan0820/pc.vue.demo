import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Relative assets work in Tauri's bundled WebView and GitHub Pages subpaths.
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
