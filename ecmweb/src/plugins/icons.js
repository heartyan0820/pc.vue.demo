import * as ElementPlusIconsVue from "@element-plus/icons-vue";
function setupElIcons(app) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
export {
  setupElIcons
};
