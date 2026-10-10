import request from "@/utils/request";
const BASE_URL = "/admin/OrgRelation";
const OrgRelationAPI = {
  // 获取查询列表
  getList(queryParams) {
    return request({
      url: `${BASE_URL}/list`,
      method: "GET",
      params: queryParams
    });
  },
  // 获取查询列表
  getPage(queryParams) {
    return request({
      url: `${BASE_URL}/page`,
      method: "GET",
      params: queryParams
    });
  },
  /** 获取相关部门下拉列表 */
  getOptions(queryParams) {
    return request({
      url: `${BASE_URL}/orgs`,
      method: "get",
      params: queryParams
    });
  },
  // 新增
  add(data) {
    return request({
      url: `${BASE_URL}`,
      method: "post",
      data
    });
  },
  // 修改
  update(data) {
    return request({
      url: `${BASE_URL}/update`,
      method: "put",
      data
    });
  },
  // 通过ID删除
  deleteByIds(ids) {
    return request({
      url: `${BASE_URL}/${ids}`,
      method: "delete"
    });
  },
  // 通过ID获取表单数据
  getFormData(id) {
    return request({
      url: `${BASE_URL}/${id}`,
      method: "get"
    });
  }
};
var stdin_default = OrgRelationAPI;
export {
  stdin_default as default
};
