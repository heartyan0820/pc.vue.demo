<!-- 文件上传组件 -->
<template>
  <div>
    <el-upload
      v-model:file-list="fileList"
      :style="props.style"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :accept="props.accept"
      :limit="props.limit"
      multiple
    >
      <!-- 上传文件按钮 -->
      <el-button type="primary" :disabled="fileList.length >= props.limit">
        {{ props.uploadBtnText }}
      </el-button>

      <!-- 文件列表 -->
      <template #file="{ file }">
        <div class="el-upload-list__item-info">
          <a class="el-upload-list__item-name" @click="handleDownload(file)">
            <el-icon><Document /></el-icon>
            <span class="el-upload-list__item-file-name">{{ file.name }}</span>
            <span class="el-icon--close" @click.stop="handleRemove(file.url!)">
              <el-icon><Close /></el-icon>
            </span>
          </a>
        </div>
      </template>
    </el-upload>

    <el-progress
      :style="{
        display: showProgress ? 'inline-flex' : 'none',
        width: '100%',
      }"
      :percentage="progressPercent"
    />
  </div>
</template>
<script setup>import FileAPI from "@/api/file";
const props = defineProps({
  /**
   * 请求携带的额外参数
   */
  data: {
    type: Object,
    default: () => {
      return {};
    }
  },
  /**
   * 上传文件的参数名
   */
  name: {
    type: String,
    default: "file"
  },
  /**
   * 文件上传数量限制
   */
  limit: {
    type: Number,
    default: 10
  },
  /**
   * 单个文件上传大小限制(单位MB)
   */
  maxFileSize: {
    type: Number,
    default: 10
  },
  /**
   * 上传文件类型
   */
  accept: {
    type: String,
    default: "*"
  },
  /**
   * 上传按钮文本
   */
  uploadBtnText: {
    type: String,
    default: "上传文件"
  },
  /**
   * 样式
   */
  style: {
    type: Object,
    default: () => {
      return {
        width: "100px"
      };
    }
  }
});
const modelValue = defineModel("modelValue", {
  type: [Array],
  required: true,
  default: () => []
});
const fileList = ref([]);
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
const showProgress = ref(false);
const progressPercent = ref(0);
watch(
  modelValue,
  (value) => {
    fileList.value = value.map((item) => {
      const name = item.name ? item.name : item.url?.substring(item.url.lastIndexOf("/") + 1);
      return {
        name,
        url: item.url,
        status: "success",
        uid: getUid()
      };
    });
  },
  {
    immediate: true
  }
);
function handleBeforeUpload(file) {
  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.warning("上传图片不能大于" + props.maxFileSize + "M");
    return false;
  }
  return true;
}
function handleUpload(options) {
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
}
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
  await FileAPI.upload(formData).then((data) => {
    if (data) {
      const imgurl = data;
      const imgarr = imgurl.split("/");
      emit("add", {
        fileUrl: imgurl,
        fileName: imgarr[imgarr.length - 1],
        fileSize: chunk2.total
      });
    }
  }).catch((error) => {
    ElMessage.error(error);
  });
}
const handleProgress = (event) => {
  progressPercent.value = event.percent;
};
const handleSuccess = (fileInfo) => {
  ElMessage.success("上传成功");
  modelValue.value = [...modelValue.value, { name: fileInfo.name, url: fileInfo.url }];
};
const handleError = (_error) => {
  console.error(_error);
  ElMessage.error("上传失败");
};
function handleRemove(fileUrl) {
  FileAPI.delete(fileUrl).then(() => {
    modelValue.value = modelValue.value.filter((file) => file.url !== fileUrl);
  });
}
function handleDownload(file) {
  const { url, name } = file;
  if (url) {
    FileAPI.download(url, name);
  }
}
function getUid() {
  return Date.now() << 13 | Math.floor(Math.random() * 8192);
}
</script>
<style lang="scss" scoped>
.el-upload-list__item .el-icon--close {
  position: absolute;
  top: 50%;
  right: 5px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  opacity: 0.75;
  transform: translateY(-50%);
  transition: opacity var(--el-transition-duration);
}

:deep(.el-upload-list) {
  margin: 0;
}

:deep(.el-upload-list__item) {
  margin: 0;
}
</style>
