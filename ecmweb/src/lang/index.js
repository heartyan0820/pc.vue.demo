import { createI18n } from "vue-i18n";
import { useAppStoreHook } from "@/store/modules/app";
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";
const appStore = useAppStoreHook();
const messages = {
  "zh-cn": {
    ...zhCnLocale
  },
  en: {
    ...enLocale
  }
};
const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages,
  globalInjection: true
});
function setupI18n(app) {
  app.use(i18n);
}
var stdin_default = i18n;
export {
  stdin_default as default,
  setupI18n
};
