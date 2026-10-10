import { store } from "@/store";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useDictStoreHook } from "@/store/modules/dict";
import AuthAPI from "@/api/auth";
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearToken,
  setRememberedUser,
  clearRememberedUser
} from "@/utils/auth";
const useUserStore = defineStore("user", () => {
  const userInfo = useStorage("userInfo", {});
  function login(LoginFormData) {
    return new Promise((resolve, reject) => {
      AuthAPI.login(LoginFormData).then((data) => {
        const { token, refreshToken: refreshToken2 } = data;
        setAccessToken(token);
        setRefreshToken(refreshToken2);
        if (LoginFormData.ischeck) {
          const json = JSON.stringify({
            username: LoginFormData.account,
            password: LoginFormData.password
          });
          setRememberedUser(json);
        } else {
          clearRememberedUser();
        }
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }
  function getUserInfo() {
    return new Promise((resolve, reject) => {
      AuthAPI.getInfo().then((data) => {
        if (!data) {
          reject("Verification failed, please Login again.");
          return;
        }
        Object.assign(userInfo.value, { ...data });
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  function logout() {
    return new Promise((resolve, reject) => {
      AuthAPI.logout().then(() => {
        clearUserData();
        setAccessToken("");
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }
  function refreshToken() {
    const refreshToken2 = getRefreshToken();
    return new Promise((resolve, reject) => {
      AuthAPI.refreshToken(refreshToken2).then((data) => {
        const { token, refreshToken: refreshToken3 } = data;
        setAccessToken(token);
        setRefreshToken(refreshToken3);
        resolve();
      }).catch((error) => {
        console.log(" refreshToken  刷新失败", error);
        reject(error);
      });
    });
  }
  function clearUserData() {
    return new Promise((resolve) => {
      clearToken();
      usePermissionStoreHook().resetRouter();
      useDictStoreHook().clearDictionaryCache();
      userInfo.value = {};
      resolve();
    });
  }
  return {
    userInfo,
    getUserInfo,
    login,
    logout,
    clearUserData,
    refreshToken
  };
});
function useUserStoreHook() {
  return useUserStore(store);
}
export {
  useUserStore,
  useUserStoreHook
};
