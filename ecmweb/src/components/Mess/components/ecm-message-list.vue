<template>
  <div ref="msgListContainer" class="ecmMess-mess-content" @scroll="handleScroll">
    <div
      v-for="(item, index) in sortedMessages"
      :key="index"
      :class="item.roomType == 3 ? 'ecmMess-mess-item first-child' : 'ecmMess-mess-item'"
      @click="toChats(item)"
    >
      <div style="display: flex">
        <div class="ecmMess-mess-left">
          <el-avatar :size="50" :src="item.roomUrl" style="background: #e6eef5">
            <img src="@/assets/images/msg_avatar.png" />
          </el-avatar>
          <span v-if="item.number > 0" class="circle">{{ item.number }}</span>
        </div>
        <div class="ecmMess-mess-right">
          <div class="title">{{ item.roomName }}</div>
          <div class="content2">
            {{ setContent(item) }}
          </div>
        </div>
      </div>

      <div class="ecmMess-mess-time">
        <!-- <div
          :style="{
            backgroundColor: setProject(item.roomProject),
            color: '#ffffff',
            padding: '6px',
            borderRadius: '8px',
            textAlign: 'center',
          }"
        >
          {{ item.roomProject.length <= 4 ? item.roomProject : item.roomProject.slice(0, 4) }}
        </div> -->
        <div style="padding-top: 5px">{{ formatDate(item.contentTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, watch, computed } from "vue";
import ChatAPI from "@/api/mess";
import { useUserStore, useChatStore, useWebSocketStore } from "@/store";
import router from "@/router";
onMounted(() => {
  getAiList();
  getWebSocket();
});
const chatStore = useChatStore();
const websocketStore = useWebSocketStore();
const ws = ref(null);
const msgListContainer = ref(null);
const total = ref(0);
const user = useUserStore().userInfo;
function toChats(item) {
  const params = {
    id: item.sourceCode
  };
  const routeData = router.resolve({
    path: "/details",
    // 比如 /detail、/order
    query: params
    // 带参数（可选）
  });
  window.open(routeData.href, "_blank");
}
function toChat(item) {
  chatStore.roomInfo = item;
  chatStore.setRoomId(item.id);
  chatStore.setRoomType(1);
  chatStore.toggleActiveIndex(1);
}
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  type: "1,2"
});
const messageList = ref([]);
const setContent = (item) => {
  switch (item.messageType) {
    case 1:
      return item.content ? item.content : "--";
    case 2:
      return "【图片】";
    case 3:
      return "【声音】";
    case 7:
      return "【视频】";
    case 4:
      return "【文件】";
    case 10:
      if (item.content) {
        let content = JSON.parse(item.content);
        return content.params.title.caption;
      } else {
        return "--";
      }
  }
};
const setProject = (project) => {
  if (project == "") {
    return "22C8B4";
  }
  const arr = project.split("|");
  return arr[1];
};
const sortedMessages = computed(() => {
  return messageList.value.reduce((result, item) => {
    if (item.roomType === 3) {
      result.unshift(item);
    } else {
      result.push(item);
    }
    return result;
  }, []);
});
function getAiList() {
  let params = {
    pageIndex: 1,
    pageSize: 1,
    type: 3
  };
  ChatAPI.getList(params).then((data) => {
    if (data.data != null && data.data.list.length > 0) {
      messageList.value = data.data.list;
    }
    getMessageList();
  });
}
function getMessageList() {
  ChatAPI.getList(queryParams).then((data) => {
    if (data.data != null && data.data.list.length > 0) {
      messageList.value = messageList.value.concat(data.data.list);
    }
    total.value = data.data != null ? data.data.total : 0;
  });
}
function handleScroll(e) {
  if (e.target.scrollTop + msgListContainer.value.clientHeight >= msgListContainer.value.scrollHeight - 1) {
    if (total.value <= messageList.value.length) {
      return false;
    }
    queryParams.pageIndex++;
    getMessageList();
  }
}
function getWebSocket() {
  if (!websocketStore.isConnected) {
    websocketStore.connect();
  }
}
function getWebSocketUrl() {
  if (!websocketStore.url) {
    ChatAPI.getWebsocktUrl({ websocketId: useUserStore().userInfo.chatUserId }).then((data) => {
      console.log("WebSocket URL:", data);
      if (data.server) {
        websocketStore.setUrl(data.server);
        websocketStore.connect();
      }
    });
  } else {
    websocketStore.connect();
  }
}
function formatDate(timeStr) {
  if (!timeStr) return "未知时间";
  const localTimeStr = timeStr.replace(/-/g, "/");
  const targetDate = new Date(localTimeStr);
  const targetTime = targetDate.getTime();
  if (isNaN(targetDate.getTime())) return "时间格式错误";
  const now = /* @__PURE__ */ new Date();
  const nowTime = now.getTime();
  const timeDiff = nowTime - targetTime;
  if (timeDiff < 0) return "未来时间";
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetStart = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  ).getTime();
  const oneDay = 24 * 60 * 60 * 1e3;
  const dayDiff = Math.floor((todayStart - targetStart) / oneDay);
  if (dayDiff === 0) {
    const minuteDiff = Math.floor(timeDiff / (60 * 1e3));
    const hourDiff = Math.floor(timeDiff / (60 * 60 * 1e3));
    if (minuteDiff < 1) {
      return "1分钟内";
    } else if (minuteDiff < 60) {
      return `${minuteDiff}分钟前`;
    } else {
      return `${hourDiff}小时前`;
    }
  } else if (dayDiff === 1) {
    return "昨天";
  } else if (dayDiff === 2) {
    return "前天";
  } else if (dayDiff <= 7) {
    return "一周内";
  } else if (dayDiff > 7) {
    return `${dayDiff}天前`;
  } else {
    return `${targetDate.getFullYear()}-${month}-${day}`;
  }
}
watch(
  () => websocketStore.message,
  (newMessage, oldMessage) => {
    if (newMessage) {
      handleNewMessage(newMessage);
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
watch(
  () => websocketStore.listRoomId,
  (newMessage, oldMessage) => {
    if (newMessage && newMessage != 0) {
      getRoomMsg(newMessage);
    }
  },
  { immediate: true }
  // 不立即执行，只在消息变化时执行
);
const handleNewMessage = (message) => {
  let data = message.data;
  if (message.type == 1001 || message.type == 1002 || message.type == 1007) {
    console.log("收到新消息，更新消息列表", data.roomId);
    getRoomMsg(data.roomId);
  }
  if (data.roomId == chatStore.roomId && !user.members.orgRoleCodes.includes("10011")) {
    ChatAPI.readMessage({ roomId: useChatStore().roomId }).then((data2) => {
      featchMyNotice();
    });
  } else {
    featchMyNotice();
  }
};
const getRoomMsg = (roomId) => {
  ChatAPI.getList({
    PageIndex: 1,
    PageSize: 1,
    roomId
  }).then((res) => {
    console.log("getRoomMsg", res);
    if (res.code == 1) {
      let data = res.data.list[0];
      const index = messageList.value.findIndex((item) => item.id == roomId);
      if (index !== -1) {
        messageList.value[index] = data;
      } else {
        messageList.value.unshift(data);
      }
    } else {
      console.error("获取房间信息失败:", res.message);
    }
  });
};
onMounted(() => {
});
const emit = defineEmits(["featchMyNotice"]);
function featchMyNotice() {
  emit("featchMyNotice");
}
</script>

<style lang="scss" scoped>
.ecmMess-mess-content {
  width: 100%;
  height: 720px;
  background-color: #ffffff;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow-y: scroll;
  scrollbar-width: none;
  /* 隐藏 Firefox 滚动条 */
  -ms-overflow-style: none;
  /* 隐藏 IE 和 Edge 滚动条 */

  .ecmMess-mess-item {
    display: flex;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    background-color: #ffffff;
    // margin-top: 10px;
    padding: 10px 15px 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #e6eaf1;
    &:hover {
      background-color: #e6eef5;
    }

    .ecmMess-mess-left {
      height: auto;
      position: relative;

      img {
        width: 50px;
        height: 50px;
      }

      .circle {
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background-color: #eb5757;
        text-align: center;
        line-height: 23px;
        position: absolute;
        color: #fff;
        font-size: 12px;
        right: -5px;
        top: -5px;
        z-index: 99;
      }
    }

    .ecmMess-mess-right {
      display: flex;
      height: auto;
      flex-flow: column;
      line-height: 100%;
      margin-left: 10px;
      overflow: hidden;

      .title {
        font-family: Noto Sans SC;
        font-weight: 500;
        font-size: 17px;
        height: 25px;
        line-height: 25px;
        width: 280px;
        overflow: hidden;
        /* 隐藏超出的文本 */
        white-space: nowrap;
        /* 保持文本在一行内显示 */
        text-overflow: ellipsis;
        //color: #333f48;
        color: #5094f5;
        /* 超出部分显示省略号 */
      }

      .content2 {
        font-family: Noto Sans SC;
        font-weight: 400;
        font-size: 15px;
        height: 30px;
        line-height: 30px;
        width: 160px;
        //color: #606266;
        color: #222428;
        overflow: hidden;
      }
    }

    .ecmMess-mess-time {
      width: 80px;
      // color: #606266;
      color: #222428;
      font-weight: 400;
      font-size: 15px;
      text-align: right;
    }
  }

  // ai背景色设置为灰色
  .first-child {
    background-color: #e6e6e6;
    border-bottom: solid 1px #c5d1dc;
  }
}
</style>
