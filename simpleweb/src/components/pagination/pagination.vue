<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
})

const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'current-change',
  'size-change',
])

const currentPageModel = computed({
  get: () => props.currentPage,
  set: (value) => emit('update:currentPage', value),
})

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (value) => emit('update:pageSize', value),
})
</script>

<template>
  <div class="pagination">
    <el-pagination v-model:current-page="currentPageModel" v-model:page-size="pageSizeModel" background :layout="layout"
      :page-sizes="pageSizes" :total="total" @current-change="emit('current-change', $event)"
      @size-change="emit('size-change', $event)" />
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
