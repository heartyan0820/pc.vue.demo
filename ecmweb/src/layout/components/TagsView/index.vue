<template>
  <div class="tags-container">
    <el-scrollbar class="scroll-container" :vertical="false" @wheel="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tagRef"
        :key="tag.fullPath"
        :class="'tags-item ' + (tagsViewStore.isActive(tag) ? 'active' : '')"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openContentMenu(tag, $event)"
      >
        {{ translateRouteTitle(tag.title) }}
        <el-icon
          v-if="!isAffix(tag)"
          class="tag-close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </el-scrollbar>

    <!-- tag标签操作菜单 -->
    <ul
      v-show="contentMenuVisible"
      class="contextmenu"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <div class="i-svg:refresh" />
        刷新
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <div class="i-svg:close" />
        关闭
      </li>
      <li @click="closeOtherTags">
        <div class="i-svg:close_other" />
        关闭其它
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <div class="i-svg:close_left" />
        关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <div class="i-svg:close_right" />
        关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <div class="i-svg:close_all" />
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script setup>
import { translateRouteTitle } from "@/utils/i18n";
import { useRoute, useRouter } from "vue-router";
import { resolve } from "path-browserify";
import { usePermissionStore, useTagsViewStore, useSettingsStore, useAppStore } from "@/store";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();
const appStore = useAppStore();
const { visitedViews } = storeToRefs(tagsViewStore);
const settingsStore = useSettingsStore();
const layout = computed(() => settingsStore.layout);
const selectedTag = ref({
  path: "",
  fullPath: "",
  name: "",
  title: "",
  affix: false,
  keepAlive: false
});
const affixTags = ref([]);
const left = ref(0);
const top = ref(0);
watch(
  route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  {
    immediate: true
    //初始化立即执行
  }
);
const contentMenuVisible = ref(false);
watch(contentMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeContentMenu);
  } else {
    document.body.removeEventListener("click", closeContentMenu);
  }
});
function filterAffixTags(routes, basePath = "/") {
  let tags = [];
  routes.forEach((route2) => {
    const tagPath = resolve(basePath, route2.path);
    if (route2.meta?.affix) {
      tags.push({
        path: tagPath,
        fullPath: tagPath,
        name: String(route2.name),
        title: route2.meta?.title || "no-name",
        affix: route2.meta?.affix,
        keepAlive: route2.meta?.keepAlive
      });
    }
    if (route2.children) {
      const tempTags = filterAffixTags(route2.children, basePath + route2.path);
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags];
      }
    }
  });
  return tags;
}
function initTags() {
  const tags = filterAffixTags(permissionStore.routes);
  affixTags.value = tags;
  for (const tag of tags) {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}
function addTags() {
  if (route.meta.title) {
    tagsViewStore.addView({
      name: route.name,
      title: route.meta.title,
      path: route.path,
      fullPath: route.fullPath,
      affix: route.meta?.affix,
      keepAlive: route.meta?.keepAlive,
      query: route.query
    });
  }
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const tag of visitedViews.value) {
      if (tag.path === route.path) {
        if (tag.fullPath !== route.fullPath) {
          tagsViewStore.updateVisitedView({
            name: route.name,
            title: route.meta.title || "",
            path: route.path,
            fullPath: route.fullPath,
            affix: route.meta?.affix,
            keepAlive: route.meta?.keepAlive,
            query: route.query
          });
        }
      }
    }
  });
}
function isAffix(tag) {
  return tag?.affix;
}
function isFirstView() {
  return selectedTag.value.path === "/index" || selectedTag.value.fullPath === tagsViewStore.visitedViews[1]?.fullPath;
}
function isLastView() {
  return selectedTag.value.fullPath === tagsViewStore.visitedViews[tagsViewStore.visitedViews.length - 1]?.fullPath;
}
function refreshSelectedTag(view) {
  tagsViewStore.delCachedView(view);
  const { fullPath } = view;
  nextTick(() => {
    router.replace("/redirect" + fullPath);
  });
}
function closeSelectedTag(view) {
  tagsViewStore.delView(view).then((res) => {
    if (tagsViewStore.isActive(view)) {
      tagsViewStore.toLastView(res.visitedViews, view);
    }
  });
}
function closeLeftTags() {
  tagsViewStore.delLeftViews(selectedTag.value).then((res) => {
    if (!res.visitedViews.find((item) => item.path === route.path)) {
      tagsViewStore.toLastView(res.visitedViews);
    }
  });
}
function closeRightTags() {
  tagsViewStore.delRightViews(selectedTag.value).then((res) => {
    if (!res.visitedViews.find((item) => item.path === route.path)) {
      tagsViewStore.toLastView(res.visitedViews);
    }
  });
}
function closeOtherTags() {
  router.push(selectedTag.value);
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}
function closeAllTags(view) {
  tagsViewStore.delAllViews().then((res) => {
    tagsViewStore.toLastView(res.visitedViews, view);
  });
}
function openContentMenu(tag, e) {
  const menuMinWidth = 105;
  const offsetLeft = proxy?.$el.getBoundingClientRect().left;
  const offsetWidth = proxy?.$el.offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const l = e.clientX - offsetLeft + 15;
  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }
  if (layout.value === "mix") {
    top.value = e.clientY - 50;
  } else {
    top.value = e.clientY;
  }
  contentMenuVisible.value = true;
  selectedTag.value = tag;
}
function closeContentMenu() {
  contentMenuVisible.value = false;
}
function handleScroll() {
  closeContentMenu();
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
const againActiveTop = (newVal) => {
  if (layout.value !== "mix") return;
  const parent = findOutermostParent(permissionStore.routes, newVal);
  if (appStore.activeTopMenu !== parent.path) {
    appStore.activeTopMenu(parent.path);
  }
};
watch(
  () => route.name,
  (newVal) => {
    if (newVal) {
      againActiveTop(newVal);
    }
  },
  {
    deep: true
  }
);
onMounted(() => {
  initTags();
});
</script>

<style lang="scss" scoped>
.tags-container {
  width: 100%;
  height: $tags-view-height;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 1px var(--el-box-shadow-light);

  .tags-item {
    display: inline-block;
    padding: 3px 8px;
    margin: 4px 0 0 5px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--el-border-color-light);

    &:hover {
      color: var(--el-color-primary);
    }

    &:first-of-type {
      margin-left: 15px;
    }

    &:last-of-type {
      margin-right: 15px;
    }

    .tag-close-icon {
      vertical-align: -0.15em;
      cursor: pointer;
      border-radius: 50%;

      &:hover {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }

    &.active {
      color: #fff;
      background-color: var(--el-color-primary);

      &::before {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        content: "";
        background: #fff;
        border-radius: 50%;
      }

      .tag-close-icon:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }
    }
  }
}

.contextmenu {
  position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);

  li {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}

.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .el-scrollbar__bar {
    bottom: 0;
  }

  .el-scrollbar__wrap {
    height: 49px;
  }
}
</style>
