<template>
  <div class="ecmbody-content-ywgx">
    <div class="ecmbody-content-right-top">业务关系管理</div>
    <el-divider />
    <div class="ecmbody-content-right-top2">
      <span>设置您的账号业务关系管理</span>
      <div class="apps-container">
        <div class="search-bar">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="机构名称"
                style="width: 120px"
                @keyup.enter="handleQuery"
              />
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
              <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">
                搜索
              </el-button>
              <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="cate == 1003 && userCodes.includes('10030')" class="search-btn">
          <el-button type="success" icon="plus" @click="handleOpenDialog()">绑定业务员</el-button>
        </div>
        <!-- 新增或删除等集合 -->
        <el-card shadow="never">
          <div class="mb-[10px]"></div>
          <el-table
            v-loading="loading"
            :data="pageData"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              prop="customerOrgName"
              label="医疗机构"
              width="*"
              show-overflow-tooltip
            />
            <el-table-column prop="factoryOrgName" label="加工厂" width="*" show-overflow-tooltip />
            <el-table-column prop="optOrgName" label="运营公司" width="*" show-overflow-tooltip />
            <el-table-column
              prop="optOrgMemberName"
              label="业务员"
              width="99"
              show-overflow-tooltip
            />
            <el-table-column
              prop="pitemFactoryName"
              label="默认项目工厂"
              width="135"
              show-overflow-tooltip
            />
            <el-table-column prop="createTime" label="创建时间" width="*" show-overflow-tooltip />
            <el-table-column label="操作" width="158" fixed="right" align="left">
              <template #default="scope">
                <el-button
                  v-hasPerm="['orgrelation-update']"
                  type="primary"
                  link
                  size="small"
                  icon="edit"
                  @click.stop="handleOpen(scope.row.id)"
                >
                  编辑
                </el-button>
                <el-button
                  v-hasPerm="['relation-delete']"
                  type="danger"
                  link
                  size="small"
                  icon="delete"
                  @click.stop="handleDelete(scope.row.id)"
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
      </div>
    </div>
    <el-dialog
      v-model="dialogs.visible"
      :title="dialogs.title"
      draggable
      :align-center="true"
      width="500"
      :before-close="
        (a) => {
          handleCloseDialog(1);
        }
      "
      :close-on-click-modal="false"
    >
      <el-form ref="userFormRefs" :model="formData" label-width="120px">
        <el-form-item label="医疗机构">
          <el-tree-select
            v-model="formData.customerOrgId"
            clearable
            filterable
            reserve-keyword
            placeholder="请输入医疗机构名称"
            :data="deptOptionsC"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="加工厂">
          <el-tree-select
            v-model="formData.factoryOrgId"
            clearable
            filterable
            reserve-keyword
            placeholder="请输入加工厂名称"
            :data="deptOptionsF"
            @change="selectedFactory"
          />
        </el-form-item>
        <el-form-item label="运营公司" prop="optOrgId">
          <el-tree-select
            v-model="formData.optOrgId"
            placeholder="请选择运营公司"
            :data="deptOptionsO"
            :disabled="true"
            filterable
            check-strictly
            :render-after-expand="false"
            @change="selectedOperCompany"
          />
        </el-form-item>
        <el-form-item label="业务员">
          <el-select v-model="formData.optOrgMemberId" clearable @change="selectedMan">
            <el-option
              v-for="option in manOptions"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="默认项目工厂" prop="pitemFactoryId">
          <el-tree-select
            v-model="formData.pitemFactoryId"
            clearable
            filterable
            reserve-keyword
            placeholder="不选默认为加工厂"
            :data="deptOptionsF"
            @change="selectedPitemFactory"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog(1)">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmits">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 机构关联成员 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      draggable
      :align-center="true"
      width="450"
      :before-close="
        (a) => {
          handleCloseDialog(0);
        }
      "
      :close-on-click-modal="false"
    >
      <el-form ref="userFormRef" class="my-form-item" :model="formData" label-width="100px">
        <el-form-item label="医疗机构">
          <el-tree-select
            v-model="formData.customerOrgId"
            clearable
            filterable
            reserve-keyword
            placeholder="请输入医疗机构名称"
            :data="deptOptionsC"
          />
        </el-form-item>
        <el-form-item label="业务员">
          <el-input v-model="formData.code" placeholder="请输入邀请码" type="text"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog(0)">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>import DeptAPI from "@/api/system/dept";
import OrgMemberAPI from "@/api/system/orgMember";
import { useUserStore } from "@/store";
import OrgRelationAPI from "@/api/system/orgRelation";
import { OrgEnum } from "@/enums/OrgEnum";
defineOptions({
  name: "userrelationywgx",
  inheritAttrs: false
});
const userStore = useUserStore();
const relId = ref(userStore.userInfo.members.orgId);
const cate = ref(1002);
cate.value = userStore.userInfo.members.orgClassifyCode;
const deptParams = reactive({});
const userCodes = userStore.userInfo.members.orgRoleCodes;
const deptOptionsF = ref();
const deptOptionsO = ref();
const manOptions = ref();
const deptOptionsC = ref();
const queryFormRef = ref();
const pageData = ref();
const total = ref(0);
const selectIds = ref([]);
const loading = ref(false);
const dialog = reactive({
  visible: false,
  title: "绑定业务员"
});
const dialogs = reactive({
  visible: false,
  title: "新增关联机构"
});
const userFormRef = ref(null);
const userFormRefs = ref(null);
const formData = reactive({});
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 8,
  keywords: "",
  relSrc: cate.value,
  relId: relId.value,
  type: OrgEnum.OrganizationType,
  code: 0
});
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageIndex = 1;
  queryParams.createTime = void 0;
  handleQuery();
}
function handleQuery() {
  loading.value = true;
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  OrgRelationAPI.getPage(queryParams).then((data) => {
    pageData.value = data.list;
    total.value = data.total;
    loading.value = false;
    loadingInstance.close();
  });
}
function handleSelectionChange(selection) {
  selectIds.value = selection.map((item) => item.id);
}
function handleDelete(id) {
  const ids = [id || selectIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(
    () => {
      loading.value = true;
      const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
      OrgRelationAPI.deleteByIds(ids).then(() => {
        ElNotification({
          title: "Success",
          message: "删除成功!",
          type: "success",
          duration: 3e3
        });
        loadingInstance.close();
        handleResetQuery();
      }).finally(() => loading.value = false);
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}
async function handleOpen(id) {
  if (id != void 0) {
    dialogs.title = "修改业务关系";
    deptParams.status = true;
    var codes = "";
    switch (cate.value) {
      case "1003":
        codes = "1003";
        break;
      case "1004":
        codes = "1004";
        break;
      case "1002":
        codes = "1002,1003";
        getFactory();
        getMans(relId.value);
        break;
      default:
        break;
    }
    deptParams.orgClassifyCodes = codes;
    deptParams.split = true;
    deptParams.relationType = OrgEnum.OrganizationType;
    OrgRelationAPI.getFormData(id).then((datas) => {
      deptParams.orgId = datas.customerOrgId;
      DeptAPI.getOptions(deptParams).then((data) => {
        if (cate.value != "1003" && data.find((item) => item.label == "1002") != null) {
          let info = data.find((item) => item.label == "1002").children;
          info?.forEach((a) => {
            a.children = [];
          });
          deptOptionsO.value = info;
        }
        if (cate.value == "1002" && data.find((item) => item.label == "1003") != null) {
          let info = data.find((item) => item.label == "1003").children;
          info?.forEach((a) => {
            a.children = [];
          });
          deptOptionsC.value = info;
        }
        formData.optOrgId = datas.optOrgId;
        formData.optOrgName = datas.optOrgName;
        formData.factoryOrgId = datas.factoryOrgId;
        formData.factoryOrgName = datas.factoryOrgName;
        formData.optOrgMemberId = datas.optOrgMemberId;
        formData.optOrgMemberName = datas.optOrgMemberName;
        formData.customerOrgId = datas.customerOrgId;
        formData.customerOrgName = datas.customerOrgName;
        formData.pitemFactoryId = datas.pitemFactoryId;
        formData.pitemFactoryName = datas.pitemFactoryName;
        formData.id = id;
        dialogs.visible = true;
      });
    });
  }
}
function selectedPitemFactory(value) {
  if (deptOptionsF.value.find((item) => item.value == value) != null)
    formData.pitemFactoryName = deptOptionsF.value.find((item) => item.value == value).label;
}
function selectedFactory(value) {
  if (deptOptionsF.value.find((item) => item.value == value) != null)
    formData.factoryOrgName = deptOptionsF.value.find((item) => item.value == value).label;
}
function selectedOperCompany(value) {
  if (deptOptionsO.value.find((item) => item.value == value) == null) return;
  formData.optOrgName = deptOptionsO.value.find((item) => item.value == value).label;
  getMans(value);
}
function getFactory() {
  var params = {
    status: true,
    orgClassifyCodes: 1004,
    split: true,
    relationType: OrgEnum.OperatorType,
    orgId: userStore.userInfo.members.orgId
  };
  DeptAPI.getOptions(params).then((data) => {
    if (data.find((item) => item.label == "1004") != null) {
      let info = data.find((item) => item.label == "1004").children;
      info?.forEach((a) => {
        a.children = [];
      });
      deptOptionsF.value = info;
    }
  });
}
function getMans(value) {
  formData.optOrgMemberName = "";
  loading.value = true;
  OrgMemberAPI.getMems(value, "10022").then((data) => {
    if (userStore.userInfo.members.orgRoleCodes.includes("10020") || userStore.userInfo.members.orgRoleCodes.includes("10021")) {
      manOptions.value = data;
      loading.value = false;
    } else {
      let user = data.filter((item) => item.id == userStore.userInfo.members.id);
      if (user.length > 0) {
        manOptions.value = [...user];
        formData.optOrgMemberName = user[0].name;
        formData.optOrgMemberId = user[0].id;
      } else {
        manOptions.value = data;
      }
      loading.value = false;
    }
  });
}
function selectedMan(value) {
  formData.optOrgMemberName = manOptions.value.find((item) => item.id == value).name;
}
async function handleOpenDialog(query) {
  dialog.visible = true;
  loading.value = true;
  deptParams.status = true;
  deptParams.keywords = query;
  var codes = "";
  switch (cate.value) {
    case "1003":
      codes = "1003";
      break;
    case "1004":
      codes = "1004";
      break;
    case "1002":
      codes = "1002,1004";
      break;
    default:
      break;
  }
  deptParams.orgClassifyCodes = codes;
  deptParams.split = true;
  deptParams.type = OrgEnum.OrganizationType;
  DeptAPI.getOptions(deptParams).then((data) => {
    loading.value = false;
    if (cate.value == 1003 && data.find((item) => item.label == "1003") != null) {
      let info = data.find((item) => item.label == "1003").children;
      let user = userStore.userInfo.members;
      if (user.orgRoleCodes.includes("10030")) {
        let yygs = info?.filter((a) => a.label == user.orgName && a.value == user.orgId);
        yygs[0].children = [];
        formData.customerOrgId = user.orgId;
        formData.customerOrgName = user.orgName;
        deptOptionsC.value = [...yygs];
      } else {
        deptOptionsC.value = [];
      }
    }
  });
}
function handleCloseDialog(v) {
  dialog.visible = false;
  dialogs.visible = false;
  formData.customerOrgId = null;
  formData.customerOrgName = "";
  formData.code = "";
  if (v == 1 && userFormRefs.value != null) {
    formData.factoryOrgId = null;
    formData.factoryOrgName = "";
    formData.optOrgMemberId = null;
    formData.optOrgMemberName = "";
    formData.optOrgId = null;
    formData.optOrgName = "";
    userFormRefs.value.resetFields();
    userFormRefs.value.clearValidate();
  } else if (v == 1 && userFormRef.value != null) {
    userFormRef.value.resetFields();
    userFormRef.value.clearValidate();
  }
}
const handleSubmits = useDebounceFn(() => {
  userFormRefs.value.validate((valid) => {
    if (valid) {
      var oName = "";
      switch (cate.value) {
        case "1004":
          formData.factoryOrgId = relId.value;
          formData.factoryOrgName = oName;
          break;
        case "1003":
          formData.customerOrgId = relId.value;
          formData.customerOrgName = oName;
          break;
      }
      loading.value = true;
      formData.type = OrgEnum.SalespersonType;
      const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
      if (formData.id != void 0 && formData.id > 0) {
        OrgRelationAPI.update(formData).then(() => {
          ElNotification({
            title: "Success",
            message: "修改关联机构成功!",
            type: "success",
            duration: 3e3
          });
          handleCloseDialog(1);
          handleResetQuery();
          loadingInstance.close();
        }).finally(() => {
          loading.value = false;
          loadingInstance.close();
        });
      }
    }
  });
}, 1e3);
const handleSubmit = useDebounceFn(() => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.type = OrgEnum.OrganizationType;
      const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
      OrgRelationAPI.add(formData).then(() => {
        ElNotification({
          title: "Success",
          message: "新增关联机构成功!",
          type: "success",
          duration: 3e3
        });
        handleCloseDialog(0);
        handleResetQuery();
        loadingInstance.close();
      }).finally(() => {
        formData.code = "";
        loading.value = false;
        loadingInstance.close();
      });
    }
  });
}, 1e3);
onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
.ecmbody-content-ywgx {
  display: flex;
  width: 100%;
  background-color: #ffffff;
  flex-flow: column;
  .ecmbody-content-right-top {
    display: flex;
    font-family: Noto Sans SC;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: 0%;
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
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .ecmbody-content-right-top2 {
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
    .apps-container {
      display: flex;
      width: 100%;
      margin-top: 15px;
      flex-flow: column;
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
    }
    :deep(.el-form-item__content) {
      line-height: 32px;
      font-size: 18px;
      font-family: Noto Sans SC;
      font-weight: 400;
      color: #000;
    }
  }
  :deep(.el-table .cell) {
    font-size: 17px;
  }
  :deep(.el-popper.is-dark) {
    font-size: 18px;
  }
  :deep(.el-form-item__label) {
    justify-content: flex-start;
    text-align: left;
    font-size: 17px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #333f48;
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
  :deep(.my-form-item .el-select__placeholder) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: -1;
    font-size: 16px;
    color: #000;
  }
  :deep(.el-button) {
    border-radius: var(--el-border-radius-base);
    font-size: 16px;
  }
  :deep(.el-input__inner) {
    font-size: 16px;
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
  :deep(.el-select__placeholder) {
    color: var(--el-input-text-color, var(--el-text-color-regular));
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: -1;
    font-size: 16px;
    color: #000;
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
