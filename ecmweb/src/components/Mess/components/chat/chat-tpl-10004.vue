<template>
  <div class="tpl-container">
    <div>机构名称： {{ message.name }}</div>
    <div>机构代码： {{ message.code }}</div>
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
.tpl-container {
  color: #333F48;
  margin: 0 20px;
}
</style>