<template>
  <div class="qbtb" @click="toggle">
    <img src="/images/qb.png" height="16px" />
  </div>
</template>

<script setup>const { isFullscreen, toggle } = useFullscreen();
</script>

<style lang="scss" scoped>
.qbtb {
  position: relative;
  top: -1px;
}
.qbtb:hover img {
  content: url(/images/qbhove.png);
}
</style>
