import axios from "axios";
import qs from "qs";
import { getAccessToken } from "@/utils/auth";
import router from "@/router";
import { useUserStoreHook } from "@/store/modules/user";
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 6e4,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params)
});
service.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (config.headers.Authorization !== "no-auth" && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
service.interceptors.response.use(
  (response) => {
    if (response.config.responseType === "blob") {
      return response;
    }
    return response.data;
  },
  async (error) => {
    const { response } = error;
    if (response) {
      const { status, data } = response;
      let msg = "";
      if (data && data.title && data.detail) {
        msg = `【${status}】${data.detail}`;
      }
      if (status !== 401) {
        ElNotification({
          title: "Error",
          message: `${msg ? msg : error.message || "系统出错"}`,
          type: "error",
          duration: 3e3,
          customClass: "center-notification"
        });
      }
      if (status === 401) {
        const backtoUrl = encodeURIComponent(router.currentRoute.value.fullPath);
        useUserStoreHook().clearUserData().then(() => {
          router.push(`/login?redirect=${backtoUrl}`);
        });
      }
    }
    return Promise.reject(error.message);
  }
);
var stdin_default = service;
export {
  stdin_default as default
};
