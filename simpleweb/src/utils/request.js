import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

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
    const message =
      err.response?.data?.detail || err.response?.data?.message || err.message;
    ElMessage.error(message || "请求失败");
    return Promise.reject(err);
  },
);

export default request;
