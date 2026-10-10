import request from "@/utils/request";
const CUST_BASE_URL = "/admin/pc";
const PcAPI = {
  /**
   * 获取导航列表
   *
   * @param queryParams 查询参数
   */
  getList(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/source`,
      method: "get",
      params: queryParams
    });
  },
  getNoList(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/nosource`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取分类列表
   *
   * @param queryParams 查询参数
   */
  getClass(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/getclass`,
      method: "get",
      params: queryParams
    });
  }
};
var stdin_default = PcAPI;
export {
  stdin_default as default
};
