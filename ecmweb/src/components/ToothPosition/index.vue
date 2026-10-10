<template>
  <div class="tooth-position">
    <div class="tooth-position-top">
      <div v-if="props.isLongMa" class="tooth-top">
        <div
          v-for="(item, index) in props.classList"
          :key="index"
          :class="isClassValue == item.value ? 'tooth-btn1' : 'tooth-btn2'"
          @click="onClassChange(item.value)"
        >
          {{ item.label }}
          <span title="关闭" @click="onClassClose(item)">
            <el-icon><Close /></el-icon>
          </span>
        </div>
        <div class="tooth-btn3">
          <el-icon title="添加"><Plus /></el-icon>
        </div>
      </div>
      <div v-else class="tooth-top">
        <div class="tooth-btn22">
          <div
            v-for="(item, index) in props.classList"
            :key="index"
            :class="isClassValue == item.ids ? 'tooth-btn1' : 'tooth-btn2'"
            @click="onClassChange(item.value, item.ids)"
          >
            {{ item.label }}
            <span title="关闭" @click="onClassClose(item)">X</span>
          </div>
        </div>
        <div class="tooth-btn3">
          <el-popover placement="bottom" trigger="click" offset="15">
            <template #reference>
              <div class="xm-btn">新增项目</div>
            </template>
            <div
              v-for="(item, index) in props.classNoList"
              :key="index"
              :class="item.label == '泰利斯液态打印氧化锆' ? 'tooth-class1' : 'tooth-class'"
              @click="onAddClass(item)"
            >
              {{ item.label }}
            </div>
          </el-popover>
        </div>
      </div>
      <div v-if="isMenuDisplay" class="tooth-top-right">
        <el-dropdown placement="bottom" @command="handleCommand">
          <el-button>
            切换产品目录
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in orderMl"
                :key="item.value"
                :command="item"
                :disabled="item.value == props.factoryId ? true : false"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="tooth-content">
      <tooth
        ref="toothref"
        :isAdditional="isAdditional"
        :factoryId="props.factoryId"
        :classList="props.classList"
        :toothValue="props.toothValue"
        :isClassValue="props.isClassValue"
        :orderNextClass="orderNextClass"
        :orderNextWgClass="orderNextWgClass"
        :orderNextProduct="orderNextProduct"
        :orderNextWgProduct="orderNextWgProduct"
        :colorData="props.colorData"
        :options="props.options"
        @setToothValue="setToothValue"
        @setClassValue="getDentalProduct"
        @setWgClassValue="getDentalWgProduct"
        @setColorValue="setColorValue"
        @setIsAdditional="setIsAdditional"
        @setFactoryIdValue="setFactoryIdValue"
        @setClassChange="onClassChange"
      />
    </div>
  </div>
</template>

<script setup>
import tooth from "./components/index.vue";
defineOptions({
  name: "toothposition",
  inheritAttrs: false
});
import { number } from "echarts";
import ProductAPI from "@/api/basic/product";
const props = defineProps({
  isLongMa: {
    type: Boolean,
    default: false
  },
  isMenuDisplay: {
    type: Boolean,
    default: false
  },
  classList: {
    type: Array,
    default: []
  },
  classNoList: {
    type: Array,
    default: []
  },
  isClassValue: {
    type: number,
    default: 0
  },
  toothValue: {
    type: Array,
    default: []
  },
  factoryId: {
    type: number,
    default: 0
  },
  colorData: {
    type: Object,
    default: {}
  },
  options: {
    type: Array,
    default: []
  },
  orderMl: {
    type: Array,
    default: []
  }
});
const emit = defineEmits([
  "setClassValue",
  "setClassClose",
  "setNoClass",
  "setToothValue",
  "setColorValue",
  "setFactoryIdValue"
]);
const orderNextClass = ref([]);
const orderNextProduct = ref([]);
const orderNextWgClass = ref([]);
const orderNextWgProduct = ref([]);
const isAdditional = ref(false);
const toothref = ref(null);
const productParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  factoryId: 0
});
function onClassChange(id, ids) {
  emit("setClassValue", ids);
  getNextNameClass(id);
}
function onClassClose(item) {
  emit("setClassClose", item);
}
function onAddClass(item) {
  emit("setNoClass", item, "default");
}
function setToothValue(value) {
  emit("setToothValue", value);
}
function setColorValue(v, name) {
  emit("setColorValue", v, name);
}
function setIsAdditional(v) {
  isAdditional.value = v;
}
async function getNextNameClass(id) {
  orderNextClass.value = [];
  orderNextProduct.value = [];
  orderNextWgClass.value = [];
  orderNextWgProduct.value = [];
  let newarr = props.classList.filter((a) => {
    return a.ids == id;
  });
  if (newarr.length > 0) {
    orderNextClass.value = newarr[0].children;
    let newarr2 = props.toothValue.filter((a) => a.name == props.isClassValue);
    if (newarr2[0].value.productItemClassifyId > 0) {
      let x = newarr[0].children.findIndex(
        (a) => a.value == newarr2[0].value.productItemClassifyId
      );
      newarr2[0].value.selectedButton = x == -1 ? 0 : x;
    }
    if (newarr2[0].value.productItemClassifyWgId > 0) {
      let x = newarr[0].relationChildren.findIndex(
        (a) => a.value == newarr2[0].value.productItemClassifyWgId
      );
      newarr2[0].value.WgselectedButton = x == -1 ? 0 : x;
    }
    let index = newarr2[0].value.selectedButton;
    let index2 = newarr2[0].value.WgselectedButton;
    let isAddRelationChildren = newarr2[0].value.isAdditional;
    isAdditional.value = isAddRelationChildren;
    if (newarr[0].children.length > 0) {
      await getDentalProduct(newarr[0].children[index].value);
    }
    if (isAdditional.value) {
      orderNextWgClass.value = newarr[0].relationChildren;
      if (newarr[0].relationChildren.length > 0) {
        await getDentalWgProduct(newarr[0].relationChildren[index2].value);
      }
    } else {
      orderNextWgProduct.value = [];
      orderNextWgClass.value = [];
    }
  }
}
function getDentalProduct(id) {
  productParams.classifyId = id;
  productParams.factoryId = props.factoryId;
  ProductAPI.getItemProductPage(productParams).then((data) => {
    if (data.length > 0) {
      orderNextProduct.value = data;
    } else {
      orderNextProduct.value = [];
    }
  });
}
function getDentalWgProduct(id) {
  productParams.classifyId = id;
  productParams.factoryId = props.factoryId;
  ProductAPI.getItemProductPage(productParams).then((data) => {
    if (data.length > 0) {
      orderNextWgProduct.value = data;
    } else {
      orderNextWgProduct.value = [];
    }
  });
}
const handleCommand = (command) => {
  if (command != void 0 && command != "") {
    let newTooth = props.toothValue;
    newTooth.forEach((item) => {
      let tooth2 = item.value;
      tooth2.XingHao = [];
      tooth2.WgXingHao = [];
      tooth2.orderNameProduct = "";
      tooth2.orderProduct = 0;
      tooth2.orderWgNameProduct = "";
      tooth2.orderWgProduct = 0;
      tooth2.isColor = false;
      tooth2.isWgColor = false;
      tooth2.hasType = 0;
      tooth2.hasWgType = 0;
      tooth2.Color1 = "";
      tooth2.Color2 = "";
      tooth2.Color3 = "";
      tooth2.WgColor1 = "";
      tooth2.WgColor2 = "";
      tooth2.WgColor3 = "";
    });
    emit("setFactoryIdValue", command, newTooth);
  }
};
const cancelSelect = () => {
  if (toothref.value) {
    toothref.value.cancelSelect();
  }
};
defineExpose({
  cancelSelect
});
onMounted(() => {
  getNextNameClass(props.isClassValue);
});
</script>
<style lang="scss" scoped>
.tooth-position {
  width: 100%;
  display: flex;
  height: auto;
  flex-flow: column;
  .tooth-position-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .tooth-top {
      width: auto;
      max-width: 1010px;
      display: flex;
      background-color: #333f48;
      height: 40px;
      justify-content: space-around;
      align-items: center;
      padding: 0px 8px;
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
      .tooth-btn22 {
        display: flex;
        width: auto;
        max-width: 900px;
        overflow: hidden;
        overflow-x: auto;
      }
      .tooth-btn1 {
        display: flex;
        width: auto;
        height: 32px;
        justify-content: center;
        color: #333f48;
        background-color: #ffffff;
        align-items: center;
        font-size: 17px;
        font-weight: 700;
        padding: 0px 10px 0px 10px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        cursor: pointer;
        margin: 8px 2px 0px 15px;
        white-space: nowrap;
        span {
          display: flex;
          width: auto;
          font-size: 14px;
          color: #333f48;
          padding: 0px 0px 0px 8px;
          font-weight: normal;
          cursor: pointer;
        }
      }
      .tooth-btn2 {
        cursor: pointer;
        display: flex;
        width: auto;
        height: 32px;
        justify-content: center;
        color: #ffffff;
        align-items: center;
        font-size: 17px;
        font-weight: 400;
        margin-top: 7px;
        padding: 0px 10px 0px 10px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        margin: 8px 2px 0px 15px;
        white-space: nowrap;
        span {
          display: flex;
          width: auto;
          font-size: 13px;
          color: #e6eef5;
          padding: 0px 0px 0px 8px;
          font-weight: normal;
        }
      }
      .tooth-btn2:hover {
        display: flex;
        background-color: #ffffff;
        justify-content: center;
        color: #100f0f;
        cursor: pointer;
        span {
          display: flex;
          width: auto;
          font-size: 14px;
          font-weight: normal;
          padding: 0px 0px 0px 8px;
          color: #333f48;
        }
      }
      .tooth-btn3 {
        cursor: pointer;
        display: flex;
        width: 160px;
        height: 32px;
        justify-content: center;
        color: #ffffff;
        align-items: center;
        font-size: 13px;
        margin-top: 7px;
        padding: 0px 8px 0px 10px;
        border: none;
        .xm-btn {
          width: auto;
          padding: 5px 12px;
          background-color: #626aef;
          border-radius: 6px;
          height: 25px;
          line-height: 16px;
          font-size: 16px;
          white-space: nowrap;
        }
      }
      .tooth-btn3-title {
        width: auto;
        height: 32px;
        text-align: center;
      }
    }
    .tooth-top-right {
      width: auto;
      display: flex;
      padding-top: 8px;
      :deep(.el-button, .el-button.is-round) {
        padding: 3px 10px;
        height: 28px;
        color: #c85b20;
        font-size: 16px;
      }
    }
  }
  .tooth-content {
    width: 100%;
    display: flex;
    height: auto;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-width: 0.5px;
    background-color: #ffffff;
    opacity: 1;
    border: 0.5px solid #c5d1dc;
    padding: 12px 10px 10px 10px;
  }
}
.tooth-class {
  width: auto;
  height: 32px;
  background-color: #ffffff;
  cursor: pointer;
  text-align: center;
}
.tooth-class:hover {
  color: #626aef;
  width: auto;
  height: 32px;
  background-color: #ffffff;
  cursor: pointer;
  text-align: center;
}
.tooth-class1 {
  width: auto;
  height: 47px;
  background-color: #ffffff;
  cursor: pointer;
  text-align: center;
}
.tooth-class1:hover {
  color: #626aef;
  width: auto;
  height: 47px;
  background-color: #ffffff;
  cursor: pointer;
  text-align: center;
}
</style>
