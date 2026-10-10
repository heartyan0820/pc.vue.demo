<template>
  <div class="file-message">
    <div class="file-icon">
      <el-icon :size="24">
        <Document />
      </el-icon>
    </div>
    <div class="file-info">
      <div class="file-name">{{ message.content }}</div>
      <div class="file-size">{{ message.fileSize }}</div>
    </div>
    <el-button size="small" class="download-btn" @click="Download()">下载</el-button>
  </div>
</template>

<script setup>
import { Document } from "@element-plus/icons-vue";
import { defineProps } from "vue";
const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  }
});
const Download = () => {
  window.open(props.message.contentUrl);
};
</script>

<style>
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
  font-size: 15px;
}

.file-size {
  font-size: 14px;
  color: #888;
}

.download-btn {
  margin-left: 8px;
  font-size: 14px;
}
</style>
