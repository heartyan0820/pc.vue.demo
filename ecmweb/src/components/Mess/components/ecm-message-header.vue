<template>
  <div class="ecmMess-mess-btn">
    <div v-if="isDisp || url == '/details'" class="ecmMess-mess-btns">
      <div
        v-for="(item, index) in messClass"
        :key="index"
        :class="chatStore.activeIndex == index + 1 ? 'ecmMess-mess-btn1' : 'ecmMess-mess-btn2'"
        @click="onClassChange(index + 1, item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div v-else class="ecmMess-mess-btn-mess">消息</div>
  </div>
</template>

<script setup>import { ref } from "vue";
import { setActiveIndex } from "@/utils/auth";
import { useChatStore } from "@/store";
const url = useRouter().currentRoute.value.path;
const chatStore = useChatStore();
const userInfo = ref({});
const isDisp = ref(false);
if (chatStore.orderInfo != null) {
  isDisp.value = true;
}
const messClass = ref([
  { label: "消息", value: 1 },
  { label: "数据资料", value: 2 },
  { label: "订单日志", value: 3 }
]);
function onClassChange(v, item) {
  chatStore.activeIndex = v;
  setActiveIndex(v.toString());
}
</script>

<style lang="scss" scoped>
.ecmMess-mess-btn {
  width: 100%;
  display: flex;
  background-color: #5094f5;
  height: 41px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-width: 0.5px;
  justify-content: space-around;
  border: 1px #5094f5 solid;

  .ecmMess-mess-btns {
    width: 100%;
    display: flex;
    background-color: #5094f5;
    height: 40px;
    justify-content: space-around;
    align-items: center;
    font-size: 17px;
    .ecmMess-mess-btn1 {
      display: flex;
      width: 30%;
      height: 32px;
      justify-content: center;
      color: #5094f5;
      background-color: #ffffff;
      align-items: center;
      font-size: 17px;
      font-weight: 500;
      padding: 0px 8px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      margin-top: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .ecmMess-mess-btn2 {
      cursor: pointer;
      display: flex;
      width: 30%;
      height: 32px;
      justify-content: center;
      color: #ffffff;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      margin-top: 8px;
      padding: 0px 8px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      transition: all 0.3s;
    }

    .ecmMess-mess-btn2:hover {
      display: flex;
      background-color: #ffffff;
      justify-content: center;
      color: #100f0f;
      margin-top: 8px;
      cursor: pointer;
    }
  }

  .ecmMess-mess-btn-mess {
    width: 100%;
    display: flex;
    background-color: #5094f5;
    height: 40px;
    justify-content: space-around;
    align-items: center;
    font-size: 17px;
    color: #ffffff;
    font-family: Noto Sans SC;
    font-weight: 400;
  }
}
</style>
