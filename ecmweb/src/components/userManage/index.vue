<!-- 用户管理 -->
<template>
  <div class="ecmbody-contentcygl">
    <div class="ecmbody-contentcygl-right-top">成员管理</div>
    <el-divider />
    <div class="ecmbody-contentcygl-right-top2">
      <span>设置成员管理</span>
      <div class="app-containers">
        <el-row>
          <!-- 成员列表 -->
          <el-col :lg="24" :xs="24">
            <div class="search-bar">
              <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="关键字" prop="keywords">
                  <el-input
                    v-model="queryParams.keywords"
                    placeholder="姓名/手机号"
                    clearable
                    style="width: 105px"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="全部"
                    clearable
                    class="!w-[100px]"
                  >
                    <el-option label="正常" :value="true" />
                    <el-option label="禁用" :value="false" />
                  </el-select>
                </el-form-item>

                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="queryParams.createTime"
                    :editable="false"
                    class="!w-[220px]"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始时间"
                    end-placeholder="截止时间"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
                  <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-card shadow="never">
              <div class="flex-x-between mb-10px">
                <div>
                  <el-button
                    v-hasPerm="'orgmember-create'"
                    type="success"
                    icon="plus"
                    @click="handleOpenDialog()"
                  >
                    新增
                  </el-button>
                  <el-button
                    v-hasPerm="'orgmember-delete'"
                    type="danger"
                    icon="delete"
                    :disabled="selectIds.length === 0"
                    @click="handleDelete()"
                  >
                    删除
                  </el-button>
                </div>
                <!--<div>
              <el-button v-hasPerm="'user-import'" icon="upload" @click="handleOpenImportDialog">
                导入
              </el-button>

              <el-button v-hasPerm="'user-export'" icon="download" @click="handleExport">
                导出
              </el-button>
            </div>-->
              </div>

              <!-- 机构成员列表 -->
              <el-table
                v-loading="loading"
                :data="pageData"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column label="姓名" prop="name" width="100" show-overflow-tooltip />
                <el-table-column label="昵称" prop="title" width="100" show-overflow-tooltip />
                <el-table-column
                  label="手机号码"
                  prop="cellphone"
                  align="center"
                  width="128"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="关联账号"
                  prop="account"
                  align="center"
                  width="128"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="角色"
                  prop="orgRoleName"
                  align="center"
                  width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="机构分类"
                  min-width="120"
                  align="center"
                  prop="orgClassifyName"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="机构/部门"
                  min-width="120"
                  align="center"
                  prop="orgName"
                  show-overflow-tooltip
                />
                <el-table-column label="状态" align="center" prop="status" width="80">
                  <template #default="scope">
                    <el-tag :type="scope.row.status == true ? 'success' : 'info'">
                      {{ scope.row.status == true ? "正常" : "禁用" }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="创建时间"
                  align="center"
                  prop="createTime"
                  width="150"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" fixed="right" align="right" width="155">
                  <template #default="scope">
                    <el-button
                      v-hasPerm="'orgmember-update'"
                      type="primary"
                      icon="edit"
                      link
                      size="small"
                      @click="handleOpenDialog(scope.row.id)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      v-hasPerm="'orgmember-delete'"
                      type="danger"
                      icon="delete"
                      link
                      size="small"
                      @click="handleDelete(scope.row.id)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <pagination
                v-if="total > 0"
                v-model:total="total"
                v-model:page="queryParams.pageIndex"
                v-model:limit="queryParams.pageSize"
                @pagination="handleQuery"
              />
            </el-card>
          </el-col>
        </el-row>
        <!-- 机构成员表单 -->
      </div>
    </div>
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      draggable
      width="30%"
      @close="handleCloseDialog"
    >
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="110px"
        class="my-form-item"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="手机号码" prop="cellphone">
          <el-input
            v-model="formData.cellphone"
            placeholder="请输入手机号码"
            maxlength="11"
            @blur="handleCellphoneChange"
          />
        </el-form-item>

        <el-form-item label="&nbsp;&nbsp;&nbsp;昵称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入昵称" />
        </el-form-item>
        <!-- <el-form-item v-if="formData.id == 0" label="机构/部门" prop="orgId">
          <el-tree-select
            v-model="formData.orgId"
            placeholder="请选择机构/部门"
            :filter-node-method="handleFilter"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            :remote-method="handleDeptOptions"
            @change="handleClassifyChange"
          />
        </el-form-item> -->
        <el-form-item label="机构/部门" prop="orgDeptId">
          <el-tree-select
            v-model="formData.orgDeptId"
            placeholder="请选择所属机构/部门"
            :data="deptOptions"
            filterable
            check-strictly
            :default-expanded-keys="optionKeys"
            node-key="value"
            :render-after-expand="false"
            :remote-method="handleDeptOptions"
            :disabled="ishszs"
            @change="handleClassifyChange"
          />
        </el-form-item>
        <el-form-item label="机构角色" prop="orgRoleIds">
          <el-tree-select
            v-model="formData.orgRoleIds"
            placeholder="请选择机构角色"
            :data="roleOptions"
            check-strictly
            multiple
            :render-after-expand="false"
            :disabled="ishszs"
            @change="handleJueSeChange"
          />
        </el-form-item>
        <el-form-item label="&nbsp;&nbsp;&nbsp;创建账号">
          <el-switch
            v-model="formData.createAccount"
            inline-prompt
            active-text="创建"
            inactive-text="关联"
            :active-value="true"
            :inactive-value="false"
            @change="handleCreateAccountChange"
          />
        </el-form-item>
        <el-form-item v-if="formData.createAccount && accountMobile" label="账号手机" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
            @blur="handleMobileChange"
          />
        </el-form-item>
        <el-form-item v-if="!formData.createAccount" label="关联账号" prop="userId">
          <el-tree-select
            v-model="formData.userId"
            placeholder="通过手机或账号检索"
            :data="userOptions"
            filterable
            clearable
            remote
            :remote-method="loadUserOptions"
          />
        </el-form-item>
        <el-form-item v-if="formData.createAccount" label="账号" prop="account">
          <el-input v-model="formData.account" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="&nbsp;&nbsp;&nbsp;状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="&nbsp;&nbsp;&nbsp;常用要求" prop="require">
          <el-input
            v-model="formData.require"
            type="textarea"
            placeholder="请输入特殊要求"
            :rows="2"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="dicabled" label="关联医生" prop="groupMemberIds">
          <el-tree-select
            v-model="formData.groupMemberIds"
            placeholder="请选择关联医生"
            :data="doctorOptions"
            check-strictly
            :disabled="docdisabled"
            multiple
            :render-after-expand="false"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取 消</el-button>
          <el-button type="primary" :loading="fromLoading" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>import { useUserStore } from "@/store";
import UserAPI from "@/api/system/user";
import OrgMemberAPI from "@/api/system/orgMember";
import OrgClassAPI from "@/api/system/orgClass";
import DeptAPI from "@/api/system/dept";
import { cloneDeep } from "lodash-es";
defineOptions({
  name: "UserList",
  inheritAttrs: false
});
const props = defineProps({
  orgId: {
    type: Number,
    default: 0
  },
  orgClassifyCode: {
    type: Number,
    default: 0
  }
});
const userStore = useUserStore();
const queryFormRef = ref();
const userFormRef = ref();
const cate = ref(0);
cate.value = props.orgClassifyCode;
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10
});
const pageData = ref();
const total = ref(0);
const loading = ref(false);
const fromLoading = ref(false);
const accountMobile = ref(false);
const docdisabled = ref(false);
const dicabled = ref(false);
const ishszs = ref(false);
const glys = ref([]);
const dialog = reactive({
  visible: false,
  title: "新增用户"
});
const formData = reactive({
  id: 0,
  status: true,
  orgRoleIds: [],
  require: "",
  orgDeptId: "",
  groupMemberIds: []
});
const userId = ref(0);
const checkAccount = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("用户名不能为空"));
  }
  UserAPI.exists({ account: value, id: formData.id }).then((data) => {
    if (data) {
      callback(new Error("该账号已存在，请重新录入"));
    } else {
      callback();
    }
  });
};
const checkMobile = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("用户名不能为空"));
  }
  UserAPI.exists({ mobile: value, id: formData.id }).then((data) => {
    if (data) {
      callback(new Error("该手机号已存在，请重新录入"));
    } else {
      callback();
    }
  });
};
const rules = reactive({
  name: [{ required: true, message: "成员姓名不能为空", trigger: "blur" }],
  account: [
    { required: true, message: "账号名不能为空", trigger: "blur" },
    {
      pattern: /^[\w]{2,20}$/,
      message: "账号长度为2-20位，只能包含字母数字和_",
      trigger: "blur"
    },
    { validator: checkAccount, trigger: "blur" }
  ],
  cellphone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ],
  mobile: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    },
    { validator: checkMobile, trigger: "blur" }
  ],
  orgClassifyId: [{ required: true, message: "请选择机构分类", trigger: "change" }],
  orgId: [{ required: true, message: "请选择所属机构", trigger: "change" }],
  orgDeptId: [{ required: true, message: "请选择机构/部门", trigger: "change" }],
  orgRoleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
  userId: [{ required: true, message: "通过手机或已有账号关联", trigger: "blur" }],
  groupMemberIds: [{ required: true, message: "请选择关联医生", trigger: "blur" }]
});
const selectIds = ref([]);
const deptOptions = ref();
const roleOptions = ref();
const oldroleOptions = ref();
const doctorOptions = ref();
const userOptions = ref();
const optionKeys = ref([]);
function getExpandedKeys(tree) {
  const keys = [];
  function traverse(nodes) {
    if (!nodes) return;
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        keys.push(node.value);
        traverse(node.children);
      }
    });
  }
  traverse(tree);
  return keys;
}
function handleQuery() {
  loading.value = true;
  queryParams.deptId = props.orgId;
  OrgMemberAPI.getList(queryParams).then((data) => {
    pageData.value = data.list;
    total.value = data.total;
  }).finally(() => {
    loading.value = false;
  });
}
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageIndex = 1;
  queryParams.deptId = void 0;
  queryParams.createTime = void 0;
  handleQuery();
}
function handleSelectionChange(selection) {
  selectIds.value = selection.map((item) => item.id);
}
async function handleClassifyChange(organizationId, classid) {
  if (organizationId) {
    await OrgClassAPI.getOptions(classid, organizationId).then(async (data) => {
      let detas = [];
      data.map((node) => {
        detas.push({
          value: node.value,
          label: node.label,
          disabled: node.label == "医生" && userStore.userInfo.members.orgRoleCodes.indexOf("10031") > -1 ? true : false,
          children: []
        });
      });
      roleOptions.value = cloneDeep(detas);
      oldroleOptions.value = cloneDeep(detas);
      await handleOptChange(organizationId);
    });
  }
}
function handleFilter(value, data) {
  if (!value) {
    return true;
  }
  return data.label;
}
function handleJueSeChange() {
  let jue = formData.orgRoleIds;
  const result = roleOptions.value?.filter((item) => jue.includes(item.value));
  const result2 = result?.filter((a) => a.label == "医生");
  const result3 = result?.filter((a) => a.label == "护士" || a.label == "助手");
  docdisabled.value = true;
  dicabled.value = false;
  glys.value = formData.groupMemberIds;
  formData.groupMemberIds = [];
  if (result2?.length == 0 && result3?.length > 0) {
    formData.groupMemberIds = glys.value;
    dicabled.value = true;
  }
  if (userStore.userInfo.members.orgRoleCodes.indexOf("10032") == -1 && userStore.userInfo.members.orgRoleCodes.indexOf("10033") == -1) {
    if (userStore.userInfo.members.orgRoleCodes.indexOf("10031") > -1) {
      if (formData.groupMemberIds?.length == 0) {
        const inof = doctorOptions.value?.filter((a) => {
          return a.value == userStore.userInfo.members?.id;
        });
        formData.groupMemberIds.push(inof[0].value);
      }
      docdisabled.value = true;
    } else {
      docdisabled.value = false;
    }
  } else {
    ishszs.value = true;
    docdisabled.value = false;
  }
}
async function handleOptChange(organizationId) {
  if (organizationId) {
    await OrgMemberAPI.getMems(organizationId, "10031").then((data) => {
      doctorOptions.value = data.map((item) => ({
        value: item.id,
        label: item.name,
        disabled: false
      }));
    });
  } else {
    doctorOptions.value = [];
  }
}
function handleCellphoneChange(e) {
  let val = e.target.value;
  if (val && formData.id == 0) {
    loadUserOptionsChange(val, 0);
  }
}
function handleMobileChange(e) {
  let val = e.target.value;
  if (val && formData.id == 0) {
    loadUserOptionsChange(val, 1);
  }
}
function loadUserOptions(val) {
  if (val && val?.length > 0) {
    UserAPI.getOptions({ keywords: val }).then((data) => {
      userOptions.value = data;
      if (data.length > 0) {
        formData.userId = data[0].value;
        accountMobile.value = true;
        formData.createAccount = false;
      } else {
        if (formData.userId == 0) {
          accountMobile.value = false;
        } else {
          accountMobile.value = true;
          if (userId.value > 0) {
            loadUserOptionsById(userId.value);
          }
        }
      }
    });
  }
}
function loadUserOptionsChange(val, opt) {
  if (val && val?.length > 0) {
    UserAPI.getOptions({ keywords: val }).then((data) => {
      userOptions.value = data;
      if (data.length > 0) {
        formData.userId = data[0].value;
        accountMobile.value = true;
        formData.createAccount = false;
      } else {
        formData.userId = void 0;
        if (opt == 0) {
          formData.account = formData.cellphone;
          accountMobile.value = false;
        }
        if (formData.id == 0) {
          formData.createAccount = true;
        } else {
          formData.createAccount = false;
        }
      }
    });
  }
}
function loadUserOptionsById(val) {
  if (val && val > 0) {
    UserAPI.getOptions({ id: val }).then((data) => {
      nextTick(() => {
        userOptions.value = data;
      });
    });
  }
}
function handleCreateAccountChange(val) {
  if (val) {
    if (userOptions.value.length > 0) {
      formData.userId = userOptions.value[0].value;
      accountMobile.value = true;
    } else {
      formData.userId = void 0;
      accountMobile.value = false;
    }
    formData.account = void 0;
    formData.mobile = void 0;
  }
}
async function handleOpenDialog(id) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改机构成员";
    OrgMemberAPI.getFormData(id).then(async (data) => {
      await handleClassifyChange(data.orgId, 0);
      if (data.userId > 0) {
        loadUserOptionsById(data.userId);
        userId.value = data.userId;
        accountMobile.value = true;
      } else {
        loadUserOptions(data.cellphone);
      }
      deptOptions.value = await DeptAPI.getOptions({ orgIds: [data.orgId] });
      optionKeys.value = getExpandedKeys(deptOptions.value);
      nextTick(() => {
        Object.assign(formData, { ...data });
        handleJueSeChange();
        formData.createAccount = false;
      });
    });
  } else {
    deptOptions.value = await DeptAPI.getOptions({ orgIds: [props.orgId] });
    optionKeys.value = getExpandedKeys(deptOptions.value);
    handleClassifyChange(props.orgId, 0);
    formData.orgDeptId = props.orgId;
    formData.id = 0;
    formData.userId = void 0;
    formData.createAccount = false;
    formData.orgRoleIds = [];
    userOptions.value = [];
    userId.value = 0;
    dialog.title = "新增机构成员";
  }
}
async function handleDeptOptions(keywords) {
  const params = reactive({ keywords });
  params.orgIds = props.orgId;
  deptOptions.value = await DeptAPI.getOptions(params);
}
function getAllParentKeys(tree, keyField = "id") {
  const keys = [];
  function traverse(nodes) {
    if (!nodes || !Array.isArray(nodes)) return;
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        keys.push(node[keyField]);
        traverse(node.children);
      }
    });
  }
  traverse(tree);
  return keys;
}
function handleCloseDialog() {
  dialog.visible = false;
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();
  formData.id = 0;
  formData.status = true;
  formData.groupMemberIds = [];
}
const handleSubmit = useDebounceFn(() => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      fromLoading.value = true;
      const userId2 = formData.id;
      if (userId2) {
        OrgMemberAPI.update(userId2, formData).then(() => {
          ElMessage.success("修改机构成员成功");
          handleCloseDialog();
          queryParams.pageIndex = 1;
          handleQuery();
        }).finally(() => fromLoading.value = false);
      } else {
        OrgMemberAPI.add(formData).then(() => {
          ElMessage.success("新增机构成员成功");
          handleCloseDialog();
          queryParams.pageIndex = 1;
          handleQuery();
        }).finally(() => fromLoading.value = false);
      }
    }
  });
}, 1e3);
function handleDelete(id) {
  const userIds = [id || selectIds.value].join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(
    function() {
      loading.value = true;
      OrgMemberAPI.deleteByIds(userIds).then(() => {
        ElMessage.success("删除成功");
        handleResetQuery();
      }).finally(() => loading.value = false);
    },
    function() {
      ElMessage.info("已取消删除");
    }
  );
}
watch(
  () => formData.mobile,
  (newVal, oldVal) => {
    formData.account = newVal;
  },
  {
    immediate: false,
    // 如果设为 true，watch 创建时会立即执行一次
    flush: "post"
    // 确保在 DOM 更新后执行
  }
);
watch(
  () => formData.orgRoleIds,
  (newVal, oldVal) => {
    if (newVal?.length == 0) {
      roleOptions.value = oldroleOptions.value != void 0 ? cloneDeep(oldroleOptions.value) : [];
      return;
    }
    let data = roleOptions.value;
    if (data != void 0 && data.length > 0) {
      const result = roleOptions.value?.filter((item) => newVal.includes(item.value));
      const res = result?.filter(
        (a) => a.label == "医生" || a.label == "护士" || a.label == "助手"
      );
      if (res?.length > 0) {
        roleOptions.value?.forEach((item) => {
          if (!newVal.includes(item.value) && (item.label == "医生" || item.label == "护士" || item.label == "助手")) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
      } else {
        roleOptions.value?.forEach((item) => {
          if (item.label == "医生" || item.label == "护士" || item.label == "助手") {
            item.disabled = item.label == "医生" && userStore.userInfo.members.orgRoleCodes.indexOf("10031") > -1 ? true : false;
          }
        });
      }
    }
  },
  {
    immediate: false,
    // 如果设为 true，watch 创建时会立即执行一次
    flush: "post"
    // 确保在 DOM 更新后执行
  }
);
onMounted(async () => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
.ecmbody-contentcygl {
  display: flex;
  width: 100%;
  background-color: #ffffff;
  flex-flow: column;
  .ecmbody-contentcygl-right-top {
    display: flex;
    font-family: Noto Sans SC;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: 0%;
    color: #333f48;
    height: auto;
  }
  .ecmbody-contentcygl-right-top2 {
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
    .app-containers {
      display: flex;
      width: 100%;
      padding: 0px;
      flex-flow: column;
      margin-top: 15px;
      .search-bar {
        display: flex;
        padding: 15px 0 0 10px;
        margin-bottom: 10px;
        background-color: var(--el-bg-color-overlay);
        border: 1px solid var(--el-border-color-light);
        border-radius: 4px;
        box-shadow: var(--el-box-shadow-light);
      }
      .search-btn {
        display: flex;
        height: auto;
      }
      :deep(.el-card) {
        --el-card-border-color: var(--el-border-color-light);
        --el-card-border-radius: 4px;
        --el-card-padding: 20px;
        --el-card-bg-color: var(--el-fill-color-blank);
        background-color: var(--el-card-bg-color);
        border: 1px solid var(--el-card-border-color);
        border-radius: var(--el-card-border-radius);
        color: var(--el-text-color-primary);
        overflow: hidden;
        transition: var(--el-transition-duration);
        margin-top: 12px;
      }
      :deep(.el-card__body) {
        padding: 10px;
      }
      :deep(.pagination) {
        display: flex;
        justify-content: center;
        padding-top: 12px;
      }
      :deep(.el-form--inline .el-form-item) {
        display: inline-flex;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
  }
  :deep(.el-table .cell) {
    font-size: 17px;
  }
  :deep(.el-popper.is-dark) {
    font-size: 18px;
  }
  :deep(.search-bar .el-form-item__label) {
    justify-content: flex-start;
    text-align: left;
    font-size: 18px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #757575;
  }
  :deep(.el-form-item__label) {
    align-items: flex-start;
    box-sizing: border-box;
    color: #333f48;
    display: inline-flex;
    flex: 0 0 auto;
    font-size: 17px;
    height: 32px;
    line-height: 32px;
    padding: 0 12px 0 0;
  }
  :deep(.el-button) {
    border-radius: var(--el-border-radius-base);
    font-size: 16px;
  }
  :deep(.el-input__inner) {
    font-size: 16px;
    color: #000;
  }
  :deep(.el-select__tags-text) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    color: #000;
  }
  :deep(.el-table thead) {
    color: #707174;
  }
  :deep(.el-textarea__inner) {
    font-size: 15px;
  }
  :deep(.el-form-item__error) {
    color: var(--el-color-danger);
    font-size: 16px;
    left: 0;
    line-height: 1;
    padding-top: 2px;
    position: absolute;
    top: 100%;
  }
  :deep(.el-select__placeholder.is-transparent) {
    color: #a8abb2;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: -1;
    font-size: 17px;
  }
  :deep(.el-select__placeholder) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: -1;
    font-size: 16px;
    color: #000;
  }
  :deep(.el-textarea__inner) {
    color: #000;
    font-size: 16px;
  }
  :deep(.el-form-item--default) {
    --el-form-label-font-size: var(--font-size);
    margin-bottom: 30px;
  }
  :deep(.el-select__tags-text) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
  }
  :deep(.el-date-editor .el-range-input) {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    border: none;
    color: var(--el-text-color-regular);
    display: inline-block;
    font-size: var(--el-font-size-base);
    height: 30px;
    line-height: 30px;
    margin: 0;
    outline: none;
    padding: 0;
    text-align: center;
    width: 39%;
    font-size: 16px;
  }
  :deep(.el-button--small [class*="el-icon"] + span) {
    font-size: 16px;
    margin-left: 4px;
  }
}
</style>
