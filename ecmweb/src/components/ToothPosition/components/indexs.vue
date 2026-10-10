<template>
  <div class="tooth-positions">
    <div class="ecmbody-info2-top1">
      <div class="ecmbody-info2-left">
        <div class="ecmbody-info2-left1">
          <div class="ecmbody-info2-left1-1">{{ jtWzTitle }}</div>
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
          <div class="mouth-container">
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
                @click="toggleTooths('uppers', tooth, index)"
              >
                <div class="tooth-index">
                  {{ tooth.id.slice(1, 2) }}
                </div>
                <img
                  style="width: 80%; cursor: pointer"
                  :src="
                    getImageUrl(
                      tooth.selected ? tooth.iconSelected : tooth.icon,
                      tooth.iconSelecteds,
                      orderToothForm.teethMode,
                      tooth.selected
                    )
                  "
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
                @click="toggleTooths('lowers', tooth, index)"
              >
                <img
                  style="width: 80%; cursor: pointer"
                  :src="
                    getImageUrl(
                      tooth.selected ? tooth.iconSelected : tooth.icon,
                      tooth.iconSelecteds,
                      orderToothForm.teethMode,
                      tooth.selected
                    )
                  "
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
                  style="padding-left: 0px; color: #333f48; display: flex; align-items: center"
                >
                  系统型号：
                </el-col>
                <el-col :span="19">
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
                    v-model="Models"
                    :options="modelOptions"
                    :placeholder="'请选择' + orderToothForm.orderNameProduct + '型号关键字'"
                    @change="(val) => change(val)"
                    @clearValue="(val) => clearModels(1)"
                    @input="(val) => inputModel(val, 1)"
                  />
                </el-col>
              </el-row>
              <el-row v-if="orderToothForm.isColor" :gutter="20" style="margin: 5px 0px 5px 0px">
                <el-col :span="5" style="padding-left: 0px; display: flex; align-items: center">
                  颜色：
                </el-col>
                <el-col :span="19">
                  <CustomInputSelect
                    v-model="Colors1"
                    :options="props.options"
                    :placeholder="'请选择' + orderToothForm.orderNameProduct + '颜色'"
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
          <div class="ecmbody-info2-left1-1">{{ relationWzTitle }}</div>
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
        <div class="ecmbody-info2-left2">
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
                @click="toggleTooth('upper', tooth, index)"
              >
                <div class="tooth-index">
                  {{ tooth.id.slice(1, 2) }}
                </div>
                <img
                  style="width: 80%; cursor: pointer"
                  :src="
                    getImageUrl(
                      tooth.selected ? tooth.iconSelected : tooth.icon,
                      tooth.iconSelecteds,
                      orderToothForm.teethWgMode,
                      tooth.selected
                    )
                  "
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
                @click="toggleTooth('lower', tooth, index)"
              >
                <img
                  style="width: 80%; cursor: pointer"
                  :src="
                    getImageUrl(
                      tooth.selected ? tooth.iconSelected : tooth.icon,
                      tooth.iconSelecteds,
                      orderToothForm.teethWgMode,
                      tooth.selected
                    )
                  "
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
                  style="padding-left: 0px; color: #333f48; display: flex; align-items: center"
                >
                  系统型号：
                </el-col>
                <el-col :span="19">
                  <!-- <el-select
                    ref="selectWgRef"
                    v-model="orderToothForm.WgModel"
                    popper-class="my-dropdown"
                    filterable
                    clearable
                    allow-create
                    :filter-method="(val) => handleSearch(val, 1)"
                    reserve-keyword
                    style="font-size: 12px"
                    :placeholder="'请输入' + orderToothForm.orderWgNameProduct + '型号关键字'"
                    @blur="handleSelectBlur('selectWgRef')"
                    @focus="hadFocus('selectWgRef', modelWgOptions)"
                  >
                    <template v-for="it in modelWgOptions" :key="it.value">
                      <el-option :label="it.label" :value="{ value: it.value, label: it.label }" />
                    </template>
                  </el-select> -->
                  <CustomInputSelect
                    v-model="WgModels"
                    :options="modelWgOptions"
                    :placeholder="'请选择' + orderToothForm.orderWgNameProduct + '型号关键字'"
                    @change="(val) => changeWgModels(val)"
                    @clearValue="(val) => clearModels(2)"
                    @input="(val) => inputModel(val, 2)"
                  />
                </el-col>
              </el-row>
              <el-row v-if="orderToothForm.isWgColor" :gutter="20" style="margin: 5px 0px 5px 0px">
                <el-col :span="5" style="padding-left: 0px; display: flex; align-items: center">
                  颜色：
                </el-col>
                <el-col :span="19">
                  <CustomInputSelect
                    v-model="WgColors1"
                    :options="props.options"
                    :placeholder="'请选择' + orderToothForm.orderWgNameProduct + '颜色'"
                    @change="(v) => onColorChange(v, 'WgColor1')"
                    @clearValue="(val) => clearColors1(2)"
                    @input="(val) => inputColor(val, 2)"
                  />
                  <!-- /
                  <el-select
                    ref="selectWgColorRef"
                    v-model="orderToothForm.WgColor1"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    allow-create
                    :placeholder="'选择' + orderToothForm.orderWgNameProduct + '颜色'"
                    style="width: 90%"
                    @change="(v) => onColorChange(v, 'WgColor1')"
                    @blur="handleSelectBlur('selectWgColorRef')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                  
                  <el-select
                    v-model="orderToothForm.WgColor2"
                    filterable
                    remote
                    multiple
                    reserve-keyword
                    placeholder="选择颜色"
                    clearable
                    style="width: 33%"
                    @change="(v) => onColorChange(v, 'WgColor2')"
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
                    v-model="orderToothForm.WgColor3"
                    filterable
                    remote
                    multiple
                    reserve-keyword
                    placeholder="选择颜色"
                    clearable
                    style="width: 27%"
                    @change="(v) => onColorChange(v, 'WgColor3')"
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
                  <el-input v-model="orderToothForm.WgRemarks" type="textarea" :rows="1"></el-input>
                </el-col>
              </el-row> -->
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
const upperJtTeeth = ref([
  {
    id: "A8",
    icon: "./common/A8@2x.png",
    iconSelecteds: "./Teeth1/T1A8.png",
    iconSelected: "./Teeth3/T3A8.png",
    selected: false
  },
  {
    id: "A7",
    icon: "./common/A7@2x.png",
    iconSelected: "./Teeth3/T3A7.png",
    iconSelecteds: "./Teeth1/T1A7.png",
    selected: false
  },
  {
    id: "A6",
    icon: "./common/A6@2x.png",
    iconSelected: "./Teeth3/T3A6.png",
    iconSelecteds: "./Teeth1/T1A6.png",
    selected: false
  },
  {
    id: "A5",
    icon: "./common/A5@2x.png",
    iconSelected: "./Teeth3/T3A5.png",
    iconSelecteds: "./Teeth1/T1A5.png",
    selected: false
  },
  {
    id: "A4",
    icon: "./common/A4@2x.png",
    iconSelected: "./Teeth3/T3A4.png",
    iconSelecteds: "./Teeth1/T1A4.png",
    selected: false
  },
  {
    id: "A3",
    icon: "./common/A3@2x.png",
    iconSelected: "./Teeth3/T3A3.png",
    iconSelecteds: "./Teeth1/T1A3.png",
    selected: false
  },
  {
    id: "A2",
    icon: "./common/A2@2x.png",
    iconSelected: "./Teeth3/T3A2.png",
    iconSelecteds: "./Teeth1/T1A2.png",
    selected: false
  },
  {
    id: "A1",
    icon: "./common/A1@2x.png",
    iconSelected: "./Teeth3/T3A1.png",
    iconSelecteds: "./Teeth1/T1A1.png",
    selected: false
  },
  {
    id: "B1",
    icon: "./common/B1@2x.png",
    iconSelected: "./Teeth3/T3B1.png",
    iconSelecteds: "./Teeth1/T1B1.png",
    selected: false
  },
  {
    id: "B2",
    icon: "./common/B2@2x.png",
    iconSelected: "./Teeth3/T3B2.png",
    iconSelecteds: "./Teeth1/T1B2.png",
    selected: false
  },
  {
    id: "B3",
    icon: "./common/B3@2x.png",
    iconSelected: "./Teeth3/T3B3.png",
    iconSelecteds: "./Teeth1/T1B3.png",
    selected: false
  },
  {
    id: "B4",
    icon: "./common/B4@2x.png",
    iconSelected: "./Teeth3/T3B4.png",
    iconSelecteds: "./Teeth1/T1B4.png",
    selected: false
  },
  {
    id: "B5",
    icon: "./common/B5@2x.png",
    iconSelected: "./Teeth3/T3B5.png",
    iconSelecteds: "./Teeth1/T1B5.png",
    selected: false
  },
  {
    id: "B6",
    icon: "./common/B6@2x.png",
    iconSelected: "./Teeth3/T3B6.png",
    iconSelecteds: "./Teeth1/T1B6.png",
    selected: false
  },
  {
    id: "B7",
    icon: "./common/B7@2x.png",
    iconSelected: "./Teeth3/T3B7.png",
    iconSelecteds: "./Teeth1/T1B7.png",
    selected: false
  },
  {
    id: "B8",
    icon: "./common/B8@2x.png",
    iconSelected: "./Teeth3/T3B8.png",
    iconSelecteds: "./Teeth1/T1B8.png",
    selected: false
  }
]);
const lowerJtTeeth = ref([
  {
    id: "C8",
    icon: "./common/C8@2x.png",
    iconSelected: "./Teeth3/T3C8.png",
    iconSelecteds: "./Teeth1/T1C8.png",
    selected: false
  },
  {
    id: "C7",
    icon: "./common/C7@2x.png",
    iconSelected: "./Teeth3/T3C7.png",
    iconSelecteds: "./Teeth1/T1C7.png",
    selected: false
  },
  {
    id: "C6",
    icon: "./common/C6@2x.png",
    iconSelected: "./Teeth3/T3C6.png",
    iconSelecteds: "./Teeth1/T1C6.png",
    selected: false
  },
  {
    id: "C5",
    icon: "./common/C5@2x.png",
    iconSelected: "./Teeth3/T3C5.png",
    iconSelecteds: "./Teeth1/T1C5.png",
    selected: false
  },
  {
    id: "C4",
    icon: "./common/C4@2x.png",
    iconSelected: "./Teeth3/T3C4.png",
    iconSelecteds: "./Teeth1/T1C4.png",
    selected: false
  },
  {
    id: "C3",
    icon: "./common/C3@2x.png",
    iconSelected: "./Teeth3/T3C3.png",
    iconSelecteds: "./Teeth1/T1C3.png",
    selected: false
  },
  {
    id: "C2",
    icon: "./common/C2@2x.png",
    iconSelected: "./Teeth3/T3B2.png",
    iconSelecteds: "./Teeth1/T1C2.png",
    selected: false
  },
  {
    id: "C1",
    icon: "./common/C1@2x.png",
    iconSelected: "./Teeth3/T3C1.png",
    iconSelecteds: "./Teeth1/T1C1.png",
    selected: false
  },
  {
    id: "D1",
    icon: "./common/D1@2x.png",
    iconSelected: "./Teeth3/T3D1.png",
    iconSelecteds: "./Teeth1/T1D1.png",
    selected: false
  },
  {
    id: "D2",
    icon: "./common/D2@2x.png",
    iconSelected: "./Teeth3/T3D2.png",
    iconSelecteds: "./Teeth1/T1D2.png",
    selected: false
  },
  {
    id: "D3",
    icon: "./common/D3@2x.png",
    iconSelected: "./Teeth3/T3D3.png",
    iconSelecteds: "./Teeth1/T1D3.png",
    selected: false
  },
  {
    id: "D4",
    icon: "./common/D4@2x.png",
    iconSelected: "./Teeth3/T3D4.png",
    iconSelecteds: "./Teeth1/T1D4.png",
    selected: false
  },
  {
    id: "D5",
    icon: "./common/D5@2x.png",
    iconSelected: "./Teeth3/T3D5.png",
    iconSelecteds: "./Teeth1/T1D5.png",
    selected: false
  },
  {
    id: "D6",
    icon: "./common/D6@2x.png",
    iconSelected: "./Teeth3/T3D6.png",
    iconSelecteds: "./Teeth1/T1D6.png",
    selected: false
  },
  {
    id: "D7",
    icon: "./common/D7@2x.png",
    iconSelected: "./Teeth3/T3D7.png",
    iconSelecteds: "./Teeth1/T1D7.png",
    selected: false
  },
  {
    id: "D8",
    icon: "./common/D8@2x.png",
    iconSelected: "./Teeth3/T3D8.png",
    iconSelecteds: "./Teeth1/T1D8.png",
    selected: false
  }
]);
const upperTeeth = ref([
  {
    id: "A8",
    icon: "./common/A8@2x.png",
    iconSelecteds: "./Teeth1/T1A8.png",
    iconSelected: "./Teeth3/T3A8.png",
    selected: false
  },
  {
    id: "A7",
    icon: "./common/A7@2x.png",
    iconSelected: "./Teeth3/T3A7.png",
    iconSelecteds: "./Teeth1/T1A7.png",
    selected: false
  },
  {
    id: "A6",
    icon: "./common/A6@2x.png",
    iconSelected: "./Teeth3/T3A6.png",
    iconSelecteds: "./Teeth1/T1A6.png",
    selected: false
  },
  {
    id: "A5",
    icon: "./common/A5@2x.png",
    iconSelected: "./Teeth3/T3A5.png",
    iconSelecteds: "./Teeth1/T1A5.png",
    selected: false
  },
  {
    id: "A4",
    icon: "./common/A4@2x.png",
    iconSelected: "./Teeth3/T3A4.png",
    iconSelecteds: "./Teeth1/T1A4.png",
    selected: false
  },
  {
    id: "A3",
    icon: "./common/A3@2x.png",
    iconSelected: "./Teeth3/T3A3.png",
    iconSelecteds: "./Teeth1/T1A3.png",
    selected: false
  },
  {
    id: "A2",
    icon: "./common/A2@2x.png",
    iconSelected: "./Teeth3/T3A2.png",
    iconSelecteds: "./Teeth1/T1A2.png",
    selected: false
  },
  {
    id: "A1",
    icon: "./common/A1@2x.png",
    iconSelected: "./Teeth3/T3A1.png",
    iconSelecteds: "./Teeth1/T1A1.png",
    selected: false
  },
  {
    id: "B1",
    icon: "./common/B1@2x.png",
    iconSelected: "./Teeth3/T3B1.png",
    iconSelecteds: "./Teeth1/T1B1.png",
    selected: false
  },
  {
    id: "B2",
    icon: "./common/B2@2x.png",
    iconSelected: "./Teeth3/T3B2.png",
    iconSelecteds: "./Teeth1/T1B2.png",
    selected: false
  },
  {
    id: "B3",
    icon: "./common/B3@2x.png",
    iconSelected: "./Teeth3/T3B3.png",
    iconSelecteds: "./Teeth1/T1B3.png",
    selected: false
  },
  {
    id: "B4",
    icon: "./common/B4@2x.png",
    iconSelected: "./Teeth3/T3B4.png",
    iconSelecteds: "./Teeth1/T1B4.png",
    selected: false
  },
  {
    id: "B5",
    icon: "./common/B5@2x.png",
    iconSelected: "./Teeth3/T3B5.png",
    iconSelecteds: "./Teeth1/T1B5.png",
    selected: false
  },
  {
    id: "B6",
    icon: "./common/B6@2x.png",
    iconSelected: "./Teeth3/T3B6.png",
    iconSelecteds: "./Teeth1/T1B6.png",
    selected: false
  },
  {
    id: "B7",
    icon: "./common/B7@2x.png",
    iconSelected: "./Teeth3/T3B7.png",
    iconSelecteds: "./Teeth1/T1B7.png",
    selected: false
  },
  {
    id: "B8",
    icon: "./common/B8@2x.png",
    iconSelected: "./Teeth3/T3B8.png",
    iconSelecteds: "./Teeth1/T1B8.png",
    selected: false
  }
]);
const lowerTeeth = ref([
  {
    id: "C8",
    icon: "./common/C8@2x.png",
    iconSelected: "./Teeth3/T3C8.png",
    iconSelecteds: "./Teeth1/T1C8.png",
    selected: false
  },
  {
    id: "C7",
    icon: "./common/C7@2x.png",
    iconSelected: "./Teeth3/T3C7.png",
    iconSelecteds: "./Teeth1/T1C7.png",
    selected: false
  },
  {
    id: "C6",
    icon: "./common/C6@2x.png",
    iconSelected: "./Teeth3/T3C6.png",
    iconSelecteds: "./Teeth1/T1C6.png",
    selected: false
  },
  {
    id: "C5",
    icon: "./common/C5@2x.png",
    iconSelected: "./Teeth3/T3C5.png",
    iconSelecteds: "./Teeth1/T1C5.png",
    selected: false
  },
  {
    id: "C4",
    icon: "./common/C4@2x.png",
    iconSelected: "./Teeth3/T3C4.png",
    iconSelecteds: "./Teeth1/T1C4.png",
    selected: false
  },
  {
    id: "C3",
    icon: "./common/C3@2x.png",
    iconSelected: "./Teeth3/T3C3.png",
    iconSelecteds: "./Teeth1/T1C3.png",
    selected: false
  },
  {
    id: "C2",
    icon: "./common/C2@2x.png",
    iconSelected: "./Teeth3/T3B2.png",
    iconSelecteds: "./Teeth1/T1C2.png",
    selected: false
  },
  {
    id: "C1",
    icon: "./common/C1@2x.png",
    iconSelected: "./Teeth3/T3C1.png",
    iconSelecteds: "./Teeth1/T1C1.png",
    selected: false
  },
  {
    id: "D1",
    icon: "./common/D1@2x.png",
    iconSelected: "./Teeth3/T3D1.png",
    iconSelecteds: "./Teeth1/T1D1.png",
    selected: false
  },
  {
    id: "D2",
    icon: "./common/D2@2x.png",
    iconSelected: "./Teeth3/T3D2.png",
    iconSelecteds: "./Teeth1/T1D2.png",
    selected: false
  },
  {
    id: "D3",
    icon: "./common/D3@2x.png",
    iconSelected: "./Teeth3/T3D3.png",
    iconSelecteds: "./Teeth1/T1D3.png",
    selected: false
  },
  {
    id: "D4",
    icon: "./common/D4@2x.png",
    iconSelected: "./Teeth3/T3D4.png",
    iconSelecteds: "./Teeth1/T1D4.png",
    selected: false
  },
  {
    id: "D5",
    icon: "./common/D5@2x.png",
    iconSelected: "./Teeth3/T3D5.png",
    iconSelecteds: "./Teeth1/T1D5.png",
    selected: false
  },
  {
    id: "D6",
    icon: "./common/D6@2x.png",
    iconSelected: "./Teeth3/T3D6.png",
    iconSelecteds: "./Teeth1/T1D6.png",
    selected: false
  },
  {
    id: "D7",
    icon: "./common/D7@2x.png",
    iconSelected: "./Teeth3/T3D7.png",
    iconSelecteds: "./Teeth1/T1D7.png",
    selected: false
  },
  {
    id: "D8",
    icon: "./common/D8@2x.png",
    iconSelected: "./Teeth3/T3D8.png",
    iconSelecteds: "./Teeth1/T1D8.png",
    selected: false
  }
]);
const getImageUrl = (img, imgs, num, isbool) => {
  if (img.indexOf("common") > -1) {
    return new URL(
      // 本地资源路径
      `${img}`,
      import.meta.url
    ).href;
  } else {
    if (num == 30) {
      return new URL(
        // 本地资源路径
        `${img}`,
        import.meta.url
      ).href;
    } else {
      return new URL(
        // 本地资源路径
        `${imgs}`,
        import.meta.url
      ).href;
    }
  }
};
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
  orderToothForm.value = order[0].value;
  modelOptions.value = order[0].value.XingHao;
  modelWgOptions.value = order[0].value.WgXingHao;
  Models.value = order[0].value.Model?.value == 0 ? order[0].value.Model?.label : order[0].value.Model?.value;
  if (typeof order[0].value.Color1 !== "string") {
    Colors1.value = order[0].value.Color1 == 0 ? order[0].value.Color1?.label : order[0].value.Color1?.value;
  } else {
    Colors1.value = order[0].value.Color1;
  }
  WgModels.value = order[0].value.WgModel?.value == 0 ? order[0].value.WgModel?.label : order[0].value.WgModel?.value;
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
function setxzlg(tooth, type) {
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
    var xhlg = xingHao.filter((a) => a.label == "单冠");
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
    var xhlg = xingHao.filter((a) => a.label == "连冠");
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
    var xhlg = xingHao.filter((a) => a.label == "单冠");
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
      if (indexs > -1) {
        delWgModel(true, v, item, "wg");
        WgModel(jawType, items, index, isbool);
      } else {
        addWgModel(true, v, item, "wg");
        orderToothForm.value.WgXingHao.forEach((a) => {
          if (a.label != xinHao) {
            delTook(true, v, item, a.label, "wg");
          }
        });
      }
    }
  }
  if (isbool && type == "jt") {
    const xinHao = orderToothForm.value.Model.label;
    const value = orderToothForm.value.XingHao.filter((a) => a.label == xinHao);
    if (value.length > 0) {
      const info = value[0][v];
      const indexs = info.findIndex((b) => b == item);
      if (indexs > -1) {
        delWgModel(true, v, item, "jt");
        Model(jawType, items, index, isbool);
      } else {
        addWgModel(true, v, item, "jt");
        orderToothForm.value.XingHao.forEach((a) => {
          if (a.label != xinHao) {
            delTook(true, v, item, a.label, "jt");
          }
        });
      }
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
  orderToothForm.value.selectedButton = index;
  orderToothForm.value.productItemClassifyId = item.value;
  orderToothForm.value.isColor = false;
  emit("setClassValue", item.value);
}
function onWgChange(item, index) {
  orderToothForm.value.WgselectedButton = index;
  orderToothForm.value.productItemClassifyWgId = item.value;
  orderToothForm.value.isWgColor = false;
  emit("setWgClassValue", item.value);
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
        if (val.children.length > 0) {
          modelWgOptions.value = val.children;
          orderToothForm.value.WgXingHao = [];
          orderToothForm.value.childrenWgXingHao = val.children;
        }
      }
      if (data.hasType == 10 || data.hasType == 30) {
        if (val.children.length > 0) {
          const oldxinghao = wgxhlist;
          let isold = true;
          oldxinghao.forEach((a) => {
            const isbool = val.children.filter((b) => a.label == b.label);
            if (isbool.length == 0) {
              isold = false;
            }
          });
          if (isold && oldxinghao.length > 0) {
            orderToothForm.value.WgXingHao = wgxhlist;
            orderToothForm.value.WgModel = oldwgModel;
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
      orderToothForm.value.isWgColor = data.isColor;
      orderToothForm.value.amountWgMode = data.amountMode;
      orderToothForm.value.teethWgMode = data.teethMode;
      if (data.isColor) {
        const colorData = props.colorData;
        orderToothForm.value.WgColor1 = colorData.Color1;
        orderToothForm.value.WgColor2 = colorData.Color2;
        orderToothForm.value.WgColor3 = colorData.Color3;
      }
    } else {
      orderToothForm.value.isWgColor = false;
      orderToothForm.value.teethWgMode = 10;
      toothWgProperty.value = {};
    }
  });
}
function onProductChange(val) {
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
        if (val.children.length > 0) {
          modelOptions.value = val.children;
          orderToothForm.value.XingHao = [];
          orderToothForm.value.childrenXingHao = val.children;
        }
      }
      if (data.hasType == 10 || data.hasType == 30) {
        if (val.children.length > 0) {
          const oldxinghao = xhlist;
          let isold = true;
          oldxinghao.forEach((a) => {
            const isbool = val.children.filter((b) => a.label == b.label);
            if (isbool.length == 0) {
              isold = false;
            }
          });
          if (isold && oldxinghao.length > 0) {
            orderToothForm.value.XingHao = xhlist;
            orderToothForm.value.Model = oldModel;
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
      orderToothForm.value.isColor = data.isColor;
      orderToothForm.value.amountMode = data.amountMode;
      orderToothForm.value.teethMode = data.teethMode;
      if (data.isColor) {
        const colorData = props.colorData;
        orderToothForm.value.Color1 = colorData.Color1;
        orderToothForm.value.Color2 = colorData.Color2;
        orderToothForm.value.Color3 = colorData.Color3;
      }
    } else {
      orderToothForm.value.isColor = false;
      orderToothForm.value.teethMode = 10;
      toothProperty.value = {};
    }
  });
}
function onWgModelChange(val) {
  ygtype.value = "";
  orderToothForm.value.WgModel = { label: val.label, value: val.value };
  orderToothForm.value.WgXingHao.forEach((a) => {
    if (a.value == val.value) {
      a.isChecked = true;
      setTooths();
    } else {
      a.isChecked = false;
    }
  });
}
function onModelChange(val) {
  jttype.value = "";
  orderToothForm.value.Model = { label: val.label, value: val.value };
  orderToothForm.value.XingHao.forEach((a) => {
    if (a.value == val.value) {
      a.isChecked = true;
      setTooth();
    } else {
      a.isChecked = false;
    }
  });
}
function setTooth() {
  let isbool = false;
  orderToothForm.value.XingHao.forEach((a) => {
    if (a.A.length > 0 || a.B.length > 0 || a.C.length > 0 || a.D.length > 0) {
      isbool = true;
    }
  });
  if (!isbool) {
    const upperJt = upperJtTeeth.value.filter((a) => {
      return a.selected == true;
    });
    upperJt.forEach((u, index) => {
      if (u.selected) {
        toggleTooths("uppers", u, index);
      }
    });
    const lowerJt = lowerJtTeeth.value.filter((a) => {
      return a.selected == true;
    });
    lowerJt.forEach((u, index) => {
      if (u.selected) {
        toggleTooths("lowers", u, index);
      }
    });
  }
}
function setTooths() {
  let isbool = false;
  orderToothForm.value.WgXingHao.forEach((a) => {
    if (a.A.length > 0 || a.B.length > 0 || a.C.length > 0 || a.D.length > 0) {
      isbool = true;
    }
  });
  if (!isbool) {
    const upper = upperTeeth.value.filter((a) => {
      return a.selected == true;
    });
    upper.forEach((u, index) => {
      if (u.selected) {
        toggleTooth("upper", u, index);
      }
    });
    const lower = lowerTeeth.value.filter((a) => {
      return a.selected == true;
    });
    lower.forEach((u, index) => {
      if (u.selected) {
        toggleTooth("lower", u, index);
      }
    });
  }
}
function setjtlx(v) {
  jttype.value = v.toString();
  orderToothForm.value.XingHao.forEach((a) => {
    a.isChecked = false;
    a.A = [];
    a.B = [];
    a.C = [];
    a.D = [];
  });
  if (v == 0) {
    upperJtTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
    lowerJtTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
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
    emit("setToothValue", orderToothForm.value);
  }
  if (v == 1) {
    upperJtTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
    lowerJtTeeth.value.forEach((u) => {
      u.selected = false;
    });
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
    emit("setToothValue", orderToothForm.value);
  }
  if (v == 2) {
    upperJtTeeth.value.forEach((u) => {
      u.selected = false;
    });
    lowerJtTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
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
    emit("setToothValue", orderToothForm.value);
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
    });
    lowerJtTeeth.value.forEach((l) => {
      l.selected = false;
    });
  }
}
function setyglx(v) {
  ygtype.value = v.toString();
  orderToothForm.value.WgXingHao.forEach((a) => {
    a.isChecked = false;
    a.A = [];
    a.B = [];
    a.C = [];
    a.D = [];
  });
  if (v == 0) {
    upperTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
    lowerTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
    orderToothForm.value.WA = [7, 6, 5, 4, 3, 2, 1];
    orderToothForm.value.WB = [1, 2, 3, 4, 5, 6, 7];
    orderToothForm.value.WC = [7, 6, 5, 4, 3, 2, 1];
    orderToothForm.value.WD = [1, 2, 3, 4, 5, 6, 7];
    emit("setToothValue", orderToothForm.value);
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
  }
  if (v == 1) {
    upperTeeth.value.forEach((u) => {
      if (u.id == "A8" || u.id == "B8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
    lowerTeeth.value.forEach((u) => {
      u.selected = false;
    });
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
    emit("setToothValue", orderToothForm.value);
  }
  if (v == 2) {
    upperTeeth.value.forEach((u) => {
      u.selected = false;
    });
    lowerTeeth.value.forEach((u) => {
      if (u.id == "C8" || u.id == "D8") {
        u.selected = false;
      } else {
        u.selected = true;
      }
    });
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
    emit("setToothValue", orderToothForm.value);
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
    });
    lowerTeeth.value.forEach((l) => {
      l.selected = false;
    });
  }
}
function setColor(it) {
  let colorClassName = "ecmbody-info2-left1-2-1";
  if (it.label == "单冠" || it.label == "连冠") {
    if (it.label == "单冠") {
      if (it.isChecked) {
        colorClassName = "ecmbody-info2-left1-2-1-danguans";
      } else {
        if (it.A.length > 0 || it.B.length > 0 || it.C.length > 0 || it.D.length > 0) {
          colorClassName = "ecmbody-info2-left1-2-1-danguanes";
        } else {
          colorClassName = "ecmbody-info2-left1-2-1-danguan";
        }
      }
    }
    if (it.label == "连冠") {
      if (it.isChecked) {
        colorClassName = "ecmbody-info2-left1-2-2-lianguans";
      } else {
        if (it.A.length > 0 || it.B.length > 0 || it.C.length > 0 || it.D.length > 0) {
          colorClassName = "ecmbody-info2-left1-2-2-lianguanes";
        } else {
          colorClassName = "ecmbody-info2-left1-2-2-lianguan";
        }
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
function colseyg() {
  orderToothForm.value.isAdditional = false;
  isYg.value = true;
  let clssinfo = props.classList.filter((a) => a.ids == props.isClassValue);
  emit("setIsAdditional", false);
  emit("setClassChange", clssinfo[0], props.isClassValue);
}
function openyg() {
  orderToothForm.value.isAdditional = true;
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
onMounted(() => {
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
          width: 80%;
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
            font-size: 13px;
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
            font-size: 13px;
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
            font-size: 13px;
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
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #e03a9d;
            font-weight: 700;
            font-size: 13px;
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
          height: 250px;
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
          top: 50.5%;
          left: 50%;
          z-index: 99;
          height: 0.5px;
          background: red;
          transform: translate(-50%);
        }
        .line-xuxian {
          position: absolute;
          width: 70%;
          top: 50.5%;
          left: 50%;
          z-index: 99;
          height: 0.5px;
          border-bottom: 0.5px dashed #888;
          transform: translate(-50%);
        }
        .line-shuxian {
          position: absolute;
          width: 1px;
          top: 5%;
          right: 50%;
          z-index: 99;
          height: 91%;
          border-right: 0.5px dashed #888;
        }
        .box {
          position: absolute;
          font-size: 16px;
          font-weight: bold;
        }

        .box-a {
          top: 33%;
          left: 43%;
        }
        .box-b {
          top: 33%;
          left: 55%;
        }
        .box-c {
          top: 62%;
          left: 43%;
        }
        .box-d {
          top: 62%;
          left: 55%;
        }
        .box-a1 {
          top: 43%;
          right: 50.5%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-b1 {
          top: 43%;
          left: 51.5%;
          font-weight: lighter;
          font-size: 13px;
          text-align: left;
          color: #999;
          width: 84px;
        }
        .box-c1 {
          top: 53%;
          right: 50.5%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-d1 {
          top: 53%;
          left: 51.5%;
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
          top: 53%;
          left: 46.9%;
        }
        .lower-jaw {
          bottom: 0;
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
          font-size: 15px;
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
          font-size: 14px;
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
            font-size: 14px;
            :deep(.el-button:hover) {
              background-color: #626aef;
              border-color: #626aef;
              font-size: 14px;
            }
            :deep(.el-button--primary) {
              font-size: 14px;
              background-color: #626aef;
              border-color: #626aef;
            }
            :deep(.el-button + .el-button) {
              margin: 0px;
              margin-bottom: 7px;
              margin-right: 8px;
            }
            :deep(.el-button) {
              margin-right: 8px;
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
              font-size: 15px;
              padding-left: 8px;
            }
            /* 2. 覆盖「选中态」文字颜色（防止被Element默认样式覆盖） */
            :deep(.color-radio-item .el-radio__input.is-checked + .el-radio__label) {
              color: var(--radio-main-color, #4080ff) !important;
              font-weight: 500; /* 可选：选中后文字加粗 */
              font-size: 15px;
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
            font-size: 15px;
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
          width: 80%;
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
            font-size: 13px;
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
            font-size: 13px;
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
            font-size: 13px;
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
            margin-right: 20px;
            font-family: Noto Sans SC;
            background-color: #e03a9d;
            font-weight: 700;
            font-size: 13px;
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
          height: 250px;
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
          left: 50%;
          z-index: 99;
          height: 0.5px;
          background: red;
          transform: translate(-50%);
        }
        .line-xuxian {
          position: absolute;
          width: 70%;
          top: 51.5%;
          left: 50%;
          z-index: 99;
          height: 0.5px;
          border-bottom: 0.5px dashed #888;
          transform: translate(-50%);
        }
        .line-shuxian {
          position: absolute;
          width: 1px;
          top: 3%;
          right: 49.2%;
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
          top: 33%;
          left: 43%;
        }
        .box-b {
          top: 33%;
          left: 55%;
        }
        .box-c {
          top: 62%;
          left: 43%;
        }
        .box-d {
          top: 62%;
          left: 55%;
        }
        .box-a2 {
          top: 43%;
          right: 50.5%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-b2 {
          top: 43%;
          left: 51.5%;
          font-weight: lighter;
          font-size: 13px;
          text-align: left;
          color: #999;
          width: 84px;
        }
        .box-c2 {
          top: 53%;
          right: 50.5%;
          font-weight: lighter;
          font-size: 13px;
          text-align: right;
          color: #999;
          width: 84px;
        }
        .box-d2 {
          top: 53%;
          left: 51.5%;
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
          height: 50%;
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
          top: 53%;
          left: 47%;
        }
        .lower-jaw {
          bottom: 0;
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
          font-size: 15px;
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
        font-size: 14px;
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
            font-size: 14px;
            :deep(.el-button:hover) {
              background-color: #626aef;
              border-color: #626aef;
              font-size: 14px;
            }
            :deep(.el-button--primary) {
              font-size: 14px;
              background-color: #626aef;
              border-color: #626aef;
            }
            :deep(.el-button + .el-button) {
              margin: 0px;
              margin-bottom: 7px;
              margin-right: 8px;
            }
            :deep(.el-button) {
              margin-right: 8px;
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
              font-size: 15px;
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
              font-size: 15px;
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
