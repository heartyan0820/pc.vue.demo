<template>
  <div v-if="useChatStore().activeIndex == 1" class="chat-header">
    <div class="user-info">
      <div v-if="roomInfo.roomType == 3" class="user-tittle">ECM AI</div>
      <div v-else class="user-tittle">
        {{ roomInfo?.roomName }}
      </div>

      <div class="user-details">
        {{ roomInfo?.roomInfo }}
      </div>
    </div>
    <el-button
      v-if="!chatStore.orderInfo && chatStore.router != '/details'"
      circle
      @click="closeRoom()"
    >
      <el-icon>
        <close />
      </el-icon>
    </el-button>
  </div>

  <div v-else class="chat-header-order">
    <div class="chat-order-info">
      <div v-if="useChatStore().activeIndex == 3">
        <el-timeline style="max-width: 600px">
          <el-timeline-item
            v-for="(activity, index) in logList"
            :key="index"
            :timestamp="activity.modifyTime"
          >
            {{ activity.tipMessage }}&nbsp;{{ getMessData(activity) }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-if="useChatStore().activeIndex == 2" class="imgclass">
        <el-form size="small" style="width: 100%; flex: 1" label-width="80px" label-position="left">
          <el-form-item label="CBCT：">
            <template #default>
              <ul style="display: flex; flex-wrap: wrap">
                <li v-for="(item, index) in cbctList" :key="index" class="li-file-box">
                  <div class="del-btn" @click="openDel(item)">
                    <el-icon color="#fff" :size="12">
                      <Close />
                    </el-icon>
                  </div>

                  <el-icon>
                    <Link />
                  </el-icon>
                  &nbsp;
                  <a :href="item.url" target="_blank">
                    {{ item.fileName ? item.fileName : "--" }}
                  </a>
                </li>
              </ul>
              <div class="upclassinfo">
                <el-upload
                  v-model="cbctfileUrls"
                  :http-request="(a) => handleUpload(a, 'cbct')"
                  class="upload-demo"
                  :show-file-list="false"
                  size="small"
                  multiple
                >
                  <!-- 上传文件按钮 -->
                  <span class="upclass">上传</span>
                </el-upload>

                <div v-for="(item, index) in cbctfileUrls" :key="index" class="upfile">
                  <el-icon style="padding-top: 10px">
                    <Document />
                  </el-icon>
                  <div class="upfile-txt">&nbsp;{{ item.fileName }}</div>
                  <span title="删除文件" @click="handleRemove(item.name, item.url, 1)">
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="口扫数据：">
            <template #default>
              <ul style="display: flex; flex-wrap: wrap">
                <li v-for="(item, index) in ksList" :key="index" class="li-file-box">
                  <div class="del-btn" @click="openDel(item)">
                    <el-icon color="#fff" :size="12">
                      <Close />
                    </el-icon>
                  </div>
                  <el-icon>
                    <Link />
                  </el-icon>
                  &nbsp;
                  <a :href="settings.fileurl + item.url" target="_blank">
                    {{ item.fileName ? item.fileName : "--" }}
                  </a>
                </li>
              </ul>
              <div class="upclassinfo">
                <el-upload
                  v-model="mouthfileUrls"
                  :http-request="(a) => handleUpload(a, 'mouth')"
                  class="upload-demo"
                  size="small"
                  :show-file-list="false"
                  multiple
                >
                  <!-- 上传文件按钮 -->
                  <span class="upclass">上传</span>
                </el-upload>

                <div v-for="(item, index) in mouthfileUrls" :key="index" class="upfile">
                  <el-icon style="padding-top: 10px">
                    <Document />
                  </el-icon>
                  <div class="upfile-txt">&nbsp;{{ item.fileName }}</div>
                  <span title="删除文件" @click="handleRemove(item.name, item.url, 2)">
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="比色照片：">
            <template #default>
              <div
                v-for="(item, index) in bsList"
                :key="index"
                v-viewer.static="{ inline: false }"
                class="upfiles"
              >
                <div class="upfile-txts">
                  <img :src="item.url" width="30px" height="30px" />
                </div>
              </div>
              <div class="upclassinfo">
                <el-upload
                  v-model="colorpicUrls"
                  :http-request="(a) => handleUpload(a, 'color')"
                  :show-file-list="false"
                  class="upfiles"
                  multiple
                  list-type="picture-card"
                >
                  <img src="@/assets/images/upimg.png" width="30px" />
                </el-upload>

                <div v-for="(item, index) in colorpicUrls" :key="index" class="upfiles">
                  <div class="upfile-txts">
                    <img :src="settings.fileurl + item.url" width="30px" height="30px" />
                  </div>
                  <span title="删除文件" @click="handleRemove(item.name, item.url, 3)">
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="制作照片：">
            <template #default>
              <div
                v-for="(item, index) in zzList"
                :key="index"
                v-viewer.static="{ inline: false }"
                class="upfiles"
              >
                <div class="upfile-txts">
                  <img :src="item.url" width="30px" height="30px" />
                </div>
              </div>
              <div class="upclassinfo">
                <el-upload
                  v-model="makepicUrls"
                  class="upfiles"
                  :http-request="(a) => handleUpload(a, 'make')"
                  :show-file-list="false"
                  multiple
                  list-type="picture-card"
                >
                  <img src="@/assets/images/upimg.png" width="30px" height="30px" />
                </el-upload>

                <div v-for="(item, index) in makepicUrls" :key="index" class="upfiles">
                  <div class="upfile-txts">
                    <img :src="settings.fileurl + item.url" width="30px" height="30px" />
                  </div>
                  <span title="删除文件" @click="handleRemove(item.name, item.url, 4)">
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>
              </div>
            </template>
          </el-form-item>

          <el-divider />

          <el-form-item label="设计资料：">
            <template #default>
              <ul style="display: flex; flex-wrap: wrap">
                <li
                  v-for="(item, index) in dsList"
                  :key="index"
                  style="display: flex; align-items: center; padding-right: 8px; min-width: 50px"
                >
                  <el-icon>
                    <Link />
                  </el-icon>
                  &nbsp;
                  <a :href="item.url" target="_blank">
                    {{ item.fileName ? item.fileName : "--" }}
                  </a>
                </li>
              </ul>
              <!-- <div class="upclassinfo">
                <el-upload v-model="cbctfileUrls" :http-request="(a) => handleUpload(a, 'cbct')" class="upload-demo"
                  :show-file-list="false" size="small" multiple>
                  <span class="upclass">上传</span>
                </el-upload>

                <div v-for="(item, index) in sjzlfileUrls" :key="index" class="upfile">
                  <el-icon style="padding-top: 10px">
                    <Document />
                  </el-icon>
                  <div class="upfile-txt">&nbsp;{{ item.fileName }}</div>
                  <span title="删除文件" @click="handleRemove(item.name, item.url, 5)">
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>
              </div> -->
            </template>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import settings from "@/settings";
import { ref, onMounted, watch } from "vue";
import { useChatStore, useWebSocketStore } from "@/store";
import ChatAPI from "@/api/mess";
import FileAPI from "@/api/file";
import OrderAPI from "@/api/order";
import { ElMessageBox } from "element-plus";
const queryFileParams = reactive({
  pageIndex: 1,
  pageSize: 50
  // orderId: orderId.value == 0 ? 0 : orderId.value,
});
const chatStore = useChatStore();
const roomInfo = ref({});
const ksList = ref([]);
const cbctList = ref([]);
const bsList = ref([]);
const zzList = ref([]);
const dsList = ref([]);
const logList = ref([]);
const bsPrList = ref([]);
const zzPrList = ref([]);
const colorpicUrls = ref([]);
const makepicUrls = ref([]);
const cbctfileUrls = ref([]);
const mouthfileUrls = ref([]);
const sjzlfileUrls = ref([]);
const orderFilesInfo = reactive({
  type: 0,
  url: ""
});
const orderFileInfo = reactive({
  orderId: 0,
  omId: 0
});
const FileInfo = reactive({
  orderId: 0,
  url: 0
});
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
const openDel = (item) => {
  ElMessageBox.alert("确定删除该文件吗？", "删除提醒", {
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    callback: (action) => {
      if (action === "confirm") {
        let param = {
          orderId: item.orderId,
          url: item.url.replace("http://192.168.2.155:5000/api/", "")
        };
        OrderAPI.delFile(param).then((res) => {
          console.log("删除成功", res);
          if (res === 1) {
            getOrderFile();
          } else {
            ElMessage.error("删除失败");
          }
        });
      } else {
        console.log("取消");
      }
    }
  });
};
onMounted(() => {
  readMsg();
  ChatAPI.getRoom({ roomId: useChatStore().roomId }).then((data) => {
    if (data.code === 1) {
      roomInfo.value = data.data;
      chatStore.roomInfo = data.data;
    }
  });
  if (chatStore.orderInfo) {
    getOrderFile();
  }
});
watch(
  () => chatStore.roomId,
  (newVal) => {
    if (newVal) {
      getRoomInfo();
    }
  }
);
watch(
  () => chatStore.orderInfo,
  (newVal) => {
    if (newVal) {
      queryFileParams.orderId = chatStore.orderInfo.id;
      getOrderFile();
    }
  }
);
watch(
  () => chatStore.activeIndex,
  (newVal) => {
    if (newVal == 2) {
      getOrderLog();
    }
  }
);
watch(
  () => logList.value,
  (newVal) => {
  }
);
const getRoomInfo = () => {
  ChatAPI.getRoom({ roomId: useChatStore().roomId }).then((data) => {
    if (data.code === 1) {
      roomInfo.value = data.data;
      chatStore.roomInfo = data.data;
    }
  });
};
const getOrderFile = () => {
  getOrderLog();
  ksList.value = [];
  cbctList.value = [];
  bsList.value = [];
  zzList.value = [];
  bsPrList.value = [];
  zzPrList.value = [];
  queryFileParams.orderId = chatStore.orderInfo.id;
  ChatAPI.getOrderFilePage(queryFileParams).then((data) => {
    if (data.list.length > 0) {
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].url) {
          data.list[i].url = import.meta.env.VITE_APP_IMAGE_URL + "/" + data.list[i].url;
        }
        if (data.list[i].type == 0) {
          cbctList.value.push(data.list[i]);
        } else if (data.list[i].type == 1) {
          ksList.value.push(data.list[i]);
        } else if (data.list[i].type == 2) {
          bsList.value.push(data.list[i]);
          bsPrList.value.push(data.list[i].url);
        } else if (data.list[i].type == 3) {
          zzList.value.push(data.list[i]);
          zzPrList.value.push(data.list[i].url);
        } else if (data.list[i].type == 4) {
          dsList.value.push(data.list[i]);
        }
      }
    }
  });
};
const getOrderLog = () => {
  ChatAPI.getOrderLog({ OrderId: chatStore.orderInfo.id }).then((data) => {
    logList.value = data;
  });
};
const closeRoom = () => {
  useWebSocketStore().listRoomId = useChatStore().roomId;
  readMsg();
  chatStore.closeRoom();
};
function handleUpload(options, type) {
  const file = options.file;
  const fileChunks = [];
  var maxFileSizeMB = 1;
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
  allUplod(chunkInfo, 2, type);
}
async function allUplod(chunkInfo, batchSize, type) {
  const totalBatches = Math.ceil(chunkInfo.length / batchSize);
  for (let i = 0; i < totalBatches; i++) {
    const batchChunks = chunkInfo.slice(i * batchSize, (i + 1) * batchSize);
    switch (type) {
      case "cbct":
        const batchPromise = batchChunks.map((it2) => UploadFileChunk(it2, type));
        await Promise.all(batchPromise);
        break;
      case "mouth":
        const batchMouthPromise = batchChunks.map((it2) => UploadFileChunk(it2, type));
        await Promise.all(batchMouthPromise);
        break;
      case "color":
        const batchColorPromise = batchChunks.map((it2) => UploadFileChunk(it2, type));
        await Promise.all(batchColorPromise);
        break;
      case "make":
        const batchMedicalPromise = batchChunks.map((it2) => UploadFileChunk(it2, type));
        await Promise.all(batchMedicalPromise);
        break;
      case "sjzl":
        const batchSjzlPromise = batchChunks.map((it2) => UploadFileChunk(it2, type));
        await Promise.all(batchSjzlPromise);
        break;
    }
  }
}
async function UploadFileChunk(chunk2, type) {
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
  await FileAPI.upload(formData).then((data) => {
    if (data) {
      const imgurl = data;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      const files = {
        fileName: chunk2.filePartName,
        url: imgurl,
        name: imgname
      };
      switch (type) {
        case "cbct":
          cbctList.value.push(files);
          break;
        case "mouth":
          mouthfileUrls.value.push(files);
          break;
        case "color":
          colorpicUrls.value.push(files);
          break;
        case "make":
          makepicUrls.value.push(files);
          break;
        case "sjzl":
          sjzlfileUrls.value.push(files);
          break;
      }
      addOrderFile(type);
    } else {
      return true;
    }
  }).catch((error) => {
    ElMessage.error(error);
  });
}
function getFileExtension(filename) {
  const matchs = filename.match(/\.([^.]+)$/);
  const match = matchs ? matchs[1] : "0";
  return filename.split(`.${match}`)[0] + (Math.floor(Math.random() * 9e4) + 1e4) + "." + match;
}
function handleRemove(fileUrl, name, v) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading..."
  });
  FileAPI.deletes(fileUrl).then(() => {
    if (v == 1) {
      cbctfileUrls.value = cbctfileUrls.value.filter((file) => file.name !== fileUrl);
    } else if (v == 2) {
      mouthfileUrls.value = mouthfileUrls.value.filter((file) => file.name !== fileUrl);
    } else if (v == 3) {
      colorpicUrls.value = colorpicUrls.value.filter((file) => file.name !== fileUrl);
    } else if (v == 4) {
      makepicUrls.value = makepicUrls.value.filter((file) => file.name !== fileUrl);
    } else if (v == 5) {
      sjzlfileUrls.value = sjzlfileUrls.value.filter((file) => file.name !== fileUrl);
    }
    FileInfo.orderId = chatStore.orderInfo.id;
    FileInfo.url = name;
    OrderAPI.delFile(FileInfo).then(() => {
      loading.close();
    });
  });
}
function addOrderFile(type) {
  const img = Object.assign({}, orderFileInfo);
  img.orderId = chatStore.orderInfo.id;
  img.omId = 0;
  img.Files = [];
  const loading = ElLoading.service({
    lock: true,
    text: "Loading..."
  });
  switch (type) {
    case "cbct":
      cbctfileUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 0;
        fileurl.fileName = item.fileName.split(".")[0];
        fileurl.url = item.url;
        img.Files?.push(fileurl);
      });
      break;
    case "mouth":
      mouthfileUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 1;
        fileurl.fileName = item.fileName.split(".")[0];
        fileurl.url = item.url;
        img.Files?.push(fileurl);
      });
      break;
    case "color":
      colorpicUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 2;
        fileurl.fileName = item.fileName.split(".")[0];
        fileurl.url = item.url;
        img.Files?.push(fileurl);
      });
      break;
    case "make":
      makepicUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 3;
        fileurl.fileName = item.fileName.split(".")[0];
        fileurl.url = item.url;
        img.Files?.push(fileurl);
      });
      break;
    case "sjzl":
      sjzlfileUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 4;
        fileurl.fileName = item.fileName.split(".")[0];
        fileurl.url = item.url;
        img.Files?.push(fileurl);
      });
      break;
  }
  OrderAPI.addFile(img).then(() => {
    loading.close();
  });
}
const readMsg = () => {
  ChatAPI.readMessage({ roomId: useChatStore().roomId }).then((data) => {
    console.log("readMsg", data);
    useWebSocketStore().listRoomId = 0;
  });
};
function getMessData(item) {
  let mess = "";
  if (item.message1) {
    mess += item.message1 + ",";
  }
  if (item.message2) {
    mess += item.message2 + ",";
  }
  mess = mess.trim(",");
  return mess;
}
</script>

<style scoped>
.li-file-box {
  display: flex;
  align-items: center;
  padding-right: 8px;
  min-width: 50px;
  position: relative;
}

.del-btn {
  position: absolute;
  width: 15px;
  height: 15px;
  background: red;
  border-radius: 50%;
  z-index: 9;
  top: 0;
  left: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.list-item-file {
  margin-right: 10px;
  display: flex;
}

.upclass {
  border-radius: 4px;
  padding: 0px 10px;
  background-color: #4192d9;
  border: 1px solid #4192d9;
  color: #ffffff;
  font-size: 12px;
}

.upclassinfo {
  display: flex;
  flex-flow: wrap;

  .upload-demo {
    display: flex;
    width: 50px;
  }

  .upfile {
    width: 77px;
    padding: 0px 10px 5px 3px;
    display: flex;
    height: 22px;
    line-height: 22px;

    .upfile-txt {
      display: flex;
      max-width: 50px;
      overflow: hidden;
      height: 22px;
      line-height: 22px;
    }

    .upfile-txts {
      display: flex;
      max-width: 50px;
      overflow: hidden;
      height: 50px;
      cursor: pointer;
    }

    span {
      position: relative;
      top: -6px;
      padding-left: 0px;
      cursor: pointer;
    }
  }

  .upfiles {
    width: 51px;
    padding: 0px 2px 10px 0px;
    display: flex;

    .upfile-txts {
      display: flex;
      max-width: 60px;
      overflow: hidden;
      height: 30px;
      cursor: pointer;
    }

    span {
      position: relative;
      top: -10px;
      padding-left: 2px;
      cursor: pointer;
    }
  }
}

.el-form-item__content {
  display: flex;
  width: 100%;

  .upfiles {
    width: 51px;
    padding: 0px 2px 10px 0px;
    display: flex;

    .upfile-txts {
      display: flex;
      max-width: 60px;
      overflow: hidden;
      height: 30px;
      cursor: pointer;
    }

    span {
      position: relative;
      top: -10px;
      padding-left: 2px;
      cursor: pointer;
    }
  }
}

.list-item {
  padding: 5px 0;
  display: flex;
  align-items: center;
}

.chat-order-info {
  height: auto;
  font-size: 14px;
  color: #333f48;

  .imgclass {
    display: flex;
    width: 100%;
  }
}

.chat-header-order {
  width: 100%;
  height: auto;
  padding: 16px;
  background: #fff;
}

.chat-header {
  width: 100%;
  padding: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5;
}

.user-info {
  width: 100%;
  color: #333;

  .user-tittle {
    font-size: 14px;
    text-align: center;
    color: #000;
    font-weight: bold;
  }

  .user-details {
    font-size: 12px;
    margin-top: 5px;
    color: #606266;
  }
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 30px;
  align-items: center;
  background-color: var(--el-fill-color-lighter) #fafafa;
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  height: var(--el-upload-picture-card-size);
  justify-content: center;
  vertical-align: top;
  width: var(--el-upload-picture-card-size);
}
</style>
