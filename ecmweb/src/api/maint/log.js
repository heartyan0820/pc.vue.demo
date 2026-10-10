import request from "@/utils/request";
const LOG_BASE_URL = "/file/operationlogs";
const LOGIN_LOG_BASE_URL = "/file/loginlogs";
const LogAPI = {
  /**
   * 获取操作日志分页列表
   *
   * @param queryParams 查询参数
   */
  getOperationLogPage(queryParams) {
    return request({
      url: `${LOG_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取登录日志分页列表
   *
   * @param queryParams 查询参数
   */
  getLoginLogPage(queryParams) {
    return request({
      url: `${LOGIN_LOG_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取访问趋势
   *
   * @param queryParams
   * @returns
   */
  getVisitTrend(queryParams) {
    return request({
      url: `${LOG_BASE_URL}/visittrend`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取访问统计
   *
   * @param queryParams
   * @returns
   */
  getVisitStats() {
    return request({
      url: `${LOG_BASE_URL}/visitstats`,
      method: "get"
    });
  }
};
var stdin_default = LogAPI;
export {
  stdin_default as default
};
