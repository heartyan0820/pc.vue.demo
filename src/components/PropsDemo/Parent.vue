<script setup>
import { ref, provide } from 'vue'
import Child1 from './Child1.vue'
import Child2 from './Child2.vue'
import Child from './Child.vue'


const parentValue = ref('父组件向子组件传递参数1')
const parentValue2 = ref('父组件向子组件传递参数222')

const msg = ref("")
function someEventHandle(data) {
  console.log('子组件传递参数给了父组件=' + data)
  msg.value = data + '' + Math.floor(Math.random() * 100)
}

const getMsg = ref('我是父级的值111222333')
provide('getMsg', getMsg)
</script>

<template>
  <div>
    <h3>Parent父组件(Props是父传子)</h3>
    <el-button @click="parentValue = '更新了一下数据'" style="background-color:aqua;">更新</el-button>

    <!-- <Child :text="parentValue" />
    <Child :text="parentValue2" /> -->
    <hr />
    <hr />
    <el-label>defineEmits-子组件传递参数给父组件：{{ msg }}</el-label>
    <child1 @someEvent="someEventHandle" />
    <hr />
    <div>provide+inject</div>
    <br />
    <child1 />
    <child2 />
  </div>
</template>