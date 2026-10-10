<template>
  <div class="item-card normal">
    <div class="content">

      <div class="list-box d-ac d-js">
        <div class="box-item" v-if="item.OrderNo">
          <span class="title">订单编号：</span><span>{{ item.OrderNo }}</span>
        </div>
        <div class="box-item" v-if="item.Urgent">
          <span class="title">加急件：</span><span>{{ item.Urgent ? '是' : '否' }}</span>
        </div>
      </div>

      <div class="list-box d-ac d-js">
        <div class="box-item">
          <span class="title">患者：</span><span>{{ item.PatientName }}</span>
        </div>
        <div :class="(item.DoctorId ? 'box-item' : 'del-line box-item')">
          <span class="title">医生：</span><span>{{ item.DoctorName }}</span>
        </div>
      </div>

      <div class="list-box d-ac d-js">
        <div class="box-item">
          <span class="title">颜色：</span><span>{{ item.Color }}</span>
        </div>
        <div class="box-item">
          <span class="title">模型种类：</span><span>{{ item.MxTypeName }}</span>
        </div>
      </div>

      <div :class="'list-box ' + (item.CustomerId ? '' : 'del-line')">
        <span class="title">医疗机构：</span><span>{{ item.CustomerName }}</span>
      </div>

      <div :class="'list-box ' + (item.FactoryId ? '' : 'del-line')">
        <span class="title">加工厂：</span><span>{{ item.FactoryName }}</span>
      </div>

      <div class="list-box d-ac d-js" v-if="item.State">
        <div class="box-item">
          <span class="title">状态提示：</span><span>{{ item.State.TipMessage }}</span>
        </div>
        <div class="box-item">
          <span class="title">状态操作员：</span><span>{{ item.State.UserId }}</span>
        </div>
      </div>

      <div class="list-box d-ac d-js" v-if="item.PauseState">
        <div class="box-item">
          <span class="title">是否暂停：</span><span>{{ item.PauseState.IsPaused }} <span v-if="item.PauseState.PauseTip">({{
            item.PauseState.PauseTip }})</span> </span>
        </div>
        <div class="box-item">
          <span class="title">暂停提示：</span><span>{{ item.PauseState.PauseTip }}</span>
        </div>
      </div>

      <div class="list-box d-ac d-js" v-if="item.ProdRange>10">
        <div class="">
          <span class="title">订单种类：</span><span>{{ item.ProdRangeName }}</span>
        </div>
      </div>


      <div class="list-box d-ac d-js" v-if="item.DoctorRequire">
        <div class="">
          <span class="title">特殊要求：</span><span>{{ item.DoctorRequire }}</span>
        </div>
      </div>

      <div class="list-box d-ac d-js" v-if="item.Memo1">
        <div class="">
          <span class="title">备注1：</span><span>{{ item.Memo1 }}</span>
        </div>
      </div>

      <div class="" v-for="(make, index) in item.Makes">

        <div class="list-box" v-if="make.PreReleaseDate && !make.PreReleaseDate.includes('0001-01-01')">
          <span class="title">预出日期：</span><span>{{ make.PreReleaseDate }}</span>
        </div>

        <div class="list-box" v-if="make.FactReleaseDate && !make.FactReleaseDate.includes('0001-01-01')">
          <span class="title">实出日期：</span><span>{{ make.FactReleaseDate }}</span>
        </div>

        <div class="list-box">
          <div>
            <div class="list-project-container d-jl d-ac" v-for="(project, index) in make.Details" :key="index">
              <!-- <div class="item-index d-ac d-jc">
                {{ project.Id }}
              </div> -->
              <div class="tooth-box d-jl">
                <div class="tooth-item  tooth-lt">
                  {{ project.Teeth1A }}
                </div>
                <div class="tooth-item tooth-rt">
                  {{ project.Teeth1B }}
                </div>
                <div class="tooth-item tooth-lb">
                  {{ project.Teeth1C }}
                </div>
                <div class="tooth-item tooth-rb">
                  {{ project.Teeth1D }}
                </div>
              </div>

              <div class="project-box" style="flex: 1;">
                <div class="">
                  <span :class="'title ' + (item.PitemId!=0 ? '' : 'del-line')" style="color: #333;font-size: 12px;">{{
                    project.PitemName }}
                    <span v-if="project.ProdTypeTypeValue > 10 || project.TestId !=0||project.PtypeName||project.RemakeCauseName">
                      (
                      <span v-if="project.PtypeName">型号：{{ project.PtypeName }},</span> 
                      <span  v-if="project.RemakeCauseName">{{ project.RemakeCauseName }},</span>
                      <span  v-if="project.ProdTypeTypeValue > 10">{{ project.ProdTypeName }},</span>
                      <span  v-if="project.TestId !=0">{{ project.TestDesc }}</span>
                      )
                    </span>
                  </span>
                </div>
                
                <div class="">
                  <span class="title" style="font-size: 12px;">数量:{{
                    project.Amount }}</span>
                </div>

                <div class="" v-if="project.Memo3">
                  <span class="title" style="color: #333;font-size: 12px;">({{ project.Memo3 }})</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="list-box" v-if="make.Attaches.length">
          <div>
            <span class="title">随单附件：</span>
            <div class="list-project-container d-jl " v-for="(file, index) in make.Attaches" :key="index">
              <div class="project-box">
                <span class="title" style="color: #333;font-size: 12px;">{{ file.id }}</span>
                <span class="title" style="color: #333;font-size: 12px;">{{ file.fileName }}</span>
                <span class="title" style="font-size: 12px;"> 数量：--</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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