<!-- 用户管理 -->
<template>
  <div class="ecmbody-contentcygl">
    <userManage :orgClassifyCode="orgClassifyCode" :orgId="orgId"></userManage>
  </div>
</template>

<script setup>
import userManage from "@/components/userManage/index.vue";
import { useUserStore } from "@/store";
const userStore = useUserStore();
const orgClassifyCode = ref(0);
const orgId = ref(0);
orgClassifyCode.value = userStore.userInfo.members.orgClassifyCode;
orgId.value = userStore.userInfo.members.orgId;
</script>

<style lang="scss" scoped></style>
