<template>
  <div class="ecmbody-contentcy">
    <div class="ecmbody-content-right-top">成员关系管理</div>
    <el-divider />
    <div class="ecmbody-content-right-top2">
      <span>设置您的账号业务员关系管理</span>
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
        <div class="search-btn">
          <el-button
            v-hasPerm="['orgrelation-create']"
            type="success"
            icon="plus"
            @click="handleOpenDialog()"
          >
            新增
          </el-button>
          <el-button
            v-hasPerm="['orgrelation-delete']"
            type="danger"
            :disabled="selectIds.length === 0"
            icon="delete"
            @click="handleDelete()"
          >
            删除
          </el-button>
        </div>
        <!-- 新增或删除等集合 -->
        <el-card shadow="never">
          <div class="mb-[0px]"></div>
          <el-table
            v-loading="loading"
            :data="pageData"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="30" align="center" />
            <el-table-column prop="factoryOrgName" label="加工厂" width="*" show-overflow-tooltip />
            <el-table-column prop="optOrgName" label="运营公司" width="*" show-overflow-tooltip />
            <el-table-column
              prop="optOrgMemberName"
              label="业务员"
              width="90"
              show-overflow-tooltip
            />
            <el-table-column
              prop="pitemFactoryName"
              label="默认项目工厂"
              width="130"
              show-overflow-tooltip
            />
            <el-table-column prop="code" label="邀请码" width="110" />
            <el-table-column prop="createTime" label="创建时间" width="*" show-overflow-tooltip />
            <el-table-column
              v-hasPerm="['orgrelation-delete']"
              label="操作"
              width="130"
              fixed="right"
              align="left"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="['orgrelation-delete']"
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
    <!-- 机构关联成员 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      draggable
      :align-center="true"
      width="500"
      :before-close="handleCloseDialog"
      :close-on-click-modal="false"
    >
      <el-form
        ref="userFormRef"
        :rules="rules"
        :model="formData"
        class="my-form-item"
        label-width="120px"
      >
        <el-form-item label="加工厂" prop="factoryOrgId">
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
            filterable
            check-strictly
            :render-after-expand="false"
            @change="selectedOperCompany"
          />
        </el-form-item>
        <el-form-item label="业务员" prop="optOrgMemberId">
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
          <el-button @click="handleCloseDialog">取 消</el-button>
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
  name: "userrelation",
  inheritAttrs: false
});
const userStore = useUserStore();
const relId = ref(userStore.userInfo.members.orgId);
const cate = ref(1002);
cate.value = userStore.userInfo.members.orgClassifyCode;
const deptParams = reactive({});
const deptOptionsF = ref();
const deptOptionsO = ref();
const manOptions = ref();
const queryFormRef = ref();
const pageData = ref();
const total = ref(0);
const selectIds = ref([]);
const loading = ref(false);
const rules = reactive({
  factoryOrgId: [{ required: true, message: "请选择加工厂", trigger: "change" }],
  optOrgId: [{ required: true, message: "请选择运营公司", trigger: "change" }],
  optOrgMemberId: [{ required: true, message: "请选择业务员", trigger: "change" }]
});
const dialog = reactive({
  visible: false,
  title: "新增关联机构"
});
const userFormRef = ref(null);
const formData = reactive({
  customerOrgId: 0
});
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 8,
  keywords: "",
  relSrc: cate.value,
  relId: relId.value,
  type: OrgEnum.SalespersonType
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
  }).finally(() => {
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
async function handleOpenDialog(id) {
  loading.value = true;
  dialog.title = "新增关联机构";
  deptParams.status = true;
  deptParams.keywords = id;
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
      getMans(relId.value);
      break;
    default:
      break;
  }
  deptParams.orgClassifyCodes = codes;
  deptParams.split = true;
  deptParams.relationType = OrgEnum.OperatorType;
  deptParams.orgId = userStore.userInfo.members.orgId;
  let user = userStore.userInfo.members;
  DeptAPI.getOptions(deptParams).then((data) => {
    loading.value = false;
    if (cate.value != "1004" && data.find((item) => item.label == "1004") != null)
      deptOptionsF.value = data.find((item) => item.label == "1004").children;
    if (cate.value != "1003" && data.find((item) => item.label == "1002") != null) {
      let info = data.find((item) => item.label == "1002").children;
      if (user.orgRoleCodes.includes("10022")) {
        let yygs = info?.filter((a) => a.value == user.orgId);
        formData.optOrgId = user.orgId;
        formData.optOrgName = user.orgName;
        deptOptionsO.value = [...yygs];
        getMans(formData.optOrgId);
      } else {
        info?.forEach((a) => {
          a.children = [];
        });
        deptOptionsO.value = info;
      }
    }
    dialog.visible = true;
  }).finally(() => {
    loading.value = false;
  });
}
function selectedFactory(value) {
  if (deptOptionsF.value.find((item) => item.value == value) != null)
    formData.factoryOrgName = deptOptionsF.value.find((item) => item.value == value).label;
}
function selectedPitemFactory(value) {
  if (deptOptionsF.value.find((item) => item.value == value) != null)
    formData.pitemFactoryName = deptOptionsF.value.find((item) => item.value == value).label;
}
function selectedOperCompany(value) {
  if (deptOptionsO.value.find((item) => item.value == value) == null) return;
  formData.optOrgName = deptOptionsO.value.find((item) => item.value == value).label;
  getMans(value);
}
function getMans(value) {
  formData.optOrgMemberName = "";
  loading.value = true;
  OrgMemberAPI.getMems(value, "10022").then((data) => {
    manOptions.value = data;
    let user = data.filter((item) => item.id == userStore.userInfo.members.id);
    if (user.length > 0) {
      formData.optOrgMemberName = user[0].name;
      formData.optOrgMemberId = user[0].id;
    }
    loading.value = false;
  }).finally(() => {
    loading.value = false;
  });
}
function selectedMan(value) {
  formData.optOrgMemberName = manOptions.value.find((item) => item.id == value).name;
}
function handleCloseDialog() {
  dialog.visible = false;
  formData.customerOrgId = 0;
  formData.customerOrgName = "";
  formData.factoryOrgId = null;
  formData.factoryOrgName = "";
  formData.optOrgMemberId = null;
  formData.optOrgMemberName = "";
  formData.optOrgId = null;
  formData.optOrgName = "";
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();
}
const handleSubmit = useDebounceFn(() => {
  userFormRef.value.validate((valid) => {
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
          handleCloseDialog();
          handleResetQuery();
          loadingInstance.close();
        }).finally(() => {
          loading.value = false;
          loadingInstance.close();
        });
      } else {
        OrgRelationAPI.add(formData).then(() => {
          ElNotification({
            title: "Success",
            message: "新增关联机构成功!",
            type: "success",
            duration: 3e3
          });
          handleCloseDialog();
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
onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
.ecmbody-contentcy {
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
          font-size: 16px;
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
        font-size: 15px;
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
      font-size: 16px;
      vertical-align: middle;
      color: #757575;
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
      font-size: 16px;
      font-family: Noto Sans SC;
      font-weight: 400;
      color: #000;
    }
    :deep(.el-form-item__label) {
      justify-content: flex-start;
      text-align: left;
      font-size: 16px;
      font-family: Noto Sans SC;
      font-weight: 400;
      color: #333f48;
    }
  }
  :deep(.el-table .cell) {
    font-size: 17px;
  }
  :deep(.search-bar .el-form-item__label) {
    justify-content: flex-start;
    text-align: left;
    font-size: 17px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #757575;
  }
  :deep(.my-form-item .el-form-item__label) {
    align-items: flex-start;
    box-sizing: border-box;
    color: #333333;
    display: inline-flex;
    flex: 0 0 auto;
    font-size: 17px;
    height: 32px;
    line-height: 32px;
    padding: 0 12px 0 0;
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
    color: #9a9fa9;
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
.el-select-dropdown__item {
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  cursor: pointer;
  font-size: 18px;
  height: 34px;
  line-height: 34px;
  overflow: hidden;
  padding: 0 32px 0 20px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-select-dropdown__item.is-selected {
  font-weight: 500;
  color: #4080ff;
}
</style>
