import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

let redirectingToLogin = false;

function isLoginRequest(config) {
  return (
    config?.method?.toLowerCase() === "post" &&
    /\/auth\/session\/?$/.test(config?.url || "")
  );
}

function isUnauthorized(status, data) {
  return (
    Number(status) === 401 ||
    Number(data?.code) === 401 ||
    Number(data?.status) === 401
  );
}

function redirectToLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userInfo");

  if (redirectingToLogin || router.currentRoute.value.name === "login") return;

  redirectingToLogin = true;
  ElMessage.warning("登录已过期，请重新登录");
  router
    .replace({ name: "login" })
    .catch(() => {
      window.location.hash = "#/login";
    })
    .finally(() => {
      redirectingToLogin = false;
    });
}

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
  (res) => {
    if (isUnauthorized(res.status, res.data) && !isLoginRequest(res.config)) {
      redirectToLogin();
      return Promise.reject(new Error("登录已过期"));
    }
    return res.data;
  },
  (err) => {
    if (
      isUnauthorized(err.response?.status, err.response?.data) &&
      !isLoginRequest(err.config)
    ) {
      redirectToLogin();
      return Promise.reject(err);
    }

    const message =
      err.response?.data?.detail || err.response?.data?.message || err.message;
    ElMessage.error(message || "请求失败");
    return Promise.reject(err);
  },
);

export default request;
