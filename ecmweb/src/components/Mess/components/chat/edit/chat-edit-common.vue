<template>
  <div class="common-phrases-container">

    <div class="header-container">

      <!-- 页面标题区域 -->
      <el-button circle @click="closeDrawer">
        <el-icon>
          <Close />
        </el-icon>
      </el-button>

      <!-- 操作栏：搜索 + 添加按钮 -->
      <div class="operation-bar">
        <el-button type="primary" @click="openAddDialog">
          <el-icon-plus /> 添加常用语
        </el-button>
      </div>
    </div>

    <!-- 常用语列表 -->
    <el-table :data="phrases" border stripe class="phrases-table" height="500">
      <el-table-column label="常用语内容" prop="content" align="center">
        <template #default="scope">
          <span class="phrase-content">
            <el-button type="text" @click="selectCommon(scope.row)">{{ scope.row.content }}</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="75" align="center">
        <template #default="scope">
          <!-- <el-button type="text" color="#409EFF" @click="selectCommon(scope.row)">
            选定
          </el-button> -->
          <el-button type="text" color="#409EFF" @click="openEditDialog(scope.row)" v-if="scope.row.userId != 0">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
          <el-button type="text" style="color: red;" color="#ff0000" @click="handleDelete(scope.row)"
            v-if="scope.row.userId != 0">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑常用语弹窗 -->
    <el-dialog :title="isEditMode ? '编辑常用语' : '添加常用语'" v-model="isDialogOpen" width="500px"
      :close-on-click-modal="false">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="80px" class="phrase-form">
        <el-form-item label="常用语" prop="content">
          <el-input v-model="form.content" placeholder="请输入常用语" :maxlength="200" show-word-limit type="textarea"
            :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ChatAPI from "@/api/mess";
import { useUserStore } from "@/store";
const phrases = ref([]);
const isDialogOpen = ref(false);
const isEditMode = ref(false);
const formRef = ref();
const form = ref({ content: "" });
const currentEditId = ref("");
const emit = defineEmits(["selectCommon", "closeDrawer"]);
const formRules = ref({
  content: [
    { required: true, message: "请输入常用语", trigger: "blur" },
    { min: 1, max: 100, message: "常用语长度不能超过100个字符", trigger: "blur" }
  ]
});
onMounted(() => {
  initPhrases();
});
const closeDrawer = () => {
  emit("closeDrawer");
};
const selectCommon = (phrase) => {
  console.log("selectCommon", phrase);
  emit("selectCommon", phrase);
};
const initPhrases = async () => {
  console.log("userInfo", useUserStore().userInfo);
  const res = await ChatAPI.getCommon({ IsAll: 1, type: 0, OrgRoleCodes: useUserStore().userInfo.members.orgRoleCodes.join(",") });
  if (res.code === 1) {
    phrases.value = res.data;
  }
  console.log("getCommon", res);
};
const openAddDialog = () => {
  isEditMode.value = false;
  form.value = { content: "" };
  isDialogOpen.value = true;
  formRef.value?.clearValidate();
};
const openEditDialog = (phrase) => {
  isEditMode.value = true;
  currentEditId.value = phrase.id;
  form.value = { content: phrase.content };
  isDialogOpen.value = true;
  formRef.value?.clearValidate();
};
const closeDialog = () => {
  isDialogOpen.value = false;
  form.value = { content: "" };
  currentEditId.value = "";
};
const submitForm = async () => {
  try {
    await formRef.value?.validate();
    let param = {
      // userId: useUserStore().userInfo.chatUserId,
      chatUserId: useUserStore().userInfo.chatUserId,
      // orgRoleCode: useUserStore().userInfo.members.orgRoleCodes.join(','),
      type: 0,
      content: form.value.content,
      isDelete: 0
    };
    if (isEditMode.value) {
      const index = phrases.value.findIndex((item) => item.id === currentEditId.value);
      if (index !== -1) {
        param.id = currentEditId.value;
        ElMessage.success("常用语编辑成功！");
      }
    }
    console.log("submitForm", param);
    ChatAPI.optcommon(param).then((res) => {
      initPhrases();
      closeDialog();
      console.log("addCommon", res);
    });
  } catch (error) {
  }
};
const handleDelete = (row) => {
  ElMessageBox.confirm(
    "确定要删除这条常用语吗？",
    "确认删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).then(async () => {
    let param = {
      id: row.id,
      content: row.content,
      isDelete: 1
    };
    let res = await ChatAPI.optcommon(param);
    if (res.code === 1) {
      ElMessage.success("常用语删除成功！");
      initPhrases();
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(() => {
    ElMessage.info("已取消删除");
  });
};
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
}

.common-phrases-container {
  position: fixed;
  bottom: 300px;
  right: 100px;
  z-index: 99;
  width: 300px;
  height: 520px;
  background-color: #fff;
  border: solid 1px #ebeef5;
}

.page-header {
  margin-bottom: 24px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 300px;
}

.phrases-table {
  width: 100%;
}

.phrase-content {
  max-width: 500px;
  white-space: wrap;
}

.phrase-form {
  margin-top: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .operation-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-input {
    width: 100%;
  }

  .phrase-content {
    max-width: 200px;
  }
}
</style>