<template>
  <div class="custom-select" :class="{ open: isOpen, 'drop-up': isDropUp }">
    <!-- 输入框 + 清空按钮 -->
    <div ref="selectInputRef" class="select-input" @click.stop="toggleOpen">
      <input
        v-model="inputValue"
        :placeholder="placeholder"
        class="input-inner"
        @input="handleInput"
        @blur="handleBlur"
        @keydown.esc="close"
        @keydown.enter="handleEnter"
      />
      <!-- 清空按钮 -->
      <button v-if="isOpen && inputValue" class="clear-btn" @click="clearValue">
        <el-icon size="14px"><CircleClose /></el-icon>
      </button>
      <!-- 下拉箭头 -->
      <span class="arrow" :class="{ rotate: isOpen }">
        <el-icon><ArrowDown /></el-icon>
      </span>
    </div>

    <!-- 下拉选项框 -->
    <div v-if="isOpen" ref="optionsContainerRef" class="options-container" @click.stop>
      <!-- 无匹配结果 -->
      <div v-if="filteredOptions.length === 0" class="no-result">
        {{ noResultText }}
      </div>
      <!-- 选项列表 -->
      <div
        v-for="(option, index) in filteredOptions"
        :key="index"
        class="option-item"
        :class="{ active: activeIndex === index }"
        @click.stop="selectOption(option)"
        @mouseenter="activeIndex = index"
      >
        <!-- 支持自定义选项模板（默认显示 label/value） -->
        <slot name="option" :option="option">
          {{ option.label || option.value }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";

// ------------------- Props 定义 -------------------
const props = defineProps({
  // 双向绑定值（选中的选项对象/值）
  modelValue: {
    type: [String, Number, Object],
    default: "",
  },
  // 选项列表（格式：[{ label, value }, ...] 或 简单数组 ['a', 'b']）
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 占位提示
  placeholder: {
    type: String,
    default: "请输入或选择",
  },
  // 无匹配结果提示
  noResultText: {
    type: String,
    default: "无匹配结果",
  },
  // 是否支持输入搜索（默认支持）
  searchable: {
    type: Boolean,
    default: true,
  },
  // 是否允许清空
  clearable: {
    type: Boolean,
    default: true,
  },
  // 新增：是否允许自定义输入（默认开启）
  allowCustomInput: {
    type: Boolean,
    default: true,
  },
  maxDropdownHeight: {
    type: Number,
    default: 200,
  },
  // 新增：是否开启「有值时自动高亮匹配项」（默认开启）
  autoHighlightMatch: {
    type: Boolean,
    default: true,
  },
});

// ------------------- 事件派发 -------------------
const emit = defineEmits(["update:modelValue", "change", "clearValue"]);

// ------------------- 内部状态 -------------------
const isOpen = ref(false); // 下拉框是否展开
const inputValue = ref(""); // 输入框值
const activeIndex = ref(-1); // 鼠标悬浮/键盘选中的选项索引
const originOptions = ref([]); // 原始选项（格式化后）
// 新增：引用元素（用于计算位置）
const selectInputRef = ref(null); // 输入框元素
const optionsContainerRef = ref(null); // 下拉框元素
const isDropUp = ref(false); // 是否向上展开（核心状态）
// ------------------- 生命周期 -------------------
onMounted(() => {
  // 格式化选项（统一转为 { label, value } 结构）
  formatOptions();
  // 初始化输入框值（根据 modelValue）
  initInputValue();
  // 监听点击外部关闭下拉框
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleWindowResize); // 监听窗口大小变化
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
// 关键新增：监听下拉框展开状态，计算展开方向
watch(
  () => isOpen.value,
  (isOpenNow) => {
    if (isOpenNow) {
      nextTick(() => {
        calculateDropDirection(); // 下拉框打开后，计算方向
        highlightMatchingOption(); // 展开后自动高亮匹配项
      });
    }
  }
);
// ------------------- 监听 -------------------
// 监听 modelValue 变化（外部修改时同步）
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === "") {
      inputValue.value = "";
      activeIndex.value = -1;
      return;
    }
    // 找到对应的选项，同步输入框值
    const matchedOption = originOptions.value.find((opt) => opt.value === newVal || opt === newVal);
    if (matchedOption == undefined) {
      inputValue.value = newVal;
    } else {
      inputValue.value = matchedOption ? matchedOption.label || matchedOption.value : "";
    }
    if (isOpen.value && props.autoHighlightMatch) {
      nextTick(highlightMatchingOption);
    }
  },
  { immediate: true }
);
// 关键新增2：窗口大小变化时，重新计算方向
function handleWindowResize() {
  if (isOpen.value) {
    calculateDropDirection();
  }
}
// 关键新增1：计算下拉框展开方向
function calculateDropDirection() {
  const inputEl = selectInputRef.value;
  const optionsEl = optionsContainerRef.value;
  if (!inputEl || !optionsEl) return;

  // 获取输入框位置和尺寸
  const inputRect = inputEl.getBoundingClientRect();
  // 下拉框实际高度（取内容高度和最大高度的最小值）
  const optionsHeight = Math.min(optionsEl.scrollHeight, props.maxDropdownHeight);
  // 视口高度（浏览器可见区域高度）
  const viewportHeight = window.innerHeight;

  // 判断：输入框底部 + 下拉框高度 > 视口高度 → 向上展开
  const willOverflowBottom = inputRect.bottom + optionsHeight > viewportHeight;
  isDropUp.value = willOverflowBottom;
}
// ------------------- 计算属性 -------------------
// 过滤后的选项（根据输入框值搜索）
const filteredOptions = computed(() => {
  //if (!props.searchable || !inputValue.value.trim()) {
  return originOptions.value;
  //}
  // const searchVal = inputValue.value.toLowerCase();
  // return originOptions.value.filter(
  //   (opt) =>
  //     (opt.label && opt.label.toLowerCase().includes(searchVal)) ||
  //     (opt.value && String(opt.value).toLowerCase().includes(searchVal))
  // );
});

// ------------------- 方法 -------------------
/** 格式化选项：统一结构为 { label, value } */
function formatOptions() {
  originOptions.value = props.options.map((opt) => {
    if (typeof opt === "object" && opt.label !== undefined && opt.value !== undefined) {
      return opt; // 已是标准结构，直接返回
    } else {
      // 简单数组（如 ['a', 'b']）转为 { label: 原值, value: 原值 }
      return { label: String(opt), value: opt };
    }
  });
}

/** 初始化输入框值 */
function initInputValue() {
  // 直接显示初值（支持自定义内容，如「武汉」「自定义内容」）
  if (!props.modelValue) return;
  const optinons = originOptions.value.filter(
    (opt) => opt.value === props.modelValue || opt === props.modelValue
  );
  // 若初值是自定义内容（不在选项中），直接同步 v-model（可选，确保外部能获取到）
  if (props.allowCustomInput && optinons.length == 0) {
    emit("change", {
      label: props.modelValue,
      value: 0,
      isCustom: !originOptions.value.some((opt) => opt.value === props.modelValue),
    });
    inputValue.value = props.modelValue;
  }
  if (props.allowCustomInput && optinons.length == 1) {
    emit("change", {
      label: optinons[0].label,
      value: optinons[0].value,
      isCustom: !originOptions.value.some((opt) => opt.value === props.modelValue),
    });
    inputValue.value = optinons[0].label;
  }
}

/** 切换下拉框展开/收起 */
function toggleOpen() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    activeIndex.value = -1; // 重置选中索引
  }
}

/** 关闭下拉框 */
function close() {
  isOpen.value = false;
}
/** 输入框输入事件（搜索过滤） */
function handleInput() {
  if (props.searchable) {
    activeIndex.value = -1;
  }
  // 允许自定义输入时，实时同步输入值（可选：也可失焦后同步）
  if (props.allowCustomInput) {
    emit("input", inputValue.value); // 触发输入事件
  }
}
/** 输入框失焦（关闭下拉框） */
function handleBlur() {
  setTimeout(() => {
    close();
    const customValue = inputValue.value.trim();
    if (customValue != "") {
      // 允许自定义输入 + 输入框有值 + 未选中任何选项 → 同步输入值为 v-model
      if (props.allowCustomInput && inputValue.value.trim() && activeIndex.value === -1) {
        emit("update:modelValue", customValue);
        emit("change", { label: customValue, value: 0, isCustom: true }); // 标记为自定义选项
      } else {
        // emit("update:modelValue", customValue);
        emit("change", { label: customValue, value: props.modelValue, isCustom: false }); // 标记为自定义选项
      }
    }
  }, 200);
}

/** 点击外部关闭下拉框 */
function handleClickOutside(e) {
  const selectEl = document.querySelector(".custom-select");
  if (selectEl && !selectEl.contains(e.target)) {
    close();
  }
}

/** 选中选项 */
function selectOption(option) {
  inputValue.value = option.label || option.value;
  emit("update:modelValue", option.value); // 同步 v-model
  emit("change", option); // 触发 change 事件（传递完整选项对象）
  close();
}

/** 清空选中值 */
function clearValue() {
  inputValue.value = "";
  activeIndex.value = -1;
  //emit("update:modelValue", "");
  emit("clearValue", "");
}

/** 回车选中当前高亮选项 */
function handleEnter() {
  if (activeIndex.value >= 0 && filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[activeIndex.value]);
  }
}

// 关键新增：自动高亮匹配的选项
function highlightMatchingOption() {
  inputValue.value = String(inputValue.value);
  if (!props.autoHighlightMatch || !String(inputValue.value).trim()) {
    activeIndex.value = -1; // 无值时不高亮
    return;
  }

  const searchVal = inputValue.value.toLowerCase();
  // 遍历过滤后的选项，查找匹配项
  const matchedIndex = filteredOptions.value.findIndex((opt) => {
    // 匹配规则：value 完全相等 或 label 模糊匹配（可根据需求调整）
    const valueMatch = String(opt.value).toLowerCase() === searchVal;
    const labelMatch = opt.label && opt.label.toLowerCase().includes(searchVal);
    return valueMatch || labelMatch;
  });

  // 更新高亮索引（-1 表示无匹配项）
  activeIndex.value = matchedIndex;
  // 可选：自动滚动到高亮项（避免高亮项在下拉框可视区域外）
  scrollToActiveOption();
}
// 可选新增：滚动到高亮项（优化体验）
function scrollToActiveOption() {
  const optionsEl = optionsContainerRef.value;
  const activeItem = optionsEl?.querySelector(".option-item.active");
  if (activeItem && optionsEl) {
    // 让高亮项滚动到下拉框可视区域中间（可选：顶部/底部）
    activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  /* max-width: 300px; */
  font-size: 14px;
}

.select-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  cursor: text;
  transition: border-color 0.2s;
}

.select-input:focus-within {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.input-inner {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: inherit;
  color: #606266;
  font-weight: 600;
}

.input-inner::placeholder {
  color: #9ca3af;
}

.clear-btn {
  display: flex;
  padding: 0;
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #ef4444;
}

.arrow {
  display: flex;
  margin-left: 8px;
  color: #9ca3af;
  transition: transform 0.2s;
}

.rotate {
  transform: rotate(180deg);
}

.options-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 2px;
  height: auto;
  max-height: 275px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 100;
}
/* 向上展开样式（新增核心） */
.custom-select.drop-up .options-container {
  top: auto; /* 取消顶部定位 */
  bottom: 100%; /* 底部对齐输入框顶部 */
  margin-top: 0;
  margin-bottom: 2px; /* 与输入框的间距 */
}

.option-item {
  padding: 8px 12px;
  color: #606266;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: lighter;
  font-size: 15px;
}

/* 高亮样式（已有） */
.option-item:hover,
.option-item.active {
  color: #3b82f6;
  background-color: #f5f7fa;
}
.no-result {
  padding: 8px 12px;
  color: #9ca3af;
  text-align: center;
}
</style>
