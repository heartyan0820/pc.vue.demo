<template>
  <div class="dynamic-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-position="labelPosition"
      label-width="120px"
      class="form-container"
    >
      <!-- 动态渲染表单项 -->
      <el-form-item v-for="item in formItems" :key="item.key" :label="item.label" :prop="item.key">
        <!-- 1. 对 Select 类型特殊处理：嵌套 ElOption -->
        <template v-if="item.type === 'select'">
          <el-select
            v-model="formData[item.key]"
            v-bind="item.props || {}"
            :placeholder="`请选择${item.label}`"
          >
            <el-option
              v-for="option in item.props?.options || []"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </template>
        <!-- 2. TextArea 类型（新增） -->
        <template v-else-if="item.type === 'textarea'">
          <el-input
            v-model="formData[item.key]"
            type="textarea"
            :placeholder="`请输入${item.label}`"
            :rows="3"
            v-bind="item.props || {}"
          />
        </template>
        <!-- 3. 其他类型 -->
        <component
          :is="getComponentByType(item.type)"
          v-else
          v-model="formData[item.key]"
          v-bind="item.props || {}"
          :placeholder="item.type === 'input' ? `请输入${item.label}` : `请选择${item.label}`"
        />
      </el-form-item>

      <!-- 提交/重置按钮 -->
      <el-form-item>
        <div style="display: flex; justify-content: end; width: 100%">
          <el-button
            type="primary"
            style="width: 200px; height: 45px; font-size: 55px"
            @click="handleSubmit"
          >
            提交申请
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>// 源项目用的是类型式声明 defineProps<{...}>()，迁移脚本没转换成功，被清成了空的 defineProps()。
// 这里补回运行时声明，否则 props.formItems / props.labelPosition 全是 undefined：
//   - formRules 计算属性里 props.formItems.forEach 会抛 "props.formItems is undefined"
//   - 模板里 v-for="item in formItems" 拿不到数据，表单整块空白
const props = defineProps({
  formItems: {
    type: Array,
    default: () => []
  },
  initialFormData: {
    type: Object,
    default: () => ({})
  },
  labelPosition: {
    type: String,
    default: "top"
  }
});
const emit = defineEmits(["submit", "reset"]);
const labelPosition = ref("");
labelPosition.value = props.labelPosition;
const formData = reactive({ ...props.initialFormData });
const formRef = ref();
const formRules = computed(() => {
  const rules = {};
  // 兜底：即使父组件尚未传入数据（接口返回前），也不能对 undefined 调 forEach
  (props.formItems || []).forEach((item) => {
    if (!item.rules) return;
    const dynamicRules = JSON.parse(JSON.stringify(item.rules));
    dynamicRules.forEach((rule) => {
      if (rule.required && !rule.message) {
        const prefix = item.type == "select" || item.type == "radio-group" || item.type == "checkbox-group" ? "请选择" : "请填写";
        rule.message = `${prefix}${item.label}`;
      }
      item.rules.forEach((r) => {
        if (r.pattern != void 0) {
          rule.pattern = r.pattern;
        }
      });
      if (typeof rule.message === "function") {
        rule.message = rule.message(item);
      }
    });
    rules[item.key] = dynamicRules;
  });
  return rules;
});
const getComponentByType = (type) => {
  const componentMap = {
    switch: ElSwitch,
    // 开关
    date: ElDatePicker,
    // 日期选择器
    rate: ElRate,
    // 评分
    "checkbox-group": ElCheckboxGroup,
    // 复选框组
    "radio-group": ElRadioGroup,
    // 单选框组
    input: ElInput,
    select: ElSelect,
    textarea: ElText
  };
  return componentMap[type] || "span";
};
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    emit("submit", { ...formData });
  } catch (error) {
    ElNotification({
      title: "Error",
      message: `请完善必填项后提交!`,
      type: "error",
      duration: 3e3
    });
  }
};
const handleReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  Object.assign(formData, props.initialFormData);
  emit("reset");
  ElMessage.info("表单已重置！");
};
watch(
  () => props.initialFormData,
  (newVal) => {
    Object.assign(formData, newVal);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.dynamic-form {
  padding: 20px;
}
.form-container {
  width: 100%;
  :deep(.el-form-item__label) {
    color: #333;
    font-weight: 500;
    font-style: Medium;
    font-size: 15px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
  }
  :deep(.el-notification.right) {
    right: 45%;
  }
}
</style>
