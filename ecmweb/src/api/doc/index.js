import request from "@/utils/request";
const AUTH_BASE_URL = "admin/information";
const DocAPI = {
  /**
   * 获取doc文档
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  getDocData(id) {
    return request({
      url: `${AUTH_BASE_URL}/getbydoc`,
      method: "get",
      params: { id }
    });
  },
  getNoticeData(queryParams) {
    return request({
      url: `${AUTH_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  }
};
var stdin_default = DocAPI;
export {
  stdin_default as default
};
