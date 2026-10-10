<template>
  <div class="ecm-bottom">
    <div class="ecm-bottom-copyright">
      Copyright @ 2023 - {{ new Date().getFullYear() }} 成都众硕慧通科技有限公司 版权所有 公安网备
      蜀ICP备2023012910号-1
    </div>
    <div class="ecm-bottom-record"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.ecm-bottom {
  z-index: 999;
  display: flex;
  width: 100%;
  margin: 0 auto;
  height: 20px;
  justify-content: center;
  flex-flow: column;
  position: fixed;
  bottom: 0;
  background-color: #f8f9fa; /* 背景颜色，根据需要调整 */
  /*padding: 10px 0; /* 内边距，根据需要调整 */
  .ecm-bottom-copyright {
    width: 100%;
    display: flex;
    font-size: 12px;
    color: #bbbbbb;
    text-align: center;
    justify-content: center;
  }
  .ecm-bottom-record {
    width: 100%;
    display: flex;
    font-size: 14px;
    color: #999999;
    text-align: center;
    justify-content: center;
  }
}
</style>
