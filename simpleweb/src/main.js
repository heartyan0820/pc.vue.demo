import { createApp } from "vue";
import { createPinia } from "pinia";
import elementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(elementPlus, { locale: zhCn });
app.mount("#app");
