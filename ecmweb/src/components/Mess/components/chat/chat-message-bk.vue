<template>
  <!-- 聊天消息区域 -->
  <div ref="messagesContainer" class="chat-messages" @click.stop="chatStore.closeAllPanels">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['message', message.sender === 'me' ? 'sent' : 'received']"
    >
      <!-- 对方消息显示头像和昵称 -->
      <div v-if="message.sender === 'other'" class="sender-info">
        <el-avatar :size="36" :src="message.avatar" class="message-avatar"></el-avatar>
        <div class="sender-name">{{ message.senderName }}</div>
      </div>

      <!-- 本人消息显示头像和昵称 -->
      <div v-if="message.sender === 'me'" class="sender-info">
        <!-- <div class="sender-name">{{ message.senderName }}</div> -->
        <el-avatar :size="36" :src="message.avatar" class="message-avatar"></el-avatar>
      </div>

      <div class="message-content-wrapper">
        <div class="message-content">
          <!-- 文本消息 -->
          <div v-if="message.type === 'text'" class="text-content">{{ message.text }}</div>

          <!-- 图片消息 -->
          <div v-if="message.type === 'image'" class="media-message">
            <img
              :src="message.content"
              class="chat-image"
              alt="图片"
              @click="openPreview(message.content)"
            />
            <div v-if="message.text" class="media-caption">{{ message.text }}</div>
          </div>

          <!-- 视频消息 -->
          <div v-if="message.type === 'video'" class="media-message">
            <video controls class="chat-video">
              <source :src="message.content" type="video/mp4" />
              您的浏览器不支持视频播放
            </video>
            <div v-if="message.text" class="media-caption">{{ message.text }}</div>
          </div>

          <!-- 文件消息 -->
          <div v-if="message.type === 'file'" class="file-message">
            <div class="file-icon">
              <el-icon :size="24">
                <Document />
              </el-icon>
            </div>
            <div class="file-info">
              <div class="file-name">{{ message.fileName }}</div>
              <div class="file-size">{{ message.fileSize }}</div>
            </div>
            <el-button size="small" class="download-btn">下载</el-button>
          </div>

          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
    </div>
    <div ref="messagesEnd"></div>
  </div>

  <!-- 图片预览对话框 -->
  <el-dialog v-model="previewVisible" title="图片预览" width="400px" center>
    <img :src="previewImage" style="width: 100%" alt="预览" />
  </el-dialog>
</template>

<script setup>
import { Document } from "@element-plus/icons-vue";
import { ref, onMounted, nextTick, watch } from "vue";
import { useChatStore } from "@/store";
import { useWebSocketStore } from "@/store";
const chatStore = useChatStore();
const websocketStore = useWebSocketStore();
const currentUser = ref({
  id: "user-001",
  name: "我",
  avatar: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
  status: "online"
});
const otherUser = ref({
  id: "user-002",
  name: "张三",
  avatar: "https://picsum.photos/id/64/200/200",
  status: "online"
});
const messages = ref([
  {
    id: 1,
    text: "你好！最近怎么样？",
    type: "text",
    sender: "other",
    senderName: "张三",
    avatar: "https://picsum.photos/id/64/200/200",
    time: "10:00"
  },
  {
    id: 2,
    text: "还不错，刚完成了一个Vue项目。你呢？",
    type: "text",
    sender: "me",
    senderName: "我",
    avatar: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
    time: "10:02"
  },
  {
    id: 3,
    text: "看看我刚拍的照片",
    type: "image",
    content: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
    sender: "other",
    senderName: "张三",
    avatar: "https://picsum.photos/id/64/200/200",
    time: "10:05"
  },
  {
    id: 4,
    text: "这个视频很有意思",
    type: "video",
    content: "https://www.w3schools.com/html/mov_bbb.mp4",
    sender: "other",
    senderName: "张三",
    avatar: "https://picsum.photos/id/64/200/200",
    time: "10:07"
  },
  {
    id: 5,
    text: "项目文档",
    type: "file",
    content: "#",
    fileName: "项目计划书.pdf",
    fileSize: "2.3MB",
    sender: "me",
    senderName: "我",
    avatar: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
    time: "10:10"
  }
]);
const messagesContainer = ref(null);
const messagesEnd = ref(null);
const previewVisible = ref(false);
const previewImage = ref("");
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesEnd.value) {
      messagesEnd.value.scrollIntoView({ behavior: "smooth" });
    }
  });
};
const openPreview = (imageUrl) => {
  previewImage.value = imageUrl;
  previewVisible.value = true;
};
onMounted(() => {
  scrollToBottom();
});
watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);
</script>

<style scoped>
.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f7fa;
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

.sender-info {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.sender-info.me {
}

.sender-name {
  font-size: 12px;
  color: #07b336;
  margin: 0 8px;
}

.message-content-wrapper {
  display: flex;
  align-items: flex-start;
}

.message-content {
  max-width: 220px;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}

.received .message-content {
  background-color: #e8f5ff;
  border-top-left-radius: 4px;
}

.sent .message-content {
  background-color: #dafecb;
  border-top-right-radius: 4px;
}

.text-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.media-message {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.chat-image:hover {
  transform: scale(1.02);
}

.chat-video {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.media-caption {
  margin-top: 8px;
  font-size: 13px;
}

.file-message {
  display: flex;
  align-items: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.file-icon {
  margin-right: 12px;
  color: #6e8efb;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  font-size: 13px;
}

.file-size {
  font-size: 11px;
  color: #888;
}

.download-btn {
  margin-left: 8px;
}
</style>
