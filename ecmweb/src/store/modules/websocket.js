import { store, useUserStore } from "@/store";
import { getAccessToken } from "@/utils/auth";
const useWebSocketStore = defineStore("websocket", () => {
  const url = ref("");
  const loading = ref(false);
  const audioRef = ref(null);
  const listRoomId = ref(0);
  const chatMessage = ref({});
  const message = ref({});
  const msgEvent = ref("");
  const socket = ref(null);
  const isConnected = ref(false);
  const error = ref(null);
  const connect = () => {
    audioRef.value = new Audio(require("@/assets/music/v1.mp3"));
    if (socket.value) {
      console.log("已有WebSocket连接，先关闭");
      socket.value.close();
    }
    url.value += `?token=Bearer ${getAccessToken()}`;
    socket.value = new WebSocket(
      import.meta.env.VITE_APP_WS_URL + `?token=Bearer ${getAccessToken()}`
    );
    socket.value.onopen = () => {
      console.log("WebSocket连接成功");
      msgEvent.value = "WebSocket连接成功";
      isConnected.value = true;
      error.value = null;
    };
    socket.value.onmessage = (event) => {
      msgEvent.value = event.data;
      loading.value = false;
      try {
        console.log("收到WebSocket消息:", event);
        message.value = JSON.parse(event.data);
        console.log("message.value:", message.value, message.value.data.playVoice);
        const user = useUserStore().userInfo;
        if (message.value.data.playVoice && user.chatUserId != message.value.data.senderId) {
          audioRef.value.play().catch((err) => {
            console.error("播放失败：", err);
          });
        }
      } catch (e) {
        console.error("解析WebSocket消息失败", e);
        error.value = "解析消息失败";
      }
    };
    socket.value.onclose = () => {
      console.log("WebSocket连接关闭");
      msgEvent.value = "WebSocket连接关闭";
      isConnected.value = false;
    };
    socket.value.onerror = (err) => {
      console.error("WebSocket错误", err);
      msgEvent.value = "WebSocket错误";
      error.value = "连接发生错误";
    };
  };
  const setUrl = (newUrl) => {
    url.value = import.meta.env.VITE_APP_WS_URL;
    console.log("websocket连接地址:", url.value);
  };
  const disconnect = () => {
    console.log("disconnect,关闭WebSocket连接");
    if (socket.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
    }
  };
  const sendMessage = (message2) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(message2));
    } else {
      console.error("WebSocket未连接，无法发送消息");
      error.value = "未连接，无法发送消息";
    }
  };
  const handleMessageByType = (message2) => {
    switch (message2.type) {
      case "notification":
        console.log("收到通知:", message2.data);
        break;
      case "update":
        console.log("收到更新:", message2.data);
        break;
      // 可以添加更多消息类型的处理
      default:
        console.log("收到未知类型消息:", message2);
    }
  };
  return {
    url,
    loading,
    socket,
    isConnected,
    message,
    chatMessage,
    listRoomId,
    error,
    msgEvent,
    setUrl,
    connect,
    disconnect,
    sendMessage
  };
});
function useWebSocketStoreHook() {
  return useWebSocketStore(store);
}
export {
  useWebSocketStore,
  useWebSocketStoreHook
};
