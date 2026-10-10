<template>
  <div class="ecmbody-contents">
    <div class="ecmbody-content-right-top">资质认证</div>
    <el-divider />
    <div class="ecmbody-content-right-top2">
      <span>您的账号还未完成资质认证</span>
      <div class="ecmbody-content-right-top2-rz">
        <div v-if="cate == 1003" class="ecmbody-content-right-top2-rz1">
          <div class="img" @click="open('certification')">
            <img src="@/assets/images/zsrz.png" width="130px" />
            <span style="margin-top: 40px">诊所认证</span>
          </div>
        </div>
        <div v-if="cate == 1004" class="ecmbody-content-right-top2-rz1">
          <div class="img" @click="open('factory')">
            <img src="@/assets/images/gcrz.png" width="130px" />
            <span>工厂认证</span>
          </div>
        </div>
        <div v-if="cate == 10012" class="ecmbody-content-right-top2-rz1">
          <div class="img" @click="open('designer')">
            <img src="@/assets/images/sjsrz.png" width="130px" />
            <span style="background-color: #ff8e72">设计师认证</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { useUserStore } from "@/store";
import router from "@/router";
const props = defineProps({
  userData: {
    type: Object,
    default: null
  }
});
const userStore = useUserStore();
const userForm = ref({});
userForm.value = props.userData;
const cate = ref(0);
cate.value = userStore.userInfo.members.orgClassifyCode;
if (cate.value == 1001) {
  const orgRoleCodes = userStore.userInfo.members.orgRoleCodes;
  if (orgRoleCodes.includes("10012")) {
    cate.value = 10012;
  }
}
function open(url) {
  switch (url) {
    case "certification":
      router.push(url).catch(() => {
        window.location.reload();
      });
      break;
    case "factory":
      ElMessage.error("开发中...");
      break;
    case "designer":
      ElMessage.error("开发中...");
      break;
  }
}
</script>

<style lang="scss" scoped>
.ecmbody-contents {
  display: flex;
  width: 100%;
  background-color: #ffffff;
  flex-flow: column;
  .ecmbody-content-right-top {
    display: flex;
    font-family: Noto Sans SC;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: 0%;
    color: #333f48;
    height: auto;
  }
  .ecmbody-content-right-top1 {
    display: flex;
    width: 100%;
    .ecmbody-content-right-top1-left {
      display: flex;
      width: 80%;
      .ecmbody-content-right-top1-left1 {
        width: auto;
        display: flex;
      }
      .ecmbody-content-right-top1-left2 {
        display: flex;
        font-family: Noto Sans SC;
        font-weight: 700;
        font-size: 18px;
        flex-flow: column;
        padding-left: 3%;
        justify-content: center;
        span {
          font-family: Noto Sans SC;
          font-weight: 400;
          font-size: 16px;
          vertical-align: middle;
          color: #757575;
          padding-top: 10px;
        }
      }
    }
    .ecmbody-content-right-top1-right {
      display: flex;
      width: 20%;
      span {
        height: 30px;
        border-radius: 6px;
        width: 120px;
        background-color: #4a5a6a;
        text-align: center;
        line-height: 30px;
        color: #ffffff;
        font-family: Noto Sans SC;
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
      }
    }
  }
  .ecmbody-content-right-top2 {
    display: flex;
    width: 100%;
    flex-flow: column;
    span {
      font-family: Noto Sans SC;
      font-weight: 400;
      font-size: 16px;
      color: #757575;
      text-align: left;
    }
    .ecmbody-content-right-top2-rz {
      display: flex;
      width: 100%;
      margin-top: 10%;
      .ecmbody-content-right-top2-rz1 {
        display: flex;
        width: 33.3%;
        justify-content: center;
        .img {
          display: flex;
          cursor: pointer;
          flex-flow: column;
          span {
            width: 130px;
            height: 45px;
            border-radius: 6px;
            background-color: #4195f9;
            backdrop-filter: blur(20px);
            color: #ffffff;
            margin-top: 20px;
            text-align: center;
            line-height: 45px;
          }
        }
      }
    }
    :deep(.el-form-item__content) {
      line-height: 32px;
      font-size: 16px;
      font-family: Noto Sans SC;
      font-weight: 400;
      color: #757575;
    }
    :deep(.el-form-item__label) {
      justify-content: flex-start;
      text-align: left;
      font-size: 16px;
      font-family: Noto Sans SC;
      font-weight: 400;
      color: #757575;
    }
  }
}
</style>
