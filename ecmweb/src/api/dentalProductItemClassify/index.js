import request from "@/utils/request";
const CUST_BASE_URL = "/admin/piclassify";
const ClassAPI = {
  /**
   * 获取导航列表
   *
   * @param queryParams 查询参数
   */
  getList(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/options`,
      method: "get",
      params: queryParams
    });
  },
  /**获取下一级分类 */
  getNextList(id) {
    return request({
      url: `${CUST_BASE_URL}/${id}`,
      method: "get"
    });
  }
};
var stdin_default = ClassAPI;
export {
  stdin_default as default
};
