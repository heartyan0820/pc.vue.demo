<template>
  <!-- 文本消息 -->
  <div class="text-content">
      <el-icon class="is-loading"  size="30" color="#888">
    <Loading />
  </el-icon>
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

}
</style>