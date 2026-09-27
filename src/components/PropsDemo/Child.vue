<script setup>
import { ref, defineProps } from 'vue'

const getParentValue = defineProps(["text"])
</script>

<template>
  <div>
    <h5>Child子组件</h5>
    <p>获取父组件的值：{{ getParentValue.text }}</p>
  </div>
</template>

<style scoped></style>