<template>
  <div
    ref="dropArea"
    class="drop-area"
    :class="{ 'drag-over': isDragOver }"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
  >
    <div
      v-if="isDragOver"
      class="file-cover"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="file-container">
        <input ref="fileInput" type="file" class="file-input" multiple @change="handleFileChange" />
        <p class="instructions">
          拖拽文件到此处 或
          <span class="browse-btn" @click="triggerFileInput">点击上传</span>
        </p>

        <div v-if="files.length" class="file-list">
          <div v-for="(item, index) in files" :key="index" class="file-item-box">
            <div class="file-item">
              <span class="file-name">{{ item.file.name }}</span>
              <span class="file-size">{{ formatFileSize(item.file.size) }}</span>
              <button class="remove-btn" @click="removeFile(index)">×</button>
            </div>
            <el-progress
              :stroke-width="5"
              :percentage="item.progress"
              :show-text="false"
              status="success"
              striped
              striped-flow
              :duration="10"
            />
          </div>
        </div>

        <div class="btn-container">
          <el-button type="info" @click="isDragOver = false">取消</el-button>
          <el-button type="primary" :loading="isUploading" @click="sendFiles()">
            {{ isUploading ? "上传中..." : "发送" }}
          </el-button>
        </div>
      </div>
    </div>

    <EcmMessageHeader :key="useChatStore().activeIndex" />
    <EcmMessageList v-show="useChatStore().activeIndex == 0" @featchMyNotice="featchMyNotice" />
    <EcmMessageChat
      v-if="useChatStore().activeIndex > 0"
      @callheadermethods="handleCallHeaderMethod"
      @featchMyNotices="featchMyNotice"
      @setOrderInfo="setOrderInfo"
    />
  </div>
</template>
<script setup>
import EcmMessageHeader from "./components/ecm-message-header.vue";
import EcmMessageList from "./components/ecm-message-list.vue";
import EcmMessageChat from "./components/ecm-message-chat.vue";
import { ref, computed } from "vue";
import { defineOptions } from "vue";
import { useChatStore } from "@/store";
import FileAPI from "@/api/file/chat";
const isDragOver = ref(false);
const files = reactive([]);
const dropArea = ref(null);
const fileInput = ref(null);
const chatStore = useChatStore();
defineOptions({
  name: "Message",
  inheritAttrs: false
});
const isUploading = computed(() => {
  let isUploading2 = false;
  files.forEach((item) => {
    if (item.progress < 100) {
      isUploading2 = true;
    }
  });
  return isUploading2;
});
let file_index = 0;
const sendFiles = () => {
  if (files.length == 0) {
    ElMessage.error("请选择文件");
    return false;
  }
  let msgType = 4;
  if (files[file_index].file.type.startsWith("image/")) {
    msgType = 2;
  } else if (files[file_index].file.type.startsWith("audio/")) {
    msgType = 3;
  } else if (files[file_index].file.type.startsWith("video/")) {
    msgType = 7;
  }
  chatStore.btnAiObj = {
    type: 4,
    msgType,
    content: files[file_index].file.name,
    fileUrl: files[file_index].url
  };
  if (file_index < files.length - 1) {
    file_index++;
    setTimeout(() => {
      sendFiles();
    }, 500);
  } else {
    file_index = 0;
    isDragOver.value = false;
  }
};
const handleDragEnter = () => {
  isDragOver.value = true;
};
const handleDragOver = (e) => {
  e.preventDefault();
  isDragOver.value = true;
};
const handleDragLeave = () => {
  isDragOver.value = false;
};
const handleDrop = (e) => {
  e.preventDefault();
  processFiles(e.dataTransfer?.files);
};
const triggerFileInput = () => {
  fileInput.value?.click();
};
const handleFileChange = (e) => {
  const target = e.target;
  processFiles(target.files);
  if (target) target.value = "";
};
const processFiles = (fileList) => {
  if (!fileList) return;
  files.splice(0);
  for (let i = 0; i < fileList.length; i++) {
    files.push({ file: fileList[i], progress: 0 });
    uploadFiles(fileList[i], i);
  }
  console.log("files", files);
};
const removeFile = (index) => {
  files.splice(index, 1);
};
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
const uploadFiles = async (file, index) => {
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
  const fileName = getFileExtension(file.name);
  var chunkInfo = [];
  fileChunks.forEach((chunks, index2) => {
    let chunk = {};
    chunk.file = chunks.file;
    chunk.filePartName = fileName;
    chunk.originalFileName = file.name;
    chunk.urlParameter = "";
    chunk.partNumber = index2 + 1;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks.start;
    chunk.end = chunks.end;
    chunk.total = size;
    chunkInfo.push(chunk);
  });
  await allUplod(chunkInfo, index);
};
async function allUplod(chunkInfo, index) {
  const batchSize = 4;
  const totalBatches = Math.ceil(chunkInfo.length / batchSize);
  for (let i = 0; i < totalBatches; i++) {
    const number = (i + 1) * 4;
    const batchChunks = chunkInfo.slice(i * batchSize, (i + 1) * batchSize);
    const batchPromise = batchChunks.map(
      (it) => UploadFileChunk(it, number, chunkInfo.length, index)
    );
    await Promise.all(batchPromise);
  }
}
async function UploadFileChunk(chunk, i, z, index) {
  var formData = new FormData();
  formData.append("File", chunk.file);
  formData.append("FileName", chunk.filePartName);
  formData.append("PartNumber", chunk.partNumber);
  formData.append("Chunks", chunk.chunks);
  formData.append("Size", chunk.size);
  formData.append("Start", chunk.start);
  formData.append("End", chunk.end);
  formData.append("Total", chunk.total);
  formData.append("SoureCode", "Chat");
  await FileAPI.upload(formData).then(async (data) => {
    if (data) {
      const imgurl = data;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      files[index].url = import.meta.env.VITE_APP_IMAGE_URL + imgurl;
      files[index].progress = 100;
    } else {
      let c = parseInt(i / (z + 1) * 100);
      console.log("c", c);
      files[index].progress = c;
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
const emit = defineEmits(["callheadermethods", "featchMyNotice", "setOrderInfo"]);
function handleCallHeaderMethod() {
  emit("callheadermethods");
}
function featchMyNotice() {
  emit("featchMyNotice");
}
function setOrderInfo() {
  emit("setOrderInfo");
}
</script>
<style lang="scss" scoped>
.btn-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.file-container {
  width: 80%;
  padding: 20px;
  background-color: #fff;
}

.file-cover {
  width: 100%;
  height: 100%;
  background-color: rgba(18, 28, 29, 0.5);
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-area {
  position: relative;
  transition: all 0.3s;
}

.drop-area.drag-over {
  border-color: #4361ee;
  background-color: rgba(67, 97, 238, 0.05);
}

.file-input {
  display: none;
}

.instructions {
  color: #666;
  margin: 40px 0;
}

.browse-btn {
  color: #4361ee;
  text-decoration: underline;
  cursor: pointer;
}

.file-list {
  margin-top: 20px;
}

.file-item-box {
  border-bottom: 1px solid #eee;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
}

.file-name {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  color: #888;
  margin: 0 10px;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 5px;
}
</style>
