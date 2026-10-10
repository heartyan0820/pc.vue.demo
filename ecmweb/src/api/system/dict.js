import request from "@/utils/request";
const DICT_BASE_URL = "/admin/dicts";
const DictAPI = {
  /**
   * 获取字典分页列表
   *
   * @param queryParams 查询参数
   * @returns 字典分页结果
   */
  getPage(queryParams) {
    return request({
      url: `${DICT_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取字典表单数据
   *
   * @param id 字典ID
   * @returns 字典表单数据
   */
  getFormData(id) {
    return request({
      url: `${DICT_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 新增字典
   *
   * @param data 字典表单数据
   */
  add(data) {
    return request({
      url: `${DICT_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 修改字典
   *
   * @param id 字典ID
   * @param data 字典表单数据
   */
  update(id, data) {
    return request({
      url: `${DICT_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 删除字典
   *
   * @param ids 字典ID，多个以英文逗号(,)分隔
   */
  deleteByIds(ids) {
    return request({
      url: `${DICT_BASE_URL}/${ids}`,
      method: "delete"
    });
  },
  /**
   * 获取字典的数据项
   *
   * @param dictCode 字典编码
   * @returns 字典数据项
   */
  getOptions(codes) {
    return request({
      url: `${DICT_BASE_URL}/options`,
      method: "get",
      params: { codes }
    });
  },
  /**
   * 获取字典的数据项
   *
   * @param dictCode 字典编码
   * @returns 字典数据项
   */
  getOptionsList(codes) {
    return request({
      url: `${DICT_BASE_URL}/options`,
      method: "get",
      params: { codes }
    });
  }
};
var stdin_default = DictAPI;
export {
  stdin_default as default
};
