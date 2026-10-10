import { createPinia } from "pinia";
const store = createPinia();
function setupStore(app) {
  app.use(store);
}
export * from "./modules/app";
export * from "./modules/permission";
export * from "./modules/settings";
export * from "./modules/tags-view";
export * from "./modules/user";
export * from "./modules/dict";
export * from "./modules/chat";
export * from "./modules/chat";
export * from "./modules/websocket";
export {
  setupStore,
  store
};
