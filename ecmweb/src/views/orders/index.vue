<template>
  <div class="ecmbody">
    <div class="ecmbodys">
      <div class="ecmbody-left">
        <div class="ecmbody-left-top">
          <div class="ecmbody-left-top1">订单管理</div>
          <div class="ecmbody-left-top2">
            最近刷新：{{ dataTime }} &nbsp;
            <el-icon @click="refresh">
              <Refresh />
            </el-icon>
          </div>
        </div>
        <div :class="isClass ? 'ecmbody-left-content-top' : 'ecmbody-left-content-tops'">
          <div
            v-for="(item, index) in orderStatusList"
            :key="index"
            class="ecmbody-left-content2-1"
            :style="{
              'background-color': item.bgcolor,
              border: item.state == queryParams.state ? '1px solid ' + item.color + '' : 'none',
            }"
            @click="Query(item)"
          >
            <div class="ecmbody-left-content2-1-1">
              <div
                class="ecmbody-left-content2-1-1-value"
                :style="{
                  color: item.color,
                }"
              >
                {{ item.value }}
              </div>
              <div class="ecmbody-left-content2-1-1-name">{{ item.name }}</div>
            </div>
            <div class="ecmbody-left-content2-1-2">
              <div class="ecmbody-left-content2-1-2-img">
                <img :src="imgUrl + item.inc" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="orderStatusList.length > 4"
          class="ecmbody-left-content-xiala"
          :title="clssName"
          @click="openStass"
        >
          <el-icon color="#002b80" size="20px"><MoreFilled /></el-icon>
        </div>
        <div
          :class="orderStatusList.length == 4 ? 'ecmbody-left-content' : 'ecmbody-left-contents'"
        >
          <div class="ecmbody-left-content1">
            <div class="ecmbody-left-content1-Search">
              <el-input
                v-model="queryParams.keywords"
                clearable
                type="text"
                placeholder="患者,医生,订单号,诊所"
                :class="isFactory ? 'ecmbogy-zsname' : 'ecmbogy-zsnames'"
              ></el-input>
              <el-select
                v-model="queryParams.day"
                placeholder="Select"
                style="width: 77px; margin-left: 6px"
                @change="handleOnChange"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="queryParams.createTime"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 223px; font-size: 14px; margin-left: 6px"
                value-format="YYYY-MM-DD"
                size="default"
              />
            </div>
            <el-select
              v-if="isFactory"
              v-model="queryParams.substituteType"
              placeholder="全部"
              style="width: 89px; margin-left: 6px"
              @change="handleTypeOnChange"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="ecmbody-left-content1-btn" style="padding-left: 5px">
              <el-button
                style="color: #fff; width: 70px; padding-left: 3px"
                type="primary"
                @click="handleQuery"
              >
                <el-icon class="el-icon--right">
                  <Search />
                </el-icon>
                &nbsp; 查询
              </el-button>
              <el-button
                style="background-color: #3d9fa6; border-color: #3d9fa6; width: 53px; color: #fff"
                @click="onClear"
              >
                重置
              </el-button>
            </div>
          </div>
          <div class="ecmbody-left-content2">
            筛选结果：关键字
            <span>{{ orderFilter.keywords }}</span>
            ，时间
            <span>{{ getTime(orderFilter.time) }}</span>
            ，状态
            <span>{{ orderFilter.status }}</span>
            ，类型
            <span>{{ orderFilter.substituteType }}</span>
          </div>
          <div class="ecmbody-left-content3">
            <el-table
              ref="singleTableRef"
              style="width: 100%"
              stripe
              :data="queryList"
              :loading="loading"
              class="custom-table"
              :row-class-name="({ row }) => (row.id === selectedRowId ? 'custom-selected-row' : '')"
              :highlight-current-row="isSelect"
              @row-click="selrow"
            >
              <el-table-column
                v-for="(item, index) in fieldData"
                :key="index"
                :prop="item"
                show-overflow-tooltip
                :width="item.width"
              >
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>{{ item.label }}</span>
                  </div>
                </template>
                <template #default="scope">
                  <div style="display: flex; align-items: center" :title="scope.row[item.value]">
                    <div
                      v-if="item.label == '状态'"
                      :style="{
                        border: `0.5px solid ${scope.row.fontColor}`,
                        borderRadius: '6px',
                        color: `${scope.row.fontColor}`,
                        padding: `0px 4px`,
                        background: `${scope.row.backColor}`,
                      }"
                    >
                      {{ scope.row[item.value] }}
                    </div>
                    <div v-else>{{ scope.row[item.value] }}</div>
                    &nbsp;
                    <div
                      v-if="scope.row.isQuestion > 0 && item.label == '序号'"
                      style="padding-top: 2px; padding-right: 2px"
                    >
                      <img
                        src="@/assets/images/dw.png"
                        :title="getQuestiong(scope.row.isQuestion)"
                      />
                    </div>
                    <div
                      v-if="scope.row.isPaused == '1' && item.label == '序号'"
                      style="padding-top: 2px; padding-right: 2px"
                    >
                      <img src="/images/zt.png" title="暂停" />
                    </div>
                    <div
                      v-if="scope.row.urgent == 1 && item.label == '序号'"
                      style="padding-top: 2px; padding-right: 2px"
                    >
                      <img src="/images/jj.png" title="加急" />
                    </div>
                    <div
                      v-if="scope.row.dc == 0 && item.label == '序号'"
                      style="padding-top: 2px; padding-right: 2px"
                    >
                      <img src="/images/zf.png" title="作废" />
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column fixed="right" width="55px">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>操作</span>
                  </div>
                </template>
                <template #default="scope">
                  <el-button
                    type="primary"
                    style="font-size: 12px; margin-left: -1px"
                    size="small"
                    @click.stop="opendetails(scope.row)"
                  >
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="ecmbody-left-content3-page">
              <pagination
                v-if="total > 0"
                v-model:total="total"
                v-model:page="queryParams.pageIndex"
                v-model:limit="queryParams.pageSize"
                :size="small"
                @pagination="handleQuery"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="ecmbody-right">
        <Mess
          :key="keys"
          @callheadermethods="handleCallHeaderMethod"
          @featchMyNotice="featchMyNotice"
          @setOrderInfo="setOrderInfo"
        />
      </div>
    </div>
    <div class="ecmbody-zhanwei"></div>
  </div>
</template>

<script setup>defineOptions({
  name: "orders",
  inheritAttrs: false
});
import router from "@/router";
import OrdersAPI from "@/api/orders";
import { useUserStore, useChatStore } from "@/store";
import { setQueryParamsData, getQueryParamsData, setActiveIndex } from "@/utils/auth";
import DictAPI from "@/api/system/dict";
const loading = ref(false);
const total = ref(0);
const i = ref(0);
const keys = ref(0);
const makeId = ref(0);
const orderId = ref(0);
const reviewTotal = ref(0);
const makeTotal = ref(0);
const okTotal = ref(0);
const small = ref("small");
const singleTable = ref([]);
const singleTableRef = ref(null);
const selectedRowId = ref(0);
const isSelect = ref(false);
const isFactory = ref(false);
const messClass = ref([{ label: "消息列表", value: 0 }]);
const queryList = ref();
const dataTime = ref("");
const fieldData = ref();
const orderStatusList = ref([]);
const orderFilter = ref({
  keywords: "",
  time: "",
  status: "",
  substituteType: -1
});
const chatStore = useChatStore();
const userInfo = useUserStore().userInfo;
const imgUrl = "/images/";
const countdown = ref(5);
const timer = ref(null);
const orderState = ref("");
const isClass = ref(true);
const clssName = ref("展开");
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  keywords: "",
  day: "no",
  cacheTime: "",
  createTime: ["", ""],
  substituteType: -1,
  orgRoleCodes: userInfo.members.orgRoleCodes
});
const typeOptions = reactive([]);
const options = [
  {
    value: "oneDay",
    label: "今天"
  },
  {
    value: "threeDay",
    label: "3天"
  },
  {
    value: "sevenDay",
    label: "7天"
  },
  {
    value: "thirtyDay",
    label: "30天"
  },
  {
    value: "no",
    label: "不限"
  }
];
function handleOnChange(value) {
  var dateTime = /* @__PURE__ */ new Date();
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1 < 10 ? "0" + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1;
  var day = dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate();
  const endDay = `${year}-${month}-${day}`;
  switch (value) {
    case "oneDay":
      var startDay = getDay(0);
      queryParams.createTime = [startDay, endDay];
      handleQuery();
      break;
    case "threeDay":
      var startDay1 = getDay(3);
      queryParams.createTime = [startDay1, endDay];
      break;
    case "sevenDay":
      var startDay2 = getDay(7);
      queryParams.createTime = [startDay2, endDay];
      break;
    case "thirtyDay":
      var startDay3 = getDay(30);
      queryParams.createTime = [startDay3, endDay];
      break;
    case "no":
      const cnDateStr = dateTime.toLocaleDateString("zh-CN");
      queryParams.createTime = null;
      queryParams.cacheTime = cnDateStr;
      handleQuery();
      break;
  }
}
function handleTypeOnChange() {
}
function getDay(count) {
  var day = /* @__PURE__ */ new Date();
  day.setDate(day.getDate() - count);
  var y = day.getFullYear();
  var m = day.getMonth() + 1 < 10 ? "0" + (day.getMonth() + 1) : day.getMonth() + 1;
  var d = day.getDate() < 10 ? "0" + day.getDate() : day.getDate();
  var EndDay = y + "-" + m + "-" + d;
  return EndDay;
}
function onClear() {
  queryParams.keywords = "";
  queryParams.createTime = null;
  queryParams.day = "no";
  queryParams.substituteType = -1;
}
function handleQuery() {
  loading.value = true;
  chatStore.activeIndex = 0;
  chatStore.orderInfo = null;
  queryParams.orgRoleCodes = userInfo.members.orgRoleCodes;
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  OrdersAPI.getPage(queryParams).then((data) => {
    queryList.value = data.lists;
    fieldData.value = data.fieldData;
    total.value = data.total;
    makeTotal.value = data.makeTotal;
    orderStatusList.value = data.xData;
    okTotal.value = data.okTotal;
    reviewTotal.value = data.reviewTotal;
    messClass.value = [{ label: "消息列表", value: 0 }];
    queryParams.state = queryParams.state != void 0 ? queryParams.state : "";
    setQueryParamsData(JSON.stringify(queryParams));
    loadingInstance.close();
    chatStore.orderInfo = null;
    const date = /* @__PURE__ */ new Date();
    dataTime.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    setActiveIndex("0");
    orderFilter.value.keywords = queryParams.keywords == "" ? "空" : queryParams.keywords;
    orderFilter.value.time = queryParams.createTime;
    const type = typeOptions.filter((a) => {
      return a.value == queryParams.substituteType;
    });
    if (type.length > 0) {
      orderFilter.value.substituteType = type[0].label;
    }
    if (data.xData.length > 0) {
      let state = queryParams.state;
      const d = data.xData.filter((item) => {
        return item.state === state;
      });
      if (d.length > 0) {
        orderFilter.value.status = d[0].name;
      } else {
        orderFilter.value.status = "全部";
      }
    }
    if (orderFilter.value.status == "待审核" || orderFilter.value.status == "审核中") {
      settimer();
    } else {
      stoptimer();
    }
    i.value += 1;
  }).finally(() => {
    loadingInstance.close();
    loading.value = false;
  });
}
function Query(item) {
  switch (item.name) {
    case "待问件":
      queryParams.SortField = "CreateTime";
      queryParams.Sort = "ASC";
      break;
    default:
      queryParams.Sort = "";
      queryParams.SortField = "";
  }
  queryParams.pageIndex = 1;
  queryParams.state = item.state;
  orderFilter.value.status = item.name;
  if (orderStatusList.value.length > 4) {
    isClass.value = true;
    clssName.value = "展开";
  }
  handleQuery();
}
function selrow(row, column, event) {
  const tableRef = singleTable.value.filter((a) => a.id == row.id);
  singleTable.value = [];
  makeId.value = row.makeId;
  if (tableRef.length == 0) {
    singleTable.value.push(row);
    selectedRowId.value = row.id;
    isSelect.value = true;
    chatStore.orderInfo = row;
    chatStore.setRoomId(row.roomId);
    chatStore.activeIndex = 1;
    setActiveIndex("1");
    if (row.roomId && row.roomId != 0) {
      chatStore.orderInfo = row;
    } else {
      ElNotification({
        title: "Error",
        message: `房间号不能为空`,
        type: "error",
        duration: 3e3
      });
    }
  } else {
    chatStore.orderInfo = null;
    selectedRowId.value = 0;
    isSelect.value = false;
    chatStore.activeIndex = 0;
    setActiveIndex("0");
  }
  i.value += 1;
  keys.value += 1;
}
function setOrderInfo() {
  selectedRowId.value = 0;
  chatStore.orderInfo = null;
  isSelect.value = false;
  chatStore.activeIndex = 0;
  setActiveIndex("0");
}
function opendetails(item) {
  chatStore.orderInfo = item;
  chatStore.setRoomId(item.roomId);
  chatStore.activeIndex = 1;
  makeId.value = item.makeId;
  orderId.value = item.id;
  const data = JSON.stringify(queryParams);
  setQueryParamsData(data);
  setActiveIndex(1);
  const params = {
    id: item.id
  };
  const url = {
    path: "/details",
    query: params
  };
  router.push(url).then(() => {
    window.location.reload();
  });
}
async function refresh() {
  var rs = await handleQuery();
  ElNotification({
    title: "Success",
    message: "页面刷新成功!",
    type: "success"
  });
}
const settimer = () => {
  if (timer.value) clearInterval(timer.value);
  timer.value = setInterval(() => {
    renderOrderList();
  }, 2e4);
};
function stoptimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}
function renderOrderList() {
  queryParams.pageIndex = 1;
  queryParams.orgRoleCodes = userInfo.members.orgRoleCodes;
  OrdersAPI.getStatePage(queryParams).then((data) => {
    if (data.total == 0) {
      const date = /* @__PURE__ */ new Date();
      let datatime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      console.log("时间:" + datatime);
      settimer();
    } else {
      Object.assign(queryList, data.lists);
      fieldData.value = data.fieldData;
      total.value = data.total;
      makeTotal.value = data.makeTotal;
      orderStatusList.value = data.xData;
      okTotal.value = data.okTotal;
      reviewTotal.value = data.reviewTotal;
    }
  });
}
async function restoreSelection(data) {
  if (!singleTableRef.value || singleTable.value.length === 0) return;
  data.some((item) => {
    const taref = singleTable.value.filter((a) => a.id == item.id);
    if (taref.length > 0) {
      selectedRowId.value = item.id;
      return true;
    }
    return false;
  });
}
function getColor(item) {
  let color = "";
  switch (item) {
    case "新建订单":
      color = "#4F5AED";
      break;
    case "已接单":
      color = "#BC0505";
      break;
    case "待审核":
      color = "#BC0505";
      break;
    case "审核中":
      color = "#BC0505";
      break;
    case "已审核":
      color = "#BC0505";
      break;
    case "待设计":
      color = "#E87544";
      break;
    case "设计中":
      color = "#E87544";
      break;
    case "设计完成":
      color = "#E87544";
      break;
    case "待制作":
      color = "#5A6376";
      break;
    case "工厂录单中":
      color = "#5A6376";
      break;
    case "工厂接单":
      color = "#E87544";
      break;
    case "录单中":
      color = "#E87544";
      break;
    case "生产中":
      color = "#5A6376";
      break;
    case "已发货":
      color = "#5A6376";
      break;
    case "已完成":
      color = "#14804A";
      break;
  }
  return color;
}
function getBackColor(item) {
  let color = "";
  switch (item) {
    case "新建订单":
      color = "#F0F1FA";
      break;
    case "已接单":
      color = "#FFCDF3";
      break;
    case "待审核":
      color = "#FFCDF3";
      break;
    case "审核中":
      color = "#FFCDF3";
      break;
    case "已审核":
      color = "#FFCDF3";
      break;
    case "待设计":
      color = "#FFF0E5";
      break;
    case "设计中":
      color = "#FFF0E5";
      break;
    case "设计完成":
      color = "#FFF0E5";
      break;
    case "待制作":
      color = "#E9EDF5";
      break;
    case "工厂录单中":
      color = "#E9EDF5";
      break;
    case "工厂接单":
      color = "#E87544";
      break;
    case "录单中":
      color = "#E87544";
      break;
    case "生产中":
      color = "#E9EDF5";
      break;
    case "已发货":
      color = "#E9EDF5";
      break;
    case "已完成":
      color = "#E1FCEF";
      break;
  }
  return color;
}
function openStass() {
  isClass.value = !isClass.value;
  if (isClass.value) {
    clssName.value = "展开";
  } else {
    clssName.value = "收起";
  }
}
function getQuestiong(v) {
  switch (v) {
    case 1:
      return "审核待问";
    case 2:
      return "设计待问";
    case 3:
      return "生产待问";
  }
}
const emit = defineEmits(["callheadermethod", "featchMyNotice"]);
function handleCallHeaderMethod() {
  emit("callheadermethod");
}
function featchMyNotice() {
  emit("featchMyNotice");
}
function getTime(v) {
  if (v == null) {
    return "";
  }
  let time = [];
  if (v.length > 0) {
    time.push(v[0].split("T")[0]);
    if (v.length == 2) {
      time.push(v[1].split("T")[0]);
    }
  }
  return time;
}
function setType() {
  const codes = "SubstituteType";
  DictAPI.getOptionsList(codes).then((data) => {
    if (data.length > 0) {
      data[0].dictDataList.map((a) => a.value = parseInt(a.value));
      Object.assign(typeOptions, data[0].dictDataList.length > 0 ? data[0].dictDataList : []);
    }
  });
}
onBeforeUnmount(() => {
  stoptimer();
});
onMounted(() => {
  debugger;
  const cate = userInfo.members.orgClassifyCode;
  if (cate == 1004 || cate == 10011 || cate == 1001) {
    isFactory.value = true;
  }
  if (cate == 1004) {
    queryParams.state = "state >= 40";
  }
  setType();
  const paramsData = getQueryParamsData();
  if (paramsData) {
    const now = /* @__PURE__ */ new Date();
    const cnDateStr = now.toLocaleDateString("zh-CN");
    Object.assign(queryParams, JSON.parse(paramsData));
    queryParams.orgRoleCodes = userInfo.members.orgRoleCodes;
    if (queryParams.cacheTime == void 0 || queryParams.cacheTime == "") {
      queryParams.cacheTime = cnDateStr;
    } else {
      const cachedata = queryParams.cacheTime;
      if (cachedata != cnDateStr) {
        queryParams.keywords = "";
        queryParams.createTime = null;
        queryParams.day = "no";
        queryParams.cacheTime = cnDateStr;
      }
    }
    if (queryParams.day == "oneDay") {
      handleOnChange("oneDay");
    } else {
      handleQuery();
    }
  } else {
    handleOnChange("no");
  }
});
</script>

<style lang="scss" scoped>
.ecmbody {
  display: flex;
  flex-flow: column;
  width: 1220px;
  margin: 0 auto;
  padding-top: 20px;
  justify-content: space-between;

  .ecmbodys {
    display: flex;
    width: 1220px;
    margin: 0 auto;
    line-height: 100%;
    letter-spacing: 0%;
    justify-content: space-between;

    .ecmbody-left {
      display: flex;
      flex-flow: column;
      width: 730px;
      line-height: 30px;

      .ecmbody-left-top {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .ecmbody-left-top1 {
          display: flex;
          width: auto;
          font-weight: 700;
          font-style: Bold;
          font-size: 17px;
          color: #333f48;
        }

        .ecmbody-left-top2 {
          display: flex;
          font-family: Roboto;
          font-weight: 400;
          font-size: 13px;
          line-height: 100%;
          color: #503c3c;
          cursor: pointer;
          padding-top: 5px;
        }
      }

      .ecmbody-left-content {
        width: 100%;
        height: 645px;
        opacity: 1;
        border-width: 0.5px;
        border-radius: 6px;
        border: 0.5px solid #c5d1dc;
        padding: 10px;
        background-color: #ffffff;
        margin-top: 12px;
      }
      .ecmbody-left-contents {
        width: 100%;
        height: 638px;
        opacity: 1;
        border-width: 0.5px;
        border-radius: 6px;
        border: 0.5px solid #c5d1dc;
        padding: 10px 5px 10px 5px;
        background-color: #ffffff;
        margin-top: 12px;
      }
      .ecmbody-left-content1 {
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: space-between;
        .ecmbody-left-content1-btn {
          display: flex;
          :deep(.el-input) {
            height: 26px;
            font-size: 14px;
            width: 100%;
          }
        }
      }

      .ecmbody-left-content-top {
        display: flex;
        padding-top: 10px;
        width: 100%;
        height: 75px;
        justify-content: space-between;
        gap: 12px;
        flex-flow: wrap;
        overflow: hidden;
        // overflow-x: auto;

        .ecmbody-left-content2-1 {
          display: flex;
          width: 150px;
          min-width: 150px;
          height: 65px;
          border: 0.5px solid #dce9fb;
          border-width: 0.5px;
          border-radius: 6px;
          background-color: #dce9fb;
          cursor: pointer;

          .ecmbody-left-content2-1-1 {
            display: flex;
            flex-flow: column;
            width: 61%;
            padding-left: 25px;
            .ecmbody-left-content2-1-1-value {
              display: flex;
              width: 100%;
              font-weight: 400;
              font-size: 22px;
              font-family: Roboto;
              height: 29px;
              padding-top: 6px;
              font-family: Noto Sans SC;
            }

            .ecmbody-left-content2-1-1-name {
              display: flex;
              font-weight: 400;
              font-size: 16px;
              //color: #333f48;
              color: #483f3f;
              height: auto;
              font-family: Noto Sans SC;
              overflow: hidden;
            }
          }

          .ecmbody-left-content2-1-2 {
            display: flex;
            width: 39%;
            .ecmbody-left-content2-1-2-img {
              display: flex;
              width: 30px;
              align-items: center;

              img {
                width: 30px;
                height: 30px;
              }
            }
          }
        }

        .ecmbody-left-content2-2 {
          display: flex;
          padding-top: 15px;
          width: 20%;
          height: 65px;
          border: 0.5px solid #dce9fb;
          border-width: 0.5px;
          border-radius: 6px;
          background-color: #dce9fb;

          .ecmbody-left-content2-1-1 {
            display: flex;
            flex-flow: column;
            width: 40%;
            font-weight: 400;
            font-size: 16px;
            padding-left: 10px;
            height: 50px;

            .ecmbody-left-content2-1-1-img {
              display: flex;
              width: 100%;
              height: 20px;
            }

            .ecmbody-left-content2-1-1-txt {
              display: flex;
              font-weight: 400;
              font-size: 16px;
              color: #333f48;
              height: 26px;
              align-items: center;
              width: 100%;
            }
          }

          .ecmbody-left-content2-2-2 {
            display: flex;
            width: 60%;
            font-weight: 400;
            font-size: 36px;
            line-height: 100%;
            letter-spacing: 0%;
            color: #1d6b61;
            padding-top: 2%;
          }
        }

        .ecmbody-left-content2-3 {
          display: flex;
          padding-top: 15px;
          width: 20%;
          height: 65px;
          border: 0.5px solid #dce9fb;
          border-width: 0.5px;
          border-radius: 6px;
          background-color: #dce9fb;

          .ecmbody-left-content2-1-1 {
            display: flex;
            flex-flow: column;
            width: 40%;
            font-weight: 400;
            font-size: 16px;
            padding-left: 10px;
            height: 50px;

            .ecmbody-left-content2-1-1-img {
              display: flex;
              width: 100%;
              height: 20px;
            }

            .ecmbody-left-content2-1-1-txt {
              display: flex;
              font-weight: 400;
              font-size: 16px;
              color: #333f48;
              height: 26px;
              align-items: center;
              width: 100%;
            }
          }

          .ecmbody-left-content2-3-2 {
            display: flex;
            width: 60%;
            font-weight: 400;
            font-size: 36px;
            line-height: 100%;
            letter-spacing: 0%;
            color: #c85b20;
            padding-top: 2%;
          }
        }

        .ecmbody-left-content2-4 {
          display: flex;
          padding-top: 15px;
          width: 20%;
          height: 65px;
          border: 0.5px solid #dce9fb;
          border-width: 0.5px;
          border-radius: 6px;
          background-color: #dce9fb;

          .ecmbody-left-content2-1-1 {
            display: flex;
            flex-flow: column;
            width: 40%;
            font-weight: 400;
            font-size: 16px;
            padding-left: 10px;
            height: 50px;

            .ecmbody-left-content2-1-1-img {
              display: flex;
              width: 100%;
              height: 20px;
            }

            .ecmbody-left-content2-1-1-txt {
              display: flex;
              font-weight: 400;
              font-size: 16px;
              color: #333f48;
              height: 26px;
              align-items: center;
              width: 100%;
            }
          }

          .ecmbody-left-content2-4-2 {
            display: flex;
            width: 60%;
            font-weight: 400;
            font-size: 36px;
            line-height: 100%;
            letter-spacing: 0%;
            color: #27781b;
            padding-top: 2%;
          }
        }
      }
      .ecmbody-left-content-tops {
        display: flex;
        padding-top: 10px;
        width: 100%;
        height: auto;
        justify-content: space-between;
        gap: 12px;
        flex-flow: wrap;
        // overflow-x: auto;

        .ecmbody-left-content2-1 {
          display: flex;
          width: 150px;
          min-width: 150px;
          height: 65px;
          border: 0.5px solid #dce9fb;
          border-width: 0.5px;
          border-radius: 6px;
          background-color: #dce9fb;
          cursor: pointer;

          .ecmbody-left-content2-1-1 {
            display: flex;
            flex-flow: column;
            width: 61%;
            padding-left: 25px;
            .ecmbody-left-content2-1-1-value {
              display: flex;
              width: 100%;
              font-weight: 400;
              font-size: 22px;
              font-family: Roboto;
              height: 29px;
              padding-top: 6px;
              font-family: Noto Sans SC;
            }

            .ecmbody-left-content2-1-1-name {
              display: flex;
              font-weight: 400;
              font-size: 16px;
              color: #483f3f;
              height: auto;
              font-family: Noto Sans SC;
              overflow: hidden;
            }
          }

          .ecmbody-left-content2-1-2 {
            display: flex;
            width: 39%;
            .ecmbody-left-content2-1-2-img {
              display: flex;
              width: 30px;
              align-items: center;

              img {
                width: 30px;
                height: 30px;
              }
            }
          }
        }
      }
      .ecmbody-left-content-xiala {
        display: flex;
        width: 100%;
        height: 7px;
        align-items: stretch;
        justify-content: end;
        cursor: pointer;
      }
      .ecmbody-left-content2 {
        width: 100%;
        height: 40px;
        font-family: Roboto;
        font-weight: 400;
        font-size: 15px;
        line-height: 40px;
        color: #757575;

        span {
          color: #222428;
        }
      }

      .ecmbody-left-content3 {
        display: flex;
        padding-top: 1px;
        width: 100%;
        height: 547px;
        flex-flow: column;
        overflow: hidden;
        overflow-y: scroll;
        .ecmbody-left-content3-title {
          display: flex;

          .ecmbody-left-content3-title-1 {
            width: 8px;
            height: 15px;
            opacity: 1;
            color: #ffffff;
          }

          span {
            font-size: 16px;
            padding-top: 1px;
            color: #ffffff;
          }
        }

        .ecmbody-left-content3-page {
          display: flex;
          width: 100%;
          justify-content: center;
        }
        :deep(.el-table__body) {
          background-color: #ffffff;
        }
        :deep(.el-table td.el-table__cell) {
          box-sizing: border-box;
          color: #000;
        }
        :deep(.el-table tr) {
          background-color: #ffffff;
        }
        :deep(.el-table__row.custom-selected-row),
        :deep(.el-table__row--current) {
          background-color: #90b3fa !important;
          color: #90b3fa !important;
        }
        .nr-txt {
          cursor: pointer;
        }
        :deep(.el-table) {
          --el-table-row-hover-bg-color: #90b3fa;
          --el-table-border: 1px solid #ffffff;
        }
        .custom-table :deep .el-table__header th {
          background-color: #5094f5;
        }
      }

      :deep(.el-table__header-wrapper) {
        display: flex;
        align-items: center;
        height: 39px;
        overflow: hidden;
      }

      :deep(.el-table tr) {
        // background-color: #ecf1f7;
        height: 46px;
      }

      // :deep(.el-table th) {
      //   // background-color: #d5e1ed;
      //   height: 30px;
      //   overflow: hidden;
      // }

      :deep(.el-button--primary) {
        background-color: #5094f5;
        border: 1px solid #5094f5;
      }

      :deep(.el-table tr) {
        // background-color: #e9f0f5;
        font-size: 16px;
        cursor: pointer;
      }
      :deep(.el-table--default .cell) {
        padding: 0 4px;
      }
      :deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
        background-color: #e9f0f5;
      }
      :deep(.el-table) {
        --el-table-row-hover-bg-color: #e9f0f5;
        --el-table-border: 1px solid #ffffff;
      }
      :deep(.cell) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      :deep(.pagination) {
        padding: 10px 8px 5px 8px;
      }

      :deep(.el-pagination--small span:not([class*="suffix"])) {
        font-size: 16px;
      }
      :deep(.custom-table .el-table__body tr:hover > td) {
        background-color: #90b3fa !important; /* 浅橙色示例 */
      }
      :deep(.el-table__body tr.current-row > td) {
        background: #90b3fa !important;
        color: #fff;
        cursor: pointer;
      }
    }

    .ecmbody-right {
      display: flex;
      width: 460px;
      flex-flow: column;

      .ecmbody-right-top {
        display: flex;
        height: 39px;
        background-color: #333f48;
        width: 100%;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-width: 1px;
        justify-content: center;
        align-items: center;

        span {
          width: 77px;
          height: 19px;
          font-weight: 700;
          font-style: Bold;
          font-size: 16px;
          text-align: center;
          color: #ffffff;
        }
      }

      .ecmbody-right-content {
        display: flex;
        width: 100%;
        height: 300px;
        border-width: 0.5px;
        border: 0.5px solid #c5d1dc;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        padding: 10px;
        background-color: #ffffff;
      }
    }
  }

  .ecmbody-zhanwei {
    display: flex;
    width: 1220px;
    height: 50px;
  }
  .ecmbogy-zsname {
    width: 160px;
    font-size: 14px;
  }
  .ecmbogy-zsnames {
    width: 250px;
    font-size: 14px;
  }
}
</style>
