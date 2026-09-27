<script setup>
import { nextTick, onMounted, ref } from 'vue'
import demo1 from '../components/demoComponents/demo1.vue'
import formDemo from '../components/demoComponents/formDemo.vue'

const pageContent = ref(null)

onMounted(async () => {
  await nextTick()
  const scrollContainer = pageContent.value?.closest('.el-main')
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight
  }
})
</script>

<template>
  <div ref="pageContent">
    <h2>********这是vue3的Demo*********</h2>
    <p style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
      <demo1 />
      <hr style="margin:10px 0px;" />
      <formDemo />
    </p>

  </div>
</template>

<style scoped lang="scss"></style>