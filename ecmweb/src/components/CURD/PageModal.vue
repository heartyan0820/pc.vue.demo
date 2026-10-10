<template>
  <!-- drawer -->
  <template v-if="modalConfig.component === 'drawer'">
    <el-drawer
      v-model="modalVisible"
      :append-to-body="true"
      v-bind="modalConfig.drawer"
      @close="handleCloseModal"
    >
      <!-- 表单 -->
      <el-form
        ref="formRef"
        label-width="auto"
        v-bind="modalConfig.form"
        :model="formData"
        :rules="formRules"
      >
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
                <!-- switch 开关 -->
                <template v-else-if="item.type === 'switch'">
                  <el-switch v-model="formData[item.prop]" inline-prompt v-bind="item.attrs" />
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
                  <el-text v-bind="item.attrs">
                    {{ formData[item.prop] }}
                  </el-text>
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
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div v-if="!formDisable">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
        <div v-else>
          <el-button @click="handleClose">关闭</el-button>
        </div>
      </template>
    </el-drawer>
  </template>
  <!-- dialog -->
  <template v-else>
    <el-dialog
      v-model="modalVisible"
      :align-center="true"
      :append-to-body="true"
      width="70vw"
      v-bind="modalConfig.dialog"
      style="padding-right: 0"
      @close="handleCloseModal"
    >
      <!-- 滚动 -->
      <el-scrollbar max-height="60vh">
        <!-- 表单 -->
        <el-form
          ref="formRef"
          label-width="auto"
          v-bind="modalConfig.form"
          style="padding-right: var(--el-dialog-padding-primary)"
          :model="formData"
          :rules="formRules"
        >
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
                  <!-- switch 开关 -->
                  <template v-else-if="item.type === 'switch'">
                    <el-switch v-model="formData[item.prop]" inline-prompt v-bind="item.attrs" />
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
                    <el-text v-bind="item.attrs">
                      {{ formData[item.prop] }}
                    </el-text>
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
      </el-scrollbar>
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div style="padding-right: var(--el-dialog-padding-primary)">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </template>
</template>

<script setup>import { useThrottleFn } from "@vueuse/core";
import { nextTick, reactive, ref, watch, watchEffect } from "vue";
// 迁移脚本清空了 defineProps/defineEmits，这里补回运行时声明
const props = defineProps({
  modalConfig: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(["submitClick"]);
const pk = props.modalConfig.pk ?? "id";
const modalVisible = ref(false);
const formRef = ref();
const formItems = reactive(props.modalConfig.formItems);
const formData = reactive({});
const formRules = {};
const formDisable = ref(false);
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
  if (Object.prototype.hasOwnProperty.call(data, pk)) {
    formData[pk] = data[pk];
  }
}
function setFormItemData(key, value) {
  formData[key] = value;
}
function setModalVisible(data = {}) {
  modalVisible.value = true;
  nextTick(() => {
    Object.values(data).length > 0 && setFormData(data);
  });
}
const handleSubmit = useThrottleFn(() => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (typeof props.modalConfig.beforeSubmit === "function") {
        props.modalConfig.beforeSubmit(formData);
      }
      props.modalConfig.formAction(formData).then(() => {
        let msg = "操作成功";
        if (props.modalConfig.component === "drawer") {
          if (props.modalConfig.drawer?.title) {
            msg = `${props.modalConfig.drawer?.title}成功`;
          }
        } else {
          if (props.modalConfig.dialog?.title) {
            msg = `${props.modalConfig.dialog?.title}成功`;
          }
        }
        ElMessage.success(msg);
        emit("submitClick");
        handleClose();
      });
    }
  });
}, 3e3);
function handleClose() {
  modalVisible.value = false;
}
function handleCloseModal() {
  formRef.value?.resetFields();
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}
function handleDisabled(disable) {
  formDisable.value = disable;
  props.modalConfig.formItems.forEach((item) => {
    if (item) {
      if (item.attrs) {
        item.attrs.disabled = disable;
      } else {
        item.attrs = { disabled: disable };
      }
    }
  });
}
defineExpose({ setModalVisible, getFormData, setFormData, setFormItemData, handleDisabled });
</script>

<style lang="scss" scoped></style>
