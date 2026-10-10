import request from "@/utils/request";
const USER_BASE_URL = "/admin/users";
const UserAPI = {
  /**
   * 检查账号或手机是否存在
   * @param filed 账号或手机
   * @param type 类型(1:用户名;2:手机号)
   */
  exists(data) {
    return request({
      url: `${USER_BASE_URL}/exists`,
      method: "post",
      data
    });
  },
  /**
   * 重置密码
   *
   * @param id 用户ID
   * @param password 新密码
   */
  resetPassword(id, password) {
    return request({
      url: `${USER_BASE_URL}/${id}/password`,
      method: "patch",
      params: { password }
    });
  },
  /**
   * 获取用户分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams) {
    return request({
      url: `${USER_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取用户表单详情
   *
   * @param userId 用户ID
   * @returns 用户表单详情
   */
  getFormData(userId) {
    return request({
      url: `${USER_BASE_URL}/${userId}`,
      method: "get"
    });
  },
  /**
   * 添加用户
   *
   * @param data 用户表单数据
   */
  add(data) {
    return request({
      url: `${USER_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 修改用户
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  update(id, data) {
    return request({
      url: `${USER_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 批量删除用户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids) {
    return request({
      url: `${USER_BASE_URL}/${ids}`,
      method: "delete"
    });
  },
  /** 下载用户导入模板 */
  downloadTemplate() {
    return request({
      url: `${USER_BASE_URL}/template`,
      method: "get",
      responseType: "blob"
    });
  },
  /**
   * 导出用户
   *
   * @param queryParams 查询参数
   */
  export(queryParams) {
    return request({
      url: `${USER_BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "blob"
    });
  },
  /**
   * 导入用户
   *
   * @param deptId 部门ID
   * @param file 导入文件
   */
  import(deptId, file) {
    const formData = new FormData();
    formData.append("file", file);
    return request({
      url: `${USER_BASE_URL}/import`,
      method: "post",
      params: { deptId },
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  /**
   *  获取用户下拉列表
   */
  getOptions(params) {
    return request({
      url: `${USER_BASE_URL}/options`,
      method: "get",
      params
    });
  },
  /**
   *  注销用户
   */
  cancelaccount(data) {
    return request({
      url: `${USER_BASE_URL}/cancelaccount`,
      method: "post",
      data
    });
  }
};
var stdin_default = UserAPI;
export {
  stdin_default as default
};
