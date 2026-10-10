<template>
  <!-- 菜单图标 -->
  <template v-if="icon">
    <el-icon v-if="isElIcon" class="el-icon">
      <component :is="iconComponent" />
    </el-icon>
    <div v-else :class="`i-svg:${icon}`" />
  </template>
  <template v-else>
    <div class="i-svg:menu" />
  </template>
  <!-- 菜单标题 -->
  <span v-if="title" class="ml-1">{{ translateRouteTitle(title) }}</span>
</template>

<script setup>// 迁移脚本把类型式 defineProps<{ icon?: string; title?: string }>() 清空了，这里补回运行时声明
const props = defineProps({
  icon: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  }
});
const isElIcon = computed(() => props.icon?.startsWith("el-icon"));
const iconComponent = computed(() => props.icon?.replace("el-icon-", ""));
</script>

<style lang="scss" scoped>
.el-icon {
  width: 14px !important;
  margin-right: 0 !important;
  color: currentcolor;
}

[class^="i-svg:"] {
  width: 14px;
  height: 14px;
  color: currentcolor !important;
}

.hideSidebar {
  .el-sub-menu,
  .el-menu-item {
    .el-icon {
      margin-left: 20px;
    }
  }

  [class^="i-svg:"] {
    margin-left: 20px;
  }
}
</style>
