<!-- 菜单组件 -->
<template>
  <el-menu
    ref="menuRef"
    :default-active="currentRoute.path"
    :collapse="!appStore.sidebar.opened"
    :background-color="
      theme === 'dark' || sidebarColorScheme === SidebarColorEnum.CLASSIC_BLUE
        ? variables['menu-background']
        : undefined
    "
    :text-color="
      theme === 'dark' || sidebarColorScheme === SidebarColorEnum.CLASSIC_BLUE
        ? variables['menu-text']
        : undefined
    "
    :active-text-color="
      theme === 'dark' || sidebarColorScheme === SidebarColorEnum.CLASSIC_BLUE
        ? variables['menu-active-text']
        : undefined
    "
    :popper-effect="theme"
    :unique-opened="false"
    :collapse-transition="false"
    :mode="menuMode"
    @open="onMenuOpen"
    @close="onMenuClose"
  >
    <!-- 菜单项 -->
    <SidebarMenuItem
      v-for="route in data"
      :key="route.path"
      :item="route"
      :base-path="resolveFullPath(route.path)"
    />
  </el-menu>
</template>

<script setup>
import { SidebarColorEnum } from "@/enums/ThemeEnum";
import variables from "@/styles/variables.module.scss";
import path from "path-browserify";
import { LayoutEnum } from "@/enums/LayoutEnum";
import { useSettingsStore, useAppStore } from "@/store";
import { isExternal } from "@/utils/index";
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  basePath: {
    type: String,
    required: true,
    example: "/system"
  }
});
const menuRef = ref();
const settingsStore = useSettingsStore();
const appStore = useAppStore();
const currentRoute = useRoute();
const expandedMenuIndexes = ref([]);
const menuMode = computed(() => {
  return settingsStore.layout === LayoutEnum.TOP ? "horizontal" : "vertical";
});
const theme = computed(() => settingsStore.theme);
const sidebarColorScheme = computed(() => settingsStore.sidebarColorScheme);
function resolveFullPath(routePath) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  return path.resolve(props.basePath, routePath);
}
const onMenuOpen = (index) => {
  expandedMenuIndexes.value.push(index);
};
const onMenuClose = (index) => {
  expandedMenuIndexes.value = expandedMenuIndexes.value.filter((item) => item !== index);
};
watch(
  () => menuMode.value,
  () => {
    if (menuMode.value === "horizontal") {
      expandedMenuIndexes.value.forEach((item) => menuRef.value.close(item));
    }
  }
);
</script>
