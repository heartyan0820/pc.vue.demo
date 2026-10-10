<template>
  <div class="app-doc">
    <div class="doc-message">
      <div v-html="doc"></div>
    </div>
  </div>
</template>

<script setup>defineOptions({
  name: "doc",
  inheritAttrs: true
});
import DocAPI from "@/api/doc";
const route = useRoute();
const id = ref(route.query.id);
const docData = [];
const doc = ref("");
onMounted(() => {
  if (id.value != void 0) {
    const ids = id.value;
    DocAPI.getDocData(ids).then((data) => {
      const datas = Object.assign(docData, data);
      doc.value = datas.content;
    });
  }
});
</script>

<style lang="scss" scoped>
.app-doc {
  display: flex;
  width: 100%;
  height: 100vh;
  .doc-message {
    display: flex;
  }
}
</style>
