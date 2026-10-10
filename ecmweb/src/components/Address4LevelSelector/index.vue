<template>
  <div ref="dropdownRef" class="city-4level-el" :style="{ width: width }">
    <!-- 触发框：el-input 模拟下拉触发 -->
    <el-input
      v-model="displayText"
      :placeholder="placeholder"
      :disabled="disabled"
      readonly
      class="trigger-input"
      suffix-icon="el-icon-arrow-down"
      @click="showPanel = !showPanel"
    />

    <!-- 下拉面板：el-popover 风格的弹框 -->
    <div v-show="showPanel" class="panel" :class="{ disabled }">
      <!-- 四级 el-select 联动 -->
      <div class="level-group">
        <el-select
          v-model="provinceCode"
          placeholder="请选省份"
          :disabled="disabled"
          :loading="provinceLoading"
          clearable
          class="level-select"
          @change="handleProvinceChange"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>

        <el-select
          v-model="cityCode"
          placeholder="请选城市"
          :disabled="!provinceCode || disabled"
          :loading="cityLoading"
          clearable
          class="level-select"
          @change="handleCityChange"
        >
          <el-option
            v-for="item in cityList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>

        <el-select
          v-model="areaCode"
          placeholder="请选区县"
          :disabled="!cityCode || disabled"
          :loading="areaLoading"
          clearable
          class="level-select"
          @change="handleAreaChange"
        >
          <el-option
            v-for="item in areaList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>

        <el-select
          v-if="level == 4"
          v-model="streetCode"
          placeholder="请选街道"
          :disabled="!areaCode || disabled"
          :loading="streetLoading"
          clearable
          class="level-select"
        >
          <el-option
            v-for="item in streetList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <el-input
          v-model="streetdetail"
          :disabled="!areaCode || disabled"
          placeholder="请输入详细地址"
        ></el-input>
      </div>

      <!-- 操作按钮 -->
      <div class="btn-group">
        <el-button
          :disabled="disabled"
          @click="
            showPanel = false;
            displayText = '';
          "
        >
          取消
        </el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>const emit = defineEmits(["update:modelValue", "confirm"]);
// 迁移脚本清空了 defineProps 的类型泛型，这里补回运行时声明（默认值原本在 withDefaults 里，已并入）
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ province: "", city: "", area: "", street: "", detail: "" })
  },
  width: {
    type: String,
    default: "300px"
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: "请选择省/市/区/街道"
  },
  level: {
    type: Number,
    default: 3
  }
});
const dropdownRef = ref(null);
const showPanel = ref(false);
const provinceCode = ref(props.modelValue.province);
const cityCode = ref(props.modelValue.city);
const areaCode = ref(props.modelValue.area);
const streetCode = ref(props.modelValue.street);
const streetdetail = ref(props.modelValue.detail);
const level = ref(props.level);
const provinceList = ref([]);
const cityList = ref([]);
const areaList = ref([]);
const streetList = ref([]);
const provinceLoading = ref(false);
const cityLoading = ref(false);
const areaLoading = ref(false);
const streetLoading = ref(false);
const displayText = computed({
  get() {
    const p = provinceList.value.find((i) => i.code === provinceCode.value)?.name || "";
    const c = cityList.value.find((i) => i.code === cityCode.value)?.name || "";
    const a = areaList.value.find((i) => i.code === areaCode.value)?.name || "";
    const s = streetList.value.find((i) => i.code === streetCode.value)?.name || "";
    return [p, c, a, s].filter(Boolean).join(" / ");
  },
  set() {
  }
  // 只读，禁止手动修改
});
const isComplete = computed(() => {
  return !!provinceCode.value && !!cityCode.value && !!areaCode.value && !!streetCode.value;
});
watch(
  () => props.modelValue,
  (newVal) => {
    provinceCode.value = newVal.province;
    cityCode.value = newVal.city;
    areaCode.value = newVal.area;
    streetCode.value = newVal.street;
    streetCode.value = newVal.street;
    streetdetail.value = newVal.detail;
  },
  { deep: true, immediate: true }
);
const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showPanel.value = false;
  }
};
const initCityData = async () => {
  await loadProvinceData();
  if (provinceCode.value) {
    await loadCityData();
    if (cityCode.value) {
      await loadAreaData();
      if (areaCode.value) {
        await loadStreetData();
      }
    }
  }
};
const loadProvinceData = async () => {
  try {
    provinceLoading.value = true;
    provinceList.value = await fetchCityData("province", "");
  } catch (err) {
    console.error("加载省份失败：", err);
    provinceList.value = [];
  } finally {
    provinceLoading.value = false;
  }
};
const loadCityData = async () => {
  try {
    cityLoading.value = true;
    cityList.value = await fetchCityData("city", provinceCode.value);
  } catch (err) {
    console.error("加载城市失败：", err);
    cityList.value = [];
  } finally {
    cityLoading.value = false;
  }
};
const loadAreaData = async () => {
  try {
    areaLoading.value = true;
    areaList.value = await fetchCityData("area", cityCode.value);
  } catch (err) {
    console.error("加载区县失败：", err);
    areaList.value = [];
  } finally {
    areaLoading.value = false;
  }
};
const loadStreetData = async () => {
  try {
    streetLoading.value = true;
    streetList.value = await fetchCityData("street", areaCode.value);
  } catch (err) {
    console.error("加载街道失败：", err);
    streetList.value = [];
  } finally {
    streetLoading.value = false;
  }
};
const handleProvinceChange = async () => {
  cityCode.value = "";
  areaCode.value = "";
  streetCode.value = "";
  cityList.value = [];
  areaList.value = [];
  streetList.value = [];
  if (provinceCode.value) {
    await loadCityData();
  }
};
const handleCityChange = async () => {
  areaCode.value = "";
  streetCode.value = "";
  areaList.value = [];
  streetList.value = [];
  if (cityCode.value) {
    await loadAreaData();
  }
};
const handleAreaChange = async () => {
  streetCode.value = "";
  streetList.value = [];
  if (areaCode.value) {
    await loadStreetData();
  }
};
const handleConfirm = () => {
  const selectData = {
    province: provinceCode.value,
    city: cityCode.value,
    area: areaCode.value,
    street: streetCode.value,
    detail: streetdetail.value
  };
  emit("update:modelValue", selectData);
  emit("confirm", selectData);
  showPanel.value = false;
};
async function fetchCityData(type, parentCode) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const mockData = {
    province: [
      { code: "310000", name: "上海市" },
      { code: "440000", name: "广东省" },
      { code: "340000", name: "安徽省" }
    ],
    city: {
      "310000": [{ code: "310100", name: "上海市" }],
      "440000": [
        { code: "440100", name: "广州市" },
        { code: "440300", name: "深圳市" }
      ],
      "340000": [{ code: "340300", name: "蚌埠市" }]
    },
    area: {
      "310100": [
        { code: "310101", name: "黄浦区" },
        { code: "310104", name: "徐汇区" }
      ],
      "440100": [{ code: "440106", name: "天河区" }],
      "340300": [{ code: "340371", name: "经济开发区" }]
    },
    street: {
      "310101": [{ code: "310101001", name: "外滩街道" }],
      "440106": [{ code: "440106001", name: "石牌街道" }],
      "340371": [{ code: "340371001", name: "湖滨社区街道" }]
    }
  };
  if (type === "province") return mockData.province;
  if (type === "city") return mockData.city[parentCode] || [];
  if (type === "area") return mockData.area[parentCode] || [];
  if (type === "street") return mockData.street[parentCode] || [];
  return [];
}
onMounted(() => {
  initCityData();
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* 组件容器 */
.city-4level-el {
  position: relative;
  font-size: 14px;
  box-sizing: border-box;
}

/* 触发输入框 */
.trigger-input {
  --el-input-height: 38px;
  cursor: pointer;
}
.trigger-input:deep(.el-input__wrapper) {
  padding: 0 12px;
}

/* 下拉面板 */
.panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  padding: 16px;
  z-index: 1000;
  box-sizing: border-box;
}

/* 四级选择组 */
.level-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.level-select {
  flex: 1;
  min-width: 100px;
}

/* 按钮组 */
.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 禁用态 */
.panel.disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
