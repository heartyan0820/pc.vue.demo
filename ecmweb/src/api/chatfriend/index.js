import request from "@/utils/request";
const CUST_BASE_URL = "/chat/chatfriend";
const ChatFriendAPI = {
  /**
   * 获取列表
   *
   * @param queryParams 查询参数
   */
  getList(queryParams) {
    return request({
      url: `${CUST_BASE_URL}/list`,
      method: "get",
      params: queryParams
    });
  }
};
var stdin_default = ChatFriendAPI;
export {
  stdin_default as default
};
