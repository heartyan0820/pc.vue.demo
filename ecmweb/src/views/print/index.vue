<template>
  <div id="ecmprint" class="ecmprint">
    <div class="ecmprint-top">
      <div class="ecmprint-title">义齿定制工单</div>
      <div class="ecmprint-title-1">
        <span>({{ orderForm.prodTypeName }}一{{ orderForm.prodRangeName }})</span>
      </div>
      <div class="ecmprint-title-2">
        <canvas ref="barcodeCanvas" class="imgcode"></canvas>
      </div>
    </div>

    <div class="ecmprint-title-1">
      <img v-if="orderForm.urgent" src="/images/jiaji.png" height="50px" title="加急" />
    </div>
    <div class="ecmprint-top1">
      <table class="ecmprint-top1-table">
        <tr>
          <td class="ecmprint-top1-table-title">订单号：</td>
          <td class="ecmprint-top1-table-neirong">{{ orderForm.orderNo }}</td>
          <td class="ecmprint-top1-table-title">市场团队：</td>
          <td class="ecmprint-top1-table-neirong">{{ orderForm.operatinCompName }}</td>
          <td class="ecmprint-top1-table-title">业务员：</td>
          <td class="ecmprint-top1-table-neirong">{{ orderForm.salesManName }}</td>
        </tr>
      </table>
    </div>
    <div class="ecmprint-top2">
      <div class="ecmprint-top2-Content">
        <div class="ecmprint-top2-title">
          病例信息
          <span>*</span>
        </div>
        <div>送件单位：{{ orderForm.customerName }}</div>
      </div>
      <div class="ecmprint-top2-Content1">
        <table class="ecmprint-top2-Content1-table">
          <tbody>
            <tr>
              <td class="ecmprint-top1-table-title">患者姓名:</td>
              <td class="ecmprint-top1-table-neirong">{{ orderForm.patientName }}</td>
              <td class="ecmprint-top1-table-title">医生姓名:</td>
              <td class="ecmprint-top1-table-neirong">{{ orderForm.doctorName }}</td>
              <td class="ecmprint-top1-table-title">医生电话:</td>
              <td class="ecmprint-top1-table-neirong">{{ orderForm.doctorMobile }}</td>
            </tr>
            <tr>
              <td class="ecmprint-top1-table-title">设计师:</td>
              <td class="ecmprint-top1-table-neirong">{{ orderForm.designer }}</td>
              <td class="ecmprint-top1-table-title">颜 &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;色:</td>
              <td class="ecmprint-top1-table-neirong">{{ orderForm.color1 }}</td>
              <td class="ecmprint-top1-table-title"></td>
              <td class="ecmprint-top1-table-neirong"></td>
            </tr>
            <tr>
              <td class="ecmprint-top1-table-title">加工厂:</td>
              <td class="ecmprint-top1-table-neirong">{{ orderForm.factoryNames }}</td>
              <td class="ecmprint-top1-table-title"></td>
              <td class="ecmprint-top1-table-neirong"></td>
              <td class="ecmprint-top1-table-title"></td>
              <td class="ecmprint-top1-table-neirong"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="ecmprint-top3">
      <div class="ecmprint-top3-left">
        <div
          v-if="orderForm.prodTypeId == 2 || orderForm.prodTypeId == 4"
          class="ecmprint-top3-left1"
        >
          <div class="ecmprint-top3-left1-1">返工原因:</div>
          <div class="ecmprint-top3-left1-2">{{ orderForm.reworkReason }}</div>
        </div>
        <div v-if="orderForm.prodTypeId == 3" class="ecmprint-top3-left1">
          <div class="ecmprint-top3-left1-1">试回说明:</div>
          <div class="ecmprint-top3-left1-2">{{ orderForm.testBackDescribe }}</div>
        </div>
        <div v-else class="ecmprint-top3-left1">
          <div class="ecmprint-top3-left1-1">医生要求:</div>
          <div class="ecmprint-top3-left1-2">{{ orderForm.doctorRequire }}</div>
        </div>
        <div v-if="orderForm.isBiSe" class="ecmprint-top3-left-pic">有比色照片</div>
        <div v-if="orderForm.isZhiZuo" class="ecmprint-top3-left-pic">有制作照片</div>
        <div class="ecmprint-top3-left1" style="margin-top: 20px">
          <div class="ecmprint-top3-left1-1">沟通结果:</div>
          <div class="ecmprint-top3-left1-2">{{ orderForm.chatResult }}</div>
        </div>
      </div>
      <div class="ecmprint-top3-right">
        <div class="ecmprint-top3-right1">
          <el-divider content-position="left" class="custom-divider">加工项目</el-divider>
          <div class="ecmprint-top3-right1-1">
            <table class="ecmprint-top3-right1-table">
              <tbody>
                <tr v-for="item in orderForm.makes[0].details">
                  <td class="ecmprint-top3-right1-table-neirong">
                    <div class="container">
                      <div class="box1">{{ item.teeth1A }}&nbsp;</div>
                      <div class="box2">{{ item.teeth1B }}&nbsp;</div>
                      <div class="box3">{{ item.teeth1C }}&nbsp;</div>
                      <div class="box4">{{ item.teeth1D }}&nbsp;</div>
                    </div>
                  </td>
                  <td class="ecmprint-top3-right1-table-neirong">
                    {{ item.pitemName }}&nbsp;
                    {{ item.ptypeName ? "(" + item.ptypeName + ")" : "" }}
                    {{ item.prodTypeName != "正做件" ? "," + item.prodTypeName + "" : "" }}
                  </td>
                  <td class="ecmprint-top3-right1-table-neirong">{{ item.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="ecmprint-top3-right2">
          <div class="ecmprint-top3-right2">
            <div v-if="orderForm.noToothReason.length > 0" style="color: red">
              牙位图缺失原因：{{ orderForm.noToothReason }}
            </div>
            <div v-for="(f, index) in fileList" class="ecmprint-top3-right2-img">
              <div class="ecmprint-top3-right2-imgs">
                <img :src="settings.fileurl + f.url" width="600px" />
              </div>
              <div v-if="index == 0" class="ecmprint-top3-right2-dh">{{ dhTitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import settings from "@/settings";
defineOptions({
  name: "ecmprint",
  inheritAttrs: true
});
import OrdersAPI from "@/api/orders";
import JsBarcode from "jsbarcode";
const route = useRoute();
const barcodeCanvas = ref(null);
const orderForm = reactive({
  autoOrderNo: true,
  prodTypeName: "",
  makes: [
    {
      orderId: 0,
      barcode: "",
      details: []
    }
  ],
  noToothReason: "",
  factoryNames: ""
});
const id = ref(route.query.id);
const queryParams = reactive({
  orderId: id.value ? parseInt(id.value) : 0,
  guid: "0000255205"
});
const fileParams = reactive({
  orderId: id.value ? parseInt(id.value) : 0,
  pageSize: 2,
  type: 5
});
const fileList = ref([]);
const dhTitle = ref("");
function Query() {
  OrdersAPI.getdetail(queryParams).then((data) => {
    Object.assign(orderForm, data);
    orderForm.prodTypeName = orderForm.makes[0].details[0]?.prodTypeName;
    if (data.makes[0].factoryId != 0) {
      orderForm.factoryNames = data.makes[0].factoryName;
    } else {
      orderForm.factoryNames = orderForm.factoryName;
    }
    barcode(orderForm.orderNo);
    if (orderForm.hasOppOcc) {
      dhTitle.value = "有对颌";
    } else {
      dhTitle.value = "无对颌";
    }
    window.__PRINT_READY2__ = true;
  }).catch((error) => {
    window.__PRINT_READY2_1__ = JSON.stringify(error);
  });
}
function GetFileImg() {
  OrdersAPI.getFilePage(fileParams).then((data) => {
    data.list.forEach((item) => {
      item.url = item.url.replace("&width=400", "");
    });
    fileList.value = data.list;
    window.__PRINT_READY1__ = true;
  }).catch((error) => {
    window.__PRINT_READY1_1__ = JSON.stringify(error);
  });
}
function barcode(number) {
  if (!number) return;
  const canvas = barcodeCanvas.value;
  JsBarcode(canvas, number, {
    format: "CODE128",
    // 选择条形码格式，例如EAN13, CODE128等
    width: 1,
    // 条形码的宽度
    height: 50,
    // 条形码的高度
    displayValue: false
    // 是否显示文本值
  });
}
onMounted(() => {
  GetFileImg();
  Query();
});
</script>
<style lang="scss" scoped>
.ecmprint {
  display: flex;
  width: 1280px;
  margin: 0 auto;
  flex-flow: column;
  font-family: Noto Sans SC;
  font-size: 24px;
  .ecmprint-top {
    display: flex;
    width: 100%;
    margin: 0 auto;
    flex-flow: column;
    height: 80px;
    .ecmprint-title {
      display: flex;
      width: 100%;
      font-size: 36px;
      align-content: center;
      justify-content: center;
      font-weight: bold;
      letter-spacing: 8px;
    }
    .ecmprint-title-1 {
      display: flex;
      width: 100%;
      font-size: 24px;
      height: 39px;
      line-height: 39px;
      justify-content: center;
    }
    .ecmprint-title-2 {
      display: flex;
      width: 100%;
      justify-content: end;
      position: relative;
      top: -60px;
    }
  }
  .ecmprint-top1 {
    display: flex;
    width: 100%;
    margin: 0 auto;
    height: 60px;
    line-height: 60px;
    font-family: Noto Sans SC;
    .ecmprint-top1-table {
      width: 100%;
      font-family: Noto Sans SC;
      .ecmprint-top1-table-title {
        width: auto;
      }
      .ecmprint-top1-table-neirong {
        width: auto;
        text-align: left;
      }
    }
  }
  .ecmprint-top2 {
    display: flex;
    width: 100%;
    margin: 0 auto;
    height: 180px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    padding: 10px;
    flex-flow: column;
    .ecmprint-top2-Content {
      width: 100%;
      font-family: Noto Sans SC;
      display: flex;
      .ecmprint-top2-title {
        font-size: 24px;
        font-weight: bold;
        width: 150px;
        span {
          color: red;
        }
      }
    }
    .ecmprint-top2-Content1 {
      display: flex;
      width: 100%;
      .ecmprint-top2-Content1-table {
        width: 100%;
        font-family: Noto Sans SC;
        .ecmprint-top1-table-title {
          width: 75px;
          height: 32px;
        }
        .ecmprint-top1-table-neirong {
          width: 180px;
          text-align: left;
        }
      }
    }
  }
  .ecmprint-top3 {
    display: flex;
    width: 100%;
    margin: 0 auto;
    margin-top: 12px;
    justify-content: space-between;
    .ecmprint-top3-left {
      display: flex;
      width: 39%;
      flex-flow: column;
      .ecmprint-top3-left1 {
        width: 100%;
        min-height: 100px;
        .ecmprint-top3-left1-1 {
          border-bottom: 1px solid #dcdfe6;
          height: 33px;
          line-height: 33px;
          color: #303133;
          font-size: 24px;
          font-weight: 600;
        }
        .ecmprint-top3-left1-2 {
          width: 100%;
          font-size: 24px;
        }
      }
      .ecmprint-top3-left-pic {
        width: 100%;
        height: auto;
        color: #f50808;
        font-size: 20px;
      }
    }
    .ecmprint-top3-right {
      display: flex;
      width: 55%;
      flex-flow: column;
      margin-right: 1px;
      .ecmprint-top3-right1 {
        display: flex;
        width: 100%;
        flex-flow: column;
        :deep(.el-divider__text) {
          color: #303133;
          font-size: 24px;
          font-weight: 500;
          padding: 0 20px;
          position: absolute;
        }
        .ecmprint-top3-right1-1 {
          display: flex;
          width: 100%;
          height: auto;
          min-height: 50px;
          border: 1px solid #dcdfe6;
          position: relative;
          top: -24px;
          border-top: none;
          .ecmprint-top3-right1-table {
            width: 100%;
            padding: 12px;
            tr {
              height: 50px;
            }
            .ecmprint-top3-right1-table-neirong {
              font-size: 24px;
              .container {
                display: flex;
                flex-wrap: wrap;
                width: 150px;
                .box1 {
                  flex: 1 0 50%;
                  border-right: 1px solid #eb5757;
                  border-bottom: 1px solid #eb5757;
                  text-align: right;
                  padding-right: 5px;
                }
                .box2 {
                  flex: 1 0 50%;
                  border-bottom: 1px solid #eb5757;
                  padding-left: 5px;
                }
                .box3 {
                  flex: 1 0 50%;
                  text-align: right;
                  border-right: 1px solid #eb5757;
                  padding-right: 5px;
                }
                .box4 {
                  flex: 1 0 50%;
                  padding-left: 5px;
                }
              }
            }
          }
        }
      }
      .ecmprint-top3-right2 {
        display: flex;
        width: 100%;
        flex-flow: wrap;
        justify-content: space-between;
        .ecmprint-top3-right2-img {
          display: flex;
          width: 100%;
          margin: 0px 0px 4px 0px;
          justify-content: center;
          flex-flow: column;
          .ecmprint-top3-right2-dh {
            width: 100%;
            display: flex;
            height: 30px;
            text-align: center;
            color: red;
            justify-content: center;
          }
          .ecmprint-top3-right2-imgs {
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
