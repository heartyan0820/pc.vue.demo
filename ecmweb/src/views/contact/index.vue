<template>
  <div class="ecmbody">
    <div class="ecmbody-nav">
      <a style="width: 40px">首页</a>
      /
      <span>&nbsp;&nbsp;联系我们</span>
    </div>
    <div v-if="steep == 0" class="ecmbody-steep">
      <div class="ecmbody-contact-title">
        <img src="/images/service.png" />
        &nbsp;&nbsp;
        <span>&nbsp;&nbsp;提交客服申请</span>
      </div>
      <div class="ecmbody-contact-tab">
        <button
          v-for="(item, index) in fromDataJson.tabs"
          :key="index"
          :class="fromDataJson.avate == item ? 'nav-btn primary' : 'nav-btn'"
          @click="update(item)"
        >
          {{ item }}
        </button>
      </div>
      <div class="ecmbody-contact">
        <div class="ecmbody-mess">
          <ParentFormPage
            :key="key"
            :formItems="formItems"
            :formKey="formKey"
            :labelPosition="labelPosition"
            @setSteep="setSteep"
          />
        </div>
      </div>
    </div>
    <div v-else class="ecmbody-steep1">
      <div>
        <img src="/images/service2.png" />
        &nbsp;&nbsp;&nbsp;
      </div>
      <div class="ecmbody-mess1-text">
        尊敬的用户，您的客服申请已成功提交！
        <br />
        感谢联系易齿盟，我们会尽快联系您。
      </div>
    </div>
  </div>
</template>
<script setup>
import ParentFormPage from "@/components/TableForm/ParentForm.vue";
import ContactAPI from "@/api/system/contact";
defineOptions({
  name: "contact",
  inheritAttrs: false
});
const fromDataJson = reactive({
  tabs: [],
  avate: "",
  form: []
});
const labelPosition = ref("top");
const formKey = ref("");
const key = ref(0);
const steep = ref(0);
const formItems = ref();
function update(v) {
  fromDataJson.avate = v;
  const item = getFormItemByKey(fromDataJson.form, v);
  setrules(item);
  formItems.value = item;
  formKey.value = v;
  key.value += 1;
}
function getFormItemByKey(form, targetKey) {
  if (!Array.isArray(form)) return [];
  const targetItem = form.filter((item) => {
    return item.name === targetKey;
  });
  return targetItem.length > 0 ? targetItem[0].filedItems : [];
}
function getFrom() {
  ContactAPI.getPage().then((data) => {
    let json = data;
    Object.assign(fromDataJson, json);
    formKey.value = fromDataJson.avate;
    const item = getFormItemByKey(fromDataJson.form, fromDataJson.avate);
    setrules(item);
    formItems.value = item;
    key.value += 1;
  });
}
function setrules(item) {
  const phone = item.filter((a) => {
    return a.label == "联系电话";
  });
  if (phone.length > 0) {
    phone[0].rules.push({
      pattern: /^((1[3-9]\d{9})|(0\d{2,3}-\d{7,8}))$/,
      // 手机号 + 固定电话
      message: "请输入正确的手机号（11位）或固定电话（如010-12345678）",
      trigger: ["blur", "change"]
    });
  }
}
function setSteep() {
  steep.value = 1;
}
onMounted(() => {
  getFrom();
});
</script>
<style lang="scss" scoped>
.ecmbody {
  display: flex;
  width: 1220px;
  margin: 0 auto;
  flex-flow: column;
  line-height: 100%;
  letter-spacing: 0%;
  .ecmbody-nav {
    display: flex;
    width: 100%;
    font-weight: 500;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    font-family: Noto Sans SC;
    color: #333f48;
    span {
      font-weight: 700;
      font-style: Bold;
      font-size: 16px;
    }
    a:hover {
      color: #3d7eff;
      cursor: pointer;
    }
  }
  .ecmbody-steep {
    width: 100%;
    .ecmbody-contact-title {
      display: flex;
      width: 95%;
      font-family: Noto Sans SC;
      font-weight: 500;
      font-size: 28px;
      color: #3d9fa6;
      justify-content: center;
      margin-bottom: 30px;
      span {
        color: #333f48;
        height: 53px;
        line-height: 53px;
      }
    }
    .ecmbody-contact-tab {
      display: flex;
      width: 95%;
      height: 58px;
      font-family: Noto Sans SC;
      font-weight: 500;
      font-size: 26px;
      color: #333f48;
      justify-content: center;
      margin: 0px auto;
      border-width: 2px;
      border: 2px solid #2f80ed;
      align-items: center;
      border-radius: 4px;
      padding: 0px 10px;
      .nav-btn {
        display: flex;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 18px;
        height: 46px;
        color: #333;
        justify-content: center;
        align-items: center;
        width: 20%;
        cursor: pointer;
        font-weight: 500;
      }
      .nav-btn:hover {
        color: #1677ff;
      }
      .nav-btn.primary {
        background: #1677ff;
        color: #fff;
        border-radius: 4px;
      }
      .nav-btn.primary:hover {
        background: #4096ff;
      }
    }
    .ecmbody-contact {
      display: flex;
      font-family: Noto Sans SC;
      width: 95%;
      font-weight: 400;
      font-size: 18px;
      line-height: 30px;
      text-align: justify;
      vertical-align: middle;
      color: #757575;
      margin: 0 auto;
      padding-top: 3%;
      justify-content: center;
      .ecmbody-mess {
        display: flex;
        width: 100%;
      }
      :deep(.el-form-item__label) {
        color: #333;
        font-weight: 500;
        font-style: Medium;
        font-size: 15px;
        line-height: 100%;
        letter-spacing: 0%;
        text-align: center;
        vertical-align: middle;
        font-size: 18px;
      }
      :deep(.el-button > span) {
        align-items: center;
        display: inline-flex;
        font-size: 17px;
      }
      :deep(.el-select__placeholder.is-transparent) {
        color: #a8abb2;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        font-size: 15px;
      }
      :deep(.el-input__inner) {
        font-size: 15px;
        color: #000;
      }
      :deep(.el-textarea__inner) {
        font-size: 15px;
      }
      :deep(.el-textarea) {
        font-size: 15px;
        color: #000;
      }
      :deep(.el-select-dropdown__item) {
        font-size: 15px;
      }
      :deep(.el-select__placeholder) {
        color: #000;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        z-index: -1;
        font-size: 15px;
      }
      :deep(.el-form-item__error) {
        color: var(--el-color-danger);
        font-size: 15px;
        left: 0;
        line-height: 1;
        padding-top: 2px;
        position: absolute;
        top: 100%;
      }
      :deep(.el-form-item--default) {
        --font-size: 14px;
        --el-form-label-font-size: var(--font-size);
        margin-bottom: 25px;
      }
      :deep(.el-textarea__inner) {
        font-size: 15px;
        color: #000;
      }
    }
    .ecmbody-contact-img {
      margin-top: 20px;
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
    .ecmbody-zhanwei {
      width: 100%;
      display: flex;
      height: 60px;
    }
  }
  .ecmbody-steep1 {
    display: flex;
    width: 100%;
    height: 700px;
    align-items: center;
    justify-content: center;
    .ecmbody-mess1-text {
      font-family: Noto Sans SC;
      font-weight: 500;
      font-size: 32px;
      line-height: 40px;
      letter-spacing: 0%;
      color: #333;
    }
  }
  :deep(.el-select-dropdown__item) {
    box-sizing: border-box;
    color: #000;
    cursor: pointer;
    font-size: 16px;
    height: 34px;
    line-height: 34px;
    overflow: hidden;
    padding: 0 32px 0 20px;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
