<template>
  <!-- 文本消息 -->
  <div @click="playAudio" class="chat-message-audio">
    <img src="@/assets/music/audio-play.gif" class="audio" alt="" srcset="" v-show="isPlaying">
    <img src="@/assets/music/audio.png" class="audio" alt="" srcset="" v-show="!isPlaying">
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
const isPlaying = ref(false);
const audio = ref(null);
audio.value = new Audio(props.message.contentUrl);
const playAudio = () => {
  if (audio.value && !isPlaying.value) {
    audio.value.play();
  }
  if (audio.value && isPlaying.value) {
    audio.value.pause();
  }
  isPlaying.value = !isPlaying.value;
};
</script>

<style>
.chat-message-audio {
  color: #333;
  min-height: 88rpx;
  user-select: text;
  padding: 20rpx 24rpx;
  word-break: break-all;
  transition: all 0.1s ease;
  border-radius: 0 10rpx 10rpx 10rpx;

  .audio {
    width: 22px;
    height: 24px;
  }
}
</style>