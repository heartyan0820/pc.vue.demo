<template>
  <div :class="['navbar__right', navbarRightClass]">
    <!-- 桌面端显示 -->
    <template v-if="isDesktop">
      <!-- 全屏 -->
      <Fullscreen />
      <!-- 通知下拉 -->
      <NoticeDropdown ref="noticeref" />
    </template>
    <!-- 用户头像（个人中心、注销登录等） -->
    <el-dropdown v-if="islogin" trigger="click">
      <div class="user-profile">
        <div class="user-profile-img">
          <img class="user-profile__avatar" :src="userStore.userInfo?.avatar" />
        </div>
        <div class="user-profile-txt">
          <div class="user-profile-name" :title="userStore.userInfo.members?.name">
            {{ userStore.userInfo.members?.name }}
          </div>
          <div class="user-profile-name1">
            {{
              userStore.userInfo.members?.orgRoleName == ""
                ? "暂无"
                : userStore.userInfo.members?.orgRoleName
            }}
          </div>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="toUser">
            {{ $t("navbar.profile") }}
          </el-dropdown-item>
          <el-dropdown-item divided @click="logout">
            {{ $t("navbar.logout") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div v-else class="user-login" @click="toUser">
      <img src="/images/user.png" height="16px" />
    </div>
  </div>
</template>
<script setup>import { DeviceEnum } from "@/enums/DeviceEnum";
import {
  useAppStore,
  useSettingsStore,
  useUserStore,
  useTagsViewStore,
  useWebSocketStore
} from "@/store";
import { getAccessToken, clearQueryParamsData, clearPcPatientName } from "@/utils/auth";
import { SidebarColorEnum, ThemeEnum } from "@/enums/ThemeEnum";
const appStore = useAppStore();
const settingStore = useSettingsStore();
const userStore = useUserStore();
const websocketStore = useWebSocketStore();
const tagsViewStore = useTagsViewStore();
const isLogins = getAccessToken();
const islogin = ref(false);
islogin.value = isLogins == "" ? false : true;
const route = useRoute();
const router = useRouter();
const isDesktop = computed(() => appStore.device === DeviceEnum.DESKTOP);
const noticeref = ref(null);
const navbarRightClass = computed(() => {
  if (settingStore.theme === ThemeEnum.DARK) {
    return "navbar__right--white";
  }
  if (settingStore.sidebarColorScheme === SidebarColorEnum.CLASSIC_BLUE) {
    return "navbar__right--white";
  }
});
function logout() {
  ElMessageBox.confirm("确定退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).then(() => {
    userStore.logout().then(() => {
      websocketStore.disconnect();
      tagsViewStore.delAllViews();
      clearQueryParamsData();
      clearPcPatientName();
      islogin.value = false;
    }).then(() => {
      refreshNotify();
      router.push(`/index?redirect=${route.fullPath}`);
    });
  });
}
function toUser() {
  const bool = islogin.value;
  const { path, queryParams } = parseRedirect();
  if (bool) {
    router.push({ name: "user" });
  } else {
    if (path == "/order" && queryParams.name != void 0 && queryParams.name != "") {
      const query = route.query;
      router.push(`/login?redirect=${query.redirect}&id=${query.id}`);
    } else if (path == "/details" && queryParams.id != void 0 && queryParams.id > 0) {
      const query = route.query;
      router.push(`/login?redirect=${query.redirect}`);
    } else {
      router.push(`/login?redirect=${path}`);
    }
  }
}
function parseRedirect() {
  const query = route.query;
  const redirect = query.redirect ?? "/";
  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  return { path, queryParams };
}
onMounted(() => {
});
const refreshNotify = () => {
  if (!noticeref.value) {
    console.warn("子组件未挂载，无法调用方法");
    return;
  }
  noticeref.value.refreshNotify();
};
defineExpose({
  refreshNotify
});
</script>

<style lang="scss" scoped>
.navbar__right {
  display: flex;
  width: 230px;
  align-items: center;
  justify-content: space-evenly;
  & > * {
    display: flex;
    min-width: 40px;
    height: $navbar-height;
    line-height: $navbar-height;
    color: var(--el-text-color);
    text-align: center;
    cursor: pointer;
    align-items: center;
    justify-content: space-evenly;
    // &:hover {
    //   background: rgb(0 0 0 / 10%);
    // }
  }
  .user-profile {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 13px;
    color: #333f48;
    .user-profile-img {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .user-profile-txt {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      font-family: Noto Sans SC;
      flex-flow: column;
      width: 100%;
      overflow: hidden;
      .user-profile-name {
        font-size: 17px;
        display: flex;
        justify-content: center;
        height: 25px;
        line-height: 25px;
        font-weight: 500;
        overflow: hidden;
      }
      .user-profile-name1 {
        font-size: 16px;
        display: flex;
        align-items: center;
        height: 25px;
        color: #757575;
        font-weight: 500;
      }
    }
  }
  .user-profile:hover {
    color: #3d7eff;
    .user-profile-name1 {
      color: #3d7eff;
    }
  }
  .user-login {
    display: flex;
    width: auto;
    align-items: center;
    justify-content: space-evenly;
    span {
      font-family: Source Han Sans SC;
      font-weight: 500;
      font-size: 16px;
      color: #ffffff;
    }
    img {
      height: 16px;
    }
  }
  .user-login:hover img {
    content: url(/images/userhove.png);
  }
}
:deep(.el-dropdown-menu__item) {
  align-items: center;
  color: var(--el-text-color-regular);
  font-family: Noto Sans SC;
  cursor: pointer;
  display: flex;
  line-height: 22px;
  list-style: none;
  margin: 0;
  outline: none;
  padding: 5px 16px;
  white-space: nowrap;
  font-size: 16px;
}
.layout-top .navbar__right--white > *,
.layout-mix .navbar__right--white > * {
  color: #fff;
}

.dark .navbar__right > *:hover {
  color: #ccc;
}
</style>
