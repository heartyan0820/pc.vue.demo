<template>
  <div class="ecmbody-content">
    <div class="ecmbody-content-right-top">系统信息</div>
    <el-divider />
    <div class="ecmbody-content-right-top3">
      <span>设置您的账号系统管理</span>
      <div class="ecmbody-content-right-top4">
        <div class="ecmbody-content-right-top4-left">
          <el-divider>主题设置</el-divider>
          <div class="flex-centers">
            <div class="flex-center">
              <el-switch
                v-model="isDark"
                active-icon="Moon"
                inactive-icon="Sunny"
                @change="changeTheme"
              />
            </div>
            <div class="py-1 flex-x-between">
              <span class="text-xs">{{ $t("settings.themeColor") }}</span>
              <ThemeColorPicker
                v-model="settingsStore.themeColor"
                @update:model-value="changeThemeColor"
              />
            </div>
            <div class="py-1 flex-x-between">
              <span class="text-xs">{{ $t("settings.watermark") }}</span>
              <el-switch v-model="settingsStore.watermarkEnabled" />
            </div>
          </div>
        </div>
        <div class="ecmbody-content-right-top4-right"></div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="visible"
    draggable
    :align-center="true"
    title="编辑账户信息"
    :close-on-click-modal="false"
    width="500"
    :before-close="handleClose"
  >
    <template #default>
      <div class="dialog_top">
        <img src="@/assets/images/qr.png" />
        <span class="dialog_title">重要信息确认</span>
      </div>
      <div class="dialog_content">
        <div class="dialog_content1"></div>
        <div class="dialog_content2"></div>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>defineOptions({
  name: "usersys",
  inheritAttrs: false
});
import { ThemeEnum } from "@/enums/ThemeEnum";
import { useSettingsStore } from "@/store";
const settingsStore = useSettingsStore();
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
const sidebarColor = ref(settingsStore.sidebarColorScheme);
const changeTheme = (val) => {
  isDark.value = val;
  settingsStore.changeTheme(isDark.value ? ThemeEnum.DARK : ThemeEnum.LIGHT);
};
function changeThemeColor(color) {
  settingsStore.changeThemeColor(color);
}
</script>

<style lang="scss" scoped>
.ecmbody-content {
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
  .ecmbody-content-right-top3 {
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
    .ecmbody-content-right-top4 {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .ecmbody-content-right-top4-left {
        display: flex;
        width: 47%;
        margin-top: 3%;
        flex-flow: column;
        .flex-centers {
          display: flex;
          flex-flow: column;
          width: 100%;
        }
      }
      .ecmbody-content-right-top4-right {
        display: flex;
        width: 47%;
        margin-top: 3%;
      }
    }
    :deep(.el-form-item__content) {
      line-height: 32px;
      font-size: 18px;
      font-family: Noto Sans SC;
      font-weight: 400;
      color: #757575;
    }
    :deep(.el-form-item__label) {
      justify-content: flex-start;
      text-align: left;
      font-size: 18px;
      font-family: Noto Sans SC;
      font-weight: 400;
      color: #757575;
    }
  }
}
</style>
