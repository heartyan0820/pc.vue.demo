import request from "@/utils/request";
const ROLE_BASE_URL = "/admin/roles";
const RoleAPI = {
  /** 获取角色分页数据 */
  getPage(queryParams) {
    return request({
      url: `${ROLE_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /** 获取角色下拉数据源 */
  getOptions() {
    return request({
      url: `${ROLE_BASE_URL}/options`,
      method: "get"
    });
  },
  /**
   * 获取角色的菜单ID集合
   *
   * @param roleId 角色ID
   * @returns 角色的菜单ID集合
   */
  getRoleMenuIds(roleId) {
    return request({
      url: `${ROLE_BASE_URL}/${roleId}/menuids`,
      method: "get"
    });
  },
  /**
   * 分配菜单权限
   *
   * @param roleId 角色ID
   * @param data 菜单ID集合
   */
  updateRoleMenus(roleId, data) {
    return request({
      url: `${ROLE_BASE_URL}/${roleId}/permissons`,
      method: "patch",
      data
    });
  },
  /**
   * 获取角色表单数据
   *
   * @param id 角色ID
   * @returns 角色表单数据
   */
  getFormData(id) {
    return request({
      url: `${ROLE_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /** 添加角色 */
  add(data) {
    return request({
      url: `${ROLE_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 更新角色
   *
   * @param id 角色ID
   * @param data 角色表单数据
   */
  update(id, data) {
    return request({
      url: `${ROLE_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 批量删除角色，多个以英文逗号(,)分割
   *
   * @param ids 角色ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids) {
    return request({
      url: `${ROLE_BASE_URL}/${ids}`,
      method: "delete"
    });
  }
};
var stdin_default = RoleAPI;
export {
  stdin_default as default
};
