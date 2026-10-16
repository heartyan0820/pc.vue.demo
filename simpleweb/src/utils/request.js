import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

let redirectingToLogin = false;

request.interceptors.request.use((config) => {
  if (config.headers.Authorization === "no-auth") {
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // const status = err.response?.status;
    // const isLoginRequest =
    //   err.config?.method?.toLowerCase() === "post" &&
    //   /\/auth\/session\/?$/.test(err.config?.url || "");

    // if (status === 401 && !isLoginRequest) {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("refreshToken");
    //   localStorage.removeItem("userInfo");

    //   if (!redirectingToLogin && router.currentRoute.value.name !== "login") {
    //     redirectingToLogin = true;
    //     ElMessage.warning("登录已过期，请重新登录");
    //     router.replace({ name: "login" }).finally(() => {
    //       redirectingToLogin = false;
    //     });
    //   }

    //   return Promise.reject(err);
    // }

    const message =
      err.response?.data?.detail || err.response?.data?.message || err.message;
    ElMessage.error(message || "请求失败");
    return Promise.reject(err);
  },
);

export default request;
