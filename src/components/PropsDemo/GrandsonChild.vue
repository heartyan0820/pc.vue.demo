<script setup>
import { ref, defineProps, inject } from 'vue'

const getParentValue = defineProps(["text"])

const msg = inject("getMsg")
</script>

<template>
  <div>
    <h5>GrandsonChild孙子组件</h5>
    <p>{{ msg }}</p>

  </div>
</template>

<style scoped></style>