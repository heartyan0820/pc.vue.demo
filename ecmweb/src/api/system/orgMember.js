import request from "@/utils/request";
const ORGMEMBER_BASE_URL = "/admin/orgmember";
const OrgMemberAPI = {
  getList(queryParams) {
    return request({
      url: `${ORGMEMBER_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /** 取某机构下的角色人员列表，比如取医生、业务员 */
  getMems(orgId, orgRoleCode) {
    return request({
      url: `${ORGMEMBER_BASE_URL}/listbycode`,
      method: "get",
      params: { orgId, orgRoleCode }
    });
  },
  /** 获取机构分类下拉列表 */
  getOptions() {
    return request({
      url: `${ORGMEMBER_BASE_URL}/options`,
      method: "get"
    });
  },
  /**
   * 获取机构分类表单数据
   *
   * @param id 部门ID
   * @returns 部门表单数据
   */
  getFormData(id) {
    return request({
      url: `${ORGMEMBER_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 新增机构分类
   *
   * @param data 机构分类表单数据
   * @returns 请求结果
   */
  add(data) {
    return request({
      url: `${ORGMEMBER_BASE_URL}`,
      method: "post",
      data
    });
  },
  cancel(id) {
    return request({
      url: `${ORGMEMBER_BASE_URL}/cancel/${id}`,
      method: "post"
    });
  },
  /**
   * 修改部门
   *
   * @param id 机构分类ID
   * @param data 机构分类表单数据
   * @returns 请求结果
   */
  update(id, data) {
    return request({
      url: `${ORGMEMBER_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  addAccountById(id) {
    return request({
      url: `${ORGMEMBER_BASE_URL}/account/${id}`,
      method: "post"
    });
  },
  /**
   * 删除部门
   *
   * @param ids 机构分类ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds(ids) {
    return request({
      url: `${ORGMEMBER_BASE_URL}/${ids}`,
      method: "delete"
    });
  },
  getOrderNumber() {
    return request({
      url: `${ORGMEMBER_BASE_URL}/getuserlist`,
      method: "get"
    });
  }
};
var stdin_default = OrgMemberAPI;
export {
  stdin_default as default
};
