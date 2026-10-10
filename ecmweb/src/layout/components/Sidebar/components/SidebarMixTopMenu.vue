<!-- 混合布局顶部菜单 -->
<template>
  <el-scrollbar>
    <el-menu
      mode="horizontal"
      :default-active="activePath"
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
      @select="handleMenuSelect"
    >
      <el-menu-item v-for="route in topMenus" :key="route.path" :index="route.path">
        <template #title>
          <template v-if="route.meta && route.meta.icon">
            <el-icon v-if="route.meta.icon.startsWith('el-icon')" class="sub-el-icon">
              <component :is="route.meta.icon.replace('el-icon-', '')" />
            </el-icon>
            <div v-else :class="`i-svg:${route.meta.icon}`" />
          </template>
          <span v-if="route.path === '/'">首页</span>
          <span v-else-if="route.meta && route.meta.title" class="ml-1">
            {{ translateRouteTitle(route.meta.title) }}
          </span>
        </template>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { translateRouteTitle } from "@/utils/i18n";
import variables from "@/styles/variables.module.scss";
import { SidebarColorEnum } from "@/enums/ThemeEnum";
import { usePermissionStore, useAppStore, useSettingsStore } from "@/store";
const router = useRouter();
const appStore = useAppStore();
const permissionStore = usePermissionStore();
const settingsStore = useSettingsStore();
const activePath = computed(() => appStore.activeTopMenuPath);
const theme = computed(() => settingsStore.theme);
const sidebarColorScheme = computed(() => settingsStore.sidebarColorScheme);
const topMenus = ref([]);
const activeTopMenuPath = useRoute().path.split("/").filter(Boolean).length > 1 ? useRoute().path.match(/^\/[^/]+/)?.[0] || "/" : "/";
appStore.activeTopMenu(activeTopMenuPath);
const handleMenuSelect = (routePath) => {
  appStore.activeTopMenu(routePath);
  permissionStore.setMixedLayoutLeftRoutes(routePath);
  navigateToFirstLeftMenu(permissionStore.mixedLayoutLeftRoutes);
};
const navigateToFirstLeftMenu = (menus) => {
  if (menus.length === 0) return;
  const [firstMenu] = menus;
  if (firstMenu.children && firstMenu.children.length > 0) {
    navigateToFirstLeftMenu(firstMenu.children);
  } else if (firstMenu.name) {
    router.push({
      name: firstMenu.name,
      query: typeof firstMenu.meta?.params === "object" ? firstMenu.meta.params : void 0
    });
  }
};
onMounted(() => {
  topMenus.value = permissionStore.routes.filter((item) => !item.meta || !item.meta.hidden);
});
</script>
