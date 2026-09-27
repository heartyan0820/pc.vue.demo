<script setup>
import { ref } from 'vue'
import loadingImage from '../assets/images/commonImages/loading.gif'


defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="loading-mask" role="status" aria-live="polite">
      <div class="loading-content">
        <img :src="loadingImage" alt="" />
        <span>{{ text }}</span>
      </div>
    </div>
  </Teleport>
</template>


<style scoped>
.loading-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 25%);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  color: #333;
  background: #fff;
  border-radius: 8px;

  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
}
</style>