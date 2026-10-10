<template>
  <div class="login">
    <!-- 登录页头部 -->
    <div class="login-header" style="display: none">
      <div class="flex-y-center">
        <el-switch
          v-model="isDark"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
          @change="toggleTheme"
        />
        <lang-select class="ml-2 cursor-pointer" />
      </div>
    </div>

    <!-- 登录页内容 -->
    <div class="login-form">
      <div class="login-left">
        <a href="#/index"><img src="@/assets/images/logo.png" /></a>
      </div>
      <el-form
        v-if="steps == 0"
        ref="loginFormRef"
        class="login-right"
        :model="loginFormData"
        :rules="loginRules"
      >
        <div class="form-title">
          <div class="form-title1">{{ defaultSettings.title }}</div>
          <div class="form-title2">未注册手机号/邮箱/用户名登录时将自动创建账号</div>
        </div>
        <el-segmented
          v-model="isPwdLogin"
          :options="options"
          style="background-color: #d5e1ed"
          @change="handleChange"
        />
        <div class="form-content">
          <!-- 用户名 -->
          <div v-if="isPwdLogin == '密码登录'">
            <el-form-item prop="account">
              <div class="input-wrapper">
                <el-icon class="mx-2">
                  <User />
                </el-icon>
                <el-input
                  ref="account"
                  v-model="loginFormData.account"
                  :placeholder="$t('login.account')"
                  name="account"
                  size="large"
                  class="h-[48px]"
                />
              </div>
            </el-form-item>
            <!-- 密码 -->
            <el-tooltip :visible="isCapslock" :content="$t('login.capsLock')" placement="right">
              <el-form-item prop="password">
                <div class="input-wrapper">
                  <el-icon class="mx-2">
                    <Lock />
                  </el-icon>
                  <el-input
                    v-model="loginFormData.password"
                    :placeholder="$t('login.password')"
                    type="password"
                    name="password"
                    size="large"
                    class="h-[48px] pr-2"
                    show-password
                    @keyup="checkCapslock"
                    @keyup.enter="handleLoginSubmit"
                  />
                </div>
              </el-form-item>
            </el-tooltip>
          </div>
          <div v-else>
            <!-- 手机号 -->
            <el-form-item prop="mobile">
              <div class="input-wrapper">
                <el-icon class="mx-2">
                  <Iphone />
                </el-icon>
                <el-input
                  ref="mobile"
                  v-model="loginFormData.mobile"
                  :placeholder="$t('login.mobile')"
                  name="mobile"
                  size="large"
                  class="h-[48px]"
                />
              </div>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item prop="captchaCode">
              <div class="input-wrapper">
                <div class="i-svg:captcha mx-2" />

                <el-input
                  v-model="loginFormData.captchaCode"
                  auto-complete="off"
                  size="large"
                  class="flex-1"
                  :placeholder="$t('login.captchaCode')"
                  @keyup.enter="handleLoginSubmit"
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
                      <span v-else style="color: #4e93f5; cursor: pointer">获取验证码</span>
                    </el-text>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </div>
          <div class="form-xieye">
            <div class="form-xieye1">
              <el-checkbox v-if="isPwdLogin == '密码登录'" v-model="isCheckBox">
                {{ $t("login.rememberMe") }}
              </el-checkbox>
            </div>

            <div class="form-xieye2">
              <el-link type="primary" @click="topass">
                {{ $t("login.forgetPassword") }}
              </el-link>
            </div>
          </div>
          <!-- 登录按钮 -->
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            class="w-full"
            @click.prevent="handleLoginSubmit"
          >
            {{ $t("login.login") }}
          </el-button>
          <div></div>
        </div>
        <!-- 登录协议 -->
        <div class="form-xieye">
          <div class="form-xieye3">
            <el-checkbox></el-checkbox>
            &nbsp;&nbsp;我已阅读并同意&nbsp;
            <el-link :underline="false" style="color: #4e93f5">使用协议</el-link>
            &nbsp;及&nbsp;
            <el-link :underline="false" style="color: #4e93f5">隐私政策</el-link>
          </div>
        </div>
        <!-- 第三方登录 -->
        <div class="form-footer">
          <div class="form-footer-left">
            <span>{{ $t("login.otherLoginMethods") }}:</span>
            &nbsp;
            <div class="inc">
              <div class="i-svg:wechat" />
              &nbsp;
              <!-- <div class="i-svg:wechat" /> -->
            </div>
          </div>
          <div class="form-footer-right">
            <div><span>服务热线：</span></div>
            <div>
              {{ $t("login.serviceHot") }}
              <div style="height: 5px">&nbsp;</div>
              <span style="padding-top: 10px">{{ $t("login.serviceHotline") }}</span>
            </div>
          </div>
        </div>
      </el-form>
      <div v-else class="form-contents">
        <div class="form-contents1">
          <div class="form-contents-top1">
            <el-icon :size="20">
              <Back />
            </el-icon>
            <span @click="back">返回</span>
          </div>
          <div class="form-contents-top2">请选择您要登入的机构</div>
          <div class="form-contents-top3">
            <div
              v-for="(it, index) in userMembers"
              :key="index"
              class="form-contents-btn"
              @click="openuser(it)"
            >
              <div class="form-contents-btn1">
                {{ it.orgName != "" ? it.orgName.charAt(0) : "无" }}
              </div>
              <div class="form-contents-btn2">
                <div class="form-contents-btn2-txt" :title="it.orgName">
                  <span @click="openuser(it)">
                    {{ it.orgName.length > 10 ? it.orgName.substring(0, 10) + "..." : it.orgName }}
                  </span>
                </div>
                <div class="form-contents-btn2-name">{{ it.orgRoleName }} &nbsp;{{ it.name }}</div>
              </div>
              <div class="form-contents-btn3">
                <el-icon color="#8A96A2" size="20"><ArrowRightBold /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 登录页底部 -->
    <div class="login-footer">
      <el-text size="small">
        Copyright © {{ new Date().getFullYear() }} ECM All Rights Reserved.
      </el-text>
    </div>
    <el-dialog
      v-model="forgetPassword"
      draggable
      :align-center="true"
      title="找回密码"
      :close-on-click-modal="false"
      width="390"
      :before-close="handleClose"
    >
      <template #default>
        <el-form
          ref="passwordChangeFormRef"
          :model="userUpForm"
          :inline="false"
          label-width="auto"
          class="forgetPassword"
          label-position="left"
          :rules="passwordChangeRules"
          style="width: 100%; font-size: 16px"
        >
          <el-row :gutter="5" style="margin-bottom: 15px">
            <el-segmented
              v-model="upPwd"
              :options="forgetPasswordOptions"
              style="background-color: #d5e1ed"
              @change="handleChange"
            />
          </el-row>
          <el-row :gutter="5" style="width: 100%; height: 50px">
            <el-col v-if="upPwd == '手机号验证'" :span="24">
              <el-form-item label="手机号：" prop="cellphone">
                <el-input v-model="userUpForm.cellphone" type="text" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
            <el-col v-else :span="24">
              <el-form-item label="邮 箱：" prop="email">
                <el-input v-model="userUpForm.email" type="text" placeholder="请输入邮箱" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="upPwd == '手机号验证'" :gutter="5" style="width: 100%; height: 50px">
            <el-col :span="24">
              <el-form-item label="验证码：" prop="code">
                <el-input
                  v-model="userUpForm.code"
                  style="width: 261px"
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
                      <span v-else style="color: #4e93f5; cursor: pointer">获取验证码</span>
                    </el-text>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else :gutter="5" style="width: 100%; height: 50px">
            <el-col :span="24">
              <el-form-item label="验证码：" prop="code">
                <el-input
                  v-model="userUpForm.code"
                  style="width: 261px"
                  placeholder="输入邮箱验证码"
                  :readonly="readonly"
                >
                  <template #append>
                    <el-text class="ml-5" @click="handleSendEmailCode(1)">
                      <span v-if="emailCountdown > 0" style="color: #4e93f5">
                        <span style="color: red">{{ `${emailCountdown}` }}s</span>
                        后重新发送
                      </span>
                      <span v-else style="color: #4e93f5; cursor: pointer">获取验证码</span>
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
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="forgetPassword = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import defaultSettings from "@/settings";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import AuthAPI from "@/api/auth";
import router from "@/router";
import { getAccessToken, getRememberedUser } from "@/utils/auth";
import { ThemeEnum } from "@/enums/ThemeEnum";
import md5 from "js-md5";
import { useSettingsStore, useUserStore, useDictStore } from "@/store";
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const dictStore = useDictStore();
const isPwdLogin = ref("密码登录");
const route = useRoute();
const { t } = useI18n();
const loginFormRef = ref();
const userMembers = ref([]);
const forgetPassword = ref(false);
const readonly = ref(true);
const mobileCountdowns = ref(0);
const steps = ref(0);
const emailCountdown = ref(0);
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
const loading = ref(false);
const isCapslock = ref(false);
const options = ["密码登录", "验证码登录"];
const forgetPasswordOptions = ["手机号验证", "邮箱验证"];
const isCheckBox = ref(false);
const mobileCountdown = ref(0);
const mobileTimer = ref();
const isbool = ref(false);
const mobileTimers = ref();
const upPwd = ref("手机号验证");
const userUpForm = ref({});
const EmailForms = reactive({});
const mobileForm = reactive({});
const passwordChangeFormRef = ref();
const emailTimer = ref();
const passwordChangeForm = reactive({});
userUpForm.value = Object.assign({
  newPassword: "",
  confirmPassword: "",
  yzm: "",
  cellphone: ""
});
isCheckBox.value = false;
const loginFormData = ref({
  account: "",
  password: "",
  captchaKey: "",
  captchaCode: "",
  mobile: "",
  platform: ""
});
const passwordChangeRules = {
  cellphone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [{ required: true, message: "请再次输入新密码", trigger: "blur" }]
};
const loginRules = computed(() => {
  return {
    account: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.account.required")
      }
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required")
      },
      {
        min: 6,
        message: t("login.message.password.min"),
        trigger: "blur"
      }
    ],
    captchaCode: [
      {
        required: false,
        trigger: "blur",
        message: t("login.message.captchaCode.required")
      }
    ],
    mobile: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.mobile.required")
      }
    ]
  };
});
function handleSendMobileCode() {
  if (!loginFormData.value.mobile) {
    ElMessage.error("请输入手机号");
    return;
  }
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(loginFormData.value.mobile)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  isbool.value = true;
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  mobileForm.receiverNo = loginFormData.value.mobile;
  mobileForm.type = 1;
  AuthAPI.createcode(mobileForm).then(() => {
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
    loadingInstance.close();
    isbool.value = false;
  });
}
function sendMobileCode() {
  if (!userUpForm.value.cellphone) {
    ElMessage.error("请输入手机号");
    return;
  }
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(userUpForm.value.cellphone)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  isbool.value = true;
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  mobileForm.receiverNo = userUpForm.value.cellphone;
  mobileForm.type = 4;
  AuthAPI.createcode(mobileForm).then(() => {
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
const handleChange = (value) => {
  if (value == "验证码登录") {
    loginFormData.value.account = "";
    loginFormData.value.password = "";
  } else {
    loginFormData.value.mobile = "";
    loginFormData.value.captchaCode = "";
  }
};
function handleSendEmailCode(v) {
  if (v == 1) {
    if (!userUpForm.value.email) {
      ElMessage.error("请输入邮箱");
      return;
    }
    const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (!reg.test(userUpForm.value.email)) {
      ElMessage.error("邮箱格式不正确");
      return;
    }
    isbool.value = true;
    EmailForms.receiverNo = userUpForm.value.email;
  }
  EmailForms.type = 3;
  EmailForms.senderUserId = 0;
  EmailForms.senderOrgId = 0;
  EmailForms.receiverUserId = 0;
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
async function handleLoginSubmit() {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      if (isPwdLogin.value == "验证码登录" && !loginFormData.value.captchaCode) {
        ElMessage.error("请输入手机验证码!");
        return;
      }
      loading.value = true;
      userStore.login({
        account: loginFormData.value.account,
        password: getRememberedUser() != "" && loginFormData.value.password.length >= 32 ? loginFormData.value.password : md5(loginFormData.value.password),
        captchaKey: loginFormData.value.captchaKey,
        captchaCode: loginFormData.value.captchaCode,
        mobile: loginFormData.value.mobile,
        platform: "web",
        ischeck: isCheckBox.value
      }).then(async () => {
        await userStore.getUserInfo();
        await dictStore.loadDictionaries();
        userMembers.value = userStore.userInfo.members;
        if (userMembers.value.length > 1) {
          steps.value = 1;
        } else {
          userStore.userInfo.members = userStore.userInfo.members[0];
          const { path, queryParams } = parseRedirect();
          if (queryParams.redirect) {
            router.push({ path: queryParams.redirect });
          } else {
            if (path == "/order" && queryParams.name != void 0 && queryParams.name != "") {
              const query = route.query;
              const params = {};
              params.name = queryParams.name;
              params.id = query.id;
              router.push({ path, query: params });
            } else {
              router.push({ path, query: queryParams });
            }
          }
        }
      }).catch(() => {
      }).finally(() => {
        loading.value = false;
      });
    }
  });
}
function openuser(it) {
  userStore.userInfo.members = it;
  const { path, queryParams } = parseRedirect();
  if (queryParams.redirect) {
    router.push({ path: queryParams.redirect });
  } else {
    if (path == "/order" && queryParams.name != void 0 && queryParams.name != "") {
      const query = route.query;
      const params = {};
      params.name = queryParams.name;
      params.id = query.id;
      router.push({ path, query: params });
    } else {
      router.push({ path, query: queryParams });
    }
  }
}
function back() {
  steps.value = 0;
}
function parseRedirect() {
  const query = route.query;
  const redirect = query.redirect ?? "/";
  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  return { path, queryParams };
}
const toggleTheme = () => {
  const newTheme = "light";
  settingsStore.changeTheme(newTheme);
};
function checkCapslock(event) {
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}
function topass() {
  forgetPassword.value = true;
}
function handleClose() {
  forgetPassword.value = false;
}
const handleSubmit = async () => {
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
        passwordChangeForm.cellphone = userUpForm.value.cellphone;
        passwordChangeForm.email = "";
        AuthAPI.forgetPassword(passwordChangeForm).then((data) => {
          forgetPassword.value = false;
          if (data === "") {
            ElNotification.success({
              title: "Success",
              message: "密码重置成功!",
              duration: 3e3
            });
          }
        }).finally(() => {
          forgetPassword.value = false;
        });
      } else {
        passwordChangeForm.newPassword = md5(userUpForm.value.newPassword);
        passwordChangeForm.confirmPassword = md5(userUpForm.value.confirmPassword);
        passwordChangeForm.code = userUpForm.value.code;
        passwordChangeForm.email = userUpForm.value.email;
        passwordChangeForm.cellphone = "";
        AuthAPI.forgetPassword(passwordChangeForm).then((data) => {
          forgetPassword.value = false;
          if (data === "") {
            ElNotification.success({
              title: "Success",
              message: "密码重置成功!",
              duration: 3e3
            });
          }
        }).finally(() => {
          forgetPassword.value = false;
        });
      }
    }
  });
};
onMounted(() => {
  const isLogins = getAccessToken();
  toggleTheme();
  if (isLogins) {
    userMembers.value = userStore.userInfo.members;
    steps.value = 1;
  } else {
    steps.value = 0;
  }
  const user = getRememberedUser();
  if (user !== "") {
    const data = JSON.parse(user);
    loginFormData.value.account = data.username;
    loginFormData.value.password = data.password;
    isCheckBox.value = true;
  }
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;

  .login-header {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: right;
    width: 100%;
    padding: 15px;

    .logo {
      width: 26px;
      height: 26px;
    }

    .title {
      margin: auto 5px;
      font-size: 24px;
      font-weight: bold;
      color: #3b82f6;
    }
  }

  .login-form {
    display: flex;
    justify-content: space-between;
    width: 1227px;
    height: 734px;
    padding: 70px 80px 40px 90px;
    overflow: hidden;
    background-color: #fff;
    background: url("@/assets/images/login-bg.png") no-repeat center right;
    @media (width <=460px) {
      width: 100%;
      padding: 20px;
    }
    .login-left {
      width: 20%;
    }
    .login-right {
      width: 489px;
      height: 579px;
      padding: 50px;
      background: url("@/assets/images/login-right.png") no-repeat center right;
    }
    .form-title {
      display: flex;
      flex-flow: column;
      padding: 0 0 20px;
      text-align: left;
      line-height: 100%;
      letter-spacing: 0%;
      .form-title1 {
        font-weight: 400;
        font-size: 24px;
        color: #333f48;
      }
      .form-title2 {
        padding-top: 13px;
        font-weight: 400;
        font-size: 13px;
        color: #757575;
      }
    }
    .form-content {
      margin-top: 50px;
      display: flex;
      flex-flow: column;
    }
    .form-contents {
      display: flex;
      min-height: 210px;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 489px;
      height: 579px;
      padding: 39px 50px;
      background: url("@/assets/images/login-right.png") no-repeat center right;
      .form-contents1 {
        display: flex;
        width: 100%;
        max-height: 500px;
        flex-flow: column;
        .form-contents-top1 {
          display: flex;
          width: 100%;
          height: 60px;
          span {
            font-family: Noto Sans SC;
            font-weight: 400;
            font-size: 14px;
            color: #757575;
            padding-left: 10px;
          }
          cursor: pointer;
        }
        .form-contents-top2 {
          display: flex;
          width: 100%;
          height: 80px;
          font-family: Noto Sans SC;
          font-weight: 400;
          font-size: 24px;
          letter-spacing: 0%;
          color: #333f48;
        }
        .form-contents-top3 {
          display: flex;
          flex-flow: column;
          width: 100%;
          max-height: 390px;
          overflow-y: auto;
        }
        .form-contents-btn {
          display: flex;
          width: 100%;
          height: 80px;
          border: 0.5px solid #c5d1dc;
          opacity: 1;
          gap: 12px;
          border-radius: 6px;
          border-width: 0.5px;
          align-items: center;
          background-color: #ffffff;
          padding: 20px;
          margin-bottom: 19px;
          cursor: pointer;
          .form-contents-btn1 {
            display: flex;
            background-color: #2f80ed;
            width: 50px;
            height: 50px;
            opacity: 1;
            border-radius: 25px;
            padding-left: 15px;
            font-family: Noto Sans SC;
            font-weight: Bold;
            font-size: 20px;
            align-items: center;
            color: #ffffff;
            cursor: pointer;
          }
          .form-contents-btn2 {
            display: flex;
            height: 50px;
            width: 70%;
            flex-flow: column;
            padding-top: 5px;
            .form-contents-btn2-txt {
              display: flex;
              font-family: Noto Sans SC;
              font-weight: 700;
              font-style: Bold;
              font-size: 20px;
              line-height: 100%;
              letter-spacing: 0%;
              color: #000;
              cursor: pointer;
            }
            .form-contents-btn2-name {
              padding-top: 3px;
              display: flex;
              text-align: left;
              color: #8a96a2;
            }
          }
          .form-contents-btn3 {
            display: flex;
            width: 5%;
            cursor: pointer;
            height: 50px;
            align-items: center;
          }
        }
      }
    }
    .form-xieye {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      width: 100%;
      .form-xieye1 {
        display: flex;
        width: 2%;
      }
      .form-xieye2 {
        display: flex;
        width: auto;
        height: 32px;
        line-height: 32px;
        color: #757575;
      }
      .form-xieye3 {
        display: flex;
        margin-top: 15px;
        width: auto;
        height: 32px;
        line-height: 32px;
        color: #757575;
      }
      .form-xieye4 {
        display: flex;
        width: auto;
        height: 32px;
        line-height: 32px;
        color: #4e93f5;
      }
    }
    .form-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 100%;
      color: #757575;
      margin-top: calc(100% - 85%);
      font-size: 13px;
      height: 20px;
      .form-footer-left {
        display: flex;
        height: 15px;
        line-height: 15px;
        .inc {
          display: flex;
          height: 15px;
          line-height: 15px;
          font-size: 15px;
          margin-top: 1px;
        }
      }
      .form-footer-right {
        padding-top: 16px;
        display: flex;
        font-weight: 400;
      }
      bottom: 0px;
    }
    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .captcha-img {
      height: 48px;
      cursor: pointer;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    .third-party-login {
      display: flex;
      justify-content: center;
      width: 100%;
      color: var(--el-text-color-secondary);

      *:not(:first-child) {
        margin-left: 20px;
      }

      .icon {
        cursor: pointer;
      }
    }
    :deep(.el-switch__core) {
      align-items: center;
      background: var(--el-switch-off-color);
      border: 1px solid var(--el-switch-border-color, var(--el-switch-off-color))
        --el-switch-border-color is not defined;
      border-radius: 10px;
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      height: 28px;
      min-width: 182px;
      outline: none;
      position: relative;
      transition:
        border-color var(--el-transition-duration),
        background-color var(--el-transition-duration);
    }
    :deep(.el-segmented) {
      --el-segmented-item-selected-color: var(--el-text-color-primary);
      --el-segmented-item-selected-bg-color: #ffffff;
      color: #757575;
      --el-border-radius-base: 6px;
    }
    :deep(.el-input-group__append) {
      background: none;
      color: blueviolet;
      border: none;
      box-shadow: none;
    }
  }

  .login-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 0;
    text-align: center;
  }
  .forgetPassword {
    width: 100%;
    :deep(.el-form-item) {
      border: 1px solid #ffffff;
      border-radius: 5px;
    }
    :deep(.el-input-group__append) {
      border-bottom-left-radius: 0;
      border-left: 0;
      border-top-left-radius: 0;
      box-shadow:
        0 0px 0 0 #dcdfe6 inset,
        0 0px 0 0 #dcdfe6 inset,
        0px 0 0 0 #dcdfe6 inset;
    }
    :deep(.el-input__inner) {
      -webkit-appearance: none;
      background: none;
      border: none;
      box-sizing: border-box;
      color: var(--el-input-text-color, var(--el-text-color-regular));
      flex-grow: 1;
      font-size: inherit;
      height: var(--el-input-inner-height);
      line-height: var(--el-input-inner-height);
      outline: none;
      padding: 0;
      width: 100%;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      padding-left: 5px;
    }
  }
}

:deep(.el-form-item) {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}

html.dark {
  .login {
    background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;

    .login-form {
      background: transparent;
      box-shadow: var(--el-box-shadow);
    }
  }
}
</style>
