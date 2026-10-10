import request from "@/utils/request";
const COLOR_BASE_URL = "/admin/color";
const COLOR_BASE_URLS = "/admin/product";
const COLOR_BASE_Product_URLS = "/admin/product";
const ColorAPI = {
  /** 获取颜色分页数据 */
  getPage(queryParams) {
    return request({
      url: `${COLOR_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /** 获取型号分页数据 */
  getModePage(data) {
    return request({
      url: `${COLOR_BASE_Product_URLS}/itemPageType`,
      method: "post",
      data
    });
  },
  /**
   * 获取颜色下拉数据源
   *
   * @returns 颜色下拉数据源
   */
  getOptions(onlyParent) {
    return request({
      url: `${COLOR_BASE_URL}/options`,
      method: "get",
      params: { onlyParent }
    });
  },
  /**
   * 获取颜色表单数据
   *
   * @param id 颜色ID
   */
  getFormData(id) {
    return request({
      url: `${COLOR_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 添加颜色
   *
   * @param data 颜色表单数据
   * @returns 请求结果
   */
  add(data) {
    return request({
      url: `${COLOR_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 修改颜色
   *
   * @param id 颜色ID
   * @param data 颜色表单数据
   * @returns 请求结果
   */
  update(id, data) {
    return request({
      url: `${COLOR_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  getProductData(id) {
    return request({
      url: `${COLOR_BASE_URLS}/item/${id}`,
      method: "get"
    });
  },
  /**
   * 删除菜单
   *
   * @param id 菜单ID
   * @returns 请求结果
   */
  deleteById(id) {
    return request({
      url: `${COLOR_BASE_URL}/${id}`,
      method: "delete"
    });
  }
};
var stdin_default = ColorAPI;
export {
  stdin_default as default
};
