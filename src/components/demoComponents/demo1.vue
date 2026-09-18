<template>
  <div>
    <p>这是一个简单的 Vue 3 示例页面，展示了 Vue3 的基本用法和特性。</p>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello, Vue 3!');
</script>

<style scoped lang="scss"></style>