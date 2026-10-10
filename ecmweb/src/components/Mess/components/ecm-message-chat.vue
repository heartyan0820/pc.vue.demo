<template>
  <div class="chat-container">
    <!-- 聊天头部 -->
    <chat-header @callheadermethods="handleCallHeaderMethod" @setOrderInfo="setOrderInfo" />
    <!-- 聊天消息区域 -->
    <chat-message v-if="useChatStore().activeIndex == 1" />
    <!-- 聊天输入区域 -->
    <chat-edit v-if="useChatStore().activeIndex == 1" />
  </div>
</template>

<script setup>import { onMounted } from "vue";
import { useChatStore } from "@/store";
const chatStore = useChatStore();
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 15
});
const emit = defineEmits(["callheadermethods", "setOrderInfo"]);
function handleCallHeaderMethod() {
  emit("callheadermethods");
}
function setOrderInfo() {
  emit("setOrderInfo");
}
onUnmounted(() => {
});
onMounted(() => {
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 720px;
  background: white;
  /* border-radius: 12px; */
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
</style>
