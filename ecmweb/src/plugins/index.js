import { setupDirective } from "@/directive";
import { setupI18n } from "@/lang";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";
import { setupElIcons } from "./icons";
import { setupPermission } from "./permission";
import { InstallCodeMirror } from "codemirror-editor-vue3";
var stdin_default = {
  install(app) {
    setupDirective(app);
    setupRouter(app);
    setupStore(app);
    setupI18n(app);
    setupElIcons(app);
    setupPermission();
    app.use(InstallCodeMirror);
  }
};
export {
  stdin_default as default
};
