import request from "@/utils/request";
const PRODUCT_BASE_URL = "/admin/product";
const ProductAPI = {
  /** 获取加工产品分页数据 */
  getPage(queryParams) {
    return request({
      url: `${PRODUCT_BASE_URL}/page`,
      method: "get",
      params: queryParams
    });
  },
  /** 获取加工项目分页数据 */
  getItemPage(queryParams) {
    return request({
      url: `${PRODUCT_BASE_URL}/item/page`,
      method: "get",
      params: queryParams
    });
  },
  /** 获取加工项目类型分页数据 */
  getItemTypePage(queryParams) {
    return request({
      url: `${PRODUCT_BASE_URL}/itemtype/page`,
      method: "get",
      params: queryParams
    });
  },
  getItemProductPage(queryParams) {
    return request({
      url: `${PRODUCT_BASE_URL}/productitem/options`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取加工产品下拉数据源
   *
   * @returns 加工产品下拉数据源
   */
  getProductOptions(isAll) {
    return request({
      url: `${PRODUCT_BASE_URL}/productoptions`,
      method: "get",
      params: { isAll }
    });
  },
  /**
   * 获取加工产品表单数据
   *
   * @param id 加工产品ID
   */
  getFormData(id) {
    return request({
      url: `${PRODUCT_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /**
   * 获取加工项目表单数据
   *
   * @param id 加工项目ID
   */
  getItemFormData(id) {
    return request({
      url: `${PRODUCT_BASE_URL}/item/${id}`,
      method: "get"
    });
  },
  /**
   * 获取加工项目类型表单数据
   *
   * @param id 加工项目类型ID
   */
  getItemTypeFormData(id) {
    return request({
      url: `${PRODUCT_BASE_URL}/itemtype/${id}`,
      method: "get"
    });
  },
  /**
   * 添加加工产品
   *
   * @param data 加工产品表单数据
   * @returns 请求结果
   */
  add(data) {
    return request({
      url: `${PRODUCT_BASE_URL}`,
      method: "post",
      data
    });
  },
  /**
   * 添加加工项目
   *
   * @param data 加工项目表单数据
   * @returns 请求结果
   */
  addItem(data) {
    return request({
      url: `${PRODUCT_BASE_URL}/item`,
      method: "post",
      data
    });
  },
  /**
   * 添加加工项目类型
   *
   * @param data 加工项目类型表单数据
   * @returns 请求结果
   */
  addItemType(data) {
    return request({
      url: `${PRODUCT_BASE_URL}/itemtype`,
      method: "post",
      data
    });
  },
  /**
   * 修改加工产品
   *
   * @param id 加工产品ID
   * @param data 加工产品表单数据
   * @returns 请求结果
   */
  update(id, data) {
    return request({
      url: `${PRODUCT_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 修改加工项目
   *
   * @param id 加工项目ID
   * @param data 加工项目表单数据
   * @returns 请求结果
   */
  updateItem(id, data) {
    return request({
      url: `${PRODUCT_BASE_URL}/item/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 修改加工项目类型
   *
   * @param id 加工项目类型ID
   * @param data 加工项目类型表单数据
   * @returns 请求结果
   */
  updateItemType(id, data) {
    return request({
      url: `${PRODUCT_BASE_URL}/itemtype/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 删除加工产品
   *
   * @param id 加工产品ID
   * @returns 请求结果
   */
  deleteById(id) {
    return request({
      url: `${PRODUCT_BASE_URL}/${id}`,
      method: "delete"
    });
  },
  /**
   * 删除加工项目
   *
   * @param id 加工产品ID
   * @returns 请求结果
   */
  deleteItemById(id) {
    return request({
      url: `${PRODUCT_BASE_URL}/item/${id}`,
      method: "delete"
    });
  },
  /**
   * 删除加工产品类型
   *
   * @param id 加工产品ID
   * @returns 请求结果
   */
  deleteItemTypeById(id) {
    return request({
      url: `${PRODUCT_BASE_URL}/itemtype/${id}`,
      method: "delete"
    });
  }
};
var stdin_default = ProductAPI;
export {
  stdin_default as default
};
