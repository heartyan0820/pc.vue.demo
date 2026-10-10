import request from "@/utils/request";
const CUST_BASE_URL = "/admin/orgOperation";
const OrderOrgAPI = {
  getPage(data) {
    return request({
      url: `${CUST_BASE_URL}/page`,
      method: "get",
      params: data
    });
  }
};
var stdin_default = OrderOrgAPI;
export {
  stdin_default as default
};
