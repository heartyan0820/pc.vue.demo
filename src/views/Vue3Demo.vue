<script setup>
import { nextTick, onMounted, ref, defineAsyncComponent } from 'vue'
import demo1 from '../components/demoComponents/demo1.vue'
import formDemo from '../components/demoComponents/formDemo.vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import Loading from '../components/loading.vue';

const pageContent = ref(null)
const isLoading = ref(false)
const LoadingVue = defineAsyncComponent(() =>
  import('../components/loading.vue')
)

onMounted(async () => {
  await nextTick()
  const scrollContainer = pageContent.value?.closest('.el-main')
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight + 100
  }

  if (sessionStorage.getItem('refresh_success') === '1') {
    sessionStorage.removeItem('refresh_success')
    ElMessage.success({
      message: '刷新成功！',
      offset: Math.max(Math.round(window.innerHeight / 2 - 40), 20)
    })
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

async function demoLoading() {
  isLoading.value = true
  try {
    // 替换为实际的异步请求
    await new Promise(resolve => setTimeout(resolve, 2000))
  } finally {
    isLoading.value = false
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

    <p style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
      <el-button @click="demoLoading">test加载中</el-button>
      <!-- <Loading :show="isLoading" text="... 数据加载中 ..." /> -->
      <LoadingVue :show="isLoading" text="... 数据加载中 ..." />
    </p>

    <p style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">

    </p>

    <el-backtop target=".el-main" :right="30" :bottom="30" :visibility-height="200" />
  </div>
</template>

<style scoped></style>