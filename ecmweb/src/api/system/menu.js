import request from "@/utils/request";
const MENU_BASE_URL = "/admin/menus";
const MenuAPI = {
  /**
   * 获取当前用户的路由列表
   * <p/>
   * 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   *
   * @returns 路由列表
   */
  getRoutes() {
    return request({
      url: `${MENU_BASE_URL}/routers`,
      method: "get"
    });
  },
  /**
   * 获取菜单树形列表
   *
   * @param queryParams 查询参数
   * @returns 菜单树形列表
   */
  getList(queryParams) {
    return request({
      url: `${MENU_BASE_URL}`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取菜单下拉数据源
   *
   * @returns 菜单下拉数据源
   */
  getOptions(onlyParent) {
    return request({
      url: `${MENU_BASE_URL}/options`,
      method: "get",
      params: { onlyParent }
    });
  },
  /**
   * 获取菜单表单数据
   *
   * @param id 菜单ID
   */
  getFormData(id) {
    return request({
      url: `${MENU_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 添加菜单
   *
   * @param data 菜单表单数据
   * @returns 请求结果
   */
  add(data) {
    return request({
      url: `${MENU_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 修改菜单
   *
   * @param id 菜单ID
   * @param data 菜单表单数据
   * @returns 请求结果
   */
  update(id, data) {
    return request({
      url: `${MENU_BASE_URL}/${id}`,
      method: "put",
      data
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
      url: `${MENU_BASE_URL}/${id}`,
      method: "delete"
    });
  }
};
var stdin_default = MenuAPI;
export {
  stdin_default as default
};
