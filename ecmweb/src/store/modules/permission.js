import { constantRoutes } from "@/router";
import { store } from "@/store";
import router from "@/router";
const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");
const usePermissionStore = defineStore("permission", () => {
  const routes = ref([]);
  const mixedLayoutLeftRoutes = ref([]);
  const isRoutesLoaded = ref(false);
  function generateRoutes() {
    return new Promise((resolve, reject) => {
      const dynamicRoutes = parseDynamicRoutes([]);
      routes.value = [...constantRoutes, ...dynamicRoutes];
      isRoutesLoaded.value = true;
      resolve(dynamicRoutes);
    });
  }
  const setMixedLayoutLeftRoutes = (parentPath) => {
    const matchedItem = routes.value.find((item) => item.path === parentPath);
    if (matchedItem && matchedItem.children) {
      mixedLayoutLeftRoutes.value = matchedItem.children;
    }
  };
  const resetRouter = () => {
    routes.value.forEach((route) => {
      if (route.name && !constantRoutes.find((r) => r.name === route.name)) {
        router.removeRoute(route.name);
      }
    });
    routes.value = [];
    mixedLayoutLeftRoutes.value = [];
    isRoutesLoaded.value = false;
  };
  return {
    routes,
    mixedLayoutLeftRoutes,
    isRoutesLoaded,
    generateRoutes,
    setMixedLayoutLeftRoutes,
    resetRouter
  };
});
const parseDynamicRoutes = (rawRoutes) => {
  const parsedRoutes = [];
  rawRoutes.forEach((route) => {
    const normalizedRoute = { ...route };
    normalizedRoute.component = normalizedRoute.component?.toString() === "Layout" ? Layout : modules[`../../views/${normalizedRoute.component}.vue`] || modules["../../views/error-page/404.vue"];
    if (normalizedRoute.children) {
      normalizedRoute.children = parseDynamicRoutes(route.children);
    }
    parsedRoutes.push(normalizedRoute);
  });
  return parsedRoutes;
};
function usePermissionStoreHook() {
  return usePermissionStore(store);
}
export {
  usePermissionStore,
  usePermissionStoreHook
};
