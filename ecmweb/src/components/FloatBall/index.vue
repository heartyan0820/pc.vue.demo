<template>
  <div v-if="isBool" ref="floatBall" class="float-ball" :style="ballStyle" @mousedown="(e) => handleMouseDown(e)">
    <slot>
      <!-- 默认内容 -->
      <div id="charAi" class="default-icon" @click="handleClick">
        <!-- {{ floatBallTitle }} -->
      </div>
    </slot>
  </div>
  <div class="drawers">
    <el-drawer v-model="aidrawer" :title="ecmName" class="drawers" direction="rtl" :before-close="handleClose"
      size="30%">
      <template #default>
        <AiEcmMessageChat v-if="aidrawer" />
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import AiEcmMessageChat from "@/components/Mess/components/aiecm-message-char.vue";
import { ref, onMounted, reactive } from "vue";
import ChatAPI from "@/api/mess";
import ChatFriendAPI from "@/api/chatfriend";
import { useUserStore, useChatStore, useWebSocketStore } from "@/store";
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  // 初始位置
  initialX: {
    type: Number,
    default: 120
  },
  initialY: {
    type: Number,
    default: 550
  },
  // 尺寸
  size: {
    type: Number,
    default: 55
  },
  // 背景色
  bgColor: {
    type: String,
    default: "#ffffff"
  },
  // 边框圆角
  borderRadius: {
    type: String,
    default: "50%"
  },
  // 阴影
  boxShadow: {
    type: String,
    default: "0 4px 12px rgba(0, 0, 0, 0.15)"
  },
  //内容
  title: {
    type: String,
    default: "AI"
  },
  //ECMAI名称
  ecmName: {
    type: String,
    default: "ECM AI"
  }
  // //roomId房间Id
  // roomId: {
  //   type: Number,
  //   default: 0,
  // },
});
const emit = defineEmits(["click", "drag-end", "update:modelValue"]);
const aidrawer = ref(false);
const floatBallTitle = ref("");
const ecmName = ref("");
floatBallTitle.value = props.title;
ecmName.value = props.ecmName;
const roomId = ref(0);
const isBool = ref(true);
const floatBall = ref(null);
const chatStore = useChatStore();
const websocketStore = useWebSocketStore();
const docWidth = window.innerWidth;
const left = docWidth - 339;
const position = reactive({
  x: left,
  y: props.initialY,
  isDragging: false,
  startX: 0,
  startY: 0
});
const ballStyle = reactive({
  width: `${props.size}px`,
  height: `${props.size}px`,
  //backgroundColor: props.bgColor,
  borderRadius: props.borderRadius,
  //boxShadow: props.boxShadow,
  position: "fixed",
  cursor: "move",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: `${props.size / 2}px`,
  zIndex: 9999,
  transition: "transform 0.3s ease-out"
});
const updatePosition = () => {
  ballStyle.left = `${position.x}px`;
  ballStyle.top = `${position.y}px`;
};
const handleMouseDown = (e) => {
  position.isDragging = true;
  position.startX = e.clientX - position.x;
  position.startY = e.clientY - position.y;
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
const handleMouseMove = (e) => {
  if (!position.isDragging) return;
  let newX = e.clientX - position.startX;
  let newY = e.clientY - position.startY;
  const maxX = window.innerWidth - props.size;
  const maxY = window.innerHeight - props.size;
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));
  position.x = newX;
  position.y = newY;
  updatePosition();
};
const handleMouseUp = () => {
  if (!position.isDragging) return;
  position.isDragging = false;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  emit("drag-end", { x: position.x, y: position.y });
};
const 吸附到边缘 = () => {
  const windowWidth = window.innerWidth;
  const distanceToLeft = position.x;
  const distanceToRight = windowWidth - position.x - props.size;
  if (distanceToLeft < distanceToRight) {
    position.x = 0;
  } else {
    position.x = windowWidth - props.size;
  }
  updatePosition();
};
const handleClick = () => {
  if (!position.isDragging) {
    getAiData();
    getWebSocket();
    isBool.value = false;
  }
};
function handleClose() {
  roomId.value = 0;
  isBool.value = true;
  aidrawer.value = false;
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
function toChat(item) {
  chatStore.roomInfo = item;
  chatStore.setRoomId(item.id);
  chatStore.setRoomType(0);
  chatStore.toggleActiveIndex(1);
}
function getAiData() {
  ChatFriendAPI.getList({
    onlyAi: true,
    addAi: true
  }).then((res) => {
    if (res.data.list.length > 0) {
      roomId.value = res.data.list[0].roomId;
      floatBallTitle.value = res.data.list[0].nickName;
      chatStore.setRoomId(roomId.value);
      chatStore.roomInfo = res.data.list[0];
      console.log("getAiData--roomId", roomId.value);
      isBool.value = false;
      aidrawer.value = true;
      getRoomMsg(roomId.value);
    }
  });
}
function getRoomMsg(roomId2) {
  console.log("getRoomMsg--roomId", roomId2);
  ChatAPI.getRoom({ roomId: roomId2 }).then((data) => {
    if (data.code === 1) {
      toChat(data.data);
    }
  });
}
onMounted(() => {
  updatePosition();
});
</script>

<style lang="scss" scoped>
.float-ball {
  user-select: none;
  -webkit-user-select: none;
  background-image: url(/images/aikf.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.default-icon {
  font-family: Source Han Sans SC;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  width: 35px;
  height: 35px;
}

.drawers {
  width: 100%;
  height: auto;

  .ecmMessAi-mess-content {
    width: 100%;
    height: 720px;
    background-color: #ffffff;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow-y: scroll;
    scrollbar-width: none;
    /* 隐藏 Firefox 滚动条 */
    -ms-overflow-style: none;
    /* 隐藏 IE 和 Edge 滚动条 */

    .ecmMessAi-mess-item {
      display: flex;
      justify-content: space-between;
      height: 70px;
      width: 100%;
      background-color: #ffffff;
      margin-top: 10px;
      padding: 10px 20px 10px 20px;
      cursor: pointer;

      &:hover {
        background-color: #e6eef5;
      }

      .ecmMessAi-mess-left {
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

      .ecmMessAi-mess-right {
        display: flex;
        height: auto;
        flex-flow: column;
        line-height: 100%;
        margin-left: 10px;
        overflow: hidden;

        .title {
          font-family: Noto Sans SC;
          font-weight: 700;
          font-size: 16px;
          height: 25px;
          line-height: 25px;
          width: 160px;
          overflow: hidden;
          /* 隐藏超出的文本 */
          white-space: nowrap;
          /* 保持文本在一行内显示 */
          text-overflow: ellipsis;
          /* 超出部分显示省略号 */
        }

        .content2 {
          font-family: Noto Sans SC;
          font-weight: 400;
          font-size: 14px;
          height: 30px;
          line-height: 30px;
          width: 160px;
          color: #757575;
          overflow: hidden;
        }
      }

      .ecmMessAi-mess-time {
        width: 60px;
        color: #757575;
        font-weight: 400;
        font-size: 12px;
        text-align: right;
      }
    }
  }
}

:deep(.el-overlay) {
  bottom: 0;
  height: calc(100% - 40px);
  top: 0;
}

:deep(.el-drawer__header) {
  align-items: center;
  display: flex;
  padding-bottom: 0;
  margin-bottom: 0px;
  padding: 5px;
  box-shadow: 0px 2px 10px 0px #00000040;
}

:deep(.el-drawer__body) {
  flex: 1;
  overflow: auto;
  padding: 0px;
}
</style>
