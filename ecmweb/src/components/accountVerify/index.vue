<template>
  <div class="ecmbody-content-zhsz">
    <div class="ecmbody-content-right-top">账户设置</div>
    <el-divider />
    <div class="ecmbody-content-right-top1">
      <div class="ecmbody-content-right-top1-left">
        <div class="ecmbody-content-right-top1-left1">
          <el-avatar :size="60" :src="userStore.userInfo.avatar" />
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="Loading..."
            type="info"
            style="margin-top: 32px; margin-left: -10px"
            circle
            :icon="Camera"
            size="small"
            @click="triggerFileUpload"
          />
          <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
        </div>
        <div class="ecmbody-content-right-top1-left2">
          {{ userForm.name }}
          <span>{{ userForm.orgName }}</span>
        </div>
      </div>
      <div class="ecmbody-content-right-top1-right">
        <span @click="openDialog">编辑</span>
      </div>
    </div>
    <div class="ecmbody-content-right-top2">
      <el-form
        :model="userForm"
        label-width="auto"
        label-position="left"
        style="width: 80%; font-size: 16px"
      >
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label="账号：">{{ userForm.account }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号：">{{ userForm.orgId }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label="手机号：">{{ userForm.cellphone }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构：">{{ userForm.orgName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label="昵称：">{{ userForm.title }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名：">{{ userForm.name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label="邮箱：">{{ userForm.email }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册时间：">{{ userForm.createTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label="所属地区：">{{ userForm.address }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下单次数：">{{ userForm.orderNumber }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item label="完成订单：">{{ userForm.orderOk }}</el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="12">
            <el-form-item>
              <el-button type="danger" @click="deleteuser">删除账户</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      v-model="visible"
      draggable
      :align-center="true"
      title="编辑账户信息"
      :close-on-click-modal="false"
      width="600"
      :before-close="handleClose"
    >
      <template #default>
        <el-form :model="userUpForm" style="font-size: 16px">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="10">
              <el-form-item label="账号：">{{ userUpForm.account }}</el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="编号：">{{ userUpForm.orgId }}</el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="10">
              <el-form-item label="手机号：">
                {{ userUpForm.cellphone }}
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="机构：">
                {{ userUpForm.orgName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="10">
              <el-form-item label="邮箱：">
                {{ userUpForm.email }}
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="所属地区：">
                {{ userUpForm.address }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="10">
              <el-form-item label="昵称："><el-input v-model="userUpForm.title" /></el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="姓名："><el-input v-model="userUpForm.name" /></el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="ok">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Camera } from "@element-plus/icons-vue";
import { useUserStore, useTagsViewStore, useWebSocketStore } from "@/store";
import settings from "@/settings";
import OrderAPI from "@/api/order";
import OrgMemberAPI from "@/api/system/orgMember";
import FileAPI from "@/api/file";
import AuthAPI from "@/api/auth";
import { ElLoading } from "element-plus";
const props = defineProps({
  userData: {
    type: Object,
    default: null
  }
});
const fullscreenLoading = ref(false);
const emit = defineEmits(["setUser"]);
const visible = ref(false);
const userStore = useUserStore();
const userForm = ref({});
const userUpForm = ref({});
const websocketStore = useWebSocketStore();
const tagsViewStore = useTagsViewStore();
const router = useRouter();
userForm.value = props.userData;
const organParams = ref({});
userUpForm.value = Object.assign({}, userForm.value);
function ok() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading..."
  });
  const id = userStore.userInfo.members.id;
  organParams.value = userUpForm.value;
  OrderAPI.updateInfo(id, organParams.value).then(() => {
    ElNotification({
      title: "Success",
      message: "保存成功!",
      type: "success",
      duration: 3e3
    });
    emit("setUser");
    loading.close();
  });
  visible.value = false;
}
function openDialog() {
  visible.value = true;
}
function handleClose() {
  visible.value = false;
}
const chunk = reactive({
  file: Blob,
  filePartName: "",
  urlParameter: "",
  partNumber: 0,
  chunks: 0,
  size: 0,
  start: 0,
  end: 0,
  total: 0
});
const fileInput = ref(null);
const triggerFileUpload = () => {
  fileInput.value?.click();
};
const handleFileChange = async (event) => {
  const target = event.target;
  const file = target.files ? target.files[0] : null;
  const fileChunks = [];
  var maxFileSizeMB = 4;
  var bufferChunkSize = maxFileSizeMB * (1024 * 1024);
  var fileStreamPos = 0;
  var endPos = bufferChunkSize;
  var size = file.size;
  while (fileStreamPos < size) {
    var fileChunkInfo = {
      file: file.slice(fileStreamPos, endPos),
      start: fileStreamPos,
      end: endPos
    };
    fileChunks.push(fileChunkInfo);
    fileStreamPos = endPos;
    endPos = fileStreamPos + bufferChunkSize;
  }
  var totalParts = fileChunks.length;
  var partCount = 0;
  var chunks = null;
  while (chunks = fileChunks.shift()) {
    partCount++;
    chunk.file = chunks.file;
    chunk.filePartName = file.name;
    chunk.urlParameter = "";
    chunk.partNumber = partCount;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks.start;
    chunk.end = chunks.end;
    chunk.total = size;
    UploadFileChunk(chunk);
  }
};
async function UploadFileChunk(chunk2) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  fullscreenLoading.value = true;
  await FileAPI.upload(formData).then(async (data) => {
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurls = datas.fileUrl;
      const imgurl = settings.fileurl + imgurls.replace("&width=400", "");
      await AuthAPI.updateProfile({
        avatar: imgurl
      });
      userStore.userInfo.avatar = imgurl;
      fullscreenLoading.value = false;
      ElNotification({
        title: "Success",
        message: "头像上传成功!",
        type: "success",
        duration: 3e3
      });
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}!`,
      type: "error",
      duration: 3e3
    });
  }).finally(() => {
    fullscreenLoading.value = false;
  });
}
function deleteuser() {
  ElMessageBox.confirm("删除账户之后,不能再登录使用,确定删除该账户吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).then(() => {
    const orgid = userUpForm.value.id;
    OrgMemberAPI.cancel(orgid).then(() => {
      userStore.logout().then(() => {
        websocketStore.disconnect();
        tagsViewStore.delAllViews();
      }).then(() => {
        router.push(`/index`).then(() => {
          window.location.reload();
        });
      });
    });
  });
}
</script>

<style lang="scss" scoped>
.ecmbody-content-zhsz {
  display: flex;
  width: 100%;
  background-color: #ffffff;
  flex-flow: column;
  .ecmbody-content-right-top {
    display: flex;
    font-family: Noto Sans SC;
    font-weight: 700;
    font-size: 24px;
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
    justify-content: center;
    margin-top: 5%;
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

  :deep(.el-input__inner) {
    /* 你需要的样式，示例修改字体大小、边框、高度、圆角等 */
    font-size: 16px !important; /* 字体大小（和全局区分） */
    color: #000;
  }
}
</style>
