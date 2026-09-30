<script setup>
import { useTimer } from '../../js/useTimer.js';

const { count, isRunning, start, pause, reset } = useTimer(0)
</script>

<template>
  <p>{{ count }} 秒</p>
  <el-button @click="start" :disabled="isRunning">开始</el-button>
  <el-button @click="pause">暂停</el-button>
  <el-button @click="reset">重置</el-button>
</template>
