<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMouse } from '../../js/useMouse.js'

const { x, y } = useMouse()
</script>

<template>
  <div>
    <p>获取鼠标X、Y坐标</p>
    <p>x坐标：{{ x }}</p>
    <p>y坐标：{{ y }}</p>
  </div>
</template>

<style scoped lang="scss"></style>