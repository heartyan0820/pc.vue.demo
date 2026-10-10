import request from "@/utils/request";
const ORGCLASS_BASE_URL = "/admin/orgclassify";
const OrgClassAPI = {
  /**
   * 获取机构分类
   *
   * @param queryParams 查询参数（可选）
   * @returns 机构分类树形表格数据
   */
  getList(queryParams) {
    return request({
      url: `${ORGCLASS_BASE_URL}`,
      method: "get",
      params: queryParams
    });
  },
  /** 获取机构分类下拉列表 */
  getOptions(parentId, organizationId) {
    return request({
      url: `${ORGCLASS_BASE_URL}/options`,
      method: "get",
      params: {
        parentId,
        organizationId
      }
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
      url: `${ORGCLASS_BASE_URL}/${id}`,
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
      url: `${ORGCLASS_BASE_URL}`,
      method: "post",
      data
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
      url: `${ORGCLASS_BASE_URL}/${id}`,
      method: "put",
      data
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
      url: `${ORGCLASS_BASE_URL}/${ids}`,
      method: "delete"
    });
  }
};
var stdin_default = OrgClassAPI;
export {
  stdin_default as default
};
