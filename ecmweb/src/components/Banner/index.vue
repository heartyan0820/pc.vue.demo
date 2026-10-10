<template>
  <div class="banner-notifications">
    <div class="marquee-img"><img src="@/assets/images/tz.png" height="19px" /></div>
    <div
      ref="containerRef"
      class="banner-notification"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <div ref="contentRef" class="marquee-content">
        {{ notice }}
      </div>
    </div>
  </div>
</template>

<script setup>import { getAccessToken } from "@/utils/auth";
import DocAPI from "@/api/doc";
import { useUserStore } from "@/store/modules/user";
const isLogins = getAccessToken();
let notice = ref("平台正常工作时间为上午9:00至下午18:00，如需紧急处理，请通过在线沟通联系客服!");
const noticeList = ref();
let intervalTimer = null;
const containerRef = ref(null);
const contentRef = ref(null);
const isPaused = ref(false);
let timer = null;
let offset = 0;
let needScroll = ref(false);
let textWidth = 0;
let containerWidth = 0;
const onePaused = ref(false);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  state: 1,
  type: 1
});
function getNotice() {
  if (isLogins) {
    const user = useUserStore().userInfo;
    queryParams.OrgRoleCode = user.members.orgRoleCodes;
    queryParams.orgClassCode = [user.members.orgClassifyCode];
    DocAPI.getNoticeData(queryParams).then((data) => {
      noticeList.value = data.list.map((item) => item.title);
      noticeList.value.push(
        "平台正常工作时间为上午9:00至下午18:00，如需紧急处理，请通过在线沟通联系客服!"
      );
      intervalTimer = setInterval(switchContent, 1e4);
    });
  }
}
const switchContent = () => {
  if (!onePaused.value) {
    const currentIndex = noticeList.value.findIndex((item) => item === notice.value);
    const nextIndex = (currentIndex + 1) % noticeList.value.length;
    notice.value = noticeList.value[nextIndex];
    initMarquee();
  }
};
const runMarquee = () => {
  if (isPaused.value || !needScroll.value) return;
  offset--;
  if (isScrollComplete()) {
    offset = containerWidth;
    onePaused.value = false;
    clearInterval(intervalTimer);
    intervalTimer = setInterval(switchContent, 1e4);
  }
  contentRef.value.style.transform = `translateX(${offset}px)`;
};
const initMarquee = async () => {
  await nextTick();
  if (!containerRef.value || !contentRef.value) return;
  containerWidth = containerRef.value.offsetWidth;
  textWidth = contentRef.value.offsetWidth;
  needScroll.value = textWidth > containerWidth;
  if (needScroll.value) {
    clearInterval(timer);
    timer = setInterval(runMarquee, 5);
    onePaused.value = true;
  } else {
    containerRef.value.style.transform = "translateX(0)";
    contentRef.value.style.transform = "translateX(0)";
    clearInterval(timer);
  }
};
const isScrollComplete = () => {
  return offset <= -textWidth;
};
onUnmounted(() => {
  clearInterval(intervalTimer);
  clearInterval(timer);
});
onMounted(() => {
  getNotice();
});
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  margin: -4px auto;
  height: 310px;
  z-index: 0;
  :deep(.swiper-button-next) {
    background-color: transparent;
  }
  :deep(.swiper-button-prev) {
    background-color: transparent;
  }
  .swiper-container {
    width: 100%;
    height: 310px;
    .swiper-wrapper {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.banner-notifications {
  display: flex;
  color: #ff8d28;
  justify-content: center;
  width: 750px;
  height: 55px;
  line-height: 55px;
  margin: 0 auto;
  position: relative;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  z-index: 1;
  letter-spacing: 0.6px;
  padding-left: 16px;
  font-size: 17px;
  font-family: Noto Sans SC;
  overflow: hidden;
  .marquee-img {
    display: flex;
    position: absolute;
    height: 37px;
    width: 28px;
    align-items: end;
    left: 0px;
  }
  .banner-notification {
    display: flex;
    color: #ff8d28;
    justify-content: center;
    width: 700px;
    height: 54px;
    line-height: 54px;
    margin: 0 auto;
    position: relative;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    z-index: 1;
    letter-spacing: 0.6px;
    padding-left: 16px;
    font-size: 17px;
    font-family: Noto Sans SC;
    overflow: hidden;

    .marquee-content {
      position: absolute;
      white-space: nowrap; /* 禁止文字换行 */
      top: 0;
      left: 0;
      padding: 0 10px;
      color: #ff8d28;
    }
  }
}
</style>
