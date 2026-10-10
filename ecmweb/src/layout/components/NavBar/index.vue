<template>
  <div class="navbar">
    <div class="header-logo">
      <a href="#/index"><img src="@/assets/images/logo.png" /></a>
    </div>
    <div class="navbar__left">
      <NavBars />
    </div>
    <!-- 导航栏右侧 -->
    <NavbarRight ref="navref" />
  </div>
</template>

<script setup>const navref = ref(null);
const refreshNotify = () => {
  if (!navref.value) {
    console.warn("子组件未挂载，无法调用方法");
    return;
  }
  navref.value.refreshNotify();
};
defineExpose({
  refreshNotify
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  width: 1220px;
  max-width: 1220px;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  height: $navbar-height;
  margin: 0 auto;
  &__left {
    display: flex;
    align-items: center;
  }
}
</style>
