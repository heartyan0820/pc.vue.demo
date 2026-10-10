import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import UnoCSS from "unocss/vite";
import { resolve } from "node:path";
import commonjs from "vite-plugin-commonjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
);
const __APP_INFO__ = {
  pkg: {
    name: pkg.name,
    version: pkg.version,
    engines: pkg.engines,
    dependencies: pkg.dependencies,
    devDependencies: pkg.devDependencies,
  },
  buildTimestamp: Date.now(),
};

const pathSrc = resolve(__dirname, "src");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "./",
    resolve: {
      alias: {
        "@": pathSrc,
        vue: "vue/dist/vue.esm-bundler.js",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5174,
      strictPort: true,
      open: false,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          target: env.VITE_APP_API_URL,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
        },
      },
    },
    plugins: [
      vue(),
      env.VITE_MOCK_DEV_SERVER === "true" ? mockDevServerPlugin() : null,
      UnoCSS({ hmrTopLevelAwait: false }),
      AutoImport({
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        vueTemplate: true,
        dts: false,
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dirs: ["src/components", "src/**/components"],
        dts: false,
      }),
      commonjs(),
    ],
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "element-plus",
        "element-plus/es",
        "element-plus/es/components/base/style/css",
        "pinia",
        "axios",
        "@vueuse/core",
        "sortablejs",
        "exceljs",
        "path-to-regexp",
        "echarts/core",
        "echarts/renderers",
        "echarts/charts",
        "echarts/components",
        "vue-i18n",
        "nprogress",
        "qs",
        "path-browserify",
        "@element-plus/icons-vue",
        "element-plus/es/locale/lang/zh-cn",
        "element-plus/es/locale/lang/en",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/rate/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/notification/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/statistic/style/css",
        "element-plus/es/components/watermark/style/css",
        "element-plus/es/components/config-provider/style/css",
        "element-plus/es/components/text/style/css",
        "element-plus/es/components/drawer/style/css",
        "element-plus/es/components/color-picker/style/css",
        "element-plus/es/components/backtop/style/css",
        "element-plus/es/components/message-box/style/css",
        "element-plus/es/components/skeleton/style/css",
        "element-plus/es/components/skeleton-item/style/css",
        "element-plus/es/components/badge/style/css",
        "element-plus/es/components/steps/style/css",
        "element-plus/es/components/step/style/css",
        "element-plus/es/components/avatar/style/css",
        "element-plus/es/components/descriptions/style/css",
        "element-plus/es/components/descriptions-item/style/css",
        "element-plus/es/components/progress/style/css",
        "element-plus/es/components/image-viewer/style/css",
        "element-plus/es/components/empty/style/css",
        "element-plus/es/components/message/style/css",
        "element-plus/es/components/timeline/style/css",
        "element-plus/es/components/timeline-item/style/css",
      ],
    },
    build: {
      chunkSizeWarningLimit: 2000,
      minify: "terser",
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true,
        },
        format: { comments: false },
      },
      rollupOptions: {
        output: {
          entryFileNames: "js/[name].[hash].js",
          chunkFileNames: "js/[name].[hash].js",
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
            )
              extType = "media";
            else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name))
              extType = "img";
            else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name))
              extType = "fonts";
            return `${extType}/[name].[hash].[ext]`;
          },
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  };
});
