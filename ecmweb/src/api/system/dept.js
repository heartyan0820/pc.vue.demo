import request from "@/utils/request";
const DEPT_BASE_URL = "/admin/organizations";
const CUST_BASE_ORGRELATION_URL = "/admin/orgrelation";
const DeptAPI = {
  /**
   * 获取部门列表
   *
   * @param queryParams 查询参数（可选）
   * @returns 部门树形表格数据
   */
  getList(queryParams) {
    return request({
      url: `${DEPT_BASE_URL}`,
      method: "get",
      params: queryParams
    });
  },
  /** 获取登录账号机构分类下拉列表 */
  getCustomers(queryParams) {
    return request({
      url: `${CUST_BASE_ORGRELATION_URL}/getcustomers`,
      method: "get",
      params: queryParams
    });
  },
  /** 获取部门下拉列表 */
  // getOptions() {
  //   return request<any, OptionType[]>({
  //     url: `${DEPT_BASE_URL}/options`,
  //     method: "get",
  //   });
  // },
  /** 获取部门下拉列表 */
  getOptions(queryParams) {
    return request({
      url: `${DEPT_BASE_URL}/options`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取部门表单数据
   *
   * @param id 部门ID
   * @returns 部门表单数据
   */
  getFormData(id) {
    return request({
      url: `${DEPT_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 新增部门
   *
   * @param data 部门表单数据
   * @returns 请求结果
   */
  add(data) {
    return request({
      url: `${DEPT_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 修改部门
   *
   * @param id 部门ID
   * @param data 部门表单数据
   * @returns 请求结果
   */
  update(id, data) {
    return request({
      url: `${DEPT_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 删除部门
   *
   * @param ids 部门ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds(ids) {
    return request({
      url: `${DEPT_BASE_URL}/${ids}`,
      method: "delete"
    });
  }
};
var stdin_default = DeptAPI;
export {
  stdin_default as default
};
