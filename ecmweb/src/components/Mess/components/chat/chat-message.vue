<template>
  <!-- 聊天消息区域 -->
  <div
    ref="messagesContainer"
    class="chat-messages"
    @click.stop="
      chatStore.closeAllPanels();
      isMenuVisible = false;
    "
    @scroll="updateScroll"
  >
    <div
      v-for="(message, index) in messages"
      :key="message.messageId"
      :class="getClassName(message)"
    >
      <chatMessageUser :message="message" />

      <div v-if="message.isDeleted" class="message-content-delete">用户撤回消息</div>

      <div
        v-else
        class="message-content-wrapper"
        @contextmenu.prevent="showContextMenu($event, message, index)"
        @click="hideContextMenu"
      >
        <div
          :class="
            message.messageType === 9001 ||
            message.messageType === 9000 ||
            message.messageType === 9002
              ? ''
              : 'message-content'
          "
        >
          <chat-ai-tips v-if="message.messageType === 9001" :message="message" />
          <chat-ai-command v-if="message.messageType === 9002" :message="message" />
          <chat-ai-loading v-if="message.messageType === 9000" :message="message" />

          <!-- 文本消息 -->
          <chatMessageText v-if="message.messageType === 1" :message="message" />

          <!-- 图片消息 -->
          <ChatMessageImage
            v-if="message.messageType === 2"
            :message="message"
            :messageList="messageSrcList"
          />

          <!-- 音频消息 -->
          <ChatMessageAudio v-if="message.messageType === 3" :message="message" />

          <!-- 视频消息 -->
          <ChatMessageVideo v-if="message.messageType === 7" :message="message" />

          <!-- 文件消息 -->
          <ChatMessageFile v-if="message.messageType === 4" :message="message" />

          <!-- 模板消息 -->
          <ChatMessageTemplate v-if="message.messageType === 10" :message="message" />

          <!-- <div class="message-time">{{ message.createTime }}</div> -->
          <div v-if="message.quoteMessageId && message.quoteMessage" class="message-quote">
            <div class="message-quote-title">{{ message.quoteMessage.user?.nickName }}：</div>
            <div v-if="message.quoteMessage.messageType === 1">
              {{ message.quoteMessage.content }}
            </div>
            <ChatMessageImage
              v-else-if="message.quoteMessage.messageType === 2"
              :message="message.quoteMessage"
            />
            <ChatMessageVideo
              v-else-if="message.quoteMessage.messageType === 7"
              :message="message.quoteMessage"
            />
            <ChatMessageFile
              v-else-if="message.quoteMessage.messageType === 4"
              :message="message.quoteMessage"
            />
          </div>
        </div>

        <!-- 自定义右键菜单 -->
        <div
          v-if="isMenuVisible"
          class="custom-context-menu"
          :style="{ top: `${menuTop}px`, left: `${menuLeft}px` }"
          @click.stop
        >
          <el-card shadow="never">
            <ul>
              <li @click="copyMsg()">复制</li>
              <li @click="setQuote()">引用</li>
              <li v-if="senderId === userInfo.chatUserId" @click="retractMsg()">撤回</li>
              <li class="divider"></li>
              <li @click="hideContextMenu()">取消</li>
            </ul>
          </el-card>
        </div>
      </div>
    </div>
    <div ref="messagesEnd"></div>
  </div>
</template>

<script setup>
import chatMessageUser from "./chat-message-user.vue";
import chatMessageText from "./chat-message-text.vue";
import ChatMessageImage from "./chat-message-image.vue";
import ChatMessageVideo from "./chat-message-video.vue";
import ChatMessageFile from "./chat-message-file.vue";
import ChatMessageTemplate from "./chat-message-template.vue";
import ChatMessageAudio from "./chat-message-audio.vue";
import { ref, onMounted, nextTick, watch } from "vue";
import { useChatStore, useWebSocketStore, useUserStore } from "@/store";
import ChatAPI, {
  tplJson9000,
  tplJson9001,
  tplJson9002
} from "@/api/mess";
const chatStore = useChatStore();
const websocketStore = useWebSocketStore();
const userInfo = useUserStore().userInfo;
const senderId = ref(0);
const messages = ref([]);
const contextMenuMessage = ref(null);
const contextMenuIndex = ref(0);
const messagesContainer = ref(null);
const messagesEnd = ref(null);
const messageSrcList = ref([]);
const total = ref(0);
const isMenuVisible = ref(false);
const menuTop = ref(0);
const menuLeft = ref(0);
const showContextMenu = (e, message, index) => {
  isMenuVisible.value = true;
  contextMenuMessage.value = message;
  contextMenuIndex.value = index;
  senderId.value = message.senderId;
  const { clientX, clientY } = e;
  const menuWidth = 150;
  const menuHeight = 160;
  if (clientX + menuWidth > window.innerWidth) {
    menuLeft.value = clientX - menuWidth;
  } else {
    menuLeft.value = clientX;
  }
  if (clientY + menuHeight > window.innerHeight) {
    menuTop.value = clientY - menuHeight;
  } else {
    menuTop.value = clientY;
  }
};
const hideContextMenu = () => {
  isMenuVisible.value = false;
};
const copyMsg = () => {
  console.log("复制消息内容:", contextMenuMessage.value.content);
  navigator.clipboard.writeText(contextMenuMessage.value.content);
  hideContextMenu();
};
const retractMsg = () => {
  const param = {
    userId: userInfo.id,
    id: contextMenuMessage.value.messageId,
    roomId: chatStore.roomId
  };
  ChatAPI.retractMsg(param).then((data) => {
    if (data.code === 1) {
      messages.value.splice(contextMenuIndex.value, 1);
    }
  });
  hideContextMenu();
};
const setQuote = () => {
  chatStore.quoteMessage = contextMenuMessage.value;
  hideContextMenu();
};
const removeLoadingMessages = () => {
  messages.value = messages.value.filter((message) => message.messageType !== 9e3);
  setImgList(messages.value);
  chatStore.isSendAi = false;
};
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15
});
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesEnd.value) {
      messagesEnd.value.scrollIntoView({ behavior: "smooth" });
    }
  });
};
const updateScroll = () => {
  if (messagesContainer.value && messagesContainer.value.scrollTop === 0) {
    console.log("滚动到顶部，加载更多");
    if (messages.value.length >= total.value) {
      console.log("所有消息已加载完");
      return;
    }
    queryParams.pageIndex += 1;
    ChatAPI.getMessageList(queryParams).then((data) => {
      total.value = data.data.total;
      if (data.code === 1 && data.data.list.length > 0) {
        let list = data.data.list.reverse();
        messages.value = [...list, ...messages.value];
        setImgList(messages.value);
        console.log("加载更多消息", messages.value);
        nextTick(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = 1;
          }
        });
      }
    });
  }
};
function getClassName(message) {
  let clssName = ["message"];
  if (message.senderId === userInfo.chatUserId) {
    if (message.messageType == 1) {
      clssName.push("sent");
    } else {
      clssName.push("sent");
    }
  } else {
    clssName.push("received");
  }
  return clssName;
}
onMounted(() => {
  getMessageList();
});
const getMessageList = () => {
  queryParams.roomID = useChatStore().roomId;
  ChatAPI.getMessageList(queryParams).then((data) => {
    if (data.data.list.length > 0) {
      messages.value = data.data.list.reverse();
      setImgList(messages.value);
      total.value = data.data.total;
      scrollToBottom();
    }
    if (data.data.total < 10 && chatStore.roomInfo.roomType == 3) {
      messages.value = [tplJson9001, ...messages.value];
      setImgList(messages.value);
    }
  });
};
watch(
  () => chatStore.roomId,
  (newMessage, oldMessage) => {
    if (newMessage) {
      messages.value = [];
      setImgList(messages.value);
      queryParams.pageIndex = 1;
      queryParams.roomID = useChatStore().roomId;
      getMessageList();
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
watch(
  () => chatStore.commandWord,
  (newMessage, oldMessage) => {
    if (newMessage && newMessage == "#下订单") {
      messages.value = [...messages.value, tplJson9002];
      setImgList(messages.value);
      updateScroll();
      scrollToBottom();
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
watch(
  () => chatStore.isSendAi,
  (newMessage, oldMessage) => {
    if (newMessage) {
      messages.value = [...messages.value, tplJson9000];
      setImgList(messages.value);
      updateScroll();
      scrollToBottom();
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
watch(
  () => websocketStore.message,
  (newMessage, oldMessage) => {
    if (newMessage) {
      debugger;
      console.log("Messa:有新消息!");
      handleNewMessage(newMessage);
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
watch(
  () => websocketStore.chatMessage,
  (newMessage, oldMessage) => {
    if (newMessage) {
      if (messages.value.some((item) => item.messageId == newMessage.messageId)) {
        return false;
      }
      messages.value.push(newMessage);
      scrollToBottom();
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
const handleNewMessage = (message) => {
  console.log("聊天组件收到新消息:", message);
  removeLoadingMessages();
  let data = message.data;
  if (messages.value.some((item) => item.messageId == data.messageId)) {
    return false;
  }
  if (message.type == 1001 && data.roomId == useChatStore().roomId) {
    messages.value.push(data);
    setImgList(messages.value);
    scrollToBottom();
  } else if (message.type == 1002) {
    let index = messages.value.findIndex((item) => item.messageId == data.messId);
    if (index != -1) {
      messages.value[index].isDeleted = true;
    }
  }
};
function setImgList(message) {
  let imgList = message.filter((a) => {
    return a.messageType === 2;
  });
  imgList.forEach((img) => {
    if (img.contentUrl.indexOf("emotes") == -1) {
      messageSrcList.value.push(img.contentUrl.replace("&width=400", ""));
    }
  });
}
</script>

<style scoped>
.message-content-delete {
  color: #999;
  margin-top: 10px;
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #edeef5;
  scrollbar-width: none;
  /* 隐藏 Firefox 滚动条 */
  -ms-overflow-style: none;
  /* 隐藏 IE 和 Edge 滚动条 */
}

.message {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.message.received {
  align-items: flex-start;
}

.message.sent {
  align-items: flex-end;
}
.message.sents {
  align-items: flex-end;
}
.message-content-wrapper {
  display: flex;
  align-items: flex-start;
}

.message-content {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}

.received .message-content {
  background-color: #fff;
  /* border-top-left-radius: 4px;*/
  border-radius: 6px;
  color: #000;
}
.sent .message-content {
  background-color: #5094f5;
  /* border-top-right-radius: 4px; */
  border-radius: 6px;
  color: #fff;
}
.sents .message-content {
  background-color: #ffffff;
  /* border-top-right-radius: 4px; */
  border-radius: 6px;
  color: #000;
}
.text-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 11px;
  color: #6a81af;
  margin-top: 4px;
  text-align: right;
  padding-top: 5px;
}

.message-quote {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
  background: #f0f0f0;
  padding: 5px 14px;
  border-radius: 5px;
  display: flex;
}

.media-message {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-context-menu {
  position: fixed;
  width: 120px;
  /* background-color: white;
  border-radius: 4px; */
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */
  z-index: 1000;
  /* padding: 5px 0; */
}

.custom-context-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.custom-context-menu li {
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.custom-context-menu li:hover {
  background-color: #f0f0f0;
}

.divider {
  border-top: 1px solid #eee;
  margin: 5px 0;
  padding: 0 !important;
  pointer-events: none;
}
</style>
