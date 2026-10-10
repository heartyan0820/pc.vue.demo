import request from "@/utils/request";
const AUTH_BASE_URL = "/auth/session";
const AUTH_BASE_URLS = "/admin/code";
const AuthAPI = {
  /** 登录接口*/
  login(data) {
    return request({
      url: `${AUTH_BASE_URL}`,
      method: "post",
      data
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
  },
  /** 刷新 token 接口*/
  refreshToken(refreshToken) {
    return request({
      url: `${AUTH_BASE_URL}`,
      method: "put",
      params: { refreshToken },
      headers: {
        Authorization: "no-auth"
      }
    });
  },
  /** 注销登录接口 */
  logout() {
    return request({
      url: `${AUTH_BASE_URL}`,
      method: "delete"
    });
  },
  /** 获取验证码接口*/
  getCaptcha() {
    return request({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get"
    });
  },
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  getInfo() {
    return request({
      url: `${AUTH_BASE_URL}/userinfo`,
      method: "get"
    });
  },
  /** 获取个人中心用户信息 */
  getProfile() {
    return request({
      url: `${AUTH_BASE_URL}/profile`,
      method: "get"
    });
  },
  /** 修改个人中心用户信息 */
  updateProfile(data) {
    return request({
      url: `${AUTH_BASE_URL}/profile`,
      method: "patch",
      data
    });
  },
  /** 修改个人中心用户密码 */
  changePassword(data) {
    return request({
      url: `${AUTH_BASE_URL}/password`,
      method: "patch",
      data
    });
  },
  /** 忘记密码重置用户密码 */
  forgetPassword(data) {
    return request({
      url: `${AUTH_BASE_URL}/forgetpassword`,
      method: "patch",
      data
    });
  },
  /** 发送短信验证码（绑定或更换手机号）*/
  sendMobileCode(email) {
    return request({
      url: `${AUTH_BASE_URLS}/sendemobilecode`,
      method: "post",
      data: email
    });
  },
  /** 发送短信验证码（验证码登录）*/
  createcode(email) {
    return request({
      url: `${AUTH_BASE_URLS}/createcode`,
      method: "post",
      data: email
    });
  },
  /** 绑定或更换手机号 */
  bindOrChangeMobile(data) {
    return request({
      url: `${AUTH_BASE_URL}/mobile`,
      method: "get",
      params: data
    });
  },
  /** 发送邮箱验证码（绑定或更换邮箱）*/
  sendEmailCode(email) {
    return request({
      url: `${AUTH_BASE_URLS}/sendemail`,
      method: "post",
      data: email
    });
  },
  /** 绑定或更换邮箱 */
  bindOrChangeEmail(data) {
    return request({
      url: `${AUTH_BASE_URL}/email`,
      method: "get",
      params: data
    });
  }
};
var stdin_default = AuthAPI;
export {
  stdin_default as default
};
