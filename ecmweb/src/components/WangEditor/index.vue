<!--
 * 基于 wangEditor-next 的富文本编辑器组件二次封装
 * 版权所有 © 2021-present 有来开源组织
 *
 * 开源协议：https://opensource.org/licenses/MIT
 * 项目地址：https://gitee.com/youlaiorg/vue3-element-admin
 *
 * 在使用时，请保留此注释，感谢您对开源的支持！
 -->

<template>
  <div style="z-index: 999; border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      mode="simple"
      :default-config="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="modelValue"
      :style="{ height: height, overflowY: 'hidden' }"
      :default-config="editorConfig"
      mode="simple"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup>
import { Toolbar, Editor } from "@wangeditor-next/editor-for-vue";
import "@wangeditor-next/editor/dist/css/style.css";
import FileAPI from "@/api/file";
defineProps({
  height: {
    type: String,
    default: "500px"
  }
});
const modelValue = defineModel("modelValue", {
  type: String,
  required: false
});
const editorRef = shallowRef();
const toolbarConfig = ref({});
const editorConfig = ref({
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      customUpload(file, insertFn) {
        FileAPI.uploadFile(file).then((res) => {
          insertFn(res.url, res.name, res.url);
        });
      }
    }
  }
});
const handleCreated = (editor) => {
  editorRef.value = editor;
};
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
