<script setup>
import { ElAlert } from 'element-plus';
import { ref, defineEmits, inject } from 'vue'

const emit = defineEmits(['someEvent'])
const clickHandle = () => {
  console.log('click事件start')
  emit('someEvent', '我是父传子的参数')
  console.log('click事件end')
}

const getMsg = inject('getMsg')
function updateHandle() {
  alert(getMsg)
  getMsg.value = "111111updateHandle111111"
}
</script>

<template>
  <div>
    <h5>Child1子组件</h5>
    <el-button @click="clickHandle">点击触发 someEvent</el-button>
    <br />
    <el-button @click="updateHandle">修改数据-inject</el-button>
    <hr />
    <p>读取到的数据：{{ getMsg }}</p>
  </div>
</template>

<style scoped></style>