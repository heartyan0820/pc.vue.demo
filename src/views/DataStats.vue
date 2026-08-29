<script setup>
// 数据统计：对订单数据做简单的汇总展示
// 没有引入图表库，用 CSS 画简单的比例条，方便初学者理解原理
import { computed } from 'vue'
import { useOrdersStore, ORDER_STATUS } from '../stores/orders'

const ordersStore = useOrdersStore()

// 订单总数
const totalCount = computed(() => ordersStore.list.length)

// 总金额：reduce 把每条订单的 amount 累加起来
const totalAmount = computed(() =>
  ordersStore.list.reduce((sum, o) => sum + o.amount, 0)
)

// 每种状态的订单数量：ORDER_STATUS 有 4 种状态，分别去列表里数一遍
const statusCount = computed(() =>
  ORDER_STATUS.map((s) => ({
    ...s, // 展开状态配置（label、value、type）
    count: ordersStore.list.filter((o) => o.status === s.value).length,
  }))
)

// 数量最多的状态，用来计算比例条的百分比（避免除以 0，最小取 1）
const maxCount = computed(() =>
  Math.max(...statusCount.value.map((s) => s.count), 1)
)

// 状态对应的颜色（比例条用）
const colorMap = {
  warning: '#e6a23c',
  primary: '#409eff',
  success: '#67c23a',
  info: '#909399',
}
</script>

<template>
  <!-- 统计卡片：一行 4 个，窄屏时自动换行 -->
  <el-row :gutter="16">
    <el-col :xs="12" :sm="6">
      <el-card class="stat-card">
        <div class="stat-label">订单总数</div>
        <div class="stat-value">{{ totalCount }}</div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="6">
      <el-card class="stat-card">
        <div class="stat-label">总金额（元）</div>
        <div class="stat-value">{{ totalAmount.toFixed(2) }}</div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="6">
      <el-card class="stat-card">
        <div class="stat-label">待付款</div>
        <div class="stat-value" style="color: #e6a23c">
          {{ statusCount[0].count }}
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="6">
      <el-card class="stat-card">
        <div class="stat-label">已完成</div>
        <div class="stat-value" style="color: #67c23a">
          {{ statusCount[2].count }}
        </div>
      </el-card>
    </el-col>
  </el-row>

  <!-- 各状态订单数量比例条 -->
  <el-card header="各状态订单数量" class="chart-card">
    <div v-for="s in statusCount" :key="s.value" class="bar-row">
      <span class="bar-label">{{ s.label }}</span>
      <!-- 比例条：宽度 = 数量 / 最大数量 * 100% -->
      <div class="bar-track">
        <div
          class="bar-fill"
          :style="{
            width: (s.count / maxCount) * 100 + '%',
            backgroundColor: colorMap[s.type],
          }"
        />
      </div>
      <span class="bar-count">{{ s.count }} 单</span>
    </div>
  </el-card>
</template>

<style scoped>
.stat-card {
  text-align: center;
  margin-bottom: 16px;
}

.stat-label {
  color: #909399;
  font-size: 13px;
}

.stat-value {
  font-size: 26px;
  font-weight: bold;
  margin-top: 8px;
}

.chart-card {
  margin-top: 8px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.bar-label {
  width: 60px;
  text-align: right;
  color: #606266;
}

.bar-track {
  flex: 1; /* 占据剩余宽度 */
  height: 14px;
  background-color: #f0f2f5;
  border-radius: 7px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.3s; /* 宽度变化时有过渡动画 */
}

.bar-count {
  width: 50px;
  color: #909399;
  font-size: 13px;
}
</style>
