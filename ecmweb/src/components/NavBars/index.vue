<template>
  <div class="base-wrap clearfix">
    <div class="header-nav header-nav-box">
      <ul>
        <li
          v-for="(item, index) in navList"
          :key="index"
          :class="currentView === item.path ? 'cur' : ''"
          @click="openView(item.path)"
        >
          {{ item.meta.title }}
        </li>
      </ul>
      <div class="header-dibu"></div>
    </div>
  </div>
</template>

<script setup>import router from "@/router";
import { useRoute } from "vue-router";
import PcAPI from "@/api/nav";
import { getAccessToken } from "@/utils/auth";
const isLogins = getAccessToken();
const route = useRoute();
const currentView = ref("");
watch(
  () => route.path,
  // 监听路由路径变化
  () => {
    if (route.path == "/details" || route.path == "/orders") {
      currentView.value = "/orders";
    } else if (route.path == "/softwarecenter" || route.path == "/help" || route.path == "/operating" || route.path == "/installmanual" || route.path == "/designend" || route.path == "/factoryend") {
      currentView.value = "/softwarecenter";
    } else {
      currentView.value = route.path;
    }
  },
  { immediate: true }
  // 初始加载时立即执行
);
const queryParams = reactive({
  source: "PcWeb"
});
const navList = ref();
function handleQuery() {
  if (isLogins) {
    PcAPI.getList(queryParams).then((data) => {
      navList.value = data;
    });
  } else {
    PcAPI.getNoList(queryParams).then((data) => {
      navList.value = data;
    });
  }
}
function openView(url) {
  router.push(url).catch((err) => {
    console.warn(err);
  });
  currentView.value = url;
}
onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
.base-wrap {
  background: #ffffff;
  height: 100%;
  position: relative;
}
.header-logo {
  float: left;
  height: 68px;
  overflow: hidden;
  img {
    margin: 6px 0px 0px 0px;
  }
}
.header-nav {
  height: 67px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  ul {
    height: 100%;
    display: flex;
    align-items: center;
    font-family: Noto Sans SC;
    li {
      font-size: 19px;
      line-height: 28px;
      font-weight: 400;
      padding: 0px 20px 0px 21px;
      //padding: 0 20px;
      position: relative;
      color: #000;
      i.el-icon-arrow-down,
      i.el-icon-arrow-up {
        margin-left: 4px;
        font-size: 19px;
        font-weight: bolder;
        color: #b6c1c9;
      }
      i.el-icon-arrow-down {
        display: inline-block;
      }
      i.el-icon-arrow-up {
        display: none;
      }
    }
  }
  &.header-nav-box {
    li {
      cursor: pointer;
      &.cur {
        color: #4e93f5;
        font-weight: 700;
      }
      &:hover {
        color: #4e93f5;
        //border-top: 4px solid #409eff;
        .subnav-hd {
          display: block;
        }
        i.el-icon-arrow-down {
          display: none;
        }
        i.el-icon-arrow-up {
          display: inline-block;
        }
      }
    }
  }
  .subnav-hd {
    width: unset;
    position: absolute;
    z-index: 100;
    top: 66px;
    left: 0;
    display: none;
    background-color: #ffffff;
    color: #333f48;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    align-items: flex-start;
    ul {
      display: flex;
      flex-direction: column;
      li {
        width: 100%;
        padding: 0 34px;
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        word-break: keep-all;
        white-space: nowrap;
        border-top: none;
        color: #333f48;
        &:hover {
          background-color: #eff3f5;
          box-shadow: none;
          border-top: none;
          color: #4e93f5;
          font-weight: 600;
        }
      }
    }
  }
}
.header-dibu {
  position: relative;
  display: flex;
  height: 4px;
  width: 100%;
  background-color: #4e93f5;
  justify-content: center;
  margin: 0 auto;
}
</style>
