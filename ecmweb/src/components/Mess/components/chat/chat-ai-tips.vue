<template>
  <!-- 文本消息 -->
  <div class="text-content">
    <span>
      你好，欢迎使用易齿盟AI助手！让我帮助你进行下单、查单、改单等操作
    </span>
    <p style="color: #4080ff;">
      你可以点击输入框右侧的 + 选择你想做的操作，获取推荐的消息模板
    </p>
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

<style scoped>
.text-content {
  font-size: 14px;
  background: #e8f5ff;
  width: 280px;
  height: 102px;
  border-radius: 6px;
  padding: 10px;
}
</style>