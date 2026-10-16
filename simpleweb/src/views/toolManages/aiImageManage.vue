<script setup>
import { el } from 'element-plus/es/locales.mjs';
import { ref } from 'vue'

</script>

<template>
  <div>
    <h1>AI图片生成</h1>
    <el-input v-model="prompt" placeholder="请输入提示词" style="width: 300px; margin-right: 10px;" />
    <el-button type="primary" @click="generateImage">生成图片</el-button </div>
  </div>
</template>

<style scoped></style>