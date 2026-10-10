<template>
  <el-form ref="formRef" label-width="auto" v-bind="form" :model="formData" :rules="formRules">
    <el-row :gutter="20">
      <template v-for="item in formItems" :key="item.prop">
        <el-col v-show="!item.hidden" v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
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
              <el-input v-model="formData[item.prop]" v-bind="item.attrs" />
            </template>
            <!-- Select 选择器 -->
            <template v-else-if="item.type === 'select'">
              <el-select v-model="formData[item.prop]" v-bind="item.attrs">
                <template v-for="option in item.options" :key="option.value">
                  <el-option v-bind="option" />
                </template>
              </el-select>
            </template>
            <!-- Radio 单选框 -->
            <template v-else-if="item.type === 'radio'">
              <el-radio-group v-model="formData[item.prop]" v-bind="item.attrs">
                <template v-for="option in item.options" :key="option.value">
                  <el-radio v-bind="option" />
                </template>
              </el-radio-group>
            </template>
            <!-- Checkbox 多选框 -->
            <template v-else-if="item.type === 'checkbox'">
              <el-checkbox-group v-model="formData[item.prop]" v-bind="item.attrs">
                <template v-for="option in item.options" :key="option.value">
                  <el-checkbox v-bind="option" />
                </template>
              </el-checkbox-group>
            </template>
            <!-- Input Number 数字输入框 -->
            <template v-else-if="item.type === 'input-number'">
              <el-input-number v-model="formData[item.prop]" v-bind="item.attrs" />
            </template>
            <!-- TreeSelect 树形选择 -->
            <template v-else-if="item.type === 'tree-select'">
              <el-tree-select v-model="formData[item.prop]" v-bind="item.attrs" />
            </template>
            <!-- DatePicker 日期选择器 -->
            <template v-else-if="item.type === 'date-picker'">
              <el-date-picker v-model="formData[item.prop]" v-bind="item.attrs" />
            </template>
            <!-- Text 文本 -->
            <template v-else-if="item.type === 'text'">
              <el-text v-bind="item.attrs">{{ formData[item.prop] }}</el-text>
            </template>
            <!-- 自定义 -->
            <template v-else-if="item.type === 'custom'">
              <slot
                :name="item.slotName ?? item.prop"
                :prop="item.prop"
                :form-data="formData"
                :attrs="item.attrs"
              />
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script setup>import { reactive, ref, watch, watchEffect } from "vue";
// 迁移脚本清空了 defineProps 的类型泛型，这里补回运行时声明（pk 默认值原本在 withDefaults 里）
const props = defineProps({
  pk: {
    type: String,
    default: "id"
  },
  form: {
    type: Object,
    default: () => ({})
  },
  formItems: {
    type: Array,
    default: () => []
  }
});
const formRef = ref();
const formItems = reactive(props.formItems);
const formData = reactive({});
const formRules = {};
const prepareFuncs = [];
for (const item of formItems) {
  item.initFn && item.initFn(item);
  formData[item.prop] = item.initialValue ?? "";
  formRules[item.prop] = item.rules ?? [];
  if (item.watch !== void 0) {
    prepareFuncs.push(() => {
      watch(
        () => formData[item.prop],
        (newValue, oldValue) => {
          item.watch && item.watch(newValue, oldValue, formData, formItems);
        }
      );
    });
  }
  if (item.computed !== void 0) {
    prepareFuncs.push(() => {
      watchEffect(() => {
        item.computed && (formData[item.prop] = item.computed(formData));
      });
    });
  }
  if (item.watchEffect !== void 0) {
    prepareFuncs.push(() => {
      watchEffect(() => {
        item.watchEffect && item.watchEffect(formData);
      });
    });
  }
}
prepareFuncs.forEach((func) => func());
function getFormData(key) {
  return key === void 0 ? formData : formData[key] ?? void 0;
}
function setFormData(data) {
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key) && key in data) {
      formData[key] = data[key];
    }
  }
  if (Object.prototype.hasOwnProperty.call(data, props.pk)) {
    formData[props.pk] = data[props.pk];
  }
}
function setFormItemData(key, value) {
  formData[key] = value;
}
defineExpose({ formRef, getFormData, setFormData, setFormItemData });
</script>
