import request from "@/utils/request";
const CLASSIFY_BASE_URL = "/admin/piclassify";
const ClassifyAPI = {
  /** 获取加工项目分类分页数据 */
  getPage(queryParams) {
    return request({
      url: `${CLASSIFY_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取加工项目分类下拉数据源
   *
   * @returns 颜色下拉数据源
   */
  getOptions(isAll) {
    return request({
      url: `${CLASSIFY_BASE_URL}/options`,
      method: "get",
      params: { isAll }
    });
  },
  /**
   * 获取加工项目分类表单数据
   *
   * @param id 加工项目分类ID
   */
  getFormData(id) {
    return request({
      url: `${CLASSIFY_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 添加加工项目分类
   *
   * @param data 加工项目分类表单数据
   * @returns 请求结果
   */
  add(data) {
    return request({
      url: `${CLASSIFY_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 修改加工项目分类
   *
   * @param id 加工项目分类ID
   * @param data 加工项目分类表单数据
   * @returns 请求结果
   */
  update(id, data) {
    return request({
      url: `${CLASSIFY_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 删除加工项目分类
   *
   * @param id 加工项目分类ID
   * @returns 请求结果
   */
  deleteById(id) {
    return request({
      url: `${CLASSIFY_BASE_URL}/${id}`,
      method: "delete"
    });
  }
};
var stdin_default = ClassifyAPI;
export {
  stdin_default as default
};
