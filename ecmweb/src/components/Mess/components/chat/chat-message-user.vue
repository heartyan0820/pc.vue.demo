<template>
  <!-- 对方消息显示头像和昵称 -->
  <div :class="message.senderId != userInfo.chatUserId ? 'sender-info' : 'sender-info me'">
    <el-avatar :size="36" :src="message?.user?.userUrl" class="message-avatar">
      <img src="@/assets/images/msg_avatar_user.png" />
    </el-avatar>
    <div style="margin: 0 10px">
      <div v-if="message?.senderId != userInfo.chatUserId" class="sender-name">
        <span
          v-if="message?.user?.roleCodeName"
          style="color: #5094f5; margin-right: 5px; font-size: 17px"
        >
          {{ message?.user?.roleCodeName }}
        </span>
        <span v-if="message?.user?.nickName === '系统'" style="color: #5094f5">
          {{ message?.user?.nickName }}
        </span>
        <span v-else>{{ message?.user?.nickName }}</span>
      </div>
      <div v-else class="sender-name" style="text-align: right; font-size: 17px">我</div>
      <div class="message-time">{{ message.createTime }}</div>
    </div>
  </div>
</template>

<script setup>import { useUserStore } from "@/store";
import { defineProps } from "vue";
const userInfo = useUserStore().userInfo;
const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  }
});
</script>

<style>
.sender-info {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.sender-info.me {
  flex-direction: row-reverse;
  margin-inline-end: 0;
}

.sender-name {
  font-size: 16px;
  color: #333;
}

.message-time {
  font-size: 14px;
  color: #6a81af;
  text-align: right;
  padding-top: 5px;
}
</style>
