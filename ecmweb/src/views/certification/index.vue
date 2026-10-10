<template>
  <div class="ecmbody">
    <div class="ecmbody-top">
      <span style="font-weight: 500" @click="to">个人中心</span>
      &nbsp; /&nbsp; 认证申请
    </div>
    <div class="ecmbody-top1">申请认证</div>
    <div v-if="steps == 0" class="ecmbody-content">
      <div class="ecmbody-content-top1">
        欢迎加入e齿盟！
        <br />
        <br />
        <br />
        <span>尊敬的用户，感谢您选择e齿盟医疗服务平台，做为认证诊所用户，平台将为您提供......</span>
      </div>
      <div class="ecmbody-content-top2">
        <el-form
          ref="certificModule"
          :rules="rules"
          :model="userCertificationForm"
          :inline="false"
          style="width: 100%; font-size: 16px"
          label-width="140px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="机构名称：" prop="name">
                <el-input v-model="userCertificationForm.name" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构编码：" prop="code">
                <el-input v-model="userCertificationForm.code" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="信用号：" prop="creditNumber">
                <el-input v-model="userCertificationForm.creditNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="机构简称：" prop="shortName">
                <el-input v-model="userCertificationForm.shortName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人代表：" prop="legalPerson">
                <el-input v-model="userCertificationForm.legalPerson" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人：" prop="contact">
                <el-input v-model="userCertificationForm.contact" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="注册地址：" prop="registAddress">
                <el-input v-model="userCertificationForm.registAddress" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="办公地址：" prop="address">
                <el-input v-model="userCertificationForm.address" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="contactPhone">
                <el-input v-model="userCertificationForm.contactPhone" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="E-mail：" prop="email">
                <el-input v-model="userCertificationForm.email" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注：" prop="remark">
                <el-input
                  v-model="userCertificationForm.remark"
                  type="textarea"
                  style="width: 438px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营业执照：" prop="businesspUploads">
                <div style="display: flex">
                  <el-upload
                    ref="upload"
                    v-model="businesspPicUrls"
                    :http-request="businesspUpload"
                    :show-file-list="false"
                    class="upload-demos"
                    :limit="1"
                    :loading="loading"
                    :on-exceed="handleExceed"
                    list-type="picture-card"
                  >
                    <img src="@/assets/images/upimg.png" width="50px" style="cursor: pointer" />
                  </el-upload>

                  <div v-for="(item, index) in businesspPicUrls" :key="index" class="upfiles">
                    <div class="upfile-txts">
                      <img :src="settings.fileurl + item.url" width="50px" height="50px" />
                    </div>
                    <span title="删除文件" @click="handleRemove(item.name, 1)">
                      <img src="@/assets/images/del.png" />
                    </span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="医疗许可证：" prop="medicalUploads">
                <div style="display: flex">
                  <el-upload
                    ref="uploads"
                    v-model="medicalPicUrls"
                    :http-request="medicalUpload"
                    class="upload-demos"
                    :limit="1"
                    :loading="loadings"
                    :show-file-list="false"
                    :on-exceed="handleExceeds"
                    list-type="picture-card"
                  >
                    <img src="@/assets/images/upimg.png" style="cursor: pointer" />
                  </el-upload>

                  <div v-for="(item, index) in medicalPicUrls" :key="index" class="upfiles">
                    <div class="upfile-txts">
                      <img :src="settings.fileurl + item.url" width="50px" height="50px" />
                    </div>
                    <span title="删除文件" @click="handleRemove(item.name, 2)">
                      <img src="@/assets/images/del.png" />
                    </span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="steps == 1" class="ecmbody-content1">
      <div class="ecmbody-ok">
        <img src="@/assets/images/Frameok1.png" />
        <div class="ecmbody-ok-txt">
          <div class="ecmbody-ok-txt2">页面将于&nbsp;</div>
          <div class="ecmbody-ok-txt1">{{ countdown }}</div>
          <div class="ecmbody-ok-txt2">
            &nbsp;秒后跳转到个人中心&nbsp;
            <span @click="openUser">立即跳转</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="steps == 0" class="ecmbody-foot">
      <div class="ecmbody-foot-btn" @click="submit">提 交</div>
    </div>
    <div class="ecmbody-zhanwei"></div>
  </div>
</template>

<script setup>
import settings from "@/settings";
defineOptions({
  name: "certification",
  inheritAttrs: false
});
import OrgCustomerAPI from "@/api/orgCustomer";
import CustomerAPI from "@/api/system/orgCustomer";
import FileAPI from "@/api/file";
import router from "@/router";
import { useUserStore } from "@/store";
const userCertificationForm = reactive({
  businesspUploads: "",
  medicalUploads: ""
});
const chunk = reactive({
  file: Blob,
  filePartName: "",
  urlParameter: "",
  originalFileName: "",
  partNumber: 0,
  chunks: 0,
  size: 0,
  start: 0,
  end: 0,
  total: 0
});
const steps = ref(0);
steps.value = 0;
const countdown = ref(5);
const upload = ref();
const uploads = ref();
const timer = ref();
const loading = ref(false);
const loadings = ref(false);
const businesspPicUrls = ref([]);
const medicalPicUrls = ref([]);
const certificModule = ref();
const rules = {
  name: [{ required: true, message: "请输入医疗机构名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入营业执照编号", trigger: "blur" }],
  creditNumber: [{ required: true, message: "请输入医疗许可证编号", trigger: "blur" }],
  businesspUploads: [{ required: true, message: "请上传营业执照", trigger: "change" }],
  medicalUploads: [{ required: true, message: "请上传医疗许可证", trigger: "change" }]
};
const userStore = useUserStore();
function businesspUpload(options) {
  const file = options.file;
  const fileChunks = [];
  var maxFileSizeMB = 2;
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
  const fileName = getFileExtension(file.name);
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk2 = {};
    chunk2.file = chunks2.file;
    chunk2.filePartName = fileName;
    chunk2.originalFileName = file.name;
    chunk2.urlParameter = "";
    chunk2.partNumber = index + 1;
    chunk2.chunks = totalParts;
    chunk2.size = bufferChunkSize;
    chunk2.start = chunks2.start;
    chunk2.end = chunks2.end;
    chunk2.total = size;
    chunkInfo.push(chunk2);
  });
  allUplod(chunkInfo, 2, "businessp");
}
async function allUplod(chunkInfo, batchSize, type) {
  const totalBatches = Math.ceil(chunkInfo.length / batchSize);
  for (let i = 0; i < totalBatches; i++) {
    const batchChunks = chunkInfo.slice(i * batchSize, (i + 1) * batchSize);
    switch (type) {
      case "businessp":
        const batchPromise = batchChunks.map((it) => businesspUploadChunk(it));
        await Promise.all(batchPromise);
        break;
      case "medical":
        const batchMedicalPromise = batchChunks.map((it) => medicalUploadChunk(it));
        await Promise.all(batchMedicalPromise);
        break;
    }
  }
}
async function businesspUploadChunk(chunk2) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("OriginalFileName", chunk2.originalFileName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    if (data) {
      const imgurl = data;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      const colorp = {
        fileName: chunk2.originalFileName,
        url: imgurl,
        name: imgname
      };
      businesspPicUrls.value.push(colorp);
      userCertificationForm.businesspUploads = imgurl;
      certificModule.value.validateField("businesspUploads");
      loading.value = false;
    } else {
      return true;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}!`,
      type: "error",
      duration: 3e3
    });
    loading.value = false;
  });
}
function medicalUpload(options) {
  const file = options.file;
  const fileChunks = [];
  var maxFileSizeMB = 2;
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
  const fileName = getFileExtension(file.name);
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk2 = {};
    chunk2.file = chunks2.file;
    chunk2.filePartName = fileName;
    chunk2.originalFileName = file.name;
    chunk2.urlParameter = "";
    chunk2.partNumber = index + 1;
    chunk2.chunks = totalParts;
    chunk2.size = bufferChunkSize;
    chunk2.start = chunks2.start;
    chunk2.end = chunks2.end;
    chunk2.total = size;
    chunkInfo.push(chunk2);
  });
  allUplod(chunkInfo, 2, "medical");
}
async function medicalUploadChunk(chunk2) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("OriginalFileName", chunk2.originalFileName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  loadings.value = true;
  await FileAPI.upload(formData).then((data) => {
    if (data) {
      const imgurl = data;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      const makep = {
        fileName: chunk2.originalFileName,
        url: imgurl,
        name: imgname
      };
      medicalPicUrls.value.push(makep);
      userCertificationForm.medicalUploads = imgurl;
      certificModule.value.validateField("medicalUploads");
      loadings.value = false;
    } else {
      return true;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}!`,
      type: "error",
      duration: 3e3
    });
    loadings.value = false;
  });
}
function handleExceed() {
  ElMessage.warning("最多只能上传1张图片");
}
function handleExceeds() {
  ElMessage.warning("最多只能上传1张图片");
}
function handleRemove(fileUrl, v) {
  if (v == 1) {
    userCertificationForm.businesspUploads = "";
    businesspPicUrls.value = [];
    upload.value.clearFiles();
  } else if (v == 2) {
    userCertificationForm.medicalUploads = "";
    medicalPicUrls.value = [];
    uploads.value.clearFiles();
  }
}
function getFileExtension(filename) {
  const matchs = filename.match(/\.([^.]+)$/);
  const match = matchs ? matchs[1] : "0";
  return filename.split(`.${match}`)[0] + (Math.floor(Math.random() * 9e4) + 1e4) + "." + match;
}
function submit() {
  certificModule.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (businesspPicUrls.value.length > 0) {
        userCertificationForm.BusinessLicense = businesspPicUrls.value[0].url;
      } else {
        userCertificationForm.BusinessLicense = "";
      }
      if (medicalPicUrls.value.length > 0) {
        userCertificationForm.MedicalLicense = medicalPicUrls.value[0].url;
      } else {
        userCertificationForm.MedicalLicense = "";
      }
      userCertificationForm.relation = null;
      const id = userStore.userInfo.members.orgId;
      CustomerAPI.update(id, userCertificationForm).then((res) => {
        if (res !== false) {
          ElMessage.warning("提交成功!");
          steps.value = 1;
          setCountdown();
        }
      }).finally(() => loading.value = false);
    }
  });
}
function setCountdown() {
  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer.value);
      openUser();
    }
  }, 1e3);
}
function openUser() {
  const url = {
    path: "/user"
  };
  clearInterval(timer.value);
  router.push(url).catch(() => {
    window.location.reload();
  });
}
function getOrgInfo() {
  const id = userStore.userInfo.members.orgId;
  OrgCustomerAPI.getOrgCustomer(id).then((data) => {
    if (data !== false) {
      Object.assign(userCertificationForm, data);
      if (userCertificationForm.businessLicense != "") {
        const imgarr = userCertificationForm.businessLicense.split("name=");
        const imgname = imgarr.length > 1 ? imgarr[1].replace("&width=400", "") : imgarr[0];
        businesspPicUrls.value = [
          {
            fileName: imgname,
            name: imgname,
            url: userCertificationForm.businessLicense
          }
        ];
        userCertificationForm.businesspUploads = imgname;
      }
      if (userCertificationForm.medicalLicense != "") {
        const imgarr = userCertificationForm.medicalLicense.split("name=");
        const imgname = imgarr.length > 1 ? imgarr[1].replace("&width=400", "") : imgarr[0];
        medicalPicUrls.value = [
          {
            fileName: imgname,
            name: imgname,
            url: userCertificationForm.medicalLicense
          }
        ];
        userCertificationForm.medicalUploads = imgname;
      }
    }
  });
}
function to() {
  const _url = "/user";
  const url = {
    path: _url
  };
  router.push(url).catch(() => {
    window.location.reload();
  });
}
onMounted(() => {
  getOrgInfo();
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
  .ecmbody-top {
    display: flex;
    width: 100%;
    font-weight: 700;
    font-size: 16px;
    height: 49px;
    line-height: 49px;
  }
  .ecmbody-top1 {
    display: flex;
    width: 100%;
    font-family: Noto Sans SC;
    font-weight: 700;
    font-size: 26px;
    height: 60px;
    line-height: 60px;
    color: #333f48;
  }
  .ecmbody-content {
    display: flex;
    width: 100%;
    border-radius: 6px;
    border: 0.5px solid #c5d1dc;
    height: 600px;
    margin-top: 10px;
    background-color: #ffffff;
    flex-flow: column;
    .ecmbody-content-top1 {
      padding: 30px 30px;
      font-family: Noto Sans SC;
      font-weight: 500;
      font-size: 32px;
      letter-spacing: 0%;
      color: #333f48;
      span {
        font-family: Noto Sans SC;
        font-weight: 400;
        font-size: 23px;
        letter-spacing: 0%;
        color: #757575;
      }
    }
    .ecmbody-content-top2 {
      width: 80%;
      display: flex;
      margin: 15px auto;
      :deep(.el-upload--picture-card) {
        --el-upload-picture-card-size: 50px;
        align-items: center;
        background-color: var(--el-fill-color-lighter);
        border: 1px var(--el-border-color-darker);
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-flex;
        height: var(--el-upload-picture-card-size);
        justify-content: center;
        vertical-align: top;
        width: var(--el-upload-picture-card-size);
        cursor: pointer;
      }
      .upfiles {
        width: auto;
        padding: 0px 10px 0px 20px;
        display: flex;
        .upfile-txts {
          display: flex;
          max-width: 100px;
          overflow: hidden;
          height: 50px;
          cursor: pointer;
        }
        span {
          position: relative;
          top: -10px;
          padding-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .ecmbody-content1 {
    display: flex;
    width: 100%;
    border-radius: 6px;
    border: 0.5px solid #c5d1dc;
    height: 580px;
    margin-top: 20px;
    background-color: #ffffff;
    flex-flow: column;
    .ecmbody-ok {
      display: flex;
      height: 580px;
      justify-content: center;
      flex-flow: column;
      width: 100%;
      border: none;
      align-items: center;
      background-color: #ffffff;
      border-width: 0.5px;
      border-radius: 10px;
      img {
        height: 50px;
      }
      .ecmbody-ok-txt {
        display: flex;
        justify-content: center;
        padding-top: 38px;
        font-size: 20px;
        font-weight: 500;
        width: 100%;
        .ecmbody-ok-txt1 {
          color: #4e93f5;
          font-family: Noto Sans SC;
          font-weight: Bold;
          font-size: 20px;
          line-height: 100%;
        }
        .ecmbody-ok-txt2 {
          font-family: Noto Sans SC;
          font-weight: 400;
          font-size: 20px;
          line-height: 100%;
          color: #333f48;
          span {
            color: #34c759;
            cursor: pointer;
          }
        }
      }
    }
  }
  .ecmbody-foot {
    display: flex;
    width: 1220px;
    margin: 0 auto;
    align-items: center;
    justify-items: center;
    justify-content: end;
    .ecmbody-foot-btn {
      margin-top: 18px;
      width: 130px;
      height: 45px;
      line-height: 45px;
      border-radius: 6px;
      background: #4192d9;
      color: #ffffff;
      backdrop-filter: blur(20px);
      text-align: center;
      cursor: pointer;
    }
  }
  .ecmbody-zhanwei {
    width: 100%;
    display: flex;
    height: 50px;
  }
  :deep(.el-form-item--default) {
    margin-bottom: 28px;
  }
  :deep(.el-form-item__content) {
    line-height: 32px;
    font-size: 18px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #000;
  }
  :deep(.el-form-item__label) {
    font-size: 18px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #333f48;
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
  :deep(.el-input__inner) {
    background: none;
    border: none;
    box-sizing: border-box;
    color: #000;
    width: 100%;
    font-size: 16px;
  }
}
</style>
