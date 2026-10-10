<template>
  <template v-if="tagType">
    <el-tag :type="tagType" :size="tagSize">{{ label }}</el-tag>
  </template>
  <template v-else>
    <span>{{ label }}</span>
  </template>
</template>

<script setup>import { useDictStore } from "@/store";
const dictStore = useDictStore();
const props = defineProps({
  code: String,
  modelValue: [String, Number],
  size: {
    type: String,
    default: "default"
  }
});
const label = ref("");
const tagType = ref();
const tagSize = ref(props.size);
const getLabelAndTagByValue = async (dictCode, value) => {
  const dictData = dictStore.getDictionary(dictCode);
  const dictEntry = dictData.find((item) => item.value == value);
  return {
    label: dictEntry ? dictEntry.label : "",
    tag: dictEntry ? dictEntry.tagType : void 0
  };
};
const fetchLabelAndTag = async () => {
  const result = await getLabelAndTagByValue(props.code, props.modelValue);
  label.value = result.label;
  tagType.value = result.tag;
};
onMounted(fetchLabelAndTag);
watch(() => props.modelValue, fetchLabelAndTag);
</script>
