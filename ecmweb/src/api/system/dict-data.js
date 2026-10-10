import request from "@/utils/request";
const DICT_DATA_BASE_URL = "/admin/dictdatas";
const DictDataAPI = {
  /**
   * 获取字典分页列表
   *
   * @param queryParams 查询参数
   * @returns 字典分页结果
   */
  getPage(queryParams) {
    return request({
      url: `${DICT_DATA_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取字典数据表单
   *
   * @param id 字典ID
   * @returns 字典数据表单
   */
  getFormData(id) {
    return request({
      url: `${DICT_DATA_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 新增字典数据
   *
   * @param data 字典数据
   */
  add(data) {
    return request({
      url: `${DICT_DATA_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 修改字典数据
   *
   * @param id 字典ID
   * @param data 字典数据
   */
  update(id, data) {
    return request({
      url: `${DICT_DATA_BASE_URL}/${id}`,
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
      url: `${DICT_DATA_BASE_URL}/${ids}`,
      method: "delete"
    });
  },
  /**
   * 获取字典的数据项
   *
   * @param dictCode 字典编码
   * @returns 字典数据项
   */
  getOptions(dictCode) {
    return request({
      url: `${DICT_DATA_BASE_URL}/${dictCode}/options`,
      method: "get"
    });
  }
};
var stdin_default = DictDataAPI;
export {
  stdin_default as default
};
