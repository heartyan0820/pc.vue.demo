<template>
  <div class="demo-image__custom-toolbar">
    <el-image
      v-if="message.contentUrl.indexOf('emotes') == -1"
      style="width: 100px; height: 100px"
      :src="message.contentUrl"
      :preview-src-list="messageSrcList"
      :initial-index="activeImgIndex"
      fit="cover"
      show-progress
    >
      <template #toolbar="{ actions, prev, next, reset, activeIndex, setActiveItem }">
        <el-icon @click="prev">
          <Back />
        </el-icon>
        <el-icon @click="next">
          <Right />
        </el-icon>
        <!-- <el-icon @click="setActiveItem(srcList.length - 1)">
          <DArrowRight />
        </el-icon> -->
        <el-icon @click="actions('zoomOut')">
          <ZoomOut />
        </el-icon>
        <el-icon @click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })">
          <ZoomIn />
        </el-icon>
        <el-icon @click="actions('clockwise')">
          <RefreshRight />
        </el-icon>
        <el-icon @click="actions('anticlockwise')">
          <RefreshLeft />
        </el-icon>
        <el-icon @click="reset">
          <Refresh />
        </el-icon>
        <el-icon @click="downloadImg(activeIndex)">
          <Download />
        </el-icon>
      </template>
    </el-image>
    <el-image v-else :src="message.contentUrl"></el-image>
  </div>
</template>

<script setup>import { defineProps, onMounted } from "vue";
import FileAPI from "@/api/file";
const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  },
  messageList: {
    type: Object,
    default: () => []
    // 空对象作为默认值
  }
});
const activeImgIndex = ref(0);
const srcList = ref([]);
const messageSrcList = ref([]);
onMounted(() => {
  srcList.value.push(props.message.contentUrl.replace("&width=400", ""));
  messageSrcList.value = props.messageList.length > 0 ? props.messageList : [];
  const index = props.messageList.findIndex(
    (item) => item === props.message.contentUrl.replace("&width=400", "")
  );
  activeImgIndex.value = index;
});
function downloadImg(index) {
  const imgUrl = messageSrcList.value[index];
  if (imgUrl) {
    const imgarr = imgUrl.split("name=");
    FileAPI.downloads(imgarr[1]);
  }
}
</script>

<style>
.chat-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.chat-image:hover {
  transform: scale(1.02);
}
</style>
