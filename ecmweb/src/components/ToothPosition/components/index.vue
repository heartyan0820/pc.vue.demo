<template>
  <div class="tooth-positions">
    <div class="ecmbody-info2-top1">
      <div class="ecmbody-info2-left">
        <div class="ecmbody-info2-left1">
          <div class="ecmbody-info2-left1-1">
            {{ jtWzTitle }} &nbsp;
            <span style="color: red; font-size: 17px">*双击取消牙位</span>
          </div>
          <div class="ecmbody-info2-left1-2">
            <div
              v-for="(it, index) in orderToothForm.XingHao"
              v-if="orderToothForm.hasType == 10 || orderToothForm.hasType == 30"
              :key="index"
              :class="setColor(it)"
              @click="onModelChange(it)"
            >
              {{ it.label }}
            </div>
          </div>
        </div>
        <div class="ecmbody-info2-left2">
          <div class="mouth-container" @click="cancelSelects">
            <div class="info-box">
              <div class="left-box"></div>
              <div class="left-box"></div>
            </div>
            <div class="box box-a">A</div>
            <div class="box box-b">B</div>
            <div class="box box-c">C</div>
            <div class="box box-d">D</div>
            <div class="box box-a1">{{ orderToothForm?.A.join(" ") }}</div>
            <div class="box box-b1">{{ orderToothForm?.B.join(" ") }}</div>
            <div class="box box-c1">{{ orderToothForm?.C.join(" ") }}</div>
            <div class="box box-d1">{{ orderToothForm?.D.join(" ") }}</div>
            <!-- 上颌牙齿区域 -->
            <div class="upper-jaw d-jr d-dc d-ac">
              <div
                v-for="(tooth, index) in upperJtTeeth"
                :key="'upper-' + index"
                class="tooth-icon"
                :style="getJtToothPosition('uppers', index)"
                :class="{ selected: tooth.selected }"
                :data-id="tooth.id"
                @dblclick.stop="toggledbTooths('uppers', tooth, index)"
                @click.stop="toggleywTooths('uppers', tooth, index)"
              >
                <div class="tooth-index">
                  {{ tooth.id.slice(1, 2) }}
                </div>
                <img
                  style="width: 80%; cursor: pointer"
                  :src="getImageUrls(tooth, orderToothForm.teethMode)"
                />
              </div>
              <div
                v-for="(tooth, index) in upperJtTeeth"
                :key="index"
                :style="getJtToothPositions('uppers', index)"
              >
                <div
                  style="width: 10px; height: 10px; background-color: #e03a9d; border-radius: 50%"
                  :style="setxzlg(tooth, 'uppers')"
                >
                  <div v-if="index > 0" :style="setline(tooth, 'uppers')"></div>
                </div>
                <div
                  style="width: 10px; height: 10px; background-color: #3475e0; border-radius: 50%"
                  :style="setxzdg(tooth, 'uppers')"
                ></div>
              </div>
              <div class="upper-txt">{{ jtWzTitle != "" ? jtWzTitle.substring(0, 2) : "" }}</div>
            </div>
            <div class="line-xuxian"></div>
            <div class="line-red"></div>
            <div class="line-shuxian"></div>
            <!-- 下颌牙齿区域 -->
            <div class="lower-jaw">
              <div
                v-for="(tooth, index) in lowerJtTeeth"
                :key="'lower-' + index"
                :style="getJtToothPosition('lowers', index)"
                class="tooth-icon"
                :class="{ selected: tooth.selected }"
                :data-id="tooth.id"
                @dblclick.stop="toggledbTooths('lowers', tooth, index)"
                @click.stop="toggleywTooths('lowers', tooth, index)"
              >
                <img
                  style="width: 80%; cursor: pointer"
                  :src="getImageUrls(tooth, orderToothForm.teethMode)"
                />
                <div class="tooth-index">
                  {{ tooth.id.slice(1, 2) }}
                </div>
              </div>
              <div
                v-for="(tooth, index) in lowerJtTeeth"
                :key="index"
                :style="getJtToothPositions('lowers', index)"
              >
                <div
                  style="width: 10px; height: 10px; background-color: #e03a9d; border-radius: 50%"
                  :style="setxzdxlg(tooth, 'lowers')"
                >
                  <div v-if="index > 0" :style="setlinex(tooth, 'lowers')"></div>
                </div>
                <div
                  style="width: 10px; height: 10px; background-color: #3475e0; border-radius: 50%"
                  :style="setxzdxdg(tooth, 'lowers')"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ecmbody-info2-right">
        <div class="ecmbody-info2-right00">
          <div
            :class="jttype == '0' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setjtlx(0)"
          >
            全口
          </div>
          <div
            :class="jttype == '1' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setjtlx(1)"
          >
            上颌
          </div>
          <div
            :class="jttype == '2' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setjtlx(2)"
          >
            下颌
          </div>
          <div
            :class="jttype == '3' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setjtlx(3)"
          >
            清空
          </div>
        </div>
        <div class="ecmbody-info2-right01">
          <div class="ecmbody-info2-right1">{{ jtTitle }}</div>
          <div class="ecmbody-info2-right2">
            <div class="ecmbody-info2-right2-btn">
              <el-button
                v-for="(item, index) in props.orderNextClass"
                :key="index"
                :type="orderToothForm.selectedButton === index ? 'primary' : 'info'"
                @click="onChange(item, index)"
              >
                {{ item.label }}
              </el-button>
            </div>
            <div class="ecmbody-info2-right2-radio">
              <el-radio-group v-model="orderToothForm.orderProduct">
                <template v-for="option in orderNextProduct" :key="option.value">
                  <el-radio
                    :value="option.value"
                    :label="option.label"
                    :style="{
                      '--radio-main-color': option.color,
                    }"
                    class="color-radio-item"
                    @change="onProductChange(option)"
                  >
                    {{ option.label }}
                  </el-radio>
                </template>
              </el-radio-group>
            </div>
            <div class="ecmbody-info2-right2-content">
              <el-row
                v-if="orderToothForm.hasType == 20"
                :gutter="20"
                style="margin: 5px 0px 5px 0px"
              >
                <el-col
                  :span="5"
                  style="
                    padding-left: 0px;
                    color: #333f48;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                  "
                >
                  系统型号：
                </el-col>
                <el-col
                  :span="19"
                  style="padding-left: 0px; color: #333f48; display: flex; align-items: center"
                >
                  <!-- <el-select
                    ref="selectRef"
                    v-model="orderToothForm.Model"
                    popper-class="my-dropdown"
                    filterable
                    allow-create
                    clearable
                    style="font-size: 12px"
                    :placeholder="'请输入' + orderToothForm.orderNameProduct + '型号关键字'"
                    @blur="handleSelectBlur('selectRef')"
                    @focus="hadFocus('selectRef', modelOptions)"
                  >
                    <template v-for="it in modelOptions" :key="it.value">
                      <el-option :label="it.label" :value="{ value: it.value, label: it.label }" />
                    </template>
                  </el-select> -->
                  <CustomInputSelect
                    :key="mkey"
                    v-model="Models"
                    :options="modelOptions"
                    :placeholder="'请选择或自行输入' + orderToothForm.orderNameProduct + '型号'"
                    @change="(val) => change(val)"
                    @clearValue="(val) => clearModels(1)"
                    @input="(val) => inputModel(val, 1)"
                  />
                </el-col>
              </el-row>
              <el-row v-if="orderToothForm.isColor" :gutter="20" style="margin: 5px 0px 5px 0px">
                <el-col
                  :span="5"
                  style="padding-left: 0px; display: flex; align-items: center; font-size: 16px"
                >
                  颜色：
                </el-col>
                <el-col :span="19" style="padding-left: 0px; display: flex; align-items: center">
                  <CustomInputSelect
                    v-model="Colors1"
                    :options="props.options"
                    :placeholder="'请选择或自行输入' + orderToothForm.orderNameProduct + '颜色'"
                    @change="(v) => onColorChange(v, 'Color1')"
                    @clearValue="(val) => clearColors1(1)"
                    @input="(val) => inputColor(val, 1)"
                  />
                  <!-- /
                  <el-select
                    ref="selectColorRef"
                    v-model="orderToothForm.Color1"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    allow-create
                    :placeholder="'请选择' + orderToothForm.orderNameProduct + '颜色'"
                    style="width: 90%"
                    @change="(v) => onColorChange(v, 'Color1')"
                    @blur="handleSelectBlur('selectColorRef')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                  
                  <el-select
                    v-model="orderToothForm.Color2"
                    filterable
                    remote
                    multiple
                    reserve-keyword
                    clearable
                    placeholder="选择颜色"
                    style="width: 33%"
                    @change="(v) => onColorChange(v, 'Color2')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                  /
                  <el-select
                    v-model="orderToothForm.Color3"
                    filterable
                    remote
                    clearable
                    multiple
                    reserve-keyword
                    placeholder="选择颜色"
                    style="width: 27%"
                    @change="(v) => onColorChange(v, 'Color3')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select> -->
                </el-col>
              </el-row>
              <!-- <el-row :gutter="20" style="margin: 5px 0px 5px 0px">
                <el-col :span="4" style="padding-left: 0px">备注：</el-col>
                <el-col :span="20">
                  <el-input v-model="orderToothForm.Remarks" type="textarea" :rows="1"></el-input>
                </el-col>
              </el-row> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-divider v-if="isAdditional" />
    <div v-if="isAdditional" class="ecmbody-info2-top2">
      <div class="ecmbody-info2-left">
        <div class="ecmbody-info2-left1">
          <div class="ecmbody-info2-left1-1">
            {{ relationWzTitle }} &nbsp;
            <span style="color: red; font-size: 17px">*双击取消牙位</span>
          </div>
          <div class="ecmbody-info2-left1-2">
            <div
              v-for="(it, index) in orderToothForm.WgXingHao"
              v-if="orderToothForm.hasWgType == 10 || orderToothForm.hasWgType == 30"
              :key="index"
              :class="setColor(it)"
              @click="onWgModelChange(it)"
            >
              {{ it.label }}
            </div>
          </div>
        </div>
        <div class="ecmbody-info2-left2" @click="cancelSelects">
          <div class="mouth-container">
            <div class="info-box">
              <div class="left-box"></div>
              <div class="left-box"></div>
            </div>
            <div class="box box-a">A</div>
            <div class="box box-b">B</div>
            <div class="box box-c">C</div>
            <div class="box box-d">D</div>
            <div class="box box-a2">{{ orderToothForm?.WA.join(" ") }}</div>
            <div class="box box-b2">{{ orderToothForm?.WB.join(" ") }}</div>
            <div class="box box-c2">{{ orderToothForm?.WC.join(" ") }}</div>
            <div class="box box-d2">{{ orderToothForm?.WD.join(" ") }}</div>

            <!-- 上颌牙齿区域 -->
            <div class="upper-jaw d-jr d-dc d-ac">
              <div
                v-for="(tooth, index) in upperTeeth"
                :key="'upper-' + index"
                class="tooth-icon"
                :style="getToothPosition('upper', index)"
                :class="{ selected: tooth.selected }"
                :data-id="tooth.id"
                @click.stop="togglewgTooths('upper', tooth, index)"
                @dblclick.stop="toggledbWbTooths('upper', tooth, index)"
              >
                <div class="tooth-index">
                  {{ tooth.id.slice(1, 2) }}
                </div>
                <img
                  style="width: 80%; cursor: pointer"
                  :src="getImageUrls(tooth, orderToothForm.teethWgMode)"
                />
              </div>
              <div
                v-for="(tooth, index) in upperTeeth"
                :key="index"
                :style="getToothPositions('upper', index)"
              >
                <div
                  style="width: 10px; height: 10px; background-color: #e03a9d; border-radius: 50%"
                  :style="setxzlg(tooth, 'upper')"
                >
                  <div v-if="index > 0" :style="setline(tooth, 'upper')"></div>
                </div>
                <div
                  style="width: 10px; height: 10px; background-color: #3475e0; border-radius: 50%"
                  :style="setxzdg(tooth, 'upper')"
                ></div>
              </div>
              <div class="upper-txt">
                {{ relationWzTitle != "" ? relationWzTitle.substring(0, 2) : "" }}
              </div>
            </div>
            <div class="line-xuxian"></div>
            <div class="line-red"></div>
            <div class="line-shuxian"></div>
            <!-- 下颌牙齿区域 -->
            <div class="lower-jaw">
              <div
                v-for="(tooth, index) in lowerTeeth"
                :key="'lower-' + index"
                :style="getToothPosition('lower', index)"
                class="tooth-icon"
                :class="{ selected: tooth.selected }"
                :data-id="tooth.id"
                @click.stop="togglewgTooths('lower', tooth, index)"
                @dblclick.stop="toggledbWbTooths('lower', tooth, index)"
              >
                <img
                  style="width: 80%; cursor: pointer"
                  :src="getImageUrls(tooth, orderToothForm.teethWgMode)"
                />
                <div class="tooth-index">
                  {{ tooth.id.slice(1, 2) }}
                </div>
              </div>

              <div
                v-for="(tooth, index) in lowerTeeth"
                :key="index"
                :style="getToothPositions('lower', index)"
              >
                <div
                  style="width: 10px; height: 10px; background-color: #e03a9d; border-radius: 50%"
                  :style="setxzdxlg(tooth, 'lower')"
                >
                  <div v-if="index > 0" :style="setlinex(tooth, 'lower')"></div>
                </div>
                <div
                  style="width: 10px; height: 10px; background-color: #3475e0; border-radius: 50%"
                  :style="setxzdxdg(tooth, 'lower')"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ecmbody-info2-right">
        <div class="ecmbody-info2-right00">
          <div
            :class="ygtype == '0' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setyglx(0)"
          >
            全口
          </div>
          <div
            :class="ygtype == '1' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setyglx(1)"
          >
            上颌
          </div>
          <div
            :class="ygtype == '2' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setyglx(2)"
          >
            下颌
          </div>
          <div
            :class="ygtype == '3' ? 'ecmbody-info2-right002' : 'ecmbody-info2-right001'"
            @click="setyglx(3)"
          >
            清空
          </div>
        </div>
        <div class="ecmbody-info2-right01">
          <div class="ecmbody-info2-right1">{{ relationTitle }}</div>
          <div class="ecmbody-info2-right2">
            <div class="ecmbody-info2-right2-btn">
              <el-button
                v-for="(item, index) in props.orderNextWgClass"
                :key="index"
                :type="orderToothForm.WgselectedButton === index ? 'primary' : 'info'"
                @click="onWgChange(item, index)"
              >
                {{ item.label }}
              </el-button>
            </div>
            <div class="ecmbody-info2-right2-radio">
              <el-radio-group v-model="orderToothForm.orderWgProduct">
                <template v-for="option in orderNextWgProduct" :key="option.value">
                  <el-radio
                    :value="option.value"
                    :label="option.label"
                    :style="{
                      '--radio-main-color': option.color,
                    }"
                    class="color-radio-item"
                    @change="onProductWcChange(option)"
                  >
                    {{ option.label }}
                  </el-radio>
                </template>
              </el-radio-group>
            </div>
            <div class="ecmbody-info2-right2-content">
              <el-row
                v-if="orderToothForm.hasWgType == 20"
                :gutter="20"
                style="margin: 5px 0px 5px 0px"
              >
                <el-col
                  :span="5"
                  style="
                    padding-left: 0px;
                    color: #333f48;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                  "
                >
                  系统型号：
                </el-col>
                <el-col
                  :span="19"
                  style="padding-left: 0px; color: #333f48; display: flex; align-items: center"
                >
                  <CustomInputSelect
                    :key="wkey"
                    v-model="WgModels"
                    :options="modelWgOptions"
                    :placeholder="'请选择或自行输入' + orderToothForm.orderWgNameProduct + '型号'"
                    @change="(val) => changeWgModels(val)"
                    @clearValue="(val) => clearModels(2)"
                    @input="(val) => inputModel(val, 2)"
                  />
                </el-col>
              </el-row>
              <el-row v-if="orderToothForm.isWgColor" :gutter="20" style="margin: 5px 0px 5px 0px">
                <el-col
                  :span="5"
                  style="padding-left: 0px; display: flex; align-items: center; font-size: 16px"
                >
                  颜色：
                </el-col>
                <el-col :span="19" style="padding-left: 0px; display: flex; align-items: center">
                  <CustomInputSelect
                    v-model="WgColors1"
                    :options="props.options"
                    :placeholder="'请选择或自行输入' + orderToothForm.orderWgNameProduct + '颜色'"
                    @change="(v) => onColorChange(v, 'WgColor1')"
                    @clearValue="(val) => clearColors1(2)"
                    @input="(val) => inputColor(val, 2)"
                  />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div class="ecmbody-info2-img">
        <img src="/images/close.png" title="关闭" @click="colseyg" />
      </div>
    </div>
    <div v-if="isAdditional == false && isYg" class="ecmbody-info3-img">
      <img src="/images/tjwg.png" title="添加牙冠" @click="openyg" />
    </div>
  </div>
</template>

<script setup>import { number } from "echarts";
import { setXdColor } from "@/utils/auth";
defineOptions({
  name: "toothpositionList",
  inheritAttrs: false
});
const props = defineProps({
  isAdditional: {
    type: Boolean,
    default: false
  },
  toothValue: {
    type: Array,
    default: []
  },
  isClassValue: {
    type: number,
    default: 0
  },
  classList: {
    type: String,
    default: []
  },
  orderNextClass: {
    type: Array,
    default: []
  },
  orderNextWgClass: {
    type: Array,
    default: []
  },
  orderNextProduct: {
    type: String,
    default: []
  },
  orderNextWgProduct: {
    type: String,
    default: ""
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
  }
});
const emit = defineEmits([
  "setToothValue",
  "setClassValue",
  "setWgClassValue",
  "setColorValue",
  "setIsAdditional",
  "setClassChange"
]);
import ColorAPI from "@/api/basic/color";
const xingParams = reactive({
  pageIndex: 1,
  pageSize: 100
});
const Models = ref("");
const Colors1 = ref("");
const WgModels = ref("");
const WgColors1 = ref("");
const loading = ref(false);
const jttype = ref("");
const selectRef = ref();
const selectWgRef = ref();
jttype.value = "";
const ygtype = ref("");
ygtype.value = "";
const jtTitle = ref("");
const relationTitle = ref("");
const jtWzTitle = ref("");
const relationWzTitle = ref("");
const selectColorRef = ref();
const selectWgColorRef = ref();
const isAdditional = ref(false);
const mkey = ref(0);
const wkey = ref(0);
const upperJtTeeth = ref([
  {
    id: "A8",
    icon: "./common/A8@2x.png",
    iconSelecteds: "./Teeth1/T1A8.png",
    iconSelected: "./Teeth2/T2A8.png",
    iconSelectedessj: "./Teeth7/T7A8.png",
    iconSelectedes: "./Teeth4/T4A8.png",
    iconSelectedess: "./Teeth5/T5A8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A7",
    icon: "./common/A7@2x.png",
    iconSelected: "./Teeth2/T2A7.png",
    iconSelecteds: "./Teeth1/T1A7.png",
    iconSelectedessj: "./Teeth7/T7A7.png",
    iconSelectedes: "./Teeth4/T4A7.png",
    iconSelectedess: "./Teeth5/T5A7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A6",
    icon: "./common/A6@2x.png",
    iconSelected: "./Teeth2/T2A6.png",
    iconSelectedessj: "./Teeth7/T7A6.png",
    iconSelecteds: "./Teeth1/T1A6.png",
    iconSelectedes: "./Teeth4/T4A6.png",
    iconSelectedess: "./Teeth5/T5A6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A5",
    icon: "./common/A5@2x.png",
    iconSelected: "./Teeth2/T2A5.png",
    iconSelectedessj: "./Teeth7/T7A5.png",
    iconSelecteds: "./Teeth1/T1A5.png",
    iconSelectedes: "./Teeth4/T4A5.png",
    iconSelectedess: "./Teeth5/T5A5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A4",
    icon: "./common/A4@2x.png",
    iconSelected: "./Teeth2/T2A4.png",
    iconSelectedessj: "./Teeth7/T7A4.png",
    iconSelecteds: "./Teeth1/T1A4.png",
    iconSelectedes: "./Teeth4/T4A4.png",
    iconSelectedess: "./Teeth5/T5A4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A3",
    icon: "./common/A3@2x.png",
    iconSelected: "./Teeth2/T2A3.png",
    iconSelectedessj: "./Teeth7/T7A3.png",
    iconSelecteds: "./Teeth1/T1A3.png",
    iconSelectedes: "./Teeth4/T4A3.png",
    iconSelectedess: "./Teeth5/T5A3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A2",
    icon: "./common/A2@2x.png",
    iconSelected: "./Teeth2/T2A2.png",
    iconSelectedessj: "./Teeth7/T7A2.png",
    iconSelecteds: "./Teeth1/T1A2.png",
    iconSelectedes: "./Teeth4/T4A2.png",
    iconSelectedess: "./Teeth5/T5A2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A1",
    icon: "./common/A1@2x.png",
    iconSelected: "./Teeth2/T2A1.png",
    iconSelectedessj: "./Teeth7/T7A1.png",
    iconSelecteds: "./Teeth1/T1A1.png",
    iconSelectedes: "./Teeth4/T4A1.png",
    iconSelectedess: "./Teeth5/T5A1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B1",
    icon: "./common/B1@2x.png",
    iconSelected: "./Teeth2/T2B1.png",
    iconSelectedessj: "./Teeth7/T7B1.png",
    iconSelecteds: "./Teeth1/T1B1.png",
    iconSelectedes: "./Teeth4/T4B1.png",
    iconSelectedess: "./Teeth5/T5B1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B2",
    icon: "./common/B2@2x.png",
    iconSelected: "./Teeth2/T2B2.png",
    iconSelectedessj: "./Teeth7/T7B2.png",
    iconSelecteds: "./Teeth1/T1B2.png",
    iconSelectedes: "./Teeth4/T4B2.png",
    iconSelectedess: "./Teeth5/T5B2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B3",
    icon: "./common/B3@2x.png",
    iconSelected: "./Teeth2/T2B3.png",
    iconSelectedessj: "./Teeth7/T7B3.png",
    iconSelecteds: "./Teeth1/T1B3.png",
    iconSelectedes: "./Teeth4/T4B3.png",
    iconSelectedess: "./Teeth5/T5B3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B4",
    icon: "./common/B4@2x.png",
    iconSelected: "./Teeth2/T2B4.png",
    iconSelectedessj: "./Teeth7/T7B4.png",
    iconSelecteds: "./Teeth1/T1B4.png",
    iconSelectedes: "./Teeth4/T4B4.png",
    iconSelectedess: "./Teeth5/T5B4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B5",
    icon: "./common/B5@2x.png",
    iconSelected: "./Teeth2/T2B5.png",
    iconSelectedessj: "./Teeth7/T7B5.png",
    iconSelecteds: "./Teeth1/T1B5.png",
    iconSelectedes: "./Teeth4/T4B5.png",
    iconSelectedess: "./Teeth5/T5B5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B6",
    icon: "./common/B6@2x.png",
    iconSelected: "./Teeth2/T2B6.png",
    iconSelectedessj: "./Teeth7/T7B6.png",
    iconSelecteds: "./Teeth1/T1B6.png",
    iconSelectedes: "./Teeth4/T4B6.png",
    iconSelectedess: "./Teeth5/T5B6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B7",
    icon: "./common/B7@2x.png",
    iconSelected: "./Teeth2/T2B7.png",
    iconSelectedessj: "./Teeth7/T7B7.png",
    iconSelecteds: "./Teeth1/T1B7.png",
    iconSelectedes: "./Teeth4/T4B7.png",
    iconSelectedess: "./Teeth5/T5B7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B8",
    icon: "./common/B8@2x.png",
    iconSelected: "./Teeth2/T2B8.png",
    iconSelectedessj: "./Teeth7/T7B8.png",
    iconSelecteds: "./Teeth1/T1B8.png",
    iconSelectedes: "./Teeth4/T4B8.png",
    iconSelectedess: "./Teeth5/T5B8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  }
]);
const lowerJtTeeth = ref([
  {
    id: "C8",
    icon: "./common/C8@2x.png",
    iconSelected: "./Teeth2/T2C8.png",
    iconSelectedessj: "./Teeth7/T7C8.png",
    iconSelecteds: "./Teeth1/T1C8.png",
    iconSelectedes: "./Teeth4/T4C8.png",
    iconSelectedess: "./Teeth5/T5C8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C7",
    icon: "./common/C7@2x.png",
    iconSelected: "./Teeth2/T2C7.png",
    iconSelectedessj: "./Teeth7/T7C7.png",
    iconSelecteds: "./Teeth1/T1C7.png",
    iconSelectedes: "./Teeth4/T4C7.png",
    iconSelectedess: "./Teeth5/T5C7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C6",
    icon: "./common/C6@2x.png",
    iconSelected: "./Teeth2/T2C6.png",
    iconSelectedessj: "./Teeth7/T7C6.png",
    iconSelecteds: "./Teeth1/T1C6.png",
    iconSelectedes: "./Teeth4/T4C6.png",
    iconSelectedess: "./Teeth5/T5C6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C5",
    icon: "./common/C5@2x.png",
    iconSelected: "./Teeth2/T2C5.png",
    iconSelectedessj: "./Teeth7/T7C5.png",
    iconSelecteds: "./Teeth1/T1C5.png",
    iconSelectedes: "./Teeth4/T4C5.png",
    iconSelectedess: "./Teeth5/T5C5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C4",
    icon: "./common/C4@2x.png",
    iconSelected: "./Teeth2/T2C4.png",
    iconSelectedessj: "./Teeth7/T7C4.png",
    iconSelecteds: "./Teeth1/T1C4.png",
    iconSelectedes: "./Teeth4/T4C4.png",
    iconSelectedess: "./Teeth5/T5C4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C3",
    icon: "./common/C3@2x.png",
    iconSelected: "./Teeth2/T2C3.png",
    iconSelectedessj: "./Teeth7/T7C3.png",
    iconSelecteds: "./Teeth1/T1C3.png",
    iconSelectedes: "./Teeth4/T4C3.png",
    iconSelectedess: "./Teeth5/T5C3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C2",
    icon: "./common/C2@2x.png",
    iconSelected: "./Teeth2/T2B2.png",
    iconSelectedessj: "./Teeth7/T7C2.png",
    iconSelecteds: "./Teeth1/T1C2.png",
    iconSelectedes: "./Teeth4/T4C2.png",
    iconSelectedess: "./Teeth5/T5C2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C1",
    icon: "./common/C1@2x.png",
    iconSelected: "./Teeth2/T2C1.png",
    iconSelectedessj: "./Teeth7/T7C1.png",
    iconSelecteds: "./Teeth1/T1C1.png",
    iconSelectedes: "./Teeth4/T4C1.png",
    iconSelectedess: "./Teeth5/T5C1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D1",
    icon: "./common/D1@2x.png",
    iconSelected: "./Teeth2/T2D1.png",
    iconSelectedessj: "./Teeth7/T7D1.png",
    iconSelecteds: "./Teeth1/T1D1.png",
    iconSelectedes: "./Teeth4/T4D1.png",
    iconSelectedess: "./Teeth5/T5D1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D2",
    icon: "./common/D2@2x.png",
    iconSelected: "./Teeth2/T2D2.png",
    iconSelectedessj: "./Teeth7/T7D2.png",
    iconSelecteds: "./Teeth1/T1D2.png",
    iconSelectedes: "./Teeth4/T4D2.png",
    iconSelectedess: "./Teeth5/T5D2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D3",
    icon: "./common/D3@2x.png",
    iconSelected: "./Teeth2/T2D3.png",
    iconSelectedessj: "./Teeth7/T7D3.png",
    iconSelecteds: "./Teeth1/T1D3.png",
    iconSelectedes: "./Teeth4/T4D3.png",
    iconSelectedess: "./Teeth5/T5D3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D4",
    icon: "./common/D4@2x.png",
    iconSelected: "./Teeth2/T2D4.png",
    iconSelectedessj: "./Teeth7/T7D4.png",
    iconSelecteds: "./Teeth1/T1D4.png",
    iconSelectedes: "./Teeth4/T4D4.png",
    iconSelectedess: "./Teeth5/T5D4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D5",
    icon: "./common/D5@2x.png",
    iconSelected: "./Teeth2/T2D5.png",
    iconSelectedessj: "./Teeth7/T7D5.png",
    iconSelecteds: "./Teeth1/T1D5.png",
    iconSelectedes: "./Teeth4/T4D5.png",
    iconSelectedess: "./Teeth5/T5D5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D6",
    icon: "./common/D6@2x.png",
    iconSelected: "./Teeth2/T2D6.png",
    iconSelectedessj: "./Teeth7/T7D6.png",
    iconSelecteds: "./Teeth1/T1D6.png",
    iconSelectedes: "./Teeth4/T4D6.png",
    iconSelectedess: "./Teeth5/T5D6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D7",
    icon: "./common/D7@2x.png",
    iconSelected: "./Teeth2/T2D7.png",
    iconSelectedessj: "./Teeth7/T7D7.png",
    iconSelecteds: "./Teeth1/T1D7.png",
    iconSelectedes: "./Teeth4/T4D7.png",
    iconSelectedess: "./Teeth5/T5D7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D8",
    icon: "./common/D8@2x.png",
    iconSelected: "./Teeth2/T2D8.png",
    iconSelectedessj: "./Teeth7/T7D8.png",
    iconSelecteds: "./Teeth1/T1D8.png",
    iconSelectedes: "./Teeth4/T4D8.png",
    iconSelectedess: "./Teeth5/T5D8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  }
]);
const upperTeeth = ref([
  {
    id: "A8",
    icon: "./common/A8@2x.png",
    iconSelecteds: "./Teeth1/T1A8.png",
    iconSelected: "./Teeth2/T2A8.png",
    iconSelectedessj: "./Teeth7/T7A8.png",
    iconSelectedes: "./Teeth4/T4A8.png",
    iconSelectedess: "./Teeth5/T5A8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A7",
    icon: "./common/A7@2x.png",
    iconSelected: "./Teeth2/T2A7.png",
    iconSelecteds: "./Teeth1/T1A7.png",
    iconSelectedessj: "./Teeth7/T7A7.png",
    iconSelectedes: "./Teeth4/T4A7.png",
    iconSelectedess: "./Teeth5/T5A7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A6",
    icon: "./common/A6@2x.png",
    iconSelected: "./Teeth2/T2A6.png",
    iconSelectedessj: "./Teeth7/T7A6.png",
    iconSelecteds: "./Teeth1/T1A6.png",
    iconSelectedes: "./Teeth4/T4A6.png",
    iconSelectedess: "./Teeth5/T5A6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A5",
    icon: "./common/A5@2x.png",
    iconSelected: "./Teeth2/T2A5.png",
    iconSelectedessj: "./Teeth7/T7A5.png",
    iconSelecteds: "./Teeth1/T1A5.png",
    iconSelectedes: "./Teeth4/T4A5.png",
    iconSelectedess: "./Teeth5/T5A5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A4",
    icon: "./common/A4@2x.png",
    iconSelected: "./Teeth2/T2A4.png",
    iconSelectedessj: "./Teeth7/T7A4.png",
    iconSelecteds: "./Teeth1/T1A4.png",
    iconSelectedes: "./Teeth4/T4A4.png",
    iconSelectedess: "./Teeth5/T5A4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A3",
    icon: "./common/A3@2x.png",
    iconSelected: "./Teeth2/T2A3.png",
    iconSelectedessj: "./Teeth7/T7A3.png",
    iconSelecteds: "./Teeth1/T1A3.png",
    iconSelectedes: "./Teeth4/T4A3.png",
    iconSelectedess: "./Teeth5/T5A3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A2",
    icon: "./common/A2@2x.png",
    iconSelected: "./Teeth2/T2A2.png",
    iconSelectedessj: "./Teeth7/T7A2.png",
    iconSelecteds: "./Teeth1/T1A2.png",
    iconSelectedes: "./Teeth4/T4A2.png",
    iconSelectedess: "./Teeth5/T5A2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "A1",
    icon: "./common/A1@2x.png",
    iconSelected: "./Teeth2/T2A1.png",
    iconSelectedessj: "./Teeth7/T7A1.png",
    iconSelecteds: "./Teeth1/T1A1.png",
    iconSelectedes: "./Teeth4/T4A1.png",
    iconSelectedess: "./Teeth5/T5A1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B1",
    icon: "./common/B1@2x.png",
    iconSelected: "./Teeth2/T2B1.png",
    iconSelectedessj: "./Teeth7/T7B1.png",
    iconSelecteds: "./Teeth1/T1B1.png",
    iconSelectedes: "./Teeth4/T4B1.png",
    iconSelectedess: "./Teeth5/T5B1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B2",
    icon: "./common/B2@2x.png",
    iconSelected: "./Teeth2/T2B2.png",
    iconSelectedessj: "./Teeth7/T7B2.png",
    iconSelecteds: "./Teeth1/T1B2.png",
    iconSelectedes: "./Teeth4/T4B2.png",
    iconSelectedess: "./Teeth5/T5B2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B3",
    icon: "./common/B3@2x.png",
    iconSelected: "./Teeth2/T2B3.png",
    iconSelectedessj: "./Teeth7/T7B3.png",
    iconSelecteds: "./Teeth1/T1B3.png",
    iconSelectedes: "./Teeth4/T4B3.png",
    iconSelectedess: "./Teeth5/T5B3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B4",
    icon: "./common/B4@2x.png",
    iconSelected: "./Teeth2/T2B4.png",
    iconSelectedessj: "./Teeth7/T7B4.png",
    iconSelecteds: "./Teeth1/T1B4.png",
    iconSelectedes: "./Teeth4/T4B4.png",
    iconSelectedess: "./Teeth5/T5B4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B5",
    icon: "./common/B5@2x.png",
    iconSelected: "./Teeth2/T2B5.png",
    iconSelectedessj: "./Teeth7/T7B5.png",
    iconSelecteds: "./Teeth1/T1B5.png",
    iconSelectedes: "./Teeth4/T4B5.png",
    iconSelectedess: "./Teeth5/T5B5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B6",
    icon: "./common/B6@2x.png",
    iconSelected: "./Teeth2/T2B6.png",
    iconSelectedessj: "./Teeth7/T7B6.png",
    iconSelecteds: "./Teeth1/T1B6.png",
    iconSelectedes: "./Teeth4/T4B6.png",
    iconSelectedess: "./Teeth5/T5B6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B7",
    icon: "./common/B7@2x.png",
    iconSelected: "./Teeth2/T2B7.png",
    iconSelectedessj: "./Teeth7/T7B7.png",
    iconSelecteds: "./Teeth1/T1B7.png",
    iconSelectedes: "./Teeth4/T4B7.png",
    iconSelectedess: "./Teeth5/T5B7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "B8",
    icon: "./common/B8@2x.png",
    iconSelected: "./Teeth2/T2B8.png",
    iconSelectedessj: "./Teeth7/T7B8.png",
    iconSelecteds: "./Teeth1/T1B8.png",
    iconSelectedes: "./Teeth4/T4B8.png",
    iconSelectedess: "./Teeth5/T5B8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  }
]);
const lowerTeeth = ref([
  {
    id: "C8",
    icon: "./common/C8@2x.png",
    iconSelected: "./Teeth2/T2C8.png",
    iconSelectedessj: "./Teeth7/T7C8.png",
    iconSelecteds: "./Teeth1/T1C8.png",
    iconSelectedes: "./Teeth4/T4C8.png",
    iconSelectedess: "./Teeth5/T5C8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C7",
    icon: "./common/C7@2x.png",
    iconSelected: "./Teeth2/T2C7.png",
    iconSelectedessj: "./Teeth7/T7C7.png",
    iconSelecteds: "./Teeth1/T1C7.png",
    iconSelectedes: "./Teeth4/T4C7.png",
    iconSelectedess: "./Teeth5/T5C7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C6",
    icon: "./common/C6@2x.png",
    iconSelected: "./Teeth2/T2C6.png",
    iconSelectedessj: "./Teeth7/T7C6.png",
    iconSelecteds: "./Teeth1/T1C6.png",
    iconSelectedes: "./Teeth4/T4C6.png",
    iconSelectedess: "./Teeth5/T5C6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C5",
    icon: "./common/C5@2x.png",
    iconSelected: "./Teeth2/T2C5.png",
    iconSelectedessj: "./Teeth7/T7C5.png",
    iconSelecteds: "./Teeth1/T1C5.png",
    iconSelectedes: "./Teeth4/T4C5.png",
    iconSelectedess: "./Teeth5/T5C5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C4",
    icon: "./common/C4@2x.png",
    iconSelected: "./Teeth2/T2C4.png",
    iconSelectedessj: "./Teeth7/T7C4.png",
    iconSelecteds: "./Teeth1/T1C4.png",
    iconSelectedes: "./Teeth4/T4C4.png",
    iconSelectedess: "./Teeth5/T5C4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C3",
    icon: "./common/C3@2x.png",
    iconSelected: "./Teeth2/T2C3.png",
    iconSelectedessj: "./Teeth7/T7C3.png",
    iconSelecteds: "./Teeth1/T1C3.png",
    iconSelectedes: "./Teeth4/T4C3.png",
    iconSelectedess: "./Teeth5/T5C3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C2",
    icon: "./common/C2@2x.png",
    iconSelected: "./Teeth2/T2B2.png",
    iconSelectedessj: "./Teeth7/T7C2.png",
    iconSelecteds: "./Teeth1/T1C2.png",
    iconSelectedes: "./Teeth4/T4C2.png",
    iconSelectedess: "./Teeth5/T5C2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "C1",
    icon: "./common/C1@2x.png",
    iconSelected: "./Teeth2/T2C1.png",
    iconSelectedessj: "./Teeth7/T7C1.png",
    iconSelecteds: "./Teeth1/T1C1.png",
    iconSelectedes: "./Teeth4/T4C1.png",
    iconSelectedess: "./Teeth5/T5C1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D1",
    icon: "./common/D1@2x.png",
    iconSelected: "./Teeth2/T2D1.png",
    iconSelectedessj: "./Teeth7/T7D1.png",
    iconSelecteds: "./Teeth1/T1D1.png",
    iconSelectedes: "./Teeth4/T4D1.png",
    iconSelectedess: "./Teeth5/T5D1.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D2",
    icon: "./common/D2@2x.png",
    iconSelected: "./Teeth2/T2D2.png",
    iconSelectedessj: "./Teeth7/T7D2.png",
    iconSelecteds: "./Teeth1/T1D2.png",
    iconSelectedes: "./Teeth4/T4D2.png",
    iconSelectedess: "./Teeth5/T5D2.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D3",
    icon: "./common/D3@2x.png",
    iconSelected: "./Teeth2/T2D3.png",
    iconSelectedessj: "./Teeth7/T7D3.png",
    iconSelecteds: "./Teeth1/T1D3.png",
    iconSelectedes: "./Teeth4/T4D3.png",
    iconSelectedess: "./Teeth5/T5D3.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D4",
    icon: "./common/D4@2x.png",
    iconSelected: "./Teeth2/T2D4.png",
    iconSelectedessj: "./Teeth7/T7D4.png",
    iconSelecteds: "./Teeth1/T1D4.png",
    iconSelectedes: "./Teeth4/T4D4.png",
    iconSelectedess: "./Teeth5/T5D4.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D5",
    icon: "./common/D5@2x.png",
    iconSelected: "./Teeth2/T2D5.png",
    iconSelectedessj: "./Teeth7/T7D5.png",
    iconSelecteds: "./Teeth1/T1D5.png",
    iconSelectedes: "./Teeth4/T4D5.png",
    iconSelectedess: "./Teeth5/T5D5.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D6",
    icon: "./common/D6@2x.png",
    iconSelected: "./Teeth2/T2D6.png",
    iconSelectedessj: "./Teeth7/T7D6.png",
    iconSelecteds: "./Teeth1/T1D6.png",
    iconSelectedes: "./Teeth4/T4D6.png",
    iconSelectedess: "./Teeth5/T5D6.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D7",
    icon: "./common/D7@2x.png",
    iconSelected: "./Teeth2/T2D7.png",
    iconSelectedessj: "./Teeth7/T7D7.png",
    iconSelecteds: "./Teeth1/T1D7.png",
    iconSelectedes: "./Teeth4/T4D7.png",
    iconSelectedess: "./Teeth5/T5D7.png",
    selected: false,
    selecteds: false,
    selectedss: false
  },
  {
    id: "D8",
    icon: "./common/D8@2x.png",
    iconSelected: "./Teeth2/T2D8.png",
    iconSelectedessj: "./Teeth7/T7D8.png",
    iconSelecteds: "./Teeth1/T1D8.png",
    iconSelectedes: "./Teeth4/T4D8.png",
    iconSelectedess: "./Teeth5/T5D8.png",
    selected: false,
    selecteds: false,
    selectedss: false
  }
]);
const modelOptions = ref([]);
const modelWgOptions = ref([]);
const orderToothForm = ref({});
const toothProperty = ref({
  hasType: 0
});
const toothWgProperty = ref({
  isColor: false
});
const isYg = ref(false);
const order = props.toothValue.filter((a) => a.name == props.isClassValue);
if (order.length > 0) {
  order.forEach((item) => {
    const from = item.value;
    from.WSelected = [];
    from.Selected = [];
    if (from.A.length > 0) {
      from.A = Array.from(new Set(from.A));
      let arr = from.A.map((num) => "A" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.B.length > 0) {
      from.B = Array.from(new Set(from.B));
      let arr = from.B.map((num) => "B" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.C.length > 0) {
      from.C = Array.from(new Set(from.C));
      let arr = from.C.map((num) => "C" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.D.length > 0) {
      from.D = Array.from(new Set(from.D));
      let arr = from.D.map((num) => "D" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.WA.length > 0) {
      from.WA = Array.from(new Set(from.WA));
      let arr = from.WA.map((num) => "A" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
    if (from.WB.length > 0) {
      from.WB = Array.from(new Set(from.WB));
      let arr = from.WB.map((num) => "B" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
    if (from.WC.length > 0) {
      from.WC = Array.from(new Set(from.WC));
      let arr = from.WC.map((num) => "C" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
    if (from.WD.length > 0) {
      from.WD = Array.from(new Set(from.WD));
      let arr = from.WD.map((num) => "D" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
  });
  orderToothForm.value = order[0].value;
  modelOptions.value = order[0].value.XingHao;
  modelWgOptions.value = order[0].value.WgXingHao;
  Models.value = order[0].value.Model?.value > 0 ? order[0].value.Model?.label : order[0].value.Model?.label;
  if (typeof order[0].value.Color1 !== "string") {
    Colors1.value = order[0].value.Color1 == 0 ? order[0].value.Color1?.label : order[0].value.Color1?.value;
  } else {
    Colors1.value = order[0].value.Color1;
  }
  WgModels.value = order[0].value.WgModel?.value == 0 ? order[0].value.WgModel?.label : order[0].value.WgModel?.label;
  if (typeof order[0].value.WgColor1 !== "string") {
    WgColors1.value = order[0].value.WgColor1 == 0 ? order[0].value.WgColor1?.label : order[0].value.WgColor1?.value;
  } else {
    WgColors1.value = order[0].value.WgColor1;
  }
}
const orderTitle = props.classList.filter((a) => a.ids == props.isClassValue);
if (orderTitle.length > 0) {
  jtTitle.value = orderTitle[0].title;
  if (orderTitle[0].title.length > 0) {
    if (orderTitle[0].title.length > 2) {
      jtWzTitle.value = orderTitle[0].title.substring(0, 2) + "位置";
      order[0].value.jtTitle = orderTitle[0].title.substring(0, 2);
    } else {
      jtWzTitle.value = "位置";
    }
  }
  isAdditional.value = props.isAdditional;
  relationTitle.value = orderTitle[0].relationTitle;
  if (orderTitle[0].relationTitle.length > 0) {
    if (orderTitle[0].relationTitle.length > 2) {
      relationWzTitle.value = orderTitle[0].relationTitle.substring(0, 2) + "位置";
      order[0].value.WgTitle = orderTitle[0].relationTitle.substring(0, 2);
    } else {
      relationWzTitle.value = "位置";
    }
  }
  if (orderTitle[0].relationChildren.length > 0 && orderToothForm.value.isAdditional == false) {
    isYg.value = true;
  } else if (orderTitle[0].relationChildren.length > 0 && orderToothForm.value.isAdditional == true) {
    isAdditional.value = true;
  } else {
    isAdditional.value = false;
  }
}
upperTeeth.value.forEach((u) => {
  const u1 = orderToothForm.value.WSelected.find((a) => a == u.id);
  if (u1) {
    u.selected = true;
  }
});
lowerTeeth.value.forEach((l) => {
  const u1 = orderToothForm.value.WSelected.find((a) => a == l.id);
  if (u1) {
    l.selected = true;
  }
});
upperJtTeeth.value.forEach((u) => {
  const u1 = orderToothForm.value.Selected.find((a) => a == u.id);
  if (u1) {
    u.selected = true;
  }
});
lowerJtTeeth.value.forEach((l) => {
  const u1 = orderToothForm.value.Selected.find((a) => a == l.id);
  if (u1) {
    l.selected = true;
  }
});
const getImageUrls = (item, num) => {
  if (item.selected || item.selecteds || item.selectedss) {
    if (item.selected && item.selecteds && item.selectedss) {
      if (num == 30) {
        return new URL(
          // 本地资源路径
          `${item.iconSelected}`,
          import.meta.url
        ).href;
      } else {
        return new URL(
          // 本地资源路径
          `${item.iconSelectedess}`,
          import.meta.url
        ).href;
      }
    } else if (item.selected && !item.selecteds && !item.selectedss) {
      if (num == 30) {
        return new URL(
          // 本地资源路径
          `${item.iconSelectedessj}`,
          import.meta.url
        ).href;
      } else {
        return new URL(
          // 本地资源路径
          `${item.iconSelecteds}`,
          import.meta.url
        ).href;
      }
    } else {
      if (num == 30) {
        return new URL(
          // 本地资源路径
          `${item.iconSelected}`,
          import.meta.url
        ).href;
      } else {
        return new URL(
          // 本地资源路径
          `${item.iconSelectedes}`,
          import.meta.url
        ).href;
      }
    }
  } else {
    return new URL(
      // 本地资源路径
      `${item.icon}`,
      import.meta.url
    ).href;
  }
};
function toggleywTooths(jawType, item, index) {
  let isbool = false;
  item.selecteds = !item.selecteds;
  item.selectedss = !item.selectedss;
  const tooh = orderToothForm.value;
  if (tooh.orderProduct > 0) {
    if (item.selecteds && !item.selected) {
      if (tooh.XingHao != void 0 && tooh.XingHao.length > 0) {
        const dan = tooh.XingHao.filter((b) => b.label == "单冠");
        const da = tooh.XingHao.filter((b) => b.label == "大");
        if (dan.length > 0) {
          tooh.Model = { label: dan[0].label, value: dan[0].value };
          Model(jawType, item, index, true);
        } else if (da.length > 0) {
          tooh.Model = { label: da[0].label, value: da[0].value };
          Model(jawType, item, index, true);
        } else {
          Model(jawType, item, index, true);
        }
      } else {
        Model(jawType, item, index, isbool);
      }
    }
  }
}
function toggledbTooths(jawType, item, index) {
  item.selected = false;
  item.selectedss = false;
  item.selecteds = false;
  const isbool = false;
  const tooh = orderToothForm.value;
  ClearYaweiModel(item.id, item.selected, isbool);
  const isUpSelect = upperJtTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  const isDoSelect = lowerJtTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  tooh.Selected = mergedArray;
  if (tooh.XingHao != void 0 && tooh.XingHao.length > 0) {
    tooh.XingHao.forEach((item1) => {
      item1.A = item1.A.filter((item12) => item12 !== item.id);
      item1.B = item1.B.filter((item12) => item12 !== item.id);
      item1.C = item1.C.filter((item12) => item12 !== item.id);
      item1.D = item1.D.filter((item12) => item12 !== item.id);
    });
  }
  emit("setToothValue", tooh);
}
function toggledbWbTooths(jawType, item, index) {
  item.selected = false;
  item.selectedss = false;
  item.selecteds = false;
  const isbool = false;
  const tooh = orderToothForm.value;
  ClearYaweiWgModel(item.id, item.selected, isbool);
  const isUpSelect = upperTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  const isDoSelect = lowerTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  tooh.WSelected = mergedArray;
  if (tooh.WgXingHao != void 0 && tooh.WgXingHao.length > 0) {
    tooh.WgXingHao.forEach((item1) => {
      item1.A = item1.A.filter((item12) => item12 !== item.id);
      item1.B = item1.B.filter((item12) => item12 !== item.id);
      item1.C = item1.C.filter((item12) => item12 !== item.id);
      item1.D = item1.D.filter((item12) => item12 !== item.id);
    });
  }
  emit("setToothValue", tooh);
}
function onProductChange(val) {
  debugger;
  orderToothForm.value.orderNameProduct = val.label;
  orderToothForm.value.orderProduct = val.value;
  let oldModel = orderToothForm.value.Model;
  orderToothForm.value.Model = "";
  modelOptions.value = [];
  orderToothForm.value.isModel = false;
  let xhlist = orderToothForm.value.XingHao;
  orderToothForm.value.XingHao = [];
  orderToothForm.value.childrenXingHao = [];
  const id = val.value;
  ColorAPI.getProductData(id).then((data) => {
    orderToothForm.value.Color1 = "";
    orderToothForm.value.Color2 = "";
    orderToothForm.value.Color3 = "";
    if (data != "") {
      Object.assign(toothProperty.value, data);
      orderToothForm.value.hasType = data.hasType;
      if (data.hasType == 20) {
        modelOptions.value = val.children;
        orderToothForm.value.XingHao = [];
        orderToothForm.value.childrenXingHao = val.children;
        mkey.value += 1;
        clearModels(1);
      }
      if (data.hasType == 10 || data.hasType == 30) {
        if (val.children.length > 0) {
          const oldxinghao = xhlist;
          let isold = true;
          oldxinghao.forEach((a) => {
            const isbool = val.children.filter((b) => a.label == b.label);
            if (isbool.length == 0) {
              isold = false;
            } else {
              a.value = isbool[0].value;
            }
          });
          if (isold && oldxinghao.length > 0) {
            orderToothForm.value.XingHao = xhlist;
            let xy = xhlist.filter((b) => oldModel.label == b.label);
            if (xy.length > 0) {
              orderToothForm.value.Model = {
                label: xy[0].label,
                value: xy[0].value
              };
            }
            setXdColor(data.isColor);
            orderToothForm.value.isColor = data.isColor;
            orderToothForm.value.amountMode = data.amountMode;
            orderToothForm.value.teethMode = data.teethMode;
            orderToothForm.value.productItemClassifyId = val.productItemClassifyId;
            if (data.isColor) {
              const colorData = props.colorData;
              orderToothForm.value.Color1 = colorData.Color1;
              orderToothForm.value.Color2 = colorData.Color2;
              orderToothForm.value.Color3 = colorData.Color3;
            }
            return;
          }
          orderToothForm.value.XingHao = val.children;
          orderToothForm.value.XingHao.forEach((a) => {
            a.isChecked = false;
            a.A = [];
            a.B = [];
            a.C = [];
            a.D = [];
          });
        } else {
          orderToothForm.value.XingHao = [];
        }
      }
      setXdColor(data.isColor);
      orderToothForm.value.isColor = data.isColor;
      orderToothForm.value.amountMode = data.amountMode;
      orderToothForm.value.teethMode = data.teethMode;
      orderToothForm.value.productItemClassifyId = val.productItemClassifyId;
      if (data.isColor) {
        const colorData = props.colorData;
        orderToothForm.value.Color1 = colorData.Color1;
        orderToothForm.value.Color2 = colorData.Color2;
        orderToothForm.value.Color3 = colorData.Color3;
      }
    } else {
      orderToothForm.value.isColor = false;
      setXdColor(orderToothForm.value.isColor);
      orderToothForm.value.teethMode = 10;
      toothProperty.value = {};
    }
    if (orderToothForm.value.XingHao.length > 0) {
      const dan = val.children.filter((b) => b.label == "单冠");
      const da = val.children.filter((b) => b.label == "大");
      let number2 = 0;
      if (dan.length > 0) {
        orderToothForm.value.Model = { label: dan[0].label, value: dan[0].value };
        number2 = 1;
      }
      if (da.length > 0) {
        orderToothForm.value.Model = { label: da[0].label, value: da[0].value };
        number2 = 2;
      }
      yesXingHao(number2);
    } else {
      noXingHao();
    }
  });
}
function yesXingHao(i) {
  const tooh = orderToothForm.value;
  const isbool = false;
  const upJtTeeth = upperJtTeeth.value.filter((u) => u.selected || u.selecteds);
  const isUpSelect = upJtTeeth.map((u) => u.id);
  upJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiModel(item.id, item.selected, isbool);
  });
  const loJtTeeth = lowerJtTeeth.value.filter((u) => u.selected || u.selecteds);
  loJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiModel(item.id, item.selected, isbool);
  });
  if (tooh.XingHao.length > 0) {
    const wModelOptions = orderToothForm.value.XingHao.map((a) => a.label);
    if (i == 1) {
      const label = tooh.Model.label;
      const info = tooh.XingHao.filter((b) => b.label == label);
      if (info.length == 1) {
        onModelChange(info[0]);
      }
    } else {
      if (i == 2) {
        const label = tooh.Model.label;
        const info = tooh.XingHao.filter((b) => b.label == label);
        if (info.length == 1) {
          onModelChange(info[0]);
        }
      }
    }
  }
  const isDoSelect = loJtTeeth.map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  tooh.Selected = mergedArray;
  emit("setToothValue", tooh);
}
function noXingHao() {
  const isbool = false;
  const upJtTeeth = upperJtTeeth.value.filter((u) => u.selected || u.selecteds);
  const isUpSelect = upJtTeeth.map((u) => u.id);
  upJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiModel(item.id, item.selected, isbool);
  });
  const loJtTeeth = lowerJtTeeth.value.filter((u) => u.selected || u.selecteds);
  loJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiModel(item.id, item.selected, isbool);
  });
  const isDoSelect = loJtTeeth.map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  orderToothForm.value.Selected = mergedArray;
  emit("setToothValue", orderToothForm.value);
}
function ClearYaweiModel(values, status1, isbool) {
  if (values.indexOf("A") > -1) {
    const arr = values.split("A");
    if (status1) {
      orderToothForm.value.A.push(parseInt(arr[1]));
      addWgModel(isbool, "A", values, "jt");
    } else {
      orderToothForm.value.A = orderToothForm.value.A.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "A", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.A));
    orderToothForm.value.A = uniqueArr.sort().reverse();
  } else if (values.indexOf("B") > -1) {
    const arr = values.split("B");
    if (status1) {
      orderToothForm.value.B.push(parseInt(arr[1]));
      addWgModel(isbool, "B", values, "jt");
    } else {
      orderToothForm.value.B = orderToothForm.value.B.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "B", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.B));
    orderToothForm.value.B = uniqueArr.sort();
  } else if (values.indexOf("C") > -1) {
    const arr = values.split("C");
    if (status1) {
      orderToothForm.value.C.push(parseInt(arr[1]));
      addWgModel(isbool, "C", values, "jt");
    } else {
      orderToothForm.value.C = orderToothForm.value.C.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "C", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.C));
    orderToothForm.value.C = uniqueArr.sort().reverse();
  } else {
    const arr = values.split("D");
    if (status1) {
      orderToothForm.value.D.push(parseInt(arr[1]));
      addWgModel(isbool, "D", values, "jt");
    } else {
      orderToothForm.value.D = orderToothForm.value.D.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "D", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.D));
    orderToothForm.value.D = uniqueArr.sort();
  }
}
function onModelChange(val) {
  jttype.value = "";
  orderToothForm.value.Model = { label: val.label, value: val.value };
  let arr = [];
  orderToothForm.value.XingHao.forEach((a) => {
    if (a.value == val.value) {
      setTooth(false);
      a.isChecked = true;
    } else {
      a.isChecked = true;
    }
  });
}
function togglewgTooths(jawType, item, index) {
  let isbool = false;
  item.selecteds = !item.selecteds;
  item.selectedss = !item.selectedss;
  const tooh = orderToothForm.value;
  if (tooh.orderWgProduct > 0) {
    if (item.selecteds && !item.selected) {
      if (tooh.WgXingHao != void 0 && tooh.WgXingHao.length > 0) {
        const dan = tooh.WgXingHao.filter((b) => b.label == "单冠");
        const da = tooh.WgXingHao.filter((b) => b.label == "大");
        if (dan.length > 0) {
          tooh.WgModel = { label: dan[0].label, value: dan[0].value };
          WgModel(jawType, item, index, true);
        } else if (da.length > 0) {
          tooh.WgModel = { label: da[0].label, value: da[0].value };
          WgModel(jawType, item, index, true);
        } else {
          WgModel(jawType, item, index, true);
        }
      } else {
        WgModel(jawType, item, index, isbool);
      }
    }
  }
}
function WgModel(jawType, item, index, isbool) {
  const values = item.id;
  if (jawType === "upper") {
    upperTeeth.value[index].selected = !upperTeeth.value[index].selected;
    item.selected = upperTeeth.value[index].selected;
  } else {
    lowerTeeth.value[index].selected = !lowerTeeth.value[index].selected;
    item.selected = lowerTeeth.value[index].selected;
  }
  const status1 = item.selected;
  if (values.indexOf("A") > -1) {
    const arr = values.split("A");
    if (status1) {
      orderToothForm.value.WA.push(parseInt(arr[1]));
      addWgModel(isbool, "A", values, "wg");
    } else {
      orderToothForm.value.WA = orderToothForm.value.WA.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "A", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WA));
    orderToothForm.value.WA = uniqueArr.sort().reverse();
  } else if (values.indexOf("B") > -1) {
    const arr = values.split("B");
    if (status1) {
      orderToothForm.value.WB.push(parseInt(arr[1]));
      addWgModel(isbool, "B", values, "wg");
    } else {
      orderToothForm.value.WB = orderToothForm.value.WB.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "B", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WB));
    orderToothForm.value.WB = uniqueArr.sort();
  } else if (values.indexOf("C") > -1) {
    const arr = values.split("C");
    if (status1) {
      orderToothForm.value.WC.push(parseInt(arr[1]));
      addWgModel(isbool, "C", values, "wg");
    } else {
      orderToothForm.value.WC = orderToothForm.value.WC.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "C", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WC));
    orderToothForm.value.WC = uniqueArr.sort().reverse();
  } else {
    const arr = values.split("D");
    if (status1) {
      orderToothForm.value.WD.push(parseInt(arr[1]));
      addWgModel(isbool, "D", values, "wg");
    } else {
      orderToothForm.value.WD = orderToothForm.value.WD.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "D", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WD));
    orderToothForm.value.WD = uniqueArr.sort();
  }
}
function onProductWcChange(val) {
  orderToothForm.value.orderWgNameProduct = val.label;
  orderToothForm.value.orderWgProduct = val.value;
  let oldwgModel = orderToothForm.value.WgModel;
  orderToothForm.value.WgModel = "";
  const id = val.value;
  let wgxhlist = orderToothForm.value.WgXingHao;
  orderToothForm.value.WgXingHao = [];
  orderToothForm.value.childrenWgXingHao = [];
  ColorAPI.getProductData(id).then((data) => {
    orderToothForm.value.WgColor1 = "";
    orderToothForm.value.WgColor2 = "";
    orderToothForm.value.WgColor3 = "";
    if (data != "") {
      Object.assign(toothWgProperty.value, data);
      orderToothForm.value.hasWgType = data.hasType;
      if (data.hasType == 20) {
        modelWgOptions.value = val.children;
        orderToothForm.value.WgXingHao = [];
        orderToothForm.value.childrenWgXingHao = val.children;
        wkey.value += 1;
        clearModels(2);
      }
      if (data.hasType == 10 || data.hasType == 30) {
        if (val.children.length > 0) {
          const oldxinghao = wgxhlist;
          let isold = true;
          oldxinghao.forEach((a) => {
            const isbool = val.children.filter((b) => a.label == b.label);
            if (isbool.length == 0) {
              isold = false;
            } else {
              a.value = isbool[0].value;
            }
          });
          if (isold && oldxinghao.length > 0) {
            orderToothForm.value.WgXingHao = wgxhlist;
            let xy = wgxhlist.filter((b) => oldwgModel.label == b.label);
            if (xy.length > 0) {
              orderToothForm.value.WgModel = {
                label: xy[0].label,
                value: xy[0].value
              };
            }
            setXdColor(data.isColor);
            orderToothForm.value.isWgColor = data.isColor;
            orderToothForm.value.amountWgMode = data.amountMode;
            orderToothForm.value.teethWgMode = data.teethMode;
            orderToothForm.value.productItemClassifyWgId = val.productItemClassifyId;
            if (data.isColor) {
              const colorData = props.colorData;
              orderToothForm.value.WgColor1 = colorData.Color1;
              orderToothForm.value.WgColor2 = colorData.Color2;
              orderToothForm.value.WgColor3 = colorData.Color3;
            }
            return;
          }
          orderToothForm.value.WgXingHao = val.children;
          orderToothForm.value.WgXingHao.forEach((a) => {
            a.isChecked = false;
            a.A = [];
            a.B = [];
            a.C = [];
            a.D = [];
          });
        } else {
          orderToothForm.value.WgXingHao = [];
        }
      }
      setXdColor(data.isColor);
      orderToothForm.value.isWgColor = data.isColor;
      orderToothForm.value.amountWgMode = data.amountMode;
      orderToothForm.value.teethWgMode = data.teethMode;
      orderToothForm.value.productItemClassifyWgId = val.productItemClassifyId;
      if (data.isColor) {
        const colorData = props.colorData;
        orderToothForm.value.WgColor1 = colorData.Color1;
        orderToothForm.value.WgColor2 = colorData.Color2;
        orderToothForm.value.WgColor3 = colorData.Color3;
      }
    } else {
      orderToothForm.value.isWgColor = false;
      orderToothForm.value.teethWgMode = 10;
      setXdColor(orderToothForm.value.isWgColor);
      toothWgProperty.value = {};
    }
    if (orderToothForm.value.WgXingHao.length > 0) {
      const dan = val.children.filter((b) => b.label == "单冠");
      const da = val.children.filter((b) => b.label == "大");
      let number2 = 0;
      if (dan.length > 0) {
        orderToothForm.value.WgModel = { label: dan[0].label, value: dan[0].value };
        number2 = 1;
      }
      if (da.length > 0) {
        orderToothForm.value.WgModel = { label: da[0].label, value: da[0].value };
        number2 = 2;
      }
      yesWgXingHao(number2);
    } else {
      noWgXingHao();
    }
  });
}
function yesWgXingHao(i) {
  const tooh = orderToothForm.value;
  const isbool = false;
  const upJtTeeth = upperTeeth.value.filter((u) => u.selected || u.selecteds);
  const isUpSelect = upJtTeeth.map((u) => u.id);
  upJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiWgModel(item.id, item.selected, isbool);
  });
  const loJtTeeth = lowerTeeth.value.filter((u) => u.selected || u.selecteds);
  loJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiWgModel(item.id, item.selected, isbool);
  });
  if (tooh.WgXingHao.length > 0) {
    const wModelOptions = orderToothForm.value.WgXingHao.map((a) => a.label);
    if (i == 1) {
      const label = tooh.WgModel.label;
      const info = tooh.WgXingHao.filter((b) => b.label == label);
      if (info.length == 1) {
        onWgModelChange(info[0]);
      }
    } else {
      if (i == 2) {
        const label = tooh.WgModel.label;
        const info = tooh.WgXingHao.filter((b) => b.label == label);
        if (info.length == 1) {
          onWgModelChange(info[0]);
        }
      }
    }
  }
  const isDoSelect = loJtTeeth.map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  tooh.WSelected = mergedArray;
  emit("setToothValue", tooh);
}
function ClearYaweiWgModel(values, status1, isbool) {
  if (values.indexOf("A") > -1) {
    const arr = values.split("A");
    if (status1) {
      orderToothForm.value.WA.push(parseInt(arr[1]));
      addWgModel(isbool, "A", values, "wg");
    } else {
      orderToothForm.value.WA = orderToothForm.value.WA.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "A", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WA));
    orderToothForm.value.WA = uniqueArr.sort().reverse();
  } else if (values.indexOf("B") > -1) {
    const arr = values.split("B");
    if (status1) {
      orderToothForm.value.WB.push(parseInt(arr[1]));
      addWgModel(isbool, "B", values, "wg");
    } else {
      orderToothForm.value.WB = orderToothForm.value.WB.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "B", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WB));
    orderToothForm.value.WB = uniqueArr.sort();
  } else if (values.indexOf("C") > -1) {
    const arr = values.split("C");
    if (status1) {
      orderToothForm.value.WC.push(parseInt(arr[1]));
      addWgModel(isbool, "C", values, "wg");
    } else {
      orderToothForm.value.WC = orderToothForm.value.WC.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "C", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WC));
    orderToothForm.value.WC = uniqueArr.sort().reverse();
  } else {
    const arr = values.split("D");
    if (status1) {
      orderToothForm.value.WD.push(parseInt(arr[1]));
      addWgModel(isbool, "D", values, "wg");
    } else {
      orderToothForm.value.WD = orderToothForm.value.WD.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "D", values, "wg");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.WD));
    orderToothForm.value.WD = uniqueArr.sort();
  }
}
function noWgXingHao() {
  const isbool = false;
  const upJtTeeth = upperTeeth.value.filter((u) => u.selected || u.selecteds);
  const isUpSelect = upJtTeeth.map((u) => u.id);
  upJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiWgModel(item.id, item.selected, isbool);
  });
  const loJtTeeth = lowerTeeth.value.filter((u) => u.selected || u.selecteds);
  loJtTeeth.forEach((item) => {
    if (item.selecteds || item.selectedss) {
      item.selected = true;
    }
    item.selecteds = true;
    item.selectedss = true;
    ClearYaweiWgModel(item.id, item.selected, isbool);
  });
  const isDoSelect = loJtTeeth.map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  orderToothForm.value.WSelected = mergedArray;
  emit("setToothValue", orderToothForm.value);
}
function onWgModelChange(val) {
  ygtype.value = "";
  orderToothForm.value.WgModel = { label: val.label, value: val.value };
  orderToothForm.value.WgXingHao.forEach((a) => {
    if (a.value == val.value) {
      setTooths(false);
      a.isChecked = true;
    } else {
      a.isChecked = true;
    }
  });
}
function setTooth(bools) {
  let isbool = bools;
  if (!isbool) {
    const upperJt = upperJtTeeth.value.filter((a) => {
      return a.selecteds == true || a.selectedss;
    });
    upperJt.forEach((u, index) => {
      if (u.selecteds || u.selectedss) {
        toggleTooths("uppers", u, index);
      }
    });
    const lowerJt = lowerJtTeeth.value.filter((a) => {
      return a.selecteds == true || a.selectedss;
    });
    lowerJt.forEach((u, index) => {
      if (u.selecteds || u.selectedss) {
        toggleTooths("lowers", u, index);
      }
    });
  }
}
function setTooths(bools) {
  let isbool = bools;
  if (!isbool) {
    const upperJt = upperTeeth.value.filter((a) => {
      return a.selecteds == true || a.selectedss;
    });
    upperJt.forEach((u, index) => {
      if (u.selecteds || u.selectedss) {
        toggleTooth("upper", u, index);
      }
    });
    const lowerJt = lowerTeeth.value.filter((a) => {
      return a.selecteds == true || a.selectedss;
    });
    lowerJt.forEach((u, index) => {
      if (u.selecteds || u.selectedss) {
        toggleTooth("lower", u, index);
      }
    });
  }
}
function toggleTooths(jawType, item, index) {
  let isbool = false;
  let wModelOptions = orderToothForm.value.XingHao.map((a) => a.label);
  if (item.selected == false && wModelOptions.length > 0 && (!wModelOptions.includes("单冠") || !wModelOptions.includes("连冠"))) {
    let label = orderToothForm.value.Model.label;
    const info = orderToothForm.value.XingHao.filter((b) => b.label !== label);
    let bools = false;
    info.forEach((a) => {
      if (a.A.length > 0 || a.B.length > 0 || a.C.length > 0 || a.D.length > 0) {
        bools = true;
      }
    });
    if (bools) {
      ElNotification({
        title: "Error",
        message: `只能选择【${wModelOptions.join(",")}】其中一个选项!`,
        type: "error",
        duration: 3e3
      });
      return;
    }
  }
  if (wModelOptions.length > 0 && orderToothForm.value.Model == "") {
    ElNotification({
      title: "Error",
      message: `请先选择【${wModelOptions.join(",")}】选项!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  if (wModelOptions.length > 0) {
    isbool = true;
  }
  const values = item.id;
  if (item.selected == true && orderToothForm.value.XingHao.length > 1) {
    let type = "A";
    if (values.indexOf("A") > -1) {
      type = "A";
    }
    if (values.indexOf("B") > -1) {
      type = "B";
    }
    if (values.indexOf("C") > -1) {
      type = "C";
    }
    if (values.indexOf("D") > -1) {
      type = "D";
    }
    delWgModels(true, type, values, jawType, item, index, "jt");
  } else {
    Model(jawType, item, index, isbool);
  }
  const isUpSelect = upperJtTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  const isDoSelect = lowerJtTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  orderToothForm.value.Selected = mergedArray;
  emit("setToothValue", orderToothForm.value);
}
function setColor(it) {
  let colorClassName = "ecmbody-info2-left1-2-1";
  if (it.label == "单冠" || it.label == "连冠") {
    if (it.label == "单冠") {
      if (it.A.length > 0 || it.B.length > 0 || it.C.length > 0 || it.D.length > 0) {
        colorClassName = "ecmbody-info2-left1-2-1-danguanes";
      } else {
        colorClassName = "ecmbody-info2-left1-2-1-danguanes";
      }
    }
    if (it.label == "连冠") {
      if (it.A.length > 0 || it.B.length > 0 || it.C.length > 0 || it.D.length > 0) {
        colorClassName = "ecmbody-info2-left1-2-2-lianguanes";
      } else {
        colorClassName = "ecmbody-info2-left1-2-2-lianguanes";
      }
    }
  } else if (it.label == "大" || it.label == "小") {
    if (it.label == "大") {
      if (it.A.length > 0 || it.B.length > 0 || it.C.length > 0 || it.D.length > 0) {
        colorClassName = "ecmbody-info2-left1-2-1-danguanes";
      } else {
        colorClassName = "ecmbody-info2-left1-2-1-danguanes";
      }
    }
    if (it.label == "小") {
      if (it.A.length > 0 || it.B.length > 0 || it.C.length > 0 || it.D.length > 0) {
        colorClassName = "ecmbody-info2-left1-2-2-lianguanes";
      } else {
        colorClassName = "ecmbody-info2-left1-2-2-lianguanes";
      }
    }
  } else {
    if (it.isChecked) {
      colorClassName = "ecmbody-info2-left1-2-1";
    } else {
      colorClassName = "ecmbody-info2-left1-2-2";
    }
  }
  return colorClassName;
}
function setxzlg(tooth, type) {
  const xingHao = type == "uppers" ? orderToothForm.value.XingHao : orderToothForm.value.WgXingHao;
  if (xingHao.length == 0) {
    return { display: "none" };
  } else {
    var xhlg = xingHao.filter((a) => a.label == "连冠" || a.label == "小");
    if (xhlg.length > 0 && (xhlg[0].A.length > 0 || xhlg[0].B.length > 0 || xhlg[0].C.length > 0 || xhlg[0].D.length > 0)) {
      const id = tooth.id;
      if (id.indexOf("A") > -1) {
        const hasA = xhlg.some((item) => {
          return item.A.find((elem) => elem === id) !== void 0;
        });
        if (hasA) {
          if (id.indexOf("A1") > -1) {
            return { transform: `rotate(${88}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("A2") > -1) {
            return { transform: `rotate(${84}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("A3") > -1) {
            return { transform: `rotate(${78}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("A4") > -1) {
            return { transform: `rotate(${72}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("A5") > -1) {
            return { transform: `rotate(${69}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("A6") > -1) {
            return { transform: `rotate(${65}deg)`, display: tooth.selected ? "block" : "none" };
          } else {
            return { transform: `rotate(${63}deg)`, display: tooth.selected ? "block" : "none" };
          }
        } else {
          return { display: "none" };
        }
      }
      if (id.indexOf("B") > -1) {
        const hasB = xhlg.some((item) => {
          return item.B.find((elem) => elem === id) !== void 0;
        });
        if (hasB) {
          if (id.indexOf("B1") > -1) {
            return { transform: `rotate(${90}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("B2") > -1) {
            return { transform: `rotate(${92}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("B3") > -1) {
            return { transform: `rotate(${96}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("B4") > -1) {
            return { transform: `rotate(${102}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("B5") > -1) {
            return { transform: `rotate(${106}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("B6") > -1) {
            return { transform: `rotate(${110}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("B7") > -1) {
            return { transform: `rotate(${113}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("B8") > -1) {
            return { transform: `rotate(${117}deg)`, display: tooth.selected ? "block" : "none" };
          }
        } else {
          return { display: "none" };
        }
      }
    } else {
      return { display: "none" };
    }
  }
}
function setxzdg(tooth, type) {
  const xingHao = type == "uppers" ? orderToothForm.value.XingHao : orderToothForm.value.WgXingHao;
  if (xingHao.length == 0) {
    return { display: "none" };
  } else {
    var xhlg = xingHao.filter((a) => a.label == "单冠" || a.label == "大");
    if (xhlg.length > 0 && (xhlg[0].A.length > 0 || xhlg[0].B.length > 0 || xhlg[0].C.length > 0 || xhlg[0].D.length > 0)) {
      const id = tooth.id;
      if (id.indexOf("A") > -1) {
        const hasA = xhlg.some((item) => {
          return item.A.find((elem) => elem === id) !== void 0;
        });
        if (hasA) {
          return { display: "block" };
        } else {
          return { display: "none" };
        }
      }
      if (id.indexOf("B") > -1) {
        const hasB = xhlg.some((item) => {
          return item.B.find((elem) => elem === id) !== void 0;
        });
        if (hasB) {
          return { display: "block" };
        } else {
          return { display: "none" };
        }
      }
    } else {
      return { display: "none" };
    }
  }
}
function setline(tooth, type) {
  const xingHao = type == "uppers" ? orderToothForm.value.XingHao : orderToothForm.value.WgXingHao;
  if (xingHao.length == 0) {
    return { display: "none" };
  } else {
    var xhlg = xingHao.filter((a) => a.label == "连冠");
    if (xhlg.length > 0 && (xhlg[0].A.length > 0 || xhlg[0].B.length > 0 || xhlg[0].C.length > 0 || xhlg[0].D.length > 0)) {
      const id = tooth.id;
      if (id.indexOf("A") > -1) {
        const hasA = xhlg.some((item) => {
          return item.A.find((elem) => elem === id) !== void 0;
        });
        if (hasA) {
          const s = parseInt(id.split("A")[1]) + 1;
          const has_s = xhlg.some((item) => {
            return item.A.find((elem) => elem === "A" + s) !== void 0;
          });
          if (has_s) {
            return {
              display: "block",
              "border-left": "3px solid #E03A9D",
              position: "absolute",
              height: "37px",
              "margin-left": "4px"
            };
          } else {
            return {
              display: "none"
            };
          }
        }
      }
      if (id.indexOf("B") > -1) {
        const hasB = xhlg.some((item) => {
          return item.B.find((elem) => elem === id) !== void 0;
        });
        if (hasB) {
          if (id == "B1") {
            const hasA = xhlg.some((item) => {
              return item.A.find((elem) => elem === "A1") !== void 0;
            });
            if (hasA) {
              return {
                display: "block",
                "border-left": "3px solid #E03A9D",
                position: "absolute",
                height: "37px",
                "margin-left": "4px"
              };
            } else {
              return {
                display: "none"
              };
            }
          } else {
            const s = parseInt(id.split("B")[1]) - 1;
            const has_s = xhlg.some((item) => {
              return item.B.find((elem) => elem === "B" + s) !== void 0;
            });
            if (has_s) {
              return {
                display: "block",
                "border-left": "3px solid #E03A9D",
                position: "absolute",
                height: "37px",
                "margin-left": "4px"
              };
            }
          }
        } else {
          return {
            display: "none"
          };
        }
      }
    } else {
      return { display: "none" };
    }
  }
}
function setxzdxlg(tooth, type) {
  const xingHao = type == "lowers" ? orderToothForm.value.XingHao : orderToothForm.value.WgXingHao;
  if (xingHao.length == 0) {
    return { display: "none" };
  } else {
    var xhlg = xingHao.filter((a) => a.label == "连冠" || a.label == "小");
    if (xhlg.length > 0 && (xhlg[0].A.length > 0 || xhlg[0].B.length > 0 || xhlg[0].C.length > 0 || xhlg[0].D.length > 0)) {
      const id = tooth.id;
      if (id.indexOf("C") > -1) {
        const hasC = xhlg.some((item) => {
          return item.C.find((elem) => elem === id) !== void 0;
        });
        if (hasC) {
          if (id.indexOf("C2") > -1) {
            return { transform: `rotate(${97}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("C1") > -1) {
            return { transform: `rotate(${92}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("C3") > -1) {
            return { transform: `rotate(${100}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("C4") > -1) {
            return { transform: `rotate(${105}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("C5") > -1) {
            return { transform: `rotate(${108}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("C6") > -1) {
            return { transform: `rotate(${114}deg)`, display: tooth.selected ? "block" : "none" };
          } else {
            return { transform: `rotate(${116}deg)`, display: tooth.selected ? "block" : "none" };
          }
        } else {
          return { display: "none" };
        }
      }
      if (id.indexOf("D") > -1) {
        const hasD = xhlg.some((item) => {
          return item.D.find((elem) => elem === id) !== void 0;
        });
        if (hasD) {
          if (id.indexOf("D1") > -1) {
            return { transform: `rotate(${90}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("D2") > -1) {
            return { transform: `rotate(${87}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("D3") > -1) {
            return { transform: `rotate(${81}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("D4") > -1) {
            return { transform: `rotate(${77}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("D5") > -1) {
            return { transform: `rotate(${73}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("D6") > -1) {
            return { transform: `rotate(${71}deg)`, display: tooth.selected ? "block" : "none" };
          } else if (id.indexOf("D8") > -1) {
            return { transform: `rotate(${63}deg)`, display: tooth.selected ? "block" : "none" };
          } else {
            return { transform: `rotate(${64}deg)`, display: tooth.selected ? "block" : "none" };
          }
        } else {
          return { display: "none" };
        }
      }
    } else {
      return { display: "none" };
    }
  }
}
function setxzdxdg(tooth, type) {
  const xingHao = type == "lowers" ? orderToothForm.value.XingHao : orderToothForm.value.WgXingHao;
  if (xingHao.length == 0) {
    return { display: "none" };
  } else {
    var xhlg = xingHao.filter((a) => a.label == "单冠" || a.label == "大");
    if (xhlg.length > 0 && (xhlg[0].A.length > 0 || xhlg[0].B.length > 0 || xhlg[0].C.length > 0 || xhlg[0].D.length > 0)) {
      const id = tooth.id;
      if (id.indexOf("C") > -1) {
        const hasC = xhlg.some((item) => {
          return item.C.find((elem) => elem === id) !== void 0;
        });
        if (hasC) {
          return { display: "block" };
        } else {
          return { display: "none" };
        }
      }
      if (id.indexOf("D") > -1) {
        const hasD = xhlg.some((item) => {
          return item.D.find((elem) => elem === id) !== void 0;
        });
        if (hasD) {
          return { display: "block" };
        } else {
          return { display: "none" };
        }
      }
    } else {
      return { display: "none" };
    }
  }
}
function setlinex(tooth, type) {
  const xingHao = type == "lowers" ? orderToothForm.value.XingHao : orderToothForm.value.WgXingHao;
  if (xingHao.length == 0) {
    return { display: "none" };
  } else {
    var xhlg = xingHao.filter((a) => a.label == "连冠");
    if (xhlg.length > 0 && (xhlg[0].A.length > 0 || xhlg[0].B.length > 0 || xhlg[0].C.length > 0 || xhlg[0].D.length > 0)) {
      const id = tooth.id;
      if (id.indexOf("C") > -1) {
        const hasC = xhlg.some((item) => {
          return item.C.find((elem) => elem === id) !== void 0;
        });
        if (hasC) {
          const s = parseInt(id.split("C")[1]) + 1;
          const has_s = xhlg.some((item) => {
            return item.C.find((elem) => elem === "C" + s) !== void 0;
          });
          if (has_s) {
            return {
              display: "block",
              "border-left": "3px solid #E03A9D",
              position: "absolute",
              height: "37px",
              "margin-left": "4px"
            };
          } else {
            return {
              display: "none"
            };
          }
        }
      }
      if (id.indexOf("D") > -1) {
        const hasD = xhlg.some((item) => {
          return item.D.find((elem) => elem === id) !== void 0;
        });
        if (hasD) {
          if (id == "D1") {
            const hasD2 = xhlg.some((item) => {
              return item.C.find((elem) => elem === "C1") !== void 0;
            });
            if (hasD2) {
              return {
                display: "block",
                "border-left": "3px solid #E03A9D",
                position: "absolute",
                height: "37px",
                "margin-left": "4px"
              };
            } else {
              return {
                display: "none"
              };
            }
          } else {
            const s = parseInt(id.split("D")[1]) - 1;
            const has_s = xhlg.some((item) => {
              return item.D.find((elem) => elem === "D" + s) !== void 0;
            });
            if (has_s) {
              return {
                display: "block",
                "border-left": "3px solid #E03A9D",
                position: "absolute",
                height: "37px",
                "margin-left": "4px"
              };
            }
          }
        } else {
          return {
            display: "none"
          };
        }
      }
    } else {
      return { display: "none" };
    }
  }
}
function getJtToothPosition(jawType, index) {
  const halfTeeth = 8;
  const isLeft = index < halfTeeth;
  const posInHalf = isLeft ? halfTeeth - 1 - index : index - halfTeeth;
  const baseParams = ref({
    uppers: {
      top: "3%",
      size: 35,
      // 基础大小
      curve: 1.2,
      // 弧度系数
      spread: 33
      // 水平间距
    },
    lowers: {
      top: "67%",
      size: 35,
      curve: -1.2,
      // 下颌弧度向下
      spread: 33
    }
  });
  const params = baseParams.value[jawType];
  const size = params.size + Math.min(posInHalf, 3) * 2;
  const containerWidth = 542;
  const centerX = containerWidth / 2;
  const xOffset = (posInHalf + 1) * params.spread;
  const left = isLeft ? centerX - xOffset : centerX + xOffset - size;
  const yOffset = Math.pow(posInHalf, 2) * params.curve;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}px`,
    top: `calc(${params.top} + ${yOffset}px)`,
    position: "absolute"
  };
}
function getJtToothPositions(jawType, index) {
  const halfTeeth = 8;
  const isLeft = index < halfTeeth;
  const posInHalf = isLeft ? halfTeeth - 1 - index : index - halfTeeth;
  const baseParams = ref({
    uppers: {
      top: "39%",
      size: 28,
      // 基础大小
      curve: 1.2,
      // 弧度系数
      spread: 29
      // 水平间距
    },
    lowers: {
      top: "56%",
      size: 28,
      curve: -1.2,
      // 下颌弧度向下
      spread: 29
    }
  });
  const params = baseParams.value[jawType];
  const size = params.size + Math.min(posInHalf, 3) * 2;
  const containerWidth = 566;
  const centerX = containerWidth / 2;
  const xOffset = (posInHalf + 1) * params.spread;
  const left = isLeft ? centerX - xOffset - 5 : centerX + xOffset - size - 5;
  const yOffset = Math.pow(posInHalf, 2) * params.curve;
  return {
    width: `${13}px`,
    height: `${13}px`,
    left: `${left}px`,
    top: `calc(${params.top} + ${yOffset}px)`,
    position: "absolute"
  };
}
function handleSearch(query, index) {
  if (query) {
    loading.value = true;
    setTimeout(() => {
      xingParams.factoryId = props.factoryId;
      xingParams.productItemId = orderToothForm.value.orderProduct;
      xingParams.keywords = query;
      ColorAPI.getModePage(xingParams).then((data) => {
        const xm = [{ label: query, value: 0 }];
        if (data.list.length > 0) {
          data.list.forEach((a, inde) => {
            const xh = {};
            xh.label = a.name;
            xh.value = a.id;
            xm.push(xh);
          });
        }
        if (xm.length > 1) {
          if (index == 0) {
            modelOptions.value = xm;
          } else {
            modelWgOptions.value = xm;
          }
        } else {
          if (index == 0) {
            let options = modelOptions.value.filter((a) => a.value > 0);
            options.push({ label: query, value: 0 });
            modelOptions.value = options;
            orderToothForm.Model = { label: query, value: 0 };
          }
          if (index == 1) {
            let options = modelWgOptions.value.filter((a) => a.value > 0);
            options.push({ label: query, value: 0 });
            modelWgOptions.value = options;
            orderToothForm.WgModel = { label: query, value: 0 };
          }
        }
      }).finally(() => {
        loading.value = false;
      });
    }, 1e3);
  }
}
function Model(jawType, item, index, isbool) {
  const values = item.id;
  if (jawType === "uppers") {
    upperJtTeeth.value[index].selected = !upperJtTeeth.value[index].selected;
    item.selected = upperJtTeeth.value[index].selected;
  } else {
    lowerJtTeeth.value[index].selected = !lowerJtTeeth.value[index].selected;
    item.selected = lowerJtTeeth.value[index].selected;
  }
  const status1 = item.selected;
  if (values.indexOf("A") > -1) {
    const arr = values.split("A");
    if (status1) {
      orderToothForm.value.A.push(parseInt(arr[1]));
      addWgModel(isbool, "A", values, "jt");
    } else {
      orderToothForm.value.A = orderToothForm.value.A.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "A", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.A));
    orderToothForm.value.A = uniqueArr.sort().reverse();
  } else if (values.indexOf("B") > -1) {
    const arr = values.split("B");
    if (status1) {
      orderToothForm.value.B.push(parseInt(arr[1]));
      addWgModel(isbool, "B", values, "jt");
    } else {
      orderToothForm.value.B = orderToothForm.value.B.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "B", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.B));
    orderToothForm.value.B = uniqueArr.sort();
  } else if (values.indexOf("C") > -1) {
    const arr = values.split("C");
    if (status1) {
      orderToothForm.value.C.push(parseInt(arr[1]));
      addWgModel(isbool, "C", values, "jt");
    } else {
      orderToothForm.value.C = orderToothForm.value.C.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "C", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.C));
    orderToothForm.value.C = uniqueArr.sort().reverse();
  } else {
    const arr = values.split("D");
    if (status1) {
      orderToothForm.value.D.push(parseInt(arr[1]));
      addWgModel(isbool, "D", values, "jt");
    } else {
      orderToothForm.value.D = orderToothForm.value.D.filter((a) => a !== parseInt(arr[1]));
      delWgModel(isbool, "D", values, "jt");
    }
    const uniqueArr = Array.from(new Set(orderToothForm.value.D));
    orderToothForm.value.D = uniqueArr.sort();
  }
}
function toggleTooth(jawType, item, index) {
  let isbool = false;
  let wModelOptions = orderToothForm.value.WgXingHao.map((a) => a.label);
  if (item.selected == false && wModelOptions.length > 0 && (!wModelOptions.includes("单冠") || !wModelOptions.includes("连冠"))) {
    let label = orderToothForm.value.Model.label;
    const info = orderToothForm.value.XingHao.filter((b) => b.label !== label);
    let bools = false;
    info.forEach((a) => {
      if (a.A.length > 0 || a.B.length > 0 || a.C.length > 0 || a.D.length > 0) {
        bools = true;
      }
    });
    if (bools) {
      ElNotification({
        title: "Error",
        message: `只能选择【${wModelOptions.join(",")}】其中一个选项!`,
        type: "error",
        duration: 3e3
      });
      return;
    }
  }
  if (wModelOptions.length > 0 && orderToothForm.value.WgModel == "") {
    ElNotification({
      title: "Error",
      message: `请先选择【${wModelOptions.join(",")}】选项!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  if (wModelOptions.length > 0) {
    isbool = true;
  }
  const values = item.id;
  if (item.selected == true && orderToothForm.value.WgXingHao.length > 1) {
    let type = "A";
    if (values.indexOf("A") > -1) {
      type = "A";
    }
    if (values.indexOf("B") > -1) {
      type = "B";
    }
    if (values.indexOf("C") > -1) {
      type = "C";
    }
    if (values.indexOf("D") > -1) {
      type = "D";
    }
    delWgModels(true, type, values, jawType, item, index, "wg");
  } else {
    WgModel(jawType, item, index, isbool);
  }
  const isUpSelect = upperTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  const isDoSelect = lowerTeeth.value.filter((u) => u.selected == true).map((u) => u.id);
  let mergedArray = [...isUpSelect, ...isDoSelect];
  orderToothForm.value.WSelected = mergedArray;
  emit("setToothValue", orderToothForm.value);
}
function addWgModel(isbool, v, item, type) {
  if (isbool && type == "wg") {
    const xinHao = orderToothForm.value.WgModel.label;
    const xhIndex = orderToothForm.value.WgXingHao.findIndex((a) => a.label === xinHao);
    orderToothForm.value.WgXingHao[xhIndex][v].push(item);
  }
  if (isbool && type == "jt") {
    const xinHao = orderToothForm.value.Model.label;
    const xhIndex = orderToothForm.value.XingHao.findIndex((a) => a.label === xinHao);
    orderToothForm.value.XingHao[xhIndex][v].push(item);
  }
}
function delWgModel(isbool, v, item, type) {
  if (isbool && type == "wg") {
    const xinHao = orderToothForm.value.WgModel.label;
    const xhIndex = orderToothForm.value.WgXingHao.findIndex((a) => a.label === xinHao);
    const newarr = orderToothForm.value.WgXingHao[xhIndex][v].filter((o) => o != item);
    orderToothForm.value.WgXingHao[xhIndex][v] = newarr;
  }
  if (isbool && type == "jt") {
    const xinHao = orderToothForm.value.Model.label;
    const xhIndex = orderToothForm.value.XingHao.findIndex((a) => a.label === xinHao);
    const newarr = orderToothForm.value.XingHao[xhIndex][v].filter((o) => o != item);
    orderToothForm.value.XingHao[xhIndex][v] = newarr;
  }
}
function delTook(isbool, v, item, m, type) {
  if (isbool && type == "wg") {
    const xinHao = m;
    const xhIndex = orderToothForm.value.WgXingHao.findIndex((a) => a.label === xinHao);
    const newarr = orderToothForm.value.WgXingHao[xhIndex][v].filter((o) => o != item);
    orderToothForm.value.WgXingHao[xhIndex][v] = newarr;
  }
  if (isbool && type == "jt") {
    const xinHao = m;
    const xhIndex = orderToothForm.value.XingHao.findIndex((a) => a.label === xinHao);
    const newarr = orderToothForm.value.XingHao[xhIndex][v].filter((o) => o != item);
    orderToothForm.value.XingHao[xhIndex][v] = newarr;
  }
}
function delWgModels(isbool, v, item, jawType, items, index, type) {
  if (isbool && type == "wg") {
    const xinHao = orderToothForm.value.WgModel.label;
    const value = orderToothForm.value.WgXingHao.filter((a) => a.label == xinHao);
    if (value.length > 0) {
      const info = value[0][v];
      const indexs = info.findIndex((b) => b == item);
      addWgModel(true, v, item, "wg");
      orderToothForm.value.WgXingHao.forEach((a) => {
        if (a.label != xinHao) {
          delTook(true, v, item, a.label, "wg");
        }
      });
    }
  }
  if (isbool && type == "jt") {
    const xinHao = orderToothForm.value.Model.label;
    const value = orderToothForm.value.XingHao.filter((a) => a.label == xinHao);
    if (value.length > 0) {
      const info = value[0][v];
      const indexs = info.findIndex((b) => b == item);
      addWgModel(true, v, item, "jt");
      orderToothForm.value.XingHao.forEach((a) => {
        if (a.label != xinHao) {
          delTook(true, v, item, a.label, "jt");
        }
      });
    }
  }
}
function getToothPosition(jawType, index) {
  const halfTeeth = 8;
  const isLeft = index < halfTeeth;
  const posInHalf = isLeft ? halfTeeth - 1 - index : index - halfTeeth;
  const baseParams = ref({
    upper: {
      top: "5%",
      size: 35,
      // 基础大小
      curve: 1.2,
      // 弧度系数
      spread: 33
      // 水平间距
    },
    lower: {
      top: "65%",
      size: 35,
      curve: -1.2,
      // 下颌弧度向下
      spread: 33
    }
  });
  const params = baseParams.value[jawType];
  const size = params.size + Math.min(posInHalf, 3) * 2;
  const containerWidth = 542;
  const centerX = containerWidth / 2;
  const xOffset = (posInHalf + 1) * params.spread;
  const left = isLeft ? centerX - xOffset : centerX + xOffset - size;
  const yOffset = Math.pow(posInHalf, 2) * params.curve;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}px`,
    top: `calc(${params.top} + ${yOffset}px)`,
    position: "absolute"
  };
}
function getToothPositions(jawType, index) {
  const halfTeeth = 8;
  const isLeft = index < halfTeeth;
  const posInHalf = isLeft ? halfTeeth - 1 - index : index - halfTeeth;
  const baseParams = ref({
    upper: {
      top: "43%",
      size: 28,
      // 基础大小
      curve: 1.2,
      // 弧度系数
      spread: 29
      // 水平间距
    },
    lower: {
      top: "56%",
      size: 28,
      curve: -1.2,
      // 下颌弧度向下
      spread: 29
    }
  });
  const params = baseParams.value[jawType];
  const size = params.size + Math.min(posInHalf, 3) * 2;
  const containerWidth = 555;
  const centerX = containerWidth / 2;
  const xOffset = (posInHalf + 1) * params.spread;
  const left = isLeft ? centerX - xOffset : centerX + xOffset - size;
  const yOffset = Math.pow(posInHalf, 2) * params.curve;
  return {
    width: `${13}px`,
    height: `${13}px`,
    left: `${left}px`,
    top: `calc(${params.top} + ${yOffset}px)`,
    position: "absolute"
  };
}
function onChange(item, index) {
  debugger;
  orderToothForm.value.selectedButton = index;
  orderToothForm.value.productItemClassifyId = item.value;
  emit("setClassValue", item.value);
}
function onWgChange(item, index) {
  orderToothForm.value.WgselectedButton = index;
  orderToothForm.value.productItemClassifyWgId = item.value;
  emit("setWgClassValue", item.value);
}
function setjtlx(v) {
  jttype.value = v.toString();
  const xhdata = orderToothForm.value.XingHao;
  xhdata.forEach((a) => {
    a.isChecked = false;
    a.A = [];
    a.B = [];
    a.C = [];
    a.D = [];
  });
  const bools = orderToothForm.value.orderProduct > 0 ? true : false;
  if (v == 0) {
    upperJtTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selecteds = false;
        u.selected = false;
        u.selectedss = false;
      } else {
        u.selecteds = true;
        u.selected = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    lowerJtTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selecteds = false;
        u.selected = false;
        u.selectedss = false;
      } else {
        u.selected = true;
        u.selecteds = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    if (bools) {
      orderToothForm.value.A = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.B = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.C = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.D = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.Selected = [
        "A7",
        "A6",
        "A5",
        "A4",
        "A3",
        "A2",
        "A1",
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "C7",
        "C6",
        "C5",
        "C4",
        "C3",
        "C2",
        "C1",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7"
      ];
    } else {
      orderToothForm.value.A = [];
      orderToothForm.value.B = [];
      orderToothForm.value.C = [];
      orderToothForm.value.D = [];
      orderToothForm.value.Selected = [];
    }
  }
  if (v == 1) {
    upperJtTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selected = false;
        u.selecteds = false;
        u.selectedss = false;
      } else {
        u.selected = true;
        u.selecteds = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    lowerJtTeeth.value.forEach((u) => {
      u.selected = false;
      u.selecteds = false;
      u.selectedss = false;
    });
    if (bools) {
      orderToothForm.value.A = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.B = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.C = [];
      orderToothForm.value.D = [];
      orderToothForm.value.Selected = [
        "A7",
        "A6",
        "A5",
        "A4",
        "A3",
        "A2",
        "A1",
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7"
      ];
    } else {
      orderToothForm.value.A = [];
      orderToothForm.value.B = [];
      orderToothForm.value.C = [];
      orderToothForm.value.D = [];
      orderToothForm.value.Selected = [];
    }
  }
  if (v == 2) {
    upperJtTeeth.value.forEach((u) => {
      u.selected = false;
      u.selecteds = false;
      u.selectedss = false;
    });
    lowerJtTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selected = false;
        u.selecteds = false;
        u.selectedss = false;
      } else {
        u.selected = true;
        u.selecteds = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    if (bools) {
      orderToothForm.value.A = [];
      orderToothForm.value.B = [];
      orderToothForm.value.C = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.D = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.Selected = [
        "C7",
        "C6",
        "C5",
        "C4",
        "C3",
        "C2",
        "C1",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7"
      ];
    } else {
      orderToothForm.value.A = [];
      orderToothForm.value.B = [];
      orderToothForm.value.C = [];
      orderToothForm.value.D = [];
      orderToothForm.value.Selected = [];
    }
  }
  if (v == 3) {
    orderToothForm.value.A = [];
    orderToothForm.value.B = [];
    orderToothForm.value.C = [];
    orderToothForm.value.D = [];
    orderToothForm.value.Selected = [];
    orderToothForm.value.XingHao.forEach((a) => {
      a.isChecked = false;
      a.A = [];
      a.B = [];
      a.C = [];
      a.D = [];
    });
    upperJtTeeth.value.forEach((u) => {
      u.selected = false;
      u.selecteds = false;
      u.selectedss = false;
    });
    lowerJtTeeth.value.forEach((l) => {
      l.selected = false;
      l.selecteds = false;
      l.selectedss = false;
    });
  }
  if (xhdata.length > 0) {
    const dan = xhdata.filter((b) => b.label == "单冠");
    const da = xhdata.filter((b) => b.label == "大");
    let number2 = 0;
    if (dan.length > 0) {
      orderToothForm.value.Model = { label: dan[0].label, value: dan[0].value };
      number2 = 1;
    }
    if (da.length > 0) {
      orderToothForm.value.Model = { label: da[0].label, value: da[0].value };
      number2 = 2;
    }
    yesXingHao(number2);
  }
  emit("setToothValue", orderToothForm.value);
}
function setyglx(v) {
  ygtype.value = v.toString();
  const xhdata = orderToothForm.value.WgXingHao;
  xhdata.forEach((a) => {
    a.isChecked = false;
    a.A = [];
    a.B = [];
    a.C = [];
    a.D = [];
  });
  const bools = orderToothForm.value.orderWgProduct > 0 ? true : false;
  if (v == 0) {
    upperTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selected = false;
        u.selecteds = false;
        u.selectedss = false;
      } else {
        u.selected = true;
        u.selecteds = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    lowerTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selected = false;
        u.selecteds = false;
        u.selectedss = false;
      } else {
        u.selected = true;
        u.selecteds = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    if (bools) {
      orderToothForm.value.WA = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.WB = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.WC = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.WD = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.WSelected = [
        "A7",
        "A6",
        "A5",
        "A4",
        "A3",
        "A2",
        "A1",
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7",
        "C7",
        "C6",
        "C5",
        "C4",
        "C3",
        "C2",
        "C1",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7"
      ];
    } else {
      orderToothForm.value.WA = [];
      orderToothForm.value.WB = [];
      orderToothForm.value.WC = [];
      orderToothForm.value.WD = [];
      orderToothForm.value.WSelected = [];
    }
  }
  if (v == 1) {
    upperTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selected = false;
        u.selecteds = false;
        u.selectedss = false;
      } else {
        u.selected = true;
        u.selecteds = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    lowerTeeth.value.forEach((u) => {
      u.selected = false;
      u.selecteds = false;
      u.selectedss = false;
    });
    if (bools) {
      orderToothForm.value.WA = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.WB = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.WC = [];
      orderToothForm.value.WD = [];
      orderToothForm.value.WSelected = [
        "A7",
        "A6",
        "A5",
        "A4",
        "A3",
        "A2",
        "A1",
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
        "B7"
      ];
    } else {
      orderToothForm.value.WA = [];
      orderToothForm.value.WB = [];
      orderToothForm.value.WC = [];
      orderToothForm.value.WD = [];
      orderToothForm.value.WSelected = [];
    }
  }
  if (v == 2) {
    upperTeeth.value.forEach((u) => {
      u.selected = false;
      u.selecteds = false;
      u.selectedss = false;
    });
    lowerTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selected = false;
        u.selecteds = false;
        u.selectedss = false;
      } else {
        u.selected = true;
        u.selecteds = true;
        if (bools) {
          u.selectedss = true;
        }
      }
    });
    if (bools) {
      orderToothForm.value.WA = [];
      orderToothForm.value.WB = [];
      orderToothForm.value.WC = [7, 6, 5, 4, 3, 2, 1];
      orderToothForm.value.WD = [1, 2, 3, 4, 5, 6, 7];
      orderToothForm.value.WSelected = [
        "C7",
        "C6",
        "C5",
        "C4",
        "C3",
        "C2",
        "C1",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7"
      ];
    } else {
      orderToothForm.value.WA = [];
      orderToothForm.value.WB = [];
      orderToothForm.value.WC = [];
      orderToothForm.value.WD = [];
      orderToothForm.value.WSelected = [];
    }
  }
  if (v == 3) {
    orderToothForm.value.WA = [];
    orderToothForm.value.WB = [];
    orderToothForm.value.WC = [];
    orderToothForm.value.WD = [];
    orderToothForm.value.WSelected = [];
    orderToothForm.value.WgXingHao.forEach((a) => {
      a.isChecked = false;
      a.A = [];
      a.B = [];
      a.C = [];
      a.D = [];
    });
    upperTeeth.value.forEach((u) => {
      u.selected = false;
      u.selecteds = false;
      u.selectedss = false;
    });
    lowerTeeth.value.forEach((l) => {
      l.selected = false;
      l.selecteds = false;
      l.selectedss = false;
    });
  }
  if (xhdata.length > 0) {
    const dan = xhdata.filter((b) => b.label == "单冠");
    const da = xhdata.filter((b) => b.label == "大");
    let number2 = 0;
    if (dan.length > 0) {
      orderToothForm.value.WgModel = { label: dan[0].label, value: dan[0].value };
      number2 = 1;
    }
    if (da.length > 0) {
      orderToothForm.value.WgModel = { label: da[0].label, value: da[0].value };
      number2 = 2;
    }
    yesWgXingHao(number2);
  }
  emit("setToothValue", orderToothForm.value);
}
function hadFocus(v, item) {
  nextTick(() => {
    if (v == "selectRef") {
      selectRef.value.filterValue = "";
      nextTick(() => {
        selectRef.value.filterValue = "666";
        selectRef.value.currentPlaceholder = "9999";
      });
    }
    if (v == "selectWgRef") {
      orderToothForm.value.WgModel = orderToothForm.value.WgModel;
    }
  });
}
function handleSelectBlur(v) {
  if (v == "selectRef") {
    const selectDom = selectRef.value.$el;
    const inputDom = selectDom.querySelector(".el-select__input");
    if (inputDom) {
      const label = inputDom.value.trim();
      if (label != "") {
        orderToothForm.value.Model = { label, value: 0 };
      }
    }
  }
  if (v == "selectColorRef") {
    const selectDom = selectColorRef.value.$el;
    const inputDom = selectDom.querySelector(".el-select__input");
    if (inputDom) {
      const label = inputDom.value.trim();
      if (label != "") {
        orderToothForm.value.Color1 = { label, value: "" };
      }
    }
  }
  if (v == "selectWgRef") {
    const selectDom = selectWgRef.value.$el;
    const inputDom = selectDom.querySelector(".el-select__input");
    if (inputDom) {
      const label = inputDom.value.trim();
      if (label != "") {
        orderToothForm.value.WgModel = { label, value: 0 };
      }
    }
  }
  if (v == "selectWgColorRef") {
    const selectDom = selectWgColorRef.value.$el;
    const inputDom = selectDom.querySelector(".el-select__input");
    if (inputDom) {
      const label = inputDom.value.trim();
      if (label != "") {
        orderToothForm.value.WgColor1 = { label, value: "" };
      }
    }
  }
}
async function colseyg() {
  orderToothForm.value.isAdditional = false;
  isAdditional.value = false;
  isYg.value = true;
  let clssinfo = props.classList.filter((a) => a.ids == props.isClassValue);
  emit("setIsAdditional", false);
  emit("setClassChange", clssinfo[0], props.isClassValue);
}
function openyg() {
  orderToothForm.value.isAdditional = true;
  isAdditional.value = true;
  isYg.value = false;
  let clssinfo = props.classList.filter((a) => a.ids == props.isClassValue);
  emit("setIsAdditional", true);
  emit("setClassChange", clssinfo[0], props.isClassValue);
}
function change(item) {
  if (item.isCustom) {
    orderToothForm.value.Model = { label: item.label, value: 0 };
  } else {
    orderToothForm.value.Model = { label: item.label, value: item.value };
  }
}
function inputModel(val, v) {
  if (typeof val === "string" && v == 1) {
    Models.value = val;
    orderToothForm.value.Model = { label: val, value: 0 };
  }
  if (typeof val === "string" && v == 2) {
    WgModels.value = val;
    orderToothForm.value.WgModels = { label: val, value: 0 };
  }
}
function clearModels(v) {
  if (v == 1) {
    orderToothForm.value.Model = "";
    Models.value = "";
  } else {
    orderToothForm.value.WgModel = "";
    WgModels.value = "";
  }
}
function clearColors1(v) {
  if (v == 1) {
    orderToothForm.value.Color1 = "";
    Colors1.value = "";
  } else {
    orderToothForm.value.WgColor1 = "";
    WgColors1.value = "";
  }
}
function inputColor(val, v) {
  if (typeof val === "string" && v == 1) {
    Colors1.value = val;
    orderToothForm.value.Color1 = { label: val, value: val };
  }
  if (typeof val === "string" && v == 2) {
    WgColors1.value = val;
    orderToothForm.value.WgColor1 = { label: val, value: val };
  }
}
function changeWgModels(item) {
  if (item.isCustom) {
    orderToothForm.value.WgModel = { label: item.label, value: 0 };
  } else {
    orderToothForm.value.WgModel = { label: item.label, value: item.value };
  }
}
function onColorChange(item, name) {
  if (name == "WgColor1") {
    if (item.isCustom) {
      orderToothForm.value.WgColor1 = { label: item.label, value: item.label };
    } else {
      orderToothForm.value.WgColor1 = { label: item.label, value: item.value };
    }
  }
  if (name == "Color1") {
    if (item.isCustom) {
      orderToothForm.value.Color1 = { label: item.label, value: item.label };
    } else {
      orderToothForm.value.Color1 = { label: item.label, value: item.value };
    }
  }
  if (item.value == 0) {
    item.value = item.label;
  }
  emit("setColorValue", item, name);
}
function cancelSelects() {
  cancelSelect();
}
const cancelSelect = () => {
  const tooh = orderToothForm.value;
  const toohProduct = tooh.orderProduct;
  const toothWgProduct = tooh.orderWgProduct;
  upperJtTeeth.value.forEach((u) => {
    u.selecteds = false;
    u.selectedss = false;
    u.selected = toohProduct > 0 ? u.selected : false;
  });
  lowerJtTeeth.value.forEach((l) => {
    l.selecteds = false;
    l.selectedss = false;
    l.selected = toohProduct > 0 ? l.selected : false;
  });
  upperTeeth.value.forEach((u) => {
    u.selecteds = false;
    u.selectedss = false;
    u.selected = toothWgProduct > 0 ? u.selected : false;
  });
  lowerTeeth.value.forEach((l) => {
    l.selecteds = false;
    l.selectedss = false;
    l.selected = toothWgProduct > 0 ? l.selected : false;
  });
};
defineExpose({
  cancelSelect
});
</script>
<style lang="scss" scoped>
.tooth-positions {
  width: 100%;
  display: flex;
  height: auto;
  flex-flow: column;

  .ecmbody-info2-top1 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .ecmbody-info2-left {
      display: flex;
      width: 48%;
      flex-flow: column;
      .ecmbody-info2-left1 {
        width: 100%;
        display: flex;
        font-weight: 700;
        font-style: Bold;
        font-size: 20px;
        height: 30px;
        color: #333f48;
        justify-content: space-between;
        .ecmbody-info2-left1-1 {
          display: flex;
          width: 20%;
        }
        .ecmbody-info2-left1-1 {
          display: flex;
          width: auto;
          align-items: center;
        }
        .ecmbody-info2-left1-2 {
          display: flex;
          width: 60%;
          align-items: center;
          justify-content: end;
          .ecmbody-info2-left1-2-1 {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-size: 13px;
            line-height: 100%;
            color: #f1e7b4;
            background-color: #e03a9d;
            border: 2px solid #f1e7b4;
            cursor: pointer;
            background-image: url(/images/xz.png);
            background-position: right top;
            background-repeat: no-repeat;
          }
          .ecmbody-info2-left1-2-2 {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 4px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #8a96a2;
            border: 1px solid #8a96a2;
            font-weight: 400;
            font-size: 13px;
            line-height: 100%;
            color: #ffffff;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-1-danguan {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #8a96a2;
            border: 1px solid #8a96a2;
            font-weight: 400;
            line-height: 100%;
            font-size: 13px;
            color: #ffffff;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-2-lianguan {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #8a96a2;
            border: 1px solid #8a96a2;
            font-weight: 400;
            line-height: 100%;
            font-size: 13px;
            color: #ffffff;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-1-danguans {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-size: 15px;
            line-height: 100%;
            color: #f1e7b4;
            background-color: #3475e0;
            border: 2px solid #f1e7b4;
            cursor: pointer;
            background-image: url(/images/xz.png);
            background-position: right top;
            background-repeat: no-repeat;
          }
          .ecmbody-info2-left1-2-1-danguanes {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-size: 15px;
            line-height: 100%;
            color: #ffffff;
            background-color: #3475e0;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-2-lianguans {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #e03a9d;
            border: 2px solid #f1e7b4;
            font-weight: 700;
            font-size: 15px;
            line-height: 100%;
            color: #f1e7b4;
            cursor: pointer;
            background-image: url(/images/xz.png);
            background-position: right top;
            background-repeat: no-repeat;
          }
          .ecmbody-info2-left1-2-2-lianguanes {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            //margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #e03a9d;
            font-weight: 700;
            font-size: 15px;
            line-height: 100%;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
      .ecmbody-info2-left2 {
        width: 100%;
        display: flex;
        .tooth-selector {
          display: flex;
          flex-direction: column;
          background-color: #f5f7fa;
        }

        .mouth-container {
          position: relative;
          width: 100%;
          height: 255px;
          overflow: hidden;
        }

        .info-box {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 10;
          display: flex;
        }

        .line-red {
          position: absolute;
          width: 280px;
          top: 51.5%;
          left: 45%;
          z-index: 99;
          height: 0.5px;
          background: red;
          transform: translate(-50%);
        }
        .line-xuxian {
          position: absolute;
          width: 75%;
          top: 51.5%;
          left: 46%;
          z-index: 99;
          height: 0.5px;
          border-bottom: 0.5px dashed #888;
          transform: translate(-50%);
        }
        .line-shuxian {
          position: absolute;
          width: 1px;
          top: 5%;
          left: 267px;
          //right: 53.4%;
          z-index: 99;
          height: 92%;
          border-right: 0.5px dashed #888;
        }
        .box {
          position: absolute;
          font-size: 16px;
          font-weight: bold;
        }

        .box-a {
          top: 34%;
          left: 41%;
        }
        .box-b {
          top: 34%;
          left: 50%;
        }
        .box-c {
          top: 62%;
          left: 41%;
        }
        .box-d {
          top: 62%;
          left: 50%;
        }
        .box-a1 {
          top: 43%;
          right: 55%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-b1 {
          top: 43%;
          left: 48%;
          font-weight: lighter;
          font-size: 13px;
          text-align: left;
          color: #999;
          width: 84px;
        }
        .box-c1 {
          top: 53%;
          right: 55%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-d1 {
          top: 53%;
          left: 48%;
          font-weight: lighter;
          text-align: left;
          color: #999;
          width: 84px;
          font-size: 13px;
        }
        .upper-jaw,
        .lower-jaw {
          position: absolute;
          width: 100%;
          height: 57%;
          z-index: 99;
        }

        .upper-jaw {
          top: 0;
          //border-bottom: 0.5px dashed #888;
        }
        .upper-txt {
          position: absolute;
          width: auto;
          z-index: 99;
          color: red;
          font-weight: bold;
          top: 51%;
          left: 44.3%;
          font-size: 15px;
        }
        .lower-jaw {
          bottom: 2px;
        }

        .tooth-icon {
          position: absolute;
          transition: all 0.2s ease;
          transform-origin: center;
          z-index: 10;
          .tooth-index {
            text-align: center;
          }
          .tooth-arc {
            border-bottom: 10px solid blue;
          }
        }

        .tooth-icon:active {
          transform: scale(1.1);
          .tooth-index {
            text-align: center;
          }
          .tooth-arc {
            border-radius: 100px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        }

        .selected {
          filter: drop-shadow(0 0 3px #4cd964);
        }

        .selected-info {
          background-color: #fff;
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
          font-size: 14px;
        }

        .info-title {
          color: #333;
          font-weight: bold;
        }

        .tooth-id {
          color: #007aff;
          margin: 0 2.5px;
        }
      }
    }
    .ecmbody-info2-right {
      display: flex;
      width: 52%;
      .ecmbody-info2-right00 {
        width: 10%;
        display: flex;
        padding-top: 10%;
        flex-flow: column;
        justify-content: space-evenly;
        height: 280px;
        margin-left: 10px;
        .ecmbody-info2-right001 {
          width: auto;
          display: flex;
          border-radius: 6px;
          font-family: Noto Sans SC;
          background-color: #d8b9e7;
          border: 1px solid #d8b9e7;
          font-size: 17px;
          color: #333f48;
          cursor: pointer;
          justify-content: space-evenly;
          align-items: center;
          padding: 5px 10px;
        }
        .ecmbody-info2-right002 {
          width: auto;
          display: flex;
          border-radius: 6px;
          font-family: Noto Sans SC;
          background-color: #f4ebb8;
          border: 1px solid #f4ebb8;
          font-size: 17px;
          color: #333f48;
          cursor: pointer;
          justify-content: space-evenly;
          align-items: center;
          padding: 5px 10px;
        }
      }
      .ecmbody-info2-right01 {
        width: 90%;
        display: flex;
        flex-flow: column;
        padding-left: 5%;
        .ecmbody-info2-right1 {
          width: 100%;
          display: flex;
          font-weight: 700;
          font-style: Bold;
          font-size: 20px;
          height: 40px;
          padding-top: 5px;
          color: #333f48;
        }
        .ecmbody-info2-right2 {
          width: 100%;
          display: flex;
          flex-flow: column;
          font-weight: 700;
          font-style: Bold;
          font-size: 20px;
          .ecmbody-info2-right2-btn {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            font-size: 16px;
            :deep(.el-button:hover) {
              background-color: #626aef;
              border-color: #626aef;
              font-size: 16px;
            }
            :deep(.el-button--primary) {
              font-size: 16px;
              background-color: #626aef;
              border-color: #626aef;
            }
            :deep(.el-button + .el-button) {
              margin: 0px;
              margin-bottom: 7px;
              margin-right: 8px;
              font-size: 16px;
            }
            :deep(.el-button) {
              margin-right: 8px;
              font-size: 16px;
            }
          }
          .ecmbody-info2-right2-radio {
            width: 100%;
            display: flex;
            margin-top: 12px;
            :deep(.el-radio) {
              --el-radio-font-size: var(--el-font-size-base);
              --el-radio-text-color: var(--el-text-color-regular);
              --el-radio-font-weight: var(--el-font-weight-primary);
              --el-radio-input-height: 14px;
              --el-radio-input-width: 14px;
              --el-radio-input-border-radius: var(--el-border-radius-circle);
              --el-radio-input-bg-color: var(--el-fill-color-blank);
              --el-radio-input-border: var(--el-border);
              --el-radio-input-border-color: var(--el-border-color);
              --el-radio-input-border-color-hover: var(--el-color-primary);
              align-items: center;
              color: var(--el-radio-text-color);
              cursor: pointer;
              display: inline-flex;
              font-size: var(--el-font-size-base);
              font-weight: var(--el-radio-font-weight);
              height: 32px;
              margin-right: 10px;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none;
              white-space: nowrap;
              display: flex;
              justify-content: flex-start;
              flex-basis: calc((100% - 32px) / 3);
            }
            /* 容器样式：可选，调整选项间距 */
            :deep(.color-radio-group) {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            /* 核心：单选框项的样式，复用CSS变量 */
            :deep(.color-radio-item) {
              /* 未选中时的文字颜色 */
              color: var(--radio-main-color, #606266) !important;
              padding: 4px 12px;
              border-radius: 6px;
              width: fit-content;
            }

            /* 1. 覆盖「选中态」圆形按钮的样式 */
            :deep(.color-radio-item .el-radio__input.is-checked .el-radio__inner) {
              /* 选中按钮的背景色 = 返回的主色 */
              background-color: var(--radio-main-color, #4080ff) !important;
              /* 选中按钮的边框色 = 返回的主色 */
              border-color: var(--radio-main-color, #4080ff) !important;
            }
            :deep(.el-radio__label) {
              font-size: 17px;
              padding-left: 8px;
            }
            /* 2. 覆盖「选中态」文字颜色（防止被Element默认样式覆盖） */
            :deep(.color-radio-item .el-radio__input.is-checked + .el-radio__label) {
              color: var(--radio-main-color, #4080ff) !important;
              font-weight: 500; /* 可选：选中后文字加粗 */
              font-size: 17px;
            }

            /* 3. 覆盖「悬浮态」按钮边框（增强交互） */
            :deep(.color-radio-item .el-radio__input:hover .el-radio__inner) {
              border-color: var(--radio-main-color, #606266) !important;
            }
          }
          .ecmbody-info2-right2-content {
            margin-top: 15px;
            width: 100%;
            flex-flow: column;
            display: flex;
            font-size: 17px;
            color: #333f48;
            .my-dropdown .el-select-dropdown {
              margin-top: 10px !important; /* 根据需要调整 */
            }
          }
        }
      }
    }
  }
  .ecmbody-info2-top2 {
    margin-top: 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .ecmbody-info2-img {
      position: relative;
      cursor: pointer;
      width: 0px;
      right: 12px;
    }
    .ecmbody-info2-left {
      display: flex;
      width: 48%;
      flex-flow: column;
      .ecmbody-info2-left1 {
        width: 100%;
        display: flex;
        font-weight: 700;
        font-style: Bold;
        font-size: 20px;
        height: 30px;
        color: #333f48;
        justify-content: space-between;
        .ecmbody-info2-left1-1 {
          display: flex;
          width: auto;
          align-items: center;
        }
        .ecmbody-info2-left1-2 {
          display: flex;
          width: 60%;
          align-items: center;
          justify-content: end;
          .ecmbody-info2-left1-2-1 {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-size: 13px;
            line-height: 100%;
            color: #f1e7b4;
            background-color: #e03a9d;
            border: 2px solid #f1e7b4;
            cursor: pointer;
            background-image: url(/images/xz.png);
            background-position: right top;
            background-repeat: no-repeat;
          }
          .ecmbody-info2-left1-2-2 {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-width: 0.5px;
            border-radius: 6px;
            padding: 4px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #8a96a2;
            border: 1px solid #8a96a2;
            font-weight: 700;
            font-size: 13px;
            line-height: 100%;
            color: #f1e7b4;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-1-danguan {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 4px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #8a96a2;
            border: 1px solid #8a96a2;
            font-weight: 400;
            font-size: 13px;
            line-height: 100%;
            color: #ffffff;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-2-lianguan {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 4px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #8a96a2;
            border: 1px solid #8a96a2;
            font-weight: 400;
            font-size: 13px;
            line-height: 100%;
            color: #ffffff;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-1-danguans {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-style: Bold;
            font-size: 15px;
            line-height: 100%;
            color: #f1e7b4;
            background-color: #3475e0;
            border: 2px solid #f1e7b4;
            cursor: pointer;
            background-image: url(/images/xz.png);
            background-position: right top;
            background-repeat: no-repeat;
          }
          .ecmbody-info2-left1-2-1-danguanes {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-size: 15px;
            line-height: 100%;
            color: #ffffff;
            background-color: #3475e0;
            cursor: pointer;
          }
          .ecmbody-info2-left1-2-2-lianguans {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #e03a9d;
            border: 2px solid #f1e7b4;
            font-weight: 700;
            font-size: 15px;
            line-height: 100%;
            color: #f1e7b4;
            cursor: pointer;
            background-image: url(/images/xz.png);
            background-position: right top;
            background-repeat: no-repeat;
          }
          .ecmbody-info2-left1-2-2-lianguanes {
            display: flex;
            width: auto;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px 20px;
            //margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #e03a9d;
            font-weight: 700;
            font-size: 15px;
            line-height: 100%;
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
      .ecmbody-info2-left2 {
        width: 100%;
        display: flex;
        .tooth-selector {
          display: flex;
          flex-direction: column;
          background-color: #f5f7fa;
        }

        .mouth-container {
          position: relative;
          width: 100%;
          height: 255px;
          overflow: hidden;
        }

        .info-box {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 10;
          display: flex;
        }

        .line-red {
          position: absolute;
          width: 280px;
          top: 51.5%;
          left: 45%;
          z-index: 99;
          height: 0.5px;
          background: red;
          transform: translate(-50%);
        }
        .line-xuxian {
          position: absolute;
          width: 75%;
          top: 51.5%;
          left: 46%;
          z-index: 99;
          height: 0.5px;
          border-bottom: 0.5px dashed #888;
          transform: translate(-50%);
        }
        .line-shuxian {
          position: absolute;
          width: 1px;
          top: 5%;
          left: 267px;
          z-index: 99;
          height: 92%;
          border-right: 0.5px dashed #888;
        }
        .box {
          position: absolute;
          font-size: 16px;
          font-weight: bold;
        }

        .box-a {
          top: 34%;
          left: 41%;
        }
        .box-b {
          top: 34%;
          left: 50%;
        }
        .box-c {
          top: 62%;
          left: 41%;
        }
        .box-d {
          top: 62%;
          left: 50%;
        }
        .box-a2 {
          top: 43%;
          right: 55%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-b2 {
          top: 43%;
          left: 48%;
          font-weight: lighter;
          font-size: 13px;
          text-align: left;
          color: #999;
          width: 84px;
        }
        .box-c2 {
          top: 53%;
          right: 55%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-d2 {
          top: 53%;
          left: 48%;
          font-weight: lighter;
          text-align: left;
          color: #999;
          width: 84px;
          font-size: 13px;
        }
        .upper-jaw,
        .lower-jaw {
          position: absolute;
          width: 100%;
          height: 53%;
          z-index: 99;
        }

        .upper-jaw {
          top: 0;
          //border-bottom: 0.5px dashed #888;
        }
        .upper-txt {
          position: absolute;
          width: auto;
          z-index: 99;
          color: red;
          font-weight: bold;
          top: 51%;
          left: 44.1%;
          font-size: 15px;
        }
        .lower-jaw {
          bottom: 2px;
        }

        .tooth-icon {
          position: absolute;
          transition: all 0.2s ease;
          transform-origin: center;
          z-index: 10;
          .tooth-index {
            text-align: center;
          }
        }

        .tooth-icon:active {
          transform: scale(1.1);
          .tooth-index {
            text-align: center;
          }
        }

        .selected {
          filter: drop-shadow(0 0 3px #4cd964);
        }

        .selected-info {
          background-color: #fff;
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
          font-size: 14px;
        }

        .info-title {
          color: #333;
          font-weight: bold;
        }

        .tooth-id {
          color: #007aff;
          margin: 0 2.5px;
        }
      }
    }
    .ecmbody-info2-right {
      display: flex;
      width: 52%;
      .ecmbody-info2-right00 {
        width: 10%;
        display: flex;
        padding-top: 10%;
        flex-flow: column;
        justify-content: space-evenly;
        height: 280px;
        margin-left: 10px;
        .ecmbody-info2-right001 {
          width: auto;
          display: flex;
          border-radius: 6px;
          font-family: Noto Sans SC;
          background-color: #d8b9e7;
          border: 1px solid #d8b9e7;
          font-size: 17px;
          color: #333f48;
          cursor: pointer;
          justify-content: space-evenly;
          align-items: center;
          padding: 5px 10px;
        }
      }
      .ecmbody-info2-right002 {
        width: auto;
        display: flex;
        border-radius: 6px;
        font-family: Noto Sans SC;
        background-color: #f4ebb8;
        border: 1px solid #f4ebb8;
        font-size: 17px;
        color: #333f48;
        cursor: pointer;
        justify-content: space-evenly;
        align-items: center;
        padding: 5px 10px;
      }
      .ecmbody-info2-right01 {
        width: 90%;
        display: flex;
        flex-flow: column;
        padding-left: 5%;
        .ecmbody-info2-right1 {
          width: 100%;
          display: flex;
          font-weight: 700;
          font-style: Bold;
          font-size: 20px;
          height: 40px;
          padding-top: 5px;
          color: #333f48;
        }
        .ecmbody-info2-right2 {
          width: 100%;
          display: flex;
          flex-flow: column;
          font-weight: 700;
          font-style: Bold;
          font-size: 20px;
          .ecmbody-info2-right2-btn {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            font-size: 16px;
            :deep(.el-button:hover) {
              background-color: #626aef;
              border-color: #626aef;
              font-size: 16px;
            }
            :deep(.el-button--primary) {
              font-size: 16px;
              background-color: #626aef;
              border-color: #626aef;
            }
            :deep(.el-button + .el-button) {
              margin: 0px;
              margin-bottom: 7px;
              margin-right: 8px;
              font-size: 16px;
            }
            :deep(.el-button) {
              margin-right: 8px;
              font-size: 16px;
            }
          }
          .ecmbody-info2-right2-radio {
            width: 100%;
            display: flex;
            margin-top: 12px;
            :deep(.el-radio) {
              --el-radio-font-size: var(--el-font-size-base);
              --el-radio-text-color: var(--el-text-color-regular);
              --el-radio-font-weight: var(--el-font-weight-primary);
              --el-radio-input-height: 14px;
              --el-radio-input-width: 14px;
              --el-radio-input-border-radius: var(--el-border-radius-circle);
              --el-radio-input-bg-color: var(--el-fill-color-blank);
              --el-radio-input-border: var(--el-border);
              --el-radio-input-border-color: var(--el-border-color);
              --el-radio-input-border-color-hover: var(--el-color-primary);
              align-items: center;
              color: var(--el-radio-text-color);
              cursor: pointer;
              display: inline-flex;
              font-size: var(--el-font-size-base);
              font-weight: var(--el-radio-font-weight);
              height: 32px;
              margin-right: 10px;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none;
              white-space: nowrap;
              display: flex;
              justify-content: flex-start;
              flex-basis: calc((100% - 32px) / 3);
            }
            /* 容器样式：可选，调整选项间距 */
            :deep(.color-radio-group) {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            :deep(.el-radio__label) {
              font-size: 17px;
              padding-left: 8px;
            }
            /* 核心：单选框项的样式，复用CSS变量 */
            :deep(.color-radio-item) {
              /* 未选中时的文字颜色 */
              color: var(--radio-main-color, #606266) !important;
              padding: 4px 12px;
              border-radius: 6px;
              width: fit-content;
            }

            /* 1. 覆盖「选中态」圆形按钮的样式 */
            :deep(.color-radio-item .el-radio__input.is-checked .el-radio__inner) {
              /* 选中按钮的背景色 = 返回的主色 */
              background-color: var(--radio-main-color, #4080ff) !important;
              /* 选中按钮的边框色 = 返回的主色 */
              border-color: var(--radio-main-color, #4080ff) !important;
            }

            /* 2. 覆盖「选中态」文字颜色（防止被Element默认样式覆盖） */
            :deep(.color-radio-item .el-radio__input.is-checked + .el-radio__label) {
              color: var(--radio-main-color, #4080ff) !important;
              font-weight: 500; /* 可选：选中后文字加粗 */
              font-size: 17px;
            }

            /* 3. 覆盖「悬浮态」按钮边框（增强交互） */
            :deep(.color-radio-item .el-radio__input:hover .el-radio__inner) {
              border-color: var(--radio-main-color, #606266) !important;
            }
          }
          .ecmbody-info2-right2-content {
            margin-top: 15px;
            width: 100%;
            flex-flow: column;
            display: flex;
            font-size: 14px;
            color: #333f48;
          }
        }
      }
    }
  }
  .ecmbody-info3-img {
    display: flex;
    cursor: pointer;
    justify-content: end;
  }
  :deep(.el-divider--horizontal) {
    border-top: 1px var(--el-border-color) var(--el-border-style);
    display: block;
    height: 1px;
    margin: 2px 0;
    width: 100%;
  }
}
</style>
