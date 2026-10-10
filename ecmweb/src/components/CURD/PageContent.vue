<template>
  <el-card shadow="never">
    <!-- 表格工具栏 -->
    <div class="flex-x-between mb-[10px]">
      <!-- 左侧工具栏 -->
      <div>
        <template v-for="item in toolbar" :key="item">
          <template v-if="typeof item === 'string'">
            <!-- 新增 -->
            <template v-if="item === 'add'">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:${item}`]"
                type="success"
                icon="plus"
                @click="handleToolbar(item)"
              >
                新增
              </el-button>
            </template>
            <!-- 删除 -->
            <template v-else-if="item === 'delete'">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:${item}`]"
                type="danger"
                icon="delete"
                :disabled="removeIds.length === 0"
                @click="handleToolbar(item)"
              >
                删除
              </el-button>
            </template>
            <!-- 导入 -->
            <template v-else-if="item === 'import'">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:${item}`]"
                type="default"
                icon="upload"
                @click="handleToolbar(item)"
              >
                导入
              </el-button>
            </template>
            <!-- 导出 -->
            <template v-else-if="item === 'export'">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:${item}`]"
                type="default"
                icon="download"
                @click="handleToolbar(item)"
              >
                导出
              </el-button>
            </template>
          </template>
          <!-- 其他 -->
          <template v-else-if="typeof item === 'object'">
            <el-button
              v-hasPerm="[`${contentConfig.pageName}:${item.auth}`]"
              :icon="item.icon"
              :type="item.type ?? 'default'"
              @click="handleToolbar(item.name)"
            >
              {{ item.text }}
            </el-button>
          </template>
        </template>
      </div>
      <!-- 右侧工具栏 -->
      <div>
        <template v-for="item in defaultToolbar" :key="item">
          <template v-if="typeof item === 'string'">
            <!-- 刷新 -->
            <template v-if="item === 'refresh'">
              <el-button icon="refresh" circle title="刷新" @click="handleToolbar(item)" />
            </template>
            <!-- 筛选列 -->
            <template v-else-if="item === 'filter'">
              <el-popover placement="bottom" trigger="click">
                <template #reference>
                  <el-button icon="Operation" circle title="筛选列" />
                </template>
                <el-scrollbar max-height="350px">
                  <template v-for="col in cols" :key="col">
                    <el-checkbox v-if="col.prop" v-model="col.show" :label="col.label" />
                  </template>
                </el-scrollbar>
              </el-popover>
            </template>
            <!-- 导出 -->
            <template v-else-if="item === 'exports'">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:export`]"
                icon="download"
                circle
                title="导出"
                @click="handleToolbar(item)"
              />
            </template>
            <!-- 导入 -->
            <template v-else-if="item === 'imports'">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:import`]"
                icon="upload"
                circle
                title="导入"
                @click="handleToolbar(item)"
              />
            </template>
            <!-- 搜索 -->
            <template v-else-if="item === 'search'">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:query`]"
                icon="search"
                circle
                title="搜索"
                @click="handleToolbar(item)"
              />
            </template>
          </template>
          <!-- 其他 -->
          <template v-else-if="typeof item === 'object'">
            <template v-if="item.auth">
              <el-button
                v-hasPerm="[`${contentConfig.pageName}:${item.auth}`]"
                :icon="item.icon"
                circle
                :title="item.title"
                @click="handleToolbar(item.name)"
              />
            </template>
            <template v-else>
              <el-button
                :icon="item.icon"
                circle
                :title="item.title"
                @click="handleToolbar(item.name)"
              />
            </template>
          </template>
        </template>
      </div>
    </div>
    <!-- 列表 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      v-bind="contentConfig.table"
      :data="pageData"
      :row-key="pk"
      @selection-change="handleSelectionChange"
      @filter-change="handleFilterChange"
    >
      <template v-for="col in cols" :key="col">
        <el-table-column v-if="col.show" v-bind="col">
          <template #default="scope">
            <!-- 显示图片 -->
            <template v-if="col.templet === 'image'">
              <template v-if="col.prop">
                <template v-if="Array.isArray(scope.row[col.prop])">
                  <template v-for="(item, index) in scope.row[col.prop]" :key="item">
                    <el-image
                      :src="item"
                      :preview-src-list="scope.row[col.prop]"
                      :initial-index="index"
                      :preview-teleported="true"
                      :style="`width: ${col.imageWidth ?? 40}px; height: ${col.imageHeight ?? 40}px`"
                    />
                  </template>
                </template>
                <template v-else>
                  <el-image
                    :src="scope.row[col.prop]"
                    :preview-src-list="[scope.row[col.prop]]"
                    :preview-teleported="true"
                    :style="`width: ${col.imageWidth ?? 40}px; height: ${col.imageHeight ?? 40}px`"
                  />
                </template>
              </template>
            </template>
            <!-- 根据行的selectList属性返回对应列表值 -->
            <template v-else-if="col.templet === 'list'">
              <template v-if="col.prop">
                {{ (col.selectList ?? {})[scope.row[col.prop]] }}
              </template>
            </template>
            <!-- 格式化显示链接 -->
            <template v-else-if="col.templet === 'url'">
              <template v-if="col.prop">
                <el-link type="primary" :href="scope.row[col.prop]" target="_blank">
                  {{ scope.row[col.prop] }}
                </el-link>
              </template>
            </template>
            <!-- 生成开关组件 -->
            <template v-else-if="col.templet === 'switch'">
              <template v-if="col.prop">
                <!-- pageData.length>0: 解决el-switch组件会在表格初始化的时候触发一次change事件 -->
                <el-switch
                  v-model="scope.row[col.prop]"
                  :active-value="col.activeValue ?? 1"
                  :inactive-value="col.inactiveValue ?? 0"
                  :inline-prompt="true"
                  :active-text="col.activeText ?? ''"
                  :inactive-text="col.inactiveText ?? ''"
                  :validate-event="false"
                  :disabled="!hasAuth(`${contentConfig.pageName}:modify`)"
                  @change="
                    pageData.length > 0 && handleModify(col.prop, scope.row[col.prop], scope.row)
                  "
                />
              </template>
            </template>
            <!-- 生成输入框组件 -->
            <template v-else-if="col.templet === 'input'">
              <template v-if="col.prop">
                <el-input
                  v-model="scope.row[col.prop]"
                  :type="col.inputType ?? 'text'"
                  :disabled="!hasAuth(`${contentConfig.pageName}:modify`)"
                  @blur="handleModify(col.prop, scope.row[col.prop], scope.row)"
                />
              </template>
            </template>
            <!-- 格式化为价格 -->
            <template v-else-if="col.templet === 'price'">
              <template v-if="col.prop">
                {{ `${col.priceFormat ?? "￥"}${scope.row[col.prop]}` }}
              </template>
            </template>
            <!-- 格式化为百分比 -->
            <template v-else-if="col.templet === 'percent'">
              <template v-if="col.prop">{{ scope.row[col.prop] }}%</template>
            </template>
            <!-- 显示图标 -->
            <template v-else-if="col.templet === 'icon'">
              <template v-if="col.prop">
                <template v-if="scope.row[col.prop].startsWith('el-icon-')">
                  <el-icon>
                    <component :is="scope.row[col.prop].replace('el-icon-', '')" />
                  </el-icon>
                </template>
                <template v-else>
                  <div class="i-svg:{{ scope.row[col.prop] }}" />
                </template>
              </template>
            </template>
            <!-- 格式化时间 -->
            <template v-else-if="col.templet === 'date'">
              <template v-if="col.prop">
                {{
                  scope.row[col.prop]
                    ? useDateFormat(scope.row[col.prop], col.dateFormat ?? "YYYY-MM-DD HH:mm:ss")
                        .value
                    : ""
                }}
              </template>
            </template>
            <!-- 列操作栏 -->
            <template v-else-if="col.templet === 'tool'">
              <template v-for="item in col.operat ?? ['edit', 'delete']" :key="item">
                <template v-if="typeof item === 'string'">
                  <!-- 编辑/删除 -->
                  <template v-if="item === 'edit' || item === 'delete'">
                    <el-button
                      v-hasPerm="[`${contentConfig.pageName}:${item}`]"
                      :type="item === 'edit' ? 'primary' : 'danger'"
                      :icon="item"
                      size="small"
                      link
                      @click="
                        handleOperat({
                          name: item,
                          row: scope.row,
                          column: scope.column,
                          $index: scope.$index,
                        })
                      "
                    >
                      {{ item === "edit" ? "编辑" : "删除" }}
                    </el-button>
                  </template>
                </template>
                <!-- 其他 -->
                <template v-else-if="typeof item === 'object'">
                  <el-button
                    v-if="item.render === undefined || item.render(scope.row)"
                    v-bind="
                      item.auth ? { 'v-hasPerm': [`${contentConfig.pageName}:${item.auth}`] } : {}
                    "
                    :icon="item.icon"
                    :type="item.type ?? 'primary'"
                    size="small"
                    link
                    @click="
                      handleOperat({
                        name: item.name,
                        row: scope.row,
                        column: scope.column,
                        $index: scope.$index,
                      })
                    "
                  >
                    {{ item.text }}
                  </el-button>
                </template>
              </template>
            </template>
            <!-- 自定义 -->
            <template v-else-if="col.templet === 'custom'">
              <slot :name="col.slotName ?? col.prop" :prop="col.prop" v-bind="scope" />
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <template v-if="showPagination">
      <el-scrollbar>
        <div class="mt-[12px]">
          <el-pagination
            v-bind="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-scrollbar>
    </template>
    <!-- 导出弹窗 -->
    <el-dialog
      v-model="exportsModalVisible"
      :align-center="true"
      title="导出数据"
      width="600px"
      style="padding-right: 0"
      @close="handleCloseExportsModal"
    >
      <!-- 滚动 -->
      <el-scrollbar max-height="60vh">
        <!-- 表单 -->
        <el-form
          ref="exportsFormRef"
          label-width="auto"
          style="padding-right: var(--el-dialog-padding-primary)"
          :model="exportsFormData"
          :rules="exportsFormRules"
        >
          <el-form-item label="文件名" prop="filename">
            <el-input v-model="exportsFormData.filename" clearable />
          </el-form-item>
          <el-form-item label="工作表名" prop="sheetname">
            <el-input v-model="exportsFormData.sheetname" clearable />
          </el-form-item>
          <el-form-item label="数据源" prop="origin">
            <el-select v-model="exportsFormData.origin">
              <el-option label="当前数据 (当前页的数据)" :value="ExportsOriginEnum.CURRENT" />
              <el-option
                label="选中数据 (所有选中的数据)"
                :value="ExportsOriginEnum.SELECTED"
                :disabled="selectionData.length <= 0"
              />
              <el-option
                label="全量数据 (所有分页的数据)"
                :value="ExportsOriginEnum.REMOTE"
                :disabled="contentConfig.exportsAction === undefined"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="字段" prop="fields">
            <el-checkbox-group v-model="exportsFormData.fields">
              <template v-for="col in cols" :key="col">
                <el-checkbox v-if="col.prop" :value="col.prop" :label="col.label" />
              </template>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div style="padding-right: var(--el-dialog-padding-primary)">
          <el-button type="primary" @click="handleExportsSubmit">确 定</el-button>
          <el-button @click="handleCloseExportsModal">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 导入弹窗 -->
    <el-dialog
      v-model="importModalVisible"
      :align-center="true"
      title="导入数据"
      width="600px"
      style="padding-right: 0"
      @close="handleCloseImportModal"
    >
      <!-- 滚动 -->
      <el-scrollbar max-height="60vh">
        <!-- 表单 -->
        <el-form
          ref="importFormRef"
          label-width="auto"
          style="padding-right: var(--el-dialog-padding-primary)"
          :model="importFormData"
          :rules="importFormRules"
        >
          <el-form-item label="文件名" prop="files">
            <el-upload
              ref="uploadRef"
              v-model:file-list="importFormData.files"
              class="w-full"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              :drag="true"
              :limit="1"
              :auto-upload="false"
              :on-exceed="handleFileExceed"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                <span>将文件拖到此处，或</span>
                <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  *.xlsx / *.xls
                  <el-link
                    v-if="contentConfig.importTemplate"
                    type="primary"
                    icon="download"
                    :underline="false"
                    @click="handleDownloadTemplate"
                  >
                    下载模板
                  </el-link>
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div style="padding-right: var(--el-dialog-padding-primary)">
          <el-button
            type="primary"
            :disabled="importFormData.files.length === 0"
            @click="handleImportSubmit"
          >
            确 定
          </el-button>
          <el-button @click="handleCloseImportModal">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>import { useThrottleFn } from "@vueuse/core";
import {
  genFileId
} from "element-plus";
import ExcelJS from "exceljs";
import { reactive, ref } from "vue";
// 迁移脚本清空了 defineProps/defineEmits，这里补回运行时声明
const props = defineProps({
  contentConfig: {
    type: Object,
    required: true
  }
});
const emit = defineEmits([
  "addClick",
  "exportClick",
  "searchClick",
  "toolbarClick",
  "editClick",
  "operatClick",
  "filterChange"
]);
const pk = props.contentConfig.pk ?? "id";
const toolbar = props.contentConfig.toolbar ?? ["add", "delete"];
const defaultToolbar = props.contentConfig.defaultToolbar ?? ["refresh", "filter"];
const cols = ref(
  props.contentConfig.cols.map((col) => {
    col.initFn && col.initFn(col);
    if (col.show === void 0) {
      col.show = true;
    }
    if (col.prop !== void 0 && col.columnKey === void 0 && col["column-key"] === void 0) {
      col.columnKey = col.prop;
    }
    if (col.type === "selection" && col.reserveSelection === void 0 && col["reserve-selection"] === void 0) {
      col.reserveSelection = true;
    }
    return col;
  })
);
const loading = ref(false);
const pageData = ref([]);
const showPagination = props.contentConfig.pagination !== false;
const defalutPagination = {
  background: true,
  layout: "total, sizes, prev, pager, next, jumper",
  pageSize: 20,
  pageSizes: [10, 20, 30, 50],
  total: 0,
  currentPage: 1
};
const pagination = reactive(
  typeof props.contentConfig.pagination === "object" ? { ...defalutPagination, ...props.contentConfig.pagination } : defalutPagination
);
const request = props.contentConfig.request ?? {
  pageName: "pageIndex",
  limitName: "pageSize"
};
const tableRef = ref();
const selectionData = ref([]);
const removeIds = ref([]);
function handleSelectionChange(selection) {
  selectionData.value = selection;
  removeIds.value = selection.map((item) => item[pk]);
}
function handleRefresh(isRestart = false) {
  fetchPageData(lastFormData, isRestart);
}
function handleDelete(id) {
  const ids = [id || removeIds.value].join(",");
  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function() {
    if (props.contentConfig.deleteAction) {
      props.contentConfig.deleteAction(ids).then(() => {
        ElNotification({
          title: "Success",
          message: "删除成功!",
          type: "success",
          duration: 3e3
        });
        removeIds.value = [];
        tableRef.value?.clearSelection();
        handleRefresh(true);
      });
    } else {
      ElMessage.error("未配置deleteAction");
    }
  });
}
const fields = [];
cols.value.forEach((item) => {
  if (item.prop !== void 0) {
    fields.push(item.prop);
  }
});
var ExportsOriginEnum = /* @__PURE__ */ ((ExportsOriginEnum2) => {
  ExportsOriginEnum2["CURRENT"] = "current";
  ExportsOriginEnum2["SELECTED"] = "selected";
  ExportsOriginEnum2["REMOTE"] = "remote";
  return ExportsOriginEnum2;
})(ExportsOriginEnum || {});
const exportsModalVisible = ref(false);
const exportsFormRef = ref();
const exportsFormData = reactive({
  filename: "",
  sheetname: "",
  fields,
  origin: "current" /* CURRENT */
});
const exportsFormRules = {
  fields: [{ required: true, message: "请选择字段" }],
  origin: [{ required: true, message: "请选择数据源" }]
};
function handleOpenExportsModal() {
  exportsModalVisible.value = true;
}
const handleExportsSubmit = useThrottleFn(() => {
  exportsFormRef.value?.validate((valid) => {
    if (valid) {
      handleExports();
      handleCloseExportsModal();
    }
  });
}, 3e3);
function handleCloseExportsModal() {
  exportsModalVisible.value = false;
  exportsFormRef.value?.resetFields();
  nextTick(() => {
    exportsFormRef.value?.clearValidate();
  });
}
function handleExports() {
  const filename = exportsFormData.filename ? exportsFormData.filename : props.contentConfig.pageName;
  const sheetname = exportsFormData.sheetname ? exportsFormData.sheetname : "sheet";
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetname);
  const columns = [];
  cols.value.forEach((col) => {
    if (col.label && col.prop && exportsFormData.fields.includes(col.prop)) {
      columns.push({ header: col.label, key: col.prop });
    }
  });
  worksheet.columns = columns;
  if (exportsFormData.origin === "remote" /* REMOTE */) {
    if (props.contentConfig.exportsAction) {
      props.contentConfig.exportsAction(lastFormData).then((res) => {
        worksheet.addRows(res);
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveXlsx(buffer, filename);
        }).catch((error) => console.log(error));
      });
    } else {
      ElMessage.error("未配置exportsAction");
    }
  } else {
    worksheet.addRows(
      exportsFormData.origin === "selected" /* SELECTED */ ? selectionData.value : pageData.value
    );
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveXlsx(buffer, filename);
    }).catch((error) => console.log(error));
  }
}
let isFileImport = false;
const uploadRef = ref();
const importModalVisible = ref(false);
const importFormRef = ref();
const importFormData = reactive({
  files: []
});
const importFormRules = {
  files: [{ required: true, message: "请选择文件" }]
};
function handleOpenImportModal(isFile = false) {
  importModalVisible.value = true;
  isFileImport = isFile;
}
function handleFileExceed(files) {
  uploadRef.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value.handleStart(file);
}
function handleDownloadTemplate() {
  const importTemplate = props.contentConfig.importTemplate;
  if (typeof importTemplate === "string") {
    window.open(importTemplate);
  } else if (typeof importTemplate === "function") {
    importTemplate().then((response) => {
      const fileData = response.data;
      const fileName = decodeURI(
        response.headers["content-disposition"].split(";")[1].split("=")[1]
      );
      saveXlsx(fileData, fileName);
    });
  } else {
    ElMessage.error("未配置importTemplate");
  }
}
const handleImportSubmit = useThrottleFn(() => {
  importFormRef.value?.validate((valid) => {
    if (valid) {
      if (isFileImport) {
        handleImport();
      } else {
        handleImports();
      }
    }
  });
}, 3e3);
function handleCloseImportModal() {
  importModalVisible.value = false;
  importFormRef.value?.resetFields();
  nextTick(() => {
    importFormRef.value?.clearValidate();
  });
}
function handleImport() {
  const importAction = props.contentConfig.importAction;
  if (importAction === void 0) {
    ElMessage.error("未配置importAction");
    return;
  }
  importAction(importFormData.files[0].raw).then(() => {
    ElMessage.success("导入数据成功");
    handleCloseImportModal();
    handleRefresh(true);
  });
}
function handleImports() {
  const importsAction = props.contentConfig.importsAction;
  if (importsAction === void 0) {
    ElMessage.error("未配置importsAction");
    return;
  }
  const file = importFormData.files[0].raw;
  const workbook = new ExcelJS.Workbook();
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = (ev) => {
    if (ev.target !== null && ev.target.result !== null) {
      const result = ev.target.result;
      workbook.xlsx.load(result).then((workbook2) => {
        const data = [];
        const worksheet = workbook2.getWorksheet(1);
        if (worksheet) {
          const fields2 = [];
          worksheet.getRow(1).eachCell((cell) => {
            fields2.push(cell.value);
          });
          for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const rowData = {};
            const row = worksheet.getRow(rowNumber);
            row.eachCell((cell, colNumber) => {
              rowData[fields2[colNumber - 1]] = cell.value;
            });
            data.push(rowData);
          }
        }
        if (data.length === 0) {
          ElMessage.error("未解析到数据");
          return;
        }
        importsAction(data).then(() => {
          ElMessage.success("导入数据成功");
          handleCloseImportModal();
          handleRefresh(true);
        });
      }).catch((error) => console.log(error));
    } else {
      ElMessage.error("读取文件失败");
    }
  };
}
function handleToolbar(name) {
  switch (name) {
    case "refresh":
      handleRefresh();
      break;
    case "exports":
      handleOpenExportsModal();
      break;
    case "imports":
      handleOpenImportModal();
      break;
    case "search":
      emit("searchClick");
      break;
    case "add":
      emit("addClick");
      break;
    case "delete":
      handleDelete();
      break;
    case "import":
      handleOpenImportModal(true);
      break;
    case "export":
      emit("exportClick");
      break;
    default:
      emit("toolbarClick", name);
      break;
  }
}
function handleOperat(data) {
  switch (data.name) {
    case "edit":
      emit("editClick", data.row);
      break;
    case "delete":
      handleDelete(data.row[pk]);
      break;
    default:
      emit("operatClick", data);
      break;
  }
}
function handleModify(field, value, row) {
  if (props.contentConfig.modifyAction) {
    props.contentConfig.modifyAction({
      [pk]: row[pk],
      field,
      value
    });
  } else {
    ElMessage.error("未配置modifyAction");
  }
}
function handleSizeChange(value) {
  pagination.pageSize = value;
  handleRefresh();
}
function handleCurrentChange(value) {
  pagination.currentPage = value;
  handleRefresh();
}
let filterParams = {};
function handleFilterChange(newFilters) {
  const filters = {};
  for (const key in newFilters) {
    const col = cols.value.find((col2) => {
      return col2.columnKey === key || col2["column-key"] === key;
    });
    if (col && col.filterJoin !== void 0) {
      filters[key] = newFilters[key].join(col.filterJoin);
    } else {
      filters[key] = newFilters[key];
    }
  }
  filterParams = { ...filterParams, ...filters };
  emit("filterChange", filterParams);
}
function getFilterParams() {
  return filterParams;
}
let lastFormData = {};
function fetchPageData(formData = {}, isRestart = false) {
  loading.value = true;
  lastFormData = formData;
  if (isRestart) {
    pagination.currentPage = 1;
  }
  props.contentConfig.indexAction(
    showPagination ? {
      [request.pageName]: pagination.currentPage,
      [request.limitName]: pagination.pageSize,
      ...formData
    } : formData
  ).then((data) => {
    if (showPagination) {
      if (props.contentConfig.parseData) {
        data = props.contentConfig.parseData(data);
      }
      pagination.total = data.total;
      pageData.value = data.list;
    } else {
      pageData.value = data;
    }
  }).finally(() => {
    loading.value = false;
  });
}
fetchPageData();
function exportPageData(formData = {}) {
  if (props.contentConfig.exportAction) {
    props.contentConfig.exportAction(formData).then((response) => {
      const fileData = response.data;
      const fileName = decodeURI(
        response.headers["content-disposition"].split(";")[1].split("=")[1]
      );
      saveXlsx(fileData, fileName);
    });
  } else {
    ElMessage.error("未配置exportAction");
  }
}
function saveXlsx(fileData, fileName) {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
  const blob = new Blob([fileData], { type: fileType });
  const downloadUrl = window.URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(downloadUrl);
}
defineExpose({ fetchPageData, exportPageData, getFilterParams });
</script>

<style lang="scss" scoped></style>
