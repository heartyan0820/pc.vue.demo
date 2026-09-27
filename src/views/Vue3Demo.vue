<script setup>
import { nextTick, onMounted, ref } from 'vue'
import demo1 from '../components/demoComponents/demo1.vue'
import formDemo from '../components/demoComponents/formDemo.vue'
import { ElMessageBox, ElMessage } from 'element-plus';

const pageContent = ref(null)

onMounted(async () => {
  await nextTick()
  const scrollContainer = pageContent.value?.closest('.el-main')
  if (scrollContainer) {
    //scrollContainer.scrollTop = scrollContainer.scrollHeight
  }

  if (sessionStorage.getItem('refresh_success') === '1') {
    sessionStorage.removeItem('refresh_success')
    ElMessage.success('刷新成功！')
  }
})

async function refresh() {
  try {
    await ElMessageBox.confirm('确定刷新？', '好心提示', {
      type: 'info',
      confirmButtonText: '确定了',
      cancelButtonClass: '',
      confirmButtonClass: 'el-button--danger'
    })

    sessionStorage.setItem('refresh_success', '1')
    window.location.reload();
  } catch {
    ElMessage.info('已取消刷新')
  }
}
</script>

<template>
  <div ref="pageContent">
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <h2>********这是vue3的Demo*********</h2>
      <h3>
        <el-button @click="refresh">刷 新</el-button>
      </h3>
    </div>
    <p style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
      <demo1 />
      <hr style="margin:10px 0px;" />
      <formDemo />
    </p>

  </div>
</template>

<style scoped lang="scss"></style>