<template>
  <div style="padding: 30px; max-width: 500px; min-height: 285px">
    <!-- 引入组件 -->
    <City4LevelElSelect
      v-model="cityData"
      width="400px"
      placeholder="请选择完整地址"
      :level="level"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import City4LevelElSelect from "@/components/Address4LevelSelector/index.vue";
const cityData = reactive({
  province: "",
  city: "",
  area: "",
  street: "",
  detail: ""
});
const level = ref(4);
level.value = 3;
const handleConfirm = (data) => {
  console.log("最终选中地址：", data);
};
const getFullAddress = () => {
  const addrMap = {
    "310000": "上海市",
    "310100": "上海市",
    "310101": "黄浦区",
    "310101001": "外滩街道",
    "440000": "广东省",
    "440100": "广州市",
    "440106": "天河区",
    "440106001": "石牌街道"
  };
  return [
    addrMap[cityData.province],
    addrMap[cityData.city],
    addrMap[cityData.area],
    addrMap[cityData.street]
  ].filter(Boolean).join(" / ") || "未选择";
};
</script>
