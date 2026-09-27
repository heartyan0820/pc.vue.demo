<script setup>
import { ref, defineProps } from 'vue'
import GrandsonChild from './GrandsonChild.vue';

const getParentValue = defineProps(["text"])
</script>

<template>
  <div>
    <h5>Child2子组件</h5>
    <p>获取父组件的值：{{ getParentValue.text }}</p>
    <br />
    <GrandsonChild />
  </div>
</template>

<style scoped></style>