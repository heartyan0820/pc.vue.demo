<template>
  <div>
    <p>
      <input type="text" v-model.lazy="message" placeholder="请输入内容"
        style="width: 200px;height:30px;margin-right: 10px;font-size: 15px;" />
      <br />
      <label style="font-size: 15px;">输入的内容：{{ message }}</label>
      <br />
      <br />
      <label>点击的次数：{{ count }}</label>
      <button @click="btnAdd" class="button">确定</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')

const count = ref(0)
const btnAdd = () => {
  count.value++;
  console.log(message.value)
}
</script>

<style scoped>
.button {
  min-width: 80px;
  background-color: #3d9fa6;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>