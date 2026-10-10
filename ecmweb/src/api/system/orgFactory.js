import request from "@/utils/request";
const BASE_URL = "/admin/orgFactory";
const OrgFactoryAPI = {
  // 获取查询列表
  getList(queryParams) {
    return request({
      url: `${BASE_URL}/page`,
      method: "GET",
      params: queryParams
    });
  },
  // 通过ID获取表单数据
  getFormData(id) {
    return request({
      url: `${BASE_URL}/${id}`,
      method: "get"
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
  // 通过ID修改
  update(id, data) {
    return request({
      url: `${BASE_URL}/${id}`,
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
  }
};
var stdin_default = OrgFactoryAPI;
export {
  stdin_default as default
};
