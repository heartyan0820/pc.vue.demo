import request from "@/utils/request";
const CUST_BASE_URL = "/admin/menus";
const CUST_BASE_URLS = "/admin/order";
const CUST_BASE_DOCTOR_URL = "/admin/orgmember";
const CUST_BASE_ORGRELATION_URL = "/admin/orgrelation";
const OrderAPI = {
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
  getMenusList(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/routers`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 保存订单
   *
   * @param queryParams 查询参数
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
  /**获取医生数据 */
  getDoctorData(queryParams) {
    return request({
      url: `${CUST_BASE_DOCTOR_URL}/option/customers`,
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
  /**获取默认项目加工厂数据 */
  getDefaultFactory(queryParams) {
    return request({
      url: `${CUST_BASE_ORGRELATION_URL}/pitemfactory`,
      method: "get",
      params: queryParams
    });
  },
  /**获取机构成员 */
  getData(queryParams) {
    return request({
      url: `${CUST_BASE_DOCTOR_URL}/info`,
      method: "get",
      params: queryParams
    });
  },
  /**获取机构成员 */
  updateInfo(id, data) {
    return request({
      url: `${CUST_BASE_DOCTOR_URL}/${id}`,
      method: "put",
      data
    });
  },
  CalculateTooth(data) {
    return request({
      url: `${CUST_BASE_URLS}/calculatetooth`,
      method: "post",
      data
    });
  },
  checkRepeatTooth(data) {
    return request({
      url: `${CUST_BASE_URLS}/checkrepeat`,
      method: "post",
      data
    });
  },
  delFile(data) {
    return request({
      url: `${CUST_BASE_URLS}/delfile`,
      method: "put",
      data
    });
  },
  /**获取加工厂数据
   * /api/admin/order/getstate/{orderId}/{omId}
   *
   */
  getOrderState(queryParams) {
    return request({
      url: `${CUST_BASE_URLS}/getstate/${queryParams.orderId}/0`,
      method: "get"
    });
  },
  /**
   * 创建返工订单
   *
   * @param data 查询参数
   */
  createFanGongOrder(data) {
    return request({
      url: `${CUST_BASE_URLS}/createdrework`,
      method: "post",
      data
    });
  },
  /**
   * 创建试回单
   *
   * @param data 查询参数
   */
  createShiHuiOrder(data) {
    return request({
      url: `${CUST_BASE_URLS}/createdtestback`,
      method: "post",
      data
    });
  },
  /**
   * 获取加工厂医疗机构信息
   *
   * @param queryParams 查询参数
   */
  getTips(queryParams) {
    return request({
      url: `${CUST_BASE_URLS}/org/tips`,
      method: "get",
      params: queryParams
    });
  }
};
var stdin_default = OrderAPI;
export {
  stdin_default as default
};
