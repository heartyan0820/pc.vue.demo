<template>
  <div class="ecmbody-tjcontents">
    <div class="ecmbody-tjcontents-right-top">订单统计</div>
    <el-divider />
    <div class="ecmbody-tjcontents-right-top2">
      <span>订单统计信息</span>
      <div class="ecmbody-tjcontents-right-top2-rz">
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          default-value="third"
          @tab-change="handleTabChange"
        >
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          ></el-tab-pane>
          <div class="demo-tabs1">
            <div ref="chartRef" style="width: 100%; height: 255px"></div>
            <div class="demo-tabs1-bottom">
              <div v-for="(item, index) in orderSource" :key="index" class="demo-tabs1-bottom1">
                <div class="demo-tabs1-bottom2">
                  <div v-if="index < 2">{{ item[1] }}</div>
                  <div v-else>{{ item[1] }}份/{{ reworkrate }}%</div>
                </div>
                <div class="demo-tabs1-bottom2">
                  <div v-if="index < 2">{{ item[0] }}</div>
                  <div v-else>{{ item[0] }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="demo-tabs1">
            <el-divider content-position="left">用户数量：</el-divider>
            <div class="demo-tabs1-bottom">
              <div class="demo-tabs1-bottom1">
                <div class="demo-tabs1-bottom2">{{ userList.clinics }}</div>
                <div class="demo-tabs1-bottom2">诊所</div>
              </div>
              <div class="demo-tabs1-bottom1">
                <div class="demo-tabs1-bottom2">{{ userList.designers }}</div>
                <div class="demo-tabs1-bottom2">设计师</div>
              </div>
              <div class="demo-tabs1-bottom1">
                <div class="demo-tabs1-bottom2">{{ userList.factorys }}</div>
                <div class="demo-tabs1-bottom2">加工厂</div>
              </div>
            </div>
          </div>
          <div class="demo-tabs1">
            <el-divider content-position="left">运营公司列表：</el-divider>
            <div class="demo-tabs1-bottom-orglist">
              <div
                v-for="(item, index) in orgList"
                :key="index"
                class="demo-tabs1-bottom-list"
                @click="openOrg(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      draggable
      :align-center="true"
      width="800"
      :before-close="
        (a) => {
          handleCloseDialog();
        }
      "
      :close-on-click-modal="false"
      @open="initChart"
      @close="destroyChart"
    >
      <el-tabs
        v-model="activeOrgName"
        class="demo-tabs"
        default-value="third"
        @tab-change="handleOrgTabChange"
      >
        <el-tab-pane
          v-for="tab in org_tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        ></el-tab-pane>
        <div class="demo-tabs1">
          <div ref="chartRefs" style="width: 100%; height: 355px"></div>
          <div class="demo-tabs1-bottom">
            <div v-for="(item, index) in orderOrgSource" :key="index" class="demo-tabs1-bottom1">
              <div class="demo-tabs1-bottom2">
                <div v-if="index < 2">{{ item[1] }}</div>
                <div v-else>{{ item[1] }}份/{{ orgreworkrate }}%</div>
              </div>
              <div class="demo-tabs1-bottom2">
                <div v-if="index < 2">{{ item[0] }}</div>
                <div v-else>{{ item[0] }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>defineOptions({
  name: "orderstat",
  inheritAttrs: false
});
import OrderOrgAPI from "@/api/orgOperation";
import OrdersAPI from "@/api/orders";
import OrgMemberAPI from "@/api/system/orgMember";
import * as echarts from "echarts";
const orgList = ref([]);
const userList = ref({});
const chartRef = ref(null);
const chartRefs = ref(null);
const reworkrate = ref(0);
const orgreworkrate = ref(0);
const dialog = reactive({
  visible: false,
  title: "新增关联机构"
});
let myChart = null;
let myCharts = null;
const tabs = ref([
  { label: "当日", name: "today" },
  { label: "当月", name: "themonth" },
  { label: "今年", name: "theyear" },
  { label: "去年", name: "lastyear" },
  { label: "前年", name: "beforeyear" }
]);
const org_tabs = ref([
  { label: "当日", name: "today" },
  { label: "当月", name: "themonth" },
  { label: "当年", name: "theyear" }
]);
const activeName = ref();
const activeOrgName = ref();
const orderSource = ref([]);
const orderOrgSource = ref([]);
activeName.value = "today";
activeOrgName.value = "today";
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  isDeleted: false
});
const queryClassParams = reactive({
  orderClass: [],
  state: activeName.value,
  operatingcompid: 0,
  className: ["固定修复", "种植修复", "种植导板"]
});
function handleTabChange(val) {
  activeName.value = val;
  queryClassParams.state = val;
  qtinitChart();
}
function handleOrgTabChange(val) {
  activeOrgName.value = val;
  queryClassParams.state = val;
  initChart();
}
const initChart = async () => {
  if (!chartRefs.value) return;
  myCharts = echarts.init(chartRefs.value);
  myCharts.clear();
  myCharts.resize();
  switch (activeOrgName.value) {
    case "today":
      queryClassParams.state = "today";
      await OrdersAPI.getOrderList(queryClassParams).then((data) => {
        var guNumber = 0;
        var zhongZhi = 0;
        var fangong = 0;
        data.forEach((a) => {
          if (a.pitemClassName.indexOf("固定") > -1) {
            guNumber += a.number;
          }
          if (a.pitemClassName.indexOf("种植") > -1) {
            zhongZhi += a.number;
          }
          fangong += a.reworkNumber;
        });
        let source = [
          ["固定", guNumber],
          ["种植", zhongZhi],
          ["返工", fangong]
        ];
        orderOrgSource.value = [...source];
        const fg = fangong / (guNumber + zhongZhi + fangong) * 100;
        if (Number.isNaN(fg)) {
          orgreworkrate.value = 0;
        } else {
          orgreworkrate.value = fg == 0 ? 0 : fg.toFixed(2);
        }
      });
      const option = {
        title: {
          text: "订单趋势统计",
          left: "left"
        },
        legend: {
          bottom: "6%"
        },
        tooltip: {
          trigger: "axis",
          showContent: false
        },
        dataset: {
          source: orderOrgSource.value
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "73%" },
        series: [
          {
            type: "pie",
            id: "pie",
            radius: "55%",
            center: ["50%", "35%"],
            emphasis: {
              focus: "self"
            },
            label: {
              formatter: "{b}: {@2012} ({d}%)"
            }
          }
        ]
      };
      myCharts.setOption(option);
      break;
    case "themonth":
    case "theyear":
      await OrdersAPI.getOrderLists(queryClassParams).then((data) => {
        var guNumber = 0;
        var zhongZhi = 0;
        var fangong = 0;
        let chartData = {
          xAxisData: [],
          orderNumData: []
          // 订单数量
        };
        data.forEach((a) => {
          guNumber += a.gdNumber;
          zhongZhi += a.zzNumber;
          fangong += a.reworkNumber;
          chartData.xAxisData.push(a.day);
          chartData.orderNumData.push(a.gdNumber + a.zzNumber);
        });
        let source = [
          ["固定", guNumber],
          ["种植", zhongZhi],
          ["返工", fangong]
        ];
        orderOrgSource.value = [...source];
        const fg = fangong / (guNumber + zhongZhi + fangong) * 100;
        if (Number.isNaN(fg)) {
          orgreworkrate.value = 0;
        } else {
          orgreworkrate.value = fg == 0 ? 0 : fg.toFixed(2);
        }
        const option2 = {
          height: 220,
          title: {
            text: "订单趋势统计",
            left: "left"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            top: "25%",
            left: "3%",
            right: "4%",
            bottom: "33%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: chartData.xAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "数量",
              type: "bar",
              barWidth: "10",
              data: chartData.orderNumData,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              label: {
                show: true,
                position: "top",
                formatter: (params) => params.value
              }
            }
          ]
        };
        myCharts.setOption(option2);
      });
      break;
  }
};
const qtinitChart = async () => {
  myChart = echarts.init(chartRef.value);
  queryClassParams.state = activeName.value;
  queryClassParams.operatingcompid = 0;
  myChart.clear();
  myChart.resize();
  switch (activeName.value) {
    case "today":
      await OrdersAPI.getOrderList(queryClassParams).then((data) => {
        var guNumber = 0;
        var zhongZhi = 0;
        var fangong = 0;
        data.forEach((a) => {
          if (a.pitemClassName.indexOf("固定") > -1) {
            guNumber += a.number;
          }
          if (a.pitemClassName.indexOf("种植") > -1) {
            zhongZhi += a.number;
          }
          fangong += a.reworkNumber;
        });
        let source = [
          ["固定", guNumber],
          ["种植", zhongZhi],
          ["返工", fangong]
        ];
        orderSource.value = [...source];
        const fg = fangong / (guNumber + zhongZhi + fangong) * 100;
        if (Number.isNaN(fg)) {
          reworkrate.value = 0;
        } else {
          reworkrate.value = fg == 0 ? 0 : fg.toFixed(2);
        }
      });
      const option = {
        title: {
          text: "订单趋势统计",
          left: "left"
        },
        legend: {
          bottom: "12%"
        },
        tooltip: {
          trigger: "axis",
          showContent: false
        },
        dataset: {
          source: orderSource.value
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "73%" },
        series: [
          {
            type: "pie",
            id: "pie",
            radius: "55%",
            center: ["50%", "35%"],
            emphasis: {
              focus: "self"
            },
            label: {
              formatter: "{b}: {@2012} ({d}%)"
            }
          }
        ]
      };
      myChart.setOption(option);
      break;
    case "themonth":
    case "theyear":
    case "lastyear":
    case "beforeyear":
      await OrdersAPI.getOrderLists(queryClassParams).then((data) => {
        var guNumber = 0;
        var zhongZhi = 0;
        var fangong = 0;
        let chartData = {
          xAxisData: [],
          orderNumData: []
          // 订单数量
        };
        data.forEach((a) => {
          guNumber += a.gdNumber;
          zhongZhi += a.zzNumber;
          fangong += a.reworkNumber;
          chartData.xAxisData.push(a.day);
          chartData.orderNumData.push(a.gdNumber + a.zzNumber);
        });
        let source = [
          ["固定", guNumber],
          ["种植", zhongZhi],
          ["返工", fangong]
        ];
        const fg = fangong / (guNumber + zhongZhi + fangong) * 100;
        if (Number.isNaN(fg)) {
          reworkrate.value = 0;
        } else {
          reworkrate.value = fg == 0 ? 0 : fg.toFixed(2);
        }
        orderSource.value = [...source];
        const option2 = {
          height: 180,
          title: {
            text: "订单趋势统计",
            left: "left"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            top: "25%",
            left: "3%",
            right: "4%",
            bottom: "33%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: chartData.xAxisData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "数量",
              type: "bar",
              barWidth: "15",
              data: chartData.orderNumData,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              label: {
                show: true,
                position: "top",
                formatter: (params) => params.value
              }
            }
          ]
        };
        myChart.setOption(option2);
      });
      break;
  }
};
const initOrderOrg = () => {
  OrderOrgAPI.getPage(queryParams).then((data) => {
    orgList.value = data.list;
  });
};
const initOrder = () => {
  OrgMemberAPI.getOrderNumber().then((data) => {
    userList.value = data;
  });
};
function handleCloseDialog() {
  dialog.visible = false;
}
async function openOrg(item) {
  dialog.visible = true;
  dialog.title = item.name;
  queryClassParams.operatingcompid = item.id;
  activeOrgName.value = "today";
}
const destroyChart = () => {
  if (myCharts) {
    myCharts.dispose();
    myCharts = null;
  }
};
onMounted(() => {
  qtinitChart();
  initOrderOrg();
  initOrder();
  window.addEventListener("resize", resizeChart);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  destroyChart();
});
const resizeChart = () => {
  myChart?.resize();
};
</script>

<style lang="scss" scoped>
.ecmbody-tjcontents {
  display: flex;
  width: 100%;
  background-color: #ffffff;
  flex-flow: column;
  .ecmbody-tjcontents-right-top {
    display: flex;
    font-family: Noto Sans SC;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: 0%;
    color: #333f48;
    height: auto;
  }
  .ecmbody-tjcontents-right-top1 {
    display: flex;
    width: 100%;
    .ecmbody-tjcontents-right-top1-left {
      display: flex;
      width: 80%;
      .ecmbody-tjcontents-right-top1-left1 {
        width: auto;
        display: flex;
      }
      .ecmbody-tjcontents-right-top1-left2 {
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
    .ecmbody-tjcontents-right-top1-right {
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
  .ecmbody-tjcontents-right-top2 {
    display: flex;
    width: 100%;
    flex-flow: column;
    span {
      font-family: Noto Sans SC;
      font-weight: 400;
      font-size: 16px;
      color: #757575;
      text-align: left;
    }
    .ecmbody-tjcontents-right-top2-rz {
      display: flex;
      width: 100%;
      margin-top: 1%;
    }
    .demo-tabs1 {
      width: 100%;
      font-size: 16px;
      display: flex;
      flex-flow: column;
      padding: 5px 10px 10px 10px;
      //border-bottom: 1px solid #dcdfe6;
      .demo-tabs1-name {
        display: flex;
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #333f48;
        font-weight: 400;
        font-size: 18px;
        text-align: center;
      }
      .demo-tabs1-bottom {
        display: flex;
        gap: 16px;
        width: 100%;
        height: 75px;
        padding: 12px;
        background: #f5f7fa;
        border-radius: 8px;
        justify-content: space-between;
      }

      .demo-tabs1-bottom1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 12px;
        background: #fff;
        border-radius: 6px;
        color: #333f48;
        flex-flow: column;
        width: 33%;
        .demo-tabs1-bottom2 {
          height: 30px;
        }
      }
      .demo-tabs1-bottom-orglist {
        display: flex; /* 开启 flex 横向排列 */
        flex-wrap: wrap; /* 超出3个自动换行 */
        gap: 15px; /* 项之间的间距（左右+上下），替代margin更简洁 */
        width: 100%; /* 占满父容器宽度 */
        padding: 10px; /* 上下内边距，可选 */
        cursor: pointer;
        color: #333f48;
        background-color: #f5f7fa;
        border-radius: 6px;
      }
      /* 子项：一行显示3个，均分宽度 */
      .demo-tabs1-bottom-list {
        flex: 0 0 calc(33.333% - 10px); /* 关键：3列均分 - 抵消gap的影响 */
        box-sizing: border-box; /* 防止padding/border撑大宽度 */
        padding: 12px 16px; /* 内边距，提升美观度 */
        background: #ffffff; /* 背景色，可选 */
        border-radius: 6px; /* 圆角，可选 */
        text-align: center; /* 文字居中，可选 */
      }
    }
    :deep(.el-tabs--top) {
      flex-direction: column;
      width: 100%;
      font-family: Noto Sans SC;
    }
    :deep(.el-tabs__item) {
      align-items: center;
      box-sizing: border-box;
      color: var(--el-text-color-primary);
      display: flex;
      font-size: var(--el-font-size-base);
      font-weight: 500;
      height: var(--el-tabs-header-height);
      justify-content: center;
      list-style: none;
      padding: 0 20px;
      position: relative;
      font-size: 16px;
    }
  }
  :deep(.el-modal-dialog) {
    .demo-tabs1-bottom {
      display: flex;
      gap: 16px;
      width: 100%;
      height: 75px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 8px;
      justify-content: space-between;
    }

    .demo-tabs1-bottom1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 12px;
      background: #fff;
      border-radius: 6px;
      color: #333f48;
      flex-flow: column;
      width: 33%;
      .demo-tabs1-bottom2 {
        height: 30px;
      }
    }
    .demo-tabs1-bottom-orglist {
      display: flex; /* 开启 flex 横向排列 */
      flex-wrap: wrap; /* 超出3个自动换行 */
      gap: 15px; /* 项之间的间距（左右+上下），替代margin更简洁 */
      width: 100%; /* 占满父容器宽度 */
      padding: 10px; /* 上下内边距，可选 */
      cursor: pointer;
      color: #333f48;
      background-color: #f5f7fa;
      border-radius: 6px;
    }
  }
}
</style>
