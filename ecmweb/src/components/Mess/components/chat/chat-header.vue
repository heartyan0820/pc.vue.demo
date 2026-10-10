<template>
  <!-- <div>{{ chatStore.orderInfo.status }}</div> -->

  <div v-if="useChatStore().activeIndex == 1" class="chat-header">
    <div class="user-info">
      <div v-if="roomInfo.roomType == 3" class="user-tittle">ECM AI</div>
      <div v-else class="user-tittle">
        <el-link v-if="roomInfo.sourceCode != ''" underline type="primary" @click="toOrderDetail()">
          {{ roomInfo?.roomName }}
        </el-link>
        <span v-else style="color: #4080ff; font-size: 16px">{{ roomInfo?.roomName }}</span>
      </div>

      <div class="user-details">
        {{ roomInfo?.roomInfo }}
      </div>
    </div>
    <el-button v-if="chatStore.router != '/details'" circle @click="closeRoom()">
      <el-icon>
        <close />
      </el-icon>
    </el-button>
    <el-button v-else circle @click="closeRooms()">
      <el-icon>
        <close />
      </el-icon>
    </el-button>
  </div>

  <div v-else class="chat-header-order">
    <div class="chat-order-info" style="">
      <div v-if="useChatStore().activeIndex == 3" style="height: 720px; overflow-y: auto">
        <div style="height: 10px"></div>
        <el-timeline style="max-width: 600px">
          <el-timeline-item
            v-for="(activity, index) in logList"
            :key="index"
            :timestamp="activity.modifyTime"
          >
            {{ activity.createByUserName }}&nbsp;{{ activity.tipMessage }}&nbsp;{{
              getMessData(activity)
            }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-if="useChatStore().activeIndex == 2" class="imgclass">
        <el-form
          size="small"
          style="width: 100%; flex: 1"
          label-width="100px"
          element-loading-text="上传中，请稍等..."
        >
          <el-form-item label="CBCT：">
            <div class="file-list-content">
              <div v-for="(item, index) in cbctList" :key="index" class="file-list-item">
                <div class="file-list-item-name">
                  <a
                    class="file-list-item-name-icon-link"
                    target="_blank"
                    :href="item.url.replace('&width=400', '')"
                  >
                    <el-icon>
                      <Link />
                    </el-icon>
                  </a>
                  <a
                    class="file-list-item-name-text"
                    target="_blank"
                    :href="item.url.replace('&width=400', '')"
                  >
                    {{ item.fileName }}
                  </a>
                  <div
                    v-if="orderState <= 29 && isDisplay"
                    class="file-list-item-name-icon-del"
                    @click="openDel(item)"
                  >
                    <img src="@/assets/images/del.png" />
                  </div>
                </div>
                <el-progress
                  v-if="item.percentage != 100 && item.percentage != 0"
                  :stroke-width="5"
                  :percentage="item.percentage"
                  :show-text="false"
                  status="success"
                  striped
                  striped-flow
                  :duration="10"
                />
              </div>

              <el-upload
                v-if="orderState <= 29 && isDisplay"
                :http-request="(a) => handleUpload(a, 0)"
                :show-file-list="false"
                size="small"
                multiple
              >
                <!-- 上传文件按钮 -->
                <el-button type="primary" size="small">上传</el-button>
              </el-upload>
            </div>
          </el-form-item>

          <el-form-item label="口扫数据：">
            <div class="file-list-content">
              <div v-for="(item, index) in ksList" :key="index" class="file-list-item">
                <div class="file-list-item-name">
                  <a
                    class="file-list-item-name-icon-link"
                    target="_blank"
                    :href="item.url.replace('&width=400', '')"
                  >
                    <el-icon>
                      <Link />
                    </el-icon>
                  </a>
                  <a
                    class="file-list-item-name-text"
                    target="_blank"
                    :href="item.url.replace('&width=400', '')"
                  >
                    {{ item.fileName }}
                  </a>
                  <div
                    v-if="orderState <= 29 && isDisplay"
                    class="file-list-item-name-icon-del"
                    @click="openDel(item)"
                  >
                    <img src="@/assets/images/del.png" />
                  </div>
                </div>
                <el-progress
                  v-if="item.percentage != 100 && item.percentage != 0"
                  :stroke-width="5"
                  :percentage="item.percentage"
                  :show-text="false"
                  status="success"
                  striped
                  striped-flow
                  :duration="10"
                />
              </div>

              <el-upload
                v-if="orderState <= 29 && isDisplay"
                :http-request="(a) => handleUpload(a, 1)"
                :show-file-list="false"
                size="small"
                multiple
              >
                <!-- 上传文件按钮 -->
                <el-button type="primary" size="small">上传</el-button>
              </el-upload>
            </div>
          </el-form-item>

          <el-form-item label="比色照片：">
            <template #default>
              <div class="upclassinfo">
                <div v-for="(item, index) in bsList" :key="index" class="upfiles">
                  <div class="upfile-txts">
                    <div class="upfile-names">
                      <img
                        v-if="item.url == ''"
                        src="/images/jiazai.png"
                        width="30px"
                        height="30px"
                      />
                      <img
                        v-else
                        v-viewer.static="{ inline: false }"
                        :src="item.url.replace('&width=400', '')"
                        width="30px"
                        height="30px"
                      />
                    </div>
                    <div class="upfile-jindus" :style="[{ display: `${item.display}` }]">
                      <div
                        :style="[
                          {
                            'background-color': '#409eff',
                            height: '3px',
                            width: `${item.percentage}`,
                          },
                        ]"
                      ></div>
                    </div>
                  </div>

                  <span
                    v-if="orderState <= 29 && isDisplay"
                    title="删除文件"
                    @click="openDel(item)"
                  >
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>

                <el-upload
                  v-if="orderState <= 29 && isDisplay"
                  :http-request="(a) => handleUpload(a, 2)"
                  :show-file-list="false"
                  class="upfiles"
                  multiple
                  list-type="picture-card"
                >
                  <img src="@/assets/images/upimg.png" width="30px" />
                </el-upload>
              </div>
            </template>
          </el-form-item>
          <el-form-item v-if="prodTypeId == 2" label="返工截图：">
            <div v-for="(item, index) in fgList" :key="index" class="upfiles">
              <div class="upfile-txts">
                <div class="upfile-names">
                  <img v-if="item.url == ''" src="/images/jiazai.png" width="30px" height="30px" />
                  <img
                    v-else
                    v-viewer.static="{ inline: false }"
                    :src="item.url.replace('&width=400', '')"
                    width="30px"
                    height="30px"
                  />
                </div>
                <div class="upfile-jindus" :style="[{ display: `${item.display}` }]">
                  <div
                    :style="[
                      {
                        'background-color': '#409eff',
                        height: '3px',
                        width: `${item.percentage}`,
                      },
                    ]"
                  ></div>
                </div>
              </div>

              <span v-if="orderState <= 29 && isDisplay" title="删除文件" @click="openDel(item)">
                <img src="@/assets/images/del.png" />
              </span>
            </div>
          </el-form-item>
          <el-form-item label="制作照片：">
            <template #default>
              <!-- <div v-for="(item, index) in zzList" :key="index" v-viewer.static="{ inline: false }" class="upfiles">
                <div class="upfile-txts">
                  <img :src="item.url" width="30px" height="30px" />
                </div>
              </div> -->
              <div class="upclassinfo">
                <div v-for="(item, index) in zzList" :key="index" class="upfiles">
                  <div class="upfile-txts">
                    <div class="upfile-names">
                      <img
                        v-if="item.url == ''"
                        src="/images/jiazai.png"
                        width="30px"
                        height="30px"
                      />
                      <img
                        v-else
                        v-viewer.static="{ inline: false }"
                        :src="item.url.replace('&width=400', '')"
                        width="30px"
                        height="30px"
                      />
                    </div>
                    <div class="upfile-jindus" :style="[{ display: `${item.display}` }]">
                      <div
                        :style="[
                          {
                            'background-color': '#409eff',
                            height: '3px',
                            width: `${item.percentage}`,
                          },
                        ]"
                      ></div>
                    </div>
                  </div>

                  <span
                    v-if="orderState <= 29 && isDisplay"
                    title="删除文件"
                    @click="openDel(item)"
                  >
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>

                <el-upload
                  v-if="orderState <= 29 && isDisplay"
                  class="upfiles"
                  :http-request="(a) => handleUpload(a, 3)"
                  :show-file-list="false"
                  multiple
                  list-type="picture-card"
                >
                  <img src="@/assets/images/upimg.png" width="30px" height="30px" />
                </el-upload>
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
            </template>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>import router from "@/router";
import { ref, onMounted, watch } from "vue";
import { useChatStore, useWebSocketStore } from "@/store";
import ChatAPI from "@/api/mess";
import { setPcPatientName, getPcPatientName, clearPcPatientName } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";
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
const loadings = ref(false);
const ksList = ref([]);
const cbctList = ref([]);
const bsList = ref([]);
const zzList = ref([]);
const fgList = ref([]);
const dsList = ref([]);
const logList = ref([]);
const bsPrList = ref([]);
const zzPrList = ref([]);
const sjzlfileUrls = ref([]);
const fileType = ref(0);
const percentage = ref(0);
const orderState = ref(0);
const showProgress = ref(false);
const success = ref("");
const prodTypeId = ref(0);
const isDisplay = ref(false);
const user = useUserStore().userInfo;
const orderFileInfo = reactive({
  orderId: 0,
  omId: 0
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
          url: item.url.replace(import.meta.env.VITE_APP_IMAGE_URL, "")
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
  if (!user.members.orgRoleCodes.includes("10011")) {
    readMsg();
  }
  ChatAPI.getRoom({ roomId: useChatStore().roomId }).then((data) => {
    if (data.code === 1) {
      const patientName = data.data.roomName?.split("|")[0].trim();
      setPcPatientName(patientName);
      roomInfo.value = data.data;
      chatStore.roomInfo = data.data;
    }
  });
  getRoomMember();
  if (chatStore.orderInfo) {
    setPcPatientName(chatStore.orderInfo.patientName);
    getOrderFile();
    getOrderState();
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
      getOrderState();
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
    console.log("logList--改变数据", newVal);
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
const getOrderState = () => {
  OrderAPI.getOrderState({ orderId: chatStore.orderInfo.id }).then((data) => {
    console.log("获取订单状态", data);
    orderState.value = data.state;
    const orgCode = user.members.orgRoleCodes.toString();
    if (orgCode.indexOf("1003") > -1 || orgCode.indexOf("1001") > -1) {
      isDisplay.value = true;
    }
  });
};
const getRoomMember = () => {
  ChatAPI.getRoomUserList({ roomId: useChatStore().roomId }).then((data) => {
    if (data.code === 1) {
      const userStore = data.data.filter((a) => {
        return a.userId != useUserStore().userInfo.chatUserId;
      });
      chatStore.memberList = userStore;
    }
  });
};
const toOrderDetail = () => {
  if (chatStore.roomInfo.sourceCode == "") {
    ElMessage.error("订单信息不存在");
    return false;
  }
  router.push({
    path: "/details",
    query: {
      id: chatStore.roomInfo.sourceCode
    }
  });
};
const getOrderFile = () => {
  getOrderLog();
  ksList.value = [];
  cbctList.value = [];
  bsList.value = [];
  zzList.value = [];
  fgList.value = [];
  bsPrList.value = [];
  zzPrList.value = [];
  queryFileParams.orderId = chatStore.orderInfo.id;
  ChatAPI.getOrderFilePage(queryFileParams).then((data) => {
    if (data.list.length > 0) {
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].url) {
          data.list[i].url = import.meta.env.VITE_APP_IMAGE_URL + data.list[i].url;
          data.list[i].percentage = 100;
          data.list[i].display = "none";
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
        } else if (data.list[i].type == 6) {
          fgList.value.push(data.list[i]);
        }
      }
    }
  });
};
const getOrderLog = () => {
  ChatAPI.getOrderLog({ OrderId: chatStore.orderInfo.id }).then((data) => {
    prodTypeId.value = data.length > 0 ? data[0].prodTypeId : 0;
    logList.value = data;
  });
};
const closeRoom = () => {
  useWebSocketStore().listRoomId = useChatStore().roomId;
  if (!user.members.orgRoleCodes.includes("10011")) {
    readMsg();
  }
  chatStore.closeRoom();
  setOrderInfo();
};
const closeRooms = () => {
  useWebSocketStore().listRoomId = useChatStore().roomId;
  if (!user.members.orgRoleCodes.includes("10011")) {
    readMsg();
  }
  chatStore.closeRoom();
  setOrderInfo();
  window.close();
};
function handleUpload(options, type) {
  fileType.value = type;
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
  const hz = getFileExtensions(file.name);
  let wjqz = "cbct-";
  if (type == 1) {
    wjqz = "口扫数据-";
  }
  if (type == 2) {
    wjqz = "比色照片-";
  }
  if (type == 3) {
    wjqz = "制作照片-";
  }
  const patientName = getPcPatientName();
  const newFileName = wjqz + patientName + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk2 = {};
    chunk2.file = chunks2.file;
    chunk2.filePartName = fileName;
    chunk2.originalFileName = newFileName;
    chunk2.urlParameter = "";
    chunk2.partNumber = index + 1;
    chunk2.chunks = totalParts;
    chunk2.size = bufferChunkSize;
    chunk2.start = chunks2.start;
    chunk2.end = chunks2.end;
    chunk2.total = size;
    chunkInfo.push(chunk2);
  });
  const fileurl = {
    orderId: chatStore.orderInfo.id,
    type: fileType.value,
    fileName,
    url: "",
    name: "",
    percentage: 0,
    display: "block"
  };
  switch (fileurl.type) {
    case 0:
      cbctList.value.push(fileurl);
      break;
    case 1:
      ksList.value.push(fileurl);
      break;
    case 2:
      bsList.value.push(fileurl);
      break;
    case 3:
      zzList.value.push(fileurl);
      break;
    case 4:
      sjzlfileUrls.value.push(fileurl);
      break;
  }
  allUplod(chunkInfo, 2, fileurl);
}
async function allUplod(chunkInfo, batchSize, fileurl) {
  const totalBatches = Math.ceil(chunkInfo.length / batchSize);
  for (let i = 0; i < totalBatches; i++) {
    const number = (i + 1) * 4;
    const batchChunks = chunkInfo.slice(i * batchSize, (i + 1) * batchSize);
    const batchPromise = batchChunks.map(
      (it) => UploadFileChunk(it, number, chunkInfo.length, fileurl)
    );
    await Promise.all(batchPromise);
  }
}
async function UploadFileChunk(chunk2, i, z, fileurl) {
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
  await FileAPI.upload(formData).then(async (data) => {
    if (data) {
      console.log("FileAPI.upload", parseInt(i / (z + 1) * 100), data);
      setImg(parseInt(i / (z + 1) * 100), 0, fileurl);
      const imgurl = data.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      const files = {
        fileId: data.id,
        type: fileurl.type,
        fileName: chunk2.originalFileName,
        url: imgurl,
        name: imgname
      };
      const file = {
        fileName: chunk2.filePartName,
        fileNames: chunk2.originalFileName,
        url: import.meta.env.VITE_APP_IMAGE_URL + imgurl,
        type: fileurl.type,
        name: imgname
      };
      await addOrderFile(files);
      setImg(100, 1, file);
    } else {
      let c = parseInt(i / (z + 1) * 100);
      let percentage2 = c;
      const file = {
        fileName: chunk2.filePartName,
        type: fileurl.type,
        url: ""
      };
      console.log("percentage", percentage2);
      setImg(percentage2, 0, file);
      return true;
    }
  }).catch((error) => {
  });
}
function setImg(v, i, file) {
  console.log("setImg", v, i, file);
  switch (file.type) {
    case 0:
      let index = cbctList.value.findIndex((item) => item.fileName === file.fileName);
      cbctList.value[index].percentage = v;
      if (i == 1) {
        cbctList.value[index].fileName = file.fileNames;
        cbctList.value[index].url = file.url;
        cbctList.value[index].name = file.name;
        cbctList.value[index].percentage = 100;
        cbctList.value[index].display = "none";
      }
      break;
    case 1:
      let index1 = ksList.value.findIndex((item) => item.fileName === file.fileName);
      ksList.value[index1].percentage = v;
      if (i == 1) {
        ksList.value[index1].fileName = file.fileNames;
        ksList.value[index1].url = file.url;
        ksList.value[index1].name = file.name;
        ksList.value[index1].percentage = 100;
        ksList.value[index1].display = "none";
      }
      break;
    case 2:
      let index2 = bsList.value.findIndex((item) => item.fileName === file.fileName);
      bsList.value[index2].percentage = v;
      if (i == 1) {
        bsList.value[index2].fileName = file.fileNames;
        bsList.value[index2].url = file.url;
        bsList.value[index2].name = file.name;
        bsList.value[index2].percentage = 100;
        bsList.value[index2].display = "none";
      }
      if (file.url != "") {
        bsPrList.value.push(file.url);
      }
      break;
    case 3:
      let index3 = zzList.value.findIndex((item) => item.fileName === file.fileName);
      zzList.value[index3].percentage = v;
      if (i == 1) {
        zzList.value[index3].fileName = file.fileNames;
        zzList.value[index3].url = file.url;
        zzList.value[index3].name = file.name;
        zzList.value[index3].percentage = 100;
        zzList.value[index3].display = "none";
      }
      if (file.url != "") {
        zzPrList.value.push(file.url);
      }
      break;
    case 4:
      let index4 = sjzlfileUrls.value.findIndex((item) => item.fileName === file.fileName);
      sjzlfileUrls.value[index4].percentage = v;
      if (i == 1) {
        sjzlfileUrls.value[index4].fileName = file.fileNames;
        sjzlfileUrls.value[index4].url = file.url;
        sjzlfileUrls.value[index4].name = file.name;
        sjzlfileUrls.value[index4].percentage = 100;
        sjzlfileUrls.value[index4].display = "none";
      }
      break;
  }
}
function getFileExtension(filename) {
  const matchs = filename.match(/\.([^.]+)$/);
  const match = matchs ? matchs[1] : "0";
  return filename.split(`.${match}`)[0] + (Math.floor(Math.random() * 9e4) + 1e4) + "." + match;
}
function getFileExtensions(filename) {
  const date = /* @__PURE__ */ new Date();
  let datatime = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const matchs = filename.match(/\.([^.]+)$/);
  const match = matchs ? matchs[1] : "0";
  return "(pc" + datatime + (Math.floor(Math.random() * 9e4) + 1e4) + ")." + match;
}
async function addOrderFile(files) {
  const img = Object.assign({}, orderFileInfo);
  img.orderId = chatStore.orderInfo.id;
  img.omId = 0;
  img.Files = [files];
  const loading = ElLoading.service({
    lock: true,
    text: "Loading..."
  });
  await OrderAPI.addFile(img).then(() => {
    loading.close();
    loadings.value = false;
  }).finally(() => {
    loading.close();
    loadings.value = false;
  });
}
const readMsg = () => {
  ChatAPI.readMessage({ roomId: useChatStore().roomId }).then((data) => {
    console.log("readMsg", data);
    useWebSocketStore().listRoomId = 0;
    handleCallHeaderMethod();
  });
};
const emit = defineEmits(["callheadermethods", "setOrderInfo"]);
function handleCallHeaderMethod() {
  emit("callheadermethods");
}
function getMessData(item) {
  let mess = "";
  if (item.message1) {
    mess += item.message1 + ",";
  }
  if (item.message2) {
    mess += item.message2 + ",";
  }
  mess = mess.slice(0, -1);
  return mess.length > 0 ? `(${mess})` : "";
}
function setOrderInfo() {
  emit("setOrderInfo");
}
const download = (url2) => {
  window.open(url2);
};
onUnmounted(() => {
  clearPcPatientName();
});
</script>

<style scoped>
.file-list {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0;
}

.file-list-label {
  width: 70px;
  font-weight: bold;
}

.file-list-content {
  flex: 1;
}

.file-list-item {
  margin-bottom: 10px;
}

.file-list-item-name {
  display: flex;
  align-items: center;
}

.file-list-item-name-icon-del {
  cursor: pointer;
}
:deep(.el-form-item--label-right .el-form-item__label) {
  justify-content: flex-end;
  text-align: right;
  font-size: 16px;
}
:deep(.el-button--small) {
  border-radius: calc(var(--el-border-radius-base) - 1px);
  font-size: 14px;
  padding: 5px 11px;
}
:deep(.el-link__inner) {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  padding-top: 10px;
  color: #5094f5;
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
    /* width: 50px; */
  }

  .upfile {
    /* width: 77px; */
    padding: 0px 10px 5px 3px;
    display: flex;
    height: 22px;
    line-height: 22px;

    .upfile-txt {
      display: flex;
      max-width: 50px;
      overflow: hidden;
      align-items: center;
      height: 22px;
      line-height: 22px;
      /* flex-flow: column; */

      .upfile-name {
        display: flex;
        height: 19px;
      }

      .upfile-jindu {
        position: relative;
        height: 3px;
        width: 100%;
        background-color: #a8abb2;
        margin-left: 5px;
      }
    }

    .upfile-txts {
      display: flex;
      max-width: 50px;
      overflow: hidden;
      height: 50px;
      cursor: pointer;

      .upfile-names {
        display: flex;
        height: 42px;
      }

      .upfile-jindus {
        position: relative;
        height: 3px;
        width: 100%;
        background-color: #a8abb2;
        margin-left: 5px;
      }
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

      .upfile-names {
        display: flex;
        height: 42px;
      }

      .upfile-jindus {
        position: relative;
        height: 3px;
        width: 100%;
        background-color: #a8abb2;
        margin-left: 5px;
      }
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
    /* width: 51px; */
    padding: 0px 2px 10px 0px;
    display: flex;

    .upfile-txts {
      display: flex;
      /* max-width: 60px; */
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
  font-size: 17px;
  color: #333f48;
  :deep(.el-timeline-item__content) {
    color: #303133;
    font-size: 17px;
  }
  :deep(.el-timeline-item__timestamp) {
    color: #909399;
    font-size: 15px;
    line-height: 1;
  }
  .imgclass {
    /* display: flex; */
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
  background-color: #dce9fb;
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
    font-size: 16px;
    margin-top: 12px;
    color: #222428;
    line-height: 24px;
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

:deep(.el-progress) {
  align-items: center;
  display: flex;
  line-height: 1;
  position: relative;
  width: 100%;
}
</style>
