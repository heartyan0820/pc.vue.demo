<template>
    <!-- 图片消息 -->
    <div class="media-message">
      <img :src="message.contentUrl" class="chat-image" alt="图片" @click="openPreview(message.contentUrl)">
      <div class="media-caption" v-if="message.text">{{ message.text }}</div>
    </div>
  <!-- 图片预览对话框 -->
  <el-dialog v-model="previewVisible" title="图片预览" width="400px" center>
    <img :src="previewImage.replace('&width=400', '')" style="width: 100%;" alt="预览">
  </el-dialog>

</template>

<script setup>
// 图片预览相关
const previewVisible = ref(false);
const previewImage = ref('');

const props = defineProps({
  message: {
    type: Object,
    default: () => ({}) // 空对象作为默认值
  }
})

// 打开图片预览
const openPreview = (imageUrl) => {
  previewImage.value = imageUrl;
  previewVisible.value = true;
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