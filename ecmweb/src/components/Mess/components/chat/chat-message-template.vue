<template>
  <div class="chat-template-box">
    <div class="chat-template-title" v-if="!(msg.params.commandId == 10001 && msg.params.type == 6)"    >{{ msg.params.title.caption }}</div>
    <chatTpl10001 v-if="(msg.params.commandId == 10001&& msg.params.type == 1) || msg.params.commandId == 10002" :item="msg.content" />
    <chatTpl100016 v-if="msg.params.commandId == 10001 && msg.params.type == 6" :item="msg.content" />
    <chatTpl10004 v-if="msg.params.commandId == 10004" :message="msg.content" />

    <div class="chat-ask-list" v-if="msg.params.questions.length">
      <div>
        <span class="title" style="color: red;"> ★ 请补充以下问题：</span>
        <div class="list-project-container" v-for="(txt, index) in msg.params.questions" :key="index">
          <div class="project-box" style="margin-left: 20px;color: #4080ff;">
            {{ txt }}
            <!-- <el-link type="primary" underline>{{ txt }}</el-link> -->
          </div>
        </div>
      </div>
    </div>

    <div class="btn-box" v-if="msg.params.buttons">
      <div class="d-jr d-ac tag-container">
        <el-button type="primary" v-for="(btn, index) in msg.params.buttons" :key="index" size="small"
          @click="handleBtnClick(btn)">{{ btn.caption }}</el-button>
      </div>
    </div>
  </div>

</template>

<script setup>
import chatTpl10001 from "./chat-tpl-10001.vue";
import chatTpl100016 from "./chat-tpl-100016.vue";
import chatTpl10004 from "./chat-tpl-10004.vue";
import { defineProps } from "vue";
import { useChatStore } from "@/store";
const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  }
});
const chatStore = useChatStore();
const msg = ref({});
msg.value = JSON.parse(props.message.content);
const handleBtnClick = (btn) => {
  console.log("btn", btn, props.message.messageId);
  chatStore.quoteMessage = props.message;
  let json = {
    type: 0,
    content: btn.value
  };
  switch (btn.click) {
    case 1:
      json.type = 1;
      break;
    case 2:
      json.type = 2;
      break;
    case "ref":
      json.type = 1;
      break;
    case "send":
      json.type = 2;
      break;
  }
  chatStore.btnAiObj = json;
};
</script>

<style>
.d-jr {
  display: flex;
  justify-content: flex-end;
}

.chat-template-box {
  width: 100%;
  position: relative;
}

.chat-template-title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  margin-bottom: 5px;
}

.chat-ask-list {
  margin: 10px 0;
}

.title {
  color: #888;
}
</style>