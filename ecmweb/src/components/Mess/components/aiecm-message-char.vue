<template>
  <div class="chat-containers">
    <!-- <chat-header /> -->

    <!-- 聊天消息区域 -->
    <chat-message />
    <!-- 聊天输入区域 -->
    <chat-edit />
  </div>
</template>

<script setup>import { onMounted } from "vue";
onMounted(() => {
});
</script>

<style scoped>
.chat-containers {
  width: 100%;
  height: 100%;
  background: white;
  /* border-radius: 12px; */
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
</style>
