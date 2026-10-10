<template>
  <!-- 视频消息 -->
  <div class="media-message">
    <video controls class="chat-video">
      <source :src="message.contentUrl" type="video/mp4" />
      您的浏览器不支持视频播放
    </video>
    <div v-if="message.content" class="media-caption">{{ message.content }}</div>
  </div>
</template>

<script setup>import { defineProps } from "vue";
const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  }
});
</script>

<style>
.chat-video {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.media-caption {
  margin-top: 8px;
  font-size: 15px;
}
</style>
