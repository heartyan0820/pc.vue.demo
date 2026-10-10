<template>
  <div class="ecmbody-content-yljg">
    <div class="ecmbody-content-right-top">医疗机构管理</div>
    <el-divider />
    <div class="ecmbody-content-right-top2">
      <span>设置医疗机构</span>
      <div class="apps-container">
        <div class="search-bar">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="名称/编码"
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
            <el-form-item label="加工厂" prop="factoryId">
              <el-select
                v-model="queryParams.factoryId"
                placeholder="请选择加工厂"
                clearable
                style="width: 130px"
                filterable
              >
                <el-option
                  v-for="option in factoryOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">
                搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="search-btn">
          <el-button
            v-hasPerm="['orgcustomer-create']"
            type="success"
            icon="plus"
            @click="handleOpenDialog()"
          >
            新增
          </el-button>
          <el-button
            v-hasPerm="['cuorg-delete']"
            type="danger"
            :disabled="selectIds.length === 0"
            icon="delete"
            @click="handleDelete()"
          >
            删除
          </el-button>
        </div>
        <el-card shadow="never">
          <el-table
            v-loading="loading"
            :data="pageData"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="机构名称" width="300" />
            <!-- <el-table-column prop="shortName" label="机构简称" width="*" show-overflow-tooltip /> -->
            <el-table-column prop="code" label="机构编码" width="138" />
            <el-table-column
              prop="factoryName"
              label="所属机构"
              width="135"
              show-overflow-tooltip
            />
            <el-table-column prop="createTime" label="创建时间" width="132" show-overflow-tooltip />
            <el-table-column label="操作" width="158" fixed="right" align="left">
              <template #default="scope">
                <el-button
                  v-hasPerm="['orgcustomer-update']"
                  type="primary"
                  link
                  size="small"
                  icon="edit"
                  @click.stop="handleOpenDialog(scope.row.id)"
                >
                  编辑
                </el-button>
                <el-button
                  v-hasPerm="['orgcustomer-update']"
                  type="primary"
                  link
                  size="small"
                  icon="edit"
                  @click.stop="handleOpenUserDialog(scope.row)"
                >
                  成员
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
      v-model="dialog.visible"
      :title="dialog.title"
      class="dialog"
      draggable
      width="650px"
      :close-on-click-modal="false"
      @closed="handleCloseDialog"
    >
      <el-form
        ref="deptFormRef"
        :model="formData"
        :inline="true"
        :rules="rules"
        label-width="115px"
      >
        <el-row style="padding-top: 12px">
          <el-col :span="12">
            <el-form-item label="机构名称：" prop="name">
              <el-input v-model="formData.name" placeholder="请输入医疗机构名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构编码：" prop="code">
              <el-input v-model="formData.code" placeholder="请输入医疗机构编码" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.isAdd">
          <el-col :span="12">
            <el-form-item label="加工厂：" prop="factoryOrgId">
              <el-tree-select
                v-model="formData.factoryOrgId"
                clearable
                filterable
                reserve-keyword
                placeholder="请选择加工厂名称"
                :data="deptOptionsF"
                @change="selectedFactory"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运营公司：" prop="optOrgId">
              <el-tree-select
                v-model="formData.optOrgId"
                clearable
                filterable
                reserve-keyword
                placeholder="请选择运营公司名称"
                :data="deptOptionsO"
                @change="selectedOperCompany"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.isAdd">
          <el-col :span="12">
            <el-form-item label="业务员：" prop="optOrgMemberId">
              <el-select
                v-model="formData.optOrgMemberId"
                placeholder="请选择业务员"
                clearable
                filterable
                @change="selectedMan"
              >
                <el-option
                  v-for="option in manOptions"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构：" prop="factoryId">
              <el-select
                v-model="formData.factoryId"
                placeholder="请选择所属机构"
                clearable
                filterable
                :disabled="true"
              >
                <el-option
                  v-for="option in factoryOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height: 35px">
          <div class="divs">
            <el-divider content-position="right" @click="onzksq">
              <span style="cursor: pointer; font-size: 16px">{{ isShow ? "收起" : "展开" }}</span>
            </el-divider>
          </div>
        </el-row>
        <el-row v-show="isShow">
          <el-row>
            <el-col :span="12">
              <el-form-item label="机构简称：" prop="shortName">
                <el-input v-model="formData.shortName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="信用号：" prop="creditNumber">
                <el-input v-model="formData.creditNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人代表：" prop="legalPerson">
                <el-input v-model="formData.legalPerson" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册地址：" prop="registAddress">
                <el-input v-model="formData.registAddress" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="办公地址：" prop="address">
                <el-input v-model="formData.address" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="E-mail：" prop="email">
                <el-input v-model="formData.email" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营业执照：" prop="businesspUploads">
                <div style="display: flex">
                  <el-upload
                    v-model="businesspPicUrls"
                    :http-request="businesspUpload"
                    :show-file-list="false"
                    class="upload-demos"
                    :limit="1"
                    :loading="loading1"
                    :on-exceed="handleExceed"
                    list-type="picture-card"
                  >
                    <img src="@/assets/images/upimg.png" width="50px" style="cursor: pointer" />
                  </el-upload>

                  <div v-for="(item, index) in businesspPicUrls" :key="index" class="upfiles">
                    <div class="upfile-txts">
                      <img :src="settings.fileurl + item.url" width="50px" height="50px" />
                    </div>
                    <span title="删除文件" @click="handleRemove(item.name, 1)">
                      <img src="@/assets/images/del.png" />
                    </span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="医疗许可证：" prop="medicalUploads">
                <div style="display: flex">
                  <el-upload
                    v-model="medicalPicUrls"
                    :http-request="medicalUpload"
                    class="upload-demos"
                    :limit="1"
                    :loading="loadings"
                    :show-file-list="false"
                    :on-exceed="handleExceed"
                    list-type="picture-card"
                  >
                    <img src="@/assets/images/upimg.png" style="cursor: pointer" />
                  </el-upload>

                  <div v-for="(item, index) in medicalPicUrls" :key="index" class="upfiles">
                    <div class="upfile-txts">
                      <img :src="settings.fileurl + item.url" width="50px" height="50px" />
                    </div>
                    <span title="删除文件" @click="handleRemove(item.name, 2)">
                      <img src="@/assets/images/del.png" />
                    </span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formData.remark" type="textarea" style="width: 438px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="联系人：" prop="contact">
              <el-input v-model="formData.contact" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系电话：" prop="contactPhone">
              <el-input
                v-model="formData.contactPhone"
                maxlength="11"
                @blur="handleContactPhoneChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="formData.id == 0">
          <el-row>
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
          </el-row>
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
          <el-row>
            <el-col :span="24">
              <el-form-item v-if="formData.createAccount" label="账号" prop="account">
                <el-input v-model="formData.account" placeholder="请输入账号" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item
                v-if="formData.createAccount && accountMobile"
                label="账号手机"
                prop="mobile"
              >
                <el-input
                  v-model="formData.mobile"
                  placeholder="请输入手机号码"
                  maxlength="11"
                  @blur="handleMobileChange"
                />
              </el-form-item>
            </el-col> -->
          </el-row>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="user_dialog.visible"
      :title="user_dialog.title"
      class="dialog"
      draggable
      width="1100px"
      :close-on-click-modal="false"
      @closed="handleCloseUserDialog"
    >
      <userManage :key="key" :orgClassifyCode="orgClassifyCode" :orgId="orgId"></userManage>
    </el-dialog>
  </div>
</template>

<script setup>
import settings from "@/settings";
import userManage from "@/components/userManage/index.vue";
defineOptions({
  name: "customer",
  inheritAttrs: false
});
import OrgCustomerAPI from "@/api/system/orgCustomer";
import OrgMemberAPI from "@/api/system/orgMember";
import UserAPI from "@/api/system/user";
import DeptAPI from "@/api/system/dept";
import { useUserStore } from "@/store";
import { OrgEnum } from "@/enums/OrgEnum";
import FileAPI from "@/api/file";
const userStore = useUserStore();
const queryParams = reactive({
  isDeleted: false,
  pageIndex: 1,
  pageSize: 10
});
const orgClassifyCode = ref(0);
const orgId = ref(0);
const factoryOptions = ref([]);
const queryFormRef = ref();
const deptFormRef = ref();
const pageData = ref();
const total = ref(0);
const key = ref(0);
const loading = ref(false);
const loading1 = ref(false);
const loadings = ref(false);
const selectIds = ref([]);
const deptOptionsF = ref();
const deptOptionsO = ref();
const manOptions = ref();
const deptParams = reactive({});
const businesspPicUrls = ref([]);
const medicalPicUrls = ref([]);
const accountMobile = ref(false);
const userOptions = ref();
const canCreateAccount = ref(false);
const isShow = ref(false);
const dialog = reactive({
  title: "",
  visible: false
});
const user_dialog = reactive({
  title: "",
  visible: false
});
const chunk = reactive({
  file: Blob,
  filePartName: "",
  originalFileName: "",
  urlParameter: "",
  partNumber: 0,
  chunks: 0,
  size: 0,
  start: 0,
  end: 0,
  total: 0
});
const cate = ref(1002);
cate.value = userStore.userInfo.members.orgClassifyCode;
const relId = ref(userStore.userInfo.members.orgId);
const formData = reactive({
  status: true,
  ordinal: 1,
  isAdd: true,
  businessLicense: "",
  medicalLicense: "",
  creditNumber: "",
  shortName: "",
  legalPerson: "",
  contact: "",
  registAddress: "",
  contactPhone: "",
  email: "",
  relation: {
    optOrgId: 0,
    optOrgName: "",
    optOrgMemberId: 0,
    optOrgMemberName: "",
    factoryOrgId: 0,
    factoryOrgName: ""
  },
  createAccount: false
});
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
  name: [{ required: true, message: "医疗机构名称不能为空", trigger: "blur" }],
  //code: [{ required: true, message: "医疗机构编码不能为空", trigger: "blur" }],
  factoryOrgId: [{ required: true, message: "加工厂不能为空", trigger: "blur" }],
  optOrgId: [{ required: true, message: "运营公司不能为空", trigger: "blur" }],
  optOrgMemberId: [{ required: true, message: "业务员不能为空", trigger: "blur" }],
  contact: [{ required: true, message: "成员姓名不能为空", trigger: "blur" }],
  userId: [{ required: true, message: "通过手机或已有账号关联", trigger: "blur" }],
  account: [
    { required: true, message: "账号名不能为空", trigger: "blur" },
    {
      pattern: /^[\w]{2,20}$/,
      message: "账号长度为2-20位，只能包含字母数字和_",
      trigger: "blur"
    },
    { validator: checkAccount, trigger: "blur" }
  ],
  contactPhone: [
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
  ]
});
function handleQuery() {
  loading.value = true;
  OrgCustomerAPI.getList(queryParams).then((data) => {
    pageData.value = data.list;
    total.value = data.total;
    loading.value = false;
  }).finally(() => {
    loading.value = false;
  });
}
function selectedFactory(value) {
  if (deptOptionsF.value.find((item) => item.value == value) != null)
    formData.relation.factoryOrgName = deptOptionsF.value.find((item) => item.value == value).label;
}
function selectedMan(value) {
  formData.relation.optOrgMemberName = manOptions.value.find((item) => item.id == value).name;
}
function selectedOperCompany(value) {
  if (deptOptionsO.value.find((item) => item.value == value) == null) return;
  formData.relation.optOrgName = deptOptionsO.value.find((item) => item.value == value).label;
  getMans(value);
}
function getMans(value) {
  if (formData.relation != null) {
    formData.relation.optOrgMemberName = "";
  }
  loading.value = true;
  OrgMemberAPI.getMems(value, "10022").then((data) => {
    manOptions.value = data;
    let user = data.filter((item) => item.id == userStore.userInfo.members.id);
    if (user.length > 0) {
      formData.optOrgMemberId = user[0].id;
      formData.relation.optOrgMemberName = user[0].name;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
function handleResetQuery() {
  queryParams.pageIndex = 1;
  queryParams.id = void 0;
  queryParams.createTime = void 0;
  queryParams.fatoryId = null;
  handleQuery();
}
function handleSelectionChange(selection) {
  selectIds.value = selection.map((item) => item.id);
}
async function handleOpenDialog(id) {
  dialog.visible = true;
  if (id) {
    formData.isAdd = false;
    formData.id = id;
    dialog.title = "修改医疗机构";
    OrgCustomerAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
      if (formData.businessLicense != "") {
        const imgarr = formData.businessLicense.split("name=");
        const imgname = imgarr.length > 1 ? imgarr[1].replace("&width=400", "") : imgarr[0];
        businesspPicUrls.value = [
          {
            fileName: imgname,
            name: imgname,
            url: formData.businessLicense
          }
        ];
      }
      if (formData.medicalLicense != "") {
        const imgarr = formData.medicalLicense.split("name=");
        const imgname = imgarr.length > 1 ? imgarr[1].replace("&width=400", "") : imgarr[0];
        medicalPicUrls.value = [
          {
            fileName: imgname,
            name: imgname,
            url: formData.medicalLicense
          }
        ];
      }
    });
  } else {
    initForm();
    formData.isAdd = true;
    userOptions.value = [];
    formData.userId = void 0;
    formData.account = "";
    formData.mobile = "";
    formData.createAccount = false;
    userOptions.value = [];
    formData.id = 0;
    dialog.title = "新增医疗机构";
  }
}
function handleOpenUserDialog(item) {
  orgClassifyCode.value = userStore.userInfo.members.orgClassifyCode;
  orgId.value = item.id;
  key.value += 1;
  user_dialog.visible = true;
}
function initForm() {
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
  deptParams.RelationType = OrgEnum.OperatorType;
  deptParams.orgId = userStore.userInfo.members.orgId;
  let user = userStore.userInfo.members;
  DeptAPI.getOptions(deptParams).then((data) => {
    loading.value = false;
    if (cate.value != "1004" && data.find((item) => item.label == "1004") != null) {
      deptOptionsF.value = data.find((item) => item.label == "1004").children;
      if (deptOptionsF.value?.length == 1) {
        formData.relation.factoryOrgName = deptOptionsF.value[0].label;
        formData.factoryOrgId = deptOptionsF.value[0].value;
      }
    }
    if (cate.value != "1004" && data.find((item) => item.label == "1002") != null) {
      let info = data.find((item) => item.label == "1002").children;
      if (user.orgRoleCodes.includes("10022")) {
        let yygs = info?.filter((a) => a.value == user.orgId);
        yygs[0].children = [];
        formData.optOrgId = user.orgId;
        formData.relation.optOrgName = user.orgName;
        deptOptionsO.value = [...yygs];
        getMans(formData.optOrgId);
      } else {
        deptOptionsO.value = info;
        if (info?.length == 1) {
          formData.optOrgId = info[0].value;
          formData.relation.optOrgName = info[0].label;
        }
      }
    }
  });
}
function businesspUpload(options) {
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
  allUplod(chunkInfo, 2, "businessp");
}
async function allUplod(chunkInfo, batchSize, type) {
  const totalBatches = Math.ceil(chunkInfo.length / batchSize);
  for (let i = 0; i < totalBatches; i++) {
    const batchChunks = chunkInfo.slice(i * batchSize, (i + 1) * batchSize);
    switch (type) {
      case "businessp":
        const batchPromise = batchChunks.map((it) => businesspUploadChunk(it));
        await Promise.all(batchPromise);
        break;
      case "medical":
        const batchMedicalPromise = batchChunks.map((it) => medicalUploadChunk(it));
        await Promise.all(batchMedicalPromise);
        break;
    }
  }
}
function getFileExtension(filename) {
  const matchs = filename.match(/\.([^.]+)$/);
  const match = matchs ? matchs[1] : "0";
  return filename.split(`.${match}`)[0] + (Math.floor(Math.random() * 9e4) + 1e4) + "." + match;
}
async function businesspUploadChunk(chunk2) {
  var formData2 = new FormData();
  formData2.append("File", chunk2.file);
  formData2.append("FileName", chunk2.filePartName);
  formData2.append("OriginalFileName", chunk2.originalFileName);
  formData2.append("PartNumber", chunk2.partNumber);
  formData2.append("Chunks", chunk2.chunks);
  formData2.append("Size", chunk2.size);
  formData2.append("Start", chunk2.start);
  formData2.append("End", chunk2.end);
  formData2.append("Total", chunk2.total);
  formData2.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData2).then((data) => {
    if (data) {
      const imgurl = data;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      const colorp = {
        fileName: chunk2.originalFileName,
        url: imgurl,
        name: imgname
      };
      businesspPicUrls.value.push(colorp);
      loading.value = false;
    } else {
      return true;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}`,
      type: "error",
      duration: 3e3
    });
    loading.value = false;
  });
}
function medicalUpload(options) {
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
  allUplod(chunkInfo, 2, "medical");
}
async function medicalUploadChunk(chunk2) {
  var formData2 = new FormData();
  formData2.append("File", chunk2.file);
  formData2.append("FileName", chunk2.filePartName);
  formData2.append("OriginalFileName", chunk2.originalFileName);
  formData2.append("PartNumber", chunk2.partNumber);
  formData2.append("Chunks", chunk2.chunks);
  formData2.append("Size", chunk2.size);
  formData2.append("Start", chunk2.start);
  formData2.append("End", chunk2.end);
  formData2.append("Total", chunk2.total);
  formData2.append("SoureCode", "Chat");
  loadings.value = true;
  await FileAPI.upload(formData2).then((data) => {
    if (data) {
      const imgurl = data;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      const makep = {
        fileName: chunk2.originalFileName,
        url: imgurl,
        name: imgname
      };
      medicalPicUrls.value.push(makep);
      loadings.value = false;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}`,
      type: "error",
      duration: 3e3
    });
    loadings.value = false;
  });
}
function handleSubmit() {
  deptFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (businesspPicUrls.value.length > 0) {
        formData.businessLicense = businesspPicUrls.value[0].url;
      } else {
        formData.businessLicense = "";
      }
      if (medicalPicUrls.value.length > 0) {
        formData.medicalLicense = medicalPicUrls.value[0].url;
      } else {
        formData.medicalLicense = "";
      }
      if (id) {
        formData.relation = null;
        OrgCustomerAPI.update(id, formData).then(() => {
          ElNotification({
            title: "Success",
            message: "修改成功!",
            type: "success",
            duration: 3e3
          });
          handleCloseDialog();
          handleQuery();
        }).finally(() => loading.value = false);
      } else {
        formData.relation.optOrgId = formData.optOrgId;
        formData.relation.optOrgMemberId = formData.optOrgMemberId;
        formData.relation.factoryOrgId = formData.factoryOrgId;
        formData.member = {
          createAccount: formData.createAccount,
          account: formData.account,
          mobile: formData.account,
          userId: formData.userId
        };
        delete formData.createAccount;
        delete formData.account;
        delete formData.mobile;
        delete formData.userId;
        OrgCustomerAPI.add(formData).then(() => {
          ElNotification({
            title: "Success",
            message: "新增成功!",
            type: "success",
            duration: 3e3
          });
          handleCloseDialog();
          handleQuery();
        }).finally(() => loading.value = false);
      }
    }
  });
}
function handleRemove(fileUrl, v) {
  FileAPI.deletes(fileUrl).then(() => {
    if (v == 1) {
      businesspPicUrls.value = businesspPicUrls.value.filter((file) => file.name !== fileUrl);
      if (businesspPicUrls.value.length > 0) {
        formData.businesspUploads = "";
      } else {
        formData.businesspUploads = "1";
      }
    } else if (v == 2) {
      medicalPicUrls.value = medicalPicUrls.value.filter((file) => file.name !== fileUrl);
      if (medicalPicUrls.value.length > 0) {
        formData.medicalUploads = "";
      } else {
        formData.medicalUploads = "1";
      }
    }
  });
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
      OrgCustomerAPI.deleteByIds(ids).then(() => {
        ElNotification({
          title: "Success",
          message: "删除成功!",
          type: "success",
          duration: 3e3
        });
        handleResetQuery();
      }).finally(() => loading.value = false);
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}
function resetForm() {
  formData.id = 0;
  formData.groupId = void 0;
  formData.ordinal = 1;
  formData.name = "";
  formData.code = "";
  formData.shortName = "";
  formData.creditNumber = "";
  formData.contact = "";
  formData.legalPerson = "";
  formData.registAddress = "";
  formData.address = "";
  formData.contactPhone = "";
  formData.email = "";
  formData.remark = "";
  formData.businessLicense = "";
  formData.medicalLicense = "";
  formData.relation = {};
  deptParams.status = true;
  deptParams.keywords = "";
  businesspPicUrls.value = [];
  medicalPicUrls.value = [];
}
function handleCloseDialog() {
  dialog.visible = false;
  resetForm();
}
function handleCloseUserDialog() {
  user_dialog.visible = false;
}
onMounted(() => {
  handleQuery();
  DeptAPI.getOptions({ status: true, orgClassifyCodes: "1001,1004" }).then((data) => {
    const factorydata = data.filter((a) => a.label == "ECM");
    formData.factoryId = factorydata[0].value;
    formData.factoryName = factorydata[0].label;
    factoryOptions.value = factorydata;
  });
});
function handleContactPhoneChange(e) {
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
        formData.userId = void 0;
        formData.account = void 0;
        if (formData.userId == 0) {
          accountMobile.value = false;
        } else {
          accountMobile.value = true;
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
          formData.account = formData.contactPhone;
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
function onzksq() {
  isShow.value = !isShow.value;
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
  }
}
</script>

<style lang="scss" scoped>
.ecmbody-content-yljg {
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
      :deep(.el-card__body) {
        padding: 10px;
      }
      :deep(.pagination) {
        display: flex;
        justify-content: center;
        padding-top: 12px;
      }
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
    :deep(.el-form--inline .el-form-item) {
      display: inline-flex;
      margin-right: 12px;
      vertical-align: middle;
    }
  }
  :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 50px;
    align-items: center;
    background-color: var(--el-fill-color-lighter);
    border: 1px var(--el-border-color-darker);
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    height: var(--el-upload-picture-card-size);
    justify-content: center;
    vertical-align: top;
    width: var(--el-upload-picture-card-size);
    cursor: pointer;
  }
  :deep(.el-table .cell) {
    font-size: 17px;
  }
  .divs {
    width: 100%;
    :deep(.el-divider--horizontal) {
      display: block;
      height: 1px;
      margin: 0px 0;
      width: 100%;
      font-size: 16px;
    }
  }
  :deep(.el-form-item__content) {
    line-height: 32px;
    font-size: 17px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #000000;
    display: flex;
  }
  :deep(.el-form-item__label) {
    justify-content: flex-start;
    text-align: left;
    font-size: 17px;
    font-family: Noto Sans SC;
    font-weight: 400;
    color: #333f48;
  }

  :deep(.el-select__placeholder) {
    position: absolute;
    top: 50%;
    color: #000000;
    transform: translateY(-50%);
    width: 100%;
    z-index: -1;
    font-size: 16px;
  }
  :deep(.el-select-dropdown__item) {
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
  :deep(.el-select-dropdown__item.is-selected) {
    font-weight: 500;
    color: #4080ff;
  }
  :deep(.el-button) {
    border-radius: var(--el-border-radius-base);
    font-size: 16px;
  }

  :deep(.el-input__inner) {
    font-size: 15px;
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
    font-size: 15px;
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
    font-size: 17px;
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
  .upfiles {
    width: auto;
    padding: 0px 10px 0px 20px;
    display: flex;
    .upfile-txts {
      display: flex;
      max-width: 100px;
      overflow: hidden;
      height: 50px;
      cursor: pointer;
    }
    span {
      position: relative;
      top: -10px;
      padding-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
