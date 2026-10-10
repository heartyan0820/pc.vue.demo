<!-- 单图上传组件 -->
<template>
  <el-upload
    v-model="modelValue"
    class="single-upload"
    list-type="picture-card"
    :show-file-list="false"
    :accept="props.accept"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-success="onSuccess"
    :on-error="onError"
    multiple
  >
    <template #default>
      <el-image v-if="modelValue" :src="modelValue" />
      <el-icon v-if="modelValue" class="single-upload__delete-btn" @click.stop="handleDelete">
        <CircleCloseFilled />
      </el-icon>
      <el-icon v-else class="single-upload__add-btn">
        <Plus />
      </el-icon>
    </template>
  </el-upload>
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
   * 最大文件大小（单位：M）
   */
  maxFileSize: {
    type: Number,
    default: 10
  },
  /**
   * 上传图片格式，默认支持所有图片(image/*)，指定格式示例：'.png,.jpg,.jpeg,.gif,.bmp'
   */
  accept: {
    type: String,
    default: "image/*"
  },
  /**
   * 自定义样式，用于设置组件的宽度和高度等其他样式
   */
  style: {
    type: Object,
    default: () => {
      return {
        width: "150px",
        height: "150px"
      };
    }
  }
});
const modelValue = defineModel("modelValue", {
  type: String,
  default: () => ""
});
function handleBeforeUpload(file) {
  const acceptTypes = props.accept.split(",").map((type) => type.trim());
  const isValidType = acceptTypes.some((type) => {
    if (type === "image/*") {
      return file.type.startsWith("image/");
    } else if (type.startsWith(".")) {
      return file.name.toLowerCase().endsWith(type);
    } else {
      return file.type === type;
    }
  });
  if (!isValidType) {
    ElMessage.warning(`上传文件的格式不正确，仅支持：${props.accept}`);
    return false;
  }
  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.warning("上传图片不能大于" + props.maxFileSize + "M");
    return false;
  }
  return true;
}
function handleUpload(options) {
  return new Promise((resolve, reject) => {
    const file = options.file;
    const formData = new FormData();
    formData.append(props.name, file);
    Object.keys(props.data).forEach((key) => {
      formData.append(key, props.data[key]);
    });
    FileAPI.upload(formData).then((data) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
}
function handleDelete() {
  modelValue.value = "";
}
const onSuccess = (fileInfo) => {
  ElMessage.success("上传成功");
  modelValue.value = fileInfo.url;
};
const onError = (error) => {
  console.log("onError");
  ElMessage.error("上传失败: " + error.message);
};
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  /*  width: var(--el-upload-picture-card-size);
  height: var(--el-upload-picture-card-size); */
  width: v-bind("props.style.width");
  height: v-bind("props.style.height");
}

.single-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px var(--el-border-color) solid;
  border-radius: 5px;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &__delete-btn {
    position: absolute;
    top: 1px;
    right: 1px;
    font-size: 16px;
    color: #ff7901;
    cursor: pointer;
    background: #fff;
    border-radius: 100%;

    :hover {
      color: #ff4500;
    }
  }
}
</style>
