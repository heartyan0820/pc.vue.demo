<template>
  <div class="item-card normal">
    <div class="content" style="white-space: pre-wrap;"   >
      <div  v-html="setVal(item.showMessage)" ></div>
    </div>
  </div>
</template>

<script setup>import { defineProps } from "vue";
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
    // 空对象作为默认值
  }
});
const setVal = (val) => {
  return val.replace(/\\r\\n/g, "<br/>");
};
</script>

<style lang="scss" scoped>
//删除线，删除线颜色为灰色，字体大小为12px，
.del-line {
  text-decoration: line-through;
  color: #333;
}



span {
  font-size: 12px;
  color: #333F48;
}

.item-card {
  position: relative;
  width: 260px;

  .content {
    padding-bottom: 5px;

    .list-box {
      margin-top: 2px;

      .box-item {
        min-width: 50%;
      }

      .title {
        // color: #888;
      }
    }
  }

  .btn-box {
    border-top: solid 1px #eee;
    padding: 10rpx 20px;
    flex-wrap: wrap;

    .com-btn {
      height: 45px;
      line-height: 45rpx !important;
    }
  }
}

.tooth-box {
  width: 130px;
  flex-wrap: wrap;
  max-height: 60px;
}

.tooth-item {
  width: 45%;
  height: 25px;
  padding: 2px;
  font-size: 12px;
}

.tooth-lt {
  border-bottom: 1px solid rgba(168, 19, 19, 0.589);
  border-right: 1px solid rgba(168, 19, 19, 0.589);
  display: flex;
  justify-content: right;
  align-items: end;
}

.tooth-rt {
  border-bottom: 1px solid rgba(168, 19, 19, 0.589);
  border-left: 1px solid rgba(168, 19, 19, 0.589);
  display: flex;
  align-items: end;
}

.tooth-lb {
  border-top: 1px solid rgba(168, 19, 19, 0.589);
  border-right: 1px solid rgba(168, 19, 19, 0.589);
  display: flex;
  justify-content: right;
}

.tooth-rb {
  border-top: 1px solid rgba(168, 19, 19, 0.589);
  border-left: 1px solid rgba(168, 19, 19, 0.589);
}



.list-project-container {
  box-sizing: border-box;
  padding: 10px 0;
  border-radius: 10px;
  position: relative;

  .item-index {
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    // background: #f00;
    // color: #fff;
    font-size: 12px;
  }
}


/* 弹性模型布局 */
.d-dc {
  display: flex;
  flex-direction: column;
}

.d-dr {
  display: flex;
  flex-direction: row;
}

.d-jc {
  display: flex;
  justify-content: center;
}

.d-jl {
  display: flex;
  justify-content: flex-start;
}

.d-jr {
  display: flex;
  justify-content: flex-end;
}

.d-js {
  display: flex;
  justify-content: space-between;
}

.d-ac {
  display: flex;
  align-items: center;
}

.d-as {
  display: flex;
  align-items: flex-start;
}

.d-ae {
  display: flex;
  align-items: flex-end;
}

.d-aa {
  display: flex;
  align-items: stretch;
}
</style>