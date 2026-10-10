import request from "@/utils/request";
const CONFIG_BASE_URL = "/admin/sysconfigs";
const ConfigAPI = {
  /** 获取系统配置分页数据 */
  getPage(queryParams) {
    return request({
      url: `${CONFIG_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取系统配置表单数据
   *
   * @param id ConfigID
   * @returns Config表单数据
   */
  getFormData(id) {
    return request({
      url: `${CONFIG_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /** 添加系统配置*/
  add(data) {
    return request({
      url: `${CONFIG_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 更新系统配置
   *
   * @param id ConfigID
   * @param data Config表单数据
   */
  update(id, data) {
    return request({
      url: `${CONFIG_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 删除系统配置
   *
   * @param ids 系统配置ID
   */
  deleteById(id) {
    return request({
      url: `${CONFIG_BASE_URL}/${id}`,
      method: "delete"
    });
  },
  refreshCache() {
    return request({
      url: `${CONFIG_BASE_URL}/refresh`,
      method: "PUT"
    });
  }
};
var stdin_default = ConfigAPI;
export {
  stdin_default as default
};
