<template>
  <el-form v-loading="loading" :inline="true" :model="SearchForm">
    <template v-for="(item, index) in FieldData" :key="index">
      <el-form-item :label="item.label" :prop="item.prop">
        <!-- Input 输入框 -->
        <template v-if="item.type === 'input' || item.type === undefined">
          <el-input v-model="SearchForm[item.prop]" style="width: 210px" placeholder="请输入">
            <template #append>
              <el-select v-model="item.options[item.prop]">
                <el-option
                  v-for="(it, key) in options"
                  :key="key"
                  :label="it.label"
                  :value="it.value"
                >
                  {{ it.label }}
                </el-option>
              </el-select>
            </template>
          </el-input>
        </template>
        <!-- Select 选择器 -->
        <template v-else-if="item.type === 'select'">
          <el-select
            v-model="SearchForm[item.prop]"
            clearable
            :filterable="item.config.allowCreate"
            :allow-create="item.config.allowCreate"
            :multiple="item.config.multiple"
            :disabled="item.config.isReadOnly"
            style="width: 135px"
            @focus="onFocus(item)"
          >
            <template v-if="item.config.type == 'K_Default'">
              <el-option
                v-for="option in item.config.defaultValue"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              />
            </template>
            <template v-else>
              <el-option
                v-for="option in item.config.operations"
                :key="option.label"
                :label="option.label"
                :value="option.value"
              />
            </template>
          </el-select>
        </template>
        <!-- Radio 单选框 -->
        <template v-else-if="item.type === 'radio'">
          <el-radio-group v-model="SearchForm[item.prop]">
            <template v-for="option in item.config.defaultValue" :key="option.value">
              <el-radio :label="option.label" :value="option.value" />
            </template>
          </el-radio-group>
        </template>
        <!-- switch 开关 -->
        <template v-else-if="item.type === 'switch'">
          <el-switch v-model="SearchForm[item.prop]" inline-prompt />
        </template>
        <!-- Checkbox 多选框 -->
        <template v-else-if="item.type === 'checkbox'">
          <el-checkbox-group v-model="SearchForm[item.prop]">
            <template v-for="option in item.config.defaultValue" :key="option.value">
              <el-checkbox :label="option.label" :value="option.value" />
            </template>
          </el-checkbox-group>
        </template>
        <!-- Input Number 数字输入框 -->
        <template v-else-if="item.type === 'input-number'">
          <el-input-number v-model="SearchForm[item.prop]" />
        </template>
        <!-- TreeSelect 树形选择 -->
        <template v-else-if="item.type === 'tree-select'">
          <el-tree-select v-model="SearchForm[item.prop]" />
        </template>
        <!-- DatePicker 日期选择器 -->
        <template v-else-if="item.type === 'date-picker'">
          <el-date-picker
            style="width: 150px"
            v-model="SearchForm[item.prop]"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </template>
        <!-- DatePicker 日期介于选择器 -->
        <template v-else-if="item.type === 'date-range-picker'">
          <el-date-picker
            style="width: 220px"
            v-model="SearchForm[item.prop]"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            unlink-panels
          />
        </template>
        <!-- Text 文本 -->
        <template v-else-if="item.type === 'text'">
          <el-text>
            {{ SearchForm[item.prop] }}
          </el-text>
        </template>
        <!-- 自定义 -->
        <template v-else-if="item.type === 'custom'">
          <slot
            :name="item.slotName ?? item.prop"
            :prop="item.prop"
            :form-data="formData"
            :attrs="item.attrs"
          />
        </template>
      </el-form-item>
    </template>
    <el-form-item>
      <el-button icon="search" circle title="搜索" @click="handleToolbar" />
    </el-form-item>
  </el-form>
</template>

<script setup>defineOptions({
  name: "QueryForm",
  inheritAttrs: false
});
import QueryAPI from "@/api/system/query";
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  module: {
    type: String,
    default: ""
  }
});
const loading = ref(false);
const total = ref(0);
const SearchForm = reactive({});
const value = ref("");
const QueryField = ref();
const FieldData = ref();
const queryParams = reactive({
  Module: props.module,
  MultiCondition: []
});
const options = reactive([
  {
    label: "等于",
    value: "等于"
  },
  {
    label: "不等于",
    value: "不等于"
  },
  {
    label: "模糊",
    value: "模糊"
  },
  {
    label: "不模糊",
    value: "不模糊"
  },
  {
    label: "开头是",
    value: "开头是"
  },
  {
    label: "开头不是",
    value: "开头不是"
  },
  {
    label: "结尾是",
    value: "结尾是"
  },
  {
    label: "结尾不是",
    value: "结尾不是"
  },
  {
    label: "包含",
    value: "包含"
  },
  {
    label: "介于",
    value: "介于"
  },
  {
    label: "日期介于",
    value: "日期介于"
  },
  {
    label: "包含逗号模糊",
    value: "包含逗号模糊"
  }
]);
const operations = reactive({});
const queryType = reactive({
  fieldKey: ""
});
const FieldOperations = reactive([]);
function getFieldQuery() {
  loading.value = true;
  QueryAPI.postfieldPage(queryParams).then((data) => {
    initField(data);
  }).finally(() => {
    loading.value = false;
  });
}
function initField(data) {
  if (data.list.length <= 0) return;
  const list = data.list.map((item) => {
    const operation = {};
    const res = judgeType(item);
    if (item.fieldType == "date-picker") {
      operation[item["fieldName"]] = operations[item["fieldName"]] || "介于";
    } else if (item.fieldType == "date-range-picker") {
      operation[item["fieldName"]] = operations[item["fieldName"]] || "日期介于";
    } else {
      operation[item["fieldName"]] = operations[item["fieldName"]] || "等于";
    }
    writeDefualtValue(res.type, item["defaultCondition"], item["fieldName"], SearchForm);
    FieldOperations.push(operation);
    return {
      type: res.type,
      label: item["alias"] || item["fieldName"],
      prop: item["fieldName"],
      config: res.config,
      options: operation,
      table: item["fieldTable"]
    };
  });
  FieldData.value = list;
}
function getQuery(form, operation) {
  const query = [];
  for (const key in form) {
    const data = {
      field: key
    };
    let v = operation.filter((item) => {
      let x = Object.keys(item);
      return x[0] === key;
    });
    if (v.length > 0) {
      data["operation"] = v[0][key];
    }
    if (form[key] == null || form[key] == void 0) {
      form[key] = "";
    }
    const valAry = form[key].toString().split("|");
    valAry.forEach((item, i) => {
      if (i === 0) {
        data["value"] = valAry[i];
      }
    });
    if (form[key] !== "") query.push(data);
  }
  loading.value = true;
  queryParams.MultiCondition = query;
  QueryAPI.postPage(queryParams).then((data) => {
  }).finally(() => {
    loading.value = false;
  });
}
function judgeType(item) {
  const config = {};
  const json = JSON.parse(item.fieldConfig || "{}");
  for (const key in json) {
    const newkey = key.slice(0, 1).toLocaleLowerCase() + key.slice(1);
    config[newkey] = json[key];
  }
  const res = {
    type: item["fieldType"] || "input",
    config
  };
  config.isHidden = item.status;
  if (config.type) {
    if (typeof config.insert !== "undefined") {
      config.allowCreate = config.insert === "true" ? true : false;
      delete config.insert;
    }
    if (typeof config.isReadOnly !== "undefined") {
      config.isReadOnly = config.isReadOnly === "true" ? true : false;
    }
    if (typeof config.duoXuan !== "undefined") {
      config.multiple = config.duoXuan === "true" ? true : false;
      delete config.duoXuan;
    }
    if (config.type.includes("date") && !config.type.includes("K_")) {
      res.type = "date";
      config.dateType = config.type;
    } else {
      config.identity = config.type;
      config.selectName = config.selectName || item["fieldName"];
      config.valueName = config.valueName || item["fieldName"];
    }
  }
  return res;
}
function writeDefualtValue(type, defaultValue, prop, form) {
  if (typeof SearchForm[prop] === "undefined" && typeof defaultValue !== "undefined" && defaultValue !== "") {
    if (type === "number") {
      const value2 = Number(defaultValue);
      if (!Number.isNaN(SearchForm[prop])) {
        SearchForm[prop] = value2;
      }
    } else {
      SearchForm[prop] = defaultValue;
    }
  }
}
function handleToolbar() {
  const operations2 = FieldOperations;
  getQuery(SearchForm, operations2);
}
function onFocus(item) {
  if (item.config.type == "K_Default" || item.config.isCache == true) return;
  queryType.fieldKey = item.config.type;
  QueryAPI.getOpenType(queryType).then((data) => {
    if (data.length > 0) {
      item.config.operations = data;
      item.config.isCache = true;
    }
  }).finally(() => {
    loading.value = false;
  });
}
onMounted(() => {
  getFieldQuery();
});
</script>

<style lang="scss" scoped>
.demo-form-inline {
  display: inline-block;
  .el-form-item {
    margin-bottom: 0;
    .el-button {
      padding: 6px 15px;
    }
  }
}
.el-select {
  width: 90px;
}
.el-select .inputAppend {
  width: 90px;
}
.el-select .inputAppend .el-input input {
  width: 110px;
}
.el-select .inputAppend .el-input i {
  right: -4px;
}
.el-select-dropdown__item {
  font-size: 13px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  font-weight: 100;
  cursor: pointer;
}
</style>
