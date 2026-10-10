<template>
  <div 
    class="chat-container"  @click="handleContainerClick">
  >
    <!-- 顶部栏 -->
    <div class="chat-header">
      <el-avatar :size="36" :src="avatarOther" />
      <span class="header-title">{{ nameOther }}</span>
    </div>

    <!-- 消息内容区域 -->
    <div ref="messagesContainer" class="chat-messages">
      <div 
        v-for="(message, index) in messageList" 
        :key="index" 
        :class="['message-item', message.sender === 'me' ? 'message-me' : 'message-other']"
      >
        <!-- 对方 (左侧) -->
        <template v-if="message.sender === 'other'">
          <el-avatar :size="32" :src="avatarOther" />
          <div class="message-bubble">
            <!-- 昵称在对方消息中显示 -->
            <div class="sender-name">{{ nameOther }}</div>
            <div class="message-content">{{ message.text }}</div>
          </div>
        </template>

        <!-- 我 (右侧) -->
        <template v-else>
          <div class="message-bubble">
            <!-- 昵称在“我”的消息中也显示，并靠右 -->
            <div class="sender-name my-name">{{ nameMe }}</div>
            <div class="message-content">{{ message.text }}</div>
          </div>
          <el-avatar :size="32" :src="avatarMe" />
        </template>
      </div>
      <div ref="scrollAnchor"></div>
    </div>

    <!-- 底部功能区 -->
    <div class="chat-footer">
      <!-- 附件按钮 -->
      <el-button 
        type="primary" 
        link 
        size="small" 
        <!-- 阻止事件冒泡 -- @click.stop="toggleAttachmentMenu">
        :icon="Paperclip"
      >
        附加
      </el-button>

      <!-- 表情按钮 -->
      <el-button 
        type="primary" 
        link 
        size="small" 
        <!-- 阻止事件冒泡 -- @click.stop="toggleEmojiPicker">
        :icon="Smile"
      >
        表情
      </el-button>

      <!-- 展开的附件菜单 -->
      <transition name="slide-up">
        <div v-show="showAttachmentMenu" class="attachment-menu" @click.stop>
          <el-button 
            size="small" 
            :icon="Picture"
            @click="$refs.imageInput.click()"
          >图片</el-button>
          <el-button 
            size="small" 
            :icon="VideoCamera"
            @click="$refs.videoInput.click()"
          >视频</el-button>
          <el-button 
            size="small" 
            :icon="Document"
            @click="$refs.fileInput.click()"
          >文件</el-button>
        </div>
      </transition>

      <!-- 隐藏的文件输入框 -->
      <input ref="imageInput" type="file" accept="image/*" style="display: none;" @change="handleFileSelect('image')">
      <input ref="videoInput" type="file" accept="video/*" style="display: none;" @change="handleFileSelect('video')">
      <input ref="fileInput" type="file" style="display: none;" @change="handleFileSelect('file')">

      <!-- 表情选择器 -->
      <transition name="fade">
        <div v-show="showEmojiPicker" class="emoji-picker" @click.stop>
          <div 
            v-for="emoji in commonEmojis" 
            :key="emoji" 
            class="emoji-item"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </div>
        </div>
      </transition>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        placeholder="输入消息..."
        clearable
        type="textarea"
        :rows="3"
        resize="none"
        <!--
        阻止点击输入框时收起菜单 -- @keyup.enter="handleSendMessage" @click.stop>
      />
      <el-button type="primary" :icon="Promotion" circle @click="handleSendMessage" />
    </div>
  </div>
</template>

<script setup>
import { Paperclip, Smile, Picture, VideoCamera, Document, Promotion } from "@element-plus/icons-vue";
import { ref, onMounted, nextTick, watch } from "vue";
const avatarMe = ref("https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png");
const avatarOther = ref("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png");
const nameMe = ref("我");
const nameOther = ref("助手");
const inputMessage = ref("");
const messageList = ref([
  { sender: "other", text: "你好！有什么我可以帮你的吗？" }
]);
const messagesContainer = ref(null);
const scrollAnchor = ref(null);
const showAttachmentMenu = ref(false);
const showEmojiPicker = ref(false);
const commonEmojis = ref([
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
  "🤬"
]);
const toggleAttachmentMenu = () => {
  if (showEmojiPicker.value) showEmojiPicker.value = false;
  showAttachmentMenu.value = !showAttachmentMenu.value;
};
const toggleEmojiPicker = () => {
  if (showAttachmentMenu.value) showAttachmentMenu.value = false;
  showEmojiPicker.value = !showEmojiPicker.value;
};
const handleFileSelect = (type) => {
  console.log(`${type} selected`);
  const fileTypeNames = { image: "图片", video: "视频", file: "文件" };
  messageList.value.push({
    sender: "me",
    text: `[已发送${fileTypeNames[type]}]`
  });
  setTimeout(() => {
    messageList.value.push({
      sender: "other",
      text: `已收到您发送的${fileTypeNames[type]}。`
    });
  }, 800);
};
const insertEmoji = (emoji) => {
  inputMessage.value += emoji;
  showEmojiPicker.value = false;
};
const handleSendMessage = () => {
  if (inputMessage.value.trim() === "") return;
  messageList.value.push({
    sender: "me",
    text: inputMessage.value.trim()
  });
  inputMessage.value = "";
  setTimeout(() => {
    messageList.value.push({
      sender: "other",
      text: "这是模拟的自动回复。"
    });
  }, 500);
};
watch(messageList, async () => {
  await nextTick();
  if (scrollAnchor.value) {
    scrollAnchor.value.scrollIntoView({ behavior: "smooth" });
  }
}, { deep: true });
onMounted(() => {
  nextTick(() => {
    if (scrollAnchor.value) {
      scrollAnchor.value.scrollIntoView();
    }
  });
});
const handleContainerClick = () => {
  showAttachmentMenu.value = false;
  showEmojiPicker.value = false;
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 720px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  /* 添加 cursor pointer 提示可点击 */
  cursor: pointer;
}

/* ... 其他样式保持不变 ... */

/* 顶部栏 */
.chat-header {
  background-color: #f5f7fa;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ebeef5;
  cursor: default; /* 重置为默认指针 */
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  padding: 16px 16px 8px 16px;
  overflow-y: auto;
  background-color: #f9fafc;
  display: flex;
  flex-direction: column;
  cursor: default;
}

/* 消息项 */
.message-item {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
  gap: 10px;
}

/* 对方消息 - 左对齐 */
.message-other {
  flex-direction: row;
}

.message-other .message-bubble {
  text-align: left;
}

/* 我的消息 - 右对齐 */
.message-me {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.message-me .message-bubble {
  text-align: right;
}

.message-bubble {
  max-width: 75%;
  display: inline-block;
}

.sender-name {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
  word-break: keep-all;
}

/* “我”的昵称靠右 */
.sender-name.my-name {
  text-align: right;
}

.message-content {
  background-color: #ffffff;
  color: #303133;
  border: 1px solid #ebeef5;
  border-radius: 18px;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.message-me .message-content {
  background-color: #409eff;
  color: #ffffff;
  border: none;
}

/* 底部功能区 */
.chat-footer {
  position: relative;
  padding: 8px 12px;
  background-color: #ffffff;
  border-top: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 40px;
  cursor: default;
}

.attachment-menu, .emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 12px;
  right: 12px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.attachment-menu {
  display: flex;
  gap: 10px;
}

.emoji-picker {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-item {
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

/* 输入区域 */
.chat-input {
  padding: 12px 12px 16px 12px;
  background-color: #ffffff;
  display: flex;
  gap: 8px;
  align-items: flex-end;
  cursor: default;
}

/* 阻止事件冒泡的元素样式 (可选，用于视觉提示) */
.chat-input >>> .el-textarea,
.chat-footer >>> .el-button {
  cursor: pointer;
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>