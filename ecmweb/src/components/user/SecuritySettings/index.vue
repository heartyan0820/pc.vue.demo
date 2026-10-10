<template>
  <div class="ecmbody-contentzhse">
    <div class="ecmbody-content-right-top">安全设置</div>
    <el-divider />
    <div class="ecmbody-content-right-top2">
      <span>设置您的账号安全认证</span>
      <div class="ecmbody-content-right-top2-rz">
        <div class="ecmbody-content-right-top2-rz1">
          <div class="img" @click="() => handleOpenDialog(DialogType.PASSWORD)">
            <img src="@/assets/images/xgmm.png" width="130px" />
            <span>修改密码</span>
          </div>
        </div>
        <div class="ecmbody-content-right-top2-rz1">
          <div class="img" @click="() => handleOpenDialog(DialogType.MOBILE)">
            <img src="@/assets/images/sjyz.png" width="130px" />
            <span v-if="user.mobile != ''" class="ok">修改手机</span>
            <span v-else>绑定手机</span>
          </div>
        </div>
        <div class="ecmbody-content-right-top2-rz1">
          <div class="img" @click="() => handleOpenDialog(DialogType.EMAIL)">
            <img src="@/assets/images/yxrz.png" width="130px" />
            <span v-if="user.email != ''" class="ok">修改邮箱</span>
            <span v-else>绑定邮箱</span>
          </div>
        </div>
        <div
          class="ecmbody-content-right-top2-rz1"
          @click="() => handleOpenDialog(DialogType.WEIXIN)"
        >
          <div class="img">
            <img src="@/assets/images/wxrz.png" width="130px" />
            <span style="background-color: #ff8e72">绑定微信</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      draggable
      :align-center="true"
      width="410"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <template #default>
        <el-form
          v-if="dialog.type === DialogType.PASSWORD"
          ref="passwordChangeFormRef"
          :model="userUpForm"
          :inline="false"
          label-width="auto"
          label-position="left"
          :rules="passwordChangeRules"
          style="width: 100%"
        >
          <el-row :gutter="5" style="margin-bottom: 10px; margin-left: 8px">
            <el-segmented
              v-model="upPwd"
              :options="options"
              style="background-color: #d5e1ed; font-size: 17px"
              @change="handleChange"
            />
          </el-row>
          <el-row style="width: 100%; height: 45px">
            <el-col :span="24">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账号：">
                {{ userForm.account }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5" style="width: 100%; height: 45px">
            <el-col v-if="upPwd == '手机号验证'" :span="10">
              <el-form-item label="&nbsp;&nbsp;手机号：">{{ userForm.cellphone }}</el-form-item>
            </el-col>
            <el-col v-else :span="14">
              <el-form-item label="&nbsp;&nbsp;邮箱：">{{ userForm.email }}</el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="upPwd == '手机号验证'" :gutter="5" style="width: 100%; height: 45px">
            <el-col :span="24">
              <el-form-item label="验证码：" prop="code">
                <el-input
                  v-model="userUpForm.code"
                  placeholder="输入手机验证码"
                  :readonly="readonly"
                >
                  <template #append>
                    <el-text
                      class="ml-5"
                      :disabled="mobileCountdowns > 0 || isbool"
                      @click="sendMobileCode"
                    >
                      <span v-if="mobileCountdowns > 0" style="color: #4e93f5">
                        <span style="color: red">{{ `${mobileCountdowns}` }}s</span>
                        后重新发送
                      </span>
                      <span v-else style="color: #4e93f5; cursor: pointer; font-size: 16px">
                        获取验证码
                      </span>
                    </el-text>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else :gutter="5" style="width: 100%; height: 45px">
            <el-col :span="24">
              <el-form-item label="验证码：" prop="code">
                <el-input
                  v-model="userUpForm.code"
                  placeholder="输入邮箱验证码"
                  :readonly="readonly"
                >
                  <template #append>
                    <el-text class="ml-5" @click="handleSendEmailCode(1)">
                      <span v-if="emailCountdown > 0" style="color: #4e93f5">
                        <span style="color: red">{{ `${emailCountdown}` }}s</span>
                        后重新发送
                      </span>
                      <span v-else style="color: #4e93f5; cursor: pointer; font-size: 16px">
                        获取验证码
                      </span>
                    </el-text>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="新密码：" prop="newPassword" type="text">
                <el-input
                  v-model="userUpForm.newPassword"
                  type="password"
                  show-password
                  placeholder="请输入新密码"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="5" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="确认密码：" prop="confirmPassword">
                <el-input
                  v-model="userUpForm.confirmPassword"
                  type="password"
                  placeholder="请输入确认密码"
                  show-password
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 绑定手机 -->
        <el-form
          v-else-if="dialog.type === DialogType.MOBILE"
          ref="mobileBindingFormRef"
          :model="mobileUpdateForm"
          :rules="mobileBindingRules"
          :label-width="120"
          label-position="left"
          style="width: 100%"
        >
          <el-form-item label="手机号码：" prop="mobile">
            <el-input v-model="mobileUpdateForm.mobile" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item label="验证码：" prop="code">
            <el-input
              v-model="mobileUpdateForm.code"
              type="text"
              placeholder="请输入手机验证码"
              :readonly="readonly"
            >
              <template #append>
                <el-text
                  class="ml-5"
                  :disabled="mobileCountdown > 0 || isbool"
                  @click="handleSendMobileCode"
                >
                  <span v-if="mobileCountdown > 0" style="color: #4e93f5">
                    <span style="color: red">{{ `${mobileCountdown}` }}s</span>
                    后重新发送
                  </span>
                  <span v-else style="color: #4e93f5; cursor: pointer; font-size: 16px">
                    获取验证码
                  </span>
                </el-text>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <!-- 绑定邮箱 -->
        <el-form
          v-else-if="dialog.type === DialogType.EMAIL"
          ref="emailBindingFormRef"
          :model="emailUpdateForm"
          :rules="emailBindingRules"
          :label-width="100"
          label-position="left"
          style="width: 100%"
        >
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="emailUpdateForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="验证码：" prop="code">
            <el-input v-model="emailUpdateForm.code" placeholder="请输入邮箱" :readonly="readonly">
              <template #append>
                <el-text
                  class="ml-5"
                  :disabled="emailCountdown > 0 || isbool"
                  style="font-size: 18px"
                  @click="handleSendEmailCode(2)"
                >
                  <span v-if="emailCountdown > 0" style="color: #4e93f5">
                    <span style="color: red">{{ `${emailCountdown}` }}s</span>
                    后重新发送
                  </span>
                  <span v-else style="color: #4e93f5; cursor: pointer; font-size: 16px">
                    获取验证码
                  </span>
                </el-text>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <!-- 绑定微信 -->
        <div v-else-if="dialog.type === DialogType.WEIXIN">开发中...</div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>import AuthAPI from "@/api/auth";
import md5 from "js-md5";
const props = defineProps({
  userData: {
    type: Object,
    default: null
  }
});
var DialogType = /* @__PURE__ */ ((DialogType2) => {
  DialogType2["PASSWORD"] = "password";
  DialogType2["MOBILE"] = "mobile";
  DialogType2["EMAIL"] = "email";
  DialogType2["WEIXIN"] = "weixin";
  return DialogType2;
})(DialogType || {});
const isbool = ref(false);
const readonly = ref(true);
const upPwd = ref("手机号验证");
const passwordChangeForm = reactive({});
const mobileUpdateForm = reactive({});
const EmailForms = reactive({});
const mobileForm = reactive({});
const emailUpdateForm = reactive({});
const dialog = reactive({
  visible: false,
  title: "",
  type: ""
  // 修改密码、绑定手机、绑定邮箱
});
const options = ["手机号验证", "邮箱验证"];
const userForm = ref({});
const user = ref({});
const userUpForm = ref({});
const mobileCountdown = ref(0);
const mobileTimer = ref();
const mobileCountdowns = ref(0);
const mobileTimers = ref();
const passwordChangeFormRef = ref();
const mobileBindingFormRef = ref();
const emailBindingFormRef = ref();
const emailCountdown = ref(0);
const emailTimer = ref();
const passwordChangeRules = {
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请再次输入新密码", trigger: "blur" }]
};
const mobileBindingRules = {
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};
const emailBindingRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur"
    }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};
userForm.value = props.userData;
userUpForm.value = Object.assign({
  newPassword: "",
  confirmPassword: "",
  yzm: "",
  phone: userForm.value.cellphone
});
const handleOpenDialog = (type) => {
  dialog.type = type;
  switch (type) {
    case "password" /* PASSWORD */:
      dialog.title = "修改密码";
      userUpForm.value.yzm = "";
      userUpForm.value.newPassword = "";
      userUpForm.value.confirmPassword = "";
      readonly.value = true;
      break;
    case "mobile" /* MOBILE */:
      dialog.title = "绑定手机";
      mobileUpdateForm.mobile = userForm.value.cellphone;
      readonly.value = true;
      break;
    case "email" /* EMAIL */:
      dialog.title = "绑定邮箱";
      readonly.value = true;
      break;
    case "weixin" /* WEIXIN */:
      dialog.title = "绑定微信";
      break;
  }
  dialog.visible = true;
};
const loadUserProfile = async () => {
  const data = await AuthAPI.getProfile();
  user.value = data;
};
function handleClose() {
  dialog.visible = false;
}
function sendMobileCode() {
  if (!userForm.value.cellphone) {
    ElMessage.error("请绑定手机号");
    return;
  }
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(userForm.value.cellphone)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  isbool.value = true;
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  mobileForm.receiverNo = userUpForm.value.phone;
  mobileForm.senderOrgId = userForm.value.orgId;
  mobileForm.type = 4;
  AuthAPI.sendMobileCode(mobileForm).then(() => {
    ElMessage.success("验证码发送成功");
    isbool.value = false;
    mobileCountdowns.value = 60;
    mobileTimers.value = setInterval(() => {
      if (mobileCountdowns.value > 0) {
        mobileCountdowns.value -= 1;
      } else {
        clearInterval(mobileTimers.value);
      }
    }, 1e3);
    loadingInstance.close();
    readonly.value = false;
  }).finally(() => {
    loadingInstance.close();
    isbool.value = false;
    readonly.value = false;
  });
}
function handleSendMobileCode() {
  if (!mobileUpdateForm.mobile) {
    ElMessage.error("请输入手机号");
    return;
  }
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(mobileUpdateForm.mobile)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  isbool.value = true;
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  EmailForms.receiverNo = mobileUpdateForm.mobile;
  EmailForms.type = 2;
  EmailForms.senderUserId = userForm.value.userId;
  EmailForms.senderOrgId = userForm.value.orgId;
  EmailForms.receiverUserId = userForm.value.userId;
  AuthAPI.sendMobileCode(EmailForms).then(() => {
    ElMessage.success("验证码发送成功");
    isbool.value = false;
    mobileCountdown.value = 60;
    mobileTimer.value = setInterval(() => {
      if (mobileCountdown.value > 0) {
        mobileCountdown.value -= 1;
      } else {
        clearInterval(mobileTimer.value);
      }
    }, 1e3);
    loadingInstance.close();
  }).finally(() => {
    readonly.value = false;
    loadingInstance.close();
    isbool.value = false;
  });
}
function handleSendEmailCode(v) {
  if (v == 2) {
    if (!emailUpdateForm.email) {
      ElMessage.error("请输入邮箱");
      return;
    }
    const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (!reg.test(emailUpdateForm.email)) {
      ElMessage.error("邮箱格式不正确");
      return;
    }
    isbool.value = true;
    EmailForms.receiverNo = emailUpdateForm.email;
  }
  if (v == 1) {
    if (!userForm.value.email) {
      ElMessage.error("请输入邮箱");
      return;
    }
    const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (!reg.test(userForm.value.email)) {
      ElMessage.error("邮箱格式不正确");
      return;
    }
    isbool.value = true;
    EmailForms.receiverNo = userForm.value.email;
  }
  EmailForms.type = 3;
  EmailForms.senderUserId = userForm.value.userId;
  EmailForms.senderOrgId = userForm.value.orgId;
  EmailForms.receiverUserId = userForm.value.userId;
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  AuthAPI.sendEmailCode(EmailForms).then(() => {
    isbool.value = false;
    ElMessage.success("验证码发送成功");
    emailCountdown.value = 60;
    emailTimer.value = setInterval(() => {
      if (emailCountdown.value > 0) {
        emailCountdown.value -= 1;
      } else {
        clearInterval(emailTimer.value);
      }
    }, 1e3);
    loadingInstance.close();
  }).finally(() => {
    readonly.value = false;
    isbool.value = false;
    loadingInstance.close();
  });
}
const handleSubmit = async () => {
  if (dialog.type === "password" /* PASSWORD */) {
    passwordChangeFormRef.value?.validate((valid) => {
      if (valid) {
        if (userUpForm.value.newPassword !== userUpForm.value.confirmPassword) {
          ElNotification({
            title: "Error",
            message: "两次输入的密码不一致!",
            type: "error",
            duration: 3e3
          });
          return;
        }
        if (upPwd.value == "手机号验证") {
          passwordChangeForm.newPassword = md5(userUpForm.value.newPassword);
          passwordChangeForm.confirmPassword = md5(userUpForm.value.confirmPassword);
          passwordChangeForm.code = userUpForm.value.code;
          passwordChangeForm.cellphone = userForm.value.cellphone;
          passwordChangeForm.email = "";
          const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
          AuthAPI.changePassword(passwordChangeForm).then((data) => {
            dialog.visible = false;
            loadingInstance.close();
            if (data === "") {
              ElNotification.success({
                title: "Success",
                message: "密码修改成功!",
                duration: 3e3
              });
            }
          }).finally(() => {
            dialog.visible = false;
            loadingInstance.close();
          });
        } else {
          passwordChangeForm.newPassword = md5(userUpForm.value.newPassword);
          passwordChangeForm.confirmPassword = md5(userUpForm.value.confirmPassword);
          passwordChangeForm.code = userUpForm.value.code;
          passwordChangeForm.email = userForm.value.email;
          const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
          AuthAPI.changePassword(passwordChangeForm).then((data) => {
            dialog.visible = false;
            loadingInstance.close();
            if (data === "") {
              ElNotification.success({
                title: "Success",
                message: "密码修改成功!",
                duration: 3e3
              });
            }
          }).finally(() => {
            dialog.visible = false;
            loadingInstance.close();
          });
        }
      }
    });
  } else if (dialog.type === "mobile" /* MOBILE */) {
    mobileBindingFormRef.value?.validate((valid) => {
      if (valid) {
        const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
        AuthAPI.bindOrChangeMobile(mobileUpdateForm).then((res) => {
          if (res !== false) {
            ElNotification.success({
              title: "Success",
              message: "手机号绑定成功!",
              duration: 3e3
            });
            dialog.visible = false;
            loadingInstance.close();
            loadUserProfile();
          }
        }).finally(() => {
          loadingInstance.close();
        });
      }
    });
  } else if (dialog.type === "email" /* EMAIL */) {
    emailBindingFormRef.value?.validate((valid) => {
      if (valid) {
        const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
        AuthAPI.bindOrChangeEmail(emailUpdateForm).then((res) => {
          if (res !== false) {
            ElNotification.success({
              title: "Success",
              message: "邮箱绑定成功!",
              duration: 3e3
            });
            dialog.visible = false;
            loadUserProfile();
            loadingInstance.close();
          }
        }).finally(() => {
          loadingInstance.close();
        });
      }
    });
  } else if (dialog.type === "weixin" /* WEIXIN */) {
    ElMessage.success("开发中...");
  }
};
const handleChange = (value) => {
  if (value == "邮箱验证") {
    userUpForm.value.code = "";
    userUpForm.value.newPassword = "";
  } else {
    userUpForm.value.code = "";
    userUpForm.value.newPassword = "";
  }
};
onMounted(() => {
  loadUserProfile();
});
</script>

<style lang="scss" scoped>
.ecmbody-contentzhse {
  display: flex;
  width: 100%;
  background-color: #ffffff;
  flex-flow: column;
  .ecmbody-content-right-top {
    display: flex;
    font-family: Noto Sans SC;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: 0%;
    color: #333f48;
    height: auto;
  }
  .ecmbody-content-right-top1 {
    display: flex;
    width: 100%;
    .ecmbody-content-right-top1-left {
      display: flex;
      width: 80%;
      .ecmbody-content-right-top1-left1 {
        width: auto;
        display: flex;
      }
      .ecmbody-content-right-top1-left2 {
        display: flex;
        font-family: Noto Sans SC;
        font-weight: 700;
        font-size: 18px;
        flex-flow: column;
        padding-left: 3%;
        justify-content: center;
        span {
          font-family: Noto Sans SC;
          font-weight: 400;
          font-size: 18px;
          vertical-align: middle;
          color: #757575;
          padding-top: 10px;
        }
      }
    }
    .ecmbody-content-right-top1-right {
      display: flex;
      width: 20%;
      span {
        height: 30px;
        border-radius: 6px;
        width: 120px;
        background-color: #4a5a6a;
        text-align: center;
        line-height: 30px;
        color: #ffffff;
        font-family: Noto Sans SC;
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
      }
    }
  }
  .ecmbody-content-right-top2 {
    display: flex;
    width: 100%;
    flex-flow: column;
    span {
      font-family: Noto Sans SC;
      font-weight: 400;
      font-size: 18px;
      color: #757575;
      text-align: left;
    }
    .ecmbody-content-right-top2-rz {
      display: flex;
      width: 100%;
      margin-top: 10%;
      .ecmbody-content-right-top2-rz1 {
        display: flex;
        width: 33.3%;
        justify-content: center;
        .img {
          display: flex;
          cursor: pointer;
          flex-flow: column;
          span {
            width: 130px;
            height: 45px;
            border-radius: 6px;
            background-color: #4195f9;
            backdrop-filter: blur(20px);
            color: #ffffff;
            margin-top: 20px;
            text-align: center;
            line-height: 45px;
          }
          .ok {
            width: 130px;
            height: 45px;
            border-radius: 6px;
            background-color: #ffffff;
            backdrop-filter: blur(20px);
            color: #000;
            margin-top: 20px;
            text-align: center;
            color: #4195f9;
            line-height: 45px;
            border-radius: 6px;
            border: 0.5px solid #4195f9;
          }
        }
      }
    }
  }
  :deep(.el-form-item__content) {
    line-height: 32px;
    font-size: 18px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #000000;
  }
  :deep(.el-form-item__label) {
    justify-content: flex-start;
    text-align: left;
    font-size: 18px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #333f48;
  }
  :deep(.el-input__inner, .el-select__input) {
    font-size: 16px !important;
    color: #000000;
  }
}
</style>
