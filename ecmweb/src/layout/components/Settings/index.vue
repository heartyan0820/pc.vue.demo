<template>
  <el-drawer v-model="settingsVisible" size="300" :title="$t('settings.project')">
    <el-divider>{{ $t("settings.theme") }}</el-divider>

    <div class="flex-center">
      <el-switch v-model="isDark" active-icon="Moon" inactive-icon="Sunny" @change="changeTheme" />
    </div>

    <el-divider>{{ $t("settings.interface") }}</el-divider>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ $t("settings.themeColor") }}</span>
      <ThemeColorPicker v-model="settingsStore.themeColor" @update:model-value="changeThemeColor" />
    </div>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ $t("settings.tagsView") }}</span>
      <el-switch v-model="settingsStore.tagsView" />
    </div>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ $t("settings.sidebarLogo") }}</span>
      <el-switch v-model="settingsStore.sidebarLogo" />
    </div>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ $t("settings.watermark") }}</span>
      <el-switch v-model="settingsStore.watermarkEnabled" />
    </div>
    <div v-if="!isDark" class="py-1 flex-x-between">
      <span class="text-xs">{{ $t("settings.sidebarColorScheme") }}</span>
      <el-radio-group v-model="sidebarColor" @change="changeSidebarColor">
        <el-radio :value="SidebarColorEnum.CLASSIC_BLUE">{{ $t("settings.classicBlue") }}</el-radio>
        <el-radio :value="SidebarColorEnum.MINIMAL_WHITE">
          {{ $t("settings.minimalWhite") }}
        </el-radio>
      </el-radio-group>
    </div>

    <el-divider>{{ $t("settings.navigation") }}</el-divider>

    <LayoutSelect v-model="settingsStore.layout" @update:model-value="changeLayout" />
  </el-drawer>
</template>

<script setup>
import { SidebarColorEnum } from "@/enums/ThemeEnum";
import { LayoutEnum } from "@/enums/LayoutEnum";
import { ThemeEnum } from "@/enums/ThemeEnum";
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";
const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
const sidebarColor = ref(settingsStore.sidebarColorScheme);
const settingsVisible = computed({
  get() {
    return settingsStore.settingsVisible;
  },
  set() {
    settingsStore.settingsVisible = false;
  }
});
function changeThemeColor(color) {
  settingsStore.changeThemeColor(color);
}
const changeTheme = (val) => {
  isDark.value = val;
  settingsStore.changeTheme(isDark.value ? ThemeEnum.DARK : ThemeEnum.LIGHT);
};
const changeSidebarColor = (val) => {
  settingsStore.changeSidebarColor(val);
};
function changeLayout(layout) {
  settingsStore.changeLayout(layout);
  if (layout === LayoutEnum.MIX) {
    route.name && againActiveTop(route.name);
  }
}
function againActiveTop(routeName) {
  const parent = findOutermostParent(permissionStore.routes, routeName);
  if (appStore.activeTopMenuPath !== parent.path) {
    appStore.activeTopMenu(parent.path);
  }
}
function findOutermostParent(tree, findName) {
  let parentMap = {};
  function buildParentMap(node, parent) {
    parentMap[node.name] = parent;
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        buildParentMap(node.children[i], node);
      }
    }
  }
  for (let i = 0; i < tree.length; i++) {
    buildParentMap(tree[i], null);
  }
  let currentNode = parentMap[findName];
  while (currentNode) {
    if (!parentMap[currentNode.name]) {
      return currentNode;
    }
    currentNode = parentMap[currentNode.name];
  }
  return null;
}
</script>

<style lang="scss" scoped></style>
