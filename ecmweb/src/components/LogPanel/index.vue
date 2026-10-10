<!-- LogPanel.vue -->
<template>
  <div class="log-panel" :class="{ expanded: isExpanded, minimized: !isExpanded }">
    <!-- 控制按钮 -->
    <div class="log-control" @click="toggleExpand">
      <span class="log-title">&nbsp;</span>
      <!-- <svg
        class="toggle-icon"
        :class="{ rotated: isExpanded }"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg> -->
    </div>

    <!-- 日志内容区域 -->
    <transition name="log-slide">
      <div v-if="isExpanded" class="log-content">
        <!-- 操作栏 -->
        <div class="log-actions">
          <button class="log-btn clear-btn" @click="clearLogs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
            清空日志
          </button>
          <div class="log-filter">
            <label class="filter-label">过滤类型：</label>
            <select v-model="selectedFilter" class="filter-select">
              <option value="all">全部</option>
              <option value="info">信息</option>
              <option value="success">成功</option>
              <option value="warning">警告</option>
              <option value="error">错误</option>
            </select>
          </div>
        </div>

        <!-- 日志列表 -->
        <div ref="logContainer" class="log-list">
          <div
            v-for="(log, index) in filteredLogs"
            :key="index"
            class="log-item"
            :class="`log-${log.type}`"
          >
            <span class="log-time">{{ log.timestamp }}</span>
            <span class="log-type-badge">{{ getTypeLabel(log.type) }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
          <div v-if="filteredLogs.length === 0" class="log-empty">暂无匹配日志</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>import { ref, watch, onMounted } from "vue";
import { useWebSocketStore } from "@/store";
const websocketStore = useWebSocketStore();
// 迁移脚本清空了 defineProps/defineEmits，这里补回运行时声明
const props = defineProps({
  maxLogs: {
    type: Number,
    default: 100
  },
  initiallyExpanded: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["logAdded"]);
const maxLogs = props.maxLogs || 100;
const isExpanded = ref(props.initiallyExpanded || false);
const logs = ref([]);
const selectedFilter = ref("all");
const filteredLogs = ref([]);
const logContainer = ref(null);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
const getTypeLabel = (type) => {
  const labels = {
    info: "信息",
    success: "成功",
    warning: "警告",
    error: "错误"
  };
  return labels[type];
};
const filterLogs = () => {
  if (selectedFilter.value === "all") {
    filteredLogs.value = [...logs.value];
  } else {
    filteredLogs.value = logs.value.filter((log) => log.type === selectedFilter.value);
  }
};
watch(
  () => websocketStore.msgEvent,
  (newMessage, oldMessage) => {
    if (newMessage) {
      addLog("info", newMessage);
    }
  },
  { immediate: false }
  // 不立即执行，只在消息变化时执行
);
watch(selectedFilter, filterLogs);
watch(
  filteredLogs,
  () => {
    if (logContainer.value && isExpanded.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  },
  { deep: true }
);
const addLog = (type, message) => {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const newLog = { type, message, timestamp };
  logs.value.push(newLog);
  if (logs.value.length > maxLogs) {
    logs.value.shift();
  }
  filterLogs();
  emit("logAdded", newLog);
};
const clearLogs = () => {
  logs.value = [];
  filteredLogs.value = [];
};
onMounted(() => {
  filterLogs();
});
defineExpose({
  addLog
});
</script>

<style scoped>
.log-panel {
  position: fixed;
  bottom: -20px;
  left: 0;
  z-index: 9999;
  color: #e0e0e0;
  border-radius: 8px 8px 0 0;
  font-family: "Consolas", "Monaco", monospace;
  transition: all 0.3s ease;
  max-width: 90vw;
}

.log-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 1px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
}

.log-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  height: 15px;
  width: 15px;
}

.toggle-icon {
  transition: transform 0.3s ease;
  margin-top: -22px;
}

.rotated {
  transform: rotate(180deg);
}

.log-content {
  width: 480px;
  max-height: 400px;
  overflow: hidden;
}

/* 展开/收起动画 */
.log-slide-enter-from,
.log-slide-leave-to {
  height: 0;
  opacity: 0;
}

.log-slide-enter-active,
.log-slide-leave-active {
  transition:
    height 0.3s ease,
    opacity 0.3s ease;
}

.log-slide-enter-to {
  height: 400px;
  opacity: 1;
}

.log-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #3d3d5c;
}

.log-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #3d3d5c;
  color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 13px;
}

.log-btn:hover {
  background-color: #4d4d7c;
}

.clear-btn {
  background-color: #4a4a6a;
}

.clear-btn:hover {
  background-color: #5a5a8a;
}

.log-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.filter-label {
  color: #b0b0c0;
}

.filter-select {
  padding: 4px 8px;
  border: 1px solid #3d3d5c;
  border-radius: 4px;
  background-color: #2d2d44;
  color: #e0e0e0;
  cursor: pointer;
}

.log-list {
  height: calc(400px - 50px);
  overflow-y: auto;
  padding: 12px 16px;
  line-height: 1.6;
  color: #000;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid #2d2d44;
  font-size: 13px;
}

.log-time {
  color: #8888a8;
  width: 50px;
  font-size: 12px;
}

.log-type-badge {
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
}

.log-message {
  flex: 1;
  word-break: break-all;
}

/* 日志类型样式 */
.log-info .log-type-badge {
  background-color: #4299e1;
  color: white;
}

.log-success .log-type-badge {
  background-color: #48bb78;
  color: white;
}

.log-warning .log-type-badge {
  background-color: #ed8936;
  color: white;
}

.log-error .log-type-badge {
  background-color: #e53e3e;
  color: white;
}

.log-empty {
  text-align: center;
  padding: 20px;
  color: #8888a8;
  font-size: 13px;
}

/* 滚动条样式 */
.log-list::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.log-list::-webkit-scrollbar-track {
  background: #2d2d44;
  border-radius: 3px;
}

.log-list::-webkit-scrollbar-thumb {
  background: #4a4a6a;
  border-radius: 3px;
}

.log-list::-webkit-scrollbar-thumb:hover {
  background: #5a5a8a;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .log-content {
    width: 320px;
  }

  .log-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
