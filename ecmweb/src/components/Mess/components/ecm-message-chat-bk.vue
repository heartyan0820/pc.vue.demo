<template>
  <div class="chat-container">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <el-avatar :size="40" class="avatar">
        <img src="https://picsum.photos/id/64/200/200" alt="聊天对象头像" />
      </el-avatar>
      <div class="chat-info">
        <div class="chat-name">豆包助手</div>
        <div class="online-status">在线</div>
      </div>
      <el-button icon="el-icon-more" circle size="mini" class="more-btn"></el-button>
    </div>

    <!-- 聊天内容区域 -->
    <div ref="messagesContainer" class="chat-messages">
      <!-- 时间分割线 -->
      <div class="time-divider">今天 15:45</div>

      <!-- 接收的消息 -->
      <div class="message received">
        <el-avatar :size="36" class="message-avatar">
          <img src="https://picsum.photos/id/64/200/200" alt="对方头像" />
        </el-avatar>
        <div class="message-content">你好！可以发送文件和图片给我</div>
      </div>

      <!-- 图片消息示例 -->
      <div class="message sent">
        <div class="message-content image-message">
          <img src="https://picsum.photos/id/237/300/200" alt="示例图片" class="message-image" />
        </div>
      </div>

      <!-- 文件消息示例 -->
      <div class="message received">
        <el-avatar :size="36" class="message-avatar">
          <img src="https://picsum.photos/id/64/200/200" alt="对方头像" />
        </el-avatar>
        <div class="message-content file-message">
          <el-icon class="file-icon"><document /></el-icon>
          <div class="file-info">
            <div class="file-name">文档示例.pdf</div>
            <div class="file-size">2.4 MB</div>
          </div>
          <el-button icon="el-icon-download" size="mini" class="download-btn"></el-button>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-container">
      <!-- 底部功能菜单 - 从底部展开收起 -->
      <transition name="slide-up">
        <div v-if="showActions" class="bottom-actions">
          <div class="action-buttons">
            <div class="action-btn" @click="handleImageUpload">
              <el-icon class="action-icon"><picture /></el-icon>
              <span class="action-text">图片</span>
              <input type="file" class="file-input" accept="image/*" @change="handleFileSelected" />
            </div>
            <div class="action-btn" @click="handleVideoUpload">
              <el-icon class="action-icon"><video-camera /></el-icon>
              <span class="action-text">视频</span>
              <input type="file" class="file-input" accept="video/*" @change="handleFileSelected" />
            </div>
            <div class="action-btn" @click="handleFileUpload">
              <el-icon class="action-icon"><document /></el-icon>
              <span class="action-text">文件</span>
              <input type="file" class="file-input" @change="handleFileSelected" />
            </div>
            <div class="action-btn">
              <el-icon class="action-icon"><Food /></el-icon>
              <span class="action-text">表情</span>
            </div>
          </div>
        </div>
      </transition>

      <!-- 文件上传预览 -->
      <div v-if="uploadingFile" class="upload-preview">
        <el-progress
          :percentage="uploadProgress"
          stroke-width="2"
          class="upload-progress"
        ></el-progress>
        <div class="upload-info">
          <el-icon class="preview-icon" :class="getFileIcon()"><document /></el-icon>
          <div class="file-details">
            <div class="preview-name">{{ uploadingFile.name }}</div>
            <div class="preview-size">{{ formatFileSize(uploadingFile.size) }}</div>
          </div>
          <el-button
            icon="el-icon-close"
            size="mini"
            class="cancel-upload"
            @click="cancelUpload"
          ></el-button>
        </div>
      </div>

      <!-- 输入框和发送按钮 -->
      <div class="chat-input-area">
        <el-button
          icon="el-icon-plus"
          circle
          size="mini"
          class="expand-btn"
          @click="toggleActions"
        ></el-button>
        <el-input
          v-model="message"
          placeholder="请输入消息..."
          class="message-input"
          :autosize="{ minRows: 1, maxRows: 4 }"
          @keyup.enter="sendMessage"
        ></el-input>
        <el-button
          type="primary"
          class="send-btn"
          :disabled="!message.trim() && !uploadingFile"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, onMounted, nextTick, computed } from "vue";
const message = ref("");
const messagesContainer = ref(null);
const showActions = ref(false);
const uploadingFile = ref(null);
const uploadProgress = ref(0);
const uploadTimer = ref(null);
const toggleActions = () => {
  showActions.value = !showActions.value;
};
const handleImageUpload = () => {
  const input = document.querySelector('input[accept="image/*"]');
  input?.click();
};
const handleVideoUpload = () => {
  const input = document.querySelector('input[accept="video/*"]');
  input?.click();
};
const handleFileUpload = () => {
  const input = document.querySelector("input:not([accept])");
  input?.click();
};
const handleFileSelected = (e) => {
  const input = e.target;
  if (input.files && input.files[0]) {
    uploadingFile.value = input.files[0];
    uploadProgress.value = 0;
    showActions.value = false;
    simulateUploadProgress();
  }
  input.value = "";
};
const simulateUploadProgress = () => {
  if (uploadTimer.value) {
    clearInterval(uploadTimer.value);
  }
  uploadTimer.value = setInterval(() => {
    uploadProgress.value += 5;
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100;
      if (uploadTimer.value) {
        clearInterval(uploadTimer.value);
      }
      if (uploadingFile.value) {
        sendFileMessage(uploadingFile.value);
        uploadingFile.value = null;
      }
    }
  }, 200);
};
const cancelUpload = () => {
  if (uploadTimer.value) {
    clearInterval(uploadTimer.value);
  }
  uploadingFile.value = null;
  uploadProgress.value = 0;
};
const sendMessage = () => {
  if (!message.value.trim() && !uploadingFile.value) return;
  if (uploadingFile.value) {
    sendFileMessage(uploadingFile.value);
    uploadingFile.value = null;
    if (uploadTimer.value) {
      clearInterval(uploadTimer.value);
    }
    uploadProgress.value = 0;
  } else {
    const messagesDiv = messagesContainer.value;
    if (messagesDiv) {
      const newMessage = document.createElement("div");
      newMessage.className = "message sent";
      newMessage.innerHTML = `<div class="message-content">${message.value}</div>`;
      messagesDiv.appendChild(newMessage);
      message.value = "";
      scrollToBottom();
      simulateReply();
    }
  }
  showActions.value = false;
};
const sendFileMessage = (file) => {
  const messagesDiv = messagesContainer.value;
  if (!messagesDiv) return;
  const newMessage = document.createElement("div");
  newMessage.className = "message sent";
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newMessage.innerHTML = `
        <div class="message-content image-message">
          <img src="${e.target?.result}" alt="${file.name}" class="message-image">
        </div>
      `;
      messagesDiv.appendChild(newMessage);
      scrollToBottom();
      simulateReply();
    };
    reader.readAsDataURL(file);
  } else {
    const fileIcon = file.type.startsWith("video/") ? "video-camera" : "document";
    newMessage.innerHTML = `
      <div class="message-content file-message">
        <el-icon class="file-icon"><${fileIcon} /></el-icon>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <el-button icon="el-icon-download" size="mini" class="download-btn"></el-button>
      </div>
    `;
    messagesDiv.appendChild(newMessage);
    scrollToBottom();
    simulateReply();
  }
};
const simulateReply = () => {
  setTimeout(() => {
    const replies = [
      "收到你的消息了",
      "这个文件我已经保存了",
      "图片看起来很清晰，谢谢",
      "我稍后查看这个内容",
      "好的，我知道了"
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const messagesDiv = messagesContainer.value;
    if (messagesDiv) {
      const replyElement = document.createElement("div");
      replyElement.className = "message received";
      replyElement.innerHTML = `
        <el-avatar :size="36" class="message-avatar">
          <img src="https://picsum.photos/id/64/200/200" alt="对方头像">
        </el-avatar>
        <div class="message-content">${randomReply}</div>
      `;
      messagesDiv.appendChild(replyElement);
      scrollToBottom();
    }
  }, 1500);
};
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
const getFileIcon = computed(() => {
  if (!uploadingFile.value) return "";
  if (uploadingFile.value.type.startsWith("image/")) {
    return "image-icon";
  } else if (uploadingFile.value.type.startsWith("video/")) {
    return "video-icon";
  }
  return "file-icon";
});
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 720px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

/* 头部样式 */
.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  background-color: #f9fafb;
}

.avatar {
  margin-right: 12px;
}

.chat-info {
  flex: 1;
}

.chat-name {
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.online-status {
  font-size: 12px;
  color: #10b981;
  display: flex;
  align-items: center;
}

.online-status::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
  margin-right: 4px;
}

.more-btn {
  color: #6b7280;
}

/* 消息区域样式 */
.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f9fafb;
  background-image:
    linear-gradient(rgba(243, 244, 246, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(243, 244, 246, 0.8) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 隐藏滚动条但保留滚动功能 */
.chat-messages::-webkit-scrollbar {
  display: none;
}

.chat-messages {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.time-divider {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin: 8px 0 16px;
}

.message {
  margin-bottom: 16px;
  display: flex;
  max-width: 100%;
}

.received {
  align-items: flex-start;
}

.sent {
  justify-content: flex-end;
  align-items: flex-start;
}

.message-avatar {
  margin-right: 8px;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.received .message-content {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-top-left-radius: 4px;
}

.sent .message-content {
  background-color: #4096ff;
  color: #ffffff;
  border-top-right-radius: 4px;
}

/* 图片消息样式 */
.image-message {
  padding: 4px;
}

.message-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: contain;
}

/* 文件消息样式 */
.file-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
}

.file-icon {
  font-size: 20px;
  color: #4096ff;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: #888;
}

.download-btn {
  color: #4096ff;
  padding: 0;
  height: 24px;
}

/* 输入区域容器 */
.chat-input-container {
  border-top: 1px solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

/* 底部功能菜单 - 动画效果 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.bottom-actions {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  z-index: 10;
  background-color: white;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  padding: 4px 0;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
  font-size: 12px;
  width: 50px;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  position: relative;
}

.action-btn:hover {
  background-color: #f5f5f5;
}

.action-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

/* 隐藏文件输入框但保留功能 */
.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* 文件上传预览 */
.upload-preview {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.upload-progress {
  margin-bottom: 8px;
}

.upload-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-icon {
  font-size: 20px;
}

.image-icon {
  color: #10b981;
}

.video-icon {
  color: #f59e0b;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.preview-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-size {
  font-size: 12px;
  color: #888;
}

.cancel-upload {
  color: #f56c6c;
  padding: 0;
  height: 24px;
}

/* 输入框和发送按钮区域 */
.chat-input-area {
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.expand-btn {
  color: #6b7280;
  align-self: flex-end;
  margin-bottom: 4px;
}

.message-input {
  flex: 1;
}

.send-btn {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
}
</style>
