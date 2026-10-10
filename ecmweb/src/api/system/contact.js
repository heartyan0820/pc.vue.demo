import request from "@/utils/request";
const CONFIG_BASE_URL = "/admin/contactmessage";
const ContactAPI = {
  /** 获取分页数据 */
  getPage() {
    return request({
      url: `${CONFIG_BASE_URL}/tabpage`,
      method: "get"
    });
  },
  /**
   * 添加
   *
   * @param data 表单数据
   * @returns 请求结果
   */
  add(data) {
    return request({
      url: `${CONFIG_BASE_URL}/createcontactmess`,
      method: "post",
      data
    });
  }
};
var stdin_default = ContactAPI;
export {
  stdin_default as default
};
