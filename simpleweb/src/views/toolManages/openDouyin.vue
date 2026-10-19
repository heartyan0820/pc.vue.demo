<script setup>
// public 目录下的文件不参与打包，直接按运行时的 base 拼接；
// 打包后 base 是 /pc.vue.demo/，写死 /html/... 会 404
const douyinUrl = `${import.meta.env.BASE_URL}html/douyin.html`;
</script>

<template>
  <div>
    <a :href="douyinUrl" target="_blank" rel="noopener">open Douyin</a>
  </div>
</template>

<style scoped></style>
