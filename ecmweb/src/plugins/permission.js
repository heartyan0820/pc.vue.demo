import NProgress from "@/utils/nprogress";
import { getAccessToken } from "@/utils/auth";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";
import { isMobile, isWeChatPC } from "@/utils/device";
function setupPermission() {
  const whiteList = [
    "/login",
    "/index",
    "/about",
    "/404",
    "/contact",
    "/softwarecenter",
    "/ecmshop",
    "/help",
    "/test",
    "/print",
    "/operating",
    "/installmanual",
    "/factoryend",
    "/designend",
    "/v",
    "/doc",
    "/wpfxd",
    "/wpfup",
  ];
  router.beforeEach(async (to, from, next) => {
    const isMobileDevice = isMobile();
    const isWeChatPCD = isWeChatPC();
    if (isMobileDevice && isWeChatPCD == false) {
      // window.location.href = "https://h5.epdent.cn/";
      // return;
    }
    NProgress.start();
    const isLogin = !!getAccessToken();
    const title = to.meta.title || "易齿盟";
    if (title) {
      document.title = title;
    }
    if (isLogin) {
      if (to.path === "/login") {
        next({ path: "/" });
      } else if (to.path === "/logins") {
        next();
      } else {
        const permissionStore = usePermissionStore();
        if (permissionStore.isRoutesLoaded) {
          if (to.matched.length === 0) {
            next("/404");
          } else {
            next();
          }
        } else {
          try {
            const user = useUserStore().userInfo;
            if (user.members.length > 1) {
              router.push(`/logins?redirect=${to.fullPath}`);
            } else {
              const dynamicRoutes = await permissionStore.generateRoutes();
              dynamicRoutes.forEach((route) => router.addRoute(route));
              next({ ...to, replace: true });
            }
          } catch (error) {
            console.error(error);
            await useUserStore().clearUserData();
            redirectToLogin(to, next);
            NProgress.done();
          }
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        const permissionStore = usePermissionStore();
        if (permissionStore.isRoutesLoaded == false) {
          if (to.matched.length === 0) {
            next("/404");
          } else {
            const title2 = to.params.title || to.query.title;
            if (title2) {
              to.meta.title = title2;
            }
            next();
          }
        } else {
          next();
        }
      } else {
        redirectToLogin(to, next);
        NProgress.done();
      }
    }
  });
  router.afterEach(() => {
    NProgress.done();
  });
}
function redirectToLogin(to, next) {
  const params = new URLSearchParams(to.query);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/login?redirect=${encodeURIComponent(redirect)}`);
}
function hasAuth(value, type = "button") {
  const { roles, perms } = useUserStore().userInfo;
  if (type === "button" && roles.includes("ROOT")) {
    return true;
  }
  const auths = type === "button" ? perms : roles;
  return typeof value === "string"
    ? auths.includes(value)
    : value.some((perm) => auths.includes(perm));
}
export { hasAuth, setupPermission };
