import request from "@/utils/request";
const CUST_BASE_URL = "/cust/customers";
const CustAPI = {
  /**
   * 添加客户
   *
   * @param data 用户表单数据
   */
  add(data) {
    return request({
      url: `${CUST_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 添加客户
   *
   * @param data 用户表单数据
   */
  update(id, data) {
    return request({
      url: `${CUST_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 充值
   *
   * @param id 用户ID
   * @param balance 金额
   */
  recharge(id, balance) {
    return request({
      url: `${CUST_BASE_URL}/${id}/balance`,
      method: "patch",
      params: { balance }
    });
  },
  /**
   * 批量删除客户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids) {
    return request({
      url: `${CUST_BASE_URL}/${ids}`,
      method: "delete"
    });
  },
  /**
   * 获取客户分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取客户充值分页列表
   *
   * @param queryParams 查询参数
   */
  getTransactionLogsPage(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/page/transactionlogs`,
      method: "get",
      params: queryParams
    });
  }
};
var stdin_default = CustAPI;
export {
  stdin_default as default
};
