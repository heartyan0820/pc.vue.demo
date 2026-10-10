<template>
  <div class="app-videopaly">
    <div data-v-cf2723cd="" class="media-message">
      <!-- <div
        class="media-caption"
        style="text-align: center; color: #fff; height: 30px; line-height: 30px"
      >
        大好河山视频.mp4
      </div> -->
      <video ref="videoRef" muted loop controls="" class="chat-video">
        <source :src="vurl" type="video/mp4" />
        您的浏览器不支持视频播放
      </video>
    </div>
  </div>
</template>

<script setup>defineOptions({
  name: "v",
  inheritAttrs: true
});
const videoRef = ref(null);
const route = useRoute();
const vurl = ref(route.query.url);
onMounted(() => {
  videoRef.value.play();
});
</script>

<style lang="scss" scoped>
.app-videopaly {
  display: flex;
  width: 100%;
  justify-content: center;
  height: 100vh;
  background-color: #000;
  .media-message {
    display: flex;
    width: 800px;

    flex-flow: column;
    justify-content: center;
    .chat-video {
      width: 800px;
    }
  }
}
</style>
