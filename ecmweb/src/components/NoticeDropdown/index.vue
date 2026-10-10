<template>
  <div class="notice">
    <el-dropdown class="h-full items-center justify-center" trigger="click">
      <el-badge v-if="notice > 0" :value="notice" :max="99999" @click="to('orders')">
        <img src="/images/tzhove.png" height="19px" @click="to('orders')" />
      </el-badge>

      <div v-else>
        <img src="/images/tz.png" height="19px" />
      </div>

      <!--<template #dropdown>
        <div class="p-5">
          <template v-if="noticeList.length > 0">
             <div v-for="(item, index) in noticeList" :key="index" class="w500px py-3">
              <div class="flex-y-center">
                <DictLabel v-model="item.type" code="notice_type" size="small" />
                <el-text size="small" class="w200px cursor-pointer !ml-2 !flex-1" truncated>
                  {{ item.title }}
                </el-text>

                <div class="text-xs text-gray">
                  {{ item.publishTime }}
                </div>
              </div>
            </div>
            <el-divider />
            <div class="flex-x-between">
              <el-link type="primary" :underline="false" @click="handleViewMoreNotice">
                <span class="text-xs">查看更多</span>
                <el-icon class="text-xs">
                  <ArrowRight />
                </el-icon>
              </el-link>
              <el-link
                v-if="noticeList.length > 0"
                type="primary"
                :underline="false"
                @click="handleMarkAllAsRead"
              >
                <span class="text-xs">全部已读</span>
              </el-link>
            </div>
          </template>
          <template v-else>
            <div class="flex-center h150px w350px">
              <el-empty :image-size="50" description="暂无消息" />
            </div>
          </template>
        </div>
      </template> -->
    </el-dropdown>

    <el-dialog
      v-model="noticeDialogVisible"
      :title="noticeDetail?.title ?? '通知详情'"
      width="800px"
      custom-class="notice-detail"
    >
      <div v-if="noticeDetail" class="notice-detail__wrapper">
        <div class="notice-detail__meta">
          <span>
            <el-icon><User /></el-icon>
            {{ noticeDetail.publisherName }}
          </span>
          <span class="ml-2">
            <el-icon><Timer /></el-icon>
            {{ noticeDetail.publishTime }}
          </span>
        </div>

        <div class="notice-detail__content">
          <div v-html="noticeDetail.content"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>import NoticeAPI from "@/api/system/notice";
import router from "@/router";
import { getAccessToken } from "@/utils/auth";
const notice = ref(0);
const noticeDialogVisible = ref(false);
const noticeDetail = ref(null);
const isLogins = getAccessToken();
const timer = ref(null);
import { useStomp } from "@/hooks/useStomp";
const { subscribe, unsubscribe, isConnected } = useStomp();
function featchMyNotice() {
  const isLogins1 = getAccessToken();
  if (isLogins1) {
    NoticeAPI.getMyNoticePage({ pageIndex: 1, pageSize: 1, roomID: 0 }).then((data) => {
      notice.value = data.data.total;
    });
  } else {
    notice.value = 0;
  }
}
function settimer() {
  if (timer.value) clearInterval(timer.value);
  timer.value = setInterval(() => {
    featchMyNotice();
  }, 2e4);
}
onUnmounted(() => {
});
function stoptimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}
function handleReadNotice(id) {
  NoticeAPI.getDetail(id).then((data) => {
    noticeDialogVisible.value = true;
    noticeDetail.value = data;
    const index = noticeList.value.findIndex((notice2) => notice2.id === id);
    if (index >= 0) {
      noticeList.value.splice(index, 1);
    }
  });
}
function handleViewMoreNotice() {
  router.push({ path: "/myNotice" });
}
const refreshNotify = () => {
  featchMyNotice();
};
function handleMarkAllAsRead() {
  NoticeAPI.readAll().then(() => {
    noticeList.value = [];
  });
}
defineExpose({
  refreshNotify
});
onBeforeUnmount(() => {
  stoptimer();
});
onMounted(() => {
  if (isLogins) {
    featchMyNotice();
  }
});
onBeforeUnmount(() => {
  unsubscribe("/user/queue/message");
});
function to(url) {
  const currentPath = router.currentRoute.value.path;
  if (currentPath == "/orders") {
    window.location.reload();
  } else {
    // 防止相对路径被 Vue Router 4 拼到当前路径后，统一归一化为绝对路径
    const target = url.startsWith("/") ? url : `/${url}`;
    router.push(target).catch(() => {
      window.location.reload();
    });
  }
}
</script>

<style lang="scss" scoped>
.notice {
  :deep(.el-badge) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  :deep(.el-badge__content.is-fixed) {
    position: absolute;
    right: calc(1px + var(--el-badge-size) / 2);
    top: 25px;
    transform: translateY(-50%) translateX(100%);
    z-index: var(--el-index-normal);
  }
  .notice-detail {
    &__wrapper {
      padding: 0 20px;
    }

    &__meta {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }

    &__publisher {
      margin-right: 24px;

      i {
        margin-right: 4px;
      }
    }

    &__content {
      max-height: 60vh;
      padding-top: 16px;
      margin-bottom: 24px;
      overflow-y: auto;
      border-top: 1px solid var(--el-border-color);

      &::-webkit-scrollbar {
        width: 6px;
      }
    }
  }
}
.notice:hover img {
  content: url(/images/tzhove.png);
}
</style>
