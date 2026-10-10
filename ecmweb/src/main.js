import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";
import { ElLoading } from "element-plus";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import "animate.css";
import "@/styles/element-global.css";
import "default-passive-events";
const app = createApp(App);
app.use(setupPlugins);
app.use(Viewer);
app.use(ElLoading);
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine);
  }
});
app.mount("#app");
