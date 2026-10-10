<template>
  <el-popover placement="top-start" :popper-class="note && note.length > 0 ? 'base-popup-popper-class' : 'no-show-popper-class'" trigger="hover" :content="note">
    <el-select
      slot="reference"
      v-model="_value"
      v-bind="config"
      :clearable="config.clearable === false ? false : true"
      :filterable="config.filterable === false ? false : true"
      :placeholder="`${config.placeholder || '请选择'}`"
    >
      <el-option v-for="item in _options" :key="item.value" :label="item.label" :value="item.value">
        <el-popover
          placement="right"
          :popper-class="item.note && item.note.length > 0 ? 'base-popup-popper-class' : 'no-show-popper-class'"
          trigger="hover"
          :content="item.note"
        >
          <span slot="reference">{{ item.label }}</span>
        </el-popover>
      </el-option>
      <slot></slot>
    </el-select>
  </el-popover>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: '',
    config: {
      selectOptions: '',
    },
    note: '',
  },
  computed: {
    _options() {
      const options = this.config ? this.config.selectOptions : [];
      if (typeof options === 'string') {
        const array = options.split(',').map((item) => {
          return {
            value: item,
            label: item,
            note: '',
          };
        });
        return array;
      } else {
        if (options === undefined) return options;
        options.forEach((item) => {
          item.note = item.note === undefined ? '' : item.note;
        });
      }
      return options;
    },
    _value: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('change', val);
      },
    },
  },
};
</script>
<style scoped>
.base-popup-popper-class {
  width: auto !important;
  max-width: 120px;
  padding: 10px;
  z-index: 3000 !important;
}
.no-show-popper-class {
  display: none;
}
</style>
