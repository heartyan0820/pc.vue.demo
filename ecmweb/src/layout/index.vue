<template>
  <div class="layout" :class="layoutClass">
    <!-- 移动端遮罩层 -->
    <div class="layout-web">
      <div class="navBars">
        <NavBars1 ref="navref" />
      </div>
      <div class="yingyin">&nbsp;</div>
      <Banner v-if="router == '/index'" />
      <AppMain @callheadermethods="handleCallHeaderMethods" @featchMyNotice="featchMyNotice" />
      <Bottom />
    </div>
    <div>
      <!-- <FloatBall
        v-if="isAi && !router.includes('/details') && router != '/orders'"
        v-model="roomId"
        :bgColor="FloatBallBgColor"
        :title="FloatBallTitle"
        :ecmName="ecmName"
      /> -->
    </div>

    <LogPanel ref="logPanelRef" :max-logs="200" :initially-expanded="false" />

    <div id="charOnline" @click="charOnlineClick"></div>
    <div id="charOnAi" @click="charcharAiClick"></div>
  </div>
</template>

<script setup>
import NavBars1 from "./components/NavBar/index.vue";
import { useAppStore, useSettingsStore, usePermissionStore } from "@/store";
import ChatFriendAPI from "@/api/chatfriend";
import { getAccessToken } from "@/utils/auth";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { useChatStore } from "@/store";
const router = ref("ECM AI");
const chatStore = useChatStore();
const appStore = useAppStore();
const isAi = ref(false);
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const width = useWindowSize().width;
const FloatBallBgColor = ref("#ffffff");
const FloatBallTitle = ref("AI下单");
const ecmName = ref("ECM AI");
const roomId = ref(0);
const WIDTH_DESKTOP = 992;
const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);
const isWeb = computed(() => appStore.device === DeviceEnum.DESKTOP);
const isSidebarOpen = computed(() => appStore.sidebar.opened);
const activeTopMenuPath = computed(() => appStore.activeTopMenuPath);
const navref = ref(null);
watch(
  () => activeTopMenuPath.value,
  (newVal) => {
    permissionStore.setMixedLayoutLeftRoutes(newVal);
  },
  { deep: true, immediate: true }
);
watchEffect(() => {
  const isDesktop = width.value >= WIDTH_DESKTOP;
  appStore.toggleDevice(isDesktop ? DeviceEnum.DESKTOP : DeviceEnum.MOBILE);
  if (isDesktop) {
    appStore.openSideBar();
  } else {
    appStore.closeSideBar();
  }
});
const router1 = useRouter();
watch(
  () => router1.currentRoute.value.path,
  (newPath, oldPath) => {
    router.value = newPath;
    chatStore.router = newPath;
    if (newPath == "/details") {
      chatStore.toggleActiveIndex(1);
    } else if (newPath == "/orders") {
      chatStore.toggleActiveIndex(0);
    }
  },
  { immediate: true, deep: true }
);
const route = useRoute();
watch(route, (val) => {
  if (isMobile.value && isSidebarOpen.value) {
    appStore.closeSideBar();
  }
});
const layoutClass = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  mobile: appStore.device === DeviceEnum.MOBILE,
  [`layout-${settingsStore.layout}`]: true
}));
function getAiData(id) {
  ChatFriendAPI.getList({
    onlyAi: true,
    addAi: true
  }).then((res) => {
    if (res.data.list.length > 0) {
      ecmName.value = res.data.list[0].nickName;
      roomId.value = res.data.list[0].roomId;
      if (id == 1) {
        isAi.value = false;
        nextTick(() => {
          isAi.value = true;
        });
        setTimeout(() => {
          const charAiElement = document.getElementById("charAi");
          if (charAiElement) {
            charAiElement.click();
          }
        }, 200);
      } else {
        isAi.value = true;
      }
    }
  });
}
function getAi(id) {
  const isLogins = getAccessToken();
  if (isLogins) {
    isAi.value = true;
  } else {
    isAi.value = false;
  }
}
function charOnlineClick() {
  isAi.value = false;
  ecmName.value = "在线沟通";
  nextTick(() => {
    isAi.value = true;
  });
  setTimeout(() => {
    const charAiElement = document.getElementById("charAi");
    if (charAiElement) {
      charAiElement.click();
    }
  }, 200);
}
const handleCallHeaderMethods = async () => {
  if (!navref.value) {
    console.warn("子组件未挂载，无法调用方法");
    return;
  }
  navref.value.refreshNotify();
};
function featchMyNotice() {
  if (!navref.value) {
    console.warn("子组件未挂载，无法调用方法");
    return;
  }
  navref.value.refreshNotify();
}
async function charcharAiClick() {
  getAiData(1);
}
onMounted(() => {
  getAi(0);
});
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;

  .layout-web {
    background: #ffffff;
  }

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }

  &__sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: $sidebar-width;
    background-color: $menu-background;
    transition: width 0.28s;

    :deep(.el-menu) {
      border: none;
    }
  }

  &__main {
    position: relative;
    height: 100%;
    margin-left: $sidebar-width;
    overflow-y: auto;
    transition: margin-left 0.28s;

    .fixed-header {
      position: sticky;
      top: 0;
      z-index: 9;
      transition: width 0.28s;
    }
  }

  .navBars {
    width: 100%;
    height: 70px;
    box-shadow: 0px 0px 8px 0px rgba(7, 7, 7, 0.376);
  }

  .yingyin {
    width: 100%;
    height: 8px;
  }
}

// 占位符选择器
%layout__sidebar--horizontal {
  width: 100% !important;
  height: $navbar-height;

  :deep(.el-scrollbar) {
    flex: 1;
    height: $navbar-height;
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title),
  :deep(.el-menu--horizontal) {
    height: $navbar-height;
    line-height: $navbar-height;
  }
}

.layout-top {
  .layout__sidebar {
    position: sticky;
    display: flex;
    @extend %layout__sidebar--horizontal;
  }

  .layout__main {
    height: calc(100vh - $navbar-height);
    margin-left: 0;
  }
}

.layout-mix {
  .layout__sidebar {
    @extend %layout__sidebar--horizontal;
  }

  .layout__container {
    display: flex;
    height: 100%;
    padding-top: $navbar-height;

    .layout__sidebar--left {
      position: relative;
      width: $sidebar-width;
      height: 100%;
      background-color: var(--menu-background);

      :deep(.el-scrollbar) {
        height: calc(100vh - $navbar-height - 50px);
      }

      :deep(.el-menu) {
        height: 100%;
        border: none;
      }

      .layout__sidebar-toggle {
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0 0 6px -2px var(--el-color-primary);
      }
    }

    .layout__main {
      flex: 1;
      min-width: 0;
      margin-left: 0;
    }
  }
}

.hideSidebar {
  &.layout-left {
    .layout__main {
      margin-left: $sidebar-width-collapsed;
    }
  }

  &.layout-top {
    .layout__main {
      margin-left: 0;
    }
  }

  &.layout-mix {
    .layout__sidebar {
      width: 100%;
    }

    .layout__container {
      .layout__sidebar--left {
        width: $sidebar-width-collapsed;
      }
    }
  }
}

.layout-left {
  &.hideSidebar {
    .layout__sidebar {
      width: $sidebar-width-collapsed;
    }

    .layout__main {
      margin-left: $sidebar-width-collapsed;
    }

    &.mobile {
      .layout__sidebar {
        pointer-events: none;
        transform: translate3d(-$sidebar-width, 0, 0);
        transition-duration: 0.3s;
      }

      .layout__main {
        margin-left: 0;
      }
    }
  }

  &.openSidebar {
    &.mobile {
      .layout__main {
        margin-left: 0;
      }
    }
  }
}
</style>
