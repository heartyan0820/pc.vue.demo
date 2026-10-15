import { defineStore } from "pinia";
import { ref } from "vue";
import md5 from "js-md5";
import request from "../utils/request";

export const useUserStore = defineStore("user", () => {
  const token = ref(localStorage.getItem("token") || "");
  const refreshToken = ref(localStorage.getItem("refreshToken") || "");
  const userInfo = ref(JSON.parse(localStorage.getItem("userInfo") || "null"));

  async function login(form) {
    const account = form.account || form.username;
    const data = await request.post(
      "/auth/session",
      {
        account,
        password: md5(form.password),
        captchaKey: form.captchaKey || "",
        captchaCode: form.captchaCode || "",
        mobile: form.mobile || "",
        platform: "web",
        ischeck: false,
      },
      { headers: { Authorization: "no-auth" } },
    );

    if (!data?.token) {
      throw new Error("登录接口未返回 token");
    }

    token.value = data.token;
    refreshToken.value = data.refreshToken || "";
    localStorage.setItem("token", token.value);
    localStorage.setItem("refreshToken", refreshToken.value);

    try {
      const profile = await request.get("/auth/session/userinfo");
      userInfo.value = {
        ...profile,
        name: profile.name || profile.userName || profile.username || account,
        role: profile.members[0]?.orgRoleName,
      };
    } catch (error) {
      token.value = "";
      refreshToken.value = "";
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      throw error;
    }

    localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
  }

  async function logout() {
    token.value = "";
    refreshToken.value = "";
    userInfo.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
  }

  return { token, refreshToken, userInfo, login, logout };
});
