<script setup>
// ecmweb 根组件：演示页面，可按需替换为路由/布局
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div class="ecmweb-root">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>ECM Web - 第二个 Tauri 桌面项目</span>
          <el-tag type="success" size="small">独立 Web 项目</el-tag>
        </div>
      </template>
      <p>这是和 <code>src/</code> 平级的独立 Vite + Vue3 应用。</p>
      <p>通过 <code>pnpm tauri:dev:ecmweb</code> / <code>pnpm tauri:build:ecmweb</code> 切换。</p>
      <el-space>
        <el-button type="primary" @click="count++">点击次数: {{ count }}</el-button>
        <el-button @click="count = 0">重置</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<style scoped>
.ecmweb-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%);
  padding: 24px;
}
.box-card {
  width: 520px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
