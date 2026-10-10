<template>
  <!-- 文本消息 -->
  <div v-if="message.content != '' && message.content.indexOf('http') > -1" class="text-content">
    <a :href="message.content" target="_back" :style="{ color: color, 'font-size': '15px' }">
      {{ message.content }}
    </a>
  </div>
  <div v-else class="text-content">{{ message.content }}</div>
</template>

<script setup>import { useUserStore } from "@/store";
const userInfo = useUserStore().userInfo;
const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  }
});
const color = ref("#4080ff");
if (props.message.senderId == userInfo.chatUserId) {
  color.value = "#4080ff";
}
</script>

<style>
.message-content {
  /* max-width: 220px; */
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.4;
  position: relative;
}
.text-content {
  font-size: 15px;
}
</style>
