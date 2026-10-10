<template>
  <div class="line-container">
    <!-- SVG 容器，用于绘制直线 -->
    <svg class="drawing-area" :width="width" :height="height">
      <!-- 直线元素，连接两点 -->
      <line
        :x1="point1.x"
        :y1="point1.y"
        :x2="point2.x"
        :y2="point2.y"
        :stroke="lineColor"
        :stroke-width="lineWidth"
        :stroke-dasharray="isDashed ? '5,5' : 'none'"
      />

      <!-- 可选：显示点的位置 -->
      <circle v-if="showPoints" :cx="point1.x" :cy="point1.y" r="5" fill="red" />
      <circle v-if="showPoints" :cx="point2.x" :cy="point2.y" r="5" fill="blue" />
    </svg>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

// 定义组件属性
const props = defineProps({
  // 第一个点坐标
  point1: {
    type: Object,
    required: true,
    default: () => ({ x: 0, y: 0 }),
  },
  // 第二个点坐标
  point2: {
    type: Object,
    required: true,
    default: () => ({ x: 100, y: 100 }),
  },
  // SVG 容器宽度
  width: {
    type: Number,
    default: 500,
  },
  // SVG 容器高度
  height: {
    type: Number,
    default: 500,
  },
  // 线的颜色
  lineColor: {
    type: String,
    default: "#000000",
  },
  // 线的宽度
  lineWidth: {
    type: Number,
    default: 2,
  },
  // 是否显示虚线
  isDashed: {
    type: Boolean,
    default: false,
  },
  // 是否显示两个点
  showPoints: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
.line-container {
  display: inline-block;
}

.drawing-area {
  border: 1px solid #eeeeee;
  background-color: #f9f9f9;
}
</style>
