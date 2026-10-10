<template>
  <el-config-provider :locale="locale" :size="size">
    <!-- 开启水印 -->
    <el-watermark
      :font="{ color: fontColor }"
      :content="watermarkEnabled ? watermarkContent : ''"
      class="wh-full"
    >
      <router-view />
    </el-watermark>
  </el-config-provider>
</template>

<script setup>import { useAppStore, useSettingsStore, useUserStore } from "@/store";
import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const locale = computed(() => appStore.locale);
const size = computed(() => appStore.size);
const watermarkEnabled = computed(() => settingsStore.watermarkEnabled);
const watermarkContent = computed(
  () => userStore.userInfo.name ? userStore.userInfo.name : defaultSettings.watermarkContent
);
const fontColor = computed(() => {
  return settingsStore.theme === ThemeEnum.DARK ? "rgba(255, 255, 255, .15)" : "rgba(0, 0, 0, .15)";
});
</script>
<style>
#body {
  color: #000;
}
body #message_1 {
  position: absolute;
  top: 500px;
  margin-top: 0 !important;
}
/* 通知容器居中 */
.el-notification-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 保持顶部对齐，如需垂直居中可改为 center */
  width: 100%;
}
.el-notification.right {
  right: 45%;
}
/* 自定义类名，确保单个通知也居中 */
.center-notification {
  margin: 0 auto;
}
.el-notification__content {
  font-size: 18px;
  color: #000;
}
/* 可选：调整通知的宽度 */
.el-notification {
  top: 33% !important;
  /* transition: opacity 0.8s ease !important;
   确保居中不受动画影响 */
  margin: 0 auto !important;
}
</style>
