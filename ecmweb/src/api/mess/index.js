import request from "@/utils/request";
const CUST_BASE_URL = "/chat/room";
const CUST_BASE_Order_URL = "/admin/order";
const ChatAPI = {
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
  },
  /**
   * 获取房间详情
   *
   * @param queryParams 查询参数
   */
  getRoom(queryParams) {
    return request({
      url: `chat/room/${queryParams.roomId}`,
      method: "get"
    });
  },
  /**
   * 获取房间内部消息列表
   *
   * @param queryParams 查询参数
   */
  getMessageList(queryParams) {
    return request({
      url: `chat/chatmsg/page/msg`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 普通发送消息
   *
   * @param queryParams 参数
   */
  sendMessage(data) {
    return request({
      url: `chat/chatmsg/send`,
      method: "post",
      data
    });
  },
  /**
   * 发送AI消息
   *
   * @param queryParams 参数
   */
  sendAiMessage(data) {
    return request({
      url: `chat/chatmsg/ai/send`,
      method: "post",
      data
    });
  },
  // 阅读消息
  readMessage(data) {
    return request({
      url: `chat/chatmsg/read`,
      method: "post",
      data
    });
  },
  // 撤回消息
  retractMsg(data) {
    return request({
      url: `chat/chatmsg/retract`,
      method: "post",
      data
    });
  },
  // 获取命令列表
  getplus(params) {
    return request({
      url: `admin/aifuncdefine/getplus`,
      method: "get",
      params
    });
  },
  // 获取订单日志列表
  getOrderLog(params) {
    return request({
      url: `admin/orderlog`,
      method: "get",
      params
    });
  },
  /**
   * 获取websocket连接地址
   *
   * @param queryParams 查询参数
   */
  getWebsocktUrl(queryParams) {
    return request({
      url: `chat/websockts/connect`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取房间用户列表
   *
   * @param queryParams 查询参数
   */
  getRoomUserList(queryParams) {
    return request({
      url: `chat/room/list/member`,
      method: "get",
      params: queryParams
    });
  },
  /**
   * 获取房间消息列表
   *
   * @param queryParams 查询参数
   */
  getRoomUserListByRoomId(queryParams) {
    return request({
      url: `chat/room/user/listbyroomid`,
      method: "get",
      params: queryParams
    });
  },
  getPage(data) {
    return request({
      url: `${CUST_BASE_URL}/querypage`,
      method: "post",
      data
    });
  },
  getOrderStatePage(data) {
    return request({
      url: `${CUST_BASE_Order_URL}/querorderstateypage`,
      method: "post",
      data
    });
  },
  getOrderFilePage(data) {
    return request({
      url: `${CUST_BASE_Order_URL}/queryorderfilepage`,
      method: "post",
      data
    });
  },
  // 编辑新增常用语
  optcommon(data) {
    return request({
      url: `chat/chatmsg/optcommon`,
      method: "post",
      data
    });
  },
  getCommon(queryParams) {
    return request({
      url: `chat/chatmsg/list/common`,
      method: "get",
      params: queryParams
    });
  }
};
const tplJson9000 = {
  messageId: "1",
  content: "",
  contentUrl: "",
  messageType: 9e3,
  senderId: 710021332228741,
  readState: 2,
  quoteMessageId: 0,
  quoteMessage: null,
  createTime: "",
  user: {
    nickName: "ECM AI",
    userUrl: "https://eapi.epdent.cn/api/file/path?name=7c7e48fe-8ee1-4de8-84a6-e9573fd62373.png&width=400"
  },
  isDeleted: false
};
const tplJson9001 = {
  messageId: "1",
  content: "",
  contentUrl: "",
  messageType: 9001,
  senderId: 710021332228741,
  readState: 2,
  quoteMessageId: 0,
  quoteMessage: null,
  createTime: "",
  user: {
    nickName: "ECM AI",
    userUrl: "https://eapi.epdent.cn/api/file/path?name=7c7e48fe-8ee1-4de8-84a6-e9573fd62373.png&width=400"
  },
  isDeleted: false
};
const tplJson9002 = {
  messageId: "1",
  content: "",
  contentUrl: "",
  messageType: 9002,
  senderId: 710021332228741,
  readState: 2,
  quoteMessageId: 0,
  quoteMessage: null,
  createTime: "2025-11-04 15:03:08",
  user: {
    nickName: "ECM AI",
    userUrl: "https://eapi.epdent.cn/api/file/path?name=7c7e48fe-8ee1-4de8-84a6-e9573fd62373.png&width=400"
  },
  isDeleted: false
};
var stdin_default = ChatAPI;
export {
  stdin_default as default,
  tplJson9000,
  tplJson9001,
  tplJson9002
};
