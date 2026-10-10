<!--
 * 基于 ECharts 的 Vue3 图表组件
 * 版权所有 © 2021-present 有来开源组织
 *
 * 开源协议：https://opensource.org/licenses/MIT
 * 项目地址：https://gitee.com/youlaiorg/vue3-element-admin
 * 参考：https://echarts.apache.org/handbook/zh/basics/import/#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6
 *
 * 在使用时，请保留此注释，感谢您对开源的支持！
 -->

<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script setup>import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useResizeObserver } from "@vueuse/core";
echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
]);
// 迁移脚本清空了 defineProps 的类型泛型，这里补回运行时声明
const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: String,
    default: ""
  },
  height: {
    type: String,
    default: ""
  }
});
const chartRef = ref(null);
let chartInstance = null;
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    if (props.options) {
      chartInstance.setOption(props.options);
    }
  }
};
useResizeObserver(chartRef, () => {
  chartInstance?.resize();
});
watch(
  () => props.options,
  (newOptions) => {
    if (chartInstance && newOptions) {
      chartInstance.setOption(newOptions);
    }
  },
  { deep: true }
);
onMounted(() => {
  nextTick(() => initChart());
});
onBeforeUnmount(() => {
  chartInstance?.dispose();
});
</script>
