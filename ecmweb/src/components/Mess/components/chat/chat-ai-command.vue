<template>
  <!-- 文本消息 -->
  <div class="text-content">
    <span>
      #下订单
    </span>
    <div v-for="(item, index) in list" :key="index">
      <div class="title-box">
        <h5 style="margin-right: 5px;">{{ item.title }}</h5>
        <el-link type="primary" @click="copyMsg(item.content)">复制</el-link>
      </div>

      <div class="content-box" style="margin-top: -10px">
        {{ item.content }}
      </div>
    </div>
  </div>

</template>

<script setup>import { defineProps } from "vue";
import { useChatStore } from "@/store";
const chatStore = useChatStore();
const list = reactive([
  {
    title: "模板1",
    content: "病人[柳如烟]，颜色[3M3]，牙位[A6]做[个性化基台]，基台型号：[X2346663]，牙位[A456]做[瓷倍健]"
  },
  {
    title: "模板2",
    content: "病人[柳如烟]，颜色[3M3]，牙位[A6]做[个性化基台]，基台型号：[X2346663]，牙位[A456]做[瓷倍健]"
  },
  {
    title: "模板3",
    content: "病人[柳如烟]，颜色[3M3]，牙位[A6]做[个性化基台]，基台型号：[X2346663]，牙位[A456]做[瓷倍健]"
  }
]);
const copyMsg = (content) => {
  console.log("复制消息内容:", content);
  let json = {
    type: 3,
    content
  };
  chatStore.btnAiObj = json;
  navigator.clipboard.writeText(content);
  ElMessage.success("复制成功!");
};
const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  }
});
</script>

<style scoped>
.content-box {
  color: #333;
  font-size: 12px;
}

.title-box {
  display: flex;
  justify-content: left;
  align-items: center;
}


.text-content {
  font-size: 14px;
  background: #e8f5ff;
  width: 285px;
  border-radius: 6px;
  padding: 10px;
}
</style>