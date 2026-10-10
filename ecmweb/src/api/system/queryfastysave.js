import request from "@/utils/request";
const ROLE_BASE_URL = "/admin/queryfastysave";
const ROLE_BASE_URLS = "/admin/query";
const QueryAPI = {
  /** 获取自定义查询配置表分页数据 */
  getPage(queryParams) {
    return request({
      url: `${ROLE_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取自定义查询配置表的菜单ID集合
   *
   * @param Id 自定义查询配置表ID
   * @returns 自定义查询配置表的菜单ID集合
   */
  getRoleMenuIds(Id) {
    return request({
      url: `${ROLE_BASE_URL}/${Id}/menuids`,
      method: "get"
    });
  },
  /**
   * 获取自定义查询配置表表单数据
   *
   * @param id 自定义查询配置表ID
   * @returns 自定义查询配置表表单数据
   */
  getFormData(id) {
    return request({
      url: `${ROLE_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 获取自定义查询配置表表单数据
   *
   * @param module 模块
   */
  getFieldFormData(module) {
    return request({
      url: `${ROLE_BASE_URL}/getmodulefields`,
      method: "get",
      params: { module }
    });
  },
  /** 添加自定义查询配置表 */
  add(data) {
    return request({
      url: `${ROLE_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 更新自定义查询配置表
   *
   * @param id 自定义查询配置表ID
   * @param data 自定义查询配置表表单数据
   */
  update(id, data) {
    return request({
      url: `${ROLE_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  getModuleData(data) {
    return request({
      url: `${ROLE_BASE_URLS}/getmodule`,
      method: "post",
      data
    });
  },
  /**
   * 批量删除字段，多个以英文逗号(,)分割
   *
   * @param ids 自定义查询配置表ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids) {
    return request({
      url: `${ROLE_BASE_URL}/${ids}`,
      method: "delete"
    });
  }
};
var stdin_default = QueryAPI;
export {
  stdin_default as default
};
