<template>
  <el-button @click="doMount">动态创建vue对象</el-button>
  <div id="print" style="border: 1px red solid" v-html="printHtml"></div>
</template>

<script setup>import { nextTick } from "vue";
import { mountPrintData } from "@/assets/mountTemplateData";
const printTemplate = `
<div>
  <div>数据：{{ data.test }}</div>

  <div v-for="item in data.list">姓名：{{item.name}} 年龄:{{item.age}}</div>
</div>`;
const printHtml = ref(printTemplate);
const doMount = () => {
  printHtml.value = "<div></div>";
  nextTick(() => {
    printHtml.value = printTemplate;
    nextTick(() => {
      updateData();
    });
  });
};
function updateData() {
  const printJsonData = {
    test: "Test数据",
    list: [
      { name: "张三1", age: 15 },
      { name: "李四2", age: 20 },
      { name: "王麻子", age: 18 },
      { name: "小陈", age: 32 },
      { name: "小王", age: 52 }
    ]
  };
  mountPrintData(printJsonData);
}
</script>
