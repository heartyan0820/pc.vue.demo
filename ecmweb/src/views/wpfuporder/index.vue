<template>
  <div class="upttooh">
    <div class="upt_tooh">
      <ToothPosition
        v-if="isDisplay"
        ref="childRef"
        :key="classKey"
        :isLongMa="isLongMa"
        :classList="classList"
        :isClassValue="isClassValue"
        :factoryId="pitemFactoryId"
        :classNoList="classNoList"
        :toothValue="orderToothForm"
        :options="options"
        :colorData="colorData"
        :orderMl="orderMl"
        :isMenuDisplay="isMenuDisplay"
        @setToothValue="setToothValue"
        @setClassValue="setClassValue"
        @setClassClose="setClassClose"
        @setColorValue="setColorValue"
        @setNoClass="setNoClass"
      />
    </div>
    <div v-if="cache == undefined" class="upt_btn">
      <el-button @click="noup">取消</el-button>
      <el-button type="primary" @click="okup">确认</el-button>
    </div>
  </div>
</template>
<script setup>defineOptions({
  name: "uporder",
  inheritAttrs: true
});
import ProductAPI from "@/api/basic/product";
import ClassAPI from "@/api/dentalProductItemClassify";
import OrderAPI from "@/api/order";
import OrdersAPI from "@/api/orders";
import ColorAPI from "@/api/basic/color";
import { setWpfOrder, getWpfOrder, clearWpfOrder } from "@/utils/auth";
const route = useRoute();
const orderid = ref(route.query.orderid);
const projectid = ref(route.query.projectid);
const delid = ref(route.query.makeIds);
const cache = ref(route.query.clearCache);
const color = ref(route.query.color);
if (cache.value != void 0 && cache.value != "") {
  clearWpfOrder();
}
const isDisplay = ref(false);
const classKey = ref(1);
const isLongMa = ref(false);
const isClassValue = ref(1);
const pitemFactoryId = ref(0);
const orderToothForm = ref([]);
const options = ref([]);
const isMenuDisplay = ref(false);
const orderMl = ref([]);
const oldisClassValue = ref(0);
const oldclassList = ref([]);
const classList = ref([]);
const classNoList = ref([]);
const classAllList = ref([]);
const orderNewForm = ref([
  {
    A: [],
    B: [],
    C: [],
    D: [],
    Model: "",
    Remarks: "",
    orderProductName: "",
    orderProduct: 0,
    id: 0,
    Number: 1,
    WgColor1: "",
    WgColor2: "",
    WgColor3: ""
  }
]);
const orderForm = reactive({
  autoOrderNo: true,
  makes: [
    {
      orderId: 0,
      barcode: "",
      details: []
    }
  ],
  tipMessage: "",
  isTests: ""
});
const ToothParams = reactive({
  tooths: []
});
const productParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  factoryId: 0,
  classifyId: 0
});
const queryParams = reactive({
  orderId: orderid.value ? parseInt(orderid.value) : 0
});
const queryParames = reactive({
  pageIndex: 1,
  pageSize: 50,
  visible: true,
  isRelation: true,
  pitemFactoryId: 0
});
const colorParams = reactive({
  pageIndex: 1,
  pageSize: 100
});
const ToothsParams = reactive({
  orderId: 0,
  creationTime: null,
  factoryId: 0,
  customerId: 0,
  patientName: "",
  details: []
});
const colorData = reactive({
  Color1: "",
  Color2: "",
  Color3: ""
});
function okup() {
  const b = up();
  if (b) {
    setOrder();
  }
}
function up() {
  let isChecked = false;
  let message = "";
  var danGuan = [];
  var lianGuan = [];
  orderToothForm.value.some((a) => {
    const from = a.value;
    if (from.orderProduct == 0) {
      message = `请先选择${from.jtTitle}加工项目!`;
      isChecked = true;
      return true;
    }
    if (from.teethMode > 0 && from.A.length == 0 && from.B.length == 0 && from.C.length == 0 && from.D.length == 0) {
      message = `请先选择${from.jtTitle}牙位图!`;
      isChecked = true;
      return true;
    }
    if ((from.hasType == 10 || from.hasType == 20 || from.hasType == 30) && from.Model == "") {
      const xhLabel = from.XingHao.map((b) => b.label);
      message = `请选择${from.jtTitle}${xhLabel}!`;
      if (xhLabel.length == 0) {
        message = `请选择${from.jtTitle}型号!`;
      }
      isChecked = true;
      return true;
    }
    if (from.isColor == true && from.Color1 == "" && from.Color2 == "" && from.Color3 == "") {
      message = `请选择${from.jtTitle}颜色!`;
      isChecked = true;
      return true;
    }
    const classFrom = classList.value.filter((b) => b.ids == a.name);
    const okClass = classFrom[0].relationChildren;
    const isAdditional = from.isAdditional;
    if (classFrom.length > 0 && okClass.length > 0 && isAdditional) {
      if (from.orderWgProduct == 0) {
        message = `请先选择${from.WgTitle}加工项目!`;
        isChecked = true;
        return true;
      }
      if (from.teethWgMode > 0 && from.WA.length == 0 && from.WB.length == 0 && from.WC.length == 0 && from.WD.length == 0) {
        message = `请先选择${from.WgTitle}牙位图!`;
        isChecked = true;
        return true;
      }
      if ((from.hasWgType == 10 || from.hasWgType == 20 || from.hasWgType == 30) && from.WgModel == "") {
        const xhWgLabel = from.WgXingHao.map((b) => b.label);
        message = `请选择${from.WgTitle}${xhWgLabel}!`;
        if (xhWgLabel.length == 0) {
          message = `请选择${from.jtTitle}型号!`;
        }
        isChecked = true;
        return true;
      }
      if (from.isWgColor == true && from.WgColor1 == "" && from.WgColor2 == "" && from.WgColor3 == "") {
        message = `请选择${from.WgTitle}颜色!`;
        isChecked = true;
        return true;
      }
    }
    from.WgXingHao.forEach((x) => {
      if (x.label == "单冠") {
        if (x.A) {
          x.A.length > 0 ? danGuan.push(x.A) : "";
        }
        if (x.B) {
          x.B.length > 0 ? danGuan.push(x.B) : "";
        }
        if (x.C) {
          x.C.length > 0 ? danGuan.push(x.C) : "";
        }
        if (x.D) {
          x.D.length > 0 ? danGuan.push(x.D) : "";
        }
      }
      if (x.label == "连冠") {
        if (x.A) {
          x.A.length > 0 ? lianGuan.push(x.A) : "";
        }
        if (x.B) {
          x.B.length > 0 ? lianGuan.push(x.B) : "";
        }
        if (x.C) {
          x.C.length > 0 ? lianGuan.push(x.C) : "";
        }
        if (x.D) {
          x.D.length > 0 ? lianGuan.push(x.D) : "";
        }
      }
    });
  });
  if (isChecked) {
    ElNotification({
      title: "Error",
      message: `${message}`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  return true;
}
function setToothValue(item) {
}
function setClassValue(v) {
  isClassValue.value = v;
  classKey.value += 1;
}
function setClassClose(item) {
  if (classList.value.length == 1) {
    ElNotification({
      title: "Error",
      message: "请至少保留一个分类",
      type: "error",
      duration: 3e3
    });
    isClassValue.value = classList.value[0].value;
    return;
  }
  const newClassList = classList.value.filter((a) => a.ids != item.ids);
  classList.value = newClassList;
  oldclassList.value = JSON.parse(JSON.stringify(newClassList));
  isClassValue.value = newClassList[0].ids;
  const id = item.ids;
  item.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
  const newToothList = orderToothForm.value.filter((a) => a.name != id);
  orderToothForm.value = newToothList;
  classKey.value += 1;
}
function setNoClass(item) {
  let items = Object.assign({}, item);
  items.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
  classList.value.push(items);
  isClassValue.value = items.ids;
  addToothValue(items, "default");
  classKey.value += 1;
}
function addToothValue(data, v) {
  let tooths = {};
  const tooth = {
    A: [],
    B: [],
    C: [],
    D: [],
    Selected: [],
    Model: "",
    Remarks: "",
    WA: [],
    WB: [],
    WC: [],
    WD: [],
    type: "",
    WSelected: [],
    XingHao: [],
    childrenXingHao: [],
    productItemClassifyId: 0,
    productItemClassifyWgId: 0,
    Color1: "",
    Color2: "",
    Color3: "",
    jtTitle: "",
    hasType: 0,
    teethMode: 20,
    isColor: false,
    DanGuan: [],
    LianGuan: [],
    orderWgNameProduct: "",
    orderProductName: "",
    orderProduct: 0,
    orderWgProduct: 0,
    WgModel: "",
    WgRemarks: "",
    WgTitle: "",
    isModel: false,
    isWgModel: false,
    id: 0,
    isAdditional: true,
    hasWgType: 0,
    selectedButton: 0,
    WgselectedButton: 0,
    WgColor1: "",
    WgColor2: "",
    WgColor3: "",
    WgXingHao: [],
    childrenWgXingHao: [],
    isWgColor: false,
    teethWgMode: 20,
    lx: "default"
  };
  tooths.name = data.ids;
  if (v != "default") {
    tooth.orderProduct = v;
  }
  tooths.value = tooth;
  orderToothForm.value.push(tooths);
}
function initColorChange() {
  ColorAPI.getPage(colorParams).then((data) => {
    data.list.forEach((a) => {
      a.label = a.name;
      a.value = a.code;
    });
    options.value = data.list;
  });
}
function upOrder(row) {
  isMenuDisplay.value = false;
  getClass(row);
}
async function handleQuery() {
  const orderInfo = getWpfOrder();
  if (orderInfo == "") {
    await OrdersAPI.getOrder(queryParams).then((data) => {
      Object.assign(orderForm, data);
    });
  } else {
    const json = JSON.parse(orderInfo);
    Object.assign(orderForm, json);
  }
  let arr = [];
  if (color.value != void 0) {
    orderForm.color1 = color.value;
  }
  if (cache.value == void 0) {
    const details = delid.value.split(",");
    orderForm.makes[0].details.forEach((a) => {
      a.XhModel = a.ptypeName;
      const bo = details.includes(a.id.toString());
      if (bo === false) {
        arr.push(a);
      }
    });
    arr.forEach((b) => {
      delOrder(b);
    });
    const info = orderForm.makes[0].details.filter((a) => {
      return a.id == projectid.value;
    });
    if (info.length > 0) {
      upOrder(info[0]);
    }
  }
}
function getClass(row) {
  queryParames.pitemFactoryId = orderForm.pitemFactoryId;
  pitemFactoryId.value = orderForm.pitemFactoryId;
  ClassAPI.getList(queryParames).then((data) => {
    classList.value = [];
    classNoList.value = [];
    if (data.length > 0) {
      data.forEach((a) => {
        a.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
      });
      classNoList.value = [...data];
      classAllList.value = data;
      getToohs(row);
    }
  });
}
async function getToohs(row) {
  let tooharr = [];
  let newclass = [];
  let index = 0;
  let neworder = groupByField(orderForm.makes[0].details, "tabIndex");
  const asyncTaskList = [];
  Object.keys(neworder).forEach(async (tabIndex) => {
    const singleAsyncTask = async () => {
      const details = neworder[tabIndex];
      const class1 = classAllList.value.filter((a) => a.value == details[0].pitemClassTabId);
      let objclass = JSON.parse(JSON.stringify(class1));
      let tooh = {
        name: "",
        value: {}
      };
      objclass[0].ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
      tooh.name = objclass[0].ids;
      let v = {
        A: [],
        B: [],
        C: [],
        D: [],
        Selected: [],
        Model: "",
        Remarks: "",
        type: "",
        WA: [],
        WB: [],
        WC: [],
        WD: [],
        Color1: "",
        Color2: "",
        Color3: "",
        jtTitle: "",
        hasType: 0,
        teethMode: 10,
        isColor: false,
        WSelected: [],
        XingHao: [],
        childrenXingHao: [],
        productItemClassifyId: 0,
        productItemClassifyWgId: 0,
        orderWgNameProduct: "",
        orderProductName: "",
        orderProduct: 0,
        orderWgProduct: 0,
        WgModel: "",
        WgRemarks: "",
        WgTitle: "",
        isModel: false,
        isWgModel: false,
        id: 0,
        isAdditional: true,
        hasWgType: 0,
        selectedButton: 0,
        WgselectedButton: 0,
        WgColor1: "",
        WgColor2: "",
        WgColor3: "",
        WgXingHao: [],
        childrenWgXingHao: [],
        isWgColor: false,
        teethWgMode: 0,
        lx: "default",
        orderNameProduct: "",
        amountMode: 0
      };
      if (class1.length > 0) {
        for (const item of details) {
          if (item.pitemType == 0) {
            v.orderNameProduct = item.pitemName;
            v.productItemClassifyId = item.pitemClassId;
            v.orderProductName = item.pitemName;
            v.orderProduct = item.pitemId;
            if (item.teeth1A != "") {
              let A1 = generateSequence(item.teeth1A);
              if (v.A.length > 0) {
                v.A = Array.from(new Set(v.A.concat(A1))).sort().reverse();
              } else {
                v.A = [...A1];
              }
            }
            if (item.teeth1B != "") {
              let B1 = generateSequence(item.teeth1B);
              if (v.B.length > 0) {
                v.B = Array.from(new Set(v.B.concat(B1))).sort();
              } else {
                v.B = [...B1];
              }
            }
            if (item.teeth1C != "") {
              let C1 = generateSequence(item.teeth1C);
              if (v.C.length > 0) {
                v.C = Array.from(new Set(v.C.concat(C1))).sort().reverse();
              } else {
                v.C = [...C1];
              }
            }
            if (item.teeth1D != "") {
              let D1 = generateSequence(item.teeth1D);
              if (v.D.length > 0) {
                v.D = Array.from(new Set(v.D.concat(D1))).sort();
              } else {
                v.D = [...D1];
              }
            }
            productParams.keywords = "";
            productParams.classifyId = item.pitemClassId;
            productParams.factoryId = orderForm.pitemFactoryId;
            const [result, result1] = await Promise.all([
              ProductAPI.getItemProductPage(productParams),
              ColorAPI.getProductData(item.pitemId).then()
            ]);
            v.hasType = result1.hasType;
            v.teethMode = result1.teethMode;
            v.isColor = result1.isColor;
            v.amountMode = result1.amountMode;
            let xh = result.filter((b) => item.pitemId == b.value);
            if (v.XingHao.length == 0 && xh.length > 0) {
              xh[0].children.forEach((x) => {
                x.A = [];
                x.B = [];
                x.C = [];
                x.D = [];
                if (x.value == item.ptypeId) {
                  if (v.A.length > 0) {
                    let A1 = Array.from(new Set(v.A));
                    let arr = A1.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (v.B.length > 0) {
                    let B1 = Array.from(new Set(v.B));
                    let arr = B1.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (v.C.length > 0) {
                    let C1 = Array.from(new Set(v.C));
                    let arr = C1.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (v.D.length > 0) {
                    let D1 = Array.from(new Set(v.D));
                    let arr = D1.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                  v.Model = {
                    label: x.label,
                    value: x.value
                  };
                }
              });
              v.XingHao = xh[0].children;
            } else {
              v.XingHao.forEach((x) => {
                if (x.value == item.ptypeId) {
                  if (item.teeth1A != "") {
                    let A1 = generateSequence(item.teeth1A);
                    let A11 = Array.from(new Set(A1));
                    let arr = A11.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (item.teeth1B != "") {
                    let B1 = generateSequence(item.teeth1B);
                    let B11 = Array.from(new Set(B1));
                    let arr = B11.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (item.teeth1C != "") {
                    let C1 = generateSequence(item.teeth1C);
                    let C11 = Array.from(new Set(C1));
                    let arr = C11.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (item.teeth1D != "") {
                    let D1 = generateSequence(item.teeth1D);
                    let D11 = Array.from(new Set(D1));
                    let arr = D11.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                }
              });
            }
            if (result1.isColor) {
              v.Color1 = {
                isCustom: false,
                label: orderForm.color1,
                value: orderForm.color1
              };
              colorData.Color1 = orderForm.color1;
            }
            if (item.XhModel != "" && v.Model == "") {
              v.Model = {
                label: item.XhModel,
                value: 0
              };
            }
          }
          if (item.pitemType == 1) {
            v.productItemClassifyWgId = item.pitemClassId;
            v.orderWgNameProduct = item.pitemName;
            v.orderWgProduct = item.pitemId;
            productParams.keywords = "";
            productParams.classifyId = item.pitemClassId;
            productParams.factoryId = orderForm.pitemFactoryId;
            if (item.teeth1A != "") {
              let A1 = generateSequence(item.teeth1A);
              if (v.WA.length > 0) {
                v.WA = Array.from(new Set(v.WA.concat(A1))).sort().reverse();
              } else {
                v.WA = [...A1];
              }
            }
            if (item.teeth1B != "") {
              let B1 = generateSequence(item.teeth1B);
              if (v.WB.length > 0) {
                v.WB = Array.from(new Set(v.WB.concat(B1))).sort();
              } else {
                v.WB = [...B1];
              }
            }
            if (item.teeth1C != "") {
              let C1 = generateSequence(item.teeth1C);
              if (v.WC.length > 0) {
                v.WC = Array.from(new Set(v.WC.concat(C1))).sort().reverse();
              } else {
                v.WC = [...C1];
              }
            }
            if (item.teeth1D != "") {
              let D1 = generateSequence(item.teeth1D);
              if (v.WD.length > 0) {
                v.WD = Array.from(new Set(v.WD.concat(D1))).sort();
              } else {
                v.WD = [...D1];
              }
            }
            const [result, result1] = await Promise.all([
              ProductAPI.getItemProductPage(productParams),
              ColorAPI.getProductData(item.pitemId).then()
            ]);
            v.hasWgType = result1.hasType;
            v.teethWgMode = result1.teethMode;
            v.amountWgMode = result1.amountMode;
            v.isWgColor = result1.isColor;
            let xh = result.filter((b) => item.pitemId == b.value);
            if (v.WgXingHao.length == 0 && xh.length > 0) {
              xh[0].children.forEach((x) => {
                x.A = [];
                x.B = [];
                x.C = [];
                x.D = [];
                if (x.value == item.ptypeId) {
                  if (v.WA.length > 0) {
                    let A1 = Array.from(new Set(v.WA));
                    let arr = A1.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (v.WB.length > 0) {
                    let B1 = Array.from(new Set(v.WB));
                    let arr = B1.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (v.WC.length > 0) {
                    let C1 = Array.from(new Set(v.WC));
                    let arr = C1.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (v.WD.length > 0) {
                    let D1 = Array.from(new Set(v.WD));
                    let arr = D1.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                  v.WgModel = {
                    label: x.label,
                    value: x.value
                  };
                }
              });
              v.WgXingHao = xh[0].children;
            } else {
              v.WgXingHao.forEach((x) => {
                if (x.value == item.ptypeId) {
                  if (item.teeth1A != "") {
                    let A1 = generateSequence(item.teeth1A);
                    let A11 = Array.from(new Set(A1));
                    let arr = A11.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (item.teeth1B != "") {
                    let B1 = generateSequence(item.teeth1B);
                    let B11 = Array.from(new Set(B1));
                    let arr = B11.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (item.teeth1C != "") {
                    let C1 = generateSequence(item.teeth1C);
                    let C11 = Array.from(new Set(C1));
                    let arr = C11.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (item.teeth1D != "") {
                    let D1 = generateSequence(item.teeth1D);
                    let D11 = Array.from(new Set(D1));
                    let arr = D11.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                }
              });
            }
            if (result1.isColor) {
              v.WgColor1 = {
                label: orderForm.color1,
                value: orderForm.color1
              };
              colorData.Color1 = orderForm.color1;
            }
            if (item.XhModel != "" && v.WgModel == "") {
              v.WgModel = {
                label: item.XhModel,
                value: 0
              };
            }
          }
          if (item.tabIndex == row.tabIndex) {
            index = tooh.name;
          }
        }
      }
      tooh.value = v;
      tooharr.push(tooh);
      newclass.push(objclass[0]);
    };
    asyncTaskList.push(singleAsyncTask());
  });
  await Promise.all(asyncTaskList);
  if (tooharr.length > 0) {
    orderToothForm.value = tooharr;
    classList.value = [...newclass];
    isClassValue.value = parseInt(index);
    oldisClassValue.value = parseInt(index);
    classKey.value += 1;
    isDisplay.value = true;
  }
}
const generateSequence = (inputStr) => {
  let sequence = [];
  let sparr = inputStr.split(",");
  sparr.forEach((inputStr2) => {
    if (!inputStr2.includes("-")) {
      sequence.push(Number(inputStr2));
      return;
    }
    const [startStr, endStr] = inputStr2.split("-");
    const start = Number(startStr);
    const end = Number(endStr);
    if (isNaN(start) || isNaN(end)) {
      ElNotification({
        title: "Error",
        message: `请输入有效的数字!`,
        type: "error",
        duration: 3e3
      });
      return;
    }
    if (start > end) {
      for (let i = start; i >= end; i--) {
        sequence.push(i);
      }
    } else {
      for (let i = start; i <= end; i++) {
        sequence.push(i);
      }
    }
  });
  return sequence;
};
function setColorValue(v, name) {
  onColorChange(v, name);
}
const groupByField = (arr, field) => {
  if (!Array.isArray(arr) || !field) return {};
  return arr.reduce((result, current) => {
    const key = current[field];
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(current);
    return result;
  }, {});
};
function onColorChange(v, name) {
  orderToothForm.value.forEach((b) => {
    if (name == "Color1" || name == "WgColor1") {
      if (b.value.isColor && b.value.orderProduct > 0) {
        b.value.Color1 = v == void 0 ? "" : v;
      }
      if (b.value.isWgColor && b.value.orderWgProduct > 0) {
        b.value.WgColor1 = v == void 0 ? "" : v;
      }
      colorData.Color1 = v == void 0 ? "" : v;
    }
    if (name == "Color2" || name == "WgColor2") {
      if (b.value.isColor && b.value.orderProduct > 0) {
        b.value.Color2 = v == void 0 ? "" : v;
      }
      if (b.value.isWgColor && b.value.orderWgProduct > 0) {
        b.value.WgColor2 = v == void 0 ? "" : v;
      }
      colorData.Color2 = v == void 0 ? "" : v;
    }
    if (name == "Color3" || name == "WgColor3") {
      if (b.value.isColor && b.value.orderProduct > 0) {
        b.value.Color3 = v == void 0 ? "" : v;
      }
      if (b.value.isWgColor && b.value.orderWgProduct > 0) {
        b.value.WgColor3 = v == void 0 ? "" : v;
      }
      colorData.Color3 = v == void 0 ? "" : v;
    }
  });
}
function noup() {
  onCancel();
}
async function setOrder() {
  orderNewForm.value = [];
  let orderTookMode = [];
  ToothsParams.orderId = 0;
  ToothsParams.factoryId = pitemFactoryId.value;
  ToothsParams.customerId = parseInt(orderForm.customerId);
  ToothsParams.patientName = orderForm.name;
  ToothsParams.creationTime = (/* @__PURE__ */ new Date()).toLocaleString();
  ToothsParams.details = [];
  let i = 0;
  let color1 = "";
  let colors1 = "";
  let color2 = "";
  let color3 = "";
  orderToothForm.value.forEach((a, index) => {
    const order = {
      id: i
    };
    let isOrder = false;
    let desc = "";
    const form = a.value;
    const dl = classList.value.filter((b) => b.ids == a.name);
    if ((form.hasType == 10 || form.hasType == 30) && form.XingHao.length > 0) {
      form.XingHao.forEach((d) => {
        const wgorders = {};
        let desc1 = "";
        let isOrders = false;
        const forms = d;
        if (forms.A.length > 0) {
          forms.A = Array.from(new Set(forms.A));
          let replacedArr = forms.A.map((item) => item.replace(new RegExp("A", "g"), ""));
          replacedArr = replacedArr.sort().reverse();
          wgorders.A = replacedArr.join("");
          desc1 += "A" + wgorders.A.toString();
          isOrders = true;
        }
        if (forms.B.length > 0) {
          forms.B = Array.from(new Set(forms.B));
          let replacedArr = forms.B.map((item) => item.replace(new RegExp("B", "g"), ""));
          replacedArr = replacedArr.sort();
          wgorders.B = replacedArr.join("");
          desc1 += "B" + wgorders.B.toString();
          isOrders = true;
        }
        if (forms.C.length > 0) {
          forms.C = Array.from(new Set(forms.C));
          let replacedArr = forms.C.map((item) => item.replace(new RegExp("C", "g"), ""));
          replacedArr = replacedArr.sort().reverse();
          wgorders.C = replacedArr.join("");
          desc1 += "C" + wgorders.C.toString();
          isOrders = true;
        }
        if (forms.D.length > 0) {
          forms.D = Array.from(new Set(forms.D));
          let replacedArr = forms.D.map((item) => item.replace(new RegExp("D", "g"), ""));
          replacedArr = replacedArr.sort();
          wgorders.D = replacedArr.join("");
          desc1 += "D" + wgorders.D.toString();
          isOrders = true;
        }
        if (isOrders) {
          if (forms.label) {
            wgorders.Model = { value: forms.value, label: forms.label };
            wgorders.xh = forms.label;
            wgorders.XhModel = forms.label;
          }
          wgorders.teethMode = form.teethMode;
          wgorders.isColor = form.isColor;
          wgorders.hasType = form.hasType;
          wgorders.amountMode = form.amountMode;
          if (form.Remarks) {
            wgorders.Remarks = form.Remarks;
          }
          if (form.orderNameProduct) {
            wgorders.orderProductName = form.orderNameProduct;
            if (!wgorders.xh) {
              wgorders.xh = forms.orderNameProduct;
            }
          }
          if (form.orderProduct) {
            wgorders.orderProduct = form.orderProduct;
          }
          if (form.Color1) {
            wgorders.Color1 = form.Color1;
            color1 = form.Color1;
          }
          if (form.Color2) {
            wgorders.Color2 = form.Color2;
            color2 = form.Color2;
          }
          if (form.Color3) {
            wgorders.Color3 = form.Color3;
            color3 = form.Color3;
          }
          if (isOrders) {
            wgorders.hasType = form.hasType;
            wgorders.Number = 1;
            wgorders.id = i;
            wgorders.name = a.name;
            wgorders.type = "jt";
            wgorders.xhOptions = form.XingHao;
            wgorders.oldOrderProduct = form.orderProduct;
            wgorders.productItemClassifyId = form.productItemClassifyId;
            wgorders.tabIndex = index;
            wgorders.pitemType = 0;
            if (dl.length > 0) {
              wgorders.pitemClassTabId = dl[0].value;
            }
            orderNewForm.value.push(wgorders);
            orderTookMode.push({ id: i, mode: form.amountMode, teethValue: desc1 });
            if (form.orderProduct) {
              ToothsParams.details.push({
                id: i,
                pItemId: parseInt(form.orderProduct),
                teethDesc: desc1
              });
            }
            i++;
          }
        }
      });
    } else {
      if (form.A.length > 0) {
        order.A = form.A.join("");
        desc += "A" + form.A.toString();
        isOrder = true;
      }
      if (form.B.length > 0) {
        order.B = form.B.join("");
        desc += "B" + form.B.toString();
        isOrder = true;
      }
      if (form.C.length > 0) {
        order.C = form.C.join("");
        desc += "C" + form.C.toString();
        isOrder = true;
      }
      if (form.D.length > 0) {
        order.D = form.D.join("");
        desc += "D" + form.D.toString();
        isOrder = true;
      }
      if (form.Model) {
        order.Model = form.Model;
        order.xh = form.Model;
        if (form.Model != void 0 && typeof form.Model !== "string") {
          order.XhModel = form.Model.label;
        }
        isOrder = true;
      }
      if (form.Remarks) {
        order.Remarks = form.Remarks;
        isOrder = true;
      }
      if (form.orderNameProduct) {
        order.orderProductName = form.orderNameProduct;
        isOrder = true;
      }
      if (form.orderProduct) {
        order.orderProduct = form.orderProduct;
        isOrder = true;
      }
      if (form.Color1) {
        order.Color1 = form.Color1;
        color1 = form.Color1;
        isOrder = true;
      }
      if (form.Color2) {
        order.Color2 = form.Color2;
        color2 = form.Color2;
        isOrder = true;
      }
      if (form.Color3) {
        order.Color3 = form.Color3;
        color3 = form.Color3;
        isOrder = true;
      }
      if (isOrder) {
        order.hasType = form.hasType;
        order.isColor = form.isColor;
        order.amountMode = form.amountMode;
        order.teethMode = form.teethMode;
        order.Number = 1;
        order.name = a.name;
        order.type = "jt";
        order.oldOrderProduct = form.orderProduct;
        order.xhOptions = form.childrenXingHao;
        order.productItemClassifyId = form.productItemClassifyId;
        order.tabIndex = index;
        order.pitemType = 0;
        if (dl.length > 0) {
          order.pitemClassTabId = dl[0].value;
        }
        orderNewForm.value.push(order);
        orderTookMode.push({ id: order.id, mode: form.amountMode, teethValue: desc });
        if (form.orderProduct) {
          ToothsParams.details.push({
            id: i,
            pItemId: parseInt(form.orderProduct),
            teethDesc: desc
          });
        }
        i++;
      }
    }
    if (form.isAdditional) {
      if (form.hasWgType == 10 && form.WgXingHao.length > 0) {
        form.WgXingHao.forEach((d) => {
          const wgorders = {};
          let desc1 = "";
          let isWgOrders = false;
          const forms = d;
          if (forms.A.length > 0) {
            forms.A = Array.from(new Set(forms.A));
            let replacedArr = forms.A.map((item) => item.replace(new RegExp("A", "g"), ""));
            replacedArr = replacedArr.sort().reverse();
            wgorders.A = replacedArr.join("");
            desc1 += "A" + wgorders.A.toString();
            isWgOrders = true;
          }
          if (forms.B.length > 0) {
            forms.B = Array.from(new Set(forms.B));
            let replacedArr = forms.B.map((item) => item.replace(new RegExp("B", "g"), ""));
            replacedArr = replacedArr.sort();
            wgorders.B = replacedArr.join("");
            desc1 += "B" + wgorders.B.toString();
            isWgOrders = true;
          }
          if (forms.C.length > 0) {
            forms.C = Array.from(new Set(forms.C));
            let replacedArr = forms.C.map((item) => item.replace(new RegExp("C", "g"), ""));
            replacedArr = replacedArr.sort().reverse();
            wgorders.C = replacedArr.join("");
            desc1 += "C" + wgorders.C.toString();
            isWgOrders = true;
          }
          if (forms.D.length > 0) {
            forms.D = Array.from(new Set(forms.D));
            let replacedArr = forms.D.map((item) => item.replace(new RegExp("D", "g"), ""));
            replacedArr = replacedArr.sort();
            wgorders.D = replacedArr.join("");
            desc1 += "D" + wgorders.D.toString();
            isWgOrders = true;
          }
          if (isWgOrders) {
            if (forms.label) {
              wgorders.Model = { value: forms.value, label: forms.label };
              wgorders.xh = forms.label;
              wgorders.XhModel = forms.label;
              isWgOrders = true;
            }
            if (form.teethWgMode > 0) {
              wgorders.teethWgMode = form.teethWgMode;
            }
            if (form.WgRemarks && form.WgRemarks.length > 0) {
              wgorders.Remarks = form.WgRemarks;
            }
            if (form.orderWgNameProduct) {
              wgorders.orderProductName = form.orderWgNameProduct;
              isWgOrders = true;
              if (!wgorders.xh) {
                wgorders.xh = forms.orderWgNameProduct;
              }
            }
            if (form.orderWgProduct) {
              wgorders.orderProduct = form.orderWgProduct;
            }
            if (form.WgColor1) {
              wgorders.WgColor1 = form.WgColor1;
              color1 = form.WgColor1;
              isWgOrders = true;
            }
            if (form.WgColor2) {
              wgorders.WgColor2 = form.WgColor2;
              color2 = form.WgColor2;
              isWgOrders = true;
            }
            if (form.WgColor3) {
              wgorders.WgColor3 = form.WgColor3;
              color3 = form.WgColor3;
              isWgOrders = true;
            }
            if (form.hasWgType) {
              wgorders.hasWgType = form.hasWgType;
            }
            wgorders.isWgColor = form.isWgColor;
            if (form.amountWgMode) {
              wgorders.amountWgMode = form.amountWgMode;
            }
            if (isWgOrders) {
              wgorders.hasType = form.hasWgType == void 0 ? 0 : form.hasWgType;
              wgorders.Number = 1;
              wgorders.id = i;
              wgorders.name = a.name;
              wgorders.type = "wg";
              wgorders.xhOptions = form.WgXingHao;
              wgorders.oldOrderWgProduct = form.orderWgProduct;
              wgorders.productItemClassifyWgId = form.productItemClassifyWgId;
              wgorders.pitemType = 1;
              wgorders.tabIndex = index;
              if (dl.length > 0) {
                wgorders.pitemClassTabId = dl[0].value;
              }
              orderNewForm.value.push(wgorders);
              orderTookMode.push({ id: i, mode: form.amountWgMode, teethValue: desc1 });
              if (form.orderWgProduct) {
                ToothsParams.details.push({
                  id: i,
                  pItemId: parseInt(form.orderWgProduct),
                  teethDesc: desc1
                });
              }
              i++;
            }
          }
        });
      } else {
        let desc2 = "";
        const wgorder = {};
        let isWgOrder = false;
        if (form.WA.length > 0) {
          wgorder.A = form.WA.join("");
          desc2 += "A" + form.WA.toString();
          isWgOrder = true;
        }
        if (form.WB.length > 0) {
          wgorder.B = form.WB.join("");
          desc2 += "B" + form.WB.toString();
          isWgOrder = true;
        }
        if (form.WC.length > 0) {
          wgorder.C = form.WC.join("");
          desc2 += "C" + form.WC.toString();
          isWgOrder = true;
        }
        if (form.WD.length > 0) {
          wgorder.D = form.WD.join("");
          desc2 += "D" + form.WD.toString();
          isWgOrder = true;
        }
        if (form.WgRemarks && form.WgRemarks.length > 0) {
          wgorder.Remarks = form.WgRemarks;
          isWgOrder = true;
        }
        if (form.orderWgNameProduct) {
          wgorder.orderProductName = form.orderWgNameProduct;
          isWgOrder = true;
          if (!wgorder.xh) {
            wgorder.xh = form.orderWgNameProduct;
          }
        }
        if (form.orderWgProduct) {
          wgorder.orderProduct = form.orderWgProduct;
          isWgOrder = true;
        }
        if (form.WgColor1) {
          wgorder.WgColor1 = form.WgColor1;
          color1 = form.WgColor1;
          isWgOrder = true;
        }
        if (form.WgColor2) {
          wgorder.WgColor2 = form.WgColor2;
          color2 = form.WgColor2;
          isWgOrder = true;
        }
        if (form.WgColor3) {
          wgorder.WgColor3 = form.WgColor3;
          color3 = form.WgColor3;
          isWgOrder = true;
        }
        if (form.WgModel) {
          wgorder.Model = form.WgModel;
          wgorder.xh = form.WgModel.label;
          if (form.WgModel != void 0 && typeof form.WgModel !== "string") {
            wgorder.XhModel = form.WgModel.label;
          }
          isWgOrder = true;
        }
        if (form.teethWgMode > 0) {
          wgorder.teethWgMode = form.teethWgMode;
        }
        if (form.hasWgType) {
          wgorder.hasWgType = form.hasWgType;
          isWgOrder = true;
        }
        if (form.amountWgMode) {
          wgorder.amountWgMode = form.amountWgMode;
          isWgOrder = true;
        }
        if (isWgOrder) {
          wgorder.Number = 1;
          wgorder.hasType = form.hasWgType == void 0 ? 0 : form.hasWgType;
          wgorder.id = i;
          wgorder.isWgColor = form.isWgColor;
          wgorder.name = a.name;
          wgorder.type = "wg";
          wgorder.oldOrderWgProduct = form.orderWgProduct;
          wgorder.xhOptions = form.childrenWgXingHao;
          wgorder.productItemClassifyWgId = form.productItemClassifyWgId;
          wgorder.tabIndex = index;
          wgorder.pitemType = 1;
          if (dl.length > 0) {
            wgorder.pitemClassTabId = dl[0].value;
          }
          orderNewForm.value.push(wgorder);
          orderTookMode.push({ id: i, mode: form.amountWgMode, teethValue: desc2 });
          if (form.orderWgProduct) {
            ToothsParams.details.push({
              id: i,
              pItemId: parseInt(form.orderWgProduct),
              teethDesc: desc2
            });
          }
          i++;
        }
      }
    }
  });
  ToothParams.tooths = orderTookMode;
  try {
    const [result, result1] = await Promise.all([
      OrderAPI.CalculateTooth(ToothParams),
      OrderAPI.checkRepeatTooth(ToothsParams)
    ]);
    orderNewForm.value.forEach((a) => {
      const newTooth = result.filter((b) => a.id == b.id);
      if (newTooth.length > 0) {
        a.Number = newTooth[0].mode;
      }
      const newZzTooth = result1.filter((b) => a.id == b.id);
      if (newZzTooth.length > 0) {
        a.makeOptions = newZzTooth[0].prodTypes;
        if (newZzTooth[0].prodTypes.length > 0) {
          a.make = { label: a.makeOptions[0].name, value: a.makeOptions[0].id };
        }
      }
    });
    if (orderNewForm.value.length >= orderForm.makes[0].details.length) {
      let newarr = [];
      orderNewForm.value.forEach((b, i1) => {
        let d = orderForm.makes[0].details[i1];
        if (d) {
          d.XhModel = b.XhModel;
          d.make = b.make;
          d.makeOptions = b.makeOptions;
          d.pitemId = parseInt(b.orderProduct);
          d.pitemName = b.orderProductName;
          d.amount = b.Number;
          d.xhOptions = b.xhOptions;
          d.tabIndex = b.tabIndex;
          d.pitemType = b.pitemType;
          d.pitemClassId = b.productItemClassifyId;
          d.pitemClassTabId = b.pitemClassTabId;
          if (b.type == "wg") {
            d.pitemClassId = b.productItemClassifyWgId;
            d.pitemType = 1;
          }
          if (b.make) {
            if (typeof b.make !== "string") {
              d.prodTypeId = b.make ? parseInt(b.make?.value) : 0;
            } else {
              d.prodTypeId = 0;
            }
          }
          if (b.Model) {
            if (typeof b.Model !== "string") {
              d.ptypeId = b.Model ? parseInt(b.Model?.value) : 0;
            } else {
              d.ptypeId = 0;
            }
            d.ptypeName = b.Model?.label;
          } else {
            d.ptypeId = 0;
            d.ptypeName = "";
          }
          d.teeth1A = "";
          d.teeth1B = "";
          d.teeth1C = "";
          d.teeth1D = "";
          if (b.A != void 0 && b.A) {
            d.teeth1A = formatNumArr(b.A, 0);
          }
          if (b.B != void 0 && b.B) {
            d.teeth1B = formatNumArr(b.B, 1);
          }
          if (b.C != void 0 && b.C) {
            d.teeth1C = formatNumArr(b.C, 0);
          }
          if (b.D != void 0 && b.D) {
            d.teeth1D = formatNumArr(b.D, 1);
          }
          if (b.Color1 != void 0 && typeof b.Color1 !== "string") {
            colors1 = b.Color1.value;
          }
          if (b.WgColor1 != void 0 && typeof b.WgColor1 !== "string") {
            colors1 = b.WgColor1.value;
          }
          newarr.push(d);
        } else {
          let d1 = JSON.parse(JSON.stringify(orderForm.makes[0].details[0]));
          d1.XhModel = b.XhModel;
          d1.make = b.make;
          d1.makeOptions = b.makeOptions;
          d1.pitemId = parseInt(b.orderProduct);
          d1.pitemName = b.orderProductName;
          d1.amount = b.Number;
          d1.xhOptions = b.xhOptions;
          d1.tabIndex = b.tabIndex;
          d1.pitemClassId = b.productItemClassifyId;
          d1.pitemType = b.pitemType;
          if (b.type == "wg") {
            d1.pitemClassId = b.productItemClassifyWgId;
            d1.pitemType = 1;
          }
          d1.pitemClassTabId = b.pitemClassTabId;
          if (b.make) {
            if (typeof b.make !== "string") {
              d1.prodTypeId = b.make ? parseInt(b.make?.value) : 0;
            } else {
              d1.prodTypeId = 0;
            }
          }
          if (b.Model) {
            if (typeof b.Model !== "string") {
              d1.ptypeId = b.Model ? parseInt(b.Model?.value) : 0;
            } else {
              d1.ptypeId = 0;
            }
            d1.ptypeName = b.Model?.label;
          } else {
            d1.ptypeId = 0;
            d1.ptypeName = "";
          }
          const number = Math.floor(Math.random() * 9e5) + 1e5;
          d1.id = d1.id + number;
          d1.teeth1A = "";
          d1.teeth1B = "";
          d1.teeth1C = "";
          d1.teeth1D = "";
          if (b.A != void 0 && b.A) {
            d1.teeth1A = formatNumArr(b.A, 0);
          }
          if (b.B != void 0 && b.B) {
            d1.teeth1B = formatNumArr(b.B, 1);
          }
          if (b.C != void 0 && b.C) {
            d1.teeth1C = formatNumArr(b.C, 0);
          }
          if (b.D != void 0 && b.D) {
            d1.teeth1D = formatNumArr(b.D, 1);
          }
          if (b.Color1 != void 0 && typeof b.Color1 !== "string") {
            colors1 = b.Color1.value;
          }
          if (b.WgColor1 != void 0 && typeof b.WgColor1 !== "string") {
            colors1 = b.WgColor1.value;
          }
          newarr.push(d1);
        }
      });
      orderForm.makes[0].details = newarr.sort((a, b) => {
        if (a.tabIndex !== b.tabIndex) {
          return a.tabIndex - b.tabIndex;
        }
      });
    } else {
      let newarr1 = [];
      orderForm.makes[0].details.forEach((x, i2) => {
        let b = orderNewForm.value[i2];
        if (b) {
          x.XhModel = b.XhModel;
          x.make = b.make;
          x.makeOptions = b.makeOptions;
          x.pitemId = parseInt(b.orderProduct);
          x.pitemName = b.orderProductName;
          x.amount = b.Number;
          x.xhOptions = b.xhOptions;
          x.tabIndex = b.tabIndex;
          x.pitemClassId = b.productItemClassifyId;
          x.pitemType = b.pitemType;
          if (b.type == "wg") {
            x.pitemClassId = b.productItemClassifyWgId;
            x.pitemType = 1;
          }
          x.pitemClassTabId = b.pitemClassTabId;
          if (b.make) {
            if (typeof b.make !== "string") {
              x.prodTypeId = b.make ? parseInt(b.make?.value) : 0;
            } else {
              x.prodTypeId = 0;
            }
          }
          if (b.Model) {
            if (typeof b.Model !== "string") {
              x.ptypeId = b.Model ? parseInt(b.Model?.value) : 0;
            } else {
              x.ptypeId = 0;
            }
            x.ptypeName = b.Model?.label;
          } else {
            x.ptypeId = 0;
            x.ptypeName = "";
          }
          x.teeth1A = "";
          x.teeth1B = "";
          x.teeth1C = "";
          x.teeth1D = "";
          if (b.A != void 0 && b.A) {
            x.teeth1A = formatNumArr(b.A, 0);
          }
          if (b.B != void 0 && b.B) {
            x.teeth1B = formatNumArr(b.B, 1);
          }
          if (b.C != void 0 && b.C) {
            x.teeth1C = formatNumArr(b.C, 0);
          }
          if (b.D != void 0 && b.D) {
            x.teeth1D = formatNumArr(b.D, 1);
          }
          if (b.Color1 != void 0 && typeof b.Color1 !== "string") {
            colors1 = b.Color1.value;
          }
          if (b.WgColor1 != void 0 && typeof b.WgColor1 !== "string") {
            colors1 = b.WgColor1.value;
          }
          newarr1.push(x);
        }
      });
      orderForm.makes[0].details = newarr1.sort((a, b) => {
        if (a.tabIndex !== b.tabIndex) {
          return a.tabIndex - b.tabIndex;
        }
      });
    }
    if (colors1 != "") {
      orderForm.color1 = color1.value;
    } else {
      orderForm.color1 = "";
    }
    const json = JSON.stringify(orderForm);
    setWpfOrder(json);
    onSubmit(json);
  } catch (e) {
    console.log("失败!" + e);
  }
}
const formatNumArr = (arr, v) => {
  if (!arr || arr.length === 0) return "";
  const result = [];
  let tempList = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(arr[i] - arr[i - 1]) === 1) {
      tempList.push(arr[i]);
    } else {
      result.push(handleContinuousList(tempList, v));
      tempList = [arr[i]];
    }
  }
  result.push(handleContinuousList(tempList, v));
  return result.join(",");
};
const handleContinuousList = (list, v) => {
  if (list.length >= 2) {
    const max = Math.max(...list);
    const min = Math.min(...list);
    if (v == 0) {
      return `${max}-${min}`;
    } else {
      return `${min}-${max}`;
    }
  } else {
    return list.join(",");
  }
};
function delOrder(row) {
  const info = orderForm.makes[0].details.filter((a) => {
    return a.id != row.id;
  });
  orderForm.makes[0].details = info.sort((a, b) => {
    if (a.tabIndex !== b.tabIndex) {
      return a.tabIndex - b.tabIndex;
    }
  });
}
onMounted(() => {
  initColorChange();
  handleQuery();
});
</script>
<style scoped>
.upttooh {
  display: flex;
  width: 1220px;
  margin: 0 auto;
  flex-flow: column;
  .upt_tooh {
    margin-top: 20px;
    display: flex;
    width: 1220px;
  }
  .upt_btn {
    display: flex;
    justify-content: end;
    width: 1220px;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
