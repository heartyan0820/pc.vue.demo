<template>
  <el-divider style="margin: 0"></el-divider>

  <!-- 扩展功能区域 -->
  <div v-if="chatStore.showExtraPanel" class="chat-extra" @click.stop>
    <div class="extra-grid">
      <div
        v-for="(item, index) in plusList"
        :key="index"
        class="extra-item"
        @click="setCommand(item.commandWord)"
      >
        <div class="extra-icon">
          <el-icon>
            <DocumentAdd />
          </el-icon>
        </div>
        <div class="extra-label">{{ item.commandWord }}</div>
      </div>

      <div class="extra-item" @click="triggerFileInput('image')">
        <div class="extra-icon">
          <el-icon>
            <Picture />
          </el-icon>
        </div>
        <div class="extra-label">图片</div>
      </div>
      <div class="extra-item" @click="triggerFileInput('video')">
        <div class="extra-icon">
          <el-icon>
            <VideoCamera />
          </el-icon>
        </div>
        <div class="extra-label">视频</div>
      </div>
      <div class="extra-item" @click="triggerFileInput('file')">
        <div class="extra-icon">
          <el-icon>
            <Document />
          </el-icon>
        </div>
        <div class="extra-label">文件</div>
      </div>

      <div class="extra-item" @click="isDrawer = !isDrawer">
        <div class="extra-icon">
          <el-icon>
            <ChatDotRound />
          </el-icon>
        </div>
        <div class="extra-label">常用语</div>
      </div>
    </div>
  </div>

  <!-- 表情包选择区域 -->
  <div v-if="chatStore.showEmojiPanel" class="emoji-panel" @click.stop>
    <div class="emoji-header">
      <span>表情包</span>
      <el-button link @click="chatStore.closeEmojiPanel">
        <el-icon>
          <Close />
        </el-icon>
      </el-button>
    </div>
    <div class="emoji-grid">
      <span
        v-for="(emoji, index) in emojis"
        :key="index"
        class="emoji-item"
        @click="selectEmoji(emoji)"
      >
        {{ emoji }}
      </span>
    </div>
  </div>

  <!-- @用户区域 -->
  <div v-if="chatStore.showAt" class="emoji-panel" @click.stop>
    <div class="emoji-header">
      <span>请选择@用户</span>
      <el-button link @click="chatStore.showAt = false">
        <el-icon>
          <Close />
        </el-icon>
      </el-button>
    </div>
    <div class="member-grid">
      <span
        v-for="(member, index) in chatStore.memberList"
        :key="index"
        class="member-item"
        @click="selectAt(member)"
      >
        {{ member.nickName }}
      </span>
    </div>
  </div>

  <div style="margin-left: 20px; margin-top: 10px">
    <el-tag
      v-if="commandWord"
      type="primary"
      closable
      @close="
        commandWord = '';
        chatStore.commandWord = '';
      "
    >
      {{ commandWord }}
    </el-tag>

    <el-tag
      v-for="(item, index) in atList"
      v-if="atList.length > 0"
      :key="index"
      type="primary"
      closable
      @close="atList.splice(index, 1)"
    >
      {{ item.nickName }}
    </el-tag>
  </div>

  <el-tag v-if="!websocketStore.isConnected" type="danger" style="font-size: 14px">
    当前无网络连接，请刷新网络重连
  </el-tag>

  <!-- 聊天输入区域 -->
  <div class="chat-input">
    <div class="input-area">
      <!-- <el-input
        ref="inputRef"
        v-model="inputMessage"
        placeholder="输入消息..."
        @keyup.enter="sendTextMessage"
      ></el-input> -->

      <el-input
        ref="inputRef"
        v-model="inputMessage"
        :autosize="{ minRows: 1, maxRows: 2 }"
        type="textarea"
        :disabled="websocketStore.loading || !websocketStore.isConnected"
        placeholder="输入消息..."
        @keydown.enter="onKeyDown"
        @input="onInput"
        @paste="handlePaste"
      />
    </div>

    <el-button
      v-if="websocketStore.loading"
      type="info"
      :loading="websocketStore.loading"
    ></el-button>

    <div v-else class="button-group">
      <el-button circle class="emoji-button" @click.stop="chatStore.toggleEmojiPanel">
        <img src="/src/assets/icons/face.svg" alt="" srcset="" style="width: 20px; height: 20px" />
      </el-button>

      <el-button
        v-if="!inputMessage.trim()"
        circle
        class="add-button"
        @click.stop="chatStore.toggleExtraPanel"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-button>

      <el-button v-else circle class="send-button" @click="sendTextMessage">
        <el-icon>
          <Promotion />
        </el-icon>
      </el-button>
    </div>
  </div>

  <div v-if="chatStore.quoteMessage" class="quote-message" style="">
    <div class="quote-txt" style="font-size: 14px; color: #333">
      {{ chatStore.quoteMessage.createTime }}
    </div>
    <el-icon @click.stop="chatStore.closeQuoteMessage">
      <Close />
    </el-icon>
  </div>

  <!-- 隐藏的文件输入 -->

  <input
    ref="fileInput"
    type="file"
    :accept="fileAccept"
    style="display: none"
    @change="handleFileUpload"
  />
  <chatEditCommon v-if="isDrawer" @select-common="selectCommon" @closeDrawer="isDrawer = false" />

  <!-- <el-drawer v-model="isDrawer" title="常用语" direction="rtl" size="40%">
    <template #default>
      <chatEditCommon v-if="isDrawer"  @select-common="selectCommon"  />
    </template>
</el-drawer> -->
</template>

<script setup>
import { Picture, VideoCamera, Document, Close, Plus, Promotion } from "@element-plus/icons-vue";
import chatEditCommon from "./edit/chat-edit-common.vue";
import { ref, onMounted, watch } from "vue";
const emit = defineEmits(["refresh"]);
import { ElMessage } from "element-plus";
import FileAPI from "@/api/file/chat";
import ChatAPI from "@/api/mess";
import { useChatStore, useUserStore, useWebSocketStore } from "@/store";
const chatStore = useChatStore();
const websocketStore = useWebSocketStore();
const loading = ref(false);
const isDrawer = ref(false);
const fileType = ref(0);
const plusList = ref([]);
const atList = ref([]);
const user = useUserStore().userInfo;
const inputMessage = ref("");
const commandWord = ref("");
const fileAccept = ref("");
const fileInput = ref(null);
const emojis = ref([
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🤑",
  "🤠"
]);
const inputRef = ref(null);
const chunk = reactive({
  file: Blob,
  filePartName: "",
  urlParameter: "",
  partNumber: 0,
  chunks: 0,
  size: 0,
  start: 0,
  end: 0,
  total: 0
});
watch(
  () => chatStore.btnAiObj,
  (newMessage, oldMessage) => {
    if (newMessage) {
      console.log("newMessage,btnAiObj", newMessage);
      inputRef.value.focus();
      inputMessage.value = newMessage.content;
      if (newMessage.type == 1) {
        commandWord.value = "";
        console.log("newMessage,btnAiObj", newMessage);
      } else if (newMessage.type == 2) {
        console.log("newMessage,btnAiObj", newMessage);
        sendTextMessage();
      } else if (newMessage.type == 3) {
        inputMessage.value = newMessage.content;
      } else if (newMessage.type == 4) {
        let param = getMessageToSend(newMessage.msgType, newMessage.fileUrl);
        sendMsg(param);
      }
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
watch(
  websocketStore,
  (newVal) => {
    console.log("websocketStore", websocketStore.loading);
    if (!websocketStore.loading) {
      nextTick(() => {
        inputRef.value.focus();
      });
    }
  },
  { immediate: true }
);
const selectAt = (item) => {
  atList.value.push(item);
  chatStore.showAt = false;
  inputMessage.value = inputMessage.value.slice(0, -1);
  inputRef.value.focus();
};
const selectCommon = (item) => {
  inputMessage.value = item.content;
  inputRef.value.focus();
  isDrawer.value = false;
  chatStore.showExtraPanel = false;
};
const setCommand = (command) => {
  commandWord.value = command;
  chatStore.showExtraPanel = false;
  chatStore.commandWord = command;
  inputRef.value.focus();
};
const onKeyDown = (e) => {
  e.preventDefault();
  if (e.ctrlKey) {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    inputMessage.value = inputMessage.value.slice(0, start) + "\n" + inputMessage.value.slice(end);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }, 0);
  } else {
    sendTextMessage();
  }
};
const onInput = (e) => {
  if (e.slice(-1) == "@" && chatStore.roomInfo.roomType != 3) {
    chatStore.showAt = true;
  }
};
const sendTextMessage = () => {
  console.log("发送消息", chatStore.roomId);
  if (!inputMessage.value.trim()) return;
  const param = getMessageToSend(1, "");
  sendMsg(param);
  if (user.members.orgRoleCodes.includes("10011")) {
    readMsg();
  }
};
const readMsg = () => {
  ChatAPI.readMessage({ roomId: chatStore.roomId }).then((data) => {
    console.log("审核员阅读消息", data);
  });
};
const sendMsg = async (param) => {
  console.log("发送消息", chatStore.roomInfo);
  let data = null;
  if (chatStore.roomInfo.roomType == 3) {
    websocketStore.loading = true;
    data = await ChatAPI.sendAiMessage(param);
  } else {
    data = await ChatAPI.sendMessage(param);
  }
  if (data.code == 1) {
    websocketStore.chatMessage = data.data;
    websocketStore.listRoomId = chatStore.roomId;
    chatStore.closeAllPanels();
    chatStore.closeQuoteMessage();
    inputMessage.value = "";
    atList.value = [];
    if (chatStore.roomInfo.roomType == 3) {
      chatStore.isSendAi = true;
    }
  }
};
const triggerFileInput = (type) => {
  chatStore.closeAllPanels();
  switch (type) {
    case "image":
      fileAccept.value = "image/*";
      break;
    case "video":
      fileAccept.value = "video/*";
      break;
    case "file":
      fileAccept.value = "*";
      break;
  }
  console.log("文件类型", fileAccept.value);
  if (fileInput.value) {
    setTimeout(() => {
      fileInput.value.click();
    }, 100);
  }
};
async function UploadFileChunk(chunk2) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  await FileAPI.upload(formData).then((data) => {
    if (data) {
      const imgurl = import.meta.env.VITE_APP_IMAGE_URL + data;
      let fileType2 = 2;
      if (fileAccept.value == "video/*") {
        fileType2 = 7;
      } else if (fileAccept.value == "*") {
        fileType2 = 4;
      }
      console.log("分片上传成功，返回的图片地址：" + imgurl, chunk2.filePartName);
      inputMessage.value = chunk2.filePartName;
      const msg = getMessageToSend(fileType2, imgurl);
      sendMsg(msg);
      loading.value = false;
    }
  }).catch((error) => {
    ElMessage.error(error);
    loading.value = false;
  });
}
const handleFileUpload = (event) => {
  const target = event.target;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  uploadFiles(file);
};
const uploadFiles = (file) => {
  const fileType2 = file.type.split("/")[0];
  const fileUrl = URL.createObjectURL(file);
  const fileChunks = [];
  var maxFileSizeMB = 2;
  var bufferChunkSize = maxFileSizeMB * (1024 * 1024);
  var fileStreamPos = 0;
  var endPos = bufferChunkSize;
  var size = file.size;
  while (fileStreamPos < size) {
    var fileChunkInfo = {
      file: file.slice(fileStreamPos, endPos),
      start: fileStreamPos,
      end: endPos
    };
    fileChunks.push(fileChunkInfo);
    fileStreamPos = endPos;
    endPos = fileStreamPos + bufferChunkSize;
  }
  var totalParts = fileChunks.length;
  var partCount = 0;
  var chunks = null;
  while (chunks = fileChunks.shift()) {
    partCount++;
    chunk.file = chunks.file;
    chunk.filePartName = file.name;
    chunk.urlParameter = "";
    chunk.partNumber = partCount;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks.start;
    chunk.end = chunks.end;
    chunk.total = size;
    UploadFileChunk(chunk);
  }
  ElMessage.success("文件上传成功");
};
const selectEmoji = (emoji) => {
  inputMessage.value += emoji;
  if (inputRef.value) {
    inputRef.value.focus();
  }
};
const getMessageToSend = (messageType = 1, contentURL = "") => {
  if (chatStore.roomInfo.roomType == 3 && commandWord.value) {
    inputMessage.value = commandWord.value + " " + inputMessage.value;
    commandWord.value = "";
  }
  let replyToList = [];
  let replyTxt = "";
  if (atList.value.length > 0) {
    replyToList = atList.value.map((item) => item.userId);
    replyTxt = atList.value.map((item) => "@" + item.nickName + " ").join(",");
  }
  const message = {
    roomId: chatStore.roomId,
    roomType: chatStore.roomInfo.roomType,
    senderId: useUserStore().userInfo.chatUserId,
    messageType,
    //消息类型(1：文本，2：图片，3：语音，4：文件，5：表情，6：系统通知，7：视频）
    content: replyTxt + inputMessage.value,
    contentURL,
    contentCode: "",
    quoteMessageId: chatStore.quoteMessage ? chatStore.quoteMessage.messageId : 0,
    replyToList,
    roleCodeName: useUserStore().userInfo.members.orgRoleName
  };
  return message;
};
const getPlusList = () => {
  ChatAPI.getplus({ Platform: "h5", Top: 10 }).then((res) => {
    if (res) {
      plusList.value = res;
    }
  });
};
const handlePaste = async (e) => {
  console.log("粘贴事件", e);
  try {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) {
      ElMessage.warning("当前浏览器不支持读取剪贴板图片");
      return;
    }
    let imageFile = null;
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.indexOf("image") !== -1) {
        imageFile = item.getAsFile();
        break;
      }
    }
    if (!imageFile) {
      ElMessage.info("剪贴板中未检测到图片");
      return;
    }
    uploadFiles(imageFile);
    console.log("imageFile", imageFile);
  } catch (error) {
    ElMessage.error("粘贴处理失败：" + error);
  }
};
onMounted(async () => {
  await nextTick();
  if (chatStore.roomInfo.roomType == 3) {
    getPlusList();
  }
});
</script>

<style scoped>
.drawers {
  width: 100%;
  height: auto;
}

.quote-message {
  margin: 0 16px;
  padding: 5px;
  background: #f5f5f5;
  border-left: 4px solid #6e8efb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quote-txt {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-extra {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.extra-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.extra-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.extra-item:hover {
  transform: scale(1.05);
}

.extra-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.extra-icon .el-icon {
  font-size: 20px;
  color: #6e8efb;
}

.extra-label {
  font-size: 12px;
  color: #666;
}

.emoji-panel {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  z-index: 10;
  padding: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.emoji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 5px;
  font-size: 14px;
  color: #666;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  max-height: 150px;
  overflow-y: auto;
}

.emoji-item {
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

.member-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.member-item {
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.member-item:hover {
  background-color: #f0f0f0;
}

.chat-input {
  padding: 16px;
  padding-top: 5px;
  background-color: white;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  z-index: 5;
}

.add-button {
  width: 30px;
  height: 30px;
  margin-left: 10px;
}

.input-area {
  flex: 1;
  margin-right: 8px;
}

.button-group {
  width: 70px;
  display: flex;
  align-items: center;
}

.emoji-button {
  flex-shrink: 0;
}

.send-button {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border: none;
  width: 30px;
  height: 30px;
  color: white;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-left: 10px;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
