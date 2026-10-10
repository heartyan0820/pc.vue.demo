<template>
  <div class="parent-page">
    <DynamicForm
      :form-items="formItems"
      :initial-form-data="initialFormData"
      :labelPosition="labelPosition"
      @submit="handleFormSubmit"
      @reset="handleFormReset"
      @setsteep="setsteep"
    />
  </div>
</template>

<script setup>
import DynamicForm from "./DynamicForm.vue";
import ContactAPI from "@/api/system/contact";
const props = defineProps({
  formItems: {
    type: Array,
    default: []
  },
  labelPosition: {
    type: String,
    default: "Top"
  },
  formKey: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["setSteep"]);
const formItems = ref();
const formData = reactive({
  id: void 0,
  key: "",
  fieldMess: "",
  isRead: false
});
const labelPosition = ref("");
const formKey = ref("");
labelPosition.value = props.labelPosition;
formKey.value = props.formKey;
formItems.value = props.formItems;
const initialFormData = reactive({
  //isAgree: false, // 开关初始值
  selectDate: "",
  // 日期初始值
  satisfaction: 0
  // 评分初始值
  //hobbies: [], // 复选框组初始值
  // gender: "", // 单选框组初始值
});
const submitResult = ref(null);
const handleFormSubmit = (data) => {
  const formItem = formItems.value;
  const keys = Object.keys(data);
  let itemarr = [];
  keys.forEach((key) => {
    if (data[key] != "") {
      const info = formItem?.filter((item) => {
        return item.key == key;
      });
      if (info?.length > 0) {
        let log = info[0].label + "：" + data[key];
        itemarr.push(log);
      }
    }
  });
  formData.key = formKey.value;
  formData.isRead = false;
  formData.fieldMess = "";
  if (itemarr.length > 0) {
    formData.fieldMess = JSON.stringify(itemarr);
  }
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "提交中..." });
  ContactAPI.add(formData).then((res) => {
    if (res.id > 0) {
      ElMessage.success("提交成功!");
      setsteep();
    } else {
      ElNotification({
        title: "Error",
        message: `提交失败!`,
        type: "error",
        duration: 3e3
      });
    }
  }).finally(() => {
    loadingInstance.close();
  });
};
const handleFormReset = () => {
  submitResult.value = null;
};
function setsteep() {
  emit("setSteep");
}
</script>

<style lang="scss" scoped>
.parent-page {
  width: 100%;
  margin: 0 auto;
}
.submit-result {
  margin-top: 20px;
  padding: 15px;
}
pre {
  margin: 0;
  font-size: 14px;
  color: #333;
}
</style>
