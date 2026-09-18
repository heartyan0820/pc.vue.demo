<script setup>
import { ref, useTemplateRef } from 'vue'
import demo1 from '../components/demoComponents/demo1.vue'
import formDemo from '../components/demoComponents/formDemo.vue'

</script>

<template>
  <div>
    <h2>下面是vue3子组件Demo</h2>
    <p style="border: 1px solid #ccc; padding: 10px; margin-top: 10px;">
      <demo1 />
      <hr style="margin:10px 0px;" />
      <formDemo />
    </p>

  </div>
</template>

<style scoped lang="scss"></style>