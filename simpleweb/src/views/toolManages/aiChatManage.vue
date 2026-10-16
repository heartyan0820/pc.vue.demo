<script setup>
import { ref } from 'vue'

</script>

<template>
  <div>
    <h1>AI聊天</h1>
    <el-input v-model="prompt" placeholder="请输入提示词" style="width: 300px; margin-right: 10px;" />
    <el-button type="primary" @click="generateResponse">生成回复</el-button>
  </div>
</template>

<style scoped></style>