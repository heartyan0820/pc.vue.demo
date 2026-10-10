import request from "@/utils/request";
const CUST_BASE_URL = "/admin/order";
const OrdersAPI = {
  /**
   * 获取列表
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
  getPage(data) {
    return request({
      url: `${CUST_BASE_URL}/querypage`,
      method: "post",
      data
    });
  },
  getStatePage(data) {
    return request({
      url: `${CUST_BASE_URL}/querystatepage`,
      method: "post",
      data
    });
  },
  getFilePage(data) {
    return request({
      url: `${CUST_BASE_URL}/queryfilepage`,
      method: "post",
      data
    });
  },
  getOrder(queryParams) {
    return request({
      url: `${CUST_BASE_URL}`,
      method: "get",
      params: queryParams
    });
  },
  getOrderList(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/getorderstat`,
      method: "post",
      data: queryParams
    });
  },
  getOrderLists(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/getorderstatlist`,
      method: "post",
      data: queryParams
    });
  },
  getdetail(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/getdetail`,
      method: "get",
      params: queryParams
    });
  },
  getStateOrder(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/getstateorder`,
      method: "get",
      params: queryParams
    });
  }
};
var stdin_default = OrdersAPI;
export {
  stdin_default as default
};
