import request from "@/utils/request";
const CUST_BASE_URLS = "/admin/orgCustomer";
const CUST_BASE_ORGRELATION_URL = "/admin/orgrelation";
const OrgCustomerAPI = {
  /**
   * 保存订单
   *
   */
  saveOrder(data) {
    return request({
      url: `${CUST_BASE_URLS}`,
      method: "put",
      data
    });
  },
  /**添加文件 */
  addFile(data) {
    return request({
      url: `${CUST_BASE_URLS}/addfile`,
      method: "put",
      data
    });
  },
  /**获取机构数据 */
  getOrganData(queryParams) {
    return request({
      url: `${CUST_BASE_ORGRELATION_URL}/customers`,
      method: "get",
      params: queryParams
    });
  },
  /**获取加工厂数据 */
  getProcessingData(queryParams) {
    return request({
      url: `${CUST_BASE_ORGRELATION_URL}/factories`,
      method: "get",
      params: queryParams
    });
  },
  AddOrgCustomer(data) {
    return request({
      url: `${CUST_BASE_URLS}`,
      method: "post",
      data
    });
  },
  getOrgCustomer(id) {
    return request({
      url: `${CUST_BASE_URLS}/${id}`,
      method: "get"
    });
  }
};
var stdin_default = OrgCustomerAPI;
export {
  stdin_default as default
};
