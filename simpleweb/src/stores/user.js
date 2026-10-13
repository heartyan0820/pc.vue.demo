import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const token = ref(localStorage.getItem("token") || "");
  const userInfo = ref(JSON.parse(localStorage.getItem("userInfo") || "null"));

  async function login(form) {
    // const { data } = await request.post('/api/login', form)
    token.value = form.token;
    userInfo.value = { name: form.username, role: "管理员" };
    localStorage.setItem("token", token.value);
    localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
  }

  async function logout() {
    token.value = "";
    userInfo.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  }

  return { token, userInfo, login, logout };
});
