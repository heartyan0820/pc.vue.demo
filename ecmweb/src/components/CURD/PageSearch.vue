<template>
  <el-card
    v-show="visible"
    v-hasPerm="[`${searchConfig.pageName}:query`]"
    shadow="never"
    class="mb-[10px]"
  >
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <template v-for="(item, index) in formItems" :key="item.prop">
        <el-form-item
          v-show="isExpand ? true : index < showNumber"
          :label="item.label"
          :prop="item.prop"
        >
          <!-- Label -->
          <template v-if="item.tips" #label>
            <span>
              {{ item.label }}
              <el-tooltip
                placement="bottom"
                effect="light"
                :content="item.tips"
                :raw-content="true"
              >
                <el-icon style="vertical-align: -0.15em" size="16">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </span>
          </template>
          <!-- Input 输入框 -->
          <template v-if="item.type === 'input' || item.type === undefined">
            <el-input
              v-model="queryParams[item.prop]"
              v-bind="item.attrs"
              @keyup.enter="handleQuery"
            />
          </template>
          <!-- InputTag 标签输入框 -->
          <template v-if="item.type === 'input-tag'">
            <div class="flex-center">
              <el-tag
                v-for="tag in inputTagMap[item.prop].data"
                :key="tag"
                class="mr-2"
                :closable="true"
                v-bind="inputTagMap[item.prop].tagAttrs"
                @close="handleCloseTag(item.prop, tag)"
              >
                {{ tag }}
              </el-tag>
              <template v-if="inputTagMap[item.prop].inputVisible">
                <el-input
                  :ref="(el: HTMLElement) => (inputTagMap[item.prop].inputRef = el)"
                  v-model="inputTagMap[item.prop].inputValue"
                  v-bind="inputTagMap[item.prop].inputAttrs"
                  @keyup.enter="handleInputConfirm(item.prop)"
                  @blur="handleInputConfirm(item.prop)"
                />
              </template>
              <template v-else>
                <el-button
                  v-bind="inputTagMap[item.prop].buttonAttrs"
                  @click="handleShowInput(item.prop)"
                >
                  {{ inputTagMap[item.prop].buttonAttrs.btnText }}
                </el-button>
              </template>
            </div>
          </template>
          <!-- Select 选择器 -->
          <template v-else-if="item.type === 'select'">
            <el-select v-model="queryParams[item.prop]" v-bind="item.attrs">
              <template v-for="option in item.options" :key="option.value">
                <el-option :label="option.label" :value="option.value" />
              </template>
            </el-select>
          </template>
          <!-- TreeSelect 树形选择 -->
          <template v-else-if="item.type === 'tree-select'">
            <el-tree-select v-model="queryParams[item.prop]" v-bind="item.attrs" />
          </template>
          <!-- DatePicker 日期选择器 -->
          <template v-else-if="item.type === 'date-picker'">
            <el-date-picker v-model="queryParams[item.prop]" v-bind="item.attrs" />
          </template>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button icon="refresh" @click="handleReset">重置</el-button>
        <!-- 展开/收起 -->
        <el-link
          v-if="isExpandable && formItems.length > showNumber"
          class="ml-2"
          type="primary"
          :underline="false"
          @click="isExpand = !isExpand"
        >
          <template v-if="isExpand">
            收起
            <el-icon>
              <ArrowUp />
            </el-icon>
          </template>
          <template v-else>
            展开
            <el-icon>
              <ArrowDown />
            </el-icon>
          </template>
        </el-link>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>import { reactive, ref } from "vue";
// 迁移脚本清空了 defineProps/defineEmits，这里补回运行时声明
const props = defineProps({
  searchConfig: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(["resetClick", "queryClick"]);
const queryFormRef = ref();
const visible = ref(true);
const formItems = reactive(props.searchConfig.formItems);
const isExpandable = ref(props.searchConfig.isExpandable ?? true);
const isExpand = ref(false);
const showNumber = computed(() => {
  if (isExpandable.value === true) {
    return props.searchConfig.showNumber ?? 3;
  } else {
    return formItems.length;
  }
});
const queryParams = reactive({});
const inputTagMap = reactive({});
for (const item of formItems) {
  item.initFn && item.initFn(item);
  if (item.type === "input-tag") {
    inputTagMap[item.prop] = {
      data: Array.isArray(item.initialValue) ? item.initialValue : [],
      inputVisible: false,
      inputValue: "",
      inputRef: null,
      buttonAttrs: {
        size: item.attrs?.size ?? "default",
        btnText: item.attrs?.btnText ?? "+ New Tag",
        style: "color: #b0b2b7"
      },
      inputAttrs: {
        size: item.attrs?.size ?? "default",
        clearable: item.attrs?.clearable ?? false,
        style: "width: 150px"
      },
      tagAttrs: {
        size: item.attrs?.size ?? "default"
      }
    };
    queryParams[item.prop] = computed({
      get() {
        return typeof item.attrs?.join === "string" ? inputTagMap[item.prop].data.join(item.attrs.join) : inputTagMap[item.prop].data;
      },
      set(value) {
        inputTagMap[item.prop].data = typeof item.attrs?.join === "string" ? value.split(item.attrs.join).filter((item2) => item2 !== "") : value;
      }
    });
  } else {
    queryParams[item.prop] = item.initialValue ?? "";
  }
}
function handleReset() {
  queryFormRef.value?.resetFields();
  emit("resetClick", queryParams);
}
function handleQuery() {
  emit("queryClick", queryParams);
}
function getQueryParams() {
  return queryParams;
}
function toggleVisible() {
  visible.value = !visible.value;
}
function handleCloseTag(prop, tag) {
  inputTagMap[prop].data.splice(inputTagMap[prop].data.indexOf(tag), 1);
}
function handleInputConfirm(prop) {
  if (inputTagMap[prop].inputValue) {
    inputTagMap[prop].data.push(inputTagMap[prop].inputValue);
  }
  inputTagMap[prop].inputVisible = false;
  inputTagMap[prop].inputValue = "";
}
function handleShowInput(prop) {
  inputTagMap[prop].inputVisible = true;
  nextTick(() => {
    inputTagMap[prop].inputRef.focus();
  });
}
defineExpose({ getQueryParams, toggleVisible });
</script>

<style lang="scss" scoped></style>
